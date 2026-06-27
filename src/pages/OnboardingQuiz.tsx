import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Sparkles, Heart, BookOpen, Shield, Brain, Target, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";

// --- Types ---
interface QuizAnswers {
  relationship: string;
  lovedOneStatus: string;
  primaryNeed: string;
  treatmentHistory: string;
  selfState: string;
}

interface Resource {
  title: string;
  path: string;
  type: "guide" | "interactive" | "ai-tool";
  description: string;
  icon: typeof Heart;
}

// --- Resource catalog ---
const RESOURCE_CATALOG: Record<string, Resource> = {
  "crisis-chaos": { title: "When Everything Feels Like Crisis & Chaos", path: "/crisis-chaos", type: "guide", description: "Immediate grounding and clarity when you're overwhelmed.", icon: Heart },
  "emotional-regulation": { title: "Emotional Regulation for Families", path: "/emotional-regulation", type: "interactive", description: "Tools to manage the emotional rollercoaster.", icon: Heart },
  "communication-guide": { title: "Communication Guide", path: "/communication-guide", type: "guide", description: "How to talk to your loved one without pushing them away.", icon: Users },
  "ai-life-coach": { title: "AI Life Coach", path: "/ai-life-coach", type: "ai-tool", description: "Get personalized guidance anytime you need it.", icon: Sparkles },
  "understanding-addiction": { title: "Understanding Addiction", path: "/understanding-addiction", type: "guide", description: "The science behind why your loved one acts the way they do.", icon: Brain },
  "why-willpower-fails": { title: "Why Willpower Fails", path: "/why-willpower-fails", type: "guide", description: "Why they can't 'just stop' — and what actually works.", icon: Brain },
  "enabling-language-translator": { title: "Enabling Language Translator", path: "/enabling-language-translator", type: "interactive", description: "Discover if you're accidentally enabling without realizing it.", icon: Target },
  "boundaries-ultimatums": { title: "Boundaries vs. Ultimatums", path: "/boundaries-ultimatums", type: "guide", description: "Learn the crucial difference and how to set real boundaries.", icon: Shield },
  "what-changes-when-families-change": { title: "What Changes When Families Change", path: "/what-changes-when-families-change", type: "guide", description: "How YOUR changes create ripple effects in recovery.", icon: Users },
  "boundary-drift": { title: "Boundary Drift", path: "/boundary-drift", type: "guide", description: "Why boundaries erode over time and how to hold the line.", icon: Shield },
  "values-exercise": { title: "Values Exercise", path: "/values-exercise", type: "interactive", description: "Reconnect with what matters most to YOU.", icon: Heart },
  "living-well-regardless": { title: "Living Well Regardless", path: "/living-well-regardless", type: "guide", description: "Building your own life — no matter what they choose.", icon: Heart },
  "sibling-experience": { title: "The Sibling Experience", path: "/sibling-experience", type: "guide", description: "Understanding the unique pain siblings carry.", icon: Users },
  "growing-up-shadow": { title: "Growing Up in the Shadow", path: "/growing-up-shadow", type: "guide", description: "When addiction stole your childhood too.", icon: Users },
  "sibling-guilt-anger-loyalty": { title: "Sibling Guilt, Anger & Loyalty", path: "/sibling-guilt-anger-loyalty", type: "guide", description: "Navigating the complicated emotions siblings face.", icon: Heart },
  "rebuilding-sibling-relationships": { title: "Rebuilding Sibling Relationships", path: "/rebuilding-sibling-relationships", type: "guide", description: "Finding your way back to each other.", icon: Users },
  "multiple-treatment-episodes": { title: "Multiple Treatment Episodes", path: "/multiple-treatment-episodes", type: "guide", description: "When treatment hasn't worked before — what's different now.", icon: Brain },
  "treatment-red-flags": { title: "Treatment Red Flags", path: "/treatment-red-flags", type: "guide", description: "Warning signs of bad treatment programs.", icon: Shield },
  "treatment-industry-guide": { title: "Treatment Industry Guide", path: "/treatment-industry-guide", type: "guide", description: "Navigate the confusing world of treatment centers.", icon: BookOpen },
  "readiness-checklist": { title: "Readiness Checklist", path: "/readiness-checklist", type: "interactive", description: "Is your loved one actually ready for treatment?", icon: Target },
  "anger-and-boundaries": { title: "Anger & Boundaries", path: "/anger-and-boundaries", type: "guide", description: "Using anger as information, not destruction.", icon: Shield },
  "family-action-plan": { title: "Family Action Plan", path: "/family-action-plan", type: "interactive", description: "Create your concrete plan of action.", icon: Target },
  "no-negotiation": { title: "The No-Negotiation Guide", path: "/no-negotiation", type: "guide", description: "When it's time to stop negotiating with addiction.", icon: Shield },
  "grief-for-family": { title: "Grief for Family Members", path: "/grief-for-family", type: "guide", description: "Mourning the person addiction took — while they're still here.", icon: Heart },
  "fear-inventory-exercise": { title: "Fear Inventory Exercise", path: "/fear-inventory-exercise", type: "interactive", description: "Name your fears so they stop running the show.", icon: Target },
  "treatment-modalities": { title: "Treatment Modalities", path: "/treatment-modalities", type: "guide", description: "Understanding the different types of treatment available.", icon: BookOpen },
  "matching-modality": { title: "Matching Modality", path: "/matching-modality", type: "interactive", description: "Find the right treatment approach for your situation.", icon: Target },
  "treatment-questions": { title: "Treatment Questions to Ask", path: "/treatment-questions", type: "guide", description: "The questions that separate good programs from bad ones.", icon: BookOpen },
  "aftercare-checklist": { title: "Aftercare Checklist", path: "/aftercare-checklist", type: "interactive", description: "What happens AFTER treatment matters most.", icon: Target },
  "ai-boundary-builder-coach": { title: "AI Boundary Builder", path: "/ai-boundary-builder-coach", type: "ai-tool", description: "Practice setting boundaries with AI guidance.", icon: Sparkles },
  "ai-treatment-navigator": { title: "AI Treatment Navigator", path: "/ai-treatment-navigator", type: "ai-tool", description: "Get help evaluating treatment options.", icon: Sparkles },
  "ai-enabling-decision-coach": { title: "AI Enabling Decision Coach", path: "/ai-enabling-decision-coach", type: "ai-tool", description: "Get real-time help with tough enabling decisions.", icon: Sparkles },
  "scenario-exercise": { title: "Scenario Exercise", path: "/scenario-exercise", type: "interactive", description: "Practice responding to real-life addiction scenarios.", icon: Target },
};

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

