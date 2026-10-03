import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/** Constant-time string comparison so the shared secret can't be probed by timing. */
function secretMatches(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const a = new TextEncoder().encode(provided);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

/**
 * Website accounts whose LOGIN email is `email` (never the user-editable
 * profile_private.email on its own).
 */
async function websiteUserIdsForEmail(admin: SupabaseClient, email: string): Promise<string[]> {
  // Exact login-email lookup (SQL helper added by the 2026-10-02 migration).
  const { data: exact, error: rpcError } = await admin.rpc('auth_user_id_by_email', { p_email: email });
  if (!rpcError) return typeof exact === 'string' ? [exact] : [];

  // Until that migration runs: candidates from profile_private, each confirmed
  // against the login email. Emails containing LIKE / PostgREST wildcard
  // characters are matched exactly instead of by ILIKE.
  const query = admin.from('profile_private').select('user_id').limit(10);
  const { data: candidates, error } = /[*\\]/.test(email)
    ? await query.eq('email', email)
    : await query.ilike('email', email.replace(/[%_]/g, (c) => `\\${c}`));
  if (error) throw new Error(`profile lookup failed: ${error.message}`);

  const ids: string[] = [];
  for (const row of candidates ?? []) {
    const userId = (row as { user_id: string }).user_id;
    const { data } = await admin.auth.admin.getUserById(userId);
    if (data?.user?.email?.toLowerCase().trim() === email) ids.push(userId);
  }
  return [...new Set(ids)];
}

type MembershipRow = {
  status: string;
  plan_type: string | null;
  access_ends_at: string | null;
};

/**
 * Does this website membership row give access right now?
 * - plan_type 'app' rows are mirrored FROM the Sober Helpline app, so they never
 *   count here (otherwise the app would confirm its own grant forever).
 * - active rows count until their access end date (promo memberships such as
 *   FAMILY6 carry one); cancelled rows count until the paid-through date.
 */
function grantsWebAccess(row: MembershipRow, now: number): boolean {
  if (row.plan_type === 'app') return false;
  const endsAt = row.access_ends_at ? new Date(row.access_ends_at).getTime() : null;
  if (row.status === 'active') return endsAt === null || endsAt > now;
  if (row.status === 'cancelled') return endsAt !== null && endsAt > now;
  return false;
}

// This endpoint reveals membership status, which is sensitive in an
// addiction-recovery context. It is restricted to authenticated users who
// are checking their OWN email. Unauthenticated callers always get false.
// The app backend (sync-web-membership) calls it server-to-server with the
// shared x-membership-sync-secret to ask "is this email a WEBSITE member?".
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string' || email.length > 320) {
      return jsonResponse({ isMember: false });
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const normalizedEmail = email.toLowerCase().trim();

    // Server-to-server bypass: mobile backend sends x-membership-sync-secret.
    // Only honored when MEMBERSHIP_SYNC_SECRET is configured non-empty and matches exactly.
    const syncSecret = Deno.env.get('MEMBERSHIP_SYNC_SECRET') ?? '';
    const providedSyncSecret = req.headers.get('x-membership-sync-secret') ?? '';
    const isServerToServer = secretMatches(providedSyncSecret, syncSecret);

    if (!isServerToServer) {
      const authHeader = req.headers.get('Authorization') ?? '';
      if (!authHeader.startsWith('Bearer ')) {
        return jsonResponse({ isMember: false }, 401);
      }
      const token = authHeader.replace('Bearer ', '');

      // Verify the caller's JWT
      const { data: userData, error: userError } = await adminClient.auth.getUser(token);
      if (userError || !userData?.user) {
        return jsonResponse({ isMember: false }, 401);
      }

      const callerEmail = (userData.user.email || '').toLowerCase().trim();

      // Only allow checking your own email — prevents enumeration / oracle abuse.
      // Admins are still allowed to look up any address.
      let isAdmin = false;
      const { data: roleRow } = await adminClient
        .from('user_roles')
        .select('role')
        .eq('user_id', userData.user.id)
        .eq('role', 'admin')
        .maybeSingle();
      if (roleRow) isAdmin = true;

      if (!isAdmin && normalizedEmail !== callerEmail) {
        return jsonResponse({ isMember: false }, 403);
      }
    }

    // Find the website account whose login email this is (case-insensitive).
    const userIds = await websiteUserIdsForEmail(adminClient, normalizedEmail);
    if (userIds.length === 0) {
      return jsonResponse({ isMember: false });
    }

    // Family memberships only (provider_submission_id IS NULL). Exclude rows that
    // came from the app (plan_type 'app'); include cancelled members whose paid
    // period has not ended yet.
    const { data: rows, error: subError } = await adminClient
      .from('provider_subscriptions')
      .select('status, plan_type, access_ends_at')
      .in('user_id', userIds)
      .is('provider_submission_id', null)
      .in('status', ['active', 'cancelled']);
    if (subError) throw new Error(`membership lookup failed: ${subError.message}`);

    const now = Date.now();
    const isMember = (rows ?? []).some((row) => grantsWebAccess(row as MembershipRow, now));
    return jsonResponse({ isMember });
  } catch (err) {
    console.error('Membership check error:', err instanceof Error ? err.message : 'unknown');
    return jsonResponse({ isMember: false }, 500);
  }
});
