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

function getNextMonday(): string {
  const now = new Date();
  const pstString = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  const pstNow = new Date(pstString);
  const day = pstNow.getDay();
  let daysUntilMonday: number;
  if (day === 0) daysUntilMonday = 1;
  else if (day === 1) daysUntilMonday = 0;
  else daysUntilMonday = 8 - day;
  const nextMonday = new Date(pstNow);
  nextMonday.setDate(pstNow.getDate() + daysUntilMonday);
  const year = nextMonday.getFullYear();
  const month = String(nextMonday.getMonth() + 1).padStart(2, '0');
  const date = String(nextMonday.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
}

function buildMemberHtml(safeName: string, siteUrl: string, questionUrl: string): string {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
      <h1 style="color: #166534; font-size: 24px;">Reminder: “The Family Squares”</h1>
      <p>Hi ${safeName},</p>
      <p>Just a quick reminder — our <strong>“The Family Squares”</strong> is this Monday at <strong>7:00 PM PST</strong>.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #166534;">
          ✅ As a member, you don't need to register!
        </p>
        <p style="margin: 0 0 16px 0; font-size: 14px; color: #374151;">
          Simply <strong>log into your account</strong> on our site right before the meeting starts and you'll be able to join directly — no registration needed.
        </p>
        <div style="text-align: center;">
          <a href="${escapeHtml(siteUrl)}/auth" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Log In to Your Account
          </a>
        </div>
      </div>

      <div style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
        <p style="margin: 0 0 12px 0; color: #854d0e; font-size: 14px;">
          <strong>💬 Have a question for Monday's meeting?</strong><br/>
          Submit it ahead of time so I can be ready to address it.
        </p>
        <a href="${escapeHtml(questionUrl)}" style="display: inline-block; padding: 10px 24px; background-color: #d97706; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
          Submit a Question
        </a>
      </div>

      <p>The meeting opens directly in your browser — no Zoom app needed.</p>
      <p>I look forward to seeing you there.</p>
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

function buildNonMemberHtml(safeName: string, registerUrl: string): string {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
      <h1 style="color: #166534; font-size: 24px;">You're Invited: “The Family Squares”</h1>
      <p>Hi ${safeName},</p>
      <p>I wanted to personally invite you to join us this <strong>Monday at 7:00 PM PST</strong> for our weekly <strong>“The Family Squares”</strong>.</p>
      <p>Whether you're looking for guidance, support, or just a safe space to share — you're welcome here.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: bold; color: #166534;">
          📅 This Monday at 7:00 PM PST
        </p>
        <a href="${escapeHtml(registerUrl)}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Register for Monday's Meeting
        </a>
        <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
          Registration takes less than a minute. You can also submit a question ahead of time so I can be prepared to answer it during the meeting.
        </p>
      </div>

      <p>The meeting is <strong>free and open to everyone</strong>. You can join directly from your browser — no Zoom app needed.</p>

      <p>I look forward to seeing you there.</p>
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

    const nextMonday = getNextMonday();
    console.log(`Sending zoom invitation outreach. Next Monday: ${nextMonday}`);

    const siteUrl = "https://soberhelpline.com";
    const registerUrl = `${siteUrl}/monday-zoom-registration`;
    const questionUrl = `${siteUrl}/monday-zoom-registration?member=true`;

    // 1. Get emails already registered for this upcoming Monday
    const { data: currentRegistrations } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("email")
      .eq("meeting_date", nextMonday);

    const alreadyRegisteredEmails = new Set(
      (currentRegistrations || []).map((r: any) => r.email.toLowerCase())
    );
    console.log(`Already registered for ${nextMonday}: ${alreadyRegisteredEmails.size}`);

    // 2. Get all active family members
    const { data: activeSubs } = await adminSupabase
      .from("provider_subscriptions")
      .select("user_id")
      .is("provider_submission_id", null)
      .eq("status", "active");

    const memberUserIds = [...new Set((activeSubs || []).map((s: any) => s.user_id))];

    const { data: memberPrivate } = await adminSupabase
      .from("profile_private")
      .select("user_id, email")
      .in("user_id", memberUserIds);

    const { data: memberProfiles } = await adminSupabase
      .from("profiles")
      .select("id, first_name")
      .in("id", memberUserIds);

    const memberNameMap = new Map(memberProfiles?.map((p: any) => [p.id, p.first_name]) || []);

    // Track member emails for differentiated messaging
    const memberEmailSet = new Set<string>();
    const recipientMap = new Map<string, { name: string; isMember: boolean }>();

    // Add members
    for (const mp of (memberPrivate || [])) {
      const email = mp.email.toLowerCase();
      memberEmailSet.add(email);
      if (!alreadyRegisteredEmails.has(email)) {
        const name = memberNameMap.get(mp.user_id) || "Friend";
        recipientMap.set(email, { name, isMember: true });
      }
    }

    // 3. Get all previous zoom registrants
    const { data: allPastRegistrants } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("email, name")
      .neq("meeting_date", nextMonday)
      .order("created_at", { ascending: false });

    const pastRegistrantMap = new Map<string, string>();
    for (const r of (allPastRegistrants || [])) {
      const email = r.email.toLowerCase();
      if (!pastRegistrantMap.has(email)) {
        pastRegistrantMap.set(email, r.name || "Friend");
      }
    }

    // Add past registrants (don't overwrite members)
    for (const [email, name] of pastRegistrantMap) {
      if (!alreadyRegisteredEmails.has(email) && !recipientMap.has(email)) {
        recipientMap.set(email, { name, isMember: memberEmailSet.has(email) });
      }
    }

    console.log(`Total recipients (excluding already registered): ${recipientMap.size}`);

    if (recipientMap.size === 0) {
      return new Response(JSON.stringify({ message: "No recipients to email", sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Send emails with differentiated content
    let sent = 0;
    let failed = 0;
    let membersSent = 0;
    let nonMembersSent = 0;

    for (const [email, { name, isMember }] of recipientMap) {
      const safeName = escapeHtml(name.split(' ')[0] || "Friend");

      const html = isMember
        ? buildMemberHtml(safeName, siteUrl, questionUrl)
        : buildNonMemberHtml(safeName, registerUrl);

      const subject = isMember
        ? "🔔 Reminder: “The Family Squares” — Just Log In to Join"
        : "📅 You're Invited: “The Family Squares” — Register Now";

      const success = await sendEmail(email, subject, html);

      if (success) {
        sent++;
        if (isMember) membersSent++;
        else nonMembersSent++;
      } else {
        failed++;
      }
    }

    console.log(`Zoom invitation outreach: sent=${sent} (members=${membersSent}, nonMembers=${nonMembersSent}), failed=${failed}`);

    return new Response(JSON.stringify({
      success: true,
      sent,
      membersSent,
      nonMembersSent,
      failed,
      totalRecipients: recipientMap.size,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending zoom invitation outreach:", error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
