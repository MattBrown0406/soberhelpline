import catalog from "../../../supabase/functions/_shared/memberExercises.json";
import type { Exercise, ExerciseDefinition, ExerciseMeta } from "./types";
import boundaryScript from "./boundaryScript";
import helpingOrEnabling from "./helpingOrEnabling";
import guiltCheck from "./guiltCheck";
import controlSort from "./controlSort";
import weeklySelfCare from "./weeklySelfCare";
import stressCheck from "./stressCheck";
import hardMomentPractice from "./hardMomentPractice";
import familyPulse from "./familyPulse";

export * from "./types";
export * from "./workbookUtils";
export { visibleSteps, hasAnswer, canContinue, NOT_A_DIAGNOSIS } from "./helpers";

const definitions: Record<string, ExerciseDefinition> = Object.fromEntries(
  [
    boundaryScript,
    helpingOrEnabling,
    guiltCheck,
    controlSort,
    weeklySelfCare,
    stressCheck,
    hardMomentPractice,
    familyPulse,
  ].map((d) => [d.id, d]),
);

/**
 * All exercises, in catalog order. Titles, summaries and minutes come from the
 * shared catalog (`supabase/functions/_shared/memberExercises.json`) so emails
 * and edge functions use the same names.
 */
export const EXERCISES: Exercise[] = (catalog.exercises as ExerciseMeta[])
  .filter((meta) => definitions[meta.id])
  .map((meta) => ({ ...definitions[meta.id], ...meta }));

export function getExercise(id: string | undefined | null): Exercise | undefined {
  if (!id) return undefined;
  return EXERCISES.find((e) => e.id === id);
}

export const exercisePath = (id: string) => `/workbook/${id}`;
