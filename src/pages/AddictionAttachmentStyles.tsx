import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

export default function AddictionAttachmentStyles() {
  useGuideTracking("How Addiction Shapes Attachment Styles", "/addiction-attachment-styles");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>How Addiction Shapes Attachment Styles | Sober Helpline</title>
        <meta name="description" content="Why relationships feel hard—and how understanding attachment creates change. Learn how addiction disrupts attachment formation and what helps attachment heal." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12 max-w-4xl">
          <div className="flex items-center justify-between mb-8 print:hidden">
            <Link
              to="/family-education"
              className="inline-flex items-center text-primary hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Family Education
            </Link>
            <Button onClick={handlePrint} variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print Guide
            </Button>
          </div>

          <ToolBrandHeader
            title="How Addiction Shapes Attachment Styles"
            subtitle="Why relationships feel hard — and how understanding attachment creates change. Attachment patterns are not destiny; they are learned responses that can be rewired."
            clinicalNote="Based on John Bowlby's attachment theory, adapted for addiction contexts by Dr. Philip Flores and informed by current interpersonal neurobiology research."
          />

          <article className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
              How Addiction Shapes Attachment Styles
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Why Relationships Feel Hard—and How Understanding Attachment Creates Change
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why This Guide Matters</h2>
              <p className="text-muted-foreground mb-4">
                Families affected by addiction often struggle with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Intense closeness followed by distance</li>
                <li>Fear of abandonment or engulfment</li>
                <li>Difficulty trusting stability</li>
                <li>Conflict that feels overwhelming or avoided</li>
                <li>Relationships that feel chaotic—even after recovery begins</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                These patterns are not random.
              </p>
              <p className="text-foreground font-medium mb-4">
                Addiction often shapes how people learn to attach, regulate emotions, and feel safe in relationships.
              </p>
              <p className="text-muted-foreground">
                Understanding attachment offers clarity—not excuses.
              </p>
            </section>

            <section className="mb-10 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Attachment Really Is (Simply Explained)</h2>
              <p className="text-muted-foreground mb-4">
                Attachment refers to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>How we seek closeness</li>
                <li>How we handle separation</li>
                <li>How we regulate emotions with others</li>
                <li>What feels safe in relationships</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Attachment styles form early—but they are not fixed.
              </p>
              <p className="text-foreground font-medium">
                They adapt to environment. They update with safety.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How Addiction Disrupts Attachment Formation</h2>
              <p className="text-muted-foreground mb-4">
                Addiction creates environments marked by:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Inconsistency</li>
                <li>Emotional unpredictability</li>
                <li>Broken trust</li>
                <li>Role reversals</li>
                <li>Fear and hypervigilance</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Children and family members adapt—not by choice, but by necessity.
              </p>
              <p className="text-foreground font-medium">
                Attachment styles are survival responses to relational instability.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">The Major Attachment Patterns (Reframed)</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <h3 className="text-lg font-semibold text-foreground mb-2">1. Secure Attachment (Often Interrupted)</h3>
                  <p className="text-sm font-medium text-muted-foreground mb-2">What It Looks Like:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-3">
                    <li>Comfort with closeness and independence</li>
                    <li>Ability to ask for help</li>
                    <li>Emotional regulation with others</li>
                  </ul>
                  <p className="text-sm font-medium text-muted-foreground mb-2">How Addiction Affects It:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-3">
                    <li>Even securely attached individuals may become anxious or avoidant in addicted systems</li>
                    <li>Safety disruptions cause temporary shifts</li>
                  </ul>
                  <p className="text-muted-foreground font-medium">Secure attachment can be restored with consistency and accountability.</p>
                </div>

                <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <h3 className="text-lg font-semibold text-foreground mb-2">2. Anxious Attachment (Closeness-Seeking)</h3>
                  <p className="text-sm font-medium text-muted-foreground mb-2">What It Looks Like:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-3">
                    <li>Fear of abandonment</li>
                    <li>Hyper-focus on relationships</li>
                    <li>Heightened emotional reactions</li>
                    <li>Difficulty tolerating distance</li>
                  </ul>
                  <p className="text-sm font-medium text-muted-foreground mb-2">How Addiction Shapes It:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-3">
                    <li>Inconsistent availability trains people to cling</li>
                    <li>Love feels unpredictable</li>
                    <li>Intensity becomes associated with connection</li>
                  </ul>
                  <p className="text-sm font-medium text-muted-foreground mb-2">In Families:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Over-involvement</li>
                    <li>Difficulty setting boundaries</li>
                    <li>Emotional fusion</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <h3 className="text-lg font-semibold text-foreground mb-2">3. Avoidant Attachment (Distance-Seeking)</h3>
                  <p className="text-sm font-medium text-muted-foreground mb-2">What It Looks Like:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-3">
                    <li>Emotional self-reliance</li>
                    <li>Discomfort with vulnerability</li>
                    <li>Pulling away under stress</li>
                    <li>Minimizing needs</li>
                  </ul>
                  <p className="text-sm font-medium text-muted-foreground mb-2">How Addiction Shapes It:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-3">
                    <li>Emotional expression felt unsafe or pointless</li>
                    <li>Independence became protection</li>
                    <li>Distance became regulation</li>
                  </ul>
                  <p className="text-sm font-medium text-muted-foreground mb-2">In Families:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Emotional withdrawal</li>
                    <li>Difficulty asking for help</li>
                    <li>Minimizing the impact of addiction</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <h3 className="text-lg font-semibold text-foreground mb-2">4. Disorganized Attachment (Approach–Avoid Conflict)</h3>
                  <p className="text-sm font-medium text-muted-foreground mb-2">What It Looks Like:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-3">
                    <li>Wanting closeness and fearing it</li>
                    <li>Intense emotional swings</li>
                    <li>Confusion in relationships</li>
                    <li>Difficulty trusting safety</li>
                  </ul>
                  <p className="text-sm font-medium text-muted-foreground mb-2">How Addiction Shapes It:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-3">
                    <li>Caregivers were both source of comfort and fear</li>
                    <li>No consistent strategy felt safe</li>
                  </ul>
                  <p className="text-sm font-medium text-muted-foreground mb-2">In Families:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Chaotic relationships</li>
                    <li>Push–pull dynamics</li>
                    <li>High emotional intensity</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Attachment Patterns Get Misinterpreted</h2>
              <p className="text-muted-foreground mb-4">
                Attachment behaviors are often mislabeled as:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Neediness</li>
                <li>Coldness</li>
                <li>Control</li>
                <li>Manipulation</li>
                <li>Weakness</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                In reality, they are nervous system strategies learned in unpredictable environments.
              </p>
              <p className="text-foreground font-medium">
                Understanding this reduces shame—and increases accountability.
              </p>
            </section>

            <section className="mb-10 p-6 bg-destructive/10 rounded-lg border border-destructive/30">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How Addiction Reinforces Attachment Patterns</h2>
              <p className="text-muted-foreground mb-4">
                Addiction:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Rewards anxious pursuit with intermittent connection</li>
                <li>Rewards avoidant distance by reducing conflict</li>
                <li>Thrives in disorganized chaos</li>
                <li>Punishes secure boundaries with emotional backlash</li>
              </ul>
              <p className="text-foreground font-medium">
                Without intervention, patterns intensify.
              </p>
            </section>

            <section className="mb-10 p-6 bg-muted/30 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Insight Alone Doesn't Change Attachment</h2>
              <p className="text-muted-foreground mb-4">
                Understanding attachment helps—but:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Attachment lives in the body</li>
                <li>Patterns emerge under stress</li>
                <li>Change requires consistent experience—not explanation</li>
              </ul>
              <p className="text-foreground font-medium">
                Safety—not insight—is the healer.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Actually Helps Attachment Heal</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">1. Predictability Over Intensity</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Consistent boundaries</li>
                    <li>Calm responses</li>
                    <li>Reliable follow-through</li>
                  </ul>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">2. Behavior-Based Trust</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Words matter less than actions</li>
                    <li>Repair matters more than apology</li>
                    <li>Time matters more than promises</li>
                  </ul>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">3. Boundaries That Reduce Fear</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-2">
                    <li>Clear limits</li>
                    <li>No emotional punishment</li>
                    <li>No abandonment threats</li>
                  </ul>
                  <p className="text-muted-foreground">Boundaries create safety—not distance.</p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">4. Emotional Regulation Before Connection</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-2">
                    <li>Calm first</li>
                    <li>Connect second</li>
                  </ul>
                  <p className="text-muted-foreground">Dysregulated connection reinforces insecurity.</p>
                </div>
              </div>
            </section>

            <section className="mb-10 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">For Families: Key Takeaways</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Attachment styles are shaped—not chosen</li>
                <li>They can shift with safety</li>
                <li>Boundaries support attachment healing</li>
                <li>Consistency matters more than closeness</li>
                <li>No one owes intimacy to prove love</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Reflection Questions</h2>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
                <li>How do I respond when relationships feel uncertain?</li>
                <li>Do I move toward or away from closeness under stress?</li>
                <li>What feels most threatening—distance or intimacy?</li>
                <li>What helps me feel safest?</li>
                <li>How can I offer consistency rather than intensity?</li>
              </ol>
            </section>

            <section className="mb-10 p-6 bg-primary/10 rounded-lg border border-primary/30">
              <h2 className="text-2xl font-semibold text-foreground mb-4">A Grounding Reframe</h2>
              <p className="text-foreground font-medium mb-4">
                Attachment is not about how much you love. It's about how safe connection feels in your body.
              </p>
              <p className="text-muted-foreground">
                Safety can be rebuilt.
              </p>
            </section>

            <section className="mb-10 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Final Thought</h2>
              <p className="text-muted-foreground mb-4">
                Addiction reshapes attachment by disrupting safety, predictability, and trust.
              </p>
              <p className="text-muted-foreground mb-4">
                Healing doesn't require becoming someone new. It requires experiencing stability long enough for the nervous system to update.
              </p>
              <p className="text-foreground font-medium">
                When families create calm, consistent environments, attachment patterns soften—and real connection becomes possible.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Suggested Companion Resources</h2>
              <div className="flex flex-wrap gap-2">
                <Link to="/growing-up-shadow">
                  <Button variant="outline" size="sm">Growing Up in the Shadow of Addiction</Button>
                </Link>
                <Link to="/boundary-drift">
                  <Button variant="outline" size="sm">Boundary Drift: How Limits Slowly Erode</Button>
                </Link>
                <Link to="/guilt-relief-resentment">
                  <Button variant="outline" size="sm">The Guilt–Relief–Resentment Cycle</Button>
                </Link>
                <Link to="/living-well-regardless">
                  <Button variant="outline" size="sm">Living Well Regardless of Outcome</Button>
                </Link>
              </div>
            </section>
          </article>

          <div className="mt-8 print:hidden">
            <Link
              to="/family-education"
              className="inline-flex items-center text-primary hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Family Education
            </Link>
          </div>
        
          <RelatedResources currentPath="/addiction-attachment-styles" />
</main>
      </div>
    </>
  );
}
