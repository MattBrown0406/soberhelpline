import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Copy, Loader2, Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
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
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">We couldn't find that exercise</h1>
        <p className="mt-3 text-muted-foreground">
          The link may be old or mistyped. All of the guided exercises are in your workbook.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/workbook">Go to My Workbook</Link>
        </Button>
      </div>
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

  return (
    <>
      <SEOHead title={`${exercise.title} | My Workbook`} description={exercise.summary} noIndex />
      <div className="min-h-[70vh] bg-background">
        <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6 sm:pt-10">
          <div className="workbook-no-print mb-6 flex items-center justify-between gap-3 text-sm">
            <Link
              to="/workbook"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {phase === "steps" ? "Save and finish later" : "My Workbook"}
            </Link>
            {phase === "steps" && <span className="text-muted-foreground">{exercise.title}</span>}
          </div>

          {phase === "loading" && (
            <div className="flex justify-center py-20" role="status">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">Loading</span>
            </div>
          )}

          {phase === "intro" && (
            <Intro
              exercise={exercise}
              hasDraft={hasSavedDraft}
              latest={latest}
              onBegin={() => begin(false)}
              onStartOver={() => begin(true)}
            />
          )}

          {phase === "steps" && step && (
            <div>
              <ProgressDots total={steps.length} current={index} answered={steps.map((s) => hasAnswer(s, answers))} />
              <form
                className="mt-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  next();
                }}
              >
                <StepView ref={headingRef} key={step.id} step={step} answers={answers} onAnswer={onAnswer} onSubmit={next} />
                <div className="mt-10 flex items-center justify-between gap-3">
                  <Button type="button" variant="outline" size="lg" className="h-12 min-w-28" onClick={back}>
                    <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    Back
                  </Button>
                  <Button type="submit" size="lg" className="h-12 min-w-36" disabled={!canContinue(step, answers)}>
                    {nextLabel(step, answers, index === steps.length - 1)}
                    <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  You can stop anytime. Your answers are kept on this device until you finish.
                </p>
              </form>
            </div>
          )}

          {phase === "result" && result && (
            <div className="space-y-6">
              <style>{PRINT_CSS}</style>
              <div className="workbook-no-print">
                <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold text-foreground outline-none sm:text-3xl">
                  Here's what you made
                </h1>
                <p className="mt-2 text-muted-foreground">Keep it somewhere you'll see it. You can come back to it in My Workbook.</p>
              </div>

              <article id="workbook-print" className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
                <p className="mb-4 text-sm text-muted-foreground">
                  {exercise.title} · {shortDate(result.completedAt)}
                </p>
                <OutputView output={result.output} />
              </article>

              {result.output.score?.highDistress && (
                <div className="workbook-no-print">
                  <SupportBox />
                </div>
              )}

              <div className="workbook-no-print space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="button" variant="outline" size="lg" className="h-12" onClick={copy}>
                    <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                    Copy
                  </Button>
                  <Button type="button" variant="outline" size="lg" className="h-12" onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
                    Print
                  </Button>
                  {result.previous && (
                    <Button
                      type="button"
                      size="lg"
                      className="h-12"
                      aria-expanded={showCompare}
                      onClick={() => setShowCompare((v) => !v)}
                    >
                      {showCompare ? "Hide comparison" : "Compare with last time"}
                    </Button>
                  )}
                </div>

                <div aria-live="polite" className="rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed">
                  {saveState === "saving" && (
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Saving to My Workbook…
                    </p>
                  )}
                  {saveState === "saved" && (
                    <p className="flex items-start gap-2 text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      <span>
                        Saved to <Link to="/workbook" className="font-medium text-primary underline-offset-2 hover:underline">My Workbook</Link>.
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
                      <Button type="button" variant="outline" size="sm" className="h-10" onClick={() => void persist(result)}>
                        <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                        Try saving again
                      </Button>
                    </div>
                  )}
                </div>

                {showCompare && result.previous && (
                  <section aria-label="Compare with last time" className="space-y-3">
                    <h2 className="text-lg font-semibold text-foreground">Compare with last time</h2>
                    <CompareView
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
                  <Button asChild size="lg" variant="ghost" className="h-12">
                    <Link to="/workbook">Back to My Workbook</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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

function ProgressDots({ total, current, answered }: { total: number; current: number; answered: boolean[] }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <ol className="flex flex-wrap items-center justify-center gap-2" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <li
            key={i}
            className={[
              "h-2.5 rounded-full transition-all",
              i === current ? "w-8 bg-primary" : answered[i] ? "w-2.5 bg-primary/60" : "w-2.5 bg-muted-foreground/25",
            ].join(" ")}
          />
        ))}
      </ol>
      <p className="text-sm text-muted-foreground">
        Question {current + 1} of {total}
      </p>
    </div>
  );
}

function Intro({
  exercise,
  hasDraft,
  latest,
  onBegin,
  onStartOver,
}: {
  exercise: Exercise;
  hasDraft: boolean;
  latest?: WorkbookEntry;
  onBegin: () => void;
  onStartOver: () => void;
}) {
  const { intro } = exercise;
  return (
    <div className="space-y-6">
      <div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" aria-hidden="true" />
          About {exercise.minutes} minutes · one question at a time
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">{exercise.title}</h1>
      </div>
      <p className="text-lg leading-relaxed text-foreground/90">{intro.purpose}</p>
      {intro.points && intro.points.length > 0 && (
        <ul className="space-y-2">
          {intro.points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-base text-foreground/90">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
      {intro.safety && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          {intro.safety}
        </div>
      )}
      {intro.note && <p className="text-sm italic leading-relaxed text-muted-foreground">{intro.note}</p>}
      {latest && (
        <p className="rounded-lg bg-muted/50 px-4 py-3 text-sm text-foreground/90">
          You did this on {shortDate(latest.completed_at)}.{" "}
          {isDueForRetake(latest.completed_at)
            ? "It's a good time to retake it. When you finish, you can compare the two."
            : `Most people retake it from ${shortDate(retakeDate(latest.completed_at))}, but you can do it again any time and compare.`}
        </p>
      )}
      <div className="space-y-3">
        {hasDraft ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-12 sm:min-w-56" onClick={onBegin} autoFocus>
              Continue where you left off
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" className="h-12" onClick={onStartOver}>
              Start over
            </Button>
          </div>
        ) : (
          <Button size="lg" className="h-12 w-full sm:w-auto sm:min-w-56" onClick={onBegin}>
            Begin
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
          </Button>
        )}
        <p className="text-sm text-muted-foreground">
          You can stop anytime and pick up where you left off. There are no right or wrong answers.
        </p>
      </div>
    </div>
  );
}
