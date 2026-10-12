import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { duplicateRegistrationResponse, isRegistrationDuplicate, registrationUserId } from "../_shared/mondayRegistration.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RegistrationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(255),
  phone: z.string().trim().max(20).optional().default(""),
  question: z.string().trim().max(1000).optional().default(""),
  requestFollowUp: z.boolean().optional().default(false),
  consentEmailList: z.boolean().optional().default(true),
  autoRegister: z.boolean().optional().default(false),
  preferredContactDate: z.string().trim().max(20).optional().nullable(),
  preferredContactTime: z.string().trim().max(20).optional().nullable(),
  preferredTimezone: z.string().trim().max(100).optional().nullable(),
  language: z.enum(["en", "es"]).optional().default("en"),
});

function getNextMeetingDate() {
  const now = new Date();
  const pstString = now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const pstNow = new Date(pstString);
  const day = pstNow.getDay();
  const daysUntilMonday = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
  const nextMonday = new Date(pstNow);
  nextMonday.setDate(pstNow.getDate() + daysUntilMonday);

  const year = nextMonday.getFullYear();
  const month = String(nextMonday.getMonth() + 1).padStart(2, "0");
  const date = String(nextMonday.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = RegistrationSchema.safeParse(rawBody);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const registration = parsed.data;
    const meetingDate = getNextMeetingDate();
    const email = registration.email.toLowerCase().trim();
    const name = registration.name.replace(/\s+/g, " ").trim();


    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Backend configuration is incomplete");
    }

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

    // Blocklist check (email OR last name) — silently accept but do not register or email
    const { data: blockedFlag, error: blockedError } = await adminSupabase.rpc("is_meeting_blocked", {
      _email: email,
      _name: name,
    });

    if (blockedError) throw blockedError;
    if (blockedFlag === true) {
      console.warn(`Blocked meeting registration attempt: ${email} / ${name}`);
      return new Response(JSON.stringify({
        success: true,
        registrationId: null,
        meetingDate,
        alreadyRegistered: true,
        emailSent: false,
        emailError: null,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: cancelled, error: cancellationError } = await adminSupabase
      .from("cancelled_meeting_dates").select("meeting_date").eq("meeting_date", meetingDate).maybeSingle();
    if (cancellationError) throw cancellationError;
    if (cancelled) return new Response(JSON.stringify({ error: "This meeting has been cancelled.", cancelled: true }), {
      status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    const userId = await registrationUserId(req, email, adminSupabase);
    const payload = {
      user_id: userId,
      name,
      email,
      phone: registration.phone,
      question: registration.question,
      request_follow_up: registration.requestFollowUp,
      consent_email_list: registration.consentEmailList,
      meeting_date: meetingDate,
      auto_register: registration.autoRegister,
      preferred_contact_date: registration.requestFollowUp ? registration.preferredContactDate || null : null,
      preferred_contact_time: registration.requestFollowUp ? registration.preferredContactTime || null : null,
      preferred_timezone: registration.requestFollowUp ? registration.preferredTimezone || null : null,
      language: registration.language,
    };

    const { data: savedRow, error: saveError } = await adminSupabase
      .from("zoom_meeting_registrations").insert(payload).select("id").single();
    if (isRegistrationDuplicate(saveError)) return new Response(JSON.stringify(duplicateRegistrationResponse()), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

    if (saveError) {
      throw new Error(`Unable to save registration: ${saveError.message}`);
    }

    let emailSent = true;
    let emailError: string | null = null;

    try {
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-zoom-registration-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          name,
          email,
          registration_id: savedRow?.id ?? null,
          consentEmailList: registration.consentEmailList,
          language: registration.language,
        }),
      });

      if (!emailResponse.ok) {
        emailSent = false;
        emailError = await emailResponse.text();
        console.error("Zoom registration email failed", emailError);
      }
    } catch (error) {
      emailSent = false;
      emailError = error instanceof Error ? error.message : "Unknown email error";
      console.error("Zoom registration email request failed", emailError);
    }

    return new Response(JSON.stringify({
      success: true,
      registrationId: savedRow?.id ?? null,
      meetingDate,
      status: "registered",
      alreadyRegistered: false,
      emailSent,
      emailError,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in register-zoom-meeting", message);

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});