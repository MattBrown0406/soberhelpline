import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Brain, Zap, Shield, XCircle, CheckCircle, RefreshCw, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";
import FamilyBridgeCTA from "@/components/FamilyBridgeCTA";

const WhyWillpowerFails = () => {
  useGuideTracking("/why-willpower-fails", "Why Willpower Fails (and What Actually Works)");

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <Helmet>
        <title>Why Willpower Fails in Addiction | Sober Helpline</title>
        <meta 
          name="description" 
          content="Understand why willpower is unreliable in addiction, and what actually supports lasting change. A guide for families." 
        />
        <link rel="canonical" href="https://soberhelpline.com/why-willpower-fails" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link to="/family-education">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
            {/* FamilyBridge CTA */}
            <div className="my-8">
              <FamilyBridgeCTA variant="post-completion" />
            </div>

              Back to Family Education
            </Button>
          </Link>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Guide
          </Button>
        </div>

        <ToolBrandHeader
          title="Why Willpower Fails (and What Actually Works)"
          subtitle="Understanding motivation, craving, and why effort alone isn't enough. This guide helps families stop blaming willpower and start understanding brain science."
          clinicalNote="Based on neuroscience of the prefrontal cortex and mesolimbic dopamine system, as well as Prochaska & DiClemente's Stages of Change model."
        />

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Why Willpower Fails (and What Actually Works)
          </h1>
          <p className="text-xl text-muted-foreground">
            Understanding Motivation, Craving, and Why Effort Alone Isn't Enough
          </p>
        </div>

        {/* Why This Guide Matters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Why This Guide Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Families often believe—quietly or openly—that:</p>
            <p className="italic text-muted-foreground ml-4">
              "If they just wanted it badly enough, they would stop."
            </p>
            <p>When relapse happens, families feel:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Angry</li>
              <li>Disappointed</li>
              <li>Betrayed</li>
              <li>Exhausted</li>
            </ul>
            <p className="font-medium">
              This guide explains why willpower is unreliable in addiction, and what actually supports change.
            </p>
          </CardContent>
        </Card>

        {/* The Myth of Willpower */}
        <Card className="mb-6 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              The Myth of Willpower
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Willpower assumes:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>A fully functioning decision-making brain</li>
              <li>Stable emotional regulation</li>
              <li>Equal access to alternative rewards</li>
            </ul>
            <div className="bg-destructive/10 p-4 rounded-lg text-center">
              <p className="font-semibold text-destructive">
                In addiction, none of these are reliably present.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What Happens in the Addicted Brain */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              What Happens in the Addicted Brain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold mb-2">1. Dopamine Dysregulation</h4>
              <p className="text-muted-foreground mb-2">
                Dopamine no longer signals pleasure—it signals survival.
              </p>
              <p className="text-muted-foreground mb-2">Substances become prioritized as:</p>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Urgent</li>
                <li>Necessary</li>
                <li>Non-negotiable</li>
              </ul>
              <p className="mt-2 italic">This is why logic often fails.</p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold mb-2">2. Stress Overrides Intentions</h4>
              <p className="text-muted-foreground mb-2">
                Stress activates craving pathways faster than conscious thought.
              </p>
              <p className="text-muted-foreground mb-2">This means:</p>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Good intentions collapse under pressure</li>
                <li>Conflict often increases use</li>
                <li>Shame fuels relapse</li>
              </ul>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold mb-2">3. Motivation Is State-Dependent</h4>
              <p className="text-muted-foreground mb-2">Motivation fluctuates based on:</p>
              <ul className="list-disc ml-6 text-muted-foreground">
                <li>Withdrawal</li>
                <li>Sleep</li>
                <li>Mental health</li>
                <li>Environment</li>
                <li>External pressure</li>
              </ul>
              <p className="mt-2 italic">
                Wanting recovery on Monday does not guarantee access to that motivation on Friday.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Insight Isn't Enough */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Why Insight Isn't Enough
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Families are often encouraged by:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Apologies</li>
              <li>Promises</li>
              <li>Emotional conversations</li>
              <li>Insightful language</li>
            </ul>
            <p className="font-medium text-destructive">
              But insight without structure rarely survives stress.
            </p>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-semibold text-primary">
                Insight is awareness—not capacity.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What Actually Works */}
        <Card className="mb-6 border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              What Actually Works Better Than Willpower
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">1. External Structure</h4>
                <ul className="list-disc ml-6 text-sm text-muted-foreground">
                  <li>Treatment</li>
                  <li>Monitoring</li>
                  <li>Accountability</li>
                  <li>Sober housing</li>
                  <li>Legal leverage</li>
                </ul>
                <p className="mt-2 text-sm italic">
                  Structure compensates for impaired self-regulation.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">2. Reduced Access</h4>
                <p className="text-sm text-muted-foreground mb-2">Limiting access to:</p>
                <ul className="list-disc ml-6 text-sm text-muted-foreground">
                  <li>Money</li>
                  <li>Transportation</li>
                  <li>Unsafe environments</li>
                </ul>
                <p className="mt-2 text-sm italic">
                  This reduces relapse risk more effectively than lectures.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">3. Time in Stability</h4>
                <p className="text-sm text-muted-foreground">
                  The brain needs time without substances to regain function.
                </p>
                <p className="mt-2 text-sm font-medium">
                  Early recovery is fragile.<br />
                  Expecting strength too soon leads to failure.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">4. Consistent Boundaries</h4>
                <p className="text-sm text-muted-foreground mb-2">Boundaries:</p>
                <ul className="list-disc ml-6 text-sm text-muted-foreground">
                  <li>Reduce chaos</li>
                  <li>Create predictability</li>
                  <li>Prevent family burnout</li>
                  <li>Support long-term change</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Family Shift */}
        <Card className="mb-6 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              The Family Shift That Changes Everything
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Instead of asking:</p>
            <p className="italic text-muted-foreground ml-4">"Why won't they try harder?"</p>
            <p>Ask:</p>
            <p className="font-medium text-primary ml-4">"What supports are missing that make effort unsustainable?"</p>
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-semibold">
                This moves families from frustration to strategy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What to Stop / What to Do */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                What Families Should Stop Doing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✕</span>
                  Debating logic during craving
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✕</span>
                  Relying on promises
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✕</span>
                  Expecting consistency too early
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✕</span>
                  Using guilt as motivation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">✕</span>
                  Believing relapse means refusal
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CheckCircle className="h-5 w-5" />
                What Families Can Do Instead
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  Focus on structure, not speeches
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  Protect their own stability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  Support accountability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  Measure behavior, not intent
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  Accept slow, uneven progress
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Final Reframe */}
        <Card className="mb-6 border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Final Reframe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-lg font-semibold">
                Willpower starts recovery.<br />
                Structure sustains it.
              </p>
            </div>
            <p>Families are not failing because they didn't try hard enough.</p>
            <p className="font-medium">
              They often failed because they were told effort was enough—when biology said otherwise.
            </p>
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
                  The Disease vs. Choice Reality Map
                </Link>
              </li>
              <li>
                <Link to="/understanding-addiction" className="text-primary hover:underline">
                  Understanding Addiction Guide
                </Link>
              </li>
              <li>
                <Link to="/why-change-doesnt-happen" className="text-primary hover:underline">
                  Why Change Doesn't Happen Guide
                </Link>
              </li>
              <li>
                <Link to="/family-education#boundary-worksheet" className="text-primary hover:underline">
                  Boundary-Setting Worksheet
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center print:hidden">
          <Link to="/family-education">
            <Button variant="outline" className="flex items-center gap-2 mx-auto">
              <ArrowLeft className="h-4 w-4" />
            {/* FamilyBridge CTA */}
            <div className="my-8">
              <FamilyBridgeCTA variant="post-completion" />
            </div>

              Back to Family Education
            </Button>
          </Link>
        </div>
      </div>
    
          <RelatedResources currentPath="/why-willpower-fails" />
</Layout>
  );
};

export default WhyWillpowerFails;
