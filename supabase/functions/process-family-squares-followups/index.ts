import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret",
};

const sendEmail = async (to: string, name: string | null, subject: string, html: string) => {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY is not configured");

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const expectedSecret = Deno.env.get("FOLLOWUP_AUTOMATION_SECRET");
    const providedSecret = req.headers.get("x-automation-secret");

    // Fail closed: if the secret env var is unset, reject every caller.
    if (!expectedSecret || providedSecret !== expectedSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") || "25");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: dueFollowups, error: dueError } = await supabase
      .from("family_squares_followup_queue")
      .select("id, registration_id, email, name, subject, body_html, sequence_step")
      .lte("scheduled_for", new Date().toISOString())
      .is("sent_at", null)
      .is("skipped_at", null)
      .order("scheduled_for", { ascending: true })
      .limit(Number.isFinite(limit) ? Math.max(1, Math.min(limit, 100)) : 25);

    if (dueError) throw dueError;

    let sent = 0;
    const errors: Array<{ id: string; message: string }> = [];

    for (const followup of dueFollowups || []) {
      try {
        await sendEmail(followup.email, followup.name, followup.subject, followup.body_html);
        const now = new Date().toISOString();

        await supabase
          .from("family_squares_followup_queue")
          .update({ sent_at: now, error_message: null })
          .eq("id", followup.id);

        if (followup.registration_id) {
          const { data: nextQueued } = await supabase
            .from("family_squares_followup_queue")
            .select("scheduled_for")
            .eq("registration_id", followup.registration_id)
            .is("sent_at", null)
            .is("skipped_at", null)
            .order("scheduled_for", { ascending: true })
            .limit(1)
            .maybeSingle();

          await supabase
            .from("zoom_meeting_registrations")
            .update({
              last_followup_at: now,
              next_followup_at: nextQueued?.scheduled_for || null,
              followup_sequence_status: nextQueued ? "active" : "complete",
            })
            .eq("id", followup.registration_id);
        }

        sent += 1;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errors.push({ id: followup.id, message });
        await supabase
          .from("family_squares_followup_queue")
          .update({ error_message: message })
          .eq("id", followup.id);
      }
    }

    return new Response(JSON.stringify({ sent, errors }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("process-family-squares-followups error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
