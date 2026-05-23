import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function buildSystemPrompt(): Promise<string> {
  const [services, projects] = await Promise.all([
    db.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { name: true, slug: true, tagline: true, shortDesc: true, vlt: true, uvBlock: true, heatReject: true },
    }),
    db.showcaseProject.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      take: 6,
      select: { title: true, slug: true, location: true, category: true, summary: true, filmUsed: true },
    }),
  ]);

  return `You are Clara, the digital concierge for Window Tint Company® — a specialist window film studio based at 48 Craigston Park, Dunfermline KY12 0XZ, Scotland.

About the business:
- Founded 2008. Family-run, turn-key (no sub-contractors — same hands install every job).
- Service area: across the whole of Scotland from a Dunfermline base — Edinburgh, Glasgow, Fife, Stirling, Perth, Dundee, Aberdeen, the Borders and beyond.
- Values: quality of finish, customer satisfaction, integrity, and trust. Competitively priced — quote on merit, leave on merit.
- Phone +44 73 9500 9701 · hello@windowtintcompany.co.uk · WhatsApp +44 7395 009701.
- Every job begins with a free 45-minute on-site survey — we measure glass, irradiance and aspect before specifying anything.
- Lifetime warranty on residential films; manufacturer-backed warranties on commercial.

Services we install:
${services
  .map(
    (s) =>
      `- ${s.name} (/services/${s.slug}) — ${s.tagline}. ${s.shortDesc}${
        s.vlt ? ` VLT ${s.vlt}.` : ""
      }${s.heatReject ? ` Heat reject ${s.heatReject}.` : ""}${
        s.uvBlock ? ` UV ${s.uvBlock}.` : ""
      }`,
  )
  .join("\n")}

Recent showcase work:
${projects
  .map((p) => `- ${p.title} (${p.location || "Scotland"}, ${p.category}). ${p.summary}`)
  .join("\n")}

How to talk:
- Be warm, concise, and useful. Use British English. Keep replies under ~150 words unless asked for detail.
- When recommending a film, ALWAYS recommend booking a survey at /contact — we never quote without seeing the glass.
- If a question is outside window film (or you don't know), say so honestly and offer the phone/WhatsApp.
- Never invent specs, prices, or warranties not listed above. If asked for pricing, explain that every quote is tied to an on-site survey because films vary by glass type, aspect, and irradiance.
- Format with short paragraphs. Use bullet lists for options/tradeoffs. No markdown headings.
- If the user mentions a city or postcode in Scotland, acknowledge it and note that we cover it.`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "Chat is not configured yet. Please WhatsApp us on +44 7395 009701 or email hello@windowtintcompany.co.uk and we'll reply within a working day.",
      }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m) =>
      ["system", "user", "assistant"].includes(m.role) &&
      typeof m.content === "string" &&
      m.content.length < 2000,
  );
  if (messages.length === 0) {
    return new Response("No messages", { status: 400 });
  }

  // Cap conversation history to last 12 messages
  const recent = messages.slice(-12);

  const systemPrompt = await buildSystemPrompt();
  const payload = {
    model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
    stream: true,
    temperature: 0.6,
    max_tokens: 800,
    messages: [{ role: "system" as const, content: systemPrompt }, ...recent],
  };

  const upstream = await fetch(
    `${process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com"}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return new Response(
      JSON.stringify({
        error: "Upstream error from chat provider.",
        detail: text.slice(0, 500),
      }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }

  // Re-emit only the text deltas so the client can render simply.
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let lineEnd: number;
          while ((lineEnd = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, lineEnd).trim();
            buffer = buffer.slice(lineEnd + 1);
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta = json?.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // ignore parse errors
            }
          }
        }
      } catch (e) {
        controller.error(e);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
