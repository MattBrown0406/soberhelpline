// Pure date logic, picking and rendering for send-member-weekly-note (no I/O,
// unit tested in note_test.ts). All dates are Pacific (America/Los_Angeles).

export const SITE_URL = "https://soberhelpline.com";
export const SETTINGS_URL = `${SITE_URL}/member-home#email-settings`;
const TZ = "America/Los_Angeles";

// ------------------------------------------------------------------- dates

export function pacificDate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export function pacificHour(d: Date): number {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hourCycle: "h23" }).format(d));
}

/** 0 = Sunday … 6 = Saturday, for an ISO date (calendar arithmetic, no time zone). */
export function weekday(isoDate: string): number {
  return new Date(`${isoDate}T12:00:00Z`).getUTCDay();
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * The note goes out on Tuesday from 4 PM Pacific. The window stays open until
 * 7 PM so a long member list, or a bad half hour at the email provider, is
 * caught up the same evening (the ledger stops anyone getting it twice).
 */
export function isSendWindow(now: Date): boolean {
  const hour = pacificHour(now);
  return weekday(pacificDate(now)) === 2 && hour >= 16 && hour < 19;
}

/** The Tuesday this note belongs to: today if Tuesday, else the most recent Tuesday (Pacific). */
export function periodTuesday(now: Date): string {
  const today = pacificDate(now);
  const back = (weekday(today) - 2 + 7) % 7;
  return addDays(today, -back);
}

export function formatLongDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric" })
    .format(new Date(`${isoDate}T12:00:00Z`));
}

// ------------------------------------------------------------- next step

export interface TrackStep { title: string; path: string }
export interface Track { id: string; title: string; steps: TrackStep[] }
export interface Exercise { id: string; title: string; minutes?: number }

export type NextStep =
  | { kind: "choose" }
  | { kind: "step"; trackTitle: string; title: string; path: string }
  | { kind: "done"; trackTitle: string };

export function nextStep(tracks: Track[], trackId: string | null | undefined, completedPaths: Set<string>): NextStep {
  const track = trackId ? tracks.find((t) => t.id === trackId) : undefined;
  if (!track) return { kind: "choose" };
  const step = track.steps.find((s) => !completedPaths.has(s.path));
  if (!step) return { kind: "done", trackTitle: track.title };
  return { kind: "step", trackTitle: track.title, title: step.title, path: step.path };
}

/** Index of the week a period belongs to, used to rotate the suggested exercise. */
export function weekIndex(periodKey: string): number {
  return Math.floor(Date.parse(`${periodKey}T12:00:00Z`) / (7 * 86_400_000));
}

/**
 * One exercise the member hasn't completed in the last 30 days, rotating by
 * week. `excludeId` skips the exercise already shown as their next step.
 * Null when every exercise was done recently.
 */
export function pickExercise(
  exercises: Exercise[],
  recentlyCompleted: Set<string>,
  periodKey: string,
  excludeId?: string | null,
): Exercise | null {
  const n = exercises.length;
  if (n === 0) return null;
  const start = ((weekIndex(periodKey) % n) + n) % n;
  for (let i = 0; i < n; i++) {
    const ex = exercises[(start + i) % n];
    if (recentlyCompleted.has(ex.id) || ex.id === excludeId) continue;
    return ex;
  }
  return null;
}

