import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      provider_id,
      bookings, // Array of { booking_date, start_time, end_time, timezone }
      intake_responses,
      client_name,
      client_email,
      client_phone,
      plan_type, // 'single', 'stabilization', 'parallel-recovery', 'family-readiness-intensive'
    } = body;

    if (!provider_id || !bookings?.length || !client_name || !client_email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get provider info
    const { data: provider, error: providerError } = await adminClient
      .from('consultation_providers')
      .select('*')
      .eq('id', provider_id)
      .eq('status', 'active')
      .single();

    if (providerError || !provider) {
      return new Response(JSON.stringify({ error: 'Provider not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Check if user is logged in (optional auth)
    let userId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const userClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user } } = await userClient.auth.getUser();
      if (user) userId = user.id;
    }

    // SERVER-SIDE membership check — never trust client-passed price
    let isMember = false;

    // Check by user_id first (if logged in)
    if (userId) {
      const { data: sub } = await adminClient
        .from('provider_subscriptions')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .is('provider_submission_id', null)
        .limit(1)
        .maybeSingle();
      isMember = !!sub;
    }

    // If not found by user_id, check by email
    if (!isMember) {
      const { data: profile } = await adminClient
        .from('profile_private')
        .select('user_id')
        .eq('email', client_email.toLowerCase().trim())
        .limit(1)
        .maybeSingle();

      if (profile) {
        const { data: sub } = await adminClient
          .from('provider_subscriptions')
          .select('id')
          .eq('user_id', profile.user_id)
          .eq('status', 'active')
          .is('provider_submission_id', null)
          .limit(1)
          .maybeSingle();
        isMember = !!sub;
        // Also set userId if found via email
        if (!userId) userId = profile.user_id;
      }
    }

    // Determine pricing server-side
    const isReadinessIntensive = plan_type === 'family-readiness-intensive';
    const isStabilization = plan_type === 'stabilization';
    const isParallelRecovery = plan_type === 'parallel-recovery';
    const isMultiSession = isStabilization || isParallelRecovery;

    const memberRate = 125;
    const readinessStandardRate = 2500;
    const readinessMemberRate = 2250;
    const singleSessionRate = isReadinessIntensive
      ? (isMember ? readinessMemberRate : readinessStandardRate)
      : isMember ? memberRate : provider.session_rate;

    let coachingPlanId: string | null = null;

    // Create coaching plan for multi-session bookings
    if (isMultiSession) {
      const planConfig = isParallelRecovery
        ? { plan_type: 'parallel-recovery', total_sessions: 12, total_amount: 1500, provider_payout_per_session: 100 }
        : { plan_type: 'stabilization', total_sessions: 4, total_amount: 500, provider_payout_per_session: 100 };

      const { data: newPlan, error: planError } = await adminClient
        .from('coaching_plans')
        .insert({
          client_user_id: userId || null, // null for guest bookings (client_user_id must be UUID)
          provider_id: provider.id,
          ...planConfig,
        })
        .select()
        .single();

      if (planError) {
        console.error('Plan creation error:', planError);
        return new Response(JSON.stringify({ error: 'Failed to create coaching plan' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      coachingPlanId = newPlan.id;
    }

    const totalAmount = isParallelRecovery ? 1500 : isStabilization ? 500 : singleSessionRate;

    // Create booking records
    const bookingInserts = bookings.map((b: any, index: number) => ({
      provider_id: provider.id,
      client_user_id: userId, // null for guests
      booking_date: b.booking_date,
      start_time: b.start_time,
      end_time: isReadinessIntensive ? b.end_time : b.end_time,
      timezone: b.timezone || 'America/Los_Angeles',
      amount_paid: isMultiSession ? (index === 0 ? totalAmount : 0) : totalAmount,
      intake_responses: intake_responses ? {
        ...intake_responses,
        service_type: isReadinessIntensive ? 'family-readiness-intensive' : intake_responses.service_type,
      } : (isReadinessIntensive ? { service_type: 'family-readiness-intensive' } : null),
      client_name,
      client_email: client_email.toLowerCase().trim(),
      client_phone: client_phone || null,
      status: 'confirmed',
      coaching_plan_id: coachingPlanId,
    }));

    const { data: bookingsData, error: insertError } = await adminClient
      .from('consultation_bookings')
      .insert(bookingInserts)
      .select();

    if (insertError) {
      console.error('Booking insert error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to create booking' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Process each booking (Zoom + emails) by calling the existing edge function logic
    // We'll do it inline here using the same approach
    for (const booking of (bookingsData || [])) {
      try {
        // Call process-consultation-booking with service role
        const processUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/process-consultation-booking`;
        const res = await fetch(processUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookingId: booking.id }),
        });
        if (!res.ok) {
          console.error('Process booking error:', await res.text());
        }
      } catch (err) {
        console.error('Process booking call error:', err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        bookingIds: bookingsData?.map((b: any) => b.id) || [],
        isMember,
        amountCharged: totalAmount,
        coachingPlanId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Book consultation error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
