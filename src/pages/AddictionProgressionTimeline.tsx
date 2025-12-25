import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Clock, AlertTriangle, TrendingUp, Flame, RotateCcw, Split, PenLine, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const AddictionProgressionTimeline = () => {
  const handlePrint = () => {
    window.print();
  };

  const [timeline, setTimeline] = useState({
    firstChange: "",
    escalation: "",
    firstConsequence: "",
    firstTreatment: "",
    currentStage: "",
  });

  const [responses, setResponses] = useState({
    whatTried: "",
    whatHoped: "",
    whatHappened: "",
  });

  const [patterns, setPatterns] = useState({
    effortNoResults: "",
    boundariesMissing: "",
    structureHelped: "",
  });

  const [present, setPresent] = useState({
    currentStage: "",
    neededNow: "",
    notWorking: "",
  });

  return (
    <Layout>
      <Helmet>
        <title>Addiction Progression Timeline | Family First Intervention</title>
        <meta 
          name="description" 
          content="Understand addiction as a process, not a series of failures. Learn to recognize the stages of addiction progression and make better decisions." 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link to="/family-education">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Family Education
            </Button>
          </Link>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Guide
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Addiction Progression Timeline
          </h1>
          <p className="text-xl text-muted-foreground">
            Understanding Addiction as a Process, Not a Series of Failures
          </p>
        </div>

        {/* Why Families Need This */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Why Families Need This Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Families often replay the past with painful questions:</p>
            <ul className="space-y-1 ml-4 italic text-muted-foreground">
              <li>"How did we miss this?"</li>
              <li>"When did it get this bad?"</li>
              <li>"What should we have done differently?"</li>
            </ul>
            <p>These questions create guilt—but not insight.</p>
            <p className="font-medium">
              Addiction does not usually appear suddenly. It progresses in predictable stages, often quietly at first.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium mb-2">This timeline helps families:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>See addiction as a process</li>
                <li>Recognize patterns without self-blame</li>
                <li>Understand why early strategies stopped working</li>
                <li>Make better decisions going forward</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* The Core Concept */}
        <Card className="mb-6 border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle>The Core Concept</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="font-semibold text-lg">
              Addiction progresses—even when families are trying hard.
            </p>
            <ul className="space-y-1 text-muted-foreground">
              <li>Effort does not stop progression.</li>
              <li>Awareness does not stop progression.</li>
              <li>Love does not stop progression.</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-semibold text-primary">
                Structure, boundaries, and treatment interrupt progression.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stage 1 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              STAGE 1: Early Use & Subtle Shifts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What This Stage Often Looks Like</h4>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Increased use during stress</li>
                <li>Mood changes or irritability</li>
                <li>Defensiveness about use</li>
                <li>Rationalizations ("It helps me relax")</li>
                <li>Slight changes in routines or priorities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Why Families Miss It</h4>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Behavior still looks "normal"</li>
                <li>Functioning appears intact</li>
                <li>Excuses feel reasonable</li>
                <li>Hope overrides concern</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <p className="font-medium text-blue-700 dark:text-blue-400">
                Key Insight: This stage is rarely alarming—until later, in hindsight.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stage 2 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              STAGE 2: Escalation & Behavioral Changes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Common Signs</h4>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Increased frequency or intensity of use</li>
                <li>Secrecy or lying</li>
                <li>Missed responsibilities</li>
                <li>Personality changes</li>
                <li>Conflict around use</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Family Response at This Stage</h4>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Conversations</li>
                <li>Warnings</li>
                <li>Bargaining</li>
                <li>Increased monitoring</li>
              </ul>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
              <p className="font-medium text-yellow-700 dark:text-yellow-400">
                Why These Stop Working: Logic and concern cannot override impaired reward systems.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stage 3 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              STAGE 3: Consequences & Attempts to Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Common Signs</h4>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Work, school, or legal consequences</li>
                <li>Financial strain</li>
                <li>Relationship damage</li>
                <li>Promises to change</li>
                <li>Short periods of improvement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Family Pattern</h4>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Relief after promises</li>
                <li>Temporary hope</li>
                <li>Boundaries loosened too quickly</li>
                <li>Rescuing after consequences</li>
              </ul>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
              <p className="font-medium text-orange-700 dark:text-orange-400">
                Key Insight: This is often where families work hardest—and feel most confused.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stage 4 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-red-500" />
              STAGE 4: Loss of Control & Chronic Instability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What This Looks Like</h4>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Repeated relapses</li>
                <li>Failed treatment attempts</li>
                <li>Emotional volatility</li>
                <li>Denial or blame-shifting</li>
                <li>Risky or dangerous behavior</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Family Impact</h4>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Burnout</li>
                <li>Hypervigilance</li>
                <li>Crisis management mode</li>
                <li>Erosion of trust</li>
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
              <p className="font-medium text-red-700 dark:text-red-400">
                Key Insight: Stability cannot be restored without significant external structure.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stage 5 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-destructive" />
              STAGE 5: Crisis or Turning Point
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Possible Forms</h4>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Medical emergency</li>
                <li>Legal involvement</li>
                <li>Job loss</li>
                <li>Family ultimatum</li>
                <li>Internal collapse</li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium mb-2">Important Reality</p>
              <p>Crisis does not guarantee change—but it often creates leverage.</p>
              <p className="mt-2 italic">
                Families do not cause crisis. They can choose how to respond to it.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stage 6 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Split className="h-5 w-5 text-primary" />
              STAGE 6: Early Recovery or Continued Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-semibold">Two Possible Paths</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Path A: Early Recovery</h4>
                <ul className="list-disc ml-6 text-sm space-y-1">
                  <li>Treatment or structured intervention</li>
                  <li>External accountability</li>
                  <li>Fragile motivation</li>
                  <li>Need for long-term support</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Path B: Continued Progression</h4>
                <ul className="list-disc ml-6 text-sm space-y-1">
                  <li>Increasing isolation</li>
                  <li>Diminishing insight</li>
                  <li>Escalating risk</li>
                  <li>Greater need for boundaries</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What This Timeline Is Not */}
        <Card className="mb-6 border-muted">
          <CardHeader>
            <CardTitle>What This Timeline Is Not</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">✕</span>
                It is not a measure of failure
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">✕</span>
                It is not a judgment
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">✕</span>
                It is not proof families "missed something"
              </li>
            </ul>
            <div className="bg-muted p-4 rounded-lg mt-4 text-center">
              <p className="font-semibold text-primary">It is a map, not a verdict.</p>
            </div>
          </CardContent>
        </Card>

        {/* Fillable Exercise */}
        <Card className="mb-6 border-primary print:break-before-page">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5 text-primary" />
              Fillable Exercise: Mapping Your Loved One's Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Step 1 */}
            <div>
              <h4 className="font-semibold mb-3">Step 1: Identify Key Periods</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Write approximate dates or ages for each milestone:
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="firstChange">First noticeable change</Label>
                  <Textarea
                    id="firstChange"
                    placeholder="e.g., Age 17, started drinking at parties..."
                    value={timeline.firstChange}
                    onChange={(e) => setTimeline({ ...timeline, firstChange: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="escalation">Escalation point</Label>
                  <Textarea
                    id="escalation"
                    placeholder="e.g., Age 19, started using daily..."
                    value={timeline.escalation}
                    onChange={(e) => setTimeline({ ...timeline, escalation: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="firstConsequence">First major consequence</Label>
                  <Textarea
                    id="firstConsequence"
                    placeholder="e.g., Age 20, lost job..."
                    value={timeline.firstConsequence}
                    onChange={(e) => setTimeline({ ...timeline, firstConsequence: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="firstTreatment">First treatment attempt</Label>
                  <Textarea
                    id="firstTreatment"
                    placeholder="e.g., Age 21, 30-day program..."
                    value={timeline.firstTreatment}
                    onChange={(e) => setTimeline({ ...timeline, firstTreatment: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currentStageTimeline">Current stage</Label>
                  <Textarea
                    id="currentStageTimeline"
                    placeholder="e.g., Currently in Stage 4..."
                    value={timeline.currentStage}
                    onChange={(e) => setTimeline({ ...timeline, currentStage: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <h4 className="font-semibold mb-3">Step 2: Notice Family Responses</h4>
              <p className="text-sm text-muted-foreground mb-3">At each stage, note:</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="whatTried">What you tried</Label>
                  <Textarea
                    id="whatTried"
                    placeholder="e.g., Talked to them, set curfews, took away car keys..."
                    value={responses.whatTried}
                    onChange={(e) => setResponses({ ...responses, whatTried: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="whatHoped">What you hoped would happen</Label>
                  <Textarea
                    id="whatHoped"
                    placeholder="e.g., They would realize the impact and stop..."
                    value={responses.whatHoped}
                    onChange={(e) => setResponses({ ...responses, whatHoped: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="whatHappened">What actually happened</Label>
                  <Textarea
                    id="whatHappened"
                    placeholder="e.g., Short improvement then return to use..."
                    value={responses.whatHappened}
                    onChange={(e) => setResponses({ ...responses, whatHappened: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <h4 className="font-semibold mb-3">Step 3: Identify Patterns</h4>
              <p className="text-sm text-muted-foreground mb-3">Reflect on:</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="effortNoResults">Where effort increased but results didn't</Label>
                  <Textarea
                    id="effortNoResults"
                    placeholder="e.g., More conversations, more monitoring..."
                    value={patterns.effortNoResults}
                    onChange={(e) => setPatterns({ ...patterns, effortNoResults: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="boundariesMissing">Where boundaries were missing</Label>
                  <Textarea
                    id="boundariesMissing"
                    placeholder="e.g., Kept paying bills, allowing them to live at home..."
                    value={patterns.boundariesMissing}
                    onChange={(e) => setPatterns({ ...patterns, boundariesMissing: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="structureHelped">Where structure helped—or was absent</Label>
                  <Textarea
                    id="structureHelped"
                    placeholder="e.g., Did better in treatment, struggled when they came home..."
                    value={patterns.structureHelped}
                    onChange={(e) => setPatterns({ ...patterns, structureHelped: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <h4 className="font-semibold mb-3">Step 4: Ground in the Present</h4>
              <p className="text-sm text-muted-foreground mb-3">Answer honestly:</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="currentStagePresent">What stage are we in now?</Label>
                  <Textarea
                    id="currentStagePresent"
                    placeholder="e.g., Stage 4 - Loss of Control..."
                    value={present.currentStage}
                    onChange={(e) => setPresent({ ...present, currentStage: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="neededNow">What is realistically needed at this stage?</Label>
                  <Textarea
                    id="neededNow"
                    placeholder="e.g., Professional intervention, treatment, firm boundaries..."
                    value={present.neededNow}
                    onChange={(e) => setPresent({ ...present, neededNow: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="notWorking">What is no longer working?</Label>
                  <Textarea
                    id="notWorking"
                    placeholder="e.g., Conversations, warnings, hoping it will get better..."
                    value={present.notWorking}
                    onChange={(e) => setPresent({ ...present, notWorking: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Important Reframe */}
        <Card className="mb-6 bg-primary/5">
          <CardHeader>
            <CardTitle>The Most Important Reframe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold">
                Addiction progression is not stopped by trying harder.<br />
                It is interrupted by changing strategy.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-medium text-primary">
                Families don't fail when addiction progresses.<br />
                They succeed when they adapt.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Companion Resources */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Suggested Companion Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link to="/disease-choice-reality-map" className="text-primary hover:underline">
                  Disease vs. Choice Reality Map
                </Link>
              </li>
              <li>
                <Link to="/why-willpower-fails" className="text-primary hover:underline">
                  Why Willpower Fails Guide
                </Link>
              </li>
              <li>
                <Link to="/relapse-warning-signs" className="text-primary hover:underline">
                  Relapse Warning Signs Tracker
                </Link>
              </li>
              <li>
                <Link to="/aftercare-checklist" className="text-primary hover:underline">
                  Aftercare Readiness Checklist
                </Link>
              </li>
              <li>
                <Link to="/family-action-plan" className="text-primary hover:underline">
                  Family Recovery Action Plan
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center print:hidden">
          <Link to="/family-education">
            <Button variant="outline" className="flex items-center gap-2 mx-auto">
              <ArrowLeft className="h-4 w-4" />
              Back to Family Education
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AddictionProgressionTimeline;
