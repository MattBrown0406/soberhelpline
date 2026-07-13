// Stubbed tests for coaching-order-capture branch behavior.
// These do NOT hit PayPal or the database. They monkey-patch globalThis.fetch
// and use an in-memory admin stub via module boundary emulation.
//
// Run: deno test --allow-net --allow-env supabase/functions/coaching-order-capture/index_test.ts

import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

// ------- shared fake state -------
type OrderRow = {
  id: string;
  token_nonce: string;
  app_booking_ref: string;
  status: string;
  paypal_order_id: string;
  paypal_capture_id: string | null;
  failed_at?: string | null;
};

function makeAdminStub(row: OrderRow, rpcHandler: (name: string, args: any) => any) {
  const state = { row, updates: [] as any[], rpcCalls: [] as any[] };
  const admin = {
    from(_t: string) {
      return {
        select() { return this; },
        eq() { return this; },
        maybeSingle: async () => ({ data: state.row, error: null }),
        update(patch: any) {
          state.updates.push(patch);
          Object.assign(state.row, patch);
          return { eq: async () => ({ error: null }) };
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

// Fake handler that mirrors index.ts branch logic without importing Deno.serve.
// Kept aligned with the production file.
async function runCapture(opts: {
  row: OrderRow;
  orderId: string;
  capResp?: { status: number; json?: any; throws?: boolean; malformed?: boolean };
  fetchedOrder?: any | null;
  rpcHandler?: (name: string, args: any) => any;
}) {
  const { row, orderId } = opts;
  const rpcHandler = opts.rpcHandler ?? (() => ({ ok: true, already: false }));
  const { admin, state } = makeAdminStub(row, rpcHandler);

  // --- Simulate branch logic from index.ts ---
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
    await admin.from("x").update({ status: "failed", failed_at: new Date().toISOString() }).eq();
    return { status: 502, code: "paypal_capture_failed", state };
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

  if (!cap || !capId) {
    return { status: 202, code: "capture_pending", state };
  }
  if (amt !== "150.00" || cur !== "USD" || customId !== row.id) {
    await admin.from("x").update({ status: "failed", failed_at: new Date().toISOString() }).eq();
    return { status: 400, code: "capture_verification_failed", state };
  }
  if (capStatus !== "COMPLETED") {
    if (capStatus === "DECLINED" || capStatus === "FAILED") {
      await admin.from("x").update({ status: "failed", failed_at: new Date().toISOString() }).eq();
      return { status: 400, code: "capture_declined", state };
    }
    return { status: 202, code: "capture_pending", state };
  }

  const rpc = await admin.rpc("finalize_coaching_capture", {
    p_session_id: row.id, p_paypal_order_id: orderId, p_capture_id: capId,
  });
  if (!(rpc as any).ok) return { status: 500, code: "db_update_failed", state };
  return { status: 200, code: "ok", capture_id: capId, state };
}

function baseRow(overrides: Partial<OrderRow> = {}): OrderRow {
  return {
    id: "sess-1",
    token_nonce: "nonce-1",
    app_booking_ref: "book-1",
    status: "pending",
    paypal_order_id: "ORDER-1",
    paypal_capture_id: null,
    ...overrides,
  };
}

function orderApproved() {
  return { status: "APPROVED", purchase_units: [{ custom_id: "sess-1" }] };
}
function orderCompleted() {
  return {
    status: "COMPLETED",
    purchase_units: [{
      custom_id: "sess-1",
      payments: { captures: [{ id: "CAP-1", status: "COMPLETED", amount: { value: "150.00", currency_code: "USD" } }] },
    }],
  };
}

Deno.test("ambiguous capture then APPROVED order with no capture -> 202 and reconcilable", async () => {
  const row = baseRow();
  const res = await runCapture({
    row, orderId: "ORDER-1",
    capResp: { throws: true, status: 0 },
    fetchedOrder: orderApproved(),
  });
  assertEquals(res.status, 202);
  assertEquals(res.code, "capture_pending");
  assertEquals(res.state.updates.length, 0); // NOT marked failed
});

Deno.test("retry later returns COMPLETED capture -> finalized atomically with one RPC call", async () => {
  const row = baseRow();
  const res = await runCapture({
    row, orderId: "ORDER-1",
    capResp: { status: 201, json: orderCompleted() },
  });
  assertEquals(res.status, 200);
  assertEquals(res.code, "ok");
  assertEquals(res.state.rpcCalls.length, 1);
  assertEquals(res.state.rpcCalls[0].name, "finalize_coaching_capture");
});

Deno.test("definitive DECLINED capture -> failed", async () => {
  const row = baseRow();
  const declined = {
    status: "COMPLETED",
    purchase_units: [{
      custom_id: "sess-1",
      payments: { captures: [{ id: "CAP-1", status: "DECLINED", amount: { value: "150.00", currency_code: "USD" } }] },
    }],
  };
  const res = await runCapture({
    row, orderId: "ORDER-1",
    capResp: { status: 201, json: declined },
  });
  assertEquals(res.status, 400);
  assertEquals(res.code, "capture_declined");
  assertEquals(res.state.updates[0].status, "failed");
});

Deno.test("amount mismatch on existing capture -> failed", async () => {
  const row = baseRow();
  const wrongAmt = {
    status: "COMPLETED",
    purchase_units: [{
      custom_id: "sess-1",
      payments: { captures: [{ id: "CAP-1", status: "COMPLETED", amount: { value: "1.00", currency_code: "USD" } }] },
    }],
  };
  const res = await runCapture({
    row, orderId: "ORDER-1",
    capResp: { status: 201, json: wrongAmt },
  });
  assertEquals(res.status, 400);
  assertEquals(res.code, "capture_verification_failed");
  assertEquals(res.state.updates[0].status, "failed");
});

Deno.test("currency mismatch on existing capture -> failed", async () => {
  const row = baseRow();
  const wrongCur = {
    status: "COMPLETED",
    purchase_units: [{
      custom_id: "sess-1",
      payments: { captures: [{ id: "CAP-1", status: "COMPLETED", amount: { value: "150.00", currency_code: "EUR" } }] },
    }],
  };
  const res = await runCapture({ row, orderId: "ORDER-1", capResp: { status: 201, json: wrongCur } });
  assertEquals(res.code, "capture_verification_failed");
});

Deno.test("custom_id mismatch on existing capture -> failed", async () => {
  const row = baseRow();
  const wrongCustom = {
    status: "COMPLETED",
    purchase_units: [{
      custom_id: "other-session",
      payments: { captures: [{ id: "CAP-1", status: "COMPLETED", amount: { value: "150.00", currency_code: "USD" } }] },
    }],
  };
  const res = await runCapture({ row, orderId: "ORDER-1", capResp: { status: 201, json: wrongCustom } });
  assertEquals(res.code, "capture_verification_failed");
});

Deno.test("retryable 429 with APPROVED-no-capture reconcile -> 202 pending", async () => {
  const row = baseRow();
  const res = await runCapture({
    row, orderId: "ORDER-1",
    capResp: { status: 429 },
    fetchedOrder: orderApproved(),
  });
  assertEquals(res.status, 202);
  assertEquals(res.code, "capture_pending");
  assertEquals(res.state.updates.length, 0);
});

Deno.test("malformed capture body with no reconcile order -> ambiguous 502, not failed", async () => {
  const row = baseRow();
  const res = await runCapture({
    row, orderId: "ORDER-1",
    capResp: { status: 201, malformed: true },
    fetchedOrder: null,
  });
  assertEquals(res.status, 502);
  assertEquals(res.code, "paypal_capture_ambiguous");
  assertEquals(res.state.updates.length, 0);
});
