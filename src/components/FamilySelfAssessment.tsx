import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, ClipboardCheck, History, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { format } from "date-fns";

interface AssessmentResult {
  id: string;
  section1_score: number;
  section2_score: number;
  section3_score: number;
  section4_score: number;
  total_score: number;
  created_at: string;
}

const scoreOptions = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Almost Always" },
];

const section1Questions = [
  "I minimize or downplay my loved one's substance use or its consequences.",
  "I avoid difficult conversations because I'm afraid of upsetting them.",
  "I feel responsible for their emotions, moods, or reactions.",
  "I tell myself, \"Things aren't that bad yet.\"",
  "I fear that setting limits will push them away or make things worse.",
  "I feel guilty when I say no, even when I know it's reasonable.",
  "I believe that if I just love them enough, things will change.",
];

const section2Questions = [
  "I cover for them when they miss work, school, or family obligations.",
  "I make excuses to others for their behavior.",
  "I clean up messes (financial, legal, emotional) caused by their use.",
  "I provide money, housing, transportation, or resources despite ongoing use.",
  "I follow through on consequences inconsistently.",
  "I shield them from experiencing the natural outcomes of their choices.",
  "I change my plans or life to accommodate their addiction.",
];

const section3Questions = [
  "I monitor, track, or try to manage their behavior or substance use.",
  "I spend a significant amount of time thinking about what they're doing.",
  "I feel anxious when I don't know where they are or what they're doing.",
  "I believe it's my job to keep things from falling apart.",
  "I have taken on responsibilities that should belong to them.",
  "I feel exhausted but unsure how to stop.",
];

const section4Questions = [
  "I neglect my own needs because of their situation.",
  "My emotional state depends on how they're doing.",
  "I feel resentful, trapped, or emotionally drained.",
  "I have lost trust in my own judgment.",
  "I feel isolated or ashamed to talk openly about what's happening.",
];

const reflectionQuestions = [
  "Which statements were hardest to answer honestly? Why?",
  "What are you most afraid would happen if you stopped these behaviors?",
  "What has enabling cost you emotionally, physically, or financially?",
  "If nothing changes, where do you see yourself one year from now?",
];

interface Props {
  user?: User | null;
}

