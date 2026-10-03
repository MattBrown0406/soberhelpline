// Reverse membership bridge: give active WEBSITE subscribers an "essential"
// entitlement inside the Sober Helpline App backend.
//
// Source of truth: public.provider_subscriptions on the website
//                  (provider_submission_id IS NULL, plan_type <> 'app').
// Target: the app backend's `entitlements` table. The app's source constraint
// accepts "scholarship" for externally granted access; raw.granted_by uniquely
// identifies website grants so unrelated scholarships are never modified.
//
// App Store / RevenueCat entitlements and unrelated scholarships are never modified.
//
// Everything is paged (PostgREST caps responses at 1000 rows): a partial read of
// the app's accounts used to look like "member has no app account" and revoke
// their grant. A run that would revoke an unusually large share of website
// grants stops and reports instead; re-run with { "allow_mass_revoke": true }
// after checking a { "dry_run": true } run.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_TIER = "essential";
const WEB_SOURCE = "scholarship";
const WEB_GRANT_MARKER = "soberhelpline_website_membership";
const GRACE_DAYS = 3;
const DAY_MS = 86_400_000;
const PAGE_SIZE = 1000;
const MASS_REVOKE_SHARE = 0.25;
const MASS_REVOKE_MIN = 10;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

type MobileEntitlement = {
  id: string;
  account_id: string;
  source: string | null;
  tier: string | null;
  expires_at: string | null;
  raw: Record<string, unknown> | null;
};

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

