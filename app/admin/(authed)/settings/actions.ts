"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function saveSettings(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorised");

  const entries: Array<[string, string]> = [];
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    if (key === "_csrf") continue;
    entries.push([key, value]);
  }

  for (const [key, value] of entries) {
    await db.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}
