// Captures an approved PayPal order for the $150 coaching session and
// verifies the capture belongs to the expected session, amount, and currency.
// Only marks paid AFTER a server-verified COMPLETED capture. Enqueues a signed
// callback event for the iOS app backend.
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
  return (await resp.json()).access_token;
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

  let sessionId = "", orderId = "";
  try {
    const b = await req.json();
    sessionId = typeof b?.session_id === "string" ? b.session_id : "";
    orderId = typeof b?.order_id === "string" ? b.order_id : "";
  } catch {
    return new Response(JSON.stringify({ ok: false, code: "invalid_body" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!sessionId || !orderId) {
    return new Response(JSON.stringify({ ok: false, code: "missing_params" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: row } = await admin
    .from("coaching_checkout_orders")
    .select("id, token_nonce, app_booking_ref, status, paypal_order_id, paypal_capture_id")
    .eq("id", sessionId)
    .maybeSingle();
  if (!row) {
    return new Response(JSON.stringify({ ok: false, code: "session_not_found" }), {
      status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (row.paypal_order_id !== orderId) {
    return new Response(JSON.stringify({ ok: false, code: "order_session_mismatch" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (row.status === "captured" && row.paypal_capture_id) {
    return new Response(JSON.stringify({
      ok: true, already_captured: true, capture_id: row.paypal_capture_id,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let token: string;
  try { token = await getAccessToken(); }
  catch {
    return new Response(JSON.stringify({ ok: false, code: "paypal_auth_failed" }), {
      status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const requestId = (await sha256Hex(`capture.${row.token_nonce}`)).slice(0, 64);

  const capResp = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": requestId,
      Prefer: "return=representation",
    },
  });

  // 422 with ORDER_ALREADY_CAPTURED -> re-fetch order to reconcile.
  let captureJson: any;
  if (capResp.status === 422) {
    const getResp = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!getResp.ok) {
      console.log("coaching-order-capture: reconcile fetch failed");
      return new Response(JSON.stringify({ ok: false, code: "paypal_capture_failed" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    captureJson = await getResp.json();
  } else if (!capResp.ok) {
    console.log("coaching-order-capture: capture failed status", capResp.status);
    await admin.from("coaching_checkout_orders")
      .update({ status: "failed", failed_at: new Date().toISOString() })
      .eq("id", row.id);
    return new Response(JSON.stringify({ ok: false, code: "paypal_capture_failed", http_status: capResp.status }), {
      status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } else {
    captureJson = await capResp.json();
  }

  // Verify capture: status COMPLETED, amount 150.00, currency USD, custom_id == session id.
  const pu = captureJson?.purchase_units?.[0];
  const cap = pu?.payments?.captures?.[0];
  const capId = cap?.id;
  const capStatus = cap?.status;
  const amt = cap?.amount?.value;
  const cur = cap?.amount?.currency_code;
  const customId = pu?.custom_id ?? pu?.reference_id;

  if (!capId || capStatus !== "COMPLETED" || amt !== "150.00" || cur !== "USD" || customId !== row.id) {
    console.log("coaching-order-capture: verification failed");
    await admin.from("coaching_checkout_orders")
      .update({ status: "failed", failed_at: new Date().toISOString() })
      .eq("id", row.id);
    return new Response(JSON.stringify({
      ok: false, code: "capture_verification_failed",
    }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Atomic finalize: updates order + inserts outbox in one transaction.
  const nowIso = new Date().toISOString();
  const eventId = `capture.${row.id}.${capId}`;
  const payload = {
    event: "payment.captured",
    booking_id: row.app_booking_ref,
    order_id: orderId,
    capture_id: capId,
    amount_cents: 15000,
    currency: "USD",
    status: "captured",
    captured_at: nowIso,
    event_id: eventId,
  };

  const { data: rpcData, error: rpcErr } = await admin.rpc("finalize_coaching_capture", {
    p_session_id: row.id,
    p_paypal_order_id: orderId,
    p_capture_id: capId,
    p_service_type: "plan_review_coaching",
    p_amount_cents: 15000,
    p_currency: "USD",
    p_captured_at: nowIso,
    p_event_id: eventId,
    p_payload: payload,
  });

  if (rpcErr || !rpcData || (rpcData as any).ok !== true) {
    console.log("coaching-order-capture: finalize failed", (rpcData as any)?.code ?? rpcErr?.message);
    return new Response(JSON.stringify({
      ok: false,
      code: (rpcData as any)?.code ?? "db_update_failed",
    }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, capture_id: capId, status: "captured" }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
