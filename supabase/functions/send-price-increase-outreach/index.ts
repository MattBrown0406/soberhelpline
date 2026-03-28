import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function sendEmail(to: string, subject: string, htmlContent: string) {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not configured");

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { "Authorization": `Bearer ${SENDGRID_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "matt@soberhelpline.com", name: "Matt — Sober Helpline" },
      subject,
      content: [{ type: "text/html", value: htmlContent }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`SendGrid error for ${to}: [${response.status}] ${errorText}`);
    return false;
  }
  return true;
}

function buildHtml(safeName: string): string {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
      <h1 style="color: #166534; font-size: 24px; margin-bottom: 16px;">Important Update: Membership Price Increasing in April</h1>
      
      <p>Hi ${safeName},</p>

      <p>I wanted to reach out personally because you've been a part of the Sober Helpline community — and I don't want you to miss this.</p>

      <p>Right now, <strong>Sober Helpline membership is just $14.99/month</strong>. But starting in April, as I begin adding more premium offerings to the site, the price will be increasing to <strong>$44.99/month</strong>.</p>

      <div style="background-color: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold; color: #166534;">
          🔒 Lock In $14.99/Month — Forever
        </p>
        <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151;">
          If you join now, <strong>your subscription price will remain at $14.99/month</strong> as a thank you for being an early supporter — for the entire duration of your membership with Sober Helpline.
        </p>
        <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151;">
          That's not a limited-time promo. It's a permanent rate for those who get in before the price goes up.
        </p>
        <div style="text-align: center;">
          <a href="https://soberhelpline.com/family-membership" style="display: inline-block; padding: 14px 36px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Join Now for $14.99/Month
          </a>
        </div>
      </div>

      <p style="font-size: 15px; font-weight: bold; color: #1f2937;">What's included in membership:</p>
      <ul style="color: #374151; font-size: 14px; line-height: 1.8;">
        <li>Full access to the <strong>member section</strong> of the site — education guides, AI tools, interactive worksheets, and more</li>
        <li><strong>$25 discount</strong> on every coaching session ($125 instead of $150)</li>
        <li>Access to the <strong>private family forum</strong> — connect with other families going through the same thing</li>
        <li>Join <strong>Monday Night Family Support Meetings</strong> without needing to register — just log in and join</li>
        <li>Access to <strong>meeting recordings</strong> so you never miss a session</li>
      </ul>

      <p>This community exists because families like yours showed up. I'd love to have you as a member — and I want to make sure you get the best possible price before it changes.</p>

      <p style="margin-top: 24px;">— Matt</p>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
        Questions? Call us at <strong>(541) 241-5886</strong>.
      </p>
      <p style="color: #6b7280; font-size: 12px;">
        Sober Helpline — Supporting Families Through Recovery
      </p>
    </div>
  `;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Get current active family member user_ids
    const { data: activeSubs } = await adminSupabase
      .from("provider_subscriptions")
      .select("user_id")
      .is("provider_submission_id", null)
      .eq("status", "active");

    const activeUserIds = new Set((activeSubs || []).map((s: any) => s.user_id));
    console.log(`Active members to exclude: ${activeUserIds.size}`);

    // 2. Get former members (cancelled/expired family subs)
    const { data: formerSubs } = await adminSupabase
      .from("provider_subscriptions")
      .select("user_id")
      .is("provider_submission_id", null)
      .in("status", ["cancelled", "expired"]);

    const formerUserIds = [...new Set((formerSubs || []).map((s: any) => s.user_id))]
      .filter(id => !activeUserIds.has(id));

    // Get emails for former members
    const recipientMap = new Map<string, string>(); // email -> name

    if (formerUserIds.length > 0) {
      const { data: formerPrivate } = await adminSupabase
        .from("profile_private")
        .select("user_id, email")
        .in("user_id", formerUserIds);

      const { data: formerProfiles } = await adminSupabase
        .from("profiles")
        .select("id, first_name")
        .in("id", formerUserIds);

      const nameMap = new Map((formerProfiles || []).map((p: any) => [p.id, p.first_name]));

      for (const fp of (formerPrivate || [])) {
        const email = fp.email.toLowerCase();
        recipientMap.set(email, nameMap.get(fp.user_id) || "Friend");
      }
    }
    console.log(`Former members: ${recipientMap.size}`);

    // 3. Get active member emails to exclude
    const activeMemberEmails = new Set<string>();
    if (activeUserIds.size > 0) {
      const { data: activePrivate } = await adminSupabase
        .from("profile_private")
        .select("email")
        .in("user_id", [...activeUserIds]);

      for (const ap of (activePrivate || [])) {
        activeMemberEmails.add(ap.email.toLowerCase());
      }
    }

    // 4. Get all zoom registrants not already in the map and not active members
    const { data: allRegistrants } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("email, name")
      .order("created_at", { ascending: false });

    for (const r of (allRegistrants || [])) {
      const email = r.email.toLowerCase();
      if (!recipientMap.has(email) && !activeMemberEmails.has(email)) {
        const firstName = (r.name || "Friend").split(' ')[0];
        recipientMap.set(email, firstName);
      }
    }

    console.log(`Total recipients (former members + non-member registrants): ${recipientMap.size}`);

    if (recipientMap.size === 0) {
      return new Response(JSON.stringify({ message: "No recipients", sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Send emails
    let sent = 0;
    let failed = 0;

    for (const [email, name] of recipientMap) {
      const safeName = escapeHtml(name);
      const html = buildHtml(safeName);
      const success = await sendEmail(email, "🔒 Lock In $14.99/Month Before the Price Triples", html);
      if (success) sent++;
      else failed++;
    }

    console.log(`Price increase outreach: sent=${sent}, failed=${failed}`);

    return new Response(JSON.stringify({ success: true, sent, failed, totalRecipients: recipientMap.size }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending price increase outreach:", error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
