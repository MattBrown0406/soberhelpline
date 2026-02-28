import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

export default function AngerAndBoundaries() {
  useGuideTracking("Anger and Boundaries Are Not the Same Thing", "/anger-and-boundaries");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Anger and Boundaries Are Not the Same Thing | Sober Helpline</title>
        <meta name="description" content="Why limits built on anger collapse—and what holds them instead. Understanding the difference between anger-based reactions and values-based boundaries in families affected by addiction." />
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
            title="Anger and Boundaries Are Not the Same Thing"
            subtitle="Why limits built on anger collapse — and what holds them instead. Understanding the difference between reactive anger and values-based boundaries."
            clinicalNote="Informed by emotion regulation research (Linehan, DBT) and Al-Anon principles of detachment with love."
          />
          <article className="prose prose-slate dark:prose-invert max-w-none">

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why This Guide Matters</h2>
              <p className="text-muted-foreground mb-4">
                Many families say:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>"I can only hold the boundary when I'm furious."</li>
                <li>"Once I calm down, I cave."</li>
                <li>"If I stop being angry, I'll lose my resolve."</li>
                <li>"Anger is the only thing that keeps me strong."</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                These experiences are common—and understandable.
              </p>
              <p className="text-muted-foreground mb-4">
                But they reveal a fragile truth:
              </p>
              <p className="text-foreground font-medium">
                If anger is the only thing holding a boundary in place, the boundary will not last.
              </p>
              <p className="text-muted-foreground mt-4">
                This guide explains why—and what works instead.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Anger Does (And Why It Feels Helpful)</h2>
              <p className="text-muted-foreground mb-4">
                Anger is a mobilizing emotion. It:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Creates energy</li>
                <li>Narrows focus</li>
                <li>Reduces doubt</li>
                <li>Temporarily overrides guilt</li>
                <li>Pushes action</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                In the short term, anger can help families:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Say no</li>
                <li>Enforce consequences</li>
                <li>Stop enabling</li>
                <li>Interrupt harmful patterns</li>
              </ul>
              <p className="text-foreground font-medium">
                Anger is not the problem. Relying on anger as the foundation is.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Anger-Based Boundaries Collapse</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">1. Anger Is Not Sustainable</h3>
                  <p className="text-muted-foreground mb-2">Anger:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-2">
                    <li>Peaks</li>
                    <li>Fades</li>
                    <li>Exhausts the nervous system</li>
                  </ul>
                  <p className="text-muted-foreground mb-2">When anger subsides:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Guilt returns</li>
                    <li>Fear resurfaces</li>
                    <li>Doubt creeps in</li>
                    <li>Boundaries weaken</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Boundaries need stability, not spikes.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">2. Anger Triggers Counter-Anger</h3>
                  <p className="text-muted-foreground mb-2">Anger often invites:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-2">
                    <li>Defensiveness</li>
                    <li>Escalation</li>
                    <li>Power struggles</li>
                    <li>Retaliation</li>
                  </ul>
                  <p className="text-muted-foreground mb-2">This turns boundaries into battles.</p>
                  <p className="text-muted-foreground font-medium">Boundaries held in anger feel like punishment—even when they aren't.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">3. Anger Masks Unresolved Fear and Guilt</h3>
                  <p className="text-muted-foreground mb-2">When anger fades, what remains is often:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Fear of loss</li>
                    <li>Fear of regret</li>
                    <li>Fear of escalation</li>
                    <li>Guilt about being "mean"</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">If these emotions aren't addressed, the boundary erodes.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">4. Anger Shifts the Focus Away from Values</h3>
                  <p className="text-muted-foreground mb-2">Anger narrows perspective. Boundaries rooted in anger often:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Focus on winning</li>
                    <li>Feel reactionary</li>
                    <li>Depend on intensity</li>
                    <li>Lack clarity and follow-through</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">When emotions change, the boundary loses its anchor.</p>
                </div>
              </div>
            </section>

            <section className="mb-10 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Boundaries Actually Are</h2>
              <p className="text-muted-foreground mb-4">
                Boundaries are:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Decisions, not reactions</li>
                <li>Based on values</li>
                <li>Held regardless of emotional state</li>
                <li>About what <em>you</em> will do</li>
                <li>Enforced calmly and consistently</li>
              </ul>
              <p className="text-foreground font-medium">
                Boundaries work when they are boring, predictable, and unemotional.
              </p>
            </section>

            <section className="mb-10 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">The Key Difference (Clearly Stated)</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                  <p className="font-semibold text-foreground mb-2">Anger says:</p>
                  <p className="text-muted-foreground">"I've had enough."</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="font-semibold text-foreground mb-2">Boundaries say:</p>
                  <p className="text-muted-foreground">"This is what I will and won't do—consistently."</p>
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                Anger can initiate a boundary conversation. It cannot sustain a boundary long-term.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Families Confuse Anger with Strength</h2>
              <p className="text-muted-foreground mb-4">
                In addiction-impacted families:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Calm often led to enabling</li>
                <li>Anger felt like the only way to stop the chaos</li>
                <li>Emotional intensity became associated with effectiveness</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Over time, families learn:
              </p>
              <p className="text-foreground font-medium mb-4">
                "If I'm not angry, I'm not serious."
              </p>
              <p className="text-muted-foreground">
                This belief is understandable—and inaccurate.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Holds Boundaries When Anger Fades</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">1. Values</h3>
                  <p className="text-muted-foreground mb-2">Boundaries anchored in values don't require emotional fuel.</p>
                  <p className="text-sm text-muted-foreground mb-2">Example:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li><strong>Value:</strong> Safety</li>
                    <li><strong>Boundary:</strong> "We don't allow substance use in our home."</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Values don't fluctuate—even when emotions do.</p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">2. Pre-Decided Consequences</h3>
                  <p className="text-muted-foreground mb-2">Boundaries collapse when decisions are made in the moment.</p>
                  <p className="text-muted-foreground mb-2">Boundaries hold when:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Consequences are decided ahead of time</li>
                    <li>Everyone knows what happens next</li>
                    <li>There is no negotiation</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Preparation replaces intensity.</p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">3. Nervous System Regulation</h3>
                  <p className="text-muted-foreground mb-2">Regulated families:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Speak less</li>
                    <li>Explain less</li>
                    <li>React less</li>
                    <li>Hold more</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Regulation—not anger—creates credibility.</p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">4. Support Outside the Crisis</h3>
                  <p className="text-muted-foreground mb-2">Boundaries fail when families:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Carry everything alone</li>
                    <li>Have no backup</li>
                    <li>Feel isolated</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Support stabilizes resolve when emotions fluctuate.</p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Anger Is Actually Signaling</h2>
              <p className="text-muted-foreground mb-4">
                Anger often signals:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>A boundary violation</li>
                <li>Accumulated resentment</li>
                <li>Unaddressed needs</li>
                <li>Prolonged self-abandonment</li>
              </ul>
              <p className="text-foreground font-medium">
                Anger is a messenger, not a structure. Listen to it—but don't build on it.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How to Transition from Anger-Based to Values-Based Boundaries</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Step 1: Identify the Boundary Beneath the Anger</h3>
                  <p className="text-muted-foreground">Ask: "What line keeps getting crossed?" "What am I protecting?"</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Step 2: Name the Value</h3>
                  <p className="text-muted-foreground">Safety, honesty, stability, respect, health.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Step 3: Decide the Boundary Calmly</h3>
                  <p className="text-muted-foreground">Do this when you are not in crisis.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Step 4: Plan for Emotional Aftermath</h3>
                  <p className="text-muted-foreground mb-2">Expect: Guilt, Doubt, Pushback</p>
                  <p className="text-muted-foreground">These do not mean the boundary is wrong.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Step 5: Hold the Boundary Without Re-Explaining</h3>
                  <p className="text-muted-foreground">Repetition weakens boundaries. Consistency strengthens them.</p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What a Strong Boundary Sounds Like (Without Anger)</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>"This isn't something we're willing to do."</li>
                <li>"The boundary hasn't changed."</li>
                <li>"We'll support treatment, not use."</li>
                <li>"I'm stepping away from this conversation now."</li>
              </ul>
              <p className="text-muted-foreground font-medium">
                Calm language signals seriousness—not weakness.
              </p>
            </section>

            <section className="mb-10 p-6 bg-primary/10 rounded-lg border border-primary/30">
              <h2 className="text-2xl font-semibold text-foreground mb-4">A Grounding Reframe</h2>
              <p className="text-foreground font-medium mb-4">
                Anger is a flare. Boundaries are a lighthouse.
              </p>
              <p className="text-muted-foreground">
                One signals danger. The other prevents wreckage.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Reflection Questions for Families</h2>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
                <li>What boundary do I only hold when I'm angry?</li>
                <li>What happens to that boundary when I calm down?</li>
                <li>What fear or guilt surfaces when anger fades?</li>
                <li>What value needs protection here?</li>
                <li>What would it look like to hold this boundary calmly?</li>
              </ol>
            </section>

            <section className="mb-10 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Final Thought</h2>
              <p className="text-muted-foreground mb-4">
                Anger is not the enemy. It often arrives when something important has been violated.
              </p>
              <p className="text-muted-foreground mb-4">
                But anger is not a foundation.
              </p>
              <p className="text-muted-foreground mb-4">
                Boundaries that last are built on clarity, values, and consistency—not emotional intensity.
              </p>
              <p className="text-muted-foreground mb-4">
                When families learn to separate anger from boundaries:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Conflict decreases</li>
                <li>Guilt loses power</li>
                <li>Trust increases</li>
                <li>Recovery conditions strengthen</li>
              </ul>
              <p className="text-foreground font-medium">
                And families no longer need to stay angry to stay strong.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Suggested Companion Resources</h2>
              <div className="flex flex-wrap gap-2">
                <Link to="/boundaries-ultimatums">
                  <Button variant="outline" size="sm">Requests, Demands, Ultimatums & Boundaries</Button>
                </Link>
                <Link to="/boundary-drift">
                  <Button variant="outline" size="sm">Boundary Drift: How Limits Slowly Erode</Button>
                </Link>
                <Link to="/emotional-regulation">
                  <Button variant="outline" size="sm">Emotional Regulation Tools</Button>
                </Link>
                <Link to="/guilt-relief-resentment">
                  <Button variant="outline" size="sm">The Guilt–Relief–Resentment Cycle</Button>
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
        
          <RelatedResources currentPath="/anger-and-boundaries" />
</main>
      </div>
    </>
  );
}
