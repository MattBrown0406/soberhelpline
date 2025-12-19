import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Shield, History } from "lucide-react";
import { format } from "date-fns";

interface WorksheetResult {
  id: string;
  created_at: string;
  boundary_statement: string | null;
  signed: boolean | null;
}

const difficultyOptions = [
  "Fear of conflict",
  "Fear of abandonment",
  "Guilt or shame",
  "Financial dependence",
  "Hope they will change without limits",
];

const emotionOptions = ["Anxiety", "Guilt", "Anger", "Sadness", "Relief", "Fear"];
const frequencyOptions = ["Occasionally", "Frequently", "Constantly"];
const pushbackOptions = ["Anger", "Manipulation", "Promises to change", "Blame", "Silence", "Crisis behavior"];
const supportMethodOptions = [
  "Review this worksheet",
  "Call a support person",
  "Watch a reminder video",
  "Attend a support group",
  "Coaching or professional support",
];

interface Props {
  user: User;
}

export default function BoundaryWorksheet({ user }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [pastWorksheets, setPastWorksheets] = useState<WorksheetResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Part 1
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [otherDifficulty, setOtherDifficulty] = useState("");
  const [emotion, setEmotion] = useState("");
  const [pastLimits, setPastLimits] = useState("");

  // Part 2
  const [problemBehavior, setProblemBehavior] = useState("");
  const [frequency, setFrequency] = useState("");
  const [impactEmotional, setImpactEmotional] = useState("");
  const [impactSafety, setImpactSafety] = useState("");
  const [impactFinances, setImpactFinances] = useState("");
  const [impactFamily, setImpactFamily] = useState("");

  // Part 3
  const [boundaryStatement, setBoundaryStatement] = useState("");

  // Part 4
  const [consequenceWilling, setConsequenceWilling] = useState<boolean | null>(null);
  const [consequenceAboutMe, setConsequenceAboutMe] = useState<boolean | null>(null);
  const [consequenceConsistent, setConsequenceConsistent] = useState<boolean | null>(null);
  const [revisedBoundary, setRevisedBoundary] = useState("");

  // Part 5
  const [pushbackResponses, setPushbackResponses] = useState<string[]>([]);
  const [pushbackFears, setPushbackFears] = useState("");
  const [calmResponse, setCalmResponse] = useState("");

  // Part 6
  const [supportPerson, setSupportPerson] = useState("");
  const [supportMethods, setSupportMethods] = useState<string[]>([]);
  const [warningSigns, setWarningSigns] = useState("");

  // Part 7
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    fetchPastWorksheets();
  }, [user]);

  const fetchPastWorksheets = async () => {
    const { data, error } = await supabase
      .from('family_boundary_worksheets')
      .select('id, created_at, boundary_statement, signed')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setPastWorksheets(data);
    }
  };

  const toggleArrayItem = (arr: string[], item: string, setArr: (arr: string[]) => void) => {
    if (arr.includes(item)) {
      setArr(arr.filter(i => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const { error } = await supabase.from('family_boundary_worksheets').insert({
      user_id: user.id,
      mindset_difficulties: difficulties,
      mindset_other: otherDifficulty,
      mindset_emotion: emotion,
      mindset_past_limits: pastLimits,
      problem_behavior: problemBehavior,
      problem_frequency: frequency,
      impact_emotional: impactEmotional,
      impact_safety: impactSafety,
      impact_finances: impactFinances,
      impact_family: impactFamily,
      boundary_statement: boundaryStatement,
      consequence_willing: consequenceWilling,
      consequence_about_me: consequenceAboutMe,
      consequence_consistent: consequenceConsistent,
      revised_boundary: revisedBoundary,
      pushback_responses: pushbackResponses,
      pushback_fears: pushbackFears,
      calm_response: calmResponse,
      support_person: supportPerson,
      support_methods: supportMethods,
      warning_signs: warningSigns,
      signed: signed,
      signed_at: signed ? new Date().toISOString() : null
    });

    if (error) {
      toast.error("Failed to save worksheet");
      console.error(error);
    } else {
      toast.success("Boundary worksheet saved!");
      setCurrentStep(8);
      fetchPastWorksheets();
    }
    setIsSubmitting(false);
  };

  const resetWorksheet = () => {
    setCurrentStep(0);
    setDifficulties([]);
    setOtherDifficulty("");
    setEmotion("");
    setPastLimits("");
    setProblemBehavior("");
    setFrequency("");
    setImpactEmotional("");
    setImpactSafety("");
    setImpactFinances("");
    setImpactFamily("");
    setBoundaryStatement("");
    setConsequenceWilling(null);
    setConsequenceAboutMe(null);
    setConsequenceConsistent(null);
    setRevisedBoundary("");
    setPushbackResponses([]);
    setPushbackFears("");
    setCalmResponse("");
    setSupportPerson("");
    setSupportMethods([]);
    setWarningSigns("");
    setSigned(false);
  };

  const needsRevision = consequenceWilling === false || consequenceAboutMe === false || consequenceConsistent === false;

  return (
    <Card className="mb-10">
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl text-logo-green">Boundary Setting Worksheet</CardTitle>
              <CardDescription>Protecting Recovery, Safety, and Sanity</CardDescription>
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
                {showHistory ? "Hide History" : "View Past Boundaries"}
              </Button>
            </div>
          )}

          {/* Past Worksheets */}
          {showHistory && pastWorksheets.length > 0 && currentStep === 0 && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-semibold mb-3">Your Past Boundary Worksheets</h4>
              <div className="space-y-2">
                {pastWorksheets.map((ws) => (
                  <div key={ws.id} className="p-3 bg-background rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(ws.created_at), 'MMM d, yyyy')}
                      </span>
                      {ws.signed && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Signed</span>
                      )}
                    </div>
                    {ws.boundary_statement && (
                      <p className="text-sm italic">"{ws.boundary_statement}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 0: Introduction */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-logo-green mb-2">Purpose</h4>
                <p className="text-sm text-muted-foreground">
                  Boundaries are not punishments, threats, or ultimatums. They are clear statements of what you will and will not participate in. This worksheet helps you define boundaries that are fair, enforceable, and grounded in self-respect rather than fear or anger.
                </p>
                <p className="text-sm font-medium mt-3 text-primary italic">
                  Boundaries are about your behavior, not controlling someone else's.
                </p>
              </div>

              <Button onClick={() => setCurrentStep(1)} className="w-full">
                Begin Worksheet
              </Button>
            </div>
          )}

          {/* Step 1: Part 1 - Mindset Check */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-green">Part 1: Boundary Mindset Check</h3>
                <p className="text-sm text-muted-foreground">Before writing any boundary, answer honestly</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">What makes boundaries difficult for you?</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {difficultyOptions.map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <Checkbox
                          checked={difficulties.includes(option)}
                          onCheckedChange={() => toggleArrayItem(difficulties, option, setDifficulties)}
                        />
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={otherDifficulty.length > 0}
                      onCheckedChange={() => {}}
                    />
                    <span className="text-sm">Other:</span>
                    <input
                      type="text"
                      value={otherDifficulty}
                      onChange={(e) => setOtherDifficulty(e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-sm bg-background"
                      placeholder="Specify..."
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    When you think about enforcing a boundary, what emotion comes up most strongly?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {emotionOptions.map((opt) => (
                      <Button
                        key={opt}
                        variant={emotion === opt ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEmotion(opt)}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    What has happened in the past when you set limits but did not follow through?
                  </label>
                  <Textarea
                    value={pastLimits}
                    onChange={(e) => setPastLimits(e.target.value)}
                    placeholder="Your response..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>Back</Button>
                <Button onClick={() => setCurrentStep(2)}>Next: Identify Problem</Button>
              </div>
            </div>
          )}

          {/* Step 2: Part 2 - Problem Behavior */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-green">Part 2: Identify the Problem Behavior</h3>
                <p className="text-sm text-muted-foreground">
                  Boundaries are responses to specific, repeated behaviors, not general frustrations.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    The behavior that is harming me or my household is:
                  </label>
                  <Textarea
                    value={problemBehavior}
                    onChange={(e) => setProblemBehavior(e.target.value)}
                    placeholder="Describe the specific behavior..."
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">How often does this behavior occur?</label>
                  <div className="flex flex-wrap gap-2">
                    {frequencyOptions.map((opt) => (
                      <Button
                        key={opt}
                        variant={frequency === opt ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFrequency(opt)}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-4">
                  <h4 className="font-semibold">How does this behavior impact:</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">My emotional health:</label>
                    <Textarea
                      value={impactEmotional}
                      onChange={(e) => setImpactEmotional(e.target.value)}
                      placeholder="Your response..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">My safety:</label>
                    <Textarea
                      value={impactSafety}
                      onChange={(e) => setImpactSafety(e.target.value)}
                      placeholder="Your response..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">My finances:</label>
                    <Textarea
                      value={impactFinances}
                      onChange={(e) => setImpactFinances(e.target.value)}
                      placeholder="Your response..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">My family or children:</label>
                    <Textarea
                      value={impactFamily}
                      onChange={(e) => setImpactFamily(e.target.value)}
                      placeholder="Your response..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                <Button onClick={() => setCurrentStep(3)}>Next: Clarify Boundary</Button>
              </div>
            </div>
          )}

          {/* Step 3: Part 3 - Clarify Boundary */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-green">Part 3: Clarify Your Boundary</h3>
                <p className="text-sm text-muted-foreground">
                  A healthy boundary is: Clear, Specific, Enforceable, About your actions
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Complete the sentence:</p>
                <p className="text-sm italic">"If this behavior continues, I will…"</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Boundary Statement:</label>
                <Textarea
                  value={boundaryStatement}
                  onChange={(e) => setBoundaryStatement(e.target.value)}
                  placeholder="If this behavior continues, I will..."
                  rows={3}
                />
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Examples (for reference only):</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>"If you continue to use substances in the home, I will ask you to leave."</li>
                  <li>"If you miss work due to substance use, I will not call in for you."</li>
                  <li>"If you ask for money while actively using, I will say no."</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
                <Button onClick={() => setCurrentStep(4)}>Next: Consequence</Button>
              </div>
            </div>
          )}

          {/* Step 4: Part 4 - Consequence */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-green">Part 4: Define the Consequence (Follow-Through)</h3>
                <p className="text-sm text-muted-foreground">
                  Consequences are not punishments. They are natural results of your boundary.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Is this consequence something I am truly willing to do?</span>
                    <div className="flex gap-2">
                      <Button
                        variant={consequenceWilling === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => setConsequenceWilling(true)}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={consequenceWilling === false ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setConsequenceWilling(false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Is this consequence about my behavior, not forcing theirs?</span>
                    <div className="flex gap-2">
                      <Button
                        variant={consequenceAboutMe === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => setConsequenceAboutMe(true)}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={consequenceAboutMe === false ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setConsequenceAboutMe(false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Have I enforced this boundary consistently in the past?</span>
                    <div className="flex gap-2">
                      <Button
                        variant={consequenceConsistent === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => setConsequenceConsistent(true)}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={consequenceConsistent === false ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setConsequenceConsistent(false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </div>

                {needsRevision && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg space-y-3">
                    <p className="text-sm font-medium text-destructive">
                      If you answered "No" to any of the above, revise the boundary.
                    </p>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Revised Boundary (if needed):</label>
                      <Textarea
                        value={revisedBoundary}
                        onChange={(e) => setRevisedBoundary(e.target.value)}
                        placeholder="Write a revised boundary that you can truly commit to..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>Back</Button>
                <Button onClick={() => setCurrentStep(5)}>Next: Anticipate Pushback</Button>
              </div>
            </div>
          )}

          {/* Step 5: Part 5 - Pushback */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-green">Part 5: Anticipate Pushback</h3>
                <p className="text-sm text-muted-foreground">
                  Boundaries often trigger emotional reactions. Prepare now.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">How might they respond?</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {pushbackOptions.map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <Checkbox
                          checked={pushbackResponses.includes(option)}
                          onCheckedChange={() => toggleArrayItem(pushbackResponses, option, setPushbackResponses)}
                        />
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">What thoughts or fears does this bring up for you?</label>
                  <Textarea
                    value={pushbackFears}
                    onChange={(e) => setPushbackFears(e.target.value)}
                    placeholder="Your response..."
                    rows={3}
                  />
                </div>

                <div className="p-4 bg-primary/5 rounded-lg space-y-3">
                  <p className="text-sm">
                    Write a calm, repeated response you can use without debate:
                  </p>
                  <p className="text-sm italic text-muted-foreground">
                    Example: "I understand this is hard. My boundary remains the same."
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Response:</label>
                    <Textarea
                      value={calmResponse}
                      onChange={(e) => setCalmResponse(e.target.value)}
                      placeholder="Your calm, repeated response..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(4)}>Back</Button>
                <Button onClick={() => setCurrentStep(6)}>Next: Support Plan</Button>
              </div>
            </div>
          )}

          {/* Step 6: Part 6 - Support Plan */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-green">Part 6: Boundary Support Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Boundaries are difficult to maintain alone.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Who knows about this boundary and can support you?</label>
                  <Textarea
                    value={supportPerson}
                    onChange={(e) => setSupportPerson(e.target.value)}
                    placeholder="Name(s) of support people..."
                    rows={2}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">What will help you stay consistent when guilt or fear shows up?</label>
                  <div className="space-y-2">
                    {supportMethodOptions.map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <Checkbox
                          checked={supportMethods.includes(option)}
                          onCheckedChange={() => toggleArrayItem(supportMethods, option, setSupportMethods)}
                        />
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">What warning signs tell you that you are about to abandon the boundary?</label>
                  <Textarea
                    value={warningSigns}
                    onChange={(e) => setWarningSigns(e.target.value)}
                    placeholder="Your warning signs..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(5)}>Back</Button>
                <Button onClick={() => setCurrentStep(7)}>Next: Commitment</Button>
              </div>
            </div>
          )}

          {/* Step 7: Part 7 - Commitment */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-logo-green">Part 7: Commitment</h3>
                <p className="text-sm text-muted-foreground">Read and sign</p>
              </div>

              <div className="p-6 border-2 rounded-lg bg-muted/30 space-y-4">
                <p className="text-sm italic text-center">
                  "I understand that boundaries are not about control, punishment, or abandonment.
                  They are about protecting safety, integrity, and the possibility of change."
                </p>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <Checkbox
                    checked={signed}
                    onCheckedChange={(checked) => setSigned(checked as boolean)}
                    id="signature"
                  />
                  <label htmlFor="signature" className="text-sm font-medium cursor-pointer">
                    I agree and commit to this boundary
                  </label>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Date: {format(new Date(), 'MMMM d, yyyy')}
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(6)}>Back</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting || !signed}>
                  {isSubmitting ? "Saving..." : "Save Worksheet"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 8: Completion */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="text-xl font-semibold text-logo-green mb-4">Boundary Worksheet Complete</h3>
                <p className="text-muted-foreground">
                  Your boundary has been documented and your commitment recorded.
                </p>
              </div>

              {boundaryStatement && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Your Boundary</h4>
                  <p className="text-sm italic">"{revisedBoundary || boundaryStatement}"</p>
                </div>
              )}

              {calmResponse && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Your Response When Challenged</h4>
                  <p className="text-sm italic">"{calmResponse}"</p>
                </div>
              )}

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-logo-green mb-2">Important Reminder</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Inconsistent boundaries teach people not to take you seriously.
                  <br />
                  Consistency teaches reality.
                </p>
                <div className="text-sm space-y-1">
                  <p className="font-medium">You are allowed to choose peace over chaos.</p>
                  <p className="font-medium text-primary">You are allowed to stop negotiating your own limits.</p>
                </div>
              </div>

              <Button onClick={resetWorksheet} className="w-full">
                Create Another Boundary
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
