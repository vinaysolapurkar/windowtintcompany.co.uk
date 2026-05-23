import { addDays, format, isAfter, isWeekend, startOfDay } from "date-fns";
import { db } from "@/lib/db";

export type Slot = {
  iso: string; // YYYY-MM-DD
  label: string; // "Tue 27 May"
  longLabel: string; // "Tuesday 27 May 2026"
  fromToday: number; // days from today
};

const SCOTLAND_BANK_HOLIDAYS_2026 = new Set<string>([
  "2026-01-01",
  "2026-01-02",
  "2026-04-03",
  "2026-05-04",
  "2026-05-25",
  "2026-08-03",
  "2026-11-30",
  "2026-12-25",
  "2026-12-28",
]);

export async function getBookedDates(): Promise<Set<string>> {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: "blockedDates" },
    });
    if (!setting?.value) return new Set();
    return new Set(
      setting.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    );
  } catch {
    return new Set();
  }
}

export async function getNextAvailableSlots(count = 4): Promise<Slot[]> {
  const booked = await getBookedDates();
  const today = startOfDay(new Date());
  const leadDays = 3; // earliest survey 3 working days out

  const slots: Slot[] = [];
  // start cursor at today + leadDays
  let cursor = addDays(today, leadDays);
  let safety = 0;
  while (slots.length < count && safety < 60) {
    safety++;
    const iso = format(cursor, "yyyy-MM-dd");
    if (
      !isWeekend(cursor) &&
      !SCOTLAND_BANK_HOLIDAYS_2026.has(iso) &&
      !booked.has(iso) &&
      isAfter(cursor, today)
    ) {
      slots.push({
        iso,
        label: format(cursor, "EEE d MMM"),
        longLabel: format(cursor, "EEEE d MMMM yyyy"),
        fromToday: Math.floor(
          (cursor.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        ),
      });
    }
    cursor = addDays(cursor, 1);
  }
  return slots;
}
