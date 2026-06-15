import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getZoomAccessToken(): Promise<string> {
  const accountId = Deno.env.get("ZOOM_ACCOUNT_ID")!;
  const clientId = Deno.env.get("ZOOM_CLIENT_ID")!;
  const clientSecret = Deno.env.get("ZOOM_CLIENT_SECRET")!;
  const credentials = btoa(`${clientId}:${clientSecret}`);

  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    { method: "POST", headers: { Authorization: `Basic ${credentials}` } },
  );
  if (!res.ok) throw new Error(`Zoom OAuth failed: ${await res.text()}`);
  const data = await res.json();
  return data.access_token;
}

function todayAt7pmPST(): { startTime: string; dateStr: string } {
  const pstNow = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  const y = pstNow.getFullYear();
  const m = String(pstNow.getMonth() + 1).padStart(2, "0");
  const d = String(pstNow.getDate()).padStart(2, "0");
  return { startTime: `${y}-${m}-${d}T19:00:00`, dateStr: `${y}-${m}-${d}` };
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not configured");
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "matt@soberhelpline.com", name: "Matt - Sober Helpline" },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });
  if (!res.ok) {
    console.error(`SendGrid error for ${to}: ${await res.text()}`);
    return false;
  }
  return true;
}

function buildEmail(firstName: string, joinUrl: string, externalZoomLink: string, meetingId: string, passcode: string): string {
  return `
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#1f2937;">
  <h1 style="color:#1e3a5f;">Hi ${escapeHtml(firstName)},</h1>
  <p>There was a problem with the earlier Zoom link we sent for tonight's <strong>"The Family Squares"</strong> meeting. The earlier link has been cancelled.</p>
  <p><strong>Please use the new link below to join tonight at 7:00 PM PST.</strong></p>
  <div style="background-color:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
    <h2 style="margin:0 0 10px;color:#166534;">✅ Your New Meeting Link</h2>
    <a href="${escapeHtml(joinUrl)}" style="display:inline-block;padding:14px 28px;background-color:#2563eb;color:white;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">Join on SoberHelpline.com</a>
    <div style="margin-top:14px"><a href="${escapeHtml(externalZoomLink)}" style="display:inline-block;padding:12px 24px;background-color:#6b7280;color:white;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;">Join via Zoom App</a></div>
    <p style="font-size:12px;color:#6b7280;margin-top:10px;">Meeting ID: ${escapeHtml(meetingId)} &nbsp;|&nbsp; Passcode: ${escapeHtml(passcode)}</p>
  </div>
  <p>Sorry for the confusion — looking forward to seeing you tonight.</p>
  <p>Warmly,<br/><strong>Matt</strong><br/>Sober Helpline<br/>(541) 241-5886</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />
  <p style="color:#9ca3af;font-size:12px;text-align:center;">Sober Helpline — Supporting Families Through Recovery<br/><a href="https://soberhelpline.com" style="color:#9ca3af;">soberhelpline.com</a></p>
</div>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const accessToken = await getZoomAccessToken();

    // 1. Get current meeting id from site_settings
    const { data: settings } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["monday_zoom_meeting_id"]);
    const oldMeetingId = settings?.find((s: any) => s.key === "monday_zoom_meeting_id")?.value;

    // 2. Delete (cancel) the old meeting in Zoom
    if (oldMeetingId) {
      const delRes = await fetch(`https://api.zoom.us/v2/meetings/${oldMeetingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(`Deleted old meeting ${oldMeetingId}: ${delRes.status}`);
    }

    // 3. Create a new meeting for TODAY at 7pm PST
    const { startTime, dateStr } = todayAt7pmPST();
    const createRes = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: '"The Family Squares"',
        type: 2,
        start_time: startTime,
        duration: 60,
        timezone: "America/Los_Angeles",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: false,
          waiting_room: true,
          audio: "both",
          auto_recording: "cloud",
        },
      }),
    });
    if (!createRes.ok) throw new Error(`Zoom create failed: ${await createRes.text()}`);
    const meeting = await createRes.json();

    // 4. Update site_settings
    const updates = [
      { key: "monday_zoom_meeting_id", value: String(meeting.id) },
      { key: "monday_zoom_passcode", value: meeting.password || "" },
      { key: "monday_zoom_link", value: meeting.join_url || "" },
    ];
    for (const u of updates) {
      await supabase.from("site_settings")
        .update({ value: u.value, updated_at: new Date().toISOString() })
        .eq("key", u.key);
    }

    // 5. Build join URLs
    const meetingId = String(meeting.id);
    const passcode = meeting.password || "";
    const externalZoomLink = meeting.join_url || "";
    const joinUrl = `https://soberhelpline.com/join-meeting?mn=${encodeURIComponent(meetingId)}&pwd=${encodeURIComponent(passcode)}`;

    // 6. Pull tonight's registrants and filter blocked
    const { data: regs } = await supabase
      .from("zoom_meeting_registrations")
      .select("name, email")
      .eq("meeting_date", dateStr);

    const { data: blocklist } = await supabase
      .from("meeting_blocklist")
      .select("email, blocked_last_name");

    const blockedEmails = new Set(
      (blocklist || []).filter((b: any) => b.email).map((b: any) => b.email.toLowerCase()),
    );
    const blockedLastNames = new Set(
      (blocklist || []).filter((b: any) => b.blocked_last_name).map((b: any) => b.blocked_last_name.toLowerCase()),
    );

    const seen = new Set<string>();
    const sendResults: Record<string, boolean> = {};
    let blockedCount = 0;

    for (const r of regs || []) {
      const email = (r.email || "").toLowerCase().trim();
      if (!email || seen.has(email)) continue;
      seen.add(email);

      const name = (r.name || "").trim();
      const tokens = name.split(/\s+/).filter(Boolean);
      const lastName = tokens.length > 0 ? tokens[tokens.length - 1].toLowerCase() : "";

      if (blockedEmails.has(email) || (lastName && blockedLastNames.has(lastName))) {
        blockedCount++;
        continue;
      }

      const firstName = tokens[0] || "there";
      const html = buildEmail(firstName, joinUrl, externalZoomLink, meetingId, passcode);
      sendResults[email] = await sendEmail(
        r.email,
        "Important: New Zoom Link for Tonight's Family Squares Meeting",
        html,
      );
    }

    const sent = Object.values(sendResults).filter(Boolean).length;
    const failed = Object.values(sendResults).filter((v) => !v).length;

    return new Response(JSON.stringify({
      success: true,
      newMeetingId: meetingId,
      newJoinUrl: externalZoomLink,
      dateStr,
      stats: { totalRegistrants: regs?.length ?? 0, blockedSkipped: blockedCount, emailsSent: sent, emailsFailed: failed },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("replace-tonight-zoom-meeting error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
