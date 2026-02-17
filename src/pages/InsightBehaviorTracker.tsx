import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, Brain, CheckCircle, Eye, Activity, AlertTriangle, HelpCircle } from "lucide-react";
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

export default function InsightBehaviorTracker() {
  useGuideTracking("Insight vs. Behavior Tracker", "/insight-behavior-tracker");
  const [timeframe, setTimeframe] = useState("");
  const [insightChecks, setInsightChecks] = useState<string[]>([]);
  const [behaviorChecks, setBehaviorChecks] = useState<string[]>([]);
  const [insightNotes, setInsightNotes] = useState("");
  const [behaviorNotes, setBehaviorNotes] = useState("");
  const [patternResponses, setPatternResponses] = useState<Record<string, string>>({});
  const [familyResponseChecks, setFamilyResponseChecks] = useState<string[]>([]);
  const [boundaryReflection, setBoundaryReflection] = useState("");

  const insightIndicators = [
    "Acknowledges the impact of their behavior",
    "Expresses desire to change",
    "Talks about recovery or sobriety",
    "Identifies triggers or patterns",
    "Accepts feedback without defensiveness",
    "Expresses remorse",
    "Agrees with treatment recommendations",
    "Uses recovery language appropriately"
  ];

  const behaviorIndicators = [
    "Attends treatment or meetings consistently",
    "Follows through on agreed-upon commitments",
    "Maintains sobriety or harm-reduction goals",
    "Accepts boundaries without escalation",
    "Takes responsibility without blaming",
    "Demonstrates reliability (time, finances, communication)",
    "Engages in recovery supports independently",
    "Shows improved regulation under stress"
  ];

  const familyResponseIndicators = [
    "We relax boundaries after emotional conversations",
    "We increase trust based on insight alone",
    "We feel guilty holding limits when insight is present",
    "We hope insight means 'this time is different'",
    "We ignore behavior because insight feels sincere"
  ];

  const toggleInsight = (item: string) => {
    setInsightChecks(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleBehavior = (item: string) => {
    setBehaviorChecks(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleFamilyResponse = (item: string) => {
    setFamilyResponseChecks(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const getStageInterpretation = () => {
    const insightScore = insightChecks.length;
    const behaviorScore = behaviorChecks.length;
    const highThreshold = 5;
    const moderateThreshold = 3;

    if (insightScore >= highThreshold && behaviorScore < moderateThreshold) {
      return "high-insight-low-behavior";
    } else if (insightScore >= moderateThreshold && behaviorScore >= moderateThreshold && 
               insightScore < highThreshold && behaviorScore < highThreshold) {
      return "moderate-both";
    } else if (insightScore >= highThreshold && behaviorScore >= highThreshold) {
      return "consistent-both";
    } else if (insightScore < moderateThreshold && behaviorScore < moderateThreshold) {
      return "low-both";
    }
    return null;
  };

  const stage = getStageInterpretation();

  return (
    <>
      <Helmet>
        <title>Insight vs. Behavior Tracker | Sober Helpline</title>
        <meta name="description" content="Track promises vs patterns to measure real progress. An interactive tool for families to distinguish between insight and behavioral change." />
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

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-10 w-10 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green">
                  Insight vs. Behavior Tracker
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Promises vs Patterns: How to Measure Progress Without Relying on Promises
              </p>
            </div>

            {/* Why This Tracker Matters */}
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Why This Tracker Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families are often encouraged by:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Insightful conversations</li>
                  <li>• Apologies</li>
                  <li>• Emotional honesty</li>
                  <li>• Agreement with treatment plans</li>
                </ul>
                <p className="text-muted-foreground">
                  And then feel blindsided when behavior doesn't change.
                </p>
                <div className="bg-background p-4 rounded-lg border-l-4 border-primary">
                  <p className="font-medium">
                    <strong>Insight</strong> is awareness.<br />
                    <strong>Behavior</strong> is change.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Both matter—but they are not the same.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How to Use */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">How to Use This Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                    Track what is said and what is done side by side
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                    Focus on patterns over time, not single incidents
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                    Use this tool for your clarity, not confrontation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                    Review weekly or monthly—not daily in crisis
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4 italic">
                  This is not a report card. It is a reality check.
                </p>
              </CardContent>
            </Card>

            {/* Timeframe Input */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg text-logo-green">Assessment Timeframe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Tracking over the past</span>
                  <Input 
                    type="text" 
                    placeholder="2" 
                    className="w-20"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  />
                  <span className="text-muted-foreground">weeks</span>
                </div>
              </CardContent>
            </Card>

            {/* Section 1: Insight Indicators */}
            <Card className="mb-8 border-2 border-blue-500/30">
              <CardHeader className="bg-blue-50 dark:bg-blue-950/30 rounded-t-lg">
                <CardTitle className="text-xl text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Section 1: Insight Indicators (What Is Being Said)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground mb-4">
                  Check all that apply over the past {timeframe || "___"} weeks:
                </p>
                <div className="space-y-3">
                  {insightIndicators.map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <Checkbox 
                        id={`insight-${item}`}
                        checked={insightChecks.includes(item)}
                        onCheckedChange={() => toggleInsight(item)}
                      />
                      <Label htmlFor={`insight-${item}`} className="text-muted-foreground cursor-pointer">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Label className="text-muted-foreground">Notes on Insight (optional):</Label>
                  <Textarea 
                    className="mt-2"
                    placeholder="Any observations about insight patterns..."
                    value={insightNotes}
                    onChange={(e) => setInsightNotes(e.target.value)}
                  />
                </div>
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Insight Score: <strong>{insightChecks.length}</strong> of {insightIndicators.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Behavior Indicators */}
            <Card className="mb-8 border-2 border-emerald-500/30">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950/30 rounded-t-lg">
                <CardTitle className="text-xl text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Section 2: Behavior Indicators (What Is Actually Happening)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground mb-4">
                  Check all that apply over the same time period:
                </p>
                <div className="space-y-3">
                  {behaviorIndicators.map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <Checkbox 
                        id={`behavior-${item}`}
                        checked={behaviorChecks.includes(item)}
                        onCheckedChange={() => toggleBehavior(item)}
                      />
                      <Label htmlFor={`behavior-${item}`} className="text-muted-foreground cursor-pointer">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Label className="text-muted-foreground">Notes on Behavior (optional):</Label>
                  <Textarea 
                    className="mt-2"
                    placeholder="Any observations about behavior patterns..."
                    value={behaviorNotes}
                    onChange={(e) => setBehaviorNotes(e.target.value)}
                  />
                </div>
                <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    Behavior Score: <strong>{behaviorChecks.length}</strong> of {behaviorIndicators.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Pattern Comparison */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Section 3: Pattern Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground italic">Answer honestly—no fixing required.</p>
                
                <div className="space-y-6">
                  <div>
                    <p className="font-medium mb-3">Does insight increase before behavior changes?</p>
                    <RadioGroup 
                      value={patternResponses.q1 || ""}
                      onValueChange={(val) => setPatternResponses({...patternResponses, q1: val})}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="q1-yes" />
                        <Label htmlFor="q1-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="q1-no" />
                        <Label htmlFor="q1-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sometimes" id="q1-sometimes" />
                        <Label htmlFor="q1-sometimes">Sometimes</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <p className="font-medium mb-3">Does insight remain high even when behavior regresses?</p>
                    <RadioGroup 
                      value={patternResponses.q2 || ""}
                      onValueChange={(val) => setPatternResponses({...patternResponses, q2: val})}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="q2-yes" />
                        <Label htmlFor="q2-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="q2-no" />
                        <Label htmlFor="q2-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <p className="font-medium mb-3">Are promises followed by consistent action?</p>
                    <RadioGroup 
                      value={patternResponses.q3 || ""}
                      onValueChange={(val) => setPatternResponses({...patternResponses, q3: val})}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="q3-yes" />
                        <Label htmlFor="q3-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="q3-no" />
                        <Label htmlFor="q3-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="occasionally" id="q3-occasionally" />
                        <Label htmlFor="q3-occasionally">Occasionally</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <p className="font-medium mb-3">Does stress cause insight to collapse into old behavior?</p>
                    <RadioGroup 
                      value={patternResponses.q4 || ""}
                      onValueChange={(val) => setPatternResponses({...patternResponses, q4: val})}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="q4-yes" />
                        <Label htmlFor="q4-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="q4-no" />
                        <Label htmlFor="q4-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <p className="font-medium mb-3">Are we adjusting boundaries based on insight—or behavior?</p>
                    <RadioGroup 
                      value={patternResponses.q5 || ""}
                      onValueChange={(val) => setPatternResponses({...patternResponses, q5: val})}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="insight" id="q5-insight" />
                        <Label htmlFor="q5-insight">Insight</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="behavior" id="q5-behavior" />
                        <Label htmlFor="q5-behavior">Behavior</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="q5-both" />
                        <Label htmlFor="q5-both">Both</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Family Response Check */}
            <Card className="mb-8 border-amber-500/30">
              <CardHeader className="bg-amber-50 dark:bg-amber-950/30 rounded-t-lg">
                <CardTitle className="text-xl text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Section 4: Family Response Check
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground mb-4">Check any that apply:</p>
                <div className="space-y-3">
                  {familyResponseIndicators.map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <Checkbox 
                        id={`family-${item}`}
                        checked={familyResponseChecks.includes(item)}
                        onCheckedChange={() => toggleFamilyResponse(item)}
                      />
                      <Label htmlFor={`family-${item}`} className="text-muted-foreground cursor-pointer">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Label className="font-medium">Reflection:</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    What boundary or structure might need to stay in place longer—regardless of insight?
                  </p>
                  <Textarea 
                    placeholder="Write your reflection here..."
                    value={boundaryReflection}
                    onChange={(e) => setBoundaryReflection(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 5: Stage-Based Interpretation */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">Section 5: Stage-Based Interpretation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground italic mb-6">
                  Use this guide—not as a verdict, but as context.
                </p>
                
                <div className={`p-4 rounded-lg border-2 ${stage === "high-insight-low-behavior" ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30" : "border-muted bg-muted/20"}`}>
                  <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">High Insight + Low Behavior</h4>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Common in early recovery or active addiction</li>
                    <li>• Indicates awareness without capacity</li>
                    <li>• Structure and boundaries still needed</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg border-2 ${stage === "moderate-both" ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-muted bg-muted/20"}`}>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Moderate Insight + Moderate Behavior</h4>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Indicates early stabilization</li>
                    <li>• Progress is fragile</li>
                    <li>• Avoid increasing freedom too quickly</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg border-2 ${stage === "consistent-both" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : "border-muted bg-muted/20"}`}>
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Consistent Insight + Consistent Behavior</h4>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Indicates readiness for increased responsibility</li>
                    <li>• Trust can be rebuilt gradually</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg border-2 ${stage === "low-both" ? "border-red-500 bg-red-50 dark:bg-red-950/30" : "border-muted bg-muted/20"}`}>
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Low Insight + Low Behavior</h4>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Indicates resistance or instability</li>
                    <li>• Focus on safety, structure, and boundaries</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 6: Family Grounding Questions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Section 6: Family Grounding Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic mb-4">Answer privately:</p>
                <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                  <li>Are we responding to words—or patterns?</li>
                  <li>Are we changing expectations based on behavior?</li>
                  <li>What would consistency look like over the next 30 days?</li>
                  <li>What boundary protects us regardless of insight?</li>
                  <li>What are we afraid will happen if we wait for behavior?</li>
                </ol>
              </CardContent>
            </Card>

            {/* A Necessary Reframe */}
            <Card className="mb-8 border-2 border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl text-primary">A Necessary Reframe for Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>Insight is encouraging—but it is not proof.</strong>
                </p>
                <p className="text-muted-foreground">
                  Behavior is not perfection.<br />
                  It is consistency over time.
                </p>
                <div className="bg-background p-4 rounded-lg border-l-4 border-primary">
                  <p className="font-medium">
                    Waiting for behavior is not punishment.<br />
                    It is self-protection.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What This Tracker Helps Prevent */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">What This Tracker Helps Prevent</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    False hope cycles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Boundary collapse
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Emotional whiplash
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Guilt-driven decisions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Repeated disappointment
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4 font-medium">
                  It replaces reaction with measured response.
                </p>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-300 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-slate-700 dark:text-slate-300">Final Thought</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Families don't fail because they believe insight.<br />
                  They struggle because they're told believing insight equals support.
                </p>
                <p className="text-muted-foreground">True support looks like:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Listening without arguing</li>
                  <li>• Acknowledging insight</li>
                  <li>• Holding boundaries until behavior matches</li>
                  <li>• Letting patterns—not promises—guide decisions</li>
                </ul>
                <div className="p-4 bg-background rounded-lg border-l-4 border-primary mt-4">
                  <p className="font-medium text-foreground">
                    Hope becomes sustainable when it's grounded in behavior.
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
                  <Link to="/boundaries-ultimatums">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Requests, Demands, Ultimatums & Boundaries
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Enabling Self-Assessment
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      What I Can Control Today (Guided Meditation)
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Family Trauma & Hypervigilance Self-Assessment
                    </Button>
                  </Link>
                  <Link to="/family-action-plan">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Family Recovery Action Plan
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
        </main>
      </div>
    </>
  );
}
