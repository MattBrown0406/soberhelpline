import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto as stdCrypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

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

async function isAuthorized(req: Request, submittedEmail: string): Promise<boolean> {
  // Trusted server-to-server calls (other edge functions) pass the
  // service-role key as Authorization.
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const authHeader = req.headers.get("Authorization") ?? "";
  if (serviceKey && authHeader === `Bearer ${serviceKey}`) return true;

  if (!authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.replace("Bearer ", "");

  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    serviceKey,
  );
  const { data, error } = await adminClient.auth.getUser(token);
  if (error || !data?.user) return false;

  // Admins can add any address; everyone else can only add their own.
  const { data: roleRow } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (roleRow) return true;

  return (data.user.email || "").toLowerCase().trim() === submittedEmail.toLowerCase().trim();
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

    if (!(await isAuthorized(req, email))) {
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
  const hashBuffer = await stdCrypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
