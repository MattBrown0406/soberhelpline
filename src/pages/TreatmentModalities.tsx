import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, Download, Brain, Clock, Users, Pill, Heart, Home, MessageCircle, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";

export default function TreatmentModalities() {
  useGuideTracking("/treatment-modalities", "Treatment Modalities Explained");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Treatment Modalities Explained | Sober Helpline</title>
        <meta name="description" content="Understand what different therapies do, when they help, and when they don't. A jargon-free guide for families navigating addiction treatment options." />
      </Helmet>

      <div className="min-h-screen bg-background print:bg-white">

        <main className="container py-8 md:py-12 print:py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 print:hidden">
              <Link
                to="/family-education"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Family Education
              </Link>
              <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Print Guide
              </Button>
            </div>

            <div className="text-center mb-8">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4 print:hidden" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                Treatment Modalities Explained
              </h1>
              <p className="text-xl text-muted-foreground">
                What Different Therapies Do, When They Help, and When They Don't
              </p>
            </div>

            {/* Why Families Need This Guide */}
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-logo-green">Why Families Need This Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families are often told:</p>
                <ul className="space-y-2 text-muted-foreground italic">
                  <li>"They need CBT."</li>
                  <li>"DBT would be better."</li>
                  <li>"They should do trauma work."</li>
                  <li>"Medication is the answer."</li>
                  <li>"Family therapy will fix this."</li>
                </ul>
                <p className="text-foreground font-medium">
                  Without context, these terms sound authoritative—but they are tools, not cures.
                </p>
                <p className="text-muted-foreground">
                  No single therapy works for every person, every stage, or every problem.
                </p>
                <p className="text-foreground font-semibold bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                  The right therapy at the wrong time often fails.
                </p>
                <p className="text-muted-foreground">
                  This guide explains the most common modalities so families can:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Understand what's being recommended</li>
                  <li>Ask better questions</li>
                  <li>Set realistic expectations</li>
                  <li>Avoid blaming themselves or their loved one when something doesn't work</li>
                </ul>
              </CardContent>
            </Card>

            {/* Core Principle */}
            <Card className="mb-8 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-400">A Core Principle to Understand First</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-semibold text-foreground">
                  Treatment works best when the method matches the problem and the stage of recovery.
                </p>
                <p className="text-muted-foreground">
                  Most failures are not because:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>The person "didn't try"</li>
                  <li>The family "didn't support enough"</li>
                </ul>
                <p className="text-muted-foreground">
                  They happen because:
                </p>
                <ul className="list-disc list-inside space-y-1 text-foreground font-medium ml-4">
                  <li>The level of care was wrong</li>
                  <li>The timing was wrong</li>
                  <li>The modality didn't match the need</li>
                </ul>
              </CardContent>
            </Card>

            {/* Treatment Modalities Accordion */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-logo-green mb-4">Treatment Modalities</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {/* CBT */}
                <AccordionItem value="cbt" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-left">Cognitive Behavioral Therapy (CBT)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">What It Is (Plain Language)</h4>
                      <p className="text-muted-foreground">CBT helps people notice unhelpful thoughts and behaviors and practice changing them.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What It Helps With</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Negative thinking patterns</li>
                        <li>Anxiety and depression</li>
                        <li>Skill-building and coping strategies</li>
                        <li>Problem-solving</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">What It Doesn't Do Well</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Resolve deep trauma by itself</li>
                        <li>Work during active intoxication</li>
                        <li>Override severe impulse control issues</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                      <p className="font-medium text-blue-700 dark:text-blue-400">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Best Used When: The person is sober or stabilized and able to reflect and practice skills.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* DBT */}
                <AccordionItem value="dbt" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-pink-600" />
                      <span className="font-semibold text-left">Dialectical Behavior Therapy (DBT)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">What It Is</h4>
                      <p className="text-muted-foreground">DBT teaches skills for managing intense emotions and relationships.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What It Helps With</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Emotional volatility</li>
                        <li>Impulsivity</li>
                        <li>Self-harm behaviors</li>
                        <li>Crisis management</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">What It Doesn't Do Well</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Replace addiction treatment</li>
                        <li>Address trauma memories directly</li>
                        <li>Work without structure and consistency</li>
                      </ul>
                    </div>
                    <div className="bg-pink-50 dark:bg-pink-950/30 p-3 rounded-lg">
                      <p className="font-medium text-pink-700 dark:text-pink-400">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Best Used When: There are strong emotional swings and difficulty regulating behavior.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Motivational Interviewing */}
                <AccordionItem value="mi" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-left">Motivational Interviewing (MI)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">What It Is</h4>
                      <p className="text-muted-foreground">A conversational approach that helps people explore their own reasons for change.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What It Helps With</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Reducing resistance</li>
                        <li>Increasing openness</li>
                        <li>Early engagement</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">What It Doesn't Do Well</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Create structure</li>
                        <li>Maintain long-term sobriety</li>
                        <li>Replace consequences</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                      <p className="font-medium text-green-700 dark:text-green-400">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Best Used When: Someone is ambivalent—not ready, but not closed.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Trauma-Informed Therapy */}
                <AccordionItem value="trauma" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-left">Trauma-Informed Therapy</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">What It Is</h4>
                      <p className="text-muted-foreground">An approach that recognizes trauma's impact on behavior and nervous system function.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What It Helps With</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Safety and trust</li>
                        <li>Understanding triggers</li>
                        <li>Reducing shame</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">What It Doesn't Do Well</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Stop addiction by itself</li>
                        <li>Replace accountability</li>
                        <li>Work during active substance use</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                      <p className="font-medium text-purple-700 dark:text-purple-400">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Best Used When: Stability is established and substance use is addressed.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* EMDR */}
                <AccordionItem value="emdr" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-indigo-600" />
                      <span className="font-semibold text-left">EMDR (Eye Movement Desensitization and Reprocessing)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">What It Is</h4>
                      <p className="text-muted-foreground">A structured therapy to process traumatic memories.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What It Helps With</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>PTSD symptoms</li>
                        <li>Trauma-related distress</li>
                        <li>Reducing emotional reactivity tied to past events</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">What It Doesn't Do Well</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Treat active addiction</li>
                        <li>Build early coping skills</li>
                        <li>Work without stability</li>
                      </ul>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg">
                      <p className="font-medium text-indigo-700 dark:text-indigo-400">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Best Used When: There is sobriety, safety, and emotional regulation capacity.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* MAT */}
                <AccordionItem value="mat" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Pill className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-left">Medication-Assisted Treatment (MAT)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">What It Is</h4>
                      <p className="text-muted-foreground">Use of medication to reduce cravings or withdrawal (e.g., buprenorphine, naltrexone).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What It Helps With</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Reducing cravings</li>
                        <li>Preventing overdose</li>
                        <li>Stabilizing brain chemistry</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">What It Doesn't Do Well</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Address behavior patterns</li>
                        <li>Build coping skills</li>
                        <li>Replace therapy or structure</li>
                      </ul>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-950/30 p-3 rounded-lg">
                      <p className="font-medium text-teal-700 dark:text-teal-400">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Best Used When: Combined with counseling, accountability, and recovery supports.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Family Systems Therapy */}
                <AccordionItem value="family" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-left">Family Systems Therapy</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">What It Is</h4>
                      <p className="text-muted-foreground">Therapy that looks at how family patterns influence behavior.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What It Helps With</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Communication</li>
                        <li>Boundary clarity</li>
                        <li>Reducing blame</li>
                        <li>Family healing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">What It Doesn't Do Well</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Treat active addiction alone</li>
                        <li>Replace individual accountability</li>
                        <li>Work without boundaries</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
                      <p className="font-medium text-orange-700 dark:text-orange-400">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Best Used When: Addiction is being addressed and families are ready to change their roles.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Group Therapy */}
                <AccordionItem value="group" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold text-left">Group Therapy</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">What It Is</h4>
                      <p className="text-muted-foreground">Therapy delivered in a group setting with peers.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What It Helps With</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Reducing isolation</li>
                        <li>Accountability</li>
                        <li>Perspective-taking</li>
                        <li>Shared learning</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">What It Doesn't Do Well</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Provide individualized care alone</li>
                        <li>Replace higher levels of treatment</li>
                      </ul>
                    </div>
                    <div className="bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-lg">
                      <p className="font-medium text-cyan-700 dark:text-cyan-400">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Best Used When: As part of a broader treatment plan.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Residential / Inpatient */}
                <AccordionItem value="residential" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-slate-600" />
                      <span className="font-semibold text-left">Residential / Inpatient Treatment</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">What It Is</h4>
                      <p className="text-muted-foreground">Highly structured, immersive care away from everyday triggers.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What It Helps With</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Interrupting use</li>
                        <li>Stabilization</li>
                        <li>Intensive support</li>
                        <li>Assessment</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">What It Doesn't Do Well</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Guarantee long-term recovery without aftercare</li>
                        <li>Replace ongoing support</li>
                      </ul>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950/30 p-3 rounded-lg">
                      <p className="font-medium text-slate-700 dark:text-slate-400">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Best Used When: There is high risk, instability, or repeated failed attempts.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Why Modalities Fail */}
            <Card className="mb-8 border-red-500/30 bg-red-50/50 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-400">Why Modalities "Fail" (When They Aren't the Problem)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Therapy often appears to fail when:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Substance use is ongoing</li>
                  <li>Structure drops too quickly</li>
                  <li>Families expect therapy to replace boundaries</li>
                  <li>The wrong tool is used at the wrong time</li>
                </ul>
                <p className="text-foreground font-semibold italic border-l-4 border-red-500 pl-4 mt-4">
                  A hammer isn't broken because it doesn't work on screws.
                </p>
              </CardContent>
            </Card>

            {/* Better Questions */}
            <Card className="mb-8 border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">How Families Can Ask Better Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-muted-foreground mb-2">Instead of:</h4>
                    <p className="text-muted-foreground italic">"Is this the best therapy?"</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Ask:</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>"What problem is this treating?"</li>
                      <li>"Is the timing right?"</li>
                      <li>"What support surrounds this?"</li>
                      <li>"What happens if this doesn't work?"</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Reframe */}
            <Card className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-400">A Critical Reframe for Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-semibold text-foreground">
                  Therapy supports recovery.<br />
                  It does not create recovery by itself.
                </p>
                <p className="text-muted-foreground">
                  Structure, accountability, boundaries, and time matter just as much as technique.
                </p>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-logo-green">Final Thought</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Understanding treatment modalities helps families:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Reduce confusion</li>
                  <li>Set realistic expectations</li>
                  <li>Avoid false hope or despair</li>
                  <li>Stay grounded in strategy rather than labels</li>
                </ul>
                <p className="text-lg font-semibold text-foreground mt-4 border-t pt-4">
                  Effective treatment is not about finding the perfect therapy.<br />
                  It's about matching the right tools to the right stage.
                </p>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-logo-green">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/why-willpower-fails">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Why Willpower Fails Guide
                    </Button>
                  </Link>
                  <Link to="/mental-health-vs-substance-induced">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Mental Health vs. Substance-Induced Symptoms
                    </Button>
                  </Link>
                  <Link to="/addiction-progression-timeline">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Addiction Progression Timeline
                    </Button>
                  </Link>
                  <Link to="/aftercare-checklist">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Aftercare Readiness Checklist
                    </Button>
                  </Link>
                  <Link to="/family-advocacy-toolkit">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Family Advocacy Toolkit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        
          <RelatedResources currentPath="/treatment-modalities" />
</main>
      </div>
    </>
  );
}
