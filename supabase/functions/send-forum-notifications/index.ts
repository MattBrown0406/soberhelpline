import "../_shared/suppression.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAutomationAuthNow } from "../_shared/automationAuth.ts";
import { authenticateCronRequest } from "../_shared/cron-auth.ts";
import {
  buildEmails,
  collectNotices,
  type ForumMention,
  type ForumPost,
  ledgerKey,
  type Notice,
  type PlannedEmail,
  type RecipientInfo,
  renderEmail,
  type TopicFollow,
} from "./plan.ts";

// Runs every 15 minutes (cron job send-forum-notifications-15min). Looks at
// forum activity from the last 48 hours and emails replies, @mentions, new
// threads in followed topics, and (to admins) new questions in This Week's
// Meeting. Every email's rows are claimed in forum_notification_log before
// sending and released if the send fails, so a failed email is retried on the
// next run while it is still inside the window, and nothing is sent twice.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret, x-cron-secret",
};

const WINDOW_HOURS = 48;
const MAX_EMAILS_PER_RUN = 200;
const TIME_BUDGET_MS = 100_000;
const LOG_TABLE = "forum_notification_log";
/** site_settings key: ISO time forum emails were switched on. Older activity is never emailed. */
const START_SETTING = "forum_notifications_start_at";
const POST_COLUMNS = "id, topic_id, parent_post_id, user_id, is_anonymous, title, content, created_at";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function adminClient() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}
type AdminClient = ReturnType<typeof adminClient>;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = Deno.env.get("SENDGRID_API_KEY");
  if (!key) throw new Error("SENDGRID_API_KEY is not configured");
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      tracking_settings: { subscription_tracking: { enable: true } },
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "matt@soberhelpline.com", name: "Sober Helpline" },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
    // A hung request must fail (and release its claim) rather than be killed
    // with the function, which would leave the claim behind with no email.
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    console.error(`SendGrid error: [${res.status}] ${(await res.text()).slice(0, 300)}`);
    return false;
  }
  return true;
}

async function postsByIds(admin: AdminClient, ids: string[]): Promise<ForumPost[]> {
  const out: ForumPost[] = [];
  for (const part of chunk(ids, 100)) {
    const { data, error } = await admin.from("forum_posts").select(POST_COLUMNS).in("id", part);
    if (error) throw new Error(`forum_posts lookup failed: ${error.message}`);
    out.push(...((data ?? []) as ForumPost[]));
  }
  return out;
}

async function loadRecipients(
  admin: AdminClient,
  ids: string[],
  adminIds: Set<string>,
): Promise<Map<string, RecipientInfo>> {
  const prefs = new Map<string, Record<string, unknown>>();
  for (const part of chunk(ids, 100)) {
    const { data, error } = await admin
      .from("user_notification_preferences")
      .select("user_id, mention_notifications, reply_notifications, followed_topic_notifications")
      .in("user_id", part);
    // Fail closed: without preferences we can't honour an opt-out.
    if (error) throw new Error(`preferences lookup failed: ${error.message}`);
    for (const row of (data ?? []) as Record<string, unknown>[]) prefs.set(String(row.user_id), row);
  }

  const out = new Map<string, RecipientInfo>();
  await mapLimit(ids, 6, async (id) => {
    let email: string | null = null;
    try {
      const { data } = await admin.auth.admin.getUserById(id);
      const u = (data?.user ?? undefined) as unknown as Record<string, unknown> | undefined;
      const bannedUntil = typeof u?.banned_until === "string" ? Date.parse(u.banned_until) : NaN;
      const banned = Number.isFinite(bannedUntil) && bannedUntil > Date.now();
      if (u && typeof u.email === "string" && u.email.includes("@") && u.email_confirmed_at && !banned) {
        email = u.email.trim();
      }
    } catch (e) {
      console.error("getUserById failed", (e as Error)?.message);
    }
    let isMember = false;
    if (email) {
      const { data, error } = await admin.rpc("is_active_family_member", { _user_id: id });
      isMember = !error && data === true;
    }
    const p = prefs.get(id);
    out.set(id, {
      email,
      isMember,
      isAdmin: adminIds.has(id),
      // A missing row (or a null column) means the default: on.
      replies: p?.reply_notifications !== false,
      mentions: p?.mention_notifications !== false,
      followed: p?.followed_topic_notifications !== false,
    });
  });
  return out;
}

