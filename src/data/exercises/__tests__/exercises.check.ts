/**
 * Output builder + scoring checks for the guided exercises.
 * Run: bun run src/data/exercises/__tests__/exercises.check.ts
 * (No test framework or new dependencies; exits non-zero on failure.)
 */
import { EXERCISES, getExercise, OTHER_VALUE, otherKey, pruneAnswers, outputToText, describeChange, retakeDate, shortDate } from "../index";
import type { Answers, Exercise, ExerciseStep } from "../index";
import { visibleSteps } from "../helpers";
import { boundaryStatement } from "../boundaryScript";
import { verdict } from "../helpingOrEnabling";
import { reframeSentence } from "../guiltCheck";
import { commitments } from "../weeklySelfCare";
import { scoreStress } from "../stressCheck";
import { scorePulse, strengths, focusArea } from "../familyPulse";

let failed = 0;
let passed = 0;
function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) {
    passed++;
  } else {
    failed++;
    console.error(`FAIL ${name}`, detail === undefined ? "" : JSON.stringify(detail, null, 2));
  }
}
const eq = (name: string, actual: unknown, expected: unknown) =>
  check(name, JSON.stringify(actual) === JSON.stringify(expected), { actual, expected });
const has = (name: string, haystack: string, needle: string) =>
  check(name, haystack.includes(needle), { haystack, needle });

const ex = (id: string) => {
  const e = getExercise(id);
  if (!e) throw new Error(`missing exercise ${id}`);
  return e;
};

// ---------- catalog ----------
const IDS = [
  "boundary-script",
  "helping-or-enabling",
  "guilt-check",
  "control-sort",
  "weekly-self-care",
  "stress-check",
  "hard-moment-practice",
  "family-pulse",
];
eq("all 8 exercises present in catalog order", EXERCISES.map((e) => e.id), IDS);
for (const e of EXERCISES) {
  check(`${e.id} has title/summary/minutes`, !!e.title && !!e.summary && e.minutes > 0, e);
  check(`${e.id} scored flag matches score fn`, e.scored === !!e.score, e.id);
  const ids = e.steps.map((s) => s.id);
  check(`${e.id} step ids unique`, new Set(ids).size === ids.length, ids);
}
check("unknown id -> undefined", getExercise("nope") === undefined);

// ---------- max visible question screens <= 8, over every branch ----------
// Enumerate answers for every single-choice step (all options) and every
// multi step (none / one / all), which covers all showIf branches here.
function choicesFor(step: ExerciseStep): Answers[keyof Answers][] {
  if (step.type === "single") return step.options.map((o) => o.value);
  if (step.type === "multi") return [[], [step.options[0].value], step.options.map((o) => o.value)];
  if (step.type === "scale") return [0, 4];
  return ["x"];
}
function maxVisible(e: Exercise): number {
  const branching = e.steps.filter((s) => s.type === "single" || s.type === "multi");
  let max = 0;
  const walk = (i: number, a: Answers) => {
    if (i === branching.length) {
      const fill: Answers = { ...a };
      for (const s of e.steps) if (fill[s.id] === undefined) fill[s.id] = choicesFor(s)[0];
      max = Math.max(max, visibleSteps(e.steps, fill).length);
      return;
    }
    for (const c of choicesFor(branching[i])) walk(i + 1, { ...a, [branching[i].id]: c });
  };
  // Keep the search small: scale-only exercises have no branches.
  if (branching.length > 9) {
    max = visibleSteps(e.steps, {}).length;
  } else {
    walk(0, {});
  }
  return max;
}
for (const e of EXERCISES) {
  const m = maxVisible(e);
  check(`${e.id} has 5..8 question screens (max ${m})`, m >= 3 && m <= 8, m);
  check(`${e.id} builds output from empty answers`, !!e.buildOutput({}).title);
}

