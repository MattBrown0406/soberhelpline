import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, Download, Clock, AlertTriangle, CheckCircle, Brain, Heart, Users, MessageCircle, Pill, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

export default function TherapyTimingGuide() {
  useGuideTracking("/therapy-timing-guide", "Why Some Therapies Fail at the Wrong Time");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Why Some Therapies Fail at the Wrong Time | Sober Helpline</title>
        <meta name="description" content="Understanding why timing matters in addiction recovery. Learn about readiness, stages of recovery, and why good therapies can fail when applied too early." />
      </Helmet>

      <div className="min-h-screen bg-background print:bg-white">
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
              <Clock className="h-12 w-12 text-primary mx-auto mb-4 print:hidden" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                Why Some Therapies Fail at the Wrong Time
              </h1>
              <p className="text-xl text-muted-foreground">
                Understanding Timing, Readiness, and the Stages of Recovery
              </p>
            </div>

            {/* Why This Guide Matters */}
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-logo-green">Why This Guide Matters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families are often told:</p>
                <ul className="space-y-2 text-muted-foreground italic">
                  <li>"This therapy is evidence-based."</li>
                  <li>"This is the gold standard."</li>
                  <li>"This works really well."</li>
                </ul>
                <p className="text-foreground font-medium">And yet… it didn't.</p>
                <p className="text-muted-foreground">When therapy fails, families often conclude:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>The therapist wasn't good</li>
                  <li>The program was wrong</li>
                  <li>Their loved one didn't try</li>
                  <li>Recovery isn't possible</li>
                </ul>
                <p className="text-foreground font-medium">Often, none of those are true.</p>
                <p className="text-lg font-semibold text-foreground bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                  Many therapies fail not because they're ineffective—but because the timing is wrong.
                </p>
              </CardContent>
            </Card>

            {/* Core Principle */}
            <Card className="mb-8 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-400">A Core Principle Families Need to Understand</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-semibold text-foreground">
                  Different stages of addiction and recovery require different kinds of help.
                </p>
                <ul className="space-y-2 text-foreground font-medium">
                  <li>Therapy is not interchangeable.</li>
                  <li>What helps during stability can harm during chaos.</li>
                  <li>What heals trauma later can overwhelm someone early on.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Three Broad Stages */}
            <Card className="mb-8 border-primary/30">
              <CardHeader>
                <CardTitle className="text-logo-green flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  The Three Broad Stages to Keep in Mind
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <h4 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                      Active Use or Severe Instability
                    </h4>
                    <p className="text-sm font-medium text-foreground mb-2">Primary needs:</p>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      <li>Safety</li>
                      <li>Containment</li>
                      <li>External structure</li>
                      <li>Reduced access to substances</li>
                      <li>Medical and psychiatric stabilization</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                      Early Stabilization
                    </h4>
                    <p className="text-sm font-medium text-foreground mb-2">Primary needs:</p>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      <li>Predictability</li>
                      <li>Skill-building</li>
                      <li>Accountability</li>
                      <li>Support without overwhelm</li>
                      <li>Clear boundaries</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                      Sustained Recovery
                    </h4>
                    <p className="text-sm font-medium text-foreground mb-2">Primary needs:</p>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      <li>Meaning-making</li>
                      <li>Trauma processing</li>
                      <li>Identity repair</li>
                      <li>Relationship healing</li>
                      <li>Long-term growth</li>
                    </ul>
                  </div>
                </div>
                <p className="text-center font-medium text-foreground mt-4 bg-primary/10 p-3 rounded-lg">
                  Each stage requires different tools.
                </p>
              </CardContent>
            </Card>

            {/* Why Specific Therapies Fail */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-logo-green mb-4">Why Specific Therapies Fail at the Wrong Time</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {/* Insight-Based Therapy */}
                <AccordionItem value="insight" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-left">Why Insight-Based Therapy Often Fails Early</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What Families See</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Insightful conversations</li>
                        <li>Apologies</li>
                        <li>Awareness of harm</li>
                        <li>Agreement with recommendations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Why It Fails Early
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Insight does not equal impulse control</li>
                        <li>Stress overrides understanding</li>
                        <li>Craving bypasses logic</li>
                        <li>Behavior doesn't change under pressure</li>
                      </ul>
                    </div>
                    <p className="font-semibold text-foreground bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                      Insight is awareness—not capacity.
                    </p>
                    <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                      <p className="font-medium text-green-700 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        When Insight Therapy Helps: Later stages, when stability exists and skills are in place.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Trauma Therapy */}
                <AccordionItem value="trauma" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-left">Why Trauma Therapy Can Backfire Too Soon</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What Families Hope</h4>
                      <p className="text-muted-foreground italic">"If we heal the trauma, the addiction will stop."</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> What Often Happens Instead
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Emotional flooding</li>
                        <li>Increased craving</li>
                        <li>Dissociation</li>
                        <li>Relapse</li>
                        <li>Therapy avoidance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Why</h4>
                      <p className="text-muted-foreground mb-2">Trauma therapy requires:</p>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Emotional regulation</li>
                        <li>Safety</li>
                        <li>Sobriety</li>
                        <li>Internal resources</li>
                      </ul>
                    </div>
                    <p className="font-semibold text-foreground bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                      Without those, therapy can overwhelm the nervous system.
                    </p>
                    <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                      <p className="font-medium text-green-700 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        When Trauma Therapy Helps: After stabilization, with coping skills and structure in place.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Family Therapy */}
                <AccordionItem value="family" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-left">Why Family Therapy Sometimes Makes Things Worse</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What Families Expect</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Better communication</li>
                        <li>Accountability</li>
                        <li>Repair</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> What Can Happen Instead
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Manipulation in session</li>
                        <li>Blame-shifting</li>
                        <li>Pressure on family to soften boundaries</li>
                        <li>Reinforcement of denial</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">When Family Therapy Fails:</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>When addiction is active</li>
                        <li>When boundaries aren't established</li>
                        <li>When safety isn't prioritized</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                      <p className="font-medium text-green-700 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        When It Helps: Once accountability exists and families are changing their roles.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Motivational Conversations */}
                <AccordionItem value="motivational" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-left">Why Motivational Conversations Stop Working</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What Families Try</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Encouragement</li>
                        <li>Logic</li>
                        <li>Emotional appeals</li>
                        <li>Consequences explained repeatedly</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Why It Stops Working
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Motivation fluctuates</li>
                        <li>Stress hijacks the brain</li>
                        <li>Repetition becomes noise</li>
                        <li>Resistance increases</li>
                      </ul>
                    </div>
                    <p className="font-semibold text-foreground bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                      Motivation alone cannot sustain change.
                    </p>
                    <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                      <p className="font-medium text-green-700 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        When Motivational Approaches Help: Early engagement—not long-term maintenance.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Medication Alone */}
                <AccordionItem value="medication" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Pill className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-left">Why Medication Alone Is Not Enough</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What Families Hope</h4>
                      <p className="text-muted-foreground italic">"Once the meds are right, everything will change."</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> What Actually Happens
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Some symptoms improve</li>
                        <li>Behavior patterns remain</li>
                        <li>Accountability is still needed</li>
                        <li>Structure is still required</li>
                      </ul>
                    </div>
                    <p className="font-semibold text-foreground bg-teal-50 dark:bg-teal-950/30 p-3 rounded-lg">
                      Medication supports recovery—it does not replace it.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Why Structure Is Often Missing */}
            <Card className="mb-8 border-red-500/30 bg-red-50/50 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-400">Why Structure Is Often Missing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Many therapies fail because:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>The level of care is too low</li>
                  <li>Accountability drops too quickly</li>
                  <li>Freedom increases before stability</li>
                  <li>Families absorb the structure instead</li>
                </ul>
                <p className="text-lg font-semibold text-foreground mt-4">
                  Structure does what willpower cannot.
                </p>
              </CardContent>
            </Card>

            {/* Common Family Pattern */}
            <Card className="mb-8 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-400">A Common Family Pattern (and How to Reframe It)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Pattern:</h4>
                    <p className="text-muted-foreground italic">"Therapy didn't work, so we'll try something else."</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Reframe:</h4>
                    <p className="text-foreground font-medium">"What does this stage require that therapy can't provide yet?"</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What Families Can Do Differently */}
            <Card className="mb-8 border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">What Families Can Do Differently</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Ask about timing, not just modality</li>
                  <li>Match therapy to the current stage</li>
                  <li>Protect boundaries even when therapy begins</li>
                  <li>Expect uneven progress</li>
                  <li>Avoid escalating emotional investment when structure is missing</li>
                </ul>
              </CardContent>
            </Card>

            {/* How to Know If Timing Is the Issue */}
            <Card className="mb-8 border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20">
              <CardHeader>
                <CardTitle className="text-indigo-700 dark:text-indigo-400">How to Know If Timing Is the Issue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Consider:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Is substance use still active?</li>
                  <li>Is there consistent structure?</li>
                  <li>Are skills in place to manage emotions?</li>
                  <li>Is accountability external or family-driven?</li>
                  <li>Are expectations realistic for this stage?</li>
                </ul>
                <p className="text-foreground font-semibold bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg mt-4">
                  If the answer is "no," timing—not therapy—may be the issue.
                </p>
              </CardContent>
            </Card>

            {/* Grounding Reframe */}
            <Card className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-400">A Grounding Reframe for Families</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">
                  Good tools used at the wrong time feel like failure.<br />
                  The solution is not more effort—but better sequencing.
                </p>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-logo-green">Final Thought</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Therapy is powerful—but only when:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>The nervous system is stable enough</li>
                  <li>The brain is supported</li>
                  <li>Structure is present</li>
                  <li>The stage is respected</li>
                </ul>
                <div className="border-t pt-4 mt-4">
                  <p className="text-foreground font-medium">
                    Families don't fail because therapy didn't work.<br />
                    They struggle because the right help arrived too early—or too late.
                  </p>
                  <p className="text-lg font-semibold text-logo-green mt-2">
                    Understanding timing restores hope—and strategy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-logo-green">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/treatment-modalities">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Treatment Modalities Explained
                    </Button>
                  </Link>
                  <Link to="/matching-modality">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Matching the Modality to the Problem
                    </Button>
                  </Link>
                  <Link to="/why-willpower-fails">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Why Willpower Fails Guide
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
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
