import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Reveal } from "@/components/site/editorial";

export const metadata: Metadata = {
  title: "Showcase — Recent work across Scotland",
  description: "A selection of installs across Edinburgh, Glasgow, Dunfermline and the rest of Scotland.",
  alternates: { canonical: "/showcase" },
};

const GI = ["gi-1", "gi-2", "gi-3", "gi-4", "gi-5", "gi-6", "gi-7"];

export default async function ShowcasePage() {
  const projects = await db.showcaseProject.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });

  return (
    <>
      <Reveal />
      <section className="container">
        <div className="page-hero">
          <div>
            <div className="page-hero__num">— 03 / Showcase</div>
            <h1 className="page-hero__title">
              Recent <em>work</em>.
            </h1>
          </div>
          <div>
            <p className="t-lede page-hero__lede">
              A selection of installs across Scotland. Residential, commercial, hospitality. Click any project to read the spec, materials and outcome.
            </p>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="gallery">
          {projects.map((p, i) => (
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
