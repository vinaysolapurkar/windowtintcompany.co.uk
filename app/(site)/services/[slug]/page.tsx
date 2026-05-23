import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Reveal, ArrowRight } from "@/components/site/editorial";

export async function generateStaticParams() {
  const services = await db.service.findMany({ where: { active: true } });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await db.service.findUnique({ where: { slug } });
  if (!service) return {};
  return {
    title: `${service.name} — ${service.tagline}`,
    description: service.shortDesc,
    alternates: { canonical: `/services/${slug}` },
  };
}

const SERVICE_IMG: Record<string, string> = {
  "solar-control-film": "/photos/sample-3.jpg",
  "privacy-film": "/photos/sample-1.webp",
  "decorative-film": "/photos/sample-2.jpg",
  "safety-security-film": "/photos/job-4.jpg",
  "anti-glare-film": "/photos/sample-4.jpg",
  "frosted-manifestation": "/photos/install-2.png",
};

export default async function ServiceDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const [service, others] = await Promise.all([
    db.service.findUnique({ where: { slug } }),
    db.service.findMany({ where: { active: true, NOT: { slug } }, orderBy: { order: "asc" }, take: 3 }),
  ]);
  if (!service) notFound();

  type Feature = { title: string; description: string };
  const features: Feature[] = service.features ? JSON.parse(service.features) : [];

  return (
    <>
      <Reveal />
      <section className="container">
        <div className="page-hero">
          <div>
            <div className="page-hero__num">— {service.name}</div>
            <h1 className="page-hero__title">
              <em>{service.tagline.split(/[\.\?\!]/)[0]}</em>
            </h1>
          </div>
          <div>
            <p className="t-lede page-hero__lede">{service.shortDesc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginTop: 32, borderTop: "1px solid var(--rule)", paddingTop: 24 }}>
              {service.vlt && (
                <div>
                  <p className="t-caption">VLT</p>
                  <p style={{ fontFamily: "var(--font-display-family), serif", fontSize: 22, margin: "8px 0 0" }}>{service.vlt}</p>
                </div>
              )}
              {service.heatReject && (
                <div>
                  <p className="t-caption">Heat reject</p>
                  <p style={{ fontFamily: "var(--font-display-family), serif", fontSize: 22, margin: "8px 0 0" }}><em style={{ color: "var(--bronze)", fontStyle: "italic" }}>{service.heatReject}</em></p>
                </div>
              )}
              {service.uvBlock && (
                <div>
                  <p className="t-caption">UV blocked</p>
                  <p style={{ fontFamily: "var(--font-display-family), serif", fontSize: 22, margin: "8px 0 0" }}><em style={{ color: "var(--bronze)", fontStyle: "italic" }}>{service.uvBlock}</em></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="split">
          <div className="split__img" style={{ backgroundImage: `url(${SERVICE_IMG[service.slug] || "/photos/job-1.jpg"})` }} />
          <div className="split__body">
            <div className="prose-edit" dangerouslySetInnerHTML={{ __html: service.description }} />
            <div style={{ marginTop: 16 }}>
              <Link href="/contact" className="btn">Get a survey <span className="arr" /></Link>
            </div>
          </div>
        </div>
      </section>

      {features.length > 0 && (
        <section className="container section">
          <div className="sec-head reveal">
            <div className="sec-head__label">
              <span className="sec-head__num">— What you're paying for</span>
            </div>
            <h2 className="t-h2">The detail.</h2>
          </div>
          <div className="values">
            {features.map((f, i) => (
              <div className="value reveal" key={i}>
                <div className="value__num">— 0{i + 1}</div>
                <h3 className="value__title">{f.title}</h3>
                <p className="value__body">{f.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container section">
        <div className="sec-head reveal">
          <div className="sec-head__label">
            <span className="sec-head__num">— Continue</span>
          </div>
          <h2 className="t-h2">
            Other films we<br />often <em>specify</em>.
          </h2>
        </div>
        <div className="svc-list">
          {others.map((s, idx) => (
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

      <section className="cta">
        <div className="container">
          <div className="cta__inner reveal">
            <h2 className="t-h1 cta__title">Specified for <em>your</em> glass.</h2>
            <div className="cta__side">
              <p className="t-lede">A free, on-site survey precedes every quote. Anywhere in Scotland.</p>
              <Link href="/contact" className="btn">Book a survey <span className="arr" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
