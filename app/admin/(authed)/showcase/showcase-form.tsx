"use client";
import { useState } from "react";
import slugify from "slugify";
import { Save, Trash2 } from "lucide-react";
import { RichEditor } from "../../_components/rich-editor";
import { saveShowcase, deleteShowcase } from "./actions";

type Project = {
  id?: string;
  slug?: string;
  title?: string;
  client?: string | null;
  location?: string | null;
  category?: string;
  summary?: string;
  body?: string;
  heroImage?: string;
  gallery?: string;
  filmUsed?: string | null;
  featured?: boolean;
  order?: number;
};

const CATEGORIES = ["Residential", "Commercial", "Listed building", "Hospitality"];

export function ShowcaseForm({ project }: { project?: Project }) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [client, setClient] = useState(project?.client ?? "");
  const [location, setLocation] = useState(project?.location ?? "");
  const [category, setCategory] = useState(project?.category ?? "Residential");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [body, setBody] = useState(project?.body ?? "<p></p>");
  const [heroImage, setHeroImage] = useState(project?.heroImage ?? "");
  const [gallery, setGallery] = useState(project?.gallery ?? "");
  const [filmUsed, setFilmUsed] = useState(project?.filmUsed ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [order, setOrder] = useState(project?.order ?? 0);

  return (
    <form action={saveShowcase} className="grid lg:grid-cols-3 gap-6">
      {project?.id && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="body" value={body} />

      <div className="lg:col-span-2 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Title">
            <input name="title" value={title} onChange={(e) => { setTitle(e.target.value); if (!project?.id) setSlug(slugify(e.target.value, { lower: true, strict: true })); }} className="admin-input" required />
          </Field>
          <Field label="URL slug">
            <input name="slug" value={slug} onChange={(e) => setSlug(slugify(e.target.value, { lower: true, strict: true }))} className="admin-input font-mono text-sm" />
          </Field>
          <Field label="Client">
            <input name="client" value={client} onChange={(e) => setClient(e.target.value)} className="admin-input" placeholder="Private — Heriot Row" />
          </Field>
          <Field label="Location">
            <input name="location" value={location} onChange={(e) => setLocation(e.target.value)} className="admin-input" placeholder="Edinburgh EH3" />
          </Field>
        </div>
        <Field label="Summary (1–2 sentences)">
          <textarea name="summary" value={summary} onChange={(e) => setSummary(e.target.value)} className="admin-textarea" required />
        </Field>
        <Field label="Body">
          <RichEditor value={body} onChange={setBody} placeholder="Tell the story…" />
        </Field>
      </div>

      <aside className="space-y-5">
        <div className="rounded-2xl border border-line-soft bg-bg p-5 space-y-4">
          <p className="eyebrow">Meta</p>
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm text-ink">Featured on home</span>
            <input type="checkbox" name="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-teal h-4 w-4" />
          </label>
          <div>
            <label className="admin-label">Category</label>
            <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="admin-select">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Sort order</label>
            <input type="number" name="order" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Film used</label>
            <input name="filmUsed" value={filmUsed} onChange={(e) => setFilmUsed(e.target.value)} className="admin-input" placeholder="3M Prestige 70" />
          </div>
        </div>
        <div className="rounded-2xl border border-line-soft bg-bg p-5 space-y-4">
          <p className="eyebrow">Hero image</p>
          <input name="heroImage" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} className="admin-input" placeholder="/uploads/your-image.jpg" required />
          {heroImage && (
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden border border-line-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-line-soft bg-bg p-5">
          <p className="eyebrow">Gallery (comma-separated URLs)</p>
          <textarea name="gallery" value={gallery} onChange={(e) => setGallery(e.target.value)} className="admin-textarea mt-3" placeholder="/uploads/1.jpg, /uploads/2.jpg" />
        </div>

        <button type="submit" className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-teal text-bg font-semibold text-sm hover:bg-teal-2">
          <Save className="h-4 w-4" /> Save project
        </button>

        {project?.id && (
          <form action={deleteShowcase}>
            <input type="hidden" name="id" value={project.id} />
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-danger/10 border border-danger/30 text-danger text-sm hover:bg-danger/20">
              <Trash2 className="h-4 w-4" /> Delete project
            </button>
          </form>
        )}
      </aside>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="admin-label">{label}</label>{children}</div>;
}
