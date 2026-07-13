// Creates a PayPal order server-side for the $150 coaching session.
// Amount + currency are pinned server-side. Idempotent via PayPal-Request-Id derived from the nonce.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_API_BASE = Deno.env.get("PAYPAL_MODE") === "sandbox"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

async function getAccessToken(): Promise<string> {
  const cid = Deno.env.get("PAYPAL_CLIENT_ID");
  const sec = Deno.env.get("PAYPAL_SECRET_KEY");
  if (!cid || !sec) throw new Error("missing_credentials");
  const resp = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${cid}:${sec}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!resp.ok) throw new Error("paypal_auth_failed");
  const j = await resp.json();
  return j.access_token;
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input)));
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, code: "method_not_allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let sessionId = "";
  try {
    const body = await req.json();
    sessionId = typeof body?.session_id === "string" ? body.session_id : "";
  } catch {
    return new Response(JSON.stringify({ ok: false, code: "invalid_body" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!sessionId) {
    return new Response(JSON.stringify({ ok: false, code: "missing_session_id" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: row, error: rowErr } = await admin
    .from("coaching_checkout_orders")
    .select("id, token_nonce, app_booking_ref, status, paypal_order_id, token_expires_at, amount_cents, currency")
    .eq("id", sessionId)
    .maybeSingle();
  if (rowErr || !row) {
    return new Response(JSON.stringify({ ok: false, code: "session_not_found" }), {
      status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (new Date(row.token_expires_at).getTime() <= Date.now()) {
    return new Response(JSON.stringify({ ok: false, code: "token_expired" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (row.status === "captured" || row.status === "refunded" || row.status === "reversed") {
    return new Response(JSON.stringify({ ok: false, code: "already_finalized" }), {
      status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Idempotency: reuse existing PayPal order if we already made one for this session.
  if (row.paypal_order_id) {
    return new Response(JSON.stringify({ ok: true, order_id: row.paypal_order_id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let accessToken: string;
  try {
    accessToken = await getAccessToken();
  } catch (e) {
    console.log("coaching-order-create: paypal auth failed");
    return new Response(JSON.stringify({ ok: false, code: "paypal_auth_failed" }), {
      status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const requestId = (await sha256Hex(`create.${row.token_nonce}`)).slice(0, 64);

  const orderBody = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: row.id,
        custom_id: row.id,           // maps back to our internal session
        description: "Coaching session",  // generic; no PII
        amount: { currency_code: "USD", value: "150.00" },
      },
    ],
    application_context: {
      brand_name: "Sober Helpline",
      shipping_preference: "NO_SHIPPING",
      user_action: "PAY_NOW",
    },
  };

  const resp = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": requestId,
    },
    body: JSON.stringify(orderBody),
  });

  if (!resp.ok) {
    let code = "paypal_create_failed";
    try {
      const err = await resp.json();
      if (typeof err?.name === "string") code = `paypal_${err.name.toLowerCase()}`;
    } catch { /* swallow */ }
    console.log("coaching-order-create: paypal create failed status", resp.status);
    return new Response(JSON.stringify({ ok: false, code, http_status: resp.status }), {
      status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const order = await resp.json();
  const paypalOrderId = order?.id;
  if (!paypalOrderId) {
    return new Response(JSON.stringify({ ok: false, code: "paypal_no_order_id" }), {
      status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Guarded update: only persist paypal_order_id if the row is still non-terminal
  // and does not already have a different order id pinned. If update fails or
  // touches zero rows, do NOT return the order id — the browser must not begin
  // approval/capture against an orphaned order.
  const { data: updatedRows, error: persistErr } = await admin
    .from("coaching_checkout_orders")
    .update({ paypal_order_id: paypalOrderId, status: "pending" })
    .eq("id", row.id)
    .is("paypal_order_id", null)
    .not("status", "in", "(captured,refunded,reversed,failed)")
    .select("id");

  if (persistErr) {
    console.log("coaching-order-create: persist failed", persistErr.message);
    return new Response(JSON.stringify({ ok: false, code: "order_persist_failed" }), {
      status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!updatedRows || updatedRows.length !== 1) {
    console.log("coaching-order-create: guarded update matched 0 rows");
    return new Response(JSON.stringify({ ok: false, code: "order_persist_conflict" }), {
      status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, order_id: paypalOrderId }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
