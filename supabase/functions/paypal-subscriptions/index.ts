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
    console.error('PayPal auth error:', error);
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function createPayPalProduct(accessToken: string): Promise<string> {
  const response = await fetch(`${PAYPAL_API_BASE}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Sober Helpline Provider Listing',
      description: 'Monthly or annual listing fee for addiction recovery service providers',
      type: 'SERVICE',
      category: 'SOFTWARE',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal product creation error:', error);
    throw new Error('Failed to create PayPal product');
  }

  const data = await response.json();
  return data.id;
}

async function createPayPalPlan(
  accessToken: string, 
  productId: string, 
  planType: 'monthly' | 'annual',
  amount: string,
  trialConfig: { enabled: boolean; days?: number; months?: number } = { enabled: false }
): Promise<string> {
  const billingCycles = [];

  // Add free trial period if applicable
  if (trialConfig.enabled) {
    if (trialConfig.days) {
      // Day-based trial (e.g., 7-day trial)
      billingCycles.push({
        frequency: { interval_unit: 'DAY', interval_count: trialConfig.days },
        tenure_type: 'TRIAL',
        sequence: 1,
        total_cycles: 1,
        pricing_scheme: {
          fixed_price: { value: '0.00', currency_code: 'USD' }
        }
      });
    } else if (trialConfig.months) {
      // Month-based trial (e.g., 1 month free)
      billingCycles.push({
        frequency: { interval_unit: 'MONTH', interval_count: trialConfig.months },
        tenure_type: 'TRIAL',
        sequence: 1,
        total_cycles: 1,
        pricing_scheme: {
          fixed_price: { value: '0.00', currency_code: 'USD' }
        }
      });
    }
  }

  const hasTrial = trialConfig.enabled && (trialConfig.days || trialConfig.months);

  // Regular billing cycle
  if (planType === 'monthly') {
    billingCycles.push({
      frequency: { interval_unit: 'MONTH', interval_count: 1 },
      tenure_type: 'REGULAR',
      sequence: hasTrial ? 2 : 1,
      total_cycles: 0,
      pricing_scheme: {
        fixed_price: { value: amount, currency_code: 'USD' }
      }
    });
  } else {
    billingCycles.push({
      frequency: { interval_unit: 'YEAR', interval_count: 1 },
      tenure_type: 'REGULAR',
      sequence: hasTrial ? 2 : 1,
      total_cycles: 0,
      pricing_scheme: {
        fixed_price: { value: amount, currency_code: 'USD' }
      }
    });
  }

  const trialDescription = trialConfig.days 
    ? ` (${trialConfig.days}-Day Free Trial)` 
    : trialConfig.months 
      ? ` (First ${trialConfig.months === 1 ? 'Month' : `${trialConfig.months} Months`} Free)` 
      : '';

  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      name: `Provider Listing - ${planType === 'monthly' ? 'Monthly' : 'Annual'}${hasTrial ? trialDescription : ''}`,
      description: `${planType === 'monthly' ? 'Monthly' : 'Annual'} subscription for provider listing`,
      billing_cycles: billingCycles,
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3
      }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal plan creation error:', error);
    throw new Error('Failed to create PayPal plan');
  }

  const data = await response.json();
  return data.id;
}

async function createPayPalSubscription(
  accessToken: string,
  planId: string,
  returnUrl: string,
  cancelUrl: string
): Promise<{ subscriptionId: string; approvalUrl: string }> {
  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan_id: planId,
      application_context: {
        brand_name: 'Sober Helpline',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl,
      }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal subscription creation error:', error);
    throw new Error('Failed to create PayPal subscription');
  }

  const data = await response.json();
  const approvalLink = data.links.find((link: { rel: string }) => link.rel === 'approve');
  
  return {
    subscriptionId: data.id,
    approvalUrl: approvalLink?.href || '',
  };
}

async function getSubscriptionDetails(accessToken: string, subscriptionId: string) {
  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal get subscription error:', error);
    throw new Error('Failed to get subscription details');
  }

  return response.json();
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT and extract user from token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create Supabase client with user's token to verify authentication
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: `Bearer ${token}` }
        }
      }
    );

    // Get the authenticated user from the token
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authenticatedUserId = user.id;
    console.log('Authenticated user:', authenticatedUserId);

    // Service role client for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, ...params } = await req.json();
    console.log('PayPal action:', action, 'params:', JSON.stringify(params));

    const accessToken = await getPayPalAccessToken();

    switch (action) {
      case 'create-subscription': {
        const { planType, amount, providerSubmissionId, discountCode, returnUrl, cancelUrl } = params;
        
        // Use authenticated user ID from token instead of request body
        const userId = authenticatedUserId;
        
        if (!planType || !amount || !returnUrl || !cancelUrl) {
          throw new Error('Missing required parameters');
        }

        // Apply discount if valid code provided
        let finalAmount = parseFloat(amount);
        let appliedDiscount = null;
        let bypassPayment = false;

        // Check for FREELIST code - bypasses payment entirely
        if (discountCode && discountCode.toUpperCase() === 'FREELIST') {
          bypassPayment = true;
          appliedDiscount = 'FREELIST';
          finalAmount = 0;
          console.log('Applied FREELIST: Bypassing payment, free listing');
        }
        // Check for FREE6 code - 6 months free trial
        else if (discountCode && discountCode.toUpperCase() === 'FREE6') {
          appliedDiscount = 'FREE6';
          console.log('Applied FREE6: 6 months free trial');
        }
        // Check for HAPPYNEWYEAR code - 7-day free trial
        else if (discountCode && discountCode.toUpperCase() === 'HAPPYNEWYEAR') {
          appliedDiscount = 'HAPPYNEWYEAR';
          console.log('Applied HAPPYNEWYEAR: 7-day free trial');
        }
        // Check for free trial code (FREEMONTH) - works for both monthly and annual plans
        else if (discountCode && discountCode.toUpperCase() === 'FREEMONTH') {
          appliedDiscount = 'FREEMONTH';
          console.log('Applied FREEMONTH: First month free trial');
        } else if (discountCode) {
          // Check for other valid discount codes
          const discountCodes: Record<string, { type: 'percent' | 'fixed'; value: number }> = {
            'WELCOME50': { type: 'percent', value: 50 },
            'SAVE25': { type: 'percent', value: 25 },
            'SAVE100': { type: 'fixed', value: 100 },
          };

          const discount = discountCodes[discountCode.toUpperCase()];
          if (discount) {
            if (discount.type === 'percent') {
              finalAmount = finalAmount * (1 - discount.value / 100);
            } else {
              finalAmount = Math.max(0, finalAmount - discount.value);
            }
            appliedDiscount = discountCode.toUpperCase();
            console.log(`Applied discount code ${appliedDiscount}: $${amount} -> $${finalAmount.toFixed(2)}`);
          } else {
            console.log(`Invalid discount code attempted: ${discountCode}`);
          }
        }

        // If FREELIST code, bypass PayPal entirely
        if (bypassPayment) {
          // Create free subscription record directly
          const { error: dbError } = await supabaseClient
            .from('provider_subscriptions')
            .insert({
              user_id: userId,
              provider_submission_id: providerSubmissionId || null,
              paypal_subscription_id: `FREE-${Date.now()}`,
              plan_type: planType,
              status: 'active',
              amount: 0,
              start_date: new Date().toISOString(),
            });

          if (dbError) {
            console.error('Database error:', dbError);
            throw new Error('Failed to create free subscription');
          }

          // Auto-approve the provider submission
          if (providerSubmissionId) {
            const { error: updateError } = await supabaseClient
              .from('provider_submissions')
              .update({ status: 'approved' })
              .eq('id', providerSubmissionId);

            if (updateError) {
              console.error('Failed to auto-approve provider:', updateError);
            } else {
              console.log('Provider auto-approved with FREELIST code');
            }
          }

          return new Response(
            JSON.stringify({ 
              success: true,
              bypassPayment: true,
              appliedDiscount,
              message: 'Free listing activated'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Configure trial based on discount code
        let trialConfig: { enabled: boolean; days?: number; months?: number } = { enabled: false };
        if (appliedDiscount === 'FREE6') {
          trialConfig = { enabled: true, months: 6 };
        } else if (appliedDiscount === 'HAPPYNEWYEAR') {
          trialConfig = { enabled: true, days: 7 };
        } else if (appliedDiscount === 'FREEMONTH') {
          trialConfig = { enabled: true, months: 1 };
        }

        // Create product and plan with potentially discounted amount
        const productId = await createPayPalProduct(accessToken);
        const planId = await createPayPalPlan(accessToken, productId, planType, finalAmount.toFixed(2), trialConfig);
        
        // Create subscription
        const { subscriptionId, approvalUrl } = await createPayPalSubscription(
          accessToken, 
          planId, 
          returnUrl, 
          cancelUrl
        );

        // Store pending subscription in database
        const { error: dbError } = await supabaseClient
          .from('provider_subscriptions')
          .insert({
            user_id: userId,
            provider_submission_id: providerSubmissionId || null,
            paypal_subscription_id: subscriptionId,
            plan_type: planType,
            status: 'pending',
            amount: finalAmount,
          });

        if (dbError) {
          console.error('Database error:', dbError);
          throw new Error('Failed to store subscription');
        }

        return new Response(
          JSON.stringify({ subscriptionId, approvalUrl, appliedDiscount, finalAmount }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'activate-subscription': {
        const { subscriptionId } = params;
        
        if (!subscriptionId) {
          throw new Error('Missing subscription ID');
        }

        // Verify the authenticated user owns this subscription
        const { data: subscription, error: fetchError } = await supabaseClient
          .from('provider_subscriptions')
          .select('user_id')
          .eq('paypal_subscription_id', subscriptionId)
          .single();

        if (fetchError || !subscription) {
          throw new Error('Subscription not found');
        }

        if (subscription.user_id !== authenticatedUserId) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized - you do not own this subscription' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get subscription details from PayPal
        const details = await getSubscriptionDetails(accessToken, subscriptionId);
        
        if (details.status === 'ACTIVE') {
          // Update subscription status in database
          const { error: dbError } = await supabaseClient
            .from('provider_subscriptions')
            .update({
              status: 'active',
              start_date: details.start_time,
              next_billing_date: details.billing_info?.next_billing_time,
            })
            .eq('paypal_subscription_id', subscriptionId);

          if (dbError) {
            console.error('Database error:', dbError);
            throw new Error('Failed to update subscription');
          }

          return new Response(
            JSON.stringify({ success: true, status: 'active' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: false, status: details.status }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'cancel-subscription': {
        const { subscriptionId, reason } = params;
        
        if (!subscriptionId) {
          throw new Error('Missing subscription ID');
        }

        // Verify the authenticated user owns this subscription
        const { data: subscription, error: fetchError } = await supabaseClient
          .from('provider_subscriptions')
          .select('user_id')
          .eq('paypal_subscription_id', subscriptionId)
          .single();

        if (fetchError || !subscription) {
          throw new Error('Subscription not found');
        }

        if (subscription.user_id !== authenticatedUserId) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized - you do not own this subscription' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const response = await fetch(
          `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason: reason || 'User requested cancellation' }),
          }
        );

        if (!response.ok && response.status !== 204) {
          const error = await response.text();
          console.error('PayPal cancel error:', error);
          throw new Error('Failed to cancel subscription');
        }

        // Update database
        const { error: dbError } = await supabaseClient
          .from('provider_subscriptions')
          .update({ status: 'cancelled' })
          .eq('paypal_subscription_id', subscriptionId);

        if (dbError) {
          console.error('Database error:', dbError);
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get-subscription': {
        const { subscriptionId } = params;
        
        if (!subscriptionId) {
          throw new Error('Missing subscription ID');
        }

        // Verify the authenticated user owns this subscription
        const { data: subscription, error: fetchError } = await supabaseClient
          .from('provider_subscriptions')
          .select('user_id')
          .eq('paypal_subscription_id', subscriptionId)
          .single();

        if (fetchError || !subscription) {
          throw new Error('Subscription not found');
        }

        if (subscription.user_id !== authenticatedUserId) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized - you do not own this subscription' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const details = await getSubscriptionDetails(accessToken, subscriptionId);
        
        return new Response(
          JSON.stringify(details),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('PayPal function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});