import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { notifyMondayRegistration } from "../_shared/mondayNotification.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ensureDurableRegistration, isRegistrationDuplicate } from "../_shared/mondayRegistration.ts";
import { requireAutomationAuth } from "../_shared/automationAuth.ts";
import { activeMemberEmails, findDormantEmails, isLikelyMistypedEmail, normalizeEmail } from "../_shared/familySquaresActivity.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getNextMeetingDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit",
    day: "2-digit", hour: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const date = new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)));
  const day = date.getUTCDay();
  const days = day === 1 && Number(values.hour) < 20 ? 0 : (8 - day) % 7 || 7;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Registers and emails every auto-register subscriber: cron (cron_secret),
    // the automation secret or an admin only.
    const body = await req.json().catch(() => null);
    const denied = await requireAutomationAuth(req, supabase, body, 'auto-register-zoom', corsHeaders);
    if (denied) return denied;

    console.log('Auto-registering recurring Zoom registrants...');

    const meetingDate = getNextMeetingDate();

    console.log('Target meeting date:', meetingDate);

    // Get all unique auto_register subscribers (latest registration per email)
    const { data: autoRegistrants, error: fetchError } = await supabase
      .from('zoom_meeting_registrations')
      .select('name, email, phone, user_id, language')
      .eq('auto_register', true)
      .order('created_at', { ascending: false });

    if (fetchError) {
      throw new Error(`Failed to fetch auto-registrants: ${fetchError.message}`);
    }

    if (!autoRegistrants || autoRegistrants.length === 0) {
      console.log('No auto-register subscribers found.');
      return new Response(
        JSON.stringify({ success: true, registered: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Deduplicate by email (keep latest)
    const seen = new Set<string>();
    const uniqueRegistrants = autoRegistrants.filter((r) => {
      const key = r.email.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Skip addresses that can't deliver, and anyone (members aside) with no
    // attendance in DORMANT_WEEKS; re-engagement invites them monthly instead.
    const deliverable = uniqueRegistrants.filter((r) => !isLikelyMistypedEmail(r.email));
    const members = await activeMemberEmails(supabase);
    const dormant = members === null
      ? new Set<string>()
      : await findDormantEmails(supabase, deliverable.filter((r) => !members.has(normalizeEmail(r.email))), meetingDate, 'auto-register-zoom');
    const active = deliverable.filter((r) => !dormant.has(normalizeEmail(r.email)));
    console.log(`Skipping ${uniqueRegistrants.length - deliverable.length} mistyped and ${dormant.size} dormant auto-registrants.`);

    // Insert new registrations and send emails
    let registered = 0;
    let notificationFailures = 0;

    for (const registrant of active) {
      const email = registrant.email.toLowerCase().trim();
      // Insert new registration
      const { data: inserted, error: insertError } = await supabase
        .from('zoom_meeting_registrations')
        .insert({
          user_id: registrant.user_id || null,
          name: registrant.name,
          email: email,
          phone: registrant.phone || '',
          question: '',
          request_follow_up: false,
          consent_email_list: false,
          meeting_date: meetingDate,
          auto_register: true,
          registration_source: 'automatic',
          language: registrant.language || 'en',
        })
        .select('id')
        .single();

      if (isRegistrationDuplicate(insertError)) {
        await ensureDurableRegistration(supabase, email, registrant.name, meetingDate);
        continue;
      }
      if (insertError) {
        console.error(`Failed to auto-register ${email}:`, insertError.message);
        continue;
      }

      registered++;
      console.log(`Auto-registered ${email} for ${meetingDate}`);

      if (!await notifyMondayRegistration(inserted.id)) notificationFailures++;
    }

    console.log(`Auto-registration complete. Registered ${registered} new entries.`);

    return new Response(
      JSON.stringify({
        success: true,
        registered,
        notificationFailures,
        meetingDate,
        totalSubscribers: uniqueRegistrants.length,
        skippedMistyped: uniqueRegistrants.length - deliverable.length,
        skippedDormant: dormant.size,
        skipped: uniqueRegistrants.length - registered,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in auto-register-zoom:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
