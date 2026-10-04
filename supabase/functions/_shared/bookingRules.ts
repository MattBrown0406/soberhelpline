// What a coaching booking may contain. One PayPal payment buys exactly the
// sessions of one plan, at times the provider actually offers.
//
// - checkBookingShape: a known plan, exactly that plan's number of sessions,
//   well-formed, distinct, non-overlapping times. consultation-payment checks it
//   when it creates the PayPal order; book-consultation checks it again before
//   it inserts the confirmed sessions.
// - checkSlotsBookable: each time is in the future, inside the booking window,
//   on the provider's slot grid (weekly availability + date overrides, the same
//   rules the booking page uses to list times), and not already booked.
//   Checked when the order is created. Not re-checked after payment: a
//   provider editing availability, or a slot starting while someone pays, must
//   not turn a paid order into a failed booking. (Someone else booking the same
//   slot in the meantime is still caught after payment by book-consultation's
//   conflict check.)

// Structural, so callers may pass a client from esm.sh or npm: supabase-js.
// deno-lint-ignore no-explicit-any
type AnyClient = { from: (table: string) => any };

/** Sessions per plan, as on the booking page (requiredSlots). */
export const PLAN_SESSIONS: Readonly<Record<string, number>> = {
  single: 1,
  emergency: 1, // "Emergency Game Plan" links (?plan=emergency): one session
  "family-readiness-intensive": 1,
  stabilization: 4,
  "parallel-recovery": 12,
};

export interface BookingSlot {
  booking_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS, in `timezone`
  end_time: string;
  timezone: string;
}

export type BookingCheck =
  | { ok: true; bookings: BookingSlot[] }
  | { ok: false; status: number; code: string; error: string };

const DEFAULT_TZ = "America/Los_Angeles";
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
const DAY_MS = 86_400_000;

const fail = (status: number, code: string, error: string): BookingCheck => ({ ok: false, status, code, error });

const toMinutes = (time: string) => {
  const [h, m] = time.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
};
const normalizeTime = (time: string) => (time.length === 5 ? `${time}:00` : time);

function isRealDate(date: string): boolean {
  if (!DATE_RE.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return parsed.getUTCFullYear() === y && parsed.getUTCMonth() === m - 1 && parsed.getUTCDate() === d;
}

function isTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Minutes the zone is ahead of UTC at `instantMs`. */
function zoneOffsetMinutes(tz: string, instantMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(instantMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUtc - instantMs) / 60_000);
}

/** The instant (ms) of a wall-clock date + time in `tz`. */
function zonedToUtcMs(date: string, time: string, tz: string): number {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.slice(0, 5).split(":").map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const first = zoneOffsetMinutes(tz, guess);
  const second = zoneOffsetMinutes(tz, guess - first * 60_000);
  return guess - second * 60_000;
}

function dateInZone(instantMs: number, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date(instantMs));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

const addDays = (date: string, days: number) => new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);

const interval = (s: BookingSlot) => ({
  start: zonedToUtcMs(s.booking_date, s.start_time, s.timezone),
  end: zonedToUtcMs(s.booking_date, s.end_time, s.timezone),
});
const overlaps = (a: { start: number; end: number }, b: { start: number; end: number }) => a.start < b.end && a.end > b.start;

/**
 * A known plan with exactly its number of sessions, each a well-formed time,
 * none repeated or overlapping. Returns the cleaned-up slots (only the four
 * fields above). `legacyPlans`: orders created before this check existed took
 * any plan value and priced unknown ones as one session; accept those as one.
 */
export function checkBookingShape(planType: unknown, bookings: unknown, { legacyPlans = false } = {}): BookingCheck {
  const known = typeof planType === "string" && Object.prototype.hasOwnProperty.call(PLAN_SESSIONS, planType);
  if (!known && !legacyPlans) {
    return fail(400, "unknown_plan", "This booking plan isn't available. Please start again from the booking page.");
  }
  const required = known ? PLAN_SESSIONS[planType as string] : 1;
  if (!Array.isArray(bookings) || bookings.length !== required) {
    return fail(
      400,
      "wrong_session_count",
      `This plan books exactly ${required} session${required === 1 ? "" : "s"}. Please start again from the booking page.`,
    );
  }

  const slots: BookingSlot[] = [];
  for (const raw of bookings) {
    const b = (raw ?? {}) as Record<string, unknown>;
    const date = typeof b.booking_date === "string" ? b.booking_date : "";
    const start = typeof b.start_time === "string" ? b.start_time : "";
    const end = typeof b.end_time === "string" ? b.end_time : "";
    const tz = typeof b.timezone === "string" && b.timezone ? b.timezone : DEFAULT_TZ;
    if (!isRealDate(date) || !TIME_RE.test(start) || !TIME_RE.test(end) || toMinutes(end) <= toMinutes(start) || !isTimeZone(tz)) {
      return fail(400, "invalid_slot", "One of the selected times isn't valid. Please start again from the booking page.");
    }
    slots.push({ booking_date: date, start_time: normalizeTime(start), end_time: normalizeTime(end), timezone: tz });
  }

  const intervals = slots.map(interval);
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      if (overlaps(intervals[i], intervals[j])) {
        return fail(400, "duplicate_slot", "The same time was picked twice. Please choose a different time for each session.");
      }
    }
  }
  return { ok: true, bookings: slots };
}

