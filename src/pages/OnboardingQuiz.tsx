import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Compass, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Find Your Starting Path | Sober Helpline"
        description="Answer five short questions and we'll suggest one learning path that fits what your family is facing right now."
      />

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {isResults ? "Your suggested path" : `Question ${step + 1} of ${totalSteps}`}
            </span>
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
            )}
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className={`transition-all duration-200 ${animating ? (direction === "forward" ? "opacity-0 translate-x-8" : "opacity-0 -translate-x-8") : "opacity-100 translate-x-0"}`}>
          {!isResults ? (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{questions[step].question}</h1>
              <p className="text-muted-foreground mb-8">{questions[step].subtitle}</p>

              <div className="space-y-3">
                {questions[step].options.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors duration-150 ${
                      answers[questions[step].id as keyof QuizAnswers] === option.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-base">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : track && result ? (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Based on what you shared, we'd start here:</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{track.title}</h1>
              </div>

              <Card className="mb-6">
                <CardContent className="p-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Why this path</p>
                    <p className="text-sm text-foreground leading-relaxed">{result.why}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      The {track.steps.length} steps
                    </p>
                    <ol className="space-y-1.5">
                      {track.steps.map((s, i) => (
                        <li key={s.path} className="flex gap-3 text-sm">
                          <span className="w-5 shrink-0 text-right font-medium text-muted-foreground tabular-nums">{i + 1}.</span>
                          <span className="text-foreground">{s.title}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <p className="text-xs text-muted-foreground">Take them one at a time. There's no rush, and you can change paths whenever you like.</p>
                </CardContent>
              </Card>

              <div className="space-y-3 text-center">
                <Button size="lg" className="w-full sm:w-auto gap-2" onClick={startPath} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Compass className="h-4 w-4" />}
                  {currentTrackId === result.trackId ? "Continue this path" : "Start this path"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {!signedIn && (
                  <p className="text-xs text-muted-foreground">
                    You'll sign in first, then your path is saved on your member home page.
                    Not a member yet? <Link to="/family-membership" className="text-primary hover:underline">See membership</Link>.
                  </p>
                )}
                {signedIn && isMember && (
                  <p className="text-sm">
                    <Link to="/family-education/tracks" className="text-primary hover:underline">
                      Or look through all eight paths
                    </Link>
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuiz;
