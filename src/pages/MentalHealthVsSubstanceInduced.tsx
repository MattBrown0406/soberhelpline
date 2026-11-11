import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Brain, AlertTriangle, HelpCircle, XCircle, CheckCircle, Heart, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";
import SafetyBox from "@/components/SafetyBox";

const MentalHealthVsSubstanceInduced = () => {
  useGuideTracking("/mental-health-vs-substance-induced", "Mental Health vs. Substance-Induced Symptoms");
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <Helmet>
        <title>Mental Health vs Substance-Induced Symptoms | Sober Helpline</title>
        <meta 
          name="description" 
          content="Learn to distinguish between primary mental health conditions and substance-induced symptoms. A guide for families navigating dual diagnosis." 
        />
        <link rel="canonical" href="https://soberhelpline.com/mental-health-vs-substance-induced" />
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

        <ToolBrandHeader
          headingAs="h1"
          title="Mental Health vs. Substance-Induced Symptoms"
          subtitle="How to tell the difference — and why it matters. This guide helps families navigate confusing diagnostic territory with clarity."
          clinicalNote="Based on DSM-5 differential diagnosis criteria and ASAM guidelines for co-occurring disorder assessment."
        />

        <SafetyBox topics={["suicide", "emergency"]} />

        {/* Why Families Need This Guide */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Why Families Need This Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Families often hear conflicting explanations:</p>
            <ul className="space-y-1 ml-4 italic text-muted-foreground">
              <li>"They're depressed."</li>
              <li>"They're bipolar."</li>
              <li>"They're self-medicating."</li>
              <li>"They need therapy, not treatment."</li>
              <li>"They need treatment, not therapy."</li>
            </ul>
            <p>Without clarity, families may:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Chase the wrong diagnosis</li>
              <li>Delay effective treatment</li>
              <li>Minimize addiction unintentionally</li>
              <li>Place hope in the wrong solution</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-semibold text-primary">
                Not all symptoms are the illness.<br />
                Some are the effect of the substance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What Does Substance-Induced Mean */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              What Does "Substance-Induced" Mean?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Substance-induced symptoms are mental health–like symptoms caused or worsened by alcohol or drugs, including:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["Mood changes", "Anxiety", "Depression", "Psychosis", "Irritability", "Emotional instability", "Cognitive impairment"].map((symptom) => (
                <div key={symptom} className="bg-muted p-2 rounded text-center text-sm">
                  {symptom}
                </div>
              ))}
            </div>
            <p className="italic">
              These symptoms can look identical to primary mental health disorders—but they often improve when substances are removed.
            </p>
          </CardContent>
        </Card>

        {/* Why This Distinction Is Important */}
        <Card className="mb-6 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Why This Distinction Is So Important
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Treating a substance-induced symptom as a primary mental illness can:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Delay addiction treatment</li>
              <li>Lead to ineffective or excessive medication</li>
              <li>Reinforce denial ("It's not addiction")</li>
              <li>Increase relapse risk</li>
            </ul>
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <p className="font-semibold text-primary">
                Treating addiction first often clarifies what remains.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* When Mental Health Should Be Addressed First (merged from Why Focusing Only on Mental Health Can Delay Recovery) */}
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

        {/* Key Principle */}
        <Card className="mb-6 border-primary bg-primary/5">
          <CardHeader>
            <CardTitle>Key Principle Families Should Understand</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg font-semibold mb-4">
              You cannot accurately diagnose many mental health conditions while someone is actively using substances.
            </p>
            <p className="text-primary font-medium">
              Sobriety creates diagnostic clarity.
            </p>
          </CardContent>
        </Card>

        {/* Depression Comparison */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Depression vs. Substance-Induced Depression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">May Look Like:</h4>
              <div className="flex flex-wrap gap-2">
                {["Hopelessness", "Low motivation", "Sleep disturbance", "Withdrawal from others"].map((item) => (
                  <span key={item} className="bg-background px-2 py-1 rounded text-sm">{item}</span>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Substance-Induced Clues</h4>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Symptoms worsen after binges</li>
                  <li>Mood improves temporarily with use</li>
                  <li>Depression deepens during withdrawal</li>
                  <li>Energy fluctuates unpredictably</li>
                </ul>
              </div>
              <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Mental Health Clues</h4>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Symptoms persist during sobriety</li>
                  <li>Depression existed before substance use</li>
                  <li>Mood remains stable but low over time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anxiety Comparison */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Anxiety Disorders vs. Substance-Induced Anxiety</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">May Look Like:</h4>
              <div className="flex flex-wrap gap-2">
                {["Panic attacks", "Restlessness", "Irritability", "Avoidance"].map((item) => (
                  <span key={item} className="bg-background px-2 py-1 rounded text-sm">{item}</span>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Substance-Induced Clues</h4>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Anxiety spikes during withdrawal</li>
                  <li>Relief comes from using again</li>
                  <li>Anxiety worsens with stimulants or cannabis</li>
                  <li>Sleep deprivation contributes</li>
                </ul>
              </div>
              <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Mental Health Clues</h4>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Anxiety predates substance use</li>
                  <li>Symptoms persist after detox</li>
                  <li>Anxiety responds to therapy without substances</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bipolar Comparison */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Bipolar Disorder vs. Substance Effects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">May Look Like:</h4>
              <div className="flex flex-wrap gap-2">
                {["Mood swings", "Impulsivity", "Risky behavior", "Sleep disruption"].map((item) => (
                  <span key={item} className="bg-background px-2 py-1 rounded text-sm">{item}</span>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Substance-Induced Clues</h4>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Mood changes track closely with use</li>
                  <li>"Manic" behavior occurs during intoxication</li>
                  <li>Sleep loss is drug-related</li>
                  <li>Behavior stabilizes during abstinence</li>
                </ul>
              </div>
              <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Mental Health Clues</h4>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Cycles occur independent of use</li>
                  <li>Symptoms persist in sobriety</li>
                  <li>Family history of bipolar disorder</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Psychosis Comparison */}
        <Card className="mb-6 border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              4. Psychosis: Mental Illness vs. Substance-Induced Psychosis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">May Look Like:</h4>
              <div className="flex flex-wrap gap-2">
                {["Paranoia", "Hallucinations", "Delusions", "Disorganized thinking"].map((item) => (
                  <span key={item} className="bg-background px-2 py-1 rounded text-sm">{item}</span>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Substance-Induced Clues</h4>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Symptoms appear after use</li>
                  <li>Intensify with continued use</li>
                  <li>Improve partially with abstinence</li>
                  <li>Common with THC, methamphetamine, stimulants</li>
                </ul>
              </div>
              <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Mental Health Clues</h4>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Symptoms persist long after sobriety</li>
                  <li>Onset not tied to substance timing</li>
                  <li>Gradual decline before substance use</li>
                </ul>
              </div>
            </div>
            <div className="bg-destructive/10 p-4 rounded-lg text-center">
              <p className="font-semibold text-destructive">
                Psychosis—regardless of cause—is a medical emergency.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Commonly Misunderstood Diagnoses (merged from Commonly Misunderstood Diagnoses in Addiction) */}
        <Card className="mb-6 border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Commonly Misunderstood Diagnoses in Addiction
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
            <p className="font-semibold">
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

        {/* 5. BPD traits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Borderline Personality Disorder (BPD) Traits</CardTitle>
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

        <SafetyBox topics={["suicide"]} title="If there is self-harm or any talk of suicide" />

        {/* 6. ADHD */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. ADHD</CardTitle>
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

        {/* 7. Antisocial traits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Antisocial Personality Traits</CardTitle>
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

        {/* 8. Dual Diagnosis */}
        <Card className="mb-6 border-orange-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              8. "Dual Diagnosis" as a Catch-All
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
          </CardContent>
        </Card>

        {/* Why Families Focus on Mental Health */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Why Families Often Focus on Mental Health First
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Families may emphasize mental health because:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>It carries less stigma than addiction</li>
              <li>It feels more compassionate</li>
              <li>It avoids confrontation</li>
              <li>It preserves hope without boundaries</li>
            </ul>
            <p className="italic">This is understandable—but often counterproductive.</p>
            {/* Merged from Why Focusing Only on Mental Health Can Delay Recovery */}
            <div className="border-l-4 border-destructive/50 pl-4">
              <h4 className="font-semibold mb-2">Therapy Without Sobriety Has Limits</h4>
              <ul className="list-disc ml-4 text-muted-foreground space-y-1">
                <li>Insight does not equal behavior change</li>
                <li>Emotional processing can increase craving</li>
                <li>Sessions may become repetitive or avoidant</li>
                <li>Progress collapses between appointments</li>
              </ul>
            </div>
            <div className="border-l-4 border-destructive/50 pl-4">
              <h4 className="font-semibold mb-2">Medication Becomes a Moving Target</h4>
              <ul className="list-disc ml-4 text-muted-foreground space-y-1">
                <li>Substances interfere with effectiveness</li>
                <li>Side effects increase</li>
                <li>Doses change frequently</li>
                <li>Symptoms fluctuate unpredictably</li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-medium text-primary">
                Treating mental health without addressing addiction is like treating pain while ignoring infection.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Effective Treatment */}
        <Card className="mb-6 border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              What Effective Treatment Usually Requires
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p>In most cases:</p>
            <ol className="list-decimal ml-6 space-y-2">
              <li><strong>Substance stabilization comes first</strong></li>
              <li>Diagnostic clarity follows sobriety</li>
              <li>Mental health treatment is adjusted afterward</li>
              <li>Both conditions are addressed—in sequence</li>
            </ol>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="italic">
                This is not minimizing mental health.<br />
                It is protecting it.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Stabilizing Addiction Often Improves Mental Health (merged from Why Focusing Only on Mental Health Can Delay Recovery) */}
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

        {/* How Families Can Think Clearly */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              How Families Can Think More Clearly
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium">Ask:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Do symptoms worsen with use?</li>
              <li>Do symptoms improve with abstinence?</li>
              <li>Is insight consistent or fluctuating?</li>
              <li>Are symptoms stable—or chaotic?</li>
              <li>What happens when structure increases?</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-semibold text-primary">Patterns matter more than labels.</p>
            </div>
          </CardContent>
        </Card>

        {/* What Families Should Avoid */}
        <Card className="mb-6 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              What Families Should Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                Self-diagnosing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                Arguing over labels
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                Using diagnoses to avoid boundaries
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                Expecting therapy to fix active addiction
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">✕</span>
                Assuming medication alone will resolve substance-driven symptoms
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* What Families Can Do Differently (merged from Why Focusing Only on Mental Health Can Delay Recovery) */}
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
            <CardTitle>A Grounding Reframe for Families</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              Addiction and mental health often coexist—but addiction distorts everything around it.
            </p>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-medium text-primary">
                Addressing addiction does not invalidate mental health struggles.<br />
                It often reveals them more clearly.
              </p>
            </div>
            {/* Merged from Commonly Misunderstood Diagnoses in Addiction */}
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
            <p>Families don't need to choose between:</p>
            <ul className="list-disc ml-6 space-y-1 italic text-muted-foreground">
              <li>"It's addiction"</li>
              <li>"It's mental health"</li>
            </ul>
            <p className="font-medium">The real question is:</p>
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <p className="text-lg font-semibold text-primary">
                What needs to be addressed first so everything else can be treated accurately?
              </p>
            </div>
            <p className="text-center italic mt-4">
              Clarity comes from stabilization—not debate.
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
                  Disease vs. Choice Reality Map
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
              <li>
                <Link to="/aftercare-checklist" className="text-primary hover:underline">
                  Aftercare Readiness Checklist
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

        <RelatedResources currentPath="/mental-health-vs-substance-induced" />
      </div>
    </Layout>
  );
};

export default MentalHealthVsSubstanceInduced;
