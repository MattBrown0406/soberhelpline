import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TARGET_MEETING_DATE = "2026-07-13";
const PREVIOUS_MEETING_DATE = "2026-07-06";

function escapeHtml(text: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function sendEmail(to: string, subject: string, html: string) {
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not configured");
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "matt@soberhelpline.com", name: "Matt - Sober Helpline" },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    console.error(`SendGrid error for ${to}:`, err);
    return false;
  }
  return true;
}

function buildEmail(firstName: string, joinUrl: string, externalZoomLink: string, meetingId: string, passcode: string): string {
  return `
<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#1f2937;">
  <h1 style="color:#1e3a5f;">Hi ${escapeHtml(firstName)},</h1>
  <p>Thanks for your patience last week — I was on a plane to Texas helping a family with an intervention during our normal meeting time, so we had to cancel <strong>"The Family Squares"</strong> on July 6.</p>
  <p><strong>Good news: we're back to our regular schedule this Monday, July 13 at 7:00 PM PT.</strong></p>
  <div style="background-color:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
    <h2 style="margin:0 0 10px;color:#166534;">✅ You're Already Registered</h2>
    <p style="margin:0 0 15px;color:#15803d;">Because you signed up for last week's call, I've automatically registered you for Monday, July 13. Your meeting link is below.</p>
    ${joinUrl ? `<a href="${escapeHtml(joinUrl)}" style="display:inline-block;padding:14px 28px;background-color:#2563eb;color:white;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">Join on SoberHelpline.com</a>` : ""}
    ${externalZoomLink ? `<div style="margin-top:12px"><a href="${escapeHtml(externalZoomLink)}" style="display:inline-block;padding:12px 24px;background-color:#6b7280;color:white;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;">Join via Zoom App</a><p style="font-size:12px;color:#9ca3af;margin-top:8px;">Meeting ID: ${escapeHtml(meetingId)} | Passcode: ${escapeHtml(passcode)}</p></div>` : ""}
  </div>
  <p>I'm really looking forward to a great meeting on Monday. Bring your questions, bring your story, or just come to listen — whatever you need.</p>
  <p>See you Monday. 💙</p>
  <p>Warmly,<br/><strong>Matt</strong><br/>Sober Helpline<br/>(541) 241-5886</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />
  <p style="color:#9ca3af;font-size:12px;text-align:center;">Sober Helpline — Supporting Families Through Recovery<br/><a href="https://soberhelpline.com" style="color:#9ca3af;">soberhelpline.com</a></p>
</div>`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: settings } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["monday_zoom_meeting_id", "monday_zoom_passcode", "monday_zoom_link"]);

    const meetingId = settings?.find((s: any) => s.key === "monday_zoom_meeting_id")?.value || "";
    const passcode = settings?.find((s: any) => s.key === "monday_zoom_passcode")?.value || "";
    const externalZoomLink = settings?.find((s: any) => s.key === "monday_zoom_link")?.value || "";
    const joinUrl = meetingId
      ? `https://soberhelpline.com/join-meeting?mn=${encodeURIComponent(meetingId)}&pwd=${encodeURIComponent(passcode)}`
      : "";

    // Get last week's registrants
    const { data: prev, error: prevErr } = await supabase
      .from("zoom_meeting_registrations")
      .select("name, email, phone, user_id")
      .eq("meeting_date", PREVIOUS_MEETING_DATE)
      .order("created_at", { ascending: false });
    if (prevErr) throw prevErr;

    // Dedup by email, keep first (most recent)
    const seen = new Set<string>();
    const uniq: Array<{ name: string; email: string; phone: string | null; user_id: string | null }> = [];
    for (const r of prev || []) {
      const key = (r.email || "").toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      uniq.push({ name: r.name, email: key, phone: r.phone, user_id: r.user_id });
    }

    // Check who is already registered for 7/13
    const emails = uniq.map((u) => u.email);
    const { data: existing } = await supabase
      .from("zoom_meeting_registrations")
      .select("email")
      .eq("meeting_date", TARGET_MEETING_DATE)
      .in("email", emails);
    const alreadyReg = new Set((existing || []).map((r: any) => (r.email || "").toLowerCase().trim()));

    let inserted = 0;
    for (const u of uniq) {
      if (!alreadyReg.has(u.email)) {
        const { error: insErr } = await supabase.from("zoom_meeting_registrations").insert({
          user_id: u.user_id,
          name: u.name,
          email: u.email,
          phone: u.phone || "",
          question: "",
          request_follow_up: false,
          consent_email_list: false,
          meeting_date: TARGET_MEETING_DATE,
          auto_register: true,
        });
        if (insErr) {
          console.error(`Insert failed for ${u.email}:`, insErr.message);
        } else {
          inserted++;
        }
      }
    }

    // Send emails
    const results: Record<string, boolean> = {};
    for (const u of uniq) {
      const first = (u.name || "").split(/\s+/)[0] || "there";
      const html = buildEmail(first, joinUrl, externalZoomLink, meetingId, passcode);
      results[u.email] = await sendEmail(
        u.email,
        "We're back Monday — you're registered for 'The Family Squares' (7/13 @ 7 PM PT)",
        html,
      );
    }

    const sent = Object.values(results).filter(Boolean).length;
    return new Response(
      JSON.stringify({ success: true, totalRecipients: uniq.length, autoRegistered: inserted, sent, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("send-family-squares-return error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
