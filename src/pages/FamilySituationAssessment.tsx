import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Heart, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SEOHead from "@/components/SEOHead";
import FreeFamilyNextSteps from "@/components/FreeFamilyNextSteps";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Answers {
  relationship: string;
  substance: string;
  duration: string;
  treatment: string;
  enabling: string[];
  situation: string;
}

// ─── Questions ────────────────────────────────────────────────────────────────

const steps = [
  {
    id: "relationship",
    question: "Who are you worried about?",
    subtitle: "Select the relationship that best describes your situation.",
    type: "single",
    options: [
      { value: "spouse", label: "My spouse or partner" },
      { value: "child", label: "My child (adult or teen)" },
      { value: "parent", label: "My parent" },
      { value: "sibling", label: "My sibling" },
      { value: "friend", label: "A close friend" },
      { value: "other", label: "Someone else" },
    ],
  },
  {
    id: "substance",
    question: "What substance or behavior is involved?",
    subtitle: "Select all that apply — you can choose more than one.",
    type: "single",
    options: [
      { value: "alcohol", label: "Alcohol" },
      { value: "opioids", label: "Opioids / Prescription Pills / Heroin" },
      { value: "meth", label: "Meth / Stimulants" },
      { value: "cocaine", label: "Cocaine / Crack" },
      { value: "fentanyl", label: "Fentanyl / Unknown substances" },
      { value: "cannabis", label: "Cannabis" },
      { value: "kratom", label: "Kratom" },
      { value: "multiple", label: "Multiple substances" },
    ],
  },
  {
    id: "duration",
    question: "How long has this been going on?",
    subtitle: "Be honest — longer duration often means deeper patterns.",
    type: "single",
    options: [
      { value: "recent", label: "Less than 6 months" },
      { value: "1year", label: "6 months – 1 year" },
      { value: "few", label: "1–3 years" },
      { value: "long", label: "3–10 years" },
      { value: "decade", label: "More than 10 years" },
    ],
  },
  {
    id: "treatment",
    question: "Has your loved one tried treatment before?",
    subtitle: "This helps us understand where you are in the journey.",
    type: "single",
    options: [
      { value: "none", label: "No — they've never been to treatment" },
      { value: "refused", label: "No — they've refused to go" },
      { value: "once", label: "Yes — once, and it didn't stick" },
      { value: "multiple", label: "Yes — multiple times" },
      { value: "current", label: "They're in treatment right now" },
    ],
  },
  {
    id: "enabling",
    question: "Which of these have you done in the past 6 months?",
    subtitle: "Be honest — these are the behaviors that accidentally fuel addiction. Select all that apply.",
    type: "multi",
    options: [
      { value: "money", label: "Given them money, knowing it might go to drugs or alcohol" },
      { value: "bills", label: "Paid their bills, rent, or debts to keep them afloat" },
      { value: "excuses", label: "Made excuses or lied to others to cover for them" },
      { value: "bailed", label: "Bailed them out of legal, financial, or personal trouble" },
      { value: "threats", label: "Made threats or ultimatums you didn't follow through on" },
      { value: "arguing", label: "Argued or begged repeatedly with no change" },
      { value: "nothing", label: "None of the above" },
    ],
  },
  {
    id: "situation",
    question: "How would you describe your situation right now?",
    subtitle: "Pick the one that feels most true.",
    type: "single",
    options: [
      { value: "crisis", label: "We're in crisis — this is an emergency" },
      { value: "urgent", label: "It's getting worse and I need to act soon" },
      { value: "stuck", label: "I've tried everything and nothing changes" },
      { value: "early", label: "I'm starting to realize there's a real problem" },
      { value: "support", label: "I just need support — I know what to do" },
    ],
  },
];

// ─── Scoring & Recommendations ────────────────────────────────────────────────

