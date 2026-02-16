import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function getZoomAccessToken(): Promise<string> {
  const accountId = Deno.env.get('ZOOM_ACCOUNT_ID');
  const clientId = Deno.env.get('ZOOM_CLIENT_ID');
  const clientSecret = Deno.env.get('ZOOM_CLIENT_SECRET');
  if (!accountId || !clientId || !clientSecret) throw new Error('Zoom credentials not configured');

  const credentials = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    { method: 'POST', headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  if (!response.ok) throw new Error(`Zoom OAuth failed: ${response.status}`);
  const data = await response.json();
  return data.access_token;
}

async function createZoomMeeting(accessToken: string, topic: string, startTime: string, duration: number) {
  const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic, type: 2, start_time: startTime, duration,
      timezone: 'America/Los_Angeles',
      settings: { host_video: true, participant_video: true, join_before_host: false, waiting_room: true, audio: 'both' },
    }),
  });
  if (!response.ok) throw new Error(`Zoom meeting creation failed: ${response.status}`);
  return await response.json();
}

async function sendEmail(to: string, subject: string, htmlContent: string) {
  const apiKey = Deno.env.get('SENDGRID_API_KEY');
  if (!apiKey) { console.error('SENDGRID_API_KEY not configured'); return; }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'matt@soberhelpline.com', name: 'Sober Helpline' },
      subject,
      content: [{ type: 'text/html', value: htmlContent }],
    }),
  });
  if (!response.ok) console.error('SendGrid error:', await response.text());
}

