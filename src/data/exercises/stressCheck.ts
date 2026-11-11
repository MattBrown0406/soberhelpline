import type { Answers, ExerciseDefinition, ExerciseOutput, ExerciseStep, OutputSection, ScaleStep } from "./types";
import { NOT_A_DIAGNOSIS, scoreScale, type Band } from "./helpers";

// Distilled from TraumaHypervigilanceAssessment: 8 of the 25 statements (at
// least one from each of the five areas), the same 0–4 labels, and the same
// four bands rescaled from 0–100 to 0–32 (each band is a quarter of the range).

const LABELS: ScaleStep["labels"] = ["Not at all", "Rarely", "Sometimes", "Often", "Almost always"];

export const STRESS_AREAS: Record<string, string> = {
  hypervigilance: "Hypervigilance & alertness",
  control: "Control & over-functioning",
  emotional: "Emotional reactivity & exhaustion",
  body: "Sleep, body & nervous system",
  relationships: "Relationship impact",
};

const HELP = "Over the past month, how true is this for you?";

const item = (id: string, area: string, prompt: string): ScaleStep => ({
  id,
  type: "scale",
  prompt,
  help: HELP,
  labels: LABELS,
  area,
});

const STEPS: ExerciseStep[] = [
  item("h1", "hypervigilance", "I feel constantly on guard, even when things seem calm."),
  item("h2", "hypervigilance", "I scan for signs something is wrong (tone, behavior, silence)."),
  item("c1", "control", "I feel compelled to manage situations to prevent fallout."),
  item("c3", "control", "Letting go of control feels unsafe."),
  item("e1", "emotional", "I feel emotionally exhausted most of the time."),
  item("b1", "body", "I have trouble falling or staying asleep."),
  item("r4", "relationships", "I feel guilty resting or enjoying myself."),
  item("r5", "relationships", "I feel alone in carrying the emotional weight."),
];

export const STRESS_BANDS: Band[] = [
  {
    id: "flexible",
    upTo: 8,
    title: "Stressed but flexible",
    explanation:
      "Your system may be stressed but still maintains flexibility and resilience. Continue prioritizing self-care and boundaries.",
    highDistress: false,
  },
  {
    id: "chronic",
    upTo: 16,
    title: "Chronic stress and early trauma response",
    explanation:
      "Signs of chronic stress and early trauma response are present. Your nervous system is working hard to keep you safe. Consider adding more support and recovery practices.",
    highDistress: false,
  },
  {
    id: "significant",
    upTo: 24,
    title: "Significant hypervigilance",
    explanation:
      "Significant hypervigilance and emotional load are affecting your daily life. Your body and mind are carrying a heavy burden. Professional support and intentional rest are important.",
    highDistress: true,
  },
  {
    id: "survival",
    upTo: 32,
    title: "Survival mode",
    explanation:
      "Your nervous system is likely in survival mode. This level of sustained stress deserves compassionate attention and support. You have been carrying too much for too long.",
    highDistress: true,
  },
];

export function scoreStress(a: Answers) {
  return scoreScale(STEPS, a, STRESS_BANDS, STRESS_AREAS);
}

function buildOutput(a: Answers): ExerciseOutput {
  const s = scoreStress(a);
  const sections: OutputSection[] = [
    { heading: `${s.band} (${s.score} of ${s.max})`, paragraphs: [s.explanation, NOT_A_DIAGNOSIS] },
  ];
  if (s.topAreas.length) {
    sections.push({ heading: "Where it's showing up most", items: s.topAreas });
  }
  sections.push({
    heading: "What helps hypervigilance begin to ease",
    items: [
      "Clear, consistent boundaries",
      "Predictable routines",
      "Reducing responsibility for outcomes you can't control",
      "Trauma-informed self-care (not avoidance)",
      "Support that doesn't demand strength",
    ],
  });
  return {
    title: "Nervous system check-in",
    sections,
    score: s,
    closing: [
      "Hypervigilance is not weakness. It is intelligence shaped by threat. But what kept you safe during crisis may not be sustainable long-term.",
      "Healing doesn't mean becoming careless. It means letting your nervous system stand down when possible, and sharing the load.",
    ],
  };
}

const stressCheck: ExerciseDefinition = {
  id: "stress-check",
  intro: {
    purpose:
      "Families living with addiction often say: “I'm always on edge,” “I can't relax,” “I'm waiting for the next crisis.” These are not personality flaws. They are trauma responses. Eight quick statements show you how much your nervous system is carrying right now.",
    points: [
      "Rate 8 statements from “Not at all” to “Almost always”",
      "See your score, what it means, and where it shows up most",
      "Retake in 30 days to see what has changed",
    ],
    note: "Informed by polyvagal theory and ACE research. This isn't a diagnosis. It is information to help you understand patterns.",
  },
  steps: STEPS,
  buildOutput,
  score: scoreStress,
};

export default stressCheck;
