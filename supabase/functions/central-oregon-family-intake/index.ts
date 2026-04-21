import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface IntakeRequest {
  program?: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  relationship?: string;
  attendanceStatus?: "referred-seat" | "need-seat" | "need-scholarship";
  referredBy?: string;
  reasonForComing?: string;
  householdSummary?: string;
  next_step?: string;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendEmail(subject: string, htmlContent: string) {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY is not configured");

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [
            { email: "matt@soberhelpline.com" },
            { email: "matt@freedominterventions.com" },
          ],
        },
      ],
      from: {
        email: "matt@soberhelpline.com",
        name: "Sober Helpline",
      },
      reply_to: {
        email: "matt@soberhelpline.com",
        name: "Sober Helpline",
      },
      subject,
      content: [{ type: "text/html", value: htmlContent }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid API error [${response.status}]: ${errorText}`);
  }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: IntakeRequest = await req.json();

    if (!payload.name || !payload.email || !payload.city || !payload.relationship || !payload.referredBy || !payload.reasonForComing || !payload.attendanceStatus) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const attendanceLabel =
      payload.attendanceStatus === "referred-seat"
        ? "Referred family requesting seat"
        : payload.attendanceStatus === "need-scholarship"
          ? "Unattached family requesting hardship or scholarship review"
          : "Unattached family requesting seat";

    await sendEmail(
      `Central Oregon Family Program Intake: ${payload.name}`,
      `
        <h1>Central Oregon Family Program Intake</h1>
        <p>A new family intake was submitted on Sober Helpline.</p>
        <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
          <tr><td><strong>Program</strong></td><td>${escapeHtml(payload.program || "Central Oregon Family Program")}</td></tr>
          <tr><td><strong>Name</strong></td><td>${escapeHtml(payload.name)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(payload.email)}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${escapeHtml(payload.phone || "Not provided")}</td></tr>
          <tr><td><strong>City</strong></td><td>${escapeHtml(payload.city)}</td></tr>
          <tr><td><strong>Relationship</strong></td><td>${escapeHtml(payload.relationship)}</td></tr>
          <tr><td><strong>Referral source</strong></td><td>${escapeHtml(payload.referredBy)}</td></tr>
          <tr><td><strong>Branch</strong></td><td>${escapeHtml(attendanceLabel)}</td></tr>
          <tr><td><strong>Suggested next step</strong></td><td>${escapeHtml(payload.next_step || "Review intake")}</td></tr>
        </table>
        <h2>Brief assessment</h2>
        <p>${escapeHtml(payload.reasonForComing).replaceAll("\n", "<br />")}</p>
        <h2>Additional notes</h2>
        <p>${escapeHtml(payload.householdSummary || "None provided").replaceAll("\n", "<br />")}</p>
      `,
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in central-oregon-family-intake:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
