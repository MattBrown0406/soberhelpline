import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Copy, Loader2, Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { IconTile, MemberPage, Panel, TONE, toneForExercise, type Tone } from "@/components/member/MemberUI";
import { iconForExercise } from "@/components/workbook/exerciseIcons";
import StepView from "@/components/workbook/StepView";
import OutputView, { SupportBox } from "@/components/workbook/OutputView";
import CompareView from "@/components/workbook/CompareView";
import { useWorkbook, type WorkbookEntry } from "@/hooks/useWorkbook";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import {
  canContinue,
  clearDraft,
  exercisePath,
  getExercise,
  hasAnswer,
  isDueForRetake,
  loadDraft,
  outputToText,
  pruneAnswers,
  retakeDate,
  saveDraft,
  shortDate,
  visibleSteps,
  type AnswerValue,
  type Answers,
  type Exercise,
  type ExerciseOutput,
} from "@/data/exercises";

// Printing shows only the result card: hide all page chrome (header, nav,
// footer, chat widgets) and force dark-on-white text.
const PRINT_CSS = `
@media print {
  body * { visibility: hidden !important; }
  #workbook-print, #workbook-print * { visibility: visible !important; }
  #workbook-print { position: absolute !important; left: 0; top: 0; width: 100%; margin: 0; padding: 0 0.5in; border: 0 !important; box-shadow: none !important; }
  #workbook-print * { color: #111 !important; background: transparent !important; border-color: #bbb !important; }
  .workbook-no-print { display: none !important; }
}
`;

type Phase = "loading" | "intro" | "steps" | "result";
type SaveState = "saving" | "saved" | "error";

interface Result {
  output: ExerciseOutput;
  answers: Answers;
  score: number | null;
  completedAt: string;
  previous: WorkbookEntry | null;
}

export default function WorkbookExercise() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const exercise = getExercise(exerciseId);
  if (!exercise) return <ExerciseNotFound />;
  return <ExerciseRunner key={exercise.id} exercise={exercise} />;
}

function ExerciseNotFound() {
  return (
    <>
      <SEOHead title="Exercise not found | My Workbook" description="This exercise could not be found." noIndex />
      <MemberPage>
        <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
          <Panel className="text-center sm:p-8">
            <h1 className="text-2xl font-semibold text-foreground">We couldn't find that exercise</h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              The link may be old or mistyped. All of the guided exercises are in your workbook.
            </p>
            <Button asChild size="lg" className="mt-6 h-12 rounded-xl">
              <Link to="/workbook">Go to My Workbook</Link>
            </Button>
          </Panel>
        </div>
      </MemberPage>
    </>
  );
}

