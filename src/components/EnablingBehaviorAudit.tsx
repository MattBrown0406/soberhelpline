import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, ShieldAlert, Save, Loader2 } from "lucide-react";
import ToolBrandHeader from "@/components/ToolBrandHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const auditSections = [
  {
    title: "Financial Support",
    questions: [
      { id: 1, text: "I have given money despite suspecting it could support substance use." },
      { id: 2, text: 'I have paid bills (rent, phone, car insurance, legal fees) to prevent "consequences."' },
      { id: 3, text: "I have rescued them from financial fallout without requiring accountability." },
      { id: 4, text: 'I have justified financial support because "at least it keeps them safe."' },
      { id: 5, text: "I avoid tracking where money goes because I don't want to know the answer." },
    ],
  },
  {
    title: "Protection from Consequences",
    questions: [
      { id: 6, text: "I have called employers, schools, or family members to explain away behavior." },
      { id: 7, text: "I have lied or minimized their behavior to protect their reputation." },
      { id: 8, text: "I have prevented natural legal or social consequences from occurring." },
      { id: 9, text: "I have allowed them to stay in my home without clear expectations." },
      { id: 10, text: "I have threatened consequences but failed to follow through." },
    ],
  },
  {
    title: "Emotional Rescue",
    questions: [
      { id: 11, text: "I feel responsible for keeping them emotionally stable." },
      { id: 12, text: 'I absorb their anger, blame, or manipulation to "keep the peace."' },
      { id: 13, text: "I frequently change my behavior to avoid triggering them." },
      { id: 14, text: "I feel guilty when I prioritize my own needs." },
      { id: 15, text: "I believe that if I just say the right thing, I can prevent relapse." },
    ],
  },
  {
    title: "Control & Monitoring",
    questions: [
      { id: 16, text: "I check their phone, social media, or belongings without permission." },
      { id: 17, text: "I attempt to control their recovery choices." },
      { id: 18, text: "I interrogate them about meetings, friends, or whereabouts." },
      { id: 19, text: "I struggle to allow them to fail." },
      { id: 20, text: "I feel anxious when I do not know exactly what they are doing." },
    ],
  },
  {
    title: "Self-Neglect",
    questions: [
      { id: 21, text: "I have sacrificed my own sleep, health, or work performance." },
      { id: 22, text: "I have withdrawn from friends or hobbies because of this situation." },
      { id: 23, text: 'My mood depends heavily on whether they are "doing well."' },
      { id: 24, text: "I rarely make decisions based on my own long-term well-being." },
      { id: 25, text: "I feel trapped in a cycle I don't know how to stop." },
    ],
  },
];

const scaleOptions = [
  { value: 0, label: "Never" },
  { value: 1, label: "Once" },
  { value: 2, label: "Occasionally" },
  { value: 3, label: "Frequently" },
  { value: 4, label: "Consistently / Ongoing" },
];

type Answers = Record<number, number>;

const getRiskLevel = (score: number) => {
  if (score <= 20) return "low";
  if (score <= 40) return "mild";
  if (score <= 60) return "moderate";
  if (score <= 80) return "high";
  return "systemic";
};

const riskInfo = {
  low: {
    title: "Low Enabling Risk",
    range: "0–20",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    message: "You are largely allowing natural consequences.",
    focus: "Boundary reinforcement.",
    recommend: "Boundary Reinforcement Workshop",
  },
  mild: {
    title: "Mild Enabling Patterns",
    range: "21–40",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    message: "Some rescues and emotional over-responsibility present.",
    focus: "Detachment training.",
    recommend: "Parallel Recovery Program",
  },
  moderate: {
    title: "Moderate Enabling",
    range: "41–60",
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
    message: "Patterns are active and likely interfering with recovery.",
    focus: "Structured boundary implementation.",
    recommend: "Stabilization Intensive",
  },
  high: {
    title: "High Enabling",
    range: "61–80",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    message: "Family system is over-functioning.",
    focus: "Immediate coaching intervention.",
    recommend: "Immediate Coaching Intervention",
  },
  systemic: {
    title: "Systemic Enabling",
    range: "81–100",
    color: "text-red-800 dark:text-red-300",
    bg: "bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-700",
    message: "Your stability may now depend on controlling or rescuing them.",
    focus: "Intensive family stabilization coaching.",
    recommend: "Intensive Family Stabilization Coaching",
  },
};

interface EnablingBehaviorAuditProps {
  readOnly?: boolean;
  auditData?: any;
}

