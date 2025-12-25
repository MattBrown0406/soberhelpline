import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, Heart, Sun, CheckCircle, XCircle, Shield, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

export default function LivingWellRegardless() {
  useGuideTracking("/living-well-regardless", "Living Well Regardless of Outcome");
  return (
    <>
      <Helmet>
        <title>Living Well Regardless of Outcome | Sober Helpline</title>
        <meta name="description" content="How families reclaim their lives without giving up hope. Learn to live fully while caring deeply, regardless of your loved one's recovery outcome." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur">
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

        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/family-education"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Family Education
            </Link>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Sun className="h-10 w-10 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green">
                  Living Well Regardless of Outcome
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                How Families Reclaim Their Lives Without Giving Up Hope
              </p>
            </div>

            {/* Why This Guide Matters */}
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Why This Guide Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Many families live with a quiet, painful belief:
                </p>
                <div className="bg-background p-4 rounded-lg border-l-4 border-muted">
                  <p className="text-lg italic text-muted-foreground">
                    "Once they get better, we can live again."
                  </p>
                </div>
                <p className="text-muted-foreground">This belief keeps families:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• On hold</li>
                  <li>• In chronic vigilance</li>
                  <li>• Afraid to rest</li>
                  <li>• Afraid to plan</li>
                  <li>• Afraid to feel joy</li>
                </ul>
                <p className="text-muted-foreground">
                  When outcomes are uncertain, families often feel they must choose between:
                </p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Hope <strong>or</strong></li>
                  <li>• Self-preservation</li>
                </ul>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 mt-4">
                  <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                    This guide exists to offer a third path.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    You can care deeply—and still live fully—regardless of outcome.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* A Critical Reframe */}
            <Card className="mb-8 border-2 border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl text-primary">A Critical Reframe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-medium">
                  Living well is not a betrayal of someone who is struggling.<br />
                  It is a requirement for survival.
                </p>
                <p className="text-muted-foreground mt-4">You are not required to:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Put your life on pause
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Suffer to prove love
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Be miserable to stay loyal
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Wait for permission to heal
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* The Myth That Keeps Families Stuck */}
            <Card className="mb-8 border-amber-500/50 bg-amber-50/30 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-xl text-amber-700 dark:text-amber-400">The Myth That Keeps Families Stuck</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="font-semibold text-red-700 dark:text-red-400">Myth:</p>
                  <p className="text-muted-foreground italic">
                    "If I'm okay, it means I don't care enough."
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">Reality:</p>
                  <p className="text-muted-foreground">
                    If your life collapses, it does not help your loved one recover.<br />
                    It only multiplies harm.
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg border-l-4 border-amber-500 mt-4">
                  <p className="font-medium">Your suffering is not currency.</p>
                </div>
              </CardContent>
            </Card>

            {/* What Living Well Does Not Mean */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">What "Living Well" Does Not Mean</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3">Living well does NOT mean:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Giving up on someone
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Detaching emotionally
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Withdrawing love
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Becoming indifferent
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Denying reality
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3">It DOES mean:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Choosing health over chaos
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Choosing clarity over panic
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Choosing sustainability over sacrifice
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What Changes When Families Stop Waiting */}
            <h2 className="text-2xl font-bold text-logo-green mb-6">What Changes When Families Stop Waiting</h2>

            <Card className="mb-6">
              <CardHeader className="bg-blue-50 dark:bg-blue-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-blue-700 dark:text-blue-400">
                  1. The Nervous System Settles
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">When families stop living in anticipation of crisis:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    Anxiety decreases
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    Sleep improves
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    Reactivity softens
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    Decision-making becomes clearer
                  </li>
                </ul>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="font-medium text-blue-700 dark:text-blue-400">
                    Stability becomes internal—not conditional.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="bg-purple-50 dark:bg-purple-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-purple-700 dark:text-purple-400">
                  2. Boundaries Become Natural
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">When families value their own lives:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    Boundaries feel less cruel
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    Consistency improves
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    Guilt loses leverage
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    Resentment decreases
                  </li>
                </ul>
                <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border-l-4 border-purple-500">
                  <p className="font-medium text-purple-700 dark:text-purple-400">
                    Boundaries stop being a tactic—and become a way of life.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="bg-orange-50 dark:bg-orange-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-orange-700 dark:text-orange-400">
                  3. The System Rebalances
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">Addiction thrives in systems where:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Everyone is reactive</li>
                  <li>• Emotions run high</li>
                  <li>• Outcomes are chased</li>
                </ul>
                <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border-l-4 border-orange-500">
                  <p className="font-medium text-orange-700 dark:text-orange-400">
                    Living well removes fuel from chaos.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">
                  4. Hope Becomes Grounded
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">Hope shifts from:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-muted-foreground italic">"They must change"</p>
                  </div>
                  <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-center">
                    <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                      "I can survive and thrive regardless"
                    </p>
                  </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border-l-4 border-emerald-500 mt-4">
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">
                    This is not despair. It is resilient hope.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* The Fear Beneath Resistance */}
            <Card className="mb-8 border-rose-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-rose-700 dark:text-rose-400">The Fear Beneath Resistance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families often resist this idea because they fear:</p>
                <ul className="space-y-2 ml-6 text-muted-foreground">
                  <li className="italic">"What if they give up?"</li>
                  <li className="italic">"What if this sends the wrong message?"</li>
                  <li className="italic">"What if I regret this later?"</li>
                  <li className="italic">"What if this means it's over?"</li>
                </ul>
                <div className="bg-background p-4 rounded-lg border-l-4 border-rose-500 mt-4">
                  <p className="font-medium">
                    Living well does not end connection.<br />
                    It ends self-erasure.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Living Well Is Not Passive */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Living Well Is Not Passive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Living well includes:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Clear boundaries
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Honest communication
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Reduced enabling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Consistent self-care
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Continued advocacy when appropriate
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4 font-medium">
                  It is active, intentional, and values-based.
                </p>
              </CardContent>
            </Card>

            {/* What You Can Control */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">What You Can Control (And What You Cannot)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3">You CAN control:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        How you live
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        How you respond
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        What you tolerate
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        How you care for yourself
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Whether you stay grounded
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">You CANNOT control:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-slate-400" />
                        Someone else's recovery
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-slate-400" />
                        Their insight
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-slate-400" />
                        Their timeline
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-slate-400" />
                        Their choices
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary mt-6">
                  <p className="font-medium">Peace comes from honoring this distinction.</p>
                </div>
              </CardContent>
            </Card>

            {/* Grief Is Part of Living Well */}
            <Card className="mb-8 border-slate-300 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-slate-700 dark:text-slate-300">Grief Is Part of Living Well</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Living well does not bypass grief.</p>
                <p className="text-muted-foreground">Families may grieve:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• The loss of the future they imagined</li>
                  <li>• The version of the person they remember</li>
                  <li>• The simplicity they once had</li>
                </ul>
                <div className="bg-background p-4 rounded-lg border-l-4 border-slate-400 mt-4">
                  <p className="font-medium">
                    Grief does not mean failure.<br />
                    It means you are facing reality with honesty.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What Living Well Looks Like in Practice */}
            <Card className="mb-8 border-2 border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  What Living Well Looks Like in Practice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Making plans without waiting for certainty
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Enjoying moments without apology
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Investing in relationships that nourish you
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Pursuing goals unrelated to addiction
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Creating routines that support your health
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Allowing joy—even when sadness exists
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4 font-medium italic">
                  Both can coexist.
                </p>
              </CardContent>
            </Card>

            {/* A Grounding Reframe */}
            <Card className="mb-8 border-2 border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl text-primary">A Grounding Reframe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-medium">
                  You are allowed to build a meaningful life—even if the outcome remains unknown.
                </p>
                <div className="bg-background p-4 rounded-lg border-l-4 border-primary">
                  <p className="font-medium">
                    This is not giving up.<br />
                    This is growing up to reality.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reflection Questions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Reflection Questions for Families
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                  <li>What have we put on hold waiting for change?</li>
                  <li>What does "living well" mean for us right now—not someday?</li>
                  <li>What guilt do we need to question?</li>
                  <li>What would stability look like regardless of outcome?</li>
                  <li>What is one small step toward reclaiming life this month?</li>
                </ol>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-300 dark:border-emerald-700">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-700 dark:text-emerald-300">Final Thought</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Families often believe they must wait for recovery to reclaim themselves.
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                  That belief keeps them stuck.
                </p>
                <p className="text-muted-foreground">
                  Living well is not the reward for recovery.<br />
                  It is the foundation—whether recovery comes or not.
                </p>
                <div className="p-4 bg-background rounded-lg border-l-4 border-emerald-500">
                  <p className="font-medium text-foreground mb-2">When families reclaim their lives:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• They regain dignity</li>
                    <li>• They regain clarity</li>
                    <li>• They regain peace</li>
                    <li>• They regain strength</li>
                  </ul>
                  <p className="text-emerald-700 dark:text-emerald-400 mt-3 font-medium">
                    And sometimes—unexpectedly—that change becomes the most powerful influence of all.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Suggested Companion Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/what-changes-when-families-change">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      What Changes When Families Change
                    </Button>
                  </Link>
                  <Link to="/values-aligned-decisions">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Values-Aligned Decision Making Exercise
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Self-Care vs. Self-Abandonment Audit
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Family Trauma & Hypervigilance Self-Assessment
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      What I Can Control Today (Guided Meditation)
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
          </div>
        </main>
      </div>
    </>
  );
}
