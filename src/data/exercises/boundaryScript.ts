import type { Answers, ExerciseDefinition, ExerciseOutput, OutputSection } from "./types";
import { listJoin, lowerFirst, opts, quote, selected, selectedLabels, sentence, stripEnd, stripLead, text, unquote } from "./helpers";

// Distilled from BoundaryWorksheet (Parts 2–6). Wording and option lists are the author's.

const CHECKS = opts([
  "This consequence is something I am truly willing to do",
  "It is about my behavior, not forcing theirs",
  "I can enforce it consistently",
]);

const PUSHBACK = opts(["Anger", "Manipulation", "Promises to change", "Blame", "Silence", "Crisis behavior"]);

const allChecked = (a: Answers) => CHECKS.every((c) => selected(a, "checks").includes(c.value));

/** "When <behavior>, I will <action>." */
export function boundaryStatement(behavior: string, action: string): string {
  const b = lowerFirst(stripEnd(stripLead(behavior, ["when", "if"])));
  const act = stripEnd(stripLead(action, ["I will", "I'll", "I’ll", "then I will", "if this behavior continues, I will"]));
  if (!b && !act) return "";
  if (!b) return sentence(`I will ${act}`);
  if (!act) return sentence(`When ${b}, I will hold my limit`);
  return sentence(`When ${b}, I will ${act}`);
}

function buildOutput(a: Answers): ExerciseOutput {
  const action = allChecked(a) ? text(a, "action") : text(a, "revised") || text(a, "action");
  const statement = boundaryStatement(text(a, "behavior"), action);
  const consequence = text(a, "consequence");
  const pushback = selectedLabels(a, "pushback", PUSHBACK);
  const calm = text(a, "calmResponse") || "I understand this is hard. My boundary remains the same.";
  const support = text(a, "support");

  const sections: OutputSection[] = [{ heading: "My boundary", paragraphs: [statement], emphasis: true }];
  if (!allChecked(a) && !text(a, "revised")) {
    sections.push({
      heading: "Before I use it",
      paragraphs: [
        "I wasn't sure yet that I can follow through on this one. A boundary I can truly keep is stronger than one I can't, so I may make it smaller before I say it.",
      ],
    });
  }
  if (consequence) {
    sections.push({ heading: "If it's crossed, I will follow through", paragraphs: [sentence(consequence)] });
  }
  const pushParas: string[] = [];
  if (pushback.length) pushParas.push(`They may respond with ${listJoin(pushback.map((p) => lowerFirst(stripEnd(p))))}.`);
  pushParas.push(`What I'll say, calmly and as often as I need to: ${quote(sentence(unquote(calm)))}`);
  pushParas.push("I don't have to debate, explain, or defend it.");
  sections.push({ heading: "When they push back", paragraphs: pushParas });
  if (support) sections.push({ heading: "Who knows and can support me", paragraphs: [sentence(support)] });

  return {
    title: "My boundary script",
    sections,
    closing: [
      "Inconsistent boundaries teach people not to take you seriously. Consistency teaches reality.",
      "You are allowed to stop negotiating your own limits.",
    ],
  };
}

const boundaryScript: ExerciseDefinition = {
  id: "boundary-script",
  intro: {
    purpose:
      "Boundaries are not punishments, threats, or ultimatums. They are clear statements of what you will and will not participate in. In a few minutes you'll write one boundary that is fair, enforceable, and grounded in self-respect rather than fear or anger.",
    points: [
      "Name one specific behavior",
      "Decide what you will do, and how you'll follow through",
      "Prepare a calm response for when they push back",
    ],
    note: "Aligned with the CRAFT model and Al-Anon principles. Boundaries are about your behavior, not controlling someone else's.",
  },
  steps: [
    {
      id: "behavior",
      type: "longtext",
      prompt: "The behavior that is harming me or my household is:",
      help: "Boundaries are responses to specific, repeated behaviors, not general frustrations. Pick one.",
      placeholder: "Describe the specific behavior...",
      example: "They ask me for money while they're still using.",
      maxLength: 400,
    },
    {
      id: "action",
      type: "longtext",
      prompt: "If this behavior continues, I will…",
      help: "A healthy boundary is clear, specific, enforceable, and about your actions.",
      prefix: "I will",
      placeholder: "say no.",
      example:
        "“If you continue to use substances in the home, I will ask you to leave.” “If you miss work due to substance use, I will not call in for you.” “If you ask for money while actively using, I will say no.”",
      maxLength: 400,
    },
    {
      id: "consequence",
      type: "longtext",
      prompt: "If the boundary is crossed, what will you actually do to follow through?",
      help: "Consequences are not punishments. They are natural results of your boundary.",
      placeholder: "What I will do, step by step...",
      example: "I will say my calm response once, then leave the room and end the conversation.",
      maxLength: 400,
    },
    {
      id: "checks",
      type: "multi",
      prompt: "Before you commit, check each one that is true.",
      help: "Be honest. If any of these isn't true yet, you'll get a chance to adjust the boundary.",
      options: CHECKS,
      noneLabel: "None of these yet",
    },
    {
      id: "revised",
      type: "longtext",
      prompt: "Revise your boundary so it's one you can truly commit to.",
      help: "If you answered “no” to any of those, revise the boundary. Smaller and kept is better than bigger and dropped.",
      prefix: "I will",
      placeholder: "Write a revised boundary that you can truly commit to...",
      optional: true,
      maxLength: 400,
      showIf: (a) => !allChecked(a),
    },
    {
      id: "pushback",
      type: "multi",
      prompt: "How might they respond?",
      help: "Boundaries often trigger emotional reactions. Prepare now.",
      options: PUSHBACK,
      allowOther: true,
      otherLabel: "Something else",
      noneLabel: "I'm not sure",
    },
    {
      id: "calmResponse",
      type: "text",
      prompt: "Write a calm, repeated response you can use without debate.",
      help: "Short is better. You'll say the same words every time.",
      placeholder: "Your calm, repeated response...",
      example: "“I understand this is hard. My boundary remains the same.”",
      maxLength: 240,
    },
    {
      id: "support",
      type: "text",
      prompt: "Who knows about this boundary and can support you?",
      help: "Boundaries are difficult to maintain alone. A first name or a role is enough.",
      placeholder: "A friend, my sister, my Monday group...",
      optional: true,
      maxLength: 160,
    },
  ],
  buildOutput,
};

export default boundaryScript;
