import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function FlexibilityVsInstability() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>The Difference Between Flexibility and Instability | Sober Helpline</title>
        <meta name="description" content="Why adaptability supports recovery—and inconsistency undermines it. Understanding the difference between healthy flexibility and destabilizing instability in families affected by addiction." />
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
              The Difference Between Flexibility and Instability
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Why Adaptability Supports Recovery—and Inconsistency Undermines It
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why This Guide Matters</h2>
              <p className="text-muted-foreground mb-4">
                Families are often told:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>"Be flexible."</li>
                <li>"Meet them where they are."</li>
                <li>"Every situation is different."</li>
                <li>"Rigid boundaries push people away."</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                These messages are not wrong—but they are frequently misunderstood.
              </p>
              <p className="text-foreground font-medium mb-4">
                Flexibility and instability are not the same thing.
              </p>
              <p className="text-muted-foreground">
                Confusing the two leads families to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
                <li>Change boundaries repeatedly</li>
                <li>Respond emotionally rather than intentionally</li>
                <li>Lose credibility</li>
                <li>Feel confused, exhausted, and resentful</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                This guide clarifies the difference—and shows how to practice flexibility without undermining recovery.
              </p>
            </section>

            <section className="mb-10 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">A Clear Definition</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="font-semibold text-foreground mb-2">Flexibility</p>
                  <p className="text-muted-foreground">Intentional adaptation within stable principles.</p>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                  <p className="font-semibold text-foreground mb-2">Instability</p>
                  <p className="text-muted-foreground">Reactive change driven by emotion, fear, or pressure.</p>
                </div>
              </div>
              <p className="text-foreground font-medium mt-4">
                One strengthens systems. The other weakens them.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Healthy Flexibility Looks Like</h2>
              <p className="text-muted-foreground mb-4">
                Flexibility:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Is planned—not impulsive</li>
                <li>Happens within clear boundaries</li>
                <li>Maintains core values</li>
                <li>Is consistent over time</li>
                <li>Does not require negotiation</li>
                <li>Does not erase consequences</li>
              </ul>
              <p className="text-foreground font-medium">
                Flexibility adjusts how support is offered—not whether boundaries exist.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Instability Looks Like</h2>
              <p className="text-muted-foreground mb-4">
                Instability often appears as:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Changing rules based on mood</li>
                <li>Exceptions that multiply</li>
                <li>Consequences that shift or disappear</li>
                <li>Boundaries that depend on emotional intensity</li>
                <li>"We'll see how it goes" without structure</li>
                <li>Decisions made during crisis</li>
              </ul>
              <p className="text-foreground font-medium">
                Instability creates confusion—even when intentions are loving.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Families Confuse Flexibility with Instability</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">1. Fear of Being "Too Harsh"</h3>
                  <p className="text-muted-foreground mb-2">Families worry:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>"What if we push too hard?"</li>
                    <li>"What if this makes things worse?"</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">Fear encourages bending in the moment—without clarity.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">2. Emotional Appeals Feel Urgent</h3>
                  <p className="text-muted-foreground mb-2">Statements like:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>"You don't trust me."</li>
                    <li>"I'm really trying."</li>
                    <li>"This time is different."</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">Pull families toward exceptions that feel compassionate—but destabilize consistency.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">3. Relief Is Mistaken for Progress</h3>
                  <p className="text-muted-foreground mb-2">When tension decreases, families may:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Relax boundaries prematurely</li>
                    <li>Interpret calm as recovery</li>
                    <li>Reduce structure too soon</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Relief is not the same as stability.</p>
                </div>
              </div>
            </section>

            <section className="mb-10 p-6 bg-destructive/10 rounded-lg border border-destructive/30">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Instability Feeds Addiction</h2>
              <p className="text-muted-foreground mb-4">
                Instability teaches:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Boundaries are negotiable</li>
                <li>Emotional distress changes outcomes</li>
                <li>Time weakens resolve</li>
                <li>Consequences are inconsistent</li>
              </ul>
              <p className="text-foreground font-medium mb-4">
                Addiction doesn't need freedom—it needs unpredictability.
              </p>
              <p className="text-muted-foreground">
                Predictable systems create pressure for change. Unpredictable systems create opportunity for avoidance.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Flexibility That Supports Recovery (Examples)</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Adjusting communication timing—but not boundaries</li>
                <li>Offering treatment support in different forms—but not removing the requirement</li>
                <li>Modifying logistics—but not expectations</li>
                <li>Providing emotional support—without financial rescue</li>
                <li>Revisiting plans at set intervals—not in crisis</li>
              </ul>
              <p className="text-foreground font-medium">
                Flexibility works when the frame stays intact.
              </p>
            </section>

            <section className="mb-10 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Instability That Looks Like Compassion (But Isn't)</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>"Just this once"</li>
                <li>"Let's wait and see"</li>
                <li>"We don't want to upset them"</li>
                <li>"Things seem better right now"</li>
                <li>"We'll figure it out later"</li>
              </ul>
              <p className="text-muted-foreground">
                These phrases feel kind—but undermine clarity and trust.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How to Tell the Difference in Real Time</h2>
              <p className="text-muted-foreground mb-4">
                Ask yourself:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Is this change planned or reactive?</li>
                <li>Are we staying aligned with our values?</li>
                <li>Would we make this decision if emotions were calm?</li>
                <li>Are we adjusting structure—or removing it?</li>
                <li>Is this reducing long-term harm—or just immediate discomfort?</li>
              </ul>
              <p className="text-muted-foreground font-medium">
                The answers usually reveal the truth.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">The Role of Calm Consistency</h2>
              <p className="text-muted-foreground mb-4">
                Recovery-supportive systems are:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Predictable</li>
                <li>Boring</li>
                <li>Repetitive</li>
                <li>Unemotional</li>
                <li>Clear</li>
              </ul>
              <p className="text-muted-foreground">
                Calm consistency is often mistaken for coldness—but it is stabilizing.
              </p>
            </section>

            <section className="mb-10 p-6 bg-primary/10 rounded-lg border border-primary/30">
              <h2 className="text-2xl font-semibold text-foreground mb-4">A Critical Reframe</h2>
              <p className="text-foreground font-medium mb-4">
                Flexibility supports recovery when it preserves structure. Instability undermines recovery when it removes it.
              </p>
              <p className="text-muted-foreground">
                The goal is not rigidity. The goal is reliability.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Reflection Questions for Families</h2>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
                <li>Where have we confused flexibility with instability?</li>
                <li>What boundary has shifted repeatedly?</li>
                <li>What emotion tends to drive our changes?</li>
                <li>What value are we trying to honor?</li>
                <li>How can we adapt without erasing structure?</li>
              </ol>
            </section>

            <section className="mb-10 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Final Thought</h2>
              <p className="text-muted-foreground mb-4">
                Families don't need to be harsher or softer. They need to be clearer.
              </p>
              <p className="text-muted-foreground mb-4">
                True flexibility:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Reduces conflict</li>
                <li>Increases trust</li>
                <li>Supports accountability</li>
                <li>Preserves family health</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Stability—not emotional responsiveness—is what gives recovery room to grow.
              </p>
              <p className="text-foreground font-medium">
                When families learn the difference, they stop chasing balance—and start building it.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Suggested Companion Resources</h2>
              <div className="flex flex-wrap gap-2">
                <Link to="/boundary-drift">
                  <Button variant="outline" size="sm">Boundary Drift: How Limits Slowly Erode</Button>
                </Link>
                <Link to="/anger-and-boundaries">
                  <Button variant="outline" size="sm">Anger and Boundaries Are Not the Same Thing</Button>
                </Link>
                <Link to="/boundaries-ultimatums">
                  <Button variant="outline" size="sm">Requests, Demands, Ultimatums & Boundaries</Button>
                </Link>
                <Link to="/insight-behavior-tracker">
                  <Button variant="outline" size="sm">Insight vs. Behavior Tracker</Button>
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
