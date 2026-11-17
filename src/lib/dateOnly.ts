// Calendar dates. A DATE column arrives as "YYYY-MM-DD". `new Date("2026-11-16")`
// reads that as midnight UTC, which is still the day before everywhere in the
// United States, so `format(new Date(value), ...)` prints the wrong day. These
// helpers treat the value as the calendar day it is.
import { format } from "date-fns";

/** The calendar day as a local Date (noon, so no zone or daylight-saving shift moves it). */
export function parseDateOnly(value: string | null | undefined): Date | null {
  if (typeof value !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(y, m - 1, d, 12, 0, 0, 0);
  // Reject days that do not exist (a 31st of a 30-day month rolls over).
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

/** Formats a calendar date with a date-fns pattern. A value that is not a date comes back as it was. */
export function formatDateOnly(value: string | null | undefined, pattern: string): string {
  const date = parseDateOnly(value);
  if (!date) return typeof value === "string" ? value : "";
  return format(date, pattern);
}

/** Today's calendar date in Pacific time, as "YYYY-MM-DD" (the meeting's own zone). */
export function pacificToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
