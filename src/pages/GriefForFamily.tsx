import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function GriefForFamily() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Grief for the Family You Thought You'd Have | Sober Helpline</title>
        <meta name="description" content="Naming the loss no one prepared you for. Understanding ambiguous grief in families affected by addiction—and finding permission to grieve honestly." />
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
              Grief for the Family You Thought You'd Have
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Naming the Loss No One Prepared You For
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why This Guide Matters</h2>
              <p className="text-muted-foreground mb-4">
                Many families living with addiction carry a quiet, persistent ache that sounds like:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>"This isn't how it was supposed to be."</li>
                <li>"I don't recognize our family anymore."</li>
                <li>"I miss what we never got to have."</li>
                <li>"I'm tired of pretending I'm okay with this."</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                This grief is real—and often unacknowledged.
              </p>
              <p className="text-foreground font-medium mb-4">
                It is possible to grieve deeply even while people are still alive.
              </p>
              <p className="text-muted-foreground">
                This guide helps families name and understand that grief—without turning it into despair or shame.
              </p>
            </section>

            <section className="mb-10 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What This Kind of Grief Is</h2>
              <p className="text-muted-foreground mb-4">
                This is not grief for a single event. It is grief for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>The future you imagined</li>
                <li>The milestones you expected</li>
                <li>The stability you assumed</li>
                <li>The roles you thought you'd have</li>
                <li>The family rhythms you never got to build</li>
              </ul>
              <p className="text-foreground font-medium">
                This is ambiguous grief—loss without clear ending.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why This Grief Is So Hard to Name</h2>
              <p className="text-muted-foreground mb-4">
                Families struggle to name this grief because:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>No one has died</li>
                <li>Hope still exists</li>
                <li>Others say "at least…"</li>
                <li>The loss is invisible</li>
                <li>Love is still present</li>
              </ul>
              <p className="text-foreground font-medium">
                Grieving something that never fully existed can feel illegitimate—but it isn't.
              </p>
            </section>

            <section className="mb-10 p-6 bg-muted/30 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Common Thoughts Families Have (But Don't Say)</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>"I'm angry that this is our life."</li>
                <li>"I envy other families."</li>
                <li>"I feel guilty for wanting something different."</li>
                <li>"I don't know who we are anymore."</li>
                <li>"I'm tired of waiting for things to get better."</li>
              </ul>
              <p className="text-foreground font-medium">
                These thoughts are grief speaking, not failure.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">The Losses Families Rarely Acknowledge</h2>
              <p className="text-muted-foreground mb-4">
                Families often grieve:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Predictability</li>
                <li>Safety</li>
                <li>Trust</li>
                <li>Peace</li>
                <li>Celebrations without tension</li>
                <li>Shared joy without fear</li>
                <li>Spontaneity</li>
                <li>Innocence</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                These losses accumulate quietly over time.
              </p>
            </section>

            <section className="mb-10 p-6 bg-primary/10 rounded-lg border border-primary/30">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Grief and Hope Coexist</h2>
              <p className="text-muted-foreground mb-4">
                Many families feel confused because:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>They still love deeply</li>
                <li>They still hope for recovery</li>
                <li>They don't want to give up</li>
              </ul>
              <p className="text-foreground font-medium mb-4">
                Grief does not mean giving up. It means accepting reality as it is today.
              </p>
              <p className="text-muted-foreground mb-2">
                Hope without grief becomes denial.
              </p>
              <p className="text-muted-foreground mb-4">
                Grief without hope becomes despair.
              </p>
              <p className="text-foreground font-medium">
                Both can exist.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Happens When Grief Is Ignored</h2>
              <p className="text-muted-foreground mb-4">
                When grief goes unacknowledged, families may:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Become emotionally numb</li>
                <li>Feel chronically irritable</li>
                <li>Lose motivation</li>
                <li>Feel disconnected</li>
                <li>Stay stuck in waiting mode</li>
                <li>Over-function or give up</li>
              </ul>
              <p className="text-foreground font-medium">
                Unprocessed grief doesn't disappear. It reshapes behavior.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Healthy Grief Looks Like in Families</h2>
              <p className="text-muted-foreground mb-4">
                Healthy grief:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Makes room for sadness without panic</li>
                <li>Allows anger without guilt</li>
                <li>Honors loss without erasing hope</li>
                <li>Frees energy tied up in "what if"</li>
                <li>Creates clarity about what matters now</li>
              </ul>
              <p className="text-foreground font-medium">
                Grief becomes a release, not a collapse.
              </p>
            </section>

            <section className="mb-10 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Letting Go Without Giving Up</h2>
              <p className="text-muted-foreground mb-4">
                Grieving the family you thought you'd have does not mean:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>You stop loving</li>
                <li>You stop supporting</li>
                <li>You stop hoping</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                It means:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>You stop living in constant comparison</li>
                <li>You stop waiting to be okay</li>
                <li>You stop measuring today against an imagined future</li>
              </ul>
              <p className="text-foreground font-medium">
                Acceptance is not resignation. It is grounding.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What This Grief Asks of Families</h2>
              <p className="text-muted-foreground mb-4">
                This grief often asks families to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Mourn privately and honestly</li>
                <li>Release fantasies that keep them stuck</li>
                <li>Redefine success</li>
                <li>Create meaning now—not later</li>
                <li>Build a life alongside uncertainty</li>
              </ul>
              <p className="text-muted-foreground">
                This is hard—and deeply human.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Reflection Questions</h2>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
                <li>What family did I imagine we would be?</li>
                <li>What am I grieving that I've never named?</li>
                <li>Where have I been holding my breath, waiting?</li>
                <li>What does acceptance—not approval—look like?</li>
                <li>What kind of life can I build today, regardless of outcome?</li>
              </ol>
            </section>

            <section className="mb-10 p-6 bg-primary/10 rounded-lg border border-primary/30">
              <h2 className="text-2xl font-semibold text-foreground mb-4">A Grounding Reframe</h2>
              <p className="text-foreground font-medium mb-4">
                You are not grieving because you failed. You are grieving because you cared—and hoped.
              </p>
              <p className="text-muted-foreground">
                Grief is love adjusting to reality.
              </p>
            </section>

            <section className="mb-10 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Final Thought</h2>
              <p className="text-muted-foreground mb-4">
                Families impacted by addiction are often told to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>Stay positive</li>
                <li>Keep the faith</li>
                <li>Be grateful</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                But healing requires something deeper: <strong>Permission to grieve honestly.</strong>
              </p>
              <p className="text-muted-foreground mb-4">
                When families allow themselves to grieve the life they imagined, they stop being trapped by it.
              </p>
              <p className="text-foreground font-medium">
                And in that space—something steadier, truer, and more livable can finally begin.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Suggested Companion Resources</h2>
              <div className="flex flex-wrap gap-2">
                <Link to="/living-well-regardless">
                  <Button variant="outline" size="sm">Living Well Regardless of Outcome</Button>
                </Link>
                <Link to="/guilt-relief-resentment">
                  <Button variant="outline" size="sm">The Guilt–Relief–Resentment Cycle</Button>
                </Link>
                <Link to="/growing-up-shadow">
                  <Button variant="outline" size="sm">Growing Up in the Shadow of Addiction</Button>
                </Link>
                <Link to="/addiction-rewrites-family-rules">
                  <Button variant="outline" size="sm">How Addiction Rewrites Family Rules</Button>
                </Link>
                <Link to="/emotional-regulation">
                  <Button variant="outline" size="sm">Emotional Regulation Tools for Families</Button>
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
