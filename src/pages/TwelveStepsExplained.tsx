import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, CheckCircle, AlertCircle, Eye, Heart, Users, Scale, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

export default function TwelveStepsExplained() {
  return (
    <>
      <Helmet>
        <title>The 12 Steps Explained for Families | Sober Helpline</title>
        <meta name="description" content="Understanding what each of the 12 Steps is really doing and why it matters in recovery. A guide for families." />
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

            <div className="text-center mb-10">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">12</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                The 12 Steps Explained for Families
              </h1>
              <p className="text-xl text-muted-foreground">
                What Each Step Is Really Doing—and Why It Matters in Recovery
              </p>
            </div>

            {/* Why Families Need This Guide */}
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">Why Families Need This Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families often hear phrases like:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground italic list-disc">
                  <li>"They need to work the Steps."</li>
                  <li>"They haven't done a Fourth Step yet."</li>
                  <li>"They're not spiritually ready."</li>
                </ul>
                <p className="text-muted-foreground">Without context, the 12 Steps can feel:</p>
                <div className="flex flex-wrap gap-2">
                  {["Vague", "Religious", "Outdated", "Confusing", "Irrelevant to a medical condition"].map((word) => (
                    <span key={word} className="px-3 py-1 bg-muted rounded-full text-sm">{word}</span>
                  ))}
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                  <p className="text-muted-foreground">
                    In reality, the Steps form a structured process for <strong>behavioral change</strong>, <strong>emotional regulation</strong>, <strong>accountability</strong>, and <strong>identity repair</strong>.
                  </p>
                  <p className="font-medium text-foreground mt-2">
                    The Steps are not about belief.<br />
                    They are about <span className="text-primary">transformation</span>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Foundational Clarification */}
            <Card className="mb-8 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-amber-700 dark:text-amber-400">A Foundational Clarification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-2">The 12 Steps are NOT:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• A cure</li>
                      <li>• Therapy</li>
                      <li>• Religious indoctrination</li>
                      <li>• A quick fix</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">They ARE:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• A framework for sustained change</li>
                      <li>• A method for rebuilding integrity</li>
                      <li>• A daily practice, not a one-time achievement</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 1 */}
            <Card className="mb-6 border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">1</span>
                  <CardTitle className="text-lg">Step 1</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-2 border-muted pl-4">
                  "We admitted we were powerless over alcohol/addiction—that our lives had become unmanageable."
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                  <p className="font-medium text-blue-700 dark:text-blue-400">Purpose: Break denial and false control.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">What This Step Actually Does:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Interrupts the belief "I can manage this"</li>
                    <li>Reduces internal conflict</li>
                    <li>Lowers stress caused by constant self-control attempts</li>
                    <li>Creates honesty with reality</li>
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">What Families Often Misunderstand:</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Powerlessness does not mean helplessness. It means accepting limits so change can begin.
                  </p>
                </div>
                <p className="text-sm italic text-primary">
                  Recovery cannot start while someone believes they are the exception.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="mb-6 border-l-4 border-l-teal-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">2</span>
                  <CardTitle className="text-lg">Step 2</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-2 border-muted pl-4">
                  "Came to believe that a Power greater than ourselves could restore us to sanity."
                </p>
                <div className="bg-teal-50 dark:bg-teal-950/30 p-3 rounded-lg">
                  <p className="font-medium text-teal-700 dark:text-teal-400">Purpose: Introduce hope without ego.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">What This Step Actually Does:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Reduces isolation</li>
                    <li>Shifts reliance away from self alone</li>
                    <li>Allows the nervous system to stand down</li>
                    <li>Opens the possibility of help</li>
                  </ul>
                </div>
                <div className="bg-violet-50 dark:bg-violet-950/30 p-3 rounded-lg border border-violet-200 dark:border-violet-800">
                  <p className="text-sm font-medium text-violet-700 dark:text-violet-400">For Non-Religious Individuals:</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    A "Higher Power" can be: The recovery group, Reality, Nature, Values, A principle of honesty
                  </p>
                </div>
                <p className="text-sm italic text-primary">
                  Addiction thrives in isolation. Recovery requires connection.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="mb-6 border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">3</span>
                  <CardTitle className="text-lg">Step 3</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-2 border-muted pl-4">
                  "Made a decision to turn our will and our lives over to the care of God as we understood Him."
                </p>
                <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                  <p className="font-medium text-purple-700 dark:text-purple-400">Purpose: Move from control to commitment.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">What This Step Actually Does:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Ends bargaining with addiction</li>
                    <li>Creates alignment between values and behavior</li>
                    <li>Reduces decision fatigue</li>
                    <li>Encourages follow-through</li>
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">What Families Often Fear:</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    "That they'll stop taking responsibility."
                  </p>
                  <p className="text-sm text-foreground mt-1">
                    <strong>Reality:</strong> This Step <em>increases</em> responsibility by ending self-deception.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="mb-6 border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold">4</span>
                  <CardTitle className="text-lg">Step 4</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-2 border-muted pl-4">
                  "Made a searching and fearless moral inventory of ourselves."
                </p>
                <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
                  <p className="font-medium text-orange-700 dark:text-orange-400">Purpose: Increase self-awareness without shame.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">What This Step Actually Does:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Identifies patterns, not just incidents</li>
                    <li>Builds insight into behavior</li>
                    <li>Separates guilt from responsibility</li>
                    <li>Prepares for lasting change</li>
                  </ul>
                </div>
                <p className="text-sm italic text-primary">
                  You can't change patterns you refuse to see.
                </p>
              </CardContent>
            </Card>

            {/* Step 5 */}
            <Card className="mb-6 border-l-4 border-l-rose-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold">5</span>
                  <CardTitle className="text-lg">Step 5</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-2 border-muted pl-4">
                  "Admitted to God, to ourselves, and to another human being the exact nature of our wrongs."
                </p>
                <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg">
                  <p className="font-medium text-rose-700 dark:text-rose-400">Purpose: Reduce shame and secrecy.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">What This Step Actually Does:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Interrupts isolation</li>
                    <li>Integrates emotion and memory</li>
                    <li>Builds accountability</li>
                    <li>Restores honesty</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">For Families:</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This is often the first time real truth replaces defensiveness.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 6 */}
            <Card className="mb-6 border-l-4 border-l-cyan-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold">6</span>
                  <CardTitle className="text-lg">Step 6</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-2 border-muted pl-4">
                  "Were entirely ready to have these defects of character removed."
                </p>
                <div className="bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-lg">
                  <p className="font-medium text-cyan-700 dark:text-cyan-400">Purpose: Build willingness—not perfection.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">What This Step Actually Does:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Softens rigidity</li>
                    <li>Increases openness to change</li>
                    <li>Reduces self-justification</li>
                  </ul>
                </div>
                <p className="text-sm italic text-primary">
                  Readiness is more important than readiness looking good.
                </p>
              </CardContent>
            </Card>

            {/* Step 7 */}
            <Card className="mb-6 border-l-4 border-l-indigo-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">7</span>
                  <CardTitle className="text-lg">Step 7</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-2 border-muted pl-4">
                  "Humbly asked Him to remove our shortcomings."
                </p>
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg">
                  <p className="font-medium text-indigo-700 dark:text-indigo-400">Purpose: Replace ego with humility.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">What This Step Actually Does:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Reduces defensiveness</li>
                    <li>Encourages growth over pride</li>
                    <li>Supports emotional regulation</li>
                    <li>Reinforces teachability</li>
                  </ul>
                </div>
                <p className="text-sm italic text-primary">
                  Ego-driven recovery collapses under stress.
                </p>
              </CardContent>
            </Card>

            {/* Step 8 */}
            <Card className="mb-6 border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">8</span>
                  <CardTitle className="text-lg">Step 8</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-2 border-muted pl-4">
                  "Made a list of all persons we had harmed, and became willing to make amends to them all."
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                  <p className="font-medium text-amber-700 dark:text-amber-400">Purpose: Restore moral awareness.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">What This Step Actually Does:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Builds empathy</li>
                    <li>Clarifies impact</li>
                    <li>Ends victim-based thinking</li>
                    <li>Prepares for repair</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Important for Families:</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This step is about willingness, not immediate action.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 9 */}
            <Card className="mb-6 border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">9</span>
                  <CardTitle className="text-lg">Step 9</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-2 border-muted pl-4">
                  "Made direct amends wherever possible, except when to do so would injure them or others."
                </p>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">Purpose: Repair trust through action.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">What This Step Actually Does:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Rebuilds integrity</li>
                    <li>Restores credibility</li>
                    <li>Demonstrates responsibility</li>
                    <li>Separates words from action</li>
                  </ul>
                </div>
                <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-200 dark:border-rose-800">
                  <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Critical Clarification:</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Amends are not apologies. They are <strong>behavioral change over time</strong>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 10 */}
            <Card className="mb-6 border-l-4 border-l-violet-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 flex items-center justify-center font-bold">10</span>
                  <CardTitle className="text-lg">Step 10</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-2 border-muted pl-4">
                  "Continued to take personal inventory and when we were wrong promptly admitted it."
                </p>
                <div className="bg-violet-50 dark:bg-violet-950/30 p-3 rounded-lg">
                  <p className="font-medium text-violet-700 dark:text-violet-400">Purpose: Prevent relapse through awareness.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">What This Step Actually Does:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Interrupts old patterns early</li>
                    <li>Builds accountability</li>
                    <li>Reduces defensiveness</li>
                    <li>Supports emotional maturity</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">For Families:</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This is where long-term trust begins to rebuild.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 11 */}
            <Card className="mb-6 border-l-4 border-l-sky-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">11</span>
                  <CardTitle className="text-lg">Step 11</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-2 border-muted pl-4">
                  "Sought through prayer and meditation to improve our conscious contact…"
                </p>
                <div className="bg-sky-50 dark:bg-sky-950/30 p-3 rounded-lg">
                  <p className="font-medium text-sky-700 dark:text-sky-400">Purpose: Maintain emotional and spiritual regulation.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">What This Step Actually Does:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Calms the nervous system</li>
                    <li>Builds emotional tolerance</li>
                    <li>Supports intentional living</li>
                    <li>Reduces impulsivity</li>
                  </ul>
                </div>
                <div className="bg-violet-50 dark:bg-violet-950/30 p-3 rounded-lg border border-violet-200 dark:border-violet-800">
                  <p className="text-sm font-medium text-violet-700 dark:text-violet-400">Non-Religious Framing:</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mindfulness, reflection, meditation, stillness.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 12 */}
            <Card className="mb-8 border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">12</span>
                  <CardTitle className="text-lg">Step 12</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-2 border-muted pl-4">
                  "Having had a spiritual awakening… we tried to carry this message to others and practice these principles in all our affairs."
                </p>
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="font-medium text-primary">Purpose: Sustain recovery through meaning.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">What This Step Actually Does:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Reinforces identity beyond addiction</li>
                    <li>Strengthens accountability</li>
                    <li>Creates purpose</li>
                    <li>Builds long-term resilience</li>
                  </ul>
                </div>
                <p className="text-sm italic text-primary">
                  Helping others strengthens recovery—it's not altruism alone.
                </p>
              </CardContent>
            </Card>

            {/* What Families Should Watch For */}
            <Card className="mb-8 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  What Families Should Watch For (Not Just Listen To)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Healthy Step work shows up as:</p>
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {[
                    "Consistent behavior",
                    "Increased accountability",
                    "Emotional regulation",
                    "Willingness to hear feedback",
                    "Respect for boundaries"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mb-3">NOT:</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Perfect language",
                    "Spiritual talk without action",
                    "Emotional intensity without change"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Critical Reframe for Families */}
            <Card className="mb-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/30">
              <CardHeader>
                <CardTitle className="text-xl text-primary">A Critical Reframe for Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-center">
                  The Steps are not about becoming <strong>perfect</strong>.<br />
                  They are about becoming <strong>honest, accountable, and connected</strong>.
                </p>
                <p className="text-center text-muted-foreground">
                  Progress is uneven—but the <em>direction</em> matters.
                </p>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 bg-logo-green/5 border-logo-green/30">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">Final Thought</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The 12 Steps are not outdated.<br />
                  They are a practical framework for changing how a person relates to <strong>reality</strong>, <strong>responsibility</strong>, and <strong>meaning</strong>.
                </p>
                <p className="text-muted-foreground">
                  When families understand the purpose behind each Step, they stop asking:
                </p>
                <p className="text-lg font-medium text-center text-muted-foreground italic">
                  "Is this working?"
                </p>
                <p className="text-muted-foreground text-center">and start asking:</p>
                <p className="text-lg font-medium text-center text-logo-green">
                  "Is there consistent movement toward honesty, responsibility, and connection?"
                </p>
                <p className="text-center font-semibold text-foreground mt-4">
                  That perspective changes everything.
                </p>
              </CardContent>
            </Card>

            {/* Suggested Companion Resources */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/brain-spiritual-recovery">
                    <Button variant="outline" size="sm">Addiction & Neuroscience Guide</Button>
                  </Link>
                  <Link to="/disease-choice-reality-map">
                    <Button variant="outline" size="sm">Disease vs. Choice Reality Map</Button>
                  </Link>
                  <Link to="/insight-behavior-tracker">
                    <Button variant="outline" size="sm">Insight vs. Behavior Tracker</Button>
                  </Link>
                  <Link to="/why-willpower-fails">
                    <Button variant="outline" size="sm">Why Willpower Fails Guide</Button>
                  </Link>
                  <Link to="/living-well-regardless">
                    <Button variant="outline" size="sm">Living Well Regardless of Outcome</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link to="/family-education">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
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
