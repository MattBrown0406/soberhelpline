import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAutomationAuth } from "../_shared/automationAuth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Real PayPal billing agreements are "I-XXXXXXXXXXXX". Free and promo
// memberships store a made-up id (FREE-…, FAMILY6-…, FREELIST-…); PayPal has
// never heard of those, so a lookup returns 404 and must not expire them.
const isPayPalSubscriptionId = (id: string) => /^I-[A-Z0-9]{6,}$/i.test(id.trim());

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
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Scheduled job (cron secret), the service key or a signed-in admin.
    const body = req.method === 'POST' ? await req.json().catch(() => null) : null;
    const denied = await requireAutomationAuth(req, supabaseAdmin, body, 'paypal-sync-all', corsHeaders);
    if (denied) return denied;

    // Fetch all active paid subscriptions with a PayPal subscription ID
    const { data: candidates, error: fetchError } = await supabaseAdmin
      .from('provider_subscriptions')
      .select('id, paypal_subscription_id, status, next_billing_date')
      .in('status', ['active', 'pending'])
      .not('paypal_subscription_id', 'is', null);

    if (fetchError) throw fetchError;

    const subscriptions = (candidates ?? []).filter((s) => isPayPalSubscriptionId(String(s.paypal_subscription_id)));
    const skippedNonPayPal = (candidates?.length ?? 0) - subscriptions.length;

    if (subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No paid subscriptions to sync', synced: 0, skippedNonPayPal }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    console.log(`Syncing ${subscriptions.length} active/pending subscriptions with PayPal...`);

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
            // Never expire a pending record on a transient 404 within its first 24h
            
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
      JSON.stringify({ success: true, total: subscriptions.length, skippedNonPayPal, ...results }),
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
