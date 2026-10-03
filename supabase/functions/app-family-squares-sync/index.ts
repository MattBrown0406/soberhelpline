// Contract C (Sober Helpline app -> website): Monday call RSVPs and questions.
//
// The app POSTs the COMPLETE current set of app users who RSVP'd or asked a
// question for one meeting date, every 15 minutes:
//   { meeting_date: "YYYY-MM-DD",
//     attendees: [{ email, name, rsvp: "going"|"declined"|null, questions: string[], app_reminders }] }
// Server-to-server only: header x-membership-sync-secret = MEMBERSHIP_SYNC_SECRET.
//
// For each wanted attendee (rsvp "going", or no rsvp but at least one question)
// there is ONE registration for (lower(email), meeting_date):
// - a non-app registration already exists: never create another; append new app
//   questions to its question text, marked "(from the app)";
// - otherwise one row with registration_source = 'app'.
// Declined attendees, and app rows whose email is no longer listed, lose their
// app row. Non-app rows are never deleted.
//
// App rows get no Mailchimp, no confirmation email, no lead scoring, no
// follow-up queue and no spine/HubSpot lead event: this function simply never
// calls any of them (there are no INSERT triggers on zoom_meeting_registrations).
//
// Until the Lovable SQL widens zoom_meeting_registrations_source_check to allow
// 'app', inserts fail the check constraint; they are reported as skipped
// (schema_pending) and retried on the next run. Merges into existing website
// registrations work before the SQL.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MAX_BODY_BYTES = 5_000_000;
const MAX_ATTENDEES = 2000;
const MAX_QUESTIONS_PER_ATTENDEE = 10;
const MAX_QUESTION_CHARS = 1000;
const MAX_NAME_CHARS = 120;
const MAX_FUTURE_DAYS = 21;
const APP_SOURCE = "app";
const APP_MARK = "(from the app)";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type Rsvp = "going" | "declined" | null;

interface Attendee {
  email: string;
  name: string;
  rsvp: Rsvp;
  questions: string[];
}

