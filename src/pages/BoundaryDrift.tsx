import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function BoundaryDrift() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Boundary Drift: How Limits Slowly Erode | Sober Helpline</title>
        <meta name="description" content="Why boundaries don't fail in crisis—they fade in calm. Understanding how limits gradually erode and how to stop boundary drift in families affected by addiction." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur print:hidden">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
            </Link>
            <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
              <Phone className="h-4 w-4" />
              (541) 241-5886
            </a>
          </div>
        </header>

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

          <article className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
              Boundary Drift: How Limits Slowly Erode
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Why Boundaries Don't Fail in Crisis—They Fade in Calm
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why This Guide Matters</h2>
              <p className="text-muted-foreground mb-4">
                Many families believe boundaries fail because:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>They weren't strong enough</li>
                <li>They weren't enforced firmly</li>
                <li>They weren't explained clearly</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                In reality, most boundaries don't collapse in a single dramatic moment.
              </p>
              <p className="text-foreground font-medium mb-4">
                They drift.
              </p>
              <p className="text-muted-foreground mb-4">
                Boundary drift is subtle, gradual, and often invisible until families realize:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>They're doing things they swore they wouldn't</li>
                <li>Consequences no longer stick</li>
                <li>Exhaustion has replaced clarity</li>
                <li>Addiction feels "back in charge"</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                This guide explains how drift happens—and how to stop it.
              </p>
            </section>

            <section className="mb-10 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Boundary Drift Is (Clearly Defined)</h2>
              <p className="text-muted-foreground mb-4">
                Boundary drift occurs when:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Limits are technically still stated</li>
                <li>But responses slowly change</li>
                <li>Exceptions multiply</li>
                <li>Follow-through weakens</li>
                <li>Emotional reactions override decisions</li>
              </ul>
              <p className="text-muted-foreground font-medium">
                No one announces it. It just… happens.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Boundaries Are Vulnerable to Drift</h2>
              <p className="text-muted-foreground mb-4">
                Boundaries erode because families are human.
              </p>
              <p className="text-muted-foreground mb-4">
                Drift is fueled by:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Fatigue</li>
                <li>Hope</li>
                <li>Guilt</li>
                <li>Fear of escalation</li>
                <li>Desire for peace</li>
                <li>Relief when things calm down</li>
              </ul>
              <p className="text-foreground font-medium">
                Boundaries are hardest to hold when things seem better.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">The Most Common Drift Triggers</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">1. "They're Doing Better"</h3>
                  <p className="text-muted-foreground mb-2">Early improvement often leads to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Relaxed enforcement</li>
                    <li>Increased access</li>
                    <li>Reduced structure</li>
                    <li>"Just this once" exceptions</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Progress gets mistaken for stability.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">2. Emotional Appeals</h3>
                  <p className="text-muted-foreground mb-2">Drift accelerates when families hear:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>"I'm trying."</li>
                    <li>"You don't trust me."</li>
                    <li>"You're punishing me."</li>
                    <li>"I feel abandoned."</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Emotional pain pulls families back into rescue mode.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">3. Crisis Fatigue</h3>
                  <p className="text-muted-foreground mb-2">After months or years of stress:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Enforcement feels exhausting</li>
                    <li>Conflict avoidance increases</li>
                    <li>Consistency feels unsustainable</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Fatigue lowers defenses.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">4. Hope After Apologies</h3>
                  <p className="text-muted-foreground mb-2">Apologies feel like change. They often lead to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Boundary softening</li>
                    <li>Reduced vigilance</li>
                    <li>Increased trust before behavior supports it</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Insight gets confused with capacity.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">5. Uneven Family Alignment</h3>
                  <p className="text-muted-foreground mb-2">When family members respond differently:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Boundaries become negotiable</li>
                    <li>Consequences vary</li>
                    <li>Addiction finds the weakest point</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Inconsistency invites drift.</p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Boundary Drift Looks Like in Real Life</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>"Just this once" becomes routine</li>
                <li>Consequences are delayed, then dropped</li>
                <li>Boundaries are re-explained instead of enforced</li>
                <li>Emotional reassurance replaces action</li>
                <li>Families feel resentful—but guilty for it</li>
              </ul>
              <p className="text-muted-foreground font-medium">
                Drift doesn't feel like failure. It feels like compassion.
              </p>
            </section>

            <section className="mb-10 p-6 bg-destructive/10 rounded-lg border border-destructive/30">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How Drift Strengthens Addiction</h2>
              <p className="text-muted-foreground mb-4">
                Boundary drift teaches:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Limits are flexible</li>
                <li>Distress changes outcomes</li>
                <li>Time weakens resolve</li>
                <li>Negotiation works</li>
                <li>Consequences aren't permanent</li>
              </ul>
              <p className="text-foreground font-medium">
                Addiction doesn't need chaos—it needs predictable erosion.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">The Hidden Cost to Families</h2>
              <p className="text-muted-foreground mb-4">
                Over time, boundary drift causes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Emotional burnout</li>
                <li>Loss of credibility</li>
                <li>Increased resentment</li>
                <li>Self-doubt</li>
                <li>Anger at oneself rather than the behavior</li>
                <li>Feeling trapped by your own decisions</li>
              </ul>
              <p className="text-muted-foreground font-medium">
                Families often blame themselves instead of the process.
              </p>
            </section>

            <section className="mb-10 p-6 bg-muted/30 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">The Myth That Keeps Drift Going</h2>
              <p className="text-foreground font-medium mb-4">
                "If I just explain it better, they'll understand."
              </p>
              <p className="text-muted-foreground">
                Understanding does not prevent relapse. Structure does.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How to Interrupt Boundary Drift</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">1. Recommit in Writing</h3>
                  <p className="text-muted-foreground mb-2">Write down:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>The boundary</li>
                    <li>The reason</li>
                    <li>The consequence</li>
                    <li>The plan for enforcement</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Clarity protects against emotion.</p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">2. Watch Calm Periods Closely</h3>
                  <p className="text-muted-foreground mb-2">Ask:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>"Are we relaxing structure too quickly?"</li>
                    <li>"What changed behaviorally—not emotionally?"</li>
                    <li>"Is consistency still intact?"</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Calm is when drift begins.</p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">3. Reduce Explanations</h3>
                  <p className="text-muted-foreground mb-2">Boundaries weaken when they require persuasion.</p>
                  <p className="text-sm text-muted-foreground mb-2">Simple statements are stronger:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>"This hasn't changed."</li>
                    <li>"The boundary still stands."</li>
                    <li>"We're not adjusting this."</li>
                  </ul>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">4. Address Fatigue—Not the Boundary</h3>
                  <p className="text-muted-foreground mb-2">If holding the boundary feels impossible, the issue may be:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Burnout</li>
                    <li>Lack of support</li>
                    <li>Over-involvement</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">The solution is support for the family, not removing limits.</p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">5. Repair Drift Without Shame</h3>
                  <p className="text-muted-foreground mb-2">If drift has already happened:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Acknowledge it</li>
                    <li>Reset calmly</li>
                    <li>Reinstate boundaries</li>
                    <li>Expect pushback</li>
                    <li>Stay consistent</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Resetting is not hypocrisy. It's correction.</p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Boundary Repair Sounds Like</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>"We realized we moved away from what we said we'd do."</li>
                <li>"That wasn't working for us."</li>
                <li>"We're returning to the original boundary."</li>
                <li>"We understand this is frustrating."</li>
              </ul>
              <p className="text-muted-foreground font-medium">
                No debate. No defense. No apology for clarity.
              </p>
            </section>

            <section className="mb-10 p-6 bg-primary/10 rounded-lg border border-primary/30">
              <h2 className="text-2xl font-semibold text-foreground mb-4">A Critical Reframe</h2>
              <p className="text-foreground font-medium mb-4">
                Boundaries don't fail because families don't care enough. They drift because families care deeply—and get tired.
              </p>
              <p className="text-foreground font-medium">
                Consistency—not intensity—is what holds the line.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Reflection Questions for Families</h2>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
                <li>Where have our boundaries softened over time?</li>
                <li>What emotion tends to trigger exceptions?</li>
                <li>What consequence have we delayed or avoided?</li>
                <li>Where are we more exhausted than intentional?</li>
                <li>What boundary needs to be reset right now?</li>
              </ol>
            </section>

            <section className="mb-10 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Final Thought</h2>
              <p className="text-muted-foreground mb-4">
                Boundary drift is not a moral failure. It is a systems issue.
              </p>
              <p className="text-muted-foreground mb-4">
                Families don't need harsher limits. They need:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Clear decisions</li>
                <li>Support for enforcement</li>
                <li>Permission to reset</li>
                <li>Relief from carrying everything alone</li>
              </ul>
              <p className="text-foreground font-medium">
                Boundaries protect families first. When families are protected, recovery has a chance.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Suggested Companion Resources</h2>
              <div className="flex flex-wrap gap-2">
                <Link to="/boundaries-ultimatums">
                  <Button variant="outline" size="sm">Requests, Demands, Ultimatums & Boundaries</Button>
                </Link>
                <Link to="/insight-behavior-tracker">
                  <Button variant="outline" size="sm">Insight vs. Behavior Tracker</Button>
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
        </main>
      </div>
    </>
  );
}
