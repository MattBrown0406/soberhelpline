import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, ClipboardCheck, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface FamilyReadinessAssessmentProps {
  readOnly?: boolean;
  assessmentData?: any;
}

export default function FamilyReadinessAssessment({ readOnly = false, assessmentData }: FamilyReadinessAssessmentProps) {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!readOnly);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;

  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const phase = getPhase(totalScore);
  const info = phaseInfo[phase];

  const boundaryScore = [4, 5, 6].reduce((s, id) => s + (answers[id] ?? 0), 0);
  const enablingScore = [7, 8, 9].reduce((s, id) => s + (answers[id] ?? 0), 0);
  const emotionalScore = [10, 11, 12].reduce((s, id) => s + (answers[id] ?? 0), 0);
  const alignmentScore = [13, 14, 15].reduce((s, id) => s + (answers[id] ?? 0), 0);

  // Load from readOnly data
  useEffect(() => {
    if (readOnly && assessmentData) {
      const loadedAnswers: Answers = {};
      if (assessmentData.answers && typeof assessmentData.answers === 'object') {
        Object.entries(assessmentData.answers).forEach(([k, v]) => {
          loadedAnswers[parseInt(k)] = v as number;
        });
      }
      setAnswers(loadedAnswers);
      setShowResults(true);
      setLoading(false);
      return;
    }
  }, [readOnly, assessmentData]);

  // Load existing for logged-in user
  useEffect(() => {
    if (readOnly) return;
    const loadExisting = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("family_readiness_assessments")
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
      phase,
      boundary_score: boundaryScore,
      enabling_score: enablingScore,
      emotional_score: emotionalScore,
      alignment_score: alignmentScore,
    };

    let error;
    if (existingId) {
      const res = await supabase.from("family_readiness_assessments").update(payload).eq("id", existingId);
      error = res.error;
    } else {
      const res = await supabase.from("family_readiness_assessments").insert(payload).select("id").single();
      error = res.error;
      if (res.data) setExistingId(res.data.id);
    }

    setSaving(false);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Assessment saved", description: "Your Family Readiness Assessment has been saved." });
    }
  };

  const handleSubmit = () => {
    if (allAnswered) setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
    setCurrentSection(0);
  };

  const sectionQuestions = sections[currentSection]?.questions ?? [];
  const sectionAnswered = sectionQuestions.every((q) => answers[q.id] !== undefined);

  if (loading) return <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
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
                    disabled={readOnly}
                  >
                    {q.options.map((opt) => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value.toString()} id={`readiness-q${q.id}-${opt.value}`} />
                        <Label htmlFor={`readiness-q${q.id}-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
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
            {!readOnly && (
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {existingId ? "Update Results" : "Save Results"}
              </Button>
            )}
            <Button variant="outline" onClick={() => window.print()}>Print Results</Button>
            {!readOnly && <Button variant="outline" onClick={handleReset}>Retake Assessment</Button>}
          </div>
        </div>
      )}
    </div>
  );
}
