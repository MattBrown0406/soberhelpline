import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, ClipboardCheck, Calendar, ChevronRight, ShieldAlert, FileText, Compass, Users, BookOpen, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import logo from "@/assets/logo.png";
import SEOHead from "@/components/SEOHead";
import EnablingBehaviorAudit from "@/components/EnablingBehaviorAudit";
import BoundaryClarityWorksheet from "@/components/BoundaryClarityWorksheet";
import CoachingIntakeAssessment from "@/components/CoachingIntakeAssessment";

const sections = [
  {
    title: "Current Stability",
    questions: [
      {
        id: 1,
        text: "In the past 30 days, how chaotic has your household felt?",
        options: [
          { value: 0, label: "Calm and stable" },
          { value: 1, label: "Occasionally stressful" },
          { value: 2, label: "Frequently tense" },
          { value: 3, label: "Highly chaotic" },
          { value: 4, label: "Crisis-level instability" },
        ],
      },
      {
        id: 2,
        text: "How often are you reacting emotionally (anger, panic, pleading)?",
        options: [
          { value: 0, label: "Rarely" },
          { value: 1, label: "Sometimes" },
          { value: 2, label: "Often" },
          { value: 3, label: "Almost daily" },
          { value: 4, label: "Constantly" },
        ],
      },
      {
        id: 3,
        text: "Have there been recent safety concerns? (overdose, violence, suicidal behavior)",
        options: [
          { value: 0, label: "No" },
          { value: 2, label: "Concern but no immediate risk" },
          { value: 4, label: "Yes, immediate or recent crisis" },
        ],
      },
    ],
  },
  {
    title: "Boundary Clarity",
    questions: [
      {
        id: 4,
        text: "Do you have clearly defined boundaries regarding money, housing, and communication?",
        options: [
          { value: 0, label: "Yes, clearly defined and enforced" },
          { value: 1, label: "Mostly clear" },
          { value: 2, label: "Somewhat unclear" },
          { value: 3, label: "Frequently inconsistent" },
          { value: 4, label: "No boundaries in place" },
        ],
      },
      {
        id: 5,
        text: "When a boundary is broken, what typically happens?",
        options: [
          { value: 0, label: "Consistent consequence" },
          { value: 2, label: "Sometimes follow through" },
          { value: 4, label: "We usually back down" },
        ],
      },
      {
        id: 6,
        text: "Do you feel guilty when enforcing limits?",
        options: [
          { value: 0, label: "Rarely" },
          { value: 1, label: "Occasionally" },
          { value: 2, label: "Frequently" },
          { value: 3, label: "Almost always" },
          { value: 4, label: "I cannot enforce limits without guilt" },
        ],
      },
    ],
  },
  {
    title: "Enabling Patterns",
    questions: [
      {
        id: 7,
        text: "In the last 60 days, have you given money that you suspected might support substance use?",
        options: [
          { value: 0, label: "No" },
          { value: 2, label: "Once or twice" },
          { value: 4, label: "Multiple times" },
        ],
      },
      {
        id: 8,
        text: "Do you cover up, excuse, or minimize your loved one's behavior to others?",
        options: [
          { value: 0, label: "Never" },
          { value: 1, label: "Rarely" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Often" },
          { value: 4, label: "Regularly" },
        ],
      },
      {
        id: 9,
        text: "Do you feel responsible for preventing their relapse?",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Somewhat" },
          { value: 2, label: "Frequently" },
          { value: 3, label: "Strongly" },
          { value: 4, label: "Completely" },
        ],
      },
    ],
  },
  {
    title: "Emotional Regulation",
    questions: [
      {
        id: 10,
        text: "How well are you sleeping?",
        options: [
          { value: 0, label: "Consistently well" },
          { value: 1, label: "Minor disruptions" },
          { value: 2, label: "Frequent sleep disturbance" },
          { value: 3, label: "Severe insomnia" },
        ],
      },
      {
        id: 11,
        text: "How often do you feel consumed by worry?",
        options: [
          { value: 0, label: "Rarely" },
          { value: 1, label: "Sometimes" },
          { value: 2, label: "Daily" },
          { value: 3, label: "Constantly" },
        ],
      },
      {
        id: 12,
        text: "Do you have support outside your immediate family?",
        options: [
          { value: 0, label: "Strong support network" },
          { value: 1, label: "Some support" },
          { value: 2, label: "Very limited support" },
          { value: 3, label: "No support" },
        ],
      },
    ],
  },
  {
    title: "Alignment & Long-Term Outlook",
    questions: [
      {
        id: 13,
        text: "As a family, are you unified in your approach?",
        options: [
          { value: 0, label: "Fully aligned" },
          { value: 1, label: "Minor disagreements" },
          { value: 2, label: "Frequent disagreements" },
          { value: 3, label: "Deep division" },
        ],
      },
      {
        id: 14,
        text: "Do you have a written or verbal relapse response plan?",
        options: [
          { value: 0, label: "Yes" },
          { value: 2, label: "Rough idea" },
          { value: 4, label: "No plan" },
        ],
      },
      {
        id: 15,
        text: "Do you feel hopeful about the future?",
        options: [
          { value: 0, label: "Strongly hopeful" },
          { value: 1, label: "Cautiously hopeful" },
          { value: 2, label: "Uncertain" },
          { value: 3, label: "Discouraged" },
          { value: 4, label: "Hopeless" },
        ],
      },
    ],
  },
];

