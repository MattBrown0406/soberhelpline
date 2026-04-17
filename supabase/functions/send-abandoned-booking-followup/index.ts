import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_URL = "https://soberhelpline.com";

function buildEmailHtml(name: string | null, planType: string | null) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : "Hi there,";
  const planLabel = planType === "emergency"
    ? "Emergency Game Plan"
    : planType === "stabilization"
    ? "Family Stabilization Plan"
    : planType === "parallel"
    ? "Parallel Recovery Program"
    : "Crisis Family Consult";

  const resumeUrl = `${SITE_URL}/book-consultation${planType ? `?plan=${planType}` : ""}`;

  return `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, Segoe UI, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #1f2937; line-height: 1.6;">
  <p>${greeting}</p>

  <p>I noticed you started booking a <strong>${planLabel}</strong> with us a few hours ago but didn't get a chance to finish.</p>

  <p>I want you to know — that's completely normal. Most families who reach this page are in the middle of a really hard moment, and life often interrupts. Phone rings. Loved one walks in. The weight of it all hits and you need to step away. I get it.</p>

  <p>If you still need help, I'd love to talk. You can pick up right where you left off here:</p>

  <p style="margin: 24px 0;">
    <a href="${resumeUrl}" style="background: #0f766e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Finish Booking</a>
  </p>

  <p>And if booking a session doesn't feel right, that's okay too. Just hit reply to this email and tell me what's going on — I read every message personally and I'll point you toward whatever help makes the most sense, even if it's free resources or a different path entirely.</p>

  <p>You don't have to figure this out alone.</p>

  <p style="margin-top: 32px;">
    Matt Brown<br/>
    <span style="color: #6b7280; font-size: 14px;">Founder, Sober Helpline<br/>matt@soberhelpline.com</span>
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0 16px;"/>
  <p style="font-size: 12px; color: #9ca3af;">You're receiving this because you started booking a consultation at soberhelpline.com. If you'd rather we not follow up, just reply with "no thanks" and we'll leave you alone.</p>
</body>
</html>
  `.trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    if (!SENDGRID_API_KEY) throw new Error('SENDGRID_API_KEY not configured');

    // Find abandoned bookings: created 4+ hours ago, not completed, no follow-up sent
    const cutoff = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();

    const { data: abandoned, error } = await supabase
      .from('abandoned_bookings')
      .select('*')
      .eq('completed', false)
      .is('followup_sent_at', null)
      .lt('created_at', cutoff)
      .limit(50);

    if (error) throw error;

    const results: any[] = [];

    for (const record of abandoned || []) {
      // Skip if email is on suppression list
      const { data: suppressed } = await supabase
        .from('email_suppression_list')
        .select('id')
        .eq('email', record.client_email.toLowerCase())
        .maybeSingle();

      if (suppressed) {
        await supabase
          .from('abandoned_bookings')
          .update({ followup_sent_at: new Date().toISOString() })
          .eq('id', record.id);
        results.push({ id: record.id, status: 'suppressed' });
        continue;
      }

      // Skip if they already have a real completed booking with this email
      const { data: realBooking } = await supabase
        .from('consultation_bookings')
        .select('id')
        .eq('client_email', record.client_email)
        .gte('created_at', record.created_at)
        .limit(1)
        .maybeSingle();

      if (realBooking) {
        await supabase
          .from('abandoned_bookings')
          .update({ completed: true, followup_sent_at: new Date().toISOString() })
          .eq('id', record.id);
        results.push({ id: record.id, status: 'already_booked' });
        continue;
      }

      const html = buildEmailHtml(record.client_name, record.plan_type);

      const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: record.client_email, name: record.client_name || undefined }],
          }],
          from: { email: 'matt@soberhelpline.com', name: 'Matt Brown | Sober Helpline' },
          reply_to: { email: 'matt@soberhelpline.com', name: 'Matt Brown' },
          subject: 'Did something get in the way? — Matt at Sober Helpline',
          content: [{ type: 'text/html', value: html }],
        }),
      });

      if (sgRes.ok) {
        await supabase
          .from('abandoned_bookings')
          .update({ followup_sent_at: new Date().toISOString() })
          .eq('id', record.id);
        results.push({ id: record.id, status: 'sent' });
      } else {
        const errText = await sgRes.text();
        console.error(`Failed to send to ${record.client_email}:`, errText);
        results.push({ id: record.id, status: 'failed', error: errText });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Abandoned booking follow-up error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
