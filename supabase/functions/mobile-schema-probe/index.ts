// TEMPORARY diagnostic function: inspects the mobile app backend schema.
// Safe to delete once the app membership sync is wired up.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = Deno.env.get("MOBILE_SUPABASE_URL");
  const key = Deno.env.get("MOBILE_SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    return new Response(JSON.stringify({ error: "missing_mobile_env" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const tables = ["entitlements", "accounts", "profiles", "users", "subscribers", "app_users"];
  const out: Record<string, unknown> = {};

  for (const t of tables) {
    const res = await fetch(`${url}/rest/v1/${t}?select=*&limit=2`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const text = await res.text();
    out[t] = { status: res.status, sample: text.slice(0, 800) };
  }

  return new Response(JSON.stringify(out, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
