"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function guard() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorised");
}

const Schema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().min(2),
  client: z.string().optional(),
  location: z.string().optional(),
  category: z.string().min(1),
  summary: z.string().min(2),
  body: z.string().min(2),
  heroImage: z.string().min(1),
  gallery: z.string().optional().default(""),
  filmUsed: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

export async function saveShowcase(formData: FormData) {
  await guard();
  const data = Schema.parse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug") || undefined,
    title: formData.get("title"),
    client: formData.get("client") || undefined,
    location: formData.get("location") || undefined,
    category: formData.get("category"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    heroImage: formData.get("heroImage"),
    gallery: formData.get("gallery") || "",
    filmUsed: formData.get("filmUsed") || undefined,
    featured: formData.get("featured") === "on",
    order: formData.get("order") || 0,
  });
  const slug = (data.slug || slugify(data.title, { lower: true, strict: true })).toLowerCase();

  if (data.id) {
    await db.showcaseProject.update({
      where: { id: data.id },
      data: {
        slug,
        title: data.title,
        client: data.client || null,
        location: data.location || null,
        category: data.category,
        summary: data.summary,
        body: data.body,
        heroImage: data.heroImage,
        gallery: data.gallery || "",
        filmUsed: data.filmUsed || null,
        featured: data.featured,
        order: data.order,
      },
    });
  } else {
    await db.showcaseProject.create({
      data: {
        slug,
        title: data.title,
        client: data.client || null,
        location: data.location || null,
        category: data.category,
        summary: data.summary,
        body: data.body,
        heroImage: data.heroImage,
        gallery: data.gallery || "",
        filmUsed: data.filmUsed || null,
        featured: data.featured,
        order: data.order,
      },
    });
  }
  revalidatePath("/showcase");
  revalidatePath(`/showcase/${slug}`);
  revalidatePath("/admin/showcase");
  redirect("/admin/showcase");
}

export async function deleteShowcase(formData: FormData) {
  await guard();
  const id = String(formData.get("id"));
  await db.showcaseProject.delete({ where: { id } });
  revalidatePath("/showcase");
  revalidatePath("/admin/showcase");
  redirect("/admin/showcase");
}
