import { db } from "@/lib/db";
import { PageHeader } from "../../_components/page-header";
import { AvailabilityCalendar } from "./calendar";

export default async function AvailabilityPage() {
  const [setting, leads] = await Promise.all([
    db.siteSetting.findUnique({ where: { key: "blockedDates" } }),
    db.lead.findMany({
      where: { source: { contains: "slot" } },
      select: { id: true, name: true, source: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  const blocked = (setting?.value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Map preferred dates from lead.source ("estimate · slot 2026-05-28")
  const bookings: Record<string, { id: string; name: string; status: string }[]> = {};
  for (const l of leads) {
    const m = l.source?.match(/slot (\d{4}-\d{2}-\d{2})/);
    if (m) {
      const date = m[1];
      bookings[date] ??= [];
      bookings[date].push({ id: l.id, name: l.name, status: l.status });
    }
  }

  return (
    <>
      <PageHeader
        title="Availability"
        description="Block dates when the team can't take surveys. Customers see only available slots on the Estimate page."
      />
      <div className="p-6 lg:p-10">
        <AvailabilityCalendar blocked={blocked} bookings={bookings} />
      </div>
    </>
  );
}
