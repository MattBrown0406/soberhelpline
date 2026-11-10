/**
 * Monday meeting time helpers. The meeting is every Monday 7:00–8:00 PM in
 * America/Los_Angeles; everything here is computed in Pacific time, never in
 * the viewer's local time zone.
 */

const PACIFIC = "America/Los_Angeles";
const MEETING_START_HOUR = 19;
const MEETING_END_HOUR = 20;

interface PacificParts {
  year: number;
  month: number; // 1-12
  day: number;
  weekday: number; // 0 = Sunday
  hour: number;
  minute: number;
}

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: PACIFIC,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function pacificParts(date: Date): PacificParts {
  const parts: Record<string, string> = {};
  for (const p of partsFormatter.formatToParts(date)) parts[p.type] = p.value;
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    weekday: WEEKDAYS[parts.weekday] ?? 0,
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
  };
}

/** YYYY-MM-DD for a calendar date, shifted by `addDays` (pure calendar math). */
function isoDate(year: number, month: number, day: number, addDays = 0): string {
  const d = new Date(Date.UTC(year, month - 1, day + addDays));
  return d.toISOString().slice(0, 10);
}

/**
 * The Monday (YYYY-MM-DD, Pacific calendar date) of the first meeting that had
 * not yet ended (Monday 8 PM Pacific) at the given moment.
 */
export function meetingWeekKey(at: Date | string): string {
  const date = typeof at === "string" ? new Date(at) : at;
  const p = pacificParts(date);
  if (p.weekday === 1 && p.hour < MEETING_END_HOUR) {
    return isoDate(p.year, p.month, p.day);
  }
  const daysAhead = (1 - p.weekday + 7) % 7 || 7;
  return isoDate(p.year, p.month, p.day, daysAhead);
}

/** "Monday, Nov 17" for a YYYY-MM-DD key. */
export function formatMeetingDay(key: string, withWeekday = true): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    ...(withWeekday ? { weekday: "long" as const } : {}),
    month: "short",
    day: "numeric",
  });
}

export interface NextMeeting {
  /** YYYY-MM-DD of the Monday. */
  key: string;
  /** The meeting is happening right now (Monday 7–8 PM Pacific). */
  isLive: boolean;
  /** The meeting is later today (Pacific). */
  isToday: boolean;
}

export function nextMeeting(now: Date = new Date()): NextMeeting {
  const p = pacificParts(now);
  const key = meetingWeekKey(now);
  const isMondayPacific = p.weekday === 1;
  const isLive = isMondayPacific && p.hour >= MEETING_START_HOUR && p.hour < MEETING_END_HOUR;
  const isToday = isMondayPacific && p.hour < MEETING_END_HOUR;
  return { key, isLive, isToday };
}

/** The YYYY-MM-DD one calendar day before `key`. */
export function previousDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return isoDate(y, m, d, -1);
}

/** 0 = Sunday ... for a YYYY-MM-DD calendar date. */
export function weekdayOf(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}
