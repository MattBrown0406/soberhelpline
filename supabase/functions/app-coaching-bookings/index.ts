import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { zonedToUtcMs } from "../_shared/bookingRules.ts";

// The Sober Helpline app asks this for the coaching sessions one member has
// booked on soberhelpline.com, so they show up in the app's "My sessions".
//
// Server to server only: the shared MEMBERSHIP_SYNC_SECRET in the
// x-membership-sync-secret header is the gate (verify_jwt = false). The app
// sends the member's VERIFIED login email, taken from their token.
//
// A session is returned when its confirmation went to that email address, or
// when it was booked from the website account that has that login email. The
// answer carries only what the app shows: when, with whom, the status and the
// Zoom join link. Never the passcode on its own, phone number, intake
// answers, payment amounts or internal ids other than the booking id.
// Never log the email or a link.

const headers = { "Content-Type": "application/json" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

/** Constant-time comparison so the shared secret cannot be probed by timing. */
function secretMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = new TextEncoder().encode(provided);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

const LOOK_BACK_DAYS = 30;
const MAX_SESSIONS = 50;
const COLUMNS =
  "id, booking_date, start_time, end_time, timezone, status, provider_id, zoom_meeting_url, zoom_status, service_type:intake_responses->>service_type";

interface BookingRow {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  timezone: string | null;
  status: string;
  provider_id: string | null;
  zoom_meeting_url: string | null;
  zoom_status: string | null;
  service_type: string | null;
}

/** Only a real Zoom address is passed on. */
function zoomLink(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && /(^|\.)zoom\.us$/i.test(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  if (!secretMatches(req.headers.get("x-membership-sync-secret"), Deno.env.get("MEMBERSHIP_SYNC_SECRET"))) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  try {
    const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email.includes("@") || email.length > 320) return json({ ok: false, error: "bad_request" }, 400);

    const admin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const since = new Date(Date.now() - LOOK_BACK_DAYS * 86_400_000).toISOString().slice(0, 10);
    const base = () =>
      admin.from("consultation_bookings").select(COLUMNS)
        .in("status", ["confirmed", "completed"])
        .gte("booking_date", since)
        .order("booking_date", { ascending: true })
        .limit(MAX_SESSIONS);

    // Sessions whose confirmation was sent to this address (stored lower-cased).
    const { data: byEmail, error: emailError } = await base().eq("client_email", email);
    if (emailError) throw new Error(`booking lookup failed: ${emailError.code ?? "unknown"}`);
    const rows = new Map<string, BookingRow>();
    for (const row of (byEmail ?? []) as unknown as BookingRow[]) rows.set(row.id, row);

    // Sessions booked from the website account with this login email, even if
    // a different contact email was typed on the booking form.
    const { data: userId, error: userError } = await admin.rpc("auth_user_id_by_email", { p_email: email });
    if (userError) throw new Error(`account lookup failed: ${userError.code ?? "unknown"}`);
    if (typeof userId === "string") {
      const { data: byAccount, error: accountError } = await base().eq("client_user_id", userId);
      if (accountError) throw new Error(`booking lookup failed: ${accountError.code ?? "unknown"}`);
      for (const row of (byAccount ?? []) as unknown as BookingRow[]) rows.set(row.id, row);
    }

    const providerIds = [...new Set([...rows.values()].map((r) => r.provider_id).filter((id): id is string => !!id))];
    const providerNames = new Map<string, string>();
    if (providerIds.length > 0) {
      const { data: providers, error: providerError } = await admin
        .from("consultation_providers").select("id, full_name").in("id", providerIds);
      if (providerError) throw new Error(`provider lookup failed: ${providerError.code ?? "unknown"}`);
      for (const p of providers ?? []) providerNames.set(p.id as string, String(p.full_name ?? ""));
    }

    const sessions = [...rows.values()].flatMap((row) => {
      const tz = row.timezone || "America/Los_Angeles";
      const start = zonedToUtcMs(row.booking_date, row.start_time, tz);
      const end = zonedToUtcMs(row.booking_date, row.end_time, tz);
      if (!Number.isFinite(start) || !Number.isFinite(end)) return [];
      const joinUrl = zoomLink(row.zoom_meeting_url);
      return [{
        id: row.id,
        starts_at: new Date(start).toISOString(),
        ends_at: new Date(end).toISOString(),
        timezone: tz,
        status: row.status,
        kind: row.service_type === "family-readiness-intensive" ? "intensive" : "coaching",
        provider_name: (row.provider_id && providerNames.get(row.provider_id)) || "",
        join_url: joinUrl,
      }];
    }).sort((a, b) => a.starts_at.localeCompare(b.starts_at)).slice(0, MAX_SESSIONS);

    console.log(`app-coaching-bookings: returned ${sessions.length}`);
    return json({ ok: true, sessions });
  } catch (error) {
    console.error("app-coaching-bookings error:", error instanceof Error ? error.message : "unknown");
    return json({ ok: false, error: "error" }, 500);
  }
});
