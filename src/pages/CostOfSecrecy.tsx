import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function CostOfSecrecy() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>The Cost of Secrecy | Sober Helpline</title>
        <meta name="description" content="How silence protects addiction—and what honesty makes possible. Understanding the difference between privacy and secrecy in families affected by addiction." />
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
              The Cost of Secrecy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              How Silence Protects Addiction—and What Honesty Makes Possible
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why This Guide Matters</h2>
              <p className="text-muted-foreground mb-4">
                Families affected by addiction often say:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                <li>"We don't talk about it."</li>
                <li>"It's private."</li>
                <li>"We're protecting them."</li>
                <li>"We don't want to make things worse."</li>
                <li>"What happens in this family stays here."</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                These statements are usually rooted in love, fear, and survival—not denial.
              </p>
              <p className="text-muted-foreground">
                And yet: <strong>Secrecy is one of addiction's most reliable allies.</strong>
              </p>
              <p className="text-muted-foreground mt-4">
                This guide explains how secrecy forms, why it feels necessary, and how it quietly undermines both family health and recovery.
              </p>
            </section>

            <section className="mb-10 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Secrecy vs. Privacy (An Essential Distinction)</h2>
              <p className="text-muted-foreground mb-4">
                Before going further, this distinction matters:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <p className="font-semibold text-foreground mb-2">Privacy protects dignity and boundaries.</p>
                  <p className="text-sm text-muted-foreground mb-2">Privacy sounds like:</p>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>"We share selectively."</li>
                    <li>"We tell the truth with discretion."</li>
                    <li>"We protect people's dignity."</li>
                  </ul>
                </div>
                <div className="p-4 bg-background rounded-lg border border-border">
                  <p className="font-semibold text-foreground mb-2">Secrecy protects dysfunction.</p>
                  <p className="text-sm text-muted-foreground mb-2">Secrecy sounds like:</p>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>"We don't talk about it at all."</li>
                    <li>"We pretend everything is fine."</li>
                    <li>"No one outside the family can know."</li>
                  </ul>
                </div>
              </div>
              <p className="text-muted-foreground mt-4 font-medium">
                Privacy allows honesty. Secrecy requires silence.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Secrecy Develops in Families</h2>
              <p className="text-muted-foreground mb-4">
                Secrecy usually forms because:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Stigma feels dangerous</li>
                <li>Shame feels unbearable</li>
                <li>Conflict escalates when issues are named</li>
                <li>Families fear judgment or blame</li>
                <li>Parents want to protect children</li>
                <li>Exposure feels like loss of control</li>
              </ul>
              <p className="text-muted-foreground">
                Secrecy is rarely chosen freely. It is a fear-based adaptation.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">The Rules Secrecy Creates</h2>
              <p className="text-muted-foreground mb-4">
                Over time, secrecy quietly rewrites family rules:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>"Don't talk about it."</li>
                <li>"Don't tell anyone."</li>
                <li>"Don't embarrass the family."</li>
                <li>"Don't make things worse."</li>
                <li>"Don't upset them."</li>
              </ul>
              <p className="text-muted-foreground">
                These rules shape behavior—even when no one says them out loud.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">The Hidden Costs of Secrecy</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">1. Isolation</h3>
                  <p className="text-muted-foreground mb-2">When families can't speak honestly:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Support disappears</li>
                    <li>Stress becomes internal</li>
                    <li>Everyone feels alone—even together</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">Isolation increases burnout and hopelessness.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">2. Distorted Reality</h3>
                  <p className="text-muted-foreground mb-2">Secrecy forces families to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Minimize</li>
                    <li>Rationalize</li>
                    <li>Normalize chaos</li>
                    <li>Question their own perceptions</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">Over time, people stop trusting their instincts.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">3. Emotional Suppression</h3>
                  <p className="text-muted-foreground mb-2">Unspoken truths don't disappear. They surface as:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Anxiety</li>
                    <li>Irritability</li>
                    <li>Depression</li>
                    <li>Physical symptoms</li>
                    <li>Emotional numbness</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">Children especially learn to feel without language.</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-2">4. Role Lock-In</h3>
                  <p className="text-muted-foreground mb-2">Secrecy reinforces rigid roles:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>The strong one</li>
                    <li>The peacekeeper</li>
                    <li>The invisible one</li>
                    <li>The protector of image</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">Roles become survival positions—not choices.</p>
                </div>

                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                  <h3 className="text-lg font-semibold text-foreground mb-2">5. Protection of Addiction</h3>
                  <p className="text-muted-foreground mb-2">Perhaps most critically:</p>
                  <p className="text-foreground font-medium mb-2">Secrecy shields addiction from consequences.</p>
                  <p className="text-muted-foreground mb-2">When no one can speak openly:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Accountability weakens</li>
                    <li>Boundaries erode</li>
                    <li>External help is delayed</li>
                    <li>Change feels impossible</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How Secrecy Affects Children and Siblings</h2>
              <p className="text-muted-foreground mb-4">
                Children growing up in secrecy often learn:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>"Something is wrong—but I can't name it."</li>
                <li>"My feelings aren't safe to express."</li>
                <li>"Truth causes trouble."</li>
                <li>"I have to figure this out alone."</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                As adults, they may struggle with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Trust</li>
                <li>Self-expression</li>
                <li>Asking for help</li>
                <li>Intimacy</li>
                <li>Feeling seen</li>
              </ul>
              <p className="text-muted-foreground font-medium">
                The silence echoes long after addiction ends.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Secrecy Persists Even in Recovery</h2>
              <p className="text-muted-foreground mb-4">
                Even after substance use decreases:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Fear remains</li>
                <li>Habits linger</li>
                <li>Shame hasn't been addressed</li>
                <li>Families fear "rocking the boat"</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Recovery without honesty often leads to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Emotional distance</li>
                <li>Boundary confusion</li>
                <li>Relapse vulnerability</li>
                <li>Unresolved resentment</li>
              </ul>
            </section>

            <section className="mb-10 p-6 bg-muted/30 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Breaking Secrecy Does Not Mean</h2>
              <p className="text-muted-foreground mb-4">
                Breaking secrecy does not require:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Public disclosure</li>
                <li>Oversharing</li>
                <li>Shaming anyone</li>
                <li>Broadcasting private details</li>
                <li>Confrontation without support</li>
              </ul>
              <p className="text-muted-foreground font-medium">
                Honesty can be measured, intentional, and contained.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Healthy Honesty Looks Like</h2>
              <p className="text-muted-foreground mb-4">
                Healthy honesty includes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Naming reality without exaggeration</li>
                <li>Speaking truth without blame</li>
                <li>Allowing age-appropriate conversations</li>
                <li>Asking for help</li>
                <li>Letting others know you're struggling</li>
                <li>Ending the pretense of "fine"</li>
              </ul>
              <p className="text-muted-foreground font-medium">
                Honesty restores orientation.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How Families Can Begin Reducing Secrecy Safely</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Step 1: Name What's Been Unspoken</h3>
                  <p className="text-muted-foreground mb-2">Ask:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>"What haven't we been allowed to say?"</li>
                    <li>"What feels taboo?"</li>
                    <li>"What are we pretending isn't happening?"</li>
                  </ul>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Step 2: Choose One Safe Outlet</h3>
                  <p className="text-muted-foreground mb-2">This could be:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>A therapist</li>
                    <li>A support group</li>
                    <li>A trusted friend</li>
                    <li>A professional guide</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">Secrecy loosens when truth has a place to land.</p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Step 3: Speak Truth Without Over-Explaining</h3>
                  <p className="text-muted-foreground mb-2">Honesty does not require justification.</p>
                  <p className="text-sm text-muted-foreground mb-2">Example:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>"We're dealing with addiction in our family."</li>
                    <li>"Things are not okay right now."</li>
                    <li>"We're getting support."</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 font-medium">Simple truth is powerful.</p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Step 4: Protect Children With Honesty—Not Silence</h3>
                  <p className="text-muted-foreground mb-2">Children need:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Reality explained in age-appropriate ways</li>
                    <li>Permission to ask questions</li>
                    <li>Reassurance without lies</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">Silence creates fear. Truth creates safety.</p>
                </div>
              </div>
            </section>

            <section className="mb-10 p-6 bg-primary/10 rounded-lg border border-primary/30">
              <h2 className="text-2xl font-semibold text-foreground mb-4">A Grounding Reframe</h2>
              <p className="text-foreground font-medium">
                Secrecy feels like protection—but it slowly erodes trust, clarity, and connection.
              </p>
              <p className="text-foreground font-medium mt-4">
                Honesty is not what breaks families. Silence does.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Reflection Questions for Families</h2>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
                <li>What have we been afraid to say out loud?</li>
                <li>Who are we protecting by staying silent?</li>
                <li>Who is paying the cost of that silence?</li>
                <li>Where could honesty reduce isolation?</li>
                <li>What truth is asking to be named now?</li>
              </ol>
            </section>

            <section className="mb-10 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Final Thought</h2>
              <p className="text-muted-foreground mb-4">
                Families don't keep secrets because they are dishonest. They keep secrets because they are afraid.
              </p>
              <p className="text-muted-foreground mb-4">
                But addiction thrives in silence—and weakens in the presence of truth.
              </p>
              <p className="text-muted-foreground mb-4">
                Breaking secrecy doesn't require exposing everything. It requires ending the lie that silence is safer than honesty.
              </p>
              <p className="text-foreground font-medium">
                That shift alone can change the entire system.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Suggested Companion Resources</h2>
              <div className="flex flex-wrap gap-2">
                <Link to="/addiction-rewrites-family-rules">
                  <Button variant="outline" size="sm">How Addiction Rewrites Family Rules</Button>
                </Link>
                <Link to="/family-roles-addiction">
                  <Button variant="outline" size="sm">Family Roles in Addiction (Beyond the Clichés)</Button>
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
