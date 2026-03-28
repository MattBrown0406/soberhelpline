import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_API_BASE = Deno.env.get('PAYPAL_MODE') === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

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

      // Check membership server-side
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
          const { data: sub } = await adminClient
            .from('provider_subscriptions')
            .select('id')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .is('provider_submission_id', null)
            .limit(1)
            .maybeSingle();
          isMember = !!sub;
        }
      }

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
          if (!userId) userId = profile.user_id;
        }
      }

      // Determine amount server-side
      const isStabilization = plan_type === 'stabilization';
      const isParallelRecovery = plan_type === 'parallel-recovery';
      const isMultiSession = isStabilization || isParallelRecovery;
      const memberRate = 125;
      const singleSessionRate = isMember ? memberRate : provider.session_rate;
      const totalAmount = isParallelRecovery ? 1500 : isStabilization ? 500 : singleSessionRate;

      // Store full booking payload for later
      const bookingPayload = {
        provider_id, bookings, intake_responses,
        client_name, client_email, client_phone,
        plan_type, userId, isMember,
      };

      // Create PayPal order
      const accessToken = await getPayPalAccessToken();
      const description = isParallelRecovery
        ? 'Parallel Recovery Program (12 sessions)'
        : isStabilization
        ? 'Family Stabilization Plan (4 sessions)'
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

      // Get pending order
      const { data: pendingOrder, error: fetchError } = await adminClient
        .from('pending_consultation_orders')
        .select('*')
        .eq('paypal_order_id', orderId)
        .eq('status', 'pending')
        .single();

      if (fetchError || !pendingOrder) {
        return new Response(JSON.stringify({ error: 'Order not found or already processed' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Capture PayPal payment
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

      const captureData = await captureResponse.json();
      if (captureData.status !== 'COMPLETED') {
        throw new Error(`Payment not completed. Status: ${captureData.status}`);
      }

      console.log(`Payment captured for order ${orderId}`);

      // Mark order as captured
      await adminClient
        .from('pending_consultation_orders')
        .update({ status: 'captured' })
        .eq('id', pendingOrder.id);

      // Now create the actual booking via the book-consultation function
      const payload = pendingOrder.booking_payload as any;
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
