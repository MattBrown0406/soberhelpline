// SETUP REQUIRED:
// 1. In Supabase Dashboard → Edge Functions → zoom-webhook → Secrets, add:
//    ZOOM_WEBHOOK_SECRET_TOKEN = (get from Zoom Marketplace → your app → Feature → Event Subscriptions → Secret Token)
//
// 2. In Zoom Marketplace → your app → Feature → Event Subscriptions, add a new subscription:
//    Endpoint URL: https://<your-project>.supabase.co/functions/v1/zoom-webhook
//    Events to subscribe:
//      - meeting.participant_joined
//      - meeting.participant_left
//      - meeting.ended
//      - recording.completed
//
// 3. Zoom will send a validation request to your endpoint — the function handles this automatically.
//
// POST-MEETING THREAD SETUP:
// 1. In Supabase Dashboard → Auth → Users, find the admin account UUID
// 2. In Supabase Dashboard → Edge Functions → zoom-webhook → Secrets, add:
//    FORUM_BOT_USER_ID = <admin user UUID>
// 3. The thread auto-creates when meeting.ended fires via the Zoom webhook
// 4. It pins itself in the "Share Your Story" forum category for 7 days
// 5. To update the Google Review link, edit the content string in this file

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyZoomWebhook(req: Request, body: string): Promise<boolean> {
  const signature = req.headers.get('x-zm-signature') ?? '';
  const timestamp = req.headers.get('x-zm-request-timestamp') ?? '';
  const secret = Deno.env.get('ZOOM_WEBHOOK_SECRET_TOKEN');

  if (!secret) {
    console.error('ZOOM_WEBHOOK_SECRET_TOKEN not set');
    return false;
  }

  const message = `v0:${timestamp}:${body}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const hashBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  const expectedSig = 'v0=' + Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  return signature === expectedSig;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const body = await req.text();
  const event = JSON.parse(body);

  // Zoom endpoint validation handshake
  if (event.event === 'endpoint.url_validation') {
    const secret = Deno.env.get('ZOOM_WEBHOOK_SECRET_TOKEN') ?? '';
    const hashForValidate = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const hashBuffer = await crypto.subtle.sign(
      'HMAC', hashForValidate,
      new TextEncoder().encode(event.payload.plainToken)
    );
    const encryptedToken = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    return new Response(JSON.stringify({
      plainToken: event.payload.plainToken,
      encryptedToken,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // Verify all other events
  const isValid = await verifyZoomWebhook(req, body);
  if (!isValid) {
    console.error('Invalid Zoom webhook signature');
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  console.log('Zoom webhook received:', event.event);

  // --- Participant joined ---
  if (event.event === 'meeting.participant_joined') {
    const p = event.payload.object.participant;
    const meetingId = String(event.payload.object.id);
    await supabase.from('zoom_attendance').upsert({
      zoom_meeting_id: meetingId,
      participant_name: p.user_name,
      participant_email: p.email || null,
      join_time: p.join_time,
      duration_minutes: 0,
      meeting_date: new Date(p.join_time).toISOString().split('T')[0],
    }, { onConflict: 'zoom_meeting_id,participant_name,join_time', ignoreDuplicates: true });
    console.log(`Participant joined: ${p.user_name}`);
  }

  // --- Participant left ---
  if (event.event === 'meeting.participant_left') {
    const p = event.payload.object.participant;
    const meetingId = String(event.payload.object.id);
    await supabase.from('zoom_attendance')
      .update({
        leave_time: p.leave_time,
        duration_minutes: p.duration ? Math.round(p.duration / 60) : 0,
      })
      .match({ zoom_meeting_id: meetingId, participant_name: p.user_name });
    console.log(`Participant left: ${p.user_name}, duration: ${p.duration}s`);
  }

  // --- Meeting ended → create post-meeting forum thread ---
  if (event.event === 'meeting.ended') {
    const meetingId = String(event.payload.object.id);
    const meetingTopic = event.payload.object.topic ?? 'The Family Squares';
    const endTime = event.payload.object.end_time ?? new Date().toISOString();
    console.log(`Meeting ended: ${meetingId}`);

    const botUserId = Deno.env.get('FORUM_BOT_USER_ID');
    // Only the Monday Family Squares meeting gets a forum thread, never a
    // private consultation or any other meeting on the account.
    const isFamilySquares = /family squares/i.test(String(meetingTopic));
    if (!isFamilySquares) {
      console.log('Ended meeting is not Family Squares — no forum thread');
    } else if (!botUserId) {
      console.warn('FORUM_BOT_USER_ID not set — skipping forum thread creation');
    } else {
      // Unpin old post-meeting threads (older than 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      await supabase
        .from('forum_posts')
        .update({ is_pinned: false })
        .eq('topic_id', 'this-weeks-meeting')
        .eq('user_id', botUserId) // only this function's own threads, never one the host pinned
        .eq('is_pinned', true)
        .lt('created_at', sevenDaysAgo.toISOString());

      // Format meeting date for display e.g. "Monday, July 14"
      const meetingDate = new Date(endTime);
      const formattedDate = meetingDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Los_Angeles',
      });

      // Check if a thread for this meeting date already exists to avoid duplicates
      const dateKey = meetingDate.toISOString().split('T')[0];
      const { data: existing } = await supabase
        .from('forum_posts')
        .select('id')
        .eq('topic_id', 'this-weeks-meeting')
        .eq('user_id', botUserId)
        .eq('is_pinned', true)
        .gte('created_at', `${dateKey}T00:00:00.000Z`)
        .limit(1);

      if (existing && existing.length > 0) {
        console.log('Post-meeting thread already exists for today — skipping');
      } else {
        const title = `🟢 The Family Squares — ${formattedDate} — Share Your Takeaways`;

        const content = `Tonight's meeting just wrapped up. Thank you to everyone who showed up — whether you were on camera, listening quietly, or joined late, your presence matters.

Use this thread to share anything that resonated, a question you're still sitting with, or something you want to hold onto this week.

---

**A few prompts to get you started:**

💡 What's one thing from tonight you want to hold onto this week?

🤔 Was there a moment during the meeting where you thought "that's exactly my situation"?

🛠️ Is there something you heard tonight that you want to try differently with your family?

🙋 Couldn't make it tonight? Drop in anyway — what's on your mind this week?

---

*Posting anonymously is always an option — click the toggle when you reply.*

---

*Have a question for next Monday? Start a new conversation in This Week's Meeting and we'll do our best to answer it live.*`;

        const { error: postError } = await supabase
          .from('forum_posts')
          .insert({
            title,
            content,
            topic_id: 'this-weeks-meeting',
            user_id: botUserId,
            is_pinned: true,
            is_anonymous: false,
            needs_support: false,
          });

        if (postError) {
          console.error('Failed to create post-meeting forum thread:', postError);
        } else {
          console.log(`Post-meeting forum thread created for ${formattedDate}`);
        }
      }
    }
  }

  // --- Cloud recording completed → auto-insert to zoom_call_recordings ---
  if (event.event === 'recording.completed') {
    const rec = event.payload.object;
    const recordingDate = new Date(rec.start_time).toISOString().split('T')[0];
    const durationMinutes = rec.duration ?? null;

    const { data: existing } = await supabase
      .from('zoom_call_recordings')
      .select('id')
      .eq('recording_date', recordingDate)
      .maybeSingle();

    if (!existing) {
      const shareUrl = rec.share_url ?? '';
      const { error } = await supabase.from('zoom_call_recordings').insert({
        title: rec.topic ?? 'The Family Squares',
        recording_date: recordingDate,
        duration_minutes: durationMinutes,
        youtube_url: shareUrl,
        is_published: false,
        description: `Recorded automatically on ${recordingDate}. Duration: ${durationMinutes} minutes.`,
      });

      if (error) {
        console.error('Failed to insert recording:', error);
      } else {
        console.log(`Recording saved for ${recordingDate} — pending admin review before publishing`);
      }
    } else {
      console.log(`Recording for ${recordingDate} already exists, skipping`);
    }
  }

  return new Response('OK', { status: 200, headers: corsHeaders });
});
