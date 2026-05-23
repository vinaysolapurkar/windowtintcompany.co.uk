import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { Reveal } from "@/components/site/editorial";

export const metadata: Metadata = {
  title: "Journal — Field notes & specifications",
  description:
    "Field notes, case studies and specifications from Window Tint Company® — Scotland's specialist window film studio in Dunfermline.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage(props: {
  searchParams: Promise<{ category?: string }>;
}) {
  const search = await props.searchParams;
  const category = search?.category;

  const allPosts = await db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });
  const categories = Array.from(new Set(allPosts.map((p) => p.category)));
  const posts = category ? allPosts.filter((p) => p.category === category) : allPosts;
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <>
      <Reveal />
      <section className="container">
        <div className="page-hero">
          <div>
            <div className="page-hero__num">— Journal</div>
            <h1 className="page-hero__title">
              Field notes &<br /><em>specifications</em>.
            </h1>
          </div>
          <div>
            <p className="t-lede page-hero__lede">
              Essays, case studies, and small specifications by the team — from the physics of solar film to the day-by-day of a Scottish installation diary.
            </p>
            <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Link href="/blog" className={`chip ${!category ? "chip--active" : ""}`}>All</Link>
              {categories.map((c) => (
                <Link key={c} href={`/blog?category=${encodeURIComponent(c)}`} className={`chip ${category === c ? "chip--active" : ""}`}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {featured && (
        <section className="container section">
          <Link href={`/blog/${featured.slug}`} className="split reveal" style={{ alignItems: "stretch" }}>
            <div className="split__img" style={{ backgroundImage: `url(${featured.coverImage || "/photos/sample-1.webp"})`, aspectRatio: "auto", minHeight: 480 }} />
            <div className="split__body" style={{ justifyContent: "center" }}>
              <p className="t-caption">
                {featured.category} · {featured.readingMins} min read
                {featured.publishedAt && ` · ${format(featured.publishedAt, "d MMM yyyy")}`}
              </p>
              <h2 className="t-h2">{featured.title}</h2>
              <p className="t-body">{featured.excerpt}</p>
              <p className="btn--link" style={{ alignSelf: "flex-start" }}>Read essay →</p>
            </div>
          </Link>
        </section>
      )}

      <section className="container section">
        <div className="sec-head reveal">
          <div className="sec-head__label">
            <span className="sec-head__num">— Recent essays</span>
          </div>
          <h2 className="t-h2">More from <em>the studio</em>.</h2>
        </div>
        <div className="svc-list">
          {rest.map((p, i) => (
            <Link href={`/blog/${p.slug}`} className="svc-row reveal" key={p.id}>
              <span className="svc-row__num">— {String(i + 1).padStart(2, "0")}</span>
              <h3 className="svc-row__title">{p.title}</h3>
              <span className="svc-row__meta">{p.category} · {p.readingMins} min</span>
              <div className="svc-row__arrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
              <div className="svc-row__preview" style={{ backgroundImage: `url(${p.coverImage || "/photos/sample-1.webp"})` }} />
            </Link>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta__inner reveal">
            <h2 className="t-h1 cta__title">An <em>essay</em> for your inbox?</h2>
            <div className="cta__side">
              <p className="t-lede">The Journal is updated when there&rsquo;s something worth writing. We don&rsquo;t spam.</p>
              <Link href="/contact" className="btn">Or just call us <span className="arr" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
