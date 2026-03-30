import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import ToolBrandHeader from "@/components/ToolBrandHeader";
import FamilyBridgeBanner from "@/components/FamilyBridgeBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle, Shield, ShieldAlert, ShieldCheck, ShieldOff,
  Download, Video, ExternalLink, ArrowRight, ChevronDown,
  Heart, MessageCircle, Users, BookOpen, Phone
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Emotional Changes",
    icon: Heart,
    questions: [
      "Increased irritability or anger",
      "Sudden mood swings",
      "Appearing depressed or emotionally withdrawn",
      "Blaming others for problems",
    ],
  },
  {
    name: "Behavioral Changes",
    icon: Users,
    questions: [
      "Avoiding recovery meetings or support groups",
      "Becoming secretive about activities",
      "Spending time with old using friends",
      "Ignoring previously established recovery routines",
    ],
  },
  {
    name: "Lifestyle Warning Signs",
    icon: AlertTriangle,
    questions: [
      "Sleeping excessively or not sleeping much",
      "Missing work, school, or responsibilities",
      "Increased financial problems",
      "Asking family for money unexpectedly",
    ],
  },
  {
    name: "Recovery Engagement",
    icon: BookOpen,
    questions: [
      "Talking less about recovery",
      "Refusing drug testing or accountability measures",
      "Minimizing past addiction problems",
      'Saying things like "I have it under control now"',
    ],
  },
];

const OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Occasionally", value: 1 },
  { label: "Frequently", value: 2 },
  { label: "Almost Always", value: 3 },
];

type RiskLevel = "low" | "moderate" | "high" | "critical";

function getRiskLevel(score: number): RiskLevel {
  if (score <= 12) return "low";
  if (score <= 24) return "moderate";
  if (score <= 36) return "high";
  return "critical";
}

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bgClass: string; borderClass: string; textClass: string; icon: typeof ShieldCheck; messages: string[] }> = {
  low: {
    label: "Low Risk",
    color: "hsl(142 71% 45%)",
    bgClass: "bg-green-50",
    borderClass: "border-green-300",
    textClass: "text-green-700",
    icon: ShieldCheck,
    messages: [
      "Your loved one currently shows few behavioral indicators associated with relapse risk.",
      "Continue encouraging healthy recovery habits and open communication.",
    ],
  },
  moderate: {
    label: "Moderate Risk",
    color: "hsl(48 96% 53%)",
    bgClass: "bg-yellow-50",
    borderClass: "border-yellow-300",
    textClass: "text-yellow-700",
    icon: Shield,
    messages: [
      "Some warning signs are present.",
      "This may indicate stress, early relapse thinking, or weakening recovery structure.",
      "Consider increasing accountability and encouraging stronger recovery engagement.",
    ],
  },
  high: {
    label: "High Risk",
    color: "hsl(25 95% 53%)",
    bgClass: "bg-orange-50",
    borderClass: "border-orange-300",
    textClass: "text-orange-700",
    icon: ShieldAlert,
    messages: [
      "Multiple relapse indicators are present.",
      "Families often observe patterns like this before a return to substance use.",
      "It may be time for a serious conversation and stronger recovery structure.",
    ],
  },
  critical: {
    label: "Critical Risk",
    color: "hsl(0 84% 60%)",
    bgClass: "bg-red-50",
    borderClass: "border-red-300",
    textClass: "text-red-700",
    icon: ShieldOff,
    messages: [
      "Significant warning signs of relapse are present.",
      "Immediate intervention and increased support may be necessary.",
      "Consider consulting with a professional interventionist.",
    ],
  },
};

const ACTIONS: Record<RiskLevel, string[]> = {
  low: [
    "Continue open communication with your loved one",
    "Encourage recovery meetings and support groups",
    "Maintain healthy family boundaries",
  ],
  moderate: [
    "Schedule a family conversation",
    "Reinforce existing boundaries",
    "Encourage additional recovery meetings",
    "Increase check-ins and accountability",
  ],
  high: [
    "Have a serious, compassionate conversation",
    "Reinforce boundaries firmly",
    "Encourage professional counseling",
    "Increase accountability measures",
    "Consider a family intervention meeting",
  ],
  critical: [
    "Seek professional guidance immediately",
    "Contact a professional interventionist",
    "Reinforce safety boundaries",
    "Encourage immediate professional support",
    "Prepare for crisis intervention if needed",
  ],
};

const totalQuestions = CATEGORIES.reduce((sum, c) => sum + c.questions.length, 0);

