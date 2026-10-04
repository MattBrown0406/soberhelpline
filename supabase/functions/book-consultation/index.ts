import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isActiveFamilyMember } from "../_shared/familyMembership.ts";
import { checkBookingShape } from "../_shared/bookingRules.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/** Constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  let diff = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  return diff === 0;
}

/**
 * The website account whose LOGIN email is `email`, only if that email is
 * confirmed; otherwise null. Never profile_private.email: anyone can set that to
 * someone else's address, and a linked booking (intake answers, Zoom link) shows
 * on that account's coaching pages. Any doubt (lookup fails, unconfirmed or
 * different email): null, and the booking stays a guest booking.
 */
async function confirmedAccountIdForEmail(admin: SupabaseClient, email: string): Promise<string | null> {
  try {
    // auth.users lookup by login email (service role only; 2026-10-02 migration).
    const { data: id, error } = await admin.rpc('auth_user_id_by_email', { p_email: email });
    if (error || typeof id !== 'string' || !id) return null;
    const { data, error: userError } = await admin.auth.admin.getUserById(id);
    const user = data?.user;
    if (userError || !user?.email_confirmed_at) return null;
    if (user.email?.toLowerCase().trim() !== email) return null;
    return user.id;
  } catch {
    return null;
  }
}

// Creates CONFIRMED bookings (and sends Zoom links), so it is only called by
// consultation-payment after PayPal has captured the payment, with this
// project's service role key. Anyone else could book without paying.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const bearer = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!safeEqual(bearer, serviceRoleKey)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  try {
    const body = await req.json();
    const {
      provider_id,
      bookings: requestedBookings, // Array of { booking_date, start_time, end_time, timezone }
      intake_responses,
      client_name,
      client_email,
      client_phone,
      plan_type, // 'single', 'stabilization', 'parallel-recovery', 'family-readiness-intensive'
      // Decided by consultation-payment when it created the PayPal order:
      user_id, // signed-in website account, or null for a guest
      is_member, // member price applied (is_active_family_member)
      amount_charged, // what PayPal captured, in dollars
    } = body;

    if (!provider_id || !requestedBookings?.length || !client_name || !client_email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Exactly the plan's number of well-formed, distinct sessions (consultation-payment
    // already checked this, and the times against the calendar, when it created the
    // order). Orders created before that check existed may carry any plan value,
    // which was priced as one session: accept those as one session.
    const shape = checkBookingShape(plan_type, requestedBookings, { legacyPlans: true });
    if (!shape.ok) {
      console.error('book-consultation: rejected booking shape', shape.code);
      return new Response(JSON.stringify({ error: shape.error, code: shape.code }), { status: shape.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const bookings = shape.bookings;

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

    // The account that paid (signed in), as recorded when the order was created.
    let userId: string | null = typeof user_id === 'string' && user_id ? user_id : null;

    // Member price: consultation-payment's decision when it created the order
    // (signed-in account + is_active_family_member). Older pending orders without
    // it fall back to the same rule for the recorded account.
    const isMember = typeof is_member === 'boolean'
      ? is_member
      : (userId ? await isActiveFamilyMember(adminClient, userId) : false);

    // Guest booking: link it to the website account that signs in with that
    // email (confirmed), if any, so it shows on their coaching pages.
    // (Linking only — never pricing.)
    if (!userId) {
      userId = await confirmedAccountIdForEmail(adminClient, String(client_email).toLowerCase().trim());
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

    const computedAmount = isParallelRecovery ? 1500 : isStabilization ? 500 : singleSessionRate;
    // Record what was actually charged (PayPal's captured amount) when known.
    const chargedAmount = Number(amount_charged);
    const totalAmount = Number.isFinite(chargedAmount) && chargedAmount > 0 ? chargedAmount : computedAmount;
    if (totalAmount !== computedAmount) {
      console.warn('book-consultation: charged amount differs from the computed price', { plan_type, totalAmount, computedAmount });
    }

    const normalizedEmail = client_email.toLowerCase().trim();

    // Guard against duplicate bookings for the exact same slot (double submits / retries)
    const { data: existingSlots } = await adminClient
      .from('consultation_bookings')
      .select('id, booking_date, start_time, client_email')
      .eq('provider_id', provider.id)
      .neq('status', 'cancelled')
      .in('booking_date', bookings.map((b) => b.booking_date));

    const slotKey = (b: { booking_date: string; start_time: string }) => `${b.booking_date}|${String(b.start_time).slice(0, 5)}`;

    // Slots already booked by THIS client = duplicate submit (safe to skip).
    const ownKeys = new Set(
      (existingSlots || [])
        .filter((b: any) => String(b.client_email || '').toLowerCase().trim() === normalizedEmail)
        .map(slotKey)
    );
    // Slots taken by SOMEONE ELSE = real conflict; never silently drop them.
    const conflictKeys = new Set(
      (existingSlots || [])
        .filter((b: any) => String(b.client_email || '').toLowerCase().trim() !== normalizedEmail)
        .map(slotKey)
    );

    const conflicting = bookings.filter((b) => conflictKeys.has(slotKey(b)));
    if (conflicting.length > 0) {
      console.error('Slot conflict with another client:', conflicting);
      return new Response(
        JSON.stringify({
          error: 'One or more of the selected times were just booked by someone else. Our team will contact you to reschedule.',
          slotConflict: true,
          conflictingSlots: conflicting.map((b) => ({ booking_date: b.booking_date, start_time: b.start_time })),
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newBookings = bookings.filter((b) => !ownKeys.has(slotKey(b)));

    if (newBookings.length === 0) {
      const { data: already } = await adminClient
        .from('consultation_bookings')
        .select('id')
        .eq('provider_id', provider.id)
        .eq('client_email', normalizedEmail)
        .neq('status', 'cancelled')
        .in('booking_date', bookings.map((b) => b.booking_date));

      return new Response(
        JSON.stringify({
          success: true,
          duplicate: true,
          bookingIds: (already || []).map((b: any) => b.id),
          isMember,
          amountCharged: totalAmount,
          coachingPlanId,
          processingComplete: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create booking records
    const bookingInserts = newBookings.map((b, index: number) => ({
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
      client_email: normalizedEmail,
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


    // Process each booking (Zoom + emails). If processing fails, the paid booking
    // remains recorded but the response carries a warning, and the recovery job will retry.
    const processingResults: any[] = [];
    for (const booking of (bookingsData || [])) {
      try {
        const processUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/process-consultation-booking`;
        const res = await fetch(processUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookingId: booking.id }),
        });
        const text = await res.text();
        let payload: any = null;
        try { payload = text ? JSON.parse(text) : null; } catch { payload = { raw: text }; }

        processingResults.push({ bookingId: booking.id, ok: res.ok, status: res.status, payload });
        if (!res.ok) {
          console.error('Process booking error:', text);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        processingResults.push({ bookingId: booking.id, ok: false, status: 0, error: message });
        console.error('Process booking call error:', err);
      }
    }

    const processingFailed = processingResults.some((r) => !r.ok);

    return new Response(
      JSON.stringify({
        success: true,
        bookingIds: bookingsData?.map((b: any) => b.id) || [],
        isMember,
        amountCharged: totalAmount,
        coachingPlanId,
        processingComplete: !processingFailed,
        processingResults,
        warning: processingFailed
          ? 'Booking/payment succeeded, but Zoom/email processing needs retry. Client was not sent a fake Zoom link.'
          : undefined,
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
