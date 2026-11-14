import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  clearWaitingMemberships,
  endMemberships,
  normalizeEmail,
  notifyOwner,
  protectedReason,
  removeLogin,
  secretMatches,
} from "../_shared/accountDeletion.ts";

// The Sober Helpline app calls this while a member is deleting their app
// account, so the soberhelpline.com account with the same email is deleted too
// and any membership billed through PayPal is cancelled.
//
// Server to server only: the shared MEMBERSHIP_SYNC_SECRET in the
// x-membership-sync-secret header is the gate (verify_jwt = false). The app
// sends the member's VERIFIED login email, taken from their token.
//
// Answers { ok, result }: deleted | not_found | protected mean the app may go
// on; paypal_failed | error mean it must stop so nothing is half done.
// Staff and provider accounts are never deleted this way.

const headers = { "Content-Type": "application/json" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

// Best-effort brake (per worker) in case the secret is ever misused: a real
// person deletes one account, not dozens.
const WINDOW_MS = 60 * 60_000;
const MAX_PER_WINDOW = 20;
let windowStart = 0;
let windowCount = 0;
function overLimit(): boolean {
  const now = Date.now();
  if (now - windowStart > WINDOW_MS) {
    windowStart = now;
    windowCount = 0;
  }
  windowCount += 1;
  return windowCount > MAX_PER_WINDOW;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ ok: false, result: "method_not_allowed" }, 405);
  if (!secretMatches(req.headers.get("x-membership-sync-secret"), Deno.env.get("MEMBERSHIP_SYNC_SECRET"))) {
    return json({ ok: false, result: "unauthorized" }, 401);
  }
  if (overLimit()) {
    console.error("app-account-deleted: too many deletions in an hour; refusing");
    return json({ ok: false, result: "rate_limited" }, 429);
  }

  try {
    const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
    const email = normalizeEmail(body?.email);
    if (!email.includes("@") || email.length > 320) return json({ ok: false, result: "bad_request" }, 400);

    const admin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // The login email only, never the editable profile email.
    const { data: userId, error: lookupError } = await admin.rpc("auth_user_id_by_email", { p_email: email });
    if (lookupError) throw new Error(`account lookup failed: ${lookupError.code ?? "unknown"}`);
    if (typeof userId !== "string") {
      await clearWaitingMemberships(admin, email);
      return json({ ok: true, result: "not_found" });
    }

    const reason = await protectedReason(admin, userId);
    if (reason) {
      await notifyOwner({
        email, startedFrom: "app", website: `not deleted (${reason})`, app: "deleted by the person in the app", paypalCancelled: 0,
        note: "The website account with this email is a staff or provider account and was left in place.",
      });
      return json({ ok: true, result: "protected" });
    }

    const memberships = await endMemberships(admin, userId);
    if (!memberships.ok) {
      await notifyOwner({
        email, startedFrom: "app", website: "not deleted", app: "not deleted (waiting)",
        paypalCancelled: memberships.cancelledAtPayPal,
        note: "PayPal would not confirm a membership cancellation, so nothing was deleted. The person was asked to try again in the app.",
      });
      return json({ ok: false, result: "paypal_failed" });
    }

    await removeLogin(admin, userId, email);
    await notifyOwner({
      email, startedFrom: "app", website: "deleted", app: "being deleted by the person in the app",
      paypalCancelled: memberships.cancelledAtPayPal,
    });
    return json({ ok: true, result: "deleted" });
  } catch (error) {
    console.error("app-account-deleted error:", error instanceof Error ? error.message : "unknown");
    return json({ ok: false, result: "error" }, 500);
  }
});
