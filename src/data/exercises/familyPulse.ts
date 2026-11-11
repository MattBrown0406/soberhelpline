import type { Answers, ExerciseDefinition, ExerciseOutput, OutputSection, ScaleStep } from "./types";
import { NOT_A_DIAGNOSIS, scaleValue, scoreScale, type Band } from "./helpers";

// Distilled from FamilySelfAssessment (Enabling Self-Assessment): two
// statements from each of the four sections, the same 0–4 labels, and the
// same four interpretations rescaled from 0–100 to 0–32.

const LABELS: ScaleStep["labels"] = ["Never", "Rarely", "Sometimes", "Often", "Almost always"];

export const PULSE_AREAS: Record<string, string> = {
  emotional: "Emotional & psychological enabling",
  behavioral: "Behavioral enabling",
  control: "Control & over-functioning",
  impact: "The impact on you",
};

/** Where to go next for each area (a guided exercise in My Workbook). */
export const AREA_NEXT: Record<string, { text: string; exerciseId: string }> = {
  emotional: { text: "Fear and guilt are doing a lot of the deciding. Try “Guilt or responsibility?” next.", exerciseId: "guilt-check" },
  behavioral: { text: "Rescuing and covering are where change will matter most. Try “Helping or enabling?” the next time they ask for something.", exerciseId: "helping-or-enabling" },
  control: { text: "You're carrying what isn't yours. Try “What I can and can't control” next.", exerciseId: "control-sort" },
  impact: { text: "This is wearing on you. Try “This week's self-care plan” next.", exerciseId: "weekly-self-care" },
};

interface PulseItem extends ScaleStep {
  /** Said back to her when she answers Never/Rarely. */
  strength: string;
}

const HELP = "Answer based on what you actually do, not what you wish you did.";

const item = (id: string, area: string, prompt: string, strength: string): PulseItem => ({
  id,
  type: "scale",
  prompt,
  help: HELP,
  labels: LABELS,
  area,
  strength,
});

const ITEMS: PulseItem[] = [
  item("e2", "emotional", "I avoid difficult conversations because I'm afraid of upsetting them.", "You're willing to have difficult conversations."),
  item("e6", "emotional", "I feel guilty when I say no, even when I know it's reasonable.", "You can say a reasonable no without much guilt."),
  item("b3", "behavioral", "I clean up messes (financial, legal, emotional) caused by their use.", "You mostly let them handle the messes their use creates."),
  item("b4", "behavioral", "I provide money, housing, transportation, or resources despite ongoing use.", "You mostly don't fund or house ongoing use."),
  item("c1", "control", "I monitor, track, or try to manage their behavior or substance use.", "You mostly don't monitor or manage their use."),
  item("c4", "control", "I believe it's my job to keep things from falling apart.", "You don't carry the job of holding everything together."),
  item("i1", "impact", "I neglect my own needs because of their situation.", "You're still looking after your own needs."),
  item("i5", "impact", "I feel isolated or ashamed to talk openly about what's happening.", "You're able to talk openly about what's happening."),
];

export const PULSE_BANDS: Band[] = [
  {
    id: "low",
    upTo: 8,
    title: "Mostly healthy support",
    explanation:
      "You may be offering support without significant enabling patterns, but continued education and boundary clarity are important.",
    highDistress: false,
  },
  {
    id: "some",
    upTo: 16,
    title: "Some enabling patterns",
    explanation:
      "Some enabling behaviors are present. These likely come from fear or uncertainty rather than intention. Awareness is the first step.",
    highDistress: false,
  },
  {
    id: "significant",
    upTo: 24,
    title: "Significant enabling patterns",
    explanation:
      "Enabling patterns are significantly impacting both you and your loved one. Support, guidance, and boundary work are strongly recommended.",
    highDistress: true,
  },
  {
    id: "high",
    upTo: 32,
    title: "Patterns that need support now",
    explanation:
      "Enabling behaviors are likely reinforcing the addiction and harming your well-being. This does not mean you are doing something wrong. It means you need support and a different approach.",
    highDistress: true,
  },
];

export function scorePulse(a: Answers) {
  return scoreScale(ITEMS, a, PULSE_BANDS, PULSE_AREAS);
}

export function strengths(a: Answers): string[] {
  return ITEMS.filter((i) => {
    const v = scaleValue(a, i.id);
    return v !== null && v <= 1;
  }).map((i) => i.strength);
}

/** The single area with the highest total (ties go to the earlier section). */
export function focusArea(a: Answers): string {
  const totals: Record<string, number> = {};
  for (const i of ITEMS) totals[i.area] = (totals[i.area] ?? 0) + (scaleValue(a, i.id) ?? 0);
  let best = Object.keys(PULSE_AREAS)[0];
  for (const area of Object.keys(PULSE_AREAS)) if ((totals[area] ?? 0) > (totals[best] ?? 0)) best = area;
  return best;
}

function buildOutput(a: Answers): ExerciseOutput {
  const s = scorePulse(a);
  const focus = focusArea(a);
  const str = strengths(a);
  const sections: OutputSection[] = [
    { heading: `${s.band} (${s.score} of ${s.max})`, paragraphs: [s.explanation, NOT_A_DIAGNOSIS] },
    {
      heading: "Strengths",
      items: str.length ? str : undefined,
      paragraphs: str.length
        ? undefined
        : ["You answered every statement honestly, even the hard ones. That honesty is where change starts."],
    },
    { heading: `One focus area: ${PULSE_AREAS[focus]}`, paragraphs: [AREA_NEXT[focus].text] },
  ];
  return {
    title: "Family pulse check",
    sections,
    score: s,
    closing: [
      "Enabling is not about loving too much. It's about loving in ways that no longer work.",
      "Changing these patterns does not mean abandoning your loved one. It means giving them the dignity to experience reality, and giving yourself permission to recover as well.",
    ],
  };
}

const familyPulse: ExerciseDefinition = {
  id: "family-pulse",
  intro: {
    purpose:
      "This is not about blame or shame. Enabling almost always comes from love, fear, exhaustion, or a desire to keep things from getting worse. Eight quick statements give you a pulse on where you are, what you're doing well, and one place to focus.",
    points: [
      "Rate 8 statements from “Never” to “Almost always”",
      "See your score, your strengths, and one focus area",
      "Retake in 30 days to see what has changed",
    ],
    note: "Grounded in family systems theory and the CRAFT model. Be honest. This is for you.",
  },
  steps: ITEMS,
  buildOutput,
  score: scorePulse,
};

export default familyPulse;