type Answers = Record<number, number>;

const getPhase = (score: number) => {
  if (score <= 15) return "maintenance";
  if (score <= 30) return "transition";
  if (score <= 45) return "stabilization";
  return "crisis";
};

const phaseInfo = {
  maintenance: {
    title: "Maintenance Phase",
    range: "0–15",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    message: "You have structure. Now it's about consistency and long-term resilience.",
    recommend: "Long-Term Family Support Membership",
  },
  transition: {
    title: "Transition Phase",
    range: "16–30",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    message: "You are beginning to detach — but old patterns are still active.",
    recommend: "Parallel Recovery Program",
  },
  stabilization: {
    title: "Stabilization Phase",
    range: "31–45",
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
    message: "You are not failing. You are overwhelmed. Your family needs structure before it can offer support.",
    recommend: "Family Stabilization Intensive",
  },
  crisis: {
    title: "Crisis Stabilization Required",
    range: "46+",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    message: "Immediate structured coaching support recommended. May require professional intervention referral.",
    recommend: "Immediate Coaching Session",
  },
};

export default function FamilyCoaching() {
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;

  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const phase = getPhase(totalScore);
  const info = phaseInfo[phase];

  // Sub-scores
  const boundaryScore = [4, 5, 6].reduce((s, id) => s + (answers[id] ?? 0), 0);
  const enablingScore = [7, 8, 9].reduce((s, id) => s + (answers[id] ?? 0), 0);
  const emotionalScore = [10, 11, 12].reduce((s, id) => s + (answers[id] ?? 0), 0);
  const alignmentScore = [13, 14, 15].reduce((s, id) => s + (answers[id] ?? 0), 0);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (allAnswered) setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
    setCurrentSection(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => window.print();

  const sectionQuestions = sections[currentSection]?.questions ?? [];
  const sectionAnswered = sectionQuestions.every((q) => answers[q.id] !== undefined);

  return (
    <>
      <SEOHead
        title="Family Coaching & Readiness Assessment | Sober Helpline"
        description="Take the Family Readiness Assessment to understand where your family is in the parallel recovery journey. Book a coaching session for personalized guidance."
      />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
            </Link>
            <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
              <Phone className="h-4 w-4" />
              (541) 241-5886
            </a>
          </div>
        </header>

        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link to="/family-support" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
              <div className="flex flex-wrap gap-2">
                <Link to="/family-education">
                  <Button variant="outline" size="sm" className="gap-2 border-logo-green/50 text-logo-green hover:bg-logo-green/10">
                    <BookOpen className="h-4 w-4" />
                    Education
                  </Button>
                </Link>
                <Link to="/family-forum">
                  <Button variant="outline" size="sm" className="gap-2 border-emerald-500/50 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30">
                    <Users className="h-4 w-4" />
                    Forum
                  </Button>
                </Link>
                <Link to="/family-webinars">
                  <Button variant="outline" size="sm" className="gap-2 border-purple-500/50 text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30">
                    <Video className="h-4 w-4" />
                    Webinars
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-background to-orange-500/5 border border-amber-500/20 p-8 md:p-12 mb-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative text-center">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Compass className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-700 dark:text-amber-400">
                      Family Coaching
                    </h1>
                    <p className="text-muted-foreground">Personalized guidance for your parallel recovery journey</p>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
                  Expert coaching to help your family navigate addiction, establish boundaries, and build a sustainable path forward — together.
                </p>
              </div>
            </div>

            {/* Book a Session CTA */}
            <Card className="mb-8 border-2 border-amber-500/30 overflow-hidden hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
              <CardHeader className="bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-amber-700 dark:text-amber-400">Book a Coaching Session</CardTitle>
                    <CardDescription>
                      Schedule a one-on-one session with one of our family recovery coaches for personalized support.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to="/book-consultation">
                  <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                    <Calendar className="h-4 w-4" />
                    Schedule a Session
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Coaching Phase Guide Table */}
            <Card className="mb-8 border-2 border-orange-500/30 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-950/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Compass className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-orange-700 dark:text-orange-400">Coaching Phase Guide</CardTitle>
                    <CardDescription>Understanding where your family is in the parallel recovery journey.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-orange-200 dark:border-orange-800/50">
                        <th className="text-left py-3 px-4 font-semibold text-orange-700 dark:text-orange-400">Phase</th>
                        <th className="text-left py-3 px-4 font-semibold text-orange-700 dark:text-orange-400">Family Experience</th>
                        <th className="text-left py-3 px-4 font-semibold text-orange-700 dark:text-orange-400">Coaching Focus</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50 bg-red-50/50 dark:bg-red-950/20">
                        <td className="py-3 px-4 font-medium text-red-700 dark:text-red-400">Stabilization</td>
                        <td className="py-3 px-4 text-muted-foreground">Panic, chaos, fear, crisis management</td>
                        <td className="py-3 px-4 text-muted-foreground">Emotional regulation, crisis boundaries</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-amber-50/50 dark:bg-amber-950/20">
                        <td className="py-3 px-4 font-medium text-amber-700 dark:text-amber-400">Transition</td>
                        <td className="py-3 px-4 text-muted-foreground">Letting go of control, guilt, resistance</td>
                        <td className="py-3 px-4 text-muted-foreground">Detachment with love, communication reset</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                        <td className="py-3 px-4 font-medium text-emerald-700 dark:text-emerald-400">Maintenance</td>
                        <td className="py-3 px-4 text-muted-foreground">Rebuilding trust slowly</td>
                        <td className="py-3 px-4 text-muted-foreground">Consistency, values alignment</td>
                      </tr>
                      <tr className="bg-blue-50/50 dark:bg-blue-950/20">
                        <td className="py-3 px-4 font-medium text-blue-700 dark:text-blue-400">Long-Term Support</td>
                        <td className="py-3 px-4 text-muted-foreground">Fear of relapse, hypervigilance</td>
                        <td className="py-3 px-4 text-muted-foreground">Sustainable independence, identity rebuilding</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Accordion type="multiple" className="space-y-4">
              {/* Intake Assessment */}
              <AccordionItem value="intake" className="border-2 border-teal-500/30 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-950/20 [&[data-state=open]>svg]:rotate-180">
                  <span className="flex items-center gap-2 text-lg font-semibold text-teal-700 dark:text-teal-400">
                    <div className="p-1.5 rounded-lg bg-teal-500/10">
                      <FileText className="h-5 w-5" />
                    </div>
                    Family Coaching Intake Assessment™
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground text-sm mb-6">
                    Complete this confidential assessment so your coach can understand where your family is in the recovery journey. Estimated time: 12–15 minutes.
                  </p>
                  <CoachingIntakeAssessment />
                </AccordionContent>
              </AccordionItem>
              {/* Family Readiness Assessment */}
              <AccordionItem value="readiness" className="border-2 border-violet-500/30 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-violet-50 to-transparent dark:from-violet-950/20 [&[data-state=open]>svg]:rotate-180">
                  <span className="flex items-center gap-2 text-lg font-semibold text-violet-700 dark:text-violet-400">
                    <div className="p-1.5 rounded-lg bg-violet-500/10">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    Family Readiness Assessment™
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground text-sm mb-6">
                    Estimated time: 7–10 minutes &bull; Understand where your family is in your parallel recovery journey.
                  </p>

                  {!showResults ? (
                    <>
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                          <span>Section {currentSection + 1} of {sections.length}: {sections[currentSection].title}</span>
                          <span>{answeredCount}/{totalQuestions} answered</span>
                        </div>
                        <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
                      </div>

                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle className="text-lg">Section {currentSection + 1}: {sections[currentSection].title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                          {sectionQuestions.map((q) => (
                            <div key={q.id}>
                              <p className="font-medium mb-3">{q.id}. {q.text}</p>
                              <RadioGroup
                                value={answers[q.id]?.toString()}
                                onValueChange={(val) => handleAnswer(q.id, parseInt(val))}
                                className="space-y-2"
                              >
                                {q.options.map((opt) => (
                                  <div key={opt.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt.value.toString()} id={`q${q.id}-${opt.value}`} />
                                    <Label htmlFor={`q${q.id}-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setCurrentSection((s) => Math.max(0, s - 1))} disabled={currentSection === 0}>
                          Previous
                        </Button>
                        {currentSection < sections.length - 1 ? (
                          <Button onClick={() => setCurrentSection((s) => s + 1)} disabled={!sectionAnswered} className="gap-1">
                            Next <ChevronRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button onClick={handleSubmit} disabled={!allAnswered}>
                            View Results
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6 print:space-y-4">
                      <Card className={`border ${info.bg}`}>
                        <CardHeader>
                          <CardTitle className={info.color}>
                            {info.title} — Score: {totalScore}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-lg italic">&ldquo;{info.message}&rdquo;</p>
                          <div>
                            <p className="font-semibold mb-1">Recommended:</p>
                            <p className={info.color}>{info.recommend}</p>
                          </div>
                          <Link to="/book-consultation">
                            <Button className="gap-2 mt-2">
                              <Calendar className="h-4 w-4" />
                              Book a Coaching Session
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Detailed Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-muted/50">
                              <p className="text-sm text-muted-foreground">Boundary Clarity (Q4–6)</p>
                              <p className="text-xl font-bold">{boundaryScore}/12</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                              <p className="text-sm text-muted-foreground">Enabling Score (Q7–9)</p>
                              <p className="text-xl font-bold">{enablingScore}/12</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                              <p className="text-sm text-muted-foreground">Emotional Distress (Q10–12)</p>
                              <p className="text-xl font-bold">{emotionalScore}/9</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                              <p className="text-sm text-muted-foreground">System Alignment (Q13–15)</p>
                              <p className="text-xl font-bold">{alignmentScore}/11</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex gap-3 print:hidden">
                        <Button variant="outline" onClick={handlePrint}>Print Results</Button>
                        <Button variant="outline" onClick={handleReset}>Retake Assessment</Button>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Enabling Behavior Audit */}
              <AccordionItem value="audit" className="border-2 border-rose-500/30 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-rose-50 to-transparent dark:from-rose-950/20 [&[data-state=open]>svg]:rotate-180">
                  <span className="flex items-center gap-2 text-lg font-semibold text-rose-700 dark:text-rose-400">
                    <div className="p-1.5 rounded-lg bg-rose-500/10">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    Enabling Behavior Audit™
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <EnablingBehaviorAudit />
                </AccordionContent>
              </AccordionItem>
              {/* Boundary Clarity Worksheet */}
              <AccordionItem value="boundary-worksheet" className="border-2 border-cyan-500/30 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20 [&[data-state=open]>svg]:rotate-180">
                  <span className="flex items-center gap-2 text-lg font-semibold text-cyan-700 dark:text-cyan-400">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    Boundary Clarity Worksheet™
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <BoundaryClarityWorksheet />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </main>
      </div>
    </>
  );
}
