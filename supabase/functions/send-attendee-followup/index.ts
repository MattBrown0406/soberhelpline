import "../_shared/suppression.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";
import { hasAutomationAuth } from "../_shared/automationAuth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-automation-secret, x-cron-secret',
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char] || char));

const MEMBERSHIP_SECTION = `
  <p style="line-height: 1.7; font-size: 15px;">I wanted to let you know about everything Sober Helpline has to offer beyond our weekly calls. As a <strong>Sober Helpline member</strong>, you get access to:</p>

  <ul style="line-height: 2; font-size: 15px; padding-left: 20px;">
    <li>📋 <strong>Private Family Discussion Forum</strong> — A safe, moderated space to connect with other families navigating similar challenges</li>
    <li>📚 <strong>Education & Support Materials</strong> — 62+ guides, interactive tools, worksheets, and guided meditations designed specifically for families</li>
    <li>🤖 <strong>AI-Powered Coaching Tools</strong> — Boundary builders, enabling behavior coaches, and treatment navigators available 24/7</li>
    <li>💰 <strong>$25 Discount on Coaching Sessions</strong> — Members pay $125/hour instead of $150 for 1-on-1 coaching (the membership more than pays for itself!)</li>
    <li>📹 <strong>Access to Recorded Zoom Sessions</strong> — Catch up on past “The Family Squares” calls anytime</li>
  </ul>

  <p style="line-height: 1.7; font-size: 15px;">All of this for just <strong>$9.99/month</strong> — less than the cost of a single cup of coffee a week. And with the $25 coaching discount, your membership pays for itself with just one session.</p>

  <div style="text-align: center; margin: 32px 0;">
    <a href="https://soberhelpline.com/family-membership" style="background-color: #16a34a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Become a Member Today</a>
  </div>

  <p style="line-height: 1.7; font-size: 15px;">We also hope to see you again next Monday at 7:00 PM Pacific. You're always welcome, member or not.</p>`;

// People who RSVP'd in the Sober Helpline app: same thank-you, no website
// membership pitch and no App Store link (they already have the app).
const APP_SECTION = `
  <p style="line-height: 1.7; font-size: 15px;">We hope to see you again next Monday at 7:00 PM Pacific. You can RSVP and send your question ahead of time right in the Sober Helpline app.</p>`;

const buildHtml = (firstName: string, viaApp: boolean) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://soberhelpline.com/og-image.png" alt="Sober Helpline" style="max-width: 200px; height: auto;" />
  </div>

  <h2 style="color: #1a1a1a; font-size: 22px;">Thank You for Joining Us, ${firstName}!</h2>

  <p style="line-height: 1.7; font-size: 15px;">It was great having you on our “The Family Squares” call. We hope you found it valuable and felt the support of the community around you.</p>
  ${viaApp ? APP_SECTION : MEMBERSHIP_SECTION}

  <p style="line-height: 1.7; font-size: 15px;">With care,<br><strong>Matt Brown</strong><br>Sober Helpline<br><a href="https://soberhelpline.com" style="color: #16a34a;">soberhelpline.com</a></p>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />

  <p style="font-size: 12px; color: #999; text-align: center;">You're receiving this email because you registered for our “The Family Squares” call. If you have any questions, reply to this email or visit <a href="https://soberhelpline.com" style="color: #16a34a;">soberhelpline.com</a>.</p>
</div>
            `;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const body = await req.json().catch(() => null);

    // The caller names the recipients, so this always needs a credential
    // (cron_secret, the automation secret, the service role key or an admin);
    // it is not staged behind enforce_function_auth.
    if (!(await hasAutomationAuth(req, admin, body))) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const recipients = body?.recipients;
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');

    if (!recipients || !Array.isArray(recipients)) {
      return new Response(JSON.stringify({ error: 'Recipients array required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const valid = recipients.filter((r: any) => r && typeof r.email === 'string' && r.email.trim());
    const lowered = [...new Set(valid.map((r: any) => r.email.trim().toLowerCase()))];
    const appEmails = new Set<string>();
    if (lowered.length > 0) {
      const { data: appRows, error: appError } = await admin
        .from('zoom_meeting_registrations')
        .select('email')
        .eq('registration_source', 'app')
        .in('email', lowered);
      if (appError) throw appError;
      (appRows || []).forEach((row: { email: string }) => appEmails.add(row.email.trim().toLowerCase()));
    }

    const results = [];

    for (const r of valid) {
      const name = typeof r.name === 'string' ? r.name : '';
      const firstName = escapeHtml(name.trim().split(/\s+/)[0] || 'there');
      const viaApp = appEmails.has(r.email.trim().toLowerCase());

      const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tracking_settings: { subscription_tracking: { enable: true } },
          personalizations: [{ to: [{ email: r.email, name: name || undefined }] }],
          from: { email: 'matt@soberhelpline.com', name: 'Matt Brown | Sober Helpline' },
          subject: 'Thank You for Joining Us Last Night',
          content: [{
            type: 'text/html',
            value: buildHtml(firstName, viaApp),
          }]
        }),
      });

      results.push({
        email: r.email,
        status: sgResponse.ok ? 'sent' : 'failed',
        statusCode: sgResponse.status,
        via_app: viaApp,
      });

      // Small delay to avoid SendGrid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
