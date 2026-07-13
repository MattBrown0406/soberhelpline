// Admin-only: verifies live PayPal REST auth without touching customer data.
// Returns only non-sensitive metadata. Never logs or echoes secrets/tokens.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_API_BASE = Deno.env.get("PAYPAL_MODE") === "sandbox"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
  );

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) {
    return new Response(JSON.stringify({ ok: false, code: "unauthenticated" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
  const { data: hasRole } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
  if (!hasRole) {
    return new Response(JSON.stringify({ ok: false, code: "forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const secret = Deno.env.get("PAYPAL_SECRET_KEY");
  if (!clientId || !secret) {
    return new Response(JSON.stringify({ ok: false, code: "missing_credentials" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const auth = btoa(`${clientId}:${secret}`);
    const resp = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!resp.ok) {
      let code = "auth_failed";
      try {
        const err = await resp.json();
        // Only forward PayPal's short error code, never the description (may echo credentials).
        if (typeof err?.error === "string") code = `paypal_${err.error}`;
      } catch { /* swallow body */ }
      console.log("paypal-verify-auth: PayPal returned status", resp.status);
      return new Response(JSON.stringify({ ok: false, code, http_status: resp.status }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const appIdLast4 = typeof data.app_id === "string" ? data.app_id.slice(-4) : null;
    const clientIdLast4 = clientId.slice(-4);

    return new Response(
      JSON.stringify({
        ok: true,
        mode: Deno.env.get("PAYPAL_MODE") === "sandbox" ? "sandbox" : "live",
        api_base: PAYPAL_API_BASE,
        token_type: data.token_type ?? null,
        expires_in: typeof data.expires_in === "number" ? data.expires_in : null,
        app_id_last4: appIdLast4,
        client_id_last4: clientIdLast4,
        scope_count: typeof data.scope === "string" ? data.scope.split(" ").length : null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.log("paypal-verify-auth: network error");
    return new Response(JSON.stringify({ ok: false, code: "network_error" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
