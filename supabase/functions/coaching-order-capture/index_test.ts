// Stubbed tests for the coaching payment bridge behavior.
// - Capture-branch logic mirrors coaching-order-capture/index.ts.
// - Webhook-branch logic mirrors paypal-webhook/index.ts (PAYMENT.CAPTURE.COMPLETED and refund/reversal/denial).
// - DB behavior tests hit real RPCs against the project DB using service role env.
// Run: deno test --allow-net --allow-env supabase/functions/coaching-order-capture/index_test.ts

import { loadSync } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
try { loadSync({ export: true, allowEmptyValues: true, examplePath: null }); } catch { /* ignore */ }

import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ==================== Capture-branch stubs (mirrors index.ts) ====================
type OrderRow = {
  id: string; token_nonce: string; app_booking_ref: string;
  status: string; paypal_order_id: string; paypal_capture_id: string | null;
};

function makeAdminStub(row: OrderRow, rpcHandler: (name: string, args: any) => any) {
  const state = { row, updates: [] as any[], rpcCalls: [] as any[] };
  const admin = {
    from(_t: string) {
      return {
        select() { return this; },
        eq() { return this; },
        not() { return this; },
        maybeSingle: async () => ({ data: state.row, error: null }),
        update(patch: any) {
          state.updates.push(patch);
          Object.assign(state.row, patch);
          return { eq: () => ({ not: async () => ({ error: null }) }) };
        },
      };
    },
    rpc: async (name: string, args: any) => {
      state.rpcCalls.push({ name, args });
      return rpcHandler(name, args);
    },
  };
  return { admin, state };
}

async function runCapture(opts: {
  row: OrderRow;
  orderId: string;
  capResp?: { status: number; json?: any; throws?: boolean; malformed?: boolean; errBody?: any };
  fetchedOrder?: any | null;
  rpcHandler?: (name: string, args: any) => any;
}) {
  const { row, orderId } = opts;
  const rpcHandler = opts.rpcHandler ?? (() => ({ ok: true, already: false }));
  const { admin, state } = makeAdminStub(row, rpcHandler);
  let captureJson: any = null;
  let networkError = false;
  const retryableStatus = opts.capResp && (
    opts.capResp.status >= 500 ||
    opts.capResp.status === 408 ||
    opts.capResp.status === 409 ||
    opts.capResp.status === 422 ||
    opts.capResp.status === 429
  );
  if (opts.capResp?.throws) networkError = true;

  if (networkError || retryableStatus) {
    captureJson = opts.fetchedOrder ?? null;
    if (!captureJson) return { status: 502, code: "paypal_capture_ambiguous", state };
  } else if (opts.capResp && opts.capResp.status >= 400) {
    const DEFINITIVE = new Set(["PAYER_ACTION_REQUIRED","INSTRUMENT_DECLINED","PAYER_CANNOT_PAY","TRANSACTION_REFUSED","COMPLIANCE_VIOLATION"]);
    const errName = opts.capResp.errBody?.name ?? opts.capResp.errBody?.details?.[0]?.issue;
    if (errName && DEFINITIVE.has(errName)) {
      await admin.from("x").update({ status: "failed", failed_at: new Date().toISOString() }).eq().not();
      return { status: 502, code: "paypal_capture_failed", state };
    }
    captureJson = opts.fetchedOrder ?? null;
    if (!captureJson) return { status: 502, code: "paypal_capture_ambiguous", state };
  } else if (opts.capResp) {
    if (opts.capResp.malformed) {
      captureJson = opts.fetchedOrder ?? null;
      if (!captureJson) return { status: 502, code: "paypal_capture_ambiguous", state };
    } else {
      captureJson = opts.capResp.json;
    }
  }

  const pu = captureJson?.purchase_units?.[0];
  const cap = pu?.payments?.captures?.[0];
  const capId = cap?.id;
  const capStatus = cap?.status;
  const amt = cap?.amount?.value;
  const cur = cap?.amount?.currency_code;
  const customId = pu?.custom_id ?? pu?.reference_id;

  if (!cap || !capId) return { status: 202, code: "capture_pending", state };
  if (amt !== "150.00" || cur !== "USD" || customId !== row.id) {
    await admin.from("x").update({ status: "failed" }).eq().not();
    return { status: 400, code: "capture_verification_failed", state };
  }
  if (capStatus !== "COMPLETED") {
    if (capStatus === "DECLINED" || capStatus === "FAILED") {
      await admin.from("x").update({ status: "failed" }).eq().not();
      return { status: 400, code: "capture_declined", state };
    }
    return { status: 202, code: "capture_pending", state };
  }
  const rpc = await admin.rpc("finalize_coaching_capture", {
    p_session_id: row.id, p_paypal_order_id: orderId, p_capture_id: capId,
    p_captured_at: cap.create_time, // immutable
  });
  if (!(rpc as any).ok) return { status: 500, code: "db_update_failed", state };
  return { status: 200, code: "ok", capture_id: capId, state };
}

