"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitLead } from "./actions";

const SERVICES = [
  "Privacy film",
  "Solar control",
  "Heat reduction",
  "UV protection",
  "Anti-glare",
  "Frosted",
  "One-way mirror",
  "Energy-saving",
];

const PROPERTIES = [
  "Residential",
  "Commercial — Office",
  "Hotel / Lodge",
  "Conservatory / Garden room",
  "Static caravan / Park home",
  "School / Nursery",
];

export function EditorialContactForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    message: "",
    property: PROPERTIES[0],
    services: [] as string[],
  });
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  const toggleService = (s: string) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter your name and a valid email.");
      return;
    }
    startTransition(async () => {
      const res = await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        postcode: form.postcode,
        projectTypes: [form.property, ...form.services],
        comment: form.message,
      });
      if (!res.ok) {
        toast.error("Please check the form and try again.");
        return;
      }
      setSent(true);
      toast.success("Brief received. We'll be in touch.");
      router.refresh();
    });
  };

  if (sent) {
    return (
      <div className="reveal is-in" style={{ borderTop: "1px solid var(--rule)", paddingTop: 40 }}>
        <p className="t-caption" style={{ color: "var(--bronze)" }}>— Sent</p>
        <h3 className="t-h2" style={{ marginTop: 16 }}>
          Thank you, <em>{form.name || "friend"}</em>.
        </h3>
        <p className="t-lede" style={{ marginTop: 24 }}>
          We&rsquo;ve received your brief. We&rsquo;ll be in touch within one working day — usually sooner.
        </p>
      </div>
    );
  }

  return (
    <form className="form reveal" onSubmit={submit}>
      <div className="form__row">
        <label className="form__label">Name</label>
        <input className="form__input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" autoComplete="name" />
      </div>
      <div className="form__row">
        <label className="form__label">Email</label>
        <input className="form__input" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" autoComplete="email" />
      </div>
      <div className="form__row">
        <label className="form__label">Phone</label>
        <input className="form__input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07…" autoComplete="tel" />
      </div>
      <div className="form__row">
        <label className="form__label">Postcode</label>
        <input className="form__input" value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value.toUpperCase() })} placeholder="EH1 …" autoComplete="postal-code" />
      </div>
      <div className="form__row form__row--full">
        <label className="form__label">Property type</label>
        <select className="form__select" value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })}>
          {PROPERTIES.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="form__row form__row--full">
        <label className="form__label">Services of interest</label>
        <div className="form__chips">
          {SERVICES.map((s) => (
            <button
              type="button"
              key={s}
              className={`chip ${form.services.includes(s) ? "chip--active" : ""}`}
              onClick={() => toggleService(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="form__row form__row--full">
        <label className="form__label">Project details</label>
        <textarea className="form__textarea" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Number of windows, orientation, any deadlines…" />
      </div>
      <div className="form__row form__row--full">
        <button type="submit" disabled={pending} className="btn">
          {pending ? "Sending…" : "Send brief"} <span className="arr" />
        </button>
      </div>
    </form>
  );
}
