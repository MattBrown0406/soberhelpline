import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Compass, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconTile, MemberPage, Panel, TONE } from "@/components/member/MemberUI";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import { getTrack, savePendingTrack, useLearningPath, type MemberTrack } from "@/hooks/useLearningPath";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";
import { useToast } from "@/hooks/use-toast";

// --- Types ---
interface QuizAnswers {
  relationship: string;
  lovedOneStatus: string;
  primaryNeed: string;
  treatmentHistory: string;
  selfState: string;
}

// --- Questions ---
const questions = [
  {
    id: "relationship",
    question: "What's your relationship to the person struggling with addiction?",
    subtitle: "This helps us understand your unique perspective.",
    options: [
      { value: "parent", label: "Parent" },
      { value: "spouse", label: "Spouse / Partner" },
      { value: "sibling", label: "Sibling" },
      { value: "adult-child", label: "Adult Child" },
      { value: "friend", label: "Friend" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "lovedOneStatus",
    question: "Where is your loved one right now?",
    subtitle: "Every stage needs a different approach.",
    options: [
      { value: "active-use", label: "Active use / Active addiction" },
      { value: "in-treatment", label: "Currently in treatment" },
      { value: "early-recovery", label: "Early recovery (under 90 days)" },
      { value: "long-term-recovery", label: "Long-term recovery (90+ days)" },
      { value: "not-sure", label: "I'm not sure" },
    ],
  },
  {
    id: "primaryNeed",
    question: "What do you need most right now?",
    subtitle: "There are no wrong answers here.",
    options: [
      { value: "understanding", label: "Understanding what's happening" },
      { value: "boundaries", label: "Setting healthy boundaries" },
      { value: "self-care", label: "Managing my own stress and emotions" },
      { value: "treatment", label: "Finding or evaluating treatment options" },
      { value: "connection", label: "Connecting with others who understand" },
    ],
  },
  {
    id: "treatmentHistory",
    question: "Has your loved one been through treatment before?",
    subtitle: "This shapes what resources will be most useful.",
    options: [
      { value: "multiple", label: "Yes, multiple times" },
      { value: "once", label: "Yes, once" },
      { value: "no", label: "No" },
      { value: "not-sure", label: "I'm not sure" },
    ],
  },
  {
    id: "selfState",
    question: "How are YOU doing right now?",
    subtitle: "Be honest. This is about you, not them.",
    options: [
      { value: "crisis", label: "I'm in crisis / barely holding on" },
      { value: "struggling", label: "Struggling but managing day to day" },
      { value: "okay", label: "Doing okay but want to be better prepared" },
      { value: "good", label: "Actually doing pretty well — here to learn" },
    ],
  },
];

// --- Recommendation: one of the eight tracks in memberTracks.json ---
interface Recommendation {
  trackId: string;
  why: string;
}

/**
 * Picks one track. Order matters: how she is doing comes first (crisis), then
 * what she said she needs most, then the treatment history, then her
 * relationship to the person.
 */
function recommendTrack(a: QuizAnswers): Recommendation {
  if (a.selfState === "crisis") {
    return {
      trackId: "crisis-first-72-hours",
      why: "You said you're barely holding on. This path is about slowing things down, getting steady, and making the next decision with a clearer head.",
    };
  }
  if (a.primaryNeed === "treatment") {
    return {
      trackId: "treatment-decision",
      why: "You're trying to find or judge treatment. This path walks you through the questions to ask, the red flags to watch for, and which kind of help fits which problem.",
    };
  }
  if (a.primaryNeed === "boundaries") {
    return {
      trackId: "boundary-setting",
      why: "You want to set healthier boundaries. This path shows how to set limits you can actually hold, without rage, rescuing, or giving in under pressure.",
    };
  }
  if (a.treatmentHistory === "multiple" || (a.treatmentHistory === "once" && a.lovedOneStatus === "active-use")) {
    return {
      trackId: "relapse-response",
      why: "Your loved one has been through treatment and is struggling again. This path helps you respond to return-to-use with a plan instead of panic.",
    };
  }
  if (a.relationship === "spouse") {
    return {
      trackId: "spouse-partner",
      why: "As a partner, you carry exhaustion, mistrust and grief that are easy to push aside. This path helps you get your own footing back.",
    };
  }
  if (a.relationship === "sibling") {
    return {
      trackId: "sibling-track",
      why: "Siblings are often overlooked. This path gives words to the guilt, anger and loyalty conflicts brothers and sisters live with.",
    };
  }
  if (a.relationship === "parent") {
    return {
      trackId: "parent-track",
      why: "As a parent, the pull to rescue is strong. This path helps you move from fear-driven rescuing to steadier leadership.",
    };
  }
  if (a.relationship === "adult-child") {
    return {
      trackId: "family-systems-enabling",
      why: "Growing up with addiction shapes the roles everyone plays. This path explains the patterns underneath and how to stop feeding them.",
    };
  }
  return {
    trackId: "family-systems-enabling",
    why: "A good place to start is understanding how a family adapts around addiction, and which small changes make the biggest difference.",
  };
}

// --- Component ---
const OnboardingQuiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isMember } = useMembershipStatus();
  const { setPath, trackId: currentTrackId } = useLearningPath();
  const [step, setStep] = useState(0); // 0-4 = questions, 5 = result
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [result, setResult] = useState<Recommendation | null>(null);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [signedIn, setSignedIn] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSignedIn(!!session?.user));
  }, []);

  const totalSteps = questions.length;
  const isResults = step >= totalSteps;
  const progressPercent = isResults ? 100 : (step / totalSteps) * 100;
  const track: MemberTrack | undefined = result ? getTrack(result.trackId) : undefined;

  const transition = (newStep: number, dir: "forward" | "back") => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setAnimating(false);
    }, 200);
  };

  const handleAnswer = (value: string) => {
    const questionId = questions[step].id as keyof QuizAnswers;
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < totalSteps - 1) {
      transition(step + 1, "forward");
    } else {
      setResult(recommendTrack(newAnswers as QuizAnswers));
      transition(totalSteps, "forward");
    }
  };

  const goBack = () => {
    if (step > 0) transition(step - 1, "back");
  };

  const startPath = async () => {
    if (!result) return;
    if (!signedIn) {
      // Applied the first time her path loads after signing in.
      savePendingTrack(result.trackId);
      navigate(`/auth?redirect=${encodeURIComponent("/member-home")}`);
      return;
    }
    setSaving(true);
    const ok = await setPath(result.trackId);
    setSaving(false);
    if (!ok) {
      toast({ title: "That didn't save", description: "Please try again in a moment.", variant: "destructive" });
      return;
    }
    navigate("/member-home");
  };

  return (
    <MemberPage>
      <SEOHead
        title="Find Your Starting Path | Sober Helpline"
        description="Answer five short questions and we'll suggest one learning path that fits what your family is facing right now."
      />

      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-14">
        {/* Progress: where she is in the five questions */}
        <div className="mb-4">
          <div className="flex min-h-11 items-center justify-between gap-3">
            <span className="text-sm font-semibold text-foreground/80">
              {isResults ? "Your suggested path" : `Question ${step + 1} of ${totalSteps}`}
            </span>
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="-mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
              </button>
            )}
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressPercent)}
            aria-valuetext={`${Math.round(progressPercent)}%`}
            className="mt-1 flex items-center gap-1.5"
          >
            {questions.map((q, i) => (
              <span
                key={q.id}
                aria-hidden="true"
                className={`h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                  isResults || i < step
                    ? "w-2 bg-[#16294a] dark:bg-sky-300"
                    : i === step
                      ? "w-8 bg-[#16294a] dark:bg-sky-300"
                      : "w-2 bg-[#16294a]/20 dark:bg-sky-300/25"
                }`}
              />
            ))}
          </div>
        </div>

        <div
          className={`transition-all duration-200 motion-reduce:transform-none motion-reduce:transition-none ${
            animating ? (direction === "forward" ? "opacity-0 translate-x-8" : "opacity-0 -translate-x-8") : "opacity-100 translate-x-0"
          }`}
        >
          {!isResults ? (
            <Panel className="sm:p-8">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">{questions[step].question}</h1>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">{questions[step].subtitle}</p>

              <div className="mt-6 space-y-3">
                {questions[step].options.map((option) => {
                  const selected = answers[questions[step].id as keyof QuizAnswers] === option.value;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      aria-pressed={selected}
                      className={`flex min-h-14 w-full items-center gap-3.5 rounded-2xl border-2 px-4 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none ${
                        selected
                          ? "border-[#16294a] bg-[#16294a]/[0.06] dark:border-sky-300 dark:bg-sky-400/10"
                          : "border-border bg-card hover:border-[#16294a]/40 hover:bg-muted/50 dark:hover:border-sky-300/40"
                      }`}
                    >
                      {/* A round mark that fills and shows a tick when chosen, so the choice is not colour alone. */}
                      <span
                        aria-hidden="true"
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected
                            ? "border-[#16294a] bg-[#16294a] text-white dark:border-sky-300 dark:bg-sky-300 dark:text-slate-900"
                            : "border-foreground/50 bg-card"
                        }`}
                      >
                        {selected && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className={`min-w-0 flex-1 text-base leading-snug text-foreground ${selected ? "font-semibold" : ""}`}>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </Panel>
          ) : track && result ? (
            <Panel className="sm:p-8">
              <div className="text-center">
                <div className="mb-3 flex justify-center">
                  <IconTile icon={Heart} tone="rose" size="lg" />
                </div>
                <p className="mb-1 text-sm text-muted-foreground">Based on what you shared, we'd start here:</p>
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">{track.title}</h1>
              </div>

              <div className="mt-6 space-y-5">
                <div className={`rounded-xl border p-4 print:border-0 print:bg-transparent print:p-0 ${TONE.amber.border} ${TONE.amber.soft}`}>
                  <p className={`mb-1 text-xs font-semibold uppercase tracking-wide ${TONE.amber.text}`}>Why this path</p>
                  <p className="text-sm leading-relaxed text-foreground">{result.why}</p>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    The {track.steps.length} steps
                  </p>
                  <ol className="ml-1">
                    {track.steps.map((s, i) => (
                      <li key={s.path} className="relative pb-3 pl-9 last:pb-0">
                        {i < track.steps.length - 1 && (
                          <span aria-hidden="true" className="absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-0.5 bg-border print:hidden" />
                        )}
                        <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-border bg-card text-xs font-semibold tabular-nums text-muted-foreground">
                          {i + 1}
                        </span>
                        <span className="block pt-0.5 text-sm leading-snug text-foreground">{s.title}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">Take them one at a time. There's no rush, and you can change paths whenever you like.</p>
              </div>

              <div className="mt-6 space-y-3 border-t border-border/70 pt-6 text-center">
                <Button
                  size="lg"
                  className="h-auto min-h-12 w-full gap-2 rounded-xl text-base shadow-md shadow-[#16294a]/15 sm:w-auto"
                  onClick={startPath}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Compass className="h-4 w-4" />}
                  {currentTrackId === result.trackId ? "Continue this path" : "Start this path"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {!signedIn && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    You'll sign in first, then your path is saved on your member home page.
                    Not a member yet?{" "}
                    <Link
                      to="/family-membership"
                      className="relative inline-block rounded font-semibold text-primary underline underline-offset-4 after:absolute after:inset-x-0 after:-inset-y-3 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      See membership
                    </Link>
                    .
                  </p>
                )}
                {signedIn && isMember && (
                  <p className="text-sm">
                    <Link
                      to="/family-education/tracks"
                      className="inline-flex min-h-11 items-center rounded-lg px-2 font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Or look through all eight paths
                    </Link>
                  </p>
                )}
              </div>
            </Panel>
          ) : null}
        </div>
      </div>
    </MemberPage>
  );
};

export default OnboardingQuiz;
