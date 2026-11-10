import {
  OTHER_VALUE,
  otherKey,
  type Answers,
  type ChoiceOption,
  type ExerciseStep,
  type ScaleStep,
  type ScoreResult,
} from "./types";

/** Trimmed text answer ("" when missing). */
export function text(answers: Answers, id: string): string {
  const v = answers?.[id];
  return typeof v === "string" ? v.trim() : "";
}

/** Raw multi selection (option values). */
export function selected(answers: Answers, id: string): string[] {
  const v = answers?.[id];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

export function scaleValue(answers: Answers, id: string): number | null {
  const v = answers?.[id];
  return typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.min(4, Math.round(v))) : null;
}

function labelFor(options: ChoiceOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/**
 * Labels of a multi answer, in option order, with the "something else" text
 * substituted for OTHER_VALUE (dropped when empty).
 */
export function selectedLabels(answers: Answers, id: string, options: ChoiceOption[]): string[] {
  const values = selected(answers, id);
  const out: string[] = [];
  for (const o of options) if (values.includes(o.value)) out.push(o.label);
  if (values.includes(OTHER_VALUE)) {
    const other = text(answers, otherKey(id));
    if (other) out.push(other);
  }
  return out;
}

/** Label of a single answer, with the "something else" text when chosen. */
export function singleLabel(answers: Answers, id: string, options: ChoiceOption[]): string {
  const v = text(answers, id);
  if (!v) return "";
  if (v === OTHER_VALUE) return text(answers, otherKey(id));
  return labelFor(options, v);
}

/** Turn plain strings into options whose value is the label itself. */
export function opts(labels: string[]): ChoiceOption[] {
  return labels.map((label) => ({ value: label, label }));
}

/** Steps the member actually sees for the current answers. */
export function visibleSteps(steps: ExerciseStep[], answers: Answers): ExerciseStep[] {
  return steps.filter((s) => !s.showIf || s.showIf(answers));
}

/** Whether a step has a usable answer (optional steps are never blocking). */
export function hasAnswer(step: ExerciseStep, answers: Answers): boolean {
  switch (step.type) {
    case "single": {
      const v = text(answers, step.id);
      if (!v) return false;
      if (v === OTHER_VALUE) return text(answers, otherKey(step.id)).length > 0;
      return true;
    }
    case "multi": {
      const values = selected(answers, step.id);
      if (values.length === 0) return false;
      if (values.length === 1 && values[0] === OTHER_VALUE) return text(answers, otherKey(step.id)).length > 0;
      return true;
    }
    case "scale":
      return scaleValue(answers, step.id) !== null;
    default:
      return text(answers, step.id).length > 0;
  }
}

export function canContinue(step: ExerciseStep, answers: Answers): boolean {
  if (step.optional) return true;
  if (step.type === "multi" && step.noneLabel) return true;
  return hasAnswer(step, answers);
}

/** Drop a trailing period/space so the text can sit inside a sentence. */
export function stripEnd(s: string): string {
  return s.trim().replace(/[\s.!;,]+$/, "");
}

/** Lower-case the first letter unless it starts with "I " / "I'" or an acronym. */
export function lowerFirst(s: string): string {
  const t = s.trim();
  if (!t) return t;
  if (/^I(\s|'|’|$)/.test(t)) return t;
  if (t.length > 1 && t[1] === t[1].toUpperCase() && /[A-Z]/.test(t[1])) return t;
  return t[0].toLowerCase() + t.slice(1);
}

/** Remove a leading phrase the member may have typed again (case-insensitive). */
export function stripLead(s: string, leads: string[]): string {
  let t = s.trim();
  for (const lead of leads) {
    const re = new RegExp(`^${lead.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s,:]*`, "i");
    if (re.test(t)) {
      t = t.replace(re, "");
      break;
    }
  }
  return t.trim();
}

/** End a sentence with a period if it has no closing punctuation. */
export function sentence(s: string): string {
  const t = s.trim();
  if (!t) return t;
  const cap = t[0].toUpperCase() + t.slice(1);
  return /[.!?]["”’)]*$/.test(cap) ? cap : `${cap}.`;
}

/** Strip surrounding quotes so we can add our own consistently. */
export function unquote(s: string): string {
  return s.trim().replace(/^["“'‘]+/, "").replace(/["”'’]+$/, "").trim();
}

export function quote(s: string): string {
  return `“${unquote(s)}”`;
}

/** "a", "a or b", "a, b, or c" (conj defaults to "or"). */
export function listJoin(items: string[], conj = "or"): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} ${conj} ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, ${conj} ${items[items.length - 1]}`;
}

export interface Band {
  id: string;
  /** Inclusive upper bound of the score for this band. */
  upTo: number;
  title: string;
  explanation: string;
  highDistress: boolean;
}

/**
 * Sum 0..4 scale items, pick a band, and rank areas by their average item
 * score (only areas averaging 2 = "Sometimes" or more count as top areas).
 */
export function scoreScale(
  steps: ExerciseStep[],
  answers: Answers,
  bands: Band[],
  areaTitles: Record<string, string>,
): ScoreResult {
  const items = steps.filter((s): s is ScaleStep => s.type === "scale");
  const max = items.length * 4;
  const byArea: Record<string, { sum: number; n: number }> = {};
  let score = 0;
  for (const item of items) {
    const v = scaleValue(answers, item.id) ?? 0;
    score += v;
    const a = (byArea[item.area] ||= { sum: 0, n: 0 });
    a.sum += v;
    a.n += 1;
  }
  const band = bands.find((b) => score <= b.upTo) ?? bands[bands.length - 1];
  const areaOrder = Object.keys(areaTitles);
  const topAreas = Object.entries(byArea)
    .map(([area, { sum, n }]) => ({ area, avg: n ? sum / n : 0 }))
    .filter((a) => a.avg >= 2)
    .sort((x, y) => y.avg - x.avg || areaOrder.indexOf(x.area) - areaOrder.indexOf(y.area))
    .slice(0, 2)
    .map((a) => areaTitles[a.area] ?? a.area);
  return {
    score,
    max,
    bandId: band.id,
    band: band.title,
    explanation: band.explanation,
    lowerIsBetter: true,
    highDistress: band.highDistress,
    topAreas,
  };
}

export const NOT_A_DIAGNOSIS =
  "This isn't a diagnosis. It is information to help you understand patterns. There are no “bad” scores, only insights that deserve compassion, not criticism.";
