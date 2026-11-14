import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  type AppOutcome,
  deleteAppAccount,
  endMemberships,
  normalizeEmail,
  notifyOwner,
  protectedReason,
  removeLogin,
} from "../_shared/accountDeletion.ts";

// The member deleting their own soberhelpline.com account, signed in.
//
// "Delete my account" means everywhere: any membership billed through PayPal
// is cancelled, the Sober Helpline app account with the same email is deleted,
// then this website account is deleted.
//
// Order: checks, PayPal, the app, then this site. If PayPal will not confirm
// a cancellation nothing is deleted anywhere, and the member can try again.
// Every step is safe to repeat.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, code: "method_not_allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ ok: false, code: "not_signed_in" }, 401);
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const asMember = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: { user }, error: userError } = await asMember.auth.getUser();
    if (userError || !user) return json({ ok: false, code: "not_signed_in" }, 401);

    // A deliberate request only: the page sends the word the member typed.
    const body = (await req.json().catch(() => null)) as { confirm?: unknown } | null;
    if (body?.confirm !== "DELETE") return json({ ok: false, code: "not_confirmed" }, 400);

    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const email = normalizeEmail(user.email);

    const reason = await protectedReason(admin, user.id);
    if (reason) {
      await notifyOwner({
        email, startedFrom: "website", website: `not deleted (${reason})`, app: "not asked", paypalCancelled: 0,
        note: "This person asked to delete a staff or provider account. It was left in place for you to handle.",
      });
      return json({ ok: false, code: "protected" });
    }

    const memberships = await endMemberships(admin, user.id);
    if (!memberships.ok) {
      await notifyOwner({
        email, startedFrom: "website", website: "not deleted", app: "not asked",
        paypalCancelled: memberships.cancelledAtPayPal,
        note: "PayPal would not confirm a membership cancellation, so nothing was deleted. The person was asked to try again.",
      });
      return json({ ok: false, code: "paypal_failed" });
    }

    // Only a confirmed email identifies the same person in the app.
    const app: AppOutcome = user.email_confirmed_at && email ? await deleteAppAccount(email) : "not_asked";
    if (app === "failed") {
      await notifyOwner({
        email, startedFrom: "website", website: "not deleted yet (membership ended)", app: "could not be reached",
        paypalCancelled: memberships.cancelledAtPayPal,
        note: "The app did not answer, so the accounts were left in place. The person was asked to try again.",
      });
      return json({ ok: false, code: "app_failed" });
    }

    await removeLogin(admin, user.id, email);
    await notifyOwner({
      email, startedFrom: "website", website: "deleted",
      app: app === "deleted" ? "deleted" : app === "protected" ? "staff account, left in place" : app === "not_installed" ? "app side not installed yet" : app === "not_asked" ? "not asked (email was never confirmed)" : "no app account with this email",
      paypalCancelled: memberships.cancelledAtPayPal,
      note: app === "protected" ? "The app account with this email is a staff account and was not deleted." : undefined,
    });
    return json({ ok: true, app });
  } catch (error) {
    console.error("delete-account error:", error instanceof Error ? error.message : "unknown");
    return json({ ok: false, code: "error" }, 500);
  }
});