function scoreAnswers(answers: Answers): {
  enablingScore: number;
  urgency: "crisis" | "high" | "moderate" | "low";
  headline: string;
  summary: string;
  primaryCTA: "coaching" | "zoom" | "resources";
  tags: string[];
} {
  const enabling = answers.enabling.filter((e) => e !== "nothing");
  const enablingScore = enabling.length;

  let urgency: "crisis" | "high" | "moderate" | "low" = "low";
  if (answers.situation === "crisis") urgency = "crisis";
  else if (answers.situation === "urgent" || enablingScore >= 4) urgency = "high";
  else if (answers.situation === "stuck" || enablingScore >= 2 || answers.treatment === "multiple") urgency = "moderate";

  const tags: string[] = [];
  tags.push(`relationship:${answers.relationship}`);
  tags.push(`substance:${answers.substance}`);
  tags.push(`duration:${answers.duration}`);
  tags.push(`treatment:${answers.treatment}`);
  tags.push(`urgency:${urgency}`);
  if (enablingScore > 0) tags.push(`enabling:${enablingScore}`);

  let headline = "";
  let summary = "";
  let primaryCTA: "coaching" | "zoom" | "resources" = "zoom";

  if (urgency === "crisis") {
    headline = "This is a high-pressure night — start with safety, then a human.";
    summary = `What you described is not something to sit with alone until it blows over. Sober Helpline is family support, not emergency medical care. If anyone is in immediate danger, call 911. If this is a mental-health crisis, call or text 988. Then use the free tonight plan, Family Squares, or a phone call — a private consult is a second door if the risk is still rising.`;
    primaryCTA = "coaching";
  } else if (urgency === "high") {
    headline = "The pattern is serious — and you already named it.";
    summary = `Based on what you shared, the family is caught in enabling and urgency that tend to get worse without a clearer line. Start with what you can do tonight and the free Monday room. Private help is available if you need a plan you cannot wait until Monday to make.`;
    primaryCTA = "coaching";
  } else if (urgency === "moderate") {
    headline = "You're at a turning point — this is the right time to get steadier.";
    summary = `You've likely tried things that haven't worked. That's not your fault — most of what families try is well-intentioned but ineffective. Family Squares on Monday at 7 PM Pacific is a free place to ask the question. Tonight, use the short plan and the phone if you need a human.`;
    primaryCTA = "zoom";
  } else {
    headline = "You're in the right place — support makes the next night easier.";
    summary = `Being proactive matters. Start with the free tonight plan and Family Squares. Learn how to respond without enabling and without turning every conversation into a confrontation.`;
    primaryCTA = "resources";
  }

  return { enablingScore, urgency, headline, summary, primaryCTA, tags };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FamilySituationAssessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    relationship: "",
    substance: "",
    duration: "",
    treatment: "",
    enabling: [],
    situation: "",
  });
  const [result, setResult] = useState<ReturnType<typeof scoreAnswers> | null>(null);

  const currentStep = steps[step];
  const totalSteps = steps.length;
  const progress = ((step) / totalSteps) * 100;

  const currentAnswer = answers[currentStep.id as keyof Answers];

  function handleSingleSelect(value: string) {
    setAnswers((prev) => ({ ...prev, [currentStep.id]: value }));
  }

  function handleMultiSelect(value: string) {
    setAnswers((prev) => {
      const current = prev.enabling;
      if (value === "nothing") return { ...prev, enabling: ["nothing"] };
      const without = current.filter((v) => v !== "nothing");
      if (without.includes(value)) return { ...prev, enabling: without.filter((v) => v !== value) };
      return { ...prev, enabling: [...without, value] };
    });
  }

  function canAdvance() {
    if (currentStep.type === "multi") return answers.enabling.length > 0;
    return !!answers[currentStep.id as keyof Answers];
  }

  function handleNext() {
    if (!canAdvance()) return;
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      setResult(scoreAnswers(answers));
    }
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  const assessmentSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Family Situation Assessment | Sober Helpline",
    url: "https://soberhelpline.com/family-situation-assessment",
    applicationCategory: "HealthApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free family addiction assessment. Understand your situation, identify enabling patterns, and get a personalized recommendation for your next step.",
  };

  // ─── Results Screen ──────────────────────────────────────────────────────────

  if (result) {
    const urgencyColors: Record<string, string> = {
      crisis: "bg-red-50 border-red-200 text-red-800",
      high: "bg-orange-50 border-orange-200 text-orange-800",
      moderate: "bg-amber-50 border-amber-200 text-amber-800",
      low: "bg-green-50 border-green-200 text-green-800",
    };
    const urgencyLabels: Record<string, string> = {
      crisis: "Crisis — Act Now",
      high: "High Priority",
      moderate: "Take Action",
      low: "Proactive",
    };

    return (
      <>
        <SEOHead
          title="Your Family Assessment Results | Sober Helpline"
          description="Personalized guidance based on your family's situation."
          jsonLd={assessmentSchema}
        />
        <div className="min-h-screen bg-background">
          <div className="container max-w-2xl mx-auto px-4 py-12">

            {/* Urgency Badge */}
            <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm font-semibold mb-6 ${urgencyColors[result.urgency]}`}>
              <AlertTriangle className="h-4 w-4" />
              {urgencyLabels[result.urgency]}
            </div>

            <h1 className="text-3xl font-bold text-logo-blue mb-4 leading-tight">{result.headline}</h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{result.summary}</p>

            {/* Enabling Score */}
            {result.enablingScore > 0 && (
              <Card className="mb-8 border-amber-200 bg-amber-50">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800 mb-1">
                        {result.enablingScore === 1 && "You identified 1 enabling behavior"}
                        {result.enablingScore === 2 && "You identified 2 enabling behaviors"}
                        {result.enablingScore >= 3 && `You identified ${result.enablingScore} enabling behaviors`}
                      </p>
                      <p className="text-sm text-amber-700">
                        Enabling behaviors aren't a sign of weakness — they come from love. But they remove
                        the natural consequences that motivate change. Learning to stop enabling is one of the
                        most powerful things a family can do.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mb-10 border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <h2 className="mb-2 text-xl font-bold text-logo-blue">Free next steps</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Your result stays on this page. No email is required. Start with tonight, Family Squares, or a call.
                </p>
                <FreeFamilyNextSteps
                  source="family_situation_assessment_result"
                  showPaidSecondary={result.primaryCTA === "coaching"}
                />
              </CardContent>
            </Card>

            <div className="mb-10 grid gap-3 sm:grid-cols-2">
              <Link to="/enabling-self-assessment">
                <Card className="h-full transition-all hover:border-primary/50 hover:shadow-sm">
                  <CardContent className="p-4">
                    <p className="mb-1 text-sm font-medium text-logo-blue">Enabling Self-Assessment</p>
                    <p className="text-xs text-muted-foreground">A longer look at the pattern, still free, still no email gate.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/addiction-assessment">
                <Card className="h-full transition-all hover:border-primary/50 hover:shadow-sm">
                  <CardContent className="p-4">
                    <p className="mb-1 text-sm font-medium text-logo-blue">Addiction Assessment</p>
                    <p className="text-xs text-muted-foreground">A free screening of warning signs families often notice.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Your answers stay on this page. If someone is in immediate danger, call{" "}
              <a href="tel:911" className="font-semibold underline">911</a>. If you are in a mental-health crisis, call or text{" "}
              <a href="tel:988" className="font-semibold underline">988</a>. Sober Helpline is family support, not emergency medical care.
            </p>
          </div>
        </div>
      </>
    );
  }

  // ─── Question Steps ────────────────────────────────────────────────────────────

  return (
    <>
      <SEOHead
        title="Free Family Situation Assessment | Sober Helpline"
        description="Answer 6 questions and get a personalized recommendation for your family's next step. Identify enabling patterns, understand the situation, and find the right support."
        jsonLd={assessmentSchema}
      />

      <div className="min-h-screen bg-background flex items-center">
        <div className="container max-w-2xl mx-auto px-4 py-12">

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Question {step + 1} of {totalSteps}</span>
              <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="text-xs text-primary font-medium uppercase tracking-wide">Free Assessment</span>
                </div>
                <h1 className="text-2xl font-bold text-logo-blue mb-2">{currentStep.question}</h1>
                <p className="text-muted-foreground text-sm">{currentStep.subtitle}</p>
              </div>

              <div className="space-y-3">
                {currentStep.options.map((opt) => {
                  const isSelected =
                    currentStep.type === "multi"
                      ? answers.enabling.includes(opt.value)
                      : answers[currentStep.id as keyof Answers] === opt.value;

                  return (
                    <button
                      key={opt.value}
                      onClick={() =>
                        currentStep.type === "multi"
                          ? handleMultiSelect(opt.value)
                          : handleSingleSelect(opt.value)
                      }
                      className={`w-full text-left px-4 py-3.5 rounded-lg border-2 transition-all flex items-center gap-3
                        ${isSelected
                          ? "border-primary bg-primary/5 text-logo-blue font-medium"
                          : "border-border hover:border-primary/40 text-foreground"
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-${currentStep.type === "multi" ? "sm" : "full"} border-2 flex items-center justify-center flex-shrink-0
                        ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <span className="text-sm">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {currentStep.type === "multi" && (
                <p className="text-xs text-muted-foreground mt-3">
                  Select all that apply — honesty here is the first step toward change.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canAdvance()}
              size="lg"
              className="gap-2"
            >
              {step === totalSteps - 1 ? "See My Results" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Takes about 2 minutes · Free · Completely confidential
          </p>

        </div>
      </div>
    </>
  );
}
