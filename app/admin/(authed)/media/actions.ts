"use server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function deleteAsset(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorised");
  const id = String(formData.get("id"));
  const asset = await db.mediaAsset.findUnique({ where: { id } });
  if (!asset) return;
  await db.mediaAsset.delete({ where: { id } });
  try {
    const filepath = path.join(process.cwd(), "public", "uploads", asset.filename);
    await unlink(filepath);
  } catch {
    // ignore missing files
  }
  revalidatePath("/admin/media");
}
