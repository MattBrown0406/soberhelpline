import "../_shared/suppression.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAutomationAuth } from "../_shared/automationAuth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret, x-cron-secret",
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char] || char));

// Returns the most recent Monday in Pacific Time as YYYY-MM-DD.
// When this runs Monday evening PT, "today" in PT = the meeting date.
function getTonightMeetingDatePT(): string {
  const now = new Date();
  const pstParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now);

  const get = (t: string) => pstParts.find((p) => p.type === t)?.value ?? "";
  const y = get("year");
  const m = get("month");
  const d = get("day");
  const weekday = get("weekday"); // Mon, Tue, ...

  const ptDate = new Date(`${y}-${m}-${d}T12:00:00Z`);
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const dow = dayMap[weekday] ?? ptDate.getUTCDay();

  // Roll back to Monday (if we're already on Monday, stay).
  const daysBack = (dow + 6) % 7; // Mon->0, Tue->1, ... Sun->6
  ptDate.setUTCDate(ptDate.getUTCDate() - daysBack);

  return ptDate.toISOString().slice(0, 10);
}

// People who RSVP'd in the Sober Helpline app get the same welcome without the
// website membership pitch (and never an App Store link: they have the app).
function buildAppEmailHtml(name: string): string {
  const firstName = escapeHtml((name || "").trim().split(/\s+/)[0] || "there");
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
<p>Hi ${firstName},</p>
<p>This is Matt from Sober Helpline. I noticed tonight was your <strong>first time</strong> signing up for "The Family Squares" — our free Monday night family support Zoom — and I just wanted to personally say <strong>welcome</strong>.</p>
<p>If you were able to make it tonight, I am so glad you came, and I truly hope you got something out of being in the room with other families who understand what you're walking through.</p>
<p>If something came up and you weren't able to join us, no worries at all — life happens. You can RSVP for next Monday and send your question ahead of time right in the Sober Helpline app.</p>
<p>Either way, I hope we see you next Monday at 7:00 PM Pacific. I'm grateful you're here.</p>
<p>With you in this,<br>Matt Brown<br><em>Sober Helpline</em></p>
</div>`;
}

function buildEmailHtml(name: string): string {
  const firstName = escapeHtml((name || "").trim().split(/\s+/)[0] || "there");
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
<p>Hi ${firstName},</p>
<p>This is Matt from Sober Helpline. I noticed tonight was your <strong>first time</strong> registering for "The Family Squares" — our free Monday night family support Zoom — and I just wanted to personally say <strong>welcome</strong>.</p>
<p>If you were able to make it tonight, I am so glad you came, and I truly hope you got something out of being in the room with other families who understand what you're walking through.</p>
<p>If something came up and you weren't able to join us, no worries at all — life happens. I wanted to let you know that <strong>tonight's meeting (and every past meeting) is recorded and available to watch in the member section of the website</strong>. You can revisit them anytime, on your own schedule.</p>
<p style="text-align: center; margin: 30px 0;"><a href="https://soberhelpline.com/family-membership" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join the Family Membership</a></p>
<p>Membership is <strong>$9.99/month</strong> (or $100/year) and includes the full Zoom recordings library, the family education curriculum, the private forum, and more.</p>
<p>Either way — whether we see you next Monday at 7:00 PM Pacific or you catch the recording later — I'm grateful you're here.</p>
<p>With you in this,<br>Matt Brown<br><em>Sober Helpline</em></p>
</div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, serviceKey);

    // Mass email to tonight's registrants: cron (cron_secret), the automation
    // secret, the service role key or an admin. Staged by
    // site_settings.enforce_function_auth (logs automation_auth_unverified until then).
    const body = await req.json().catch(() => null);
    const denied = await requireAutomationAuth(req, supabase, body, "send-first-timer-followup", corsHeaders);
    if (denied) return denied;

    const meetingDate = getTonightMeetingDatePT();

    // DST guard: only send if it's actually 8 PM hour Pacific Time, unless ?force=1
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "1";
    const ptHour = parseInt(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        hour12: false,
      }).format(new Date()),
      10
    );
    if (!force && ptHour !== 20) {
      return new Response(
        JSON.stringify({ skipped: true, reason: `PT hour is ${ptHour}, expected 20`, meetingDate }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // All registrants for tonight
    const { data: tonightRows, error: tonightErr } = await supabase
      .from("zoom_meeting_registrations")
      .select("name, email, created_at, registration_source")
      .eq("meeting_date", meetingDate);

    if (tonightErr) throw tonightErr;

    // Dedupe tonight by lowercased email — keep most recent name
    const tonightMap = new Map<string, { name: string; email: string; viaApp: boolean }>();
    for (const r of (tonightRows ?? []).sort((a, b) =>
      (b.created_at ?? "").localeCompare(a.created_at ?? "")
    )) {
      const key = (r.email ?? "").toLowerCase().trim();
      if (!key) continue;
      const viaApp = r.registration_source === "app";
      const existing = tonightMap.get(key);
      if (!existing) tonightMap.set(key, { name: r.name ?? "", email: key, viaApp });
      else if (viaApp) existing.viaApp = true;
    }

    if (tonightMap.size === 0) {
      return new Response(JSON.stringify({ meetingDate, sent: 0, note: "no registrants" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find which of those emails have prior registrations (any earlier meeting_date)
    const emails = Array.from(tonightMap.keys());
    const { data: priorRows, error: priorErr } = await supabase
      .from("zoom_meeting_registrations")
      .select("email")
      .in("email", emails)
      .lt("meeting_date", meetingDate);

    if (priorErr) throw priorErr;

    const priorSet = new Set(
      (priorRows ?? []).map((r) => (r.email ?? "").toLowerCase().trim())
    );

    const firstTimers = emails
      .filter((e) => !priorSet.has(e))
      // Exclude internal/test domains
      .filter((e) => !e.endsWith("@freedominterventions.com"))
      .map((e) => tonightMap.get(e)!)
      .filter(Boolean);

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not set");

    // Status only (no addresses): the response may reach callers before auth is enforced.
    const results: Array<{ ok: boolean; status: number; via_app: boolean }> = [];
    for (const r of firstTimers) {
      const sg = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tracking_settings: { subscription_tracking: { enable: true } },
          personalizations: [{ to: [{ email: r.email, name: r.name }] }],
          from: { email: "matt@soberhelpline.com", name: "Matt Brown | Sober Helpline" },
          subject: "So glad you joined us tonight — here's what's next",
          content: [{ type: "text/html", value: r.viaApp ? buildAppEmailHtml(r.name) : buildEmailHtml(r.name) }],
        }),
      });
      results.push({ ok: sg.ok, status: sg.status, via_app: r.viaApp });
    }

    return new Response(
      JSON.stringify({
        meetingDate,
        totalTonight: tonightMap.size,
        firstTimers: firstTimers.length,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("send-first-timer-followup error", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
