import "../_shared/suppression.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REPORT_RECIPIENT = "matt@soberhelpline.com";

function ptDateParts(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { y: get("year"), m: get("month"), d: get("day"), weekday: get("weekday") };
}

// Most recent Monday (Pacific). Running Tuesday morning PT => yesterday's meeting.
function getMostRecentMondayPT(now: Date): string {
  const { y, m, d, weekday } = ptDateParts(now);
  const base = new Date(`${y}-${m}-${d}T12:00:00Z`);
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const dow = dayMap[weekday] ?? base.getUTCDay();
  const daysBack = (dow + 6) % 7; // Mon->0, Tue->1 ...
  base.setUTCDate(base.getUTCDate() - daysBack);
  return base.toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const norm = (v: string | null | undefined) => (v ?? "").toLowerCase().trim();

// "Patty solberg", "PATTY SOLBERG " and "kristine (she/they)" compare as plain lower-case
// words. Only names of two words or more count as a match: "Kim" alone is too weak.
function fullName(v: string | null | undefined): string {
  if (!v || v.includes("@")) return "";
  const name = v
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^\p{L}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  return name.includes(" ") ? name : "";
}

type Person = { name: string; email: string; ids: string[]; language: string };

// One person per registrant: registrations that share an email or a full name are
// the same person (people often register under two or three emails).
function groupRegistrations(
  rows: Array<{ id: string; name: string | null; email: string | null; language?: string | null }>,
) {
  const people: Person[] = [];
  const byEmail = new Map<string, Person>();
  const byName = new Map<string, Person>();
  const byRegId = new Map<string, Person>();
  for (const r of rows) {
    const email = norm(r.email);
    const name = fullName(r.name);
    if (!email && !name) continue;
    let person = (email && byEmail.get(email)) || (name && byName.get(name)) || undefined;
    if (!person) {
      person = { name: r.name ?? "", email, ids: [], language: r.language ?? "en" };
      people.push(person);
    }
    person.ids.push(r.id);
    if (email) byEmail.set(email, person);
    if (name) byName.set(name, person);
    byRegId.set(r.id, person);
  }
  return { people, byEmail, byName, byRegId };
}

function prettyDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function listBlock(title: string, rows: Array<{ name: string; email: string; note?: string }>): string {
  const items = rows.length
    ? rows
        .map(
          (r) =>
            `<li style="margin-bottom:4px;"><strong>${escapeHtml(r.name || "(no name)")}</strong> &mdash; <span style="color:#555;">${escapeHtml(
              r.email || "(no email)",
            )}</span>${r.note ? ` <span style="color:#888;">${escapeHtml(r.note)}</span>` : ""}</li>`,
        )
        .join("")
    : `<li style="color:#888;">None</li>`;
  return `<h3 style="margin:24px 0 8px;font-size:16px;color:#111;">${escapeHtml(title)} (${rows.length})</h3><ul style="margin:0;padding-left:20px;">${items}</ul>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "1";
    const preview = url.searchParams.get("preview") === "1";

    // DST guard: cron fires at both 17:00 and 18:00 UTC; only run at 10 AM Pacific.
    const ptHour = parseInt(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        hour12: false,
      }).format(new Date()),
      10,
    );
    if (!force && !preview && ptHour !== 10) {
      return new Response(
        JSON.stringify({ skipped: true, reason: `PT hour is ${ptHour}, expected 10` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const meetingDate = url.searchParams.get("meeting_date") || getMostRecentMondayPT(new Date());
    const fourWeeksAgo = addDays(meetingDate, -21); // covers this meeting + 3 prior Mondays

    const [regRes, attRes, recentAttRes, autoRegRes] = await Promise.all([
      supabase
        .from("zoom_meeting_registrations")
        .select("id,name,email,auto_register,created_at,language")
        .eq("meeting_date", meetingDate),
      supabase
        .from("zoom_attendance")
        .select("participant_name,participant_email,duration_minutes,registration_id")
        .eq("meeting_date", meetingDate),
      supabase
        .from("zoom_attendance")
        .select("participant_email,participant_name,registration_id,meeting_date")
        .gte("meeting_date", fourWeeksAgo),
      supabase
        .from("zoom_meeting_registrations")
        .select("id,name,email,meeting_date,language")
        .eq("auto_register", true)
        .gte("meeting_date", fourWeeksAgo),
    ]);

    if (regRes.error) throw regRes.error;
    if (attRes.error) throw attRes.error;
    if (recentAttRes.error) throw recentAttRes.error;
    if (autoRegRes.error) throw autoRegRes.error;

    // One person per registrant (latest registration first, so its name and email show)
    const registrants = groupRegistrations(
      (regRes.data ?? []).sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? "")),
    );

    const languageCounts = new Map<string, number>();
    for (const r of registrants.people) {
      const lang = r.language || "en";
      languageCounts.set(lang, (languageCounts.get(lang) || 0) + 1);
    }

    // One entry per person who joined, minutes summed over rejoins. Zoom gives most
    // guests no email, so a row is matched to a registrant by registration, then email,
    // then full name; anyone left over joined without registering.
    const attendedMinutes = new Map<Person, number>();
    const walkIns = new Map<string, { name: string; email: string; minutes: number }>();
    for (const a of attRes.data ?? []) {
      const email = norm(a.participant_email);
      const name = fullName(a.participant_name);
      const minutes = a.duration_minutes ?? 0;
      const person =
        (a.registration_id && registrants.byRegId.get(a.registration_id)) ||
        (email && registrants.byEmail.get(email)) ||
        (name && registrants.byName.get(name)) ||
        undefined;
      if (person) {
        attendedMinutes.set(person, (attendedMinutes.get(person) ?? 0) + minutes);
        continue;
      }
      const key = email || name || norm(a.participant_name);
      if (!key) continue;
      const prev = walkIns.get(key);
      walkIns.set(key, {
        name: prev?.name || a.participant_name || "",
        email: prev?.email || email,
        minutes: (prev?.minutes ?? 0) + minutes,
      });
    }

    const registeredAndAttended: Array<{ name: string; email: string; note?: string }> = [];
    const registeredNoShow: Array<{ name: string; email: string; note?: string }> = [];
    for (const r of registrants.people) {
      const minutes = attendedMinutes.get(r);
      const langNote = r.language === "es" ? "[ES]" : undefined;
      if (minutes !== undefined) {
        registeredAndAttended.push({
          name: r.name,
          email: r.email,
          note: [langNote, minutes ? `(${minutes} min)` : undefined].filter(Boolean).join(" ") || undefined,
        });
      } else {
        registeredNoShow.push({
          name: r.name,
          email: r.email,
          note: langNote,
        });
      }
    }

    const unregisteredAttendees = [...walkIns.values()].map((a) => ({
      name: a.name,
      email: a.email,
      note: a.minutes ? `(${a.minutes} min)` : undefined,
    }));

    // Auto-registrants with no attendance in the last 4 weeks, this meeting included.
    // Attendance counts when it carries one of their registrations, emails or names.
    const recentRegIds = new Set<string>();
    const recentEmails = new Set<string>();
    const recentNames = new Set<string>();
    for (const a of recentAttRes.data ?? []) {
      if (a.registration_id) recentRegIds.add(a.registration_id);
      const email = norm(a.participant_email);
      if (email) recentEmails.add(email);
      const name = fullName(a.participant_name);
      if (name) recentNames.add(name);
    }
    const autoRegistrants = groupRegistrations(autoRegRes.data ?? []);
    const hasAttended = (p: Person) =>
      p.ids.some((id) => recentRegIds.has(id)) ||
      [...autoRegistrants.byEmail].some(([email, q]) => q === p && recentEmails.has(email)) ||
      [...autoRegistrants.byName].some(([name, q]) => q === p && recentNames.has(name));
    const dormantAutoRegistrants = autoRegistrants.people
      .filter((p) => !hasAttended(p))
      .map((p) => ({ name: p.name, email: p.email }));

    const totalRegistrants = registrants.people.length;
    const totalAttendees = registeredAndAttended.length + unregisteredAttendees.length;
    const englishCount = languageCounts.get("en") || 0;
    const spanishCount = languageCounts.get("es") || 0;

    const html = `<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#333;line-height:1.6;">
<h2 style="color:#111;margin-bottom:4px;">"The Family Squares" — Weekly Meeting Report</h2>
<p style="margin-top:0;color:#666;">Meeting of ${escapeHtml(prettyDate(meetingDate))}</p>
<div style="background:#f4f7fb;border-radius:8px;padding:16px;margin:16px 0;">
  <p style="margin:0;font-size:15px;"><strong>Total registrants:</strong> ${totalRegistrants}</p>
  <p style="margin:4px 0 0;font-size:15px;"><strong>English registrants:</strong> ${englishCount}</p>
  <p style="margin:4px 0 0;font-size:15px;"><strong>Spanish registrants:</strong> ${spanishCount}</p>
  <p style="margin:4px 0 0;font-size:15px;"><strong>Total attendees:</strong> ${totalAttendees}</p>
  <p style="margin:4px 0 0;font-size:15px;"><strong>Registered attendance rate:</strong> ${
    totalRegistrants ? Math.round((registeredAndAttended.length / totalRegistrants) * 100) : 0
  }%</p>
</div>
${listBlock("Registered and attended", registeredAndAttended)}
${listBlock("Registered but did not attend", registeredNoShow)}
${listBlock("Attended without registering", unregisteredAttendees)}
${listBlock("Auto-registrants with no attendance in the last 4 weeks", dormantAutoRegistrants)}
<p style="margin-top:28px;color:#888;font-size:12px;">Generated automatically every Tuesday at 10:00 AM Pacific.</p>
</div>`;

    const summary = {
      meeting_date: meetingDate,
      total_registrants: totalRegistrants,
      english_registrants: englishCount,
      spanish_registrants: spanishCount,
      total_attendees: totalAttendees,
      registered_and_attended: registeredAndAttended,
      registered_no_show: registeredNoShow,
      attended_without_registering: unregisteredAttendees,
      dormant_auto_registrants: dormantAutoRegistrants,
    };

    if (preview) {
      return new Response(JSON.stringify({ preview: true, ...summary }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) throw new Error("SENDGRID_API_KEY not set");

    const sg = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tracking_settings: { subscription_tracking: { enable: true } },
        personalizations: [{ to: [{ email: REPORT_RECIPIENT }] }],
        from: { email: "matt@soberhelpline.com", name: "Sober Helpline Reports" },
        subject: `Family Squares weekly report — ${prettyDate(meetingDate)} (${totalRegistrants} registered, ${totalAttendees} attended)`,
        content: [{ type: "text/html", value: html }],
      }),
    });

    if (!sg.ok) {
      const body = await sg.text();
      console.error(`SendGrid failed [${sg.status}]: ${body}`);
      return new Response(JSON.stringify({ error: "SendGrid send failed", status: sg.status, details: body }), {
        status: sg.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ sent: true, ...summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-weekly-zoom-report error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
