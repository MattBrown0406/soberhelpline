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

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
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
