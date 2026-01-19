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

// PayPal API base URL (use sandbox for testing, live for production)
const PAYPAL_API_BASE = 'https://api-m.paypal.com';

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

    console.log('PayPal webhook received:', eventType);
    console.log('Resource:', JSON.stringify(resource, null, 2));

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

        const { error } = await supabaseClient
          .from('provider_subscriptions')
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
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
          
          // We could update next_billing_date here if PayPal provides it
          // For now, just log it
        }
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
    // Still return 200 to prevent PayPal from retrying
    return new Response(
      JSON.stringify({ received: true, error: 'Processing error' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
