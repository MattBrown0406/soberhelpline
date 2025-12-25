import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Brain, AlertTriangle, HelpCircle, XCircle, CheckCircle, Shield, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useGuideTracking } from "@/hooks/useGuideTracking";

const MisunderstoodDiagnoses = () => {
  useGuideTracking("/misunderstood-diagnoses", "Commonly Misunderstood Diagnoses in Addiction");
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <Helmet>
        <title>Commonly Misunderstood Diagnoses in Addiction | Family First Intervention</title>
        <meta 
          name="description" 
          content="Learn about commonly misunderstood psychiatric diagnoses in addiction. What families need to know and what to be careful not to assume." 
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
            Commonly Misunderstood Diagnoses in Addiction
          </h1>
          <p className="text-xl text-muted-foreground">
            What Families Need to Know—and What to Be Careful Not to Assume
          </p>
        </div>

        {/* Why This Guide Matters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Why This Guide Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Families are often given diagnoses—formally or informally—that seem to explain everything:</p>
            <ul className="space-y-1 ml-4 italic text-muted-foreground">
              <li>"They're bipolar."</li>
              <li>"They have borderline personality disorder."</li>
              <li>"It's ADHD."</li>
              <li>"It's trauma."</li>
              <li>"They're antisocial."</li>
            </ul>
            <p>
              Sometimes these diagnoses are accurate. Sometimes they are premature, incomplete, or substance-influenced.
            </p>
            <p>When diagnoses are misunderstood, families may:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Lower expectations too far—or raise them unrealistically</li>
              <li>Excuse harmful behavior unintentionally</li>
              <li>Chase the wrong treatment</li>
              <li>Lose hope unnecessarily</li>
              <li>Argue over labels instead of focusing on behavior and safety</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-semibold text-primary">
                Labels can clarify—or confuse—depending on how they're used.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Core Principle */}
        <Card className="mb-6 border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              A Core Principle Families Should Understand
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold text-center">
              Active substance use can mimic, exaggerate, or temporarily create psychiatric symptoms.
            </p>
            <p>This is why:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Diagnoses often change after sustained sobriety</li>
              <li>Early labels should be held lightly</li>
              <li>Behavior and patterns matter more than names</li>
            </ul>
          </CardContent>
        </Card>

        {/* 1. BPD */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Borderline Personality Disorder (BPD) Traits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Why It's Commonly Applied</h4>
              <p className="text-muted-foreground mb-2">People in active addiction may show:</p>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Emotional volatility</li>
                <li>Fear of abandonment</li>
                <li>Intense relationships</li>
                <li>Impulsivity</li>
                <li>Self-harming behaviors</li>
              </ul>
              <p className="mt-2 italic">These overlap with BPD traits.</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">What Families Often Miss</h4>
              <ul className="list-disc ml-6 text-sm space-y-1">
                <li>Substance use alone can create emotional instability</li>
                <li>Withdrawal amplifies mood swings</li>
                <li>Crisis-driven behavior can mimic personality pathology</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Important Distinction</h4>
              <p className="text-sm mb-2"><strong>Traits ≠ a full personality disorder</strong></p>
              <p className="text-sm">A true diagnosis requires long-term, stable observation—often during sobriety</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What Helps</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li>Structure</li>
                <li>Boundaries</li>
                <li>DBT-informed skills</li>
                <li>Avoiding labels as excuses for harm</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 2. Bipolar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Bipolar Disorder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Why It's Commonly Misdiagnosed</h4>
              <p className="text-muted-foreground mb-2">Substances—especially stimulants, alcohol, and cannabis—can cause:</p>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Mood swings</li>
                <li>Impulsivity</li>
                <li>Sleep disruption</li>
                <li>Risky behavior</li>
              </ul>
              <p className="mt-2 italic">These can look like mania or hypomania.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Red Flags for Substance-Induced</h4>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Mood changes closely track substance use</li>
                  <li>"Manic" periods coincide with intoxication or withdrawal</li>
                  <li>Stability improves with abstinence</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">When Bipolar Is More Likely</h4>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Mood cycles occur independent of substance use</li>
                  <li>Family history exists</li>
                  <li>Symptoms persist in sobriety</li>
                </ul>
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-medium text-primary">
                Treating bipolar disorder without addressing addiction often fails.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. ADHD */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. ADHD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Why ADHD Is Frequently Cited</h4>
              <p className="text-muted-foreground mb-2">Many people with addiction report:</p>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Restlessness</li>
                <li>Poor focus</li>
                <li>Impulsivity</li>
                <li>Difficulty with organization</li>
              </ul>
              <p className="mt-2 italic">These overlap with ADHD symptoms.</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">What Families Should Know</h4>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>Chronic substance use impairs attention and executive function</li>
                <li>Sleep deprivation worsens focus</li>
                <li>Stimulant misuse can mask or exaggerate symptoms</li>
              </ul>
            </div>
            <div className="bg-destructive/10 p-4 rounded-lg">
              <h4 className="font-semibold text-destructive mb-2">Caution for Families</h4>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>ADHD medications can be misused</li>
                <li>Diagnosis should be careful and staged</li>
                <li>Functioning should be assessed during sobriety</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 4. PTSD */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. PTSD and Trauma-Related Disorders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Why Trauma Is Central—but Often Misused</h4>
              <p className="text-muted-foreground mb-2">Trauma is common among people with addiction. However, trauma can be used to:</p>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Explain behavior without accountability</li>
                <li>Justify avoidance of addiction treatment</li>
                <li>Shift focus away from current harm</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Important Clarifications</h4>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>Trauma explains vulnerability—not behavior</li>
                <li>Trauma treatment alone does not stop addiction</li>
                <li>Trauma therapy during active use can destabilize</li>
              </ul>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">What Actually Helps</h4>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>Stabilization first</li>
                <li>Sobriety or reduced use</li>
                <li>Then trauma-informed therapy</li>
                <li>Accountability alongside compassion</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 5. Antisocial */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Antisocial Personality Traits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Why This Is Especially Confusing</h4>
              <p className="text-muted-foreground mb-2">Addiction can produce behaviors that look "antisocial":</p>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Lying</li>
                <li>Manipulation</li>
                <li>Exploitation</li>
                <li>Lack of empathy</li>
                <li>Rule-breaking</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">What Families Should Know</h4>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>These behaviors can be survival-driven</li>
                <li>Chronic use narrows emotional range</li>
                <li>Moral injury and shame distort behavior</li>
              </ul>
            </div>
            <div className="bg-destructive/10 p-4 rounded-lg">
              <h4 className="font-semibold text-destructive mb-2">When to Be More Concerned</h4>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>Longstanding patterns before substance use</li>
                <li>Lack of remorse across contexts</li>
                <li>Harm without intoxication or desperation</li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-medium">
                Families should focus on safety and boundaries, not debating labels.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 6. Depression */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Depression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Why Depression Is Often Misunderstood</h4>
              <p className="text-muted-foreground mb-2">Substance use can cause:</p>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1">
                <li>Emotional blunting</li>
                <li>Hopelessness</li>
                <li>Sleep disturbance</li>
                <li>Low motivation</li>
              </ul>
              <p className="mt-2 italic">This can look like major depression.</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Substance-Induced Clues</h4>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>Mood improves briefly with use</li>
                <li>Depression worsens during withdrawal</li>
                <li>Energy fluctuates unpredictably</li>
              </ul>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">What Families Can Do</h4>
              <ul className="list-disc ml-4 text-sm space-y-1">
                <li>Encourage sobriety for diagnostic clarity</li>
                <li>Avoid assuming medication alone will fix the issue</li>
                <li>Support structured recovery first</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 7. Dual Diagnosis */}
        <Card className="mb-6 border-orange-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              7. "Dual Diagnosis" as a Catch-All
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">The Problem With the Term</h4>
              <p className="text-muted-foreground mb-2">"Dual diagnosis" is often used to mean:</p>
              <ul className="list-disc ml-6 text-muted-foreground space-y-1 italic">
                <li>"It's complicated"</li>
                <li>"It's not just addiction"</li>
                <li>"We don't know what's primary"</li>
              </ul>
            </div>
            <p>While dual diagnosis is real, the term can:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Blur treatment priorities</li>
              <li>Delay addiction stabilization</li>
              <li>Reduce accountability</li>
            </ul>
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <p className="font-semibold text-primary">
                A Better Question: What needs to be treated first so everything else can be treated accurately?
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What to Focus on Instead */}
        <Card className="mb-6 border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              What Families Should Focus on Instead of Labels
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Patterns over time</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Behavior under structure</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Response to boundaries</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Stability during abstinence</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Safety and function</span>
              </li>
            </ul>
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-semibold text-primary">
                Behavior is more reliable than diagnosis during active addiction.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Traps to Avoid */}
        <Card className="mb-6 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Common Family Traps to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                Using diagnoses to excuse harm
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                Debating labels instead of setting boundaries
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                Expecting insight to equal capacity
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                Believing medication replaces structure
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                Waiting for "the right diagnosis" to act
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
            <p className="text-lg font-semibold text-center">
              Diagnoses are tools—not verdicts.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="font-medium mb-2">They are meant to:</p>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Inform treatment</li>
                  <li>Guide support</li>
                  <li>Reduce suffering</li>
                </ul>
              </div>
              <div className="bg-destructive/10 p-4 rounded-lg">
                <p className="font-medium mb-2">They should never:</p>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Remove accountability</li>
                  <li>Override safety</li>
                  <li>Replace boundaries</li>
                  <li>Become identity cages</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Thought */}
        <Card className="mb-6 border-primary">
          <CardHeader>
            <CardTitle>Final Thought</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              Many diagnoses become clearer—sometimes very different—after sobriety and stabilization.
            </p>
            <p className="font-medium">Families help most when they:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Stay curious, not rigid</li>
              <li>Support structure, not labels</li>
              <li>Protect safety and stability</li>
              <li>Allow time for clarity to emerge</li>
            </ul>
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
              <li>
                <Link to="/drug-induced-psychosis" className="text-primary hover:underline">
                  Drug-Induced Psychosis Guide
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

export default MisunderstoodDiagnoses;