// ---------- boundary-script ----------
eq(
  "boundary statement basic",
  boundaryStatement("They ask me for money while they're still using.", "I will say no."),
  "When they ask me for money while they're still using, I will say no.",
);
eq("boundary statement strips leading When", boundaryStatement("When you yell at me", "leave the room"), "When you yell at me, I will leave the room.");
eq("boundary keeps I", boundaryStatement("I find drugs in the house", "call the police"), "When I find drugs in the house, I will call the police.");
{
  const a: Answers = {
    behavior: "You come home intoxicated",
    action: "not talk with you that night",
    consequence: "I will go to my room and close the door",
    checks: ["This consequence is something I am truly willing to do", "It is about my behavior, not forcing theirs", "I can enforce it consistently"],
    pushback: ["Anger", "Blame", OTHER_VALUE],
    [otherKey("pushback")]: "Threats to leave",
    calmResponse: "\"I understand this is hard. My boundary remains the same.\"",
    support: "My sister",
  };
  const out = ex("boundary-script").buildOutput(a);
  const t = outputToText(out);
  has("boundary output statement", t, "When you come home intoxicated, I will not talk with you that night.");
  has("boundary output consequence", t, "I will go to my room and close the door.");
  has("boundary output pushback", t, "anger, blame, or threats to leave");
  has("boundary calm response quoted once", t, "“I understand this is hard. My boundary remains the same.”");
  check("revised step hidden when all checks", !visibleSteps(ex("boundary-script").steps, a).some((s) => s.id === "revised"));
  const b = { ...a, checks: ["It is about my behavior, not forcing theirs"], revised: "I will go to bed instead of arguing" };
  check("revised step shown when a check is missing", visibleSteps(ex("boundary-script").steps, b).some((s) => s.id === "revised"));
  has("revised boundary replaces action", outputToText(ex("boundary-script").buildOutput(b)), "I will go to bed instead of arguing.");
  const c = { ...b, revised: "" };
  has("not-ready note when not revised", outputToText(ex("boundary-script").buildOutput(c)), "Before I use it");
}

// ---------- helping-or-enabling ----------
eq("verdict crisis", verdict({ situation: "crisis" }), "crisis");
eq("verdict enabling: reduces consequences", verdict({ situation: "chaos", reducesConsequences: "yes" }), "enabling");
eq("verdict enabling: little accountability", verdict({ situation: "chaos", reducesConsequences: "no", accountability: ["a", "b"] }), "enabling");
eq("verdict helping", verdict({ situation: "chaos", reducesConsequences: "no", accountability: ["a", "b", "c"] }), "helping");
eq("verdict unclear: self-check flag", verdict({ situation: "chaos", reducesConsequences: "no", accountability: ["a", "b", "c"], selfCheck: ["fear"] }), "unclear");
{
  const e = ex("helping-or-enabling");
  const crisis = { request: "They want a ride", situation: "crisis", crisisResponse: "Call 911 / call or text 988 (crisis line)" };
  eq("crisis path is 3 screens", visibleSteps(e.steps, crisis).map((s) => s.id), ["request", "situation", "crisisResponse"]);
  const t = outputToText(e.buildOutput(crisis));
  has("crisis output", t, "This is a crisis");
  has("crisis next step", t, "Call 911 / call or text 988 (crisis line).");
  const en = { request: "they are asking me to pay rent", situation: "chaos", activelyUsing: "yes", reducesConsequences: "yes", selfCheck: [], noResponse: "“I'm not able to do that.”", alternatives: ["Offer to attend a family session"] };
  const te = outputToText(e.buildOutput(pruneAnswers(e.steps, en)));
  has("enabling verdict", te, "This looks like enabling");
  has("enabling reason", te, "Helping would reduce the consequences");
  has("enabling no", te, "“I'm not able to do that.”");
  has("enabling alternative", te, "- Offer to attend a family session");
  const help = { request: "drive to intake", situation: "chaos", activelyUsing: "no", reducesConsequences: "no", accountability: ["a", "b", "c", "d"], selfCheck: [], willDo: "Drive them Thursday", theyMustDo: "Keep the appointment" };
  const th = outputToText(e.buildOutput(pruneAnswers(e.steps, help)));
  has("helping verdict", th, "This looks like helping");
  has("helping agreement", th, "What I will do: Drive them Thursday.");
  // Stale answers from another branch are dropped before saving.
  const stale = { ...help, situation: "crisis", crisisResponse: "Take them to ER / medical evaluation" };
  const pruned = pruneAnswers(e.steps, stale);
  check("prune drops hidden branch answers", pruned.willDo === undefined && pruned.crisisResponse !== undefined, pruned);
}

