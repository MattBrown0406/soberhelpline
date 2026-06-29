import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_URL = "https://apps.apple.com/us/app/sober-helpline/id6780034996";

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

function buildHtml(safeName: string): string {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
      <h1 style="color: #166534; font-size: 24px;">The Sober Helpline App is Here</h1>
      <p>Hi ${safeName},</p>
      <p>I'm excited to share that the <strong>Sober Helpline iOS app</strong> is now available in the Apple App Store.</p>
      <p>The app gives you on-the-go access to <strong>many of our free family resources</strong> — and if you're a paid member, <strong>every membership feature</strong> is available right in your pocket.</p>

      <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: bold; color: #166534;">
          📱 Download the Sober Helpline App
        </p>
        <a href="${APP_URL}" style="display: inline-block; padding: 14px 32px; background-color: #111827; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Get the App on the App Store
        </a>
        <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
          Free to download. Works on iPhone and iPad.
        </p>
      </div>

      <p><strong>What you get in the app:</strong></p>
      <ul style="color: #374151; line-height: 1.6;">
        <li>Family education guides and worksheets</li>
        <li>The Recovery Roadmap for your family's stage</li>
        <li>"The Family Squares" Monday night Zoom access</li>
        <li>Members: full library, recordings, AI coaching tools, and more</li>
      </ul>

      <p>If you've been wanting an easier way to lean on our resources between meetings, this is it.</p>
      <p style="margin-top: 8px;">— Matt</p>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
        Questions? Call us at <strong>(541) 241-5886</strong>.
      </p>
      <p style="color: #6b7280; font-size: 12px;">
        Sober Helpline — Supporting Families Through Recovery
      </p>
    </div>
  `;
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

    // Suppression list
    const { data: suppressed } = await adminSupabase
      .from("email_suppression_list")
      .select("email");
    const suppressedEmails = new Set(
      (suppressed || []).map((s: any) => s.email.toLowerCase())
    );

    const recipientMap = new Map<string, string>(); // email -> first name

    // Active family members
    const { data: activeSubs } = await adminSupabase
      .from("provider_subscriptions")
      .select("user_id")
      .is("provider_submission_id", null)
      .eq("status", "active");
    const memberUserIds = [...new Set((activeSubs || []).map((s: any) => s.user_id))];

    if (memberUserIds.length) {
      const { data: memberPrivate } = await adminSupabase
        .from("profile_private")
        .select("user_id, email")
        .in("user_id", memberUserIds);
      const { data: memberProfiles } = await adminSupabase
        .from("profiles")
        .select("id, first_name")
        .in("id", memberUserIds);
      const nameMap = new Map(memberProfiles?.map((p: any) => [p.id, p.first_name]) || []);
      for (const mp of memberPrivate || []) {
        const email = mp.email?.toLowerCase();
        if (!email || suppressedEmails.has(email)) continue;
        recipientMap.set(email, nameMap.get(mp.user_id) || "Friend");
      }
    }

    // Past zoom registrants
    const { data: pastRegs } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("email, name")
      .order("created_at", { ascending: false });
    for (const r of pastRegs || []) {
      const email = r.email?.toLowerCase();
      if (!email || suppressedEmails.has(email) || recipientMap.has(email)) continue;
      recipientMap.set(email, r.name || "Friend");
    }

    console.log(`App download blast: ${recipientMap.size} recipients`);

    const subject = "📱 The Sober Helpline App is now in the App Store";
    let sent = 0, failed = 0;
    for (const [email, name] of recipientMap) {
      const safeName = escapeHtml((name.split(" ")[0] || "Friend"));
      const ok = await sendEmail(email, subject, buildHtml(safeName));
      if (ok) sent++; else failed++;
    }

    return new Response(JSON.stringify({ success: true, sent, failed, total: recipientMap.size }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("send-app-download-blast error:", error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