async function processPayPalPayout(paypalEmail: string, amount: number, bookingId: string) {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const secretKey = Deno.env.get('PAYPAL_SECRET_KEY');
  if (!clientId || !secretKey) { console.error('PayPal credentials not configured'); return null; }

  // Get access token
  const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${btoa(`${clientId}:${secretKey}`)}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!tokenRes.ok) throw new Error('PayPal auth failed');
  const { access_token } = await tokenRes.json();

  // Create payout
  const payoutRes = await fetch('https://api-m.paypal.com/v1/payments/payouts', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: `booking_${bookingId}_${Date.now()}`,
        email_subject: 'Sober Helpline - Consultation Payment',
        email_message: 'You have received a payment for a completed consultation session.',
      },
      items: [{
        recipient_type: 'EMAIL',
        amount: { value: amount.toFixed(2), currency: 'USD' },
        receiver: paypalEmail,
        note: `Payment for consultation booking ${bookingId}`,
      }],
    }),
  });

  if (!payoutRes.ok) {
    const errText = await payoutRes.text();
    console.error('PayPal payout error:', errText);
    throw new Error('PayPal payout failed');
  }

  const payoutData = await payoutRes.json();
  return payoutData.batch_header?.payout_batch_id;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { bookingId, action } = await req.json();

    // Use service role for admin operations
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch booking with provider info
    const { data: booking, error: bookingError } = await adminClient
      .from('consultation_bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: provider } = await adminClient
      .from('consultation_providers')
      .select('*')
      .eq('id', booking.provider_id)
      .single();

    if (!provider) {
      return new Response(JSON.stringify({ error: 'Provider not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ACTION: Process payout (called when session is marked complete)
    if (action === 'payout') {
      const providerPayout = 125; // Provider receives $125 of the $150 session fee
      try {
        const payoutId = await processPayPalPayout(provider.paypal_email, providerPayout, bookingId);
        await adminClient.from('consultation_payouts').insert({
          booking_id: bookingId,
          provider_id: provider.id,
          amount: providerPayout,
          paypal_payout_id: payoutId,
          status: payoutId ? 'completed' : 'failed',
          processed_at: new Date().toISOString(),
        });
        return new Response(JSON.stringify({ success: true, payoutId }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (err) {
        await adminClient.from('consultation_payouts').insert({
          booking_id: bookingId,
          provider_id: provider.id,
          amount: providerPayout,
          status: 'failed',
          error_message: err instanceof Error ? err.message : 'Unknown error',
        });
        return new Response(JSON.stringify({ error: 'Payout failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // DEFAULT ACTION: Create Zoom meeting and send notification emails
    const meetingDate = new Date(`${booking.booking_date}T${booking.start_time}`);
    const meetingTopic = `Sober Helpline Consultation - ${booking.client_name} & ${provider.full_name}`;

    let zoomData: any = null;
    try {
      const accessToken = await getZoomAccessToken();
      zoomData = await createZoomMeeting(accessToken, meetingTopic, meetingDate.toISOString(), provider.session_duration_minutes);

      await adminClient.from('consultation_bookings').update({
        zoom_meeting_url: zoomData.join_url,
        zoom_meeting_id: String(zoomData.id),
        zoom_passcode: zoomData.password,
      }).eq('id', bookingId);
    } catch (err) {
      console.error('Zoom meeting creation failed:', err);
    }

    const formattedDate = meetingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const formattedTime = `${booking.start_time.slice(0, 5)} - ${booking.end_time.slice(0, 5)}`;
    const zoomLink = zoomData?.join_url || 'Link will be provided shortly';
    const zoomPasscode = zoomData?.password || '';

    // Build intake summary for provider email
    let intakeSummary = '';
    if (booking.intake_responses) {
      const responses = booking.intake_responses as Record<string, string>;
      intakeSummary = Object.entries(responses).map(([q, a]) => `<p><strong>${q}:</strong> ${a}</p>`).join('');
    }

    // Email to client
    await sendEmail(booking.client_email, 'Your Consultation is Confirmed - Sober Helpline', `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">Your Consultation is Confirmed</h2>
        <p>Hi ${booking.client_name},</p>
        <p>Your consultation has been booked successfully.</p>
        <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Provider:</strong> ${provider.full_name}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime} (Pacific)</p>
          <p><strong>Duration:</strong> ${provider.session_duration_minutes} minutes</p>
          <p><strong>Zoom Link:</strong> <a href="${zoomLink}">${zoomLink}</a></p>
          ${zoomPasscode ? `<p><strong>Passcode:</strong> ${zoomPasscode}</p>` : ''}
        </div>
        <p>Please join the Zoom meeting a few minutes early. If you need to reschedule, please contact us at (541) 241-5886.</p>
        <p>— Sober Helpline Team</p>
      </div>
    `);

    // Email to provider
    const { data: providerPrivate } = await adminClient
      .from('profile_private')
      .select('email')
      .eq('user_id', provider.user_id)
      .single();

    const providerEmail = providerPrivate?.email || provider.paypal_email;

    if (providerEmail) {
      await sendEmail(providerEmail, `New Session Booked – ${formattedDate} - Sober Helpline`, `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">New Consultation Session Booked</h2>
          <p>Hi ${provider.full_name},</p>
          <p>A new consultation session has been booked with you. Here are the details:</p>
          <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Client Name:</strong> ${booking.client_name}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime} (Pacific)</p>
            <p><strong>Duration:</strong> ${provider.session_duration_minutes} minutes</p>
            <p><strong>Zoom Link:</strong> <a href="${zoomLink}">${zoomLink}</a></p>
            ${zoomPasscode ? `<p><strong>Passcode:</strong> ${zoomPasscode}</p>` : ''}
          </div>
          <h3>Client Intake Responses</h3>
          ${intakeSummary || '<p>No intake responses provided.</p>'}
          <p style="margin-top: 16px;">Log in to your <a href="https://soberhelpline.lovable.app/consultation-provider-dashboard">Provider Dashboard</a> to manage your bookings.</p>
          <p>— Sober Helpline Team</p>
        </div>
      `);
    }

    await adminClient.from('consultation_bookings').update({
      provider_notified: true,
      client_notified: true,
    }).eq('id', bookingId);

    return new Response(JSON.stringify({ success: true, zoomUrl: zoomData?.join_url }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error processing booking:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
