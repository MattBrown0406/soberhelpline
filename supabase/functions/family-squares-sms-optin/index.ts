import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizeNorthAmericanPhone, sendSms, SMS_CONSENT_TEXT, SMS_ENABLED_SETTING, smsConfigured } from "../_shared/twilioSms.ts";
import { activeMemberEmails } from "../_shared/familySquaresActivity.ts";

// Opt in to, or out of, text reminders about the Monday meeting. Used by the
// thank-you screen after registering and by the /text-reminders page.
//
// Public endpoint, so it is narrow on purpose:
//   - opting in only works while texting is switched on and configured
//   - consent must be given explicitly (the box starts unticked)
//   - the email must belong to someone registered for a current meeting, or
//     to an active member (members do not register each week)
//   - one confirmation text per number per day, at most three numbers per email
//   - opting out needs only the number, always works, and answers the same
//     whether or not the number was signed up
// It never touches Monday registration.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPTINS = "family_squares_sms_optins";
const MAX_NUMBERS_PER_EMAIL = 3;
// One text segment (160 characters or fewer).
const CONFIRMATION =
  "Sober Helpline: You're signed up for Family Squares text reminders, about 1 msg per meeting. " +
  "Msg & data rates may apply. Reply STOP to cancel, HELP for help.";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

/** Escapes LIKE wildcards so ilike() is a case-insensitive exact match. */
const exactPattern = (value: string) => value.trim().replace(/[\\%_]/g, "\\$&");

const pacificDate = (now: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => null);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Opting out works even when texting is switched off.
    if (body?.action === "opt_out") {
      const number = normalizeNorthAmericanPhone(body?.phone);
      if (!number) return json({ ok: false, error: "Please enter the mobile number, with area code." }, 400);
      const { error: optOutError } = await supabase
        .from(OPTINS)
        .update({ opted_out_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("phone", number)
        .is("opted_out_at", null);
      if (optOutError) throw optOutError;
      return json({ ok: true });
    }

    const { data: setting } = await supabase.from("site_settings").select("value").eq("key", SMS_ENABLED_SETTING).maybeSingle();
    if (String((setting as { value: string | null } | null)?.value ?? "").trim() !== "true" || !smsConfigured()) {
      return json({ ok: false, error: "not_available" }, 503);
    }

    if (body?.consent !== true) return json({ ok: false, error: "Please tick the box to agree to text reminders." }, 400);
    const phone = normalizeNorthAmericanPhone(body?.phone);
    if (!phone) return json({ ok: false, error: "Please enter a US or Canadian mobile number, with area code." }, 400);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: "Please register for the meeting first." }, 400);

    // Only for someone who is registered for today's meeting or a later one.
    const { data: registrations, error: registrationError } = await supabase
      .from("zoom_meeting_registrations")
      .select("id")
      .ilike("email", exactPattern(email))
      .gte("meeting_date", pacificDate(new Date()))
      .order("meeting_date", { ascending: true })
      .limit(1);
    if (registrationError) throw registrationError;
    const registrationId = (registrations as { id: string }[] | null)?.[0]?.id ?? null;
    if (!registrationId) {
      // Members join without registering, so they can sign up for texts too.
      const members = await activeMemberEmails(supabase);
      if (!members || !members.has(email)) {
        return json({ ok: false, error: "Please register for the meeting first, using this email address." }, 400);
      }
    }

    const { data: existingRows, error: existingError } = await supabase
      .from(OPTINS).select("id, phone, confirmation_sent_at").ilike("email", exactPattern(email));
    if (existingError) throw existingError;
    const existing = (existingRows ?? []) as { id: string; phone: string; confirmation_sent_at: string | null }[];
    const samePhone = existing.find((row) => row.phone === phone);
    if (!samePhone && existing.length >= MAX_NUMBERS_PER_EMAIL) {
      return json({ ok: false, error: "That is the most numbers we can add for one registration. Call us at (458) 298-8008 for help." }, 400);
    }

    const now = new Date().toISOString();
    const { data: saved, error: saveError } = await supabase
      .from(OPTINS)
      .upsert(
        { phone, email, registration_id: registrationId, consent_text: SMS_CONSENT_TEXT, consented_at: now, opted_out_at: null, updated_at: now },
        { onConflict: "phone" },
      )
      .select("id, confirmation_sent_at");
    if (saveError) throw saveError;
    const row = (saved as { id: string; confirmation_sent_at: string | null }[] | null)?.[0];
    if (!row) throw new Error("opt-in was not saved");

    // One confirmation text per number per day, however often the button is pressed.
    const lastConfirmed = row.confirmation_sent_at ? Date.parse(row.confirmation_sent_at) : 0;
    if (Date.now() - lastConfirmed > 24 * 3600_000) {
      const result = await sendSms(phone, CONFIRMATION);
      if (result.optedOut) {
        await supabase.from(OPTINS).update({ opted_out_at: now }).eq("id", row.id);
        return json({ ok: false, error: "This number has opted out of our texts. Text START to (458) 202-7900 to turn them back on, then try again." }, 400);
      }
      if (!result.ok) {
        console.error("family-squares-sms-optin: confirmation text failed:", result.error);
        return json({ ok: false, error: "We could not send a text to that number. Please check it and try again." }, 502);
      }
      await supabase.from(OPTINS).update({ confirmation_sent_at: now }).eq("id", row.id);
    }

    return json({ ok: true });
  } catch (error: unknown) {
    console.error("family-squares-sms-optin error:", error instanceof Error ? error.message : error);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500);
  }
});
