// Delivers queued signed callbacks to the iOS app backend.
// Idle no-op when APP_PAYMENT_CALLBACK_URL is unset (endpoint not deployed yet).
// Idempotent: uses event_id header; retries with exponential backoff.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { signBridgeCallback } from "../_shared/coachingToken.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const callbackUrl = Deno.env.get("SOBER_HELPLINE_APP_PAYMENT_CALLBACK_URL");
  const secret = Deno.env.get("APP_PAYMENT_BRIDGE_SECRET");

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  if (!callbackUrl || !secret) {
    // Not configured yet — leave events queued.
    const { count } = await admin
      .from("app_payment_bridge_outbox")
      .select("id", { count: "exact", head: true })
      .is("delivered_at", null);
    return new Response(JSON.stringify({
      ok: true, skipped: true, reason: "callback_not_configured", pending: count ?? 0,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const { data: pending } = await admin
    .from("app_payment_bridge_outbox")
    .select("id, event_id, payload, attempt_count")
    .is("delivered_at", null)
    .lte("next_attempt_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(25);

  let delivered = 0, failed = 0;
  for (const row of pending ?? []) {
    const bodyText = JSON.stringify(row.payload);
    const ts = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomUUID();
    const sig = await signBridgeCallback(secret, ts, nonce, bodyText);
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
      });
      if (resp.ok) {
        delivered++;
        await admin.from("app_payment_bridge_outbox").update({
          delivered_at: new Date().toISOString(),
          attempt_count: row.attempt_count + 1,
          last_response_status: resp.status,
          last_error: null,
        }).eq("id", row.id);
      } else {
        failed++;
        const attempt = row.attempt_count + 1;
        const backoffMin = Math.min(60 * 6, Math.pow(2, attempt)); // cap at 6h
        const nextAt = new Date(Date.now() + backoffMin * 60 * 1000).toISOString();
        await admin.from("app_payment_bridge_outbox").update({
          attempt_count: attempt,
          next_attempt_at: nextAt,
          last_response_status: resp.status,
          last_error: `http_${resp.status}`,
        }).eq("id", row.id);
      }
    } catch (e) {
      failed++;
      const attempt = row.attempt_count + 1;
      const backoffMin = Math.min(60 * 6, Math.pow(2, attempt));
      const nextAt = new Date(Date.now() + backoffMin * 60 * 1000).toISOString();
      await admin.from("app_payment_bridge_outbox").update({
        attempt_count: attempt,
        next_attempt_at: nextAt,
        last_error: "network_error",
      }).eq("id", row.id);
    }
  }

  return new Response(JSON.stringify({ ok: true, delivered, failed, considered: (pending ?? []).length }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
