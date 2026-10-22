import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { notifyMondayRegistration } from "../_shared/mondayNotification.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.3";
import { enqueueSpineEvent, extractUtm } from "../_shared/spine.ts";
import { duplicateRegistrationResponse, registrationUserId, validMeetingDate } from "../_shared/mondayRegistration.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const {
      name,
      email: rawEmail,
      phone = "",
      question = "",
      question_only = false,
      request_follow_up = false,
      consent_email_list = false,
      meeting_date,
      auto_register = false,
      preferred_contact_date = null,
      preferred_contact_time = null,
      preferred_timezone = null,
      attribution = null,
      language = "en",
    } = payload ?? {};

    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
    const pacificToday = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit",
    }).format(new Date());
    if (typeof name !== "string" || !name.trim() || name.length > 120 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !validMeetingDate(meeting_date) || meeting_date < pacificToday ||
      typeof question !== "string" || question.length > 1000) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const user_id = await registrationUserId(req, email, adminSupabase);
    if (question_only && (!user_id || typeof question !== "string" || !question.trim() || question.length > 1000)) {
      return new Response(JSON.stringify({ error: "Please sign in with your registration email and enter a question." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const registrationSource =
      attribution?.pagePath === "/family-squares-kiosk" ? "kiosk" : "website";

    // Reject registrations for cancelled meeting dates with a user-facing message
    const { data: cancelledRow, error: cancelledError } = await adminSupabase
      .from("cancelled_meeting_dates")
      .select("reason")
      .eq("meeting_date", meeting_date)
      .maybeSingle();

    if (cancelledError) throw cancelledError;
    if (cancelledRow) {
      return new Response(
        JSON.stringify({
          error:
            cancelledRow.reason ||
            "This meeting has been cancelled. Please check back next Monday at 7:00 PM Pacific.",
          cancelled: true,
        }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Blocklist check (email OR last name) — silently accept but do not register or email
    const { data: blockedFlag, error: blockedError } = await adminSupabase.rpc("is_meeting_blocked", {
      _email: email,
      _name: name,
    });

    if (blockedError) throw blockedError;
    if (blockedFlag === true) {
      console.warn(`Blocked public meeting registration attempt: ${email} / ${name}`);
      return new Response(JSON.stringify({ success: true, registration: null }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Question-only submissions are not manual registrations or new seats.
    if (question_only) {
      const { data: saved, error } = await adminSupabase.rpc("append_monday_registration_question", {
        _email: email, _meeting_date: meeting_date, _question: question.trim(),
      });
      if (error || saved !== true) throw error ?? new Error("Question not saved");
      return new Response(JSON.stringify({ ...duplicateRegistrationResponse(), status: "question_submitted", questionSubmitted: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: result, error: insertError } = await adminSupabase.rpc("register_monday_manual", {
      _channel: registrationSource === "kiosk" ? "kiosk" : "public",
      _registration: {
        user_id,
        name,
        email,
        phone,
        question,
        request_follow_up,
        consent_email_list,
        meeting_date,
        auto_register,
        preferred_contact_date: request_follow_up ? preferred_contact_date : null,
        preferred_contact_time: request_follow_up ? preferred_contact_time : null,
        preferred_timezone: request_follow_up ? preferred_timezone : null,
        language,
        registration_source: registrationSource,
      },
    });
    if (insertError || !result || typeof result.already_registered !== "boolean") {
      throw insertError ?? new Error("Registration not secured");
    }
    if (result.already_registered) {
      return new Response(JSON.stringify(duplicateRegistrationResponse()), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const registration = result.registration;

    if (registration?.id && registrationSource === "kiosk") {
      const { error: queueError } = await adminSupabase.rpc(
        "queue_family_squares_kiosk_followup",
        { _registration_id: registration.id },
      );
      if (queueError) {
        console.error("Kiosk Tuesday invitation could not be queued:", queueError);
      }
    }

    const emailSent = await notifyMondayRegistration(registration.id);

    // Trigger lead scoring server-side so the score function can stay locked
    // behind a shared secret (no longer callable directly from the browser).
    const followupSecret = Deno.env.get("FOLLOWUP_AUTOMATION_SECRET");
    if (registration?.id && followupSecret) {
      void fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/score-family-squares-registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          "x-automation-secret": followupSecret,
        },
        body: JSON.stringify({
          registration_id: registration.id,
          attribution: attribution ?? {},
        }),
      }).catch((scoreErr) => {
        console.error("Lead scoring trigger failed (registration saved):", scoreErr);
      });
    }


    await enqueueSpineEvent("lead_captured", {
      email: email.toLowerCase().trim(),
      phone: phone || null,
      name,
      utm: extractUtm(attribution),
      props: { source: "monday_zoom", request_follow_up, consent_email_list },
    });

    return new Response(JSON.stringify({ success: true, status: "registered", alreadyRegistered: false, registration, emailSent }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in public-register-monday-zoom:", error);
    const message = "Registration could not be completed. Please try again.";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
