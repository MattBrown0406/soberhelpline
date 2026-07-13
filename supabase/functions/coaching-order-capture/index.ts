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
  // NOTE: no early-exit on captured. Continue so the RPC can repair a missing
  // outbox event even for an already-captured order (idempotent replay).

  let token: string;
  try { token = await getAccessToken(); }
  catch {
    // Ambiguous auth failure — retryable, do NOT mark order failed.
    return new Response(JSON.stringify({ ok: false, code: "paypal_auth_failed" }), {
      status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const requestId = (await sha256Hex(`capture.${row.token_nonce}`)).slice(0, 64);

  // Fetch the authoritative order state up front when we already have a capture
  // (recovery path) OR after any ambiguous capture failure.
  async function fetchOrder(): Promise<any | null> {
    try {
      const r = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) return null;
      return await r.json();
    } catch { return null; }
  }

  let captureJson: any = null;
  let capResp: Response | null = null;
  let networkError = false;

  // If we already believe the order is captured, skip re-capturing and go
  // straight to authoritative order fetch. This is the recovery path.
  if (row.status === "captured" && row.paypal_capture_id) {
    captureJson = await fetchOrder();
    if (!captureJson) {
      return new Response(JSON.stringify({ ok: false, code: "paypal_reconcile_failed" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } else {
    try {
      capResp = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": requestId,
          Prefer: "return=representation",
        },
      });
    } catch {
      networkError = true;
    }

    if (networkError || (capResp && capResp.status >= 500) || (capResp && capResp.status === 408)) {
      // Ambiguous: PayPal may or may not have captured. Do NOT mark failed.
      // Fetch authoritative order to see if a capture actually landed.
      captureJson = await fetchOrder();
      if (!captureJson) {
        return new Response(JSON.stringify({ ok: false, code: "paypal_capture_ambiguous" }), {
          status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else if (capResp && capResp.status === 422) {
      // ORDER_ALREADY_CAPTURED or similar — reconcile via order GET (ambiguous, do not fail).
      captureJson = await fetchOrder();
      if (!captureJson) {
        return new Response(JSON.stringify({ ok: false, code: "paypal_reconcile_failed" }), {
          status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else if (capResp && !capResp.ok) {
      // Definitive client-side failure (4xx other than 408/422): mark failed.
      console.log("coaching-order-capture: capture failed status", capResp.status);
      await admin.from("coaching_checkout_orders")
        .update({ status: "failed", failed_at: new Date().toISOString() })
        .eq("id", row.id);
      return new Response(JSON.stringify({ ok: false, code: "paypal_capture_failed", http_status: capResp.status }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (capResp) {
      captureJson = await capResp.json();
    }
  }

  // Verify capture: status COMPLETED, amount 150.00, currency USD, custom_id == session id.
  const pu = captureJson?.purchase_units?.[0];
  const cap = pu?.payments?.captures?.[0];
  const capId = cap?.id;
  const capStatus = cap?.status;
  const amt = cap?.amount?.value;
  const cur = cap?.amount?.currency_code;
  const customId = pu?.custom_id ?? pu?.reference_id;

  // No capture object yet (order APPROVED/PENDING/etc.) — retryable, do NOT mark failed.
  if (!cap || !capId) {
    return new Response(JSON.stringify({
      ok: false, code: "capture_pending", order_status: captureJson?.status ?? null,
    }), {
      status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // A capture exists — now validate amount/currency/custom_id against it.
  if (amt !== "150.00" || cur !== "USD" || customId !== row.id) {
    console.log("coaching-order-capture: verification failed (amount/currency/custom_id mismatch)");
    await admin.from("coaching_checkout_orders")
      .update({ status: "failed", failed_at: new Date().toISOString() })
      .eq("id", row.id);
    return new Response(JSON.stringify({ ok: false, code: "capture_verification_failed" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (capStatus !== "COMPLETED") {
    // PENDING — retryable, do NOT mark failed.
    // DECLINED / FAILED — definitive failure.
    if (capStatus === "DECLINED" || capStatus === "FAILED") {
      await admin.from("coaching_checkout_orders")
        .update({ status: "failed", failed_at: new Date().toISOString() })
        .eq("id", row.id);
      return new Response(JSON.stringify({ ok: false, code: "capture_declined", capture_status: capStatus }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ ok: false, code: "capture_pending", capture_status: capStatus }), {
      status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }


  // Atomic finalize: updates order + inserts outbox in one transaction.
  // Include PayPal's capture-id + nonce for idempotency uniqueness.
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
      ok: false, code: (rpcData as any)?.code ?? "db_update_failed",
    }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({
    ok: true, capture_id: capId, status: "captured",
    already: (rpcData as any).already === true,
  }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
