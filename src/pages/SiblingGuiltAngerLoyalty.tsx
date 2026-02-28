import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, Heart, Brain, Shield, AlertTriangle, HelpCircle, CheckCircle, Scale, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

export default function SiblingGuiltAngerLoyalty() {
  useGuideTracking("/sibling-guilt-anger-loyalty", "Sibling Guilt, Anger, and Loyalty Conflicts");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Sibling Guilt, Anger, and Loyalty Conflicts | Sober Helpline</title>
        <meta name="description" content="Understanding the emotional double bind in families affected by addiction. A guide for siblings navigating guilt, anger, and loyalty conflicts." />
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
              title="Sibling Guilt, Anger, and Loyalty Conflicts"
              subtitle="Understanding the emotional double bind in families affected by addiction. You can love your sibling and still feel rage, relief, and grief — all at once."
              clinicalNote="Informed by family systems literature on triangulation, loyalty conflicts (Ivan Boszormenyi-Nagy), and sibling relational dynamics in addiction."
            />

            <div className="text-center mb-8">
              <Scale className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                Sibling Guilt, Anger, and Loyalty Conflicts
              </h1>
              <p className="text-xl text-muted-foreground">
                Understanding the Emotional Double Bind in Families Affected by Addiction
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
                  Siblings of people struggling with addiction often live inside a quiet contradiction:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>They feel <strong>angry</strong> about what they've lost</li>
                  <li>They feel <strong>guilty</strong> for that anger</li>
                  <li>They feel <strong>loyal</strong> to their family</li>
                  <li>They feel <strong>resentful</strong> toward it</li>
                </ul>
                <p className="text-muted-foreground">
                  And they rarely feel allowed to hold all of that at once.
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-amber-900 dark:text-amber-100">
                    Siblings are often expected to "understand," "be patient," or "be supportive"<br />
                    <strong>without anyone asking what it has cost them</strong>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* The Core Conflict */}
            <Card className="mb-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Scale className="h-5 w-5" />
                  The Core Conflict Siblings Face
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  At the heart of the sibling experience is a <strong>loyalty bind</strong>:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <p className="text-foreground font-medium italic">
                    If I protect myself, I feel selfish.<br />
                    If I stay loyal, I abandon myself.
                  </p>
                </div>
                <p className="text-muted-foreground mt-4 text-center">
                  This bind creates chronic emotional tension that doesn't resolve on its own.
                </p>
              </CardContent>
            </Card>

            {/* Guilt Section */}
            <Card className="mb-6 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <Heart className="h-5 w-5" />
                  Guilt: "I Shouldn't Feel This Way"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Where Sibling Guilt Comes From</h4>
                  <p className="text-muted-foreground mb-2">Sibling guilt often sounds like:</p>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="italic text-muted-foreground">"They're sick—I shouldn't be angry."</p>
                    <p className="italic text-muted-foreground">"My parents have it worse."</p>
                    <p className="italic text-muted-foreground">"At least I didn't struggle like they did."</p>
                    <p className="italic text-muted-foreground">"If I'm okay, something is wrong with me."</p>
                  </div>
                  <p className="text-muted-foreground mt-4">This guilt is reinforced when:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Family attention is understandably focused elsewhere</li>
                    <li>Siblings are praised for being "easy" or "strong"</li>
                    <li>Pain is compared instead of acknowledged</li>
                  </ul>
                  <p className="text-muted-foreground font-medium mt-3">
                    Guilt becomes a way to stay connected—even at personal cost.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">The Hidden Function of Guilt</h4>
                  <p className="text-muted-foreground mb-2">Guilt often serves to:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Maintain family harmony</li>
                    <li>Avoid conflict</li>
                    <li>Protect parents emotionally</li>
                    <li>Preserve the family narrative</li>
                    <li>Stay "on the right side" morally</li>
                  </ul>
                  <p className="text-muted-foreground font-medium mt-3">
                    It is not weakness.<br />
                    It is relational survival.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Anger Section */}
            <Card className="mb-6 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Anger: "Why Doesn't Anyone Talk About This?"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">What Sibling Anger Is Really About</h4>
                  <p className="text-muted-foreground mb-2">
                    Sibling anger is rarely just about the addicted sibling.
                  </p>
                  <p className="text-muted-foreground mb-2">It often includes:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Anger at parents for emotional absence</li>
                    <li>Anger at systems that failed the family</li>
                    <li>Anger at lost time, attention, and safety</li>
                    <li>Anger at being expected to adapt endlessly</li>
                    <li>Anger at never being asked how they are</li>
                  </ul>
                  <p className="text-muted-foreground font-medium mt-3">
                    Anger develops where needs went unmet and unnamed.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Why Anger Feels So Dangerous</h4>
                  <p className="text-muted-foreground mb-2">Many siblings learned early:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Anger makes things worse</li>
                    <li>Anger adds stress</li>
                    <li>Anger threatens attachment</li>
                    <li>Anger equals disloyalty</li>
                  </ul>
                  <p className="text-muted-foreground mt-3">
                    So anger gets swallowed, redirected inward, or delayed for years.
                  </p>
                  <p className="text-muted-foreground mt-3">Unexpressed anger doesn't disappear—it turns into:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-full text-sm">Anxiety</span>
                    <span className="px-3 py-1 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-full text-sm">Numbness</span>
                    <span className="px-3 py-1 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-full text-sm">Distance</span>
                    <span className="px-3 py-1 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-full text-sm">Chronic resentment</span>
                    <span className="px-3 py-1 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-full text-sm">Physical symptoms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Section */}
            <Card className="mb-6 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Users className="h-5 w-5" />
                  Loyalty: "I Don't Want to Betray My Family"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Loyalty Is Not the Problem</h4>
                  <p className="text-muted-foreground">
                    Loyalty is a value.<br />
                    The problem arises when loyalty requires <strong>silence or self-erasure</strong>.
                  </p>
                  <p className="text-muted-foreground mt-3">Siblings may feel loyal to:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Parents who were overwhelmed</li>
                    <li>A sibling who is struggling</li>
                    <li>The idea of family unity</li>
                    <li>The family's public image</li>
                    <li>Cultural or generational expectations</li>
                  </ul>
                  <p className="text-muted-foreground font-medium mt-3">
                    This loyalty can conflict with basic self-protection.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Common Loyalty Conflicts</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Wanting distance but fearing rejection</li>
                    <li>Setting boundaries but feeling disloyal</li>
                    <li>Telling the truth but fearing family fallout</li>
                    <li>Choosing peace but being labeled "cold"</li>
                    <li>Refusing involvement and being seen as unsupportive</li>
                  </ul>
                  <p className="text-muted-foreground font-medium mt-3 text-center">
                    There is often no choice that feels clean.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* The Double Bind in Action */}
            <Card className="mb-6 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <Brain className="h-5 w-5" />
                  The Double Bind in Action
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Many siblings live in this loop:</p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-center py-4">
                  <span className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg text-sm">Feel hurt or angry</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg text-sm">Feel guilty</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg text-sm">Suppress</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg text-sm">Stay involved</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg text-sm">Resent</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg text-sm">Withdraw</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg text-sm">Feel guilty again</span>
                </div>
                <p className="text-muted-foreground text-center">
                  This cycle mirrors many addiction-family dynamics—but is rarely named.
                </p>
              </CardContent>
            </Card>

            {/* Why Families Often Miss This */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <HelpCircle className="h-5 w-5" />
                  Why Families Often Miss This
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families are often:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>In survival mode</li>
                  <li>Focused on immediate crises</li>
                  <li>Emotionally depleted</li>
                  <li>Afraid of fragmenting further</li>
                </ul>
                <p className="text-muted-foreground font-medium mt-3">
                  This does not mean siblings weren't impacted.<br />
                  It means there was no room to hold their experience at the time.
                </p>
                <div className="bg-primary/10 p-4 rounded-lg mt-4">
                  <p className="text-foreground font-medium text-center">
                    Impact still matters—even years later.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What Healing Requires */}
            <Card className="mb-6 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Shield className="h-5 w-5" />
                  What Healing Requires for Siblings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-2">Healing does NOT require:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Choosing sides</li>
                      <li>• Cutting off family</li>
                      <li>• Forgiving on demand</li>
                      <li>• Confronting everyone</li>
                      <li>• Minimizing your experience</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Healing DOES require:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Permission to name conflicting emotions</li>
                      <li>• Validation without comparison</li>
                      <li>• Boundaries that reflect current capacity</li>
                      <li>• Choice around involvement</li>
                      <li>• Separation of compassion from obligation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reframing Loyalty */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Scale className="h-5 w-5" />
                  Reframing Loyalty in a Healthier Way
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">A healthier definition of loyalty might be:</p>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-foreground font-medium text-center text-lg">
                    "I can care about my family without sacrificing myself."
                  </p>
                </div>
                <p className="text-muted-foreground mt-4">Loyalty does not require:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Enduring harm</li>
                  <li>Staying silent</li>
                  <li>Being endlessly available</li>
                  <li>Absorbing emotional fallout</li>
                </ul>
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
                    What am I angry about that I've never named?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What guilt shows up when I consider protecting myself?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Who taught me that my feelings were less important?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What does loyalty mean to me now—not then?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What level of involvement feels sustainable and honest?
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* For Parents and Families */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Users className="h-5 w-5" />
                  For Parents and Families Reading This
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">If you want to support siblings:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Acknowledge uneven impact without defensiveness</li>
                  <li>Avoid comparing pain</li>
                  <li>Invite honesty without requiring resolution</li>
                  <li>Respect boundaries without interpreting them as rejection</li>
                  <li>Allow siblings to define their role going forward</li>
                </ul>
                <p className="text-muted-foreground font-medium mt-4">
                  Repair begins with recognition—not explanation.
                </p>
              </CardContent>
            </Card>

            {/* A Grounding Reframe */}
            <Card className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-300 dark:border-emerald-700">
              <CardContent className="pt-6">
                <p className="text-lg text-emerald-900 dark:text-emerald-100 font-medium text-center">
                  You are allowed to feel anger and love.<br />
                  You are allowed to set limits and care.<br />
                  You are allowed to protect yourself without betraying anyone.
                </p>
                <p className="text-center text-emerald-800 dark:text-emerald-200 mt-4">
                  Conflicting emotions do not mean you're disloyal.<br />
                  <strong>They mean you're human.</strong>
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
                  Siblings often carry guilt, anger, and loyalty conflicts quietly for decades.
                </p>
                <p className="text-muted-foreground">
                  Healing begins when those emotions are allowed to coexist—without judgment or pressure to resolve them neatly.
                </p>
                <div className="bg-primary/10 p-4 rounded-lg mt-4">
                  <p className="text-foreground font-medium text-center">
                    You don't heal siblings by asking them to be more understanding.<br />
                    You heal them by making room for their truth.
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
                  <Link to="/sibling-experience">
                    <Button variant="outline" size="sm">The Sibling Experience in Addiction</Button>
                  </Link>
                  <Link to="/growing-up-shadow">
                    <Button variant="outline" size="sm">Growing Up in the Shadow of Addiction</Button>
                  </Link>
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
        
          <RelatedResources currentPath="/sibling-guilt-anger-loyalty" />
</main>
      </div>
    </>
  );
}
