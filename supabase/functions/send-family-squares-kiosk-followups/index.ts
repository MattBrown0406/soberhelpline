import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.3";

const JSON_HEADERS = { "Content-Type": "application/json" };
const REGISTRATION_URL = "https://soberhelpline.com/monday-zoom-registration";

type QueueRow = {
  queue_id: string;
  registration_id: string;
  meeting_date: string;
  email: string;
  name: string;
  attempts: number;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] as string);
}

function nextMondayLabel(meetingDate: string): string {
  const date = new Date(`${meetingDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 7);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function emailHtml(name: string, meetingDate: string): string {
  const firstName = escapeHtml(name.trim().split(/\s+/)[0] || "Friend");
  const upcomingDate = escapeHtml(nextMondayLabel(meetingDate));

  return `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#1f2937;line-height:1.65;">
      <div style="text-align:center;margin-bottom:24px;">
        <img src="https://soberhelpline.com/og-image.png" alt="Sober Helpline" style="max-width:220px;height:auto;" />
      </div>
      <h1 style="color:#12345b;font-size:26px;line-height:1.25;">Join us again for Family Squares</h1>
      <p>Hi ${firstName},</p>
      <p>Thank you for registering for Monday's Family Squares meeting through a Sober Helpline community kiosk.</p>
      <p>Family recovery takes more than one conversation. You are invited back next <strong>${upcomingDate} at 7:00 PM Pacific</strong> for another free Zoom meeting with families affected by addiction.</p>
      <div style="margin:28px 0;text-align:center;">
        <a href="${REGISTRATION_URL}" style="display:inline-block;border-radius:8px;background:#166534;color:#fff;padding:15px 28px;text-decoration:none;font-size:17px;font-weight:700;">Register for Next Monday</a>
      </div>
      <div style="border:1px solid #bfdbfe;background:#eff6ff;border-radius:8px;padding:16px;margin:22px 0;">
        <p style="margin:0 0 8px;color:#1e3a8a;font-weight:700;">Choose what works for you:</p>
        <ul style="margin:0;padding-left:22px;color:#1e40af;">
          <li><strong>One meeting:</strong> complete the normal registration form for next Monday only.</li>
          <li><strong>Future meetings:</strong> select “Automatically register me for future meetings” on that form.</li>
        </ul>
      </div>
      <p>You can also submit a question on the registration page if there is something you would like addressed during the meeting.</p>
      <p>With care,<br><strong>Matt Brown</strong><br>Sober Helpline</p>
      <hr style="border:0;border-top:1px solid #e5e7eb;margin:28px 0 16px;" />
      <p style="font-size:12px;color:#6b7280;">You are receiving this one-time reminder because you registered through a Sober Helpline community kiosk. If you do not want future Sober Helpline email reminders, reply to this email and ask to be removed.</p>
      <p style="font-size:12px;color:#6b7280;word-break:break-all;">Registration link: <a href="${REGISTRATION_URL}">${REGISTRATION_URL}</a></p>
    </div>
  `;
}

Deno.serve(async (request: Request) => {
  try {
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const authorization = request.headers.get("authorization") || "";

    if (!serviceRoleKey || authorization !== `Bearer ${serviceRoleKey}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: JSON_HEADERS });
    }

    const sendgridKey = Deno.env.get("SENDGRID_API_KEY");
    if (!sendgridKey) throw new Error("SENDGRID_API_KEY is not configured");

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, serviceRoleKey);
    const { data: claimedRows, error: claimError } = await supabase.rpc(
      "claim_family_squares_kiosk_followups",
      { _limit: 50 },
    );
    if (claimError) throw claimError;

    const rows = (claimedRows || []) as QueueRow[];
    if (rows.length === 0) {
      return new Response(JSON.stringify({ claimed: 0, sent: 0, suppressed: 0, failed: 0 }), { headers: JSON_HEADERS });
    }

    const [suppressionResult, blocklistResult] = await Promise.all([
      supabase.from("email_suppression_list").select("email"),
      supabase.from("meeting_blocklist").select("email").not("email", "is", null),
    ]);
    if (suppressionResult.error || blocklistResult.error) {
      const lookupError = suppressionResult.error || blocklistResult.error;
      const retryAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const { error: releaseError } = await supabase
        .from("family_squares_kiosk_followups")
        .update({
          status: "failed",
          claimed_at: null,
          next_attempt_at: retryAt,
          last_error: `Suppression lookup failed: ${lookupError?.message || "unknown error"}`.slice(0, 2000),
          updated_at: new Date().toISOString(),
        })
        .in("id", rows.map((row) => row.queue_id));
      if (releaseError) console.error("Could not release claimed kiosk follow-ups:", releaseError);
      throw lookupError;
    }

    const suppressionRows = suppressionResult.data;
    const blocklistRows = blocklistResult.data;
    const suppressedEmails = new Set(
      [...(suppressionRows || []), ...(blocklistRows || [])]
        .map((row) => (row.email || "").toLowerCase().trim())
        .filter(Boolean),
    );

    let sent = 0;
    let suppressed = 0;
    let failed = 0;

    for (const row of rows) {
      const normalizedEmail = row.email.toLowerCase().trim();
      if (suppressedEmails.has(normalizedEmail)) {
        await supabase
          .from("family_squares_kiosk_followups")
          .update({
            status: "suppressed",
            suppressed_at: new Date().toISOString(),
            claimed_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.queue_id);
        suppressed += 1;
        continue;
      }

      try {
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sendgridKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: row.email, name: row.name }] }],
            from: { email: "matt@soberhelpline.com", name: "Matt Brown | Sober Helpline" },
            reply_to: { email: "matt@soberhelpline.com", name: "Matt Brown" },
            subject: "You're invited back to Family Squares next Monday",
            content: [{ type: "text/html", value: emailHtml(row.name, row.meeting_date) }],
            custom_args: {
              message_type: "family_squares_kiosk_tuesday_invitation",
              queue_id: row.queue_id,
            },
          }),
        });

        if (!response.ok) {
          const details = await response.text();
          throw new Error(`SendGrid error [${response.status}]: ${details}`);
        }

        const now = new Date().toISOString();
        await supabase
          .from("family_squares_kiosk_followups")
          .update({
            status: "sent",
            sent_at: now,
            claimed_at: null,
            next_attempt_at: null,
            last_error: null,
            updated_at: now,
          })
          .eq("id", row.queue_id);
        sent += 1;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown send error";
        const retryAt = new Date(Date.now() + Math.min(row.attempts, 4) * 30 * 60 * 1000).toISOString();
        await supabase
          .from("family_squares_kiosk_followups")
          .update({
            status: "failed",
            claimed_at: null,
            next_attempt_at: retryAt,
            last_error: message.slice(0, 2000),
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.queue_id);
        failed += 1;
      }
    }

    return new Response(JSON.stringify({ claimed: rows.length, sent, suppressed, failed }), { headers: JSON_HEADERS });
  } catch (error: unknown) {
    console.error("send-family-squares-kiosk-followups error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: JSON_HEADERS });
  }
});
