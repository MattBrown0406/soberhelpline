import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { enqueueSpineEvent } from "../_shared/spine.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadMagnetRequest {
  email: string;
  firstName: string;
  phoneNumber?: string;
  smsOptIn?: boolean;
  source?: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, phoneNumber, smsOptIn, source = "lead-magnet" }: LeadMagnetRequest = await req.json();

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

    // Validate phone number if SMS opt-in is enabled
    if (smsOptIn && (!phoneNumber || phoneNumber.trim().length < 10)) {
      return new Response(
        JSON.stringify({ error: "Valid phone number is required for SMS notifications" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Lead magnet signup:", { email, firstName, phoneNumber: smsOptIn ? phoneNumber : undefined, smsOptIn, source });

    const apiKey = Deno.env.get("MAILCHIMP_API_KEY");
    const audienceId = Deno.env.get("MAILCHIMP_AUDIENCE_ID");

    if (!apiKey || !audienceId) {
      console.error("Missing Mailchimp configuration");
      throw new Error("Email service configuration missing");
    }

    const datacenter = apiKey.split("-").pop();
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

    // Build merge fields - include phone if opted in
    const mergeFields: Record<string, string> = {
      FNAME: firstName.trim(),
    };
    
    if (smsOptIn && phoneNumber) {
      mergeFields.PHONE = phoneNumber.trim();
    }

    // Build tags array
    const tags = ["Lead Magnet", "Free Guide"];
    if (smsOptIn) {
      tags.push("SMS Opt-In");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `apikey ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email.toLowerCase().trim(),
        status: "subscribed",
        merge_fields: mergeFields,
        tags: tags,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.title === "Member Exists") {
        // Update existing member with new phone/SMS opt-in if provided
        if (smsOptIn && phoneNumber) {
          const memberHash = await createMD5Hash(email.toLowerCase().trim());
          const updateUrl = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members/${memberHash}`;
          
          await fetch(updateUrl, {
            method: "PATCH",
            headers: {
              "Authorization": `apikey ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              merge_fields: {
                FNAME: firstName.trim(),
                PHONE: phoneNumber.trim(),
              },
            }),
          });

          // Add SMS Opt-In tag
          const tagsUrl = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members/${memberHash}/tags`;
          await fetch(tagsUrl, {
            method: "POST",
            headers: {
              "Authorization": `apikey ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tags: [{ name: "SMS Opt-In", status: "active" }],
            }),
          });
        }
        
        console.log("Member already exists, updated with SMS opt-in");
        await enqueueSpineEvent("lead_captured", {
          email: email.toLowerCase().trim(),
          phone: smsOptIn && phoneNumber ? phoneNumber.trim() : null,
          name: firstName.trim(),
          props: { source, sms_opt_in: smsOptIn ?? false },
        });
        return new Response(
          JSON.stringify({ success: true, message: "Welcome back! Here's your guide." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.error("Mailchimp API error:", data);
      throw new Error(data.detail || "Failed to subscribe");
    }

    console.log("Successfully added lead:", data.id, smsOptIn ? "(with SMS opt-in)" : "");

    await enqueueSpineEvent("lead_captured", {
      email: email.toLowerCase().trim(),
      phone: smsOptIn && phoneNumber ? phoneNumber.trim() : null,
      name: firstName.trim(),
      props: { source, sms_opt_in: smsOptIn ?? false },
    });

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

// Helper function to create MD5 hash for Mailchimp member lookup
async function createMD5Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
