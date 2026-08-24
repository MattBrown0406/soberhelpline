// Nightly sync: mirror Sober Helpline App (RevenueCat) subscriptions into
// website membership access.
//
// Source of truth: the mobile backend's `entitlements` table.
// Target: public.provider_subscriptions rows with plan_type = 'app'
//         (provider_submission_id IS NULL => is_active_family_member()).
//
// Unmatched purchases are recorded in public.app_membership_sync_issues
// for admin review. Lapsed subscriptions keep access for GRACE_DAYS.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GRACE_DAYS = 3;

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

async function mobileRest<T>(
  url: string,
  key: string,
  path: string,
): Promise<T> {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    throw new Error(`mobile REST ${path} failed [${res.status}]: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

async function mobileAuthEmail(
  url: string,
  key: string,
  userId: string,
): Promise<string | null> {
  const res = await fetch(`${url}/auth/v1/admin/users/${userId}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) return null;
  const user = await res.json();
  const email = typeof user?.email === "string" ? user.email : null;
  return email ? email.toLowerCase().trim() : null;
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

  try {
    // --- 1. Pull entitlements + accounts from the app backend --------------
    const allEntitlements = await mobileRest<Entitlement[]>(
      mobileUrl,
      mobileKey,
      "entitlements?select=id,account_id,source,tier,expires_at,raw&limit=5000",
    );
    // Ignore entitlements this platform granted from a website membership,
    // otherwise the two sync jobs would feed each other in a loop.
    const entitlements = allEntitlements.filter((e) => e.source !== "website");

    const accounts = await mobileRest<{ id: string; user_id: string | null }[]>(
      mobileUrl,
      mobileKey,
      "accounts?select=id,user_id&limit=5000",
    );
    const accountUserId = new Map(accounts.map((a) => [a.id, a.user_id]));

    // Best entitlement per account (latest expiry, null = lifetime).
    const best = new Map<string, Entitlement>();
    for (const ent of entitlements) {
      const current = best.get(ent.account_id);
      if (!current) {
        best.set(ent.account_id, ent);
        continue;
      }
      const rank = (e: Entitlement) =>
        e.expires_at === null ? Number.MAX_SAFE_INTEGER : new Date(e.expires_at).getTime();
      if (rank(ent) > rank(current)) best.set(ent.account_id, ent);
    }

    // --- 2. Resolve an email for each account ------------------------------
    const emailCache = new Map<string, string | null>();
    const active: { email: string; ent: Entitlement }[] = [];
    const inactive: { email: string; ent: Entitlement }[] = [];
    const issues: {
      email: string | null;
      app_account_id: string;
      tier: string | null;
      expires_at: string | null;
      reason: string;
      details: Record<string, unknown>;
    }[] = [];

    for (const ent of best.values()) {
      let email: string | null = null;
      const rawEmail = ent.raw && typeof ent.raw["email"] === "string"
        ? (ent.raw["email"] as string).toLowerCase().trim()
        : null;

      if (rawEmail) {
        email = rawEmail;
      } else {
        const userId = accountUserId.get(ent.account_id) ?? null;
        if (userId) {
          if (!emailCache.has(userId)) {
            emailCache.set(userId, await mobileAuthEmail(mobileUrl, mobileKey, userId));
          }
          email = emailCache.get(userId) ?? null;
        }
      }

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
        ? new Date(ent.expires_at).getTime() + GRACE_DAYS * 86400000
        : null;
      const isActive = graceUntil === null || graceUntil > now;

      (isActive ? active : inactive).push({ email, ent });
    }

    // --- 3. Map emails to website accounts ---------------------------------
    const allEmails = [...new Set([...active, ...inactive].map((r) => r.email))];
    const siteUserByEmail = new Map<string, string>();

    for (let i = 0; i < allEmails.length; i += 100) {
      const chunk = allEmails.slice(i, i + 100);
      const { data, error } = await supabase
        .from("profile_private")
        .select("user_id, email")
        .in("email", chunk);
      if (error) throw new Error(`profile_private lookup failed: ${error.message}`);
      for (const row of data ?? []) {
        if (row.email) siteUserByEmail.set(row.email.toLowerCase().trim(), row.user_id);
      }
    }

    const summary = {
      dry_run: dryRun,
      app_accounts: best.size,
      active: active.length,
      lapsed: inactive.length,
      granted: 0,
      already_active: 0,
      pending_invites: 0,
      revoked: 0,
      issues: 0,
    };

    // --- 4. Grant / refresh access for active subscribers ------------------
    for (const { email, ent } of active) {
      const userId = siteUserByEmail.get(email);
      const graceUntil = ent.expires_at
        ? new Date(new Date(ent.expires_at).getTime() + GRACE_DAYS * 86400000).toISOString()
        : null;

      if (!userId) {
        // No website account yet — queue a pending membership that the existing
        // signup trigger claims automatically, and flag it for admin review.
        summary.pending_invites++;
        issues.push({
          email,
          app_account_id: ent.account_id,
          tier: ent.tier,
          expires_at: ent.expires_at,
          reason: "no_matching_website_account",
          details: { entitlement_id: ent.id, source: ent.source },
        });
        if (!dryRun) {
          const { data: existing } = await supabase
            .from("pending_free_memberships")
            .select("id, status")
            .eq("email", email)
            .maybeSingle();
          if (!existing) {
            await supabase
              .from("pending_free_memberships")
              .insert({ email, status: "pending" });
          }
        }
        continue;
      }

      const { data: rows, error: subErr } = await supabase
        .from("provider_subscriptions")
        .select("id, status, plan_type, provider_submission_id")
        .eq("user_id", userId)
        .is("provider_submission_id", null);
      if (subErr) throw new Error(`subscription lookup failed: ${subErr.message}`);

      const appRow = (rows ?? []).find((r) => r.plan_type === "app");
      const otherActive = (rows ?? []).find(
        (r) => r.plan_type !== "app" && r.status === "active",
      );

      // Never touch PayPal / free memberships that are already active.
      if (otherActive) {
        summary.already_active++;
        continue;
      }

      if (dryRun) {
        summary.granted++;
        continue;
      }

      if (appRow) {
        const { error: updErr } = await supabase
          .from("provider_subscriptions")
          .update({
            status: "active",
            app_grace_until: graceUntil,
            next_billing_date: ent.expires_at,
            cancelled_at: null,
            cancellation_reason: null,
            access_ends_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", appRow.id);
        if (updErr) {
          throw new Error(`membership update failed for ${email}: ${updErr.message}`);
        }
        if (appRow.status === "active") summary.already_active++;
        else summary.granted++;
      } else {
        const { error: insErr } = await supabase.from("provider_subscriptions").insert({
          user_id: userId,
          provider_submission_id: null,
          plan_type: "app",
          status: "active",
          amount: 0,
          start_date: new Date().toISOString(),
          next_billing_date: ent.expires_at,
          app_grace_until: graceUntil,
        });
        if (insErr) {
          throw new Error(`membership insert failed for ${email}: ${insErr.message}`);
        }
        summary.granted++;
      }
    }

    // --- 5. Revoke access once the grace period has passed -----------------
    for (const { email } of inactive) {
      const userId = siteUserByEmail.get(email);
      if (!userId) continue;

      const { data: rows } = await supabase
        .from("provider_subscriptions")
        .select("id, status")
        .eq("user_id", userId)
        .eq("plan_type", "app")
        .is("provider_submission_id", null)
        .eq("status", "active");

      for (const row of rows ?? []) {
        summary.revoked++;
        if (dryRun) continue;
        await supabase
          .from("provider_subscriptions")
          .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
            cancellation_source: "app_sync",
            cancellation_reason: "App subscription expired (grace period elapsed)",
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);
      }
    }

    // --- 6. Record mismatches for admin review -----------------------------
    summary.issues = issues.length;
    if (!dryRun && issues.length > 0) {
      for (const issue of issues) {
        const { data: open } = await supabase
          .from("app_membership_sync_issues")
          .select("id")
          .eq("reason", issue.reason)
          .eq("status", "open")
          .eq("app_account_id", issue.app_account_id)
          .maybeSingle();
        if (open) continue;
        await supabase.from("app_membership_sync_issues").insert(issue);
      }
    }

    // Auto-close issues that have since resolved.
    if (!dryRun) {
      const resolvedEmails = allEmails.filter((e) => siteUserByEmail.has(e));
      if (resolvedEmails.length > 0) {
        await supabase
          .from("app_membership_sync_issues")
          .update({ status: "resolved", resolved_at: new Date().toISOString() })
          .eq("status", "open")
          .eq("reason", "no_matching_website_account")
          .in("email", resolvedEmails);
      }
    }

    console.log("app membership sync complete", summary);
    return json({ ok: true, ...summary });
  } catch (err) {
    console.error("app membership sync failed", err);
    return json({ error: "sync_failed", details: String(err) }, 500);
  }
});
