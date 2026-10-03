// app-sso-exchange — turns the one-time `sso_token` the Sober Helpline app adds
// to soberhelpline.com links into a real website sign-in.
//
// verify_jwt = false: the browser calls this before it has a website session.
//
// Flow (Contract A):
// 1. Redeem the token SERVER-SIDE with the app's validate-sso-token, sending the
//    shared x-membership-sync-secret, which returns who the app user is
//    ({ valid, email, first_name, tier, member }). Tokens are single-use and
//    expire after 5 minutes on the app side.
// 2. Find the website account with that login email (case-insensitive), or
//    create it (email already verified by the app).
// 3. If the app says they're a paying member, make sure they have an active
//    website family membership, using the same plan_type 'app' row that the
//    nightly sync-app-memberships keeps or revokes. Existing PayPal/free rows are
//    never touched.
// 4. Return a one-time sign-in: only the hashed token of a magic link (the
//    browser exchanges it with supabase.auth.verifyOtp). The action link itself
//    is never returned, and tokens/emails are never logged.
//
// Access to member pages is still decided by the website's own membership data
// (is_active_family_member), never by anything this function returns.

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_APP_SUPABASE_URL = "https://rjlkbxqxshohgjmomyro.supabase.co";
const TOKEN_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Same grace the nightly app sync uses. An SSO-created membership stays valid at
// least this long; the nightly sync then keeps it in line with the app (or the
// next SSO refreshes it, e.g. for organization members without an entitlement).
const APP_GRACE_DAYS = 3;
const DAY_MS = 86_400_000;
// Website staff accounts never get a passwordless sign-in from the app; they
// sign in with their website password.
const PRIVILEGED_ROLES = ["admin", "moderator"];

// Best-effort per-IP rate limit (per worker). Tokens are random UUIDs that the
// app redeems once, so this only blunts abuse of the endpoint itself.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_PER_WINDOW = 20;
const rateBuckets = new Map<string, { start: number; count: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (rateBuckets.size > 5000) {
    for (const [k, v] of rateBuckets) if (now - v.start > RATE_WINDOW_MS) rateBuckets.delete(k);
  }
  const bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.start > RATE_WINDOW_MS) {
    rateBuckets.set(ip, { start: now, count: 1 });
    return false;
  }
  bucket.count++;
  return bucket.count > RATE_MAX_PER_WINDOW;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const shortId = (id: string) => id.slice(0, 8);

type AppSsoResult = {
  valid?: boolean;
  email?: unknown;
  first_name?: unknown;
  tier?: unknown;
  member?: unknown;
};

async function findUserIdByEmail(admin: SupabaseClient, email: string): Promise<string | null> {
  // Exact login-email lookup (SQL helper added by the 2026-10-02 migration).
  const { data: exact, error: rpcError } = await admin.rpc("auth_user_id_by_email", { p_email: email });
  if (!rpcError) return typeof exact === "string" ? exact : null;

  // Until that migration runs: candidates from profile_private (user-editable, so
  // every candidate is confirmed against the login email). Emails containing
  // LIKE / PostgREST wildcard characters are matched exactly instead of by ILIKE.
  const query = admin.from("profile_private").select("user_id").limit(5);
  const { data: candidates, error } = /[*\\]/.test(email)
    ? await query.eq("email", email)
    : await query.ilike("email", email.replace(/[%_]/g, (c) => `\\${c}`));
  if (error) throw new Error(`profile lookup failed: ${error.message}`);
  for (const row of candidates ?? []) {
    const { data } = await admin.auth.admin.getUserById(row.user_id as string);
    if (data?.user?.email?.toLowerCase().trim() === email) return data.user.id;
  }
  return null;
}

async function scanAuthUsersForEmail(admin: SupabaseClient, email: string): Promise<string | null> {
  const perPage = 1000;
  for (let page = 1; page <= 1000; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`auth user scan failed: ${error.message}`);
    const users = data?.users ?? [];
    const hit = users.find((u) => u.email?.toLowerCase().trim() === email);
    if (hit) return hit.id;
    if (users.length < perPage) break;
  }
  return null;
}

