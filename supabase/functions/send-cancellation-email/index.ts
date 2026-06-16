import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

function escapeHtml(text: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, name, accessUntilDate } = await req.json();

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not configured");

    const safeName = escapeHtml(String(name ?? ""));
    const safeAccessDate = accessUntilDate ? escapeHtml(String(accessUntilDate)) : null;

    const accessMessage = safeAccessDate
      ? `<li>You will continue to have full access to the Family Forum and member resources until <strong>${safeAccessDate}</strong>.</li>`
      : `<li>Your access to the Family Forum and member resources has been removed.</li>`;

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
        subject: "Your Sober Helpline Membership Has Been Cancelled",
        content: [{
          type: "text/html",
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #1a365d; font-size: 24px;">Membership Cancellation Confirmation</h1>
              
              <p>Dear ${safeName},</p>
              
              <p>This email is to confirm that your Sober Helpline Family Membership has been successfully cancelled per your request.</p>
              
              <p>Please note the following:</p>
              <ul>
                ${accessMessage}
                <li>If you have an active PayPal subscription, please also cancel it directly through your PayPal account to stop future billing.</li>
                <li>Any content you posted in the forum will remain unless you'd like it removed — just let us know.</li>
              </ul>
              
              <p>We truly appreciate the time you spent as part of our community. If you ever decide to rejoin or need support in the future, we're always here for you.</p>
              
              <p>If you have any questions or believe this was done in error, please don't hesitate to reach out to us at <a href="mailto:matt@soberhelpline.com">matt@soberhelpline.com</a>.</p>
              
              <p style="margin-top: 30px;">With care,<br/>
              <strong>Matt</strong><br/>
              Sober Helpline</p>
              
              <hr style="margin-top: 40px; border: none; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 12px; color: #718096;">
                Sober Helpline — Supporting Families Through Recovery<br/>
                <a href="https://soberhelpline.com" style="color: #2563eb;">soberhelpline.com</a>
              </p>
            </div>
          `,
        }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`SendGrid error [${response.status}]: ${err}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending cancellation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
