/**
 * Guided exercise schema for My Workbook.
 *
 * An exercise is plain data plus two pure functions: `buildOutput` turns the
 * member's answers into the result she keeps, and (for scored exercises)
 * `score` turns them into a number and a band. Both must be deterministic and
 * must return plain JSON (the output is stored in `workbook_entries.output`).
 *
 * Answers are a flat map keyed by step id:
 *   single   -> string (option value)
 *   multi    -> string[] (option values)
 *   text     -> string
 *   longtext -> string
 *   scale    -> number 0..4
 * When a single/multi step allows "something else", the typed text is stored
 * under `otherKey(stepId)` and the selection includes OTHER_VALUE.
 */

export type AnswerValue = string | string[] | number | null | undefined;
export type Answers = Record<string, AnswerValue>;

export const OTHER_VALUE = "__other__";
export const otherKey = (stepId: string) => `${stepId}.other`;

export interface ChoiceOption {
  value: string;
  label: string;
  /** Small second line under the label. */
  hint?: string;
}

interface BaseStep {
  id: string;
  /** The question, shown as the screen heading. */
  prompt: string;
  /** One or two calm sentences of framing, shown under the question. */
  help?: string;
  /** A gentle example, shown in a muted box. May depend on earlier answers. */
  example?: string | ((answers: Answers) => string | undefined);
  /** Optional steps can be skipped; the Next button reads "Skip" while empty. */
  optional?: boolean;
  /** Conditional step: only shown when this returns true. */
  showIf?: (answers: Answers) => boolean;
}

export interface SingleStep extends BaseStep {
  type: "single";
  options: ChoiceOption[];
  allowOther?: boolean;
  otherLabel?: string;
}

export interface MultiStep extends BaseStep {
  type: "multi";
  options: ChoiceOption[];
  allowOther?: boolean;
  otherLabel?: string;
  /** Maximum selections (no limit when omitted). */
  max?: number;
  /**
   * When set, choosing nothing is a valid answer and the Next button reads
   * this label while nothing is selected (e.g. "None of these").
   */
  noneLabel?: string;
}

export interface TextStep extends BaseStep {
  type: "text" | "longtext";
  placeholder?: string;
  /** Words shown before the input, e.g. "I will". */
  prefix?: string;
  maxLength?: number;
}

export interface ScaleStep extends BaseStep {
  type: "scale";
  /** Five labels for 0..4. */
  labels: [string, string, string, string, string];
  /** Scoring area this item belongs to. */
  area: string;
}

export type ExerciseStep = SingleStep | MultiStep | TextStep | ScaleStep;

export interface OutputSection {
  heading: string;
  paragraphs?: string[];
  items?: string[];
  /** Render paragraphs as a quoted statement (the thing she will say). */
  emphasis?: boolean;
}

export interface ScoreResult {
  score: number;
  max: number;
  bandId: string;
  band: string;
  explanation: string;
  /** Lower scores mean less strain (true for both scored exercises). */
  lowerIsBetter: boolean;
  /** Show the 988 + consultation support box. */
  highDistress: boolean;
  /** Areas where the answers were highest, most first. */
  topAreas: string[];
}

export interface ExerciseOutput {
  title: string;
  sections: OutputSection[];
  score?: ScoreResult;
  /** A closing reminder in the author's words. */
  closing?: string[];
}

export interface ExerciseIntro {
  /** What it's for, in a sentence or two. */
  purpose: string;
  /** Short bullets: what she will do / leave with. */
  points?: string[];
  /** The author's clinical framing note. */
  note?: string;
  /** Safety note shown before starting (e.g. intoxicated or escalating). */
  safety?: string;
}

export interface ExerciseDefinition {
  id: string;
  intro: ExerciseIntro;
  steps: ExerciseStep[];
  buildOutput: (answers: Answers) => ExerciseOutput;
  score?: (answers: Answers) => ScoreResult;
}

export interface ExerciseMeta {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  scored: boolean;
  basedOn: string;
}

export type Exercise = ExerciseDefinition & ExerciseMeta;