interface ExistingRow {
  id: string;
  email: string;
  name: string;
  question: string;
  registration_source: string;
  created_at: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

async function sha256(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

/** Constant-time comparison (hashing first hides the length too). */
async function secretMatches(provided: string, expected: string): Promise<boolean> {
  if (!provided || !expected) return false;
  const [a, b] = await Promise.all([sha256(provided), sha256(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

function pacificToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function isRealDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const normalizeEmail = (value: unknown) => (typeof value === "string" ? value.trim().toLowerCase() : "");
const collapse = (value: string) => value.replace(/\s+/g, " ").trim();

function cleanQuestions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const q = collapse(item).slice(0, MAX_QUESTION_CHARS);
    if (!q || seen.has(q)) continue;
    seen.add(q);
    out.push(q);
  }
  // Newest last: keep the most recent questions if the app sends many.
  return out.slice(-MAX_QUESTIONS_PER_ATTENDEE);
}

/** Question text for an app-sourced row: newest last, each prefixed "• ". */
const formatAppQuestions = (questions: string[]) => questions.map((q) => `• ${q}`).join("\n");

/** Append app questions to a website registration's text, once each. */
function mergeIntoWebsiteQuestion(existing: string, questions: string[]): string {
  let text = existing ?? "";
  for (const q of questions) {
    if (text.includes(q)) continue;
    const line = `• ${q} ${APP_MARK}`;
    text = text.trim() ? `${text.trimEnd()}\n${line}` : line;
  }
  return text;
}

function lastNameToken(name: string): string {
  const tokens = name.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return tokens.length ? tokens[tokens.length - 1] : "";
}

function parseAttendees(raw: unknown[]): { attendees: Map<string, Attendee>; invalid: number } {
  const attendees = new Map<string, Attendee>();
  let invalid = 0;
  for (const entry of raw) {
    const item = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    const email = normalizeEmail(item.email);
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      invalid += 1;
      continue;
    }
    const name = (typeof item.name === "string" ? collapse(item.name) : "").slice(0, MAX_NAME_CHARS) || "Friend";
    const rsvp: Rsvp = item.rsvp === "going" || item.rsvp === "declined" ? item.rsvp : null;
    const questions = cleanQuestions(item.questions);
    const previous = attendees.get(email);
    if (previous) {
      // Duplicate email in one payload: later entry wins for name/rsvp; keep all questions.
      attendees.set(email, {
        email,
        name,
        rsvp: rsvp ?? previous.rsvp,
        questions: cleanQuestions([...previous.questions, ...questions]),
      });
    } else {
      attendees.set(email, { email, name, rsvp, questions });
    }
  }
  return { attendees, invalid };
}

function adminClient() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  const expectedSecret = Deno.env.get("MEMBERSHIP_SYNC_SECRET") ?? "";
  if (!expectedSecret) {
    console.error("app-family-squares-sync: MEMBERSHIP_SYNC_SECRET is not set");
    return json({ ok: false, error: "not_configured" }, 503);
  }
  if (!(await secretMatches(req.headers.get("x-membership-sync-secret") ?? "", expectedSecret))) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  let payload: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return json({ ok: false, error: "payload_too_large" }, 413);
    payload = JSON.parse(text);
    if (!payload || typeof payload !== "object") throw new Error("not an object");
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const meetingDate = typeof payload.meeting_date === "string" ? payload.meeting_date.trim() : "";
  if (!isRealDate(meetingDate)) return json({ ok: false, error: "invalid_meeting_date" }, 400);
  const today = pacificToday();
  // Never rewrite past meetings' records; only the upcoming (or tonight's) call.
  if (meetingDate < today || meetingDate > addDays(today, MAX_FUTURE_DAYS)) {
    return json({ ok: false, error: "meeting_date_out_of_range" }, 400);
  }
  if (!Array.isArray(payload.attendees)) return json({ ok: false, error: "attendees_required" }, 400);
  if (payload.attendees.length > MAX_ATTENDEES) return json({ ok: false, error: "too_many_attendees" }, 400);

  const { attendees, invalid } = parseAttendees(payload.attendees);
  const admin = adminClient();

  try {
    const [cancelledRes, blocklistRes] = await Promise.all([
      admin.from("cancelled_meeting_dates").select("meeting_date").eq("meeting_date", meetingDate).maybeSingle(),
      admin.from("meeting_blocklist").select("email, blocked_last_name"),
    ]);
    if (cancelledRes.error) throw cancelledRes.error;
    if (blocklistRes.error) throw blocklistRes.error;
    const cancelled = Boolean(cancelledRes.data);
    const blockedEmails = new Set<string>();
    const blockedLastNames = new Set<string>();
    for (const row of (blocklistRes.data ?? []) as Array<{ email: string | null; blocked_last_name: string | null }>) {
      if (row.email) blockedEmails.add(normalizeEmail(row.email));
      if (row.blocked_last_name) blockedLastNames.add(row.blocked_last_name.trim().toLowerCase());
    }
    // Same rule as public.is_meeting_blocked(email, name).
    const isBlocked = (a: Attendee) => {
      const last = lastNameToken(a.name);
      return blockedEmails.has(a.email) || (last !== "" && blockedLastNames.has(last));
    };

    // Every registration already on file for this meeting date.
    const existing: ExistingRow[] = [];
    const pageSize = 1000;
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await admin
        .from("zoom_meeting_registrations")
        .select("id, email, name, question, registration_source, created_at")
        .eq("meeting_date", meetingDate)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .range(offset, offset + pageSize - 1);
      if (error) throw error;
      existing.push(...((data ?? []) as ExistingRow[]));
      if (!data || data.length < pageSize) break;
    }
    const byEmail = new Map<string, ExistingRow[]>();
    for (const row of existing) {
      const key = normalizeEmail(row.email);
      if (!key) continue;
      byEmail.set(key, [...(byEmail.get(key) ?? []), row]);
    }

    const counts = { inserted: 0, updated: 0, merged: 0, unchanged: 0, blocked: 0, cancelled: 0, invalid, schema_pending: 0 };
    const wanted = new Map<string, Attendee>();
    // App rows kept as-is because the date is cancelled (not re-written, not removed).
    const retained = new Set<string>();

    for (const attendee of attendees.values()) {
      const wantsSeat = attendee.rsvp === "going" || (attendee.rsvp === null && attendee.questions.length > 0);
      if (!wantsSeat) continue; // declined (or nothing to register) -> its app row is removed below
      if (isBlocked(attendee)) {
        counts.blocked += 1;
        continue; // blocked -> skipped, and any app row is removed below
      }
      if (cancelled) {
        counts.cancelled += 1;
        retained.add(attendee.email);
        continue;
      }
      wanted.set(attendee.email, attendee);
    }

    const toDelete = new Set<string>();
    const toInsert: Record<string, unknown>[] = [];

    for (const attendee of wanted.values()) {
      const rows = byEmail.get(attendee.email) ?? [];
      const websiteRows = rows.filter((row) => row.registration_source !== APP_SOURCE);
      const appRows = rows.filter((row) => row.registration_source === APP_SOURCE);

      if (websiteRows.length > 0) {
        // Keep the person's own registration; fold app questions into the newest one.
        appRows.forEach((row) => toDelete.add(row.id));
        const target = websiteRows[websiteRows.length - 1];
        const merged = mergeIntoWebsiteQuestion(target.question ?? "", attendee.questions);
        if (merged !== (target.question ?? "")) {
          const { error } = await admin
            .from("zoom_meeting_registrations")
            .update({ question: merged })
            .eq("id", target.id)
            .neq("registration_source", APP_SOURCE);
          if (error) throw error;
          counts.merged += 1;
        } else {
          counts.unchanged += 1;
        }
        continue;
      }

      const question = formatAppQuestions(attendee.questions);
      if (appRows.length > 0) {
        const [keep, ...duplicates] = appRows;
        duplicates.forEach((row) => toDelete.add(row.id));
        if (keep.name !== attendee.name || (keep.question ?? "") !== question) {
          const { error } = await admin
            .from("zoom_meeting_registrations")
            .update({ name: attendee.name, question })
            .eq("id", keep.id)
            .eq("registration_source", APP_SOURCE);
          if (error) throw error;
          counts.updated += 1;
        } else {
          counts.unchanged += 1;
        }
        continue;
      }

      toInsert.push({
        user_id: null,
        name: attendee.name,
        email: attendee.email,
        phone: "",
        question,
        request_follow_up: false,
        consent_email_list: false,
        auto_register: false,
        meeting_date: meetingDate,
        language: "en",
        registration_source: APP_SOURCE,
        // Visible in the admin lead views: this is an app RSVP, not a sales lead.
        lead_reasons: ["Sober Helpline app RSVP"],
        next_revenue_action: "none",
        followup_sequence_status: "not_applicable",
      });
    }

    // App rows for people who declined, dropped off the list, or are blocked.
    for (const [email, rows] of byEmail) {
      if (wanted.has(email) || retained.has(email)) continue;
      rows.filter((row) => row.registration_source === APP_SOURCE).forEach((row) => toDelete.add(row.id));
    }

    // Inserts. A check-constraint failure means the 'app' source SQL hasn't run yet.
    let schemaPending = false;
    const insertOne = async (row: Record<string, unknown>) => {
      const { error } = await admin.from("zoom_meeting_registrations").insert(row);
      if (!error) {
        counts.inserted += 1;
      } else if (error.code === "23505") {
        counts.unchanged += 1; // a concurrent run already created it (unique index)
      } else if (error.code === "23514") {
        schemaPending = true;
        counts.schema_pending += 1;
      } else {
        throw error;
      }
    };
    for (let start = 0; start < toInsert.length; start += 500) {
      const batch = toInsert.slice(start, start + 500);
      if (schemaPending) {
        counts.schema_pending += batch.length;
        continue;
      }
      const { error } = await admin.from("zoom_meeting_registrations").insert(batch);
      if (!error) {
        counts.inserted += batch.length;
      } else if (error.code === "23514") {
        schemaPending = true;
        counts.schema_pending += batch.length;
      } else if (error.code === "23505") {
        for (const row of batch) await insertOne(row);
      } else {
        throw error;
      }
    }
    if (schemaPending) {
      console.warn("app-family-squares-sync: registration_source 'app' not allowed yet (run the Lovable SQL)");
    }

    // Deletes: app-sourced rows for this date only, never anything else.
    let removed = 0;
    const deleteIds = [...toDelete];
    for (let start = 0; start < deleteIds.length; start += 500) {
      const { data, error } = await admin
        .from("zoom_meeting_registrations")
        .delete()
        .in("id", deleteIds.slice(start, start + 500))
        .eq("registration_source", APP_SOURCE)
        .eq("meeting_date", meetingDate)
        .select("id");
      if (error) throw error;
      removed += data?.length ?? 0;
    }

    const upserted = counts.inserted + counts.updated + counts.merged;
    const skipped = counts.blocked + counts.cancelled + counts.invalid + counts.schema_pending;
    console.log(
      `app-family-squares-sync meeting_date=${meetingDate} attendees=${attendees.size} upserted=${upserted} ` +
        `(inserted=${counts.inserted} updated=${counts.updated} merged=${counts.merged}) unchanged=${counts.unchanged} ` +
        `removed=${removed} skipped=${skipped} (blocked=${counts.blocked} cancelled=${counts.cancelled} ` +
        `invalid=${counts.invalid} schema_pending=${counts.schema_pending})`,
    );

    return json({
      ok: true,
      upserted,
      removed,
      skipped,
      meeting_date: meetingDate,
      cancelled,
      details: counts,
    });
  } catch (error) {
    const code = (error as { code?: string })?.code ?? "";
    console.error(`app-family-squares-sync failed${code ? ` (${code})` : ""}:`, error instanceof Error ? error.message : "unknown error");
    return json({ ok: false, error: "sync_failed" }, 500);
  }
});
