"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import readingTime from "reading-time";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function guard() {
  const s = await getSession();
  if (!s) throw new Error("Unauthorised");
  return s;
}

const PostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().optional(),
  excerpt: z.string().min(2),
  content: z.string().min(1),
  coverImage: z.string().optional(),
  category: z.string().min(1),
  tags: z.string().optional().default(""),
  published: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
});

export async function savePost(formData: FormData) {
  const session = await guard();
  const data = PostSchema.parse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage") || undefined,
    category: formData.get("category"),
    tags: formData.get("tags") || "",
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  });

  const slug = (data.slug && data.slug.length > 1
    ? data.slug
    : slugify(data.title, { lower: true, strict: true })
  ).toLowerCase();

  const mins = Math.max(1, Math.round(readingTime(data.content).minutes));

  const wasPublished = data.id
    ? !!(await db.post.findUnique({ where: { id: data.id }, select: { published: true } }))?.published
    : false;

  if (data.id) {
    await db.post.update({
      where: { id: data.id },
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || null,
        category: data.category,
        tags: data.tags || "",
        readingMins: mins,
        published: data.published,
        featured: data.featured,
        publishedAt:
          data.published && !wasPublished ? new Date() : undefined,
      },
    });
  } else {
    await db.post.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || null,
        category: data.category,
        tags: data.tags || "",
        readingMins: mins,
        published: data.published,
        featured: data.featured,
        publishedAt: data.published ? new Date() : null,
        authorId: session.sub,
      },
    });
  }

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
  redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
  await guard();
  const id = String(formData.get("id"));
  const post = await db.post.findUnique({ where: { id }, select: { slug: true } });
  await db.post.delete({ where: { id } });
  if (post) revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
