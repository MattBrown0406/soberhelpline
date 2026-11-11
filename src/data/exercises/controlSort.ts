import type { Answers, ExerciseDefinition, ExerciseOutput, OutputSection } from "./types";
import { opts, selectedLabels, sentence, stripLead, text } from "./helpers";

// Distilled from ControlWorksheet (Parts 1, 2, 3 and 5).

export const CANNOT_CONTROL = opts([
  "My loved one's substance use or sobriety",
  "Their honesty, motivation, or willingness to change",
  "Their mental health symptoms when untreated",
  "Their reactions to my boundaries",
  "The timeline of recovery",
  "Whether they accept help or treatment",
  "The consequences of their past choices",
]);

export const CAN_CONTROL = opts([
  "My words, tone, and communication",
  "The boundaries I set and enforce",
  "Whether I enable or allow natural consequences",
  "How I respond to crises and chaos",
  "How I care for my physical and mental health",
  "Whether I seek support, education, or guidance",
  "The environment I allow in my home and life",
]);

function buildOutput(a: Answers): ExerciseOutput {
  const cannot = selectedLabels(a, "cannot", CANNOT_CONTROL);
  const can = selectedLabels(a, "can", CAN_CONTROL);
  const stop = stripLead(text(a, "stopDoing"), ["I will stop", "stop"]);
  const start = stripLead(text(a, "startDoing"), ["I will start", "start"]);
  const boundary = text(a, "boundary");
  const stress = text(a, "stress");

  const sections: OutputSection[] = [];
  if (stress) sections.push({ heading: "What's weighing on me", paragraphs: [sentence(stress)] });
  sections.push({
    heading: "What I can't control",
    items: cannot.length ? cannot : CANNOT_CONTROL.map((o) => o.label),
  });
  sections.push({
    heading: "What I can control",
    items: can.length ? can : CAN_CONTROL.map((o) => o.label),
  });
  const plan: string[] = [];
  if (start) plan.push(`I will start: ${sentence(start)}`);
  if (stop) plan.push(`I'm letting go of: ${sentence(stop)}`);
  if (boundary) plan.push(`A boundary I will take seriously, even if it feels uncomfortable: ${sentence(boundary)}`);
  if (plan.length) sections.push({ heading: "My one action this week", paragraphs: plan, emphasis: true });

  return {
    title: "What I can and can't control",
    sections,
    closing: [
      "Letting go of control is not the same as giving up. It is choosing sanity, stability, and integrity over constant crisis management.",
      "You did not cause the addiction. You cannot control it. But you can stop being controlled by it.",
    ],
  };
}

const controlSort: ExerciseDefinition = {
  id: "control-sort",
  intro: {
    purpose:
      "One of the most painful parts of loving someone with addiction is feeling responsible for outcomes you do not control. This helps you separate responsibility from influence and put your energy where it actually helps, yours and theirs.",
    points: ["Name what's weighing on you", "Sort it into two lists", "Pick one action for this week"],
    note: "Rooted in the Serenity Prayer and detachment principles from Al-Anon and CRAFT. This is not about giving up; it is about letting go of what was never yours to carry. There are no right or wrong answers. The goal is clarity.",
  },
  steps: [
    {
      id: "stress",
      type: "longtext",
      prompt: "What is causing you the most stress or fear related to your loved one's addiction right now?",
      help: "Answer briefly.",
      placeholder: "Your response...",
      example: "Not knowing whether they're using again, and whether they'll lose their job.",
      maxLength: 400,
    },
    {
      id: "managing",
      type: "longtext",
      prompt: "What do you find yourself trying to manage, fix, or prevent most often?",
      placeholder: "Your response...",
      example: "Checking their location, calling their boss, keeping the peace at dinner.",
      optional: true,
      maxLength: 400,
    },
    {
      id: "cannot",
      type: "multi",
      prompt: "Which of these have you been trying to control?",
      help: "These are areas families commonly try to control, unsuccessfully. Check the ones that sound like you.",
      options: CANNOT_CONTROL,
      allowOther: true,
      otherLabel: "Something else",
    },
    {
      id: "can",
      type: "multi",
      prompt: "Which of these have you been avoiding or neglecting?",
      help: "These are the areas where your choices genuinely matter.",
      options: CAN_CONTROL,
      allowOther: true,
      otherLabel: "Something else",
    },
    {
      id: "stopDoing",
      type: "text",
      prompt: "One thing I am willing to stop doing that is outside my control:",
      placeholder: "Your commitment...",
      example: "Checking their phone location every hour.",
      maxLength: 240,
    },
    {
      id: "startDoing",
      type: "text",
      prompt: "One thing I am willing to start doing this week that is within my control:",
      placeholder: "Your commitment...",
      example: "Going to the Monday family meeting.",
      maxLength: 240,
    },
    {
      id: "boundary",
      type: "text",
      prompt: "One boundary I will take seriously, even if it feels uncomfortable:",
      placeholder: "Your commitment...",
      optional: true,
      maxLength: 240,
    },
  ],
  buildOutput,
};

export default controlSort;
