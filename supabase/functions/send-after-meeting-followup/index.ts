import "../_shared/suppression.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authenticateCronRequest } from "../_shared/cron-auth.ts";
import { isMeetingCancelled } from "../_shared/cancelledMeetings.ts";
import { activeMemberEmails, addDays, normalizeEmail, normalizeName } from "../_shared/familySquaresActivity.ts";
import { firstWord, looseMatch } from "../_shared/attendeeNameMatch.ts";

// The morning after a Family Squares meeting, one email to people for whom it
// was a first:
//   - "attended": last night was the first meeting they were in the room for
//   - "missed":   last night was the first meeting they ever registered for,
//                 and they were not in the room
//
// Zoom shows most people by display name only, and that name often differs
// from the one on the registration ("Sara" joins as "Sara Vaday", or as
// "iPhone"). So attendance is matched the way the Tuesday report matches it:
// by registration, email, full name, then a loose name match when exactly one
// registrant fits. When someone in the room cannot be told apart from a
// registrant (same first name, nothing else to go on), that registrant is
// "uncertain" and gets no email: telling a person who came that we missed them
// is worse than saying nothing.
//
// It replaces send-first-timer-followup, which went out at 8 PM on Monday to
// everyone registering for the first time, could not tell who had shown up,
// and offered membership to all of them. Here the membership offer only goes
// to people who attended.
//
// Safety:
//   - sends nothing until site_settings.after_meeting_followups_start_date is
//     set, and never for a meeting before that date
//   - sends only on Tuesday morning Pacific time, for the Monday just past
//   - sends nothing if Monday's attendance has not been recorded yet (the next
//     hourly run tries again), or if the meeting was cancelled
//   - each person is claimed in family_squares_followup_queue (step 0) before
//     the email goes out, so overlapping or repeated runs can never send twice

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret",
};

const QUEUE = "family_squares_followup_queue";
/** The queue step that marks this email. Steps 1 to 3 are the day 1/3/7 sequence. */
const AFTER_MEETING_STEP = 0;
/** site_settings key: first meeting date (YYYY-MM-DD) this email covers. Unset = send nothing. */
const START_SETTING = "after_meeting_followups_start_date";
/** site_settings key: the postal address under each email. Kept out of this public repository. */
const ADDRESS_SETTING = "email_mailing_address";
/** Tuesday, Pacific time: the hours in which a run may send. */
const SEND_HOURS = { from: 9, to: 12 };
/** Fewer attendance rows than this means Monday's attendance is not in yet. */
const MIN_ATTENDANCE_ROWS = 2;
const MAX_PER_RUN = 150;
const SITE = "https://soberhelpline.com";

type Kind = "attended" | "missed";
type SkipReason = "unsubscribed" | "bad_address" | "internal" | "already_welcomed";

interface Registration {
  id: string;
  name: string | null;
  email: string | null;
  registration_source: string | null;
  consent_email_list: boolean | null;
  created_at: string | null;
}

interface Attendance {
  registration_id: string | null;
  participant_email: string | null;
  participant_name: string | null;
  meeting_date: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

/** Escapes LIKE wildcards so ilike() is a case-insensitive exact match. */
const exactPattern = (value: string) => value.trim().replace(/[\\%_]/g, "\\$&");

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[char] || char));

/** Weekday (0 = Sunday), hour and calendar date in Pacific time. */
export function pacificNow(now: Date): { weekday: number; hour: number; date: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { weekday, hour: Number(get("hour")) % 24, date: `${get("year")}-${get("month")}-${get("day")}` };
}

