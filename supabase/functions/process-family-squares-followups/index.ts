import "../_shared/suppression.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authenticateCronRequest } from "../_shared/cron-auth.ts";

// Sends the three Family Squares follow-up emails that
// score-family-squares-registration queues (day 1, day 3, day 7).
//
// Who gets them: website registrants who signed up AFTER the sequence was
// switched on and left the email-list box ticked. Everything else is marked
// skipped, never sent:
//   - anything queued before the switch-on time (site_settings key below)
//   - anything more than MAX_LATE_HOURS overdue (so an outage can never turn
//     into a burst of stale mail)
//   - Sober Helpline app RSVPs, kiosk sign-ups and anyone who unticked the box
//   - active members (the sequence invites people to become one)
//   - a step this address already received in the last REPEAT_DAYS days
//     (people who register again each week get the sequence once)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret",
};

const QUEUE = "family_squares_followup_queue";
/** site_settings key: ISO time the sequence was switched on. Unset = send nothing. */
const START_SETTING = "family_squares_followups_start_at";
/**
 * site_settings key: the postal address shown under each email. It lives in
 * the database, not in this public repository. Unset = no address line.
 */
const ADDRESS_SETTING = "email_mailing_address";
const MAX_LATE_HOURS = 72;
const REPEAT_DAYS = 90;

type SkipReason =
  | "before_start"
  | "too_late"
  | "no_registration"
  | "app"
  | "no_consent"
  | "member"
  | "repeat"
  | "unsubscribed";

const SKIP_NOTE: Record<SkipReason, string> = {
  before_start: "skipped: queued before the sequence was switched on",
  too_late: `skipped: more than ${MAX_LATE_HOURS} hours late`,
  no_registration: "skipped: registration not found",
  app: "skipped: Sober Helpline app registration",
  no_consent: "skipped: did not opt in to the email list",
  member: "skipped: already a member",
  repeat: `skipped: this address received this step in the last ${REPEAT_DAYS} days`,
  unsubscribed: "skipped: unsubscribed",
};

interface QueueRow {
  id: string;
  registration_id: string | null;
  email: string;
  name: string | null;
  subject: string;
  body_html: string;
  sequence_step: number;
  scheduled_for: string;
  created_at: string;
}

interface RegistrationRow {
  id: string;
  registration_source: string | null;
  consent_email_list: boolean | null;
  user_id: string | null;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[char] || char));

