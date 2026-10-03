// Nightly sync: mirror Sober Helpline App subscriptions into website membership
// access.
//
// Source of truth: the app backend's `entitlements` table (+ its auth users for
// emails). Target: public.provider_subscriptions rows with plan_type = 'app'
// (provider_submission_id IS NULL => is_active_family_member()).
//
// Rules:
// - Only APP-ORIGIN paid access counts: tiers essential / premium / org, and never
//   an entitlement that came from the website (source 'web', written by the app's
//   sync-web-membership, or raw.granted_by = the website marker, written by
//   sync-website-to-app-entitlements). Otherwise web and app grants keep each
//   other alive forever.
// - App users are matched to website accounts by their website LOGIN email
//   (auth users), never by the user-editable profile_private.email.
// - Full reconciliation: an active 'app' row whose user no longer has qualifying
//   app access is revoked once its app_grace_until has passed. Rows created by the
//   website's app-sso-exchange carry a short grace and are refreshed by it.
// - Everything is paged (PostgREST and the auth admin API cap page sizes), and a
//   run that would revoke an unusually large share of app memberships stops and
//   reports instead. Re-run with { "allow_mass_revoke": true } after checking a
//   { "dry_run": true } run.
//
// Unmatched purchases are recorded in public.app_membership_sync_issues for admin
// review and queued in pending_free_memberships with status 'app_pending' (the
// signup trigger turns those into an app-type membership, not a free one).

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GRACE_DAYS = 3;
const DAY_MS = 86_400_000;
const APP_MEMBER_TIERS = new Set(["essential", "premium", "org"]);
const WEB_GRANT_MARKER = "soberhelpline_website_membership";
const APP_PENDING_STATUS = "app_pending";
const PAGE_SIZE = 1000;
// Mass-revocation guard: block when a run would revoke more than this share of
// the currently active app memberships (and more than MASS_REVOKE_MIN rows).
const MASS_REVOKE_SHARE = 0.25;
const MASS_REVOKE_MIN = 10;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

type Entitlement = {
  id: string;
  account_id: string;
  source: string | null;
  tier: string | null;
  expires_at: string | null;
  raw: Record<string, unknown> | null;
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
  app_account_id: string;
  tier: string | null;
  expires_at: string | null;
  reason: string;
  details: Record<string, unknown>;
};

/** True when this entitlement is paid access that originated in the app. */
function isAppOriginMembership(e: Entitlement): boolean {
  if (e.source === "web") return false;
  if (e.raw && e.raw["granted_by"] === WEB_GRANT_MARKER) return false;
  return e.tier !== null && APP_MEMBER_TIERS.has(e.tier);
}

const expiryRank = (iso: string | null) =>
  iso === null ? Number.MAX_SAFE_INTEGER : new Date(iso).getTime();

const sameInstant = (a: string | null, b: string | null) =>
  (a === null && b === null) ||
  (a !== null && b !== null && new Date(a).getTime() === new Date(b).getTime());

