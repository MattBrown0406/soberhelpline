// Contract D (website -> Sober Helpline app): which of these emails the app
// already reminds about this week's Family Squares call by push. Reminder
// emails for the upcoming call skip those people.
//
// FAIL OPEN: if the secret or URL is missing, the app function isn't deployed
// yet (404), it errors, answers badly, or takes longer than 5 seconds, that
// batch counts as "handled by nobody" and the emails go out as before.
// Logs carry counts only (never emails, never the secret).

const DEFAULT_MOBILE_SUPABASE_URL = "https://rjlkbxqxshohgjmomyro.supabase.co";
const BATCH_SIZE = 1000;
const TIMEOUT_MS = 5000;

export const normalizeEmail = (value: unknown): string =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

function reachableEndpoint(): string | null {
  const raw = (Deno.env.get("MOBILE_SUPABASE_URL") ?? "").trim() || DEFAULT_MOBILE_SUPABASE_URL;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    return `${url.origin}/functions/v1/family-squares-push-reachable`;
  } catch {
    return null;
  }
}

export interface AppReachability {
  /** Lower-cased emails the app reminds by push; skip these. */
  handled: Set<string>;
  /** Distinct emails asked about. */
  checked: number;
  /** Batches that failed open (their emails are NOT in `handled`). */
  failedBatches: number;
}

/**
 * Ask the app which emails it reminds by push. Never throws.
 * `label` names the calling function in the count-only log line.
 */
export async function appHandledEmails(emails: Iterable<string>, label: string): Promise<AppReachability> {
  const unique = [...new Set([...emails].map(normalizeEmail).filter((email) => email.includes("@")))];
  const result: AppReachability = { handled: new Set<string>(), checked: unique.length, failedBatches: 0 };
  if (unique.length === 0) return result;

  const batches = Math.ceil(unique.length / BATCH_SIZE);
  const secret = Deno.env.get("MEMBERSHIP_SYNC_SECRET") ?? "";
  const endpoint = reachableEndpoint();
  if (!secret || !endpoint) {
    result.failedBatches = batches;
    console.warn(`push_reachable ${label}: not configured; checked=${unique.length} handled_by_app=0 (sending all)`);
    return result;
  }

  for (let start = 0; start < unique.length; start += BATCH_SIZE) {
    const batch = unique.slice(start, start + BATCH_SIZE);
    if (result.failedBatches > 0) {
      // One failure (404, timeout, bad answer) fails the rest open without
      // waiting on the app again, so the worst case is one 5 s timeout.
      result.failedBatches += 1;
      continue;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-membership-sync-secret": secret,
        },
        body: JSON.stringify({ emails: batch }),
        signal: controller.signal,
      });
      if (!response.ok) {
        await response.body?.cancel();
        throw new Error(`status ${response.status}`);
      }
      const data = await response.json();
      const list: unknown = data?.handled_by_app;
      if (!Array.isArray(list)) throw new Error("malformed response");
      // Only accept emails we actually asked about in this batch.
      const asked = new Set(batch);
      for (const value of list) {
        const email = normalizeEmail(value);
        if (asked.has(email)) result.handled.add(email);
      }
    } catch (error) {
      result.failedBatches += 1;
      const reason = error instanceof Error
        ? (error.name === "AbortError" ? "timeout" : error.message.slice(0, 60))
        : "error";
      console.warn(`push_reachable ${label}: batch of ${batch.length} failed open (${reason})`);
    } finally {
      clearTimeout(timer);
    }
  }

  console.log(
    `push_reachable ${label}: checked=${unique.length} handled_by_app=${result.handled.size} failed_batches=${result.failedBatches}`,
  );
  return result;
}
