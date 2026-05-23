import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const Schema = z.object({
  filmSlug: z.string().min(1),
  windows: z
    .array(
      z.object({
        widthCm: z.coerce.number().min(10).max(2000),
        heightCm: z.coerce.number().min(10).max(2000),
        count: z.coerce.number().min(1).max(200).default(1),
      }),
    )
    .min(1)
    .max(20),
  postcode: z.string().optional(),
  notes: z.string().max(800).optional(),
});

// Scotland-standard fully-installed rates in £ per m² (materials + 2-person labour + warranty).
// Labour reference: skilled trades in Scotland ~£35–£45/hr; films vary by spec.
// These are deliberately conservative ranges — every firm quote follows an on-site survey.
const RATE_BY_SLUG: Record<string, { low: number; high: number; lowFloor: number }> = {
  "solar-control-film": { low: 45, high: 85, lowFloor: 220 },
  "privacy-film": { low: 30, high: 60, lowFloor: 180 },
  "decorative-film": { low: 50, high: 100, lowFloor: 240 },
  "safety-security-film": { low: 80, high: 130, lowFloor: 300 },
  "anti-glare-film": { low: 45, high: 80, lowFloor: 220 },
  "frosted-manifestation": { low: 30, high: 60, lowFloor: 180 },
};

function gbp(n: number) {
  return `£${Math.round(n).toLocaleString("en-GB")}`;
}

export async function POST(req: NextRequest) {
  let input: unknown;
  try {
    input = await req.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { filmSlug, windows, postcode, notes } = parsed.data;

  const service = await db.service.findUnique({ where: { slug: filmSlug } });
  if (!service) {
    return Response.json({ error: "Unknown film type" }, { status: 404 });
  }

  const totalAreaM2 = windows.reduce(
    (sum, w) => sum + (w.widthCm * w.heightCm * w.count) / 10_000,
    0,
  );
  const totalWindows = windows.reduce((sum, w) => sum + w.count, 0);

  const rate = RATE_BY_SLUG[filmSlug] ?? { low: 50, high: 90, lowFloor: 220 };
  const lowEstimate = Math.max(rate.lowFloor, totalAreaM2 * rate.low);
  const highEstimate = Math.max(rate.lowFloor * 1.4, totalAreaM2 * rate.high);

  // Apply minimum job premium if very small area
  const showMinNote = totalAreaM2 < 3;

  // Compose summary string for the AI to enrich
  const summary = {
    film: service.name,
    filmSlug,
    tagline: service.tagline,
    totalAreaM2: Number(totalAreaM2.toFixed(2)),
    totalWindows,
    breakdown: windows.map((w) => ({
      m2: Number(((w.widthCm * w.heightCm) / 10_000).toFixed(2)),
      count: w.count,
      widthCm: w.widthCm,
      heightCm: w.heightCm,
    })),
    estimateRange: { low: lowEstimate, high: highEstimate, lowGBP: gbp(lowEstimate), highGBP: gbp(highEstimate) },
    postcode: postcode || null,
    notes: notes || null,
    showMinJobNote: showMinNote,
  };

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    // Fallback: deterministic text response
    return Response.json({
      summary,
      message: buildFallbackMessage(summary),
      ai: false,
    });
  }

  // Call DeepSeek for a warm, personalised explanation.
  const systemPrompt = `You are Clara, the Window Tint Company® digital concierge in Dunfermline, Scotland.
You produce a warm, concise quote estimate for a window film job in British English.
Rules:
- Always confirm the film type the customer chose.
- State the total glass area and the estimate range using exactly the numbers you are given.
- Always say the estimate is a ballpark and depends on glass type, access, aspect, and complexity — and that a free on-site survey is needed for a firm quote.
- If postcode is given, acknowledge we cover it ("We're based in Dunfermline and cover all of Scotland.").
- Offer to book a survey via /contact, phone +44 73 9500 9701, or WhatsApp.
- If the area is small, note we have a small-job minimum of around £220–£320 because the team travels.
- Format with short paragraphs. No markdown headings. 90–160 words.`;

  const userPrompt = `Customer enquiry:
- Film: ${summary.film} — ${summary.tagline}
- Windows: ${summary.totalWindows} (${summary.breakdown
    .map((b) => `${b.count}× ${b.widthCm}×${b.heightCm}cm`)
    .join(", ")})
- Total area: ${summary.totalAreaM2} m²
- Estimate range: ${summary.estimateRange.lowGBP} – ${summary.estimateRange.highGBP}
- Postcode: ${summary.postcode ?? "(not provided)"}
- Notes from customer: ${summary.notes ?? "(none)"}
${summary.showMinJobNote ? "- NOTE: total area under 3m², mention small-job minimum." : ""}

Write the estimate response now.`;

  const upstream = await fetch(
    `${process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com"}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        temperature: 0.55,
        max_tokens: 500,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    },
  );

  if (!upstream.ok) {
    return Response.json({
      summary,
      message: buildFallbackMessage(summary),
      ai: false,
    });
  }

  const json = await upstream.json().catch(() => null);
  const message: string =
    json?.choices?.[0]?.message?.content ?? buildFallbackMessage(summary);

  return Response.json({ summary, message, ai: true });
}

function buildFallbackMessage(s: {
  film: string;
  totalAreaM2: number;
  totalWindows: number;
  estimateRange: { lowGBP: string; highGBP: string };
  postcode: string | null;
  showMinJobNote: boolean;
}): string {
  const parts = [
    `For ${s.totalWindows} window${s.totalWindows === 1 ? "" : "s"} in ${s.film.toLowerCase()} — roughly ${s.totalAreaM2} m² total — we'd expect a ballpark of ${s.estimateRange.lowGBP} – ${s.estimateRange.highGBP}, fully installed including labour and warranty.`,
    `This is an estimate only. The firm price depends on your glass type, access, aspect, and any pattern complexity — which is why we always survey on site first (free, 45 minutes, no obligation).`,
  ];
  if (s.showMinJobNote) {
    parts.push(
      `Heads up: for a job under ~3m² there's a small-job minimum (around £220–£320) because the team travels.`,
    );
  }
  parts.push(
    `${s.postcode ? `We cover ${s.postcode}.` : ""} We're based in Dunfermline and travel across Scotland. Ready when you are — book a survey at /contact, call +44 73 9500 9701, or WhatsApp.`,
  );
  return parts.join("\n\n");
}
