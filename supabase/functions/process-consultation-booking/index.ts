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

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[char] ?? char));
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error ?? 'Unknown error');
}

async function sendEmail(to: string, subject: string, htmlContent: string) {
  const apiKey = Deno.env.get('SENDGRID_API_KEY');
  if (!apiKey) throw new Error('SENDGRID_API_KEY not configured');

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'matt@soberhelpline.com', name: 'Sober Helpline' },
      reply_to: { email: 'matt@soberhelpline.com', name: 'Matt Brown' },
      subject,
      content: [{ type: 'text/html', value: htmlContent }],
    }),
  });
  if (!response.ok) {
    throw new Error(`SendGrid error ${response.status}: ${await response.text()}`);
  }
}

async function alertAdmin(adminClient: any, booking: any, provider: any, subject: string, details: string) {
  console.error(subject, details);
  try {
    await sendEmail('matt@soberhelpline.com', subject, `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937;">
        <h2 style="color: #b91c1c;">Sober Helpline booking needs attention</h2>
        <p>${escapeHtml(details)}</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p><strong>Booking ID:</strong> ${escapeHtml(booking.id)}</p>
          <p><strong>Client:</strong> ${escapeHtml(booking.client_name)} &lt;${escapeHtml(booking.client_email)}&gt;</p>
          <p><strong>Provider:</strong> ${escapeHtml(provider?.full_name)}</p>
          <p><strong>Date:</strong> ${escapeHtml(booking.booking_date)}</p>
          <p><strong>Time:</strong> ${escapeHtml(booking.start_time)} - ${escapeHtml(booking.end_time)} (${escapeHtml(booking.timezone || 'America/Los_Angeles')})</p>
          <p><strong>Current Zoom URL:</strong> ${escapeHtml(booking.zoom_meeting_url || 'missing')}</p>
        </div>
        <p>The recovery job will keep retrying future bookings, but check this manually if the appointment is soon.</p>
      </div>
    `);
  } catch (alertError) {
    console.error('Failed to send admin alert:', alertError);
  }

  try {
    await adminClient.from('consultation_bookings').update({
      notification_error_message: details.slice(0, 2000),
      last_notification_attempt_at: new Date().toISOString(),
    }).eq('id', booking.id);
  } catch (dbError) {
    console.error('Failed to persist admin alert details:', dbError);
  }
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

async function sendSessionFollowUpEmail(booking: any, plan: any, completedSessions: number, provider: any) {
  const remaining = plan.total_sessions - completedSessions;
  const planLabel = plan.plan_type === 'parallel-recovery' ? 'Parallel Recovery Program™' : 'Family Stabilization Plan™';
  const bookingUrl = 'https://soberhelpline.lovable.app/book-consultation?plan=' + (plan.plan_type === 'parallel-recovery' ? 'parallel' : 'stabilization');

  await sendEmail(booking.client_email, `Your Session is Complete — ${remaining} Session${remaining !== 1 ? 's' : ''} Remaining`, `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
      <div style="background: linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">We Hope You Got More Than Expected</h1>
      </div>
      <div style="padding: 30px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
        <p>Hi ${booking.client_name},</p>
        <p>Thank you for showing up today — that takes real courage. We hope your session with ${provider.full_name} gave you more clarity, more confidence, and more direction than you expected walking in.</p>
        
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #166534; margin: 0 0 8px; font-size: 18px;">📊 Your Progress</h2>
          <p style="margin: 4px 0;"><strong>Plan:</strong> ${planLabel}</p>
          <p style="margin: 4px 0;"><strong>Sessions Completed:</strong> ${completedSessions} of ${plan.total_sessions}</p>
          <p style="margin: 4px 0;"><strong>Sessions Remaining:</strong> ${remaining}</p>
        </div>

        <div style="background: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h2 style="color: #1e40af; margin: 0 0 12px; font-size: 18px;">📅 Book Your Next Session</h2>
          <p style="margin: 0 0 16px; color: #374151;">Keep your momentum going. The work you're doing matters — for you and for your family.</p>
          <a href="${bookingUrl}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Schedule Next Session</a>
        </div>

        <div style="background: #faf5ff; border: 1px solid #d8b4fe; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h2 style="color: #7e22ce; margin: 0 0 12px; font-size: 18px;">⭐ Share Your Experience</h2>
          <p style="margin: 0 0 16px; color: #374151;">Your story could encourage another family to take their first step. We'd love to hear how coaching is impacting your journey.</p>
          <a href="https://soberhelpline.lovable.app/testimonials" style="display: inline-block; padding: 12px 24px; background-color: #7e22ce; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Write a Testimonial</a>
        </div>

        <p style="color: #6b7280; font-size: 14px;">If you have any questions or need to discuss anything before your next session, call us at <strong>(541) 241-5886</strong>.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 15px;">Sober Helpline — Supporting Families Through Recovery</p>
      </div>
    </div>
  `);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    // Allow service role key auth (from book-consultation edge function) or user auth
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const token = authHeader.replace('Bearer ', '');
    const isServiceRole = token === serviceRoleKey;

    if (!isServiceRole) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

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
      // Skip payout for Matt Brown (owner) - it's his PayPal account
      if (provider.full_name === 'Matt Brown') {
        // Still update coaching plan progress if applicable
        if (booking.coaching_plan_id) {
          const { data: plan } = await adminClient
            .from('coaching_plans')
            .select('*')
            .eq('id', booking.coaching_plan_id)
            .single();

          if (plan) {
            const newCompleted = (plan.completed_sessions || 0) + 1;
            const newStatus = newCompleted >= plan.total_sessions ? 'completed' : 'active';
            await adminClient.from('coaching_plans').update({ completed_sessions: newCompleted, status: newStatus }).eq('id', plan.id);

            // Send follow-up email for multi-session plans with remaining sessions
            if (newCompleted < plan.total_sessions) {
              await sendSessionFollowUpEmail(booking, plan, newCompleted, provider);
            }
          }
        }
        return new Response(JSON.stringify({ success: true, skipped: true, reason: 'Owner provider - no payout needed' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      // Determine payout amount based on coaching plan
      let providerPayout = 125; // Default: $125 of the $150 emergency/single session fee

      if (booking.coaching_plan_id) {
        const { data: plan } = await adminClient
          .from('coaching_plans')
          .select('*')
          .eq('id', booking.coaching_plan_id)
          .single();

        if (plan) {
          providerPayout = Number(plan.provider_payout_per_session); // $100 for stabilization plan

          // Increment completed sessions
          const newCompleted = (plan.completed_sessions || 0) + 1;
          const newStatus = newCompleted >= plan.total_sessions ? 'completed' : 'active';

          await adminClient
            .from('coaching_plans')
            .update({
              completed_sessions: newCompleted,
              status: newStatus,
            })
            .eq('id', plan.id);

          // Send follow-up email for multi-session plans with remaining sessions
          if (newCompleted < plan.total_sessions) {
            await sendSessionFollowUpEmail(booking, plan, newCompleted, provider);
          }
        }
      }

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
        return new Response(JSON.stringify({ success: true, payoutId, amount: providerPayout }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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

    // DEFAULT ACTION: Create/reuse Zoom meeting and send notification emails.
    // Invariant: never mark the client/provider notified unless a real Zoom link exists
    // and that specific email send succeeded. If Zoom fails, return a retryable error
    // and leave the booking visible to the recovery job.
    const meetingDate = new Date(`${booking.booking_date}T${booking.start_time}`);
    const intakeResponses = (booking.intake_responses as Record<string, string> | null) || null;
    const serviceType = intakeResponses?.service_type;
    const isReadinessIntensive = serviceType === 'family-readiness-intensive';
    const meetingDuration = isReadinessIntensive ? 90 : provider.session_duration_minutes;
    const meetingLabel = isReadinessIntensive ? 'Family Readiness Intensive' : 'Consultation';
    const meetingTopic = `Sober Helpline ${meetingLabel} - ${booking.client_name} & ${provider.full_name}`;

    let zoomData: any = booking.zoom_meeting_url
      ? { join_url: booking.zoom_meeting_url, id: booking.zoom_meeting_id, password: booking.zoom_passcode }
      : null;

    if (!zoomData?.join_url) {
      try {
        const accessToken = await getZoomAccessToken();
        zoomData = await createZoomMeeting(accessToken, meetingTopic, meetingDate.toISOString(), meetingDuration);

        await adminClient.from('consultation_bookings').update({
          zoom_meeting_url: zoomData.join_url,
          zoom_meeting_id: String(zoomData.id),
          zoom_passcode: zoomData.password,
          zoom_status: 'created',
          zoom_error_message: null,
          zoom_last_attempt_at: new Date().toISOString(),
        }).eq('id', bookingId);
        booking.zoom_meeting_url = zoomData.join_url;
        booking.zoom_meeting_id = String(zoomData.id);
        booking.zoom_passcode = zoomData.password;
      } catch (err) {
        const message = errorMessage(err);
        console.error('Zoom meeting creation failed:', message);

        await adminClient.from('consultation_bookings').update({
          zoom_status: 'failed',
          zoom_error_message: message.slice(0, 2000),
          zoom_retry_count: (booking.zoom_retry_count || 0) + 1,
          zoom_last_attempt_at: new Date().toISOString(),
          client_notified: false,
          provider_notified: false,
        }).eq('id', bookingId);

        await alertAdmin(
          adminClient,
          booking,
          provider,
          `URGENT: Sober Helpline Zoom creation failed for ${booking.client_name}`,
          `Payment/booking exists, but Zoom meeting creation failed: ${message}. No client confirmation with a fake/missing Zoom link was sent.`
        );

        return new Response(JSON.stringify({
          success: false,
          retryable: true,
          error: 'Zoom meeting creation failed; no confirmation email was sent without a real Zoom link',
          details: message,
        }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    } else if (booking.zoom_status !== 'created') {
      await adminClient.from('consultation_bookings').update({
        zoom_status: 'created',
        zoom_error_message: null,
      }).eq('id', bookingId);
    }

    const formattedDate = meetingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const formattedTime = `${booking.start_time.slice(0, 5)} - ${booking.end_time.slice(0, 5)}`;
    const zoomLink = zoomData.join_url;
    const zoomPasscode = zoomData.password || '';

    // Build intake summary for provider email
    let intakeSummary = '';
    if (intakeResponses) {
      intakeSummary = Object.entries(intakeResponses)
        .filter(([q]) => q !== 'service_type')
        .map(([q, a]) => `<p><strong>${escapeHtml(q)}:</strong> ${escapeHtml(a)}</p>`)
        .join('');
    }

    // Determine plan context for emails
    let planContext = isReadinessIntensive ? '<p><strong>Service:</strong> Family Readiness Intensive</p>' : '';
    if (booking.coaching_plan_id) {
      const { data: plan } = await adminClient.from('coaching_plans').select('*').eq('id', booking.coaching_plan_id).single();
      if (plan) {
        const planLabel = plan.plan_type === 'parallel-recovery' ? 'Parallel Recovery Program™' : 'Family Stabilization Plan';
        planContext = `<p><strong>Plan:</strong> ${escapeHtml(planLabel)} (Session ${(plan.completed_sessions || 0) + 1} of ${plan.total_sessions})</p>`;
      }
    }

    let clientNotified = booking.client_notified === true;
    let providerNotified = booking.provider_notified === true;
    const notificationErrors: string[] = [];

    if (!clientNotified) {
      try {
        await sendEmail(booking.client_email, `Your ${meetingLabel} is Confirmed - Sober Helpline`, `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a365d;">Your ${escapeHtml(meetingLabel)} is Confirmed</h2>
            <p>Hi ${escapeHtml(booking.client_name)},</p>
            <p>Your ${escapeHtml(meetingLabel.toLowerCase())} has been booked successfully.</p>
            <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Provider:</strong> ${escapeHtml(provider.full_name)}</p>
              ${planContext}
              <p><strong>Date:</strong> ${escapeHtml(formattedDate)}</p>
              <p><strong>Time:</strong> ${escapeHtml(formattedTime)} (Pacific)</p>
              <p><strong>Duration:</strong> ${meetingDuration} minutes</p>
              <p><strong>Zoom Link:</strong> <a href="${escapeHtml(zoomLink)}">${escapeHtml(zoomLink)}</a></p>
              ${zoomPasscode ? `<p><strong>Passcode:</strong> ${escapeHtml(zoomPasscode)}</p>` : ''}
            </div>
            <p>Please join the Zoom meeting a few minutes early. If you need to reschedule, reply to this email or contact us at (458) 202-7900.</p>
            <p>— Sober Helpline Team</p>
          </div>
        `);
        clientNotified = true;
      } catch (err) {
        notificationErrors.push(`Client email failed: ${errorMessage(err)}`);
      }
    }

    // Email to provider
    const { data: providerPrivate } = await adminClient
      .from('profile_private')
      .select('email')
      .eq('user_id', provider.user_id)
      .single();

    const providerEmail = providerPrivate?.email || provider.notification_email || provider.paypal_email;

    if (providerEmail && !providerNotified) {
      try {
        await sendEmail(providerEmail, `New ${meetingLabel} Booked – ${formattedDate} - Sober Helpline`, `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a365d;">New ${escapeHtml(meetingLabel)} Booked</h2>
            <p>Hi ${escapeHtml(provider.full_name)},</p>
            <p>A new ${escapeHtml(meetingLabel.toLowerCase())} has been booked with you. Here are the details:</p>
            <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Client Name:</strong> ${escapeHtml(booking.client_name)}</p>
              ${planContext}
              <p><strong>Date:</strong> ${escapeHtml(formattedDate)}</p>
              <p><strong>Time:</strong> ${escapeHtml(formattedTime)} (Pacific)</p>
              <p><strong>Duration:</strong> ${meetingDuration} minutes</p>
              <p><strong>Zoom Link:</strong> <a href="${escapeHtml(zoomLink)}">${escapeHtml(zoomLink)}</a></p>
              ${zoomPasscode ? `<p><strong>Passcode:</strong> ${escapeHtml(zoomPasscode)}</p>` : ''}
            </div>
            <h3>Client Intake Responses</h3>
            ${intakeSummary || '<p>No intake responses provided.</p>'}
            <p style="margin-top: 16px;">Log in to your <a href="https://soberhelpline.com/consultation-provider-dashboard">Provider Dashboard</a> to manage your bookings.</p>
            <p>— Sober Helpline Team</p>
          </div>
        `);
        providerNotified = true;
      } catch (err) {
        notificationErrors.push(`Provider email failed: ${errorMessage(err)}`);
      }
    } else if (!providerEmail) {
      notificationErrors.push('Provider email missing; provider was not notified');
    }

    await adminClient.from('consultation_bookings').update({
      provider_notified: providerNotified,
      client_notified: clientNotified,
      notification_error_message: notificationErrors.length ? notificationErrors.join('\n').slice(0, 2000) : null,
      last_notification_attempt_at: new Date().toISOString(),
    }).eq('id', bookingId);

    if (notificationErrors.length) {
      await alertAdmin(
        adminClient,
        booking,
        provider,
        `URGENT: Sober Helpline booking email failed for ${booking.client_name}`,
        notificationErrors.join('\n')
      );
      return new Response(JSON.stringify({
        success: false,
        retryable: true,
        zoomUrl: zoomLink,
        clientNotified,
        providerNotified,
        errors: notificationErrors,
      }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Sync consultation to Notion CRM (async, don't block response)
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      const syncResponse = await fetch(`${supabaseUrl}/functions/v1/sync-consultation-to-notion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({ bookingId })
      });
      
      if (syncResponse.ok) {
        console.log('Successfully synced consultation to Notion CRM');
      } else {
        console.error('Failed to sync consultation to Notion:', await syncResponse.text());
      }
    } catch (syncError) {
      console.error('Error syncing consultation to Notion:', syncError);
    }

    // Add/update contact in Mailchimp with "Coaching Clients" tag
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      const mcResponse = await fetch(`${supabaseUrl}/functions/v1/add-to-mailchimp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({
          email: booking.client_email,
          firstName: booking.client_name?.split(' ')[0] || '',
          lastName: booking.client_name?.split(' ').slice(1).join(' ') || '',
          tags: ['Coaching Clients']
        })
      });

      if (mcResponse.ok) {
        console.log('Successfully added contact to Mailchimp');
      } else {
        console.error('Failed to add to Mailchimp:', await mcResponse.text());
      }
    } catch (mcError) {
      console.error('Error adding to Mailchimp:', mcError);
    }

    return new Response(JSON.stringify({
      success: true,
      zoomUrl: zoomLink,
      clientNotified,
      providerNotified,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error processing booking:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