async function findOrCreateUser(
  admin: SupabaseClient,
  email: string,
  firstName: string | null,
): Promise<{ userId: string; created: boolean }> {
  const existing = await findUserIdByEmail(admin, email);
  if (existing) return { userId: existing, created: false };

  // Metadata read by handle_new_user (profiles + profile_private).
  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true, // the app already verified this address
    user_metadata: {
      first_name: firstName ?? "",
      last_name: "",
      email,
      signup_source: "sober_helpline_app_sso",
    },
  });
  if (data?.user) return { userId: data.user.id, created: true };

  // Already registered (e.g. profile_private holds a different address).
  const alreadyExists = error &&
    ((error as { code?: string }).code === "email_exists" ||
      (error as { status?: number }).status === 422 ||
      /already/i.test(error.message));
  if (alreadyExists) {
    const scanned = await scanAuthUsersForEmail(admin, email);
    if (scanned) return { userId: scanned, created: false };
  }
  throw new Error(`user create failed: ${error?.message ?? "unknown"}`);
}

/**
 * An existing website account whose email was never confirmed may have been
 * registered by someone else, with a password they know. Before signing the app
 * user into it, replace that password with a random one and mark the email
 * confirmed (the app has verified it). The member can set their own password
 * later with "Forgot password?".
 */
async function secureUnconfirmedAccount(admin: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data?.user) throw new Error(`user lookup failed: ${error?.message ?? "not found"}`);
  if (data.user.email_confirmed_at) return false;

  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const randomPassword = btoa(String.fromCharCode(...bytes)).replace(/[^A-Za-z0-9]/g, "") + "Aa1!";
  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    password: randomPassword,
    email_confirm: true,
  });
  if (updateError) throw new Error(`could not secure unconfirmed account: ${updateError.message}`);
  return true;
}

/** Rows an administrator revoked (FamilyMemberManagement / member warnings). */
function isAdminRevoked(row: { status: string; cancellation_source: string | null }): boolean {
  return (row.status === "cancelled" || row.status === "expired") &&
    typeof row.cancellation_source === "string" && row.cancellation_source.startsWith("admin");
}

/**
 * Make sure an app member has an active website family membership.
 * Mirrors sync-app-memberships: plan_type 'app', app_grace_until, and never
 * touches an existing PayPal / free membership.
 */
