import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ isMember: false }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find user_id by email in profile_private
    const { data: profile } = await adminClient
      .from('profile_private')
      .select('user_id')
      .eq('email', email.toLowerCase().trim())
      .limit(1)
      .maybeSingle();

    if (!profile) {
      return new Response(JSON.stringify({ isMember: false }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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

    return new Response(
      JSON.stringify({ isMember: !!subscription }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Membership check error:', err);
    return new Response(JSON.stringify({ isMember: false }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
