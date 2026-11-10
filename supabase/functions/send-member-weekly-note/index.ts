import "../_shared/suppression.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAutomationAuthNow } from "../_shared/automationAuth.ts";
import tracksFile from "../_shared/memberTracks.json" with { type: "json" };
import exercisesFile from "../_shared/memberExercises.json" with { type: "json" };
import {
  addDays,
  type Exercise,
  exerciseIdFromPath,
  isSendWindow,
  nextStep,
  periodTuesday,
  pickExercise,
  renderWeeklyNote,
  type Thread,
  type ThreadCandidate,
  topThreads,
  type Track,
  type WeeklyNoteData,
} from "./note.ts";

// The weekly "this week" member email. Cron jobs send-member-weekly-note-a/-b
// fire every 10 minutes in two UTC hours (DST); only runs on Tuesday in the
// 4 PM Pacific hour send. Each member is claimed in member_email_log
// (kind 'weekly_note', period_key = that Tuesday) before sending and released
// if the send fails, so later runs in the same hour finish a large list
// without sending anyone twice.
//
// Body options (all need credentials, as does every call):
//   { "dry_run": true }            counts + one rendered sample, sends nothing
//   { "test_email": "<address>" }  sends one sample to that address only
//   { "force": true }              skips the Tuesday 4 PM guard

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret, x-cron-secret",
};

const KIND = "weekly_note";
const MAX_SENDS_PER_RUN = 250;
const TIME_BUDGET_MS = 100_000;
const TRACKS = ((tracksFile as { tracks?: Track[] }).tracks ?? []) as Track[];
const EXERCISES = ((exercisesFile as { exercises?: Exercise[] }).exercises ?? []) as Exercise[];
const STEP_PATHS = [...new Set(TRACKS.flatMap((t) => t.steps.map((s) => s.path)))];

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }));
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
  });
  if (!res.ok) {
    console.error(`SendGrid error: [${res.status}] ${(await res.text()).slice(0, 300)}`);
    return false;
  }
  return true;
}

/** Reads every page of a query (PostgREST caps each response). */
async function allRows<T>(
  build: (from: number, to: number) => PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>,
): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await build(from, from + 999);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as T[];
    out.push(...rows);
    if (rows.length < 1000) break;
  }
  return out;
}

/** Shared content for this week's note (same for every member). */
async function sharedContent(admin: AdminClient, periodKey: string, now: Date) {
  const lastMonday = addDays(periodKey, -1);

  const { data: rec } = await admin
    .from("zoom_call_recordings")
    .select("id")
    .eq("is_published", true)
    .eq("recording_date", lastMonday)
    .limit(1);
  const recordingPublished = (rec ?? []).length > 0;

  const { count } = await admin
    .from("meeting_qa_archive")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true)
    .eq("meeting_date", lastMonday);
  const answeredCount = count ?? 0;

  let threads: Thread[] = [];
  try {
    const since = new Date(now.getTime() - 7 * 86_400_000).toISOString();
    const { data: posts, error } = await admin
      .from("forum_posts")
      .select("id, topic_id, title, created_at")
      .is("parent_post_id", null)
      .gte("created_at", since)
      .limit(500);
    if (error) throw new Error(error.message);
    const candidates = (posts ?? []) as ThreadCandidate[];
    const counts = new Map<string, number>();
    for (const part of chunk(candidates.map((p) => p.id), 100)) {
      const { data: replies, error: rErr } = await admin.from("forum_posts").select("parent_post_id").in("parent_post_id", part);
      if (rErr) throw new Error(rErr.message);
      for (const r of (replies ?? []) as { parent_post_id: string }[]) {
        counts.set(r.parent_post_id, (counts.get(r.parent_post_id) ?? 0) + 1);
      }
    }
    threads = topThreads(candidates, counts, 3);
  } catch (e) {
    console.error("forum threads unavailable", (e as Error)?.message);
  }

  return { recordingPublished, answeredCount, threads };
}

/** Per-member path, completed steps and recent exercises. Tables owned by other
 * workstreams may not exist yet: then that block falls back (choose a path /
 * any exercise) instead of failing the run. */
