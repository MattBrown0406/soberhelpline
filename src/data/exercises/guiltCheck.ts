import type { Answers, ExerciseDefinition, ExerciseOutput, OutputSection } from "./types";
import { lowerFirst, opts, quote, selected, selectedLabels, sentence, singleLabel, stripEnd, stripLead, text, unquote } from "./helpers";

// Distilled from GuiltResponsibilityWorksheet (Parts 1, 2, 3, 4, 5, 6, 7).

const TRIGGERS = opts([
  "Requests for money",
  "Housing or transportation",
  "Emotional crises",
  "Treatment refusal",
  "Relapse",
  "Anger or blame from my loved one",
  "Seeing them struggle",
  "Family pressure to help more",
]);

const TENDENCIES = opts([
  "Over-explain",
  "Give in",
  "Rescue",
  "Break boundaries",
  "Argue or justify",
  "Avoid conflict",
  "Apologize unnecessarily",
  "Take blame that isn't mine",
]);

const TEST = [
  { value: "discomfort", label: "I'm acting to reduce my discomfort more than their pain" },
  { value: "fear", label: "I wouldn't make the same decision if I were less afraid" },
  { value: "boundaries", label: "It doesn't align with my stated boundaries" },
  { value: "respect", label: "I might not respect myself after this decision" },
  { value: "consequence", label: "I'd be preventing a consequence that might support change" },
];

export const MY_RESPONSIBILITIES = [
  "My boundaries",
  "My words and tone",
  "My safety",
  "My values",
  "My follow-through",
  "My healing",
];

const NOT_MINE = opts([
  "Someone else's sobriety",
  "Their motivation or insight",
  "Their reaction to my boundaries",
  "Preventing every bad outcome",
  "Fixing the past",
]);

const VALUES = opts(["Safety", "Integrity", "Stability", "Honesty", "Self-respect", "Health", "Peace", "Growth"]);

/** "I feel guilty, and I am still responsible for <x>." */
export function reframeSentence(raw: string): string {
  const x = stripEnd(
    stripLead(unquote(raw), [
      "I feel guilty, and I am still responsible for",
      "I feel guilty and I am still responsible for",
      "I am still responsible for",
      "I'm still responsible for",
    ]),
  );
  return `I feel guilty, and I am still responsible for ${x || "holding my boundary"}.`;
}

function buildOutput(a: Answers): ExerciseOutput {
  const thought = text(a, "guiltThought");
  const triggers = selectedLabels(a, "triggers", TRIGGERS);
  const tendencies = selectedLabels(a, "tendencies", TENDENCIES);
  const flags = selected(a, "test").length;
  const notMine = selectedLabels(a, "notMine", NOT_MINE);
  const value = singleLabel(a, "value", VALUES);
  const anchor = text(a, "anchor");

  const sections: OutputSection[] = [];
  if (thought) sections.push({ heading: "The guilt thought", paragraphs: [quote(sentence(unquote(thought)))] });
  const pattern: string[] = [];
  if (triggers.length) pattern.push(`It shows up most with: ${triggers.map((x) => lowerFirst(stripEnd(x))).join(", ")}.`);
  if (tendencies.length) pattern.push(`When I feel guilty, I tend to: ${tendencies.map((x) => lowerFirst(stripEnd(x))).join(", ")}.`);
  if (flags >= 3) {
    pattern.push("Most of my answers lean toward fear, discomfort, or boundary violations. That's my signal to pause before acting.");
  } else if (flags > 0) {
    pattern.push("Some of my answers lean toward fear or discomfort. I can notice that and still choose.");
  }
  if (pattern.length) sections.push({ heading: "What guilt pushes me to do", paragraphs: pattern });
  sections.push({ heading: "What is my responsibility", items: MY_RESPONSIBILITIES });
  sections.push({
    heading: "What isn't my responsibility",
    items: notMine.length ? notMine : NOT_MINE.map((o) => o.label),
  });
  const reframe = [reframeSentence(text(a, "reframe"))];
  if (value) reframe.push(`The value I want guiding this decision: ${value.toLowerCase()}.`);
  if (anchor) reframe.push(`What I'll tell myself: ${quote(sentence(unquote(anchor)))}`);
  sections.push({ heading: "My reframe", paragraphs: reframe, emphasis: true });

  return {
    title: "Guilt or responsibility?",
    sections,
    closing: [
      "Guilt is information, not instruction. Responsibility is the skill of choosing integrity anyway.",
      "You are allowed to feel guilt and make healthy decisions.",
    ],
  };
}

const guiltCheck: ExerciseDefinition = {
  id: "guilt-check",
  intro: {
    purpose:
      "This helps you notice when guilt is driving your decisions, and shift back into responsibility, boundaries, and self-respect. It is not about eliminating guilt; it is about not letting guilt make the decisions.",
    points: [
      "Catch one guilt thought",
      "Sort what is and isn't yours to carry",
      "Leave with a reframe you can say to yourself",
    ],
    note: "Informed by cognitive-behavioral approaches and family recovery principles. Use it before or after emotionally charged situations.",
  },
  steps: [
    {
      id: "triggers",
      type: "multi",
      prompt: "What situations most reliably trigger guilt for you?",
      help: "Check all that apply.",
      options: TRIGGERS,
      allowOther: true,
      otherLabel: "Something else",
    },
    {
      id: "guiltThought",
      type: "longtext",
      prompt: "Write the guilt-based thought.",
      help: "Try the form: “If I don't ___, then ___.” Write the internal message you actually hear.",
      placeholder: "If I don't..., then...",
      example: "If I don't give them money, then they'll end up on the street.",
      maxLength: 400,
    },
    {
      id: "tendencies",
      type: "multi",
      prompt: "When you feel guilty, you tend to:",
      options: TENDENCIES,
      allowOther: true,
      otherLabel: "Something else",
    },
    {
      id: "test",
      type: "multi",
      prompt: "The guilt vs. responsibility test.",
      help: "Think of the decision in front of you. Check any that are true.",
      options: TEST,
      noneLabel: "None of these are true",
    },
    {
      id: "notMine",
      type: "multi",
      prompt: "Which responsibilities have you taken on that are not actually yours?",
      help: "You are responsible for your boundaries, words, safety, values, follow-through, and healing. You are not responsible for these:",
      options: NOT_MINE,
      allowOther: true,
      otherLabel: "Something else",
      noneLabel: "None of these",
    },
    {
      id: "value",
      type: "single",
      prompt: "Which value do you want guiding this decision?",
      options: VALUES,
    },
    {
      id: "reframe",
      type: "text",
      prompt: "Now rewrite the thought using responsibility.",
      help: "Finish the sentence. It's okay that the guilt is still there.",
      prefix: "I feel guilty, and I am still responsible for",
      placeholder: "holding my boundary.",
      maxLength: 200,
    },
    {
      id: "anchor",
      type: "text",
      prompt: "Write one phrase you will use to reinforce it.",
      placeholder: "Your phrase...",
      example: "“I can feel guilty and still say no.”",
      optional: true,
      maxLength: 160,
    },
  ],
  buildOutput,
};

export default guiltCheck;
