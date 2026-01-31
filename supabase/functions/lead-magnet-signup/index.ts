import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadMagnetRequest {
  email: string;
  firstName: string;
  source?: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, source = "lead-magnet" }: LeadMagnetRequest = await req.json();

    // Basic validation
    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!firstName || firstName.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "First name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Lead magnet signup:", { email, firstName, source });

    const apiKey = Deno.env.get("MAILCHIMP_API_KEY");
    const audienceId = Deno.env.get("MAILCHIMP_AUDIENCE_ID");

    if (!apiKey || !audienceId) {
      console.error("Missing Mailchimp configuration");
      throw new Error("Email service configuration missing");
    }

    const datacenter = apiKey.split("-").pop();
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `apikey ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email.toLowerCase().trim(),
        status: "subscribed",
        merge_fields: {
          FNAME: firstName.trim(),
        },
        tags: ["Lead Magnet", "Free Guide"],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.title === "Member Exists") {
        // Already subscribed - still give them the guide
        console.log("Member already exists, allowing download");
        return new Response(
          JSON.stringify({ success: true, message: "Welcome back! Here's your guide." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.error("Mailchimp API error:", data);
      throw new Error(data.detail || "Failed to subscribe");
    }

    console.log("Successfully added lead:", data.id);

    return new Response(
      JSON.stringify({ success: true, message: "You're in! Check your email." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in lead-magnet-signup:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