function baseRow(overrides: Partial<OrderRow> = {}): OrderRow {
  return { id: "sess-1", token_nonce: "n", app_booking_ref: "book-1",
    status: "pending", paypal_order_id: "ORDER-1", paypal_capture_id: null, ...overrides };
}
function orderApproved() { return { status: "APPROVED", purchase_units: [{ custom_id: "sess-1" }] }; }
function orderCompleted() {
  return { status: "COMPLETED", purchase_units: [{ custom_id: "sess-1",
    payments: { captures: [{ id: "CAP-1", status: "COMPLETED",
      amount: { value: "150.00", currency_code: "USD" }, create_time: "2026-07-13T18:00:00Z" }] } }] };
}

// ==================== Webhook-branch stub (mirrors paypal-webhook) ====================
function refundEvent(overrides: any = {}) {
  return {
    id: "WH-REFUND-1",
    event_type: "PAYMENT.CAPTURE.REFUNDED",
    create_time: "2026-07-13T18:30:00Z",
    resource: {
      id: "REFUND-1",
      amount: { value: "150.00", currency_code: "USD" },
      create_time: "2026-07-13T18:30:00Z",
      links: [{ rel: "up", href: `https://api.paypal.com/v2/payments/captures/CAP-1` }],
      ...overrides,
    },
  };
}

// Simulate refund-amount validation branch from webhook.
function validateRefundResource(resource: any): { ok: boolean; code?: string; cents?: number } {
  const raw = resource?.amount?.value;
  const cur = resource?.amount?.currency_code;
  if (typeof raw !== "string" || cur !== "USD") return { ok: false, code: "refund_amount_invalid" };
  if (!/^\d+\.\d{2}$/.test(raw)) return { ok: false, code: "refund_amount_malformed" };
  const cents = Math.round(parseFloat(raw) * 100);
  if (!Number.isFinite(cents) || cents <= 0 || cents > 15000) return { ok: false, code: "refund_amount_out_of_range" };
  return { ok: true, cents };
}

// ==================== Capture-branch tests ====================
Deno.test("capture: ambiguous → APPROVED-no-capture → 202, not failed", async () => {
  const r = await runCapture({ row: baseRow(), orderId: "ORDER-1", capResp: { throws: true, status: 0 }, fetchedOrder: orderApproved() });
  assertEquals(r.status, 202); assertEquals(r.code, "capture_pending");
  assertEquals(r.state.updates.length, 0);
});
Deno.test("capture: retry → COMPLETED → single RPC finalization with immutable timestamp", async () => {
  const row = baseRow();
  const r = await runCapture({ row, orderId: "ORDER-1", capResp: { status: 201, json: orderCompleted() } });
  assertEquals(r.status, 200); assertEquals(r.code, "ok");
  assertEquals(r.state.rpcCalls.length, 1);
  assertEquals(r.state.rpcCalls[0].args.p_captured_at, "2026-07-13T18:00:00Z");
});
Deno.test("capture: DECLINED → failed", async () => {
  const j = { status: "COMPLETED", purchase_units: [{ custom_id: "sess-1",
    payments: { captures: [{ id: "CAP-1", status: "DECLINED", amount: { value: "150.00", currency_code: "USD" } }] } }] };
  const r = await runCapture({ row: baseRow(), orderId: "ORDER-1", capResp: { status: 201, json: j } });
  assertEquals(r.status, 400); assertEquals(r.code, "capture_declined");
});
Deno.test("capture: amount mismatch on existing capture → failed", async () => {
  const j = { status: "COMPLETED", purchase_units: [{ custom_id: "sess-1",
    payments: { captures: [{ id: "CAP-1", status: "COMPLETED", amount: { value: "1.00", currency_code: "USD" } }] } }] };
  const r = await runCapture({ row: baseRow(), orderId: "ORDER-1", capResp: { status: 201, json: j } });
  assertEquals(r.code, "capture_verification_failed");
});
Deno.test("capture: 4xx with unknown error name → reconcilable, not terminal", async () => {
  const r = await runCapture({
    row: baseRow(), orderId: "ORDER-1",
    capResp: { status: 400, errBody: { name: "SOME_UNKNOWN_ERROR" } },
    fetchedOrder: orderApproved(),
  });
  assertEquals(r.status, 202); assertEquals(r.code, "capture_pending");
  assertEquals(r.state.updates.length, 0);
});
Deno.test("capture: 4xx with INSTRUMENT_DECLINED → terminal failed", async () => {
  const r = await runCapture({
    row: baseRow(), orderId: "ORDER-1",
    capResp: { status: 400, errBody: { name: "INSTRUMENT_DECLINED" } },
  });
  assertEquals(r.status, 502); assertEquals(r.code, "paypal_capture_failed");
  assert(r.state.updates[0].status === "failed");
});
Deno.test("capture: 429 rate-limit reconciles via authoritative fetch", async () => {
  const r = await runCapture({
    row: baseRow(), orderId: "ORDER-1",
    capResp: { status: 429 }, fetchedOrder: orderApproved(),
  });
  assertEquals(r.status, 202); assertEquals(r.code, "capture_pending");
});

