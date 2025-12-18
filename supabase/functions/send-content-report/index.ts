import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.5.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContentReportRequest {
  reportedUsername: string;
  postContent: string;
  concernDetails: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportedUsername, postContent, concernDetails }: ContentReportRequest = await req.json();

    console.log("Sending content report email");

    // Validate inputs
    if (!reportedUsername || !postContent || !concernDetails) {
      throw new Error("Missing required fields");
    }

    // Sanitize inputs for email
    const sanitizedUsername = reportedUsername.substring(0, 100);
    const sanitizedPostContent = postContent.substring(0, 2000);
    const sanitizedConcernDetails = concernDetails.substring(0, 1000);

    const emailResponse = await resend.emails.send({
      from: "Sober Helpline Forum <onboarding@resend.dev>",
      to: ["matt@soberhelpline.com"],
      subject: "⚠️ Forum Content Report - Action Required",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">⚠️ Content Report</h1>
            <p style="margin: 10px 0 0;">Anonymous report from the Family Forum</p>
          </div>
          
          <div style="padding: 20px; background-color: #f9fafb;">
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <h2 style="color: #1f2937; margin-top: 0;">Reported User</h2>
              <p style="color: #4b5563; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
                <strong>Username:</strong> ${sanitizedUsername}
              </p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <h2 style="color: #1f2937; margin-top: 0;">Reported Content</h2>
              <div style="color: #4b5563; background-color: #fef2f2; padding: 15px; border-radius: 4px; border-left: 4px solid #dc2626;">
                ${sanitizedPostContent.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <h2 style="color: #1f2937; margin-top: 0;">Reason for Report</h2>
              <p style="color: #4b5563; background-color: #f3f4f6; padding: 15px; border-radius: 4px;">
                ${sanitizedConcernDetails.replace(/\n/g, '<br>')}
              </p>
            </div>
          </div>
          
          <div style="background-color: #1f2937; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">This report was submitted anonymously through the Sober Helpline Family Forum.</p>
            <p style="margin: 10px 0 0;">Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST</p>
          </div>
        </div>
      `,
    });

    console.log("Content report email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-content-report function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
