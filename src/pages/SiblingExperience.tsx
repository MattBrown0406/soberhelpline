import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, Users, Heart, Brain, AlertTriangle, Eye, Shield, HelpCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";

export default function SiblingExperience() {
  useGuideTracking("/sibling-experience", "The Sibling Experience in Addiction");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>The Sibling Experience in Addiction | Sober Helpline</title>
        <meta name="description" content="The invisible impact on brothers and sisters in addicted families. Understanding what siblings carry and how families can support them." />
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

            <div className="text-center mb-8">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                The Sibling Experience in Addiction
              </h1>
              <p className="text-xl text-muted-foreground">
                The Invisible Impact on Brothers and Sisters in Addicted Families
              </p>
            </div>

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
                  When addiction enters a family, attention naturally focuses on:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>The person using</li>
                  <li>The parents or partner trying to manage the crisis</li>
                  <li>Treatment decisions and outcomes</li>
                </ul>
                <p className="text-muted-foreground mt-4">Siblings are often expected to:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-muted rounded-full text-sm">Understand</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-sm">Adapt</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-sm">Be patient</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-sm">"Not add stress"</span>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mt-4">
                  <p className="text-amber-900 dark:text-amber-100 font-medium">
                    As a result, siblings frequently become the <strong>forgotten stakeholders</strong> in the addiction story.
                  </p>
                  <p className="text-amber-800 dark:text-amber-200 mt-2">
                    Siblings don't escape addiction's impact—they adapt to it quietly.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* A Core Truth */}
            <Card className="mb-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Eye className="h-5 w-5" />
                  A Core Truth Families Often Miss
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground font-medium">
                  Addiction doesn't affect one person.<br />
                  It reshapes the entire family system—and siblings absorb much of that reshaping silently.
                </p>
                <p className="text-muted-foreground mt-4">Many siblings grow up learning:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Their needs are secondary</li>
                  <li>Emotional restraint is safer than honesty</li>
                  <li>Stability comes from self-reliance</li>
                  <li>Conflict is dangerous or pointless</li>
                </ul>
                <p className="text-muted-foreground font-medium mt-4">
                  These lessons carry forward into adulthood.
                </p>
              </CardContent>
            </Card>

            {/* Common Sibling Roles */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Users className="h-5 w-5" />
                  Common Sibling Roles in Addicted Families
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground italic">
                  These roles are not personalities—they are <strong>adaptive strategies</strong>.
                </p>

                {/* Role 1 */}
                <div className="border-l-4 border-gray-400 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">1. The Invisible One</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                    <li>Stays out of the way</li>
                    <li>Minimizes needs</li>
                    <li>Avoids conflict</li>
                    <li>Often feels unseen or forgotten</li>
                  </ul>
                  <p className="text-sm mt-2 text-amber-700 dark:text-amber-400">
                    <strong>Adult impact:</strong> Difficulty asking for help, fear of being a burden.
                  </p>
                </div>

                {/* Role 2 */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">2. The Overachiever</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                    <li>Performs well academically or professionally</li>
                    <li>Brings pride and stability to the family</li>
                    <li>Avoids emotional vulnerability</li>
                  </ul>
                  <p className="text-sm mt-2 text-amber-700 dark:text-amber-400">
                    <strong>Adult impact:</strong> Perfectionism, burnout, conditional self-worth.
                  </p>
                </div>

                {/* Role 3 */}
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">3. The Caretaker</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                    <li>Protects parents emotionally</li>
                    <li>Looks after siblings</li>
                    <li>Mediates conflict</li>
                    <li>Becomes prematurely mature</li>
                  </ul>
                  <p className="text-sm mt-2 text-amber-700 dark:text-amber-400">
                    <strong>Adult impact:</strong> Over-responsibility, difficulty receiving care.
                  </p>
                </div>

                {/* Role 4 */}
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">4. The Family Mascot</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                    <li>Uses humor to diffuse tension</li>
                    <li>Distracts from pain</li>
                    <li>Keeps things "light"</li>
                  </ul>
                  <p className="text-sm mt-2 text-amber-700 dark:text-amber-400">
                    <strong>Adult impact:</strong> Avoidance of deep emotion, fear of seriousness.
                  </p>
                </div>

                {/* Role 5 */}
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">5. The Secondary Identified Problem</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                    <li>Acts out</li>
                    <li>Uses substances themselves</li>
                    <li>Expresses anger openly</li>
                  </ul>
                  <p className="text-sm mt-2 text-amber-700 dark:text-amber-400">
                    <strong>Adult impact:</strong> Shame, comparison, feeling overlooked because "someone else had it worse."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What Siblings Commonly Feel */}
            <Card className="mb-6 border-rose-200 dark:border-rose-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                  <Heart className="h-5 w-5" />
                  What Siblings Commonly Feel (But Rarely Say)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Siblings often carry:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Anger that feels disloyal</li>
                  <li>Guilt for being "okay"</li>
                  <li>Resentment over unequal attention</li>
                  <li>Fear of becoming like the addicted sibling</li>
                  <li>Shame for wishing things were different</li>
                  <li>Pressure to be "the easy one"</li>
                </ul>
                <p className="text-muted-foreground font-medium mt-4">
                  These feelings are normal—and often unacknowledged.
                </p>
              </CardContent>
            </Card>

            {/* How Addiction Alters Sibling Relationships */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <AlertTriangle className="h-5 w-5" />
                  How Addiction Alters Sibling Relationships
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Unequal Attention</h4>
                  <p className="text-muted-foreground mb-2">
                    Parents often spend disproportionate time and energy on the addicted child—out of necessity, not preference.
                  </p>
                  <p className="text-muted-foreground">Siblings may internalize this as:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground italic text-sm mt-2">
                    <li>"My needs don't matter"</li>
                    <li>"I shouldn't need anything"</li>
                    <li>"I shouldn't make things harder"</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Loyalty Conflicts</h4>
                  <p className="text-muted-foreground mb-2">Siblings may feel torn between:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Protecting parents</li>
                    <li>Supporting or distancing from the addicted sibling</li>
                    <li>Protecting themselves</li>
                  </ul>
                  <p className="text-muted-foreground font-medium mt-2">No choice feels clean.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Emotional Distance</h4>
                  <p className="text-muted-foreground mb-2">
                    Many siblings learn to disconnect emotionally to survive:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Reduced closeness</li>
                    <li>Superficial contact</li>
                    <li>Estrangement without clarity</li>
                  </ul>
                  <p className="text-muted-foreground font-medium mt-2">Distance becomes protection.</p>
                </div>
              </CardContent>
            </Card>

            {/* Long-Term Effects */}
            <Card className="mb-6 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <Brain className="h-5 w-5" />
                  Long-Term Effects on Adult Siblings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Even years later, siblings may struggle with:</p>
                <div className="grid grid-cols-2 gap-2">
                  <span className="px-3 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm">Trust and intimacy</span>
                  <span className="px-3 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm">Conflict avoidance or intensity</span>
                  <span className="px-3 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm">Hyper-independence</span>
                  <span className="px-3 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm">Anxiety or hypervigilance</span>
                  <span className="px-3 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm">Difficulty receiving care</span>
                  <span className="px-3 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm">Feeling responsible for others</span>
                </div>
                <p className="text-muted-foreground font-medium mt-4">
                  These are not flaws—they are learned survival skills.
                </p>
              </CardContent>
            </Card>

            {/* What Parents Often Don't Realize */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Eye className="h-5 w-5" />
                  What Parents Often Don't Realize
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Parents are usually doing their best under impossible circumstances.
                </p>
                <p className="text-muted-foreground">Still, siblings may need:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Explicit acknowledgment</strong> of what they went through</li>
                  <li><strong>Permission</strong> to feel hurt without comparison</li>
                  <li><strong>Space</strong> to be angry without being corrected</li>
                  <li><strong>Repair</strong>—not explanations</li>
                </ul>
                <div className="bg-primary/10 p-4 rounded-lg mt-4">
                  <p className="text-foreground font-medium text-center">
                    Impact matters more than intent.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What Healing Looks Like */}
            <Card className="mb-6 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Shield className="h-5 w-5" />
                  What Healing Looks Like for Siblings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-2">Healing does NOT require:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Forgiveness on demand</li>
                      <li>• Reconciliation on a timeline</li>
                      <li>• Becoming emotionally available before safety exists</li>
                      <li>• Minimizing past harm</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Healing DOES require:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Validation</li>
                      <li>• Boundaries</li>
                      <li>• Choice</li>
                      <li>• Agency</li>
                      <li>• Permission to define the relationship</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How Families Can Support Siblings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Heart className="h-5 w-5" />
                  How Families Can Support Siblings Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">For Parents</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Acknowledge unequal impact without defensiveness</li>
                    <li>Name what siblings lost or carried</li>
                    <li>Invite—not force—conversation</li>
                    <li>Avoid asking siblings to "be supportive" at their own expense</li>
                    <li>Repair where possible, without justification</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">For the Family System</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Stop centering everything around the addicted member</li>
                    <li>Make space for sibling experiences</li>
                    <li>Respect boundaries around contact and involvement</li>
                    <li>Allow relationships to evolve organically</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Reflection Questions */}
            <Card className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <HelpCircle className="h-5 w-5" />
                  Reflection Questions for Siblings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What role did I take on to survive?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What feelings did I learn to hide?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Where am I still over-adapting?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What do I need now—not then?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What level of relationship feels safe and authentic?
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* A Grounding Reframe */}
            <Card className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-300 dark:border-emerald-700">
              <CardContent className="pt-6">
                <p className="text-lg text-emerald-900 dark:text-emerald-100 font-medium text-center">
                  You were shaped by circumstances you did not choose.<br />
                  Your adaptations kept you safe.<br />
                  <strong>You are allowed to outgrow them.</strong>
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
                  Siblings often carry the quiet cost of addiction—without recognition or repair.
                </p>
                <p className="text-muted-foreground">
                  Healing begins when families stop asking siblings to be resilient—and start honoring what resilience cost them.
                </p>
                <div className="bg-primary/10 p-4 rounded-lg mt-4">
                  <p className="text-foreground font-medium text-center">
                    You don't heal siblings by asking them to understand more.<br />
                    You heal them by finally seeing them.
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
                  <Link to="/strong-one">
                    <Button variant="outline" size="sm">The Hidden Cost of Being the "Strong One"</Button>
                  </Link>
                  <Link to="/living-well-regardless">
                    <Button variant="outline" size="sm">Living Well Regardless of Outcome</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        
          <RelatedResources currentPath="/sibling-experience" />
</main>
      </div>
    </>
  );
}
