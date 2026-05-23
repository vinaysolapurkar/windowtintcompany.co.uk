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
  name: z.string().min(2),
  tagline: z.string().min(2),
  shortDesc: z.string().min(2),
  description: z.string().min(2),
  icon: z.string().min(2),
  features: z.string().default("[]"),
  vlt: z.string().optional(),
  uvBlock: z.string().optional(),
  heatReject: z.string().optional(),
  order: z.coerce.number().default(0),
  active: z.boolean().default(true),
});

export async function saveService(formData: FormData) {
  await guard();
  const data = Schema.parse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug") || undefined,
    name: formData.get("name"),
    tagline: formData.get("tagline"),
    shortDesc: formData.get("shortDesc"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    features: formData.get("features") || "[]",
    vlt: formData.get("vlt") || undefined,
    uvBlock: formData.get("uvBlock") || undefined,
    heatReject: formData.get("heatReject") || undefined,
    order: formData.get("order") || 0,
    active: formData.get("active") === "on",
  });

  const slug = (data.slug || slugify(data.name, { lower: true, strict: true })).toLowerCase();

  if (data.id) {
    await db.service.update({
      where: { id: data.id },
      data: {
        slug,
        name: data.name,
        tagline: data.tagline,
        shortDesc: data.shortDesc,
        description: data.description,
        icon: data.icon,
        features: data.features,
        vlt: data.vlt || null,
        uvBlock: data.uvBlock || null,
        heatReject: data.heatReject || null,
        order: data.order,
        active: data.active,
      },
    });
  } else {
    await db.service.create({
      data: {
        slug,
        name: data.name,
        tagline: data.tagline,
        shortDesc: data.shortDesc,
        description: data.description,
        icon: data.icon,
        features: data.features,
        vlt: data.vlt || null,
        uvBlock: data.uvBlock || null,
        heatReject: data.heatReject || null,
        order: data.order,
        active: data.active,
      },
    });
  }
  revalidatePath("/services");
  revalidatePath(`/services/${slug}`);
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(formData: FormData) {
  await guard();
  const id = String(formData.get("id"));
  await db.service.delete({ where: { id } });
  revalidatePath("/services");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}
