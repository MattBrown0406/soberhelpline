// Reverse membership bridge: give active WEBSITE subscribers an "essential"
// entitlement inside the Sober Helpline App.
//
// Source of truth: public.provider_subscriptions on the website
//                  (provider_submission_id IS NULL, plan_type <> 'app').
// Target: the app's `membership-import` function (server to server,
// x-membership-sync-secret = MEMBERSHIP_SYNC_SECRET). The website sends the
// COMPLETE list of current website members ({ email, expires_at }, login emails
// only) in one call; the app matches VERIFIED app accounts, keeps one
// website-granted entitlement per matched account (source 'scholarship', tier
// 'essential', raw.granted_by = 'soberhelpline_website_membership'), and ends
// website grants whose account is no longer in the list. App Store /
// RevenueCat entitlements and unrelated scholarships are never touched. The
// website never reads or writes the app database directly.
//
// The app applies the mass-revocation guard (more than 25% of current website
// grants, and at least 10): re-run with { "allow_mass_revoke": true } after
// checking a { "dry_run": true } run. If the app function can't be reached (not
// deployed yet = 404, wrong secret, bad response), the run fails and the app
// changes nothing.

import { createClient } from "npm:@supabase/supabase-js@2";
import { hasAutomationAuth } from "../_shared/automationAuth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_APP_SUPABASE_URL = "https://rjlkbxqxshohgjmomyro.supabase.co";
const GRACE_DAYS = 3;
const DAY_MS = 86_400_000;
const PAGE_SIZE = 1000;
// membership-import takes the complete list in one call (up to 5000 members).
const MAX_IMPORT_MEMBERS = 5000;
const IMPORT_TIMEOUT_MS = 120_000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

type SubRow = {
  id: string;
  user_id: string;
  status: string;
  plan_type: string | null;
  next_billing_date: string | null;
  access_ends_at: string | null;
};

type PageResult<T> = { data: T[] | null; error: { message: string } | null; count?: number | null };

/** Run a ranged query until every row has been read. */
async function selectAll<T>(
  label: string,
  page: (from: number, to: number) => PromiseLike<PageResult<T>>,
): Promise<T[]> {
  const out: T[] = [];
  let total: number | null = null;
  for (let from = 0; ;) {
    const { data, error, count } = await page(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`${label} failed: ${error.message}`);
    if (total === null) total = count ?? null;
    const rows = data ?? [];
    out.push(...rows);
    from += rows.length;
    if (rows.length === 0) break;
    if (total !== null ? from >= total : rows.length < PAGE_SIZE) break;
  }
  if (total !== null && out.length < total) {
    throw new Error(`${label} returned ${out.length} of ${total} rows`);
  }
  return out;
}

