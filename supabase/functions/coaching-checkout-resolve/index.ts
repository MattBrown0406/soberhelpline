// Resolves an app-signed checkout token to a display-safe record.
// - Verifies HMAC signature with APP_PAYMENT_BRIDGE_SECRET
// - Enforces expiry + nonce uniqueness
// - Never returns raw booking/account refs to the browser
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  COACHING_MEMBER_CENTS,
  COACHING_STANDARD_CENTS,
  isAllowedCoachingCents,
  verifyCoachingToken,
} from "../_shared/coachingToken.ts";

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
  // The amount always comes from the signed token (15000, or 12500 for members).
  const tokenExpiresAt = new Date(payload.exp * 1000).toISOString();
  const selectExisting = () =>
    admin
      .from("coaching_checkout_orders")
      .select("id, status, amount_cents")
      .eq("token_nonce", payload.nonce)
      .maybeSingle();

  const { data: existing } = await selectExisting();

  let orderRowId: string;
  let status: string;
  let amountCents: number;
  if (existing) {
    orderRowId = existing.id;
    status = existing.status;
    amountCents = existing.amount_cents;
  } else {
    const { data: inserted, error } = await admin
      .from("coaching_checkout_orders")
      .insert({
        token_nonce: payload.nonce,
        app_booking_ref: payload.bref,
        app_account_ref: payload.aref,
        amount_cents: payload.cents,
        currency: "USD",
        service_type: "plan_review_coaching",
        token_expires_at: tokenExpiresAt,
        status: "pending",
      })
      .select("id, status, amount_cents")
      .single();
    if (error || !inserted) {
      // 23505: a concurrent resolve of the same token won the insert; use its row.
      if (error?.code === "23505") {
        const { data: raced } = await selectExisting();
        if (raced) {
          orderRowId = raced.id;
          status = raced.status;
          amountCents = raced.amount_cents;
        } else {
          console.log("coaching-checkout-resolve: insert raced but row not found");
          return new Response(JSON.stringify({ ok: false, code: "resolve_failed" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } else if (error?.code === "23514" && payload.cents === COACHING_MEMBER_CENTS) {
        // The database still only allows $150 orders (the member-price SQL change
        // has not been applied yet). Fail clearly instead of charging $150.
        console.log("coaching-checkout-resolve: member price not enabled in database yet");
        return new Response(JSON.stringify({ ok: false, code: "member_price_unavailable" }), {
          status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        console.log("coaching-checkout-resolve: insert failed", error?.code ?? "unknown");
        return new Response(JSON.stringify({ ok: false, code: "resolve_failed" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      orderRowId = inserted.id;
      status = inserted.status;
      amountCents = inserted.amount_cents;
    }
  }

  // The nonce is part of the signed token, so a stored row must carry the same
  // amount the token was signed for. Anything else is refused.
  if (!isAllowedCoachingCents(amountCents) || amountCents !== payload.cents) {
    console.log("coaching-checkout-resolve: stored amount does not match token");
    return new Response(JSON.stringify({ ok: false, code: "amount_mismatch" }), {
      status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const isMemberPrice = amountCents === COACHING_MEMBER_CENTS;
  const amountLabel = `$${(amountCents / 100).toFixed(2)} USD`;

  return new Response(
    JSON.stringify({
      ok: true,
      session_id: orderRowId,        // opaque; browser uses this in create/capture
      service_label: "Sober Helpline — 60-Minute Private Coaching and Plan Review",
      amount_label: amountLabel,
      amount_cents: amountCents,
      member_price: isMemberPrice,
      standard_amount_label: `$${(COACHING_STANDARD_CENTS / 100).toFixed(2)} USD`,
      savings_label: isMemberPrice
        ? `$${((COACHING_STANDARD_CENTS - amountCents) / 100).toFixed(0)}`
        : null,
      currency: "USD",
      status,
      expires_at: tokenExpiresAt,
      // PayPal client_id is publishable — required by the browser JS SDK.
      paypal_client_id: Deno.env.get("PAYPAL_CLIENT_ID") ?? null,
      paypal_env: Deno.env.get("PAYPAL_MODE") === "sandbox" ? "sandbox" : "live",
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