/** Every auth user (id + lowercased login email) of a Supabase project, page by page. */
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const mobileUrl = Deno.env.get("MOBILE_SUPABASE_URL");
  const mobileKey = Deno.env.get("MOBILE_SUPABASE_SERVICE_ROLE_KEY");
  const siteUrl = Deno.env.get("SUPABASE_URL");
  const siteKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!mobileUrl || !mobileKey || !siteUrl || !siteKey) {
    console.error("Missing required environment configuration");
    return json({ error: "server_misconfigured" }, 500);
  }

  const supabase = createClient(siteUrl, siteKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const mobile = createClient(mobileUrl, mobileKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // --- Auth: cron secret (body) or admin JWT ------------------------------
  let body: { cron_secret?: string; dry_run?: boolean; allow_mass_revoke?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { data: secretRow } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "cron_secret")
    .maybeSingle();
  const cronSecret = secretRow?.value ?? "";
  let authorized = cronSecret.length > 0 && body.cron_secret === cronSecret;

  if (!authorized) {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (authHeader.startsWith("Bearer ")) {
      const { data: userData } = await supabase.auth.getUser(
        authHeader.replace("Bearer ", ""),
      );
      if (userData?.user) {
        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: userData.user.id,
          _role: "admin",
        });
        authorized = Boolean(isAdmin);
      }
    }
  }
  if (!authorized) return json({ error: "unauthorized" }, 401);

  const dryRun = body.dry_run === true;
  const allowMassRevoke = body.allow_mass_revoke === true;

  const now = Date.now();
  const nowIso = new Date().toISOString();

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

    // --- 2. Resolve app accounts by email --------------------------------
    // The app's `accounts` table has no email column, so map
    // auth user email -> user_id -> account id.
    const emails = [...wanted.keys()];
    const accountIdByEmail = new Map<string, string>();
    const missingAppAccount: string[] = [];

    const accountsRaw = await selectAll<{ id: string; user_id: string | null }>(
      "app accounts lookup",
      (from, to) =>
        mobile
          .from("accounts")
          .select("id, user_id", { count: "exact" })
          .order("id", { ascending: true })
          .range(from, to),
    );
    const accountByUserId = new Map<string, string>();
    for (const a of accountsRaw) {
      if (a.user_id) accountByUserId.set(a.user_id, a.id);
    }

    // Page through app auth users to build email -> user_id.
    const appUserIdByEmail = new Map<string, string>();
    for (const u of await listAuthUsers(mobileUrl, mobileKey)) {
      if (u.email) appUserIdByEmail.set(u.email, u.id);
    }

    for (const email of emails) {
      const appUserId = appUserIdByEmail.get(email);
      const accountId = appUserId ? accountByUserId.get(appUserId) : undefined;
      if (accountId) accountIdByEmail.set(email, accountId);
      else missingAppAccount.push(email);
    }

    // --- 3. Existing website-sourced entitlements ------------------------
    const existing = await selectAll<MobileEntitlement>("entitlements lookup", (from, to) =>
      mobile
        .from("entitlements")
        .select("id, account_id, source, tier, expires_at, raw", { count: "exact" })
        .eq("source", WEB_SOURCE)
        .contains("raw", { granted_by: WEB_GRANT_MARKER })
        .order("id", { ascending: true })
        .range(from, to)
    );
    const existingByAccount = new Map(existing.map((e) => [e.account_id, e]));

    const summary = {
      dry_run: dryRun,
      website_members: emails.length,
      matched_app_accounts: accountIdByEmail.size,
      no_app_account: missingAppAccount.length,
      granted: 0,
      refreshed: 0,
      revoke_candidates: 0,
      revoked: 0,
      revocation_blocked: false,
    };

    // --- 4. Grant / refresh ----------------------------------------------
    const keepAccounts = new Set<string>();
    for (const [email, expires] of wanted) {
      const accountId = accountIdByEmail.get(email);
      if (!accountId) continue;
      keepAccounts.add(accountId);
      const row = existingByAccount.get(accountId);

      if (row) {
        const sameExpiry = row.expires_at === null && expires === null
          || Boolean(
            row.expires_at && expires
              && new Date(row.expires_at).getTime() === new Date(expires).getTime(),
          );
        const unchanged = row.tier === APP_TIER && sameExpiry;
        if (unchanged) continue;
        summary.refreshed++;
        if (dryRun) continue;
        const { error } = await mobile
          .from("entitlements")
          .update({ tier: APP_TIER, expires_at: expires })
          .eq("id", row.id);
        if (error) throw new Error(`entitlement update failed (${row.id}): ${error.message}`);
      } else {
        summary.granted++;
        if (dryRun) continue;
        const { error } = await mobile.from("entitlements").insert({
          account_id: accountId,
          source: WEB_SOURCE,
          tier: APP_TIER,
          expires_at: expires,
          raw: { email, granted_by: WEB_GRANT_MARKER },
        });
        if (error) throw new Error(`entitlement insert failed: ${error.message}`);
      }
    }

    // --- 5. Revoke website-sourced entitlements for lapsed members --------
    const currentGrants = existing.filter(
      (row) => !row.expires_at || new Date(row.expires_at).getTime() > now,
    );
    const toRevoke = currentGrants.filter((row) => !keepAccounts.has(row.account_id));
    summary.revoke_candidates = toRevoke.length;

    const massLimit = Math.max(MASS_REVOKE_MIN, Math.ceil(currentGrants.length * MASS_REVOKE_SHARE));
    if (toRevoke.length > massLimit && !allowMassRevoke) {
      summary.revocation_blocked = true;
      console.error("website -> app sync: revocation blocked by mass-revocation guard", {
        candidates: toRevoke.length,
        current_grants: currentGrants.length,
      });
    } else {
      for (const row of toRevoke) {
        summary.revoked++;
        if (dryRun) continue;
        const { error } = await mobile
          .from("entitlements")
          .update({ expires_at: nowIso })
          .eq("id", row.id);
        if (error) throw new Error(`entitlement revoke failed: ${error.message}`);
      }
    }

    console.log("website -> app entitlement sync complete", summary);
    return json({ ok: true, ...summary, no_app_account_emails: missingAppAccount.length });
  } catch (err) {
    console.error("website -> app entitlement sync failed", err instanceof Error ? err.message : "unknown");
    return json({ error: "sync_failed", details: err instanceof Error ? err.message : "unknown" }, 500);
  }
});
