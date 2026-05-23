"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).optional().or(z.literal("")),
  postcode: z.string().optional(),
  filmSlug: z.string(),
  filmName: z.string(),
  slotIso: z.string().optional(),
  slotLabel: z.string().optional(),
  estimate: z.string().optional(),
  windows: z.array(z.object({
    widthCm: z.number(),
    heightCm: z.number(),
    count: z.number(),
  })),
});

export async function bookFromEstimate(input: unknown) {
  const parsed = Schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the form." };
  const d = parsed.data;
  const summary = `Estimate booking for ${d.filmName}.\nWindows: ${d.windows.map(w => `${w.count}× ${w.widthCm}×${w.heightCm}cm`).join(", ")}.\nPreferred survey slot: ${d.slotLabel ?? "(none chosen)"}.\nAI estimate:\n${d.estimate ?? "(none)"}`;
  await db.lead.create({
    data: {
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      postcode: d.postcode || null,
      projectTypes: d.filmName,
      comment: summary,
      source: d.slotIso ? `estimate · slot ${d.slotIso}` : "estimate",
      status: "new",
    },
  });
  return { ok: true };
}
