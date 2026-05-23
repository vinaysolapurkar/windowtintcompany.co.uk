import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { db } from "@/lib/db";
import { PageHeader } from "../_components/page-header";
import { ArrowUpRight, Inbox, Newspaper, Hammer, Wrench, CheckCircle2 } from "lucide-react";

export default async function DashboardPage() {
  const [
    leadsCount,
    newLeadsCount,
    postsCount,
    publishedCount,
    showcaseCount,
    servicesCount,
    recentLeads,
    recentPosts,
  ] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { status: "new" } }),
    db.post.count(),
    db.post.count({ where: { published: true } }),
    db.showcaseProject.count(),
    db.service.count({ where: { active: true } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.post.findMany({ orderBy: { updatedAt: "desc" }, take: 4 }),
  ]);

  const kpis = [
    { label: "New leads", value: newLeadsCount, total: leadsCount, color: "teal", icon: Inbox, href: "/admin/leads" },
    { label: "Published posts", value: publishedCount, total: postsCount, color: "ink", icon: Newspaper, href: "/admin/posts" },
    { label: "Active services", value: servicesCount, color: "ink", icon: Wrench, href: "/admin/services" },
    { label: "Showcase projects", value: showcaseCount, color: "ink", icon: Hammer, href: "/admin/showcase" },
  ];

  return (
    <>
      <PageHeader
        title="Studio dashboard"
        description="A snapshot of what's happening in the studio."
      />
      <div className="p-6 lg:p-10 space-y-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <Link
              key={k.label}
              href={k.href}
              className="group rounded-2xl border border-line-soft bg-bg p-6 hover:border-teal/60 transition-colors"
            >
              <div className="flex items-start justify-between">
                <k.icon className="h-5 w-5 text-teal" strokeWidth={1.5} />
                <ArrowUpRight className="h-4 w-4 text-ink-4 group-hover:text-teal" />
              </div>
              <p className="mt-6 metric text-5xl text-ink">{k.value}</p>
              <p className="mt-2 text-xs font-mono uppercase tracking-[0.18em] text-ink-3">{k.label}</p>
              {k.total !== undefined && k.total !== k.value && (
                <p className="text-[10px] text-ink-4 mt-1">of {k.total} total</p>
              )}
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-2xl border border-line-soft bg-bg overflow-hidden">
            <div className="px-6 py-5 border-b border-line-soft flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">Recent enquiries</h2>
              <Link href="/admin/leads" className="text-xs text-teal hover:underline">View all →</Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className="p-8 text-sm text-ink-3 text-center">No leads yet.</p>
            ) : (
              <ul className="divide-y divide-line-soft">
                {recentLeads.map((l) => (
                  <li key={l.id}>
                    <Link href={`/admin/leads/${l.id}`} className="block px-6 py-5 hover:bg-bg-2 transition-colors group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-ink font-medium truncate">{l.name}</p>
                          <p className="text-xs text-ink-3 mt-0.5 truncate">{l.email}{l.postcode ? ` · ${l.postcode}` : ""}</p>
                          <p className="text-xs text-ink-3 mt-2 line-clamp-2">{l.projectTypes || "—"}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded-full ${l.status === "new" ? "bg-teal/10 text-teal" : "bg-bg-2 text-ink-3"}`}>
                            {l.status}
                          </span>
                          <p className="text-[10px] text-ink-4 mt-2">{formatDistanceToNow(l.createdAt, { addSuffix: true })}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-line-soft bg-bg overflow-hidden">
            <div className="px-6 py-5 border-b border-line-soft flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">Recent edits</h2>
              <Link href="/admin/posts" className="text-xs text-teal hover:underline">All posts →</Link>
            </div>
            <ul className="divide-y divide-line-soft">
              {recentPosts.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/posts/${p.id}`} className="block px-6 py-4 hover:bg-bg-2 group">
                    <p className="text-ink font-medium truncate text-sm">{p.title}</p>
                    <div className="mt-1 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.16em]">
                      <span className={p.published ? "text-teal" : "text-ink-4"}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                      <span className="text-ink-4">{format(p.updatedAt, "d MMM")}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-teal/30 bg-gradient-to-br from-surface to-bg p-8 lg:p-10">
          <CheckCircle2 className="h-6 w-6 text-teal" strokeWidth={1.5} />
          <h2 className="mt-5 font-display text-2xl md:text-3xl text-ink leading-tight">
            Tip: <span className="italic text-teal">block dates</span> when the team is on a big job
          </h2>
          <p className="mt-3 max-w-2xl text-ink-2">
            Customers see your next available slots on the public Estimate page.
            Visit{" "}
            <Link href="/admin/availability" className="text-teal underline underline-offset-2">Availability</Link>{" "}
            to mark dates as unavailable for surveys.
          </p>
        </div>
      </div>
    </>
  );
}
