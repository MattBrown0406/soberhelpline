import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";

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

async function getAuthenticatedUserId(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return null;

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const publishableKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  if (!supabaseUrl || !publishableKey) return null;

  const authClient = createClient(supabaseUrl, publishableKey);
  const { data, error } = await authClient.auth.getUser(token);

  if (error || !data.user) {
    console.warn("Unable to resolve authenticated user for zoom registration", error?.message);
    return null;
  }

  return data.user.id;
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
    const userId = await getAuthenticatedUserId(req);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Backend configuration is incomplete");
    }

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: existingRows, error: existingError } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("id, user_id, auto_register")
      .eq("meeting_date", meetingDate)
      .ilike("email", email)
      .order("created_at", { ascending: false })
      .limit(1);

    if (existingError) {
      throw new Error(`Unable to check existing registration: ${existingError.message}`);
    }

    const existingRow = existingRows?.[0] ?? null;
    const payload = {
      user_id: userId ?? existingRow?.user_id ?? null,
      name,
      email,
      phone: registration.phone,
      question: registration.question,
      request_follow_up: registration.requestFollowUp,
      consent_email_list: registration.consentEmailList,
      meeting_date: meetingDate,
      auto_register: registration.autoRegister || existingRow?.auto_register || false,
      preferred_contact_date: registration.requestFollowUp ? registration.preferredContactDate || null : null,
      preferred_contact_time: registration.requestFollowUp ? registration.preferredContactTime || null : null,
      preferred_timezone: registration.requestFollowUp ? registration.preferredTimezone || null : null,
    };

    const mutation = existingRow
      ? adminSupabase
          .from("zoom_meeting_registrations")
          .update(payload)
          .eq("id", existingRow.id)
          .select("id")
          .single()
      : adminSupabase
          .from("zoom_meeting_registrations")
          .insert(payload)
          .select("id")
          .single();

    const { data: savedRow, error: saveError } = await mutation;

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
          registration_id: savedRow?.id ?? existingRow?.id ?? null,
          consentEmailList: registration.consentEmailList,
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
      registrationId: savedRow?.id ?? existingRow?.id ?? null,
      meetingDate,
      alreadyRegistered: Boolean(existingRow),
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