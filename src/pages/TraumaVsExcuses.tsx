import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Heart, AlertTriangle, Shield, XCircle, CheckCircle, Scale, HelpCircle, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useGuideTracking } from "@/hooks/useGuideTracking";

const TraumaVsExcuses = () => {
  useGuideTracking("/trauma-vs-excuses", "Trauma vs. Excuses: A Necessary Distinction");
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <Helmet>
        <title>Trauma vs. Excuses: A Necessary Distinction | Family First Intervention</title>
        <meta 
          name="description" 
          content="Learn how to hold compassion for trauma without justifying harm. A guide for families navigating accountability and understanding." 
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
            Trauma vs. Excuses: A Necessary Distinction
          </h1>
          <p className="text-xl text-muted-foreground">
            How to Hold Compassion Without Justifying Harm
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
            <p>Families often hear statements like:</p>
            <ul className="space-y-1 ml-4 italic text-muted-foreground">
              <li>"They can't help it—it's trauma."</li>
              <li>"You have to be patient because of what they've been through."</li>
              <li>"If you push them, you'll retraumatize them."</li>
              <li>"They're not choosing this—it's their past."</li>
            </ul>
            <p>
              These statements are often well-intended. They come from empathy, fear, 
              and a desire not to cause more pain.
            </p>
            <p>
              But when trauma becomes the only lens through which behavior is viewed, 
              families can unintentionally:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Excuse ongoing harm</li>
              <li>Delay recovery</li>
              <li>Erode boundaries</li>
              <li>Sacrifice their own safety and stability</li>
            </ul>
            <p className="font-medium">
              This guide exists to clarify what trauma explains—and what it does not.
            </p>
          </CardContent>
        </Card>

        {/* Important Truth */}
        <Card className="mb-6 border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              First, an Important Truth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-lg">Trauma is real.</p>
              <p className="text-lg">Trauma matters.</p>
              <p className="text-lg">Trauma shapes behavior.</p>
              <p className="text-lg font-bold mt-4">And…</p>
              <p className="text-lg font-semibold text-primary">
                Trauma does not remove responsibility for behavior.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-medium">
                Both statements can be true at the same time.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What Trauma Does Explain */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              What Trauma Does Explain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Trauma can legitimately explain:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Heightened fear responses</li>
              <li>Emotional reactivity</li>
              <li>Difficulty trusting others</li>
              <li>Avoidance of discomfort</li>
              <li>Dissociation or numbing</li>
              <li>Substance use as self-medication</li>
              <li>Difficulty regulating emotions</li>
            </ul>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <p className="text-blue-700 dark:text-blue-400">
                Trauma changes the nervous system. It alters how the brain responds to stress.
              </p>
              <p className="mt-2 font-medium text-blue-700 dark:text-blue-400">
                Understanding this helps families respond with empathy rather than judgment.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What Trauma Does NOT Excuse */}
        <Card className="mb-6 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              What Trauma Does Not Explain or Excuse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Trauma does not excuse:</p>
            <ul className="space-y-2">
              {[
                "Violence or threats",
                "Ongoing verbal or emotional abuse",
                "Repeated dishonesty without accountability",
                "Manipulation that harms others",
                "Refusal to seek help indefinitely",
                "Ignoring boundaries without consequence"
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-destructive font-bold">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-semibold text-primary">
                Understanding why something happens does not mean accepting it.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How Trauma Becomes an Excuse */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              How Trauma Becomes an Excuse (Without Intending To)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Trauma becomes an excuse when:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Harmful behavior is tolerated indefinitely</li>
              <li>Boundaries are avoided to prevent discomfort</li>
              <li>Accountability is seen as cruelty</li>
              <li>Safety is sacrificed for empathy</li>
              <li>Families are told to "just be patient" without limits</li>
            </ul>
            <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg">
              <p className="font-medium text-orange-700 dark:text-orange-400">
                This often leads to chronic instability for everyone involved.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Excusing Harms Recovery */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Why Excusing Behavior Actually Harms Recovery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>When trauma is used to justify harmful behavior:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>The person never experiences corrective consequences</li>
              <li>Motivation for change decreases</li>
              <li>Treatment engagement stalls</li>
              <li>Families burn out or disengage</li>
              <li>Trauma itself remains untreated</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-semibold text-primary">
                Recovery requires safety, structure, and accountability—not protection from reality.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* The Middle Ground */}
        <Card className="mb-6 border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              The Middle Ground: Trauma-Informed Accountability
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p>Trauma-informed accountability means:</p>
            <ul className="space-y-2">
              {[
                "Acknowledging pain without tolerating harm",
                "Setting boundaries without shaming",
                "Supporting treatment without rescuing",
                "Offering compassion without surrendering standards"
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-medium italic">
                This approach says: "I understand why this is hard—and this behavior still isn't acceptable."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What Boundaries Sound Like */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              What Trauma-Informed Boundaries Sound Like
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "I know your past makes this harder. I still won't accept being yelled at.",
              "I care about what you've been through, and I won't provide money when substances are involved.",
              "I understand your fear. Treatment is still necessary.",
              "I can love you and still say no."
            ].map((statement, index) => (
              <div key={index} className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                <p className="italic">"{statement}"</p>
              </div>
            ))}
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-medium">
                Boundaries do not deny trauma.<br />
                They protect everyone involved.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Families Feel Guilty */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Why Families Feel Guilty Holding the Line
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Families often worry:</p>
            <ul className="space-y-1 ml-4 italic text-muted-foreground">
              <li>"Am I being cruel?"</li>
              <li>"Am I making it worse?"</li>
              <li>"What if they can't help it?"</li>
              <li>"What if this pushes them away?"</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg">
              <p>
                These fears are understandable—but avoiding boundaries does not prevent harm.
              </p>
              <p className="font-medium mt-2">It often prolongs it.</p>
            </div>
          </CardContent>
        </Card>

        {/* Trauma Treatment vs Avoidance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Trauma Treatment vs. Trauma Avoidance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium">True trauma healing involves:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Facing discomfort safely</li>
              <li>Learning emotional regulation</li>
              <li>Developing accountability</li>
              <li>Rebuilding trust over time</li>
            </ul>
            <div className="bg-destructive/10 p-4 rounded-lg mt-4">
              <p className="font-medium text-destructive">
                Avoidance, protection, and rescuing do not heal trauma.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-semibold text-primary">
                Growth requires tolerating discomfort—not eliminating it.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Critical Reframe */}
        <Card className="mb-6 bg-primary/5">
          <CardHeader>
            <CardTitle>A Critical Reframe for Families</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold text-center text-primary">
              Trauma explains vulnerability—not entitlement.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="font-medium mb-2">Compassion means:</p>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Understanding the wound</li>
                  <li>Supporting healing</li>
                  <li>Holding standards</li>
                  <li>Protecting safety</li>
                </ul>
              </div>
              <div className="bg-destructive/10 p-4 rounded-lg">
                <p className="font-medium mb-2">It does not mean:</p>
                <ul className="list-disc ml-4 text-sm space-y-1">
                  <li>Enduring harm</li>
                  <li>Sacrificing yourself</li>
                  <li>Accepting chaos indefinitely</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions to Ask */}
        <Card className="mb-6 border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle>Questions Families Can Ask Themselves</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {[
              "Does my response reduce harm—or prolong it?",
              "Am I protecting trauma—or protecting addiction?",
              "Does this boundary increase safety and clarity?",
              "Would I tolerate this behavior without trauma as the explanation?"
            ].map((question, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <p>{question}</p>
              </div>
            ))}
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-medium">These questions restore clarity.</p>
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
              Families don't struggle because they lack compassion.
            </p>
            <p className="font-medium">
              They struggle because they are asked to choose between compassion and accountability.
            </p>
            <div className="bg-primary/10 p-4 rounded-lg text-center mt-4">
              <p className="text-lg font-semibold text-primary mb-2">
                You do not have to choose.
              </p>
              <p>Trauma deserves care.</p>
              <p>Harm deserves limits.</p>
              <p className="font-medium mt-2">Both are necessary for healing.</p>
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
                <Link to="/why-willpower-fails" className="text-primary hover:underline">
                  Why Willpower Fails Guide
                </Link>
              </li>
              <li>
                <Link to="/family-education#boundary-worksheet" className="text-primary hover:underline">
                  Boundary Setting Worksheet
                </Link>
              </li>
              <li>
                <Link to="/family-education#guilt-responsibility" className="text-primary hover:underline">
                  Guilt vs. Responsibility Module
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

export default TraumaVsExcuses;
