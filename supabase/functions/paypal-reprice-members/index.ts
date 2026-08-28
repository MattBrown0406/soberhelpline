import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const PAYPAL_API_BASE = Deno.env.get("PAYPAL_MODE") === "sandbox"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

const NEW_MONTHLY = "10.00";
const NEW_ANNUAL = "100.00";

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_SECRET_KEY");
  if (!clientId || !clientSecret) throw new Error("PayPal credentials not configured");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("Failed to get PayPal access token");
  return (await res.json()).access_token;
}

async function paypal(token: string, path: string, method = "GET", body?: unknown) {
  const res = await fetch(`${PAYPAL_API_BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* non-json */ }
  if (!res.ok) throw new Error(`PayPal ${method} ${path} [${res.status}]: ${text.slice(0, 400)}`);
  return json;
}

async function ensureProduct(token: string): Promise<string> {
  const product = await paypal(token, "/v1/catalogs/products", "POST", {
    name: "Sober Helpline Family Membership",
    description: "Family education, community, guided tools, recordings, and member coaching discounts",
    type: "SERVICE",
    category: "SOFTWARE",
  });
  return product.id;
}

async function createPlan(token: string, productId: string, cycle: "monthly" | "annual"): Promise<string> {
  const plan = await paypal(token, "/v1/billing/plans", "POST", {
    product_id: productId,
    name: `Family Membership - ${cycle === "monthly" ? "Monthly" : "Annual"} ($${cycle === "monthly" ? NEW_MONTHLY : NEW_ANNUAL})`,
    description: `${cycle === "monthly" ? "Monthly" : "Annual"} Sober Helpline family support membership`,
    billing_cycles: [{
      frequency: cycle === "monthly"
        ? { interval_unit: "MONTH", interval_count: 1 }
        : { interval_unit: "YEAR", interval_count: 1 },
      tenure_type: "REGULAR",
      sequence: 1,
      total_cycles: 0,
      pricing_scheme: {
        fixed_price: { value: cycle === "monthly" ? NEW_MONTHLY : NEW_ANNUAL, currency_code: "USD" },
      },
    }],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee_failure_action: "CONTINUE",
      payment_failure_threshold: 3,
    },
  });
  return plan.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    const body = await req.json().catch(() => ({}));
    const providedSecret = req.headers.get("x-cron-secret") ?? body?.secret ?? "";

    const { data: setting } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "cron_secret")
      .maybeSingle();

    const expected = (setting?.value ?? "").toString();
    if (!expected || providedSecret !== expected) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dryRun = body?.dryRun === true;

    const { data: subs, error } = await supabaseAdmin
      .from("provider_subscriptions")
      .select("id, user_id, paypal_subscription_id, plan_type, status, amount")
      .is("provider_submission_id", null)
      .in("status", ["active", "pending"])
      .not("paypal_subscription_id", "is", null)
      .not("paypal_subscription_id", "like", "FREE-%");

    if (error) throw error;

    const token = await getPayPalAccessToken();
    const planCache: Record<string, string> = {};
    let productId: string | null = null;

    // PayPal requires the revised plan to belong to the SAME product as the
    // subscription's current plan, so plans are cached per product + cycle.
    const getPlanId = async (cycle: "monthly" | "annual", existingProductId?: string | null) => {
      const key = `${existingProductId ?? "new"}:${cycle}`;
      if (planCache[key]) return planCache[key];
      let pid = existingProductId ?? null;
      if (!pid) {
        if (!productId) productId = await ensureProduct(token);
        pid = productId;
      }
      planCache[key] = await createPlan(token, pid, cycle);
      return planCache[key];
    };

    const results: any[] = [];
    let repriced = 0, skipped = 0, failed = 0, needsApproval = 0;

    for (const sub of subs ?? []) {
      const paypalId = sub.paypal_subscription_id as string;
      try {
        const details = await paypal(token, `/v1/billing/subscriptions/${paypalId}`);
        const status = details?.status;
        if (!["ACTIVE", "APPROVAL_PENDING", "APPROVED", "SUSPENDED"].includes(status)) {
          skipped++;
          results.push({ paypalId, skipped: `paypal status ${status}` });
          continue;
        }

        // Determine current cycle + price from the current plan
        const plan = await paypal(token, `/v1/billing/plans/${details.plan_id}`);
        const regular = (plan?.billing_cycles ?? []).find((c: any) => c.tenure_type === "REGULAR");
        const intervalUnit = regular?.frequency?.interval_unit ?? "MONTH";
        const cycle: "monthly" | "annual" = intervalUnit === "YEAR" ? "annual" : "monthly";
        const currentPrice = regular?.pricing_scheme?.fixed_price?.value ?? null;
        const target = cycle === "monthly" ? NEW_MONTHLY : NEW_ANNUAL;

        if (currentPrice && Number(currentPrice) === Number(target)) {
          skipped++;
          results.push({ paypalId, skipped: "already at target price", cycle });
          continue;
        }

        if (dryRun) {
          results.push({ paypalId, wouldReprice: { cycle, from: currentPrice, to: target } });
          continue;
        }

        const newPlanId = await getPlanId(cycle, plan?.product_id ?? null);
        const revised = await paypal(token, `/v1/billing/subscriptions/${paypalId}/revise`, "POST", {
          plan_id: newPlanId,
        });

        const approveLink = (revised?.links ?? []).find((l: any) => l.rel === "approve")?.href ?? null;
        if (approveLink) needsApproval++;

        await supabaseAdmin
          .from("provider_subscriptions")
          .update({ amount: Number(target), plan_type: cycle })
          .eq("id", sub.id);

        repriced++;
        results.push({ paypalId, cycle, from: currentPrice, to: target, approveLink });
      } catch (e) {
        failed++;
        results.push({ paypalId, error: e instanceof Error ? e.message : String(e) });
      }
    }

    console.log(`Reprice: total=${subs?.length ?? 0} repriced=${repriced} skipped=${skipped} failed=${failed} needsApproval=${needsApproval}`);

    return new Response(
      JSON.stringify({ success: true, dryRun, total: subs?.length ?? 0, repriced, skipped, failed, needsApproval, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("paypal-reprice-members error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
