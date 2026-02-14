import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, email, zoomLink } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);

    const hasLink = zoomLink && zoomLink.trim() !== "";

    const zoomSection = hasLink
      ? `
        <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h2 style="margin: 0 0 10px 0; color: #166534;">🎥 Your Zoom Meeting Link</h2>
          <p style="margin: 0 0 15px 0; color: #15803d;">Join us Monday evening using the link below:</p>
          <a href="${escapeHtml(zoomLink)}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Join Zoom Meeting
          </a>
          <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
            Link: ${escapeHtml(zoomLink)}
          </p>
        </div>
      `
      : `
        <div style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; color: #854d0e;">The Zoom meeting link will be sent to you before the meeting. Please check your email on Monday.</p>
        </div>
      `;

    const emailResponse = await resend.emails.send({
      from: "Sober Helpline <matt@soberhelpline.com>",
      to: [email],
      subject: "You're Registered! Monday Night Family Support Zoom Meeting",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
          <h1 style="color: #166534;">Welcome, ${safeName}!</h1>
          <p>Thank you for registering for the <strong>Monday Night Family Support Zoom Meeting</strong>.</p>
          <p>This is a free, supportive space for families navigating addiction. You'll have the opportunity to ask questions, share experiences, and connect with others who understand.</p>
          
          ${zoomSection}
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            If you have any questions, call us at <strong>(541) 241-5886</strong>.
          </p>
          <p style="color: #6b7280; font-size: 12px;">
            Sober Helpline — Supporting Families Through Recovery
          </p>
        </div>
      `,
    });

    console.log("Zoom registration email sent:", emailResponse);

    // Also notify admin
    await resend.emails.send({
      from: "Sober Helpline <matt@soberhelpline.com>",
      to: ["matt@soberhelpline.com"],
      subject: `New Zoom Meeting Registration: ${safeName}`,
      html: `
        <h2>New Monday Night Zoom Registration</h2>
        <ul>
          <li><strong>Name:</strong> ${safeName}</li>
          <li><strong>Email:</strong> ${safeEmail}</li>
        </ul>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending zoom registration email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