const footerHtml = (address: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 28px auto 0; padding-top: 14px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; line-height: 1.6; text-align: center;">
    Sober Helpline, ${escapeHtml(address)}<br>
    You are receiving this because you registered for Family Squares.
  </div>`;

const button = (href: string, label: string) =>
  `<p style="text-align: center; margin: 28px 0;"><a href="${href}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">${label}</a></p>`;

const wrap = (inner: string) =>
  `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">${inner}</div>`;

const signOff = `<p>With you in this,<br>Matt Brown<br><em>Sober Helpline</em></p>`;

const registerLink = (kind: Kind) => `${SITE}/family-squares?utm_source=after_meeting_email&utm_campaign=${kind}`;

export interface EmailOptions {
  name: string | null;
  viaApp: boolean;
  /** Membership is offered only to people who attended, opted in to email and are not members. */
  offerMembership: boolean;
}

export function buildEmail(kind: Kind, options: EmailOptions): { subject: string; html: string } {
  const firstName = escapeHtml((options.name || "").trim().split(/\s+/)[0] || "there");

  if (kind === "attended") {
    const nextStep = options.viaApp
      ? `<p>We meet again next Monday at 7:00 PM Pacific. You can RSVP and send your question ahead of time in the Sober Helpline app.</p>`
      : `<p>We meet again next Monday at 7:00 PM Pacific. Each meeting has its own sign-up, so save your spot now. If you tick "automatically register me for future meetings" you will not have to sign up again.</p>
${button(registerLink("attended"), "Save my spot for next Monday")}`;
    const membership = options.offerMembership
      ? `<p>One more thing, only if it is useful. Last night's meeting, and every meeting before it, is recorded for members. The family membership also has the full education library and a private forum for the days between Mondays. The first seven days are free, then it is $9.99 a month, and you can cancel any time.</p>
<p><a href="${SITE}/family-membership?utm_source=after_meeting_email&utm_campaign=attended" style="color: #2563eb; font-weight: bold;">See what the family membership includes</a></p>`
      : "";
    return {
      subject: "Glad you were with us last night",
      html: wrap(`<p>Hi ${firstName},</p>
<p>This is Matt from Sober Helpline. Last night was your first time in the room at Family Squares, and I wanted to say thank you for coming. It takes something to show up for a meeting like that.</p>
<p>One small thing that helps: before the week gets busy, write down one sentence you heard last night that you want to hold on to.</p>
${nextStep}
<p>If someone else in your family should hear this too, forward them this email. More of the family in the same meeting makes the week at home easier.</p>
${membership}
${signOff}`),
    };
  }

  const nextStep = options.viaApp
    ? `<p>We meet every Monday at 7:00 PM Pacific. You can RSVP for next week and send your question ahead of time in the Sober Helpline app.</p>`
    : `<p>We meet every Monday at 7:00 PM Pacific. Each meeting has its own sign-up, so here is next week's:</p>
${button(registerLink("missed"), "Save my spot for next Monday")}
<p>You can join with your camera off and just listen. Nobody is called on.</p>`;
  return {
    subject: "We missed you last night",
    html: wrap(`<p>Hi ${firstName},</p>
<p>This is Matt from Sober Helpline. You signed up for Family Squares last night and I don't think you made it into the room. No explanation needed. Monday nights fall apart for all kinds of reasons, especially in a house living with addiction.</p>
<p>(If you were there under a different name, thank you for coming, and you can ignore this.)</p>
${nextStep}
<p>If Monday evenings never work for you, reply and tell me. I read these.</p>
${signOff}`),
  };
}

/**
 * Pure rule: who gets which email, and who is left alone because we cannot tell.
 *
 * - "attended": matched to an attendance row on the meeting date, and to none before it.
 * - "missed":   no registration before the meeting date, not matched to
 *               attendance on the meeting date, and nobody unidentified in the
 *               room shares their first name.
 * - uncertain:  would be "missed", but someone unidentified in the room has
 *               the same first name. No email.
 *
 * Matching on the night: registration row, then Zoom email, then full name,
 * then the report's loose name match when exactly one registrant fits.
 */
export function chooseRecipients(
  meetingDate: string,
  tonight: Registration[],
  earlierRegistrationEmails: Set<string>,
  attendance: Attendance[],
  ownRegistrationIds: Map<string, Set<string>>,
): { chosen: Map<string, { kind: Kind; registration: Registration; viaApp: boolean }>; uncertain: number } {
  const fullName = (value: unknown) => {
    const name = normalizeName(value);
    return name.includes(" ") ? name : "";
  };
  const index = (rows: Attendance[]) => ({
    ids: new Set(rows.map((a) => a.registration_id).filter((id): id is string => Boolean(id))),
    emails: new Set(rows.map((a) => normalizeEmail(a.participant_email)).filter(Boolean)),
    names: new Set(rows.map((a) => fullName(a.participant_name)).filter(Boolean)),
  });
  const nightRows = attendance.filter((a) => a.meeting_date === meetingDate);
  const before = index(attendance.filter((a) => a.meeting_date < meetingDate));

  // One entry per address: the newest registration row carries the name.
  interface PersonEntry { email: string; registration: Registration; viaApp: boolean; fullNames: Set<string>; names: string[]; emails: string[] }
  const people = new Map<string, PersonEntry>();
  for (const row of [...tonight].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))) {
    const email = normalizeEmail(row.email);
    if (!email) continue;
    const person = people.get(email) ?? { email, registration: row, viaApp: false, fullNames: new Set<string>(), names: [], emails: [email] };
    if (row.registration_source === "app") person.viaApp = true;
    const name = fullName(row.name);
    if (name) person.fullNames.add(name);
    if (row.name && !person.names.includes(row.name)) person.names.push(row.name);
    people.set(email, person);
  }

  // Exact matches on the night, row by row, so the rows nobody claimed are known.
  const ownerOfRegistration = new Map<string, string>();
  for (const [email, ids] of ownRegistrationIds) for (const id of ids) ownerOfRegistration.set(id, email);
  const attendedTonight = new Set<string>();
  const unclaimed: Attendance[] = [];
  for (const row of nightRows) {
    const matched = new Set<string>();
    const byRegistration = row.registration_id ? ownerOfRegistration.get(row.registration_id) : undefined;
    if (byRegistration && people.has(byRegistration)) matched.add(byRegistration);
    const rowEmail = normalizeEmail(row.participant_email);
    if (rowEmail && people.has(rowEmail)) matched.add(rowEmail);
    const rowName = fullName(row.participant_name);
    if (rowName) for (const person of people.values()) if (person.fullNames.has(rowName)) matched.add(person.email);
    if (matched.size > 0) matched.forEach((email) => attendedTonight.add(email));
    // A row tied to someone else's registration is not a mystery guest.
    else if (!row.registration_id) unclaimed.push(row);
  }

  // Loose name matches for the rows nobody claimed. A weak fit (first name
  // only) counts only when no other unclaimed attendee shares that first name.
  const displayNamesByFirstWord = new Map<string, Set<string>>();
  for (const row of unclaimed) {
    const word = firstWord(row.participant_name);
    if (!word) continue;
    if (!displayNamesByFirstWord.has(word)) displayNamesByFirstWord.set(word, new Set());
    displayNamesByFirstWord.get(word)!.add(String(row.participant_name).toLowerCase().trim());
  }
  const candidates = [...people.values()];
  const unknownFirstWords = new Set<string>();
  for (const row of unclaimed) {
    const word = firstWord(row.participant_name);
    const person = looseMatch(candidates, row.participant_name, displayNamesByFirstWord.get(word)?.size === 1);
    if (person) attendedTonight.add(person.email);
    else if (word) unknownFirstWords.add(word);
  }

  const chosen = new Map<string, { kind: Kind; registration: Registration; viaApp: boolean }>();
  let uncertain = 0;
  for (const [email, person] of people) {
    const ids = ownRegistrationIds.get(email) ?? new Set<string>();
    const attendedBefore =
      [...ids].some((id) => before.ids.has(id)) || before.emails.has(email) || [...person.fullNames].some((n) => before.names.has(n));
    if (attendedTonight.has(email)) {
      if (!attendedBefore) chosen.set(email, { kind: "attended", registration: person.registration, viaApp: person.viaApp });
    } else if (!earlierRegistrationEmails.has(email)) {
      // Someone unidentified in the room has this person's first name: it may be them.
      if (person.names.some((name) => unknownFirstWords.has(firstWord(name)))) uncertain += 1;
      else chosen.set(email, { kind: "missed", registration: person.registration, viaApp: person.viaApp });
    }
  }
  return { chosen, uncertain };
}

