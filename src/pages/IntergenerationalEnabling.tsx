import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, Users, ArrowRight, AlertTriangle, CheckCircle, Heart, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

export default function IntergenerationalEnabling() {
  useGuideTracking("Intergenerational Enabling", "/intergenerational-enabling");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Breaking Intergenerational Enabling | Sober Helpline</title>
        <meta name="description" content="Learn how enabling patterns get passed down through generations and how families can choose something different to break the cycle." />
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
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Breaking Intergenerational Enabling</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              How Patterns Get Passed Down—and How Families Choose Something Different
            </p>
          </div>

          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Why This Guide Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Many families affected by addiction say:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground italic">
                <li>"This is just how our family is."</li>
                <li>"We've always taken care of our own."</li>
                <li>"You don't turn your back on family."</li>
                <li>"We survive no matter what."</li>
              </ul>
              <p className="text-muted-foreground">
                These beliefs often come from strength and loyalty.
              </p>
              <p className="text-muted-foreground">
                And yet, they can unintentionally <strong className="text-foreground">sustain addiction across generations</strong>.
              </p>
              <p className="text-foreground font-medium">
                Enabling is rarely taught explicitly. It is inherited quietly—through fear, loyalty, and love.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">What Intergenerational Enabling Actually Is</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Intergenerational enabling occurs when:</p>
              <ul className="space-y-3">
                {[
                  "One generation's survival strategies become the next generation's rules",
                  "Harmful patterns are normalized as \"love\"",
                  "Boundaries are framed as betrayal",
                  "Sacrifice is confused with responsibility",
                  "Consequences are consistently absorbed by the family"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-foreground font-medium mt-6 text-center p-4 rounded-lg bg-muted/50">
                What once protected the family can later trap it.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">How Enabling Gets Passed Down</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                  Through Family Beliefs
                </h4>
                <p className="text-muted-foreground mb-3">Common inherited beliefs include:</p>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    "\"Family comes before everything.\"",
                    "\"We don't abandon our own.\"",
                    "\"You help, no matter the cost.\"",
                    "\"Love means never giving up.\"",
                    "\"We handle problems privately.\""
                  ].map((belief, index) => (
                    <div key={index} className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50">
                      <span className="text-sm text-muted-foreground italic">{belief}</span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mt-3">
                  These beliefs are rarely examined. <strong className="text-foreground">They are assumed.</strong>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
                  Through Modeling
                </h4>
                <p className="text-muted-foreground mb-3">Children learn enabling by watching:</p>
                <ul className="space-y-2">
                  {[
                    "Parents rescue adults",
                    "Consequences being softened",
                    "Conflict being avoided",
                    "Boundaries being crossed \"for love\"",
                    "Silence being rewarded"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-foreground font-medium mt-3">
                  What children see repeated becomes normal.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
                  Through Fear and Trauma
                </h4>
                <p className="text-muted-foreground mb-3">Past generations may have experienced:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Poverty", "Violence", "Loss", "War", "Displacement", "Untreated mental illness"].map((item, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  These experiences teach: <em>"If we don't hold everyone together, everything falls apart."</em>
                </p>
                <p className="text-foreground font-medium mt-2">
                  That fear gets inherited—even when the danger is no longer present.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Why Intergenerational Enabling Feels So Right
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Breaking enabling often triggers:</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                {["Guilt", "Shame", "Fear of rejection", "Fear of being \"the bad one\"", "Fear of family fracture"].map((item, index) => (
                  <div key={index} className="p-2 rounded-lg bg-white/50 dark:bg-slate-900/50 text-center">
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground mb-3">Families may hear:</p>
              <div className="space-y-2 mb-4">
                {[
                  "\"That's not how we do things.\"",
                  "\"You're being selfish.\"",
                  "\"You've changed.\"",
                  "\"You think you're better than us.\""
                ].map((quote, index) => (
                  <div key={index} className="p-2 pl-4 border-l-2 border-amber-500/50 bg-white/30 dark:bg-slate-900/30">
                    <span className="text-sm text-muted-foreground italic">{quote}</span>
                  </div>
                ))}
              </div>
              <p className="text-foreground font-medium">
                These reactions are protective responses to change—not proof you're wrong.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-red-500/30 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-lg">The Cost of Not Breaking the Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">When enabling continues across generations:</p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Addiction repeats",
                  "Boundaries weaken",
                  "Burnout increases",
                  "Children learn self-abandonment",
                  "Resentment grows",
                  "Family relationships hollow out"
                ].map((cost, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-muted-foreground">{cost}</span>
                  </div>
                ))}
              </div>
              <p className="text-foreground font-medium mt-4 text-center">
                Love survives—but health does not.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                A Critical Reframe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground">
                Breaking intergenerational enabling is not rejecting your family.
              </p>
              <p className="text-xl font-semibold text-primary mt-2">
                It is honoring them by refusing to pass down harm.
              </p>
              <p className="text-muted-foreground mt-4">
                You are not betraying your lineage. <strong className="text-foreground">You are interrupting suffering.</strong>
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">How Families Begin Breaking the Cycle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">1</span>
                  Separate Values from Behaviors
                </h4>
                <p className="text-muted-foreground mb-3">Ask:</p>
                <ul className="space-y-2 mb-4">
                  <li className="text-foreground italic">"What value are we trying to honor?"</li>
                  <li className="text-foreground italic">"Is this behavior actually serving that value?"</li>
                </ul>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Example:</p>
                  <p className="text-foreground"><strong>Value:</strong> Loyalty</p>
                  <p className="text-foreground"><strong>Behavior:</strong> Covering consequences</p>
                  <p className="text-primary font-medium mt-2">Loyalty does not require enabling.</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">2</span>
                  Name the Pattern Without Blame
                </h4>
                <p className="text-muted-foreground mb-3">Language matters.</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/50">
                    <p className="text-xs text-red-600 dark:text-red-400 mb-1">Instead of:</p>
                    <p className="text-sm text-muted-foreground italic">"Our family is dysfunctional"</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/50">
                    <p className="text-xs text-green-600 dark:text-green-400 mb-1">Try:</p>
                    <p className="text-sm text-foreground italic">"This pattern helped us survive—but it's hurting us now."</p>
                  </div>
                </div>
                <p className="text-foreground font-medium mt-3">This creates dignity and choice.</p>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">3</span>
                  Expect Emotional Pushback
                </h4>
                <p className="text-muted-foreground mb-3">Breaking patterns often triggers:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Anger", "Guilt trips", "Fear-based reactions", "Accusations of abandonment"].map((item, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-amber-100/50 dark:bg-amber-950/30 text-sm text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-foreground font-medium">
                  These reactions do not mean the boundary is wrong. They mean the system is adjusting.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">4</span>
                  Hold Boundaries Calmly and Consistently
                </h4>
                <p className="text-muted-foreground mb-3">Intergenerational change requires:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {["Repetition", "Predictability", "Regulation", "Patience"].map((item, index) => (
                    <div key={index} className="p-2 rounded-lg bg-primary/10 text-center">
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground">Intensity recreates the pattern.</p>
                <p className="text-foreground font-medium">Consistency interrupts it.</p>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">5</span>
                  Protect the Next Generation
                </h4>
                <p className="text-muted-foreground mb-3">Ask:</p>
                <ul className="space-y-2 mb-3">
                  <li className="text-foreground italic">"What are children learning from this?"</li>
                  <li className="text-foreground italic">"What am I modeling as love?"</li>
                  <li className="text-foreground italic">"What will they normalize?"</li>
                </ul>
                <p className="text-foreground font-medium">Cycle-breaking is often about those watching.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                What Breaking the Cycle Looks Like (In Practice)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Saying no without over-explaining",
                  "Allowing consequences without rescuing",
                  "Choosing therapy or support",
                  "Speaking openly instead of hiding",
                  "Prioritizing stability over appearances",
                  "Letting adults be responsible for themselves"
                ].map((action, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-foreground">{action}</span>
                  </li>
                ))}
              </ul>
              <p className="text-foreground font-medium mt-4 text-center">
                These choices may feel uncomfortable—but they create freedom.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-violet-500/30 bg-violet-50/50 dark:bg-violet-950/20">
            <CardHeader>
              <CardTitle className="text-lg">For Families Feeling Divided</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Often, one person becomes the "cycle breaker."
              </p>
              <p className="text-muted-foreground mb-3">That person may feel:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Isolated", "Misunderstood", "Guilty", "Strong and lonely at the same time"].map((feeling, index) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-violet-100/50 dark:bg-violet-950/30 text-sm text-muted-foreground">
                    {feeling}
                  </span>
                ))}
              </div>
              <p className="text-foreground font-medium">
                This role is hard—and often necessary.
              </p>
              <p className="text-muted-foreground mt-4">Systems rarely change together.</p>
              <p className="text-primary font-semibold">They change because someone goes first.</p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Reflection Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {[
                  "What behaviors were normalized in my family growing up?",
                  "What did those behaviors protect us from?",
                  "What are they costing us now?",
                  "What value do I want to keep?",
                  "What behavior needs to change—even if it's uncomfortable?"
                ].map((question, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{index + 1}</span>
                    <span className="text-foreground">{question}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">A Grounding Reframe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground text-center">
                You are not responsible for preserving patterns that harm you—or others.
              </p>
              <p className="text-xl font-semibold text-primary mt-4 text-center">
                You can love your family and change the legacy.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Final Thought</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Intergenerational enabling survives on silence, guilt, and fear.
              </p>
              <p className="text-muted-foreground">It weakens when families:</p>
              <ul className="space-y-2 ml-4">
                {[
                  "Name reality",
                  "Choose clarity",
                  "Hold boundaries",
                  "Allow discomfort",
                  "Prioritize long-term health over short-term peace"
                ].map((action, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-foreground">{action}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-4">
                Breaking the cycle is not an act of rebellion.
              </p>
              <p className="text-foreground font-semibold">It is an act of responsibility.</p>
              <p className="text-primary font-semibold text-center mt-4">
                And it may be the most loving thing a family ever does.
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
                <Link to="/guilt-relief-resentment">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    The Guilt–Relief–Resentment Cycle
                  </Button>
                </Link>
                <Link to="/boundary-drift">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Boundary Drift: How Limits Slowly Erode
                  </Button>
                </Link>
                <Link to="/addiction-rewrites-family-rules">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    How Addiction Rewrites Family Rules
                  </Button>
                </Link>
                <Link to="/family-roles-addiction">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Family Roles in Addiction
                  </Button>
                </Link>
                <Link to="/living-well-regardless">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Living Well Regardless of Outcome
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
