import type { Answers, ExerciseDefinition, ExerciseOutput, OutputSection } from "./types";
import { opts, quote, selectedLabels, sentence, singleLabel, stripEnd, text, unquote } from "./helpers";

// Distilled from SelfCareWorksheet (Parts 1, 2, 7, 8, 9, 11).

const BELIEFS = opts([
  "I can't relax when things aren't okay.",
  "Taking care of myself means I don't care enough.",
  "If I'm okay, something bad might happen.",
  "I don't deserve peace when they're struggling.",
  "I should be available 24/7 in case of emergency.",
  "Enjoying life feels wrong when they're suffering.",
  "Rest is selfish when someone needs help.",
]);

const CRISIS_BASICS = opts([
  "Prioritize sleep",
  "Maintain regular meals",
  "Stay hydrated",
  "Reduce unnecessary decisions",
  "Lower expectations",
  "Seek immediate support",
]);

const CALM_PRACTICES = opts([
  "Build sustainable routines",
  "Replenish energy reserves",
  "Reflect and process experiences",
  "Strengthen boundaries",
  "Reconnect with interests",
  "Plan for future challenges",
]);

const REAL_LIFE = opts([
  "Going to bed instead of arguing",
  "Not answering a late-night call",
  "Eating even when you don't feel hungry",
  "Saying “I'm not discussing this right now”",
  "Enjoying something without explaining yourself",
  "Choosing peace over proving a point",
  "Taking a walk alone",
  "Turning off my phone for an hour",
]);

const PERMISSIONS = opts([
  "To rest",
  "To enjoy life",
  "To protect my energy",
  "To stop waiting",
  "To feel happy",
  "To have my own life",
  "To set limits",
  "To prioritize my health",
]);

const inCrisis = (a: Answers) => text(a, "phase") === "crisis";

/** The three commitments, in order: routine, what this phase needs, one real-life act. */
export function commitments(a: Answers): string[] {
  const out: string[] = [];
  const routine = text(a, "routine");
  if (routine) out.push(sentence(stripEnd(routine)));
  const need = inCrisis(a) ? singleLabel(a, "crisisNeed", CRISIS_BASICS) : singleLabel(a, "calmNeed", CALM_PRACTICES);
  if (need) out.push(sentence(need));
  const act = singleLabel(a, "realLife", REAL_LIFE);
  if (act) out.push(sentence(act));
  return out;
}

function buildOutput(a: Answers): ExerciseOutput {
  const sections: OutputSection[] = [];
  const list = commitments(a);
  sections.push({
    heading: "My three commitments this week",
    items: list.length ? list : ["One small routine I keep every day, no matter what."],
    emphasis: true,
  });
  const phase = text(a, "phase");
  if (phase) {
    sections.push({
      heading: inCrisis(a) ? "Where I am: a crisis phase" : "Where I am: a calmer phase",
      paragraphs: [
        inCrisis(a)
          ? "During crisis, self-care is the basics: sleep, meals, fewer decisions, and support. That's enough."
          : "During calmer periods, I can build routines, replenish my energy, and plan for future challenges.",
      ],
    });
  }
  const beliefs = selectedLabels(a, "beliefs", BELIEFS);
  const reframe = text(a, "reframe");
  if (beliefs.length || reframe) {
    const paras: string[] = [];
    if (beliefs.length) paras.push(`A belief that gets in my way: ${quote(beliefs[0])}`);
    if (reframe) paras.push(`What I'm choosing to believe instead: ${quote(sentence(unquote(reframe)))}`);
    sections.push({ heading: "Letting go of an old belief", paragraphs: paras });
  }
  const perms = selectedLabels(a, "permissions", PERMISSIONS);
  if (perms.length) {
    sections.push({ heading: "I am allowed", items: perms });
  }
  const person = text(a, "safePerson");
  if (person) sections.push({ heading: "A safe person I can lean on", paragraphs: [sentence(person)] });

  return {
    title: "This week's self-care plan",
    sections,
    closing: [
      "Self-care is not about feeling good. It's about being able to live well, even when things are hard.",
      "Taking care of yourself does not harm your loved one. It may be the most loving thing you do, for both of you.",
    ],
  };
}

const weeklySelfCare: ExerciseDefinition = {
  id: "weekly-self-care",
  intro: {
    purpose:
      "When families hear “self-care,” many feel irritated, guilty, or dismissed. This isn't about bubble baths. It's about protecting your capacity to function, think clearly, and live meaningfully, whether or not your loved one changes. You'll leave with three small commitments for this week.",
    points: ["Notice what makes self-care feel wrong", "Match it to what this week looks like", "Choose three small, real commitments"],
    note: "Grounded in nervous system regulation, trauma-informed care, and family recovery research. Most families don't need indulgence. They need stability.",
  },
  steps: [
    {
      id: "beliefs",
      type: "multi",
      prompt: "Which of these beliefs sound like you?",
      help: "These beliefs come from love mixed with fear, not selfishness. Check all that apply.",
      options: BELIEFS,
      allowOther: true,
      otherLabel: "Another belief",
      noneLabel: "None of these",
    },
    {
      id: "reframe",
      type: "text",
      prompt: "How might you reframe one of those beliefs?",
      help: "Chronic self-neglect does not help your loved one. It only weakens you.",
      placeholder: "Write your reframed belief here...",
      example: "“I can't relax when things aren't okay” → “My calm doesn't control their chaos, but it does protect my health.”",
      optional: true,
      maxLength: 240,
    },
    {
      id: "phase",
      type: "single",
      prompt: "Are you in a crisis phase or a calmer phase right now?",
      help: "Self-care changes with context, and that's okay.",
      options: [
        { value: "crisis", label: "Crisis", hint: "Things feel urgent or unstable" },
        { value: "calm", label: "Calmer", hint: "Things are steadier for now" },
      ],
    },
    {
      id: "crisisNeed",
      type: "single",
      prompt: "During a crisis, which basic do you need most this week?",
      options: CRISIS_BASICS,
      showIf: inCrisis,
    },
    {
      id: "calmNeed",
      type: "single",
      prompt: "During this calmer stretch, what would help you most this week?",
      options: CALM_PRACTICES,
      showIf: (a) => text(a, "phase") === "calm",
    },
    {
      id: "realLife",
      type: "single",
      prompt: "Pick one real-life act of self-care you'll do this week.",
      help: "Real self-care is often small, unglamorous, and invisible to others. None of this is selfish.",
      options: REAL_LIFE,
      allowOther: true,
      otherLabel: "Something else",
    },
    {
      id: "routine",
      type: "text",
      prompt: "What one small routine could you add or keep every day this week?",
      help: "Predictable routines (wake time, meals, sleep) calm the nervous system. Make it small enough to be non-negotiable.",
      placeholder: "Be specific and realistic...",
      example: "A 10-minute walk after dinner.",
      maxLength: 200,
    },
    {
      id: "permissions",
      type: "multi",
      prompt: "You are allowed. Which permissions are you giving yourself?",
      options: PERMISSIONS,
      noneLabel: "Not yet",
    },
    {
      id: "safePerson",
      type: "text",
      prompt: "Who is one safe person who supports you without judging or fixing?",
      help: "A first name, a group, or a counselor. You don't owe everyone access to your pain.",
      placeholder: "A name or a group...",
      optional: true,
      maxLength: 120,
    },
  ],
  buildOutput,
};

export default weeklySelfCare;
