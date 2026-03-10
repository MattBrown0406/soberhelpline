import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getZoomAccessToken(): Promise<string> {
  const accountId = Deno.env.get('ZOOM_ACCOUNT_ID');
  const clientId = Deno.env.get('ZOOM_CLIENT_ID');
  const clientSecret = Deno.env.get('ZOOM_CLIENT_SECRET');

  if (!accountId || !clientId || !clientSecret) {
    throw new Error('Zoom credentials not configured');
  }

  const credentials = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Zoom OAuth error:', errorText);
    throw new Error(`Failed to get Zoom access token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

function getNextMondayAt7pmPST(): string {
  // Calculate current time in PST/PDT (America/Los_Angeles)
  const now = new Date();
  const pstString = now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  const pstNow = new Date(pstString);
  
  const day = pstNow.getDay(); // 0=Sun, 1=Mon, ...
  
  // Always schedule for NEXT Monday (at least 1 day ahead, never today)
  let daysUntilMonday: number;
  if (day === 0) {
    daysUntilMonday = 1; // Sunday → tomorrow
  } else {
    // Mon(1)→7, Tue(2)→6, Wed(3)→5, Thu(4)→4, Fri(5)→3, Sat(6)→2
    daysUntilMonday = 8 - day;
  }
  
  const nextMonday = new Date(pstNow);
  nextMonday.setDate(pstNow.getDate() + daysUntilMonday);
  
  const year = nextMonday.getFullYear();
  const month = String(nextMonday.getMonth() + 1).padStart(2, '0');
  const date = String(nextMonday.getDate()).padStart(2, '0');
  
  // 7:00 PM PST — Zoom interprets this in the meeting timezone (America/Los_Angeles)
  return `${year}-${month}-${date}T19:00:00`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Auto-creating Monday night Zoom meeting...');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get Zoom access token
    const accessToken = await getZoomAccessToken();

    // Calculate meeting start time
    const startTime = getNextMondayAt7pmPST();
    console.log('Meeting start time:', startTime);

    // Create the meeting
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'Monday Night Family Support Meeting',
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration: 60,
        timezone: 'America/Los_Angeles',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: false,
          waiting_room: true,
          audio: 'both',
          auto_recording: 'none',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Zoom meeting creation error:', errorText);
      throw new Error(`Failed to create Zoom meeting: ${response.status}`);
    }

    const meeting = await response.json();
    console.log('Created Zoom meeting:', meeting.id, 'Join URL:', meeting.join_url);

    // Update site_settings with new meeting info
    const updates = [
      { key: 'monday_zoom_meeting_id', value: String(meeting.id) },
      { key: 'monday_zoom_passcode', value: meeting.password || '' },
      { key: 'monday_zoom_link', value: meeting.join_url || '' },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: update.value, updated_at: new Date().toISOString() })
        .eq('key', update.key);

      if (error) {
        console.error(`Error updating ${update.key}:`, error);
        throw new Error(`Failed to update ${update.key}: ${error.message}`);
      }
    }

    console.log('Successfully updated site_settings with new Zoom meeting info');

    return new Response(
      JSON.stringify({
        success: true,
        meetingId: meeting.id,
        joinUrl: meeting.join_url,
        startTime: meeting.start_time,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in auto-create-monday-zoom:', error);
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
