import "../_shared/suppression.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_API_BASE = Deno.env.get('PAYPAL_MODE') === 'sandbox' 
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

type BillingCycle = 'monthly' | 'annual';

// Prices are decided HERE, never by the browser (any `amount` sent is ignored).
// Family membership = the app's Essential tier on the web: $9.99/month or $100/year.
const FAMILY_PRICE_CENTS: Record<BillingCycle, number> = { monthly: 999, annual: 10000 };

// FAMILY6 promo: free family membership that ends after this many months.
const FAMILY6_MONTHS = 6;

// Provider listing prices by category (from the last provider checkout UI,
// InlinePayPalCheckout). Provider listings are currently free and no page sells
// them, so this only keeps the endpoint from trusting a browser-supplied amount.
function providerPriceCents(category: string | null | undefined): Record<BillingCycle, number> {
  switch (category) {
    case 'Inpatient Treatment':
    case 'Outpatient Treatment':
    case 'Medical Detox':
    case 'Sober Living':
      return { monthly: 10000, annual: 100000 };
    default:
      return { monthly: 2500, annual: 25000 };
  }
}

// Price-reducing codes (applied to the server-side base price).
const PRICE_DISCOUNT_CODES: Record<string, { type: 'percent' | 'fixed'; value: number }> = {
  WELCOME50: { type: 'percent', value: 50 },
  SAVE25: { type: 'percent', value: 25 },
  SAVE100: { type: 'fixed', value: 100 },
};

const centsToDollars = (cents: number) => (cents / 100).toFixed(2);

