import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Brain, Heart, Shield, AlertTriangle, CheckCircle, HelpCircle, Target, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";

export default function HowTraumaShapesAddiction() {
  useGuideTracking("How Trauma Shapes Addiction", "/how-trauma-shapes-addiction");
  return (
    <>
      <Helmet>
        <title>How Trauma Shapes Addiction | Sober Helpline</title>
        <meta name="description" content="Understanding how trauma increases vulnerability to addiction without making it the whole story. A guide for families navigating trauma and recovery." />
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

            <div className="text-center mb-10">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                How Trauma Shapes Addiction
              </h1>
              <p className="text-xl text-muted-foreground">
                Without Making It the Whole Story
              </p>
            </div>

            {/* Why This Guide Matters */}
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <HelpCircle className="h-5 w-5" />
                  Why This Guide Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Families often hear two opposing messages:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li><em>"Addiction is caused by trauma."</em></li>
                  <li><em>"They're just making excuses."</em></li>
                </ul>
                <p className="text-muted-foreground">
                  Both positions oversimplify a much more complex reality.
                </p>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="font-medium text-foreground">Trauma can shape addiction.</p>
                  <p className="text-muted-foreground">Trauma does not automatically create addiction.</p>
                  <p className="text-muted-foreground">And trauma does not remove responsibility for recovery.</p>
                </div>
                <p className="text-muted-foreground">
                  This guide helps families understand how trauma increases vulnerability—without letting it eclipse choice, treatment, or accountability.
                </p>
              </CardContent>
            </Card>

            {/* Grounding Truth */}
            <Card className="mb-8 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Target className="h-5 w-5" />
                  First, a Grounding Truth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-lg font-semibold text-foreground mb-2">
                    Trauma increases risk.
                  </p>
                  <p className="text-muted-foreground">It does not guarantee addiction.</p>
                  <p className="text-muted-foreground">And addiction does not require trauma to exist.</p>
                </div>
                <div className="bg-background/60 p-4 rounded-lg">
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Many people experience trauma and never develop addiction.</li>
                    <li>• Many people develop addiction without identifiable trauma.</li>
                  </ul>
                  <p className="mt-4 font-medium text-foreground">
                    Understanding trauma helps families respond with empathy—not confusion.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What Trauma Does to the Brain */}
            <Card className="mb-8 border-violet-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-400">
                  <Brain className="h-5 w-5" />
                  What Trauma Does to the Brain and Nervous System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Trauma alters how the brain processes:
                </p>
                <div className="grid md:grid-cols-4 gap-3">
                  {["Safety", "Threat", "Reward", "Stress"].map((item) => (
                    <div key={item} className="bg-violet-50 dark:bg-violet-950/30 p-3 rounded-lg text-center">
                      <span className="font-medium text-violet-700 dark:text-violet-400">{item}</span>
                    </div>
                  ))}
                </div>

                <p className="font-semibold text-foreground">Key effects include:</p>

                <div className="space-y-4">
                  <div className="bg-background border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">1. Heightened Stress Response</h4>
                    <p className="text-muted-foreground mb-2">
                      Trauma sensitizes the nervous system, making it:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Overreact to perceived threats</li>
                      <li>Struggle to return to baseline</li>
                      <li>Seek relief quickly</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground italic">
                      Substances can temporarily reduce this distress.
                    </p>
                  </div>

                  <div className="bg-background border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">2. Emotional Regulation Difficulties</h4>
                    <p className="text-muted-foreground mb-2">Trauma can impair:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Distress tolerance</li>
                      <li>Emotional awareness</li>
                      <li>Self-soothing skills</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground italic">
                      Substances may become a shortcut to relief—not because of weakness, but because of limited internal regulation.
                    </p>
                  </div>

                  <div className="bg-background border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">3. Avoidance of Internal Experience</h4>
                    <p className="text-muted-foreground mb-2">Trauma often teaches:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>"Feelings are dangerous"</li>
                      <li>"Memories must be avoided"</li>
                      <li>"Numbness is safer than pain"</li>
                    </ul>
                    <p className="mt-3 text-muted-foreground">Substances provide:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Escape</li>
                      <li>Numbing</li>
                      <li>Temporary relief from internal discomfort</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Trauma Can Increase Addiction Risk */}
            <Card className="mb-8 border-orange-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <AlertTriangle className="h-5 w-5" />
                  Why Trauma Can Increase Addiction Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Trauma can:</p>
                <ul className="space-y-2">
                  {[
                    "Increase sensitivity to stress",
                    "Make substances feel disproportionately relieving",
                    "Reinforce avoidance patterns",
                    "Reduce tolerance for discomfort",
                    "Interfere with impulse control under stress"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="font-medium text-foreground">
                    This makes substances more compelling—not inevitable.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Where Families Get Stuck */}
            <Card className="mb-8 border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Where Families Get Stuck
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Families often fall into one of two traps:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Trap 1: Trauma Explains Everything</h4>
                    <ul className="space-y-1 text-muted-foreground text-sm">
                      <li>• Harmful behavior is tolerated indefinitely</li>
                      <li>• Boundaries feel cruel</li>
                      <li>• Accountability is avoided</li>
                      <li>• Addiction remains unchallenged</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Trap 2: Trauma Is Dismissed Entirely</h4>
                    <ul className="space-y-1 text-muted-foreground text-sm">
                      <li>• Pain is minimized</li>
                      <li>• Shame increases</li>
                      <li>• Defensive behavior escalates</li>
                      <li>• Trust erodes</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4 font-medium text-center text-foreground">
                  Neither approach supports recovery.
                </p>
              </CardContent>
            </Card>

            {/* Trauma Is a Risk Factor */}
            <Card className="mb-8 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Scale className="h-5 w-5" />
                  Trauma Is a Risk Factor—Not a Free Pass
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">A critical distinction:</p>
                <div className="bg-background/60 p-4 rounded-lg text-center">
                  <p className="font-medium text-foreground">
                    Trauma explains why something feels harder.
                  </p>
                  <p className="text-muted-foreground">
                    It does not determine what must happen next.
                  </p>
                </div>
                <p className="font-semibold text-foreground">Trauma does not excuse:</p>
                <ul className="space-y-2">
                  {[
                    "Ongoing harm",
                    "Repeated boundary violations",
                    "Refusal of help",
                    "Avoidance of responsibility",
                    "Expecting others to absorb the consequences"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✕</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Why Trauma Alone Does Not Sustain Addiction */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <HelpCircle className="h-5 w-5" />
                  Why Trauma Alone Does Not Sustain Addiction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Trauma may open the door—but addiction persists because of:
                </p>
                <ul className="space-y-2">
                  {[
                    "Brain chemistry changes",
                    "Habit loops",
                    "Reinforced avoidance",
                    "Environmental access",
                    "Reduced executive functioning"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-foreground">
                    <strong>If trauma were the sole cause, trauma therapy alone would cure addiction.</strong>
                  </p>
                  <p className="text-muted-foreground mt-1">It doesn't.</p>
                </div>
              </CardContent>
            </Card>

            {/* Why Trauma Therapy During Active Addiction Often Fails */}
            <Card className="mb-8 border-amber-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                  Why Trauma Therapy During Active Addiction Often Fails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">When substances are still active:</p>
                <ul className="space-y-2">
                  {[
                    "Emotional processing can increase craving",
                    "Therapy insights are not retained",
                    "Regulation skills cannot stabilize",
                    "Avoidance patterns persist"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-medium text-foreground">
                  This is why stabilization often must come first.
                </p>
              </CardContent>
            </Card>

            {/* The Right Sequence Matters */}
            <Card className="mb-8 border-emerald-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="h-5 w-5" />
                  The Right Sequence Matters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  In most cases, effective recovery looks like:
                </p>
                <div className="space-y-3">
                  {[
                    "Stabilize substance use",
                    "Build structure and safety",
                    "Develop basic regulation skills",
                    "Address trauma with support",
                    "Integrate long-term recovery strategies"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="text-foreground">
                    <strong>This is not minimizing trauma.</strong>
                  </p>
                  <p className="text-muted-foreground">
                    It is creating the conditions for trauma healing to work.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What Trauma-Informed Recovery Actually Looks Like */}
            <Card className="mb-8 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <Heart className="h-5 w-5" />
                  What Trauma-Informed Recovery Actually Looks Like
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Trauma-informed recovery includes:</p>
                <ul className="space-y-2">
                  {[
                    "Compassion without rescuing",
                    "Boundaries without punishment",
                    "Accountability without shame",
                    "Support without control",
                    "Safety without avoidance"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
                  <p className="text-foreground italic">
                    "I understand why this is hard—and it still needs to change."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How Families Can Think More Clearly */}
            <Card className="mb-8 border-teal-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
                  <Target className="h-5 w-5" />
                  How Families Can Think More Clearly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Helpful questions:</p>
                <div className="space-y-3">
                  {[
                    "Does this behavior increase safety or harm?",
                    "Is trauma being addressed—or used to avoid change?",
                    "Does this response support healing—or prolong chaos?",
                    "Are boundaries protecting everyone involved?"
                  ].map((question, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                      <HelpCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{question}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-medium text-center text-foreground">
                  These questions restore balance.
                </p>
              </CardContent>
            </Card>

            {/* A Necessary Reframe */}
            <Card className="mb-8 border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                  <Shield className="h-5 w-5" />
                  A Necessary Reframe for Families
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 space-y-2">
                  <p className="text-lg font-semibold text-foreground">Trauma shapes vulnerability.</p>
                  <p className="text-lg font-semibold text-foreground">Addiction shapes behavior.</p>
                  <p className="text-lg font-semibold text-foreground">Recovery requires responsibility.</p>
                </div>
                <p className="text-center text-muted-foreground mt-4">
                  All three must be addressed—without collapsing them into one explanation.
                </p>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
              <CardHeader>
                <CardTitle className="text-logo-green">Final Thought</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Families don't need to choose between:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Understanding trauma</li>
                  <li>Holding boundaries</li>
                </ul>
                <p className="font-medium text-foreground">True healing requires both.</p>
                <div className="bg-background/60 p-4 rounded-lg mt-4">
                  <p className="text-muted-foreground">Compassion without accountability sustains addiction.</p>
                  <p className="text-muted-foreground">Accountability without compassion creates resistance.</p>
                  <p className="font-medium text-foreground mt-2">The middle ground is where recovery grows.</p>
                </div>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="mb-8 border-slate-500/30">
              <CardHeader>
                <CardTitle className="text-logo-green">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/trauma-vs-excuses">
                    <Button variant="outline" size="sm" className="gap-2">
                      Trauma vs. Excuses: A Necessary Distinction
                    </Button>
                  </Link>
                  <Link to="/mental-health-vs-substance-induced">
                    <Button variant="outline" size="sm" className="gap-2">
                      Mental Health vs. Substance-Induced Symptoms
                    </Button>
                  </Link>
                  <Link to="/mental-health-delays-recovery">
                    <Button variant="outline" size="sm" className="gap-2">
                      Why Focusing Only on Mental Health Can Delay Recovery
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      Boundary Setting Worksheet
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      Guilt vs. Responsibility Module
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link to="/family-education">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Family Education
                </Button>
              </Link>
            </div>
          </div>
        
          <RelatedResources currentPath="/how-trauma-shapes-addiction" />
</main>
      </div>
    </>
  );
}
