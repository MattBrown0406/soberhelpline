import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authHeader = req.headers.get("Authorization") ?? "";

    // Accept service-role key OR cron_secret in the request body
    let authorized = serviceKey !== "" && authHeader === `Bearer ${serviceKey}`;

    const body = await req.json();

    if (!authorized && body.cron_secret) {
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        serviceKey,
      );
      const { data: setting } = await adminClient
        .from("site_settings")
        .select("value")
        .eq("key", "cron_secret")
        .maybeSingle();
      authorized = setting?.value != null && setting.value === body.cron_secret;
    }

    if (!authorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, firstName } = body;
    if (!email) {
      return new Response(JSON.stringify({ error: "email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not configured");

    const greeting = firstName ? `Hi ${firstName},` : "Welcome,";

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
  <img src="https://soberhelpline.com/logo.png" alt="Sober Helpline" style="height:40px;margin-bottom:24px;" />
  <h1 style="color:#1a5fa8;font-size:22px;margin-bottom:8px;">You're in — welcome to the family.</h1>
  <p>${greeting}</p>
  <p>
    You now have full access to the Sober Helpline member library. Here's where to start:
  </p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;">
    <tr>
      <td style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;">
        <strong>1. Take the 4-step path</strong><br/>
        <a href="https://soberhelpline.com/family-education" style="color:#1a5fa8;">Family Education Center</a>
        has a "Start Here" guide that walks you through the four most important things to understand first.
      </td>
    </tr>
    <tr><td style="height:8px;"></td></tr>
    <tr>
      <td style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;">
        <strong>2. Join a Monday meeting</strong><br/>
        Every Monday at 7 PM PT we host a live family support Zoom.
        <a href="https://soberhelpline.com/monday-zoom-registration" style="color:#1a5fa8;">Get the link here.</a>
      </td>
    </tr>
    <tr><td style="height:8px;"></td></tr>
    <tr>
      <td style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;">
        <strong>3. See your member dashboard</strong><br/>
        <a href="https://soberhelpline.com/member-home" style="color:#1a5fa8;">soberhelpline.com/member-home</a>
        shows your progress and quick links to everything.
      </td>
    </tr>
  </table>
  <p>
    If you ever have questions, just reply to this email. We read every one.
  </p>
  <p style="color:#6b7280;font-size:13px;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px;">
    Sober Helpline · <a href="https://soberhelpline.com" style="color:#6b7280;">soberhelpline.com</a>
  </p>
</body>
</html>`;

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: "matt@soberhelpline.com", name: "Matt — Sober Helpline" },
        subject: "Welcome to Sober Helpline — here's where to start",
        content: [{ type: "text/html", value: html }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`SendGrid error: ${err}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-welcome-email error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
