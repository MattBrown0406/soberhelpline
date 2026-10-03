// Who may trigger website automation functions (mass email, Zoom meeting
// changes, membership syncs). Any one of:
// - a pg_cron job sending the site's cron secret: body { cron_secret } or
//   header x-cron-secret, matching site_settings.cron_secret;
// - FOLLOWUP_AUTOMATION_SECRET: header x-automation-secret or Bearer;
// - this project's service role key: Bearer;
// - a signed-in admin (has_role(user, 'admin')).
//
// Enforcement is staged. Until site_settings.enforce_function_auth = 'true',
// an unauthenticated call is still allowed but logged as
// "automation_auth_unverified <function>", so scheduled jobs that don't send a
// secret yet keep working and show up in the logs. Flip the setting once the
// logs are clean (see docs/lovable-apply-prompt-2026-10-03.md).

// Structural, so callers may pass a client from esm.sh or npm: supabase-js.
// deno-lint-ignore no-explicit-any
type AnyClient = { from: (table: string) => any; rpc: (fn: string, args?: Record<string, unknown>) => any; auth: { getUser: (jwt: string) => Promise<any> } };

function safeEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  let diff = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  return diff === 0;
}

async function siteSetting(admin: AnyClient, key: string): Promise<string> {
  const { data } = await admin.from("site_settings").select("value").eq("key", key).maybeSingle();
  return typeof data?.value === "string" ? data.value : "";
}

/** Whether the request carries one of the accepted credentials. */
export async function hasAutomationAuth(
  req: Request,
  admin: AnyClient,
  body: Record<string, unknown> | null,
): Promise<boolean> {
  const bearer = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");

  const cronSecret = await siteSetting(admin, "cron_secret");
  const sentCron = typeof body?.cron_secret === "string" ? body.cron_secret : req.headers.get("x-cron-secret") ?? "";
  if (cronSecret && safeEqual(sentCron, cronSecret)) return true;

  const automationSecret = Deno.env.get("FOLLOWUP_AUTOMATION_SECRET") ?? "";
  if (automationSecret && (safeEqual(req.headers.get("x-automation-secret") ?? "", automationSecret) || safeEqual(bearer, automationSecret))) {
    return true;
  }

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (serviceKey && safeEqual(bearer, serviceKey)) return true;

  if (bearer) {
    const { data } = await admin.auth.getUser(bearer);
    if (data?.user) {
      const { data: isAdmin } = await admin.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      if (isAdmin === true) return true;
    }
  }
  return false;
}

/**
 * Returns a 401 response to send back, or null to continue. While enforcement
 * is off, unauthenticated calls continue but are logged by function name.
 */
export async function requireAutomationAuth(
  req: Request,
  admin: AnyClient,
  body: Record<string, unknown> | null,
  functionName: string,
  corsHeaders: Record<string, string> = {},
): Promise<Response | null> {
  if (await hasAutomationAuth(req, admin, body)) return null;
  const enforce = (await siteSetting(admin, "enforce_function_auth")).trim().toLowerCase() === "true";
  if (!enforce) {
    console.warn(`automation_auth_unverified ${functionName}`);
    return null;
  }
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/**
 * Same credentials, enforced immediately (no staging). For functions only
 * ever run by hand or by another function — no scheduled job calls them — so
 * there is nothing to stage, and leaving them open would let anyone with the
 * public key send mass email or replace the Monday meeting.
 */
export async function requireAutomationAuthNow(
  req: Request,
  admin: AnyClient,
  body: Record<string, unknown> | null,
  functionName: string,
  corsHeaders: Record<string, string> = {},
): Promise<Response | null> {
  if (await hasAutomationAuth(req, admin, body)) return null;
  console.warn(`automation_auth_denied ${functionName}`);
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
