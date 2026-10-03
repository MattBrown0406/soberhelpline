// Nightly sync: mirror Sober Helpline App subscriptions into website membership
// access.
//
// Source of truth: the app's `membership-export` function (server to server,
// x-membership-sync-secret = MEMBERSHIP_SYNC_SECRET). It returns, page by page,
// every VERIFIED app account with active app-origin paid access:
// { email, tier: "essential" | "premier" | "org", expires_at }. The website never
// reads the app database directly.
// Target: public.provider_subscriptions rows with plan_type = 'app'
// (provider_submission_id IS NULL => is_active_family_member()).
//
// Rules:
// - Only APP-ORIGIN paid access counts. The app's export already excludes
//   entitlements that came from the website (source 'web', or granted by
//   sync-website-to-app-entitlements), so web and app grants never keep each
//   other alive.
// - App users are matched to website accounts by their website LOGIN email
//   (auth users), never by the user-editable profile_private.email.
// - Full reconciliation: an active 'app' row whose user no longer has qualifying
//   app access is revoked once its app_grace_until has passed. Rows created by the
//   website's app-sso-exchange carry a short grace and are refreshed by it.
// - Everything is paged, and a run that would revoke an unusually large share of
//   app memberships stops and reports instead. Re-run with
//   { "allow_mass_revoke": true } after checking a { "dry_run": true } run.
// - If the app's export can't be read completely (not deployed yet = 404, wrong
//   secret, timeout, bad response), the run fails and changes nothing.
//
// Unmatched purchases are recorded in public.app_membership_sync_issues for admin
// review and queued in pending_free_memberships with status 'app_pending' (the
// signup trigger turns those into an app-type membership, not a free one).

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
// The export sends "premier" for the app's premium tier; "premium" is accepted too.
const APP_TIERS = new Set(["essential", "premier", "premium", "org"]);
const APP_PENDING_STATUS = "app_pending";
const PAGE_SIZE = 1000;
// membership-export paging: up to 1000 rows per call, 30 s per call.
const EXPORT_PAGE_LIMIT = 1000;
const EXPORT_MAX_PAGES = 500;
const APP_CALL_TIMEOUT_MS = 30_000;
// Mass-revocation guard: block when a run would revoke more than this share of
// the currently active app memberships (and more than MASS_REVOKE_MIN rows).
const MASS_REVOKE_SHARE = 0.25;
const MASS_REVOKE_MIN = 10;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/** One app account with active app-origin paid access (from membership-export). */
type AppMember = {
  email: string;
  tier: string;
  expires_at: string | null;
};

type FamilyRow = {
  id: string;
  user_id: string;
  status: string;
  plan_type: string | null;
  app_grace_until: string | null;
  next_billing_date: string | null;
  access_ends_at: string | null;
  cancellation_source: string | null;
};

/** A membership an administrator revoked (admin panel or member warnings). */
const isAdminRevoked = (r: FamilyRow) =>
  (r.status === "cancelled" || r.status === "expired") &&
  typeof r.cancellation_source === "string" && r.cancellation_source.startsWith("admin");

type Issue = {
  email: string | null;
  tier: string | null;
  expires_at: string | null;
  reason: string;
  details: Record<string, unknown>;
};

const expiryRank = (iso: string | null) =>
  iso === null ? Number.MAX_SAFE_INTEGER : new Date(iso).getTime();

const sameInstant = (a: string | null, b: string | null) =>
  (a === null && b === null) ||
  (a !== null && b !== null && new Date(a).getTime() === new Date(b).getTime());

/** A failed call to the app; `code` goes back to the caller, nothing was changed. */
class AppCallError extends Error {
  constructor(public code: string, message: string, public status = 502) {
    super(message);
  }
}

/**
 * Read every page of the app's membership-export. Throws AppCallError unless
 * the whole list was read, so a partial read can never look like "these
 * members lapsed".
 */
