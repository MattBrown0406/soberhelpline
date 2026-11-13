import "../_shared/suppression.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { hasAutomationAuth } from "../_shared/automationAuth.ts";

// Called by the database trigger public.trigger_welcome_email() when a
// website family membership becomes active (at most once per member: the
// trigger claims member_email_log kind 'welcome', period_key 'once'). The
// trigger posts { cron_secret, email, firstName }. verify_jwt is off for this
// function (config.toml); it checks the cron secret itself (or the automation
// secret, the service role key, or an admin).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret, x-cron-secret",
};

const SITE_URL = "https://soberhelpline.com";

function escapeHtml(text: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

function welcomeHtml(firstName: string): string {
  const name = firstName.trim().slice(0, 60);
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi,";
  const link = (path: string, label: string) =>
    `<a href="${SITE_URL}${path}" style="color:#166534; font-weight:bold;">${label}</a>`;
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1f2937;line-height:1.6;">
  <h1 style="color:#166534;font-size:22px;margin-bottom:8px;">Welcome. I'm glad you're here.</h1>
  <p>${greeting}</p>
  <p>Your membership is active. Everything starts from one page, your member home:
    this week's meeting, your path and your workbook.</p>
  <p style="margin:24px 0;">
    <a href="${SITE_URL}/member-home" style="display:inline-block;padding:12px 24px;background-color:#166534;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">Go to your member home</a>
  </p>
  <p><strong>Choose your path.</strong> On your member home, pick the path that fits what your family
    is facing. We'll suggest one step at a time, so you never have to figure out where to start.</p>
  <p><strong>Come on Monday.</strong> Family Squares meets every Monday, 7:00–8:00 PM Pacific,
    on Zoom. As a member you don't need to register; the link is on your member home.
    If there's something you want to talk about, post it in the forum's
    ${link("/family-forum/this-weeks-meeting", "This Week's Meeting")} room beforehand.</p>
  <p>If you have a question, just reply to this email. I read every one.</p>
  <p>— Matt</p>
  <p style="color:#6b7280;font-size:13px;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px;">
    You can choose which emails you get in your
    <a href="${SITE_URL}/member-home#email-settings" style="color:#6b7280;">email settings</a>.
    Sober Helpline · <a href="${SITE_URL}" style="color:#6b7280;">soberhelpline.com</a>
  </p>
</body>
</html>`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let body: Record<string, unknown> = {};
    try {
      body = (await req.json()) ?? {};
    } catch { /* no body */ }

    const admin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    if (!(await hasAutomationAuth(req, admin, body))) return json({ error: "Unauthorized" }, 401);

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const firstName = typeof body.firstName === "string" ? body.firstName : "";
    if (!email || !email.includes("@")) return json({ error: "email required" }, 400);

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not configured");

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        tracking_settings: { subscription_tracking: { enable: true } },
        personalizations: [{ to: [{ email }] }],
        from: { email: "matt@soberhelpline.com", name: "Matt — Sober Helpline" },
        subject: "Welcome to Sober Helpline — here's where to start",
        content: [{ type: "text/html", value: welcomeHtml(firstName) }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`SendGrid error: [${response.status}] ${err.slice(0, 300)}`);
    }
    return json({ success: true });
  } catch (err) {
    console.error("send-welcome-email error:", (err as Error)?.message ?? err);
    return json({ error: "send failed" }, 500);
  }
});
