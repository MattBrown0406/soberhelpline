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
        .select("participant_email,meeting_date")
        .gte("meeting_date", fourWeeksAgo),
      supabase
        .from("zoom_meeting_registrations")
        .select("name,email,meeting_date,language")
        .eq("auto_register", true)
        .gte("meeting_date", fourWeeksAgo),
    ]);

    if (regRes.error) throw regRes.error;
    if (attRes.error) throw attRes.error;
    if (recentAttRes.error) throw recentAttRes.error;
    if (autoRegRes.error) throw autoRegRes.error;

    // Dedupe registrants by email (keep latest)
    const registrants = new Map<string, { name: string; email: string; id: string; language: string }>();
    for (const r of (regRes.data ?? []).sort((a, b) =>
      (b.created_at ?? "").localeCompare(a.created_at ?? ""),
    )) {
      const key = norm(r.email);
      if (!key || registrants.has(key)) continue;
      registrants.set(key, { name: r.name ?? "", email: key, id: r.id, language: r.language ?? "en" });
    }

    const languageCounts = new Map<string, number>();
    for (const r of registrants.values()) {
      const lang = r.language || "en";
      languageCounts.set(lang, (languageCounts.get(lang) || 0) + 1);
    }

    // Dedupe attendance by email (sum duration)
    const attendees = new Map<string, { name: string; email: string; minutes: number }>();
    const attendedRegIds = new Set<string>();
    for (const a of attRes.data ?? []) {
      if (a.registration_id) attendedRegIds.add(a.registration_id);
      const key = norm(a.participant_email);
      if (!key) continue;
      const prev = attendees.get(key);
      attendees.set(key, {
        name: a.participant_name ?? prev?.name ?? "",
        email: key,
        minutes: (prev?.minutes ?? 0) + (a.duration_minutes ?? 0),
      });
    }

    const registeredAndAttended: Array<{ name: string; email: string; note?: string }> = [];
    const registeredNoShow: Array<{ name: string; email: string; note?: string }> = [];
    for (const r of registrants.values()) {
      const att = attendees.get(r.email);
      const langNote = r.language === "es" ? "[ES]" : undefined;
      if (att || attendedRegIds.has(r.id)) {
        registeredAndAttended.push({
          name: r.name,
          email: r.email,
          note: [langNote, att?.minutes ? `(${att.minutes} min)` : undefined].filter(Boolean).join(" ") || undefined,
        });
      } else {
        registeredNoShow.push({
          name: r.name,
          email: r.email,
          note: langNote,
        });
      }
    }

    const unregisteredAttendees = [...attendees.values()]
      .filter((a) => !registrants.has(a.email))
      .map((a) => ({ name: a.name, email: a.email, note: a.minutes ? `(${a.minutes} min)` : undefined }));

    // Auto-registrants with no attendance in the last 4 weeks
    const recentAttendanceEmails = new Set((recentAttRes.data ?? []).map((r) => norm(r.participant_email)));
    const autoRegistrants = new Map<string, { name: string; email: string }>();
    for (const r of autoRegRes.data ?? []) {
      const key = norm(r.email);
      if (!key || autoRegistrants.has(key)) continue;
      autoRegistrants.set(key, { name: r.name ?? "", email: key });
    }
    const dormantAutoRegistrants = [...autoRegistrants.values()].filter(
      (r) => !recentAttendanceEmails.has(r.email),
    );

    const totalRegistrants = registrants.size;
    const totalAttendees = attendees.size;
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
