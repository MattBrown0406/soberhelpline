// Who is in the middle of the Family Squares follow-up emails right now.
//
// A new registrant gets a planned run of emails in their first week (day 1, 3
// and 7, plus the after-meeting email). The weekly blog digest stays out of
// that week so the emails do not pile up.

// deno-lint-ignore no-explicit-any
type AnyClient = { from: (table: string) => any };

const QUEUE = "family_squares_followup_queue";
const RECENT_HOURS = 48;
const AHEAD_DAYS = 8;

/**
 * Lower-cased addresses that received a follow-up in the last 48 hours or
 * have one waiting to go out in the next 8 days.
 *
 * Fails open: if the lookup fails the set is empty and the caller sends as it
 * did before this rule existed.
 */
export async function emailsInFollowupSequence(supabase: AnyClient, caller: string, now: Date = new Date()): Promise<Set<string>> {
  try {
    const recentSince = new Date(now.getTime() - RECENT_HOURS * 3600_000).toISOString();
    const aheadUntil = new Date(now.getTime() + AHEAD_DAYS * 86_400_000).toISOString();
    const [recent, waiting] = await Promise.all([
      supabase.from(QUEUE).select("email").gte("sent_at", recentSince).limit(5000),
      supabase.from(QUEUE).select("email").is("sent_at", null).is("skipped_at", null).lte("scheduled_for", aheadUntil).limit(5000),
    ]);
    if (recent.error) throw new Error(recent.error.message);
    if (waiting.error) throw new Error(waiting.error.message);
    const emails = new Set<string>();
    for (const row of [...(recent.data ?? []), ...(waiting.data ?? [])] as { email: string | null }[]) {
      const email = String(row.email ?? "").trim().toLowerCase();
      if (email) emails.add(email);
    }
    console.log(`[${caller}] ${emails.size} address(es) are in the follow-up sequence`);
    return emails;
  } catch (error) {
    console.error(`[${caller}] follow-up sequence lookup failed; sending as before:`, error instanceof Error ? error.message : error);
    return new Set();
  }
}