async function memberContext(admin: AdminClient, userIds: string[]) {
  const pathByUser = new Map<string, string>();
  const completed = new Map<string, Set<string>>();
  const recentEx = new Map<string, Set<string>>();
  const addTo = (m: Map<string, Set<string>>, k: string, v: string) => {
    const s = m.get(k) ?? new Set<string>();
    s.add(v);
    m.set(k, s);
  };

  for (const part of chunk(userIds, 100)) {
    const { data, error } = await admin.from("member_learning_paths").select("user_id, track_id").in("user_id", part);
    if (error) {
      console.error("member_learning_paths unavailable", error.message);
      break;
    }
    for (const r of (data ?? []) as { user_id: string; track_id: string }[]) pathByUser.set(r.user_id, r.track_id);
  }

  const withPath = userIds.filter((id) => pathByUser.has(id));
  for (const part of chunk(withPath, 50)) {
    try {
      const rows = await allRows<{ user_id: string; resource_path: string }>((from, to) =>
        admin.from("education_progress").select("user_id, resource_path")
          .in("user_id", part).eq("status", "completed").in("resource_path", STEP_PATHS)
          .order("id").range(from, to)
      );
      for (const r of rows) addTo(completed, r.user_id, r.resource_path);
    } catch (e) {
      console.error("education_progress unavailable", (e as Error)?.message);
      break;
    }
  }

  const since30 = new Date(Date.now() - 30 * 86_400_000).toISOString();
  for (const part of chunk(userIds, 50)) {
    try {
      const rows = await allRows<{ user_id: string; exercise_id: string }>((from, to) =>
        admin.from("workbook_entries").select("user_id, exercise_id")
          .in("user_id", part).gte("completed_at", since30)
          .order("id").range(from, to)
      );
      for (const r of rows) addTo(recentEx, r.user_id, r.exercise_id);
    } catch (e) {
      console.error("workbook_entries unavailable", (e as Error)?.message);
      break;
    }
  }

  return { pathByUser, completed, recentEx };
}

function personalData(
  userId: string,
  firstName: string | null,
  periodKey: string,
  shared: { recordingPublished: boolean; answeredCount: number; threads: Thread[] },
  ctx: Awaited<ReturnType<typeof memberContext>>,
): WeeklyNoteData {
  const next = nextStep(TRACKS, ctx.pathByUser.get(userId), ctx.completed.get(userId) ?? new Set());
  const exclude = next.kind === "step" ? exerciseIdFromPath(next.path) : null;
  return {
    firstName,
    periodKey,
    ...shared,
    next,
    exercise: pickExercise(EXERCISES, ctx.recentEx.get(userId) ?? new Set(), periodKey, exclude),
  };
}

/** Active members (is_active_family_member) among family membership rows. */
async function activeMemberIds(admin: AdminClient): Promise<string[]> {
  const rows = await allRows<{ user_id: string }>((from, to) =>
    admin.from("provider_subscriptions").select("user_id")
      .is("provider_submission_id", null).in("status", ["active", "cancelled"])
      .order("id").range(from, to)
  );
  const candidates = [...new Set(rows.map((r) => r.user_id).filter(Boolean))];
  const active = await mapLimit(candidates, 10, async (id) => {
    const { data, error } = await admin.rpc("is_active_family_member", { _user_id: id });
    return !error && data === true;
  });
  return candidates.filter((_, i) => active[i]);
}