// --- Path generation ---
function generatePath(answers: QuizAnswers): string[] {
  const resourceKeys = new Set<string>();

  // Crisis prioritization
  if (answers.selfState === "crisis") {
    ["crisis-chaos", "emotional-regulation", "communication-guide", "ai-life-coach"].forEach(k => resourceKeys.add(k));
  }

  // Relationship-based
  if (answers.relationship === "parent" && (answers.lovedOneStatus === "active-use" || answers.lovedOneStatus === "not-sure")) {
    ["understanding-addiction", "why-willpower-fails", "enabling-language-translator", "boundaries-ultimatums", "what-changes-when-families-change"].forEach(k => resourceKeys.add(k));
  }
  if (answers.relationship === "spouse") {
    ["communication-guide", "boundaries-ultimatums", "boundary-drift", "values-exercise", "living-well-regardless"].forEach(k => resourceKeys.add(k));
  }
  if (answers.relationship === "sibling") {
    ["sibling-experience", "growing-up-shadow", "sibling-guilt-anger-loyalty", "rebuilding-sibling-relationships"].forEach(k => resourceKeys.add(k));
  }

  // Treatment history
  if (answers.treatmentHistory === "multiple") {
    ["multiple-treatment-episodes", "treatment-red-flags", "treatment-industry-guide", "readiness-checklist"].forEach(k => resourceKeys.add(k));
  }

  // Primary need
  if (answers.primaryNeed === "boundaries") {
    ["boundaries-ultimatums", "boundary-drift", "anger-and-boundaries", "family-action-plan", "no-negotiation"].forEach(k => resourceKeys.add(k));
  }
  if (answers.primaryNeed === "self-care") {
    ["emotional-regulation", "living-well-regardless", "grief-for-family", "values-exercise", "fear-inventory-exercise"].forEach(k => resourceKeys.add(k));
  }
  if (answers.primaryNeed === "treatment") {
    ["treatment-modalities", "matching-modality", "treatment-questions", "aftercare-checklist", "treatment-red-flags"].forEach(k => resourceKeys.add(k));
  }
  if (answers.primaryNeed === "understanding") {
    ["understanding-addiction", "why-willpower-fails", "enabling-language-translator"].forEach(k => resourceKeys.add(k));
  }
  if (answers.primaryNeed === "connection") {
    ["communication-guide", "values-exercise", "living-well-regardless"].forEach(k => resourceKeys.add(k));
  }

  // Defaults if we don't have enough
  if (resourceKeys.size < 4) {
    ["understanding-addiction", "boundaries-ultimatums", "emotional-regulation", "communication-guide"].forEach(k => resourceKeys.add(k));
  }

  // Ensure at least one interactive and one AI tool
  const keys = Array.from(resourceKeys);
  const hasInteractive = keys.some(k => RESOURCE_CATALOG[k]?.type === "interactive");
  const hasAI = keys.some(k => RESOURCE_CATALOG[k]?.type === "ai-tool");

  if (!hasInteractive) resourceKeys.add("scenario-exercise");
  if (!hasAI) {
    if (answers.primaryNeed === "boundaries") resourceKeys.add("ai-boundary-builder-coach");
    else if (answers.primaryNeed === "treatment") resourceKeys.add("ai-treatment-navigator");
    else resourceKeys.add("ai-life-coach");
  }

  // Cap at 8
  return Array.from(resourceKeys).slice(0, 8);
}

