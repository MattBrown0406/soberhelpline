import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Auto-registering recurring Zoom registrants...');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Calculate next Monday's date
    const now = new Date();
    const pstString = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    const pstNow = new Date(pstString);
    const day = pstNow.getDay();

    // From Tuesday (day=2), next Monday is in 6 days
    let daysUntilMonday: number;
    if (day === 0) daysUntilMonday = 1;
    else if (day === 1) daysUntilMonday = 7;
    else daysUntilMonday = 8 - day;

    const nextMonday = new Date(pstNow);
    nextMonday.setDate(pstNow.getDate() + daysUntilMonday);
    const yyyy = nextMonday.getFullYear();
    const mm = String(nextMonday.getMonth() + 1).padStart(2, '0');
    const dd = String(nextMonday.getDate()).padStart(2, '0');
    const meetingDate = `${yyyy}-${mm}-${dd}`;

    console.log('Target meeting date:', meetingDate);

    // Get all unique auto_register subscribers (latest registration per email)
    const { data: autoRegistrants, error: fetchError } = await supabase
      .from('zoom_meeting_registrations')
      .select('name, email, phone, user_id')
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

    // Check which emails are already registered for this meeting date
    const emails = uniqueRegistrants.map((r) => r.email.toLowerCase().trim());
    const { data: existingRegs } = await supabase
      .from('zoom_meeting_registrations')
      .select('email')
      .eq('meeting_date', meetingDate)
      .in('email', emails);

    const alreadyRegistered = new Set(
      (existingRegs || []).map((r) => r.email.toLowerCase().trim())
    );

    // Insert new registrations and send emails
    let registered = 0;

    for (const registrant of uniqueRegistrants) {
      const email = registrant.email.toLowerCase().trim();
      if (alreadyRegistered.has(email)) {
        console.log(`Skipping ${email} — already registered for ${meetingDate}`);
        continue;
      }

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
        })
        .select('id')
        .single();

      if (insertError) {
        console.error(`Failed to auto-register ${email}:`, insertError.message);
        continue;
      }

      registered++;
      console.log(`Auto-registered ${email} for ${meetingDate}`);

      // Send confirmation email via the existing edge function
      try {
        await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-zoom-registration-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            },
            body: JSON.stringify({
              name: registrant.name,
              email: email,
              registration_id: inserted?.id || null,
            }),
          }
        );
      } catch (emailErr) {
        console.error(`Email failed for ${email} (registration still saved):`, emailErr);
      }
    }

    console.log(`Auto-registration complete. Registered ${registered} new entries.`);

    return new Response(
      JSON.stringify({
        success: true,
        registered,
        meetingDate,
        totalSubscribers: uniqueRegistrants.length,
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
