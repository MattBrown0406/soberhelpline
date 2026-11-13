import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authenticateCronRequest } from "../_shared/cron-auth.ts";
import { isMeetingCancelled } from "../_shared/cancelledMeetings.ts";
import { sendSms, SMS_ENABLED_SETTING, smsConfigured } from "../_shared/twilioSms.ts";
import { activeMemberEmails } from "../_shared/familySquaresActivity.ts";

// One text, about an hour before the Monday meeting, to people who opted in
// to text reminders AND are either registered for tonight's meeting or active
// members (members join without registering).
//
// Sends nothing unless texting is switched on (site_settings) and configured,
// it is the 6 PM hour on a Monday in Pacific time, and the meeting is on.
// Each person is claimed in family_squares_sms_log before the text goes out,
// so a second run cannot text anyone twice.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret",
};

const OPTINS = "family_squares_sms_optins";
const LOG = "family_squares_sms_log";
const MAX_PER_RUN = 300;
const REMINDER =
  "Sober Helpline: Family Squares starts at 7 PM Pacific tonight. Join here: https://soberhelpline.com/join-meeting Reply STOP to opt out.";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

function pacificNow(now: Date): { weekday: string; hour: number; date: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { weekday: get("weekday"), hour: Number(get("hour")) % 24, date: `${get("year")}-${get("month")}-${get("day")}` };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Lovable's managed scheduler, or a caller with the automation secret.
    const expectedSecret = Deno.env.get("FOLLOWUP_AUTOMATION_SECRET");
    const hasAutomationSecret = Boolean(expectedSecret) && req.headers.get("x-automation-secret") === expectedSecret;
    if (authenticateCronRequest(req) !== null && !hasAutomationSecret) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const counts = { sent: 0, not_registered_tonight: 0, already_done: 0, opted_out: 0, failed: 0 };

    const { data: setting, error: settingError } = await supabase
      .from("site_settings").select("value").eq("key", SMS_ENABLED_SETTING).maybeSingle();
    if (settingError) throw settingError;
    if (String((setting as { value: string | null } | null)?.value ?? "").trim() !== "true") return json({ ...counts, switched_off: true });
    if (!smsConfigured()) return json({ ...counts, not_configured: true });

    const now = pacificNow(new Date());
    if (now.weekday !== "Mon" || now.hour !== 18) return json({ ...counts, outside_send_window: true });
    const meetingDate = now.date;
    if (await isMeetingCancelled(supabase, meetingDate, "send-family-squares-sms-reminders")) {
      return json({ ...counts, meeting_cancelled: true, meeting_date: meetingDate });
    }

    const { data: optinRows, error: optinError } = await supabase
      .from(OPTINS).select("id, phone, email")
      .is("opted_out_at", null)
      // Only numbers whose confirmation text was accepted: a number that could
      // not be texted at sign-up is not texted later either.
      .not("confirmation_sent_at", "is", null)
      .order("created_at").limit(MAX_PER_RUN);
    if (optinError) throw optinError;
    const optins = (optinRows ?? []) as { id: string; phone: string; email: string }[];
    if (optins.length === 0) return json({ ...counts, meeting_date: meetingDate });

    const { data: registrationRows, error: registrationError } = await supabase
      .from("zoom_meeting_registrations").select("email").eq("meeting_date", meetingDate);
    if (registrationError) throw registrationError;
    const registeredTonight = new Set(
      ((registrationRows ?? []) as { email: string | null }[]).map((r) => String(r.email ?? "").trim().toLowerCase()).filter(Boolean),
    );

    // null = the membership lookup failed: then only registered people are texted.
    const members = await activeMemberEmails(supabase);

    for (const optin of optins) {
      try {
        const address = optin.email.trim().toLowerCase();
        if (!registeredTonight.has(address) && !(members?.has(address))) {
          counts.not_registered_tonight += 1;
          continue;
        }
        // Claim first: the unique (optin, meeting, kind) row makes a second claim fail.
        const { data: claimed, error: claimError } = await supabase
          .from(LOG).insert({ optin_id: optin.id, meeting_date: meetingDate, kind: "reminder" }).select("id");
        if (claimError) {
          if ((claimError as { code?: string }).code === "23505") {
            counts.already_done += 1;
            continue;
          }
          throw claimError;
        }
        const claimId = (claimed as { id: string }[] | null)?.[0]?.id;
        if (!claimId) throw new Error("claim returned no row");

        const result = await sendSms(optin.phone, REMINDER);
        if (result.ok) {
          counts.sent += 1;
          await supabase.from(LOG).update({ status: "sent", provider_message_id: result.messageId ?? null }).eq("id", claimId);
        } else if (result.optedOut) {
          counts.opted_out += 1;
          await supabase.from(LOG).update({ status: "opted_out" }).eq("id", claimId);
          await supabase.from(OPTINS).update({ opted_out_at: new Date().toISOString() }).eq("id", optin.id);
        } else {
          // Not retried: a text that arrives late is worse than no text.
          counts.failed += 1;
          await supabase.from(LOG).update({ status: "failed", error_message: String(result.error ?? "").slice(0, 300) }).eq("id", claimId);
        }
      } catch (rowError: unknown) {
        console.error("send-family-squares-sms-reminders row failed:", rowError instanceof Error ? rowError.message : rowError);
        counts.failed += 1;
      }
    }

    // Counts only: this body is stored in the scheduler's response log.
    return json({ ...counts, meeting_date: meetingDate });
  } catch (error: unknown) {
    console.error("send-family-squares-sms-reminders error:", error instanceof Error ? error.message : error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
