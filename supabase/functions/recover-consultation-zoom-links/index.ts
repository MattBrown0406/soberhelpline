import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function todayPacificDate(): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const authHeader = req.headers.get('Authorization') ?? '';

  const adminClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    serviceKey
  );

  // Accept: service-role key in Authorization header (admin/edge-fn calls)
  // OR a cron_secret in the request body (pg_cron call, validated against site_settings)
  let authorized = serviceKey !== '' && authHeader === `Bearer ${serviceKey}`;

  let limit = 25;
  let cronSecret: string | undefined;
  try {
    const body = await req.json();
    if (Number.isFinite(Number(body?.limit))) {
      limit = Math.min(Math.max(Number(body.limit), 1), 50);
    }
    cronSecret = body?.cron_secret;
  } catch {
    // no body is fine
  }

  if (!authorized && cronSecret) {
    const { data: setting } = await adminClient
      .from('site_settings')
      .select('value')
      .eq('key', 'cron_secret')
      .maybeSingle();
    authorized = setting?.value != null && setting.value === cronSecret;
  }

  if (!authorized) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {

    const today = todayPacificDate();

    const { data: bookings, error } = await adminClient
      .from('consultation_bookings')
      .select('id, booking_date, start_time, client_name, client_email, zoom_meeting_url, zoom_status, zoom_retry_count, client_notified, provider_notified')
      .eq('status', 'confirmed')
      .gte('booking_date', today)
      .or('zoom_meeting_url.is.null,zoom_status.eq.failed,client_notified.eq.false,provider_notified.eq.false')
      .lt('zoom_retry_count', 5)
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(limit);

    if (error) throw error;

    const results: any[] = [];
    const processUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/process-consultation-booking`;

    for (const booking of bookings || []) {
      try {
        const response = await fetch(processUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookingId: booking.id, action: 'recover_zoom' }),
        });
        const text = await response.text();
        let payload: any = null;
        try { payload = text ? JSON.parse(text) : null; } catch { payload = { raw: text }; }

        results.push({
          bookingId: booking.id,
          ok: response.ok,
          status: response.status,
          payload,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('Recovery attempt failed:', booking.id, message);
        results.push({ bookingId: booking.id, ok: false, error: message });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      checked: bookings?.length || 0,
      recovered: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('recover-consultation-zoom-links error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
