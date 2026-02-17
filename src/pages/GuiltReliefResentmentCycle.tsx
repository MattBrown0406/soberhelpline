import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, Heart, Brain, RefreshCw, AlertTriangle, CheckCircle, HelpCircle, Pause, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useGuideTracking } from "@/hooks/useGuideTracking";

export default function GuiltReliefResentmentCycle() {
  useGuideTracking("The Guilt-Relief-Resentment Cycle", "/guilt-relief-resentment-cycle");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>The Guilt–Relief–Resentment Cycle | Sober Helpline</title>
        <meta name="description" content="How good intentions turn into chronic burnout—and how to break the loop. Learn to interrupt the guilt-relief-resentment cycle in families affected by addiction." />
      </Helmet>

      <div className="min-h-screen bg-background">

        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 print:hidden">
              <Link
                to="/family-education"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Family Education
              </Link>
              <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                Print Guide
              </Button>
            </div>

            <div className="text-center mb-8">
              <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                The Guilt–Relief–Resentment Cycle
              </h1>
              <p className="text-xl text-muted-foreground">
                How Good Intentions Turn Into Chronic Burnout—and How to Break the Loop
              </p>
            </div>

            {/* Why This Guide Matters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Heart className="h-5 w-5" />
                  Why This Guide Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Families affected by addiction often describe a familiar emotional loop:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-center py-4">
                  <span className="px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg font-medium">Guilt builds</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg font-medium">They step in to help</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg font-medium">Relief follows (briefly)</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg font-medium">Resentment grows</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg font-medium">Guilt returns</span>
                </div>
                <p className="text-muted-foreground">
                  Over time, this cycle becomes <strong>automatic</strong>.
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-amber-900 dark:text-amber-100 font-medium">
                    Families don't stay stuck because they don't see the problem.<br />
                    They stay stuck because the cycle <strong>temporarily works</strong>—until it doesn't.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* The Three Stages */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <RefreshCw className="h-5 w-5" />
                  The Three Stages of the Cycle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stage 1: Guilt */}
                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Stage 1: Guilt</h4>
                  <p className="text-muted-foreground mb-2">Guilt often shows up as:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground italic">
                    <li>"What if I'm being too harsh?"</li>
                    <li>"What if this is my fault?"</li>
                    <li>"What if I make things worse?"</li>
                    <li>"What if they really need me?"</li>
                  </ul>
                  <p className="text-muted-foreground mt-3 font-medium">
                    Guilt is not weakness.<br />
                    It is a signal of attachment and responsibility.
                  </p>
                </div>

                {/* Stage 2: Relief */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Stage 2: Relief</h4>
                  <p className="text-muted-foreground mb-2">Relief follows when families:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Give money</li>
                    <li>Relax boundaries</li>
                    <li>Solve a crisis</li>
                    <li>Rescue emotionally</li>
                    <li>Say yes when they meant no</li>
                  </ul>
                  <p className="text-muted-foreground mt-3 mb-2">Relief feels like:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Tension dropping</li>
                    <li>Conflict avoided</li>
                    <li>Fear temporarily quieted</li>
                    <li>A sense of being "a good parent/partner"</li>
                  </ul>
                  <p className="text-muted-foreground mt-3 font-medium">
                    Relief is powerful because it soothes the family nervous system.
                  </p>
                </div>

                {/* Stage 3: Resentment */}
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Stage 3: Resentment</h4>
                  <p className="text-muted-foreground mb-2">Resentment emerges when:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>The behavior repeats</li>
                    <li>Promises are broken</li>
                    <li>Boundaries are crossed again</li>
                    <li>The family absorbs consequences</li>
                  </ul>
                  <p className="text-muted-foreground mt-3 mb-2">Resentment often shows up as:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Irritability</li>
                    <li>Emotional withdrawal</li>
                    <li>Anger without a clear target</li>
                    <li>Fantasies of escape</li>
                    <li>Shame for feeling angry</li>
                  </ul>
                  <p className="text-muted-foreground mt-3 font-medium">
                    Resentment is not cruelty.<br />
                    It is a warning sign of self-betrayal.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How the Cycle Feeds Addiction */}
            <Card className="mb-6 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <AlertTriangle className="h-5 w-5" />
                  How the Cycle Feeds Addiction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">The cycle unintentionally teaches:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Guilt leads to rescue</li>
                  <li>Distress creates relief</li>
                  <li>Consequences are avoidable</li>
                  <li>Boundaries are temporary</li>
                </ul>
                <p className="text-muted-foreground font-medium">
                  Addiction learns the pattern even if no one names it.
                </p>
                <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-orange-900 dark:text-orange-100 font-medium">
                    The cycle doesn't just exhaust families—it protects addiction from reality.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Why Families Get Stuck */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Brain className="h-5 w-5" />
                  Why Families Get Stuck in the Cycle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families stay in the loop because:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Guilt feels morally "right"</li>
                  <li>Relief feels like success</li>
                  <li>Resentment is hidden or shamed</li>
                  <li>Breaking the cycle feels dangerous</li>
                  <li>Fear of regret is strong</li>
                </ul>
                <p className="text-muted-foreground font-medium mt-4">
                  This is not a character flaw.<br />
                  It is a trauma-informed survival loop.
                </p>
              </CardContent>
            </Card>

            {/* The Cost of the Cycle */}
            <Card className="mb-6 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  The Cost of the Cycle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Over time, families experience:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <span className="px-3 py-2 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-center text-sm">Burnout</span>
                  <span className="px-3 py-2 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-center text-sm">Loss of trust</span>
                  <span className="px-3 py-2 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-center text-sm">Chronic anger</span>
                  <span className="px-3 py-2 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-center text-sm">Emotional numbness</span>
                  <span className="px-3 py-2 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-center text-sm">Health problems</span>
                  <span className="px-3 py-2 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-center text-sm">Relationship breakdown</span>
                </div>
                <p className="text-muted-foreground font-medium text-center mt-4">
                  The cycle erodes both family health and recovery conditions.
                </p>
              </CardContent>
            </Card>

            {/* The Moment That Matters Most */}
            <Card className="mb-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Pause className="h-5 w-5" />
                  The Moment That Matters Most
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The cycle can only be broken in <strong>one place</strong>:
                </p>
                <div className="bg-primary/20 p-6 rounded-lg text-center">
                  <p className="text-xl font-bold text-foreground">
                    Between guilt and relief.
                  </p>
                </div>
                <p className="text-muted-foreground text-center mt-4">
                  That pause is uncomfortable—but powerful.
                </p>
              </CardContent>
            </Card>

            {/* How to Interrupt the Cycle */}
            <Card className="mb-6 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Target className="h-5 w-5" />
                  How to Interrupt the Cycle (Practically)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Step 1: Name the Feeling Without Acting</h4>
                  <p className="text-muted-foreground mb-2">Say internally:</p>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="italic text-muted-foreground">"This is guilt—not danger."</p>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">Naming slows the nervous system.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Step 2: Ask the Right Question</h4>
                  <div className="space-y-2">
                    <p className="text-muted-foreground"><span className="text-red-500">Not:</span> "What should I do?"</p>
                    <p className="text-muted-foreground"><span className="text-emerald-500 font-medium">But:</span> "Will this choice reduce harm—or just reduce my discomfort?"</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Step 3: Delay the Response</h4>
                  <p className="text-muted-foreground mb-2">If possible:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Don't respond immediately</li>
                    <li>Avoid crisis-driven decisions</li>
                    <li>Create space for clarity</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 text-sm font-medium">Urgency feeds the cycle.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Step 4: Choose Boundaries Over Relief</h4>
                  <p className="text-muted-foreground">
                    Boundaries feel worse initially—<br />
                    but prevent long-term resentment.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Step 5: Prepare for Emotional Aftermath</h4>
                  <p className="text-muted-foreground mb-2">Expect:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Discomfort</li>
                    <li>Pushback</li>
                    <li>Second-guessing</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">
                    These emotions do not mean the choice was wrong.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What Replaces the Cycle */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <CheckCircle className="h-5 w-5" />
                  What Replaces the Cycle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">When families interrupt the loop:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Guilt softens into clarity</li>
                  <li>Relief is replaced by stability</li>
                  <li>Resentment decreases</li>
                  <li>Trust becomes behavior-based</li>
                  <li>Energy returns</li>
                </ul>
                <p className="text-muted-foreground font-medium text-center mt-4">
                  The system recalibrates.
                </p>
              </CardContent>
            </Card>

            {/* Common Misunderstandings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <HelpCircle className="h-5 w-5" />
                  Common Misunderstandings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium text-foreground mb-2">"If I don't help, I'm abandoning them."</p>
                  <p className="text-muted-foreground">
                    Not helping <em>in this way</em> is not abandonment.<br />
                    It is refusing to participate in a harmful pattern.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium text-foreground mb-2">"Resentment means I'm heartless."</p>
                  <p className="text-muted-foreground">
                    Resentment means your limits are being violated.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reflection Exercise */}
            <Card className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <HelpCircle className="h-5 w-5" />
                  Reflection Exercise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Answer honestly:</p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">1.</span>
                    What triggers guilt for me most often?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">2.</span>
                    What action do I usually take to relieve it?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">3.</span>
                    How long does the relief last?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">4.</span>
                    How does resentment show up in my body?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1 font-bold">5.</span>
                    What boundary would interrupt this cycle right now?
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* A Grounding Reframe */}
            <Card className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-300 dark:border-emerald-700">
              <CardContent className="pt-6">
                <p className="text-lg text-emerald-900 dark:text-emerald-100 font-medium text-center">
                  Guilt that leads to relief and resentment is not compassion.<br />
                  <strong>It is a warning system asking for change.</strong>
                </p>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-6 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <CheckCircle className="h-5 w-5" />
                  Final Thought
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Families don't fail because they help too much.<br />
                  They fail because helping temporarily soothes pain while deepening the wound.
                </p>
                <p className="text-muted-foreground">
                  Breaking the guilt–relief–resentment cycle does not make you colder.<br />
                  It makes you <strong>clearer, healthier, and more effective</strong>.
                </p>
                <div className="bg-primary/10 p-4 rounded-lg mt-4">
                  <p className="text-foreground font-medium text-center">
                    That clarity creates space—for everyone.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/values-aligned-decisions">
                    <Button variant="outline" size="sm">Values-Aligned Decision Making Exercise</Button>
                  </Link>
                  <Link to="/boundaries-ultimatums">
                    <Button variant="outline" size="sm">Requests, Demands, Ultimatums & Boundaries</Button>
                  </Link>
                  <Link to="/living-well-regardless">
                    <Button variant="outline" size="sm">Living Well Regardless of Outcome</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