async function fetchAppMembers(appUrl: string, secret: string): Promise<AppMember[]> {
  const out: AppMember[] = [];
  const seenCursors = new Set<string>();
  let cursor: string | null = null;

  for (let page = 0; page < EXPORT_MAX_PAGES; page++) {
    let res: Response;
    try {
      res = await fetch(`${appUrl}/functions/v1/membership-export`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-membership-sync-secret": secret,
        },
        body: JSON.stringify({ cursor, limit: EXPORT_PAGE_LIMIT }),
        signal: AbortSignal.timeout(APP_CALL_TIMEOUT_MS),
      });
    } catch {
      throw new AppCallError("app_unavailable", "The app's membership-export did not answer (timeout or network error).");
    }

    if (res.status === 404) {
      await res.body?.cancel();
      throw new AppCallError(
        "app_function_missing",
        "The app's membership-export function is not deployed yet (404). Nothing was changed; the sync will work once the app backend is released.",
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
    if (!res.ok) {
      await res.body?.cancel();
      throw new AppCallError("app_error", `The app's membership-export failed (${res.status}).`);
    }

    const payload = await res.json().catch(() => null) as
      | { members?: unknown; next_cursor?: unknown }
      | null;
    const members = payload?.members;
    if (!payload || !Array.isArray(members)) {
      throw new AppCallError("app_bad_response", "The app's membership-export returned an unexpected response.");
    }
    for (const m of members as Record<string, unknown>[]) {
      const email = typeof m?.email === "string" ? m.email.toLowerCase().trim() : "";
      const tier = typeof m?.tier === "string" ? m.tier : "";
      const expires = m?.expires_at;
      const expiresOk = expires === null || expires === undefined ||
        (typeof expires === "string" && Number.isFinite(new Date(expires).getTime()));
      if (!email || !APP_TIERS.has(tier) || !expiresOk) {
        throw new AppCallError("app_bad_response", "The app's membership-export returned a malformed member row.");
      }
      out.push({
        email,
        tier: tier === "premium" ? "premier" : tier,
        expires_at: typeof expires === "string" ? expires : null,
      });
    }

    const next = payload.next_cursor;
    if (next === null || (next === undefined && members.length < EXPORT_PAGE_LIMIT)) return out;
    if (typeof next !== "string" || next === "") {
      throw new AppCallError("app_bad_response", "The app's membership-export returned no usable next_cursor.");
    }
    if (seenCursors.has(next)) {
      throw new AppCallError("app_bad_response", "The app's membership-export repeated a cursor.");
    }
    seenCursors.add(next);
    cursor = next;
  }
  throw new AppCallError("app_bad_response", `The app's membership-export had more than ${EXPORT_MAX_PAGES} pages.`);
}

