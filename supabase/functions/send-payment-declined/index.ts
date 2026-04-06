import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, name } = await req.json();

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not configured");

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
        subject: "Action Needed: Your Payment Was Declined — Sober Helpline Membership",
        content: [{
          type: "text/html",
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #1a365d; font-size: 24px;">Payment Update Needed</h1>
              
              <p>Dear ${name},</p>
              
              <p>We're reaching out because your most recent membership payment was <strong>declined</strong>. This can happen for a variety of reasons — an expired card, insufficient funds, or a bank security hold.</p>
              
              <p>Your Sober Helpline Family Membership is important to us, and we want to make sure you don't lose access to the Family Forum, weekly "The Family Squares" Zoom meetings, and all member resources.</p>
              
              <h2 style="color: #1a365d; font-size: 18px;">Option 1: Update Your Payment Method</h2>
              <p>To keep your membership active, please log in to your <strong>PayPal account</strong> and update your payment method for your Sober Helpline subscription:</p>
              <ol>
                <li>Log in to <a href="https://www.paypal.com" style="color: #2563eb;">PayPal.com</a></li>
                <li>Go to <strong>Settings → Payments → Manage Automatic Payments</strong></li>
                <li>Find your Sober Helpline subscription</li>
                <li>Update your payment method or card on file</li>
              </ol>
              <p>Once updated, your next billing attempt should process successfully and your membership will continue uninterrupted.</p>
              
              <h2 style="color: #1a365d; font-size: 18px;">Option 2: Cancel Your Membership</h2>
              <p>If you'd prefer to cancel your membership, simply <strong>reply to this email</strong> and let us know — we'll take care of everything for you. No hard feelings at all.</p>
              
              <p>If you have any questions or need help with either option, don't hesitate to reach out to me directly by replying to this email.</p>
              
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
    console.error("Error sending payment declined email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
