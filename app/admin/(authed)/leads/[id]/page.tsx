import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { PageHeader } from "../../../_components/page-header";
import { Mail, Phone, MapPin, ExternalLink, Trash2 } from "lucide-react";
import { updateLeadStatus, updateLeadNotes, deleteLead } from "../actions";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

export default async function LeadDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  return (
    <>
      <PageHeader
        title={lead.name}
        description={`Enquiry received ${format(lead.createdAt, "EEEE d MMM yyyy 'at' HH:mm")}`}
        breadcrumb={[
          { label: "Leads", href: "/admin/leads" },
          { label: lead.name },
        ]}
        actions={
          <form action={deleteLead}>
            <input type="hidden" name="id" value={lead.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-2 h-9 rounded-full px-4 text-xs border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </form>
        }
      />
      <div className="p-6 lg:p-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Project brief">
            <dl className="space-y-4">
              <Row label="Project types">
                {lead.projectTypes
                  ? lead.projectTypes
                      .split(",")
                      .map((t) => (
                        <span key={t} className="inline-block text-xs rounded-full border border-line px-2.5 py-1 mr-2 mb-2 text-ink-2">
                          {t.trim()}
                        </span>
                      ))
                  : <span className="text-ink-4">—</span>}
              </Row>
              <Row label="Customer comment">
                {lead.comment ? (
                  <p className="text-ink-2 whitespace-pre-wrap">{lead.comment}</p>
                ) : (
                  <p className="text-ink-4">— No comment</p>
                )}
              </Row>
              {lead.referenceUrl && (
                <Row label="Reference link">
                  <Link href={lead.referenceUrl} target="_blank" rel="noopener" className="text-teal hover:underline inline-flex items-center gap-1.5">
                    {lead.referenceUrl} <ExternalLink className="h-3 w-3" />
                  </Link>
                </Row>
              )}
              <Row label="Source">
                <span className="text-ink-2">{lead.source}</span>
              </Row>
            </dl>
          </Card>

          <Card title="Studio notes">
            <form action={updateLeadNotes} className="space-y-3">
              <input type="hidden" name="id" value={lead.id} />
              <textarea
                name="notes"
                defaultValue={lead.notes ?? ""}
                className="admin-input min-h-[140px]"
                placeholder="Survey date confirmed; customer prefers Thursday afternoons…"
              />
              <button type="submit" className="inline-flex items-center gap-2 h-10 rounded-full px-5 bg-teal text-bg text-sm font-medium hover:bg-teal-2">
                Save notes
              </button>
            </form>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card title="Contact">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-teal" strokeWidth={1.5} />
                <Link href={`mailto:${lead.email}`} className="text-ink-2 hover:text-teal break-all">{lead.email}</Link>
              </li>
              {lead.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-teal" strokeWidth={1.5} />
                  <Link href={`tel:${lead.phone}`} className="text-ink-2 hover:text-teal">{lead.phone}</Link>
                </li>
              )}
              {lead.postcode && (
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-teal" strokeWidth={1.5} />
                  <span className="text-ink-2">{lead.postcode}</span>
                </li>
              )}
            </ul>
          </Card>

          <Card title="Status">
            <form action={updateLeadStatus}>
              <input type="hidden" name="id" value={lead.id} />
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="submit"
                    name="status"
                    value={s}
                    className={`h-10 rounded-lg text-xs font-mono uppercase tracking-[0.16em] border transition-colors ${
                      lead.status === s
                        ? "border-teal bg-teal/10 text-teal"
                        : "border-line bg-bg-2 text-ink-2 hover:border-teal"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </form>
          </Card>

          <Card title="Timeline">
            <ul className="text-sm space-y-3">
              <li className="flex justify-between">
                <span className="text-ink-3">Received</span>
                <span className="text-ink">{format(lead.createdAt, "d MMM HH:mm")}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-ink-3">Last updated</span>
                <span className="text-ink">{format(lead.updatedAt, "d MMM HH:mm")}</span>
              </li>
            </ul>
          </Card>
        </aside>
      </div>

      <style>{`
        .admin-input {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 0.92rem;
          color: var(--ink);
          transition: border-color 220ms ease, box-shadow 220ms ease;
        }
        .admin-input:focus {
          outline: none;
          border-color: var(--teal);
          box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.15);
        }
      `}</style>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line-soft bg-bg overflow-hidden">
      <div className="px-6 py-4 border-b border-line-soft">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-teal">{title}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-3">{label}</dt>
      <dd className="mt-2">{children}</dd>
    </div>
  );
}