export default function FamilySelfAssessment({ user }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0=intro, 1-4=sections, 5=reflection, 6=results
  const [section1Answers, setSection1Answers] = useState<number[]>(Array(7).fill(-1));
  const [section2Answers, setSection2Answers] = useState<number[]>(Array(7).fill(-1));
  const [section3Answers, setSection3Answers] = useState<number[]>(Array(6).fill(-1));
  const [section4Answers, setSection4Answers] = useState<number[]>(Array(5).fill(-1));
  const [reflectionAnswers, setReflectionAnswers] = useState<string[]>(Array(4).fill(""));
  const [pastResults, setPastResults] = useState<AssessmentResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmittedScore, setJustSubmittedScore] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchPastResults();
    }
  }, [user]);

  const fetchPastResults = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('family_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setPastResults(data);
    }
  };

  const calculateSectionScore = (answers: number[]) => {
    return answers.reduce((sum, val) => sum + (val >= 0 ? val : 0), 0);
  };

  const isCurrentSectionComplete = () => {
    switch (currentStep) {
      case 1: return section1Answers.every(a => a >= 0);
      case 2: return section2Answers.every(a => a >= 0);
      case 3: return section3Answers.every(a => a >= 0);
      case 4: return section4Answers.every(a => a >= 0);
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const s1 = calculateSectionScore(section1Answers);
    const s2 = calculateSectionScore(section2Answers);
    const s3 = calculateSectionScore(section3Answers);
    const s4 = calculateSectionScore(section4Answers);
    const total = s1 + s2 + s3 + s4;

    // If user is logged in, save to database
    if (user) {
      const { error } = await supabase.from('family_assessments').insert({
        user_id: user.id,
        section1_score: s1,
        section2_score: s2,
        section3_score: s3,
        section4_score: s4,
        total_score: total,
        reflection_answers: reflectionAnswers.map((answer, i) => ({
          question: reflectionQuestions[i],
          answer
        }))
      });

      if (error) {
        toast.error("Failed to save assessment");
        console.error(error);
      } else {
        toast.success("Assessment saved!");
        fetchPastResults();
      }
    }
    
    setJustSubmittedScore(total);
    setCurrentStep(6);
    setIsSubmitting(false);
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setSection1Answers(Array(7).fill(-1));
    setSection2Answers(Array(7).fill(-1));
    setSection3Answers(Array(6).fill(-1));
    setSection4Answers(Array(5).fill(-1));
    setReflectionAnswers(Array(4).fill(""));
    setJustSubmittedScore(null);
  };

  const getInterpretation = (score: number) => {
    if (score <= 25) return {
      range: "0–25",
      text: "You may be offering support without significant enabling patterns, but continued education and boundary clarity are important.",
      color: "text-green-600"
    };
    if (score <= 50) return {
      range: "26–50",
      text: "Some enabling behaviors are present. These likely come from fear or uncertainty rather than intention. Awareness is the first step.",
      color: "text-yellow-600"
    };
    if (score <= 75) return {
      range: "51–75",
      text: "Enabling patterns are significantly impacting both you and your loved one. Support, guidance, and boundary work are strongly recommended.",
      color: "text-orange-600"
    };
    return {
      range: "76–100",
      text: "Enabling behaviors are likely reinforcing the addiction and harming your well-being. This does not mean you are doing something wrong — it means you need support and a different approach.",
      color: "text-red-600"
    };
  };

  const getTrend = () => {
    if (pastResults.length < 2) return null;
    const diff = pastResults[1].total_score - pastResults[0].total_score;
    if (diff > 0) return { icon: TrendingDown, color: "text-green-600", label: `Down ${diff} points` };
    if (diff < 0) return { icon: TrendingUp, color: "text-red-600", label: `Up ${Math.abs(diff)} points` };
    return { icon: Minus, color: "text-muted-foreground", label: "No change" };
  };

  const renderQuestionSection = (
    title: string,
    description: string,
    questions: string[],
    answers: number[],
    setAnswers: (answers: number[]) => void
  ) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-logo-green">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">
        {questions.map((question, idx) => (
          <div key={idx} className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm mb-3">{question}</p>
            <div className="flex flex-wrap gap-2">
              {scoreOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={answers[idx] === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newAnswers = [...answers];
                    newAnswers[idx] = option.value;
                    setAnswers(newAnswers);
                  }}
                  className="text-xs"
                >
                  {option.value} - {option.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="mb-10 border-2 border-logo-green/50">
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl text-logo-green">Enabling Self-Assessment</CardTitle>
              <CardDescription>Understanding How Love, Fear, and Good Intentions Can Reinforce Addiction</CardDescription>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* History Toggle */}
          {pastResults.length > 0 && currentStep === 0 && (
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowHistory(!showHistory)}
                className="gap-2"
              >
                <History className="h-4 w-4" />
                {showHistory ? "Hide History" : "View Past Results"}
              </Button>
            </div>
          )}

          {/* Past Results History */}
          {showHistory && pastResults.length > 0 && currentStep === 0 && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-semibold mb-3">Your Assessment History</h4>
              <div className="space-y-2">
                {pastResults.map((result, idx) => {
                  const interp = getInterpretation(result.total_score);
                  return (
                    <div key={result.id} className="flex items-center justify-between p-3 bg-background rounded border">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(result.created_at), 'MMM d, yyyy')}
                        </span>
                        {idx === 0 && pastResults.length > 1 && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Latest</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${interp.color}`}>{result.total_score}/100</span>
                        {idx === 0 && getTrend() && (
                          <div className={`text-xs flex items-center gap-1 justify-end ${getTrend()!.color}`}>
                            {getTrend()!.label}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 0: Introduction */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-logo-green mb-2">Purpose</h4>
                <p className="text-sm text-muted-foreground">
                  This self-assessment is not about blame or shame. Enabling behaviors almost always come from love, fear, exhaustion, or a desire to keep things from getting worse. The goal of this assessment is to help you identify patterns, increase awareness, and begin shifting from reactive helping to healthy support.
                </p>
                <p className="text-sm font-medium mt-2 text-primary">Be honest. This is for you.</p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">How to Use This Assessment</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Read each statement carefully and answer based on what you actually do, not what you wish you did.
                </p>
                <div className="text-sm space-y-1">
                  <p><strong>0</strong> = Never</p>
                  <p><strong>1</strong> = Rarely</p>
                  <p><strong>2</strong> = Sometimes</p>
                  <p><strong>3</strong> = Often</p>
                  <p><strong>4</strong> = Almost Always</p>
                </div>
              </div>

              <Button onClick={() => setCurrentStep(1)} className="w-full">
                Begin Assessment
              </Button>
            </div>
          )}

          {/* Step 1: Section 1 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {renderQuestionSection(
                "Section 1: Emotional & Psychological Enabling",
                "Questions about emotional patterns and beliefs",
                section1Questions,
                section1Answers,
                setSection1Answers
              )}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>Back</Button>
                <Button onClick={() => setCurrentStep(2)} disabled={!isCurrentSectionComplete()}>
                  Next Section
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Section 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {renderQuestionSection(
                "Section 2: Behavioral Enabling",
                "Questions about actions and behaviors",
                section2Questions,
                section2Answers,
                setSection2Answers
              )}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                <Button onClick={() => setCurrentStep(3)} disabled={!isCurrentSectionComplete()}>
                  Next Section
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Section 3 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {renderQuestionSection(
                "Section 3: Control & Overfunctioning",
                "Questions about control and over-responsibility",
                section3Questions,
                section3Answers,
                setSection3Answers
              )}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
                <Button onClick={() => setCurrentStep(4)} disabled={!isCurrentSectionComplete()}>
                  Next Section
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Section 4 */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {renderQuestionSection(
                "Section 4: Impact on You",
                "Questions about how the situation affects you personally",
                section4Questions,
                section4Answers,
                setSection4Answers
              )}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>Back</Button>
                <Button onClick={() => setCurrentStep(5)} disabled={!isCurrentSectionComplete()}>
                  Continue to Reflection
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Reflection Questions */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-green">Reflection Questions</h3>
                <p className="text-sm text-muted-foreground">Take a few minutes to write brief responses. Do not skip this section.</p>
              </div>
              <div className="space-y-4">
                {reflectionQuestions.map((question, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="text-sm font-medium">{question}</label>
                    <Textarea
                      value={reflectionAnswers[idx]}
                      onChange={(e) => {
                        const newAnswers = [...reflectionAnswers];
                        newAnswers[idx] = e.target.value;
                        setReflectionAnswers(newAnswers);
                      }}
                      placeholder="Your response..."
                      rows={3}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(4)}>Back</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Submit & View Results"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Results */}
          {currentStep === 6 && justSubmittedScore !== null && (
            <div className="space-y-6">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Your Total Score</h3>
                <div className={`text-5xl font-bold ${getInterpretation(justSubmittedScore).color}`}>
                  {justSubmittedScore}/100
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <h4 className="font-semibold mb-2">Score Interpretation ({getInterpretation(justSubmittedScore).range})</h4>
                <p className={`text-sm ${getInterpretation(justSubmittedScore).color}`}>
                  {getInterpretation(justSubmittedScore).text}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground">Section 1</div>
                  <div className="font-bold">{calculateSectionScore(section1Answers)}/28</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground">Section 2</div>
                  <div className="font-bold">{calculateSectionScore(section2Answers)}/28</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground">Section 3</div>
                  <div className="font-bold">{calculateSectionScore(section3Answers)}/24</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground">Section 4</div>
                  <div className="font-bold">{calculateSectionScore(section4Answers)}/20</div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-logo-green mb-2">Important Reframe</h4>
                <p className="text-sm text-muted-foreground italic">
                  Enabling is not about loving too much. It's about loving in ways that no longer work.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Changing these patterns does not mean abandoning your loved one. It means giving them the dignity to experience reality — and giving yourself permission to recover as well.
                </p>
              </div>

              <Button onClick={resetAssessment} className="w-full">
                Take Assessment Again
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
