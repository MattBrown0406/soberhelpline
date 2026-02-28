import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, Heart, Brain, Users, AlertTriangle, Shield, HelpCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

export default function StrongOneGuide() {
  useGuideTracking("/strong-one-guide", "The Hidden Cost of Being the Strong One");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>The Hidden Cost of Being the "Strong One" | Sober Helpline</title>
        <meta name="description" content="When competence becomes a survival strategy—and a liability. Learn the hidden costs of being the 'strong one' in families affected by addiction." />
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

            <ToolBrandHeader
              title='The Hidden Cost of Being the "Strong One"'
              subtitle="When competence becomes a survival strategy — and a liability. The family member who holds it together often pays the highest price in silence."
              clinicalNote="Based on codependency research by Pia Mellody, caretaker burnout literature, and Al-Anon's emphasis on self-care as a recovery practice."
            />


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
                  In families affected by addiction, someone usually becomes <strong>the strong one</strong>.
                </p>
                <p className="text-muted-foreground">They are the person who:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Keeps things moving</li>
                  <li>Manages crises</li>
                  <li>Holds emotions together</li>
                  <li>Doesn't ask for much</li>
                  <li>"Can handle it"</li>
                </ul>
                <p className="text-muted-foreground">
                  They are often praised, relied upon, and <strong>quietly exhausted</strong>.
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-amber-900 dark:text-amber-100 font-medium">
                    Being the strong one often looks like resilience.<br />
                    In reality, it is frequently a <strong>survival adaptation</strong>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How the Role Develops */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Brain className="h-5 w-5" />
                  How the "Strong One" Role Develops
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  This role rarely starts as a choice.
                </p>
                <p className="text-muted-foreground font-medium">It emerges when:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Chaos is unpredictable</li>
                  <li>Adults are overwhelmed</li>
                  <li>Emotions feel unsafe to express</li>
                  <li>Someone needs to stay functional</li>
                  <li>Stability depends on someone not falling apart</li>
                </ul>
                <p className="text-muted-foreground font-medium mt-4">The strong one learns:</p>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="italic text-muted-foreground">"If I stay steady, things don't get worse."</p>
                  <p className="italic text-muted-foreground">"My needs can wait."</p>
                  <p className="italic text-muted-foreground">"Someone has to be capable."</p>
                </div>
                <p className="text-muted-foreground font-medium text-center mt-4">
                  Strength becomes safety.
                </p>
              </CardContent>
            </Card>

            {/* Why Families Reinforce This Role */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Users className="h-5 w-5" />
                  Why Families (Unintentionally) Reinforce This Role
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families often:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Lean on the strong one more</li>
                  <li>Ask less of them emotionally</li>
                  <li>Praise their maturity</li>
                  <li>Assume they're "fine"</li>
                  <li>Confide in them rather than protect them</li>
                </ul>
                <p className="text-muted-foreground font-medium">
                  This is not neglect—it's misplaced trust in their capacity.
                </p>
              </CardContent>
            </Card>

            {/* The Hidden Costs */}
            <Card className="mb-6 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  The Hidden Costs (That Appear Later)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cost 1 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">1. Chronic Over-Responsibility</h4>
                  <p className="text-muted-foreground mb-2">The strong one often:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Feels responsible for outcomes they can't control</li>
                    <li>Steps in before being asked</li>
                    <li>Anticipates problems constantly</li>
                    <li>Struggles to rest without guilt</li>
                  </ul>
                  <p className="text-muted-foreground font-medium mt-2">Responsibility becomes identity.</p>
                </div>

                {/* Cost 2 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">2. Emotional Suppression</h4>
                  <p className="text-muted-foreground mb-2">To stay functional, the strong one learns to:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Minimize their feelings</li>
                    <li>Intellectualize pain</li>
                    <li>Stay calm at all costs</li>
                    <li>Avoid burdening others</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">
                    Over time, emotions don't disappear—they surface as anxiety, numbness, or resentment.
                  </p>
                </div>

                {/* Cost 3 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">3. Difficulty Asking for Help</h4>
                  <p className="text-muted-foreground mb-2">Because they are seen as capable, the strong one:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Struggles to receive support</li>
                    <li>Feels weak when they need help</li>
                    <li>Doesn't know how to be "taken care of"</li>
                    <li>Believes collapse would harm others</li>
                  </ul>
                  <p className="text-muted-foreground font-medium mt-2">Independence becomes isolation.</p>
                </div>

                {/* Cost 4 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">4. Resentment Without Permission</h4>
                  <p className="text-muted-foreground mb-2">The strong one often feels:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Unseen</li>
                    <li>Taken for granted</li>
                    <li>Quietly angry</li>
                    <li>Guilty for that anger</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">
                    Resentment grows in silence because expressing it feels unsafe or selfish.
                  </p>
                </div>

                {/* Cost 5 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">5. Identity Built on Function, Not Being</h4>
                  <p className="text-muted-foreground mb-2">Many strong ones eventually ask:</p>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="italic text-muted-foreground">"Who am I if I stop holding everything together?"</p>
                    <p className="italic text-muted-foreground">"What's left if I don't manage?"</p>
                    <p className="italic text-muted-foreground">"Do I matter beyond what I provide?"</p>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    This identity crisis often emerges in adulthood—long after the chaos.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How Addiction Exploits the Strong One */}
            <Card className="mb-6 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <AlertTriangle className="h-5 w-5" />
                  How Addiction Exploits the "Strong One"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Addiction systems quietly rely on:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>The person who keeps life from collapsing</li>
                  <li>The one who absorbs consequences</li>
                  <li>The one who stabilizes emotions</li>
                  <li>The one who adapts endlessly</li>
                </ul>
                <p className="text-muted-foreground font-medium">
                  The strong one often becomes the invisible structure supporting addiction.
                </p>
                <p className="text-muted-foreground">
                  This is not because they enable intentionally—<br />
                  but because their competence becomes the safety net.
                </p>
              </CardContent>
            </Card>

            {/* Common Signs */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <HelpCircle className="h-5 w-5" />
                  Common Signs You're in the "Strong One" Role
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">You may recognize yourself if:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You feel calmer during crises than during calm</li>
                  <li>Rest feels uncomfortable or undeserved</li>
                  <li>You don't know what you need until you're depleted</li>
                  <li>You minimize your own pain automatically</li>
                  <li>You feel responsible for everyone's emotional state</li>
                  <li>You feel guilty when you stop holding things together</li>
                </ul>
              </CardContent>
            </Card>

            {/* Why Letting Go Feels So Scary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Brain className="h-5 w-5" />
                  Why Letting Go Feels So Scary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Stepping out of the role triggers fears such as:</p>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="italic text-muted-foreground">"Everything will fall apart."</p>
                  <p className="italic text-muted-foreground">"People will be disappointed."</p>
                  <p className="italic text-muted-foreground">"I'll be seen as selfish."</p>
                  <p className="italic text-muted-foreground">"I'll lose my value."</p>
                </div>
                <p className="text-muted-foreground font-medium text-center mt-4">
                  These fears are protective memories, not current truths.
                </p>
              </CardContent>
            </Card>

            {/* What Healing Looks Like */}
            <Card className="mb-6 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <RefreshCw className="h-5 w-5" />
                  What Healing Looks Like (Not Collapse)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground font-medium">Healing does not mean:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Becoming weak</li>
                  <li>Withdrawing completely</li>
                  <li>Abandoning responsibility</li>
                  <li>Letting chaos win</li>
                </ul>
                
                <p className="text-muted-foreground font-medium mt-4">Healing means:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Sharing emotional weight</li>
                  <li>Allowing appropriate consequences</li>
                  <li>Setting limits without justification</li>
                  <li>Being a person—not a function</li>
                  <li>Letting others manage their discomfort</li>
                </ul>
              </CardContent>
            </Card>

            {/* Reclaiming Strength */}
            <Card className="mb-6 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Shield className="h-5 w-5" />
                  Reclaiming Strength (In a New Way)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground font-medium">True strength becomes:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Choosing boundaries</strong> over endurance</li>
                  <li><strong>Valuing rest</strong> as responsibility</li>
                  <li><strong>Speaking needs</strong> before collapse</li>
                  <li><strong>Tolerating disappointment</strong></li>
                  <li><strong>Letting others fail safely</strong></li>
                </ul>
                <div className="bg-primary/10 p-4 rounded-lg mt-4">
                  <p className="text-foreground font-medium text-center">
                    Strength is no longer how much you can carry—<br />
                    it's how wisely you decide what's yours to carry.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reflection Questions */}
            <Card className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <HelpCircle className="h-5 w-5" />
                  Reflection Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Where did being "the strong one" protect me?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Where is it costing me now?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What am I afraid would happen if I stopped over-functioning?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What needs have I learned to ignore?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What would strength look like if it included me?
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* A Grounding Reframe */}
            <Card className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-300 dark:border-emerald-700">
              <CardContent className="pt-6">
                <p className="text-lg text-emerald-900 dark:text-emerald-100 font-medium text-center">
                  You were strong because you had to be.<br />
                  <strong>You are allowed to become whole now.</strong>
                </p>
                <p className="text-center text-emerald-800 dark:text-emerald-200 mt-4">
                  You do not have to disappear for others to survive.
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
                  The strong one often survives childhood chaos by becoming indispensable.
                </p>
                <p className="text-muted-foreground">
                  Recovery—for families—often begins when the strong one learns:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>To take up space</li>
                  <li>To be supported</li>
                  <li>To let go of constant readiness</li>
                  <li>To live beyond survival mode</li>
                </ul>
                <div className="bg-primary/10 p-4 rounded-lg mt-4">
                  <p className="text-foreground font-medium text-center">
                    The family doesn't need you to be strong forever.<br />
                    It needs you to be real.
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
                  <Link to="/living-well-regardless">
                    <Button variant="outline" size="sm">Living Well Regardless of Outcome</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        
          <RelatedResources currentPath="/strong-one" />
</main>
      </div>
    </>
  );
}
