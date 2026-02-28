import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, Heart, Compass, CheckCircle, AlertTriangle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

export default function ValuesAlignedDecisions() {
  useGuideTracking("/values-aligned-decisions", "Values-Aligned Decision Making");
  const [currentDecision, setCurrentDecision] = useState("");
  const [emotionChecks, setEmotionChecks] = useState<string[]>([]);
  const [loudestEmotion, setLoudestEmotion] = useState("");
  const [valueChecks, setValueChecks] = useState<string[]>([]);
  const [customValues, setCustomValues] = useState("");
  const [valueActions, setValueActions] = useState<Record<string, string>>({});
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [alignmentA, setAlignmentA] = useState({ supports: "", compromises: "", type: "" });
  const [alignmentB, setAlignmentB] = useState({ supports: "", compromises: "", type: "" });
  const [longTermInsights, setLongTermInsights] = useState("");
  const [chosenResponse, setChosenResponse] = useState("");
  const [whyChosen, setWhyChosen] = useState("");
  const [selfReminder, setSelfReminder] = useState("");
  const [boundaryStatement, setBoundaryStatement] = useState({ if: "", then: "" });

  const emotions = [
    "Fear", "Guilt", "Anxiety", "Shame", 
    "Anger", "Hope", "Exhaustion", "Pressure from others"
  ];

  const coreValues = [
    "Safety", "Honesty", "Responsibility", "Compassion", "Stability",
    "Integrity", "Respect", "Accountability", "Health", "Peace"
  ];

  const toggleEmotion = (item: string) => {
    setEmotionChecks(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleValue = (item: string) => {
    setValueChecks(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <>
      <Helmet>
        <title>Values-Aligned Decision Making Exercise | Sober Helpline</title>
        <meta name="description" content="An interactive exercise to help families make decisions that align with their values, not just their fears. Choose actions that reflect who you are." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/family-education"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Family Education
            </Link>

            <ToolBrandHeader
              title="Values-Aligned Decision Making Exercise"
              subtitle="Choosing actions that reflect who you are — not just what you're afraid of. An interactive tool for making decisions from clarity rather than crisis."
              clinicalNote="Informed by Acceptance and Commitment Therapy (ACT) and CRAFT principles. Decisions made from values lead to less regret and more sustainable boundaries."
            />

            {/* Why This Exercise Matters */}
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Why This Exercise Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families affected by addiction often make decisions:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• In crisis</li>
                  <li>• From fear</li>
                  <li>• From guilt</li>
                  <li>• To reduce immediate discomfort</li>
                </ul>
                <p className="text-muted-foreground">These decisions are understandable—but often leave families feeling:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Resentful</li>
                  <li>• Confused</li>
                  <li>• Disconnected from themselves</li>
                  <li>• Unsure if they did the "right" thing</li>
                </ul>
                <div className="bg-background p-4 rounded-lg border-l-4 border-primary">
                  <p className="font-medium">
                    This exercise helps families pause and ask a different question:
                  </p>
                  <p className="text-lg italic mt-2">
                    "What choice aligns with our values—even if the outcome is uncertain?"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Core Principle */}
            <Card className="mb-8 border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-xl text-amber-700 dark:text-amber-400">Core Principle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-medium">
                  <strong>Values</strong> guide behavior.<br />
                  <strong>Fear</strong> reacts to threat.
                </p>
                <p className="text-muted-foreground">Values-based decisions are:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-500" />
                    Calmer
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-500" />
                    Clearer
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-500" />
                    More consistent
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-500" />
                    More sustainable
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 1 */}
            <Card className="mb-6 border-2 border-blue-500/30">
              <CardHeader className="bg-blue-50 dark:bg-blue-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-blue-700 dark:text-blue-400">
                  Step 1: Identify the Current Decision
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">Describe the decision you are facing right now:</p>
                <Textarea 
                  placeholder="Examples: Providing financial help, allowing someone to stay in the home, enforcing a boundary, responding to a crisis, supporting or refusing a request..."
                  value={currentDecision}
                  onChange={(e) => setCurrentDecision(e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="mb-6 border-2 border-orange-500/30">
              <CardHeader className="bg-orange-50 dark:bg-orange-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-orange-700 dark:text-orange-400">
                  Step 2: Name the Emotions Driving the Urge to Act
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground mb-4">Check all that apply:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {emotions.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`emotion-${item}`}
                        checked={emotionChecks.includes(item)}
                        onCheckedChange={() => toggleEmotion(item)}
                      />
                      <Label htmlFor={`emotion-${item}`} className="text-muted-foreground cursor-pointer text-sm">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Label className="font-medium">Reflection: Which emotion feels loudest right now?</Label>
                  <Input 
                    className="mt-2"
                    placeholder="The loudest emotion is..."
                    value={loudestEmotion}
                    onChange={(e) => setLoudestEmotion(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="mb-6 border-2 border-emerald-500/30">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">
                  Step 3: Clarify Your Core Values
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground mb-4">Choose 3–5 values that matter most to you in this situation:</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {coreValues.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`value-${item}`}
                        checked={valueChecks.includes(item)}
                        onCheckedChange={() => toggleValue(item)}
                      />
                      <Label htmlFor={`value-${item}`} className="text-muted-foreground cursor-pointer text-sm">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Label className="text-muted-foreground">Write your own (if needed):</Label>
                  <Input 
                    className="mt-2"
                    placeholder="Other values important to you..."
                    value={customValues}
                    onChange={(e) => setCustomValues(e.target.value)}
                  />
                </div>
                <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    Values selected: <strong>{valueChecks.length}</strong> {valueChecks.length > 0 && `(${valueChecks.join(", ")})`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="mb-6 border-2 border-purple-500/30">
              <CardHeader className="bg-purple-50 dark:bg-purple-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-purple-700 dark:text-purple-400">
                  Step 4: Define What Each Value Looks Like in Action
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground mb-4">For each value chosen, describe what it looks like in action:</p>
                <div className="bg-muted/30 p-3 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Example:</strong><br />
                    Value: Safety<br />
                    In action: Not allowing substance use in the home.
                  </p>
                </div>
                {valueChecks.map((value) => (
                  <div key={value} className="p-4 bg-background border rounded-lg">
                    <Label className="font-medium">Value: {value}</Label>
                    <p className="text-sm text-muted-foreground mb-2">In action, this means:</p>
                    <Input 
                      placeholder={`What does ${value.toLowerCase()} look like in action?`}
                      value={valueActions[value] || ""}
                      onChange={(e) => setValueActions({...valueActions, [value]: e.target.value})}
                    />
                  </div>
                ))}
                {valueChecks.length === 0 && (
                  <p className="text-muted-foreground italic">Select values in Step 3 to define them here.</p>
                )}
              </CardContent>
            </Card>

            {/* Step 5 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-logo-green">
                  Step 5: Compare Possible Responses
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-4">
                <p className="text-muted-foreground mb-4">List two or three possible responses you're considering:</p>
                <div>
                  <Label>Option A:</Label>
                  <Textarea 
                    className="mt-2"
                    placeholder="First possible response..."
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Option B:</Label>
                  <Textarea 
                    className="mt-2"
                    placeholder="Second possible response..."
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Option C (if applicable):</Label>
                  <Textarea 
                    className="mt-2"
                    placeholder="Third possible response (optional)..."
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 6 */}
            <Card className="mb-6 border-2 border-rose-500/30">
              <CardHeader className="bg-rose-50 dark:bg-rose-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-rose-700 dark:text-rose-400">
                  Step 6: Values Alignment Check
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <p className="text-muted-foreground">For each option, answer honestly:</p>
                
                {optionA && (
                  <div className="p-4 bg-background border rounded-lg space-y-4">
                    <h4 className="font-semibold">Option A: {optionA.slice(0, 50)}...</h4>
                    <div>
                      <Label className="text-sm">Which values does this support?</Label>
                      <Input 
                        className="mt-1"
                        placeholder="Values supported..."
                        value={alignmentA.supports}
                        onChange={(e) => setAlignmentA({...alignmentA, supports: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Which values does this compromise?</Label>
                      <Input 
                        className="mt-1"
                        placeholder="Values compromised..."
                        value={alignmentA.compromises}
                        onChange={(e) => setAlignmentA({...alignmentA, compromises: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Does this reduce harm—or just reduce discomfort?</Label>
                      <RadioGroup 
                        value={alignmentA.type}
                        onValueChange={(val) => setAlignmentA({...alignmentA, type: val})}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="harm" id="a-harm" />
                          <Label htmlFor="a-harm">Reduces Harm</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="discomfort" id="a-discomfort" />
                          <Label htmlFor="a-discomfort">Reduces Discomfort</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {optionB && (
                  <div className="p-4 bg-background border rounded-lg space-y-4">
                    <h4 className="font-semibold">Option B: {optionB.slice(0, 50)}...</h4>
                    <div>
                      <Label className="text-sm">Which values does this support?</Label>
                      <Input 
                        className="mt-1"
                        placeholder="Values supported..."
                        value={alignmentB.supports}
                        onChange={(e) => setAlignmentB({...alignmentB, supports: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Which values does this compromise?</Label>
                      <Input 
                        className="mt-1"
                        placeholder="Values compromised..."
                        value={alignmentB.compromises}
                        onChange={(e) => setAlignmentB({...alignmentB, compromises: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Does this reduce harm—or just reduce discomfort?</Label>
                      <RadioGroup 
                        value={alignmentB.type}
                        onValueChange={(val) => setAlignmentB({...alignmentB, type: val})}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="harm" id="b-harm" />
                          <Label htmlFor="b-harm">Reduces Harm</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="discomfort" id="b-discomfort" />
                          <Label htmlFor="b-discomfort">Reduces Discomfort</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {!optionA && !optionB && (
                  <p className="text-muted-foreground italic">Enter options in Step 5 to evaluate them here.</p>
                )}
              </CardContent>
            </Card>

            {/* Step 7 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-logo-green flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Step 7: Long-Term Impact Reflection
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-4">
                <p className="text-muted-foreground mb-4">Ask yourself:</p>
                <ul className="space-y-2 ml-6 text-muted-foreground list-disc">
                  <li>If we repeat this choice for 6 months, what happens?</li>
                  <li>Does this protect family stability?</li>
                  <li>Does this increase clarity or chaos?</li>
                  <li>Does this require us to abandon ourselves?</li>
                </ul>
                <div className="mt-4">
                  <Label>Write any insights:</Label>
                  <Textarea 
                    className="mt-2"
                    placeholder="Your reflections on long-term impact..."
                    value={longTermInsights}
                    onChange={(e) => setLongTermInsights(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 8 */}
            <Card className="mb-6 border-2 border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20">
              <CardHeader>
                <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">
                  Step 8: Choose the Values-Aligned Response
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-4">
                <div>
                  <Label className="font-medium">Based on your reflections, the response that best aligns with our values is:</Label>
                  <Textarea 
                    className="mt-2"
                    placeholder="The values-aligned response..."
                    value={chosenResponse}
                    onChange={(e) => setChosenResponse(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Why this choice reflects who we want to be:</Label>
                  <Textarea 
                    className="mt-2"
                    placeholder="This reflects our values because..."
                    value={whyChosen}
                    onChange={(e) => setWhyChosen(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 9 */}
            <Card className="mb-6 border-amber-500/30">
              <CardHeader className="bg-amber-50 dark:bg-amber-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Step 9: Prepare for Emotional Aftermath (Very Important)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">Values-aligned choices often come with:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Guilt</li>
                  <li>• Pushback</li>
                  <li>• Fear</li>
                  <li>• Sadness</li>
                </ul>
                <div className="bg-background p-4 rounded-lg border-l-4 border-amber-500">
                  <p className="font-medium">
                    These emotions do not mean the decision was wrong.
                  </p>
                </div>
                <div>
                  <Label>Write what you will remind yourself when discomfort arises:</Label>
                  <Textarea 
                    className="mt-2"
                    placeholder="When I feel uncomfortable, I will remind myself that..."
                    value={selfReminder}
                    onChange={(e) => setSelfReminder(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 10 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg text-logo-green">
                  Step 10: Boundary or Action Statement (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-4">
                <p className="text-muted-foreground">If this decision involves a boundary, write it clearly and simply:</p>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <span className="font-medium whitespace-nowrap">"If</span>
                    <Input 
                      className="flex-1"
                      placeholder="specific behavior or situation..."
                      value={boundaryStatement.if}
                      onChange={(e) => setBoundaryStatement({...boundaryStatement, if: e.target.value})}
                    />
                    <span className="font-medium whitespace-nowrap">, then I will</span>
                    <Input 
                      className="flex-1"
                      placeholder="my response..."
                      value={boundaryStatement.then}
                      onChange={(e) => setBoundaryStatement({...boundaryStatement, then: e.target.value})}
                    />
                    <span className="font-medium">."</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A Grounding Reframe */}
            <Card className="mb-8 border-2 border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl text-primary">A Grounding Reframe for Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>Values-aligned decisions don't guarantee outcomes.</strong><br />
                  They guarantee integrity.
                </p>
                <div className="bg-background p-4 rounded-lg border-l-4 border-primary">
                  <p className="font-medium">
                    You cannot control how someone responds.<br />
                    You can control whether you recognize yourself in your choices.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* When to Use */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">When to Use This Exercise</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Before responding to requests
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    During relapse or crisis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    When guilt is driving decisions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    After repeated boundary collapse
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    When family members disagree
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-300 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-slate-700 dark:text-slate-300">Final Thought</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Families often ask:
                </p>
                <p className="text-lg italic text-muted-foreground">
                  "What if this is the wrong choice?"
                </p>
                <p className="text-muted-foreground">A better question is:</p>
                <div className="p-4 bg-background rounded-lg border-l-4 border-primary">
                  <p className="font-medium text-foreground">
                    "Is this choice aligned with who we want to be—even if it's hard?"
                  </p>
                  <p className="text-muted-foreground mt-2">
                    That answer rarely changes.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Suggested Companion Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Is This Help or Enabling? Decision Tree
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Guilt vs. Responsibility Module
                    </Button>
                  </Link>
                  <Link to="/boundaries-ultimatums">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Requests, Demands, Ultimatums & Boundaries
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Family Trauma & Hypervigilance Self-Assessment
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      What I Can Control Today (Guided Meditation)
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link to="/family-education">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Family Education
                </Button>
              </Link>
            </div>
          </div>
        
          <RelatedResources currentPath="/values-aligned-decisions" />
</main>
      </div>
    </>
  );
}
