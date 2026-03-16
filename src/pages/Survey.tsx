import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle, ClipboardList } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";

interface SurveyQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options: unknown;
  display_order: number;
}

interface ActiveSurvey {
  id: string;
  title: string;
  description: string | null;
}

const Survey = () => {
  const [survey, setSurvey] = useState<ActiveSurvey | null>(null);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchActiveSurvey();
  }, []);

  const fetchActiveSurvey = async () => {
    try {
      const { data: surveyData, error: surveyError } = await supabase
        .from("surveys")
        .select("id, title, description")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

      if (surveyError) throw surveyError;
      if (!surveyData) {
        setLoading(false);
        return;
      }

      setSurvey(surveyData);

      const { data: questionData, error: questionError } = await supabase
        .from("survey_questions")
        .select("id, question_text, question_type, options, display_order")
        .eq("survey_id", surveyData.id)
        .order("display_order", { ascending: true });

      if (questionError) throw questionError;
      setQuestions(questionData || []);
    } catch (error) {
      console.error("Error loading survey:", error);
      toast.error("Could not load the survey");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!survey) return;

    // Check all questions answered
    const unanswered = questions.filter((q) => !answers[q.id]?.trim());
    if (unanswered.length > 0) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("survey_responses").insert({
        survey_id: survey.id,
        answers,
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading survey...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="Survey | SoberHelpline"
          description="Share your feedback on Monday Night Family Support meetings."
        />
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Thank You!</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Your feedback has been submitted anonymously.
          </p>
          <p className="text-sm text-muted-foreground">
            Your input helps us improve the Monday Night Family Support experience for everyone.
          </p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="Survey | SoberHelpline"
          description="Share your feedback on Monday Night Family Support meetings."
        />
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">No Active Survey</h1>
          <p className="text-muted-foreground">
            There's no survey available right now. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${survey.title} | SoberHelpline`}
        description="Share your feedback on Monday Night Family Support meetings."
      />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Breadcrumbs />

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <ClipboardList className="w-3.5 h-3.5" />
            Anonymous Feedback
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{survey.title}</h1>
          {survey.description && (
            <p className="text-muted-foreground max-w-xl mx-auto">{survey.description}</p>
          )}
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  {index + 1}. {question.question_text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {question.question_type === "rating" && (
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) =>
                      setAnswers((prev) => ({ ...prev, [question.id]: value }))
                    }
                    className="flex flex-wrap gap-3"
                  >
                    {[1, 2, 3, 4, 5].map((val) => (
                      <div key={val} className="flex items-center space-x-2">
                        <RadioGroupItem value={String(val)} id={`${question.id}-${val}`} />
                        <Label htmlFor={`${question.id}-${val}`} className="cursor-pointer text-sm">
                          {val} {val === 1 ? "(Poor)" : val === 5 ? "(Excellent)" : ""}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.question_type === "text" && (
                  <Textarea
                    placeholder="Type your response..."
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
                    }
                    className="min-h-[100px]"
                  />
                )}

                {question.question_type === "multiple_choice" && question.options && (
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) =>
                      setAnswers((prev) => ({ ...prev, [question.id]: value }))
                    }
                    className="space-y-2"
                  >
                    {(question.options as string[]).map((option, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-opt-${i}`} />
                        <Label htmlFor={`${question.id}-opt-${i}`} className="cursor-pointer text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {questions.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-10"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Your responses are completely anonymous.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Survey;
