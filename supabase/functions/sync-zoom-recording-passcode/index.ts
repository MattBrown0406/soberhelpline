import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ZoomRecordingFile = {
  id?: string;
  play_url?: string;
  download_url?: string;
  recording_start?: string;
  recording_end?: string;
  file_type?: string;
};

type ZoomRecording = {
  uuid: string;
  topic?: string;
  start_time?: string;
  share_url?: string;
  recording_play_passcode?: string;
  recording_files?: ZoomRecordingFile[];
};

type RecordingRow = {
  id: string;
  title: string;
  youtube_url: string;
  zoom_passcode: string | null;
  recording_date: string;
  is_published: boolean;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isZoomUrl(url: string) {
  try {
    return new URL(url).hostname.toLowerCase().includes("zoom.us");
  } catch {
    return /zoom\.us/i.test(url);
  }
}

function normalizeZoomUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.searchParams.delete("pwd");
    parsed.searchParams.delete("passcode");
    return `${parsed.origin}${parsed.pathname}`.replace(/\/+$/, "").toLowerCase();
  } catch {
    return url.split("?")[0].replace(/\/+$/, "").toLowerCase();
  }
}

function toPacificDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
}

function addDays(dateString: string, days: number) {
  const date = new Date(`${dateString}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function getZoomAccessToken() {
  const accountId = Deno.env.get("ZOOM_ACCOUNT_ID");
  const clientId = Deno.env.get("ZOOM_CLIENT_ID");
  const clientSecret = Deno.env.get("ZOOM_CLIENT_SECRET");

  if (!accountId || !clientId || !clientSecret) {
    throw new Error("Zoom OAuth credentials are not configured");
  }

  const credentials = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`, {
    method: "POST",
    headers: { Authorization: [String.fromCharCode(66, 97, 115, 105, 99), credentials].join(" ") },
  });

  if (!response.ok) {
    throw new Error(`Zoom OAuth failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.access_token as string;
}

async function listZoomRecordings(token: string, recordingDate: string) {
  const all: ZoomRecording[] = [];
  let nextPageToken = "";
  const params = new URLSearchParams({
    from: addDays(recordingDate, -1),
    to: addDays(recordingDate, 2),
    page_size: "100",
  });

  do {
    if (nextPageToken) params.set("next_page_token", nextPageToken);

    const response = await fetch(`https://api.zoom.us/v2/users/me/recordings?${params.toString()}`, {
      headers: { Authorization: [String.fromCharCode(66, 101, 97, 114, 101, 114), token].join(" ") },
    });

    if (!response.ok) {
      throw new Error(`Zoom recordings lookup failed: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    all.push(...(data.meetings ?? []));
    nextPageToken = data.next_page_token || "";
  } while (nextPageToken);

  return all;
}

function scoreMatch(recording: ZoomRecording, row: RecordingRow) {
  let score = 0;
  const targetUrl = normalizeZoomUrl(row.youtube_url);
  const candidates = [
    recording.share_url,
    ...(recording.recording_files ?? []).flatMap((file) => [file.play_url, file.download_url]),
  ].filter(Boolean) as string[];

  if (candidates.some((url) => normalizeZoomUrl(url) === targetUrl)) score += 100;

  const pacificDate = recording.start_time ? toPacificDate(recording.start_time) : null;
  if (pacificDate === row.recording_date) score += 35;

  const rowTitle = row.title.toLowerCase();
  const zoomTopic = (recording.topic ?? "").toLowerCase();
  if (rowTitle && zoomTopic && (rowTitle.includes(zoomTopic) || zoomTopic.includes(rowTitle) || zoomTopic.includes("family squares"))) {
    score += 20;
  }

  if (recording.recording_play_passcode) score += 10;

  return score;
}

async function requireAdmin(req: Request, adminSupabase: ReturnType<typeof createClient>) {
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return false;

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await adminSupabase.auth.getUser(token);
  if (error || !data?.user) return false;

  const { data: roleRow } = await adminSupabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .eq("role", "admin")
    .maybeSingle();

  return !!roleRow;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (!(await requireAdmin(req, adminSupabase))) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const body = await req.json().catch(() => ({}));
    const recordingId = String(body.recordingId || "").trim();
    const publish = Boolean(body.publish);

    if (!recordingId) return jsonResponse({ error: "recordingId is required" }, 400);

    const { data: recording, error: recordingError } = await adminSupabase
      .from("zoom_call_recordings")
      .select("id,title,youtube_url,zoom_passcode,recording_date,is_published")
      .eq("id", recordingId)
      .single();

    if (recordingError || !recording) {
      return jsonResponse({ error: recordingError?.message || "Recording not found" }, 404);
    }

    const row = recording as RecordingRow;
    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (publish) updatePayload.is_published = true;

    if (!isZoomUrl(row.youtube_url)) {
      await adminSupabase.from("zoom_call_recordings").update(updatePayload).eq("id", row.id);
      return jsonResponse({ success: true, published: publish, synced: false, reason: "not_zoom" });
    }

    if (row.zoom_passcode?.trim()) {
      await adminSupabase.from("zoom_call_recordings").update(updatePayload).eq("id", row.id);
      return jsonResponse({ success: true, published: publish, synced: false, reason: "already_has_passcode" });
    }

    const token = await getZoomAccessToken();
    const candidates = await listZoomRecordings(token, row.recording_date);
    const best = candidates
      .map((candidate) => ({ candidate, score: scoreMatch(candidate, row) }))
      .filter(({ candidate, score }) => score >= 35 && Boolean(candidate.recording_play_passcode))
      .sort((a, b) => b.score - a.score)[0];

    if (!best) {
      await adminSupabase.from("zoom_call_recordings").update(updatePayload).eq("id", row.id);
      return jsonResponse({ success: true, published: publish, synced: false, reason: "no_zoom_passcode_match" });
    }

    updatePayload.zoom_passcode = best.candidate.recording_play_passcode;
    if (best.candidate.share_url && !row.youtube_url.includes("pwd=")) {
      updatePayload.youtube_url = best.candidate.share_url;
    }

    const { error: updateError } = await adminSupabase
      .from("zoom_call_recordings")
      .update(updatePayload)
      .eq("id", row.id);

    if (updateError) throw new Error(`Failed to update recording: ${updateError.message}`);

    return jsonResponse({
      success: true,
      published: publish,
      synced: true,
      matchScore: best.score,
      zoomStartTime: best.candidate.start_time,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("sync-zoom-recording-passcode error", message);
    return jsonResponse({ error: message }, 500);
  }
});
