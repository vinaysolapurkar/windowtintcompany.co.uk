"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowRight, Calculator, Plus, Trash2, Check, CalendarClock, Loader2, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/cn";
import { bookFromEstimate } from "./actions";
import type { Slot } from "@/lib/availability";

type Service = { slug: string; name: string; tagline: string; icon: string };
type Window = { widthCm: number; heightCm: number; count: number };

const DEFAULT_WINDOW: Window = { widthCm: 120, heightCm: 90, count: 1 };

export function EstimateForm({
  services,
  slots,
}: {
  services: Service[];
  slots: Slot[];
}) {
  const [filmSlug, setFilmSlug] = useState(services[0]?.slug ?? "");
  const [windows, setWindows] = useState<Window[]>([{ ...DEFAULT_WINDOW }]);
  const [postcode, setPostcode] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<null | { message: string; summary: { totalAreaM2: number; totalWindows: number; estimateRange: { lowGBP: string; highGBP: string }; film: string } }>(null);
  const [chosenSlot, setChosenSlot] = useState<Slot | null>(null);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [bookPending, startBook] = useTransition();
  const [booked, setBooked] = useState(false);

  const selectedService = services.find((s) => s.slug === filmSlug);

  const totalAreaM2 = windows.reduce(
    (sum, w) => sum + ((w.widthCm * w.heightCm) / 10_000) * w.count,
    0,
  );

  const onEstimate = async () => {
    if (!filmSlug || windows.some((w) => w.widthCm < 10 || w.heightCm < 10)) {
      toast.error("Please enter a film type and window size.");
      return;
    }
    setLoading(true);
    setEstimate(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          filmSlug,
          windows,
          postcode: postcode || undefined,
          notes: notes || undefined,
        }),
      });
      const j = await res.json();
      if (!res.ok) {
        toast.error(j?.error ?? "Couldn't generate an estimate.");
        return;
      }
      setEstimate(j);
      setTimeout(() => {
        document.getElementById("estimate-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onBook = () => {
    if (!contact.name.trim() || !contact.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter your name and a valid email.");
      return;
    }
    startBook(async () => {
      const res = await bookFromEstimate({
        ...contact,
        postcode,
        filmSlug,
        filmName: selectedService?.name ?? filmSlug,
        slotIso: chosenSlot?.iso,
        slotLabel: chosenSlot?.longLabel,
        estimate: estimate?.message,
        windows,
      });
      if (!res.ok) {
        toast.error(res.error ?? "Couldn't book.");
        return;
      }
      setBooked(true);
      toast.success("Survey requested. We'll be in touch.");
    });
  };

  return (
    <div className="space-y-5">
      {/* Step 1 — pick film */}
      <div className="rounded-3xl border border-[color:var(--rule)] bg-paper p-5 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <Eyebrow n={1} />
            <h2 className="mt-2 font-display text-2xl text-fg">Pick a film</h2>
          </div>
          {selectedService && (
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.18em] text-bronze">{selectedService.tagline}</span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {services.map((s) => {
            const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>)[s.icon] ?? LucideIcons.Sparkles;
            const active = filmSlug === s.slug;
            return (
              <button
                type="button"
                key={s.slug}
                onClick={() => setFilmSlug(s.slug)}
                className={cn(
                  "group flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all",
                  active
                    ? "border-bronze bg-cream"
                    : "border-[color:var(--rule)] bg-bg-2 hover:border-[color:var(--rule)]",
                )}
              >
                <span className={cn(
                  "grid h-9 w-9 place-items-center rounded-lg transition-colors",
                  active ? "bg-bronze text-paper" : "bg-bg text-bronze",
                )}>
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span className={cn("text-xs sm:text-sm font-medium leading-tight", active ? "text-fg" : "text-fg-2")}>{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2 — measurements */}
      <div className="rounded-3xl border border-[color:var(--rule)] bg-paper p-5 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <Eyebrow n={2} />
            <h2 className="mt-2 font-display text-2xl text-fg">How big is the window?</h2>
          </div>
          <span className="text-xs font-mono uppercase tracking-[0.18em] text-muted">cm</span>
        </div>

        <div className="space-y-3">
          {windows.map((w, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <NumberField
                className="col-span-4"
                label="Width"
                value={w.widthCm}
                onChange={(v) => setWindows((ws) => ws.map((x, j) => (j === i ? { ...x, widthCm: v } : x)))}
              />
              <NumberField
                className="col-span-4"
                label="Height"
                value={w.heightCm}
                onChange={(v) => setWindows((ws) => ws.map((x, j) => (j === i ? { ...x, heightCm: v } : x)))}
              />
              <NumberField
                className="col-span-3"
                label="Count"
                value={w.count}
                onChange={(v) => setWindows((ws) => ws.map((x, j) => (j === i ? { ...x, count: Math.max(1, v) } : x)))}
              />
              <div className="col-span-1 flex justify-end">
                {windows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setWindows((ws) => ws.filter((_, j) => j !== i))}
                    aria-label="Remove"
                    className="grid h-10 w-10 place-items-center rounded-lg border border-[color:var(--rule)] text-muted hover:text-danger hover:border-danger/60"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setWindows((ws) => [...ws, { ...DEFAULT_WINDOW }])}
            className="inline-flex items-center gap-2 text-sm text-bronze hover:underline"
          >
            <Plus className="h-4 w-4" /> Add another window size
          </button>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-mono uppercase tracking-[0.18em] text-muted">Postcode (optional)</label>
            <input
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              placeholder="EH3 6PA"
              className="mt-2 input-field"
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-[0.18em] text-muted">Notes (optional)</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="South-facing, blinding sun by 2pm"
              className="mt-2 input-field"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 pt-6 border-t border-[color:var(--rule)]">
          <div className="text-sm text-muted">
            Total area:{" "}
            <span className="text-fg font-medium">
              {totalAreaM2.toFixed(2)} m²
            </span>
          </div>
          <button
            type="button"
            onClick={onEstimate}
            disabled={loading}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-bronze text-paper font-semibold text-sm hover:bg-bronze-2 disabled:opacity-50 transition-colors shadow-[0_10px_30px_-8px_rgba(94,234,212,0.5)]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4" />
                Get my estimate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result */}
      {estimate && (
        <div id="estimate-result" className="rounded-3xl border border-bronze/30 bg-gradient-to-br from-surface to-bg-2 p-6 md:p-10 relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(50% 40% at 100% 0%, rgba(94,234,212,0.18), transparent)" }} />
          <div className="relative">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-bronze" />
              <span className="eyebrow">AI estimate · ballpark</span>
            </div>
            <div className="mt-6 grid sm:grid-cols-3 gap-px overflow-hidden rounded-xl border border-[color:var(--rule)] bg-line-soft">
              <Stat label="Total area" value={`${estimate.summary.totalAreaM2.toFixed(1)} m²`} />
              <Stat label="Estimate range" value={`${estimate.summary.estimateRange.lowGBP} – ${estimate.summary.estimateRange.highGBP}`} highlight />
              <Stat label="Film" value={estimate.summary.film} />
            </div>
            <p className="mt-6 max-w-prose whitespace-pre-wrap text-fg-2 leading-relaxed">
              {estimate.message}
            </p>

            {/* Booking */}
            {!booked ? (
              <div className="mt-10 rounded-2xl border border-[color:var(--rule)] bg-bg-2 p-5 md:p-7">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-bronze" />
                  <span className="eyebrow">Next available survey slots</span>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => {
                    const active = chosenSlot?.iso === slot.iso;
                    return (
                      <button
                        type="button"
                        key={slot.iso}
                        onClick={() => setChosenSlot(slot)}
                        className={cn(
                          "rounded-xl border p-3 text-left transition-all",
                          active
                            ? "border-bronze bg-cream text-fg"
                            : "border-[color:var(--rule)] bg-bg hover:border-[color:var(--rule)]",
                        )}
                      >
                        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted">
                          in {slot.fromToday} day{slot.fromToday === 1 ? "" : "s"}
                        </p>
                        <p className="mt-1 font-display text-lg text-fg leading-tight">{slot.label}</p>
                        {active && (
                          <p className="mt-2 text-xs text-bronze inline-flex items-center gap-1">
                            <Check className="h-3 w-3" strokeWidth={3} /> Chosen
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 grid sm:grid-cols-3 gap-3">
                  <input
                    value={contact.name}
                    onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                    placeholder="Your name"
                    className="input-field"
                    autoComplete="name"
                  />
                  <input
                    value={contact.email}
                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                    type="email"
                    placeholder="Email"
                    className="input-field"
                    autoComplete="email"
                  />
                  <input
                    value={contact.phone}
                    onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                    type="tel"
                    placeholder="Phone (optional)"
                    className="input-field"
                    autoComplete="tel"
                  />
                </div>
                <button
                  type="button"
                  onClick={onBook}
                  disabled={bookPending}
                  className="mt-6 inline-flex items-center justify-center gap-2 h-12 w-full sm:w-auto px-8 rounded-full bg-bronze text-paper font-semibold text-sm hover:bg-bronze-2 disabled:opacity-50 transition-colors"
                >
                  {bookPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : chosenSlot ? (
                    <>Request {chosenSlot.label} survey <ArrowRight className="h-4 w-4" /></>
                  ) : (
                    <>Request a survey <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
                <p className="mt-3 text-xs text-muted">
                  The slot is a preference — we&rsquo;ll confirm within a working day. No deposit, no obligation.
                </p>
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-bronze/40 bg-bronze/5 p-7 text-center">
                <div className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-bronze text-paper">
                  <Check className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <p className="mt-5 font-display text-2xl text-fg">
                  Survey requested. <span className="italic text-bronze">We&rsquo;ll be in touch.</span>
                </p>
                <p className="mt-2 text-sm text-muted">
                  We&rsquo;ll confirm your preferred slot within the working day. Anything urgent — WhatsApp us.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .input-field {
          width: 100%;
          background: var(--paper);
          border: 1px solid var(--rule);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 0.95rem;
          color: var(--ink);
          transition: border-color 220ms ease, box-shadow 220ms ease;
        }
        .input-field:focus {
          outline: none;
          border-color: var(--bronze);
          box-shadow: 0 0 0 4px rgba(164, 113, 72, 0.15);
        }
        .input-field::placeholder { color: var(--muted); }
      `}</style>
    </div>
  );
}

function Eyebrow({ n }: { n: number }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze flex items-center gap-3">
      <span className="grid h-5 w-5 place-items-center rounded-full border border-bronze text-bronze text-[10px]">{n}</span>
      Step
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-mono uppercase tracking-[0.18em] text-muted">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        min={1}
        className="mt-2 input-field"
      />
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("p-5", highlight ? "bg-bg" : "bg-bg-2")}>
      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className={cn("mt-2 font-display leading-tight", highlight ? "text-3xl text-bronze" : "text-xl text-fg")}>
        {value}
      </p>
    </div>
  );
}
