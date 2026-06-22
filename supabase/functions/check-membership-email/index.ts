import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This endpoint reveals membership status, which is sensitive in an
// addiction-recovery context. It is restricted to authenticated users who
// are checking their OWN email. Unauthenticated callers always get false.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const jsonResponse = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return jsonResponse({ isMember: false });
    }

    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return jsonResponse({ isMember: false }, 401);
    }
    const token = authHeader.replace('Bearer ', '');

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the caller's JWT
    const { data: userData, error: userError } = await adminClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return jsonResponse({ isMember: false }, 401);
    }

    const normalizedEmail = email.toLowerCase().trim();
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

    // Find user_id by email in profile_private
    const { data: profile } = await adminClient
      .from('profile_private')
      .select('user_id')
      .eq('email', normalizedEmail)
      .limit(1)
      .maybeSingle();

    if (!profile) {
      return jsonResponse({ isMember: false });
    }

    // Check for active family membership (provider_submission_id IS NULL = family membership)
    const { data: subscription } = await adminClient
      .from('provider_subscriptions')
      .select('id')
      .eq('user_id', profile.user_id)
      .eq('status', 'active')
      .is('provider_submission_id', null)
      .limit(1)
      .maybeSingle();

    return jsonResponse({ isMember: !!subscription });
  } catch (err) {
    console.error('Membership check error:', err);
    return jsonResponse({ isMember: false }, 500);
  }
});