/** Every auth user (id + lowercased login email) of THIS project, page by page. */
async function listAuthUsers(
  baseUrl: string,
  key: string,
): Promise<{ id: string; email: string | null }[]> {
  const out: { id: string; email: string | null }[] = [];
  for (let page = 1; page <= 10_000; page++) {
    const res = await fetch(`${baseUrl}/auth/v1/admin/users?page=${page}&per_page=${PAGE_SIZE}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`auth users lookup failed [${res.status}]`);
    const total = Number(res.headers.get("x-total-count"));
    const payload = await res.json();
    const users: { id: string; email?: string | null }[] = payload?.users ?? [];
    for (const u of users) {
      out.push({ id: u.id, email: u.email ? u.email.toLowerCase().trim() : null });
    }
    if (users.length === 0) break;
    if (Number.isFinite(total) && total > 0 ? out.length >= total : users.length < PAGE_SIZE) break;
  }
  return out;
}

/**
 * The app expiry a website membership row should produce, or undefined when the
 * row gives no access now. null = open-ended (admin-granted free membership).
 */
function wantedExpiry(r: SubRow, now: number): string | null | undefined {
  if (r.plan_type === "app") return undefined; // app-sourced, nothing to mirror back
  const endsAt = r.access_ends_at ? new Date(r.access_ends_at).getTime() : null;
  if (r.status === "cancelled") {
    return endsAt !== null && endsAt > now ? r.access_ends_at : undefined;
  }
  if (r.status !== "active") return undefined;
  // Active rows with a hard end (e.g. FAMILY6 promo) stop at that end.
  if (endsAt !== null) return endsAt > now ? r.access_ends_at : undefined;
  if (r.next_billing_date) {
    return new Date(new Date(r.next_billing_date).getTime() + GRACE_DAYS * DAY_MS).toISOString();
  }
  return null;
}

/** A failed call to the app; `code` goes back to the caller. */
class AppCallError extends Error {
  constructor(public code: string, message: string, public status = 502) {
    super(message);
  }
}

type ImportResult = {
  ok?: unknown;
  error?: unknown;
  matched?: unknown;
  granted?: unknown;
  updated?: unknown;
  revoked?: unknown;
  unmatched?: unknown;
  revocation_blocked?: unknown;
};

/** A count from the app's response (a number, or a list's length). */
const count = (v: unknown): number =>
  typeof v === "number" && Number.isFinite(v) ? v : Array.isArray(v) ? v.length : 0;

async function importToApp(
  appUrl: string,
  secret: string,
  members: { email: string; expires_at: string | null }[],
  dryRun: boolean,
  allowMassRevoke: boolean,
): Promise<ImportResult> {
  let res: Response;
  try {
    res = await fetch(`${appUrl}/functions/v1/membership-import`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-membership-sync-secret": secret,
      },
      body: JSON.stringify({
        members,
        complete: true,
        dry_run: dryRun,
        allow_mass_revoke: allowMassRevoke,
      }),
      signal: AbortSignal.timeout(IMPORT_TIMEOUT_MS),
    });
  } catch {
    throw new AppCallError(
      "app_unavailable",
      "The app's membership-import did not answer (timeout or network error). It may still have applied the list; run again with dry_run to check.",
    );
  }

  if (res.status === 404) {
    await res.body?.cancel();
    throw new AppCallError(
      "app_function_missing",
      "The app's membership-import function is not deployed yet (404). Nothing was changed; the sync will work once the app backend is released.",
      503,
    );
  }
  if (res.status === 401 || res.status === 403) {
    await res.body?.cancel();
    throw new AppCallError(
      "app_unauthorized",
      `The app refused the request (${res.status}). Check that MEMBERSHIP_SYNC_SECRET is identical on both projects.`,
    );
  }
  const payload = await res.json().catch(() => null) as ImportResult | null;
  if (!res.ok || !payload || payload.ok !== true) {
    const reason = payload && typeof payload.error === "string" ? `: ${payload.error.slice(0, 200)}` : "";
    throw new AppCallError("app_error", `The app's membership-import failed (${res.status})${reason}.`);
  }
  return payload;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const appUrl = (Deno.env.get("MOBILE_SUPABASE_URL") ?? "").trim().replace(/\/+$/, "") ||
    DEFAULT_APP_SUPABASE_URL;
  const syncSecret = Deno.env.get("MEMBERSHIP_SYNC_SECRET") ?? "";
  const siteUrl = Deno.env.get("SUPABASE_URL");
  const siteKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!syncSecret || !siteUrl || !siteKey) {
    console.error("website -> app sync: missing MEMBERSHIP_SYNC_SECRET or Supabase env");
    return json({ error: "server_misconfigured" }, 500);
  }

  const supabase = createClient(siteUrl, siteKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // --- Auth: cron secret, automation secret, service role or admin JWT ------
  let body: { cron_secret?: string; dry_run?: boolean; allow_mass_revoke?: boolean } = {};
  try {
    body = (await req.json()) ?? {};
  } catch {
    body = {};
  }
  if (!(await hasAutomationAuth(req, supabase, body))) return json({ error: "unauthorized" }, 401);

  const dryRun = body.dry_run === true;
  const allowMassRevoke = body.allow_mass_revoke === true;
  const now = Date.now();

  try {
    // --- 1. Active website memberships -----------------------------------
    const subs = await selectAll<SubRow>("subscription lookup", (from, to) =>
      supabase
        .from("provider_subscriptions")
        .select("id, user_id, status, plan_type, next_billing_date, access_ends_at", { count: "exact" })
        .is("provider_submission_id", null)
        .in("status", ["active", "cancelled"])
        .order("id", { ascending: true })
        .range(from, to)
    );

    const activeRows: { row: SubRow; expires: string | null }[] = [];
    for (const r of subs) {
      const expires = wantedExpiry(r, now);
      if (expires !== undefined) activeRows.push({ row: r, expires });
    }

    // Website member -> LOGIN email (not the user-editable profile_private.email,
    // which would let a member hand their grant to any app account).
    const emailByUser = new Map<string, string>();
    for (const u of await listAuthUsers(siteUrl, siteKey)) {
      if (u.email) emailByUser.set(u.id, u.email);
    }

    // email -> desired expiry (ISO or null for open-ended)
    const wanted = new Map<string, string | null>();
    const rank = (v: string | null) =>
      v === null ? Number.MAX_SAFE_INTEGER : new Date(v).getTime();
    for (const { row, expires } of activeRows) {
      const email = emailByUser.get(row.user_id);
      if (!email) continue;
      if (!wanted.has(email) || rank(expires) > rank(wanted.get(email) ?? null)) {
        wanted.set(email, expires);
      }
    }

    // membership-import replaces the whole list in one call: never send a
    // partial list (the app would end the grants of everyone left out).
    if (wanted.size > MAX_IMPORT_MEMBERS) {
      console.error(`website -> app sync: ${wanted.size} members is over the ${MAX_IMPORT_MEMBERS} import limit`);
      return json({
        ok: false,
        error: "too_many_members",
        details: `${wanted.size} website members is more than membership-import accepts in one call (${MAX_IMPORT_MEMBERS}). Nothing was sent.`,
        changed: false,
      }, 500);
    }

    // --- 2. Hand the complete list to the app ------------------------------
    const members = [...wanted].map(([email, expires_at]) => ({ email, expires_at }));
    const result = await importToApp(appUrl, syncSecret, members, dryRun, allowMassRevoke);

    const summary = {
      dry_run: dryRun,
      website_members: members.length,
      matched_app_accounts: count(result.matched),
      no_app_account: count(result.unmatched),
      granted: count(result.granted),
      refreshed: count(result.updated),
      revoked: count(result.revoked),
      revocation_blocked: result.revocation_blocked === true,
    };
    if (summary.revocation_blocked) {
      console.error("website -> app sync: the app's mass-revocation guard blocked revocations", {
        website_members: summary.website_members,
      });
    }

    console.log("website -> app entitlement sync complete", summary);
    return json({ ok: true, ...summary, no_app_account_emails: summary.no_app_account });
  } catch (err) {
    if (err instanceof AppCallError) {
      console.error(`website -> app sync failed at the app: ${err.code}`);
      return json({ ok: false, error: err.code, details: err.message }, err.status);
    }
    console.error("website -> app entitlement sync failed", err instanceof Error ? err.message : "unknown");
    return json({ error: "sync_failed", details: err instanceof Error ? err.message : "unknown" }, 500);
  }
});
