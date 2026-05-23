import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "../../_components/page-header";
import { ArrowUpRight, Plus } from "lucide-react";

export default async function ServicesAdminPage() {
  const services = await db.service.findMany({ orderBy: { order: "asc" } });
  return (
    <>
      <PageHeader
        title="Services"
        description="The films you offer. Order controls the position on the public Services page."
        actions={
          <Link href="/admin/services/new" className="inline-flex items-center gap-2 h-10 rounded-full px-5 bg-teal text-bg text-sm font-medium hover:bg-teal-2">
            <Plus className="h-4 w-4" /> New service
          </Link>
        }
      />
      <div className="p-6 lg:p-10">
        <div className="rounded-2xl border border-line-soft bg-bg overflow-hidden">
          <ul className="divide-y divide-line-soft">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/services/${s.id}`} className="flex items-center justify-between gap-6 px-6 py-5 hover:bg-bg-2 group">
                  <div className="flex items-center gap-5">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-bg-2 text-teal text-sm font-mono">{String(s.order).padStart(2, "0")}</span>
                    <div>
                      <p className="font-display text-lg text-ink">{s.name}</p>
                      <p className="text-xs text-ink-3 italic mt-1">{s.tagline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.16em] px-2 py-1 rounded-full ${s.active ? "bg-teal/10 text-teal" : "bg-bg-2 text-ink-4"}`}>
                      {s.active ? "Active" : "Hidden"}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-ink-4 group-hover:text-teal" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
