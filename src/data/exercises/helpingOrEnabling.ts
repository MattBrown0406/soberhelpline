import type { Answers, ExerciseDefinition, ExerciseOutput, OutputSection } from "./types";
import { opts, quote, selected, selectedLabels, sentence, singleLabel, text } from "./helpers";

// Distilled from EnablingDecisionTree ("Is This Help or Enabling?"). The routing
// follows the original: crisis -> professional response; reduces consequences
// -> enabling; fewer than 3 accountability checks -> enabling; otherwise help,
// unless the self-check raises a flag.

const CRISIS_RESPONSES = opts([
  "Call 911 / call or text 988 (crisis line)",
  "Take them to ER / medical evaluation",
  "Contact treatment professional / clinician",
  "Safety plan for minors/vulnerable adults",
]);

const ACCOUNTABILITY = opts([
  "It requires their action (appointments, intake call, paperwork)",
  "It is time-limited and clearly defined",
  "It supports recovery behaviors (treatment, meetings, structure)",
  "It does not violate my values or boundaries",
  "I can do it without resentment",
]);

const SELF_CHECK = [
  { value: "fear", label: "I'm doing this out of fear or guilt, not values and clarity" },
  { value: "respect", label: "I might not respect myself tomorrow if I say yes" },
  { value: "discomfort", label: "This choice mostly reduces my discomfort rather than supporting recovery" },
];

const NO_RESPONSES = opts([
  "“I'm not able to do that.”",
  "“I care about you, and my boundary hasn't changed.”",
  "“I won't support anything that keeps this going.”",
  "“We can talk about treatment options, not money/housing/rides.”",
]);

const ALTERNATIVES = opts([
  "Provide treatment center options",
  "Offer to drive to an assessment/detox only",
  "Offer to attend a family session",
  "Offer emotional support when sober/calm",
]);

export type Verdict = "crisis" | "helping" | "enabling" | "unclear";

const isCrisis = (a: Answers) => text(a, "situation") === "crisis";

/** The verdict implied by the answers so far (used for routing and output). */
export function verdict(a: Answers): Verdict {
  if (isCrisis(a)) return "crisis";
  if (text(a, "reducesConsequences") === "yes") return "enabling";
  if (selected(a, "accountability").length < 3) return "enabling";
  if (selected(a, "selfCheck").length > 0) return "unclear";
  return "helping";
}

export function reasons(a: Answers): string[] {
  const out: string[] = [];
  if (isCrisis(a)) {
    out.push("You said there is a safety risk. Crisis response should be professional, not family rescue.");
    return out;
  }
  const using = text(a, "activelyUsing");
  if (using === "yes") out.push("They are likely using or unstable right now.");
  if (using === "unsure") out.push("You're not sure whether they're using, so it's safest to treat it as likely.");
  if (using === "no") out.push("They appear to be in stable recovery right now.");
  if (text(a, "reducesConsequences") === "yes") {
    out.push("Helping would reduce the consequences of using, or do something they can and should do themselves.");
  } else if (text(a, "reducesConsequences") === "no") {
    const n = selected(a, "accountability").length;
    out.push(
      n >= 3
        ? `The help builds accountability (${n} of 5 checks): it has conditions, not endless access.`
        : `The help builds little accountability (${n} of 5 checks). Healthy help has conditions and accountability, not endless access.`,
    );
  }
  for (const flag of SELF_CHECK) {
    if (selected(a, "selfCheck").includes(flag.value)) out.push(sentence(flag.label));
  }
  return out;
}

const VERDICT_TEXT: Record<Verdict, { heading: string; body: string }> = {
  crisis: {
    heading: "This is a crisis: safety comes first",
    body: "You've identified a true crisis. Get professional help now. A crisis response is not the same as removing all consequences.",
  },
  helping: {
    heading: "This looks like helping",
    body: "Based on your answers, this support appears to be healthy help that maintains accountability, has clear boundaries, and supports recovery.",
  },
  enabling: {
    heading: "This looks like enabling",
    body: "Based on your answers, this would likely reduce consequences, fuel dependency, or increase chaos rather than support recovery.",
  },
  unclear: {
    heading: "Unclear: pause before you say yes",
    body: "The help itself has healthy conditions, but your self-check suggests fear or guilt may be driving the decision. You don't have to decide right now.",
  },
};

function buildOutput(a: Answers): ExerciseOutput {
  const v = verdict(a);
  const request = text(a, "request");
  const sections: OutputSection[] = [];
  if (request) sections.push({ heading: "The situation", paragraphs: [sentence(request)] });
  sections.push({ heading: VERDICT_TEXT[v].heading, paragraphs: [VERDICT_TEXT[v].body] });
  const why = reasons(a);
  if (why.length) sections.push({ heading: "Why, from your answers", items: why });

  if (v === "crisis") {
    const resp = singleLabel(a, "crisisResponse", CRISIS_RESPONSES);
    sections.push({
      heading: "My next step",
      paragraphs: [
        resp ? sentence(resp) : "Call 911, or call or text 988 (the crisis line).",
        "After safety is addressed, return to your boundaries and plan.",
      ],
    });
  } else if (v === "helping") {
    const items: string[] = [];
    if (text(a, "willDo")) items.push(`What I will do: ${sentence(text(a, "willDo"))}`);
    if (text(a, "theyMustDo")) items.push(`What they must do for this help to continue: ${sentence(text(a, "theyMustDo"))}`);
    sections.push({
      heading: "My next step",
      paragraphs: items.length ? undefined : ["Define the help clearly before you give it. No open-ended help."],
      items: items.length ? items : undefined,
    });
  } else {
    const no = singleLabel(a, "noResponse", NO_RESPONSES) || "“I'm not able to do that.”";
    const paras = [`What I'll say (short, calm, no debate): ${quote(no)}`];
    if (v === "unclear") paras.unshift("Pause first: “I don't have to decide right now.” If I decide not to help yet:");
    const alts = selectedLabels(a, "alternatives", ALTERNATIVES);
    sections.push({ heading: "My next step", paragraphs: paras });
    if (alts.length) sections.push({ heading: "What I can offer instead, aligned with recovery", items: alts });
  }

  return {
    title: "Helping or enabling?",
    sections,
    closing: ["You can love someone and still say no. You can care and still refuse to participate in addiction."],
  };
}

