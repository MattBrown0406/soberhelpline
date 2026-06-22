import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function sendEmail(to: string, subject: string, htmlContent: string) {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY is not configured");

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
      subject,
      content: [{ type: "text/html", value: htmlContent }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`SendGrid error for ${to}: [${response.status}] ${errorText}`);
    return false;
  }
  return true;
}

async function isAuthorized(req: Request, adminSupabase: ReturnType<typeof createClient>): Promise<boolean> {
  // Path 1: shared cron/automation secret
  const expectedSecret = Deno.env.get("FOLLOWUP_AUTOMATION_SECRET");
  const providedSecret = req.headers.get("x-automation-secret");
  if (expectedSecret && providedSecret && providedSecret === expectedSecret) {
    return true;
  }

  // Path 2: authenticated admin JWT
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await adminSupabase.auth.getUser(token);
  if (error || !data?.user) return false;
  const { data: roleRow } = await adminSupabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .eq("role", "admin")
    .maybeSingle();
  return !!roleRow;
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

    if (!(await isAuthorized(req, adminSupabase))) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for optional flag to include all members (not just active)
    let includeAllStatuses = false;
    try {
      const body = await req.json();
      includeAllStatuses = body?.include_all_statuses === true;
    } catch {
      // No body or invalid JSON — default behavior (active only)
    }

    // Get the current Zoom meeting link
    const { data: settings } = await adminSupabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["monday_zoom_meeting_id", "monday_zoom_passcode", "monday_zoom_link"]);

    const meetingId = settings?.find((s: any) => s.key === "monday_zoom_meeting_id")?.value || "";
    const passcode = settings?.find((s: any) => s.key === "monday_zoom_passcode")?.value || "";
    const externalZoomLink = settings?.find((s: any) => s.key === "monday_zoom_link")?.value || "";

    if (!meetingId) {
      return new Response(JSON.stringify({ error: "No Zoom meeting configured" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const siteUrl = "https://soberhelpline.com";
    const joinUrl = `${siteUrl}/join-meeting?mn=${encodeURIComponent(meetingId)}&pwd=${encodeURIComponent(passcode)}`;

    // Get family members (provider_submission_id IS NULL = family membership)
    let subsQuery = adminSupabase
      .from("provider_subscriptions")
      .select("user_id")
      .is("provider_submission_id", null);

    if (!includeAllStatuses) {
      subsQuery = subsQuery.eq("status", "active");
    } else {
      // Include active, cancelled, and expired — exclude pending
      subsQuery = subsQuery.in("status", ["active", "cancelled", "expired"]);
    }

    const { data: activeSubs, error: subsError } = await subsQuery;

    if (subsError) throw subsError;

    // Deduplicate by user_id (a user may have multiple subscription records)
    const uniqueUserIds = [...new Set((activeSubs || []).map((s: any) => s.user_id))];

    if (uniqueUserIds.length === 0) {
      return new Response(JSON.stringify({ message: "No members found", sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userIds = uniqueUserIds;

    // Get member emails and names from profile_private + profiles
    const { data: privateProfiles } = await adminSupabase
      .from("profile_private")
      .select("user_id, email")
      .in("user_id", userIds);

    const { data: profiles } = await adminSupabase
      .from("profiles")
      .select("id, first_name")
      .in("id", userIds);

    const profileMap = new Map(profiles?.map((p: any) => [p.id, p.first_name]) || []);

    const { data: blockRows } = await adminSupabase
      .from("meeting_blocklist")
      .select("email");
    const blockedSet = new Set((blockRows || []).map((r: any) => String(r.email).toLowerCase().trim()));

    let sent = 0;
    let failed = 0;
    let skippedBlocked = 0;

    for (const pp of (privateProfiles || [])) {
      if (pp.email && blockedSet.has(String(pp.email).toLowerCase().trim())) {
        skippedBlocked++;
        console.warn(`Skipping blocked member email: ${pp.email}`);
        continue;
      }
      const firstName = profileMap.get(pp.user_id) || "Friend";
      const safeName = escapeHtml(firstName);

      const questionUrl = `${siteUrl}/monday-zoom-registration?member=true`;

      const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
          <h1 style="color: #166534;">Tonight's “The Family Squares”</h1>
          <p>Hi ${safeName},</p>
          <p>This is your weekly reminder that tonight's <strong>“The Family Squares”</strong> starts at <strong>7:00 PM PST</strong>.</p>
          <p>As a member, you don't need to register — just click the link below to join:</p>
          
          <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <a href="${escapeHtml(joinUrl)}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Join Tonight's Meeting
            </a>
            <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
              The meeting opens directly in your browser — no Zoom app needed.
            </p>
            ${externalZoomLink ? `
            <div style="margin-top: 12px;">
              <p style="font-size: 13px; color: #6b7280; margin: 0 0 8px 0;">
                Having trouble? Join directly through Zoom:
              </p>
              <a href="${escapeHtml(externalZoomLink)}" style="display: inline-block; padding: 10px 24px; background-color: #6b7280; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
                Join via Zoom App
              </a>
              ${passcode ? `<p style="font-size: 12px; color: #9ca3af; margin-top: 8px;">Meeting ID: ${escapeHtml(meetingId)} &nbsp;|&nbsp; Passcode: ${escapeHtml(passcode)}</p>` : ''}
            </div>
            ` : ''}
          </div>

          <div style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 12px 0; color: #854d0e; font-size: 14px;">
              <strong>💬 Have a question for tonight?</strong><br/>
              Submit your question ahead of time and we'll do our best to address it during the meeting.
            </p>
            <a href="${escapeHtml(questionUrl)}" style="display: inline-block; padding: 10px 24px; background-color: #d97706; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
              Submit a Question
            </a>
          </div>

          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>📨 Share with your family.</strong> If there's anyone else who could benefit from tonight's meeting — a spouse, sibling, parent, or adult child — feel free to forward this email. The more of your family that shows up, the more you'll all get out of it.
            </p>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            Thank you for being a Sober Helpline member. If you have any questions, call us at <strong>(541) 241-5886</strong>.
          </p>
          <p style="color: #6b7280; font-size: 12px;">
            Sober Helpline — Supporting Families Through Recovery
          </p>
        </div>
      `;

      const success = await sendEmail(
        pp.email,
        "🔔 Tonight: “The Family Squares” — 7 PM PST",
        html
      );

      if (success) sent++;
      else failed++;
    }

    console.log(`Member Zoom reminder: sent=${sent}, failed=${failed}, skippedBlocked=${skippedBlocked}`);

    return new Response(JSON.stringify({ success: true, sent, failed, skippedBlocked }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending member zoom reminders:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
