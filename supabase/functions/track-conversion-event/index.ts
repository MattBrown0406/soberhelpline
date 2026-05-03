import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const allowedEvents = new Set([
  "coaching_click",
  "monday_zoom_click",
  "monday_zoom_registration_view",
  "monday_zoom_registration_submit",
  "monday_zoom_registration_success",
  "intervention_readiness_click",
  "freedom_interventions_click",
  "lead_magnet_signup",
  "partner_page_click",
  "phone_click",
  "booking_provider_selected",
  "booking_step_continue",
  "booking_payment_start",
  "nme_bridge_arrival",
  "nme_bridge_family_squares_click",
  "nme_bridge_lane_click",
  "nme_bridge_coaching_click",
  "nme_bridge_intervention_click",
]);

const trimText = (value: unknown, maxLength = 500) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const eventName = trimText(payload?.event_name, 120);

    if (!eventName || !allowedEvents.has(eventName)) {
      return new Response(JSON.stringify({ error: "Unsupported event name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const metadata = payload?.metadata && typeof payload.metadata === "object"
      ? payload.metadata
      : {};

    const { error } = await supabase.from("conversion_events").insert({
      event_name: eventName,
      page_path: trimText(payload?.page_path, 500),
      page_title: trimText(payload?.page_title, 500),
      source: trimText(payload?.source, 200),
      label: trimText(payload?.label, 300),
      target_href: trimText(payload?.target_href, 1000),
      utm_source: trimText(payload?.utm_source, 200),
      utm_medium: trimText(payload?.utm_medium, 200),
      utm_campaign: trimText(payload?.utm_campaign, 200),
      utm_content: trimText(payload?.utm_content, 300),
      utm_term: trimText(payload?.utm_term, 300),
      referrer: trimText(payload?.referrer, 1000),
      first_landing_path: trimText(payload?.first_landing_path, 500),
      metadata,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in track-conversion-event:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
