import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Brain, Scale, AlertTriangle, Heart, CheckCircle, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

const DiseaseChoiceRealityMap = () => {
  useGuideTracking("The Disease vs. Choice Reality Map", "/disease-choice-reality-map");
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <Helmet>
        <title>Disease vs Choice Reality Map | Sober Helpline</title>
        <meta 
          name="description" 
          content="Understand where addiction limits choice and where responsibility still exists. A guide for families navigating the disease model." 
        />
        <link rel="canonical" href="https://soberhelpline.com/disease-choice-reality-map" />
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
          title="The Disease vs. Choice Reality Map"
          subtitle="Understanding where addiction limits choice — and where responsibility still exists. This guide helps families move past the binary debate and into actionable clarity."
          clinicalNote="Informed by ASAM's definition of addiction, NIDA's brain disease model, and the biopsychosocial framework used in modern addiction medicine."
        />


        {/* Why Families Get Stuck */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Why Families Get Stuck Here
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Most families live in a constant internal argument:</p>
            <ul className="space-y-2 ml-4">
              <li className="italic text-muted-foreground">"If addiction is a disease, why don't they just stop?"</li>
              <li className="italic text-muted-foreground">"If they can't control it, how can we hold them accountable?"</li>
              <li className="italic text-muted-foreground">"Are we being too soft—or too harsh?"</li>
            </ul>
            <p>
              This confusion often leads to inconsistent responses—sometimes rescuing, sometimes threatening, 
              sometimes withdrawing completely.
            </p>
            <p className="font-medium">
              This guide exists to clarify where choice is impaired, where responsibility remains, 
              and why both can be true at the same time.
            </p>
          </CardContent>
        </Card>

        {/* The Core Truth */}
        <Card className="mb-6 border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              The Core Truth (Holding Two Realities)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="font-medium">Addiction is:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>A disease of the brain</li>
              <li>That impairs choice, judgment, and impulse control</li>
              <li><strong>But does not eliminate responsibility for behavior</strong></li>
            </ul>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-lg font-semibold text-primary">
                Addiction explains behavior.<br />
                It does not excuse harm.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Where Choice Is Impaired */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Where Choice Is Impaired in Addiction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>During active addiction, the brain is altered in ways that affect:</p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold">1. Impulse Control</h4>
                <p className="text-muted-foreground">
                  The ability to pause, consider consequences, and choose differently is compromised—especially under stress.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold">2. Reward Processing</h4>
                <p className="text-muted-foreground mb-2">The brain prioritizes substance use over:</p>
                <ul className="list-disc ml-6 text-muted-foreground">
                  <li>Relationships</li>
                  <li>Safety</li>
                  <li>Long-term goals</li>
                  <li>Values</li>
                </ul>
                <p className="mt-2 italic">This is not a moral failure—it is neurobiology.</p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold">3. Stress Response</h4>
                <p className="text-muted-foreground">
                  Stress activates craving. Fear, shame, conflict, or pressure often increase use, not reduce it.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold">4. Insight Reliability</h4>
                <p className="text-muted-foreground">
                  Someone may know what they should do but be unable to act consistently on that knowledge.
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-medium text-primary">
                Knowing better does not always mean being able to do better.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Where Choice Still Exists */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Where Choice Still Exists (And Why It Matters)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Even with impaired control, choice still exists in important areas:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Whether to seek help</li>
              <li>Whether to comply with treatment or supervision</li>
              <li>Whether to accept consequences</li>
              <li>Whether to engage honestly—or not</li>
            </ul>
            <p className="italic">
              Choice may be limited, inconsistent, or externally motivated—but it is not absent.
            </p>
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="font-medium">This is why:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Boundaries still work</li>
                <li>Consequences still matter</li>
                <li>Structure still helps</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Why Consequences Help */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Why Consequences Help in a Disease Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>In many illnesses, consequences guide behavior:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>A diabetic must change behavior after complications</li>
              <li>A heart patient must alter lifestyle after a scare</li>
            </ul>
            <p className="font-medium mt-4">In addiction:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Consequences interrupt denial</li>
              <li>External structure compensates for impaired internal control</li>
              <li>Accountability supports recovery—not punishment</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg text-center mt-4">
              <p className="font-semibold text-primary">
                Consequences are not cruelty.<br />
                They are information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Common Family Missteps */}
        <Card className="mb-6 border-destructive/50">
          <CardHeader>
            <CardTitle>Common Family Missteps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Families often:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Remove consequences "because it's a disease"</li>
              <li>Or enforce consequences harshly "because they should know better"</li>
            </ul>
            <p className="font-medium text-destructive">Both extremes miss the middle ground.</p>
            
            <div className="bg-primary/10 p-4 rounded-lg mt-4">
              <h4 className="font-semibold mb-2">The Middle Ground Looks Like:</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li>Compassion without rescuing</li>
                <li>Boundaries without punishment</li>
                <li>Support without control</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* A Simple Reality Map */}
        <Card className="mb-6 border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle>A Simple Reality Map for Families</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="font-medium">When faced with a behavior, ask:</p>
            <ol className="list-decimal ml-6 space-y-2">
              <li>Is this behavior driven by impaired control or conscious choice?</li>
              <li>Does rescuing reduce or increase long-term harm?</li>
              <li>Does my response protect safety, stability, and dignity?</li>
            </ol>
            <p className="italic mt-4">
              This reframes decisions from guilt-based to values-based.
            </p>
          </CardContent>
        </Card>

        {/* The Family Reframe */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              The Family Reframe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You are not required to pretend they have full control.</p>
            <p>You are also not required to remove all consequences.</p>
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="font-semibold text-primary">
                Holding both truths is not contradictory—it is effective.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Final Thought */}
        <Card className="mb-6 bg-primary/5">
          <CardHeader>
            <CardTitle>Final Thought</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-lg font-semibold">
                Addiction is not a choice.<br />
                Recovery requires choices.
              </p>
            </div>
            <p className="font-medium">Families help most when they:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Understand the limits of control</li>
              <li>Stop arguing with the disease</li>
              <li>Stop rescuing from consequences</li>
              <li>Protect their own stability</li>
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
                <Link to="/family-education#enabling-decision-tree" className="text-primary hover:underline">
                  Enabling vs. Helping Decision Tree
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
              Back to Family Education
            </Button>
          </Link>
        </div>
      </div>
    
          <RelatedResources currentPath="/disease-choice-reality-map" />
</Layout>
  );
};

export default DiseaseChoiceRealityMap;
