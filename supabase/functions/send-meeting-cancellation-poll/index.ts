import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://soberhelpline.com";
const SENDER_EMAIL = "matt@soberhelpline.com";
const SENDER_NAME = "Matt Brown | Sober Helpline";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function firstNameOf(name?: string | null) {
  if (!name) return "";
  const t = name.trim().split(/\s+/)[0];
  return t || "";
}

function buildEmailHtml(params: {
  firstName: string;
  option1Label: string;
  option2Label: string;
  voteBase: string;
  pollUrl: string;
}) {
  const greeting = params.firstName ? `Hi ${escapeHtml(params.firstName)},` : "Hi there,";
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr><td style="padding:28px 32px 8px;">
            <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:#0f172a;">Monday Meeting Cancelled — Quick Vote on Reschedule</h1>
            <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#334155;">${greeting}</p>
            <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#334155;">
              I'm so sorry to do this on short notice — I have to cancel tonight's 7 PM PT Monday meeting.
              I'll be on a plane to Texas during our normal meeting time to help a family with an intervention.
              I truly hate to let you down, and I appreciate your patience and understanding.
            </p>
            <p style="margin:0 0 20px;font-size:16px;line-height:1.55;color:#334155;">
              To make it up to everyone, I'd like to hear from you. Would you rather I:
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
              <tr><td align="center" style="padding:6px 0;">
                <a href="${params.voteBase}&amp;choice=1"
                   style="display:inline-block;padding:14px 22px;background:#0ea5e9;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;min-width:280px;text-align:center;">
                  ${escapeHtml(params.option1Label)}
                </a>
              </td></tr>
              <tr><td align="center" style="padding:6px 0;">
                <a href="${params.voteBase}&amp;choice=2"
                   style="display:inline-block;padding:14px 22px;background:#0f766e;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;min-width:280px;text-align:center;">
                  ${escapeHtml(params.option2Label)}
                </a>
              </td></tr>
            </table>

            <p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:#475569;">
              One click above records your vote. I'll go with whatever the group prefers.
              You can also open the poll page directly:
              <a href="${params.pollUrl}" style="color:#0369a1;">${params.pollUrl}</a>
            </p>

            <p style="margin:20px 0 4px;font-size:16px;line-height:1.55;color:#334155;">
              Thank you for your patience,
            </p>
            <p style="margin:0 0 8px;font-size:16px;line-height:1.55;color:#0f172a;font-weight:600;">
              Matt Brown
            </p>
            <p style="margin:0 0 24px;font-size:14px;line-height:1.5;color:#64748b;">
              Sober Helpline &middot; The Family Squares
            </p>
          </td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">You're receiving this because you registered for the Monday Zoom meeting.</p>
      </td></tr>
    </table>
  </body>
</html>`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sendgridKey = Deno.env.get("SENDGRID_API_KEY");

  if (!sendgridKey) {
    return new Response(JSON.stringify({ error: "SENDGRID_API_KEY is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Admin-only: require caller to be an authenticated admin.
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: isAdmin } = await admin.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "admin",
  });
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Admin only" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const meetingDate: string = body?.meeting_date || "2026-07-06";
    const dryRun: boolean = Boolean(body?.dry_run);
    const option1Label: string =
      body?.option_1_label || "Wait until next Monday, July 13 (7 PM PT)";
    const option2Label: string =
      body?.option_2_label || "Move it to Thursday, July 9 at 7 PM PT";
    const title: string =
      body?.title || "Monday Meeting Cancelled — Quick Vote on Reschedule";
    const question: string =
      body?.question || "Would you rather wait until next Monday, or move this week's meeting to Thursday July 9?";
    const slugBase = `meeting-cancel-${meetingDate}`;

    // Upsert the poll (one per meeting_date+slug)
    let pollId: string | null = null;
    {
      const { data: existing } = await admin
        .from("email_polls")
        .select("id")
        .eq("slug", slugBase)
        .maybeSingle();
      if (existing?.id) {
        pollId = existing.id;
        await admin
          .from("email_polls")
          .update({ title, question, option_1_label: option1Label, option_2_label: option2Label, meeting_date: meetingDate })
          .eq("id", pollId);
      } else {
        const { data: created, error: createErr } = await admin
          .from("email_polls")
          .insert({
            slug: slugBase,
            title,
            question,
            option_1_label: option1Label,
            option_2_label: option2Label,
            meeting_date: meetingDate,
            created_by: userData.user.id,
          })
          .select("id")
          .single();
        if (createErr) throw createErr;
        pollId = created.id;
      }
    }

    // Load registrants for that date
    const { data: regs, error: regErr } = await admin
      .from("zoom_meeting_registrations")
      .select("email, name")
      .eq("meeting_date", meetingDate);
    if (regErr) throw regErr;

    // Dedupe by lowercased email
    const uniqueByEmail = new Map<string, { email: string; name: string | null }>();
    for (const r of regs ?? []) {
      const em = (r.email || "").trim().toLowerCase();
      if (!em) continue;
      if (!uniqueByEmail.has(em)) {
        uniqueByEmail.set(em, { email: r.email!.trim(), name: r.name ?? null });
      }
    }

    // Ensure a vote row exists per recipient (idempotent)
    for (const { email, name } of uniqueByEmail.values()) {
      await admin
        .from("email_poll_votes")
        .upsert(
          { poll_id: pollId!, recipient_email: email, recipient_name: name },
          { onConflict: "poll_id,recipient_email", ignoreDuplicates: true },
        );
    }

    // Fetch the vote rows (with tokens)
    const { data: voteRows, error: voteErr } = await admin
      .from("email_poll_votes")
      .select("id, token, recipient_email, recipient_name, email_sent_at")
      .eq("poll_id", pollId!);
    if (voteErr) throw voteErr;

    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          dry_run: true,
          poll_id: pollId,
          recipients: voteRows?.length ?? 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let sent = 0;
    let failed = 0;
    const errors: Array<{ email: string; error: string }> = [];

    for (const row of voteRows ?? []) {
      // Skip anyone we've already emailed for this poll
      if (row.email_sent_at) continue;

      const pollUrl = `${SITE_URL}/poll/${row.token}`;
      const voteBase = `${SITE_URL}/poll/${row.token}?src=email`;

      const html = buildEmailHtml({
        firstName: firstNameOf(row.recipient_name),
        option1Label,
        option2Label,
        voteBase,
        pollUrl,
      });

      try {
        const sg = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sendgridKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: row.recipient_email, name: row.recipient_name || undefined }],
            }],
            from: { email: SENDER_EMAIL, name: SENDER_NAME },
            reply_to: { email: SENDER_EMAIL, name: SENDER_NAME },
            subject: title,
            content: [{ type: "text/html", value: html }],
          }),
        });

        if (sg.ok) {
          sent += 1;
          await admin
            .from("email_poll_votes")
            .update({ email_sent_at: new Date().toISOString() })
            .eq("id", row.id);
        } else {
          failed += 1;
          const text = await sg.text().catch(() => "");
          errors.push({ email: row.recipient_email, error: `HTTP ${sg.status}: ${text.slice(0, 200)}` });
        }
      } catch (err) {
        failed += 1;
        errors.push({
          email: row.recipient_email,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        poll_id: pollId,
        recipients: voteRows?.length ?? 0,
        sent,
        failed,
        errors: errors.slice(0, 20),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("send-meeting-cancellation-poll error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
