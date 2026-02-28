import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, Filter, ArrowRight, CheckCircle, XCircle, Pause, AlertTriangle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

export default function WhoBenefitsFilter() {
  useGuideTracking("/who-benefits-filter", "The Who Benefits Filter");
  const handlePrint = () => {
    window.print();
  };

  const scenarios = [
    {
      title: 'Scenario 1: "Can you help me just this once?"',
      shortTerm: ["Reduces conflict", "Eases guilt", "Prevents distress"],
      longTerm: ["Reinforces negotiation", "Weakens boundaries", "Delays change"],
      decision: "Pause. Do not act.",
      decisionType: "pause"
    },
    {
      title: 'Scenario 2: "If you don\'t help, I\'ll have nowhere to go."',
      shortTerm: ["Reduces fear", "Avoids imagined catastrophe"],
      longTerm: ["Shields consequences", "Increases dependence", "Reinforces avoidance of treatment"],
      decision: "Hold boundary. Offer treatment-based support only.",
      decisionType: "stop"
    },
    {
      title: 'Scenario 3: "They seem better—can we relax the rules?"',
      shortTerm: ["Hope", "Relief", "Reduced tension"],
      longTerm: ["Boundary drift", "Instability", "Increased relapse risk"],
      decision: "Maintain structure.",
      decisionType: "stop"
    }
  ];

  return (
    <>
      <Helmet>
        <title>"Who Benefits From This?" Decision Filter | Sober Helpline</title>
        <meta name="description" content="A simple question that prevents enabling before it starts. Learn how to pause and evaluate who truly benefits from your decisions." />
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

          <ToolBrandHeader
            title='"Who Benefits From This?" Decision Filter'
            subtitle="A simple question that prevents enabling before it starts. Before acting, pause and ask: who does this really serve?"
            clinicalNote="Based on CRAFT decision-making frameworks and Al-Anon's emphasis on examining motives before taking action."
          />

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Filter className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">"Who Benefits From This?" Decision Filter</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              A Simple Question That Prevents Enabling Before It Starts
            </p>
          </div>

          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Why This Tool Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Families often know <em>after the fact</em> that a decision was not helpful—but in the moment:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["Guilt is loud", "Fear feels urgent", "Anger clouds judgment", "Relief feels necessary"].map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 text-center">
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-foreground font-medium">
                This tool inserts one stabilizing pause before action.
              </p>
              <p className="text-muted-foreground">
                If families ask the right question early, they prevent months—or years—of damage later.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-xl text-center">The Core Question</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center mb-4">
                Before responding to any request, crisis, or emotional appeal, ask:
              </p>
              <div className="p-6 rounded-lg bg-white/50 dark:bg-slate-900/50 border-2 border-amber-500/50 text-center mb-6">
                <p className="text-2xl font-bold text-foreground">
                  "Who benefits from this—short term and long term?"
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/50">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span className="text-foreground">"Mostly the addiction" → <strong>Stop</strong></span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50">
                  <Pause className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <span className="text-foreground">"Mostly my discomfort relief" → <strong>Pause</strong></span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/50">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-foreground">"Long-term safety and health" → <strong>Proceed</strong></span>
                </div>
              </div>
              <p className="text-foreground font-medium text-center mt-6">
                This question cuts through confusion faster than any argument.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">How the Filter Works</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This is not a moral test. It is a <strong className="text-foreground">systems check</strong>.
              </p>
              <p className="text-muted-foreground mb-4">The filter separates:</p>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { left: "Relief", right: "Recovery" },
                  { left: "Comfort", right: "Change" },
                  { left: "Reaction", right: "Decision" }
                ].map((pair, index) => (
                  <div key={index} className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">{pair.left}</span>
                    <span className="text-primary font-bold">vs.</span>
                    <span className="text-foreground font-medium">{pair.right}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-lg">Step-by-Step Use (In Under 60 Seconds)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">1</span>
                  Name the Action
                </h4>
                <p className="text-foreground italic mb-3">"What am I about to do?"</p>
                <div className="flex flex-wrap gap-2">
                  {["Give money", "Relax a boundary", "Make an exception", "Step in to fix", "Provide housing", "Intervene emotionally"].map((action, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-white/50 dark:bg-slate-900/50 text-sm text-muted-foreground">
                      {action}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">2</span>
                  Ask the Question
                </h4>
                <p className="text-xl font-medium text-foreground">"Who benefits from this?"</p>
                <p className="text-muted-foreground mt-2">Be specific—not idealistic.</p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">3</span>
                  Sort the Answers
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/50">
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-3">A. Short-Term Beneficiaries</p>
                    <ul className="space-y-1">
                      {["The addicted person's discomfort", "My anxiety", "The family's peace", "Avoided conflict", "Temporary calm"].map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/50">
                    <p className="font-semibold text-green-700 dark:text-green-400 mb-3">B. Long-Term Beneficiaries</p>
                    <ul className="space-y-1">
                      {["Safety", "Accountability", "Treatment engagement", "Family stability", "Self-respect", "Recovery conditions"].map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">4</span>
                  Decide Based on Long-Term Benefit
                </h4>
                <p className="text-foreground">
                  If long-term benefit is unclear or absent—<strong>do not act yet</strong>.
                </p>
                <p className="text-primary font-medium mt-2">Delay is a decision.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Common Scenarios (Applied Examples)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {scenarios.map((scenario, index) => (
                <div key={index} className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 p-4 border-b border-border">
                    <h4 className="font-semibold text-foreground">{scenario.title}</h4>
                  </div>
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                    <div className="p-4">
                      <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">Short-Term Benefit</p>
                      <ul className="space-y-1">
                        {scenario.shortTerm.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">Long-Term Impact</p>
                      <ul className="space-y-1">
                        {scenario.longTerm.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className={`p-4 ${scenario.decisionType === 'stop' ? 'bg-red-50/50 dark:bg-red-950/20' : 'bg-amber-50/50 dark:bg-amber-950/20'}`}>
                    <p className="text-xs font-medium uppercase tracking-wide mb-1 text-muted-foreground">Decision</p>
                    <p className="font-semibold text-foreground">{scenario.decision}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  What the Filter Prevents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">This question interrupts:</p>
                <ul className="space-y-2">
                  {[
                    "Guilt-driven decisions",
                    "Anger-based reactions",
                    "Fear-based rescuing",
                    "Emotional bargaining",
                    "Boundary erosion"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-foreground font-medium mt-4">
                  It replaces emotion with orientation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What the Filter Does Not Do</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">This filter does not:</p>
                <ul className="space-y-2">
                  {[
                    "Remove compassion",
                    "Eliminate sadness",
                    "Make decisions painless",
                    "Guarantee outcomes"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-foreground font-medium mt-4">
                  It ensures decisions are aligned with health, not impulse.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">A Key Distinction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground">
                Feeling bad does not mean doing the wrong thing.
              </p>
              <p className="text-lg text-foreground mt-2">
                Feeling relief does not mean doing the right thing.
              </p>
              <p className="text-xl font-semibold text-primary mt-4 text-center">
                The filter keeps families grounded when emotions lie.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-violet-500/30 bg-violet-50/50 dark:bg-violet-950/20">
            <CardHeader>
              <CardTitle className="text-lg">When the Answer Is "Me"</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Sometimes the honest answer is:</p>
              <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-border mb-4">
                <p className="text-foreground italic text-center">"This benefits me emotionally."</p>
              </div>
              <p className="text-muted-foreground mb-2">
                That does not mean you are selfish.
              </p>
              <p className="text-foreground font-medium mb-4">It means pause.</p>
              <p className="text-muted-foreground mb-2">Ask:</p>
              <p className="text-foreground italic">
                "Is there another way to regulate my emotions without changing the boundary?"
              </p>
              <p className="text-primary font-medium mt-4">Self-regulation is not enabling.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Reflection Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Use the filter on a recent decision:</p>
              <ol className="space-y-3">
                {[
                  "What did I do?",
                  "Who benefited immediately?",
                  "Who paid the price later?",
                  "What would long-term benefit have required?",
                  "What will I do differently next time?"
                ].map((question, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{index + 1}</span>
                    <span className="text-foreground">{question}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-lg">A Grounding Reframe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground">
                If a choice benefits addiction more than recovery, it is not compassion—it is participation.
              </p>
              <p className="text-xl font-semibold text-primary mt-4 text-center">
                Compassion aligned with health may feel harder—but it lasts.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Final Thought</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Families do not need perfect judgment.
              </p>
              <p className="text-muted-foreground">
                They need one clear pause point that stops automatic rescue.
              </p>
              <p className="text-foreground font-medium">
                "Who benefits from this?" is not a cold question. It is a protective one.
              </p>
              <div className="p-4 rounded-lg bg-muted/50 text-center space-y-2">
                <p className="text-foreground">Use it early.</p>
                <p className="text-foreground">Use it often.</p>
                <p className="text-primary font-semibold">Let it guide—not shame—you.</p>
              </div>
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
                <Link to="/family-education">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Is This Help or Enabling? Decision Tree
                  </Button>
                </Link>
                <Link to="/enabling-language-translator">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Enabling Language Translator
                  </Button>
                </Link>
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
                <Link to="/anger-and-boundaries">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Anger and Boundaries Are Not the Same Thing
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
        
          <RelatedResources currentPath="/who-benefits-filter" />
</main>
      </div>
    </>
  );
}