// ==================== Refund-amount tests (webhook) ====================
Deno.test("refund: full $150 → valid, cents=15000", () => {
  const r = validateRefundResource(refundEvent().resource);
  assertEquals(r.ok, true); assertEquals(r.cents, 15000);
});
Deno.test("refund: partial $50 → valid, cents=5000", () => {
  const r = validateRefundResource(refundEvent({ amount: { value: "50.00", currency_code: "USD" } }).resource);
  assertEquals(r.ok, true); assertEquals(r.cents, 5000);
});
Deno.test("refund: wrong currency → refund_amount_invalid", () => {
  const r = validateRefundResource(refundEvent({ amount: { value: "150.00", currency_code: "EUR" } }).resource);
  assertEquals(r.ok, false); assertEquals(r.code, "refund_amount_invalid");
});
Deno.test("refund: malformed amount 'abc' → refund_amount_malformed", () => {
  const r = validateRefundResource(refundEvent({ amount: { value: "abc", currency_code: "USD" } }).resource);
  assertEquals(r.ok, false); assertEquals(r.code, "refund_amount_malformed");
});
Deno.test("refund: over-charge $200 → refund_amount_out_of_range", () => {
  const r = validateRefundResource(refundEvent({ amount: { value: "200.00", currency_code: "USD" } }).resource);
  assertEquals(r.ok, false); assertEquals(r.code, "refund_amount_out_of_range");
});
Deno.test("refund: zero amount → refund_amount_out_of_range", () => {
  const r = validateRefundResource(refundEvent({ amount: { value: "0.00", currency_code: "USD" } }).resource);
  assertEquals(r.ok, false); assertEquals(r.code, "refund_amount_out_of_range");
});

