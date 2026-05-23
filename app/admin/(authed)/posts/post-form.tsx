"use client";

import { useState } from "react";
import slugify from "slugify";
import { RichEditor } from "../../_components/rich-editor";
import { savePost, deletePost } from "./actions";
import { Save, Trash2 } from "lucide-react";

type Post = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string | null;
  category?: string;
  tags?: string;
  published?: boolean;
  featured?: boolean;
};

const CATEGORIES = ["Guide", "Case Study", "News", "Inspiration"];

export function PostForm({ post }: { post?: Post }) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "<p></p>");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [category, setCategory] = useState(post?.category ?? "Guide");
  const [tags, setTags] = useState(post?.tags ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [featured, setFeatured] = useState(post?.featured ?? false);

  return (
    <form action={savePost} className="grid lg:grid-cols-3 gap-6">
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="coverImage" value={coverImage} />

      <div className="lg:col-span-2 space-y-5">
        <Field label="Title">
          <input
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!post?.id) setSlug(slugify(e.target.value, { lower: true, strict: true }));
            }}
            placeholder="The Physics of a Cool Room…"
            className="admin-input text-xl font-display"
            required
          />
        </Field>
        <Field label="Excerpt (60–180 chars)">
          <textarea
            name="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="admin-textarea"
            maxLength={220}
            placeholder="One or two sentences that hook the reader."
            required
          />
        </Field>
        <Field label="Body">
          <RichEditor value={content} onChange={setContent} placeholder="Write the post…" />
        </Field>
      </div>

      <aside className="space-y-5">
        <div className="rounded-2xl border border-line-soft bg-bg p-5 space-y-4">
          <p className="eyebrow">Publishing</p>
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm text-ink">Published</span>
            <input type="checkbox" name="published" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-teal h-4 w-4" />
          </label>
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm text-ink">Featured</span>
            <input type="checkbox" name="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-teal h-4 w-4" />
          </label>
          <div>
            <label className="admin-label">Category</label>
            <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="admin-select">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Tags (comma-separated)</label>
            <input
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="admin-input"
              placeholder="solar,heat,physics"
            />
          </div>
          <div>
            <label className="admin-label">URL slug</label>
            <input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value, { lower: true, strict: true }))}
              className="admin-input font-mono text-sm"
              placeholder="auto-generated"
            />
            <p className="mt-2 text-[10px] text-ink-4">→ /blog/<span className="text-ink-2">{slug || "your-slug"}</span></p>
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-teal text-bg font-semibold text-sm hover:bg-teal-2">
            <Save className="h-4 w-4" /> Save post
          </button>
        </div>

        <div className="rounded-2xl border border-line-soft bg-bg p-5">
          <p className="eyebrow">Cover image</p>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="admin-input mt-4"
            placeholder="/uploads/your-image.jpg"
          />
          {coverImage && (
            <div className="mt-4 aspect-[4/3] relative rounded-lg overflow-hidden border border-line-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="Cover" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          )}
          <p className="mt-3 text-[10px] text-ink-4">
            Upload images via the{" "}
            <a href="/admin/media" className="text-teal">Media library</a>, then paste the URL here.
          </p>
        </div>

        {post?.id && (
          <form action={deletePost}>
            <input type="hidden" name="id" value={post.id} />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-danger/10 border border-danger/30 text-danger text-sm hover:bg-danger/20"
            >
              <Trash2 className="h-4 w-4" /> Delete post
            </button>
          </form>
        )}
      </aside>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {children}
    </div>
  );
}
