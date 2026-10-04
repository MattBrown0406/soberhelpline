import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isActiveFamilyMember } from "../_shared/familyMembership.ts";
import { checkBookingShape, checkSlotsBookable } from "../_shared/bookingRules.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_API_BASE = Deno.env.get('PAYPAL_MODE') === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

/** Best effort: tell Matt a customer paid but no booking was made. Never throws. */
async function alertPaidNotBooked(details: Record<string, unknown>): Promise<void> {
  const apiKey = Deno.env.get('SENDGRID_API_KEY');
  if (!apiKey) {
    console.error('captured_booking_failed: SENDGRID_API_KEY not configured, admin not emailed');
    return;
  }
  const rows = Object.entries(details)
    .map(([key, value]) => `<tr><td><strong>${escapeHtml(key)}</strong></td><td>${escapeHtml(value)}</td></tr>`)
    .join('');
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: 'matt@soberhelpline.com' }] }],
        from: { email: 'matt@soberhelpline.com', name: 'Sober Helpline' },
        subject: 'Action needed: coaching paid but not booked',
        content: [{
          type: 'text/html',
          value: `<p>A coaching payment was captured in PayPal, but the booking could not be created (usually someone else booked the same time a moment earlier). Contact the client to pick a new time, or refund the payment in PayPal.</p><table>${rows}</table>`,
        }],
      }),
    });
    if (!response.ok) console.error('captured_booking_failed: admin email failed', response.status);
  } catch {
    console.error('captured_booking_failed: admin email failed');
  }
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_SECRET_KEY');
  if (!clientId || !clientSecret) throw new Error('PayPal credentials not configured');

  const auth = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal auth error:', error);
    throw new Error('Failed to get PayPal access token');
  }
  const data = await response.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { action } = body;

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (action === 'create-order') {
      const {
        provider_id, bookings, intake_responses,
        client_name, client_email, client_phone,
        plan_type, return_url, cancel_url,
      } = body;

      if (!provider_id || !bookings?.length || !client_name || !client_email || !return_url || !cancel_url) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get provider info for pricing
      const { data: provider, error: providerError } = await adminClient
        .from('consultation_providers')
        .select('*')
        .eq('id', provider_id)
        .eq('status', 'active')
        .single();

      if (providerError || !provider) {
        return new Response(JSON.stringify({ error: 'Provider not found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // One payment buys exactly one plan's sessions, at times the provider
      // offers: a known plan, its exact number of sessions, each in the future,
      // on the provider's calendar and free. The price below depends only on the
      // plan, so this is what stops "pay once, get N sessions".
      const shape = checkBookingShape(plan_type, bookings);
      const bookable = shape.ok ? await checkSlotsBookable(adminClient, provider, plan_type, shape.bookings) : shape;
      if (!bookable.ok) {
        return new Response(JSON.stringify({ error: bookable.error, code: bookable.code }), {
          status: bookable.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const checkedBookings = bookable.bookings;

      // Member price, decided server-side (never from anything the browser sends):
      // only for a SIGNED-IN website account that is a member under the site's one
      // membership rule (is_active_family_member — web members, app members signed
      // in from the Sober Helpline app, cancelled members until their paid-through
      // date). A typed email never unlocks the member price: it would let anyone
      // claim a member's discount and would reveal whether an email belongs to a
      // member. Signed in from the app but not a member: the standard price.
      let isMember = false;
      let userId: string | null = null;

      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const userClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          { global: { headers: { Authorization: authHeader } } }
        );
        const { data: { user } } = await userClient.auth.getUser();
        if (user) {
          userId = user.id;
          isMember = await isActiveFamilyMember(adminClient, user.id);
        }
      }

      // Determine amount server-side
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
      const totalAmount = isParallelRecovery ? 1500 : isStabilization ? 500 : singleSessionRate;

      // Store full booking payload for later. userId / isMember / amount are the
      // server's decisions; the booking is recorded with exactly this amount.
      const bookingPayload = {
        provider_id, bookings: checkedBookings, intake_responses,
        client_name, client_email, client_phone,
        plan_type, userId, isMember, amount: totalAmount,
      };

      // Create PayPal order
      const accessToken = await getPayPalAccessToken();
      const description = isParallelRecovery
        ? 'Parallel Recovery Program (12 sessions)'
        : isStabilization
        ? 'Family Stabilization Plan (4 sessions)'
        : isReadinessIntensive
        ? 'Family Readiness Intensive (90 min)'
        : 'Coaching Consultation (60 min)';

      const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: totalAmount.toFixed(2),
            },
            description,
          }],
          application_context: {
            brand_name: 'Sober Helpline',
            landing_page: 'NO_PREFERENCE',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: return_url,
            cancel_url: cancel_url,
          },
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.text();
        console.error('PayPal order creation error:', error);
        throw new Error('Failed to create PayPal order');
      }

      const orderData = await orderResponse.json();
      const approvalLink = orderData.links?.find((l: any) => l.rel === 'approve');

      if (!approvalLink?.href) {
        throw new Error('No PayPal approval URL received');
      }

      // Store pending order in DB
      const { error: insertError } = await adminClient
        .from('pending_consultation_orders')
        .insert({
          paypal_order_id: orderData.id,
          booking_payload: bookingPayload,
          status: 'pending',
        });

      if (insertError) {
        console.error('Failed to store pending order:', insertError);
        throw new Error('Failed to save order details');
      }

      console.log(`Created PayPal order ${orderData.id} for $${totalAmount.toFixed(2)}`);

      return new Response(JSON.stringify({
        orderId: orderData.id,
        approvalUrl: approvalLink.href,
        amount: totalAmount,
        isMember,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'capture-order') {
      const { orderId } = body;
      if (!orderId) {
        return new Response(JSON.stringify({ error: 'Missing orderId' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Atomically claim the pending order so concurrent/duplicate capture calls
      // (double-clicks, React re-mounts, PayPal retries) cannot create two bookings.
      const { data: claimedRows } = await adminClient
        .from('pending_consultation_orders')
        .update({ status: 'capturing' })
        .eq('paypal_order_id', orderId)
        .eq('status', 'pending')
        .select('*');

      let pendingOrder = claimedRows?.[0];

      // Recover orders left stuck in 'capturing' by an earlier failed attempt.
      if (!pendingOrder) {
        const staleCutoff = new Date(Date.now() - 3 * 60 * 1000).toISOString();
        const { data: stuckRows } = await adminClient
          .from('pending_consultation_orders')
          .update({ status: 'capturing' })
          .eq('paypal_order_id', orderId)
          .eq('status', 'capturing')
          .lt('created_at', staleCutoff)
          .select('*');
        pendingOrder = stuckRows?.[0];
      }

      if (!pendingOrder) {
        // Already claimed/processed by another request — return the existing booking instead of duplicating.
        const { data: existingBookings } = await adminClient
          .from('consultation_bookings')
          .select('id')
          .eq('paypal_order_id', orderId);

        if (existingBookings?.length) {
          return new Response(JSON.stringify({
            success: true,
            duplicate: true,
            bookingIds: existingBookings.map((b: any) => b.id),
          }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ error: 'Order not found or already processed' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }


      // Capture PayPal payment. If anything fails before the money moves, release the
      // claim back to 'pending' so the customer can retry instead of being locked out.
      let captureData: any;
      try {
        const accessToken = await getPayPalAccessToken();
        const captureResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!captureResponse.ok) {
          const error = await captureResponse.text();
          console.error('PayPal capture error:', error);
          throw new Error('Payment capture failed');
        }

        captureData = await captureResponse.json();
        if (captureData.status !== 'COMPLETED') {
          throw new Error(`Payment not completed. Status: ${captureData.status}`);
        }
      } catch (captureErr) {
        await adminClient
          .from('pending_consultation_orders')
          .update({ status: 'pending' })
          .eq('id', pendingOrder.id)
          .eq('status', 'capturing');
        throw captureErr;
      }

      console.log(`Payment captured for order ${orderId}`);

      // Mark order as captured
      await adminClient
        .from('pending_consultation_orders')
        .update({ status: 'captured' })
        .eq('id', pendingOrder.id);

      // Now create the actual booking via the book-consultation function, with the
      // account, member status and amount decided when this order was created, and
      // the amount PayPal actually captured.
      const payload = pendingOrder.booking_payload as any;
      const capturedValue = Number(captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value);
      const amountCharged = Number.isFinite(capturedValue) && capturedValue > 0
        ? capturedValue
        : (typeof payload.amount === 'number' ? payload.amount : null);
      const processUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/book-consultation`;
      const bookingRes = await fetch(processUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider_id: payload.provider_id,
          bookings: payload.bookings,
          intake_responses: payload.intake_responses,
          client_name: payload.client_name,
          client_email: payload.client_email,
          client_phone: payload.client_phone,
          plan_type: payload.plan_type,
          user_id: typeof payload.userId === 'string' ? payload.userId : null,
          is_member: payload.isMember === true,
          amount_charged: amountCharged,
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok || bookingData.error) {
        console.error('Booking creation error after payment:', bookingData);
        // Payment was captured but booking failed - flag for admin
        await adminClient
          .from('pending_consultation_orders')
          .update({ status: 'captured_booking_failed' })
          .eq('id', pendingOrder.id);
        await alertPaidNotBooked({
          'PayPal order': orderId,
          'Pending order': pendingOrder.id,
          'Amount captured': amountCharged ?? 'unknown',
          'Plan': payload.plan_type ?? 'single',
          'Client': payload.client_name ?? '',
          'Client email': payload.client_email ?? '',
          'Client phone': payload.client_phone ?? '',
          'Requested times': Array.isArray(payload.bookings)
            ? payload.bookings.map((b: any) => `${b?.booking_date ?? ''} ${b?.start_time ?? ''}`.trim()).join(', ')
            : '',
          'Reason': typeof bookingData?.code === 'string' ? bookingData.code : 'booking_failed',
        });

        return new Response(JSON.stringify({
          error: 'Payment was successful but booking creation failed. Our team has been notified and will process your booking manually.',
          paymentCaptured: true,
        }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update booking records with PayPal order ID
      if (bookingData.bookingIds?.length) {
        for (const bookingId of bookingData.bookingIds) {
          await adminClient
            .from('consultation_bookings')
            .update({ paypal_order_id: orderId })
            .eq('id', bookingId);
        }
      }

      // Mark order as completed
      await adminClient
        .from('pending_consultation_orders')
        .update({ status: 'completed' })
        .eq('id', pendingOrder.id);

      return new Response(JSON.stringify({
        success: true,
        bookingIds: bookingData.bookingIds,
        isMember: bookingData.isMember,
        amountCharged: bookingData.amountCharged,
        coachingPlanId: bookingData.coachingPlanId,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    console.error('Consultation payment error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
