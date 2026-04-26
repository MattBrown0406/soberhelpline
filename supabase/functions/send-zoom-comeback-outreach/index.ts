import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const REGISTRATION_LINK = 'https://soberhelpline.com/monday-zoom-registration';
const MATT_EMAIL = 'matt@soberhelpline.com';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { dry_run = false } = await req.json().catch(() => ({}));
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the 3 most recent past meeting dates
    const { data: recentMeetings } = await supabase
      .from('zoom_meeting_registrations')
      .select('meeting_date')
      .lte('meeting_date', new Date().toISOString().split('T')[0])
      .order('meeting_date', { ascending: false })
      .limit(500);

    const uniqueDates = Array.from(new Set((recentMeetings ?? []).map((r: any) => r.meeting_date))).slice(0, 3);
    const oldestRecent = uniqueDates[uniqueDates.length - 1];

    // All past registrants (before the recent window)
    const { data: pastRegs } = await supabase
      .from('zoom_meeting_registrations')
      .select('name, email, meeting_date, created_at')
      .lt('meeting_date', oldestRecent)
      .order('created_at', { ascending: false });

    // Attendance in recent window
    const { data: recentRegs } = await supabase
      .from('zoom_meeting_registrations')
      .select('email, meeting_date')
      .in('meeting_date', uniqueDates);

    const attendCount = new Map<string, Set<string>>();
    for (const r of recentRegs ?? []) {
      const k = (r.email ?? '').toLowerCase().trim();
      if (!attendCount.has(k)) attendCount.set(k, new Set());
      attendCount.get(k)!.add(r.meeting_date);
    }

    // Dedup past by email, keep most recent name
    const seen = new Map<string, { name: string; email: string }>();
    for (const r of pastRegs ?? []) {
      const k = (r.email ?? '').toLowerCase().trim();
      if (!k || seen.has(k)) continue;
      seen.set(k, { name: r.name, email: r.email });
    }

    // Filter: missed 2 of 3 (i.e., attended <= 1) and not Grace Rogers
    const recipients = Array.from(seen.values()).filter((r) => {
      if (/grace\s+rogers/i.test(r.name || '')) return false;
      const cnt = attendCount.get(r.email.toLowerCase().trim())?.size ?? 0;
      return cnt <= 1;
    });

    if (dry_run) {
      return new Response(JSON.stringify({ recent_dates: uniqueDates, count: recipients.length, recipients }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let sent = 0, failed = 0;
    const errors: string[] = [];

    for (const r of recipients) {
      const firstName = (r.name || '').trim().split(/\s+/)[0] || 'there';
      const subject = `${firstName}, we'd love to have you back Monday nights`;
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #222;">
          <p>Hey ${firstName},</p>
          <p>I was thinking about you this week. I know you came to a few Monday night calls with us a while back, and I wanted to see how things are going.</p>
          <p>No pressure at all—life gets crazy. But if you're interested, we're meeting Mondays at 7:00 PM Pacific on Zoom. We've been focusing on boundaries and guilt and honestly, the conversations have been really grounded and real.</p>
          <p>If you want to jump back in, <a href="${REGISTRATION_LINK}">register here</a>. Or just reply if you want to talk about anything.</p>
          <p>All the best,<br/>Matt<br/>503-836-2136 (cell)</p>
        </div>
      `;

      const sg = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: r.email, name: r.name }],
            bcc: [{ email: MATT_EMAIL, name: 'Matt Brown' }],
          }],
          from: { email: 'matt@soberhelpline.com', name: 'Matt Brown | Sober Helpline' },
          reply_to: { email: 'matt@soberhelpline.com', name: 'Matt Brown' },
          subject,
          content: [{ type: 'text/html', value: htmlBody }],
        }),
      });

      if (sg.ok) {
        sent++;
      } else {
        failed++;
        errors.push(`${r.email}: ${sg.status} ${await sg.text()}`);
      }
      await new Promise((res) => setTimeout(res, 250));
    }

    return new Response(JSON.stringify({ recent_dates: uniqueDates, total: recipients.length, sent, failed, errors }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