/** Claims the email's ledger rows; returns the notices this run now owns and the row ids. */
async function claim(admin: AdminClient, e: PlannedEmail): Promise<{ notices: Notice[]; ids: string[] }> {
  const rows = e.notices.map((n) => ({ kind: n.kind, post_id: n.postId, recipient_user_id: n.recipientId }));
  const { data, error } = await admin
    .from(LOG_TABLE)
    .upsert(rows, { onConflict: "kind,post_id,recipient_user_id", ignoreDuplicates: true })
    .select("id, kind, post_id, recipient_user_id");
  if (error) {
    console.error("ledger claim failed", error.message);
    return { notices: [], ids: [] };
  }
  const got = (data ?? []) as { id: string; kind: Notice["kind"]; post_id: string; recipient_user_id: string }[];
  const keys = new Set(got.map((r) => ledgerKey(r.kind, r.post_id, r.recipient_user_id)));
  return {
    notices: e.notices.filter((n) => keys.has(ledgerKey(n.kind, n.postId, n.recipientId))),
    ids: got.map((r) => r.id),
  };
}

async function release(admin: AdminClient, ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const { error } = await admin.from(LOG_TABLE).delete().in("id", ids);
  if (error) console.error("ledger release failed", error.message);
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const started = Date.now();
  try {
    const admin = adminClient();
    let body: Record<string, unknown> | null = null;
    try {
      body = (await req.json()) ?? {};
    } catch { /* no body */ }

    // Two ways in: Lovable's managed scheduler (it signs each call with the
    // platform's own cron secret, checked by the generated helper), or the
    // site's own automation credentials (cron secret, service key, an admin).
    const fromManagedScheduler = authenticateCronRequest(req) === null;
    if (!fromManagedScheduler) {
      const denied = await requireAutomationAuthNow(req, admin, body, "send-forum-notifications", corsHeaders);
      if (denied) return denied;
    }

    const dryRun = body?.dry_run === true;

    // Nothing from before go-live is ever emailed: the first run must not
    // send two days of old activity in one burst. The start time is written
    // once, when the scheduled job is created.
    const { data: startRow, error: startErr } = await admin
      .from("site_settings")
      .select("value")
      .eq("key", START_SETTING)
      .maybeSingle();
    if (startErr) throw new Error(`site_settings query failed: ${startErr.message}`);
    const startMs = Date.parse(String(startRow?.value ?? ""));
    if (!Number.isFinite(startMs)) {
      return json({ success: true, sent: 0, skipped: "not_started", detail: `${START_SETTING} is not set` });
    }
    const since = new Date(Math.max(Date.now() - WINDOW_HOURS * 3600_000, startMs)).toISOString();

    // 1. Activity inside the window.
    const { data: recentData, error: recentErr } = await admin
      .from("forum_posts")
      .select(POST_COLUMNS)
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(2000);
    if (recentErr) throw new Error(`forum_posts query failed: ${recentErr.message}`);
    const recentPosts = (recentData ?? []) as ForumPost[];

    const { data: mentionData, error: mentionErr } = await admin
      .from("forum_mentions")
      .select("post_id, mentioned_user_id, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(2000);
    if (mentionErr) throw new Error(`forum_mentions query failed: ${mentionErr.message}`);
    const mentions = (mentionData ?? []) as ForumMention[];

    // 2. Older posts the activity refers to (reply parents, mentioned posts).
    const known = new Set(recentPosts.map((p) => p.id));
    const needed = new Set<string>();
    for (const p of recentPosts) if (p.parent_post_id && !known.has(p.parent_post_id)) needed.add(p.parent_post_id);
    for (const m of mentions) if (!known.has(m.post_id)) needed.add(m.post_id);
    const relatedPosts = needed.size ? await postsByIds(admin, [...needed]) : [];

    // 3. Followers of topics with new threads, and admins.
    const newThreadTopics = [...new Set(recentPosts.filter((p) => !p.parent_post_id).map((p) => p.topic_id))];
    let follows: TopicFollow[] = [];
    if (newThreadTopics.length) {
      const { data, error } = await admin
        .from("forum_topic_follows")
        .select("topic_id, user_id")
        .in("topic_id", newThreadTopics);
      if (error) throw new Error(`forum_topic_follows query failed: ${error.message}`);
      follows = (data ?? []) as TopicFollow[];
    }
    const { data: roleRows, error: roleErr } = await admin.from("user_roles").select("user_id").eq("role", "admin");
    if (roleErr) throw new Error(`user_roles query failed: ${roleErr.message}`);
    const adminIds = [...new Set(((roleRows ?? []) as { user_id: string }[]).map((r) => r.user_id))];

    // 4. What the ledger already has for these posts.
    const postIds = [...new Set([...recentPosts.map((p) => p.id), ...mentions.map((m) => m.post_id)])];
    const logged = new Set<string>();
    for (const part of chunk(postIds, 100)) {
      const { data, error } = await admin
        .from(LOG_TABLE)
        .select("kind, post_id, recipient_user_id")
        .in("post_id", part);
      if (error) throw new Error(`${LOG_TABLE} query failed: ${error.message}`);
      for (const r of (data ?? []) as { kind: Notice["kind"]; post_id: string; recipient_user_id: string }[]) {
        logged.add(ledgerKey(r.kind, r.post_id, r.recipient_user_id));
      }
    }

    const notices = collectNotices({ recentPosts, relatedPosts, mentions, follows, adminIds, logged });
    if (notices.length === 0) {
      return json({ success: true, sent: 0, pending: 0, window_hours: WINDOW_HOURS });
    }

    // 5. Who may receive them (verified email, active member, preferences).
    const recipientIds = [...new Set(notices.map((n) => n.recipientId))];
    const recipients = await loadRecipients(admin, recipientIds, new Set(adminIds));
    const emails = buildEmails(notices, recipients, MAX_EMAILS_PER_RUN);

    const byKind = (list: { kind: string }[]) =>
      list.reduce<Record<string, number>>((acc, x) => ((acc[x.kind] = (acc[x.kind] ?? 0) + 1), acc), {});

    if (dryRun) {
      return json({
        dry_run: true,
        notices: notices.length,
        notices_by_kind: byKind(notices),
        emails: emails.length,
        emails_by_kind: byKind(emails),
        // A made-up example of the first kind, never a real post's title or text.
        sample: emails[0]
          ? renderEmail({
            ...emails[0],
            email: "member@example.com",
            notices: [{ ...emails[0].notices[0], title: "Example title", content: "Example question text." }],
          })
          : null,
      });
    }

    // 6. Claim, send, release on failure.
    let sent = 0;
    let failed = 0;
    let skippedClaimed = 0;
    let stoppedEarly = false;
    const sentByKind: Record<string, number> = {};
    for (const e of emails) {
      if (Date.now() - started > TIME_BUDGET_MS) {
        stoppedEarly = true;
        break;
      }
      const { notices: owned, ids } = await claim(admin, e);
      if (owned.length === 0) {
        skippedClaimed++;
        continue;
      }
      let ok = false;
      try {
        const { subject, html } = renderEmail({ ...e, notices: owned });
        ok = await sendEmail(e.email, subject, html);
      } catch (err) {
        console.error("send failed", (err as Error)?.message);
        ok = false;
      }
      if (ok) {
        sent++;
        sentByKind[e.kind] = (sentByKind[e.kind] ?? 0) + 1;
      } else {
        failed++;
        await release(admin, ids);
      }
    }

    console.log(
      `send-forum-notifications sent=${sent} failed=${failed} skippedClaimed=${skippedClaimed} planned=${emails.length} notices=${notices.length} stoppedEarly=${stoppedEarly}`,
    );
    return json({
      success: true,
      sent,
      sent_by_kind: sentByKind,
      failed,
      skipped_already_claimed: skippedClaimed,
      planned: emails.length,
      stopped_early: stoppedEarly,
    });
  } catch (error) {
    console.error("send-forum-notifications error:", (error as Error)?.message ?? error);
    return json({ error: (error as Error)?.message ?? "Unknown error" }, 500);
  }
});