// --- Component ---
const OnboardingQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0-4 = questions, 5 = results
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [results, setResults] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const totalSteps = questions.length;
  const isResults = step >= totalSteps;
  const progressPercent = isResults ? 100 : ((step) / totalSteps) * 100;

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
      // Generate results
      const path = generatePath(newAnswers as QuizAnswers);
      setResults(path);
      saveResults(newAnswers as QuizAnswers, path);
      transition(totalSteps, "forward");
    }
  };

  const goBack = () => {
    if (step > 0) transition(step - 1, "back");
  };

  const saveResults = async (quizAnswers: QuizAnswers, path: string[]) => {
    const data = { answers: quizAnswers, path, completedAt: new Date().toISOString() };
    localStorage.setItem("onboarding_quiz_results", JSON.stringify(data));
    localStorage.setItem("onboarding_quiz_completed", "true");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("education_progress").upsert({
          user_id: user.id,
          resource_name: "Onboarding Quiz",
          resource_path: "/onboarding-quiz",
          resource_type: "onboarding_quiz",
          status: "completed",
          progress_percentage: 100,
          completed_at: new Date().toISOString(),
          
        }, { onConflict: "user_id,resource_path" });
      }
    } catch (e) {
      // localStorage fallback already saved
    }
  };

  const typeIcon = (type: string) => {
    if (type === "ai-tool") return <Sparkles className="w-4 h-4 text-purple-400" />;
    if (type === "interactive") return <Target className="w-4 h-4 text-teal-400" />;
    return <BookOpen className="w-4 h-4 text-emerald-400" />;
  };

  const typeLabel = (type: string) => {
    if (type === "ai-tool") return "AI Tool";
    if (type === "interactive") return "Interactive";
    return "Guide";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <SEOHead
        title="Personalized Onboarding Quiz | SoberHelpline"
        description="Take our 2-minute quiz to get a personalized path of resources tailored to your unique situation."
      />

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              {isResults ? "Your personalized path" : `Question ${step + 1} of ${totalSteps}`}
            </span>
            {!isResults && step > 0 && (
              <button onClick={goBack} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
            )}
          </div>
          <Progress value={progressPercent} className="h-2 bg-gray-800" />
        </div>

        {/* Question or Results */}
        <div className={`transition-all duration-200 ${animating ? (direction === "forward" ? "opacity-0 translate-x-8" : "opacity-0 -translate-x-8") : "opacity-100 translate-x-0"}`}>
          {!isResults ? (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {questions[step].question}
              </h1>
              <p className="text-gray-400 mb-8">{questions[step].subtitle}</p>

              <div className="space-y-3">
                {questions[step].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${
                      answers[questions[step].id as keyof QuizAnswers] === option.value
                        ? "border-emerald-500 bg-emerald-500/10 text-white"
                        : "border-gray-700 bg-gray-800/50 text-gray-200 hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    <span className="text-base">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                  <Heart className="w-8 h-8 text-emerald-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Based on what you've shared, here's where we'd start...
                </h1>
                <p className="text-gray-400 max-w-lg mx-auto">
                  We've put together a personalized journey just for you. Take these one at a time — there's no rush.
                </p>
              </div>

              <div className="space-y-3">
                {results.map((key, i) => {
                  const resource = RESOURCE_CATALOG[key];
                  if (!resource) return null;
                  const Icon = resource.icon;
                  return (
                    <Link key={key} to={resource.path}>
                      <Card className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 hover:bg-gray-800 transition-all duration-200 mb-3">
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1 text-gray-500 font-bold text-lg w-6 text-center">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white text-sm sm:text-base">{resource.title}</h3>
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 flex-shrink-0">
                                {typeIcon(resource.type)}
                                {typeLabel(resource.type)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">{resource.description}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0 mt-2" />
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-8 text-center space-y-4">
                <Link to="/family-education">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400">
                    Explore all resources
                  </Button>
                </Link>
                <p className="text-xs text-gray-500">
                  Your results are saved. You can always retake this quiz later.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuiz;
