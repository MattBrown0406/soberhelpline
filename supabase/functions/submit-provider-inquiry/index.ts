import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(text: unknown): string {
  const s = text == null ? "" : String(text);
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return s.replace(/[&<>"']/g, (m) => map[m]);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      providerId,
      providerName,
      requesterName,
      relationship,
      phone,
      email,
      bestTime,
      note,
    } = body ?? {};

    if (!providerName || !requesterName || !relationship || !bestTime) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Insert inquiry
    const { error: insertError } = await supabase
      .from("provider_inquiries")
      .insert({
        provider_id: providerId ?? null,
        provider_name: providerName,
        requester_name: requesterName,
        relationship,
        phone: phone ?? null,
        email: email ?? null,
        best_time: bestTime,
        note: note ?? null,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`Failed to save inquiry: ${insertError.message}`);
    }

    // Look up provider contact info
    let providerEmail: string | null = null;
    let providerPhone: string | null = null;
    if (providerId) {
      const { data: provider } = await supabase
        .from("provider_submissions")
        .select("email, phone_number")
        .eq("id", providerId)
        .maybeSingle();
      if (provider) {
        providerEmail = provider.email ?? null;
        providerPhone = provider.phone_number ?? null;
      }
    }

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    const html = `
      <h1>New Provider Inquiry</h1>
      <h2>Provider</h2>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(providerName)}</li>
        <li><strong>ID:</strong> ${escapeHtml(providerId ?? "N/A")}</li>
        <li><strong>Provider Email:</strong> ${escapeHtml(providerEmail ?? "N/A")}</li>
        <li><strong>Provider Phone:</strong> ${escapeHtml(providerPhone ?? "N/A")}</li>
      </ul>
      <h2>Requester</h2>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(requesterName)}</li>
        <li><strong>Relationship:</strong> ${escapeHtml(relationship)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(phone ?? "N/A")}</li>
        <li><strong>Email:</strong> ${escapeHtml(email ?? "N/A")}</li>
        <li><strong>Best Time to Contact:</strong> ${escapeHtml(bestTime)}</li>
      </ul>
      <h2>Note</h2>
      <p>${escapeHtml(note ?? "")}</p>
    `;

    const sgRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              { email: "matt@soberhelpline.com" },
              { email: "matt@freedominterventions.com" },
            ],
          },
        ],
        from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
        subject: `New provider inquiry: ${providerName}`,
        content: [{ type: "text/html", value: html }],
      }),
    });

    if (!sgRes.ok) {
      const errText = await sgRes.text();
      console.error("SendGrid error:", sgRes.status, errText);
      throw new Error(`SendGrid API error [${sgRes.status}]: ${errText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("submit-provider-inquiry error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
