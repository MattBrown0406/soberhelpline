import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Deleting a soberhelpline.com account, shared by:
//   delete-account        the member deleting their own account on the website
//   app-account-deleted   the app saying the same person deleted their app account
//
// "Delete my account" means everywhere, so each of those also tells, or was
// told by, the Sober Helpline app.
//
// Order matters. Nothing is deleted until every membership that bills through
// PayPal has been cancelled, because the membership rows are not tied to the
// login and would otherwise keep billing a person who no longer has an account.
//
// Staff and provider accounts are never deleted here (admins, moderators,
// anyone with a provider listing or coaching provider record, anyone who
// created surveys or granted free memberships). Those are handled by hand.
//
// Never log an email address from this module.

const OWNER_ADDRESSES = ["matt@soberhelpline.com", "matt@freedominterventions.com"];
const DEFAULT_MOBILE_SUPABASE_URL = "https://rjlkbxqxshohgjmomyro.supabase.co";

/** Escapes LIKE wildcards so ilike() is a case-insensitive exact match. */
const exactPattern = (value: string) => value.replace(/[\\%_]/g, "\\$&");

export const normalizeEmail = (value: unknown): string =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

/** Constant-time comparison so the shared secret cannot be probed by timing. */
export function secretMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = new TextEncoder().encode(provided);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

/** Why this account must not be deleted automatically, or null when it may be. */
export async function protectedReason(admin: SupabaseClient, userId: string): Promise<string | null> {
  for (const role of ["admin", "moderator"]) {
    const { data, error } = await admin.rpc("has_role", { _user_id: userId, _role: role });
    if (error) throw new Error(`role check failed: ${error.code ?? "unknown"}`);
    if (data === true) return "staff";
  }
  const references: [string, string, string][] = [
    ["provider_submissions", "submitted_by", "provider_listing"],
    ["consultation_providers", "user_id", "coaching_provider"],
    ["surveys", "created_by", "survey_author"],
    ["pending_free_memberships", "invited_by", "granted_memberships"],
  ];
  for (const [table, column, reason] of references) {
    const { data, error } = await admin.from(table).select(column).eq(column, userId).limit(1);
    if (error) throw new Error(`${table} check failed: ${error.code ?? "unknown"}`);
    if ((data ?? []).length > 0) return reason;
  }
  return null;
}

async function cancelAtPayPal(userId: string, subscriptionId: string): Promise<boolean> {
  try {
    const response = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/paypal-subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        action: "cancel-subscription",
        onBehalfOfUserId: userId,
        subscriptionId,
        reason: "Account deleted",
        source: "account_deletion",
      }),
    });
    const data = await response.json().catch(() => null) as { success?: boolean } | null;
    return response.ok && data?.success === true;
  } catch (error) {
    console.error("paypal cancel call failed:", error instanceof Error ? error.name : "unknown");
    return false;
  }
}

/**
 * Stops every family membership the account holds. A membership PayPal is
 * still billing is cancelled at PayPal first; if PayPal will not confirm,
 * this returns ok:false and the caller must not delete anything.
 */
export async function endMemberships(
  admin: SupabaseClient,
  userId: string,
): Promise<{ ok: boolean; cancelledAtPayPal: number }> {
  const { data: rows, error } = await admin
    .from("provider_subscriptions")
    .select("id, status, paypal_subscription_id")
    .eq("user_id", userId)
    .is("provider_submission_id", null);
  if (error) throw new Error(`membership lookup failed: ${error.code ?? "unknown"}`);

  let cancelledAtPayPal = 0;
  for (const row of rows ?? []) {
    const billing = (row.status === "active" || row.status === "suspended") &&
      typeof row.paypal_subscription_id === "string" && /^I-/.test(row.paypal_subscription_id);
    if (!billing) continue;
    if (!(await cancelAtPayPal(userId, row.paypal_subscription_id as string))) {
      return { ok: false, cancelledAtPayPal };
    }
    cancelledAtPayPal += 1;
  }

  // Close every row, including never-approved ones. The 'admin…' source also
  // stops a late PayPal notice from switching a membership back on for an
  // account that no longer exists.
  const nowIso = new Date().toISOString();
  if ((rows ?? []).length > 0) {
    const { error: closeError } = await admin
      .from("provider_subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: nowIso,
        cancellation_source: "admin_account_deleted",
        access_ends_at: nowIso,
        updated_at: nowIso,
      })
      .eq("user_id", userId)
      .is("provider_submission_id", null);
    if (closeError) throw new Error(`membership close failed: ${closeError.code ?? "unknown"}`);
  }
  return { ok: true, cancelledAtPayPal };
}

