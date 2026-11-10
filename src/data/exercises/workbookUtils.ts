import type { Answers, ExerciseOutput, ExerciseStep } from "./types";
import { otherKey } from "./types";
import { visibleSteps } from "./helpers";

export const RETAKE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

/** The date an exercise completed at `completedAt` can be retaken. */
export function retakeDate(completedAt: string | Date): Date {
  const d = typeof completedAt === "string" ? new Date(completedAt) : completedAt;
  return new Date(d.getTime() + RETAKE_DAYS * DAY_MS);
}

export function isDueForRetake(completedAt: string | Date, now: Date = new Date()): boolean {
  return now.getTime() >= retakeDate(completedAt).getTime();
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Nov 3", or "Nov 3, 2025" when not in the current year. */
export function shortDate(value: string | Date, now: Date = new Date()): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  const base = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return d.getFullYear() === now.getFullYear() ? base : `${base}, ${d.getFullYear()}`;
}

/** Keep only answers to the steps she actually saw (drops stale branch answers). */
export function pruneAnswers(steps: ExerciseStep[], answers: Answers): Answers {
  const out: Answers = {};
  for (const s of visibleSteps(steps, answers)) {
    if (answers[s.id] !== undefined && answers[s.id] !== null && answers[s.id] !== "") out[s.id] = answers[s.id];
    const ok = otherKey(s.id);
    if (typeof answers[ok] === "string" && (answers[ok] as string).trim()) out[ok] = answers[ok];
  }
  return out;
}

/** Plain-text version of an output, for Copy. */
export function outputToText(output: ExerciseOutput, dateLabel?: string): string {
  const lines: string[] = [];
  lines.push(output.title + (dateLabel ? ` (${dateLabel})` : ""));
  lines.push("");
  for (const section of output.sections ?? []) {
    lines.push(section.heading);
    for (const p of section.paragraphs ?? []) lines.push(p);
    for (const item of section.items ?? []) lines.push(`- ${item}`);
    lines.push("");
  }
  for (const c of output.closing ?? []) lines.push(c);
  return lines.join("\n").trim() + "\n";
}

/** Score difference wording for "Compare with last time" (lower is better). */
export function describeChange(previous: number, current: number, sinceLabel: string): string {
  const diff = current - previous;
  if (diff === 0) return `The same score as ${sinceLabel}.`;
  const pts = Math.abs(diff) === 1 ? "point" : "points";
  if (diff < 0) {
    return `Down ${Math.abs(diff)} ${pts} since ${sinceLabel}. A lower score means these patterns are showing up less.`;
  }
  return `Up ${diff} ${pts} since ${sinceLabel}. Hard stretches happen. This is information, not a grade.`;
}

// ---- Draft storage (in-progress answers survive a refresh) ----

export interface Draft {
  v: 1;
  answers: Answers;
  stepIndex: number;
  savedAt: string;
}

const draftKey = (userId: string | null, exerciseId: string) => `workbook-draft:${userId ?? "anon"}:${exerciseId}`;

export function loadDraft(userId: string | null, exerciseId: string): Draft | null {
  try {
    const raw = window.localStorage.getItem(draftKey(userId, exerciseId));
    if (!raw) return null;
    const d = JSON.parse(raw) as Draft;
    if (!d || d.v !== 1 || typeof d.answers !== "object" || d.answers === null) return null;
    return { v: 1, answers: d.answers, stepIndex: Number.isFinite(d.stepIndex) ? d.stepIndex : 0, savedAt: d.savedAt };
  } catch {
    return null;
  }
}

export function saveDraft(userId: string | null, exerciseId: string, answers: Answers, stepIndex: number): void {
  try {
    const d: Draft = { v: 1, answers, stepIndex, savedAt: new Date().toISOString() };
    window.localStorage.setItem(draftKey(userId, exerciseId), JSON.stringify(d));
  } catch {
    // Storage full or blocked (private mode): the exercise still works.
  }
}

export function clearDraft(userId: string | null, exerciseId: string): void {
  try {
    window.localStorage.removeItem(draftKey(userId, exerciseId));
  } catch {
    // ignore
  }
}

export function hasDraft(userId: string | null, exerciseId: string): boolean {
  const d = loadDraft(userId, exerciseId);
  return !!d && Object.keys(d.answers).length > 0;
}

/**
 * Card order for the exercise grid: in progress, then never done, then due
 * for a retake, then done recently (oldest completion first within the last
 * two groups). Catalog order breaks ties.
 */
export function orderExercises<T extends { id: string }>(
  exercises: T[],
  latest: Record<string, { completed_at: string } | undefined>,
  inProgress: Set<string>,
  now: Date = new Date(),
): T[] {
  const rank = (id: string) => {
    const l = latest[id];
    if (inProgress.has(id)) return 0;
    if (!l) return 1;
    return isDueForRetake(l.completed_at, now) ? 2 : 3;
  };
  return exercises
    .map((e, i) => ({ e, i, r: rank(e.id), t: latest[e.id] ? new Date(latest[e.id]!.completed_at).getTime() : 0 }))
    .sort((a, b) => a.r - b.r || (a.r >= 2 ? a.t - b.t : 0) || a.i - b.i)
    .map((x) => x.e);
}
