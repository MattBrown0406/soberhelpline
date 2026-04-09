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

function getUpcomingMonday(): string {
  const now = new Date();
  const pst = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  const day = pst.getDay();
  let daysUntilMonday: number;
  if (day === 1) daysUntilMonday = 0;
  else if (day === 0) daysUntilMonday = 1;
  else daysUntilMonday = 8 - day;
  const target = new Date(pst);
  target.setDate(target.getDate() + daysUntilMonday);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const dateStr = String(target.getDate()).padStart(2, '0');
  return `${year}-${month}-${dateStr}`;
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

    const upcomingDate = getUpcomingMonday();
    console.log(`Homework outreach for upcoming meeting: ${upcomingDate}`);

    // Exclude already registered for this week
    const { data: thisWeek } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("email")
      .eq("meeting_date", upcomingDate);
    const thisWeekEmails = new Set((thisWeek || []).map((r: any) => r.email.toLowerCase()));

    // Exclude active members (they got a separate email)
    const { data: activeSubs } = await adminSupabase
      .from("provider_subscriptions")
      .select("user_id")
      .is("provider_submission_id", null)
      .eq("status", "active");
    const memberUserIds = [...new Set((activeSubs || []).map((s: any) => s.user_id))];
    let memberEmails = new Set<string>();
    if (memberUserIds.length > 0) {
      const { data: memberPrivate } = await adminSupabase
        .from("profile_private")
        .select("email")
        .in("user_id", memberUserIds);
      memberEmails = new Set((memberPrivate || []).map((m: any) => m.email.toLowerCase()));
    }

    // All previous registrants
    const { data: allPast, error: e1 } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("name, email")
      .lt("meeting_date", upcomingDate)
      .order("created_at", { ascending: false });
    if (e1) throw e1;

    // Deduplicate and filter
    const targets: { name: string; email: string }[] = [];
    const seen = new Set<string>();
    for (const r of (allPast || [])) {
      const key = r.email.toLowerCase();
      if (!thisWeekEmails.has(key) && !memberEmails.has(key) && !seen.has(key)) {
        seen.add(key);
        targets.push(r);
      }
    }

    if (targets.length === 0) {
      return new Response(JSON.stringify({ message: "No targets found", sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const siteUrl = "https://soberhelpline.com";
    const registerUrl = `${siteUrl}/monday-zoom-registration`;
    const pdfUrl = `${siteUrl}/documents/Family-Squares-Commitment-Round-Fillable-2.pdf`;
    const adminEmail = "matt@soberhelpline.com";

    let sent = 0;
    let failed = 0;
    const recipientList: string[] = [];

    for (const reg of targets) {
      const safeName = escapeHtml(reg.name);

      const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
          <h1 style="color: #166534; font-size: 24px;">Join Us This Monday for "The Family Squares"</h1>
          <p>Hi ${safeName},</p>
          <p>We hope you've been doing well! We wanted to reach out personally because this Monday's <strong>"The Family Squares"</strong> meeting at <strong>7:00 PM PST</strong> is going to be a great one — and we'd love to have you there.</p>

          <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #166534; margin-top: 0; font-size: 18px;">📝 What We're Covering This Week</h2>
            <p style="margin: 0;">This Monday we'll be discussing the <strong>homework</strong> that was given out at our last meeting. If you were there, we hope you've had a chance to reflect on it — we'd love to hear your thoughts. You're welcome to <strong>participate and share</strong> or simply <strong>listen and learn</strong> — both are equally valuable.</p>
          </div>

          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">📄 Weren't Able to Attend Last Time?</h2>
            <p>No worries at all — we've got you covered. Download the <strong>Commitment Round</strong> worksheet below so you can catch up before Monday's discussion:</p>
            <div style="text-align: center; margin-top: 12px;">
              <a href="${escapeHtml(pdfUrl)}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">
                📥 Download the Worksheet
              </a>
            </div>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${escapeHtml(registerUrl)}" style="display: inline-block; padding: 16px 32px; background-color: #166534; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
              Register for Monday's Meeting
            </a>
            <p style="margin-top: 10px; font-size: 13px; color: #6b7280;">
              Quick registration — your meeting link will be emailed to you right away.
            </p>
          </div>

          <div style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 12px 0; color: #854d0e; font-size: 14px;">
              <strong>💬 Have a question or topic you'd like us to discuss?</strong><br/>
              Submit it when you register and we'll do our best to address it during Monday's meeting.
            </p>
          </div>

          <p>We truly value the time you spend with us, and every meeting is better when <em>you're</em> in the room. We hope to see you Monday night! 💚</p>
          <p style="margin-top: 8px;">— Matt &amp; the Sober Helpline Team</p>

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
          from: { email: adminEmail, name: "Sober Helpline" },
          subject: "📅 This Monday: Homework Discussion at \"The Family Squares\" — Register Now",
          content: [{ type: "text/html", value: html }],
        }),
      });

      if (res.ok) {
        sent++;
        recipientList.push(`${reg.name} (${reg.email})`);
      } else {
        failed++;
        console.error(`Failed for ${reg.email}: ${await res.text()}`);
      }
    }

    // Admin summary
    const summaryHtml = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
        <h1 style="color: #1a365d; font-size: 22px;">Homework Outreach Sent — ${upcomingDate}</h1>
        <p><strong>${sent}</strong> emails sent successfully${failed > 0 ? `, <strong>${failed}</strong> failed` : ''}.</p>
        <p>The following previous registrants (non-members) were invited:</p>
        <ol style="font-size: 14px; line-height: 1.8;">
          ${recipientList.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
        </ol>
      </div>
    `;

    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: adminEmail }] }],
        from: { email: adminEmail, name: "Sober Helpline" },
        subject: `📊 Homework Outreach Summary: ${sent} emails sent for ${upcomingDate}`,
        content: [{ type: "text/html", value: summaryHtml }],
      }),
    });

    return new Response(JSON.stringify({ success: true, sent, failed, total: targets.length }), {
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
