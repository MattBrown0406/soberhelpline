import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Md5 } from "https://deno.land/std@0.190.0/hash/md5.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MailchimpRequest {
  email: string;
  firstName: string;
  lastName: string;
  tags?: string[];
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, tags = ["Coaching Clients"] }: MailchimpRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Upserting contact in Mailchimp:", { email, firstName, lastName, tags });

    const apiKey = Deno.env.get("MAILCHIMP_API_KEY");
    const audienceId = "1078537d9b";

    if (!apiKey) {
      throw new Error("MAILCHIMP_API_KEY not configured");
    }

    // MD5 hash of lowercase email for upsert
    const emailHash = await createMD5Hash(email.toLowerCase().trim());
    const datacenter = apiKey.split("-").pop();
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members/${emailHash}`;

    // PUT = upsert: creates if new, updates if exists
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `apikey ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email.toLowerCase().trim(),
        status_if_new: "subscribed",
        merge_fields: {
          FNAME: firstName || "",
          LNAME: lastName || "",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Mailchimp API error:", data);
      throw new Error(data.detail || "Failed to upsert contact in Mailchimp");
    }

    console.log("Mailchimp upsert success:", data.id);

    // Apply tags separately
    if (tags.length > 0) {
      const tagsUrl = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members/${emailHash}/tags`;
      const tagsResponse = await fetch(tagsUrl, {
        method: "POST",
        headers: {
          "Authorization": `apikey ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tags: tags.map(name => ({ name, status: "active" })),
        }),
      });

      if (!tagsResponse.ok) {
        console.error("Mailchimp tags error:", await tagsResponse.text());
      } else {
        console.log("Tags applied:", tags);
      }
    }

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

async function createMD5Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
