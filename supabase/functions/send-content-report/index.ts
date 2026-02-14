import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContentReportRequest {
  reportedUsername: string;
  postContent: string;
  concernDetails: string;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function sendEmail(to: string[], subject: string, htmlContent: string, from = "Sober Helpline <matt@soberhelpline.com>") {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY is not configured");

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: to.map(email => ({ email })) }],
      from: { email: from.match(/<(.+)>/)?.[1] || from, name: from.match(/^(.+?)\s*</)?.[1] || "Sober Helpline" },
      subject,
      content: [{ type: "text/html", value: htmlContent }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid API error [${response.status}]: ${errorText}`);
  }

  return { success: true };
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: 'Unauthorized - missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: `Bearer ${token}` }
        }
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Authenticated user submitting content report:", user.id);

    const { reportedUsername, postContent, concernDetails }: ContentReportRequest = await req.json();

    if (!reportedUsername || !postContent || !concernDetails) {
      throw new Error("Missing required fields");
    }

    const sanitizedUsername = reportedUsername.substring(0, 100);
    const sanitizedPostContent = postContent.substring(0, 2000);
    const sanitizedConcernDetails = concernDetails.substring(0, 1000);

    const emailResponse = await sendEmail(
      ["matt@soberhelpline.com"],
      "⚠️ Forum Content Report - Action Required",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">⚠️ Content Report</h1>
            <p style="margin: 10px 0 0;">Report from authenticated user in Family Forum</p>
          </div>
          
          <div style="padding: 20px; background-color: #f9fafb;">
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <h2 style="color: #1f2937; margin-top: 0;">Reporter Information</h2>
              <p style="color: #4b5563; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
                <strong>Reporter User ID:</strong> ${user.id}
              </p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <h2 style="color: #1f2937; margin-top: 0;">Reported User</h2>
              <p style="color: #4b5563; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
                <strong>Username:</strong> ${escapeHtml(sanitizedUsername)}
              </p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <h2 style="color: #1f2937; margin-top: 0;">Reported Content</h2>
              <div style="color: #4b5563; background-color: #fef2f2; padding: 15px; border-radius: 4px; border-left: 4px solid #dc2626;">
                ${escapeHtml(sanitizedPostContent).replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <h2 style="color: #1f2937; margin-top: 0;">Reason for Report</h2>
              <p style="color: #4b5563; background-color: #f3f4f6; padding: 15px; border-radius: 4px;">
                ${escapeHtml(sanitizedConcernDetails).replace(/\n/g, '<br>')}
              </p>
            </div>
          </div>
          
          <div style="background-color: #1f2937; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">This report was submitted by an authenticated user through the Sober Helpline Family Forum.</p>
            <p style="margin: 10px 0 0;">Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST</p>
          </div>
        </div>
      `,
      "Sober Helpline Forum <matt@soberhelpline.com>"
    );

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
