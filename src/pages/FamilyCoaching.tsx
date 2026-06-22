import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, Calendar, ShieldAlert, FileText, Compass, Users, BookOpen, Video, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import SEOHead from "@/components/SEOHead";
import EnablingBehaviorAudit from "@/components/EnablingBehaviorAudit";
import BoundaryClarityWorksheet from "@/components/BoundaryClarityWorksheet";
import CoachingIntakeAssessment from "@/components/CoachingIntakeAssessment";
import FreeConsultationCTA from "@/components/FreeConsultationCTA";
import FamilyReadinessAssessment from "@/components/FamilyReadinessAssessment";
import FamilyNextStepCTA from "@/components/FamilyNextStepCTA";
import FamilyBridgeCTA from "@/components/FamilyBridgeCTA";
import { trackConversionEvent } from "@/lib/conversionTracking";
import { mattBrownPersonSchema } from "@/lib/mattBrownSchema";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";

export default function FamilyCoaching() {
  const { isMember } = useMembershipStatus();

  // Gated pages redirect non-members to membership signup
  const gatedLink = (path: string) => isMember ? path : "/family-membership";

  return (
    <>
      <SEOHead
        title="Family Addiction Coaching & Private Sessions | Sober Helpline"
        description="Book private family addiction coaching for boundaries, enabling, relapse, treatment refusal, and a clear next step. Free Monday Zoom is available when coaching can wait."
        faqItems={[
          {
            question: "What is family addiction coaching?",
            answer: "Family addiction coaching is private, practical guidance that helps families respond to addiction with clearer boundaries, less enabling, and a calmer plan.",
          },
          {
            question: "Should we start with coaching or the Monday Zoom?",
            answer: "Many families start with the free Monday Family Squares Zoom. Private coaching is best when the situation is urgent, private, complex, or needs a specific plan.",
          },
          {
            question: "When is an intervention a better fit?",
            answer: "If safety risk, treatment refusal, family division, or repeated crisis is escalating, the Family Readiness Intensive can help determine whether Freedom Interventions is the right next step.",
          },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Family Addiction Coaching",
          "provider": {
            "@type": "Organization",
            "name": "Sober Helpline",
            "url": "https://soberhelpline.com"
          },
          "serviceType": "Coaching",
          "description": "1-on-1 family coaching to help you set boundaries, reduce enabling, and navigate your loved one's addiction with confidence.",
          "url": "https://soberhelpline.com/family-coaching"
        }}
        personJsonLd={mattBrownPersonSchema}
      />
      <div className="min-h-screen bg-background">

        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link to="/family-support" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
              <div className="flex flex-wrap gap-2">
                <Link to={gatedLink("/family-education")}>
                  <Button variant="outline" size="sm" className="gap-2 border-logo-green/50 text-logo-blue hover:bg-logo-blue/10">
                    <BookOpen className="h-4 w-4" />
                    Education
                    {!isMember && <Lock className="h-3 w-3 ml-0.5 opacity-60" />}
                  </Button>
                </Link>
                <Link to={gatedLink("/family-forum")}>
                  <Button variant="outline" size="sm" className="gap-2 border-emerald-500/50 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30">
                    <Users className="h-4 w-4" />
                    Forum
                    {!isMember && <Lock className="h-3 w-3 ml-0.5 opacity-60" />}
                  </Button>
                </Link>
                <Link to={gatedLink("/family-webinars")}>
                  <Button variant="outline" size="sm" className="gap-2 border-purple-500/50 text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30">
                    <Video className="h-4 w-4" />
                    Webinars
                    {!isMember && <Lock className="h-3 w-3 ml-0.5 opacity-60" />}
                  </Button>
                </Link>
                <Link to="/monday-zoom-registration">
                  <Button variant="outline" size="sm" className="gap-2 border-blue-500/50 text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30">
                    <Calendar className="h-4 w-4" />
                    “The Family Squares”
                  </Button>
                </Link>
                <Link to={gatedLink("/zoom-recordings")}>
                  <Button variant="outline" size="sm" className="gap-2 border-rose-500/50 text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30">
                    <Video className="h-4 w-4" />
                    Past Recordings
                    {!isMember && <Lock className="h-3 w-3 ml-0.5 opacity-60" />}
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="border-primary/20 bg-primary/5 mb-6">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-4 text-center md:text-left">
                  <div>
                    <p className="text-sm font-semibold text-primary mb-1">Choose the right level of help</p>
                    <h2 className="text-xl font-bold text-logo-blue">If your family needs a plan now, book private family addiction coaching</h2>
                    <p className="text-sm text-muted-foreground mt-2">Use coaching for urgent, private, or complex situations. If the question can wait, start with the free Monday Family Squares Zoom and bring one specific family decision.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/book-consultation" onClick={() => trackConversionEvent("coaching_click", { source: "family_coaching_top_path" })}><Button className="gap-2 w-full sm:w-auto"><Calendar className="h-4 w-4" />Book Private Coaching</Button></Link>
                    <Link to="/monday-zoom-registration" onClick={() => trackConversionEvent("monday_zoom_click", { source: "family_coaching_top_path" })}><Button variant="outline" className="gap-2 w-full sm:w-auto"><Calendar className="h-4 w-4" />Join Free Monday Zoom</Button></Link>
                    <Link to="/family-membership"><Button variant="outline" className="gap-2 w-full sm:w-auto"><Users className="h-4 w-4" />Explore Membership</Button></Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5 mb-6">
              <CardContent className="p-5 md:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">Direct answer</p>
                <h2 className="text-2xl font-bold text-logo-blue">What is family addiction coaching?</h2>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  Family addiction coaching is practical guidance for parents, spouses, siblings, and loved ones who need help responding to addiction without more panic or enabling. It focuses on boundaries, communication, relapse decisions, treatment refusal, money requests, and the next step the family can actually hold.
                </p>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  If your family needs a person to help sort the situation, book a coaching session. If the next step is practicing better conversations and accountability between sessions, use FamilyBridge as the ongoing support tool.
                </p>
              </CardContent>
            </Card>

            {/* Member Discount Banner */}
            <Link to="/family-membership" className="flex items-center gap-3 bg-gradient-to-r from-primary/10 via-blue-400/10 to-primary/10 border border-primary/20 rounded-xl px-5 py-3.5 mb-6 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors">
                <Crown className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Members save on private coaching, including <span className="text-primary">10% off the Family Readiness Intensive</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Coaching sessions are $125 instead of $150, and the intensive drops from $2,500 to $2,250 for members.
                </p>
              </div>
              <ArrowLeft className="w-4 h-4 text-primary rotate-180 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Family Assessment CTA */}
            <div className="mb-8">
              <FreeConsultationCTA />
            </div>

            <FamilyNextStepCTA className="mb-8" />

            <FamilyBridgeCTA variant="coaching" className="mb-8" />

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-background to-orange-500/5 border border-amber-500/20 p-8 md:p-12 mb-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative text-center">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Compass className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-700 dark:text-amber-400">
                      Family Addiction Coaching
                    </h1>
                    <p className="text-muted-foreground">Calm, direct guidance for families living with addiction</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 mt-6 max-w-3xl mx-auto">
                  <h2 className="text-xl md:text-2xl font-bold text-amber-700 dark:text-amber-400">
                    The Emergency Game Plan™
                  </h2>
                  <span className="text-xl font-bold text-primary">— $150</span> <span className="text-sm font-medium text-muted-foreground">($125 for members)</span>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-3 italic">
                  If things are unraveling and your family needs clear direction fast, this is where private coaching can help.
                </p>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
                  In one focused 60-minute call, we sort out what is happening, look at the biggest immediate risks, and build a practical plan for the next 7 to 14 days. You leave with clearer language, better boundaries, and a steadier sense of what to do next.
                </p>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4 font-medium">
                  This is for families who need calm, experienced guidance now, not a long wait and not more guessing.
                </p>
                <div className="mt-4">
                  <Link to="/book-consultation?plan=emergency">
                    <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                      <Calendar className="h-4 w-4" />
                      Book an Emergency Session — $150 ($125 for members)
                    </Button>
                  </Link>
                </div>

                <Accordion type="single" collapsible className="mt-8 max-w-3xl mx-auto space-y-4">
                  <AccordionItem value="stabilization" className="border-2 border-amber-500/20 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/20 [&[data-state=open]>svg]:rotate-180">
                      <span className="flex flex-col md:flex-row items-center gap-2 text-lg font-semibold text-amber-700 dark:text-amber-400">
                        Family Stabilization Plan™ <span className="text-primary font-bold">— $500</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p className="text-xl font-semibold text-amber-700 dark:text-amber-400 mt-3">
                        A 4-week reset for families in active chaos
                      </p>
                      <p className="text-muted-foreground mt-3">
                        When addiction escalates, families usually end up in survival mode. Sleep gets worse. Arguments get sharper. Money decisions get reactive. Everyone feels stretched thin.
                      </p>
                      <p className="text-muted-foreground mt-3">
                        The Family Stabilization Plan™ is a focused 4-week coaching program for families who need structure, alignment, and a calmer way to respond.
                      </p>
                      <p className="text-muted-foreground mt-2 font-semibold italic">
                        This is short-term, practical support meant to settle the chaos and help your family regain its footing.
                      </p>

                      <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-6">Who This Program Is For</h3>
                      <p className="text-muted-foreground mt-2">This program is appropriate if:</p>
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li>Your loved one is actively using</li>
                        <li>There has been a recent relapse</li>
                        <li>Boundaries are unclear or inconsistent</li>
                        <li>You feel emotionally reactive or panicked</li>
                        <li>Financial decisions are being made under pressure</li>
                        <li>You and your partner are not aligned</li>
                        <li>You feel like you are constantly "putting out fires"</li>
                      </ul>
                      <p className="text-muted-foreground mt-3 italic">
                        If your household feels unstable, this is often the right place to start.
                      </p>

                      <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-6">The Goal of Stabilization</h3>
                      <p className="text-muted-foreground mt-2">
                        The goal is not to control your loved one.
                      </p>
                      <p className="text-muted-foreground mt-2 font-semibold">
                        The goal is to stabilize your family and stop the chaos from running the house.
                      </p>
                      <p className="text-muted-foreground mt-2">Over four structured weeks, we focus on:</p>
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li>Reducing emotional volatility</li>
                        <li>Identifying enabling patterns</li>
                        <li>Establishing one or two enforceable boundaries</li>
                        <li>Clarifying financial limits</li>
                        <li>Creating a short-term crisis response plan</li>
                        <li>Aligning decision-makers inside the household</li>
                      </ul>
                      <p className="text-muted-foreground mt-3 font-medium italic">
                        Before long-term change can happen, the chaos must stop escalating.
                      </p>

                      <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-6">What Happens During the 4 Weeks</h3>
                      <div className="mt-4 space-y-4">
                        <div className="pl-4 border-l-4 border-red-400/50">
                          <p className="font-semibold text-red-700 dark:text-red-400">Week 1: System Assessment & Pattern Identification</p>
                          <p className="text-muted-foreground text-sm mt-1">We identify destabilizing behaviors and map the current family dynamic.</p>
                        </div>
                        <div className="pl-4 border-l-4 border-amber-400/50">
                          <p className="font-semibold text-amber-700 dark:text-amber-400">Week 2: Emotional Regulation & Conflict Containment</p>
                          <p className="text-muted-foreground text-sm mt-1">You learn how to reduce reactive decision-making and regain calm authority.</p>
                        </div>
                        <div className="pl-4 border-l-4 border-emerald-400/50">
                          <p className="font-semibold text-emerald-700 dark:text-emerald-400">Week 3: Boundary Implementation</p>
                          <p className="text-muted-foreground text-sm mt-1">We design and implement one enforceable, value-based boundary.</p>
                        </div>
                        <div className="pl-4 border-l-4 border-blue-400/50">
                          <p className="font-semibold text-blue-700 dark:text-blue-400">Week 4: Crisis Response Plan</p>
                          <p className="text-muted-foreground text-sm mt-1">You leave with a written structure for handling relapse, manipulation, or escalation.</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-4 font-medium">
                        The work is focused, practical, and grounded in what your family can actually follow through on.
                      </p>

                      <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-6">What You Leave With</h3>
                      <p className="text-muted-foreground mt-2">By the end of the intensive, families typically experience:</p>
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li>Reduced conflict intensity</li>
                        <li>Clearer financial limits</li>
                        <li>Increased confidence enforcing boundaries</li>
                        <li>Improved alignment between partners</li>
                        <li>A written crisis stabilization plan</li>
                        <li>A measurable reduction in chaos</li>
                      </ul>
                      <p className="text-muted-foreground mt-3 font-medium">
                        Even if your loved one does not change right away, your home can still become calmer and clearer.
                      </p>

                      <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-6">What This Program Is Not</h3>
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li>It is not therapy.</li>
                        <li>It does not replace medical or psychiatric care.</li>
                        <li>It does not guarantee sobriety.</li>
                      </ul>
                      <p className="text-muted-foreground mt-3 font-semibold">
                        It helps your family get structure and clarity back.
                      </p>

                      <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-6">After Stabilization</h3>
                      <p className="text-muted-foreground mt-2">Families who complete this program may transition into:</p>
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li>The 12-Week Parallel Recovery Program™</li>
                        <li>Ongoing Long-Term Family Support</li>
                        <li>Or continue independently with the structure built during the intensive</li>
                      </ul>
                      <p className="text-muted-foreground mt-3 font-medium italic">
                        Stabilization comes first. From there, longer-term recovery work has something solid to stand on.
                      </p>

                      <div className="mt-6">
                        <Link to="/book-consultation?plan=stabilization">
                          <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                            <Calendar className="h-4 w-4" />
                            Book the Stabilization Plan — $500
                          </Button>
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="parallel-recovery" className="border-2 border-emerald-500/20 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/20 [&[data-state=open]>svg]:rotate-180">
                      <span className="flex flex-col md:flex-row items-center gap-2 text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                        Parallel Recovery Program™ <span className="text-primary font-bold">— $1,500</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-400 mt-3">
                        A 12-week coaching path for families who want real change at home
                      </p>
                      <p className="text-muted-foreground mt-3">
                        When someone you love struggles with addiction, your life changes too.
                      </p>
                      <p className="text-muted-foreground mt-3">
                        Most families put all of their focus on getting their loved one sober. What gets missed is that addiction changes the whole family.
                      </p>
                      <p className="text-muted-foreground mt-2 font-semibold italic">
                        If the family never changes its patterns, everyone stays stuck.
                      </p>
                      <p className="text-muted-foreground mt-3">
                        The Parallel Recovery Program™ is a structured 12-week coaching experience for families who want more than a single session, but do not need endless open-ended support.
                      </p>
                      <p className="text-muted-foreground mt-2 font-medium">
                        It gives you a step-by-step way to move from chaos and reactivity toward clarity, consistency, and follow-through.
                      </p>

                      <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-6">Why "Parallel Recovery"?</h3>
                      <p className="text-muted-foreground mt-2">
                        Because families have their own recovery work to do alongside their loved one.
                      </p>
                      <p className="text-muted-foreground mt-2">While your loved one works on sobriety, you work on:</p>
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li>Ending enabling patterns</li>
                        <li>Regulating emotional reactivity</li>
                        <li>Establishing enforceable boundaries</li>
                        <li>Aligning as a couple or family unit</li>
                        <li>Preparing for relapse without panic</li>
                        <li>Rebuilding trust gradually and safely</li>
                      </ul>
                      <p className="text-muted-foreground mt-3 font-medium italic">
                        Recovery is not just about one person. The whole family needs a different way to live.
                      </p>

                      <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-6">What You Can Expect</h3>
                      <p className="text-muted-foreground mt-2">Over 12 structured weeks, you will:</p>

                      <div className="mt-4 space-y-4">
                        <div className="pl-4 border-l-4 border-red-400/50">
                          <p className="font-semibold text-red-700 dark:text-red-400">Phase 1: Stabilize the System</p>
                          <p className="text-muted-foreground text-sm mt-1">Reduce chaos, understand your role in the family dynamic, and implement your first enforceable boundary.</p>
                        </div>
                        <div className="pl-4 border-l-4 border-amber-400/50">
                          <p className="font-semibold text-amber-700 dark:text-amber-400">Phase 2: Detach Without Abandoning</p>
                          <p className="text-muted-foreground text-sm mt-1">Learn how to stop rescuing without becoming cold or disconnected. Replace guilt-driven decisions with values-based structure.</p>
                        </div>
                        <div className="pl-4 border-l-4 border-emerald-400/50">
                          <p className="font-semibold text-emerald-700 dark:text-emerald-400">Phase 3: Build Accountability & Structure</p>
                          <p className="text-muted-foreground text-sm mt-1">Create written financial policies, communication scripts, and a relapse response plan so you are never reacting blindly again.</p>
                        </div>
                        <div className="pl-4 border-l-4 border-blue-400/50">
                          <p className="font-semibold text-blue-700 dark:text-blue-400">Phase 4: Sustain & Transition</p>
                          <p className="text-muted-foreground text-sm mt-1">Rebuild trust carefully, reclaim your identity outside of crisis, and design a long-term family stability blueprint.</p>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-6">Who This Program Is For</h3>
                      <p className="text-muted-foreground mt-2">This program is appropriate if:</p>
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li>Your loved one is actively using or early in recovery</li>
                        <li>You feel emotionally exhausted or constantly reactive</li>
                        <li>Boundaries exist but are inconsistent</li>
                        <li>Financial support has become confusing or chaotic</li>
                        <li>You and your partner are divided on what to do</li>
                        <li>You are afraid of relapse but unsure how to prepare</li>
                      </ul>
                      <p className="text-muted-foreground mt-3 italic">
                        It is especially helpful for families who are no longer in immediate crisis but still feel stuck in unhealthy patterns.
                      </p>

                      <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-6">How It Works</h3>
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li>Weekly 60-minute private coaching sessions</li>
                        <li>Structured curriculum and guided worksheets</li>
                        <li>Accountability and implementation tracking</li>
                        <li>Boundary scripting tools</li>
                        <li>Financial clarity frameworks</li>
                        <li>Relapse response planning</li>
                      </ul>
                      <p className="text-muted-foreground mt-3 font-medium">
                        This is structured support with a clear beginning, a clear focus, and a clear path forward.
                      </p>

                      <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-6">What Changes by Week 12</h3>
                      <p className="text-muted-foreground mt-2">Families who complete the program typically report:</p>
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li>Reduced emotional volatility</li>
                        <li>Increased boundary consistency</li>
                        <li>Clear financial decision-making</li>
                        <li>Improved couple alignment</li>
                        <li>Lower household stress</li>
                        <li>Greater confidence responding to relapse or resistance</li>
                      </ul>
                      <p className="text-muted-foreground mt-3 font-medium">
                        Most importantly, addiction no longer dictates every decision in the home, even if their loved one is still struggling.
                      </p>

                      <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-6">This Program Does Not</h3>
                      <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li>Force your loved one into treatment</li>
                        <li>Replace therapy or psychiatric care</li>
                        <li>Guarantee sobriety</li>
                      </ul>
                      <p className="text-muted-foreground mt-3 font-semibold">
                        It strengthens the part you actually can influence:
                      </p>
                      <p className="text-emerald-700 dark:text-emerald-400 font-bold text-lg mt-1">
                        the health and stability of your family.
                      </p>

                      <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-6">The Result</h3>
                      <p className="text-muted-foreground mt-2 font-semibold italic">
                        When families get steadier, addiction loses some of its grip.
                      </p>
                      <p className="text-muted-foreground mt-2">
                        You move from reacting to responding.<br />
                        From rescuing to supporting.<br />
                        From panic to a plan.
                      </p>
                      <p className="text-muted-foreground mt-3 font-medium">
                        That gives everyone a better chance at something sustainable.
                      </p>

                      <p className="text-muted-foreground mt-6 font-semibold">
                        Ready to begin your family's parallel recovery journey?
                      </p>
                      <div className="mt-3">
                        <Link to="/book-consultation?plan=parallel-recovery">
                          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Calendar className="h-4 w-4" />
                            Book the Parallel Recovery Program — $1,500
                          </Button>
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-800/30 rounded-lg">
                <p className="text-sm text-muted-foreground italic text-center">
                  We usually recommend starting with an hourly session. We will not push your family into a package you do not need. If a longer plan makes sense, we will say so plainly. If it does not, we will say that too.
                </p>
              </div>
            </div>

            {/* Family Readiness Assessment */}
            <Accordion type="single" collapsible className="mb-8">
              <AccordionItem value="readiness" className="border-2 border-violet-500/30 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-br from-violet-50 to-transparent dark:from-violet-950/20 [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-start gap-3 text-left">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                      <ClipboardCheck className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-violet-700 dark:text-violet-400">Family Readiness Assessment™</p>
                      <p className="text-sm text-muted-foreground font-normal">
                        Not sure what level of support makes sense? This quick assessment can help point you in the right direction.
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <FamilyReadinessAssessment />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Book a Session CTA */}
            <div className="grid gap-6 mb-8 lg:grid-cols-2">
              <Card className="border-2 border-amber-500/30 overflow-hidden hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                <CardHeader className="bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-amber-700 dark:text-amber-400">Book a Coaching Session — $150 <span className="text-sm font-medium text-muted-foreground">($125 for members)</span></CardTitle>
                      <CardDescription>
                        Book a one-on-one session for calm, direct support around boundaries, next steps, and family decisions.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link to="/book-consultation">
                    <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                      <Calendar className="h-4 w-4" />
                      Schedule a Session
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-violet-500/30 overflow-hidden hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300">
                <CardHeader className="bg-gradient-to-br from-violet-50 to-transparent dark:from-violet-950/20 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                      <Compass className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-violet-700 dark:text-violet-400">Family Readiness Intensive — $2,500 <span className="text-sm font-medium text-muted-foreground">($2,250 for members)</span></CardTitle>
                      <CardDescription>
                        A focused 90-minute private session for families who need a serious readiness plan, clearer strategy, and immediate next steps.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Includes the live intensive session plus 7 days of follow-up support by Zoom, phone, text, or email.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/family-readiness-intensive">
                      <Button variant="outline" className="gap-2 border-violet-500/40 text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/30">
                        Learn More
                      </Button>
                    </Link>
                    <Link to="/book-consultation?plan=family-readiness-intensive">
                      <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white">
                        <Calendar className="h-4 w-4" />
                        Book the Intensive
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coaching Phase Guide Table */}
            <Card className="mb-8 border-2 border-orange-500/30 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-950/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Compass className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-orange-700 dark:text-orange-400">Coaching Phase Guide</CardTitle>
                    <CardDescription>A simple guide to which level of coaching may fit your family's current situation.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-orange-200 dark:border-orange-800/50">
                        <th className="text-left py-3 px-4 font-semibold text-orange-700 dark:text-orange-400">Service Tier</th>
                        <th className="text-left py-3 px-4 font-semibold text-orange-700 dark:text-orange-400">Family Experience</th>
                        <th className="text-left py-3 px-4 font-semibold text-orange-700 dark:text-orange-400">Coaching Focus</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50 bg-amber-50/50 dark:bg-amber-950/20">
                        <td className="py-3 px-4 font-medium text-amber-700 dark:text-amber-400">Hourly Session<span className="block text-xs font-normal text-muted-foreground mt-0.5">1 session</span></td>
                        <td className="py-3 px-4 text-muted-foreground">Specific questions, check-ins, or single-issue guidance</td>
                        <td className="py-3 px-4 text-muted-foreground">Targeted support on one concern at a time</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-red-50/50 dark:bg-red-950/20">
                        <td className="py-3 px-4 font-medium text-red-700 dark:text-red-400">Emergency Game Plan™<span className="block text-xs font-normal text-muted-foreground mt-0.5">1 session</span></td>
                        <td className="py-3 px-4 text-muted-foreground">Panic, chaos, fear, immediate crisis</td>
                        <td className="py-3 px-4 text-muted-foreground">Emotional regulation, crisis boundaries, 7–14 day action plan</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                        <td className="py-3 px-4 font-medium text-emerald-700 dark:text-emerald-400">Family Stabilization Plan™<span className="block text-xs font-normal text-muted-foreground mt-0.5">4 sessions</span></td>
                        <td className="py-3 px-4 text-muted-foreground">Enabling cycles, guilt, loss of control, family conflict</td>
                        <td className="py-3 px-4 text-muted-foreground">System assessment, boundary implementation, communication reset</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-violet-50/50 dark:bg-violet-950/20">
                        <td className="py-3 px-4 font-medium text-violet-700 dark:text-violet-400">Family Readiness Intensive<span className="block text-xs font-normal text-muted-foreground mt-0.5">90 minutes + 7 days follow-up</span></td>
                        <td className="py-3 px-4 text-muted-foreground">A serious family decision point, treatment planning, intervention readiness, or high-stakes alignment problem</td>
                        <td className="py-3 px-4 text-muted-foreground">Intensive strategy, readiness mapping, decision alignment, and a concrete action plan</td>
                      </tr>
                      <tr className="bg-blue-50/50 dark:bg-blue-950/20">
                        <td className="py-3 px-4 font-medium text-blue-700 dark:text-blue-400">Parallel Recovery Program™<span className="block text-xs font-normal text-muted-foreground mt-0.5">12 sessions</span></td>
                        <td className="py-3 px-4 text-muted-foreground">Long-term instability, hypervigilance, identity loss</td>
                        <td className="py-3 px-4 text-muted-foreground">Detachment with love, accountability structures, sustainable independence</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Accordion type="multiple" className="space-y-4">
              {/* Intake Assessment */}
              <AccordionItem value="intake" className="border-2 border-teal-500/30 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-950/20 [&[data-state=open]>svg]:rotate-180">
                  <span className="flex items-center gap-2 text-lg font-semibold text-teal-700 dark:text-teal-400">
                    <div className="p-1.5 rounded-lg bg-teal-500/10">
                      <FileText className="h-5 w-5" />
                    </div>
                    Family Coaching Intake Assessment™
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground text-sm mb-6">
                    Complete this confidential assessment so your coach can understand what your family is dealing with right now. Estimated time: 12–15 minutes.
                  </p>
                  <CoachingIntakeAssessment />
                </AccordionContent>
              </AccordionItem>

              {/* Enabling Behavior Audit */}
              <AccordionItem value="audit" className="border-2 border-rose-500/30 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-rose-50 to-transparent dark:from-rose-950/20 [&[data-state=open]>svg]:rotate-180">
                  <span className="flex items-center gap-2 text-lg font-semibold text-rose-700 dark:text-rose-400">
                    <div className="p-1.5 rounded-lg bg-rose-500/10">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    Enabling Behavior Audit™
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <EnablingBehaviorAudit />
                </AccordionContent>
              </AccordionItem>

              {/* Boundary Clarity Worksheet */}
              <AccordionItem value="boundary-worksheet" className="border-2 border-cyan-500/30 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20 [&[data-state=open]>svg]:rotate-180">
                  <span className="flex items-center gap-2 text-lg font-semibold text-cyan-700 dark:text-cyan-400">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    Boundary Clarity Worksheet™
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <BoundaryClarityWorksheet />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </main>
      </div>
    </>
  );
}