// ---------- guilt-check ----------
eq("reframe fills sentence", reframeSentence("holding my boundary"), "I feel guilty, and I am still responsible for holding my boundary.");
eq("reframe tolerates full sentence", reframeSentence("I feel guilty, and I am still responsible for my own peace."), "I feel guilty, and I am still responsible for my own peace.");
eq("reframe default", reframeSentence(""), "I feel guilty, and I am still responsible for holding my boundary.");
{
  const t = outputToText(
    ex("guilt-check").buildOutput({
      guiltThought: "If I don't give them money, then they'll end up on the street",
      triggers: ["Requests for money"],
      tendencies: ["Give in", "Over-explain"],
      test: ["discomfort", "fear", "respect"],
      notMine: ["Someone else's sobriety"],
      value: "Self-respect",
      reframe: "telling the truth",
      anchor: "I can feel guilty and still say no",
    }),
  );
  has("guilt thought quoted", t, "“If I don't give them money, then they'll end up on the street.”");
  has("guilt pause signal at 3+", t, "pause before acting");
  has("is responsible list", t, "- My follow-through");
  has("isn't responsible (selected)", t, "- Someone else's sobriety");
  check("isn't list only selected", !t.includes("- Fixing the past"));
  has("reframe output", t, "I feel guilty, and I am still responsible for telling the truth.");
  has("value", t, "self-respect");
}

// ---------- control-sort ----------
{
  const t = outputToText(
    ex("control-sort").buildOutput({
      stress: "Whether they'll relapse",
      cannot: ["The timeline of recovery", OTHER_VALUE],
      [otherKey("cannot")]: "Their friends",
      can: ["The boundaries I set and enforce"],
      stopDoing: "Checking their location",
      startDoing: "Going to the Monday meeting",
    }),
  );
  has("can't control list", t, "What I can't control\n- The timeline of recovery\n- Their friends");
  has("can control list", t, "What I can control\n- The boundaries I set and enforce");
  has("one action", t, "I will start: Going to the Monday meeting.");
  has("letting go", t, "I'm letting go of: Checking their location.");
}

// ---------- weekly-self-care ----------
{
  const e = ex("weekly-self-care");
  const a: Answers = { phase: "crisis", crisisNeed: "Prioritize sleep", calmNeed: "Strengthen boundaries", realLife: OTHER_VALUE, [otherKey("realLife")]: "call my friend Ana", routine: "a 10-minute walk after dinner" };
  eq("three commitments in order", commitments(pruneAnswers(e.steps, a)), ["A 10-minute walk after dinner.", "Prioritize sleep.", "Call my friend Ana."]);
  check("calm step hidden in crisis", !visibleSteps(e.steps, a).some((s) => s.id === "calmNeed"));
  eq("calm commitments", commitments({ ...a, phase: "calm" })[1], "Strengthen boundaries.");
  has("self-care output heading", outputToText(e.buildOutput(a)), "My three commitments this week");
}

