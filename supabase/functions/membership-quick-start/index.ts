import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// One-page family membership sign-up.
//
// Before this, a new member had to: create an account, open a confirmation
// email, come back, fill in a second form, and only then reach PayPal. This
// function lets the membership page do it in one go for a visitor who has no
// account yet:
//
//   config    the public PayPal client id, so the page can show PayPal's
//             payment box (PayPal account, or a debit or credit card typed
//             into PayPal's own fields; card numbers never reach this site).
//             Only given once this function has confirmed it can reach
//             paypal-subscriptions; otherwise the page keeps the old path.
//   start     creates the account (email NOT yet confirmed), saves the name,
//             phone and forum username, and asks paypal-subscriptions for the
//             subscription. Supabase sends its normal "confirm your email"
//             message at this point.
//   activate  after PayPal approves, marks the membership active.
//
// The new member confirms their email after paying; that link signs them in.
// Until then the account cannot be signed in to by anyone.
//
// Public endpoint (no login exists yet). It can only ever create an
// UNCONFIRMED account, or re-use one that is unconfirmed and has never had a
// membership. An address that already has a confirmed account is told to log
// in instead. Prices and promo codes are still decided in paypal-subscriptions.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const SITE_URL = "https://soberhelpline.com";
// Where the confirmation link lands. Same page the older sign-up used, so it
// is already an allowed redirect. A new member sees "your membership is
// active"; someone who never finished paying sees the checkout.
const CONFIRM_PATH = "/family-membership";

/** Preview and live sites may differ; anything else falls back to the live site. */
function siteOrigin(req: Request): string {
  const origin = (req.headers.get("origin") ?? "").trim();
  if (/^https:\/\/(www\.)?soberhelpline\.com$/i.test(origin)) return origin;
  if (/^https:\/\/[a-z0-9-]+\.(lovable\.app|lovableproject\.com)$/i.test(origin)) return origin;
  return SITE_URL;
}

// Best-effort per-IP limit (per worker), so a script cannot use this to mass
// create accounts or PayPal plans.
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX_PER_WINDOW = 12;
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
  bucket.count += 1;
  return bucket.count > RATE_MAX_PER_WINDOW;
}

/** Escapes LIKE wildcards so ilike() is a case-insensitive exact match. */
const exactPattern = (value: string) => value.replace(/[\\%_]/g, "\\$&");

const text = (value: unknown, max: number): string => (typeof value === "string" ? value.trim().slice(0, max) : "");

type Plan = "trial" | "monthly" | "annual";

interface StartInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  plan: Plan;
  discountCode: string;
}

/** Returns the cleaned input, or the name of the first field that is not usable. */
function readStartInput(body: Record<string, unknown>): StartInput | { invalid: string } {
  const firstName = text(body.firstName, 50);
  const lastName = text(body.lastName, 50);
  const email = text(body.email, 255).toLowerCase();
  const phone = text(body.phone, 30);
  const username = text(body.username, 30);
  const password = typeof body.password === "string" ? body.password : "";
  const plan = body.plan;
  const discountCode = text(body.discountCode, 50).toUpperCase();

  if (!firstName) return { invalid: "firstName" };
  if (!lastName) return { invalid: "lastName" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { invalid: "email" };
  if (phone.replace(/\D/g, "").length < 10) return { invalid: "phone" };
  if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) return { invalid: "username" };
  if (password.length < 8 || password.length > 72) return { invalid: "password" };
  if (plan !== "trial" && plan !== "monthly" && plan !== "annual") return { invalid: "plan" };
  return { firstName, lastName, email, phone, username, password, plan, discountCode };
}

/** The account whose LOGIN email is `email` (never the editable profile email alone). */
async function findUserIdByEmail(admin: SupabaseClient, email: string): Promise<string | null> {
  const { data: exact, error: rpcError } = await admin.rpc("auth_user_id_by_email", { p_email: email });
  if (!rpcError) return typeof exact === "string" ? exact : null;

  const query = admin.from("profile_private").select("user_id").limit(5);
  const { data: candidates, error } = /[*\\]/.test(email)
    ? await query.eq("email", email)
    : await query.ilike("email", exactPattern(email));
  if (error) throw new Error(`profile lookup failed: ${error.message}`);
  for (const row of candidates ?? []) {
    const { data } = await admin.auth.admin.getUserById(row.user_id as string);
    if (data?.user?.email?.toLowerCase().trim() === email) return data.user.id;
  }
  return null;
}

const isWeakPassword = (error: { code?: string; message?: string } | null) =>
  !!error && (error.code === "weak_password" || /weak|pwned|password should/i.test(error.message ?? ""));

