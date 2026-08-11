// Server-to-server export of Family Squares data for the external
// Readiness Radar / Next-Step Engine. REVIEW ONLY: this endpoint reads data
// and writes a PII-free audit row. It never sends email/SMS, never enqueues
// family_squares_followup_queue rows, and never mutates registration scoring.
import { createClient } from "npm:@supabase/supabase-js@2";

const MAX_ROWS = 5000;
const DEFAULT_LOOKBACK_DAYS = 180;

// Deliberately NOT permissive CORS: this is not a browser endpoint.
const baseHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: baseHeaders });

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) {
    // Still burn a comparison to avoid trivial length-only timing signal.
    let acc = 1;
    for (let i = 0; i < ab.length; i++) acc |= ab[i] ^ (bb[i % (bb.length || 1)] ?? 0);
    return false;
  }
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function fingerprint(secretPresent: boolean, ip: string | null): Promise<string | null> {
  if (!ip) return null;
  const data = new TextEncoder().encode(`${secretPresent ? "a" : "u"}:${ip}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { Allow: "POST, OPTIONS", "Cache-Control": "no-store" },
    });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const expected = Deno.env.get("READINESS_RADAR_AUTOMATION_SECRET");
  const provided = req.headers.get("x-automation-secret") ?? "";
  if (!expected || !provided || !timingSafeEqual(provided, expected)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const callerFingerprint = await fingerprint(
    true,
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
  );

  let requestId: string = crypto.randomUUID();
  let lookbackDays = DEFAULT_LOOKBACK_DAYS;

  const audit = async (
    status: "success" | "rejected" | "error",
    counts: { registrations: number; attendance: number; checkins: number },
    errorCode: string | null,
  ) => {
    const { error } = await supabase.from("readiness_radar_export_audit").insert({
      request_id: requestId,
      lookback_days: lookbackDays,
      registration_count: counts.registrations,
      attendance_count: counts.attendance,
      checkin_count: counts.checkins,
      response_status: status,
      caller_fingerprint: callerFingerprint,
      error_code: errorCode,
    });
    return error;
  };

  const zero = { registrations: 0, attendance: 0, checkins: 0 };

  try {
    let body: Record<string, unknown> = {};
    const raw = await req.text();
    if (raw.trim().length > 0) {
      try {
        body = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        await audit("rejected", zero, "invalid_json");
        return json({ error: "Invalid request" }, 400);
      }
    }

    if (body.request_id !== undefined) {
      if (typeof body.request_id !== "string" || !UUID_RE.test(body.request_id)) {
        await audit("rejected", zero, "invalid_request_id");
        return json({ error: "Invalid request" }, 400);
      }
      requestId = body.request_id;
    }

    if (body.lookback_days !== undefined) {
      const n = body.lookback_days;
      if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > 180) {
        await audit("rejected", zero, "invalid_lookback_days");
        return json({ error: "lookback_days must be an integer between 1 and 180" }, 400);
      }
      lookbackDays = n;
    }

    // Idempotency: a request_id already recorded is not processed twice.
    const { data: existingAudit, error: existingError } = await supabase
      .from("readiness_radar_export_audit")
      .select("request_id, response_status, requested_at")
      .eq("request_id", requestId)
      .maybeSingle();
    if (existingError) throw new Error("audit_lookup_failed");
    if (existingAudit) {
      return json(
        { error: "Request already processed", request_id: requestId },
        409,
      );
    }

    const since = new Date(Date.now() - lookbackDays * 86400000).toISOString();
    const sinceDate = since.slice(0, 10);

    const [regRes, attRes] = await Promise.all([
      supabase
        .from("zoom_meeting_registrations")
        .select(
          "id, name, email, phone, question, request_follow_up, auto_register, meeting_date, created_at, consent_email_list",
        )
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(MAX_ROWS + 1),
      supabase
        .from("zoom_attendance")
        .select(
          "registration_id, participant_email, participant_name, meeting_date, duration_minutes, join_time",
        )
        .gte("meeting_date", sinceDate)
        .order("join_time", { ascending: false, nullsFirst: false })
        .limit(MAX_ROWS + 1),
    ]);

    if (regRes.error || attRes.error) throw new Error("source_query_failed");

    const registrations = regRes.data ?? [];
    const attendance = attRes.data ?? [];

    if (registrations.length > MAX_ROWS || attendance.length > MAX_ROWS) {
      await audit("rejected", zero, "result_too_large");
      return json(
        {
          error: "Result set too large; reduce lookback_days",
          max_rows_per_collection: MAX_ROWS,
        },
        413,
      );
    }

    const regIds = registrations.map((r) => r.id as string);
    let checkins: Array<Record<string, unknown>> = [];
    if (regIds.length > 0) {
      const { data, error } = await supabase
        .from("family_squares_weekly_checkins")
        .select(
          "registration_id, changed_this_week, decision_facing, biggest_disagreement, immediate_safety_concern, desired_help, submitted_at",
        )
        .in("registration_id", regIds)
        .order("submitted_at", { ascending: false })
        .limit(MAX_ROWS + 1);
      if (error) throw new Error("checkin_query_failed");
      checkins = data ?? [];
      if (checkins.length > MAX_ROWS) {
        await audit("rejected", zero, "result_too_large");
        return json(
          {
            error: "Result set too large; reduce lookback_days",
            max_rows_per_collection: MAX_ROWS,
          },
          413,
        );
      }
    }

    const counts = {
      registrations: registrations.length,
      attendance: attendance.length,
      checkins: checkins.length,
    };

    const auditError = await audit("success", counts, null);
    if (auditError) {
      // Unique violation => concurrent duplicate request_id.
      if ((auditError as { code?: string }).code === "23505") {
        return json({ error: "Request already processed", request_id: requestId }, 409);
      }
      throw new Error("audit_insert_failed");
    }

    return json(
      {
        request_id: requestId,
        generated_at: new Date().toISOString(),
        lookback_days: lookbackDays,
        registrations,
        attendance,
        checkins,
      },
      200,
    );
  } catch (err) {
    const code = err instanceof Error ? err.message : "unknown_error";
    console.error("readiness-radar export failed:", code);
    try {
      await audit("error", zero, code.slice(0, 100));
    } catch (_) {
      // audit best effort
    }
    return json({ error: "Internal error", request_id: requestId }, 500);
  }
});