const sendEmail = async (to: string, name: string | null, subject: string, html: string): Promise<"sent" | "suppressed"> => {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY is not configured");
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      tracking_settings: { subscription_tracking: { enable: true } },
      personalizations: [{ to: [{ email: to, name: name || undefined }] }],
      from: { email: "matt@soberhelpline.com", name: "Matt Brown | Sober Helpline" },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });
  if (!response.ok) throw new Error(`SendGrid error [${response.status}]: ${await response.text()}`);
  // _shared/suppression.ts answers 202 with this header for an unsubscribed address: nothing was sent.
  return response.headers.get("x-email-suppressed") === "true" ? "suppressed" : "sent";
};

// deno-lint-ignore no-explicit-any
async function fetchAll<T>(build: (from: number, to: number) => any): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await build(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < 1000) return rows;
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Lovable's managed scheduler, or a caller with the automation secret.
    const expectedSecret = Deno.env.get("FOLLOWUP_AUTOMATION_SECRET");
    const hasAutomationSecret = Boolean(expectedSecret) && req.headers.get("x-automation-secret") === expectedSecret;
    if (authenticateCronRequest(req) !== null && !hasAutomationSecret) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const counts = { sent: 0, attended: 0, missed: 0, uncertain: 0, already_done: 0, skipped: 0, failed: 0 };

    const { data: settingRows, error: settingsError } = await supabase
      .from("site_settings").select("key, value").in("key", [START_SETTING, ADDRESS_SETTING]);
    if (settingsError) throw settingsError;
    const setting = (key: string) =>
      String(((settingRows || []) as { key: string; value: string | null }[]).find((row) => row.key === key)?.value ?? "").trim();
    const startDate = setting(START_SETTING);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return json({ ...counts, not_started: true });

    // Tuesday morning Pacific only, for the Monday just past.
    const now = pacificNow(new Date());
    if (now.weekday !== 2 || now.hour < SEND_HOURS.from || now.hour > SEND_HOURS.to) {
      return json({ ...counts, outside_send_window: true });
    }
    const meetingDate = addDays(now.date, -1);
    if (meetingDate < startDate) return json({ ...counts, before_start: true, meeting_date: meetingDate });
    if (await isMeetingCancelled(supabase, meetingDate, "send-after-meeting-followup")) {
      return json({ ...counts, meeting_cancelled: true, meeting_date: meetingDate });
    }

    const tonight = await fetchAll<Registration>((from, to) => supabase.from("zoom_meeting_registrations")
      .select("id, name, email, registration_source, consent_email_list, created_at")
      .eq("meeting_date", meetingDate).order("id").range(from, to));
    if (tonight.length === 0) return json({ ...counts, meeting_date: meetingDate, registrants: 0 });

    const attendance = await fetchAll<Attendance>((from, to) => supabase.from("zoom_attendance")
      .select("registration_id, participant_email, participant_name, meeting_date")
      .lte("meeting_date", meetingDate).order("id").range(from, to));
    const onTheNight = attendance.filter((a) => a.meeting_date === meetingDate).length;
    if (onTheNight < MIN_ATTENDANCE_ROWS) {
      // Without attendance everyone would look like a no-show. Wait for the sync.
      return json({ ...counts, attendance_not_ready: true, meeting_date: meetingDate });
    }

    const emails = [...new Set(tonight.map((r) => normalizeEmail(r.email)).filter(Boolean))];
    const history = await fetchAll<{ id: string; email: string | null; meeting_date: string }>((from, to) =>
      supabase.from("zoom_meeting_registrations").select("id, email, meeting_date")
        .lte("meeting_date", meetingDate).order("id").range(from, to));
    const wanted = new Set(emails);
    const earlierRegistrationEmails = new Set<string>();
    const ownRegistrationIds = new Map<string, Set<string>>();
    for (const row of history) {
      const email = normalizeEmail(row.email);
      if (!wanted.has(email)) continue;
      if (row.meeting_date < meetingDate) earlierRegistrationEmails.add(email);
      if (!ownRegistrationIds.has(email)) ownRegistrationIds.set(email, new Set());
      ownRegistrationIds.get(email)!.add(row.id);
    }

    const { chosen, uncertain } = chooseRecipients(meetingDate, tonight, earlierRegistrationEmails, attendance, ownRegistrationIds);
    counts.uncertain = uncertain;
    // null = the lookup failed. Then nobody is offered membership this run.
    const members = await activeMemberEmails(supabase);
    const mailingAddress = setting(ADDRESS_SETTING);
    const footer = mailingAddress ? footerHtml(mailingAddress) : "";
    const reasons: Partial<Record<SkipReason, number>> = {};
    const skip = (reason: SkipReason) => {
      counts.skipped += 1;
      reasons[reason] = (reasons[reason] || 0) + 1;
    };

    let handled = 0;
    for (const [email, person] of chosen) {
      if (handled >= MAX_PER_RUN) break;
      handled += 1;
      try {
        if (email.endsWith("@freedominterventions.com")) {
          skip("internal");
          continue;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          skip("bad_address");
          continue;
        }
        // Each address gets each of these emails once, ever. Someone whose Zoom
        // name only loosely matches could otherwise look "new" again next week.
        const { data: earlier, error: earlierError } = await supabase
          .from(QUEUE)
          .select("id")
          .ilike("email", exactPattern(email))
          .eq("sequence_step", AFTER_MEETING_STEP)
          .eq("revenue_path", `after_meeting_${person.kind}`)
          .not("sent_at", "is", null)
          .neq("registration_id", person.registration.id)
          .limit(1);
        if (earlierError) throw earlierError;
        if ((earlier || []).length > 0) {
          skip("already_welcomed");
          continue;
        }

        const offerMembership = person.kind === "attended" && !person.viaApp &&
          person.registration.consent_email_list === true && members !== null && !members.has(email);
        const message = buildEmail(person.kind, { name: person.registration.name, viaApp: person.viaApp, offerMembership });

        // Claim first. The unique (registration_id, step) pair makes a second
        // claim fail, so a repeated or overlapping run cannot send again.
        const claimedAt = new Date().toISOString();
        const { data: claimed, error: claimError } = await supabase.from(QUEUE).insert({
          registration_id: person.registration.id,
          email,
          name: person.registration.name,
          revenue_path: `after_meeting_${person.kind}`,
          sequence_step: AFTER_MEETING_STEP,
          subject: message.subject,
          body_html: message.html,
          scheduled_for: claimedAt,
          sent_at: claimedAt,
        }).select("id");
        if (claimError) {
          if ((claimError as { code?: string }).code === "23505") {
            counts.already_done += 1;
            continue;
          }
          throw claimError;
        }
        const claimId = (claimed as { id: string }[] | null)?.[0]?.id;
        if (!claimId) throw new Error("claim returned no row");

        let outcome: "sent" | "suppressed";
        try {
          outcome = await sendEmail(email, person.registration.name, message.subject, message.html + footer);
        } catch (sendError: unknown) {
          // Not sent. The row stays as a record and is never retried, so a
          // provider outage cannot turn into a second email later.
          const note = sendError instanceof Error ? sendError.message : "Unknown error";
          await supabase.from(QUEUE).update({ sent_at: null, skipped_at: claimedAt, error_message: `failed: ${note}`.slice(0, 500) }).eq("id", claimId);
          counts.failed += 1;
          continue;
        }
        if (outcome === "suppressed") {
          await supabase.from(QUEUE).update({ sent_at: null, skipped_at: claimedAt, error_message: "skipped: unsubscribed" }).eq("id", claimId);
          skip("unsubscribed");
          continue;
        }
        counts.sent += 1;
        counts[person.kind] += 1;
        await supabase.from("zoom_meeting_registrations").update({ last_followup_at: claimedAt }).eq("id", person.registration.id);
      } catch (rowError: unknown) {
        console.error("send-after-meeting-followup row failed:", rowError instanceof Error ? rowError.message : rowError);
        counts.failed += 1;
      }
    }

    // Counts only: this body is stored in the scheduler's response log.
    return json({ ...counts, reasons, meeting_date: meetingDate, registrants: emails.length });
  } catch (error: unknown) {
    console.error("send-after-meeting-followup error:", error instanceof Error ? error.message : error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
