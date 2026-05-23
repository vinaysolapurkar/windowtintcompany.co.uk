import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Reveal, BeforeAfter, ArrowRight } from "@/components/site/editorial";

export const metadata: Metadata = {
  title: "Services — Film, specified for purpose",
  description: "Six specialisms. Privacy, solar, heat, UV, anti-glare and decorative films installed across Scotland by Window Tint Company®.",
  alternates: { canonical: "/services" },
};

const SERVICE_IMG: Record<string, string> = {
  "solar-control-film": "/photos/sample-3.jpg",
  "privacy-film": "/photos/sample-1.webp",
  "decorative-film": "/photos/sample-2.jpg",
  "safety-security-film": "/photos/job-4.jpg",
  "anti-glare-film": "/photos/sample-4.jpg",
  "frosted-manifestation": "/photos/install-2.png",
};

export default async function ServicesPage() {
  const services = await db.service.findMany({ where: { active: true }, orderBy: { order: "asc" } });

  return (
    <>
      <Reveal />
      <section className="container">
        <div className="page-hero">
          <div>
            <div className="page-hero__num">— 02 / Services</div>
            <h1 className="page-hero__title">
              Film, specified<br />for <em>purpose</em>.
            </h1>
          </div>
          <div>
            <p className="t-lede page-hero__lede">
              Six specialisms. Every install begins with a conversation about how the room is used and how the light falls, then we specify and install the correct film. No upselling.
            </p>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="svc-list">
          {services.map((s, idx) => (
            <Link href={`/services/${s.slug}`} className="svc-row reveal" key={s.id}>
              <span className="svc-row__num">— {String(idx + 1).padStart(2, "0")}</span>
              <h3 className="svc-row__title">{s.name}</h3>
              <span className="svc-row__meta">{s.tagline}</span>
              <div className="svc-row__arrow"><ArrowRight /></div>
              <div className="svc-row__preview" style={{ backgroundImage: `url(${SERVICE_IMG[s.slug] || "/photos/job-1.jpg"})` }} />
            </Link>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section style={{ background: "var(--cream)", padding: "var(--pad-7) 0" }}>
        <div className="container">
          <div className="sec-head reveal">
            <div className="sec-head__label">
              <span className="sec-head__num">— Capabilities</span>
            </div>
            <h2 className="t-h2">
              What films can <em>do</em>.
            </h2>
          </div>
          <div className="values">
            {[
              { n: "Privacy", t: "Frosted & one-way", b: "Frosted privacy film and one-way mirror films for residences, bathrooms, meeting rooms and street-facing glazing." },
              { n: "Solar", t: "Heat reduction", b: "Reduce solar heat gain by up to 79%. Reduce reliance on cooling. Make south-facing rooms livable." },
              { n: "UV", t: "99% UV block", b: "Protect fabrics, art, timber and skin. Effectively invisible films that block the harmful spectrum." },
              { n: "Energy", t: "Energy-saving", b: "Retain interior heat in winter, reject solar heat in summer. Reduce running costs of any glazed building." },
            ].map((v, i) => (
              <div className="value reveal" key={i} style={{ background: "var(--paper)" }}>
                <div className="value__num">— {v.n}</div>
                <h3 className="value__title">{v.t}</h3>
                <p className="value__body">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="sec-head reveal">
          <div className="sec-head__label">
            <span className="sec-head__num">— Demonstration</span>
          </div>
          <h2 className="t-h2">
            Drag to see the<br /><em>difference</em>.
          </h2>
        </div>
        <div className="reveal">
          <BeforeAfter before="/photos/sample-3.jpg" after="/photos/sample-3.jpg" leftLabel="Untinted" rightLabel="Filmed" />
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta__inner reveal">
            <h2 className="t-h1 cta__title">Quote within <em>24 hours</em>.</h2>
            <div className="cta__side">
              <p className="t-lede">Tell us a little about the property. We&rsquo;ll come back with a clear, itemised proposal.</p>
              <Link href="/contact" className="btn">Get a quote <span className="arr" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