async function sendAdminNotification(subject: string, htmlContent: string) {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY not configured, skipping admin notification");
    return;
  }
  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tracking_settings: { subscription_tracking: { enable: true } },
        personalizations: [{ to: [{ email: "matt@soberhelpline.com" }, { email: "matt@freedominterventions.com" }] }],
        from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
        subject,
        content: [{ type: "text/html", value: htmlContent }],
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SendGrid error [${response.status}]: ${errorText}`);
    } else {
      console.log("Admin notification email sent successfully");
    }
  } catch (err) {
    console.error("Failed to send admin notification:", err);
  }
}

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

async function createPayPalProduct(accessToken: string, isFamilyMembership: boolean): Promise<string> {
  const response = await fetch(`${PAYPAL_API_BASE}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: isFamilyMembership ? 'Sober Helpline Family Membership' : 'Sober Helpline Provider Listing',
      description: isFamilyMembership
        ? 'Family education, community, guided tools, recordings, and member coaching discounts'
        : 'Monthly or annual listing fee for addiction recovery service providers',
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
  trialConfig: { enabled: boolean; days?: number; months?: number } = { enabled: false },
  isFamilyMembership = false,
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
      name: `${isFamilyMembership ? 'Family Membership' : 'Provider Listing'} - ${planType === 'monthly' ? 'Monthly' : 'Annual'}${hasTrial ? trialDescription : ''}`,
      description: isFamilyMembership
        ? `${planType === 'monthly' ? 'Monthly' : 'Annual'} Sober Helpline family support membership`
        : `${planType === 'monthly' ? 'Monthly' : 'Annual'} subscription for provider listing`,
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
    console.log('PayPal action:', action);

    const accessToken = await getPayPalAccessToken();

    switch (action) {
      case 'create-subscription': {
        // The browser may still send `amount`; it is ignored. Prices are computed here.
        const { planType, providerSubmissionId, discountCode, returnUrl, cancelUrl } = params;

        // Use authenticated user ID from token instead of request body
        const userId = authenticatedUserId;

        if (!planType || !returnUrl || !cancelUrl) {
          throw new Error('Missing required parameters');
        }
        if (planType !== 'monthly' && planType !== 'annual') {
          throw new Error('Invalid plan type');
        }
        const billingCycle: BillingCycle = planType;
        if (providerSubmissionId !== undefined && providerSubmissionId !== null && typeof providerSubmissionId !== 'string') {
          throw new Error('Invalid provider listing');
        }
        const code = typeof discountCode === 'string' ? discountCode.trim().toUpperCase() : '';
        const isFamilyMembership = !providerSubmissionId;

        // --- Server-side base price --------------------------------------
        let baseCents: number;
        if (isFamilyMembership) {
          baseCents = FAMILY_PRICE_CENTS[billingCycle];
        } else {
          // Provider listing: the caller must own the submission; price by category.
          const { data: submission, error: submissionError } = await supabaseClient
            .from('provider_submissions')
            .select('id, category, submitted_by')
            .eq('id', providerSubmissionId)
            .maybeSingle();
          if (submissionError || !submission) {
            throw new Error('Provider listing not found');
          }
          if (submission.submitted_by !== userId) {
            const { data: isAdmin } = await supabaseClient.rpc('has_role', {
              _user_id: userId,
              _role: 'admin',
            });
            if (!isAdmin) {
              return new Response(
                JSON.stringify({ error: 'Unauthorized - you do not own this provider listing' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
          }
          baseCents = providerPriceCents(submission.category)[billingCycle];
        }

        // --- Discount codes -----------------------------------------------
        let finalCents = baseCents;
        let appliedDiscount: string | null = null;
        let bypassPayment = false;

        // FREELIST - free provider listing (bypasses payment). Provider listings ONLY:
        // it must never create an open-ended free family membership.
        if (code === 'FREELIST') {
          if (isFamilyMembership) {
            throw new Error('This code is only valid for provider listings.');
          }
          bypassPayment = true;
          appliedDiscount = 'FREELIST';
          finalCents = 0;
          console.log('Applied FREELIST: Bypassing payment, free listing');
        }
        // FAMILY6 - 6 months free for family members (bypasses payment, limited uses).
        // Family memberships only, once per account, and the membership ENDS after 6 months.
        else if (code === 'FAMILY6') {
          if (!isFamilyMembership) {
            throw new Error('This code is only valid for family memberships.');
          }
          const { data: priorFamily6, error: priorError } = await supabaseClient
            .from('provider_subscriptions')
            .select('id')
            .eq('user_id', userId)
            .like('paypal_subscription_id', 'FAMILY6-%')
            .limit(1);
          if (priorError) {
            throw new Error('Failed to validate promo code');
          }
          if ((priorFamily6 ?? []).length > 0) {
            throw new Error('FAMILY6 has already been used on this account.');
          }

          // Check if promo code has remaining uses
          const { data: promoResult, error: promoError } = await supabaseClient
            .rpc('use_promo_code', { promo_code: 'FAMILY6' });

          if (promoError) {
            console.error('Promo code error:', promoError);
            throw new Error('Failed to validate promo code');
          }

          if (!promoResult?.success) {
            throw new Error(promoResult?.error || 'Promo code is no longer available');
          }

          bypassPayment = true;
          appliedDiscount = 'FAMILY6';
          finalCents = 0;
          console.log('Applied FAMILY6: Bypassing payment, 6 months free family membership. Remaining:', promoResult.remaining);
        }
        // FREE6 - 6 months free trial, then the regular price
        else if (code === 'FREE6') {
          appliedDiscount = 'FREE6';
          console.log('Applied FREE6: 6 months free trial');
        }
        // HELPLINE - 7-day free trial, then the regular price
        else if (code === 'HELPLINE') {
          appliedDiscount = 'HELPLINE';
          console.log('Applied HELPLINE: 7-day free trial');
        }
        // FREEMONTH - first month free (monthly and annual plans)
        else if (code === 'FREEMONTH') {
          appliedDiscount = 'FREEMONTH';
          console.log('Applied FREEMONTH: First month free trial');
        } else if (code) {
          const discount = PRICE_DISCOUNT_CODES[code];
          if (discount) {
            finalCents = discount.type === 'percent'
              ? Math.round(baseCents * (1 - discount.value / 100))
              : Math.max(0, baseCents - discount.value * 100);
            appliedDiscount = code;
            console.log(`Applied discount code ${appliedDiscount}: ${centsToDollars(baseCents)} -> ${centsToDollars(finalCents)}`);
          } else {
            console.log('Invalid discount code attempted');
          }
        }

        // If bypass code (FREELIST or FAMILY6), bypass PayPal entirely
        if (bypassPayment) {
          const startDate = new Date();
          // FAMILY6 ends 6 months from today. access_ends_at is the hard end of
          // access; next_billing_date mirrors it for billing/admin screens.
          let endsAt: Date | null = null;
          if (appliedDiscount === 'FAMILY6') {
            endsAt = new Date(startDate);
            endsAt.setMonth(endsAt.getMonth() + FAMILY6_MONTHS);
          }

          // Create free subscription record directly
          const { error: dbError } = await supabaseClient
            .from('provider_subscriptions')
            .insert({
              user_id: userId,
              provider_submission_id: providerSubmissionId || null,
              paypal_subscription_id: `${appliedDiscount}-${Date.now()}`,
              plan_type: billingCycle,
              status: 'active',
              amount: 0,
              start_date: startDate.toISOString(),
              next_billing_date: endsAt ? endsAt.toISOString() : null,
              access_ends_at: endsAt ? endsAt.toISOString() : null,
            });

          if (dbError) {
            console.error('Database error:', dbError);
            throw new Error('Failed to create free subscription');
          }

          // Auto-approve the provider submission (only for FREELIST; ownership checked above)
          if (providerSubmissionId && appliedDiscount === 'FREELIST') {
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

          const message = appliedDiscount === 'FAMILY6'
            ? '6-month free family membership activated'
            : 'Free listing activated';

          // Send admin notification for family membership signups (no provider_submission_id)
          if (!providerSubmissionId) {
            const { data: profile } = await supabaseClient
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', userId)
              .single();
            const { data: privateProfile } = await supabaseClient
              .from('profile_private')
              .select('email')
              .eq('user_id', userId)
              .single();
            const memberName = profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown';
            const memberEmail = privateProfile?.email || 'Unknown';
            await sendAdminNotification(
              `🎉 New Family Membership: ${memberName}`,
              `<h2>New Family Membership Signup</h2>
              <ul>
                <li><strong>Name:</strong> ${memberName}</li>
                <li><strong>Email:</strong> ${memberEmail}</li>
                <li><strong>Plan:</strong> ${billingCycle}</li>
                <li><strong>Discount Code:</strong> ${appliedDiscount || 'None'}</li>
                <li><strong>Amount:</strong> $${centsToDollars(finalCents)}</li>
                ${endsAt ? `<li><strong>Access ends:</strong> ${endsAt.toISOString().slice(0, 10)}</li>` : ''}
              </ul>`
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              bypassPayment: true,
              appliedDiscount,
              message,
              nextBillingDate: endsAt ? endsAt.toISOString() : null,
              accessEndsAt: endsAt ? endsAt.toISOString() : null,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Configure trial based on discount code
        let trialConfig: { enabled: boolean; days?: number; months?: number } = { enabled: false };
        if (appliedDiscount === 'FREE6') {
          trialConfig = { enabled: true, months: 6 };
        } else if (appliedDiscount === 'HELPLINE') {
          trialConfig = { enabled: true, days: 7 };
        } else if (appliedDiscount === 'FREEMONTH') {
          trialConfig = { enabled: true, months: 1 };
        }

        // PayPal rejects a REGULAR billing cycle priced at 0. If a discount
        // reduced the recurring price to zero, stop before calling PayPal.
        if (!Number.isInteger(finalCents) || finalCents < 1) {
          console.error('Blocked $0 PayPal subscription', { planType: billingCycle, appliedDiscount });
          throw new Error('This discount cannot be applied to a recurring subscription. Please contact support.');
        }

        // Each signup gets its own PayPal product + plan priced at finalCents, so the
        // amount PayPal bills is exactly what was computed above.
        const productId = await createPayPalProduct(accessToken, isFamilyMembership);
        const planId = await createPayPalPlan(
          accessToken,
          productId,
          billingCycle,
          centsToDollars(finalCents),
          trialConfig,
          isFamilyMembership,
        );

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
            plan_type: billingCycle,
            status: 'pending',
            amount: finalCents / 100,
          });

        if (dbError) {
          console.error('Database error:', dbError);
          throw new Error('Failed to store subscription');
        }

        // Send admin notification for family membership signups (no provider_submission_id)
        if (!providerSubmissionId) {
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', userId)
            .single();
          const { data: privateProfile } = await supabaseClient
            .from('profile_private')
            .select('email')
            .eq('user_id', userId)
            .single();
          const memberName = profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown';
          const memberEmail = privateProfile?.email || 'Unknown';
          await sendAdminNotification(
            `🎉 New Family Membership Signup: ${memberName}`,
            `<h2>New Family Membership Signup</h2>
            <ul>
              <li><strong>Name:</strong> ${memberName}</li>
              <li><strong>Email:</strong> ${memberEmail}</li>
              <li><strong>Plan:</strong> ${billingCycle}</li>
              <li><strong>Discount Code:</strong> ${appliedDiscount || 'None'}</li>
              <li><strong>Amount:</strong> $${centsToDollars(finalCents)}</li>
              <li><strong>Status:</strong> Pending PayPal approval</li>
            </ul>`
          );
        }

        return new Response(
          JSON.stringify({ subscriptionId, approvalUrl, appliedDiscount, finalAmount: finalCents / 100 }),
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
        const { subscriptionId, reason, source } = params;

        if (!subscriptionId || typeof subscriptionId !== 'string') {
          throw new Error('Missing subscription ID');
        }

        // Fetch the row; require ownership. Include provider_submission_id + next_billing_date
        // so we can (a) block cross-context cancellation and (b) preserve paid-through access.
        const { data: subscription, error: fetchError } = await supabaseClient
          .from('provider_subscriptions')
          .select('id, user_id, provider_submission_id, status, next_billing_date, paypal_subscription_id')
          .eq('paypal_subscription_id', subscriptionId)
          .maybeSingle();

        if (fetchError || !subscription) {
          return new Response(
            JSON.stringify({ error: 'Subscription not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (subscription.user_id !== authenticatedUserId) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized - you do not own this subscription' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Determine cancellation source. The member billing page always sends
        // 'member_portal' or omits it (default). Family cancellations must not
        // accidentally cancel provider listings and vice versa.
        const cancellationSource = typeof source === 'string' ? source : 'member_portal';
        if (
          cancellationSource === 'member_portal' &&
          subscription.provider_submission_id !== null
        ) {
          return new Response(
            JSON.stringify({
              error: 'This subscription is a provider listing, not a family membership. Provider listings must be cancelled from the provider dashboard.',
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Idempotent: if already cancelled, just return success.
        if (subscription.status === 'cancelled') {
          return new Response(
            JSON.stringify({ success: true, alreadyCancelled: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const nowIso = new Date().toISOString();
        const isFreeBypass = /^(FREE-|FAMILY6-|FREELIST-|FREE6-|FREEMONTH-|HELPLINE-)/i.test(subscriptionId);

        let paypalConfirmedAt: string | null = null;

        if (!isFreeBypass) {
          // Real PayPal recurring agreement — call PayPal cancel.
          const cancelResp = await fetch(
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

          if (cancelResp.status === 204) {
            paypalConfirmedAt = nowIso;
          } else {
            // Treat "already cancelled" as success by re-checking status via GET.
            const errText = await cancelResp.text();
            console.error('PayPal cancel error:', cancelResp.status, errText);

            let treatAsAlreadyCancelled = false;
            try {
              const details = await getSubscriptionDetails(accessToken, subscriptionId);
              const paypalStatus = String(details?.status || '').toUpperCase();
              if (paypalStatus === 'CANCELLED' || paypalStatus === 'EXPIRED') {
                treatAsAlreadyCancelled = true;
                paypalConfirmedAt = nowIso;
              }
            } catch (verifyErr) {
              console.error('PayPal status recheck failed:', verifyErr);
            }

            if (!treatAsAlreadyCancelled) {
              // Do NOT update local status. Surface the failure to the caller.
              return new Response(
                JSON.stringify({
                  error: 'PayPal cancellation failed. Your membership was NOT cancelled. Please try again or contact matt@soberhelpline.com.',
                }),
                { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
          }
        }

        // Preserve paid-through access when we know when the next charge would have been.
        const accessEndsAt = subscription.next_billing_date || null;

        const { error: dbError } = await supabaseClient
          .from('provider_subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: nowIso,
            cancellation_reason: reason || null,
            cancellation_source: cancellationSource,
            paypal_cancel_confirmed_at: paypalConfirmedAt,
            access_ends_at: accessEndsAt,
            updated_at: nowIso,
          })
          .eq('id', subscription.id);

        if (dbError) {
          console.error('Database error while marking cancelled:', dbError);
          return new Response(
            JSON.stringify({
              error: 'Cancelled with PayPal but failed to update local record. Please contact matt@soberhelpline.com.',
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            paypalCancelled: !isFreeBypass,
            accessEndsAt,
          }),
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