async function callPayPalSubscriptions(body: Record<string, unknown>): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/paypal-subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data: (data ?? {}) as Record<string, unknown> };
}

// Can this function reach paypal-subscriptions with its service key? Checked
// before the page shows the one-page form: if the link is not working, the
// page sends people down the older two-step path instead of creating accounts
// that cannot go on to pay. A yes is remembered for the life of the worker.
let serviceLinkOk = false;
async function serviceLinkWorks(): Promise<boolean> {
  if (serviceLinkOk) return true;
  try {
    const check = await callPayPalSubscriptions({ action: "service-check" });
    serviceLinkOk = check.ok && check.data.ok === true;
  } catch (e) {
    console.error("service link check failed:", e instanceof Error ? e.message : e);
  }
  return serviceLinkOk;
}

async function start(req: Request, body: Record<string, unknown>) {
  // Hidden field real visitors never see or fill in.
  if (text(body.website, 200)) return json({ ok: false, code: "invalid", field: "form" }, 400);

  const input = readStartInput(body);
  if ("invalid" in input) return json({ ok: false, code: "invalid", field: input.invalid }, 400);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const anon = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const emailRedirectTo = `${siteOrigin(req)}${CONFIRM_PATH}`;
  const metadata = {
    first_name: input.firstName,
    last_name: input.lastName,
    phone_number: input.phone,
    email: input.email,
    signup_source: "membership_quick_start",
  };
  // A second confirmation email inside a minute is refused by the mail limit;
  // the first one is still valid, so a failure here is not an error.
  const resendConfirmation = async () => {
    try {
      const { error } = await anon.auth.resend({ type: "signup", email: input.email, options: { emailRedirectTo } });
      if (error) console.log("confirmation resend skipped:", error.message);
    } catch (e) {
      console.log("confirmation resend failed:", e instanceof Error ? e.message : e);
    }
  };

  const existingId = await findUserIdByEmail(admin, input.email);

  // Forum usernames are unique without regard to capitals. Check before the
  // account is created so nobody gets a confirmation email for a sign-up that
  // then stops on the username.
  const { data: nameRows, error: nameError } = await admin
    .from("profiles").select("id").ilike("username", exactPattern(input.username)).limit(2);
  if (nameError) throw new Error(`username lookup failed: ${nameError.message}`);
  if ((nameRows ?? []).some((row) => row.id !== existingId)) {
    return json({ ok: false, code: "username_taken" });
  }

  let userId: string;
  if (existingId) {
    const { data: existing, error: existingError } = await admin.auth.admin.getUserById(existingId);
    if (existingError || !existing?.user) throw new Error("account lookup failed");
    // A confirmed account belongs to someone who can log in: send them there.
    if (existing.user.email_confirmed_at) return json({ ok: false, code: "account_exists" });

    // Unconfirmed account. If a membership was ever approved on it, someone has
    // paid and only needs to click their confirmation link: change nothing.
    const { data: paidRows, error: paidError } = await admin
      .from("provider_subscriptions").select("id").eq("user_id", existingId).neq("status", "pending").limit(1);
    if (paidError) throw new Error(`membership lookup failed: ${paidError.message}`);
    if ((paidRows ?? []).length > 0) {
      await resendConfirmation();
      return json({ ok: false, code: "confirm_pending" });
    }

    // Unconfirmed and never paid: an abandoned sign-up (possibly typed by
    // someone else). Nobody has ever been able to sign in to it, so the person
    // starting now sets the password and details.
    const { error: updateError } = await admin.auth.admin.updateUserById(existingId, {
      password: input.password,
      user_metadata: { ...(existing.user.user_metadata ?? {}), ...metadata },
    });
    if (updateError) {
      if (isWeakPassword(updateError)) return json({ ok: false, code: "weak_password" });
      throw new Error(`account update failed: ${updateError.message}`);
    }
    await resendConfirmation();
    userId = existingId;
  } else {
    // The same call the sign-up page makes: creates the account and sends the
    // site's normal confirmation email.
    const { data: created, error: signUpError } = await anon.auth.signUp({
      email: input.email,
      password: input.password,
      options: { emailRedirectTo, data: metadata },
    });
    if (signUpError) {
      if (isWeakPassword(signUpError)) return json({ ok: false, code: "weak_password" });
      if (/already registered|already been registered/i.test(signUpError.message)) {
        return json({ ok: false, code: "account_exists" });
      }
      console.error("sign-up failed:", signUpError.message);
      return json({ ok: false, code: "signup_failed" });
    }
    // An address that already has a confirmed account comes back as a
    // placeholder with no identities (the lookup above missed it).
    if (!created.user || (Array.isArray(created.user.identities) && created.user.identities.length === 0)) {
      return json({ ok: false, code: "account_exists" });
    }
    userId = created.user.id;
  }

  const { error: profileError } = await admin.from("profiles").upsert(
    { id: userId, first_name: input.firstName, last_name: input.lastName, username: input.username },
    { onConflict: "id" },
  );
  if (profileError) {
    if (profileError.code === "23505") return json({ ok: false, code: "username_taken" });
    throw new Error(`profile save failed: ${profileError.message}`);
  }
  const { error: privateError } = await admin.from("profile_private").upsert(
    { user_id: userId, email: input.email, phone_number: input.phone },
    { onConflict: "user_id" },
  );
  if (privateError) console.error("contact save failed:", privateError.message);

  // The trial is a real PayPal subscription: $0 for seven days, then the
  // monthly price. A typed promo code replaces it.
  const planType = input.plan === "annual" ? "annual" : "monthly";
  const discountCode = input.discountCode || (input.plan === "trial" ? "HELPLINE" : "");
  const origin = siteOrigin(req);
  const paypal = await callPayPalSubscriptions({
    action: "create-subscription",
    onBehalfOfUserId: userId,
    planType,
    discountCode: discountCode || undefined,
    returnUrl: `${origin}/subscription/success`,
    cancelUrl: `${origin}/subscription/cancel`,
  });
  if (!paypal.ok) {
    const message = typeof paypal.data.error === "string" ? paypal.data.error : "";
    console.error("subscription create failed:", message);
    // Promo-code problems are worded for the visitor by paypal-subscriptions.
    if (/code|discount|FAMILY6|promo/i.test(message)) return json({ ok: false, code: "promo_problem", message });
    return json({ ok: false, code: "payment_setup_failed" });
  }

  if (paypal.data.bypassPayment) {
    return json({ ok: true, bypass: true, accessEndsAt: paypal.data.accessEndsAt ?? null });
  }
  // paypal-subscriptions ignores a code it does not know and would bill the
  // full price from today. Stop instead, so nobody loses a trial to a typo.
  if (input.discountCode && paypal.data.appliedDiscount !== input.discountCode) {
    return json({ ok: false, code: "promo_unknown" });
  }
  const subscriptionId = typeof paypal.data.subscriptionId === "string" ? paypal.data.subscriptionId : "";
  if (!subscriptionId) return json({ ok: false, code: "payment_setup_failed" });
  return json({ ok: true, subscriptionId });
}