export function exerciseIdFromPath(path: string | undefined): string | null {
  const m = /^\/workbook\/([^/?#]+)/.exec(path ?? "");
  return m ? m[1] : null;
}

// ------------------------------------------------------------ forum threads

export interface ThreadCandidate { id: string; topic_id: string; title: string | null; created_at: string }
export interface Thread { id: string; topicId: string; title: string; replies: number }

/** Up to `limit` titled threads with the most replies (newest first on ties). */
export function topThreads(posts: ThreadCandidate[], replyCounts: Map<string, number>, limit = 3): Thread[] {
  return posts
    .filter((p) => (p.title ?? "").trim().length > 0)
    .map((p) => ({ p, replies: replyCounts.get(p.id) ?? 0 }))
    .sort((a, b) => b.replies - a.replies || b.p.created_at.localeCompare(a.p.created_at))
    .slice(0, limit)
    .map(({ p, replies }) => ({ id: p.id, topicId: p.topic_id, title: p.title!.replace(/\s+/g, " ").trim(), replies }));
}

// --------------------------------------------------------------- rendering

export interface WeeklyNoteData {
  firstName?: string | null;
  periodKey: string;
  recordingPublished: boolean;
  answeredCount: number;
  next: NextStep;
  exercise: Exercise | null;
  threads: Thread[];
}

export function escapeHtml(text: string | null | undefined): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(text ?? "").replace(/[&<>"']/g, (m) => map[m]);
}

function link(path: string, label: string): string {
  const href = path.startsWith("http") ? path : `${SITE_URL}${path}`;
  return `<a href="${escapeHtml(href)}" style="color:#166534; font-weight:bold;">${escapeHtml(label)}</a>`;
}

function block(heading: string, inner: string): string {
  return `
      <div style="border:1px solid #e5e7eb; border-radius:8px; padding:16px 18px; margin:16px 0;">
        <p style="margin:0 0 6px 0; font-size:12px; text-transform:uppercase; letter-spacing:0.05em; color:#16a34a; font-weight:bold;">${escapeHtml(heading)}</p>
        ${inner}
      </div>`;
}

export function renderWeeklyNote(d: WeeklyNoteData): { subject: string; html: string } {
  const lastMonday = addDays(d.periodKey, -1);
  const nextMonday = addDays(d.periodKey, 6);
  const name = (d.firstName ?? "").trim();
  const parts: string[] = [];

  // Last Monday's meeting.
  const recording = d.recordingPublished
    ? `<p style="margin:0;">The recording of last Monday's meeting is ready. ${link("/zoom-recordings", "Watch the recording")}</p>`
    : `<p style="margin:0;">The recording of last Monday's meeting will be posted soon.</p>`;
  const answered = d.answeredCount > 0
    ? `<p style="margin:8px 0 0 0;">${d.answeredCount === 1 ? "One member question" : `${d.answeredCount} member questions`} from ${escapeHtml(formatLongDate(lastMonday))} ${d.answeredCount === 1 ? "has" : "have"} been answered. ${link("/member-qa", "Read the answers")}</p>`
    : "";
  parts.push(block("Last Monday", recording + answered));

  // Your next step.
  if (d.next.kind === "step") {
    parts.push(block(
      "Your next step",
      `<p style="margin:0;">On your path, <em>${escapeHtml(d.next.trackTitle)}</em>, the next step is:</p>
       <p style="margin:8px 0 0 0;">${link(d.next.path, d.next.title)}</p>`,
    ));
  } else if (d.next.kind === "done") {
    parts.push(block(
      "Your next step",
      `<p style="margin:0;">You've finished every step of <em>${escapeHtml(d.next.trackTitle)}</em>. When you're ready, you can choose another path. ${link("/member-home", "Choose a path")}</p>`,
    ));
  } else {
    parts.push(block(
      "Your next step",
      `<p style="margin:0;">Pick the path that fits what your family is facing, and we'll suggest one step at a time. ${link("/member-home", "Choose your path")}</p>`,
    ));
  }

  // Try this week.
  if (d.exercise) {
    const minutes = d.exercise.minutes ? ` (about ${d.exercise.minutes} minutes)` : "";
    parts.push(block(
      "Try this week",
      `<p style="margin:0;">${link(`/workbook/${encodeURIComponent(d.exercise.id)}`, d.exercise.title)}${escapeHtml(minutes)}</p>
       <p style="margin:6px 0 0 0; color:#4b5563; font-size:14px;">A short guided exercise. What you write stays private.</p>`,
    ));
  }

  // From the forum.
  // No thread titles here: a title is a member's own words, and this note
  // goes to every member's inbox.
  const threadList = d.threads.length
    ? `<p style="margin:0 0 10px 0;">Members have been talking in the forum this week. ${link("/family-forum", "See the conversations")}</p>`
    : "";
  parts.push(block(
    "From the forum",
    `${threadList}<p style="margin:0;">Have something you'd like to talk about on Monday? ${link("/family-forum/this-weeks-meeting", "Post it in This Week's Meeting")}</p>`,
  ));

  // Next Monday.
  parts.push(block(
    "Next meeting",
    `<p style="margin:0;"><strong>Family Squares</strong> meets ${escapeHtml(formatLongDate(nextMonday))}, 7:00–8:00 PM Pacific. As a member you don't need to register. ${link("/member-home", "Your member home")}</p>`,
  ));

  const html = `
    <div style="max-width:600px; margin:0 auto; font-family:Arial, sans-serif; color:#1f2937; line-height:1.6;">
      <h1 style="color:#166534; font-size:22px; margin-bottom:4px;">This week at Sober Helpline</h1>
      <p>${name ? `Hi ${escapeHtml(name)},` : "Hi,"}</p>
      <p>Here is what's waiting for you this week. Take what helps and leave the rest.</p>
      ${parts.join("")}
      <p style="margin-top:24px;">— Matt</p>
      <p style="color:#6b7280; font-size:13px; margin-top:30px; border-top:1px solid #e5e7eb; padding-top:15px;">
        You're getting this weekly note because you're a Sober Helpline member.
        <a href="${SETTINGS_URL}" style="color:#6b7280;">Change your email settings</a>.
        Questions? Call us at <strong>(458) 298-8008</strong>.
      </p>
      <p style="color:#6b7280; font-size:12px;">Sober Helpline — Supporting Families Through Recovery</p>
    </div>`;

  return { subject: "This week at Sober Helpline", html };
}
