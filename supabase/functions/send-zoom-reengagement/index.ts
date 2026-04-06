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
  // Get current date in PST
  const now = new Date();
  const pst = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  const day = pst.getDay(); // 0=Sun, 1=Mon, ...
  
  // If it's Monday (day === 1), use today
  // Otherwise calculate days until next Monday
  let daysUntilMonday: number;
  if (day === 1) {
    daysUntilMonday = 0;
  } else if (day === 0) {
    daysUntilMonday = 1;
  } else {
    daysUntilMonday = 8 - day;
  }
  
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
    console.log(`Re-engagement for upcoming meeting: ${upcomingDate}`);

    // Get this week's registrants (to exclude)
    const { data: thisWeek, error: e2 } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("email")
      .eq("meeting_date", upcomingDate);

    if (e2) throw e2;

    const thisWeekEmails = new Set((thisWeek || []).map((r: any) => r.email.toLowerCase()));

    // Get all active family members (to exclude — they get separate reminders)
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

    // Get ALL previous registrants
    const { data: allPast, error: e1 } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("name, email")
      .lt("meeting_date", upcomingDate)
      .order("created_at", { ascending: false });

    if (e1) throw e1;

    // Filter: not already registered for upcoming, not a member, deduplicated
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
      return new Response(JSON.stringify({ message: "No re-engagement targets found", sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const siteUrl = "https://soberhelpline.com";
    const registerUrl = `${siteUrl}/monday-zoom-registration`;
    const adminEmail = "matt@soberhelpline.com";

    let sent = 0;
    let failed = 0;
    const recipientList: string[] = [];

    for (const reg of targets) {
      const safeName = escapeHtml(reg.name);

      const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
          <h1 style="color: #166534; font-size: 24px;">We'd Love to See You Tonight!</h1>
          <p>Hi ${safeName},</p>
          <p>We noticed you haven't registered for tonight's <strong>"The Family Squares"</strong> meeting yet, and we'd love to see you there.</p>
          <p>Every Monday at <strong>7:00 PM PST</strong>, families just like yours come together to learn, share, and support each other through the challenges of loving someone with addiction. Showing up — even when it's hard — is one of the most powerful things you can do.</p>

          <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <a href="${escapeHtml(registerUrl)}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Register for Tonight's Meeting
            </a>
            <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
              Quick registration — your meeting link will be emailed to you right away.
            </p>
          </div>

          <div style="background-color: #f5f3ff; border: 1px solid #c4b5fd; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #5b21b6; font-size: 14px;">
              <strong>⭐ Want more than "The Family Squares"?</strong> Sober Helpline membership is just <strong>$14.99/month</strong> and includes a <strong>$25 discount on coaching sessions</strong>, access to the Family Forum, recorded meetings, and our full educational curriculum.
            </p>
            <a href="${siteUrl}/family-membership" style="display: inline-block; margin-top: 4px; padding: 8px 20px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px;">
              Learn About Membership
            </a>
          </div>

          <p>We hope to see you tonight! 💚</p>
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
          subject: "📅 We'd love to see you at \"The Family Squares\" tonight!",
          content: [{ type: "text/html", value: html }],
        }),
      });

      if (res.ok) {
        sent++;
        recipientList.push(`${reg.name} (${reg.email})`);
        console.log(`Re-engagement sent to ${reg.email}`);
      } else {
        failed++;
        console.error(`Failed for ${reg.email}: ${await res.text()}`);
      }
    }

    // Send admin summary/copy
    const summaryHtml = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
        <h1 style="color: #1a365d; font-size: 22px;">Re-Engagement Emails Sent — ${upcomingDate}</h1>
        <p><strong>${sent}</strong> emails sent successfully${failed > 0 ? `, <strong>${failed}</strong> failed` : ''}.</p>
        <p>The following previous attendees were invited to register for tonight's "The Family Squares":</p>
        <ol style="font-size: 14px; line-height: 1.8;">
          ${recipientList.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
        </ol>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">This is an automated summary from the Sober Helpline re-engagement system.</p>
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
        subject: `📊 Re-Engagement Summary: ${sent} emails sent for ${upcomingDate}`,
        content: [{ type: "text/html", value: summaryHtml }],
      }),
    });

    return new Response(JSON.stringify({ success: true, sent, failed, total: targets.length, upcomingDate }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending re-engagement emails:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