// ---------- stress-check (scored) ----------
{
  const e = ex("stress-check");
  const all = (v: number) => Object.fromEntries(e.steps.map((s) => [s.id, v]));
  eq("stress max", scoreStress(all(0)).max, 32);
  eq("stress 0 -> flexible", scoreStress(all(0)).bandId, "flexible");
  eq("stress 8 -> flexible", scoreStress(all(1)).bandId, "flexible");
  eq("stress 16 -> chronic", scoreStress(all(2)).bandId, "chronic");
  eq("stress 24 -> significant", scoreStress(all(3)).bandId, "significant");
  eq("stress 32 -> survival", scoreStress(all(4)).bandId, "survival");
  check("stress high distress at 17+", scoreStress({ ...all(2), h1: 3 }).highDistress === true && scoreStress(all(2)).highDistress === false);
  const mixed = { ...all(0), b1: 4, e1: 3, r4: 2, r5: 2 };
  eq("stress top areas", scoreStress(mixed).topAreas, ["Sleep, body & nervous system", "Emotional reactivity & exhaustion"]);
  eq("stress top areas none when low", scoreStress(all(1)).topAreas, []);
  const out = e.buildOutput(all(4));
  check("stress output has score", out.score?.score === 32);
  has("stress output not a diagnosis", outputToText(out), "This isn't a diagnosis");
  eq("score() agrees with output", e.score?.(mixed).score, 11);
}

// ---------- family-pulse (scored) ----------
{
  const e = ex("family-pulse");
  const all = (v: number) => Object.fromEntries(e.steps.map((s) => [s.id, v]));
  eq("pulse bands", [0, 1, 2, 3, 4].map((v) => scorePulse(all(v)).bandId), ["low", "low", "some", "significant", "high"]);
  const a = { ...all(1), b3: 4, b4: 3, c1: 2 };
  eq("pulse focus area = behavioral", focusArea(a), "behavioral");
  eq("pulse focus tie -> earlier section", focusArea(all(2)), "emotional");
  eq("pulse strengths count", strengths(a).length, 5);
  const t = outputToText(e.buildOutput(a));
  has("pulse focus text", t, "One focus area: Behavioral enabling");
  has("pulse strengths", t, "Strengths\n- You're willing to have difficult conversations.");
  has("pulse no strengths fallback", outputToText(e.buildOutput(all(3))), "That honesty is where change starts.");
  has("pulse not a diagnosis", t, "This isn't a diagnosis");
}

// ---------- hard-moment-practice ----------
{
  const e = ex("hard-moment-practice");
  const a: Answers = { scenario: "call-from-jail", emotions: ["Panic", "Guilt"], crisisOrChaos: "chaos", wontDo: "Post bail tonight", say: "I love you, and I am not going to post bail.", whoToCall: "My sponsor" };
  const t = outputToText(e.buildOutput(a));
  has("scenario", t, "The moment: The call from jail");
  has("say", t, "What I'll say: “I love you, and I am not going to post bail.”");
  has("won't", t, "What I won't do: Post bail tonight.");
  has("call", t, "Who I'll call before I decide: My sponsor.");
  has("remember for jail", t, "Jail is often safer");
  has("chaos", t, "chaos, not a crisis");
  const sayStep = e.steps.find((s) => s.id === "say");
  const example = typeof sayStep?.example === "function" ? sayStep.example(a) : sayStep?.example;
  has("scenario-specific example", example ?? "", "not going to post bail");
}

// ---------- utilities ----------
eq("retake date +30 days", retakeDate("2026-11-03T12:00:00Z").toISOString(), "2026-12-03T12:00:00.000Z");
eq("short date same year", shortDate(new Date(2026, 10, 3), new Date(2026, 10, 10)), "Nov 3");
eq("short date other year", shortDate(new Date(2025, 0, 9), new Date(2026, 10, 10)), "Jan 9, 2025");
has("describe down", describeChange(20, 14, "Oct 3"), "Down 6 points since Oct 3");
has("describe up", describeChange(10, 11, "Oct 3"), "Up 1 point since Oct 3");
eq("describe same", describeChange(5, 5, "Oct 3"), "The same score as Oct 3.");

console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) {
  // eslint-disable-next-line no-undef
  (globalThis as { process?: { exit: (n: number) => void } }).process?.exit(1);
}
