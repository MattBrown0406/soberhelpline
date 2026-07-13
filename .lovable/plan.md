# PayPal Rotation + iOS Coaching Checkout — Implementation Plan

## Status of Task 1 (done)
- Confirmed PayPal credentials are read only inside Edge Functions via `Deno.env.get(...)`. No `VITE_PAYPAL_*` exists; no frontend file references PayPal API hosts. Frontend calls only go through `supabase.functions.invoke(...)`.
- Rotated `PAYPAL_CLIENT_ID` and `PAYPAL_SECRET_KEY` via the secure form (values never seen or logged).
- Set `PAYPAL_MODE=live` explicitly (existing code already treated non-"sandbox" as live, so behavior is unchanged; this just removes ambiguity).
- No existing secret was deleted. No merchant account changes.

Nothing else has been changed yet.

## Task 2 — Verify Live auth (no customer charge)
Add a tiny admin-only Edge Function `paypal-verify-auth` that:
- Requires an authenticated admin (`has_role(auth.uid(), 'admin')`).
- Calls `POST /v1/oauth2/token` against `api-m.paypal.com`.
- Returns `{ ok: true, mode: "live", token_type, expires_in, app_id_last4 }` — no token, no secret, no Basic header echoed.
- On failure, returns a sanitized error (status + PayPal `error` code only, never `error_description` contents that could echo credentials).
I'll then invoke it once from the tool harness (as your admin session) to confirm Live auth works. If auth fails, we stop and re-check the pasted values before touching anything else.

## Task 3 — `/coaching-checkout` route (website side only)
New pieces:
- Edge function `coaching-checkout-resolve` (verify_jwt=false): accepts `{ token }`, validates HMAC signature + expiry + nonce against `APP_PAYMENT_BRIDGE_SECRET`, resolves to a server-owned record. Returns only display-safe fields (service name, amount label, expiry). Never returns the raw booking/account IDs to the browser beyond an opaque session id.
- Edge function `coaching-order-create` (verify_jwt=false, token-gated): creates the PayPal order server-side. Amount pinned to `15000` cents USD server-side; ignores anything the browser sends. Uses `PayPal-Request-Id = sha256(token_nonce)` for idempotency.
- Edge function `coaching-order-capture` (verify_jwt=false, token-gated): captures, then re-fetches order from PayPal and verifies `status=COMPLETED`, `amount.value="150.00"`, `currency_code=USD`, `custom_id` matches booking, capture id not already used. Only then marks paid.
- Frontend route `src/pages/CoachingCheckout.tsx` — pure presentation, PayPal JS SDK button rendered with server-provided order id. No amount, no email, no booking id in query string beyond the opaque token.

New table `coaching_checkout_orders` (via migration):
- `id uuid pk`, `token_nonce text unique`, `app_booking_ref text`, `app_account_ref text`, `amount_cents int check (=15000)`, `currency text check (='USD')`, `service_type text`, `paypal_order_id text unique`, `paypal_capture_id text unique nullable`, `status text` (`pending|approved|captured|failed|refunded|reversed`), timestamps for `created_at/approved_at/captured_at/refunded_at/failed_at/token_expires_at`.
- RLS enabled, no anon/authenticated policies (edge-function-only via service role). Explicit `GRANT` to `service_role`.

## Task 4 — Idempotency guarantees
- Unique constraints on `paypal_order_id` and `paypal_capture_id`.
- `PayPal-Request-Id` header on create/capture derived from `token_nonce`.
- Capture path is a `SELECT ... FOR UPDATE` on the order row so a double-click can't double-capture.
- Never mark paid from the browser return; only from server-verified capture response and webhook.

## Task 5 — App payment bridge (prepared, not shipped live)
- New secrets requested: `SOBER_HELPLINE_APP_PAYMENT_CALLBACK_URL`, `APP_PAYMENT_BRIDGE_SECRET`. Requested via secure form only when you say go.
- New table `app_payment_bridge_outbox`: queued signed callbacks with `attempt_count`, `next_attempt_at`, `event_id unique` (idempotency).
- New function `deliver-app-payment-callback` (cron every 5 min): posts canonical `{ts}.{nonce}.{sha256(body)}` signed with HMAC-SHA256, `X-Signature`/`X-Timestamp`/`X-Event-Id` headers. Retries with backoff.
- Callback body carries only: `booking_id, order_id, capture_id, amount_cents, currency, status, captured_at, event_id`. No PII, no health data.
- Deployment: I'll leave `SOBER_HELPLINE_APP_PAYMENT_CALLBACK_URL` unset until your app endpoint exists; the outbox will queue but not send. You confirm before we flip it on.

## Task 6 — Webhook hardening
- `paypal-webhook` already verifies signatures via PayPal's verify endpoint — good. I'll extend the switch to also handle `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`, `PAYMENT.CAPTURE.REVERSED`, `PAYMENT.CAPTURE.REFUNDED`, and `CUSTOMER.DISPUTE.CREATED` for coaching orders.
- Refunds/reversals update `coaching_checkout_orders.status` and enqueue a signed callback event so the iOS app can't schedule against stale state.
- No return-page trust: URL redirect only navigates the UI; state comes from webhook + server capture.

## Task 7 — Privacy & logging pass
- Sweep all PayPal-touching functions: strip any `console.log(JSON.stringify(resource))` that could dump customer data (currently `paypal-webhook` logs the full resource — I'll reduce that to ids + event type).
- PayPal `description` on new orders: fixed generic string "Coaching session".
- No auth headers, tokens, or raw webhook bodies logged. Errors return sanitized shape `{code, message}` only.

## Task 8 — Tests
Add Deno tests under `supabase/functions/coaching-*/index.test.ts` and a Vitest suite for the checkout page. Covers every scenario you listed (tampered amount, expired token, replayed nonce, wrong currency, duplicate capture, refund, invalid signature, callback replay, retry). Runs alongside existing tests; existing PayPal flows get a smoke regression test that mocks PayPal's API.

## Task 9 — Handoff guarantees
- Zero edits to existing `paypal-subscriptions`, `consultation-payment`, `process-consultation-booking`, `paypal-admin-sync`, `paypal-sync-all` beyond a logging-privacy trim in Task 7 (I'll show the diff before applying).
- No destructive migrations. New table only.
- No real charge will be made. Live auth verification uses `oauth2/token` only.
- Rollback: delete the four new edge functions, drop the two new tables, remove the `/coaching-checkout` route. Existing checkout is untouched, so rollback is additive-only.

## What I need from you to proceed
1. Approve this plan (or edit scope).
2. Confirm you want me to run the Live-auth verification (Task 2) now.
3. Confirm the token/HMAC contract in Task 3 matches what your iOS/app backend team can produce, or ask me to draft the exact spec doc first.
4. Later, when your app callback endpoint exists, I'll request `SOBER_HELPLINE_APP_PAYMENT_CALLBACK_URL` + `APP_PAYMENT_BRIDGE_SECRET`.
