import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MailchimpRequest {
  email: string;
  firstName: string;
  lastName: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
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

    console.log("Authenticated user:", user.id);

    const { email, firstName, lastName }: MailchimpRequest = await req.json();

    console.log("Adding subscriber to Mailchimp:", { email, firstName, lastName });

    const apiKey = Deno.env.get("MAILCHIMP_API_KEY");
    const audienceId = Deno.env.get("MAILCHIMP_AUDIENCE_ID");

    if (!apiKey || !audienceId) {
      console.error("Missing Mailchimp configuration");
      throw new Error("Mailchimp configuration missing");
    }

    // Extract datacenter from API key (format: xxx-usX)
    const datacenter = apiKey.split("-").pop();
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `apikey ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
        tags: ["Webinar Reminders", "Family Member"],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle "already subscribed" gracefully
      if (data.title === "Member Exists") {
        console.log("Member already exists in Mailchimp, updating instead");
        
        // Update existing member with PATCH
        const memberHash = await createMD5Hash(email.toLowerCase());
        const updateUrl = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members/${memberHash}`;
        
        const updateResponse = await fetch(updateUrl, {
          method: "PATCH",
          headers: {
            "Authorization": `apikey ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName,
            },
            tags: ["Webinar Reminders", "Family Member"],
          }),
        });

        if (updateResponse.ok) {
          return new Response(
            JSON.stringify({ success: true, message: "Member updated successfully" }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }
      
      console.error("Mailchimp API error:", data);
      throw new Error(data.detail || "Failed to add subscriber to Mailchimp");
    }

    console.log("Successfully added subscriber to Mailchimp:", data.id);

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in add-to-mailchimp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});

// Helper function to create MD5 hash for Mailchimp member lookup
async function createMD5Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
