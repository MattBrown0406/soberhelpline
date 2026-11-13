import "../_shared/suppression.ts";
import { stopAutoRegistrationUrl } from "../_shared/stopAutoRegistration.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { hasAutomationAuth, requireAutomationAuth } from "../_shared/automationAuth.ts";
import { isMeetingCancelled } from "../_shared/cancelledMeetings.ts";
import { appHandledEmails, normalizeEmail } from "../_shared/appPushReachable.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret, x-cron-secret",
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Current date in Pacific time as YYYY-MM-DD (handles PST/PDT automatically)
function pacificDateStr(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

// Pacific hour 0-23 (handles PST/PDT).
function pacificHour(d = new Date()): number {
  return Number(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles", hour: "numeric", hourCycle: "h23",
  }).format(d));
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let body: any = {};
    try { body = (await req.json()) ?? {}; } catch { /* no body */ }

    // Emails every registrant for the date: cron (cron_secret), the automation
    // secret, the service role key or an admin. Staged by
    // site_settings.enforce_function_auth (logs automation_auth_unverified until then).
    const denied = await requireAutomationAuth(req, adminSupabase, body, "send-zoom-starting-soon", corsHeaders);
    if (denied) return denied;

    // The scheduled job never sends these. A hand-run send at any hour, or for a
    // chosen date, needs real credentials even while enforcement is staged.
    if ((body?.force === true || body?.meeting_date) && !(await hasAutomationAuth(req, adminSupabase, body))) {
      console.warn("automation_auth_denied send-zoom-starting-soon");
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Two cron jobs (01:00 and 02:00 UTC) cover PDT and PST. Only the run in
    // the 6 PM Pacific hour sends "starting in 1 hour"; the other is a no-op.
    // A manual run can pass { "force": true }.
    if (body?.force !== true && pacificHour() !== 18) {
      return new Response(JSON.stringify({ success: true, sent: 0, skipped: "outside_6pm_pacific" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not configured");

    const targetDate: string = body.meeting_date || pacificDateStr();

    // No "starting in 1 hour" for a meeting that was cancelled.
    if (await isMeetingCancelled(adminSupabase, targetDate, "send-zoom-starting-soon")) {
      return new Response(JSON.stringify({ success: true, sent: 0, skipped: "meeting_cancelled", meetingDate: targetDate }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Contract D: people the Sober Helpline app reminds by push are skipped
    // unless the caller asks to email everyone.
    const includeAppHandled = body.include_app_handled === true;

    const { data: settings } = await adminSupabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["monday_zoom_meeting_id", "monday_zoom_passcode", "monday_zoom_link"]);

    const meetingId = settings?.find((s: any) => s.key === "monday_zoom_meeting_id")?.value || "";
    const passcode = settings?.find((s: any) => s.key === "monday_zoom_passcode")?.value || "";
    const externalZoomLink = settings?.find((s: any) => s.key === "monday_zoom_link")?.value || "";

    if (!meetingId) throw new Error("No meeting ID configured");

    const siteUrl = "https://soberhelpline.com";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const baseJoinUrl = `${siteUrl}/join-meeting?mn=${encodeURIComponent(meetingId)}&pwd=${encodeURIComponent(passcode)}`;

    const { data: registrants, error } = await adminSupabase
      .from("zoom_meeting_registrations")
      .select("id, name, email, registration_source, auto_register")
      .eq("meeting_date", targetDate);

    if (error) throw error;

    const { data: suppressed } = await adminSupabase
      .from("email_suppression_list")
      .select("email");
    const suppressedEmails = new Set((suppressed || []).map((s: any) => s.email.toLowerCase()));

    // People who registered through the Sober Helpline app already have it:
    // no "download the app" box for them.
    const appRegistrants = new Set(
      (registrants || [])
        .filter((r: any) => r.registration_source === "app")
        .map((r: any) => normalizeEmail(r.email)),
    );

    // Anyone with a weekly automatic registration for tonight, whichever of
    // their rows is kept below.
    const autoRegistered = new Set(
      (registrants || [])
        .filter((r: any) => r.auto_register === true)
        .map((r: any) => normalizeEmail(r.email)),
    );

    const seen = new Set<string>();
    const candidates: { id?: string; name: string; email: string; auto_register?: boolean | null }[] = [];
    for (const r of registrants || []) {
      const key = (r.email || "").toLowerCase();
      if (!key || seen.has(key) || suppressedEmails.has(key)) continue;
      seen.add(key);
      candidates.push(r as any);
    }

    const appHandled = includeAppHandled
      ? new Set<string>()
      : (await appHandledEmails(candidates.map((r) => r.email), "send-zoom-starting-soon")).handled;
    const unique = candidates.filter((r) => !appHandled.has(normalizeEmail(r.email)));
    const skippedApp = candidates.length - unique.length;

    if (unique.length === 0) {
      return new Response(
        JSON.stringify({ message: "No registrants to email for this meeting date", meeting_date: targetDate, sent: 0, skippedApp }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // While text reminders are switched on, the email says how to get them.
    const { data: smsSetting } = await adminSupabase
      .from("site_settings").select("value").eq("key", "family_squares_sms_enabled").maybeSingle();
    const textReminderLine = String((smsSetting as any)?.value ?? "").trim() === "true"
      ? `<p style="color: #6b7280; font-size: 12px;">Prefer a text? <a href="${siteUrl}/text-reminders" style="color: #6b7280;">Get this reminder by text message</a>.</p>`
      : "";

    let sent = 0;
    let failed = 0;

    for (const reg of unique) {
      const safeName = escapeHtml(reg.name || "there");
      const hasApp = appRegistrants.has(normalizeEmail(reg.email));
      const joinUrl = reg.id
        ? `${supabaseUrl}/functions/v1/track-zoom-click?rid=${encodeURIComponent(reg.id)}`
        : baseJoinUrl;

      // People who are registered automatically each week can stop it
      // themselves. If the link cannot be made, the reminder goes out without it.
      let stopWeeklyLine = "";
      if (reg.id && autoRegistered.has(normalizeEmail(reg.email))) {
        try {
          const stopUrl = await stopAutoRegistrationUrl(reg.id);
          if (stopUrl) {
            stopWeeklyLine = `<p style="color: #6b7280; font-size: 12px;">You are registered for this meeting automatically each week. <a href="${escapeHtml(stopUrl)}" style="color: #6b7280;">Stop weekly registration</a>.</p>`;
          }
        } catch (linkError) {
          console.error("send-zoom-starting-soon: stop link failed:", linkError instanceof Error ? linkError.message : linkError);
        }
      }

      const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #1f2937;">
          <h1 style="color: #166534;">Starting in 1 hour: Family Squares</h1>
          <p>Hi ${safeName},</p>
          <p>Just a quick reminder — tonight's <strong>Family Squares Zoom</strong> starts at <strong>7:00 PM Pacific</strong>, one hour from now.</p>

          <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <a href="${escapeHtml(joinUrl)}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Join Tonight's Meeting
            </a>
            <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
              The meeting opens directly in your browser — no Zoom app needed.
            </p>
            ${externalZoomLink ? `
            <div style="margin-top: 12px;">
              <p style="font-size: 13px; color: #6b7280; margin: 0 0 8px 0;">Having trouble? You can also join directly through Zoom:</p>
              <a href="${escapeHtml(externalZoomLink)}" style="display: inline-block; padding: 10px 24px; background-color: #6b7280; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
                Join via Zoom App
              </a>
              ${passcode ? `<p style="font-size: 12px; color: #9ca3af; margin-top: 8px;">Meeting ID: ${escapeHtml(meetingId)} &nbsp;|&nbsp; Passcode: ${escapeHtml(passcode)}</p>` : ""}
            </div>` : ""}
          </div>

          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>📨 Share with your family.</strong> If anyone else in your family could benefit — a spouse, sibling, parent, or adult child — forward them this email so they can join too.
            </p>
          </div>

          ${hasApp ? "" : `<div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #047857; font-size: 14px;">
              <strong>📱 Take Sober Helpline with you.</strong> If you haven't already, download the free Sober Helpline app from the Apple App Store.
            </p>
            <a href="https://apps.apple.com/us/app/sober-helpline/id6780034996" style="display: inline-block; padding: 10px 24px; background-color: #166534; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
              Download Sober Helpline
            </a>
          </div>`}


          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            If you have any questions, call us at <strong>(458) 298-8008</strong>.
          </p>
          <p style="color: #6b7280; font-size: 12px;">Sober Helpline — Supporting Families Through Recovery</p>
          ${textReminderLine}
          ${stopWeeklyLine}
        </div>
      `;

      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tracking_settings: { subscription_tracking: { enable: true } },
          personalizations: [{ to: [{ email: reg.email }] }],
          from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
          subject: '⏰ Starting in 1 hour — Family Squares at 7:00 PM Pacific',
          content: [{ type: "text/html", value: html }],
        }),
      });

      if (res.ok) {
        sent++;
      } else {
        failed++;
        console.error(`SendGrid send failed [${res.status}]: ${(await res.text()).slice(0, 300)}`);
      }
    }

    console.log(`send-zoom-starting-soon meeting_date=${targetDate} sent=${sent} failed=${failed} skippedApp=${skippedApp}`);

    return new Response(
      JSON.stringify({ success: true, meeting_date: targetDate, sent, failed, total: unique.length, skippedApp }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("Error sending starting-soon reminder:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
