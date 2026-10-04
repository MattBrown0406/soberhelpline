// The website's ONE membership rule, for edge functions that price or gate on it
// (coaching member price, etc.). It is public.is_active_family_member — the same
// check the member pages, forum, recordings and Q&A use:
// - active rows count until their access end date;
// - app memberships (plan_type 'app', created by app sign-in / the nightly app
//   sync) count until app_grace_until;
// - cancelled members keep access until the end of the period they paid for.
// Family memberships only (provider_submission_id IS NULL).

// Structural, so callers may pass a client from esm.sh or npm: supabase-js.
// deno-lint-ignore no-explicit-any
type AnyClient = { from: (table: string) => any; rpc: (fn: string, args?: Record<string, unknown>) => any };

type MembershipRow = {
  status: string | null;
  plan_type: string | null;
  access_ends_at: string | null;
  app_grace_until: string | null;
};

const isFuture = (value: string | null, now: number) => value !== null && new Date(value).getTime() > now;

/** Same rule as the SQL function, for when the RPC isn't reachable. */
function rowGrantsAccess(row: MembershipRow, now: number): boolean {
  if (row.status === "active") {
    if (row.access_ends_at !== null && !isFuture(row.access_ends_at, now)) return false;
    if (row.plan_type === "app" && row.app_grace_until !== null && !isFuture(row.app_grace_until, now)) return false;
    return true;
  }
  if (row.status === "cancelled") return isFuture(row.access_ends_at, now);
  return false;
}

/**
 * Is this website account a member right now? Errors count as "not a member"
 * (callers then charge the standard price; nothing is ever under-charged).
 */
export async function isActiveFamilyMember(admin: AnyClient, userId: string): Promise<boolean> {
  const { data, error } = await admin.rpc("is_active_family_member", { _user_id: userId });
  if (!error) return data === true;

  console.error("is_active_family_member failed; checking membership rows instead:", error.message ?? "unknown");
  const { data: rows, error: rowsError } = await admin
    .from("provider_subscriptions")
    .select("status, plan_type, access_ends_at, app_grace_until")
    .eq("user_id", userId)
    .is("provider_submission_id", null)
    .in("status", ["active", "cancelled"]);
  if (rowsError) {
    console.error("membership row check failed:", rowsError.message ?? "unknown");
    return false;
  }
  const now = Date.now();
  return ((rows ?? []) as MembershipRow[]).some((row) => rowGrantsAccess(row, now));
}
