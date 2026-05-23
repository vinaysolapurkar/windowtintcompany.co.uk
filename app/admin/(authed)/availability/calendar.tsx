"use client";

import { useState, useTransition } from "react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameMonth,
  isToday,
  isWeekend,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Lock, Unlock, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { toggleBlockedDate } from "./actions";

export function AvailabilityCalendar({
  blocked,
  bookings,
}: {
  blocked: string[];
  bookings: Record<string, { id: string; name: string; status: string }[]>;
}) {
  const [cursor, setCursor] = useState(startOfMonth(new Date()));
  const [pendingDate, setPendingDate] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const blockedSet = new Set(blocked);
  const today = startOfDay(new Date());

  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
  const days: Date[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);

  const onToggle = (d: Date) => {
    if (!isAfter(d, today) && !isToday(d)) return;
    const iso = format(d, "yyyy-MM-dd");
    setPendingDate(iso);
    startTransition(async () => {
      try {
        await toggleBlockedDate(iso);
      } finally {
        setPendingDate(null);
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl border border-line-soft bg-bg overflow-hidden">
        <div className="px-6 py-4 border-b border-line-soft flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">{format(cursor, "MMMM yyyy")}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setCursor(subMonths(cursor, 1))} className="grid h-9 w-9 place-items-center rounded-lg border border-line-soft text-ink-2 hover:text-teal hover:border-teal">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setCursor(startOfMonth(new Date()))} className="text-xs text-ink-3 hover:text-teal px-3">Today</button>
            <button onClick={() => setCursor(addMonths(cursor, 1))} className="grid h-9 w-9 place-items-center rounded-lg border border-line-soft text-ink-2 hover:text-teal hover:border-teal">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-3 text-center">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => {
              const iso = format(d, "yyyy-MM-dd");
              const inMonth = isSameMonth(d, cursor);
              const weekend = isWeekend(d);
              const past = !isAfter(d, today) && !isToday(d);
              const isBlocked = blockedSet.has(iso);
              const hasBooking = bookings[iso]?.length > 0;
              const isPending = pendingDate === iso;
              return (
                <button
                  key={iso}
                  onClick={() => onToggle(d)}
                  disabled={past || isPending}
                  className={cn(
                    "aspect-square rounded-lg p-2 text-left flex flex-col justify-between transition-all",
                    !inMonth && "opacity-30",
                    past && "opacity-40 cursor-not-allowed",
                    weekend && !past && "bg-bg-2/50",
                    !past && !isBlocked && !hasBooking && "border border-line-soft bg-bg hover:border-teal",
                    !past && isBlocked && "border border-danger/40 bg-danger/10 text-danger",
                    !past && hasBooking && !isBlocked && "border border-teal/40 bg-teal/10 text-teal",
                    isToday(d) && "ring-2 ring-teal/40",
                    isPending && "opacity-60",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm font-medium", isToday(d) ? "text-teal" : "")}>
                      {format(d, "d")}
                    </span>
                    {isBlocked && <Lock className="h-3 w-3" />}
                    {hasBooking && !isBlocked && <User className="h-3 w-3" />}
                  </div>
                  {hasBooking && (
                    <span className="text-[9px] font-mono uppercase tracking-[0.16em] truncate">
                      {bookings[iso].length} slot{bookings[iso].length > 1 ? "s" : ""}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-line-soft flex items-center gap-5 text-xs text-ink-3">
          <Legend color="border border-line-soft bg-bg" label="Available" />
          <Legend color="border border-danger/40 bg-danger/10" label="Blocked" icon={<Lock className="h-3 w-3 text-danger" />} />
          <Legend color="border border-teal/40 bg-teal/10" label="Booked" icon={<User className="h-3 w-3 text-teal" />} />
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-line-soft bg-bg p-6">
          <p className="eyebrow">Blocked dates</p>
          {blocked.length === 0 ? (
            <p className="mt-4 text-sm text-ink-3">No dates blocked. The team is available for surveys on every working day.</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {blocked.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 text-xs rounded-full border border-danger/30 bg-danger/10 text-danger px-3 py-1.5">
                  <Lock className="h-3 w-3" />
                  {format(new Date(b), "d MMM")}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-teal/30 bg-gradient-to-br from-surface to-bg p-6">
          <p className="eyebrow">Upcoming booking requests</p>
          {Object.keys(bookings).length === 0 ? (
            <p className="mt-4 text-sm text-ink-3">No survey-slot requests yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {Object.entries(bookings)
                .sort(([a], [b]) => a.localeCompare(b))
                .slice(0, 8)
                .map(([date, list]) => (
                  <li key={date} className="text-sm">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal">{format(new Date(date), "EEE d MMM")}</p>
                    <ul className="mt-1 space-y-1">
                      {list.map((b) => (
                        <li key={b.id} className="flex items-center justify-between">
                          <Link href={`/admin/leads/${b.id}`} className="text-ink hover:text-teal">{b.name}</Link>
                          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-3">{b.status}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-line-soft bg-bg p-6 text-sm text-ink-3">
          <p className="font-medium text-ink mb-2">How it works</p>
          <p>Click a future date to block it. Customers won&rsquo;t see blocked dates as available survey slots on the public Estimate page.</p>
          <p className="mt-3 text-xs">Weekends and Scottish bank holidays are auto-excluded.</p>
        </div>
      </aside>
    </div>
  );
}

function Legend({ color, label, icon }: { color: string; label: string; icon?: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className={cn("h-4 w-4 rounded grid place-items-center", color)}>{icon}</span>
      {label}
    </div>
  );
}