async function verifiedEmail(admin: AdminClient, userId: string): Promise<string | null> {
  try {
    const { data } = await admin.auth.admin.getUserById(userId);
    const u = (data?.user ?? undefined) as unknown as Record<string, unknown> | undefined;
    const bannedUntil = typeof u?.banned_until === "string" ? Date.parse(u.banned_until) : NaN;
    if (Number.isFinite(bannedUntil) && bannedUntil > Date.now()) return null;
    if (u && typeof u.email === "string" && u.email.includes("@") && u.email_confirmed_at) return u.email.trim();
  } catch (e) {
    console.error("getUserById failed", (e as Error)?.message);
  }
  return null;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const started = Date.now();

  try {
    const admin = adminClient();
    let body: Record<string, unknown> = {};
    try {
      body = (await req.json()) ?? {};
    } catch { /* no body */ }

    const denied = await requireAutomationAuthNow(req, admin, body, "send-member-weekly-note", corsHeaders);
    if (denied) return denied;

    const dryRun = body.dry_run === true;
    const testEmail = typeof body.test_email === "string" ? body.test_email.trim() : "";
    const force = body.force === true;
    const now = new Date();

    if (!dryRun && !testEmail && !force && !isSendWindow(now)) {
      return json({ success: true, sent: 0, skipped: "outside_tuesday_4pm_pacific" });
    }

    const periodKey = periodTuesday(now);
    const shared = await sharedContent(admin, periodKey, now);

    if (testEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) return json({ error: "invalid test_email" }, 400);
      const sample = renderWeeklyNote({
        firstName: "Friend",
        periodKey,
        ...shared,
        next: nextStep(TRACKS, TRACKS[0]?.id, new Set()),
        exercise: pickExercise(EXERCISES, new Set(), periodKey, exerciseIdFromPath(TRACKS[0]?.steps?.[0]?.path)),
      });
      const ok = await sendEmail(testEmail, `[Test] ${sample.subject}`, sample.html);
      return json({ test: true, sent: ok, period_key: periodKey });
    }

    // Recipients: active members, not opted out, not already sent this period.
    const members = await activeMemberIds(admin);
    const optedOut = new Set<string>();
    for (const part of chunk(members, 100)) {
      const { data, error } = await admin.from("user_notification_preferences")
        .select("user_id, weekly_member_note").in("user_id", part);
      if (error) throw new Error(`preferences lookup failed: ${error.message}`);
      for (const r of (data ?? []) as { user_id: string; weekly_member_note: boolean | null }[]) {
        if (r.weekly_member_note === false) optedOut.add(r.user_id);
      }
    }
    const alreadySent = new Set<string>();
    for (const part of chunk(members, 100)) {
      const { data, error } = await admin.from("member_email_log")
        .select("user_id").eq("kind", KIND).eq("period_key", periodKey).in("user_id", part);
      if (error) throw new Error(`member_email_log lookup failed: ${error.message}`);
      for (const r of (data ?? []) as { user_id: string }[]) alreadySent.add(r.user_id);
    }
    const todo = members.filter((id) => !optedOut.has(id) && !alreadySent.has(id));

    if (dryRun) {
      const sampleIds = todo.slice(0, 1);
      const ctx = await memberContext(admin, sampleIds);
      const sample = sampleIds[0]
        ? renderWeeklyNote(personalData(sampleIds[0], "Friend", periodKey, shared, ctx))
        : renderWeeklyNote({ firstName: "Friend", periodKey, ...shared, next: { kind: "choose" }, exercise: pickExercise(EXERCISES, new Set(), periodKey) });
      return json({
        dry_run: true,
        period_key: periodKey,
        send_window_now: isSendWindow(now),
        active_members: members.length,
        opted_out: optedOut.size,
        already_sent: alreadySent.size,
        to_send: todo.length,
        recording_published: shared.recordingPublished,
        answered_count: shared.answeredCount,
        threads: shared.threads.length,
        sample,
      });
    }

    let sent = 0;
    let failed = 0;
    let noVerifiedEmail = 0;
    let claimedElsewhere = 0;
    let processed = 0;
    let stop = false;
    for (const batch of chunk(todo, 100)) {
      if (stop) break;
      const ctx = await memberContext(admin, batch);
      const { data: profiles } = await admin.from("profiles").select("id, first_name").in("id", batch);
      const names = new Map(((profiles ?? []) as { id: string; first_name: string | null }[]).map((p) => [p.id, p.first_name]));

      for (const userId of batch) {
        if (sent >= MAX_SENDS_PER_RUN || Date.now() - started > TIME_BUDGET_MS) {
          stop = true;
          break;
        }
        processed++;
        const email = await verifiedEmail(admin, userId);
        if (!email) {
          noVerifiedEmail++;
          continue;
        }
        const { data: claimRows, error: claimErr } = await admin.from("member_email_log")
          .upsert({ kind: KIND, period_key: periodKey, user_id: userId }, { onConflict: "kind,period_key,user_id", ignoreDuplicates: true })
          .select("id");
        if (claimErr) {
          console.error("claim failed", claimErr.message);
          failed++;
          continue;
        }
        const claimId = ((claimRows ?? []) as { id: string }[])[0]?.id;
        if (!claimId) {
          claimedElsewhere++;
          continue;
        }
        let ok = false;
        try {
          const { subject, html } = renderWeeklyNote(personalData(userId, names.get(userId) ?? null, periodKey, shared, ctx));
          ok = await sendEmail(email, subject, html);
        } catch (e) {
          console.error("send failed", (e as Error)?.message);
        }
        if (ok) {
          sent++;
        } else {
          failed++;
          const { error } = await admin.from("member_email_log").delete().eq("id", claimId);
          if (error) console.error("release failed", error.message);
        }
        await new Promise((r) => setTimeout(r, 50));
      }
    }

    const remaining = todo.length - processed;
    console.log(`send-member-weekly-note period=${periodKey} sent=${sent} failed=${failed} noVerifiedEmail=${noVerifiedEmail} remaining=${remaining}`);
    return json({
      success: true,
      period_key: periodKey,
      sent,
      failed,
      no_verified_email: noVerifiedEmail,
      claimed_elsewhere: claimedElsewhere,
      remaining,
    });
  } catch (error) {
    console.error("send-member-weekly-note error:", (error as Error)?.message ?? error);
    return json({ error: (error as Error)?.message ?? "Unknown error" }, 500);
  }
});