/** Read every row of a PostgREST table on the app backend, page by page. */
async function mobileRestAll<T>(
  baseUrl: string,
  key: string,
  table: string,
  select: string,
): Promise<T[]> {
  const out: T[] = [];
  let total: number | null = null;
  for (let offset = 0; ;) {
    const res = await fetch(
      `${baseUrl}/rest/v1/${table}?select=${select}&order=id.asc&limit=${PAGE_SIZE}&offset=${offset}`,
      { headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" } },
    );
    if (!res.ok) {
      throw new Error(`app REST ${table} failed [${res.status}]`);
    }
    if (total === null) {
      const range = res.headers.get("content-range") ?? "";
      const parsed = Number(range.split("/")[1]);
      total = Number.isFinite(parsed) ? parsed : null;
    }
    const rows = (await res.json()) as T[];
    out.push(...rows);
    offset += rows.length;
    if (rows.length === 0) break;
    if (total !== null ? offset >= total : rows.length < PAGE_SIZE) break;
  }
  if (total !== null && out.length < total) {
    throw new Error(`app REST ${table} returned ${out.length} of ${total} rows`);
  }
  return out;
}

/** Every auth user (id + lowercased email) of a Supabase project, page by page. */
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

  // --- Auth: cron secret (body) or admin JWT -------------------------------
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
  const nowIso = new Date(now).toISOString();

  try {
    // --- 1. Pull entitlements + accounts + auth emails from the app ----------
    const allEntitlements = await mobileRestAll<Entitlement>(
      mobileUrl,
      mobileKey,
      "entitlements",
      "id,account_id,source,tier,expires_at,raw",
    );
    const entitlements = allEntitlements.filter(isAppOriginMembership);

    const accounts = await mobileRestAll<{ id: string; user_id: string | null }>(
      mobileUrl,
      mobileKey,
      "accounts",
      "id,user_id",
    );
    const accountUserId = new Map(accounts.map((a) => [a.id, a.user_id]));

    const appUsers = await listAuthUsers(mobileUrl, mobileKey);
    const appEmailByUserId = new Map(appUsers.map((u) => [u.id, u.email]));

    // Best qualifying entitlement per account (latest expiry, null = lifetime).
    const best = new Map<string, Entitlement>();
    for (const ent of entitlements) {
      const current = best.get(ent.account_id);
      if (!current || expiryRank(ent.expires_at) > expiryRank(current.expires_at)) {
        best.set(ent.account_id, ent);
      }
    }

    // --- 2. Resolve an email for each account ------------------------------
    const active: { email: string; ent: Entitlement }[] = [];
    const inactive: { email: string; ent: Entitlement }[] = [];
    const issues: Issue[] = [];

    for (const ent of best.values()) {
      const userId = accountUserId.get(ent.account_id) ?? null;
      const authEmail = userId ? appEmailByUserId.get(userId) ?? null : null;
      const rawEmail = ent.raw && typeof ent.raw["email"] === "string"
        ? (ent.raw["email"] as string).toLowerCase().trim()
        : null;
      const email = authEmail ?? rawEmail;

      if (!email) {
        issues.push({
          email: null,
          app_account_id: ent.account_id,
          tier: ent.tier,
          expires_at: ent.expires_at,
          reason: "no_email_on_app_account",
          details: { entitlement_id: ent.id, source: ent.source },
        });
        continue;
      }

      const graceUntil = ent.expires_at
        ? new Date(ent.expires_at).getTime() + GRACE_DAYS * DAY_MS
        : null;
      const isActive = graceUntil === null || graceUntil > now;
      (isActive ? active : inactive).push({ email, ent });
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
    // One target per website user: the best (latest) active entitlement.
    const activeByUser = new Map<string, { email: string; ent: Entitlement }>();
    const unmatched: { email: string; ent: Entitlement }[] = [];
    for (const entry of active) {
      const userId = siteUserByEmail.get(entry.email);
      if (!userId) {
        unmatched.push(entry);
        continue;
      }
      const current = activeByUser.get(userId);
      if (!current || expiryRank(entry.ent.expires_at) > expiryRank(current.ent.expires_at)) {
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

    for (const [userId, { ent }] of activeByUser) {
      const graceUntil = ent.expires_at
        ? new Date(new Date(ent.expires_at).getTime() + GRACE_DAYS * DAY_MS).toISOString()
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
          sameInstant(appRow.next_billing_date, ent.expires_at);
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
            next_billing_date: ent.expires_at,
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
          next_billing_date: ent.expires_at,
          app_grace_until: graceUntil,
        });
        if (insErr) throw new Error(`membership insert failed: ${insErr.message}`);
      }
    }

    // --- 6. App subscribers with no website account yet ---------------------
    // Queue an 'app_pending' invite that the signup trigger turns into an
    // app-type membership (which this sync then keeps or revokes).
    summary.pending_invites = unmatched.length;
    for (const { email, ent } of unmatched) {
      issues.push({
        email,
        app_account_id: ent.account_id,
        tier: ent.tier,
        expires_at: ent.expires_at,
        reason: "no_matching_website_account",
        details: { entitlement_id: ent.id, source: ent.source },
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
      (entitlements.length === 0 && revokeCandidates.length > 0);
    if (suspicious && !allowMassRevoke) {
      summary.revocation_blocked = true;
      console.error("app membership sync: revocation blocked by mass-revocation guard", {
        candidates: revokeCandidates.length,
        active_app_rows: activeAppRows.length,
        app_entitlements: entitlements.length,
      });
      issues.push({
        email: null,
        app_account_id: "",
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
    if (!dryRun && issues.length > 0) {
      const openKeys = new Set<string>();
      for (let from = 0; ;) {
        const { data, error } = await supabase
          .from("app_membership_sync_issues")
          .select("id, reason, app_account_id")
          .eq("status", "open")
          .order("id", { ascending: true })
          .range(from, from + PAGE_SIZE - 1);
        if (error) throw new Error(`issue lookup failed: ${error.message}`);
        const rows = data ?? [];
        for (const r of rows) openKeys.add(`${r.reason}|${r.app_account_id ?? ""}`);
        from += rows.length;
        if (rows.length < PAGE_SIZE) break;
      }
      for (const issue of issues) {
        const key = `${issue.reason}|${issue.app_account_id}`;
        if (openKeys.has(key)) continue;
        openKeys.add(key);
        const { error } = await supabase.from("app_membership_sync_issues").insert({
          ...issue,
          app_account_id: issue.app_account_id || null,
        });
        if (error && error.code !== "23505") {
          console.error("sync issue insert failed", error.code ?? error.message);
        }
      }
    }

    // Auto-close "no website account" issues that have since resolved.
    if (!dryRun) {
      const resolvedEmails = [...new Set([...active, ...inactive].map((r) => r.email))]
        .filter((e) => siteUserByEmail.has(e));
      for (let i = 0; i < resolvedEmails.length; i += 100) {
        await supabase
          .from("app_membership_sync_issues")
          .update({ status: "resolved", resolved_at: nowIso })
          .eq("status", "open")
          .eq("reason", "no_matching_website_account")
          .in("email", resolvedEmails.slice(i, i + 100));
      }
    }

    console.log("app membership sync complete", summary);
    return json({ ok: true, ...summary });
  } catch (err) {
    console.error("app membership sync failed", err instanceof Error ? err.message : "unknown");
    return json({ error: "sync_failed", details: err instanceof Error ? err.message : "unknown" }, 500);
  }
});
