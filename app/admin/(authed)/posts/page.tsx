import Link from "next/link";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { PageHeader } from "../../_components/page-header";
import { ArrowUpRight, Plus, Star } from "lucide-react";

export default async function PostsPage() {
  const posts = await db.post.findMany({
    orderBy: [{ published: "asc" }, { updatedAt: "desc" }],
    include: { author: { select: { name: true } } },
  });
  return (
    <>
      <PageHeader
        title="Journal posts"
        description="Field notes, case studies and specifications. Drafts are hidden from the public site."
        actions={
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 h-10 rounded-full px-5 bg-teal text-bg text-sm font-medium hover:bg-teal-2"
          >
            <Plus className="h-4 w-4" /> New post
          </Link>
        }
      />
      <div className="p-6 lg:p-10">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-line-soft bg-bg p-12 text-center text-ink-3">
            No posts yet. Start writing.
          </div>
        ) : (
          <div className="rounded-2xl border border-line-soft bg-bg overflow-hidden">
            <ul className="divide-y divide-line-soft">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/posts/${p.id}`}
                    className="flex items-center justify-between gap-6 px-6 py-5 hover:bg-bg-2 group transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-display text-lg text-ink truncate">{p.title}</p>
                        {p.featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.16em] text-gold">
                            <Star className="h-3 w-3 fill-current" /> Featured
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.16em]">
                        <span className={p.published ? "text-teal" : "text-ink-4"}>
                          {p.published ? "Published" : "Draft"}
                        </span>
                        <span className="text-ink-4">·</span>
                        <span className="text-ink-3">{p.category}</span>
                        <span className="text-ink-4">·</span>
                        <span className="text-ink-3">{format(p.updatedAt, "d MMM yyyy")}</span>
                        {p.author?.name && (
                          <>
                            <span className="text-ink-4">·</span>
                            <span className="text-ink-3">{p.author.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-ink-4 group-hover:text-teal shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