/** Every auth user (id + lowercased email) of THIS project, page by page. */
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const appUrl = (Deno.env.get("MOBILE_SUPABASE_URL") ?? "").trim().replace(/\/+$/, "") ||
    DEFAULT_APP_SUPABASE_URL;
  const syncSecret = Deno.env.get("MEMBERSHIP_SYNC_SECRET") ?? "";
  const siteUrl = Deno.env.get("SUPABASE_URL");
  const siteKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!syncSecret || !siteUrl || !siteKey) {
    console.error("app membership sync: missing MEMBERSHIP_SYNC_SECRET or Supabase env");
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
  const nowIso = new Date(now).toISOString();

  try {
    // --- 1. Pull current app members from the app --------------------------
    const appMembers = await fetchAppMembers(appUrl, syncSecret);

    // Best entry per email (latest expiry, null = no expiry).
    const best = new Map<string, AppMember>();
    for (const m of appMembers) {
      const current = best.get(m.email);
      if (!current || expiryRank(m.expires_at) > expiryRank(current.expires_at)) {
        best.set(m.email, m);
      }
    }

    // --- 2. Active (inside expiry + grace) vs lapsed -------------------------
    const active: AppMember[] = [];
    const inactive: AppMember[] = [];
    for (const m of best.values()) {
      const graceUntil = m.expires_at
        ? new Date(m.expires_at).getTime() + GRACE_DAYS * DAY_MS
        : null;
      const isActive = graceUntil === null || graceUntil > now;
      (isActive ? active : inactive).push(m);
    }

    // --- 3. Map emails to website accounts (login email only) ---------------
    const siteUsers = await listAuthUsers(siteUrl, siteKey);
    const siteUserByEmail = new Map<string, string>();
    for (const u of siteUsers) if (u.email) siteUserByEmail.set(u.email, u.id);

    // --- 4. Current website family memberships -----------------------------
    const familyRows: FamilyRow[] = [];
    {
      let total: number | null = null;
      for (let from = 0; ;) {
        const { data, error, count } = await supabase
          .from("provider_subscriptions")
          .select("id, user_id, status, plan_type, app_grace_until, next_billing_date, access_ends_at, cancellation_source", {
            count: "exact",
          })
          .is("provider_submission_id", null)
          .order("id", { ascending: true })
          .range(from, from + PAGE_SIZE - 1);
        if (error) throw new Error(`membership lookup failed: ${error.message}`);
        if (total === null) total = count ?? null;
        const rows = (data ?? []) as FamilyRow[];
        familyRows.push(...rows);
        from += rows.length;
        if (rows.length === 0) break;
        if (total !== null ? from >= total : rows.length < PAGE_SIZE) break;
      }
      if (total !== null && familyRows.length < total) {
        throw new Error(`membership lookup returned ${familyRows.length} of ${total} rows`);
      }
    }
    const rowsByUser = new Map<string, FamilyRow[]>();
    for (const row of familyRows) {
      const list = rowsByUser.get(row.user_id) ?? [];
      list.push(row);
      rowsByUser.set(row.user_id, list);
    }

    const issues: Issue[] = [];
    const summary = {
      dry_run: dryRun,
      app_accounts: best.size,
      active: active.length,
      lapsed: inactive.length,
      granted: 0,
      refreshed: 0,
      already_active: 0,
      pending_invites: 0,
      admin_revoked_skipped: 0,
      revoke_candidates: 0,
      revoked: 0,
      revocation_blocked: false,
      issues: 0,
    };

    // --- 5. Grant / refresh access for active subscribers ------------------
    // One target per website user: the best (latest) active app membership.
    const activeByUser = new Map<string, AppMember>();
    const unmatched: AppMember[] = [];
    for (const entry of active) {
      const userId = siteUserByEmail.get(entry.email);
      if (!userId) {
        unmatched.push(entry);
        continue;
      }
      const current = activeByUser.get(userId);
      if (!current || expiryRank(entry.expires_at) > expiryRank(current.expires_at)) {
        activeByUser.set(userId, entry);
      }
    }

    // An administrator removed these members' access: never re-grant it (and any
    // app row of theirs that is somehow still active is revoked below).
    const adminRevokedUsers = new Set<string>();
    for (const [userId, rows] of rowsByUser) {
      if (rows.some(isAdminRevoked)) adminRevokedUsers.add(userId);
    }
    for (const userId of [...activeByUser.keys()]) {
      if (adminRevokedUsers.has(userId)) {
        activeByUser.delete(userId);
        summary.admin_revoked_skipped++;
      }
    }

    for (const [userId, member] of activeByUser) {
      const graceUntil = member.expires_at
        ? new Date(new Date(member.expires_at).getTime() + GRACE_DAYS * DAY_MS).toISOString()
        : null;
      const rows = rowsByUser.get(userId) ?? [];

      // Never touch PayPal / free memberships that are already active (an active
      // promo row past its access end date no longer counts).
      if (
        rows.some((r) =>
          r.plan_type !== "app" && r.status === "active" &&
          (r.access_ends_at === null || new Date(r.access_ends_at).getTime() > now)
        )
      ) {
        summary.already_active++;
        continue;
      }

      const appRow = rows.find((r) => r.plan_type === "app" && r.status === "active") ??
        rows.find((r) => r.plan_type === "app");

      if (appRow) {
        const unchanged = appRow.status === "active" &&
          sameInstant(appRow.app_grace_until, graceUntil) &&
          sameInstant(appRow.next_billing_date, member.expires_at);
        if (unchanged) {
          summary.already_active++;
          continue;
        }
        if (appRow.status === "active") summary.refreshed++;
        else summary.granted++;
        if (dryRun) continue;
        const { error: updErr } = await supabase
          .from("provider_subscriptions")
          .update({
            status: "active",
            app_grace_until: graceUntil,
            next_billing_date: member.expires_at,
            cancelled_at: null,
            cancellation_reason: null,
            cancellation_source: null,
            access_ends_at: null,
            updated_at: nowIso,
          })
          .eq("id", appRow.id);
        if (updErr) throw new Error(`membership update failed (row ${appRow.id}): ${updErr.message}`);
      } else {
        summary.granted++;
        if (dryRun) continue;
        const { error: insErr } = await supabase.from("provider_subscriptions").insert({
          user_id: userId,
          provider_submission_id: null,
          plan_type: "app",
          status: "active",
          amount: 0,
          start_date: nowIso,
          next_billing_date: member.expires_at,
          app_grace_until: graceUntil,
        });
        if (insErr) throw new Error(`membership insert failed: ${insErr.message}`);
      }
    }

    // --- 6. App subscribers with no website account yet ---------------------
    // Queue an 'app_pending' invite that the signup trigger turns into an
    // app-type membership (which this sync then keeps or revokes).
    summary.pending_invites = unmatched.length;
    for (const m of unmatched) {
      issues.push({
        email: m.email,
        tier: m.tier,
        expires_at: m.expires_at,
        reason: "no_matching_website_account",
        details: { source: "membership-export" },
      });
    }
    if (!dryRun && unmatched.length > 0) {
      const unmatchedEmails = [...new Set(unmatched.map((u) => u.email))];
      const existingPending = new Set<string>();
      for (let i = 0; i < unmatchedEmails.length; i += 100) {
        const chunk = unmatchedEmails.slice(i, i + 100);
        const { data, error } = await supabase
          .from("pending_free_memberships")
          .select("email")
          .in("email", chunk);
        if (error) throw new Error(`pending invite lookup failed: ${error.message}`);
        for (const row of data ?? []) existingPending.add(String(row.email).toLowerCase());
      }
      const toInsert = unmatchedEmails
        .filter((e) => !existingPending.has(e))
        .map((email) => ({ email, status: APP_PENDING_STATUS }));
      for (let i = 0; i < toInsert.length; i += 100) {
        // email is UNIQUE: never overwrite an existing (e.g. admin) invite.
        const { error } = await supabase
          .from("pending_free_memberships")
          .upsert(toInsert.slice(i, i + 100), { onConflict: "email", ignoreDuplicates: true });
        if (error) console.error("pending invite insert failed", error.code ?? error.message);
      }
    }

    // --- 7. Revoke app memberships no longer backed by the app --------------
    const activeAppRows = familyRows.filter((r) => r.plan_type === "app" && r.status === "active");
    const revokeCandidates = activeAppRows.filter((r) => {
      if (adminRevokedUsers.has(r.user_id)) return true;
      if (activeByUser.has(r.user_id)) return false;
      // Keep rows still inside their grace window (e.g. just created by app-sso-exchange).
      return r.app_grace_until === null || new Date(r.app_grace_until).getTime() <= now;
    });
    summary.revoke_candidates = revokeCandidates.length;

    const massLimit = Math.max(MASS_REVOKE_MIN, Math.ceil(activeAppRows.length * MASS_REVOKE_SHARE));
    const suspicious = revokeCandidates.length > massLimit ||
      (best.size === 0 && revokeCandidates.length > 0);
    if (suspicious && !allowMassRevoke) {
      summary.revocation_blocked = true;
      console.error("app membership sync: revocation blocked by mass-revocation guard", {
        candidates: revokeCandidates.length,
        active_app_rows: activeAppRows.length,
        app_members: best.size,
      });
      issues.push({
        email: null,
        tier: null,
        expires_at: null,
        reason: "mass_revocation_blocked",
        details: {
          candidates: revokeCandidates.length,
          active_app_rows: activeAppRows.length,
          note: "Check a dry_run, then re-run with allow_mass_revoke: true",
        },
      });
    } else {
      for (const row of revokeCandidates) {
        summary.revoked++;
        if (dryRun) continue;
        const { error } = await supabase
          .from("provider_subscriptions")
          .update({
            status: "cancelled",
            cancelled_at: nowIso,
            cancellation_source: "app_sync",
            cancellation_reason: "App subscription ended (grace period elapsed)",
            updated_at: nowIso,
          })
          .eq("id", row.id)
          .eq("status", "active");
        if (error) throw new Error(`membership revoke failed (row ${row.id}): ${error.message}`);
      }
    }

    // --- 8. Record mismatches for admin review -----------------------------
    summary.issues = issues.length;
    if (!dryRun) {
      // Open issues, keyed by reason + email (older rows also carry an app
      // account id; the export no longer sends one).
      const openIssues: { id: string; reason: string; email: string | null }[] = [];
      for (let from = 0; ;) {
        const { data, error } = await supabase
          .from("app_membership_sync_issues")
          .select("id, reason, email")
          .eq("status", "open")
          .order("id", { ascending: true })
          .range(from, from + PAGE_SIZE - 1);
        if (error) throw new Error(`issue lookup failed: ${error.message}`);
        const rows = (data ?? []) as { id: string; reason: string; email: string | null }[];
        openIssues.push(...rows);
        from += rows.length;
        if (rows.length < PAGE_SIZE) break;
      }
      const issueKey = (reason: string, email: string | null) =>
        `${reason}|${(email ?? "").toLowerCase().trim()}`;
      const openKeys = new Set(openIssues.map((r) => issueKey(r.reason, r.email)));

      for (const issue of issues) {
        const key = issueKey(issue.reason, issue.email);
        if (openKeys.has(key)) continue;
        openKeys.add(key);
        const { error } = await supabase.from("app_membership_sync_issues").insert({
          ...issue,
          app_account_id: null,
        });
        if (error && error.code !== "23505") {
          console.error("sync issue insert failed", error.code ?? error.message);
        }
      }

      // Auto-close "no website account" issues whose email now has a website
      // account.
      const resolvedIds = openIssues
        .filter((r) =>
          r.reason === "no_matching_website_account" && r.email &&
          siteUserByEmail.has(r.email.toLowerCase().trim())
        )
        .map((r) => r.id);
      for (let i = 0; i < resolvedIds.length; i += 100) {
        await supabase
          .from("app_membership_sync_issues")
          .update({ status: "resolved", resolved_at: nowIso })
          .eq("status", "open")
          .in("id", resolvedIds.slice(i, i + 100));
      }
    }

    console.log("app membership sync complete", summary);
    return json({ ok: true, ...summary });
  } catch (err) {
    if (err instanceof AppCallError) {
      console.error(`app membership sync stopped before any change: ${err.code}`);
      return json({ ok: false, error: err.code, details: err.message, changed: false }, err.status);
    }
    console.error("app membership sync failed", err instanceof Error ? err.message : "unknown");
    return json({ error: "sync_failed", details: err instanceof Error ? err.message : "unknown" }, 500);
  }
});
