import { getSiteSettings } from "@/lib/settings";
import { PageHeader } from "../../_components/page-header";
import { saveSettings } from "./actions";
import { Save } from "lucide-react";

const FIELDS: Array<{ key: keyof Awaited<ReturnType<typeof getSiteSettings>>; label: string; type?: "textarea"; placeholder?: string; hint?: string }> = [
  { key: "siteName", label: "Site name" },
  { key: "siteTagline", label: "Tagline (footer, italic)" },
  { key: "phone", label: "Phone (display)", placeholder: "+44 73 9500 9701" },
  { key: "whatsapp", label: "WhatsApp (digits only)", placeholder: "447395009701" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "addressShort", label: "Service area (short)" },
  { key: "instagram", label: "Instagram handle" },
  { key: "googleMapsUrl", label: "Google business URL" },
  { key: "heroEyebrow", label: "Home hero — eyebrow" },
  { key: "heroHeadline", label: "Home hero — headline" },
  { key: "heroSubhead", label: "Home hero — subhead", type: "textarea" },
];

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHeader
        title="Site settings"
        description="Things shown across the public site — copy in the hero, contact details, opening hours."
      />
      <div className="p-6 lg:p-10">
        <form action={saveSettings} className="grid lg:grid-cols-2 gap-6">
          {FIELDS.map((f) => (
            <div key={String(f.key)} className={f.type === "textarea" ? "lg:col-span-2" : ""}>
              <label className="admin-label">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea name={String(f.key)} defaultValue={settings[f.key] ?? ""} className="admin-textarea" placeholder={f.placeholder} />
              ) : (
                <input name={String(f.key)} defaultValue={settings[f.key] ?? ""} className="admin-input" placeholder={f.placeholder} />
              )}
              {f.hint && <p className="mt-1 text-[10px] text-ink-4">{f.hint}</p>}
            </div>
          ))}
          <div className="lg:col-span-2">
            <button type="submit" className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-teal text-bg font-semibold text-sm hover:bg-teal-2">
              <Save className="h-4 w-4" /> Save settings
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
