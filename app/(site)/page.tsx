import Link from "next/link";
import { db } from "@/lib/db";
import { BeforeAfter, Counter, Marquee, Stats, Testimonials, Reveal, ArrowRight } from "@/components/site/editorial";

// Map of real photos
const IMG = {
  aboutHero: "/photos/job-3.jpg",
  residential: "/photos/sample-1.webp",
  commercial: "/photos/sample-3.jpg",
  hotels: "/photos/sample-2.jpg",
  conservatory: "/photos/sample-4.jpg",
  caravan: "/photos/install-1.png",
  schools: "/photos/install-2.png",
  showcase1: "/photos/job-2.jpg",
  showcase2: "/photos/job-4.jpg",
  whyus: "/photos/job-5.jpg",
  cta: "/photos/job-6.jpg",
} as const;

const SERVICE_IMG: Record<string, string> = {
  "solar-control-film": IMG.commercial,
  "privacy-film": IMG.residential,
  "decorative-film": IMG.hotels,
  "safety-security-film": IMG.commercial,
  "anti-glare-film": IMG.conservatory,
  "frosted-manifestation": IMG.schools,
};

const FALLBACK_IMG = IMG.residential;

export default async function HomePage() {
  const services = await db.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    take: 6,
  });

  return (
    <>
      <Reveal />
      {/* HERO */}
      <section className="hero">
        <img className="hero__img" src={IMG.aboutHero} alt="" />
        <div className="hero__vignette" />
        <div className="hero__top container" style={{ left: 0, right: 0 }}>
          <span className="t-caption">Scotland · Est. 2018</span>
          <span className="t-caption">No. 01 — Window film, installed properly</span>
        </div>
        <div className="hero__inner container">
          <h1 className="t-h1 hero__title">
            Light, on <em>your</em><br /> terms.
          </h1>
          <div className="hero__row">
            <p className="t-lede hero__sub">
              Scotland&rsquo;s specialist installers of privacy, solar and protective window film for residential and commercial properties. Considered specification. Invisible craftsmanship.
            </p>
            <div className="hero__meta">
              <div className="hero__meta-item">
                <span className="hero__meta-num"><Counter to={99} suffix="%" /></span>
                <span className="t-caption" style={{ color: "rgba(242,237,228,.7)" }}>UV blocked</span>
              </div>
              <div className="hero__meta-item">
                <span className="hero__meta-num"><Counter to={79} suffix="%" /></span>
                <span className="t-caption" style={{ color: "rgba(242,237,228,.7)" }}>Heat rejection</span>
              </div>
            </div>
          </div>
          <div className="hero__cta-row">
            <Link href="/contact" className="btn btn--cream">
              Request a quote <span className="arr" />
            </Link>
            <Link href="/services" className="btn btn--ghost" style={{ borderColor: "rgba(242,237,228,.4)", color: "var(--paper)" }}>
              View services
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee items={["Privacy film", <em key="a">Solar control</em>, "Heat reduction", <em key="b">UV protection</em>, "Anti-glare", <em key="c">Frosted privacy</em>, "One-way mirror"]} />

      {/* STATS */}
      <Stats />

      {/* BEFORE / AFTER */}
      <section className="container section">
        <div className="sec-head reveal">
          <div className="sec-head__label">
            <span className="sec-head__num">02 — Before / After</span>
          </div>
          <h2 className="t-h2">
            The change is felt before<br /> it&rsquo;s <em>seen</em>.
          </h2>
        </div>
        <div className="reveal">
          <BeforeAfter
            before={IMG.conservatory}
            after={IMG.conservatory}
            leftLabel="Untinted"
            rightLabel="Film installed"
          />
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="container section">
        <div className="sec-head reveal">
          <div className="sec-head__label">
            <span className="sec-head__num">03 — Services</span>
          </div>
          <h2 className="t-h2">
            Six specialisms.<br /> One <em>standard</em>.
          </h2>
        </div>
        <ServiceList services={services} />
        <div style={{ marginTop: 48, display: "flex", justifyContent: "flex-end" }}>
          <Link href="/services" className="btn--link">All services →</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* PROCESS */}
      <section className="container section">
        <div className="sec-head reveal">
          <div className="sec-head__label">
            <span className="sec-head__num">05 — Process</span>
          </div>
          <h2 className="t-h2">
            From <em>conversation</em><br /> to completed install.
          </h2>
        </div>
        <div className="process">
          {[
            { n: "I", t: "Consult", b: "We visit the property, take measurements, and discuss intent — privacy, heat, light, longevity." },
            { n: "II", t: "Specify", b: "We match the correct film to the orientation, glazing and aesthetic. Samples on request." },
            { n: "III", t: "Install", b: "Single-day installs for most projects. Spotless, low-disruption, with clear walkthroughs." },
            { n: "IV", t: "Guarantee", b: "Manufacturer-backed warranties up to 15 years. We're around if anything ever needs attention." },
          ].map((s, i) => (
            <div className="process__step reveal" key={i}>
              <div className="process__num">{s.n}</div>
              <h3 className="process__title">{s.t}</h3>
              <p className="process__body">{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta__inner reveal">
            <h2 className="t-h1 cta__title">
              Have an upcoming<br />project? Let&rsquo;s <em>talk</em>.
            </h2>
            <div className="cta__side">
              <p className="t-lede">Free consultation. No-obligation quote. Most quotes returned within 24 hours.</p>
              <Link href="/contact" className="btn">
                Start a project <span className="arr" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceList({ services }: { services: { slug: string; name: string; tagline: string }[] }) {
  return (
    <div className="svc-list">
      {services.map((s, idx) => (
        <Link href={`/services/${s.slug}`} className="svc-row reveal" key={s.slug}>
          <span className="svc-row__num">— {String(idx + 1).padStart(2, "0")}</span>
          <h3 className="svc-row__title">{s.name}</h3>
          <span className="svc-row__meta">{s.tagline}</span>
          <div className="svc-row__arrow"><ArrowRight /></div>
          <div className="svc-row__preview" style={{ backgroundImage: `url(${SERVICE_IMG[s.slug] || FALLBACK_IMG})` }} />
        </Link>
      ))}
    </div>
  );
}
