import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { notifyMondayRegistration } from "../_shared/mondayNotification.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { duplicateRegistrationResponse, registrationUserId, registerMondayManual } from "../_shared/mondayRegistration.ts";

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

function getNextMeetingDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit",
    day: "2-digit", hour: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const date = new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)));
  const day = date.getUTCDay();
  const days = day === 1 && Number(values.hour) < 20 ? 0 : (8 - day) % 7 || 7;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
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
      registration_source: "website",
    };

    const result = await registerMondayManual(adminSupabase, "legacy", payload).catch(() => {
      throw new Error("Registration not secured");
    });
    if (result.already_registered || !result.registration) {
      return new Response(JSON.stringify(duplicateRegistrationResponse()), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const savedRow = result.registration;
    const emailSent = await notifyMondayRegistration(savedRow.id);
    const emailError = emailSent ? null : "Registration saved; notification requires operator reconciliation.";

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