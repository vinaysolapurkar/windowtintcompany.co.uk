"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const LeadSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().optional(),
  postcode: z.string().optional(),
  projectTypes: z.array(z.string()).default([]),
  comment: z.string().optional(),
  referenceUrl: z.string().optional(),
});

export type LeadInput = z.infer<typeof LeadSchema>;

export type LeadResult = {
  ok: boolean;
  errors?: Record<string, string>;
  message?: string;
};

export async function submitLead(input: unknown): Promise<LeadResult> {
  const parsed = LeadSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[String(issue.path[0] ?? "form")] = issue.message;
    }
    return { ok: false, errors };
  }

  const data = parsed.data;

  await db.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      postcode: data.postcode || null,
      projectTypes: data.projectTypes.join(","),
      comment: data.comment || null,
      referenceUrl: data.referenceUrl || null,
      source: "contact-form",
      status: "new",
    },
  });

  return { ok: true, message: "Thank you — we'll be in touch within a working day." };
}
