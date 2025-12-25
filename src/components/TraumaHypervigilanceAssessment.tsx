import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Brain, Heart, Shield, Moon, Users, RotateCcw, CheckCircle, Info } from "lucide-react";

interface Question {
  id: string;
  text: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  questions: Question[];
}

const sections: Section[] = [
  {
    id: "hypervigilance",
    title: "Hypervigilance & Alertness",
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "text-amber-600 dark:text-amber-400",
    questions: [
      { id: "h1", text: "I feel constantly on guard, even when things seem calm." },
      { id: "h2", text: "I scan for signs something is wrong (tone, behavior, silence)." },
      { id: "h3", text: "I struggle to relax because 'something could happen.'" },
      { id: "h4", text: "Sudden changes in plans or communication spike my anxiety." },
      { id: "h5", text: "I feel responsible for noticing problems before they escalate." },
    ],
  },
  {
    id: "control",
    title: "Control & Over-Functioning",
    icon: <Shield className="h-5 w-5" />,
    color: "text-blue-600 dark:text-blue-400",
    questions: [
      { id: "c1", text: "I feel compelled to manage situations to prevent fallout." },
      { id: "c2", text: "I take on responsibilities others should handle themselves." },
      { id: "c3", text: "Letting go of control feels unsafe." },
      { id: "c4", text: "I step in quickly to fix problems—even when it costs me." },
      { id: "c5", text: "I feel anxious when I don't know what's happening." },
    ],
  },
  {
    id: "emotional",
    title: "Emotional Reactivity & Exhaustion",
    icon: <Heart className="h-5 w-5" />,
    color: "text-rose-600 dark:text-rose-400",
    questions: [
      { id: "e1", text: "I feel emotionally exhausted most of the time." },
      { id: "e2", text: "Small stressors feel overwhelming." },
      { id: "e3", text: "I alternate between numbness and emotional overload." },
      { id: "e4", text: "I feel irritable, impatient, or easily triggered." },
      { id: "e5", text: "I crash emotionally after periods of calm or crisis." },
    ],
  },
  {
    id: "body",
    title: "Sleep, Body, & Nervous System",
    icon: <Moon className="h-5 w-5" />,
    color: "text-violet-600 dark:text-violet-400",
    questions: [
      { id: "b1", text: "I have trouble falling or staying asleep." },
      { id: "b2", text: "My body feels tense even when I'm resting." },
      { id: "b3", text: "I feel fatigued but 'wired.'" },
      { id: "b4", text: "I ignore my body's needs until I hit a wall." },
      { id: "b5", text: "I feel disconnected from my body or emotions." },
    ],
  },
  {
    id: "relationships",
    title: "Relationship Impact",
    icon: <Users className="h-5 w-5" />,
    color: "text-teal-600 dark:text-teal-400",
    questions: [
      { id: "r1", text: "I struggle to trust reassurance or stability." },
      { id: "r2", text: "I feel responsible for other people's emotions or outcomes." },
      { id: "r3", text: "I avoid sharing how overwhelmed I am." },
      { id: "r4", text: "I feel guilty resting or enjoying myself." },
      { id: "r5", text: "I feel alone in carrying the emotional weight." },
    ],
  },
];

const scoreLabels = ["Not at all", "Rarely", "Sometimes", "Often", "Almost always"];

const reflectionQuestions = [
  "Where did these patterns help me survive?",
  "Where are they costing me now?",
  "What feels hardest to let go of—control, vigilance, or responsibility?",
  "What would it feel like to not be on duty all the time?",
  "What support do I need that I've been minimizing?",
];

