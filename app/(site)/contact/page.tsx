import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/site/editorial";
import { getSiteSettings } from "@/lib/settings";
import { EditorialContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact — Let's talk",
  description: "Send a brief about your property. Free, no-obligation quote within 24 hours. Window Tint Company® — across Scotland.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const s = await getSiteSettings();

  return (
    <>
      <Reveal />
      <section className="container">
        <div className="page-hero">
          <div>
            <div className="page-hero__num">— 04 / Contact</div>
            <h1 className="page-hero__title">
              Let&rsquo;s <em>talk</em>.
            </h1>
          </div>
          <div>
            <p className="t-lede page-hero__lede">
              Send a few details about your property and we&rsquo;ll come back with a free, itemised proposal — usually within 24 hours.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32 }}>
              <div>
                <p className="t-caption">Phone</p>
                <p style={{ fontFamily: "var(--font-display-family), serif", fontSize: 22, margin: "6px 0 0" }}>
                  <Link href={`tel:${s.phone.replace(/\s+/g, "")}`}>{s.phone}</Link>
                </p>
              </div>
              <div>
                <p className="t-caption">Email</p>
                <p style={{ fontFamily: "var(--font-display-family), serif", fontSize: 20, margin: "6px 0 0" }}>
                  <Link href={`mailto:${s.email}`}>{s.email}</Link>
                </p>
              </div>
              <div>
                <p className="t-caption">Hours</p>
                <p style={{ fontFamily: "var(--font-display-family), serif", fontSize: 20, margin: "6px 0 0" }}>Mon — Fri · 08:00 – 17:00</p>
              </div>
              <div>
                <p className="t-caption">Coverage</p>
                <p style={{ fontFamily: "var(--font-display-family), serif", fontSize: 20, margin: "6px 0 0" }}>All of Scotland</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "var(--pad-5)", alignItems: "start" }} className="contact-grid">
          <div className="reveal">
            <p className="t-caption">— Send a brief</p>
            <h2 className="t-h2" style={{ marginTop: 16 }}>
              Tell us about<br />the <em>project</em>.
            </h2>
            <p className="t-body" style={{ marginTop: 24, maxWidth: "32ch" }}>
              We&rsquo;ll get back with a no-obligation quote, typically within 24 hours. For urgent enquiries, please call.
            </p>
          </div>
          <EditorialContactForm />
        </div>
        <style>{`
          @media (max-width: 980px) {
            .contact-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      <section className="container section--tight">
        <div style={{
          aspectRatio: "21/8",
          background: "linear-gradient(120deg, var(--ink) 0%, var(--ink-2) 60%, var(--bronze-3) 130%)",
          position: "relative",
          overflow: "hidden",
          color: "var(--paper)",
          display: "flex",
          alignItems: "center",
          padding: "var(--pad-5)",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(242,237,228,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />
          <div style={{ position: "relative", maxWidth: "60ch", zIndex: 2 }}>
            <p className="t-caption" style={{ color: "rgba(242,237,228,.6)" }}>— Coverage area</p>
            <h3 className="t-h2" style={{ color: "var(--paper)", marginTop: 16 }}>
              All of <em style={{ fontStyle: "italic", color: "var(--bronze-2)" }}>Scotland</em>.
            </h3>
            <p className="t-lede" style={{ color: "rgba(242,237,228,.8)", marginTop: 24 }}>
              Edinburgh, Glasgow, Dunfermline, Stirling, Perth, Dundee, Aberdeen and surrounding areas. Site visits free of charge.
            </p>
          </div>
          <svg style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", width: "45%", height: "80%", maxHeight: 320 }} viewBox="0 0 400 320" fill="none" aria-hidden>
            <path d="M180 30 Q160 80 145 130 Q130 180 150 220 Q170 260 200 290 Q230 270 250 240 Q260 200 240 170 Q220 130 210 90 Q200 50 180 30 Z" stroke="rgba(242,237,228,0.3)" strokeWidth="1" fill="rgba(242,237,228,0.04)" />
            {[
              { x: 175, y: 200, l: "Edinburgh" },
              { x: 145, y: 195, l: "Glasgow" },
              { x: 175, y: 175, l: "Dunfermline" },
              { x: 165, y: 155, l: "Perth" },
              { x: 195, y: 145, l: "Dundee" },
              { x: 210, y: 85, l: "Aberdeen" },
              { x: 165, y: 175, l: "Stirling" },
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill="#B8855A" />
                <circle cx={p.x} cy={p.y} r="12" fill="none" stroke="rgba(184,133,90,0.4)">
                  <animate attributeName="r" from="5" to="18" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                </circle>
                <text x={p.x + 12} y={p.y + 4} fill="rgba(242,237,228,0.7)" fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="0.1em">{p.l}</text>
              </g>
            ))}
          </svg>
        </div>
      </section>
    </>
  );
}
