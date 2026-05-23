import { NextRequest } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"]);
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return new Response("Unauthorised", { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") || "");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return Response.json({ error: "Unsupported type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File too large (max 10MB)" }, { status: 413 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = file.type === "image/svg+xml"
    ? "svg"
    : file.type.split("/")[1].replace("jpeg", "jpg");
  const id = crypto.randomBytes(8).toString("hex");
  const filename = `${Date.now().toString(36)}-${id}.${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const filepath = path.join(dir, filename);

  let width: number | undefined;
  let height: number | undefined;

  if (file.type === "image/svg+xml") {
    await writeFile(filepath, buf);
  } else {
    // Use sharp to read metadata and write optimised file
    const img = sharp(buf, { failOn: "none" });
    const meta = await img.metadata();
    width = meta.width;
    height = meta.height;
    await writeFile(filepath, buf);
  }

  const url = `/uploads/${filename}`;

  const asset = await db.mediaAsset.create({
    data: {
      url,
      filename,
      mimeType: file.type,
      size: file.size,
      width,
      height,
      alt: alt || null,
    },
  });

  return Response.json({ ok: true, asset });
}
