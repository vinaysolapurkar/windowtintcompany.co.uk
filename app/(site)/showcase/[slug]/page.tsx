import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Reveal } from "@/components/site/editorial";

export async function generateStaticParams() {
  const projects = await db.showcaseProject.findMany();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await db.showcaseProject.findUnique({ where: { slug } });
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/showcase/${slug}` },
    openGraph: { title: project.title, description: project.summary, images: project.heroImage ? [project.heroImage] : undefined },
  };
}

const GI = ["gi-1", "gi-2", "gi-3", "gi-4", "gi-5"];

export default async function ShowcaseDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const project = await db.showcaseProject.findUnique({ where: { slug } });
  if (!project) notFound();

  const others = await db.showcaseProject.findMany({
    where: { NOT: { slug } },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    take: 5,
  });

  const gallery = (project.gallery || "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <Reveal />
      <section className="container">
        <div className="page-hero">
          <div>
            <div className="page-hero__num">— {project.category}{project.location ? ` · ${project.location}` : ""}</div>
            <h1 className="page-hero__title">{project.title}</h1>
          </div>
          <div>
            <p className="t-lede page-hero__lede">{project.summary}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32, borderTop: "1px solid var(--rule)", paddingTop: 24 }}>
              {project.client && (
                <div>
                  <p className="t-caption">Client</p>
                  <p style={{ fontFamily: "var(--font-display-family), serif", fontSize: 20, margin: "6px 0 0" }}>{project.client}</p>
                </div>
              )}
              {project.filmUsed && (
                <div>
                  <p className="t-caption">Film</p>
                  <p style={{ fontFamily: "var(--font-display-family), serif", fontSize: 20, margin: "6px 0 0" }}>{project.filmUsed}</p>
                </div>
              )}
              <div>
                <p className="t-caption">Heat reject</p>
                <p style={{ fontFamily: "var(--font-display-family), serif", fontSize: 20, margin: "6px 0 0" }}><em style={{ color: "var(--bronze)", fontStyle: "italic" }}>79%</em></p>
              </div>
              <div>
                <p className="t-caption">UV block</p>
                <p style={{ fontFamily: "var(--font-display-family), serif", fontSize: 20, margin: "6px 0 0" }}><em style={{ color: "var(--bronze)", fontStyle: "italic" }}>99%</em></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="split reveal">
          <div className="split__img" style={{ backgroundImage: `url(${project.heroImage})` }} />
          <div className="split__body">
            <p className="t-caption">— Project notes</p>
            <div className="prose-edit" dangerouslySetInnerHTML={{ __html: project.body }} />
            <div style={{ marginTop: 16 }}>
              <Link href="/contact" className="btn">Brief a similar project <span className="arr" /></Link>
            </div>
          </div>
        </div>
      </section>

      {gallery.length > 1 && (
        <section className="container section">
          <div className="sec-head reveal">
            <div className="sec-head__label">
              <span className="sec-head__num">— Gallery</span>
            </div>
            <h2 className="t-h2">More of the install.</h2>
          </div>
          <div className="gallery">
            {gallery.map((src, i) => (
              <div key={src + i} className={`gallery__item ${GI[i % GI.length]}`}>
                <img src={src} alt="" />
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
            More from the<br /><em>studio</em>.
          </h2>
        </div>
        <div className="gallery">
          {others.map((p, i) => (
            <Link key={p.id} href={`/showcase/${p.slug}`} className={`gallery__item ${GI[i % GI.length]}`}>
              <img src={p.heroImage} alt={p.title} />
              <div className="gallery__item-tag">{p.location ? `${p.location} · ` : ""}{p.category}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta__inner reveal">
            <h2 className="t-h1 cta__title">Your project, <em>next</em>.</h2>
            <div className="cta__side">
              <p className="t-lede">Free consultation across Scotland. Quotes within 24 hours.</p>
              <Link href="/contact" className="btn">Start a project <span className="arr" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
