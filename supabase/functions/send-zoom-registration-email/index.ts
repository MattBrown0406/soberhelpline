import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function sendEmail(to: string[], subject: string, htmlContent: string, from = "Sober Helpline <matt@soberhelpline.com>") {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY is not configured");

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: to.map(email => ({ email })) }],
      from: { email: from.match(/<(.+)>/)?.[1] || from, name: from.match(/^(.+?)\s*</)?.[1] || "Sober Helpline" },
      subject,
      content: [{ type: "text/html", value: htmlContent }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid API error [${response.status}]: ${errorText}`);
  }

  return { success: true };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // No auth required - this is triggered by registration form (users may be unauthenticated)

    const { name, email } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);

    // Fetch meeting credentials from site_settings to build in-site join link
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: settings } = await adminSupabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["monday_zoom_meeting_id", "monday_zoom_passcode", "monday_zoom_link"]);

    const meetingId = settings?.find((s: any) => s.key === "monday_zoom_meeting_id")?.value || "";
    const passcode = settings?.find((s: any) => s.key === "monday_zoom_passcode")?.value || "";
    const externalZoomLink = settings?.find((s: any) => s.key === "monday_zoom_link")?.value || "";

    const siteUrl = "https://soberhelpline.com";
    const joinUrl = meetingId
      ? `${siteUrl}/join-meeting?mn=${encodeURIComponent(meetingId)}&pwd=${encodeURIComponent(passcode)}`
      : "";

    const hasLink = joinUrl !== "";

    const zoomSection = hasLink
      ? `
        <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h2 style="margin: 0 0 10px 0; color: #166534;">🎥 Join the Meeting</h2>
          <p style="margin: 0 0 15px 0; color: #15803d;">Join us Monday evening using the link below — no Zoom app needed:</p>
          <a href="${escapeHtml(joinUrl)}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Join Meeting on SoberHelpline.com
          </a>
          <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
            The meeting opens directly in your browser on our website.
          </p>
        </div>
      `
      : `
        <div style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; color: #854d0e;">The meeting link will be sent to you before the meeting. Please check your email on Monday.</p>
        </div>
      `;

    const emailResult = await sendEmail(
      [email],
      "You're Registered! “The Family Squares” Zoom Meeting",
      `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
          <h1 style="color: #166534;">Welcome, ${safeName}!</h1>
          <p>Thank you for registering for the <strong>“The Family Squares” Zoom Meeting</strong>.</p>
          <p>This is a free, supportive space for families navigating addiction. You'll have the opportunity to ask questions, share experiences, and connect with others who understand.</p>
          
          ${zoomSection}

          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>📨 Share this with your family.</strong> If there's anyone else in your family who could benefit from this meeting — a spouse, sibling, parent, or adult child — feel free to forward this email. Anyone with the link above can join. The more of your family that shows up, the more you'll all get out of it.
            </p>
          </div>

          <div style="background-color: #f5f3ff; border: 1px solid #c4b5fd; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #5b21b6; font-size: 14px;">
              <strong>⭐ Did you know?</strong> Sober Helpline members don't need to register each week. Just log in to your account and join the meeting instantly — no registration required.
            </p>
            <a href="${siteUrl}/family-membership" style="display: inline-block; margin-top: 4px; padding: 8px 20px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px;">
              Learn About Membership
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            If you have any questions, call us at <strong>(541) 241-5886</strong>.
          </p>
          <p style="color: #6b7280; font-size: 12px;">
            Sober Helpline — Supporting Families Through Recovery
          </p>
        </div>
      `
    );

    console.log("Zoom registration email sent:", emailResult);

    // Sync to Mailchimp with "Zoom Meeting Registrant" tag
    try {
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const mailchimpRes = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/add-to-mailchimp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            firstName,
            lastName,
            tags: ["Zoom Meeting Registrant"],
          }),
        }
      );
      const mailchimpData = await mailchimpRes.json();
      console.log("Mailchimp sync result:", mailchimpData);
    } catch (mcError) {
      console.error("Mailchimp sync failed (non-blocking):", mcError);
    }

    // Also notify admin
    await sendEmail(
      ["matt@soberhelpline.com"],
      `New Zoom Meeting Registration: ${safeName}`,
      `
        <h2>New “The Family Squares” Registration</h2>
        <ul>
          <li><strong>Name:</strong> ${safeName}</li>
          <li><strong>Email:</strong> ${safeEmail}</li>
        </ul>
      `
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending zoom registration email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