export default function RelapseRadar() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;
  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const riskLevel = getRiskLevel(totalScore);
  const config = RISK_CONFIG[riskLevel];

  const handleAnswer = (questionKey: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setShowEmailCapture(true);
  };

  const handleShowResults = () => {
    setShowResults(true);
    setShowEmailCapture(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleDownloadPDF = () => {
    const risk = RISK_CONFIG[riskLevel];
    const actions = ACTIONS[riskLevel];
    let content = "RELAPSE RADAR — FAMILY RISK ASSESSMENT REPORT\n";
    content += "SoberHelpline.com | Hope. Help. Recovery.\n";
    content += "=" .repeat(50) + "\n\n";
    content += `Date: ${new Date().toLocaleDateString()}\n`;
    if (firstName) content += `Name: ${firstName}\n`;
    content += `\nTotal Score: ${totalScore} / 48\n`;
    content += `Risk Level: ${risk.label}\n\n`;
    content += "ASSESSMENT SUMMARY\n" + "-".repeat(30) + "\n";
    risk.messages.forEach((m) => (content += `• ${m}\n`));
    content += "\nRECOMMENDED ACTIONS\n" + "-".repeat(30) + "\n";
    actions.forEach((a) => (content += `• ${a}\n`));
    content += "\nDETAILED RESPONSES\n" + "-".repeat(30) + "\n";
    CATEGORIES.forEach((cat) => {
      content += `\n${cat.name}:\n`;
      cat.questions.forEach((q, qi) => {
        const key = `${cat.name}-${qi}`;
        const val = answers[key] ?? 0;
        const label = OPTIONS.find((o) => o.value === val)?.label ?? "Not answered";
        content += `  ${q}: ${label}\n`;
      });
    });
    content += "\n\nFor more support visit SoberHelpline.com\n";
    content += "The Family Squares — Every Monday at 7:00 PM PST\n";

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Relapse-Radar-Report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const gaugePercent = Math.round((totalScore / 48) * 100);

  return (
    <>
      <SEOHead
        title="Relapse Radar — Early Warning Signs Assessment | Sober Helpline"
        description="Identify potential relapse risks before a crisis happens. Free interactive assessment tool for families navigating addiction recovery."
        
      />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 via-background to-background py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <ToolBrandHeader
              title="Relapse Radar"
              subtitle="Early Warning Signs of Addiction Relapse"
              clinicalNote="Identify potential relapse risks before a crisis happens."
            />
            <p className="text-muted-foreground leading-relaxed mt-4">
              Families often sense that something is wrong before a relapse happens, but they don't always know what the warning signs mean.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong className="text-foreground">Relapse Radar</strong> helps families evaluate behavioral and lifestyle changes that commonly precede relapse.
            </p>
            <p className="text-sm text-muted-foreground mt-4 italic">
              Answer the questions below based on what you have observed in the past 30 days.
            </p>
          </div>
        </section>

        {/* Progress bar */}
        <div className="sticky top-14 z-40 bg-background/95 backdrop-blur border-b border-border/40 py-2">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{answeredCount} of {totalQuestions} questions answered</span>
              <span>{Math.round((answeredCount / totalQuestions) * 100)}%</span>
            </div>
            <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
          </div>
        </div>

        {/* Assessment */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-3xl space-y-8">
            {CATEGORIES.map((cat, ci) => {
              const Icon = cat.icon;
              return (
                <Card key={cat.name} className="border-border/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      {cat.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {cat.questions.map((q, qi) => {
                      const key = `${cat.name}-${qi}`;
                      return (
                        <div key={key} className="space-y-3">
                          <p className="text-sm font-medium text-foreground">{q}</p>
                          <RadioGroup
                            value={answers[key]?.toString()}
                            onValueChange={(v) => handleAnswer(key, parseInt(v))}
                            className="flex flex-wrap gap-2"
                          >
                            {OPTIONS.map((opt) => (
                              <div key={opt.value} className="flex items-center">
                                <RadioGroupItem
                                  value={opt.value.toString()}
                                  id={`${key}-${opt.value}`}
                                  className="sr-only"
                                />
                                <Label
                                  htmlFor={`${key}-${opt.value}`}
                                  className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                    answers[key] === opt.value
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                                  }`}
                                >
                                  {opt.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}

            {/* Submit */}
            {!showResults && !showEmailCapture && (
              <div className="text-center pt-4">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="gap-2 px-8"
                >
                  View My Risk Assessment
                  <ArrowRight className="w-4 h-4" />
                </Button>
                {!allAnswered && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Please answer all {totalQuestions} questions to see your results.
                  </p>
                )}
              </div>
            )}

            {/* Email Capture */}
            {showEmailCapture && !showResults && (
              <Card className="border-primary/20 bg-primary/[0.02]">
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-foreground font-medium text-center">
                    Enter your info to receive your full Relapse Radar report and additional family recovery resources.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button onClick={handleShowResults} className="gap-2">
                      View Results
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" onClick={handleShowResults} className="text-xs">
                      Skip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {showResults && (
              <div ref={resultsRef} className="space-y-8 pt-4">
                {/* Gauge */}
                <Card className={`${config.bgClass} ${config.borderClass} border-2`}>
                  <CardContent className="pt-8 pb-8">
                    <div className="text-center space-y-6">
                      {/* Radar gauge */}
                      <div className="relative w-48 h-48 mx-auto">
                        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                          <circle cx="100" cy="100" r="85" fill="none" stroke="hsl(var(--border))" strokeWidth="14" />
                          <circle
                            cx="100" cy="100" r="85"
                            fill="none"
                            stroke={config.color}
                            strokeWidth="14"
                            strokeLinecap="round"
                            strokeDasharray={`${(gaugePercent / 100) * 534} 534`}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          {(() => { const Icon = config.icon; return <Icon className="w-8 h-8 mb-1" style={{ color: config.color }} />; })()}
                          <span className="text-3xl font-bold text-foreground">{totalScore}</span>
                          <span className="text-xs text-muted-foreground">of 48</span>
                        </div>
                      </div>

                      <div>
                        <h2 className={`text-2xl font-bold ${config.textClass}`}>{config.label}</h2>
                        <div className="mt-4 space-y-2 max-w-lg mx-auto text-left">
                          {config.messages.map((msg, i) => (
                            <p key={i} className="text-sm text-foreground/80 leading-relaxed">{msg}</p>
                          ))}
                        </div>
                      </div>

                      {/* Risk scale */}
                      <div className="flex gap-1 max-w-sm mx-auto mt-4">
                        {(["low", "moderate", "high", "critical"] as RiskLevel[]).map((level) => (
                          <div key={level} className="flex-1 text-center">
                            <div
                              className={`h-3 rounded-full ${level === riskLevel ? "ring-2 ring-offset-1 ring-foreground/30" : "opacity-40"}`}
                              style={{ backgroundColor: RISK_CONFIG[level].color }}
                            />
                            <span className="text-[10px] text-muted-foreground mt-1 block">{RISK_CONFIG[level].label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {ACTIONS[riskLevel].map((action, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-semibold text-primary">{i + 1}</span>
                          </div>
                          <span className="text-sm text-foreground/80">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Download */}
                <div className="text-center">
                  <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                </div>

                {/* Monday Meeting CTA */}
                <Card className="bg-gradient-to-r from-primary/5 via-background to-primary/5 border-primary/20">
                  <CardContent className="pt-6 text-center space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">Need guidance from families who understand?</h3>
                    <p className="text-sm text-muted-foreground">
                      Join our <strong>The Family Squares</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">Every Monday Night • 7:00 PM PST</p>
                    <Link to="/monday-zoom-registration">
                      <Button className="gap-2 mt-2">
                        <Video className="w-4 h-4" />
                        Register Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* FamilyBridge */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground">Track Recovery Progress Over Time</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
                      Relapse Radar provides a snapshot of current risk indicators. Families who want to track warning signs and family dynamics over time can use the <strong>FamilyBridge App</strong>, a recovery support platform designed to help families navigate addiction and early recovery.
                    </p>
                  </div>
                  <FamilyBridgeBanner />
                </div>

                {/* Phone CTA */}
                <div className="text-center py-4">
                  <a
                    href="tel:5412415886"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
                  >
                    <Phone className="w-5 h-5" />
                    (541) 241-5886
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Free confidential support</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Closing Message */}
        <section className="py-10 bg-primary/[0.03] border-t border-border/40">
          <div className="container mx-auto px-4 max-w-2xl text-center space-y-3">
            <p className="text-foreground font-medium">
              Families dealing with addiction are not alone.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Education, boundaries, and support can make a powerful difference in recovery outcomes. SoberHelpline exists to support families navigating addiction and recovery.
            </p>
            <p className="text-xs text-muted-foreground italic mt-4">Hope. Help. Recovery.</p>
          </div>
        </section>
      </div>
    </>
  );
}
