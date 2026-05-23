"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function guard() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorised");
  return s;
}

export async function updateLeadStatus(formData: FormData) {
  await guard();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  await db.lead.update({ where: { id }, data: { status } });
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function updateLeadNotes(formData: FormData) {
  await guard();
  const id = String(formData.get("id"));
  const notes = String(formData.get("notes") || "");
  await db.lead.update({ where: { id }, data: { notes } });
  revalidatePath(`/admin/leads/${id}`);
}

export async function deleteLead(formData: FormData) {
  await guard();
  const id = String(formData.get("id"));
  await db.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirect("/admin/leads");
}
