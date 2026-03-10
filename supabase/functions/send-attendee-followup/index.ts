import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipients } = await req.json();
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');

    if (!recipients || !Array.isArray(recipients)) {
      return new Response(JSON.stringify({ error: 'Recipients array required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];

    for (const r of recipients) {
      const firstName = r.name.split(' ')[0];
      
      const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: r.email, name: r.name }] }],
          from: { email: 'matt@soberhelpline.com', name: 'Matt Brown | Sober Helpline' },
          subject: 'Thank You for Joining Us Last Night',
          content: [{
            type: 'text/html',
            value: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://soberhelpline.com/og-image.png" alt="Sober Helpline" style="max-width: 200px; height: auto;" />
  </div>

  <h2 style="color: #1a1a1a; font-size: 22px;">Thank You for Joining Us, ${firstName}!</h2>
  
  <p style="line-height: 1.7; font-size: 15px;">It was great having you on our Monday Night Zoom call. We hope you found it valuable and felt the support of the community around you.</p>
  
  <p style="line-height: 1.7; font-size: 15px;">I wanted to let you know about everything Sober Helpline has to offer beyond our weekly calls. As a <strong>Sober Helpline member</strong>, you get access to:</p>
  
  <ul style="line-height: 2; font-size: 15px; padding-left: 20px;">
    <li>📋 <strong>Private Family Discussion Forum</strong> — A safe, moderated space to connect with other families navigating similar challenges</li>
    <li>📚 <strong>Education & Support Materials</strong> — 62+ guides, interactive tools, worksheets, and guided meditations designed specifically for families</li>
    <li>🤖 <strong>AI-Powered Coaching Tools</strong> — Boundary builders, enabling behavior coaches, and treatment navigators available 24/7</li>
    <li>💰 <strong>$25 Discount on Coaching Sessions</strong> — Members pay $125/hour instead of $150 for 1-on-1 coaching (the membership more than pays for itself!)</li>
    <li>📹 <strong>Access to Recorded Zoom Sessions</strong> — Catch up on past Monday Night calls anytime</li>
  </ul>
  
  <p style="line-height: 1.7; font-size: 15px;">All of this for just <strong>$14.99/month</strong> — less than the cost of a single cup of coffee a week. And with the $25 coaching discount, your membership pays for itself with just one session.</p>
  
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://soberhelpline.com/family-membership" style="background-color: #16a34a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Become a Member Today</a>
  </div>
  
  <p style="line-height: 1.7; font-size: 15px;">We also hope to see you again next Monday at 7:00 PM PST. You're always welcome, member or not.</p>
  
  <p style="line-height: 1.7; font-size: 15px;">With care,<br><strong>Matt Brown</strong><br>Sober Helpline<br><a href="https://soberhelpline.com" style="color: #16a34a;">soberhelpline.com</a></p>
  
  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
  
  <p style="font-size: 12px; color: #999; text-align: center;">You're receiving this email because you registered for our Monday Night Zoom call. If you have any questions, reply to this email or visit <a href="https://soberhelpline.com" style="color: #16a34a;">soberhelpline.com</a>.</p>
</div>
            `
          }]
        }),
      });

      results.push({
        email: r.email,
        status: sgResponse.ok ? 'sent' : 'failed',
        statusCode: sgResponse.status,
      });

      // Small delay to avoid SendGrid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
