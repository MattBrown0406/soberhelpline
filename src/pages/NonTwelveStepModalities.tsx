import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, BookOpen, Brain, Pill, Heart, Users, MessageSquare, Laptop, Shield, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";

export default function NonTwelveStepModalities() {
  useGuideTracking("/non-twelve-step-modalities", "Non-12-Step Recovery Modalities Explained");
  return (
    <>
      <Helmet>
        <title>Non–12-Step Recovery Modalities Explained | Sober Helpline</title>
        <meta name="description" content="Understanding non-12-step recovery approaches including SMART Recovery, CBT, DBT, MAT, and more. A guide for families." />
      </Helmet>

      <div className="min-h-screen bg-background">
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
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-4">
                Non–12-Step Recovery Modalities Explained for Families
              </h1>
              <p className="text-xl text-muted-foreground">
                What They Are, How They Work, and When They Help
              </p>
            </div>

            {/* Why Families Need This Guide */}
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-logo-blue">Why Families Need This Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families often hear:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground italic list-disc">
                  <li>"They don't believe in the 12 Steps."</li>
                  <li>"They want something more clinical."</li>
                  <li>"They tried AA and it didn't work."</li>
                  <li>"They need therapy, not meetings."</li>
                </ul>
                <p className="text-muted-foreground">
                  This can create fear or confusion—especially for families who associate recovery exclusively with 12-step programs.
                </p>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                  <p className="font-medium text-foreground">The reality is more nuanced.</p>
                  <p className="text-muted-foreground mt-2">
                    <strong>Recovery is not one-size-fits-all.</strong><br />
                    Different pathways can support recovery—depending on the person, the stage, and the structure surrounding it.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Grounding Principle */}
            <Card className="mb-8 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-700 dark:text-emerald-400">A Grounding Principle for Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-medium text-center">
                  <span className="text-emerald-700 dark:text-emerald-400">Non–12-step does not mean anti-recovery.</span><br />
                  <span className="text-muted-foreground">It means a different framework for change.</span>
                </p>
                <p className="text-muted-foreground text-center">
                  Some people thrive in spiritually oriented peer support.<br />
                  Others need a more clinical, skills-based, or secular approach—especially early on.
                </p>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 mt-4">
                  <p className="font-medium text-foreground mb-2">What matters most is:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["Structure", "Accountability", "Skill development", "Connection", "Consistency over time"].map((item) => (
                      <span key={item} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SMART Recovery */}
            <Card className="mb-6 border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-lg">SMART Recovery</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  A secular, skills-based peer support model grounded in cognitive and behavioral psychology.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                    <p className="font-medium text-blue-700 dark:text-blue-400 mb-2">Core Focus:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Self-management</li>
                      <li>• Coping with urges</li>
                      <li>• Changing unhelpful thinking</li>
                      <li>• Building motivation</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">
                    <p className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">What It Helps With:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• People resistant to spiritual language</li>
                      <li>• Those who prefer tools and techniques</li>
                      <li>• Early recovery skill-building</li>
                      <li>• Logical thinkers</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">Limitations:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Less emphasis on identity transformation</li>
                    <li>• Peer accountability varies</li>
                    <li>• Requires self-direction and consistency</li>
                  </ul>
                </div>
                <p className="text-sm italic text-primary">
                  <strong>Best Fit:</strong> People who want practical tools and structure without spiritual framing.
                </p>
              </CardContent>
            </Card>

            {/* CBT-Based Recovery */}
            <Card className="mb-6 border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-lg">Cognitive Behavioral Therapy (CBT)–Based Recovery</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Focuses on changing thoughts and behaviors that reinforce substance use.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                    <p className="font-medium text-purple-700 dark:text-purple-400 mb-2">Core Focus:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Identifying triggers</li>
                      <li>• Challenging distorted thinking</li>
                      <li>• Developing alternative behaviors</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">
                    <p className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">What It Helps With:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Anxiety- or depression-driven use</li>
                      <li>• Pattern recognition</li>
                      <li>• Skill development</li>
                      <li>• Relapse prevention</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">Limitations:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Insight doesn't equal impulse control</li>
                    <li>• Less effective during active use</li>
                    <li>• Requires stability to be effective</li>
                  </ul>
                </div>
                <p className="text-sm italic text-primary">
                  <strong>Best Fit:</strong> People who are stabilized and able to reflect and practice skills.
                </p>
              </CardContent>
            </Card>

            {/* DBT */}
            <Card className="mb-6 border-l-4 border-l-rose-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-rose-600" />
                  <CardTitle className="text-lg">Dialectical Behavior Therapy (DBT)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  A structured skills-based approach originally developed for emotional dysregulation.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg">
                    <p className="font-medium text-rose-700 dark:text-rose-400 mb-2">Core Focus:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Distress tolerance</li>
                      <li>• Emotional regulation</li>
                      <li>• Interpersonal effectiveness</li>
                      <li>• Mindfulness</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">
                    <p className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">What It Helps With:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Emotional volatility</li>
                      <li>• Impulsivity</li>
                      <li>• Self-destructive patterns</li>
                      <li>• Co-occurring mental health issues</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">Limitations:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Does not replace addiction treatment</li>
                    <li>• Requires consistent practice</li>
                    <li>• Less emphasis on meaning or identity</li>
                  </ul>
                </div>
                <p className="text-sm italic text-primary">
                  <strong>Best Fit:</strong> People whose substance use is closely tied to emotional instability.
                </p>
              </CardContent>
            </Card>

            {/* MAT */}
            <Card className="mb-6 border-l-4 border-l-teal-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Pill className="h-6 w-6 text-teal-600" />
                  <CardTitle className="text-lg">Medication-Assisted Treatment (MAT)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Use of FDA-approved medications to stabilize brain chemistry and reduce cravings or withdrawal.
                </p>
                <div className="bg-teal-50 dark:bg-teal-950/30 p-3 rounded-lg mb-3">
                  <p className="font-medium text-teal-700 dark:text-teal-400 mb-2">Common Examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Buprenorphine", "Methadone", "Naltrexone", "Acamprosate"].map((med) => (
                      <span key={med} className="px-3 py-1 bg-white dark:bg-background rounded border text-sm">{med}</span>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">
                    <p className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">What It Helps With:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Reducing relapse risk</li>
                      <li>• Preventing overdose</li>
                      <li>• Stabilizing early recovery</li>
                      <li>• Improving treatment retention</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                    <p className="font-medium text-amber-700 dark:text-amber-400 mb-2">Limitations:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Does not address behavior patterns alone</li>
                      <li>• Requires monitoring and structure</li>
                      <li>• Still needs psychosocial support</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm italic text-primary">
                  <strong>Best Fit:</strong> Moderate to severe substance use disorders—especially opioid or alcohol use.
                </p>
              </CardContent>
            </Card>

            {/* Harm Reduction */}
            <Card className="mb-6 border-l-4 border-l-orange-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-orange-600" />
                  <CardTitle className="text-lg">Harm Reduction Models</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Approaches that aim to reduce risk and harm, even if abstinence is not immediately achievable.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
                    <p className="font-medium text-orange-700 dark:text-orange-400 mb-2">Core Focus:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Safety</li>
                      <li>• Incremental change</li>
                      <li>• Engagement over coercion</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">
                    <p className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">What They Help With:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Engagement of resistant individuals</li>
                      <li>• Reducing overdose risk</li>
                      <li>• Building trust</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">Limitations:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Can stall progress if not paired with structure</li>
                    <li>• Not appropriate for all families or stages</li>
                    <li>• Requires strong boundaries from families</li>
                  </ul>
                </div>
                <p className="text-sm italic text-primary">
                  <strong>Best Fit:</strong> Early engagement or high-risk individuals not yet ready for abstinence.
                </p>
              </CardContent>
            </Card>

            {/* Individual Psychotherapy */}
            <Card className="mb-6 border-l-4 border-l-indigo-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                  <CardTitle className="text-lg">Individual Psychotherapy (Non-12-Step)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  One-on-one therapy addressing underlying issues contributing to substance use.
                </p>
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg mb-3">
                  <p className="font-medium text-indigo-700 dark:text-indigo-400 mb-2">Modalities May Include:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Psychodynamic therapy", "Trauma-informed therapy", "Acceptance-based approaches"].map((item) => (
                      <span key={item} className="px-3 py-1 bg-white dark:bg-background rounded border text-sm">{item}</span>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg">
                    <p className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">What It Helps With:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Insight</li>
                      <li>• Emotional processing</li>
                      <li>• Trauma resolution (when stable)</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                    <p className="font-medium text-amber-700 dark:text-amber-400 mb-2">Limitations:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Often ineffective during active addiction</li>
                      <li>• Requires structure and accountability elsewhere</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm italic text-primary">
                  <strong>Best Fit:</strong> As part of a broader recovery plan—not a standalone solution.
                </p>
              </CardContent>
            </Card>

            {/* Recovery Coaching */}
            <Card className="mb-6 border-l-4 border-l-cyan-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-cyan-600" />
                  <CardTitle className="text-lg">Recovery Coaching & Case Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Non-clinical support focused on practical recovery implementation.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-lg">
                    <p className="font-medium text-cyan-700 dark:text-cyan-400 mb-2">What It Helps With:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Accountability</li>
                      <li>• Goal-setting</li>
                      <li>• Daily structure</li>
                      <li>• Navigation of resources</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                    <p className="font-medium text-amber-700 dark:text-amber-400 mb-2">Limitations:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Not therapy</li>
                      <li>• Effectiveness varies by provider</li>
                      <li>• Needs clear boundaries</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm italic text-primary">
                  <strong>Best Fit:</strong> Transition phases and early recovery stabilization.
                </p>
              </CardContent>
            </Card>

            {/* Online Platforms */}
            <Card className="mb-8 border-l-4 border-l-violet-500">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Laptop className="h-6 w-6 text-violet-600" />
                  <CardTitle className="text-lg">Online & Digital Recovery Platforms</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Apps, forums, or virtual programs offering education, peer support, and tracking tools.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-violet-50 dark:bg-violet-950/30 p-3 rounded-lg">
                    <p className="font-medium text-violet-700 dark:text-violet-400 mb-2">What They Help With:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Accessibility</li>
                      <li>• Privacy</li>
                      <li>• Consistency for motivated individuals</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                    <p className="font-medium text-amber-700 dark:text-amber-400 mb-2">Limitations:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Low accountability</li>
                      <li>• Easy disengagement</li>
                      <li>• Not sufficient for high-risk individuals</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm italic text-primary">
                  <strong>Best Fit:</strong> Supplemental support—not primary treatment.
                </p>
              </CardContent>
            </Card>

            {/* What Families Often Misunderstand */}
            <Card className="mb-8 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  What Families Often Misunderstand
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <p className="font-medium text-foreground">"If it's not 12-step, it won't work."</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      <strong>Not true</strong>—but structure and accountability still matter.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <p className="font-medium text-foreground">"They just don't want to surrender."</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Sometimes resistance is about <strong>language</strong>—not willingness.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <p className="font-medium text-foreground">"Non-12-step means no responsibility."</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      <strong>False.</strong> Effective non-12-step recovery still requires:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Behavior change", "Boundaries", "Consistency", "Consequences"].map((item) => (
                        <span key={item} className="px-2 py-1 bg-muted rounded text-xs">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* The Most Important Question */}
            <Card className="mb-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/30">
              <CardHeader>
                <CardTitle className="text-xl text-primary">The Most Important Question Families Can Ask</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-medium text-center">
                  "What structure replaces what the 12 Steps provide?"
                </p>
                <p className="text-muted-foreground text-center">Any recovery path must still address:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {[
                    "Daily accountability",
                    "Emotional regulation",
                    "Connection",
                    "Meaning",
                    "Long-term engagement"
                  ].map((item) => (
                    <div key={item} className="bg-white dark:bg-background p-3 rounded-lg border text-center text-sm">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-center text-muted-foreground mt-4 font-medium">
                  If those are missing, relapse risk increases—regardless of philosophy.
                </p>
              </CardContent>
            </Card>

            {/* Integration Often Works Best */}
            <Card className="mb-8 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-700 dark:text-emerald-400">Integration Often Works Best</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Many people succeed by combining approaches:</p>
                <div className="space-y-2">
                  {[
                    "MAT + therapy + peer support",
                    "DBT + SMART + coaching",
                    "12-step later, after stabilization",
                    "Secular early, spiritual later"
                  ].map((combo) => (
                    <div key={combo} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>{combo}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center font-medium text-foreground mt-4">
                  Recovery paths can evolve.
                </p>
              </CardContent>
            </Card>

            {/* A Grounding Reframe */}
            <Card className="mb-8 bg-logo-blue/5 border-logo-green/30">
              <CardHeader>
                <CardTitle className="text-xl text-logo-blue">A Grounding Reframe for Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-center">
                  <strong>Recovery is not about the brand of the program.</strong><br />
                  It's about whether the system supports sustained change.
                </p>
                <p className="text-muted-foreground mt-4">Families support recovery best when they:</p>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {[
                    "Stay curious, not ideological",
                    "Focus on behavior, not language",
                    "Protect boundaries regardless of modality",
                    "Ask about structure, not beliefs"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-logo-blue flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Final Thought</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  There is more than one path to recovery—but <strong>no path works without accountability, structure, and sustained effort</strong>.
                </p>
                <p className="text-muted-foreground">Understanding non–12-step modalities helps families:</p>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {[
                    "Reduce fear",
                    "Avoid false hope",
                    "Ask better questions",
                    "Support recovery without controlling it"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggested Companion Resources */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/treatment-modalities">
                    <Button variant="outline" size="sm">Treatment Modalities Explained</Button>
                  </Link>
                  <Link to="/matching-modality">
                    <Button variant="outline" size="sm">Matching the Modality to the Problem</Button>
                  </Link>
                  <Link to="/therapy-timing">
                    <Button variant="outline" size="sm">Why Some Therapies Fail at the Wrong Time</Button>
                  </Link>
                  <Link to="/insight-behavior-tracker">
                    <Button variant="outline" size="sm">Insight vs. Behavior Tracker</Button>
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
        
          <RelatedResources currentPath="/non-twelve-step-modalities" />
</main>
      </div>
    </>
  );
}
