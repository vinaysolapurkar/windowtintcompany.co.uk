import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { Reveal } from "@/components/site/editorial";

export async function generateStaticParams() {
  const posts = await db.post.findMany({ where: { published: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await db.post.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await db.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true, bio: true } } },
  });
  if (!post || !post.published) notFound();

  const related = await db.post.findMany({
    where: { published: true, category: post.category, NOT: { slug } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <>
      <Reveal />
      <article>
        <section className="container">
          <div className="page-hero" style={{ gridTemplateColumns: "1fr" }}>
            <div>
              <Link href="/blog" className="t-caption" style={{ color: "var(--bronze)" }}>← Journal</Link>
              <p className="t-caption" style={{ marginTop: 32 }}>
                {post.category} · {post.readingMins} min read
                {post.publishedAt && ` · ${format(post.publishedAt, "d MMMM yyyy")}`}
              </p>
              <h1 className="page-hero__title" style={{ maxWidth: "18ch" }}>{post.title}</h1>
              <p className="t-lede" style={{ marginTop: 32, maxWidth: "60ch" }}>{post.excerpt}</p>
            </div>
          </div>
        </section>

        {post.coverImage && (
          <section className="container" style={{ marginTop: "var(--pad-3)" }}>
            <div style={{
              backgroundImage: `url(${post.coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              aspectRatio: "16/9",
              filter: "saturate(0.9)",
            }} />
          </section>
        )}

        <section className="container section">
          <div style={{ maxWidth: "62ch", margin: "0 auto" }}>
            <div className="prose-edit" dangerouslySetInnerHTML={{ __html: post.content }} />

            <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--rule)" }}>
              <p className="t-caption">Written by</p>
              <p style={{ fontFamily: "var(--font-display-family), serif", fontSize: 28, margin: "8px 0 0", fontStyle: "italic", color: "var(--bronze)" }}>
                {post.author.name}
              </p>
              {post.author.bio && (
                <p className="t-body" style={{ marginTop: 12 }}>{post.author.bio}</p>
              )}
            </div>
          </div>
        </section>
      </article>

      {related.length > 0 && (
        <section className="container section">
          <div className="sec-head reveal">
            <div className="sec-head__label">
              <span className="sec-head__num">— Related</span>
            </div>
            <h2 className="t-h2">More from <em>{post.category.toLowerCase()}</em>.</h2>
          </div>
          <div className="svc-list">
            {related.map((p, i) => (
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
      )}

      <section className="cta">
        <div className="container">
          <div className="cta__inner reveal">
            <h2 className="t-h1 cta__title">Reading with a <em>window</em> in mind?</h2>
            <div className="cta__side">
              <p className="t-lede">Book a free survey anywhere in Scotland. We&rsquo;ll measure the glass and recommend the lightest film that solves your problem.</p>
              <Link href="/contact" className="btn">Book my survey <span className="arr" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
