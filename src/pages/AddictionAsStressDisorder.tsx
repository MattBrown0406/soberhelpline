import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Printer, Brain, AlertTriangle, RefreshCw, Heart, Shield, Clock, Target, Users, Lightbulb, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

const AddictionAsStressDisorder = () => {
  const navigate = useNavigate();
  
  useGuideTracking("/addiction-as-stress-disorder", "Addiction as a Stress-Regulation Disorder");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Addiction as a Stress-Regulation Disorder | Family Education</title>
        <meta name="description" content="Understanding addiction as a chronic stress-regulation disorder that hijacks the brain's survival systems - a guide for families." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Button
            variant="ghost"
            onClick={() => navigate("/family-education")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Family Education
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Guide
          </Button>
        </div>

        <ToolBrandHeader
          title="Addiction as a Stress-Regulation Disorder"
          subtitle="A reframe for families seeking to understand why their loved one keeps returning to substances despite consequences. This isn't about weakness — it's about a nervous system that learned to survive in harmful ways."
          clinicalNote="Based on Dr. Gabor Maté's stress-regulation framework, Polyvagal Theory (Stephen Porges), and ACE (Adverse Childhood Experiences) research."
        />


        {/* Why This Guide Matters */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Why This Guide Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Families are often told:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground italic">
              <li>"Addiction is a disease."</li>
              <li>"Addiction is a choice."</li>
              <li>"They just need to want it badly enough."</li>
            </ul>
            <p className="text-muted-foreground">
              Each of these explanations is incomplete on its own—and often confusing.
            </p>
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="font-semibold text-foreground">A more accurate and useful reframe:</p>
              <p className="text-lg font-medium text-primary mt-2">
                Addiction is a chronic stress-regulation disorder that hijacks the brain's survival systems.
              </p>
            </div>
            <p className="text-muted-foreground">Understanding addiction this way helps families:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Stop personalizing behavior</li>
              <li>Understand why logic fails</li>
              <li>See why pressure backfires</li>
              <li>Learn why structure—not emotion—drives change</li>
            </ul>
          </CardContent>
        </Card>

        {/* What Stress Actually Means */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              What Stress Actually Means (Beyond Being "Upset")
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Stress is not just emotional discomfort.</p>
            <p className="font-medium text-foreground">Stress involves:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Threat perception</li>
              <li>Nervous system activation</li>
              <li>Survival responses</li>
              <li>Physiological arousal</li>
              <li>Urgency to escape or soothe</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium text-foreground">
                The brain's job is not happiness.<br />
                It is survival.
              </p>
            </div>
            <p className="text-muted-foreground">
              When the brain perceives ongoing threat—internal or external—it looks for relief.
            </p>
          </CardContent>
        </Card>

        {/* How Substances Become a Stress Solution */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              How Substances Become a Stress Solution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Substances are not chosen randomly.</p>
            <p className="font-medium text-foreground">They reliably:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Reduce anxiety</li>
              <li>Numb emotional pain</li>
              <li>Increase confidence or energy</li>
              <li>Shut down fear temporarily</li>
              <li>Create a sense of control</li>
            </ul>
            <p className="text-muted-foreground">For a stressed nervous system, substances feel like:</p>
            <p className="font-semibold text-foreground text-center py-2">
              Relief, regulation, and safety—at first.
            </p>
            <p className="text-muted-foreground italic">
              This is why people don't "just stop" when consequences appear.
            </p>
          </CardContent>
        </Card>

        {/* The Stress–Addiction Loop */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              The Stress–Addiction Loop
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Over time, a predictable loop forms:</p>
            <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
              <li>Stress builds (emotional, relational, internal)</li>
              <li>Substance use reduces stress temporarily</li>
              <li>The brain learns the shortcut</li>
              <li>Tolerance increases</li>
              <li>Baseline stress rises</li>
              <li>More substance is required</li>
              <li>Consequences increase stress</li>
              <li>The loop tightens</li>
            </ol>
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 text-center">
              <p className="font-semibold text-foreground">
                Addiction is not about pleasure.<br />
                It is about relief from overwhelm.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Insight Doesn't Break the Loop */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Why Insight Doesn't Break the Loop
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Families often ask:</p>
            <p className="italic text-muted-foreground pl-4 border-l-2 border-primary">
              "They know this is ruining their life—why keep using?"
            </p>
            <p className="font-medium text-foreground">Because:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Insight lives in the thinking brain</li>
              <li>Addiction lives in the survival brain</li>
              <li>Stress shuts down access to logic</li>
              <li>Fear increases compulsion</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium text-foreground">
                A dysregulated nervous system cannot be reasoned into regulation.
              </p>
            </div>
            <p className="text-muted-foreground italic">
              This is why lectures, logic, and ultimatums often fail.
            </p>
          </CardContent>
        </Card>

        {/* Why Stress Is So High */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Why Stress Is So High in Addiction-Affected Families
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium text-foreground">Stress comes from:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Trauma history</li>
              <li>Untreated mental health symptoms</li>
              <li>Shame and secrecy</li>
              <li>Family conflict</li>
              <li>Financial pressure</li>
              <li>Identity collapse</li>
              <li>Fear of loss</li>
              <li>Withdrawal states</li>
            </ul>
            <p className="text-muted-foreground italic">
              Families often underestimate how constant this stress is.
            </p>
          </CardContent>
        </Card>

        {/* Family Responses */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              How Family Responses Can Increase or Decrease Stress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-destructive mb-2">Stress-Increasing Responses (Unintentionally)</h4>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Yelling or threatening</li>
                <li>Emotional pleading</li>
                <li>Inconsistent boundaries</li>
                <li>Crisis-driven reactions</li>
                <li>Monitoring and interrogating</li>
                <li>Rescue followed by resentment</li>
              </ul>
              <p className="text-muted-foreground italic mt-2">
                These increase nervous system activation—even when motivated by love.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Stress-Reducing (Recovery-Supportive) Responses</h4>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Calm, predictable boundaries</li>
                <li>Consistent consequences</li>
                <li>Reduced emotional intensity</li>
                <li>Clear expectations</li>
                <li>External accountability</li>
                <li>Stable routines</li>
              </ul>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 text-center">
              <p className="font-semibold text-foreground">
                Lower stress = increased capacity for change.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Pressure Makes Things Worse */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Why Pressure Often Makes Things Worse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium text-foreground">Pressure activates:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Threat response</li>
              <li>Defensiveness</li>
              <li>Shame</li>
              <li>Avoidance</li>
              <li>Rebellion or collapse</li>
            </ul>
            <p className="text-muted-foreground">Pressure tells the survival brain:</p>
            <p className="font-semibold text-foreground text-center py-2 text-lg">
              "You are not safe."
            </p>
            <p className="text-muted-foreground italic">
              Stress-driven systems double down—not open up.
            </p>
          </CardContent>
        </Card>

        {/* What Actually Helps */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              What Actually Helps a Stress Disorder Heal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">1. External Structure</h4>
              <p className="text-muted-foreground mb-2">Structure replaces internal chaos:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Treatment</li>
                <li>Sober living</li>
                <li>Monitoring</li>
                <li>Routines</li>
                <li>Accountability systems</li>
              </ul>
              <p className="text-muted-foreground italic mt-2">Structure reduces cognitive load and stress.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">2. Nervous System Regulation</h4>
              <p className="text-muted-foreground mb-2">Recovery requires learning:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Emotional tolerance</li>
                <li>Distress skills</li>
                <li>Grounding techniques</li>
                <li>Healthy stress outlets</li>
              </ul>
              <p className="text-muted-foreground italic mt-2">
                Substances were regulating something. That function must be replaced.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">3. Predictable Boundaries</h4>
              <p className="text-muted-foreground mb-2">Boundaries reduce uncertainty:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>No guessing</li>
                <li>No negotiation</li>
                <li>No emotional bargaining</li>
              </ul>
              <p className="text-muted-foreground italic mt-2">
                Predictability calms the system—even when disliked.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">4. Time</h4>
              <p className="text-muted-foreground mb-2">Stress systems heal slowly:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Brain chemistry stabilizes</li>
                <li>Emotional tolerance increases</li>
                <li>Identity rebuilds</li>
              </ul>
              <p className="text-muted-foreground italic mt-2">Urgency often backfires.</p>
            </div>
          </CardContent>
        </Card>

        {/* Why Relapse Is Common */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Why Relapse Is Common in Stress Disorders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium text-foreground">Relapse often occurs when:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Stress increases suddenly</li>
              <li>Structure decreases too quickly</li>
              <li>Emotional load overwhelms capacity</li>
              <li>Families mistake calm for readiness</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium text-foreground">
                Relapse is not moral failure.<br />
                It is stress exceeding regulation capacity.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What This Reframe Changes */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              What This Reframe Changes for Families
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Understanding addiction as a stress disorder helps families:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Stop taking behavior personally</li>
              <li>Reduce emotional reactivity</li>
              <li>Focus on structure over persuasion</li>
              <li>Hold boundaries without anger</li>
              <li>Support recovery without rescuing</li>
              <li>Care for their own nervous systems</li>
            </ul>
          </CardContent>
        </Card>

        {/* Critical Reframe */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              A Critical Reframe for Families
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-background p-4 rounded-lg border">
              <p className="font-semibold text-foreground text-lg text-center">
                If stress fuels addiction, then reducing chaos—not increasing pressure—is the most powerful intervention families can make.
              </p>
            </div>
            <p className="text-center text-muted-foreground font-medium">
              Calm is not permissive.<br />
              It is stabilizing.
            </p>
          </CardContent>
        </Card>

        {/* Reflection Questions */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Reflection Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>What stressors might substances be regulating?</li>
              <li>How does our family respond to stress?</li>
              <li>Where might our reactions increase activation?</li>
              <li>What structure reduces stress—for everyone?</li>
              <li>What boundaries create predictability?</li>
            </ul>
          </CardContent>
        </Card>

        {/* Final Thought */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border bg-muted">
          <CardHeader>
            <CardTitle>Final Thought</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Addiction is not a failure of willpower.<br />
              It is a nervous system stuck in survival mode.
            </p>
            <p className="font-medium text-foreground">Recovery begins when:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Stress is reduced</li>
              <li>Structure is added</li>
              <li>Boundaries are predictable</li>
              <li>Regulation is taught</li>
              <li>Families stop fighting symptoms—and start stabilizing systems</li>
            </ul>
            <div className="bg-background p-4 rounded-lg border mt-4">
              <p className="font-semibold text-foreground text-center">
                You don't argue a stress disorder into submission.<br />
                You stabilize it into healing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Companion Resources */}
        <Card className="mb-6 print:break-inside-avoid print:shadow-none print:border">
          <CardHeader>
            <CardTitle>Suggested Companion Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/why-change-doesnt-happen")}>
                  Why Pressure Delays Change
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/guilt-relief-resentment-cycle")}>
                  The Guilt–Relief–Resentment Cycle
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/boundary-drift")}>
                  Boundary Drift: How Limits Slowly Erode
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/emotional-regulation")}>
                  Emotional Regulation Tools for Families
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/living-well-regardless")}>
                  Living Well Regardless of Outcome
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <RelatedResources currentPath="/addiction-as-stress-disorder" />
    </div>
  );
};

export default AddictionAsStressDisorder;
