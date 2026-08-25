// Reverse membership bridge: give active WEBSITE subscribers an "essentials"
// entitlement inside the Sober Helpline App backend.
//
// Source of truth: public.provider_subscriptions on the website
//                  (provider_submission_id IS NULL, plan_type <> 'app').
// Target: the app backend's `entitlements` table, rows with source = 'website'.
//
// Rows created here are always source='website' so the nightly app -> website
// sync can ignore them (no feedback loop). App Store / RevenueCat entitlements
// are never modified.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_TIER = "essential";
const WEB_SOURCE = "website";
const GRACE_DAYS = 3;

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
};

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
  let body: { cron_secret?: string; dry_run?: boolean } = {};
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

  const now = Date.now();
  const nowIso = new Date().toISOString();

  try {
    // --- 1. Active website memberships -----------------------------------
    const { data: subs, error: subErr } = await supabase
      .from("provider_subscriptions")
      .select("user_id, status, plan_type, next_billing_date, access_ends_at")
      .is("provider_submission_id", null)
      .in("status", ["active", "cancelled"]);
    if (subErr) throw new Error(`subscription lookup failed: ${subErr.message}`);

    // email -> desired expiry (ISO or null for open-ended)
    const wanted = new Map<string, string | null>();
    const userIds = new Set<string>();

    const activeRows = (subs ?? []).filter((r) => {
      if (r.plan_type === "app") return false; // app-sourced, nothing to mirror back
      if (r.status === "active") return true;
      return Boolean(r.access_ends_at && new Date(r.access_ends_at).getTime() > now);
    });
    for (const r of activeRows) userIds.add(r.user_id);

    const emailByUser = new Map<string, string>();
    const ids = [...userIds];
    for (let i = 0; i < ids.length; i += 100) {
      const chunk = ids.slice(i, i + 100);
      const { data, error } = await supabase
        .from("profile_private")
        .select("user_id, email")
        .in("user_id", chunk);
      if (error) throw new Error(`profile_private lookup failed: ${error.message}`);
      for (const row of data ?? []) {
        if (row.email) emailByUser.set(row.user_id, row.email.toLowerCase().trim());
      }
    }

    for (const r of activeRows) {
      const email = emailByUser.get(r.user_id);
      if (!email) continue;
      let expires: string | null = null;
      if (r.status === "cancelled" && r.access_ends_at) {
        expires = r.access_ends_at;
      } else if (r.next_billing_date) {
        expires = new Date(
          new Date(r.next_billing_date).getTime() + GRACE_DAYS * 86400000,
        ).toISOString();
      }
      const current = wanted.get(email);
      const rank = (v: string | null) =>
        v === null ? Number.MAX_SAFE_INTEGER : new Date(v).getTime();
      if (!wanted.has(email) || rank(expires) > rank(current ?? null)) {
        wanted.set(email, expires);
      }
    }

    // --- 2. Resolve app accounts by email --------------------------------
    // The app's `accounts` table has no email column, so map
    // auth user email -> user_id -> account id.
    const emails = [...wanted.keys()];
    const accountIdByEmail = new Map<string, string>();
    const missingAppAccount: string[] = [];

    const { data: accountsRaw, error: accErr } = await mobile
      .from("accounts")
      .select("id, user_id")
      .limit(10000);
    if (accErr) throw new Error(`app accounts lookup failed: ${accErr.message}`);
    const accountByUserId = new Map<string, string>();
    for (const a of (accountsRaw ?? []) as { id: string; user_id: string | null }[]) {
      if (a.user_id) accountByUserId.set(a.user_id, a.id);
    }

    // Page through app auth users to build email -> user_id.
    const appUserIdByEmail = new Map<string, string>();
    for (let page = 1; page <= 50; page++) {
      const res = await fetch(
        `${mobileUrl}/auth/v1/admin/users?page=${page}&per_page=1000`,
        { headers: { apikey: mobileKey, Authorization: `Bearer ${mobileKey}` } },
      );
      if (!res.ok) throw new Error(`app auth users lookup failed [${res.status}]`);
      const payload = await res.json();
      const users: { id: string; email: string | null }[] = payload?.users ?? [];
      for (const u of users) {
        if (u.email) appUserIdByEmail.set(u.email.toLowerCase().trim(), u.id);
      }
      if (users.length < 1000) break;
    }

    for (const email of emails) {
      const appUserId = appUserIdByEmail.get(email);
      const accountId = appUserId ? accountByUserId.get(appUserId) : undefined;
      if (accountId) accountIdByEmail.set(email, accountId);
      else missingAppAccount.push(email);
    }


    // --- 3. Existing website-sourced entitlements ------------------------
    const { data: existingRaw, error: entErr } = await mobile
      .from("entitlements")
      .select("id, account_id, source, tier, expires_at")
      .eq("source", WEB_SOURCE);
    if (entErr) throw new Error(`entitlements lookup failed: ${entErr.message}`);
    const existing = (existingRaw ?? []) as MobileEntitlement[];
    const existingByAccount = new Map(existing.map((e) => [e.account_id, e]));

    const summary = {
      dry_run: dryRun,
      website_members: emails.length,
      matched_app_accounts: accountIdByEmail.size,
      no_app_account: missingAppAccount.length,
      granted: 0,
      refreshed: 0,
      revoked: 0,
    };

    // --- 4. Grant / refresh ----------------------------------------------
    const keepAccounts = new Set<string>();
    for (const [email, expires] of wanted) {
      const accountId = accountIdByEmail.get(email);
      if (!accountId) continue;
      keepAccounts.add(accountId);
      const row = existingByAccount.get(accountId);

      if (row) {
        const unchanged = row.tier === APP_TIER && row.expires_at === expires;
        if (unchanged) continue;
        summary.refreshed++;
        if (dryRun) continue;
        const { error } = await mobile
          .from("entitlements")
          .update({ tier: APP_TIER, expires_at: expires })
          .eq("id", row.id);
        if (error) throw new Error(`entitlement update failed (${email}): ${error.message}`);
      } else {
        summary.granted++;
        if (dryRun) continue;
        const { error } = await mobile.from("entitlements").insert({
          account_id: accountId,
          source: WEB_SOURCE,
          tier: APP_TIER,
          expires_at: expires,
          raw: { email, granted_by: "soberhelpline_website_membership" },
        });
        if (error) throw new Error(`entitlement insert failed (${email}): ${error.message}`);
      }
    }

    // --- 5. Revoke website-sourced entitlements for lapsed members --------
    for (const row of existing) {
      if (keepAccounts.has(row.account_id)) continue;
      if (row.expires_at && new Date(row.expires_at).getTime() <= now) continue;
      summary.revoked++;
      if (dryRun) continue;
      const { error } = await mobile
        .from("entitlements")
        .update({ expires_at: nowIso })
        .eq("id", row.id);
      if (error) throw new Error(`entitlement revoke failed: ${error.message}`);
    }

    console.log("website -> app entitlement sync complete", summary);
    return json({ ok: true, ...summary, no_app_account_emails: missingAppAccount.length });
  } catch (err) {
    console.error("website -> app entitlement sync failed", err);
    return json({ error: "sync_failed", details: String(err) }, 500);
  }
});
