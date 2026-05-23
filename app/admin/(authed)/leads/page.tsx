import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { db } from "@/lib/db";
import { PageHeader } from "../../_components/page-header";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

const STATUS_FILTERS = ["all", "new", "contacted", "quoted", "won", "lost"] as const;

export default async function LeadsPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const search = await props.searchParams;
  const status = (search?.status as (typeof STATUS_FILTERS)[number]) || "all";

  const leads = await db.lead.findMany({
    where: status === "all" ? {} : { status },
    orderBy: { createdAt: "desc" },
  });

  const counts: Record<string, number> = {};
  for (const s of STATUS_FILTERS.filter((s) => s !== "all")) {
    counts[s] = await db.lead.count({ where: { status: s } });
  }
  counts.all = await db.lead.count();

  return (
    <>
      <PageHeader
        title="Leads & enquiries"
        description="Every enquiry from the website lands here. Update status, add notes, and follow up."
      />
      <div className="p-6 lg:p-10">
        <div className="mb-6 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <Link
              key={s}
              href={s === "all" ? "/admin/leads" : `/admin/leads?status=${s}`}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-mono uppercase tracking-[0.16em] border transition-colors ${
                status === s
                  ? "border-teal bg-teal/10 text-teal"
                  : "border-line text-ink-3 hover:border-teal hover:text-teal"
              }`}
            >
              {s}
              <span className="text-[10px] opacity-70">{counts[s] ?? 0}</span>
            </Link>
          ))}
        </div>

        {leads.length === 0 ? (
          <div className="rounded-2xl border border-line-soft bg-bg p-12 text-center">
            <p className="text-ink-3">No leads in this view yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-line-soft bg-bg overflow-hidden">
            <ul className="divide-y divide-line-soft">
              {leads.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/admin/leads/${l.id}`}
                    className="block px-6 py-5 hover:bg-bg-2 group transition-colors"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-display text-lg text-ink">{l.name}</p>
                          <span className={`inline-flex items-center text-[10px] font-mono uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${l.status === "new" ? "bg-teal/10 text-teal" : "bg-bg-2 text-ink-3"}`}>
                            {l.status}
                          </span>
                          {l.source !== "contact-form" && (
                            <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-bg-2 text-ink-4">
                              {l.source}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-3">
                          <span className="inline-flex items-center gap-1.5"><Mail className="h-3 w-3" />{l.email}</span>
                          {l.phone && <span className="inline-flex items-center gap-1.5"><Phone className="h-3 w-3" />{l.phone}</span>}
                          {l.postcode && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" />{l.postcode}</span>}
                        </div>
                        {l.projectTypes && (
                          <p className="mt-3 text-sm text-ink-2 line-clamp-1">
                            {l.projectTypes.split(",").map((t) => t.trim()).join(" · ")}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-ink-3">{formatDistanceToNow(l.createdAt, { addSuffix: true })}</p>
                        <ArrowUpRight className="h-4 w-4 text-ink-4 group-hover:text-teal mt-3 ml-auto" />
                      </div>
                    </div>
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