function ExerciseRunner({ exercise }: { exercise: Exercise }) {
  const wb = useWorkbook();
  const progress = useEducationProgress();
  const path = exercisePath(exercise.id);

  const [phase, setPhase] = useState<Phase>("loading");
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("saving");
  const [showCompare, setShowCompare] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const startedRef = useRef(false);
  const savingRef = useRef(false);

  // Wait for the session so the draft key matches the signed-in member.
  useEffect(() => {
    if (wb.loading || phase !== "loading") return;
    const draft = loadDraft(wb.userId, exercise.id);
    if (draft && Object.keys(draft.answers).length > 0) {
      setAnswers(draft.answers);
      setStepIndex(Math.max(0, draft.stepIndex));
      setHasSavedDraft(true);
    }
    setPhase("intro");
  }, [wb.loading, wb.userId, exercise.id, phase]);

  const steps = useMemo(() => visibleSteps(exercise.steps, answers), [exercise.steps, answers]);
  const index = Math.min(stepIndex, Math.max(0, steps.length - 1));
  const step = steps[index];

  // Keep the in-progress answers on this device so a refresh doesn't lose them.
  useEffect(() => {
    if (phase === "steps") saveDraft(wb.userId, exercise.id, answers, index);
  }, [phase, answers, index, wb.userId, exercise.id]);

  // Record "started" once, on the first question (after progress has loaded).
  useEffect(() => {
    if (phase !== "steps" || startedRef.current || progress.loading) return;
    startedRef.current = true;
    progress.markStarted(exercise.title, path, "worksheet");
  }, [phase, progress, exercise.title, path]);

  // Move focus to each new question (and to the result heading).
  useEffect(() => {
    if (phase !== "steps" && phase !== "result") return;
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = window.setTimeout(() => headingRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, [phase, index]);

  const onAnswer = useCallback((key: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const begin = (fresh: boolean) => {
    if (fresh) {
      clearDraft(wb.userId, exercise.id);
      setAnswers({});
      setStepIndex(0);
      setHasSavedDraft(false);
    }
    setPhase("steps");
  };

  const persist = useCallback(
    async (r: Result) => {
      if (savingRef.current) return;
      savingRef.current = true;
      setSaveState("saving");
      const saved = await wb.save(exercise.id, r.answers, r.output, r.score);
      savingRef.current = false;
      if (!saved) {
        setSaveState("error");
        return;
      }
      setSaveState("saved");
      setResult((prev) => (prev ? { ...prev, completedAt: saved.completed_at } : prev));
      clearDraft(wb.userId, exercise.id);
      progress.markCompleted(exercise.title, path, "worksheet");
    },
    [wb, exercise.id, exercise.title, path, progress],
  );

  const finish = () => {
    const pruned = pruneAnswers(exercise.steps, answers);
    const output = exercise.buildOutput(pruned);
    const score = exercise.score ? exercise.score(pruned).score : null;
    const r: Result = {
      output,
      answers: pruned,
      score,
      completedAt: new Date().toISOString(),
      previous: wb.latestByExercise[exercise.id] ?? null,
    };
    setResult(r);
    setShowCompare(false);
    setPhase("result");
    void persist(r);
  };

  const next = () => {
    if (!step || !canContinue(step, answers)) return;
    if (index >= steps.length - 1) finish();
    else setStepIndex(index + 1);
  };

  const back = () => {
    if (index === 0) setPhase("intro");
    else setStepIndex(index - 1);
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(outputToText(result.output, shortDate(result.completedAt)));
      toast.success("Copied. You can paste it into a note or a message to yourself.");
    } catch {
      toast.error("Copying didn't work on this device. You can select the text and copy it instead.");
    }
  };

  const latest = wb.latestByExercise[exercise.id];
  const tone = toneForExercise(exercise.id);
  const ExerciseIcon = iconForExercise(exercise.id);

  return (
    <>
      <SEOHead title={`${exercise.title} | My Workbook`} description={exercise.summary} noIndex />
      <MemberPage>
        <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-4 sm:pt-8">
          <div className="workbook-no-print mb-3 flex items-center text-sm sm:mb-4">
            <Link
              to="/workbook"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {phase === "steps" ? "Save and finish later" : "My Workbook"}
            </Link>
          </div>

          {phase === "loading" && (
            <div className="flex justify-center py-20" role="status">
              <Loader2 className="h-6 w-6 animate-spin text-foreground/70" aria-hidden="true" />
              <span className="sr-only">Loading</span>
            </div>
          )}

          {phase === "intro" && (
            <Intro
              exercise={exercise}
              tone={tone}
              hasDraft={hasSavedDraft}
              latest={latest}
              onBegin={() => begin(false)}
              onStartOver={() => begin(true)}
            />
          )}

          {phase === "steps" && step && (
            <div>
              <Panel className="overflow-hidden p-0 sm:p-0">
                <div className="border-b border-border/70 px-5 pb-4 pt-4 sm:px-8 sm:pt-5">
                  <div className="mb-3 flex items-center gap-2.5">
                    <IconTile icon={ExerciseIcon} tone={tone} size="sm" />
                    <span className="min-w-0 text-sm font-semibold leading-snug text-foreground">{exercise.title}</span>
                  </div>
                  <ProgressDots
                    total={steps.length}
                    current={index}
                    answered={steps.map((s) => hasAnswer(s, answers))}
                    tone={tone}
                  />
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    next();
                  }}
                >
                  <div className="px-5 py-6 sm:px-8 sm:py-8">
                    <StepView ref={headingRef} key={step.id} step={step} answers={answers} onAnswer={onAnswer} onSubmit={next} />
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-border/70 bg-muted/40 px-5 py-4 sm:px-8">
                    <Button type="button" variant="outline" size="lg" className="h-12 min-w-24 rounded-xl bg-card px-5" onClick={back}>
                      <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-auto min-h-12 min-w-36 flex-1 whitespace-normal rounded-xl px-5 py-2.5 text-base sm:flex-none sm:px-8"
                      disabled={!canContinue(step, answers)}
                    >
                      {nextLabel(step, answers, index === steps.length - 1)}
                      <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </form>
              </Panel>
              <p className="mt-5 px-2 text-center text-sm leading-relaxed text-foreground/75">
                You can stop anytime. Your answers are kept on this device until you finish.
              </p>
            </div>
          )}

          {phase === "result" && result && (
            <div className="space-y-6">
              <style>{PRINT_CSS}</style>
              <div className="workbook-no-print">
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-2xl font-bold leading-tight tracking-tight text-foreground outline-none sm:text-3xl"
                >
                  Here's what you made
                </h1>
                <p className="mt-2 leading-relaxed text-foreground/80">
                  Keep it somewhere you'll see it. You can come back to it in My Workbook.
                </p>
              </div>

              <article
                id="workbook-print"
                className={`relative overflow-hidden rounded-2xl border bg-card p-5 pt-6 shadow-sm shadow-slate-900/[0.04] sm:p-8 sm:pt-9 print:overflow-visible ${TONE[tone].border}`}
              >
                <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 print:hidden ${TONE[tone].bar}`} />
                <div className="mb-4 flex items-center gap-3">
                  <IconTile icon={ExerciseIcon} tone={tone} className="print:hidden" />
                  <p className="min-w-0 text-sm font-medium leading-snug text-muted-foreground">
                    {exercise.title} · {shortDate(result.completedAt)}
                  </p>
                </div>
                <OutputView output={result.output} tone={tone} />
              </article>

              {result.output.score?.highDistress && (
                <div className="workbook-no-print">
                  <SupportBox />
                </div>
              )}

              <div className="workbook-no-print space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
                  <Button type="button" variant="outline" size="lg" className="h-12 rounded-xl bg-card px-5" onClick={copy}>
                    <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                    Copy
                  </Button>
                  <Button type="button" variant="outline" size="lg" className="h-12 rounded-xl bg-card px-5" onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
                    Print
                  </Button>
                  {result.previous && (
                    <Button
                      type="button"
                      size="lg"
                      className="col-span-2 h-12 rounded-xl px-5"
                      aria-expanded={showCompare}
                      onClick={() => setShowCompare((v) => !v)}
                    >
                      {showCompare ? "Hide comparison" : "Compare with last time"}
                    </Button>
                  )}
                </div>

                <div aria-live="polite" className="rounded-2xl border border-border/70 bg-card p-4 text-sm leading-relaxed shadow-sm shadow-slate-900/[0.04]">
                  {saveState === "saving" && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Saving to My Workbook…
                    </p>
                  )}
                  {saveState === "saved" && (
                    <p className="flex items-start gap-2 text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
                      <span>
                        Saved to <Link to="/workbook" className="rounded font-semibold text-primary underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">My Workbook</Link>.
                        {" "}You can retake it from {shortDate(retakeDate(result.completedAt))} and compare.
                      </span>
                    </p>
                  )}
                  {saveState === "error" && (
                    <div className="space-y-2">
                      <p className="text-foreground">
                        We couldn't save this to My Workbook just now. Your answers are still on this device, so nothing is lost.
                        You can copy or print it now.
                      </p>
                      <Button type="button" variant="outline" size="sm" className="h-11 rounded-xl" onClick={() => void persist(result)}>
                        <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                        Try saving again
                      </Button>
                    </div>
                  )}
                </div>

                {showCompare && result.previous && (
                  <section aria-label="Compare with last time" className="space-y-3">
                    <h2 className="text-lg font-semibold text-foreground sm:text-xl">Compare with last time</h2>
                    <CompareView
                      tone={tone}
                      previous={{
                        output: result.previous.output,
                        score: result.previous.score,
                        completedAt: result.previous.completed_at,
                      }}
                      current={{ output: result.output, score: result.score, completedAt: result.completedAt }}
                      currentLabel={`Today · ${shortDate(result.completedAt)}`}
                    />
                  </section>
                )}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button asChild size="lg" variant="ghost" className="h-12 rounded-xl">
                    <Link to="/workbook">Back to My Workbook</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </MemberPage>
    </>
  );
}

function nextLabel(step: Exercise["steps"][number], answers: Answers, isLast: boolean): string {
  if (isLast) return "See my result";
  if (!hasAnswer(step, answers)) {
    if (step.type === "multi" && step.noneLabel) return step.noneLabel;
    if (step.optional) return "Skip";
  }
  return "Next";
}

/** "Question 3 of 7" over a segmented bar: one segment per question, in the exercise's colour. */
function ProgressDots({ total, current, answered, tone }: { total: number; current: number; answered: boolean[]; tone: Tone }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground/80">
        Question {current + 1} of {total}
      </p>
      <ol className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <li
            key={i}
            className={[
              "min-w-0 flex-1 rounded-full transition-all motion-reduce:transition-none",
              i === current
                ? `h-2.5 ${TONE[tone].bar}`
                : answered[i]
                  ? `h-1.5 opacity-60 ${TONE[tone].bar}`
                  : "h-1.5 bg-muted-foreground/25",
            ].join(" ")}
          />
        ))}
      </ol>
    </div>
  );
}

function Intro({
  exercise,
  tone,
  hasDraft,
  latest,
  onBegin,
  onStartOver,
}: {
  exercise: Exercise;
  tone: Tone;
  hasDraft: boolean;
  latest?: WorkbookEntry;
  onBegin: () => void;
  onStartOver: () => void;
}) {
  const { intro } = exercise;
  return (
    <Panel className="relative overflow-hidden pt-7 sm:p-8 sm:pt-10">
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 print:hidden ${TONE[tone].bar}`} />
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <IconTile icon={iconForExercise(exercise.id)} tone={tone} size="lg" />
            <p className="flex min-w-0 flex-1 items-center gap-1.5 text-sm font-medium leading-snug text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
              About {exercise.minutes} minutes · one question at a time
            </p>
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">{exercise.title}</h1>
        </div>
        <p className="text-lg leading-relaxed text-foreground/90">{intro.purpose}</p>
        {intro.points && intro.points.length > 0 && (
          <ul className={`space-y-2.5 rounded-xl p-4 ${TONE[tone].soft}`}>
            {intro.points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-base leading-snug text-foreground/90">
                <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${TONE[tone].text}`} aria-hidden="true" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
        {intro.safety && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            {intro.safety}
          </div>
        )}
        {intro.note && <p className="text-sm italic leading-relaxed text-muted-foreground">{intro.note}</p>}
        {latest && (
          <p className="rounded-xl bg-muted/60 px-4 py-3 text-sm leading-relaxed text-foreground/90">
            You did this on {shortDate(latest.completed_at)}.{" "}
            {isDueForRetake(latest.completed_at)
              ? "It's a good time to retake it. When you finish, you can compare the two."
              : `Most people retake it from ${shortDate(retakeDate(latest.completed_at))}, but you can do it again any time and compare.`}
          </p>
        )}
        <div className="space-y-3">
          {hasDraft ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 rounded-xl text-base sm:min-w-56" onClick={onBegin} autoFocus>
                Continue where you left off
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 rounded-xl" onClick={onStartOver}>
                Start over
              </Button>
            </div>
          ) : (
            <Button size="lg" className="h-12 w-full rounded-xl text-base sm:w-auto sm:min-w-56" onClick={onBegin}>
              Begin
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Button>
          )}
          <p className="text-sm leading-relaxed text-muted-foreground">
            You can stop anytime and pick up where you left off. There are no right or wrong answers.
          </p>
        </div>
      </div>
    </Panel>
  );
}
