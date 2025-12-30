import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_API_BASE = Deno.env.get("PAYPAL_MODE") === "sandbox"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_SECRET_KEY");

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("PayPal auth error:", error);
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

async function getSubscriptionDetails(accessToken: string, subscriptionId: string) {
  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayPal get subscription error:", errorText);
    
    // Check if it's a "not found" error - subscription was abandoned/cleaned up
    if (response.status === 404 || errorText.includes("RESOURCE_NOT_FOUND")) {
      return { status: "NOT_FOUND", notFound: true };
    }
    
    throw new Error("Failed to get subscription details");
  }

  return response.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing or invalid authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(JSON.stringify({ error: "Unauthorized - invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Verify admin role
    const { data: roles, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .limit(1);

    if (roleError) {
      console.error("Role check error:", roleError);
      return new Response(JSON.stringify({ error: "Failed to verify permissions" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!roles || roles.length === 0) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, ...params } = await req.json();

    if (action !== "sync-subscription") {
      throw new Error(`Unknown action: ${action}`);
    }

    const { subscriptionId } = params as { subscriptionId?: string };
    if (!subscriptionId) {
      throw new Error("Missing subscriptionId");
    }

    const accessToken = await getPayPalAccessToken();
    const details = await getSubscriptionDetails(accessToken, subscriptionId);

    // Handle case where subscription doesn't exist in PayPal (abandoned checkout)
    if (details.notFound) {
      const { error: dbError } = await supabaseAdmin
        .from("provider_subscriptions")
        .update({
          status: "expired",
          updated_at: new Date().toISOString(),
        })
        .eq("paypal_subscription_id", subscriptionId);

      if (dbError) {
        console.error("DB update error:", dbError);
        throw new Error("Failed to update subscription status");
      }

      return new Response(
        JSON.stringify({
          success: true,
          paypalStatus: "NOT_FOUND",
          updated: true,
          message: "Subscription not found in PayPal - marked as expired (abandoned checkout)",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const paypalStatus = String(details?.status ?? "");

    // Update DB when PayPal shows ACTIVE
    if (paypalStatus === "ACTIVE") {
      const { error: dbError } = await supabaseAdmin
        .from("provider_subscriptions")
        .update({
          status: "active",
          start_date: details.start_time ?? null,
          next_billing_date: details.billing_info?.next_billing_time ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("paypal_subscription_id", subscriptionId);

      if (dbError) {
        console.error("DB update error:", dbError);
        throw new Error("Failed to update subscription status");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        paypalStatus,
        updated: paypalStatus === "ACTIVE",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("paypal-admin-sync error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
