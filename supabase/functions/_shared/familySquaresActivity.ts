// Who has gone quiet at "The Family Squares". Auto-registration skips anyone
// with no attendance in the last DORMANT_WEEKS meetings, and re-engagement
// emails them only on the first Monday of the month. Someone who shows up
// again (manual signup, then attendance) is active again with no admin step.
//
// Attendance matches a person by registration row, then Zoom email, then full
// name: Zoom often withholds participant emails, so email alone misses
// registered attendees.
//
// FAIL OPEN: if any lookup fails, nobody counts as dormant and both jobs
// behave as before. Logs carry counts only.

export const DORMANT_WEEKS = 8;

const PAGE_SIZE = 1000;

const MISTYPED_DOMAINS = new Set([
  "gmal.com", "gmial.com", "gmai.com", "gamil.com", "gnail.com", "gmail.co", "gmail.cm",
  "lcloud.com", "iclould.com", "icoud.com",
  "hotmsil.com", "hotmial.com", "hotmal.com", "hotmail.co",
  "yaho.com", "yahooo.com", "yahoo.co",
  "comcast.bet", "comcast.neg", "comcast.ne",
]);

export const normalizeEmail = (value: unknown): string =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

/** Same rule as the weekly report: lower-case words, parentheses dropped, emails ignored. */
export const normalizeName = (value: unknown): string => {
  if (typeof value !== "string" || value.includes("@")) return "";
  return value.toLowerCase().replace(/\(.*?\)/g, " ").replace(/[^\p{L}\s'-]/gu, " ").replace(/\s+/g, " ").trim();
};

/** A first name alone ("Kim") is too common to identify anyone. */
const isFullName = (name: string): boolean => name.includes(" ");

/** Addresses that can never deliver: a typo'd provider domain or a ".con"-style ending. */
export function isLikelyMistypedEmail(value: unknown): boolean {
  const email = normalizeEmail(value);
  const at = email.lastIndexOf("@");
  if (at < 1) return true;
  const domain = email.slice(at + 1);
  if (!domain.includes(".")) return true;
  return MISTYPED_DOMAINS.has(domain) || /\.(con|cmo|ocm)$/.test(domain);
}

/** meetingDate is a Monday as YYYY-MM-DD. */
export function isFirstMondayOfMonth(meetingDate: string): boolean {
  return Number(meetingDate.slice(8, 10)) <= 7;
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export interface Person { email: string; name?: string | null }
export interface WindowRegistration { id: string; email: string | null; name: string | null }
export interface AttendanceRow {
  registration_id: string | null;
  participant_email: string | null;
  participant_name: string | null;
}

/**
 * Pure rule. Dormant = registered before the window (so not new) and matched
 * to no attendance row inside it.
 */
export function dormantEmails(
  people: Person[],
  windowRegistrations: WindowRegistration[],
  attendance: AttendanceRow[],
  registeredBeforeWindow: Set<string>,
): Set<string> {
  const regIds = new Map<string, Set<string>>();
  const names = new Map<string, Set<string>>();
  const addName = (email: string, name: unknown) => {
    const n = normalizeName(name);
    if (!n || !isFullName(n)) return;
    if (!names.has(email)) names.set(email, new Set());
    names.get(email)!.add(n);
  };
  for (const r of windowRegistrations) {
    const email = normalizeEmail(r.email);
    if (!email) continue;
    if (!regIds.has(email)) regIds.set(email, new Set());
    regIds.get(email)!.add(r.id);
    addName(email, r.name);
  }
  for (const p of people) addName(normalizeEmail(p.email), p.name);

  const attendedRegIds = new Set<string>();
  const attendedEmails = new Set<string>();
  const attendedNames = new Set<string>();
  for (const a of attendance) {
    if (a.registration_id) attendedRegIds.add(a.registration_id);
    const email = normalizeEmail(a.participant_email);
    if (email) attendedEmails.add(email);
    const name = normalizeName(a.participant_name);
    if (name && isFullName(name)) attendedNames.add(name);
  }

  const dormant = new Set<string>();
  for (const p of people) {
    const email = normalizeEmail(p.email);
    if (!email || !registeredBeforeWindow.has(email)) continue;
    const attended = [...(regIds.get(email) ?? [])].some(id => attendedRegIds.has(id)) ||
      attendedEmails.has(email) ||
      [...(names.get(email) ?? [])].some(n => attendedNames.has(n));
    if (!attended) dormant.add(email);
  }
  return dormant;
}

// deno-lint-ignore no-explicit-any
async function fetchAll<T>(build: (from: number, to: number) => any): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await build(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) return rows;
  }
}

/** Emails among `people` with no attendance in the DORMANT_WEEKS meetings before meetingDate. */
// deno-lint-ignore no-explicit-any
export async function findDormantEmails(supabase: any, people: Person[], meetingDate: string, caller: string): Promise<Set<string>> {
  if (people.length === 0) return new Set();
  const windowStart = addDays(meetingDate, -7 * DORMANT_WEEKS);
  try {
    const [windowRegistrations, attendance, earlier] = await Promise.all([
      fetchAll<WindowRegistration>((from, to) => supabase.from("zoom_meeting_registrations")
        .select("id,email,name").gte("meeting_date", windowStart).lt("meeting_date", meetingDate)
        .order("id").range(from, to)),
      fetchAll<AttendanceRow>((from, to) => supabase.from("zoom_attendance")
        .select("registration_id,participant_email,participant_name")
        .gte("meeting_date", windowStart).lt("meeting_date", meetingDate)
        .order("id").range(from, to)),
      fetchAll<{ email: string | null }>((from, to) => supabase.from("zoom_meeting_registrations")
        .select("email").lt("meeting_date", windowStart).order("id").range(from, to)),
    ]);
    const registeredBeforeWindow = new Set(earlier.map(r => normalizeEmail(r.email)).filter(Boolean));
    const dormant = dormantEmails(people, windowRegistrations, attendance, registeredBeforeWindow);
    console.log(`[${caller}] ${dormant.size} of ${people.length} with no attendance since ${windowStart}`);
    return dormant;
  } catch (error) {
    console.error(`[${caller}] dormant lookup failed; treating everyone as active:`, error instanceof Error ? error.message : error);
    return new Set();
  }
}

/** Emails of active family members. Members are never treated as dormant. */
// deno-lint-ignore no-explicit-any
export async function activeMemberEmails(supabase: any): Promise<Set<string> | null> {
  const { data: subs, error } = await supabase.from("provider_subscriptions")
    .select("user_id").is("provider_submission_id", null).eq("status", "active");
  if (error) return null;
  const ids = [...new Set((subs ?? []).map((s: { user_id: string }) => s.user_id))];
  if (ids.length === 0) return new Set();
  const { data: rows, error: e2 } = await supabase.from("profile_private").select("email").in("user_id", ids);
  if (e2) return null;
  return new Set((rows ?? []).map((r: { email: string | null }) => normalizeEmail(r.email)).filter(Boolean));
}
