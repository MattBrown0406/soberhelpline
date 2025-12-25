import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Brain, AlertTriangle, HelpCircle, XCircle, CheckCircle, Heart, Scale } from "lucide-react";
import { Link } from "react-router-dom";

const MentalHealthVsSubstanceInduced = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <Helmet>
        <title>Mental Health vs. Substance-Induced Symptoms | Family First Intervention</title>
        <meta 
          name="description" 
          content="Learn to distinguish between primary mental health conditions and substance-induced symptoms. A guide for families navigating dual diagnosis." 
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
            Mental Health vs. Substance-Induced Symptoms
          </h1>
          <p className="text-xl text-muted-foreground">
            How to Tell the Difference—and Why It Matters
          </p>
        </div>

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
      </div>
    </Layout>
  );
};

export default MentalHealthVsSubstanceInduced;