interface ScoreInterpretation {
  range: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const getScoreInterpretation = (score: number): ScoreInterpretation => {
  if (score <= 25) {
    return {
      range: "0–25",
      title: "Stressed but Flexible",
      description: "Your system may be stressed but still maintains flexibility and resilience. Continue prioritizing self-care and boundaries.",
      color: "text-emerald-700 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    };
  } else if (score <= 50) {
    return {
      range: "26–50",
      title: "Chronic Stress & Early Trauma Response",
      description: "Signs of chronic stress and early trauma response are present. Your nervous system is working hard to keep you safe. Consider adding more support and recovery practices.",
      color: "text-amber-700 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    };
  } else if (score <= 75) {
    return {
      range: "51–75",
      title: "Significant Hypervigilance",
      description: "Significant hypervigilance and emotional load are affecting your daily life. Your body and mind are carrying a heavy burden. Professional support and intentional rest are important.",
      color: "text-orange-700 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
    };
  } else {
    return {
      range: "76–100",
      title: "Survival Mode",
      description: "Your nervous system is likely in survival mode. This level of sustained stress requires compassionate attention and support. You have been carrying too much for too long.",
      color: "text-red-700 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    };
  }
};

export default function TraumaHypervigilanceAssessment() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reflections, setReflections] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const allQuestions = sections.flatMap((s) => s.questions);
  const totalQuestions = allQuestions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = totalQuestions * 4;

  const getSectionScore = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return 0;
    return section.questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleReset = () => {
    setAnswers({});
    setReflections({});
    setShowResults(false);
    setCurrentSection(0);
  };

  const isComplete = answeredQuestions === totalQuestions;

  return (
    <Accordion type="single" collapsible className="mb-10">
      <AccordionItem value="trauma-assessment" className="border-2 border-purple-500 rounded-lg bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/20 dark:to-transparent ring-2 ring-purple-500/30">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-logo-green">Family Trauma & Hypervigilance Self-Assessment</h3>
              <p className="text-sm text-muted-foreground font-normal">Understanding How Addiction Impacts Your Nervous System</p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          {/* Introduction */}
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-purple-600" />
              Why This Assessment Matters
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Families living with addiction often say: <em>"I'm always on edge," "I can't relax," "I'm waiting for the next crisis," "I don't trust calm anymore."</em>
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              <strong>These are not personality flaws. They are trauma responses.</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Hypervigilance develops when your nervous system learns: <em>"Something bad could happen at any moment—and it's my job to prevent it."</em>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress: {answeredQuestions} of {totalQuestions} questions</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {!showResults ? (
            <>
              {/* Section Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {sections.map((section, index) => {
                  const sectionAnswered = section.questions.filter((q) => answers[q.id] !== undefined).length;
                  const isComplete = sectionAnswered === section.questions.length;
                  return (
                    <Button
                      key={section.id}
                      variant={currentSection === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentSection(index)}
                      className={`gap-2 ${isComplete ? "border-emerald-500" : ""}`}
                    >
                      {isComplete && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                      <span className="hidden sm:inline">{section.title}</span>
                      <span className="sm:hidden">Section {index + 1}</span>
                      <span className="text-xs opacity-70">({sectionAnswered}/5)</span>
                    </Button>
                  );
                })}
              </div>

              {/* Current Section Questions */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${sections[currentSection].color}`}>
                    {sections[currentSection].icon}
                    {sections[currentSection].title}
                  </CardTitle>
                  <CardDescription>
                    Rate each statement based on your experience over the past 3–6 months.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {sections[currentSection].questions.map((question, qIndex) => (
                    <div key={question.id} className="space-y-3">
                      <p className="text-sm font-medium text-foreground">
                        {qIndex + 1}. {question.text}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {scoreLabels.map((label, value) => (
                          <Button
                            key={value}
                            variant={answers[question.id] === value ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleAnswer(question.id, value)}
                            className={`text-xs ${answers[question.id] === value ? "" : "hover:bg-muted"}`}
                          >
                            <span className="font-bold mr-1">{value}</span>
                            <span className="hidden sm:inline">- {label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSection((prev) => Math.max(0, prev - 1))}
                  disabled={currentSection === 0}
                >
                  Previous Section
                </Button>
                
                {currentSection < sections.length - 1 ? (
                  <Button onClick={() => setCurrentSection((prev) => prev + 1)}>
                    Next Section
                  </Button>
                ) : (
                  <Button onClick={() => setShowResults(true)} disabled={!isComplete}>
                    {isComplete ? "View Results" : `Answer all questions (${answeredQuestions}/${totalQuestions})`}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="space-y-6">
                {/* Total Score */}
                <Card className={`border-2 ${getScoreInterpretation(totalScore).bgColor}`}>
                  <CardHeader>
                    <CardTitle className={`text-center ${getScoreInterpretation(totalScore).color}`}>
                      Your Total Score: {totalScore} / {maxScore}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className={`text-lg font-semibold ${getScoreInterpretation(totalScore).color}`}>
                        {getScoreInterpretation(totalScore).title}
                      </p>
                      <p className="text-muted-foreground mt-2">
                        {getScoreInterpretation(totalScore).description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Section Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-logo-green">Section Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sections.map((section) => {
                      const sectionScore = getSectionScore(section.id);
                      const maxSectionScore = section.questions.length * 4;
                      const percentage = (sectionScore / maxSectionScore) * 100;
                      return (
                        <div key={section.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`flex items-center gap-2 text-sm font-medium ${section.color}`}>
                              {section.icon}
                              {section.title}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {sectionScore} / {maxSectionScore}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Important Note */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Remember:</strong> This score is not a diagnosis. It is information to help you understand patterns. 
                    There are no "bad" scores—only insights that deserve compassion, not criticism.
                  </p>
                </div>

                {/* Reflection Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-logo-green flex items-center gap-2">
                      <Heart className="h-5 w-5 text-rose-500" />
                      Reflection Questions (Most Important Part)
                    </CardTitle>
                    <CardDescription>
                      Answer honestly—no fixing required. These are for your insight only.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reflectionQuestions.map((question, index) => (
                      <div key={index}>
                        <label className="text-sm font-medium text-foreground block mb-2">
                          {index + 1}. {question}
                        </label>
                        <Textarea
                          placeholder="Your thoughts..."
                          value={reflections[index] || ""}
                          onChange={(e) => setReflections((prev) => ({ ...prev, [index]: e.target.value }))}
                          className="min-h-[80px]"
                          maxLength={1000}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Grounding Reframe */}
                <Card className="bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-950/20 border-emerald-500/30">
                  <CardHeader>
                    <CardTitle className="text-emerald-700 dark:text-emerald-400">A Grounding Reframe</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-medium text-foreground">
                      Hypervigilance is not weakness. It is intelligence shaped by threat.
                    </p>
                    <p className="text-muted-foreground">
                      But what kept you safe during crisis may not be sustainable long-term.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="p-3 bg-background rounded-lg">
                        <p className="text-sm font-medium text-foreground mb-2">Healing does NOT mean:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Becoming careless</li>
                          <li>• Ignoring risk</li>
                          <li>• Trusting blindly</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-background rounded-lg">
                        <p className="text-sm font-medium text-foreground mb-2">Healing DOES mean:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Letting your nervous system stand down when possible</li>
                          <li>• Sharing the load</li>
                          <li>• Creating safety inside yourself</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* What Helps */}
                <Card className="border-violet-500/30">
                  <CardHeader>
                    <CardTitle className="text-violet-700 dark:text-violet-400">What Helps Hypervigilance Begin to Ease</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        "Clear, consistent boundaries",
                        "Predictable routines",
                        "Reducing responsibility for outcomes you can't control",
                        "Trauma-informed self-care (not avoidance)",
                        "Support that doesn't demand strength",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="outline" onClick={handleReset} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Retake Assessment
                  </Button>
                  <Button variant="outline" onClick={() => setShowResults(false)}>
                    Review Answers
                  </Button>
                </div>
              </div>
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