async function ensureAppMembership(
  admin: SupabaseClient,
  userId: string,
): Promise<"admin_revoked" | "existing_membership" | "already_active" | "refreshed" | "granted"> {
  const { data: rows, error } = await admin
    .from("provider_subscriptions")
    .select("id, status, plan_type, app_grace_until, access_ends_at, cancellation_source")
    .eq("user_id", userId)
    .is("provider_submission_id", null);
  if (error) throw new Error(`membership lookup failed: ${error.message}`);

  const now = Date.now();
  const list = rows ?? [];
  // An administrator removed this member's access: never grant or reactivate it here.
  if (list.some(isAdminRevoked)) return "admin_revoked";
  const hasOtherActive = list.some((r) =>
    r.plan_type !== "app" && r.status === "active" &&
    (r.access_ends_at === null || new Date(r.access_ends_at).getTime() > now)
  );
  if (hasOtherActive) return "existing_membership";

  const graceUntilMs = now + APP_GRACE_DAYS * DAY_MS;
  const graceUntil = new Date(graceUntilMs).toISOString();
  const appRow = list.find((r) => r.plan_type === "app" && r.status === "active") ??
    list.find((r) => r.plan_type === "app");

  if (appRow) {
    const graceMs = appRow.app_grace_until ? new Date(appRow.app_grace_until).getTime() : null;
    // Never shorten: an open-ended (null) or later grace set by the nightly sync wins.
    if (appRow.status === "active" && (graceMs === null || graceMs >= graceUntilMs - 60_000)) {
      return "already_active";
    }
    // Inactive row, or an active row whose grace ends sooner: (re)activate with the SSO grace.
    const { error: updErr } = await admin
      .from("provider_subscriptions")
      .update({
        status: "active",
        app_grace_until: graceUntil,
        cancelled_at: null,
        cancellation_reason: null,
        cancellation_source: null,
        access_ends_at: null,
        updated_at: new Date(now).toISOString(),
      })
      .eq("id", appRow.id);
    if (updErr) throw new Error(`membership update failed: ${updErr.message}`);
    return appRow.status === "active" ? "refreshed" : "granted";
  }

  const { error: insErr } = await admin.from("provider_subscriptions").insert({
    user_id: userId,
    provider_submission_id: null,
    plan_type: "app",
    status: "active",
    amount: 0,
    start_date: new Date(now).toISOString(),
    next_billing_date: null,
    app_grace_until: graceUntil,
  });
  if (insErr) throw new Error(`membership insert failed: ${insErr.message}`);
  return "granted";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, code: "method_not_allowed" }, 405);

  let ssoToken = "";
  try {
    const body = await req.json();
    ssoToken = typeof body?.sso_token === "string" ? body.sso_token.trim() : "";
  } catch {
    return json({ ok: false, code: "invalid_body" }, 400);
  }
  if (!TOKEN_RE.test(ssoToken)) return json({ ok: false, code: "invalid_token" }, 400);

  const ip = (req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown").trim();
  if (rateLimited(ip)) return json({ ok: false, code: "rate_limited" }, 429);

  const syncSecret = Deno.env.get("MEMBERSHIP_SYNC_SECRET") ?? "";
  const appUrl = (Deno.env.get("MOBILE_SUPABASE_URL") ?? "").trim().replace(/\/+$/, "") ||
    DEFAULT_APP_SUPABASE_URL;
  const siteUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const siteKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!syncSecret || !siteUrl || !siteKey) {
    console.error("app-sso-exchange: missing MEMBERSHIP_SYNC_SECRET or Supabase env");
    return json({ ok: false, code: "server_misconfigured" }, 500);
  }

  // --- 1. Redeem the token with the app (server to server) ----------------
  let result: AppSsoResult;
  try {
    const res = await fetch(`${appUrl}/functions/v1/validate-sso-token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-membership-sync-secret": syncSecret,
      },
      body: JSON.stringify({ token: ssoToken }),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status >= 500) {
      console.error("app-sso-exchange: app validate-sso-token unavailable", res.status);
      return json({ ok: false, code: "app_unavailable" }, 502);
    }
    result = (await res.json().catch(() => ({}))) as AppSsoResult;
  } catch {
    console.error("app-sso-exchange: app validate-sso-token unreachable");
    return json({ ok: false, code: "app_unavailable" }, 502);
  }

  if (result.valid !== true) {
    return json({ ok: false, code: "invalid_or_expired" }, 401);
  }

  const email = typeof result.email === "string" ? result.email.toLowerCase().trim() : "";
  if (!email) {
    // A valid token without an email means the app did not accept our secret
    // (it fell back to the legacy response). The token is now spent.
    console.error("app-sso-exchange: app returned no email (check MEMBERSHIP_SYNC_SECRET matches on both projects)");
    return json({ ok: false, code: "server_misconfigured" }, 500);
  }
  if (!EMAIL_RE.test(email) || email.length > 320) {
    return json({ ok: false, code: "invalid_account" }, 400);
  }
  const firstName = typeof result.first_name === "string" ? result.first_name.slice(0, 100) : null;
  const appMember = result.member === true;

  const admin = createClient(siteUrl, siteKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    // --- 2. Website account ------------------------------------------------
    const { userId, created } = await findOrCreateUser(admin, email, firstName);

    const { data: roles, error: rolesError } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", PRIVILEGED_ROLES)
      .limit(1);
    if (rolesError) throw new Error(`role lookup failed: ${rolesError.message}`);
    if ((roles ?? []).length > 0) {
      console.log("app-sso-exchange: staff account, password sign-in required", shortId(userId));
      return json({ ok: false, code: "password_signin_required" }, 403);
    }

    const secured = created ? false : await secureUnconfirmedAccount(admin, userId);

    // --- 3. Membership for paying app members -------------------------------
    let membership: string | null = null;
    let membershipReady = !appMember;
    if (appMember) {
      try {
        membership = await ensureAppMembership(admin, userId);
        membershipReady = true;
      } catch (err) {
        // Sign-in still works; the member page will offer next steps and the
        // nightly sync (or the next tap in the app) fills the membership in.
        console.error("app-sso-exchange: membership ensure failed", shortId(userId), err instanceof Error ? err.message : "unknown");
      }
    }

    // --- 4. One-time sign-in -------------------------------------------------
    const { data: link, error: linkError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    const tokenHash = link?.properties?.hashed_token;
    if (linkError || !tokenHash) {
      console.error("app-sso-exchange: sign-in link failed", shortId(userId), linkError?.message ?? "no token");
      return json({ ok: false, code: "signin_failed" }, 500);
    }

    console.log("app-sso-exchange: ok", {
      user: shortId(userId),
      created,
      app_member: appMember,
      membership,
      secured_unconfirmed: secured,
    });

    return json({
      ok: true,
      email,
      token_hash: tokenHash,
      // Informational only (for messaging); access is decided by website data.
      app_member: appMember,
      membership_ready: membershipReady,
    });
  } catch (err) {
    console.error("app-sso-exchange: failed", err instanceof Error ? err.message : "unknown");
    return json({ ok: false, code: "exchange_failed" }, 500);
  }
});
