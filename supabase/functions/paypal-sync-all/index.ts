import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // This function can be called by cron (service role via anon key) or by admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Fetch all active paid subscriptions with a PayPal subscription ID
    const { data: subscriptions, error: fetchError } = await supabaseAdmin
      .from('provider_subscriptions')
      .select('id, paypal_subscription_id, status, next_billing_date')
      .eq('status', 'active')
      .not('paypal_subscription_id', 'is', null)
      .not('paypal_subscription_id', 'like', 'FREE-%');

    if (fetchError) throw fetchError;

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active paid subscriptions to sync', synced: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    console.log(`Syncing ${subscriptions.length} active subscriptions with PayPal...`);

    const accessToken = await getPayPalAccessToken();
    const results = { synced: 0, cancelled: 0, suspended: 0, failed: 0, notFound: 0, unchanged: 0 };

    for (const sub of subscriptions) {
      try {
        const response = await fetch(
          `${PAYPAL_API_BASE}/v1/billing/subscriptions/${sub.paypal_subscription_id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          if (response.status === 404) {
            // Subscription no longer exists in PayPal
            await supabaseAdmin
              .from('provider_subscriptions')
              .update({ status: 'expired', updated_at: new Date().toISOString() })
              .eq('id', sub.id);
            results.notFound++;
            console.log(`Subscription ${sub.paypal_subscription_id} not found in PayPal — marked expired`);
            continue;
          }
          results.failed++;
          console.error(`Failed to fetch ${sub.paypal_subscription_id}: ${response.status}`);
          continue;
        }

        const details = await response.json();
        const paypalStatus = String(details.status ?? '');

        if (paypalStatus === 'ACTIVE') {
          const nextBilling = details.billing_info?.next_billing_time ?? null;
          await supabaseAdmin
            .from('provider_subscriptions')
            .update({
              status: 'active',
              next_billing_date: nextBilling,
              start_date: details.start_time ?? undefined,
              updated_at: new Date().toISOString(),
            })
            .eq('id', sub.id);
          results.synced++;
        } else if (paypalStatus === 'CANCELLED') {
          await supabaseAdmin
            .from('provider_subscriptions')
            .update({ status: 'cancelled', updated_at: new Date().toISOString() })
            .eq('id', sub.id);
          results.cancelled++;
          console.log(`Subscription ${sub.paypal_subscription_id} cancelled in PayPal — updated`);
        } else if (paypalStatus === 'SUSPENDED') {
          await supabaseAdmin
            .from('provider_subscriptions')
            .update({ status: 'suspended', updated_at: new Date().toISOString() })
            .eq('id', sub.id);
          results.suspended++;
          console.log(`Subscription ${sub.paypal_subscription_id} suspended in PayPal — updated`);
        } else {
          results.unchanged++;
        }

        // Small delay to avoid hitting PayPal rate limits
        await new Promise(r => setTimeout(r, 200));
      } catch (err) {
        results.failed++;
        console.error(`Error syncing ${sub.paypal_subscription_id}:`, err);
      }
    }

    console.log('Sync complete:', results);

    return new Response(
      JSON.stringify({ success: true, total: subscriptions.length, ...results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('paypal-sync-all error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
