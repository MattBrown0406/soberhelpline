import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sendgridKey = Deno.env.get("SENDGRID_API_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        return new Response(JSON.stringify({ error: "Admin access required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { survey_id } = await req.json();
    if (!survey_id) {
      return new Response(JSON.stringify({ error: "survey_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get survey details
    const { data: survey } = await supabase
      .from("surveys")
      .select("title")
      .eq("id", survey_id)
      .single();

    if (!survey) {
      return new Response(JSON.stringify({ error: "Survey not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get all Zoom registrants from the past 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: registrants } = await supabase
      .from("zoom_meeting_registrations")
      .select("email, first_name")
      .gte("created_at", thirtyDaysAgo.toISOString());

    if (!registrants || registrants.length === 0) {
      return new Response(
        JSON.stringify({ error: "No registrants found from the past 30 days", sent_count: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Deduplicate by email
    const uniqueEmails = new Map<string, string>();
    registrants.forEach((r) => {
      if (r.email && !uniqueEmails.has(r.email.toLowerCase())) {
        uniqueEmails.set(r.email.toLowerCase(), r.first_name || "Friend");
      }
    });

    const surveyUrl = "https://soberhelpline.lovable.app/survey";

    let sentCount = 0;
    for (const [email, firstName] of uniqueEmails.entries()) {
      const emailBody = {
        personalizations: [{ to: [{ email }] }],
        from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
        subject: `Your Feedback Matters — ${survey.title}`,
        content: [
          {
            type: "text/html",
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #166534; font-size: 24px; margin-bottom: 8px;">SoberHelpline.com</h1>
                  <p style="color: #6b7280; font-size: 14px;">Hope. Help. Recovery.</p>
                </div>
                <p style="font-size: 16px; color: #374151;">Hi ${firstName},</p>
                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  Thank you for being part of our Monday Night Family Support meetings. 
                  Your experience and feedback help us make these sessions better for everyone.
                </p>
                <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                  We'd love to hear from you! Please take a moment to complete our brief survey:
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${surveyUrl}" 
                     style="background-color: #166534; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
                    Take the Survey
                  </a>
                </div>
                <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
                  The survey is completely anonymous and takes about 2 minutes to complete.
                </p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                  SoberHelpline.com — Monday Night Family Support<br>
                  Every Monday at 7:00 PM PST
                </p>
              </div>
            `,
          },
        ],
      };

      const sgRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendgridKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailBody),
      });

      if (sgRes.ok || sgRes.status === 202) {
        sentCount++;
      } else {
        console.error(`Failed to send to ${email}:`, await sgRes.text());
      }

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 100));
    }

    return new Response(
      JSON.stringify({ success: true, sent_count: sentCount, total_unique: uniqueEmails.size }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-survey-emails:", error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
