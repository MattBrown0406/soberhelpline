import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.5.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  providerName: string;
  category: string;
  email: string;
  phoneNumber: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { providerName, category, email, phoneNumber }: NotificationRequest = await req.json();
    
    const backendUrl = `https://lovable.dev/projects/d06fcc5d-ea53-4bb5-8116-170ffa8e9ee1/backend`;

    const emailResponse = await resend.emails.send({
      from: "Sober Helpline <onboarding@resend.dev>",
      to: ["matt@soberhelpline.com", "matt@freedominterventions.com"],
      subject: `New Provider Application: ${providerName}`,
      html: `
        <h1>New Provider Application Submitted</h1>
        <p>A new provider has submitted an application on Sober Helpline.</p>
        
        <h2>Provider Details:</h2>
        <ul>
          <li><strong>Provider Name:</strong> ${providerName}</li>
          <li><strong>Category:</strong> ${category}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone Number:</strong> ${phoneNumber}</li>
        </ul>
        
        <p>
          <a href="${backendUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            View Provider Submissions
          </a>
        </p>
        
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          Click the button above to access the provider_submissions table and review this application.
        </p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-provider-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