/** The line under each email: who sent it, the postal address, and why they got it. */
const footerHtml = (address: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 28px auto 0; padding-top: 14px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; line-height: 1.6; text-align: center;">
    Sober Helpline, ${escapeHtml(address)}<br>
    You are receiving this because you registered for Family Squares.
  </div>`;

/** Escapes LIKE wildcards so ilike() is a case-insensitive exact match. */
const exactPattern = (value: string) => value.trim().replace(/[\\%_]/g, "\\$&");

const sendEmail = async (to: string, name: string | null, subject: string, html: string): Promise<"sent" | "suppressed"> => {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY is not configured");

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tracking_settings: { subscription_tracking: { enable: true } },
      personalizations: [{ to: [{ email: to, name: name || undefined }] }],
      from: { email: "matt@soberhelpline.com", name: "Matt Brown | Sober Helpline" },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`SendGrid error [${response.status}]: ${details}`);
  }
  // _shared/suppression.ts answers 202 with this header when the address is on
  // the unsubscribe list: nothing was sent.
  return response.headers.get("x-email-suppressed") === "true" ? "suppressed" : "sent";
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Two callers are allowed: Lovable's managed scheduler, and a caller that
    // presents the automation secret. Fails closed when neither is configured.
    const expectedSecret = Deno.env.get("FOLLOWUP_AUTOMATION_SECRET");
    const providedSecret = req.headers.get("x-automation-secret");
    const fromManagedScheduler = authenticateCronRequest(req) === null;
    const hasAutomationSecret = Boolean(expectedSecret) && providedSecret === expectedSecret;
    if (!fromManagedScheduler && !hasAutomationSecret) {
      return json({ error: "Unauthorized" }, 401);
    }

    const url = new URL(req.url);
    const requested = Number(url.searchParams.get("limit") || "25");
    const limit = Number.isFinite(requested) ? Math.max(1, Math.min(requested, 100)) : 25;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // The switch-on time. Until it is set, nothing is sent and nothing is changed.
    const { data: settingRows, error: settingsError } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", [START_SETTING, ADDRESS_SETTING]);
    if (settingsError) throw settingsError;
    const setting = (key: string) =>
      String(((settingRows || []) as { key: string; value: string | null }[]).find((row) => row.key === key)?.value ?? "").trim();
    const startMs = Date.parse(setting(START_SETTING));
    if (!Number.isFinite(startMs)) {
      return json({ sent: 0, skipped: 0, failed: 0, not_started: true });
    }
    const mailingAddress = setting(ADDRESS_SETTING);
    const footer = mailingAddress ? footerHtml(mailingAddress) : "";

    const nowMs = Date.now();
    const { data: dueData, error: dueError } = await supabase
      .from(QUEUE)
      .select("id, registration_id, email, name, subject, body_html, sequence_step, scheduled_for, created_at")
      .lte("scheduled_for", new Date(nowMs).toISOString())
      .is("sent_at", null)
      .is("skipped_at", null)
      .order("scheduled_for", { ascending: true })
      .limit(limit);
    if (dueError) throw dueError;
    const due = (dueData || []) as QueueRow[];

    const registrations = new Map<string, RegistrationRow>();
    const registrationIds = [...new Set(due.map((f) => f.registration_id).filter((id): id is string => Boolean(id)))];
    if (registrationIds.length > 0) {
      const { data: regRows, error: regError } = await supabase
        .from("zoom_meeting_registrations")
        .select("id, registration_source, consent_email_list, user_id")
        .in("id", registrationIds);
      if (regError) throw regError;
      ((regRows || []) as RegistrationRow[]).forEach((row) => registrations.set(row.id, row));
    }

    // Membership is checked once per signed-in registrant. A failed check holds
    // that person's email for the next run instead of guessing.
    const memberStatus = new Map<string, boolean | "unknown">();
    const isMember = async (userId: string): Promise<boolean | "unknown"> => {
      const known = memberStatus.get(userId);
      if (known !== undefined) return known;
      const { data, error } = await supabase.rpc("is_active_family_member", { _user_id: userId });
      const status = error ? "unknown" : data === true;
      memberStatus.set(userId, status);
      return status;
    };

    let sent = 0;
    let failed = 0;
    const reasons: Partial<Record<SkipReason, number>> = {};

    const skip = async (id: string, reason: SkipReason) => {
      const { error } = await supabase
        .from(QUEUE)
        .update({ skipped_at: new Date().toISOString(), error_message: SKIP_NOTE[reason] })
        .eq("id", id)
        .is("sent_at", null);
      if (error) {
        failed += 1;
        return;
      }
      reasons[reason] = (reasons[reason] || 0) + 1;
    };

    for (const followup of due) {
      try {
        if (!(Date.parse(followup.created_at) >= startMs)) {
          await skip(followup.id, "before_start");
          continue;
        }
        if (Date.parse(followup.scheduled_for) < nowMs - MAX_LATE_HOURS * 3600_000) {
          await skip(followup.id, "too_late");
          continue;
        }
        const registration = followup.registration_id ? registrations.get(followup.registration_id) : undefined;
        if (!registration) {
          await skip(followup.id, "no_registration");
          continue;
        }
        if (registration.registration_source === "app") {
          await skip(followup.id, "app");
          continue;
        }
        if (registration.consent_email_list !== true) {
          await skip(followup.id, "no_consent");
          continue;
        }
        if (registration.user_id) {
          const member = await isMember(registration.user_id);
          if (member === "unknown") {
            failed += 1;
            continue;
          }
          if (member) {
            await skip(followup.id, "member");
            continue;
          }
        }

        const repeatSince = new Date(nowMs - REPEAT_DAYS * 86_400_000).toISOString();
        const { data: earlier, error: earlierError } = await supabase
          .from(QUEUE)
          .select("id")
          .ilike("email", exactPattern(followup.email))
          .eq("sequence_step", followup.sequence_step)
          .gte("sent_at", repeatSince)
          .neq("id", followup.id)
          .limit(1);
        if (earlierError) throw earlierError;
        if ((earlier || []).length > 0) {
          await skip(followup.id, "repeat");
          continue;
        }

        // Claim the row before sending, so two overlapping runs can never both
        // send it. If the send then fails, the claim is released for the next run.
        const claimedAt = new Date().toISOString();
        const { data: claimed, error: claimError } = await supabase
          .from(QUEUE)
          .update({ sent_at: claimedAt, error_message: null })
          .eq("id", followup.id)
          .is("sent_at", null)
          .is("skipped_at", null)
          .select("id");
        if (claimError) throw claimError;
        if (!claimed || claimed.length === 0) continue; // another run has it

        let outcome: "sent" | "suppressed";
        try {
          outcome = await sendEmail(followup.email, followup.name, followup.subject, followup.body_html + footer);
        } catch (sendError: unknown) {
          const message = sendError instanceof Error ? sendError.message : "Unknown error";
          await supabase
            .from(QUEUE)
            .update({ sent_at: null, error_message: message.slice(0, 500) })
            .eq("id", followup.id);
          failed += 1;
          continue;
        }

        if (outcome === "suppressed") {
          await supabase
            .from(QUEUE)
            .update({ sent_at: null, skipped_at: claimedAt, error_message: SKIP_NOTE.unsubscribed })
            .eq("id", followup.id);
          reasons.unsubscribed = (reasons.unsubscribed || 0) + 1;
          continue;
        }

        sent += 1;

        const { data: nextQueued } = await supabase
          .from(QUEUE)
          .select("scheduled_for")
          .eq("registration_id", registration.id)
          .is("sent_at", null)
          .is("skipped_at", null)
          .order("scheduled_for", { ascending: true })
          .limit(1)
          .maybeSingle();

        await supabase
          .from("zoom_meeting_registrations")
          .update({
            last_followup_at: claimedAt,
            next_followup_at: nextQueued?.scheduled_for || null,
            followup_sequence_status: nextQueued ? "active" : "complete",
          })
          .eq("id", registration.id);
      } catch (rowError: unknown) {
        console.error("process-family-squares-followups row failed:", rowError instanceof Error ? rowError.message : rowError);
        failed += 1;
      }
    }

    const skipped = Object.values(reasons).reduce((total, count) => total + (count || 0), 0);
    // Counts only: this body is stored in the scheduler's response log.
    return json({ sent, skipped, failed, reasons });
  } catch (error: unknown) {
    console.error("process-family-squares-followups error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500);
  }
});
