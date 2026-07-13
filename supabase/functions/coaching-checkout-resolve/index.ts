// Resolves an app-signed checkout token to a display-safe record.
// - Verifies HMAC signature with APP_PAYMENT_BRIDGE_SECRET
// - Enforces expiry + nonce uniqueness
// - Never returns raw booking/account refs to the browser
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyCoachingToken } from "../_shared/coachingToken.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, code: "method_not_allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let token = "";
  try {
    const body = await req.json();
    token = typeof body?.token === "string" ? body.token : "";
  } catch {
    return new Response(JSON.stringify({ ok: false, code: "invalid_body" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const secret = Deno.env.get("APP_PAYMENT_BRIDGE_SECRET") ?? "";
  const verified = await verifyCoachingToken(token, secret);
  if (!verified.ok) {
    return new Response(JSON.stringify({ ok: false, code: verified.reason }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { payload } = verified;
  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  // Upsert on token_nonce. Nonce is unique -> idempotent resolve.
  const tokenExpiresAt = new Date(payload.exp * 1000).toISOString();
  const { data: existing } = await admin
    .from("coaching_checkout_orders")
    .select("id, status, paypal_order_id, paypal_capture_id, token_expires_at")
    .eq("token_nonce", payload.nonce)
    .maybeSingle();

  let orderRowId: string;
  let status: string;
  if (existing) {
    orderRowId = existing.id;
    status = existing.status;
  } else {
    const { data: inserted, error } = await admin
      .from("coaching_checkout_orders")
      .insert({
        token_nonce: payload.nonce,
        app_booking_ref: payload.bref,
        app_account_ref: payload.aref,
        amount_cents: 15000,
        currency: "USD",
        service_type: "plan_review_coaching",
        token_expires_at: tokenExpiresAt,
        status: "pending",
      })
      .select("id, status")
      .single();
    if (error || !inserted) {
      console.log("coaching-checkout-resolve: insert failed");
      return new Response(JSON.stringify({ ok: false, code: "resolve_failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    orderRowId = inserted.id;
    status = inserted.status;
  }

  return new Response(
    JSON.stringify({
      ok: true,
      session_id: orderRowId,        // opaque; browser uses this in create/capture
      service_label: "Sober Helpline — 60-Minute Private Coaching and Plan Review",
      amount_label: "$150.00 USD",
      amount_cents: 15000,
      currency: "USD",
      status,
      expires_at: tokenExpiresAt,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
