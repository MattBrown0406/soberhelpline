import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";

const membershipBenefits = `
<div style="background-color: #f0fdf4; border-radius: 8px; padding: 24px; margin: 20px 0;">
  <h2 style="color: #166534; margin-top: 0; font-size: 20px;">🎉 Your Membership Benefits</h2>
  <p style="color: #374151; margin-bottom: 16px;">As a Sober Helpline Family Member, you now have full access to:</p>
  
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <strong style="color: #1e40af;">📅 Free Monday Night Zoom Support Calls</strong><br/>
        <span style="color: #6b7280; font-size: 14px;">Live weekly group support calls led by professionals — connect with other families who understand</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <strong style="color: #1e40af;">📚 60+ Family Education Guides</strong><br/>
        <span style="color: #6b7280; font-size: 14px;">Clinically-grounded resources covering boundaries, enabling, communication, treatment options, and more</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <strong style="color: #1e40af;">🧘 Guided Meditations</strong><br/>
        <span style="color: #6b7280; font-size: 14px;">Audio meditations designed specifically for families dealing with a loved one's addiction</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <strong style="color: #1e40af;">🛠️ Interactive Worksheets & Assessments</strong><br/>
        <span style="color: #6b7280; font-size: 14px;">Boundary-setting worksheets, enabling behavior audits, family readiness assessments, and more</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <strong style="color: #1e40af;">🤖 AI-Powered Support Tools</strong><br/>
        <span style="color: #6b7280; font-size: 14px;">AI Boundary Coach, Treatment Navigator, Relapse Response Guide, and Life Coach — available 24/7</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <strong style="color: #1e40af;">💬 Private Family Support Forum</strong><br/>
        <span style="color: #6b7280; font-size: 14px;">A safe, moderated community of families going through similar experiences — you are not alone</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <strong style="color: #1e40af;">🎥 Zoom Meeting Recordings</strong><br/>
        <span style="color: #6b7280; font-size: 14px;">Access recordings of past support calls to watch on your own schedule</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px 0;">
        <strong style="color: #1e40af;">📋 On-Demand Coaching</strong><br/>
        <span style="color: #6b7280; font-size: 14px;">Book one-on-one sessions with experienced family recovery coaches</span>
      </td>
    </tr>
  </table>
</div>
`;

function buildNewUserEmail(email: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1e3a5f; font-size: 28px; margin-bottom: 8px;">Welcome to the Sober Helpline Family</h1>
      <p style="color: #6b7280; font-size: 16px;">You've been given a free membership — here's how to get started</p>
    </div>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Hi there,
    </p>
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Great news! You've been granted a <strong>free Sober Helpline Family Membership</strong>. This gives you full access to all of our family support resources — at no cost to you.
    </p>
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      To get started, you'll need to create your free account. It only takes a minute:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://soberhelpline.com/auth" 
         style="display: inline-block; background-color: #1e3a5f; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: bold;">
        Create Your Free Account
      </a>
    </div>

    <div style="background-color: #eff6ff; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="color: #1e40af; font-weight: bold; margin-top: 0;">📝 How to set up your account:</p>
      <ol style="color: #374151; font-size: 14px; line-height: 1.8; padding-left: 20px; margin-bottom: 0;">
        <li>Click the button above or go to <a href="https://soberhelpline.com/auth" style="color: #1e40af;">soberhelpline.com/auth</a></li>
        <li>Click <strong>"Sign Up"</strong> and use this email address: <strong>${email}</strong></li>
        <li>Enter your first name, last name, and create a password</li>
        <li>Check your inbox for a verification email and click the link to confirm</li>
        <li>Once verified, log in and your membership will be activated automatically!</li>
      </ol>
    </div>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      <strong>Important:</strong> Please make sure to sign up using this exact email address (<strong>${email}</strong>) so your free membership is applied automatically.
    </p>

    ${membershipBenefits}

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      We encourage you to start exploring these resources right away. Whether you're looking for guidance on setting boundaries, understanding treatment options, or simply connecting with others who understand — we're here for you.
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      You don't have to navigate this alone. 💙
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Warmly,<br/>
      <strong>The Sober Helpline Team</strong>
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      Sober Helpline — Family Support for Addiction Recovery<br/>
      <a href="https://soberhelpline.com" style="color: #9ca3af;">soberhelpline.com</a>
    </p>
  </div>
</body>
</html>
  `;
}

function buildExistingUserEmail(firstName: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1e3a5f; font-size: 28px; margin-bottom: 8px;">Your Membership Is Now Active! 🎉</h1>
      <p style="color: #6b7280; font-size: 16px;">You now have full access to all Sober Helpline family resources</p>
    </div>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Hi ${firstName},
    </p>
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Great news! You've been granted a <strong>free Sober Helpline Family Membership</strong>. Your account is already set up and your membership is now active — you can start using everything right away.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://soberhelpline.com/family-education" 
         style="display: inline-block; background-color: #1e3a5f; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: bold;">
        Start Exploring Now
      </a>
    </div>

    ${membershipBenefits}

    <div style="background-color: #eff6ff; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="color: #1e40af; font-weight: bold; margin-top: 0;">🚀 Quick Start Suggestions:</p>
      <ul style="color: #374151; font-size: 14px; line-height: 1.8; padding-left: 20px; margin-bottom: 0;">
        <li><a href="https://soberhelpline.com/family-education" style="color: #1e40af;">Browse the Education Library</a> — Start with the guides most relevant to your situation</li>
        <li><a href="https://soberhelpline.com/monday-zoom" style="color: #1e40af;">Register for Monday Night Zoom</a> — Join our weekly live support call</li>
        <li><a href="https://soberhelpline.com/family-forum" style="color: #1e40af;">Visit the Family Forum</a> — Introduce yourself and connect with others</li>
        <li><a href="https://soberhelpline.com/ai-boundary-coach" style="color: #1e40af;">Try the AI Boundary Coach</a> — Get personalized boundary-setting guidance</li>
      </ul>
    </div>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      We encourage you to start taking advantage of these resources immediately. Every step you take toward understanding and supporting your family's recovery journey matters.
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      You don't have to navigate this alone. 💙
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Warmly,<br/>
      <strong>The Sober Helpline Team</strong>
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
      Sober Helpline — Family Support for Addiction Recovery<br/>
      <a href="https://soberhelpline.com" style="color: #9ca3af;">soberhelpline.com</a>
    </p>
  </div>
</body>
</html>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    const { email, type, firstName } = await req.json();

    if (!email || !type) {
      throw new Error("Missing required fields: email, type");
    }

    let subject: string;
    let htmlContent: string;

    if (type === "new_user") {
      subject = "You've Been Granted a Free Sober Helpline Family Membership!";
      htmlContent = buildNewUserEmail(email);
    } else if (type === "existing_user") {
      subject = "Your Sober Helpline Family Membership Is Now Active!";
      htmlContent = buildExistingUserEmail(firstName || "there");
    } else {
      throw new Error("Invalid email type");
    }

    const sendgridResponse = await fetch(SENDGRID_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: {
          email: "matt@soberhelpline.com",
          name: "Sober Helpline",
        },
        subject,
        content: [{ type: "text/html", value: htmlContent }],
      }),
    });

    if (!sendgridResponse.ok) {
      const errorText = await sendgridResponse.text();
      throw new Error(`SendGrid error [${sendgridResponse.status}]: ${errorText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending free membership email:", error);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
