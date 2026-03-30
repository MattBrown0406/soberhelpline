import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not configured");

    // Get current meeting credentials
    const { data: settings } = await adminSupabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["monday_zoom_meeting_id", "monday_zoom_passcode"]);

    const meetingId = settings?.find((s: any) => s.key === "monday_zoom_meeting_id")?.value || "";
    const passcode = settings?.find((s: any) => s.key === "monday_zoom_passcode")?.value || "";

    if (!meetingId) throw new Error("No meeting ID configured");

    const siteUrl = "https://soberhelpline.com";
    const joinUrl = `${siteUrl}/join-meeting?mn=${encodeURIComponent(meetingId)}&pwd=${encodeURIComponent(passcode)}`;
    const registerUrl = `${siteUrl}/monday-zoom-registration`;

    let body: any = {};
    try { body = await req.json(); } catch {}

    // If custom recipients provided, use those. Otherwise fall back to meeting_date lookup.
    let recipients: { name: string; email: string }[] = [];

    if (body.recipients && Array.isArray(body.recipients)) {
      recipients = body.recipients;
    } else {
      let targetDate = body.meeting_date || "";
      if (!targetDate) {
        const now = new Date();
        const day = now.getUTCDay();
        const daysUntilMonday = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
        const nextMonday = new Date(now);
        nextMonday.setUTCDate(now.getUTCDate() + daysUntilMonday);
        targetDate = nextMonday.toISOString().split("T")[0];
      }

      const { data: registrants, error } = await adminSupabase
        .from("zoom_meeting_registrations")
        .select("name, email")
        .eq("meeting_date", targetDate);

      if (error) throw error;
      recipients = registrants || [];
    }

    if (recipients.length === 0) {
      return new Response(JSON.stringify({ message: "No recipients found", sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Deduplicate by email
    const seen = new Set<string>();
    const unique: { name: string; email: string }[] = [];
    for (const r of recipients) {
      const key = r.email.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(r);
      }
    }

    let sent = 0;
    let failed = 0;

    for (const reg of unique) {
      const safeName = escapeHtml(reg.name);

      const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
          <h1 style="color: #166534;">This Monday: The Family Squares</h1>
          <p>Hi ${safeName},</p>
          <p>Here is your link for this Monday's <strong>The Family Squares Zoom</strong> at <strong>7:00 PM PST</strong>.</p>
          
          <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <a href="${escapeHtml(joinUrl)}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Join Monday's Meeting
            </a>
            <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
              The meeting opens directly in your browser — no Zoom app needed.
            </p>
          </div>

          <div style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 12px 0; color: #854d0e; font-size: 14px;">
              <strong>💬 Have a question for Monday's meeting?</strong><br/>
              Submit it ahead of time and we'll do our best to address it.
            </p>
            <a href="${escapeHtml(registerUrl)}?member=true" style="display: inline-block; padding: 10px 24px; background-color: #d97706; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
              Submit a Question
            </a>
          </div>

          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>📨 Share with your family.</strong> If there's anyone else who could benefit from this meeting — a spouse, sibling, parent, or adult child — feel free to forward this email. The more of your family that shows up, the more you'll all get out of it.
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
      `;

      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: reg.email }] }],
          from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
          subject: "📍 This Monday — The Family Squares at 7 PM PST",
          content: [{ type: "text/html", value: html }],
        }),
      });

      if (res.ok) {
        sent++;
        console.log(`Sent to ${reg.email}`);
      } else {
        failed++;
        console.error(`Failed for ${reg.email}: ${await res.text()}`);
      }
    }

    return new Response(JSON.stringify({ success: true, sent, failed, total: unique.length }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error resending zoom links:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