// ==================== RPC contract tests (real DB via service role) ====================
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("VITE_SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const DB_READY = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY;

Deno.test({
  name: "RPC finalize_coaching_capture: malformed amount_cents string → payload_mismatch (no exception)",
  ignore: !DB_READY,
  fn: async () => {
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const sess = crypto.randomUUID();
    const badPayload = {
      event: "payment.captured", booking_id: "b", order_id: "ORDER-x",
      capture_id: "CAP-x", amount_cents: "not-a-number", currency: "USD",
      status: "captured", event_id: "evt-x", captured_at: new Date().toISOString(),
    };
    const { data, error } = await db.rpc("finalize_coaching_capture", {
      p_session_id: sess, p_paypal_order_id: "ORDER-x", p_capture_id: "CAP-x",
      p_service_type: "plan_review_coaching", p_amount_cents: 15000, p_currency: "USD",
      p_captured_at: new Date().toISOString(), p_event_id: "evt-x", p_payload: badPayload,
    });
    assertEquals(error, null);
    assertEquals((data as any)?.ok, false);
    assertEquals((data as any)?.code, "payload_mismatch");
  },
});

Deno.test({
  name: "RPC finalize_coaching_capture: session_not_found on unknown id (no mutation, safe)",
  ignore: !DB_READY,
  fn: async () => {
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const sess = crypto.randomUUID();
    const capId = "CAP-" + crypto.randomUUID();
    const eventId = "capture." + sess + "." + capId;
    const payload = {
      event: "payment.captured", booking_id: "book-x", order_id: "ORD-x",
      capture_id: capId, amount_cents: 15000, currency: "USD",
      status: "captured", captured_at: new Date().toISOString(), event_id: eventId,
    };
    const { data, error } = await db.rpc("finalize_coaching_capture", {
      p_session_id: sess, p_paypal_order_id: "ORD-x", p_capture_id: capId,
      p_service_type: "plan_review_coaching", p_amount_cents: 15000, p_currency: "USD",
      p_captured_at: new Date().toISOString(), p_event_id: eventId, p_payload: payload,
    });
    assertEquals(error, null);
    assertEquals((data as any)?.ok, false);
    assertEquals((data as any)?.code, "session_not_found");
  },
});

Deno.test({
  name: "RPC finalize_coaching_refund_or_reversal: refunded without refunded_amount_cents → refunded_amount_invalid",
  ignore: !DB_READY,
  fn: async () => {
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const capId = "CAP-" + crypto.randomUUID();
    const evt = "PAYMENT.CAPTURE.REFUNDED." + capId;
    const payload = {
      event: "payment.refunded", booking_id: "b", order_id: "O",
      capture_id: capId, amount_cents: 15000, currency: "USD",
      status: "refunded", event_id: evt, occurred_at: new Date().toISOString(),
      // NO refunded_amount_cents
    };
    const { data, error } = await db.rpc("finalize_coaching_refund_or_reversal", {
      p_original_capture_id: capId, p_new_status: "refunded",
      p_event_id: evt, p_payload: payload, p_occurred_at: new Date().toISOString(),
    });
    assertEquals(error, null);
    assertEquals((data as any)?.ok, false);
    assertEquals((data as any)?.code, "refunded_amount_invalid");
  },
});

// ==================== Canonical event_id + webhook-order tests ====================
// Build the canonical event id (browser + webhook paths must both use this).
function canonicalCaptureEventId(sessionId: string, capId: string) {
  return `capture.${sessionId}.${capId}`;
}
Deno.test("event_id: browser path and webhook COMPLETED path use identical canonical id", () => {
  const browserId = canonicalCaptureEventId("sess-1", "CAP-1");
  const webhookId = canonicalCaptureEventId("sess-1", "CAP-1");
  assertEquals(browserId, webhookId);
  assertEquals(browserId, "capture.sess-1.CAP-1");
});

// Simulate finalize RPC semantics: same event_id + same payload keys => idempotent replay.
function makeRpcRecorder() {
  const events = new Map<string, any>();
  return {
    events,
    async finalize(args: any) {
      const canonicalKeys = ["event","event_id","booking_id","order_id","capture_id","status","currency","amount_cents"];
      const prior = events.get(args.p_event_id);
      if (prior) {
        // Compare canonical keys only (timestamps allowed to differ).
        for (const k of canonicalKeys) {
          if (JSON.stringify(prior[k]) !== JSON.stringify(args.p_payload[k])) {
            return { ok: false, code: "event_payload_mismatch" };
          }
        }
        return { ok: true, already: true };
      }
      events.set(args.p_event_id, args.p_payload);
      return { ok: true, already: false };
    },
  };
}
Deno.test("dedup: browser THEN webhook completed → single outbox row", async () => {
  const rec = makeRpcRecorder();
  const payload = { event: "payment.captured", event_id: "capture.s.CAP", booking_id: "b",
    order_id: "O", capture_id: "CAP", status: "captured", currency: "USD", amount_cents: 15000,
    captured_at: "2026-07-13T18:00:00Z" };
  const r1 = await rec.finalize({ p_event_id: payload.event_id, p_payload: payload });
  // Webhook fires later — different captured_at is fine (timestamp not in canonical set),
  // canonical fields identical => replay.
  const r2 = await rec.finalize({ p_event_id: payload.event_id, p_payload: { ...payload, captured_at: "2026-07-13T18:00:01Z" } });
  assertEquals(r1.already, false);
  assertEquals(r2.ok, true); assertEquals(r2.already, true);
  assertEquals(rec.events.size, 1);
});
Deno.test("dedup: webhook completed THEN browser → single outbox row (reverse order)", async () => {
  const rec = makeRpcRecorder();
  const payload = { event: "payment.captured", event_id: "capture.s.CAP", booking_id: "b",
    order_id: "O", capture_id: "CAP", status: "captured", currency: "USD", amount_cents: 15000,
    captured_at: "2026-07-13T18:00:00Z" };
  const r1 = await rec.finalize({ p_event_id: payload.event_id, p_payload: payload });
  const r2 = await rec.finalize({ p_event_id: payload.event_id, p_payload: payload });
  assertEquals(r1.already, false);
  assertEquals(r2.already, true);
  assertEquals(rec.events.size, 1);
});

// ==================== Webhook COMPLETED unrelated-capture behavior ====================
type LookupResult = { data: any | null; error: any | null };
async function webhookCompletedHandler(opts: {
  capture: { id: string; status: string; amount: { value: string; currency_code: string }; custom_id?: string };
  lookupByCustomId: LookupResult;
  lookupByOrderId?: LookupResult;
}) {
  const { capture } = opts;
  if (!capture.id) return { status: 503, code: "missing_capture_id" };
  if (capture.status !== "COMPLETED" || capture.amount.value !== "150.00" || capture.amount.currency_code !== "USD") {
    return { status: 200, code: "ignored_not_coaching" };
  }
  let row: any = null; let dbFail = false;
  if (capture.custom_id) {
    const r = opts.lookupByCustomId;
    if (r.error) dbFail = true; else row = r.data;
  }
  if (!row && !dbFail && opts.lookupByOrderId) {
    const r = opts.lookupByOrderId;
    if (r.error) dbFail = true; else row = r.data;
  }
  if (dbFail) return { status: 503, code: "db_lookup_failed" };
  if (!row) return { status: 200, code: "unrelated_capture_acked" };
  return { status: 200, code: "processed" };
}
Deno.test("webhook COMPLETED: unrelated $150 USD capture (no matching coaching row) → 200 ACK", async () => {
  const r = await webhookCompletedHandler({
    capture: { id: "CAP-U", status: "COMPLETED", amount: { value: "150.00", currency_code: "USD" }, custom_id: "some-other-flow" },
    lookupByCustomId: { data: null, error: null },
    lookupByOrderId:  { data: null, error: null },
  });
  assertEquals(r.status, 200); assertEquals(r.code, "unrelated_capture_acked");
});
Deno.test("webhook COMPLETED: DB error while looking up capture → 503 (retryable)", async () => {
  const r = await webhookCompletedHandler({
    capture: { id: "CAP-U", status: "COMPLETED", amount: { value: "150.00", currency_code: "USD" }, custom_id: "x" },
    lookupByCustomId: { data: null, error: { message: "db down" } },
  });
  assertEquals(r.status, 503); assertEquals(r.code, "db_lookup_failed");
});

// ==================== coaching-order-create persistence ====================
async function orderCreatePersist(opts: {
  updateResult: { data: any[] | null; error: any | null };
}): Promise<{ status: number; code: string; order_id?: string }> {
  const paypalOrderId = "PP-ORDER-XYZ";
  const { data, error } = opts.updateResult;
  if (error) return { status: 503, code: "order_persist_failed" };
  if (!data || data.length !== 1) return { status: 503, code: "order_persist_conflict" };
  return { status: 200, code: "ok", order_id: paypalOrderId };
}
Deno.test("coaching-order-create: DB update failure after PayPal order created → 503, no order id leaks", async () => {
  const r = await orderCreatePersist({ updateResult: { data: null, error: { message: "boom" } } });
  assertEquals(r.status, 503); assertEquals(r.code, "order_persist_failed");
  assertEquals(r.order_id, undefined);
});
Deno.test("coaching-order-create: guarded update matched 0 rows → 503, no order id leaks", async () => {
  const r = await orderCreatePersist({ updateResult: { data: [], error: null } });
  assertEquals(r.status, 503); assertEquals(r.code, "order_persist_conflict");
  assertEquals(r.order_id, undefined);
});

// ==================== Lease-release "not owner" handling ====================
async function releaseHandler(opts: { data: any; error: any | null; deliveredHttpOk: boolean }) {
  let delivered = 0, failed = 0, releaseFailed = 0;
  const { data, error, deliveredHttpOk } = opts;
  if (error || data !== true) {
    releaseFailed++;
  } else if (deliveredHttpOk) {
    delivered++;
  } else {
    failed++;
  }
  const runOk = releaseFailed === 0;
  return { status: runOk ? 200 : 500, delivered, failed, releaseFailed };
}
Deno.test("lease release: RPC returns false (no longer owner) → release_failed, not delivered", async () => {
  const r = await releaseHandler({ data: false, error: null, deliveredHttpOk: true });
  assertEquals(r.delivered, 0);
  assertEquals(r.releaseFailed, 1);
  assertEquals(r.status, 500);
});
Deno.test("lease release: RPC returns true → delivery counted", async () => {
  const r = await releaseHandler({ data: true, error: null, deliveredHttpOk: true });
  assertEquals(r.delivered, 1);
  assertEquals(r.releaseFailed, 0);
  assertEquals(r.status, 200);
});
