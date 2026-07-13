// Delivers queued signed callbacks to the iOS app backend.
// - POST/OPTIONS only.
// - Requires server-only Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY> (used by pg_cron).
// - Atomically leases rows via claim_app_payment_outbox_batch so overlapping
//   invocations never deliver the same row concurrently.
// - Expired leases become eligible again automatically.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { signBridgeCallback } from "../_shared/coachingToken.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function unauthorized() {
  return new Response(JSON.stringify({ ok: false, code: "unauthorized" }), {
    status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, code: "method_not_allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json", Allow: "POST, OPTIONS" },
    });
  }

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization") ?? "";
  const bearer = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
  if (!serviceKey || !bearer || !timingSafeEqual(bearer, serviceKey)) {
    return unauthorized();
  }

  const callbackUrl = Deno.env.get("APP_PAYMENT_CALLBACK_URL");
  const secret = Deno.env.get("APP_PAYMENT_BRIDGE_SECRET");

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    serviceKey,
  );

  if (!callbackUrl || !secret) {
    // Not configured yet — leave events queued, but don't claim.
    const { count } = await admin
      .from("app_payment_bridge_outbox")
      .select("id", { count: "exact", head: true })
      .is("delivered_at", null);
    return new Response(JSON.stringify({
      ok: true, skipped: true, reason: "callback_not_configured", pending: count ?? 0,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Atomic lease claim. Overlapping invocations get disjoint rows.
  const { data: claimed, error: claimErr } = await admin.rpc(
    "claim_app_payment_outbox_batch",
    { p_batch_size: 25, p_lease_seconds: 120 },
  );

  if (claimErr) {
    console.log("deliver-app-payment-callback: claim failed", claimErr.message);
    return new Response(JSON.stringify({ ok: false, code: "claim_failed" }), {
      status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const rows: Array<{ id: string; event_id: string; payload: unknown; attempt_count: number; lease_id: string }> =
    (claimed ?? []) as any;

  let delivered = 0, failed = 0;

  for (const row of rows) {
    const bodyText = JSON.stringify(row.payload);
    const ts = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomUUID();
    const sig = await signBridgeCallback(secret, ts, nonce, bodyText);

    let ok = false;
    let httpStatus: number | null = null;
    let errMsg: string | null = null;

    // Finite fetch timeout, well under the 120s lease so the lease is always
    // released (or explicitly not) before it can expire mid-flight.
    const CALLBACK_TIMEOUT_MS = 30_000;
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), CALLBACK_TIMEOUT_MS);

    try {
      const resp = await fetch(callbackUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Event-Id": row.event_id,
          "X-Timestamp": ts,
          "X-Nonce": nonce,
          "X-Signature": sig,
        },
        body: bodyText,
        signal: ac.signal,
      });
      httpStatus = resp.status;
      ok = resp.ok;
      if (!ok) errMsg = `http_${resp.status}`;
      try { await resp.text(); } catch { /* ignore */ }
    } catch (e) {
      errMsg = (e as any)?.name === "AbortError" ? "callback_timeout" : "network_error";
    } finally {
      clearTimeout(timer);
    }

    const attempt = row.attempt_count + 1;
    let releaseArgs: Record<string, unknown>;
    if (ok) {
      releaseArgs = {
        p_lease_id: row.lease_id,
        p_id: row.id,
        p_delivered: true,
        p_attempt_count: attempt,
        p_next_attempt_at: new Date().toISOString(),
        p_last_error: null,
        p_last_response_status: httpStatus,
      };
    } else {
      const backoffMin = Math.min(60 * 6, Math.pow(2, attempt)); // cap 6h
      const nextAt = new Date(Date.now() + backoffMin * 60 * 1000).toISOString();
      releaseArgs = {
        p_lease_id: row.lease_id,
        p_id: row.id,
        p_delivered: false,
        p_attempt_count: attempt,
        p_next_attempt_at: nextAt,
        p_last_error: errMsg,
        p_last_response_status: httpStatus,
      };
    }

    const { error: relErr } = await admin.rpc(
      "release_app_payment_outbox_lease",
      releaseArgs,
    );
    if (relErr) {
      // Lease release failed. Row remains held under its lease and becomes
      // eligible again automatically once the lease expires — safe to retry.
      console.log("deliver-app-payment-callback: lease release failed", relErr.message);
      releaseFailed++;
    } else if (ok) {
      delivered++;
    } else {
      failed++;
    }
  }

  const runOk = releaseFailed === 0;
  return new Response(JSON.stringify({
    ok: runOk, delivered, failed, release_failed: releaseFailed, considered: rows.length,
  }), {
    status: runOk ? 200 : 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

