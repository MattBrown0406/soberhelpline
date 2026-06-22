import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
      user_id = null,
      name,
      email,
      phone = "",
      question = "",
      request_follow_up = false,
      consent_email_list = false,
      meeting_date,
      auto_register = false,
      preferred_contact_date = null,
      preferred_contact_time = null,
      preferred_timezone = null,
      attribution = null,
    } = payload ?? {};

    if (!name || !email || !meeting_date) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Blocklist check (email OR last name) — silently accept but do not register or email
    const { data: blockedFlag } = await adminSupabase.rpc("is_meeting_blocked", {
      _email: email,
      _name: name,
    });

    if (blockedFlag === true) {
      console.warn(`Blocked public meeting registration attempt: ${email} / ${name}`);
      return new Response(JSON.stringify({ success: true, registration: null }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: registration, error: insertError } = await adminSupabase
      .from("zoom_meeting_registrations")
      .insert({
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
      })
      .select("id, name, email")
      .single();

    if (insertError) {
      throw insertError;
    }

    void fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-zoom-registration-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        name,
        email,
        registration_id: registration?.id || null,
        consentEmailList: consent_email_list,
      }),
    }).catch((emailErr) => {
      console.error("Zoom registration email failed (registration saved):", emailErr);
    });

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


    return new Response(JSON.stringify({ success: true, registration }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in public-register-monday-zoom:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
