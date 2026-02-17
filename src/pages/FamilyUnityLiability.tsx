import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, Users, AlertTriangle, CheckCircle, XCircle, ArrowRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

export default function FamilyUnityLiability() {
  useGuideTracking("When Family Unity Becomes a Liability", "/family-unity-liability");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>When Family Unity Becomes a Liability | Sober Helpline</title>
        <meta name="description" content="Learn how both togetherness and division can undermine recovery, and discover what functional family alignment actually looks like." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12 max-w-4xl">
          <div className="flex items-center justify-between mb-6 print:hidden">
            <Link to="/family-education">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Family Education
              </Button>
            </Link>
            <Button onClick={handlePrint} variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print Guide
            </Button>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">When Family Unity (or the Lack of It) Becomes a Liability</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              How Togetherness and Division Can Both Undermine Recovery—and What Actually Helps
            </p>
          </div>

          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Why This Guide Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Families affected by addiction are often told one of two things:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-border text-center">
                  <p className="text-foreground italic">"You need to be united."</p>
                </div>
                <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-border text-center">
                  <p className="text-foreground italic">"Everyone has the right to their own approach."</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Both statements contain truth. Both can also cause harm when misunderstood.
              </p>
              <p className="text-foreground font-medium">
                Family unity is not always helpful—and family division is not always the problem.
              </p>
              <p className="text-muted-foreground">
                What matters is <strong className="text-foreground">how alignment functions</strong> inside the system.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                A Critical Reframe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-lg text-foreground">
                  <strong>Unity</strong> is not agreement.
                </p>
                <p className="text-lg text-foreground">
                  <strong>Division</strong> is not independence.
                </p>
              </div>
              <p className="text-foreground font-medium mt-4 text-center p-4 rounded-lg bg-white/50 dark:bg-slate-900/50">
                In addiction-impacted families, both can become liabilities when they protect the addiction rather than promote health.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-red-700 dark:text-red-400">When Family Unity Becomes a Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm">1</span>
                  Unity That Silences Dissent
                </h4>
                <p className="text-muted-foreground mb-3">When unity means:</p>
                <div className="grid md:grid-cols-2 gap-2 mb-4">
                  {[
                    "\"Don't rock the boat\"",
                    "\"We have to present a united front\"",
                    "\"Handle it privately\"",
                    "\"We don't talk about disagreements\""
                  ].map((item, index) => (
                    <div key={index} className="p-2 rounded bg-red-50/50 dark:bg-red-950/20">
                      <span className="text-sm text-muted-foreground italic">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-foreground font-medium">Then unity becomes suppression.</p>
                <div className="mt-3 p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Cost:</p>
                  <ul className="space-y-1">
                    {[
                      "Honest concerns go underground",
                      "Early warning signs are ignored",
                      "Enabling behaviors are protected",
                      "The most truthful voices disengage"
                    ].map((cost, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                        {cost}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm">2</span>
                  Unity That Prioritizes Peace Over Health
                </h4>
                <p className="text-muted-foreground mb-3">Families may stay united around:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Avoiding conflict", "Reducing stress", "Keeping gatherings calm", "Maintaining appearances"].map((item, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-amber-100/50 dark:bg-amber-950/30 text-sm text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-3">This often leads to:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Boundary erosion", "Chronic resentment", "Emotional dishonesty", "Crisis cycles"].map((item, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-red-100/50 dark:bg-red-950/30 text-sm text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-foreground font-medium">
                  Peace without truth is not stability—it is delay.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm">3</span>
                  Unity That Shields Consequences
                </h4>
                <p className="text-muted-foreground mb-3">When families unify around:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Rescuing", "Covering", "Explaining away behavior", "Minimizing impact"].map((item, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-red-100/50 dark:bg-red-950/30 text-sm text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-3">They unintentionally teach:</p>
                <ul className="space-y-1 mb-3">
                  {[
                    "The system will absorb consequences",
                    "Change is optional",
                    "Accountability is negotiable"
                  ].map((item, index) => (
                    <li key={index} className="text-muted-foreground flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-red-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-red-700 dark:text-red-400 font-semibold">
                  This type of unity directly protects addiction.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-orange-700 dark:text-orange-400">When Lack of Unity Becomes a Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm">1</span>
                  Inconsistent Boundaries
                </h4>
                <p className="text-muted-foreground mb-3">When family members:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Respond differently", "Offer conflicting support", "Undercut consequences", "Make private exceptions"].map((item, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-orange-100/50 dark:bg-orange-950/30 text-sm text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-3">Addiction learns:</p>
                <ul className="space-y-1 mb-3">
                  {["Who to go to", "How to split the system", "How to avoid pressure"].map((item, index) => (
                    <li key={index} className="text-muted-foreground flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-foreground font-medium">This inconsistency breeds chaos.</p>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm">2</span>
                  Triangulation and Side-Taking
                </h4>
                <p className="text-muted-foreground mb-3">Visible division often leads to:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Parent vs. parent", "Sibling alliances", "Messengers and mediators", "Escalating emotional conflict"].map((item, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-orange-100/50 dark:bg-orange-950/30 text-sm text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-orange-700 dark:text-orange-400 font-semibold">
                  When families fight each other, addiction stays comfortable.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm">3</span>
                  Emotional Exhaustion and Burnout
                </h4>
                <p className="text-muted-foreground mb-3">Disunity often leaves individuals:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Carrying the load alone", "Feeling unsupported", "Questioning themselves", "Burning out faster"].map((item, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-orange-100/50 dark:bg-orange-950/30 text-sm text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-foreground font-medium">Burnout weakens resolve and clarity.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">The Real Issue Is Not Unity—It Is Alignment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">The goal is not:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Total agreement", "Emotional sameness", "Identical approaches"].map((item, index) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-foreground font-medium mb-4">
                The goal is <strong className="text-primary">alignment around core principles</strong>.
              </p>
              <p className="text-muted-foreground mb-3">Alignment answers:</p>
              <ul className="space-y-2">
                {[
                  "What behaviors are unacceptable?",
                  "What support is conditional?",
                  "What boundaries are non-negotiable?",
                  "What outcomes are we aiming for?"
                ].map((question, index) => (
                  <li key={index} className="flex items-center gap-2 text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    {question}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  What Healthy Alignment Looks Like
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">Healthy alignment includes:</p>
                <ul className="space-y-2">
                  {[
                    "Shared bottom lines",
                    "Consistent consequences",
                    "Respect for individual emotional differences",
                    "Direct communication",
                    "No private undermining",
                    "No forced closeness"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-foreground font-medium mt-4">
                  Alignment allows difference without division.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What Healthy Disagreement Looks Like</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">Disagreement is not dangerous when:</p>
                <ul className="space-y-2">
                  {[
                    "Boundaries remain intact",
                    "Undermining is avoided",
                    "Conversations stay adult-to-adult",
                    "The addicted person is not used as leverage"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-foreground font-medium mt-4">
                  Disagreement becomes harmful only when it weakens structure.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Signs Your Family System Is Vulnerable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Ask yourselves:</p>
              <ul className="space-y-3">
                {[
                  "Are boundaries enforced unevenly?",
                  "Are decisions driven by fear or guilt?",
                  "Do some members feel silenced \"for the sake of unity\"?",
                  "Do disagreements lead to secret exceptions?",
                  "Is addiction benefiting from confusion?"
                ].map((question, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold">{index + 1}</span>
                    <span className="text-foreground">{question}</span>
                  </li>
                ))}
              </ul>
              <p className="text-foreground font-medium mt-4 text-center">
                Honest answers reveal leverage points.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">How Families Move Toward Functional Alignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Clarify Non-Negotiables",
                  content: "Not everything must be agreed upon—only: Safety, Substance use boundaries, Treatment expectations, Consequence consistency"
                },
                {
                  step: 2,
                  title: "Allow Emotional Diversity",
                  content: "Families don't need the same feelings, the same pace, or the same level of contact. They need the same structure."
                },
                {
                  step: 3,
                  title: "Stop Forcing Unity",
                  content: "Forced unity creates rebellion or silence. Neither helps."
                },
                {
                  step: 4,
                  title: "Address Undermining Directly",
                  content: "Undermining destroys trust faster than disagreement."
                },
                {
                  step: 5,
                  title: "Accept Imperfect Alignment",
                  content: "Progress matters more than perfection."
                }
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">{item.step}</span>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.content}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">A Grounding Reframe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground">
                Unity that hides truth <strong className="text-red-600 dark:text-red-400">weakens</strong> families.
              </p>
              <p className="text-foreground">
                Division that lacks structure <strong className="text-red-600 dark:text-red-400">weakens</strong> families.
              </p>
              <p className="text-xl font-semibold text-primary text-center mt-4">
                Alignment around health strengthens families—even when it is uncomfortable.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Reflection Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {[
                  "Where has unity silenced honesty in our family?",
                  "Where has disunity weakened boundaries?",
                  "What principles matter more than agreement?",
                  "Where are we afraid to be misaligned?",
                  "What would alignment look like right now?"
                ].map((question, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{index + 1}</span>
                    <span className="text-foreground">{question}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Final Thought</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Families do not fail because they disagree.
              </p>
              <p className="text-muted-foreground">They struggle when:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-center gap-2 text-foreground">
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  Unity replaces honesty
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  Division replaces structure
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Recovery does not require families to feel the same.
              </p>
              <p className="text-foreground font-medium">
                It requires them to hold the same lines.
              </p>
              <p className="text-primary font-semibold text-center mt-4">
                When alignment replaces forced unity or chaotic division, families regain clarity—and addiction loses leverage.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-slate-500/30 bg-slate-50/50 dark:bg-slate-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-600" />
                Suggested Companion Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Link to="/boundary-drift">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Boundary Drift: How Limits Slowly Erode
                  </Button>
                </Link>
                <Link to="/guilt-relief-resentment">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    The Guilt–Relief–Resentment Cycle
                  </Button>
                </Link>
                <Link to="/family-education">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Is This Help or Enabling? Decision Tree
                  </Button>
                </Link>
                <Link to="/parents-repairing-sibling-system">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Parents: Repairing the Sibling System
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/family-education">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Family Education
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
