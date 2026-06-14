import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const url = Deno.env.get("MOBILE_SUPABASE_URL");
  const serviceKey = Deno.env.get("MOBILE_SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    console.error("Missing MOBILE_SUPABASE_URL or MOBILE_SUPABASE_SERVICE_ROLE_KEY");
    return json({ error: "server_misconfigured" }, 500);
  }

  let body: { token_id?: string; next?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_body" }, 400);
  }

  const tokenId = body?.token_id;
  if (!tokenId || typeof tokenId !== "string") {
    return json({ error: "invalid_token" }, 400);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // a) lookup token (unused + unexpired)
  const nowIso = new Date().toISOString();
  const { data: token, error: tokenErr } = await supabase
    .from("web_sso_tokens")
    .select("id, account_id, expires_at, used_at")
    .eq("id", tokenId)
    .is("used_at", null)
    .gt("expires_at", nowIso)
    .maybeSingle();

  if (tokenErr) {
    console.error("token lookup error", tokenErr);
    return json({ error: "invalid_token" }, 400);
  }
  if (!token) return json({ error: "invalid_token" }, 400);

  // b) check active entitlement
  const { data: ents, error: entErr } = await supabase
    .from("entitlements")
    .select("tier, expires_at")
    .eq("account_id", token.account_id);

  if (entErr) {
    console.error("entitlement lookup error", entErr);
    return json({ error: "no_subscription" }, 400);
  }

  const active = (ents ?? []).find(
    (e: { expires_at: string | null }) =>
      e.expires_at === null || new Date(e.expires_at).getTime() > Date.now(),
  );
  if (!active) return json({ error: "no_subscription" }, 400);

  // c) mark single-use
  const { error: updErr } = await supabase
    .from("web_sso_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", token.id)
    .is("used_at", null);

  if (updErr) {
    console.error("mark used error", updErr);
    return json({ error: "invalid_token" }, 400);
  }

  // d) fetch first name (best-effort)
  let firstName: string | null = null;
  const { data: account } = await supabase
    .from("accounts")
    .select("first_name")
    .eq("id", token.account_id)
    .maybeSingle();
  if (account?.first_name) firstName = account.first_name;

  return json({
    ok: true,
    account_id: token.account_id,
    tier: active.tier,
    first_name: firstName,
  });
});
