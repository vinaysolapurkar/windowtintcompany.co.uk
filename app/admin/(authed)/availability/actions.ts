"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function guard() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorised");
  return s;
}

export async function toggleBlockedDate(date: string) {
  await guard();
  const setting = await db.siteSetting.findUnique({ where: { key: "blockedDates" } });
  const current = new Set(
    (setting?.value || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  if (current.has(date)) current.delete(date);
  else current.add(date);
  const next = Array.from(current).sort().join(",");
  await db.siteSetting.upsert({
    where: { key: "blockedDates" },
    create: { key: "blockedDates", value: next },
    update: { value: next },
  });
  revalidatePath("/admin/availability");
  revalidatePath("/estimate");
  revalidatePath("/contact");
}
