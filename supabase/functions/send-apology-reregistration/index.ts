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

function buildApologyTrialEmail(firstName: string, email: string): string {
  return `
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#1f2937;">
  <h1 style="color:#1e3a5f;">Hi ${escapeHtml(firstName)},</h1>

  <p>I want to personally apologize for the inconvenience you experienced during the registration process for <strong>"The Family Squares"</strong> meeting tonight. That's not the experience we want for anyone, and I'm sorry for the trouble.</p>

  <p>To make it right, <strong>I'd like to offer you a complimentary 3-month membership to Sober Helpline</strong> — completely free, no payment information required.</p>

  <div style="background-color:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
    <h2 style="margin:0 0 10px;color:#166534;">🎉 Your 3-Month Free Trial</h2>
    <p style="margin:0 0 15px;color:#15803d;">You have <strong>90 days of full access</strong> to explore everything the Sober Helpline member section has to offer.</p>
  </div>

  <div style="background-color:#f0fdf4;border-radius:8px;padding:24px;margin:20px 0;">
    <h3 style="color:#166534;margin-top:0;">What You Get Access To:</h3>
    <ul style="color:#374151;font-size:14px;line-height:2;padding-left:20px;">
      <li><strong>📅 Free "The Family Squares" Support Calls</strong> — Weekly live group support</li>
      <li><strong>📚 60+ Family Education Guides</strong> — Boundaries, enabling, communication & more</li>
      <li><strong>🛠️ Interactive Worksheets & Assessments</strong> — Boundary-setting, enabling audits, readiness assessments</li>
      <li><strong>🤖 AI-Powered Support Tools</strong> — Boundary Coach, Treatment Navigator, Life Coach (24/7)</li>
      <li><strong>💬 Private Family Support Forum</strong> — A safe, moderated community</li>
      <li><strong>🎥 Zoom Meeting Recordings</strong> — Watch past sessions on your schedule</li>
      <li><strong>📋 On-Demand Coaching</strong> — Book 1-on-1 sessions with recovery coaches</li>
    </ul>
  </div>

  <div style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin:24px 0;">
    <h3 style="margin:0 0 10px;color:#1e40af;">📝 How to Get Started</h3>
    <ol style="color:#374151;font-size:14px;line-height:1.8;padding-left:20px;margin-bottom:0;">
      <li>Go to <a href="https://soberhelpline.com/auth" style="color:#1e40af;">soberhelpline.com/auth</a></li>
      <li>Click <strong>"Sign Up"</strong> and use this email: <strong>${escapeHtml(email)}</strong></li>
      <li>Enter your name and create a password</li>
      <li>Verify your email, log in, and your membership will activate automatically</li>
    </ol>
  </div>

  <div style="background-color:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:20px 0;">
    <p style="margin:0;color:#854d0e;font-size:14px;">
      <strong>After 3 months:</strong> You'll have the option to continue with a paid membership at $14.99/month, or simply let the trial end — no pressure, no automatic charges. This is about giving you a chance to see if it's helpful for you and your family.
    </p>
  </div>

  <p>Again, I'm truly sorry for the hassle tonight. I hope this trial gives you a chance to explore everything we offer and find it valuable.</p>

  <p>We're here for you. 💙</p>

  <p>Warmly,<br/><strong>Matt</strong><br/>Sober Helpline<br/>(541) 241-5886</p>

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />
  <p style="color:#9ca3af;font-size:12px;text-align:center;">
    Sober Helpline — Supporting Families Through Recovery<br/>
    <a href="https://soberhelpline.com" style="color:#9ca3af;">soberhelpline.com</a>
  </p>
</div>`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { recipients, mode } = body;

    if (mode === "apology_trial") {
      const results: Record<string, boolean> = {};
      for (const r of recipients) {
        const firstName = (r.name || "").split(/\s+/)[0] || "there";
        const html = buildApologyTrialEmail(firstName, r.email);
        const success = await sendEmail(
          r.email,
          "Our Apology + A Gift: 3-Month Free Sober Helpline Membership",
          html
        );
        results[r.email] = success;
      }
      return new Response(JSON.stringify({ success: true, results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default legacy mode — original apology/reregistration email
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
          <p>Thank you for trying to register for <strong>"The Family Squares"</strong>. I want to sincerely apologize for the technical issues that prevented some people from registering properly.</p>
          <p><strong>The issue has been identified and corrected.</strong></p>
          <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
            <h2 style="margin: 0 0 10px 0; color: #166534;">✅ You're Pre-Registered!</h2>
            <p style="margin: 0 0 15px 0; color: #15803d;">You've been automatically registered and your meeting link is below.</p>
            ${joinUrl ? `<a href="${escapeHtml(joinUrl)}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Join on SoberHelpline.com</a>` : ''}
            ${externalZoomLink ? `<div style="margin-top:12px"><a href="${escapeHtml(externalZoomLink)}" style="display: inline-block; padding: 12px 24px; background-color: #6b7280; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Join via Zoom App</a><p style="font-size: 12px; color: #9ca3af; margin-top: 8px;">Meeting ID: ${escapeHtml(meetingId)} | Passcode: ${escapeHtml(passcode)}</p></div>` : ''}
          </div>
          <p>I hope to see you tonight.</p>
          <p>Warmly,<br/><strong>Matt</strong><br/>Sober Helpline<br/>(541) 241-5886</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">Sober Helpline — Supporting Families Through Recovery</p>
        </div>`;

      const success = await sendEmail(email, "We're Sorry + Your Registration Link for Tonight", html);
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