/** A waiting free or app membership for this address would hand a new sign-up a membership. */
export async function clearWaitingMemberships(admin: SupabaseClient, email: string): Promise<void> {
  if (!email) return;
  const { error } = await admin.from("pending_free_memberships").delete().ilike("email", exactPattern(email));
  if (error) console.error("waiting membership cleanup failed:", error.code ?? "unknown");
}

/** Removes the login and what hangs off it. Call only after endMemberships succeeded. */
export async function removeLogin(admin: SupabaseClient, userId: string, email: string): Promise<void> {
  await clearWaitingMemberships(admin, email);
  // Contact details are not tied to the login by a foreign key.
  const { error: contactError } = await admin.from("profile_private").delete().eq("user_id", userId);
  if (contactError) throw new Error(`contact cleanup failed: ${contactError.code ?? "unknown"}`);
  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) throw new Error(`login delete failed: ${deleteError.message.slice(0, 120)}`);
}

export type AppOutcome = "deleted" | "not_found" | "protected" | "not_installed" | "failed" | "not_asked";

/** Tells the app to delete the account with this verified email. Never throws. */
export async function deleteAppAccount(email: string): Promise<AppOutcome> {
  const secret = Deno.env.get("MEMBERSHIP_SYNC_SECRET") ?? "";
  const raw = (Deno.env.get("MOBILE_SUPABASE_URL") ?? "").trim() || DEFAULT_MOBILE_SUPABASE_URL;
  let endpoint: string;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || !secret) return "failed";
    endpoint = `${url.origin}/functions/v1/website-account-deleted`;
  } catch {
    return "failed";
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-membership-sync-secret": secret },
      body: JSON.stringify({ email }),
      signal: controller.signal,
    });
    // The app has not published its side yet.
    if (response.status === 404) return "not_installed";
    const data = await response.json().catch(() => null) as { ok?: boolean; result?: string } | null;
    if (response.ok && data?.ok === true &&
      (data.result === "deleted" || data.result === "not_found" || data.result === "protected")) {
      return data.result;
    }
    console.error("app deletion refused:", response.status, data?.result ?? "no answer");
    return "failed";
  } catch (error) {
    console.error("app deletion unreachable:", error instanceof Error ? error.name : "unknown");
    return "failed";
  } finally {
    clearTimeout(timer);
  }
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

/** Tells the owner what happened. Never throws; never affects the deletion. */
export async function notifyOwner(details: {
  email: string;
  startedFrom: "website" | "app";
  website: string;
  app: string;
  paypalCancelled: number;
  note?: string;
}): Promise<void> {
  try {
    const apiKey = Deno.env.get("SENDGRID_API_KEY");
    if (!apiKey) return;
    const html = `<h2>Account deletion</h2>
      <ul>
        <li><strong>Email:</strong> ${escapeHtml(details.email)}</li>
        <li><strong>Started from:</strong> the ${details.startedFrom}</li>
        <li><strong>Website account:</strong> ${escapeHtml(details.website)}</li>
        <li><strong>App account:</strong> ${escapeHtml(details.app)}</li>
        <li><strong>PayPal memberships cancelled:</strong> ${details.paypalCancelled}</li>
        ${details.note ? `<li><strong>Needs you:</strong> ${escapeHtml(details.note)}</li>` : ""}
      </ul>
      <p>An App Store subscription cannot be cancelled by us. If this person had one, only they can cancel it, in their Apple ID subscriptions.</p>`;
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: OWNER_ADDRESSES.map((address) => ({ email: address })) }],
        from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
        subject: details.note ? "Account deletion needs your attention" : "Account deleted",
        content: [{ type: "text/html", value: html }],
      }),
    });
    if (!response.ok) console.error(`deletion notice failed [${response.status}]`);
  } catch (error) {
    console.error("deletion notice error:", error instanceof Error ? error.name : "unknown");
  }
}