interface ProviderForSlots {
  id: string;
  timezone?: string | null;
  session_duration_minutes?: number | null;
}

/**
 * Each slot is still offered: in the future, inside the booking window (30
 * days, 90 for parallel-recovery, plus a day of slack), on the provider's slot
 * grid for that date, and not overlapping a confirmed or pending booking.
 */
export async function checkSlotsBookable(
  admin: AnyClient,
  provider: ProviderForSlots,
  planType: string,
  slots: BookingSlot[],
  nowMs = Date.now(),
): Promise<BookingCheck> {
  const providerTz = provider.timezone || DEFAULT_TZ;
  const duration = provider.session_duration_minutes || 60;
  const today = dateInZone(nowMs, providerTz);
  const lastDate = addDays(today, (planType === "parallel-recovery" ? 90 : 30) + 1);
  const dates = [...new Set(slots.map((s) => s.booking_date))];
  const unavailable = fail(
    409,
    "slot_unavailable",
    "One of the selected times isn't available any more. Please pick another time.",
  );

  for (const slot of slots) {
    if (interval(slot).start <= nowMs) {
      return fail(409, "slot_in_past", "One of the selected times has already passed. Please pick another time.");
    }
    if (slot.booking_date > lastDate) return unavailable;
  }

  const sorted = [...dates].sort();
  const [availRes, overridesRes, bookedRes] = await Promise.all([
    admin.from("provider_availability")
      .select("day_of_week, start_time, end_time, timezone")
      .eq("provider_id", provider.id)
      .eq("is_active", true),
    admin.from("provider_date_overrides")
      .select("override_date, is_available, start_time, end_time, timezone")
      .eq("provider_id", provider.id)
      .in("override_date", dates),
    // Same bookings the booking page treats as taken (get_booking_slots), for this provider.
    admin.from("consultation_bookings")
      .select("booking_date, start_time, end_time, timezone")
      .eq("provider_id", provider.id)
      .in("status", ["confirmed", "pending"])
      .gte("booking_date", addDays(sorted[0], -1))
      .lte("booking_date", addDays(sorted[sorted.length - 1], 1)),
  ]);
  if (availRes.error || overridesRes.error || bookedRes.error) {
    console.error("checkSlotsBookable: lookup failed", availRes.error?.message ?? overridesRes.error?.message ?? bookedRes.error?.message);
    return fail(503, "availability_unavailable", "We couldn't check the provider's calendar just now. Please try again in a moment.");
  }

  type Range = { start_time: string | null; end_time: string | null; timezone: string | null };
  const weekly = (availRes.data ?? []) as Array<Range & { day_of_week: number }>;
  const overrides = (overridesRes.data ?? []) as Array<Range & { override_date: string; is_available: boolean }>;
  const booked = ((bookedRes.data ?? []) as Array<{ booking_date: string; start_time: string; end_time: string; timezone: string | null }>)
    .filter((b) => b.start_time && b.end_time)
    .map((b) => interval({
      booking_date: b.booking_date,
      start_time: b.start_time,
      end_time: b.end_time,
      timezone: b.timezone && isTimeZone(b.timezone) ? b.timezone : providerTz,
    }));

  for (const slot of slots) {
    const dayOverrides = overrides.filter((o) => o.override_date === slot.booking_date);
    if (dayOverrides.some((o) => !o.is_available && !o.start_time && !o.end_time)) return unavailable;

    const slotStart = toMinutes(slot.start_time);
    const slotEnd = toMinutes(slot.end_time);
    const removed = dayOverrides.some((o) =>
      !o.is_available && o.start_time && o.end_time &&
      slotStart < toMinutes(o.end_time) && slotEnd > toMinutes(o.start_time)
    );
    if (removed) return unavailable;

    const dayOfWeek = new Date(`${slot.booking_date}T00:00:00Z`).getUTCDay();
    const ranges: Range[] = [
      ...weekly.filter((r) => r.day_of_week === dayOfWeek),
      ...dayOverrides.filter((o) => o.is_available && o.start_time && o.end_time),
    ];
    const onGrid = ranges.some((r) => {
      if (!r.start_time || !r.end_time) return false;
      if ((r.timezone || providerTz) !== slot.timezone) return false;
      const rangeStart = toMinutes(r.start_time);
      const rangeEnd = toMinutes(r.end_time);
      return slotStart >= rangeStart &&
        (slotStart - rangeStart) % duration === 0 &&
        slotStart + duration <= rangeEnd &&
        slotEnd === slotStart + duration;
    });
    if (!onGrid) return unavailable;

    const wanted = interval(slot);
    if (booked.some((b) => overlaps(wanted, b))) {
      return fail(409, "slot_taken", "One of the selected times was just booked by someone else. Please pick another time.");
    }
  }
  return { ok: true, bookings: slots };
}
