import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PayPal webhook event types we care about
const SUBSCRIPTION_ACTIVATED = 'BILLING.SUBSCRIPTION.ACTIVATED';
const SUBSCRIPTION_CANCELLED = 'BILLING.SUBSCRIPTION.CANCELLED';
const SUBSCRIPTION_SUSPENDED = 'BILLING.SUBSCRIPTION.SUSPENDED';
const SUBSCRIPTION_EXPIRED = 'BILLING.SUBSCRIPTION.EXPIRED';
const PAYMENT_COMPLETED = 'PAYMENT.SALE.COMPLETED';

// PayPal API base URL — sandbox when PAYPAL_MODE=sandbox, live otherwise
const PAYPAL_API_BASE = Deno.env.get('PAYPAL_MODE') === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_SECRET_KEY');

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

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
    console.error('Failed to get PayPal access token:', error);
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function verifyWebhookSignature(req: Request, bodyText: string): Promise<boolean> {
  const webhookId = Deno.env.get('PAYPAL_WEBHOOK_ID');
  
  if (!webhookId) {
    console.error('PAYPAL_WEBHOOK_ID not configured');
    return false;
  }

  const transmissionId = req.headers.get('paypal-transmission-id');
  const transmissionTime = req.headers.get('paypal-transmission-time');
  const transmissionSig = req.headers.get('paypal-transmission-sig');
  const certUrl = req.headers.get('paypal-cert-url');
  const authAlgo = req.headers.get('paypal-auth-algo');

  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
    console.error('Missing required PayPal webhook headers');
    return false;
  }

  try {
    const accessToken = await getPayPalAccessToken();
    
    const verifyResponse = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: webhookId,
        webhook_event: JSON.parse(bodyText),
      }),
    });

    if (!verifyResponse.ok) {
      const error = await verifyResponse.text();
      console.error('PayPal signature verification request failed:', error);
      return false;
    }

    const result = await verifyResponse.json();
    console.log('PayPal signature verification result:', result.verification_status);
    
    return result.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Track which handled event type we entered so the outer catch can decide
  // between retryable 5xx (recognized payment-processing failure) and 200
  // (unrelated / already committed).
  let handledEventType: string | null = null;

  try {
    // Read body as text first for signature verification
    const bodyText = await req.text();
    
    // Verify the webhook signature
    const isValid = await verifyWebhookSignature(req, bodyText);
    
    if (!isValid) {
      console.error('Invalid PayPal webhook signature - rejecting request');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('PayPal webhook signature verified successfully');

    const body = JSON.parse(bodyText);
    const eventType = body.event_type;
    const resource = body.resource;
    handledEventType = typeof eventType === 'string' ? eventType : null;

    // Log event type + safe identifiers only. Never log the full resource
    // (it can contain payer name/email and other customer details).
    console.log('PayPal webhook received:', eventType, 'resource_id:', resource?.id ?? null);

    // Create Supabase client with service role for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );


    switch (eventType) {
      case SUBSCRIPTION_ACTIVATED: {
        const subscriptionId = resource.id;
        const startTime = resource.start_time;
        const nextBillingTime = resource.billing_info?.next_billing_time;

        console.log(`Activating subscription: ${subscriptionId}`);

        // Update subscription status to active
        const { data, error } = await supabaseClient
          .from('provider_subscriptions')
          .update({
            status: 'active',
            start_date: startTime,
            next_billing_date: nextBillingTime,
            updated_at: new Date().toISOString(),
          })
          .eq('paypal_subscription_id', subscriptionId)
          .select();

        if (error) {
          console.error('Error activating subscription:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to activate subscription' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Subscription activated successfully:', data);

        // If this is a provider subscription, auto-approve the provider
        if (data && data.length > 0 && data[0].provider_submission_id) {
          const { error: approveError } = await supabaseClient
            .from('provider_submissions')
            .update({ status: 'approved' })
            .eq('id', data[0].provider_submission_id);

          if (approveError) {
            console.error('Error auto-approving provider:', approveError);
          } else {
            console.log('Provider auto-approved via webhook');
          }
        }

        break;
      }

      case SUBSCRIPTION_CANCELLED:
      case SUBSCRIPTION_SUSPENDED:
      case SUBSCRIPTION_EXPIRED: {
        const subscriptionId = resource.id;
        const newStatus = eventType === SUBSCRIPTION_CANCELLED ? 'cancelled'
          : eventType === SUBSCRIPTION_SUSPENDED ? 'suspended'
          : 'expired';

        console.log(`Updating subscription ${subscriptionId} to ${newStatus}`);

        // Preserve paid-through access for cancellations that arrive via webhook
        // (e.g. member cancelled directly in PayPal).
        const nowIso = new Date().toISOString();
        const updatePayload: Record<string, unknown> = {
          status: newStatus,
          updated_at: nowIso,
        };
        if (newStatus === 'cancelled') {
          updatePayload.cancelled_at = nowIso;
          updatePayload.paypal_cancel_confirmed_at = nowIso;
          updatePayload.cancellation_source = 'paypal_webhook';
        }

        const { data: existing } = await supabaseClient
          .from('provider_subscriptions')
          .select('next_billing_date, access_ends_at')
          .eq('paypal_subscription_id', subscriptionId)
          .maybeSingle();

        if (newStatus === 'cancelled' && existing && !existing.access_ends_at) {
          updatePayload.access_ends_at = existing.next_billing_date || null;
        }

        const { error } = await supabaseClient
          .from('provider_subscriptions')
          .update(updatePayload)
          .eq('paypal_subscription_id', subscriptionId);

        if (error) {
          console.error(`Error updating subscription to ${newStatus}:`, error);
          return new Response(
            JSON.stringify({ error: `Failed to update subscription to ${newStatus}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Subscription ${subscriptionId} updated to ${newStatus}`);
        break;
      }

      case PAYMENT_COMPLETED: {
        // Update next billing date when payment is completed
        const billingAgreementId = resource.billing_agreement_id;
        if (billingAgreementId) {
          console.log(`Payment completed for subscription: ${billingAgreementId}`);
          
          // Fetch latest subscription details from PayPal to get updated next_billing_time
          try {
            const accessToken = await getPayPalAccessToken();
            const subResponse = await fetch(
              `${PAYPAL_API_BASE}/v1/billing/subscriptions/${billingAgreementId}`,
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (subResponse.ok) {
              const subDetails = await subResponse.json();
              const nextBillingTime = subDetails.billing_info?.next_billing_time;

              if (nextBillingTime) {
                const { error: updateError } = await supabaseClient
                  .from('provider_subscriptions')
                  .update({
                    next_billing_date: nextBillingTime,
                    status: 'active',
                    updated_at: new Date().toISOString(),
                  })
                  .eq('paypal_subscription_id', billingAgreementId);

                if (updateError) {
                  console.error('Error updating next_billing_date:', updateError);
                } else {
                  console.log(`Updated next_billing_date to ${nextBillingTime} for ${billingAgreementId}`);
                }
              }
            } else {
              console.error('Failed to fetch subscription details after payment:', await subResponse.text());
            }
          } catch (fetchErr) {
            console.error('Error fetching subscription details after payment:', fetchErr);
          }
        }
        break;
      }

      case 'PAYMENT.CAPTURE.COMPLETED': {
        // Coaching-payment safety net: recover a captured order if the browser
        // closed before coaching-order-capture finalized locally.
        const eventBriefC = `PAYMENT.CAPTURE.COMPLETED:${body?.id ?? 'no-event-id'}`;
        const capId: string | undefined = resource?.id;
        const capStatus: string | undefined = resource?.status;
        const amtValue: string | undefined = resource?.amount?.value;
        const amtCur: string | undefined = resource?.amount?.currency_code;
        const customId: string | undefined = resource?.custom_id ?? resource?.invoice_id;
        const captureCreateTime: string | undefined = resource?.create_time;
        const orderIdFromLinks: string | undefined = (() => {
          const links: any[] = Array.isArray(resource?.links) ? resource.links : [];
          const up = links.find((l: any) => l?.rel === 'up')?.href;
          if (typeof up === 'string' && up.includes('/checkout/orders/')) {
            return up.split('/').pop();
          }
          return resource?.supplementary_data?.related_ids?.order_id;
        })();
        const paypalEventIdC = typeof body?.id === 'string' ? body.id : null;

        if (!capId || !paypalEventIdC) {
          console.error('COMPLETED missing capture id or event id', eventBriefC);
          return new Response(
            JSON.stringify({ error: 'missing_capture_or_event_id' }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (capStatus !== 'COMPLETED' || amtValue !== '150.00' || amtCur !== 'USD') {
          // Not a coaching $150 capture (or not completed yet). Ignore quietly.
          console.log('COMPLETED not a coaching $150 USD capture; ignoring', eventBriefC);
          break;
        }

        // Correlate to coaching_checkout_orders. Prefer custom_id (session id we set on the order).
        let coachingRowC: any = null;
        if (customId) {
          const { data, error } = await supabaseClient
            .from('coaching_checkout_orders')
            .select('id, app_booking_ref, paypal_order_id, service_type, status')
            .eq('id', customId)
            .maybeSingle();
          if (error) {
            console.error('COMPLETED lookup by custom_id failed', eventBriefC, error.message);
            return new Response(
              JSON.stringify({ error: 'db_lookup_failed' }),
              { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          coachingRowC = data ?? null;
        }
        if (!coachingRowC && orderIdFromLinks) {
          const { data, error } = await supabaseClient
            .from('coaching_checkout_orders')
            .select('id, app_booking_ref, paypal_order_id, service_type, status')
            .eq('paypal_order_id', orderIdFromLinks)
            .maybeSingle();
          if (error) {
            console.error('COMPLETED lookup by order_id failed', eventBriefC, error.message);
            return new Response(
              JSON.stringify({ error: 'db_lookup_failed' }),
              { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          coachingRowC = data ?? null;
        }

        // Not visible yet: could be race with browser-side order write. Retryable.
        if (!coachingRowC) {
          console.log('COMPLETED: coaching order not visible yet; requesting retry', eventBriefC);
          return new Response(
            JSON.stringify({ error: 'coaching_order_not_visible' }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (coachingRowC.service_type !== 'plan_review_coaching') {
          console.log('COMPLETED: not plan_review_coaching; ignoring', eventBriefC);
          break;
        }
        if (!orderIdFromLinks || coachingRowC.paypal_order_id !== orderIdFromLinks) {
          // If order id was found from links and doesn't match, this is a mismatched event; ignore.
          if (orderIdFromLinks) {
            console.log('COMPLETED: order id mismatch; ignoring', eventBriefC);
            break;
          }
        }

        const eventUidC = `PAYMENT.CAPTURE.COMPLETED.${coachingRowC.id}.${capId}.${paypalEventIdC}`;
        const capturedAtIso = captureCreateTime || body?.create_time || new Date().toISOString();
        const payloadC = {
          event: 'payment.captured',
          booking_id: coachingRowC.app_booking_ref,
          order_id: coachingRowC.paypal_order_id,
          capture_id: capId,
          amount_cents: 15000,
          currency: 'USD',
          status: 'captured',
          captured_at: capturedAtIso,
          event_id: eventUidC,
        };

        const { data: rpcC, error: rpcCErr } = await supabaseClient.rpc('finalize_coaching_capture', {
          p_session_id: coachingRowC.id,
          p_paypal_order_id: coachingRowC.paypal_order_id,
          p_capture_id: capId,
          p_service_type: 'plan_review_coaching',
          p_amount_cents: 15000,
          p_currency: 'USD',
          p_captured_at: capturedAtIso,
          p_event_id: eventUidC,
          p_payload: payloadC,
        });
        if (rpcCErr || !rpcC || (rpcC as any).ok !== true) {
          console.error('COMPLETED finalize failed', eventBriefC, (rpcC as any)?.code ?? rpcCErr?.message);
          return new Response(
            JSON.stringify({ error: 'coaching_finalize_failed' }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log(`COMPLETED finalized coaching capture ${capId} (already=${(rpcC as any).already})`);
        break;
      }

      case 'PAYMENT.CAPTURE.REFUNDED':
      case 'PAYMENT.CAPTURE.REVERSED':
      case 'PAYMENT.CAPTURE.DENIED': {
        // Correlate to the ORIGINAL capture id (not the refund/reversal id).
        const links: any[] = Array.isArray(resource?.links) ? resource.links : [];
        const upHref: string | undefined = links.find((l: any) => l?.rel === 'up')?.href;
        const upId = upHref ? upHref.split('/').pop() : undefined;
        const resourceId: string | undefined = resource?.id;

        let originalCaptureId: string | undefined;
        if (eventType === 'PAYMENT.CAPTURE.REFUNDED') {
          originalCaptureId = upId;
        } else {
          originalCaptureId = resourceId ?? upId;
        }

        const eventBrief = `${eventType}:${body?.id ?? 'no-event-id'}`;
        if (!originalCaptureId) {
          console.error('Cannot determine original capture id for', eventBrief);
          return new Response(
            JSON.stringify({ error: 'missing_original_capture_id' }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const newStatus = eventType === 'PAYMENT.CAPTURE.REFUNDED' ? 'refunded'
          : eventType === 'PAYMENT.CAPTURE.REVERSED' ? 'reversed'
          : 'failed';
        const outEvent = newStatus === 'refunded' ? 'payment.refunded'
          : newStatus === 'reversed' ? 'payment.reversed' : 'payment.denied';

        // Refund amount validation (only for REFUNDED events; reversal/denial use $150 original).
        let refundedAmountCents: number | null = null;
        if (eventType === 'PAYMENT.CAPTURE.REFUNDED') {
          const rAmtRaw = resource?.amount?.value;
          const rCur = resource?.amount?.currency_code;
          if (typeof rAmtRaw !== 'string' || rCur !== 'USD') {
            console.error('REFUNDED invalid currency or missing amount', eventBrief);
            return new Response(
              JSON.stringify({ error: 'refund_amount_invalid' }),
              { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          if (!/^\d+\.\d{2}$/.test(rAmtRaw)) {
            console.error('REFUNDED malformed amount', eventBrief);
            return new Response(
              JSON.stringify({ error: 'refund_amount_malformed' }),
              { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          const parsedCents = Math.round(parseFloat(rAmtRaw) * 100);
          if (!Number.isFinite(parsedCents) || parsedCents <= 0 || parsedCents > 15000) {
            console.error('REFUNDED amount out of range', eventBrief, parsedCents);
            return new Response(
              JSON.stringify({ error: 'refund_amount_out_of_range' }),
              { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          refundedAmountCents = parsedCents;
        }

        const { data: coachingRow, error: lookupErr } = await supabaseClient
          .from('coaching_checkout_orders')
          .select('id, app_booking_ref, paypal_order_id')
          .eq('paypal_capture_id', originalCaptureId)
          .maybeSingle();
        if (lookupErr) {
          console.error('DB lookup failed for capture', eventBrief, lookupErr.message);
          return new Response(
            JSON.stringify({ error: 'db_lookup_failed' }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (!coachingRow) {
          console.log('No coaching order for capture; ignoring', eventBrief);
          break;
        }

        const paypalEventId = typeof body?.id === 'string' && body.id.length > 0 ? body.id : null;
        if (!paypalEventId) {
          console.error('Missing PayPal body.id — cannot form unique event_id', eventBrief);
          return new Response(
            JSON.stringify({ error: 'missing_paypal_event_id' }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Use PayPal immutable resource create_time (or body.create_time fallback).
        const occurredAtIso: string = resource?.create_time || body?.create_time || new Date().toISOString();
        const eventUid = `${eventType}.${coachingRow.id}.${originalCaptureId}.${paypalEventId}`;
        const payload: Record<string, unknown> = {
          event: outEvent,
          booking_id: coachingRow.app_booking_ref,
          order_id: coachingRow.paypal_order_id,
          capture_id: originalCaptureId,
          amount_cents: 15000,
          currency: 'USD',
          status: newStatus,
          event_id: eventUid,
          occurred_at: occurredAtIso,
        };
        if (refundedAmountCents !== null) {
          payload.refunded_amount_cents = refundedAmountCents;
        }

        const { data: rpcData, error: rpcErr } = await supabaseClient.rpc(
          'finalize_coaching_refund_or_reversal',
          {
            p_original_capture_id: originalCaptureId,
            p_new_status: newStatus,
            p_event_id: eventUid,
            p_payload: payload,
            p_occurred_at: occurredAtIso,
          }
        );

        if (rpcErr || !rpcData || (rpcData as any).ok !== true) {
          const code = (rpcData as any)?.code ?? rpcErr?.message ?? 'rpc_failed';
          console.error('Coaching refund/reversal RPC failed', eventBrief, code);
          return new Response(
            JSON.stringify({ error: 'coaching_finalize_failed' }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log(`Coaching capture ${originalCaptureId} -> ${newStatus}`);
        break;
      }


      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }


    // Always return 200 to acknowledge receipt
    return new Response(
      JSON.stringify({ received: true, event_type: eventType }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    // If the error occurred while processing a recognized payment-processing
    // event, return retryable 5xx so PayPal redelivers. Unknown/parse errors
    // still ack 200 because retrying them will not help.
    const handledPaymentEvents = new Set<string>([
      SUBSCRIPTION_ACTIVATED, SUBSCRIPTION_CANCELLED, SUBSCRIPTION_SUSPENDED,
      SUBSCRIPTION_EXPIRED, PAYMENT_COMPLETED,
      'PAYMENT.CAPTURE.COMPLETED',
      'PAYMENT.CAPTURE.REFUNDED', 'PAYMENT.CAPTURE.REVERSED', 'PAYMENT.CAPTURE.DENIED',
    ]);

    if (handledEventType && handledPaymentEvents.has(handledEventType)) {
      return new Response(
        JSON.stringify({ error: 'processing_error', retryable: true }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ received: true, error: 'Processing error' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
