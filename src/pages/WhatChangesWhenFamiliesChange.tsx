import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, Heart, Shield, Brain, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

export default function WhatChangesWhenFamiliesChange() {
  return (
    <>
      <Helmet>
        <title>What Changes When Families Change | Sober Helpline</title>
        <meta name="description" content="Learn how family change creates system change—even if the addicted person doesn't change immediately. A guide for families impacted by addiction." />
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
                <RefreshCw className="h-10 w-10 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green">
                  What Changes When Families Change
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Even If the Addicted Person Doesn't
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
                  Families often believe—implicitly or explicitly:
                </p>
                <div className="bg-background p-4 rounded-lg border-l-4 border-muted">
                  <p className="text-lg italic text-muted-foreground">
                    "If they don't get sober, nothing improves."
                  </p>
                </div>
                <p className="text-muted-foreground">This belief keeps families frozen:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Waiting</li>
                  <li>• Reacting</li>
                  <li>• Sacrificing their own stability</li>
                  <li>• Measuring success only by outcomes they can't control</li>
                </ul>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                    The truth is more hopeful—and more grounded.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    When families change, the entire system changes—even if the addicted person resists at first.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Critical Starting Point */}
            <Card className="mb-8 border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-xl text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  A Critical Starting Point
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Families cannot control whether someone recovers.<br />
                  They <strong>can</strong> control whether addiction controls everyone.
                </p>
                <div className="bg-background p-4 rounded-lg border-l-4 border-amber-500">
                  <p className="text-lg font-medium">
                    Family change is not a consolation prize.<br />
                    It is a primary intervention.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What Actually Changes */}
            <h2 className="text-2xl font-bold text-logo-green mb-6">What Actually Changes When Families Change</h2>

            {/* 1. Chaos Decreases */}
            <Card className="mb-6">
              <CardHeader className="bg-blue-50 dark:bg-blue-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-blue-700 dark:text-blue-400">
                  1. Chaos Decreases
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">When families:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Stop reacting emotionally</li>
                  <li>• Set predictable boundaries</li>
                  <li>• Reduce crisis-driven decisions</li>
                </ul>
                <p className="text-muted-foreground">
                  The environment becomes calmer—even if substance use continues.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="font-medium text-blue-700 dark:text-blue-400">
                    Chaos feeds addiction.<br />
                    Stability disrupts it.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2. The Addicted Person Loses a Cushion */}
            <Card className="mb-6">
              <CardHeader className="bg-orange-50 dark:bg-orange-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-orange-700 dark:text-orange-400">
                  2. The Addicted Person Loses a Cushion
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">When families stop:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Absorbing consequences</li>
                  <li>• Fixing fallout</li>
                  <li>• Providing constant rescue</li>
                </ul>
                <p className="text-muted-foreground">
                  Reality becomes harder to avoid.
                </p>
                <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border-l-4 border-orange-500">
                  <p className="font-medium text-orange-700 dark:text-orange-400">
                    This is not punishment.<br />
                    It is accurate feedback.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 3. Family Health Improves Immediately */}
            <Card className="mb-6">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">
                  3. Family Health Improves Immediately
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">Families often notice:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Better sleep
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Reduced anxiety
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Less hypervigilance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    More emotional space
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Clearer thinking
                  </li>
                </ul>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border-l-4 border-emerald-500">
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">
                    This improvement does not depend on sobriety.<br />
                    It depends on boundaries and self-regulation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 4. Decision-Making Becomes Clearer */}
            <Card className="mb-6">
              <CardHeader className="bg-purple-50 dark:bg-purple-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-purple-700 dark:text-purple-400">
                  4. Decision-Making Becomes Clearer
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">Without constant crisis:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Decisions are less reactive</li>
                  <li>• Guilt loses its grip</li>
                  <li>• Boundaries become sustainable</li>
                  <li>• Fear-based choices decrease</li>
                </ul>
                <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border-l-4 border-purple-500">
                  <p className="font-medium text-purple-700 dark:text-purple-400">
                    Clarity replaces urgency.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 5. The Emotional System Rebalances */}
            <Card className="mb-6">
              <CardHeader className="bg-rose-50 dark:bg-rose-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-rose-700 dark:text-rose-400">
                  5. The Emotional System Rebalances
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">Addiction often pulls families into:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Over-functioning</li>
                  <li>• Monitoring</li>
                  <li>• Managing</li>
                  <li>• Emotional extremes</li>
                </ul>
                <p className="text-muted-foreground mt-4">When families step back:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-rose-500" />
                    Emotional intensity decreases
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-rose-500" />
                    Power struggles soften
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-rose-500" />
                    Conversations become simpler
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-rose-500" />
                    Drama loses fuel
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* 6. The Addicted Person's Options Narrow */}
            <Card className="mb-6">
              <CardHeader className="bg-slate-100 dark:bg-slate-800/50 rounded-t-lg">
                <CardTitle className="text-lg text-slate-700 dark:text-slate-300">
                  6. The Addicted Person's Options Narrow
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">Without family interference:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Avoidance is harder</li>
                  <li>• Manipulation has less effect</li>
                  <li>• Excuses don't land the same way</li>
                </ul>
                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg border-l-4 border-slate-500">
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    The person is not being forced to change—<br />
                    they are no longer being protected from reality.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 7. Trust Becomes Behavioral */}
            <Card className="mb-8">
              <CardHeader className="bg-teal-50 dark:bg-teal-950/30 rounded-t-lg">
                <CardTitle className="text-lg text-teal-700 dark:text-teal-400">
                  7. Trust Becomes Behavioral, Not Emotional
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Families Stop:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Trusting words
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Chasing insight
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Negotiating promises
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200 dark:border-teal-800">
                    <h4 className="font-semibold text-teal-700 dark:text-teal-400 mb-2">They Begin:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500" />
                        Watching patterns
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500" />
                        Responding to behavior
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500" />
                        Releasing false hope
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-muted-foreground mt-4">
                  This reduces disappointment and resentment.
                </p>
              </CardContent>
            </Card>

            {/* What Does Not Change Automatically */}
            <Card className="mb-8 border-amber-500/50 bg-amber-50/30 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-xl text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  What Does Not Change Automatically
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">It's important to be honest.</p>
                <p className="text-muted-foreground">Family change does not guarantee:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-amber-500" />
                    Sobriety
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-amber-500" />
                    Insight
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-amber-500" />
                    Gratitude
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-amber-500" />
                    Immediate improvement
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4">What it <strong>guarantees</strong> is:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Reduced harm
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Increased clarity
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Restored dignity
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Sustainable functioning
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Why Family Change Feels Worse */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">Why Family Change Often Feels Worse Before It Feels Better</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families may experience:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• Pushback</li>
                  <li>• Anger</li>
                  <li>• Guilt</li>
                  <li>• Accusations</li>
                  <li>• Temporary escalation</li>
                </ul>
                <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                  <p className="font-medium">
                    This does not mean you're doing it wrong.<br />
                    It means the system is adjusting.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* The Most Common Fear */}
            <Card className="mb-8 border-red-500/30 bg-red-50/30 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-xl text-red-700 dark:text-red-400">The Most Common Fear</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background p-4 rounded-lg border-l-4 border-red-500">
                  <p className="text-lg italic text-muted-foreground">
                    "If we stop doing what we're doing, everything will fall apart."
                  </p>
                </div>
                <p className="text-muted-foreground">Often, the opposite is true.</p>
                <p className="text-muted-foreground">What falls apart is:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground">
                  <li>• The illusion of control</li>
                  <li>• The buffering</li>
                  <li>• The enabling patterns</li>
                </ul>
                <p className="text-muted-foreground mt-4 font-medium">
                  What remains is reality—and possibility.
                </p>
              </CardContent>
            </Card>

            {/* A Necessary Reframe */}
            <Card className="mb-8 border-2 border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl text-primary">A Necessary Reframe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  Family change is not abandoning someone.<br />
                  It is refusing to abandon yourself.
                </p>
                <div className="bg-background p-4 rounded-lg border-l-4 border-primary">
                  <p className="font-medium">
                    Recovery cannot grow in chaos.<br />
                    Family stability creates the conditions where change becomes possible—even if delayed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What Family Change Looks Like */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">What Family Change Looks Like in Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Clear, consistent boundaries
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Fewer explanations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Less emotional engagement
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    More predictability
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    More attention to family health
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Less urgency to fix outcomes
                  </li>
                </ul>
                <p className="text-muted-foreground mt-4 font-medium">
                  Small changes compound.
                </p>
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
                  <li>What are we currently doing that keeps the system stuck?</li>
                  <li>What would change if we stopped absorbing consequences?</li>
                  <li>Where are we confusing love with rescue?</li>
                  <li>What would family health look like—regardless of outcome?</li>
                  <li>What do we need to protect now?</li>
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
                  Families often believe they must wait for sobriety to reclaim their lives.
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                  That belief is false.
                </p>
                <p className="text-muted-foreground">
                  Families do not need permission to heal.<br />
                  They do not need recovery to begin caring for themselves.
                </p>
                <div className="p-4 bg-background rounded-lg border-l-4 border-emerald-500">
                  <p className="font-medium text-foreground">
                    When families change, everything changes—<br />
                    even if the addicted person isn't ready yet.
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400 mt-2 font-medium">
                    And often, that change becomes the turning point.
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
                  <Link to="/family-interference">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      How Families Accidentally Interfere with Recovery
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Boundary Setting Worksheet
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Guilt vs. Responsibility Module
                    </Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Family Trauma & Hypervigilance Self-Assessment
                    </Button>
                  </Link>
                  <Link to="/family-action-plan">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Family Recovery Action Plan
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