const helpingOrEnabling: ExerciseDefinition = {
  id: "helping-or-enabling",
  intro: {
    purpose:
      "When families are stressed, they often respond quickly to requests, especially requests wrapped in urgency, guilt, or crisis language. This helps you pause, think clearly, and choose a response that supports recovery, safety, and your well-being.",
    points: [
      "Take one slow breath in. Exhale fully.",
      "Say (silently or out loud): “I don't have to decide right now.”",
      "Helping supports responsibility. Enabling removes it.",
    ],
    note: "Based on CRAFT principles and healthy detachment practices.",
    safety:
      "If the person is intoxicated, threatening, or escalating, this is not a productive moment. End the conversation (“I'm ending this conversation. We can talk when you're sober/calm.”) and keep yourself safe. If anyone is in danger, call 911.",
  },
  steps: [
    {
      id: "request",
      type: "text",
      prompt: "What exactly are they asking for?",
      help: "Write the request in one sentence (no story).",
      placeholder: "They are asking me to...",
      example: "They are asking me to pay their phone bill this month.",
      maxLength: 240,
    },
    {
      id: "situation",
      type: "single",
      prompt: "Is this a true crisis, or chaos?",
      help: "A true crisis involves immediate risk to life or safety: overdose risk, suicidal threat with intent, violence risk, medical emergency.",
      options: [
        { value: "crisis", label: "Crisis", hint: "There is a safety risk" },
        { value: "chaos", label: "Chaos", hint: "Painful but not unsafe" },
      ],
    },
    {
      id: "crisisResponse",
      type: "single",
      prompt: "Choose the appropriate crisis response.",
      help: "Crisis response should be professional, not family rescue.",
      options: CRISIS_RESPONSES,
      allowOther: true,
      otherLabel: "Other response",
      showIf: isCrisis,
    },
    {
      id: "activelyUsing",
      type: "single",
      prompt: "Are they actively using or unstable right now?",
      options: [
        { value: "yes", label: "Yes / likely" },
        { value: "no", label: "No / in stable recovery" },
        { value: "unsure", label: "Unsure", hint: "Treat as “likely” and proceed with caution" },
      ],
      showIf: (a) => !isCrisis(a),
    },
    {
      id: "reducesConsequences",
      type: "single",
      prompt: "Would helping reduce the consequences of using?",
      help: "Would this make it easier for them to continue using? Would it protect them from a consequence they need to feel? Would I be doing something they can and should do themselves?",
      options: [
        { value: "yes", label: "Yes", hint: "This is likely enabling" },
        { value: "no", label: "No", hint: "It may be help. Let's check further." },
      ],
      showIf: (a) => !isCrisis(a),
    },
    {
      id: "accountability",
      type: "multi",
      prompt: "Does the help increase accountability?",
      help: "Healthy help has conditions and accountability, not endless access. Check all that apply.",
      options: ACCOUNTABILITY,
      noneLabel: "None of these",
      showIf: (a) => !isCrisis(a) && text(a, "reducesConsequences") === "no",
    },
    {
      id: "selfCheck",
      type: "multi",
      prompt: "The family self-check. Answer honestly.",
      help: "This is the most important step. Check any that are true for you.",
      options: SELF_CHECK,
      noneLabel: "None of these are true",
      showIf: (a) => !isCrisis(a),
    },
    {
      id: "noResponse",
      type: "single",
      prompt: "Choose your healthiest “no.”",
      help: "Short, calm, no debate. Pick the one you could actually say.",
      options: NO_RESPONSES,
      allowOther: true,
      otherLabel: "My own words",
      showIf: (a) => verdict(a) === "enabling" || verdict(a) === "unclear",
    },
    {
      id: "alternatives",
      type: "multi",
      prompt: "What can you offer that aligns with recovery?",
      options: ALTERNATIVES,
      allowOther: true,
      otherLabel: "Something else",
      noneLabel: "Nothing right now",
      showIf: (a) => verdict(a) === "enabling",
    },
    {
      id: "willDo",
      type: "longtext",
      prompt: "Define the help clearly. What will you do?",
      help: "No open-ended help. Be specific about what you're agreeing to, and the limits.",
      placeholder: "Be specific about what you're agreeing to...",
      example: "I will drive you to your intake appointment on Thursday. I will not give you cash.",
      maxLength: 400,
      showIf: (a) => verdict(a) === "helping",
    },
    {
      id: "theyMustDo",
      type: "longtext",
      prompt: "What must they do for this help to continue?",
      help: "Include a time limit or condition if you can.",
      placeholder: "Required actions from them...",
      example: "Keep the appointment and call the program back by Friday. This is for 30 days.",
      maxLength: 400,
      showIf: (a) => verdict(a) === "helping",
    },
  ],
  buildOutput,
};

export default helpingOrEnabling;