async function activate(body: Record<string, unknown>) {
  const subscriptionId = text(body.subscriptionId, 60);
  if (!/^I-[A-Z0-9]{6,40}$/.test(subscriptionId)) return json({ ok: false, code: "invalid" }, 400);

  const admin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: row, error } = await admin
    .from("provider_subscriptions")
    .select("user_id, provider_submission_id, status")
    .eq("paypal_subscription_id", subscriptionId)
    .maybeSingle();
  if (error) throw new Error(`membership lookup failed: ${error.message}`);
  // Family memberships only; provider listings keep their signed-in flow.
  if (!row || row.provider_submission_id) return json({ ok: false, code: "not_found" }, 404);
  if (row.status === "active") return json({ ok: true, status: "active" });

  // PayPal is the source of truth: this only copies its answer into the row.
  const paypal = await callPayPalSubscriptions({
    action: "activate-subscription",
    onBehalfOfUserId: row.user_id,
    subscriptionId,
  });
  if (!paypal.ok) return json({ ok: false, code: "not_ready" });
  return json({ ok: paypal.data.success === true, status: paypal.data.status ?? null });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, code: "method_not_allowed" }, 405);

  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") return json({ ok: false, code: "invalid" }, 400);

    if (body.action === "config") {
      const clientId = Deno.env.get("PAYPAL_CLIENT_ID") ?? null;
      const ready = !!clientId && (await serviceLinkWorks());
      return json({
        ok: true,
        ready,
        paypalClientId: ready ? clientId : null,
        paypalEnv: Deno.env.get("PAYPAL_MODE") === "sandbox" ? "sandbox" : "live",
      });
    }

    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
    if (rateLimited(ip)) return json({ ok: false, code: "rate_limited" }, 429);

    if (body.action === "start") return await start(req, body);
    if (body.action === "activate") return await activate(body);
    return json({ ok: false, code: "invalid" }, 400);
  } catch (error) {
    console.error("membership-quick-start error:", error instanceof Error ? error.message : error);
    return json({ ok: false, code: "error" }, 500);
  }
});
