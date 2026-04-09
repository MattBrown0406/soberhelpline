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

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get active family members
    const { data: activeSubs, error: subsError } = await adminSupabase
      .from("provider_subscriptions")
      .select("user_id")
      .is("provider_submission_id", null)
      .eq("status", "active");

    if (subsError) throw subsError;

    const uniqueUserIds = [...new Set((activeSubs || []).map((s: any) => s.user_id))];

    if (uniqueUserIds.length === 0) {
      return new Response(JSON.stringify({ message: "No members found", sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get member emails and names
    const { data: privateProfiles } = await adminSupabase
      .from("profile_private")
      .select("user_id, email")
      .in("user_id", uniqueUserIds);

    const { data: profiles } = await adminSupabase
      .from("profiles")
      .select("id, first_name")
      .in("id", uniqueUserIds);

    const profileMap = new Map(profiles?.map((p: any) => [p.id, p.first_name]) || []);

    const siteUrl = "https://soberhelpline.com";
    const pdfUrl = `${siteUrl}/documents/Family-Squares-Commitment-Round-Fillable.pdf`;
    const questionUrl = `${siteUrl}/monday-zoom-registration?member=true`;

    let sent = 0;
    let failed = 0;

    for (const pp of (privateProfiles || [])) {
      const firstName = profileMap.get(pp.user_id) || "Friend";
      const safeName = escapeHtml(firstName);

      const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
          <h1 style="color: #166534;">This Monday's "The Family Squares"</h1>
          <p>Hi ${safeName},</p>
          <p>We hope you're doing well. We wanted to reach out ahead of this Monday's <strong>"The Family Squares"</strong> meeting at <strong>7:00 PM PST</strong> to let you know what we'll be covering.</p>
          
          <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #166534; margin-top: 0; font-size: 18px;">📝 Homework Discussion</h2>
            <p style="margin: 0;">This week we'll be discussing the homework that was given out during our last meeting. We'd love for you to come prepared — whether you'd like to <strong>participate and share</strong> or simply <strong>listen and absorb</strong>, both are equally welcome.</p>
          </div>

          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #1e40af; margin-top: 0; font-size: 18px;">📄 Missed the Last Meeting?</h2>
            <p>No worries — we've got you covered. Download the <strong>Commitment Round</strong> worksheet below so you can catch up before Monday's discussion:</p>
            <div style="text-align: center; margin-top: 12px;">
              <a href="${escapeHtml(pdfUrl)}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">
                📥 Download the Worksheet
              </a>
            </div>
          </div>

          <div style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 12px 0; color: #854d0e; font-size: 14px;">
              <strong>💬 Have a question or topic you'd like discussed?</strong><br/>
              Submit it ahead of time and we'll do our best to address it during Monday's meeting.
            </p>
            <a href="${escapeHtml(questionUrl)}" style="display: inline-block; padding: 10px 24px; background-color: #d97706; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
              Submit a Question
            </a>
          </div>

          <p>We truly value your participation and look forward to seeing you Monday night.</p>

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
        "📝 Monday's Meeting: Homework Discussion + Submit Your Questions",
        html
      );

      if (success) sent++;
      else failed++;
    }

    console.log(`Homework reminder: sent=${sent}, failed=${failed}`);

    return new Response(JSON.stringify({ success: true, sent, failed }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending homework reminder:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
