import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Brain, AlertTriangle, RefreshCw, XCircle, CheckCircle, ListOrdered, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useGuideTracking } from "@/hooks/useGuideTracking";

const MentalHealthDelaysRecovery = () => {
  useGuideTracking("/mental-health-delays-recovery", "Why Focusing Only on Mental Health Can Delay Recovery");
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <Helmet>
        <title>Why Mental Health Focus Can Delay Recovery | Sober Helpline</title>
        <meta 
          name="description" 
          content="Understand why treatment sequence matters. Learn how addressing addiction first often protects mental health rather than harms it." 
        />
        <link rel="canonical" href="https://soberhelpline.com/mental-health-delays-recovery" />
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
            Why Focusing Only on Mental Health Can Delay Recovery
          </h1>
          <p className="text-xl text-muted-foreground">
            Understanding Sequence, Not Severity
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
            <p>Families often arrive at this crossroads:</p>
            <ul className="space-y-1 ml-4 italic text-muted-foreground">
              <li>"They're depressed—treatment will make it worse."</li>
              <li>"They need therapy, not rehab."</li>
              <li>"If we fix the anxiety, the drinking will stop."</li>
              <li>"Addiction is just a symptom."</li>
            </ul>
            <p>
              These beliefs come from love, fear, and compassion. But when addiction is present, 
              they often lead to delays, repeated crises, and deeper entrenchment.
            </p>
            <p className="font-medium">
              This guide explains why sequence matters—and how addressing addiction first often 
              protects mental health rather than harms it.
            </p>
          </CardContent>
        </Card>

        {/* Critical Reframe */}
        <Card className="mb-6 border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              A Critical Reframe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold text-center">
              This is not about choosing addiction over mental health.<br />
              It's about addressing what destabilizes everything else first.
            </p>
            <p>Addiction alters:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Brain chemistry", "Emotional regulation", "Sleep", "Insight", "Stress tolerance", "Treatment engagement"].map((item) => (
                <div key={item} className="bg-muted p-2 rounded text-center text-sm">
                  {item}
                </div>
              ))}
            </div>
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-semibold text-primary">
                Until addiction is stabilized, mental health treatment often cannot work as intended.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Mental Health Gets Prioritized */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Why Mental Health Gets Prioritized First</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Families tend to focus on mental health because:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>It carries less stigma</li>
              <li>It feels more compassionate</li>
              <li>It avoids confrontation</li>
              <li>It preserves hope without boundaries</li>
              <li>Providers may emphasize it without addressing substance use</li>
            </ul>
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
              <p className="font-medium text-orange-700 dark:text-orange-400">
                This makes sense—but it can unintentionally protect addiction.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How Addiction Distorts Symptoms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              How Addiction Distorts Mental Health Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Substances can:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Mimic depression, anxiety, bipolar disorder, or psychosis</li>
              <li>Worsen existing mental health conditions</li>
              <li>Create mood instability that looks psychiatric</li>
              <li>Undermine therapy gains between sessions</li>
              <li>Make medication appear ineffective or excessive</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-medium text-primary italic">
                Treating mental health during active addiction is like stabilizing a building 
                while the foundation is still shifting.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Problem With Treating Symptoms First */}
        <Card className="mb-6 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              The Problem With Treating Symptoms First
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-l-4 border-destructive/50 pl-4">
              <h4 className="font-semibold mb-2">1. Therapy Without Sobriety Has Limits</h4>
              <ul className="list-disc ml-4 text-muted-foreground space-y-1">
                <li>Insight does not equal behavior change</li>
                <li>Emotional processing can increase craving</li>
                <li>Sessions may become repetitive or avoidant</li>
                <li>Progress collapses between appointments</li>
              </ul>
            </div>

            <div className="border-l-4 border-destructive/50 pl-4">
              <h4 className="font-semibold mb-2">2. Medication Becomes a Moving Target</h4>
              <ul className="list-disc ml-4 text-muted-foreground space-y-1">
                <li>Substances interfere with effectiveness</li>
                <li>Side effects increase</li>
                <li>Doses change frequently</li>
                <li>Symptoms fluctuate unpredictably</li>
              </ul>
            </div>

            <div className="border-l-4 border-destructive/50 pl-4">
              <h4 className="font-semibold mb-2">3. Addiction Avoids Accountability</h4>
              <p className="text-muted-foreground mb-2">
                When mental health is framed as the "real issue," addiction may:
              </p>
              <ul className="list-disc ml-4 text-muted-foreground space-y-1">
                <li>Go unchallenged</li>
                <li>Be minimized</li>
                <li>Become invisible</li>
                <li>Continue unchecked</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Why Stabilizing Addiction Improves MH */}
        <Card className="mb-6 border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Why Stabilizing Addiction Often Improves Mental Health
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p>When substance use is reduced or stopped:</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Sleep improves",
                "Anxiety often decreases",
                "Mood stabilizes",
                "Cognitive function improves",
                "Therapy becomes more effective",
                "Diagnoses become clearer"
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-semibold text-primary">
                Many symptoms families feared were "permanent" improve dramatically with sobriety.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Common Misconceptions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Common Misconceptions Families Hear
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="italic text-muted-foreground">"They need therapy, not treatment."</p>
                <p className="font-medium mt-1">
                  In reality, many people need both—just not at the same time.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="italic text-muted-foreground">"Treatment will traumatize them."</p>
                <p className="font-medium mt-1">
                  Unstructured chaos is often more damaging than treatment.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="italic text-muted-foreground">"Once they feel better mentally, they'll stop using."</p>
                <p className="font-medium mt-1">
                  Addiction rarely resolves itself this way.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Sequence */}
        <Card className="mb-6 border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-primary" />
              The Importance of Treatment Sequence
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p>In most cases:</p>
            <ol className="space-y-3">
              {[
                "Stabilize substance use",
                "Establish structure and safety",
                "Clarify diagnosis",
                "Treat underlying mental health issues",
                "Integrate long-term recovery supports"
              ].map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-medium text-primary">
                This is not minimizing mental health—it is protecting it.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* When Mental Health Should Be First */}
        <Card className="mb-6 border-orange-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              When Mental Health Should Be Addressed First
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>There are exceptions, including:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Acute suicidal risk</li>
              <li>Severe psychosis</li>
              <li>Immediate psychiatric instability</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg">
              <p className="italic">
                Even in these cases, addiction must be addressed as soon as stabilization allows.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What Families Can Do */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              What Families Can Do Differently
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Ask providers about treatment sequencing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Avoid choosing between compassion and boundaries</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Support addiction treatment without abandoning mental health care</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Measure progress by behavior, not insight</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Prepare for structure after crisis</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Grounding Reframe */}
        <Card className="mb-6 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              A Grounding Reframe for Families
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              Addiction does not mean mental health doesn't matter.
            </p>
            <p className="text-lg font-semibold">
              It means mental health cannot heal properly while addiction is active.
            </p>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-medium text-primary">
                Addressing addiction first often creates the conditions for true mental health recovery.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Final Thought */}
        <Card className="mb-6 border-primary">
          <CardHeader>
            <CardTitle>Final Thought</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Families don't delay recovery because they don't care enough.
            </p>
            <p className="font-medium">
              They delay recovery because they are told the wrong thing to fix first.
            </p>
            <div className="bg-primary/10 p-4 rounded-lg text-center mt-4">
              <p className="text-lg font-semibold text-primary">
                Sequence is not severity.<br />
                It's strategy.
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
                <Link to="/mental-health-vs-substance-induced" className="text-primary hover:underline">
                  Mental Health vs. Substance-Induced Symptoms Guide
                </Link>
              </li>
              <li>
                <Link to="/misunderstood-diagnoses" className="text-primary hover:underline">
                  Commonly Misunderstood Diagnoses in Addiction
                </Link>
              </li>
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
                <Link to="/addiction-progression-timeline" className="text-primary hover:underline">
                  Addiction Progression Timeline
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

export default MentalHealthDelaysRecovery;
