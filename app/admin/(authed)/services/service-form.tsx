"use client";
import { useState } from "react";
import slugify from "slugify";
import { Save, Trash2, Plus, X } from "lucide-react";
import { RichEditor } from "../../_components/rich-editor";
import { saveService, deleteService } from "./actions";

type Feature = { title: string; description: string };
type Service = {
  id?: string;
  slug?: string;
  name?: string;
  tagline?: string;
  shortDesc?: string;
  description?: string;
  icon?: string;
  features?: string;
  vlt?: string | null;
  uvBlock?: string | null;
  heatReject?: string | null;
  order?: number;
  active?: boolean;
};

const ICONS = ["Sun", "EyeOff", "Sparkles", "ShieldCheck", "Eye", "PanelTop", "Layers", "Square", "Droplets", "Flame"];

export function ServiceForm({ service }: { service?: Service }) {
  const [name, setName] = useState(service?.name ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [tagline, setTagline] = useState(service?.tagline ?? "");
  const [shortDesc, setShortDesc] = useState(service?.shortDesc ?? "");
  const [description, setDescription] = useState(service?.description ?? "<p></p>");
  const [icon, setIcon] = useState(service?.icon ?? "Sun");
  const [vlt, setVlt] = useState(service?.vlt ?? "");
  const [uvBlock, setUvBlock] = useState(service?.uvBlock ?? "");
  const [heatReject, setHeatReject] = useState(service?.heatReject ?? "");
  const [order, setOrder] = useState(service?.order ?? 0);
  const [active, setActive] = useState(service?.active ?? true);

  const initialFeatures: Feature[] = (() => {
    try {
      return service?.features ? (JSON.parse(service.features) as Feature[]) : [];
    } catch {
      return [];
    }
  })();
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);

  return (
    <form action={saveService} className="grid lg:grid-cols-3 gap-6">
      {service?.id && <input type="hidden" name="id" value={service.id} />}
      <input type="hidden" name="description" value={description} />
      <input type="hidden" name="features" value={JSON.stringify(features)} />

      <div className="lg:col-span-2 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Name">
            <input name="name" value={name} onChange={(e) => { setName(e.target.value); if (!service?.id) setSlug(slugify(e.target.value, { lower: true, strict: true })); }} className="admin-input" required />
          </Field>
          <Field label="URL slug">
            <input name="slug" value={slug} onChange={(e) => setSlug(slugify(e.target.value, { lower: true, strict: true }))} className="admin-input font-mono text-sm" />
          </Field>
        </div>
        <Field label="Tagline (italic, in hero)">
          <input name="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} className="admin-input" required />
        </Field>
        <Field label="Short description (cards, 60–180 chars)">
          <textarea name="shortDesc" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="admin-textarea" required />
        </Field>
        <Field label="Full description (service page body)">
          <RichEditor value={description} onChange={setDescription} placeholder="Describe the film, where it works best, and how you specify it…" />
        </Field>

        <div className="rounded-2xl border border-line-soft bg-bg p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="eyebrow">Feature bullets</p>
            <button type="button" onClick={() => setFeatures([...features, { title: "", description: "" }])} className="inline-flex items-center gap-1.5 text-sm text-teal hover:underline">
              <Plus className="h-4 w-4" /> Add feature
            </button>
          </div>
          {features.length === 0 ? (
            <p className="text-sm text-ink-3">No features yet. Add 3–4 short bullet points highlighting what's included.</p>
          ) : (
            <ul className="space-y-3">
              {features.map((f, i) => (
                <li key={i} className="grid grid-cols-12 gap-3 items-start p-3 rounded-lg bg-bg-2">
                  <input
                    className="admin-input col-span-4"
                    placeholder="Feature title"
                    value={f.title}
                    onChange={(e) => setFeatures(fs => fs.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                  />
                  <input
                    className="admin-input col-span-7"
                    placeholder="Short description"
                    value={f.description}
                    onChange={(e) => setFeatures(fs => fs.map((x, j) => j === i ? { ...x, description: e.target.value } : x))}
                  />
                  <button type="button" onClick={() => setFeatures(fs => fs.filter((_, j) => j !== i))} className="col-span-1 grid h-10 w-10 place-items-center rounded-lg text-ink-3 hover:text-danger" aria-label="Remove">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-2xl border border-line-soft bg-bg p-5 space-y-4">
          <p className="eyebrow">Display</p>
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm text-ink">Active (show publicly)</span>
            <input type="checkbox" name="active" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-teal h-4 w-4" />
          </label>
          <div>
            <label className="admin-label">Sort order</label>
            <input type="number" name="order" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Icon (lucide)</label>
            <select name="icon" value={icon} onChange={(e) => setIcon(e.target.value)} className="admin-select">
              {ICONS.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <div className="rounded-2xl border border-line-soft bg-bg p-5 space-y-4">
          <p className="eyebrow">Spec strip</p>
          <div>
            <label className="admin-label">VLT</label>
            <input name="vlt" value={vlt} onChange={(e) => setVlt(e.target.value)} className="admin-input" placeholder="35–70%" />
          </div>
          <div>
            <label className="admin-label">UV block</label>
            <input name="uvBlock" value={uvBlock} onChange={(e) => setUvBlock(e.target.value)} className="admin-input" placeholder="99%" />
          </div>
          <div>
            <label className="admin-label">Heat reject</label>
            <input name="heatReject" value={heatReject} onChange={(e) => setHeatReject(e.target.value)} className="admin-input" placeholder="Up to 78%" />
          </div>
        </div>

        <button type="submit" className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-teal text-bg font-semibold text-sm hover:bg-teal-2">
          <Save className="h-4 w-4" /> Save service
        </button>

        {service?.id && (
          <form action={deleteService}>
            <input type="hidden" name="id" value={service.id} />
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-danger/10 border border-danger/30 text-danger text-sm hover:bg-danger/20">
              <Trash2 className="h-4 w-4" /> Delete service
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
