import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, Download, Target, AlertTriangle, CheckCircle, ArrowRight, Layers, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

export default function MatchingModality() {
  useGuideTracking("/matching-modality", "Matching the Modality to the Problem");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Matching the Modality to the Problem | Sober Helpline</title>
        <meta name="description" content="Learn how to choose the right type of help for addiction recovery. A guide to matching treatment modalities to specific problems and stages of recovery." />
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

            <ToolBrandHeader
              title="Matching the Modality to the Problem"
              subtitle="How to choose the right type of help — without guesswork. Understanding which treatment approaches work for which problems and at which stages."
              clinicalNote="Based on ASAM treatment matching criteria and evidence-based practice guidelines from NIDA (National Institute on Drug Abuse)."
            />

            {/* Why This Guide Matters */}
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-logo-blue">Why This Guide Matters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families are often overwhelmed by recommendations:</p>
                <ul className="space-y-2 text-muted-foreground italic">
                  <li>"They need CBT."</li>
                  <li>"They need trauma therapy."</li>
                  <li>"They need DBT."</li>
                  <li>"They need meds."</li>
                  <li>"They need family therapy."</li>
                </ul>
                <p className="text-muted-foreground">When these don't work, families conclude:</p>
                <ul className="list-disc list-inside text-muted-foreground ml-4">
                  <li>"Treatment doesn't work," or</li>
                  <li>"They're not trying."</li>
                </ul>
                <p className="text-foreground font-medium">Often, neither is true.</p>
                <p className="text-lg font-semibold text-foreground bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                  Most treatment failures are matching failures—not motivation failures.
                </p>
              </CardContent>
            </Card>

            {/* Core Principle */}
            <Card className="mb-8 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-400">The Core Principle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-semibold text-foreground">
                  The modality must match the primary problem and the current stage of recovery.
                </p>
                <p className="text-muted-foreground">No therapy works well when:</p>
                <ul className="list-disc list-inside space-y-1 text-foreground font-medium ml-4">
                  <li>The person is intoxicated or unstable</li>
                  <li>The level of care is too low</li>
                  <li>The timing is wrong</li>
                  <li>Structure is missing</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 1 */}
            <Card className="mb-6 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">1</span>
                  Identify the Primary Problem (Not the Loudest One)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Families often chase the most visible symptom. Instead, identify the <strong>primary driver right now</strong>.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Common primary problems include:</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Active substance use</li>
                      <li>Craving and relapse cycles</li>
                      <li>Emotional dysregulation</li>
                      <li>Trauma symptoms</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">&nbsp;</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Poor impulse control</li>
                      <li>Cognitive distortions</li>
                      <li>Family chaos or enabling</li>
                      <li>Lack of structure or accountability</li>
                    </ul>
                  </div>
                </div>
                <p className="text-foreground font-medium bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                  Only one or two are usually primary at a time.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="mb-6 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400 flex items-center gap-2">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">2</span>
                  Match the Problem to the Modality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {/* Active Substance Use */}
                  <AccordionItem value="active-use" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold text-left">When the Primary Problem Is Active Substance Use</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> What Helps Most
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>Detox (if needed)</li>
                          <li>Residential or intensive outpatient treatment</li>
                          <li>Medication-Assisted Treatment (MAT)</li>
                          <li>Monitoring and accountability</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> What Often Fails
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>Insight-based therapy alone</li>
                          <li>Trauma processing</li>
                          <li>Family therapy without boundaries</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Craving & Relapse */}
                  <AccordionItem value="craving" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold text-left">When the Primary Problem Is Craving & Relapse</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> What Helps Most
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>MAT</li>
                          <li>Relapse prevention planning</li>
                          <li>Structured aftercare</li>
                          <li>Contingency management</li>
                          <li>Sober living</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> What Often Fails
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>Talk therapy without structure</li>
                          <li>Motivational conversations alone</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Emotional Dysregulation */}
                  <AccordionItem value="emotional" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold text-left">When the Primary Problem Is Emotional Dysregulation</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> What Helps Most
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>DBT</li>
                          <li>Skills-based group therapy</li>
                          <li>Consistent routines</li>
                          <li>Clear boundaries</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> What Often Fails
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>Deep trauma processing too early</li>
                          <li>Unstructured outpatient therapy</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Trauma Symptoms */}
                  <AccordionItem value="trauma" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold text-left">When the Primary Problem Is Trauma Symptoms</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> What Helps Most
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>Trauma-informed therapy</li>
                          <li>EMDR (when stable)</li>
                          <li>Somatic or regulation-based approaches</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> What Often Fails
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>Trauma work during active use</li>
                          <li>Processing without coping skills</li>
                          <li>Removing accountability "because of trauma"</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Impulsivity */}
                  <AccordionItem value="impulsivity" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold text-left">When the Primary Problem Is Impulsivity & Poor Judgment</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> What Helps Most
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>Structure and supervision</li>
                          <li>DBT skills</li>
                          <li>External accountability</li>
                          <li>Reduced access to triggers</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> What Often Fails
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>Relying on insight</li>
                          <li>Trusting promises</li>
                          <li>Giving autonomy too soon</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Cognitive Distortions */}
                  <AccordionItem value="cognitive" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold text-left">When the Primary Problem Is Cognitive Distortions</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> What Helps Most
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>CBT</li>
                          <li>Thought-challenging exercises</li>
                          <li>Behavioral experiments</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> What Often Fails
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>CBT during intoxication</li>
                          <li>Expecting logic to override craving</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Family System Chaos */}
                  <AccordionItem value="family" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold text-left">When the Primary Problem Is Family System Chaos</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> What Helps Most
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>Family systems therapy</li>
                          <li>Boundary coaching</li>
                          <li>Education for families</li>
                          <li>Separate family recovery work</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> What Often Fails
                        </h4>
                        <ul className="list-disc list-inside text-muted-foreground ml-2">
                          <li>Family therapy without boundaries</li>
                          <li>Focusing only on the identified patient</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="mb-6 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-700 dark:text-purple-400 flex items-center gap-2">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">3</span>
                  Consider the Stage of Recovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Early / Unstable</h4>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      <li>Prioritize safety, structure, and containment</li>
                      <li>Avoid deep emotional processing</li>
                      <li>Expect inconsistency</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Middle / Stabilizing</h4>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      <li>Add skill-building therapies</li>
                      <li>Introduce trauma-informed work cautiously</li>
                      <li>Increase responsibility gradually</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Later / Maintenance</h4>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      <li>Focus on identity, meaning, and long-term goals</li>
                      <li>Deepen trauma work if appropriate</li>
                      <li>Strengthen relationships</li>
                    </ul>
                  </div>
                </div>
                <p className="text-foreground font-medium mt-4 text-center bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                  The same modality can help—or harm—depending on timing.
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="mb-6 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-orange-700 dark:text-orange-400 flex items-center gap-2">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm">4</span>
                  Build a Layered Plan (Not a Single Fix)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Effective treatment usually includes:</p>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-700 dark:text-orange-400 font-medium">
                    One primary modality
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-700 dark:text-orange-400 font-medium">
                    One or two supporting modalities
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-700 dark:text-orange-400 font-medium">
                    External structure
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-700 dark:text-orange-400 font-medium">
                    Family boundaries and education
                  </span>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Example:</p>
                  <p className="font-semibold text-foreground">
                    MAT + IOP + DBT skills group + family boundary work
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 5 */}
            <Card className="mb-8 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-sm">5</span>
                  Know When to Pivot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">A modality may need to change if:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Substance use continues</li>
                  <li>Structure drops too quickly</li>
                  <li>Symptoms worsen</li>
                  <li>Families are carrying the system</li>
                </ul>
                <p className="text-foreground font-semibold flex items-center gap-2 bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-lg">
                  <RefreshCw className="h-5 w-5" />
                  Changing strategy is not failure—it's responsiveness.
                </p>
              </CardContent>
            </Card>

            {/* Quick Matching Guide */}
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-logo-blue flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  A Quick Matching Guide (At a Glance)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold text-foreground">Problem</th>
                        <th className="text-left py-2 font-semibold text-foreground">→</th>
                        <th className="text-left py-2 font-semibold text-foreground">Best Fit</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2">Active use</td>
                        <td className="py-2">→</td>
                        <td className="py-2">Structured treatment + MAT</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Relapse cycles</td>
                        <td className="py-2">→</td>
                        <td className="py-2">Aftercare + monitoring</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Emotional chaos</td>
                        <td className="py-2">→</td>
                        <td className="py-2">DBT</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Trauma symptoms</td>
                        <td className="py-2">→</td>
                        <td className="py-2">Trauma therapy (after stabilization)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Impulsivity</td>
                        <td className="py-2">→</td>
                        <td className="py-2">Structure + skills</td>
                      </tr>
                      <tr>
                        <td className="py-2">Family burnout</td>
                        <td className="py-2">→</td>
                        <td className="py-2">Family recovery work</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* What Families Should Stop Doing */}
            <Card className="mb-8 border-red-500/30 bg-red-50/50 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-400">What Families Should Stop Doing</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Chasing "the best" therapy</li>
                  <li>Expecting one modality to do everything</li>
                  <li>Ignoring timing and structure</li>
                  <li>Using insight as proof of readiness</li>
                  <li>Blaming themselves when a tool doesn't work</li>
                </ul>
              </CardContent>
            </Card>

            {/* Grounding Reframe */}
            <Card className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-400">A Grounding Reframe for Families</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">
                  Treatment is not about finding the perfect approach.<br />
                  It's about matching the right tools to the right problems—at the right time.
                </p>
              </CardContent>
            </Card>

            {/* Reflection Exercise */}
            <Card className="mb-8 border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20">
              <CardHeader>
                <CardTitle className="text-indigo-700 dark:text-indigo-400">Reflection Exercise (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Answer honestly:</p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li>What is the primary problem right now?</li>
                  <li>What modality is addressing that problem?</li>
                  <li>What is being asked to do work it can't do?</li>
                  <li>Where is structure missing?</li>
                  <li>What needs to change—not who?</li>
                </ol>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-logo-blue">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/treatment-modalities">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Treatment Modalities Explained
                    </Button>
                  </Link>
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
        
          <RelatedResources currentPath="/matching-modality" />
</main>
      </div>
    </>
  );
}
