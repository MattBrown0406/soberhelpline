import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, FileText, History } from "lucide-react";
import { format } from "date-fns";
import ToolBrandHeader from "@/components/ToolBrandHeader";

interface WorksheetResult {
  id: string;
  created_at: string;
  part5_stop_doing: string | null;
  part5_start_doing: string | null;
  part5_boundary: string | null;
}

const cannotControlItems = [
  "My loved one's substance use or sobriety",
  "Their honesty, motivation, or willingness to change",
  "Their mental health symptoms when untreated",
  "Their reactions to my boundaries",
  "The timeline of recovery",
  "Whether they accept help or treatment",
  "The consequences of their past choices",
];

const canControlItems = [
  "My words, tone, and communication",
  "The boundaries I set and enforce",
  "Whether I enable or allow natural consequences",
  "How I respond to crises and chaos",
  "How I care for my physical and mental health",
  "Whether I seek support, education, or guidance",
  "The environment I allow in my home and life",
];

interface Props {
  user: User;
}

export default function ControlWorksheet({ user }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [pastWorksheets, setPastWorksheets] = useState<WorksheetResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Part 1
  const [part1Stress, setPart1Stress] = useState("");
  const [part1Managing, setPart1Managing] = useState("");
  const [part1Wellbeing, setPart1Wellbeing] = useState("");

  // Part 2
  const [part2Examples, setPart2Examples] = useState<string[]>(Array(7).fill(""));
  const [part2Hardest, setPart2Hardest] = useState("");
  const [part2Cost, setPart2Cost] = useState("");

  // Part 3
  const [part3Examples, setPart3Examples] = useState<string[]>(Array(7).fill(""));
  const [part3Reflection, setPart3Reflection] = useState("");

  // Part 4
  const [shift1Need, setShift1Need] = useState("");
  const [shift1Will, setShift1Will] = useState("");
  const [shift2If, setShift2If] = useState("");
  const [shift2Even, setShift2Even] = useState("");
  const [shift3Resp, setShift3Resp] = useState("");
  const [shift3My, setShift3My] = useState("");

  // Part 5
  const [part5Stop, setPart5Stop] = useState("");
  const [part5Start, setPart5Start] = useState("");
  const [part5Boundary, setPart5Boundary] = useState("");

  useEffect(() => {
    fetchPastWorksheets();
  }, [user]);

  const fetchPastWorksheets = async () => {
    const { data, error } = await supabase
      .from('family_control_worksheets')
      .select('id, created_at, part5_stop_doing, part5_start_doing, part5_boundary')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setPastWorksheets(data);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const { error } = await supabase.from('family_control_worksheets').insert({
      user_id: user.id,
      part1_stress: part1Stress,
      part1_managing: part1Managing,
      part1_wellbeing: part1Wellbeing,
      part2_examples: cannotControlItems.map((item, i) => ({ item, example: part2Examples[i] })),
      part2_reflection_hardest: part2Hardest,
      part2_reflection_cost: part2Cost,
      part3_examples: canControlItems.map((item, i) => ({ item, example: part3Examples[i] })),
      part3_reflection: part3Reflection,
      part4_shifts: [
        { need: shift1Need, will: shift1Will },
        { if_stmt: shift2If, even: shift2Even },
        { responsibility: shift3Resp, my: shift3My }
      ],
      part5_stop_doing: part5Stop,
      part5_start_doing: part5Start,
      part5_boundary: part5Boundary
    });

    if (error) {
      toast.error("Failed to save worksheet");
      console.error(error);
    } else {
      toast.success("Worksheet saved!");
      setCurrentStep(6);
      fetchPastWorksheets();
    }
    setIsSubmitting(false);
  };

  const resetWorksheet = () => {
    setCurrentStep(0);
    setPart1Stress("");
    setPart1Managing("");
    setPart1Wellbeing("");
    setPart2Examples(Array(7).fill(""));
    setPart2Hardest("");
    setPart2Cost("");
    setPart3Examples(Array(7).fill(""));
    setPart3Reflection("");
    setShift1Need("");
    setShift1Will("");
    setShift2If("");
    setShift2Even("");
    setShift3Resp("");
    setShift3My("");
    setPart5Stop("");
    setPart5Start("");
    setPart5Boundary("");
  };

  return (
    <Card className="mb-10">
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl text-logo-blue">What I Can Control vs. What I Can't</CardTitle>
              <CardDescription>Reclaiming Stability in the Midst of Addiction</CardDescription>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* History Toggle */}
          {pastWorksheets.length > 0 && currentStep === 0 && (
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowHistory(!showHistory)}
                className="gap-2"
              >
                <History className="h-4 w-4" />
                {showHistory ? "Hide History" : "View Past Worksheets"}
              </Button>
            </div>
          )}

          {/* Past Worksheets */}
          {showHistory && pastWorksheets.length > 0 && currentStep === 0 && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-semibold mb-3">Your Past Worksheets</h4>
              <div className="space-y-2">
                {pastWorksheets.map((ws) => (
                  <div key={ws.id} className="p-3 bg-background rounded border">
                    <div className="text-sm text-muted-foreground mb-2">
                      {format(new Date(ws.created_at), 'MMM d, yyyy')}
                    </div>
                    {ws.part5_boundary && (
                      <p className="text-sm">
                        <span className="font-medium">Commitment:</span> {ws.part5_boundary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 0: Introduction */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <ToolBrandHeader
                title="What I Can & Cannot Control"
                subtitle="One of the most painful parts of loving someone with addiction is feeling responsible for outcomes you do not control. This worksheet helps you separate responsibility from influence, reduce emotional burnout, and redirect energy toward what actually supports recovery — yours and theirs."
                clinicalNote="Rooted in the Serenity Prayer and evidence-based detachment principles from Al-Anon and CRAFT. This is not about giving up — it is about letting go of what was never yours to carry."
              />

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Instructions</h4>
                <p className="text-sm text-muted-foreground">
                  Complete this worksheet slowly and honestly. There are no right or wrong answers. The goal is clarity.
                </p>
              </div>

              <Button onClick={() => setCurrentStep(1)} className="w-full">
                Begin Worksheet
              </Button>
            </div>
          )}

          {/* Step 1: Part 1 - Reality Check */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-blue">Part 1: The Reality Check</h3>
                <p className="text-sm text-muted-foreground">Answer briefly</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    What is currently causing you the most stress or fear related to your loved one's addiction?
                  </label>
                  <Textarea
                    value={part1Stress}
                    onChange={(e) => setPart1Stress(e.target.value)}
                    placeholder="Your response..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    What do you find yourself trying to manage, fix, or prevent most often?
                  </label>
                  <Textarea
                    value={part1Managing}
                    onChange={(e) => setPart1Managing(e.target.value)}
                    placeholder="Your response..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    How has trying to control these things affected your well-being?
                  </label>
                  <Textarea
                    value={part1Wellbeing}
                    onChange={(e) => setPart1Wellbeing(e.target.value)}
                    placeholder="Your response..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>Back</Button>
                <Button onClick={() => setCurrentStep(2)}>Next: What I Cannot Control</Button>
              </div>
            </div>
          )}

          {/* Step 2: Part 2 - What I Cannot Control */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-blue">Part 2: What I Cannot Control</h3>
                <p className="text-sm text-muted-foreground">
                  These are areas that families commonly try to control — unsuccessfully. Write specific examples from your life.
                </p>
              </div>

              <div className="space-y-4">
                <p className="font-medium text-sm">I cannot control:</p>
                {cannotControlItems.map((item, idx) => (
                  <div key={idx} className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <p className="text-sm font-medium">{item}</p>
                    <Textarea
                      value={part2Examples[idx]}
                      onChange={(e) => {
                        const newExamples = [...part2Examples];
                        newExamples[idx] = e.target.value;
                        setPart2Examples(newExamples);
                      }}
                      placeholder="Examples from your life..."
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold">Reflection</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Which of these have you been trying to control the hardest?</label>
                  <Textarea
                    value={part2Hardest}
                    onChange={(e) => setPart2Hardest(e.target.value)}
                    placeholder="Your response..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">What has that cost you?</label>
                  <Textarea
                    value={part2Cost}
                    onChange={(e) => setPart2Cost(e.target.value)}
                    placeholder="Your response..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                <Button onClick={() => setCurrentStep(3)}>Next: What I Can Control</Button>
              </div>
            </div>
          )}

          {/* Step 3: Part 3 - What I Can Control */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-blue">Part 3: What I Can Control</h3>
                <p className="text-sm text-muted-foreground">
                  These are the areas where your choices genuinely matter.
                </p>
              </div>

              <div className="space-y-4">
                <p className="font-medium text-sm">I can control:</p>
                {canControlItems.map((item, idx) => (
                  <div key={idx} className="p-4 bg-primary/5 rounded-lg space-y-2">
                    <p className="text-sm font-medium">{item}</p>
                    <Textarea
                      value={part3Examples[idx]}
                      onChange={(e) => {
                        const newExamples = [...part3Examples];
                        newExamples[idx] = e.target.value;
                        setPart3Examples(newExamples);
                      }}
                      placeholder="Examples of how you can apply this..."
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold">Reflection</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Which of these have you been avoiding or neglecting? Why?</label>
                  <Textarea
                    value={part3Reflection}
                    onChange={(e) => setPart3Reflection(e.target.value)}
                    placeholder="Your response..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
                <Button onClick={() => setCurrentStep(4)}>Next: The Shift</Button>
              </div>
            </div>
          )}

          {/* Step 4: Part 4 - The Shift */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-blue">Part 4: The Shift</h3>
                <p className="text-sm text-muted-foreground">
                  For each item below, rewrite it as a control shift.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">Example:</p>
                <p className="text-sm text-muted-foreground">"I need them to stop using."</p>
                <p className="text-sm text-primary">→ "I will stop participating in behaviors that support their use."</p>
              </div>

              <div className="space-y-6">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">"I need them to</span>
                    <Textarea
                      value={shift1Need}
                      onChange={(e) => setShift1Need(e.target.value)}
                      placeholder="..."
                      rows={1}
                      className="flex-1"
                    />
                    <span className="text-sm">."</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary">→ "I will</span>
                    <Textarea
                      value={shift1Will}
                      onChange={(e) => setShift1Will(e.target.value)}
                      placeholder="..."
                      rows={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-primary">."</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">"If I don't intervene,</span>
                    <Textarea
                      value={shift2If}
                      onChange={(e) => setShift2If(e.target.value)}
                      placeholder="..."
                      rows={1}
                      className="flex-1"
                    />
                    <span className="text-sm">."</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary">→ "Even if I feel afraid, I will</span>
                    <Textarea
                      value={shift2Even}
                      onChange={(e) => setShift2Even(e.target.value)}
                      placeholder="..."
                      rows={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-primary">."</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">"It's my responsibility to</span>
                    <Textarea
                      value={shift3Resp}
                      onChange={(e) => setShift3Resp(e.target.value)}
                      placeholder="..."
                      rows={1}
                      className="flex-1"
                    />
                    <span className="text-sm">."</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary">→ "My responsibility is</span>
                    <Textarea
                      value={shift3My}
                      onChange={(e) => setShift3My(e.target.value)}
                      placeholder="..."
                      rows={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-primary">."</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>Back</Button>
                <Button onClick={() => setCurrentStep(5)}>Next: Commitment</Button>
              </div>
            </div>
          )}

          {/* Step 5: Part 5 - Commitment */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-blue">Part 5: Your Personal Commitment</h3>
                <p className="text-sm text-muted-foreground">Complete the statements</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    One thing I am willing to stop doing that is outside my control:
                  </label>
                  <Textarea
                    value={part5Stop}
                    onChange={(e) => setPart5Stop(e.target.value)}
                    placeholder="Your commitment..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    One thing I am willing to start doing that is within my control:
                  </label>
                  <Textarea
                    value={part5Start}
                    onChange={(e) => setPart5Start(e.target.value)}
                    placeholder="Your commitment..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    One boundary I will take seriously, even if it feels uncomfortable:
                  </label>
                  <Textarea
                    value={part5Boundary}
                    onChange={(e) => setPart5Boundary(e.target.value)}
                    placeholder="Your commitment..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(4)}>Back</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Worksheet"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Completion */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="text-xl font-semibold text-logo-blue mb-4">Worksheet Complete</h3>
                <p className="text-muted-foreground">
                  Your responses have been saved. You can return to this worksheet anytime to revisit your commitments or complete it again as your situation evolves.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-logo-blue mb-2">Important Reminder</h4>
                <p className="text-sm text-muted-foreground italic mb-3">
                  Letting go of control is not the same as giving up. It is choosing sanity, stability, and integrity over constant crisis management.
                </p>
                <div className="text-sm space-y-1">
                  <p className="font-medium">You did not cause the addiction.</p>
                  <p className="font-medium">You cannot control it.</p>
                  <p className="font-medium text-primary">But you can stop being controlled by it.</p>
                </div>
              </div>

              {part5Boundary && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Your Boundary Commitment</h4>
                  <p className="text-sm">{part5Boundary}</p>
                </div>
              )}

              <Button onClick={resetWorksheet} className="w-full">
                Start New Worksheet
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
