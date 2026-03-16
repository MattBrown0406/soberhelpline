import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, Eye, Send, BarChart3, ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Survey {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

interface SurveyQuestion {
  id: string;
  survey_id: string;
  question_text: string;
  question_type: string;
  options: unknown;
  is_standard: boolean;
  display_order: number;
}

interface SurveyResponse {
  id: string;
  survey_id: string;
  answers: Record<string, string> | unknown;
  submitted_at: string;
}

const STANDARD_QUESTIONS = [
  { text: "How would you rate tonight's meeting overall?", type: "rating" as const },
  { text: "How safe and supported did you feel sharing?", type: "rating" as const },
  { text: "How relevant were the topics discussed to your situation?", type: "rating" as const },
  { text: "What was the most helpful part of tonight's meeting?", type: "text" as const },
  { text: "What topics would you like covered in future meetings?", type: "text" as const },
  { text: "Any suggestions for improving the meeting experience?", type: "text" as const },
];

export const SurveyManagement = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Create survey form
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [includeStandard, setIncludeStandard] = useState(true);
  const [customQuestions, setCustomQuestions] = useState<Array<{ text: string; type: string; options: string[] }>>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, []);

  useEffect(() => {
    if (selectedSurvey) {
      fetchQuestionsAndResponses(selectedSurvey);
    }
  }, [selectedSurvey]);

  const fetchSurveys = async () => {
    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load surveys");
      return;
    }
    setSurveys(data || []);
    if (data && data.length > 0 && !selectedSurvey) {
      setSelectedSurvey(data[0].id);
    }
    setLoading(false);
  };

  const fetchQuestionsAndResponses = async (surveyId: string) => {
    const [qRes, rRes] = await Promise.all([
      supabase
        .from("survey_questions")
        .select("*")
        .eq("survey_id", surveyId)
        .order("display_order"),
      supabase
        .from("survey_responses")
        .select("*")
        .eq("survey_id", surveyId)
        .order("submitted_at", { ascending: false }),
    ]);

    if (qRes.error) toast.error("Failed to load questions");
    if (rRes.error) toast.error("Failed to load responses");

    setQuestions(qRes.data || []);
    setResponses(rRes.data || []);
  };

  const createSurvey = async () => {
    if (!newTitle.trim()) {
      toast.error("Please enter a survey title");
      return;
    }

    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Deactivate any currently active survey
      await supabase.from("surveys").update({ is_active: false }).eq("is_active", true);

      const { data: survey, error: surveyError } = await supabase
        .from("surveys")
        .insert({
          title: newTitle,
          description: newDescription || null,
          is_active: true,
          created_by: user.id,
        })
        .select()
        .single();

      if (surveyError) throw surveyError;

      // Insert standard questions
      const allQuestions: Array<{
        survey_id: string;
        question_text: string;
        question_type: string;
        is_standard: boolean;
        display_order: number;
        options: string[] | null;
      }> = [];

      let order = 0;
      if (includeStandard) {
        STANDARD_QUESTIONS.forEach((q) => {
          allQuestions.push({
            survey_id: survey.id,
            question_text: q.text,
            question_type: q.type,
            is_standard: true,
            display_order: order++,
            options: null,
          });
        });
      }

      // Insert custom questions
      customQuestions.forEach((q) => {
        allQuestions.push({
          survey_id: survey.id,
          question_text: q.text,
          question_type: q.type,
          is_standard: false,
          display_order: order++,
          options: q.type === "multiple_choice" ? q.options : null,
        });
      });

      if (allQuestions.length > 0) {
        const { error: qError } = await supabase.from("survey_questions").insert(allQuestions);
        if (qError) throw qError;
      }

      toast.success("Survey created and activated!");
      setNewTitle("");
      setNewDescription("");
      setCustomQuestions([]);
      setSelectedSurvey(survey.id);
      fetchSurveys();
    } catch (error) {
      console.error("Error creating survey:", error);
      toast.error("Failed to create survey");
    } finally {
      setCreating(false);
    }
  };

  const toggleSurveyActive = async (surveyId: string, active: boolean) => {
    if (active) {
      // Deactivate all first
      await supabase.from("surveys").update({ is_active: false }).eq("is_active", true);
    }
    const { error } = await supabase.from("surveys").update({ is_active: active }).eq("id", surveyId);
    if (error) {
      toast.error("Failed to update survey status");
      return;
    }
    toast.success(active ? "Survey activated" : "Survey deactivated");
    fetchSurveys();
  };

  const sendSurveyEmails = async () => {
    if (!selectedSurvey) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-survey-emails", {
        body: { survey_id: selectedSurvey },
      });

      if (error) throw error;
      toast.success(`Survey emails sent to ${data?.sent_count || 0} participants`);
    } catch (error) {
      console.error("Error sending survey emails:", error);
      toast.error("Failed to send survey emails");
    } finally {
      setSending(false);
    }
  };

  const addCustomQuestion = () => {
    setCustomQuestions((prev) => [...prev, { text: "", type: "text", options: [] }]);
  };

  const removeCustomQuestion = (index: number) => {
    setCustomQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCustomQuestion = (index: number, field: string, value: string | string[]) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  // Compute aggregated results for rating questions
  const getRatingStats = (questionId: string) => {
    const vals = responses
      .map((r) => Number((r.answers as Record<string, string>)[questionId]))
      .filter((v) => !isNaN(v));
    if (vals.length === 0) return { avg: 0, count: 0, distribution: {} as Record<number, number> };
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const distribution: Record<number, number> = {};
    vals.forEach((v) => { distribution[v] = (distribution[v] || 0) + 1; });
    return { avg: Math.round(avg * 10) / 10, count: vals.length, distribution };
  };

  const getTextResponses = (questionId: string) => {
    return responses
      .map((r) => (r.answers as Record<string, string>)[questionId])
      .filter((v) => v && v.trim());
  };

  const getMultipleChoiceStats = (questionId: string) => {
    const counts: Record<string, number> = {};
    responses.forEach((r) => {
      const val = (r.answers as Record<string, string>)[questionId];
      if (val) counts[val] = (counts[val] || 0) + 1;
    });
    return counts;
  };

  if (loading) return <div className="text-muted-foreground">Loading surveys...</div>;

  return (
    <Tabs defaultValue="results" className="space-y-6">
      <TabsList>
        <TabsTrigger value="results">Survey Results</TabsTrigger>
        <TabsTrigger value="create">Create Survey</TabsTrigger>
        <TabsTrigger value="manage">Manage Surveys</TabsTrigger>
      </TabsList>

      {/* RESULTS TAB */}
      <TabsContent value="results">
        {surveys.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No surveys created yet.</p>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Select value={selectedSurvey || ""} onValueChange={setSelectedSurvey}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a survey" />
                </SelectTrigger>
                <SelectContent>
                  {surveys.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title} {s.is_active && "✅"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary">{responses.length} responses</Badge>
            </div>

            {selectedSurvey && questions.length > 0 && (
              <div className="space-y-6">
                {questions.map((q) => (
                  <Card key={q.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        {q.question_text}
                        <Badge variant="outline" className="text-xs">{q.question_type}</Badge>
                        {q.is_standard && <Badge variant="secondary" className="text-xs">Standard</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {q.question_type === "rating" && (() => {
                        const stats = getRatingStats(q.id);
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              <span className="text-3xl font-bold text-primary">{stats.avg}</span>
                              <span className="text-sm text-muted-foreground">/ 5 avg ({stats.count} responses)</span>
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((val) => {
                                const count = stats.distribution[val] || 0;
                                const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
                                return (
                                  <div key={val} className="flex-1 text-center">
                                    <div className="h-16 bg-muted rounded-t relative overflow-hidden">
                                      <div
                                        className="absolute bottom-0 left-0 right-0 bg-primary/60 rounded-t transition-all"
                                        style={{ height: `${pct}%` }}
                                      />
                                    </div>
                                    <div className="text-xs mt-1 text-muted-foreground">{val}</div>
                                    <div className="text-xs font-medium">{count}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {q.question_type === "text" && (() => {
                        const texts = getTextResponses(q.id);
                        return (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {texts.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No responses yet</p>
                            ) : (
                              texts.map((t, i) => (
                                <div key={i} className="text-sm bg-muted/50 rounded-lg p-3 border">
                                  "{t}"
                                </div>
                              ))
                            )}
                          </div>
                        );
                      })()}

                      {q.question_type === "multiple_choice" && (() => {
                        const counts = getMultipleChoiceStats(q.id);
                        const total = Object.values(counts).reduce((a, b) => a + b, 0);
                        return (
                          <div className="space-y-2">
                            {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([option, count]) => (
                              <div key={option} className="flex items-center gap-3">
                                <div className="flex-1">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>{option}</span>
                                    <span className="text-muted-foreground">{count} ({total > 0 ? Math.round((count / total) * 100) : 0}%)</span>
                                  </div>
                                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary/60 rounded-full"
                                      style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            {Object.keys(counts).length === 0 && (
                              <p className="text-sm text-muted-foreground">No responses yet</p>
                            )}
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </TabsContent>

      {/* CREATE TAB */}
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create New Monthly Survey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Survey Title</Label>
              <Input
                placeholder="e.g., March 2026 Meeting Feedback"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                placeholder="Brief description shown to participants..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Include Standard Questions</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  6 recurring questions about meeting quality, safety, and topics
                </p>
              </div>
              <Switch checked={includeStandard} onCheckedChange={setIncludeStandard} />
            </div>

            {includeStandard && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Standard Questions Preview</p>
                {STANDARD_QUESTIONS.map((q, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs shrink-0">{q.type}</Badge>
                    <span>{q.text}</span>
                  </div>
                ))}
              </div>
            )}

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Custom Questions</Label>
                <Button variant="outline" size="sm" onClick={addCustomQuestion} className="gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  Add Question
                </Button>
              </div>

              {customQuestions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No custom questions added yet.
                </p>
              )}

              <div className="space-y-4">
                {customQuestions.map((q, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Question text..."
                          value={q.text}
                          onChange={(e) => updateCustomQuestion(index, "text", e.target.value)}
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeCustomQuestion(index)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <Select
                      value={q.type}
                      onValueChange={(val) => updateCustomQuestion(index, "type", val)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Rating (1-5)</SelectItem>
                        <SelectItem value="text">Free Text</SelectItem>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      </SelectContent>
                    </Select>

                    {q.type === "multiple_choice" && (
                      <div className="space-y-2 pl-2">
                        <Label className="text-xs">Options (comma-separated)</Label>
                        <Input
                          placeholder="Option A, Option B, Option C"
                          value={q.options.join(", ")}
                          onChange={(e) =>
                            updateCustomQuestion(
                              index,
                              "options",
                              e.target.value.split(",").map((o) => o.trim()).filter(Boolean)
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <Button onClick={createSurvey} disabled={creating} className="w-full gap-2">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {creating ? "Creating..." : "Create & Activate Survey"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Creating a new survey will deactivate any currently active survey.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      {/* MANAGE TAB */}
      <TabsContent value="manage">
        <div className="space-y-4">
          {surveys.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.title}</span>
                    {s.is_active && <Badge className="bg-primary">Active</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created {new Date(s.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSurvey(s.id)}
                    className="gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendSurveyEmails()}
                    disabled={sending || !s.is_active}
                    className="gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Email
                  </Button>
                  <Switch
                    checked={s.is_active}
                    onCheckedChange={(active) => toggleSurveyActive(s.id, active)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {surveys.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No surveys created yet. Go to the "Create Survey" tab to get started.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
