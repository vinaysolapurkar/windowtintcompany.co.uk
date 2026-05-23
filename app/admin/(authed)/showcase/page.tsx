import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { PageHeader } from "../../_components/page-header";
import { ArrowUpRight, Plus, Star } from "lucide-react";

export default async function ShowcaseAdminPage() {
  const projects = await db.showcaseProject.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
  return (
    <>
      <PageHeader
        title="Showcase"
        description="Real installations from the studio. Featured projects appear on the home page."
        actions={
          <Link href="/admin/showcase/new" className="inline-flex items-center gap-2 h-10 rounded-full px-5 bg-teal text-bg text-sm font-medium hover:bg-teal-2">
            <Plus className="h-4 w-4" /> New project
          </Link>
        }
      />
      <div className="p-6 lg:p-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/admin/showcase/${p.id}`}
              className="group rounded-2xl border border-line-soft bg-bg overflow-hidden hover:border-teal/60 transition-colors"
            >
              <div className="relative aspect-[4/3]">
                <Image src={p.heroImage} alt={p.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] bg-bg/70 backdrop-blur-md text-ink px-2 py-1 rounded-full border border-line">{p.category}</span>
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] bg-gold/20 text-gold px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-current" /> Featured
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <p className="font-display text-lg text-ink leading-tight">{p.title}</p>
                {p.location && <p className="mt-1 text-xs font-mono uppercase tracking-[0.18em] text-ink-3">{p.location}</p>}
                <div className="mt-4 pt-4 border-t border-line-soft flex items-center justify-between text-xs text-ink-3">
                  <span>Order {p.order}</span>
                  <ArrowUpRight className="h-4 w-4 text-ink-4 group-hover:text-teal" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
