import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Target, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

interface Scenario1State {
  isEmergency: string;
  boundary: string;
  emotions: string[];
  plannedResponse: string;
  consequence: string;
  supportContact: string;
}

interface Scenario2State {
  pastPatterns: string;
  allowsNoAccountability: string;
  boundary: string;
  calmResponse: string;
  supportiveAlternative: string;
}

interface Scenario3State {
  withinControl: string;
  notWithinControl: string;
  enablingTemptation: string;
  actionPlanSays: string;
  manageAnxiety: string;
}

interface Scenario4State {
  alignedWithValues: string;
  boundaryNeeded: string;
  addressWithoutMonitoring: string;
  whatConsistencyLooksLike: string;
}

interface Scenario5State {
  impactOnPlan: string;
  boundaryWithFamily: string;
  guidingValues: string;
  unityStatement: string;
}

interface ReflectionState {
  hardestScenario: string;
  likelyToAbandon: string;
  supportNeeded: string;
}

export default function ScenarioExercise() {
  useGuideTracking("/scenario-exercise", "Family Recovery Scenario Exercise");
  const [scenario1, setScenario1] = useState<Scenario1State>({
    isEmergency: "",
    boundary: "",
    emotions: [],
    plannedResponse: "",
    consequence: "",
    supportContact: ""
  });

  const [scenario2, setScenario2] = useState<Scenario2State>({
    pastPatterns: "",
    allowsNoAccountability: "",
    boundary: "",
    calmResponse: "",
    supportiveAlternative: ""
  });

  const [scenario3, setScenario3] = useState<Scenario3State>({
    withinControl: "",
    notWithinControl: "",
    enablingTemptation: "",
    actionPlanSays: "",
    manageAnxiety: ""
  });

  const [scenario4, setScenario4] = useState<Scenario4State>({
    alignedWithValues: "",
    boundaryNeeded: "",
    addressWithoutMonitoring: "",
    whatConsistencyLooksLike: ""
  });

  const [scenario5, setScenario5] = useState<Scenario5State>({
    impactOnPlan: "",
    boundaryWithFamily: "",
    guidingValues: "",
    unityStatement: ""
  });

  const [reflection, setReflection] = useState<ReflectionState>({
    hardestScenario: "",
    likelyToAbandon: "",
    supportNeeded: ""
  });

  const scenario1Emotions = ["Fear", "Guilt", "Panic", "Anger", "Sadness"];

  const handleEmotionToggle = (emotion: string) => {
    if (scenario1.emotions.includes(emotion)) {
      setScenario1({ ...scenario1, emotions: scenario1.emotions.filter(e => e !== emotion) });
    } else {
      setScenario1({ ...scenario1, emotions: [...scenario1.emotions, emotion] });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Family Recovery Scenario Exercise | Sober Helpline</title>
        <meta name="description" content="Practice recovery-centered decisions before a crisis hits. Prepare responses for common challenging situations." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header - Hidden on print */}
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

        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Link & Print Button - Hidden on print */}
            <div className="flex items-center justify-between mb-6 print:hidden">
              <Link
                to="/family-education"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Family Resources
              </Link>
              <Button onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Print Document
              </Button>
            </div>

            {/* Printable Document Content */}
            <div className="bg-white dark:bg-card rounded-lg shadow-lg p-8 md:p-12 print:shadow-none print:p-0">
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b">
                <Target className="h-12 w-12 text-primary mx-auto mb-4 print:hidden" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
                  Family Recovery Scenario Exercise
                </h1>
                <p className="text-lg text-muted-foreground">
                  Practicing Recovery-Centered Decisions Before a Crisis Hits
                </p>
              </div>

              {/* Purpose Section */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-3">Purpose</h2>
                <p className="text-muted-foreground mb-4">
                  Families often abandon boundaries and action plans during emotional moments. This exercise allows you to practice responses in advance, so decisions are made from clarity—not fear, guilt, or urgency.
                </p>
                <p className="font-semibold text-primary italic">
                  You are not predicting failure. You are preparing for reality.
                </p>
              </section>

              {/* How to Use */}
              <section className="mb-8 p-4 bg-muted/50 rounded-lg print:bg-gray-100">
                <h2 className="text-lg font-bold mb-3">How to Use This Exercise</h2>
                <ul className="space-y-2 text-sm">
                  <li>• Complete each scenario slowly.</li>
                  <li>• Answer honestly, not ideally.</li>
                  <li>• Reference your Family Recovery Action Plan as you respond.</li>
                  <li>• <strong>There are no perfect answers—only consistent ones.</strong></li>
                </ul>
              </section>

              {/* Scenario 1 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Scenario 1: The Late-Night Crisis Call
                </h2>

                <div className="p-4 bg-muted/30 rounded-lg mb-4 print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Situation</h3>
                  <p className="text-sm text-muted-foreground">
                    It's 11:30 PM. Your loved one calls, intoxicated and emotional. They say they've been kicked out of where they're staying and "have nowhere else to go." They are crying and accusing you of abandoning them.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="p-4 border rounded-lg">
                    <Label className="font-medium mb-3 block">Is this a true emergency according to your action plan?</Label>
                    <RadioGroup
                      value={scenario1.isEmergency}
                      onValueChange={(value) => setScenario1({ ...scenario1, isEmergency: value })}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="s1-emergency-yes" />
                        <Label htmlFor="s1-emergency-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="s1-emergency-no" />
                        <Label htmlFor="s1-emergency-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="s1-boundary" className="font-medium mb-2 block">Which boundary or non-negotiable applies here?</Label>
                    <Textarea
                      id="s1-boundary"
                      value={scenario1.boundary}
                      onChange={(e) => setScenario1({ ...scenario1, boundary: e.target.value })}
                      placeholder="Write the boundary that applies..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div className="p-4 border rounded-lg">
                    <Label className="font-medium mb-3 block">What emotions does this scenario trigger for you?</Label>
                    <div className="flex flex-wrap gap-4">
                      {scenario1Emotions.map(emotion => (
                        <label key={emotion} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={scenario1.emotions.includes(emotion)}
                            onCheckedChange={() => handleEmotionToggle(emotion)}
                          />
                          <span className="text-sm">{emotion}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="s1-response" className="font-medium mb-2 block">What is your planned response (not your impulse)?</Label>
                    <Textarea
                      id="s1-response"
                      value={scenario1.plannedResponse}
                      onChange={(e) => setScenario1({ ...scenario1, plannedResponse: e.target.value })}
                      placeholder="Describe your planned, values-based response..."
                      className="min-h-[80px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s1-consequence" className="font-medium mb-2 block">What consequence are you willing to allow to occur?</Label>
                    <Textarea
                      id="s1-consequence"
                      value={scenario1.consequence}
                      onChange={(e) => setScenario1({ ...scenario1, consequence: e.target.value })}
                      placeholder="Name the natural consequence you will allow..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s1-support" className="font-medium mb-2 block">Who can you contact afterward for support?</Label>
                    <Textarea
                      id="s1-support"
                      value={scenario1.supportContact}
                      onChange={(e) => setScenario1({ ...scenario1, supportContact: e.target.value })}
                      placeholder="Name specific people you can reach out to..."
                      className="min-h-[40px] print:border-dashed"
                    />
                  </div>
                </div>
              </section>

              {/* Scenario 2 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Scenario 2: The Promise to Change
                </h2>

                <div className="p-4 bg-muted/30 rounded-lg mb-4 print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Situation</h3>
                  <p className="text-sm text-muted-foreground">
                    After weeks of instability, your loved one approaches you sober and calm. They promise this time is different. They ask for money, transportation, or housing to "get back on their feet."
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="s2-patterns" className="font-medium mb-2 block">What past patterns does this resemble?</Label>
                    <Textarea
                      id="s2-patterns"
                      value={scenario2.pastPatterns}
                      onChange={(e) => setScenario2({ ...scenario2, pastPatterns: e.target.value })}
                      placeholder="Describe similar situations from the past..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div className="p-4 border rounded-lg">
                    <Label className="font-medium mb-3 block">Does your action plan allow support without accountability?</Label>
                    <RadioGroup
                      value={scenario2.allowsNoAccountability}
                      onValueChange={(value) => setScenario2({ ...scenario2, allowsNoAccountability: value })}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="s2-accountability-yes" />
                        <Label htmlFor="s2-accountability-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="s2-accountability-no" />
                        <Label htmlFor="s2-accountability-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="s2-boundary" className="font-medium mb-2 block">What boundary applies here?</Label>
                    <Textarea
                      id="s2-boundary"
                      value={scenario2.boundary}
                      onChange={(e) => setScenario2({ ...scenario2, boundary: e.target.value })}
                      placeholder="State the relevant boundary..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s2-calm" className="font-medium mb-2 block">Write your calm, repeatable response:</Label>
                    <Textarea
                      id="s2-calm"
                      value={scenario2.calmResponse}
                      onChange={(e) => setScenario2({ ...scenario2, calmResponse: e.target.value })}
                      placeholder="Write the exact words you would say..."
                      className="min-h-[80px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s2-alternative" className="font-medium mb-2 block">What supportive alternative (if any) aligns with recovery?</Label>
                    <Textarea
                      id="s2-alternative"
                      value={scenario2.supportiveAlternative}
                      onChange={(e) => setScenario2({ ...scenario2, supportiveAlternative: e.target.value })}
                      placeholder="Describe recovery-aligned support options..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>
                </div>
              </section>

              {/* Scenario 3 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Scenario 3: Treatment Resistance
                </h2>

                <div className="p-4 bg-muted/30 rounded-lg mb-4 print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Situation</h3>
                  <p className="text-sm text-muted-foreground">
                    Your loved one refuses treatment, saying it "won't work" or that they can stop on their own. They ask you to give them more time.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="s3-control" className="font-medium mb-2 block">What part of this is within your control?</Label>
                    <Textarea
                      id="s3-control"
                      value={scenario3.withinControl}
                      onChange={(e) => setScenario3({ ...scenario3, withinControl: e.target.value })}
                      placeholder="List what you can control..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s3-not-control" className="font-medium mb-2 block">What part is not?</Label>
                    <Textarea
                      id="s3-not-control"
                      value={scenario3.notWithinControl}
                      onChange={(e) => setScenario3({ ...scenario3, notWithinControl: e.target.value })}
                      placeholder="List what you cannot control..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s3-enabling" className="font-medium mb-2 block">What enabling behavior are you tempted to continue?</Label>
                    <Textarea
                      id="s3-enabling"
                      value={scenario3.enablingTemptation}
                      onChange={(e) => setScenario3({ ...scenario3, enablingTemptation: e.target.value })}
                      placeholder="Be honest about your impulses..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s3-action" className="font-medium mb-2 block">What does your action plan say you will do instead?</Label>
                    <Textarea
                      id="s3-action"
                      value={scenario3.actionPlanSays}
                      onChange={(e) => setScenario3({ ...scenario3, actionPlanSays: e.target.value })}
                      placeholder="Reference your action plan..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s3-anxiety" className="font-medium mb-2 block">How will you manage the anxiety that comes with holding your boundary?</Label>
                    <Textarea
                      id="s3-anxiety"
                      value={scenario3.manageAnxiety}
                      onChange={(e) => setScenario3({ ...scenario3, manageAnxiety: e.target.value })}
                      placeholder="Describe your coping strategies..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>
                </div>
              </section>

              {/* Scenario 4 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Scenario 4: Early Recovery Slips
                </h2>

                <div className="p-4 bg-muted/30 rounded-lg mb-4 print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Situation</h3>
                  <p className="text-sm text-muted-foreground">
                    Your loved one is newly sober but begins skipping meetings, avoiding accountability, and becoming defensive. They insist you're "overreacting."
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="p-4 border rounded-lg">
                    <Label className="font-medium mb-3 block">Is this behavior aligned with your values and non-negotiables?</Label>
                    <RadioGroup
                      value={scenario4.alignedWithValues}
                      onValueChange={(value) => setScenario4({ ...scenario4, alignedWithValues: value })}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="s4-aligned-yes" />
                        <Label htmlFor="s4-aligned-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="s4-aligned-no" />
                        <Label htmlFor="s4-aligned-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="s4-boundary" className="font-medium mb-2 block">What boundary or conversation is needed now—not later?</Label>
                    <Textarea
                      id="s4-boundary"
                      value={scenario4.boundaryNeeded}
                      onChange={(e) => setScenario4({ ...scenario4, boundaryNeeded: e.target.value })}
                      placeholder="Describe the immediate boundary or conversation..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s4-monitoring" className="font-medium mb-2 block">How can you address this without monitoring or controlling?</Label>
                    <Textarea
                      id="s4-monitoring"
                      value={scenario4.addressWithoutMonitoring}
                      onChange={(e) => setScenario4({ ...scenario4, addressWithoutMonitoring: e.target.value })}
                      placeholder="Describe a healthy approach..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s4-consistency" className="font-medium mb-2 block">What would consistency look like in this moment?</Label>
                    <Textarea
                      id="s4-consistency"
                      value={scenario4.whatConsistencyLooksLike}
                      onChange={(e) => setScenario4({ ...scenario4, whatConsistencyLooksLike: e.target.value })}
                      placeholder="Define consistent behavior..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>
                </div>
              </section>

              {/* Scenario 5 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Scenario 5: Family Disagreement
                </h2>

                <div className="p-4 bg-muted/30 rounded-lg mb-4 print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Situation</h3>
                  <p className="text-sm text-muted-foreground">
                    Other family members disagree with your boundaries and believe you are being too harsh. They undermine your plan by offering help behind your back.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="s5-impact" className="font-medium mb-2 block">How does this impact your family recovery plan?</Label>
                    <Textarea
                      id="s5-impact"
                      value={scenario5.impactOnPlan}
                      onChange={(e) => setScenario5({ ...scenario5, impactOnPlan: e.target.value })}
                      placeholder="Describe the impact..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s5-family-boundary" className="font-medium mb-2 block">What boundary is needed with other family members?</Label>
                    <Textarea
                      id="s5-family-boundary"
                      value={scenario5.boundaryWithFamily}
                      onChange={(e) => setScenario5({ ...scenario5, boundaryWithFamily: e.target.value })}
                      placeholder="State the boundary with family..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s5-values" className="font-medium mb-2 block">What values are guiding your decision—not their opinions?</Label>
                    <Textarea
                      id="s5-values"
                      value={scenario5.guidingValues}
                      onChange={(e) => setScenario5({ ...scenario5, guidingValues: e.target.value })}
                      placeholder="Name your guiding values..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="s5-unity" className="font-medium mb-2 block">Write a statement that reinforces unity and clarity:</Label>
                    <Textarea
                      id="s5-unity"
                      value={scenario5.unityStatement}
                      onChange={(e) => setScenario5({ ...scenario5, unityStatement: e.target.value })}
                      placeholder="Write a unifying statement..."
                      className="min-h-[80px] print:border-dashed"
                    />
                  </div>
                </div>
              </section>

              {/* Reflection */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Reflection: Patterns & Growth
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Answer honestly:</p>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="ref-hardest" className="font-medium mb-2 block">Which scenario was hardest for you? Why?</Label>
                    <Textarea
                      id="ref-hardest"
                      value={reflection.hardestScenario}
                      onChange={(e) => setReflection({ ...reflection, hardestScenario: e.target.value })}
                      placeholder="Reflect on which scenario challenged you most..."
                      className="min-h-[80px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ref-abandon" className="font-medium mb-2 block">Where are you most likely to abandon the plan?</Label>
                    <Textarea
                      id="ref-abandon"
                      value={reflection.likelyToAbandon}
                      onChange={(e) => setReflection({ ...reflection, likelyToAbandon: e.target.value })}
                      placeholder="Identify your vulnerable points..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ref-support" className="font-medium mb-2 block">What support do you need to strengthen consistency?</Label>
                    <Textarea
                      id="ref-support"
                      value={reflection.supportNeeded}
                      onChange={(e) => setReflection({ ...reflection, supportNeeded: e.target.value })}
                      placeholder="Describe the support you need..."
                      className="min-h-[60px] print:border-dashed"
                    />
                  </div>
                </div>
              </section>

              {/* Skill-Building Reframe */}
              <section className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5 print:bg-gray-50">
                <h2 className="text-lg font-bold text-logo-green mb-3">Skill-Building Reframe</h2>
                <p className="text-lg font-semibold text-center mb-4">
                  You don't rise to the level of your intentions in a crisis.<br />
                  <span className="text-primary">You fall to the level of your preparation.</span>
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  Practicing these responses now increases the likelihood that you will act in alignment with your values later.
                </p>
              </section>

              {/* Footer for print */}
              <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground print:block hidden">
                <p>Sober Helpline | (541) 241-5886 | www.soberhelpline.com</p>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
          @page {
            margin: 0.5in;
          }
          textarea {
            border: 1px dashed #999 !important;
            min-height: 60px !important;
            background: #fafafa !important;
          }
        }
      `}</style>
    </>
  );
}
