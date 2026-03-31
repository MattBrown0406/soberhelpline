import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function sendEmail(to: string, subject: string, htmlContent: string) {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not configured");

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "matt@soberhelpline.com", name: "Matt - Sober Helpline" },
      subject,
      content: [{ type: "text/html", value: htmlContent }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`SendGrid error for ${to}: ${errorText}`);
    return false;
  }
  return true;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipients } = await req.json();

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

    const results: Record<string, boolean> = {};

    for (const recipient of recipients) {
      const { name, email } = recipient;
      const safeName = escapeHtml(name);

      const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
          <h1 style="color: #166534;">Hi ${safeName},</h1>
          
          <p>Thank you for joining us — or trying to join us — for <strong>"The Family Squares"</strong> Zoom meeting last night. I want to sincerely apologize that the joining link didn't work as it was supposed to. I know how frustrating that must have been, especially when you took the time to show up for yourself and your family.</p>

          <p><strong>The issue has been identified and corrected</strong>, so this won't happen again going forward.</p>

          <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
            <h2 style="margin: 0 0 10px 0; color: #166534;">✅ You're Pre-Registered for April 6th!</h2>
            <p style="margin: 0 0 15px 0; color: #15803d;">You've been automatically registered for the next <strong>"The Family Squares"</strong> meeting on <strong>Monday, April 6th at 7:00 PM PST</strong>. No action needed — just show up!</p>
            
            <p style="font-size: 14px; color: #374151; margin-bottom: 16px;">Here are your joining options:</p>

            ${joinUrl ? `
            <a href="${escapeHtml(joinUrl)}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin-bottom: 12px;">
              Join on SoberHelpline.com
            </a>
            <p style="font-size: 13px; color: #6b7280; margin: 8px 0 16px 0;">Opens directly in your browser (requires a free account)</p>
            ` : ''}

            ${externalZoomLink ? `
            <a href="${escapeHtml(externalZoomLink)}" style="display: inline-block; padding: 12px 24px; background-color: #6b7280; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
              Join via Zoom App
            </a>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 8px;">Meeting ID: ${escapeHtml(meetingId)} &nbsp;|&nbsp; Passcode: ${escapeHtml(passcode)}</p>
            ` : ''}
          </div>

          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">💬 What Would You Like to Discuss?</h3>
            <p style="margin: 0 0 12px 0; color: #1e40af; font-size: 14px;">
              We want "The Family Squares" to be as helpful as possible for <em>you</em>. Is there a topic you'd like us to cover? A question you're struggling with? Let us know and we'll work it into an upcoming meeting.
            </p>
            <a href="mailto:matt@soberhelpline.com?subject=Topic%20Suggestion%20for%20The%20Family%20Squares&body=Hi%20Matt%2C%0A%0AI'd%20like%20to%20suggest%20the%20following%20topic%20or%20question%20for%20an%20upcoming%20meeting%3A%0A%0A" style="display: inline-block; padding: 10px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
              Submit a Topic or Question
            </a>
          </div>

          <div style="background-color: #f5f3ff; border: 1px solid #c4b5fd; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #5b21b6; font-size: 14px;">
              <strong>📨 Share this with your family.</strong> If there's anyone else in your family who could benefit from this meeting — a spouse, sibling, parent, or adult child — feel free to forward this email. The more of your family that shows up, the more you'll all get out of it.
            </p>
          </div>

          <p>We hope to see you on April 6th. These meetings exist because of families like yours, and we don't take that lightly.</p>

          <p>Warmly,<br/><strong>Matt</strong><br/>Sober Helpline<br/>(541) 241-5886</p>

          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            Sober Helpline — Supporting Families Through Recovery
          </p>
        </div>
      `;

      const success = await sendEmail(
        email,
        "We're Sorry — You're Pre-Registered for April 6th \"The Family Squares\" Meeting",
        html
      );
      results[email] = success;
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
