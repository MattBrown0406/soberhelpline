import type { Answers, ChoiceOption, ExerciseDefinition, ExerciseOutput, OutputSection } from "./types";
import { lowerFirst, opts, quote, selectedLabels, sentence, stripEnd, text, unquote } from "./helpers";

// Distilled from ScenarioWorksheet ("What Would You Do?"). The first eight
// situations are the author's from that worksheet; the last two are his from
// the Family Recovery Scenario Exercise page, which this exercise replaces.
// The questions are the ones that recur across scenarios, so one short path
// works for whichever moment she picks.
//
// The two added scenarios had no response line of their own, so their examples
// are lines the author wrote elsewhere (the "What to Say" guide). Their
// `remember` items are safety notes in the site's SafetyBox wording.

export interface Scenario {
  value: string;
  title: string;
  situation: string;
  /** A response line in the author's words, offered as an example. */
  example: string;
  remember?: string[];
}

export const SCENARIOS: Scenario[] = [
  {
    value: "one-more-chance",
    title: "The “just one more chance” moment",
    situation:
      "Your loved one has refused treatment multiple times. Today, they show up calm and sincere. They ask for “one more chance” and promise to stop using without treatment.",
    example: "“I care about you, and my boundary hasn't changed. We can talk about treatment options.”",
  },
  {
    value: "financial-emergency",
    title: "The financial emergency",
    situation:
      "Your loved one calls saying they need money immediately for rent, food, or transportation. You suspect substance use but don't know for sure.",
    example: "“We can talk about treatment options, not money.”",
  },
  {
    value: "emotional-outburst",
    title: "The emotional outburst",
    situation: "When you hold a boundary, your loved one becomes angry, blames you, and accuses you of not caring.",
    example: "“I'm not going to argue. We'll talk later.”",
  },
  {
    value: "early-recovery",
    title: "Early recovery confusion",
    situation:
      "Your loved one is newly sober but stops attending meetings, therapy, or aftercare. They insist they're “fine” and that you're being controlling.",
    example: "“I care about you, and my boundary hasn't changed.”",
  },
  {
    value: "family-undermining",
    title: "Family undermining",
    situation: "Another family member secretly gives your loved one money or housing, undermining your boundaries.",
    example: "“I'm asking you not to give money or housing. I need us to be consistent.”",
  },
  {
    value: "relapse-disclosure",
    title: "The relapse disclosure",
    situation: "Your loved one admits to a relapse and asks you not to tell anyone and not to “overreact.”",
    example: "“I won't support anything that keeps this going.”",
  },
  {
    value: "guilt-trap",
    title: "The guilt trap",
    situation: "You say no to a request, and later you feel overwhelming guilt and second-guess yourself.",
    example: "“I can feel guilty and still say no.”",
  },
  {
    value: "call-from-jail",
    title: "The call from jail",
    situation:
      "Your loved one calls: they've been arrested and are in jail. They're asking you to post bail, hire an attorney, or come get them immediately. They sound scared and desperate.",
    example: "“I love you, and I am not going to post bail. You can call me when you are ready to talk about treatment.”",
    remember: [
      "Jail is often safer than active use on the street.",
      "You are not required to fix this immediately.",
      "Bailing them out may remove a natural consequence that could lead to change.",
    ],
  },
  {
    value: "late-night-crisis-call",
    title: "The late-night crisis call",
    situation:
      "It's 11:30 PM. Your loved one calls, intoxicated and emotional. They say they've been kicked out of where they're staying and “have nowhere else to go.” They are crying and accusing you of abandoning them.",
    example: "“I care about you, and my boundary hasn't changed. We can talk when you're sober.”",
    remember: [
      "If they talk about suicide, may have overdosed, or stop responding or can't be woken, this is a crisis, not chaos: call 911, or call or text 988.",
      "Calling for help is not rescuing or enabling. Your boundary can still stand afterwards.",
    ],
  },
  {
    value: "treatment-resistance",
    title: "Treatment resistance",
    situation:
      "Your loved one refuses treatment, saying it “won't work” or that they can stop on their own. They ask you to give them more time.",
    example: "“I believe treatment is necessary. When you're ready for help, we'll support that.”",
    remember: [
      "Stopping alcohol or benzodiazepines (Xanax, Klonopin, Ativan, Valium) suddenly can be dangerous. Someone who uses them heavily every day needs medical help to stop.",
    ],
  },
];

const SCENARIO_OPTIONS: ChoiceOption[] = SCENARIOS.map((s) => ({ value: s.value, label: s.title, hint: s.situation }));

const EMOTIONS = opts(["Fear", "Panic", "Guilt", "Anger", "Sadness", "Shame", "Helplessness", "Hope", "Relief"]);

export const scenarioFor = (a: Answers): Scenario | undefined => SCENARIOS.find((s) => s.value === text(a, "scenario"));

