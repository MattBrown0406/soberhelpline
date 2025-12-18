import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebinarRegistrationRequest {
  email: string;
  firstName: string;
  lastName: string;
  webinarTitle?: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, webinarTitle }: WebinarRegistrationRequest = await req.json();

    console.log("Adding subscriber to Webinar Mailchimp list:", { email, firstName, lastName, webinarTitle });

    const apiKey = Deno.env.get("MAILCHIMP_API_KEY");
    const audienceId = Deno.env.get("MAILCHIMP_WEBINAR_AUDIENCE_ID");

    if (!apiKey || !audienceId) {
      console.error("Missing Mailchimp webinar configuration");
      throw new Error("Mailchimp webinar configuration missing");
    }

    // Extract datacenter from API key (format: xxx-usX)
    const datacenter = apiKey.split("-").pop();
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

    const tags = ["Webinar Registrant"];
    if (webinarTitle) {
      tags.push(webinarTitle);
    }

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
        tags: tags,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle "already subscribed" gracefully
      if (data.title === "Member Exists") {
        console.log("Member already exists in Webinar list, updating tags");
        
        // Update existing member with PATCH to add new webinar tag
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
          }),
        });

        // Add tags separately
        if (webinarTitle) {
          const tagsUrl = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members/${memberHash}/tags`;
          await fetch(tagsUrl, {
            method: "POST",
            headers: {
              "Authorization": `apikey ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tags: [{ name: webinarTitle, status: "active" }],
            }),
          });
        }

        if (updateResponse.ok) {
          return new Response(
            JSON.stringify({ success: true, message: "Member updated successfully" }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }
      
      console.error("Mailchimp API error:", data);
      throw new Error(data.detail || "Failed to add subscriber to Mailchimp webinar list");
    }

    console.log("Successfully added subscriber to Webinar Mailchimp list:", data.id);

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in add-to-webinar-list function:", error);
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
