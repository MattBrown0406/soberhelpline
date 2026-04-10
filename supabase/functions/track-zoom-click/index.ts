import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// This edge function logs a click and redirects to the actual Zoom join URL.
// Called when a registrant clicks the join link in their email.
// URL format: /track-zoom-click?rid=<registration_id>

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const registrationId = url.searchParams.get("rid");

    if (!registrationId) {
      return new Response("Missing registration ID", { status: 400 });
    }

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Look up the registration
    const { data: reg } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("id, email, name, meeting_date")
      .eq("id", registrationId)
      .maybeSingle();

    if (reg) {
      // Log the click (fire-and-forget)
      adminSupabase
        .from("zoom_link_clicks")
        .insert({
          registration_id: reg.id,
          registration_email: reg.email,
          registration_name: reg.name,
          meeting_date: reg.meeting_date,
          ip_address: req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || null,
          user_agent: req.headers.get("user-agent") || null,
        })
        .then(({ error }) => {
          if (error) console.error("Failed to log click:", error);
          else console.log(`Click logged for ${reg.email} (${reg.meeting_date})`);
        });
    }

    // Get the Zoom join URL to redirect to
    const { data: settings } = await adminSupabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["monday_zoom_meeting_id", "monday_zoom_passcode", "monday_zoom_link"]);

    const meetingId = settings?.find((s: any) => s.key === "monday_zoom_meeting_id")?.value || "";
    const passcode = settings?.find((s: any) => s.key === "monday_zoom_passcode")?.value || "";
    const externalZoomLink = settings?.find((s: any) => s.key === "monday_zoom_link")?.value || "";

    // Redirect to the in-site join page (which auto-redirects non-members to Zoom)
    const siteUrl = "https://soberhelpline.com";
    const redirectUrl = meetingId
      ? `${siteUrl}/join-meeting?mn=${encodeURIComponent(meetingId)}&pwd=${encodeURIComponent(passcode)}`
      : externalZoomLink || siteUrl;

    return new Response(null, {
      status: 302,
      headers: { "Location": redirectUrl },
    });
  } catch (error: any) {
    console.error("Track zoom click error:", error);
    // On error, redirect to homepage rather than showing an error
    return new Response(null, {
      status: 302,
      headers: { "Location": "https://soberhelpline.com/join-meeting" },
    });
  }
});