export default function EnablingBehaviorAudit({ readOnly = false, auditData }: EnablingBehaviorAuditProps) {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!readOnly);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const totalQuestions = 25;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;

  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const risk = getRiskLevel(totalScore);
  const info = riskInfo[risk];

  const subscore = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i).reduce((s, id) => s + (answers[id] ?? 0), 0);

  const financialScore = subscore(1, 5);
  const consequenceScore = subscore(6, 10);
  const emotionalScore = subscore(11, 15);
  const controlScore = subscore(16, 20);
  const selfNeglectScore = subscore(21, 25);

  // Load from readOnly data
  useEffect(() => {
    if (readOnly && auditData) {
      const loadedAnswers: Answers = {};
      if (auditData.answers && typeof auditData.answers === 'object') {
        Object.entries(auditData.answers).forEach(([k, v]) => {
          loadedAnswers[parseInt(k)] = v as number;
        });
      }
      setAnswers(loadedAnswers);
      setShowResults(true);
      setLoading(false);
      return;
    }
  }, [readOnly, auditData]);

  // Load existing for logged-in user
  useEffect(() => {
    if (readOnly) return;
    const loadExisting = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("enabling_behavior_audits")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setExistingId(data.id);
        const loadedAnswers: Answers = {};
        if (data.answers && typeof data.answers === 'object') {
          Object.entries(data.answers as Record<string, number>).forEach(([k, v]) => {
            loadedAnswers[parseInt(k)] = v;
          });
        }
        setAnswers(loadedAnswers);
        if (Object.keys(loadedAnswers).length === totalQuestions) {
          setShowResults(true);
        }
      }
      setLoading(false);
    };
    loadExisting();
  }, [readOnly]);

  const handleAnswer = (questionId: number, value: number) => {
    if (readOnly) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSave = async () => {
    if (!userId || readOnly) return;
    setSaving(true);

    const payload = {
      user_id: userId,
      answers: answers as any,
      total_score: totalScore,
      risk_level: risk,
      financial_score: financialScore,
      consequence_score: consequenceScore,
      emotional_score: emotionalScore,
      control_score: controlScore,
      self_neglect_score: selfNeglectScore,
    };

    let error;
    if (existingId) {
      const res = await supabase.from("enabling_behavior_audits").update(payload).eq("id", existingId);
      error = res.error;
    } else {
      const res = await supabase.from("enabling_behavior_audits").insert(payload).select("id").single();
      error = res.error;
      if (res.data) setExistingId(res.data.id);
    }

    setSaving(false);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Audit saved", description: "Your Enabling Behavior Audit has been saved." });
    }
  };

  const sectionQuestions = auditSections[currentSection]?.questions ?? [];
  const sectionAnswered = sectionQuestions.every((q) => answers[q.id] !== undefined);

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
    setCurrentSection(0);
  };

  if (loading) return <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <ToolBrandHeader
        title="Enabling Behavior Audit™"
        subtitle="This audit is not about blame — it is about awareness. Enabling often comes from love, fear, guilt, or exhaustion, not weakness. Answer honestly based on the past 90 days."
        clinicalNote="Based on evidence-informed family systems and codependency research. Identifying enabling patterns is the first step toward healthier support."
      />

      {!showResults ? (
        <>
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Section {currentSection + 1} of {auditSections.length}: {auditSections[currentSection].title}</span>
              <span>{answeredCount}/{totalQuestions} answered</span>
            </div>
            <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Section {currentSection + 1}: {auditSections[currentSection].title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {sectionQuestions.map((q) => (
                <div key={q.id}>
                  <p className="font-medium mb-3">{q.id}. {q.text}</p>
                  <RadioGroup
                    value={answers[q.id]?.toString()}
                    onValueChange={(val) => handleAnswer(q.id, parseInt(val))}
                    className="space-y-2"
                    disabled={readOnly}
                  >
                    {scaleOptions.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value.toString()} id={`audit-q${q.id}-${opt.value}`} />
                        <Label htmlFor={`audit-q${q.id}-${opt.value}`} className="cursor-pointer">
                          {opt.value} – {opt.label}
                        </Label>
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
            {currentSection < auditSections.length - 1 ? (
              <Button onClick={() => setCurrentSection((s) => s + 1)} disabled={!sectionAnswered} className="gap-1">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => allAnswered && setShowResults(true)} disabled={!allAnswered}>
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
                {info.title} — Score: {totalScore}/100
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg italic">&ldquo;{info.message}&rdquo;</p>
              <p><span className="font-semibold">Focus:</span> {info.focus}</p>
              <div>
                <p className="font-semibold mb-1">Recommended:</p>
                <p className={info.color}>{info.recommend}</p>
              </div>
              {!readOnly && (
                <Link to="/book-consultation">
                  <Button className="gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    Book a Coaching Session
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-6">
              <p className="text-center italic text-muted-foreground">
                "Enabling is rarely about weakness.<br />
                It is usually about fear, love, and exhaustion.<br />
                But when protection prevents growth, it becomes part of the cycle."
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Financial Enabling (Q1–5)</p>
                  <p className="text-xl font-bold">{financialScore}/20</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Consequence Interference (Q6–10)</p>
                  <p className="text-xl font-bold">{consequenceScore}/20</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Emotional Over-Responsibility (Q11–15)</p>
                  <p className="text-xl font-bold">{emotionalScore}/20</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Control Behaviors (Q16–20)</p>
                  <p className="text-xl font-bold">{controlScore}/20</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Self-Neglect Index (Q21–25)</p>
                  <p className="text-xl font-bold">{selfNeglectScore}/20</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 print:hidden">
            {!readOnly && (
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {existingId ? "Update Results" : "Save Results"}
              </Button>
            )}
            <Button variant="outline" onClick={() => window.print()}>Print Results</Button>
            {!readOnly && <Button variant="outline" onClick={handleReset}>Retake Audit</Button>}
          </div>
        </div>
      )}
    </div>
  );
}
