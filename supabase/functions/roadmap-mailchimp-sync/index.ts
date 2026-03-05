import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAILCHIMP_LIST_ID = "1078537d9b";

const stageTagMap: Record<string, string> = {
  suspicion: "Roadmap - Suspicion",
  confirmation: "Roadmap - Confirmation",
  crisis: "Roadmap - Crisis",
  "pre-intervention": "Roadmap - Pre-Intervention",
  treatment: "Roadmap - Treatment",
  "early-recovery": "Roadmap - Early Recovery",
  "long-term-recovery": "Roadmap - Long-Term Recovery",
  relapse: "Roadmap - Relapse",
};

async function md5(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("MAILCHIMP_API_KEY");
    if (!apiKey) {
      throw new Error("MAILCHIMP_API_KEY not configured");
    }

    const { email, stage, relationship, substances } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subscriberHash = await md5(email.toLowerCase().trim());
    const datacenter = apiKey.split("-").pop();
    const baseUrl = `https://${datacenter}.api.mailchimp.com/3.0`;

    console.log("Syncing roadmap user to Mailchimp:", { email, stage });

    // Step 1: Upsert subscriber
    const upsertRes = await fetch(
      `${baseUrl}/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}`,
      {
        method: "PUT",
        headers: {
          Authorization: `apikey ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email.toLowerCase().trim(),
          status_if_new: "subscribed",
          merge_fields: {
            ROADSTAGE: stage || "",
          },
        }),
      }
    );

    if (!upsertRes.ok) {
      const err = await upsertRes.json();
      console.error("Mailchimp upsert failed:", err);
      throw new Error(err.detail || "Mailchimp upsert failed");
    }

    console.log("Mailchimp upsert success");

    // Step 2: Apply tags
    const tags: { name: string; status: string }[] = [
      { name: "Roadmap User", status: "active" },
    ];

    if (stage && stageTagMap[stage]) {
      tags.push({ name: stageTagMap[stage], status: "active" });
    }

    const tagRes = await fetch(
      `${baseUrl}/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}/tags`,
      {
        method: "POST",
        headers: {
          Authorization: `apikey ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags }),
      }
    );

    if (!tagRes.ok) {
      console.error("Mailchimp tags error:", await tagRes.text());
    } else {
      console.log("Tags applied:", tags.map((t) => t.name));
    }

    return new Response(
      JSON.stringify({ success: true, email, stage, tags_applied: tags.map((t) => t.name) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in roadmap-mailchimp-sync:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
