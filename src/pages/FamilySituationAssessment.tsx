import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Heart, Shield, AlertTriangle, CheckCircle2, Phone, Calendar, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";

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
    headline = "This is a crisis — you need real help right now.";
    summary = `What you're describing isn't something that gets better by waiting. A family in crisis needs a professional who can help you create a plan, hold it, and support you through it. One conversation with an interventionist can change the trajectory of what happens next.`;
    primaryCTA = "coaching";
  } else if (urgency === "high") {
    headline = "The situation is serious — and you're more ready than you think.";
    summary = `Based on what you've shared, your family is caught in patterns that tend to get worse without a clear strategy. The good news: families who take action early see dramatically better outcomes. The right next step is to talk with someone who can help you map a real plan.`;
    primaryCTA = "coaching";
  } else if (urgency === "moderate") {
    headline = "You're at a turning point — this is the right time to act.";
    summary = `You've likely tried things that haven't worked. That's not your fault — most of what families try is well-intentioned but ineffective. The “The Family Squares” is a great place to start: ask real questions, hear from other families, and get guidance from a certified interventionist at no cost.`;
    primaryCTA = "zoom";
  } else {
    headline = "You're in the right place — support makes all the difference.";
    summary = `Being proactive matters. Families who learn early how to respond — without enabling, without confrontation — see better outcomes than those who wait for a rock bottom. Start with the Monday Zoom and explore our free resources.`;
    primaryCTA = "resources";
  }

  return { enablingScore, urgency, headline, summary, primaryCTA, tags };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FamilySituationAssessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    relationship: "",
    substance: "",
    duration: "",
    treatment: "",
    enabling: [],
    situation: "",
  });
  const [showCapture, setShowCapture] = useState(false);
  const [captureData, setCaptureData] = useState({ name: "", email: "", phone: "" });
  const [captureErrors, setCaptureErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      // All questions done → show email capture gate
      setShowCapture(true);
    }
  }

  function handleBack() {
    if (showCapture) { setShowCapture(false); return; }
    if (step > 0) setStep((s) => s - 1);
  }

  async function handleCapture(e: React.FormEvent) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!captureData.name.trim()) errors.name = "Name is required";
    if (!captureData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(captureData.email)) errors.email = "Valid email required";
    if (Object.keys(errors).length) { setCaptureErrors(errors); return; }

    setIsSubmitting(true);
    const scored = scoreAnswers(answers);

    try {
      // Save to Supabase (enabling_behavior_audits table)
      await supabase.from("enabling_behavior_audits").insert({
        name: captureData.name.trim(),
        email: captureData.email.trim(),
        phone: captureData.phone.trim() || null,
        relationship: answers.relationship,
        substance: answers.substance,
        duration: answers.duration,
        treatment_history: answers.treatment,
        enabling_behaviors: answers.enabling,
        situation: answers.situation,
        enabling_score: scored.enablingScore,
        urgency: scored.urgency,
        tags: scored.tags,
      } as any);
    } catch (err) {
      // Non-blocking — still show results even if DB write fails
      console.error("Assessment save error:", err);
    }

    // Add to Mailchimp
    try {
      const nameParts = captureData.name.trim().split(" ");
      await supabase.functions.invoke("add-to-mailchimp", {
        body: {
          email: captureData.email.trim(),
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          tags: scored.tags,
        },
      });
    } catch (err) {
      console.error("Mailchimp error:", err);
    }

    setResult(scored);
    setIsSubmitting(false);
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

            <h1 className="text-3xl font-bold text-logo-green mb-4 leading-tight">{result.headline}</h1>
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

            {/* Primary CTA */}
            <div className="space-y-4 mb-10">
              {result.primaryCTA === "coaching" && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-logo-green mb-2">Recommended Order: Start with the Monday Zoom, then move into private help if needed</h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      Based on what you shared, private coaching may be useful, but the clearest first step is still the Monday Zoom. If you want more structure after that, membership comes next. Coaching is there when you need one-on-one guidance for your specific situation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to="/monday-zoom-registration">
                        <Button size="lg" className="gap-2 w-full sm:w-auto">
                          <Calendar className="h-4 w-4" />
                          Start with Monday Zoom
                        </Button>
                      </Link>
                      <Link to="/family-membership">
                        <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                          Membership Next
                        </Button>
                      </Link>
                      <Link to="/family-coaching">
                        <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                          <Phone className="h-4 w-4" />
                          Explore Coaching
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.primaryCTA === "zoom" && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-logo-green mb-2">Recommended: Join the Free Monday Zoom</h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      Every Monday at 7PM PST. Ask real questions, hear from other families, get guidance from a certified
                      interventionist. Free — no commitment required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to="/monday-zoom-registration">
                        <Button size="lg" className="gap-2 w-full sm:w-auto">
                          <Calendar className="h-4 w-4" />
                          Register for Monday Zoom
                        </Button>
                      </Link>
                      <Link to="/family-coaching">
                        <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                          <Phone className="h-4 w-4" />
                          Get Coaching Instead
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.primaryCTA === "resources" && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-logo-green mb-2">Recommended: Start with the Monday Zoom & Resources</h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      You're thinking ahead — that's powerful. The Monday Zoom and our free education library are the right
                      starting point. Come with questions. Leave with a plan.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to="/monday-zoom-registration">
                        <Button size="lg" className="gap-2 w-full sm:w-auto">
                          <Calendar className="h-4 w-4" />
                          Join Free Monday Zoom
                        </Button>
                      </Link>
                      <Link to="/family-education">
                        <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                          Browse Resources
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Secondary options */}
            <div className="grid sm:grid-cols-3 gap-3 mb-10">
              {[
                { label: "Enabling Quiz", desc: "See which behaviors to stop first", to: "/enabling-language-translator" },
                { label: "Addiction Assessment", desc: "Understand severity level", to: "/addiction-assessment" },
                { label: "Treatment Finder", desc: "Vetted providers near you", to: "/recovery-resources" },
              ].map((item) => (
                <Link key={item.to} to={item.to}>
                  <Card className="hover:border-primary/50 hover:shadow-sm transition-all h-full">
                    <CardContent className="p-4">
                      <p className="font-medium text-logo-green text-sm mb-1">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                      <ChevronRight className="h-4 w-4 text-primary mt-2" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Your answers are confidential and will never be shared. If you're in immediate danger, call 911.
              For substance use crisis support, call SAMHSA at 1-800-662-4357 (24/7, free, confidential).
            </p>
          </div>
        </div>
      </>
    );
  }

  // ─── Email Capture Gate ───────────────────────────────────────────────────────

  if (showCapture) {
    return (
      <>
        <SEOHead
          title="Family Situation Assessment | Sober Helpline"
          description="Free family addiction assessment — personalized guidance for your next step."
          jsonLd={assessmentSchema}
        />
        <div className="min-h-screen bg-background flex items-center">
          <div className="container max-w-lg mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-logo-green mb-2">Your assessment is ready.</h1>
              <p className="text-muted-foreground">
                Enter your name and email to see your personalized results and recommended next step.
                We'll also send a copy to your inbox.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleCapture} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={captureData.name}
                      onChange={(e) => setCaptureData((p) => ({ ...p, name: e.target.value }))}
                      className={captureErrors.name ? "border-destructive" : ""}
                    />
                    {captureErrors.name && <p className="text-xs text-destructive">{captureErrors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={captureData.email}
                      onChange={(e) => setCaptureData((p) => ({ ...p, email: e.target.value }))}
                      className={captureErrors.email ? "border-destructive" : ""}
                    />
                    {captureErrors.email && <p className="text-xs text-destructive">{captureErrors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone <span className="text-muted-foreground font-normal text-xs">(Optional — for follow-up only)</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={captureData.phone}
                      onChange={(e) => setCaptureData((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Getting your results...</>
                    ) : (
                      <>See My Personalized Results <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Your information is private. We do not sell data or share with treatment centers.
                  </p>
                </form>
              </CardContent>
            </Card>

            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mt-6 mx-auto"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Go back
            </button>
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
                <h1 className="text-2xl font-bold text-logo-green mb-2">{currentStep.question}</h1>
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
                          ? "border-primary bg-primary/5 text-logo-green font-medium"
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
