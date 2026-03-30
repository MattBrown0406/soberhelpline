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

    const upcomingDate = "2026-03-30";

    // Get this week's registrants (to exclude)
    const { data: thisWeek, error: e2 } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("email")
      .eq("meeting_date", upcomingDate);

    if (e2) throw e2;

    const thisWeekEmails = new Set((thisWeek || []).map((r: any) => r.email.toLowerCase()));

    // Get all active family members (to exclude)
    const { data: activeSubs } = await adminSupabase
      .from("provider_subscriptions")
      .select("user_id")
      .is("provider_submission_id", null)
      .eq("status", "active");

    const memberUserIds = [...new Set((activeSubs || []).map((s: any) => s.user_id))];

    const { data: memberPrivate } = await adminSupabase
      .from("profile_private")
      .select("email")
      .in("user_id", memberUserIds);

    const memberEmails = new Set((memberPrivate || []).map((m: any) => m.email.toLowerCase()));

    // Get ALL previous registrants (not just last week)
    const { data: allPast, error: e1 } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("name, email")
      .neq("meeting_date", upcomingDate)
      .order("created_at", { ascending: false });

    if (e1) throw e1;

    // Filter: not already registered, not a member, deduplicated
    const targets: { name: string; email: string }[] = [];
    const seen = new Set<string>();
    for (const r of (allPast || [])) {
      const key = r.email.toLowerCase();
      if (!thisWeekEmails.has(key) && !memberEmails.has(key) && !seen.has(key)) {
        seen.add(key);
        targets.push(r);
      }
    }

    // Add manual recipients (non-member test)
    const manualRecipients = [
      { name: "Matt", email: "matt@freedominterventions.com" },
    ];
    for (const r of manualRecipients) {
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

    let sent = 0;
    let failed = 0;

    for (const reg of targets) {
      const safeName = escapeHtml(reg.name);

      const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
          <h1 style="color: #166534; font-size: 24px;">We Haven't Seen Your Name Yet — Join Us Tomorrow!</h1>
          <p>Hi ${safeName},</p>
          <p>We noticed you haven't registered for tomorrow's <strong>The Family Squares</strong> yet, and we'd love to see you there.</p>
          <p>Consistency is the key to staying ahead of addiction. We know it can be exhausting — and sometimes just showing up is the hardest part. But being part of something bigger can give you the strength and education you need to keep going for your loved one.</p>
          <p>Tomorrow night at <strong>7:00 PM PST</strong>, we'll be here for you.</p>

          <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <a href="${escapeHtml(registerUrl)}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Register for Tomorrow's Meeting
            </a>
            <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
              Quick registration — your meeting link will be emailed to you right away.
            </p>
          </div>

          <div style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <div style="text-align: center; margin-bottom: 12px;">
              <img src="https://static.showit.co/800/l0Mb_Xc-P-SzU-s9UQyL4A/240702/katiebarr2.jpg" alt="Katie Barr" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #d97706;" />
            </div>
            <p style="margin: 0 0 8px 0; color: #854d0e; font-size: 15px; text-align: center;">
              <strong>🎉 Exciting News: Welcome Katie Barr to the Team!</strong>
            </p>
            <p style="margin: 0; color: #713f12; font-size: 14px; text-align: center;">
              We're thrilled to announce that <strong>Katie Barr</strong>, a Certified Intervention Professional from Barr Interventions &amp; Consulting, is joining our Sober Helpline team. Katie brings years of experience supporting families through addiction and recovery. We can't wait for you to meet her!
            </p>
          </div>

          <div style="background-color: #f5f3ff; border: 1px solid #c4b5fd; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #5b21b6; font-size: 14px;">
              <strong>⭐ Want more than The Family Squares?</strong> Sober Helpline membership is just <strong>$14.99/month</strong> and includes a <strong>$25 discount on coaching sessions</strong> plus full access to the member section of the site.
            </p>
            <a href="${siteUrl}/family-membership" style="display: inline-block; margin-top: 4px; padding: 8px 20px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px;">
              Learn About Membership
            </a>
          </div>

          <p>We're excited to see you tomorrow night. 💚</p>
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
          from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
          subject: "📅 You haven't registered yet — join us tomorrow night!",
          content: [{ type: "text/html", value: html }],
        }),
      });

      if (res.ok) {
        sent++;
        console.log(`Re-engagement sent to ${reg.email}`);
      } else {
        failed++;
        console.error(`Failed for ${reg.email}: ${await res.text()}`);
      }
    }

    return new Response(JSON.stringify({ success: true, sent, failed, total: targets.length }), {
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
