import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Get Zoom OAuth token using server-to-server credentials
async function getZoomAccessToken(): Promise<string> {
  const accountId = Deno.env.get("ZOOM_ACCOUNT_ID")!;
  const clientId = Deno.env.get("ZOOM_CLIENT_ID")!;
  const clientSecret = Deno.env.get("ZOOM_CLIENT_SECRET")!;

  const credentials = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`, {
    method: "POST",
    headers: { "Authorization": `Basic ${credentials}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Zoom OAuth failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

// Fetch participants from Zoom Reports API for a past meeting
async function getZoomParticipants(meetingId: string, token: string): Promise<any[]> {
  const allParticipants: any[] = [];
  let nextPageToken = "";

  do {
    const url = `https://api.zoom.us/v2/report/meetings/${meetingId}/participants?page_size=300${nextPageToken ? `&next_page_token=${nextPageToken}` : ""}`;
    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      // 3001 = meeting not found/not ended yet — not an error
      if (res.status === 404 || errText.includes("3001")) {
        console.log("Meeting not found in reports (may not have ended yet)");
        return [];
      }
      throw new Error(`Zoom Reports API failed: ${res.status} ${errText}`);
    }

    const data = await res.json();
    allParticipants.push(...(data.participants || []));
    nextPageToken = data.next_page_token || "";
  } while (nextPageToken);

  return allParticipants;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get the meeting ID from site_settings
    const { data: settings } = await adminSupabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["monday_zoom_meeting_id"]);

    const meetingId = settings?.find((s: any) => s.key === "monday_zoom_meeting_id")?.value;
    if (!meetingId) {
      return new Response(JSON.stringify({ error: "No meeting ID configured" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine the meeting date (last Monday or today if Monday)
    let body: any = {};
    try { body = await req.json(); } catch {}
    
    let meetingDate: string;
    if (body.meeting_date) {
      meetingDate = body.meeting_date;
    } else {
      const now = new Date();
      const day = now.getDay();
      // If today is Monday, use today. Otherwise use last Monday.
      const daysBack = day === 1 ? 0 : day === 0 ? 6 : day - 1;
      const lastMonday = new Date(now);
      lastMonday.setDate(now.getDate() - daysBack);
      meetingDate = lastMonday.toISOString().split("T")[0];
    }

    console.log(`Syncing attendance for meeting ${meetingId} on ${meetingDate}`);

    // Get Zoom participants
    const token = await getZoomAccessToken();
    const participants = await getZoomParticipants(meetingId, token);

    if (participants.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No participants found (meeting may not have ended yet)", 
        synced: 0 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get registrations for this meeting date to cross-reference
    const { data: registrations } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("id, name, email, meeting_date")
      .eq("meeting_date", meetingDate);

    // Also get member emails for matching
    const { data: memberEmails } = await adminSupabase
      .from("profile_private")
      .select("user_id, email");

    // Build lookup maps
    const regByEmail = new Map<string, any>();
    const regByName = new Map<string, any>();
    for (const r of (registrations || [])) {
      regByEmail.set(r.email.toLowerCase(), r);
      regByName.set(r.name.toLowerCase().trim(), r);
    }

    // Check for existing attendance records to avoid duplicates
    const { data: existingAttendance } = await adminSupabase
      .from("zoom_attendance")
      .select("participant_name, participant_email, join_time")
      .eq("meeting_date", meetingDate);

    const existingSet = new Set(
      (existingAttendance || []).map((a: any) => 
        `${(a.participant_email || a.participant_name || "").toLowerCase()}|${a.join_time}`
      )
    );

    let synced = 0;
    let skipped = 0;
    const familySharing: { registrant: string; extra_participants: string[] }[] = [];

    // Track which registrations have been matched to detect sharing
    const matchedRegIds = new Map<string, string[]>(); // reg_id -> [participant names]

    for (const p of participants) {
      const pEmail = (p.user_email || p.email || "").toLowerCase();
      const pName = (p.name || "Unknown").trim();
      const joinTime = p.join_time || new Date().toISOString();

      // Skip if already synced
      const dedupeKey = `${pEmail || pName.toLowerCase()}|${joinTime}`;
      if (existingSet.has(dedupeKey)) {
        skipped++;
        continue;
      }

      // Try to match to a registration
      const matchedReg = regByEmail.get(pEmail) || regByName.get(pName.toLowerCase());
      const referralRegId: string | null = null;

      if (!matchedReg && pEmail) {
        // Check if this email matches any registration (could be a family member)
        // who joined via a shared link
        // We can't directly tell, but if we have click tracking data, we check later
      }

      const record: any = {
        meeting_date: meetingDate,
        zoom_meeting_id: meetingId,
        participant_name: pName,
        participant_email: pEmail || null,
        join_time: joinTime,
        leave_time: p.leave_time || null,
        duration_minutes: p.duration ? Math.round(p.duration / 60) : 0,
        registration_id: matchedReg?.id || null,
        referral_registration_id: referralRegId,
      };

      const { error } = await adminSupabase.from("zoom_attendance").insert(record);
      if (error) {
        console.error(`Failed to insert attendance for ${pName}:`, error);
      } else {
        synced++;
        if (matchedReg) {
          const existing = matchedRegIds.get(matchedReg.id) || [];
          existing.push(pName);
          matchedRegIds.set(matchedReg.id, existing);
        }
      }
    }

    // Detect family sharing: registrations where multiple people joined
    // This is detected by looking at click tracking - multiple clicks from same registration
    const { data: clickGroups } = await adminSupabase
      .from("zoom_link_clicks")
      .select("registration_id, registration_name, registration_email")
      .eq("meeting_date", meetingDate);

    // Count clicks per registration
    const clickCounts = new Map<string, { name: string; count: number }>();
    for (const c of (clickGroups || [])) {
      if (!c.registration_id) continue;
      const existing = clickCounts.get(c.registration_id);
      if (existing) {
        existing.count++;
      } else {
        clickCounts.set(c.registration_id, { name: c.registration_name, count: 1 });
      }
    }

    // Registrations with 2+ clicks suggest sharing
    for (const [regId, info] of clickCounts) {
      if (info.count >= 2) {
        familySharing.push({
          registrant: info.name,
          extra_participants: [`${info.count} total clicks from this registration link`],
        });
      }
    }

    // Build non-attendee list
    const attendedEmails = new Set(
      participants.map((p: any) => (p.user_email || p.email || "").toLowerCase()).filter(Boolean)
    );
    const attendedNames = new Set(
      participants.map((p: any) => (p.name || "").toLowerCase().trim()).filter(Boolean)
    );

    const noShows = (registrations || []).filter((r: any) => {
      return !attendedEmails.has(r.email.toLowerCase()) && 
             !attendedNames.has(r.name.toLowerCase().trim());
    });

    console.log(`Attendance sync complete: ${synced} synced, ${skipped} duplicates, ${noShows.length} no-shows, ${familySharing.length} potential shares`);

    return new Response(JSON.stringify({
      success: true,
      synced,
      skipped,
      total_participants: participants.length,
      total_registrants: (registrations || []).length,
      no_shows: noShows.map((r: any) => ({ name: r.name, email: r.email })),
      family_sharing: familySharing,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Zoom attendance sync error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