function buildOutput(a: Answers): ExerciseOutput {
  const sc = scenarioFor(a);
  const emotions = selectedLabels(a, "emotions", EMOTIONS);
  const cc = text(a, "crisisOrChaos");
  const say = text(a, "say");
  const wont = text(a, "wontDo");
  const call = text(a, "whoToCall");
  const grounded = text(a, "grounding");

  const sections: OutputSection[] = [];
  if (sc) sections.push({ heading: `The moment: ${sc.title}`, paragraphs: [sc.situation] });
  const noticing: string[] = [];
  if (emotions.length) noticing.push(`What I'll probably feel first: ${emotions.map((x) => lowerFirst(stripEnd(x))).join(", ")}. That's normal, and I don't have to act on it.`);
  if (cc === "crisis") noticing.push("If someone is in immediate danger, this is a crisis: I call 911 or 988 first.");
  if (cc === "chaos") noticing.push("This is chaos, not a crisis. It feels urgent, but I can wait before deciding.");
  if (cc === "unsure") noticing.push("If I'm not sure whether it's a crisis, I ask: is anyone in immediate physical danger? If not, I can wait before deciding.");
  if (noticing.length) sections.push({ heading: "What I'll notice", paragraphs: noticing });

  const plan: string[] = [];
  if (say) plan.push(`What I'll say: ${quote(sentence(unquote(say)))}`);
  if (wont) plan.push(`What I won't do: ${sentence(stripEnd(wont))}`);
  if (call) plan.push(`Who I'll call before I decide: ${sentence(stripEnd(call))}`);
  if (grounded) plan.push(`How I'll stay grounded: ${sentence(stripEnd(grounded))}`);
  sections.push({ heading: "My plan", paragraphs: plan.length ? plan : ["Pause, breathe, and don't decide in the moment."], emphasis: true });
  if (sc?.remember?.length) sections.push({ heading: "Remember", items: sc.remember });

  return {
    title: "Practice a hard moment",
    sections,
    closing: [
      "You don't build confidence by getting it right every time. You build it by responding consistently over time.",
      "Practicing prepares you to act from clarity, not panic, when it matters most.",
    ],
  };
}

const hardMomentPractice: ExerciseDefinition = {
  id: "hard-moment-practice",
  intro: {
    purpose:
      "Most families know what they should do, until emotions take over. Pick one hard moment and practice a values-based, recovery-aligned response before you're under pressure.",
    points: ["Pick the moment that feels most familiar", "Answer honestly, not ideally", "Leave with what you'll say, what you won't do, and who you'll call"],
    note: "Based on CRAFT principles and motivational interviewing techniques. There are no perfect answers. There are consistent ones.",
    safety:
      "This practice is for moments when no one is in immediate danger. If anyone is, call 911: that includes a possible overdose, someone who can't be woken, a seizure, or anyone threatening to hurt themselves or someone else. For any talk of suicide, call or text 988. Calling for help is not rescuing or enabling.",
  },
  steps: [
    {
      id: "scenario",
      type: "single",
      prompt: "Which moment do you want to practice?",
      help: "Read the situation slowly. Pick the one that feels most familiar, or most likely to happen soon.",
      options: SCENARIO_OPTIONS,
    },
    {
      id: "emotions",
      type: "multi",
      prompt: "What emotions show up first for you?",
      help: "Notice emotional reactions as much as decisions.",
      options: EMOTIONS,
      allowOther: true,
      otherLabel: "Something else",
    },
    {
      id: "crisisOrChaos",
      type: "single",
      prompt: "Is this a crisis requiring immediate action, or chaos that feels urgent but isn't?",
      help: "Is anyone in immediate physical danger? What happens if you wait 24 hours before deciding?",
      options: [
        { value: "crisis", label: "Crisis", hint: "Someone is in immediate danger" },
        { value: "chaos", label: "Chaos", hint: "It feels urgent, but no one is in immediate danger" },
        { value: "unsure", label: "I'm not sure" },
      ],
    },
    {
      id: "wontDo",
      type: "longtext",
      prompt: "What enabling action are you most tempted to take?",
      help: "Be honest about your impulses. This becomes the thing you won't do.",
      placeholder: "Be honest about your impulses...",
      example: "Send money right away so I can stop worrying.",
      maxLength: 400,
    },
    {
      id: "say",
      type: "longtext",
      prompt: "Write a calm, short response you could actually say.",
      help: "Write the actual words you would use. Short, calm, no debate.",
      placeholder: "Write the actual words you would use...",
      example: (a) => scenarioFor(a)?.example,
      maxLength: 400,
    },
    {
      id: "whoToCall",
      type: "text",
      prompt: "Who do you need to call or consult before making a decision?",
      placeholder: "Sponsor, therapist, family member, interventionist, attorney...",
      maxLength: 160,
    },
    {
      id: "grounding",
      type: "text",
      prompt: "What will help you stay grounded in the moment?",
      help: "Name a specific tool: a slow breath, stepping outside, a phrase you repeat.",
      placeholder: "Name a specific tool or technique...",
      optional: true,
      maxLength: 160,
    },
  ],
  buildOutput,
};

export default hardMomentPractice;
