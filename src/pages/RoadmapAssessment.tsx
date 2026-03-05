import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, AlertTriangle, Phone, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";

interface Question {
  id: string;
  question: string;
  options: string[];
  multi?: boolean;
}

const questions: Question[] = [
  {
    id: "relationship",
    question: "What is your relationship to the person you're concerned about?",
    options: ["Son/Daughter", "Spouse/Partner", "Parent", "Sibling", "Friend", "Other"],
  },
  {
    id: "substances",
    question: "What substance(s) are they using?",
    options: ["Alcohol", "Opioids/Heroin/Fentanyl", "Methamphetamine", "Cocaine", "Prescription Drugs", "Marijuana", "Multiple Substances", "I'm Not Sure"],
    multi: true,
  },
  {
    id: "duration",
    question: "How long have you known about their substance use?",
    options: ["Less than a month", "1–6 months", "6–12 months", "1–3 years", "More than 3 years"],
  },
  {
    id: "prior_treatment",
    question: "Have they been to treatment before?",
    options: ["No, never", "Yes, once", "Yes, multiple times", "I'm not sure"],
  },
  {
    id: "current_situation",
    question: "Which of these best describes your current situation?",
    options: [
      "I think something might be wrong but I'm not sure yet",
      "I've confirmed they're using but haven't confronted them yet",
      "We've talked about it but nothing has changed",
      "I've been trying to help but things keep getting worse",
      "Things are in crisis right now — I need help immediately",
      "They're currently in treatment or recently completed treatment",
      "They've been sober for a while but I'm worried about relapse",
    ],
  },
  {
    id: "safety_concerns",
    question: "Are there any immediate safety concerns?",
    options: [
      "No",
      "Yes — they're a danger to themselves",
      "Yes — there are children at risk",
      "Yes — there's domestic violence",
      "I'm not sure",
    ],
  },
  {
    id: "desired_help",
    question: "What would help you most right now?",
    options: [
      "Understanding what I'm dealing with",
      "Learning what to say (and not say)",
      "Setting boundaries without losing them",
      "Finding professional help",
      "All of the above",
    ],
  },
];

const RoadmapAssessment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showCrisis, setShowCrisis] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  const totalSteps = questions.length;
  const currentQ = questions[step];
  const progress = ((step + 1) / totalSteps) * 100;

  const hasSafetyConcern = () => {
    const val = answers.safety_concerns;
    return val && val !== "No" && val !== "I'm not sure";
  };

  const selectOption = (option: string) => {
    if (currentQ.multi) {
      const current = (answers[currentQ.id] as string[]) || [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      setAnswers({ ...answers, [currentQ.id]: updated });
    } else {
      setAnswers({ ...answers, [currentQ.id]: option });
      // Auto-advance for single select after brief delay
      setTimeout(() => handleNext(option), 300);
    }
  };

  const handleNext = async (directAnswer?: string) => {
    const currentAnswer = directAnswer || answers[currentQ.id];
    if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) return;

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Assessment complete — save to DB
      await saveAssessment();
    }
  };

  const getStageAssigned = () => {
    const situation = answers.current_situation as string;
    if (situation === "I think something might be wrong but I'm not sure yet") {
      return "suspicion";
    }
    if (situation === "Things are in crisis right now — I need help immediately") {
      return "crisis";
    }
    return "confirmation";
  };

  const getRedirectPath = () => {
    const stage = getStageAssigned();
    if (stage === "suspicion") return "/roadmap/suspicion";
    if (stage === "crisis") return "/roadmap/crisis";
    return "/roadmap/confirmation";
  };

  const saveAssessment = async () => {
    setSaving(true);
    try {
      const stage = getStageAssigned();
      const newAssessmentId = crypto.randomUUID();

      const { error } = await supabase
        .from("roadmap_assessments")
        .insert({
          id: newAssessmentId,
          relationship: answers.relationship as string,
          substances: answers.substances as string[],
          duration: answers.duration as string,
          prior_treatment: answers.prior_treatment as string,
          current_situation: answers.current_situation as string,
          safety_concerns: answers.safety_concerns as string,
          desired_help: answers.desired_help as string,
          stage_assigned: stage,
        });

      if (error) throw error;
      setAssessmentId(newAssessmentId);

      if (hasSafetyConcern()) {
        setShowCrisis(true);
      } else {
        setShowEmailCapture(true);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };


  const handleEmailSubmit = async () => {
    if (!email.trim()) return;
    setSaving(true);
    const redirectPath = getRedirectPath();
    try {
      await supabase.from("roadmap_users").insert({
        email: email.trim(),
        assessment_id: assessmentId,
        current_stage: getStageAssigned(),
      });
      navigate(redirectPath);
    } catch {
      navigate(redirectPath);
    } finally {
      setSaving(false);
    }
  };

  const isSelected = (option: string) => {
    const val = answers[currentQ?.id];
    if (Array.isArray(val)) return val.includes(option);
    return val === option;
  };

  // Crisis interstitial
  if (showCrisis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <SEOHead title="Safety Resources | Recovery Roadmap" description="" />
        <Card className="max-w-lg w-full border-destructive/30">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Your Safety Comes First</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <Shield className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">If anyone is in immediate danger, call 911</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">National Crisis Hotline: 988</p>
                  <p className="text-sm text-muted-foreground">Call or text, 24/7</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Professional Intervention Help</p>
                  <a href="tel:5412419151" className="text-primary hover:underline font-medium">(541) 241-9151</a>
                </div>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                setShowCrisis(false);
                setShowEmailCapture(true);
              }}
            >
              Continue to Your Roadmap
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Email capture
  if (showEmailCapture) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <SEOHead title="Save Your Progress | Recovery Roadmap" description="" />
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Your Roadmap is Ready</h2>
            <p className="text-muted-foreground">
              Enter your email to save your progress and receive daily guidance tailored to your stage.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-center text-lg py-6"
                onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
              />
              <Button
                size="lg"
                className="w-full"
                onClick={handleEmailSubmit}
                disabled={saving || !email.trim()}
              >
                {saving ? "Saving..." : "Save & Continue"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <button
              onClick={() => navigate(getRedirectPath())}
              className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Continue without saving
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment questions
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="Recovery Roadmap Assessment | Sober Helpline" description="Take a 5-minute assessment to get your personalized family recovery roadmap." />

      {/* Progress */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {step + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full space-y-8">
          <div className="space-y-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {currentQ.question}
            </h2>
            {currentQ.multi && (
              <p className="text-sm text-muted-foreground">Select all that apply</p>
            )}
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <button
                key={option}
                onClick={() => selectOption(option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected(option)
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border/50 bg-card hover:border-primary/30 text-foreground"
                }`}
              >
                <span className="text-base">{option}</span>
              </button>
            ))}
          </div>

          {currentQ.multi && (
            <Button
              size="lg"
              className="w-full"
              onClick={() => handleNext()}
              disabled={!answers[currentQ.id] || (Array.isArray(answers[currentQ.id]) && (answers[currentQ.id] as string[]).length === 0)}
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}

          {step === totalSteps - 1 && !currentQ.multi && saving && (
            <div className="text-center text-muted-foreground">Saving your assessment...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapAssessment;
