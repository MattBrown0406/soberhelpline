// Cancelled Family Squares meetings (cancelled_meeting_dates). The sign-up
// pages already refuse a cancelled Monday; the scheduled jobs use this so they
// don't register or remind people for a meeting that isn't happening.

// Structural, so callers may pass a client from esm.sh or npm: supabase-js.
// deno-lint-ignore no-explicit-any
type AnyClient = { from: (table: string) => any };

/**
 * The Monday a "tonight" email is about, in Pacific time (YYYY-MM-DD): today
 * if today is Monday, otherwise the next Monday.
 */
export function upcomingMondayPacific(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const date = new Date(Date.UTC(get("year"), get("month") - 1, get("day")));
  date.setUTCDate(date.getUTCDate() + ((8 - date.getUTCDay()) % 7));
  return date.toISOString().slice(0, 10);
}

/**
 * Whether the meeting on `meetingDate` has been cancelled. Fails open: if the
 * lookup fails, the job carries on as it did before this check existed, so a
 * database hiccup never silences a real Monday.
 */
export async function isMeetingCancelled(admin: AnyClient, meetingDate: string, caller: string): Promise<boolean> {
  try {
    const { data, error } = await admin
      .from("cancelled_meeting_dates")
      .select("meeting_date")
      .eq("meeting_date", meetingDate)
      .maybeSingle();
    if (error) {
      console.error(`${caller}: cancelled-meeting lookup failed; continuing`, error.message ?? error);
      return false;
    }
    return !!data;
  } catch (err) {
    console.error(`${caller}: cancelled-meeting lookup threw; continuing`, err);
    return false;
  }
}
