import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

function buildEmailHtml(name: string): string {
  const firstName = (name || "").trim().split(/\s+/)[0] || "there";
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
<p>Hi ${firstName},</p>
<p>This is Matt from Sober Helpline. I noticed tonight was your <strong>first time</strong> registering for "The Family Squares" — our free Monday night family support Zoom — and I just wanted to personally say <strong>welcome</strong>.</p>
<p>If you were able to make it tonight, I am so glad you came, and I truly hope you got something out of being in the room with other families who understand what you're walking through.</p>
<p>If something came up and you weren't able to join us, no worries at all — life happens. I wanted to let you know that <strong>tonight's meeting (and every past meeting) is recorded and available to watch in the member section of the website</strong>. You can revisit them anytime, on your own schedule.</p>
<p style="text-align: center; margin: 30px 0;"><a href="https://soberhelpline.com/family-membership" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join the Family Membership</a></p>
<p>Membership is currently <strong>$14.99/month</strong> (locked in for early supporters before our April 2026 price increase) and includes the full Zoom recordings library, the family education curriculum, the private forum, and more.</p>
<p>Either way — whether we see you next Monday at 7 PM PT or you catch the recording later — I'm grateful you're here.</p>
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

    const meetingDate = getTonightMeetingDatePT();

    // All registrants for tonight
    const { data: tonightRows, error: tonightErr } = await supabase
      .from("zoom_meeting_registrations")
      .select("name, email, created_at")
      .eq("meeting_date", meetingDate);

    if (tonightErr) throw tonightErr;

    // Dedupe tonight by lowercased email — keep most recent name
    const tonightMap = new Map<string, { name: string; email: string }>();
    for (const r of (tonightRows ?? []).sort((a, b) =>
      (b.created_at ?? "").localeCompare(a.created_at ?? "")
    )) {
      const key = (r.email ?? "").toLowerCase().trim();
      if (!key) continue;
      if (!tonightMap.has(key)) tonightMap.set(key, { name: r.name ?? "", email: key });
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

    const results: Array<{ email: string; ok: boolean; status: number }> = [];
    for (const r of firstTimers) {
      const sg = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: r.email, name: r.name }] }],
          from: { email: "matt@soberhelpline.com", name: "Matt Brown | Sober Helpline" },
          subject: "So glad you joined us tonight — here's what's next",
          content: [{ type: "text/html", value: buildEmailHtml(r.name) }],
        }),
      });
      results.push({ email: r.email, ok: sg.ok, status: sg.status });
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
