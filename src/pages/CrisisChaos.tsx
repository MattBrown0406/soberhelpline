import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

export default function CrisisChaos() {
  useGuideTracking("Crisis vs. Chaos Decision Guide", "/crisis-chaos");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Crisis vs. Chaos Decision Guide | Sober Helpline</title>
        <meta name="description" content="Learn to distinguish between true emergencies and emotionally charged chaos to respond in ways that support safety, boundaries, and long-term recovery." />
      </Helmet>

      <div className="min-h-screen bg-background">

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
              <ToolBrandHeader
                title="Crisis vs. Chaos"
                subtitle="A decision guide for families impacted by addiction. Learning to distinguish true emergencies from emotionally charged chaos changes everything."
                clinicalNote="Based on crisis intervention theory, SAMHSA's crisis response guidelines, and Al-Anon principles of detachment with love."
              />

              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b">
                <AlertTriangle className="h-12 w-12 text-primary mx-auto mb-4 print:hidden" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
                  Crisis vs. Chaos
                </h1>
                <p className="text-lg text-muted-foreground">
                  A Decision Guide for Families Impacted by Addiction
                </p>
              </div>

              {/* Purpose Section */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-3">Purpose</h2>
                <p className="text-muted-foreground mb-4">
                  Addiction creates constant urgency. Families are often trained—by repeated emergencies—to respond to everything as a crisis. This guide helps you distinguish between true emergencies and emotionally charged chaos, so you can respond in ways that support safety, boundaries, and long-term recovery.
                </p>
                <p className="font-semibold text-primary italic">
                  Not every urgent situation is a crisis. Responding as if it is often makes things worse.
                </p>
              </section>

              {/* Core Principle */}
              <section className="mb-8 p-6 bg-primary/10 rounded-lg border-2 border-primary/30 print:bg-gray-100">
                <h2 className="text-lg font-bold text-center mb-3">Core Principle</h2>
                <p className="text-center text-lg">
                  <strong>A crisis requires immediate action to protect life or safety.</strong><br />
                  <span className="text-primary font-semibold">Chaos demands boundaries, not rescue.</span>
                </p>
              </section>

              {/* Step 1 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Step 1: Pause Before You Decide
                </h2>
                <p className="text-muted-foreground mb-4">Before responding, ask yourself:</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-1"></span>
                    <span>Am I reacting out of fear, guilt, or panic?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-1"></span>
                    <span>Have I handled this situation before?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-1"></span>
                    <span>Does this require action right now, or does it feel urgent because emotions are high?</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                  <strong>If possible, take a 10–30 minute pause before responding.</strong> Urgency is often used—consciously or unconsciously—to bypass boundaries.
                </p>
              </section>

              {/* Step 2 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Step 2: Identify a TRUE Crisis
                </h2>
                <p className="text-muted-foreground mb-4">
                  A situation is a crisis if one or more of the following are present:
                </p>

                <div className="mb-6">
                  <h3 className="font-semibold text-destructive mb-3">True Crisis Indicators</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      Immediate medical danger (overdose, loss of consciousness, serious injury)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      Credible threats of self-harm or harm to others
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      Severe psychiatric instability requiring emergency evaluation
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      Immediate danger due to intoxication (e.g., driving under the influence)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      Unsafe living conditions involving minors or vulnerable adults
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      Legal situations requiring emergency intervention (e.g., arrest)
                    </li>
                  </ul>
                </div>

                <div className="p-4 border-2 border-primary/30 rounded-lg bg-primary/5 print:bg-gray-50">
                  <h3 className="font-semibold mb-3">Appropriate Responses to Crisis</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Call emergency services when needed</li>
                    <li>• Involve medical or psychiatric professionals</li>
                    <li>• Prioritize safety over comfort</li>
                    <li>• Follow established emergency protocols</li>
                  </ul>
                  <p className="mt-4 text-sm font-medium text-primary">
                    Important: Responding to a crisis does not mean removing all consequences. It means addressing safety first.
                  </p>
                </div>
              </section>

              {/* Step 3 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Step 3: Identify CHAOS (Commonly Mistaken for Crisis)
                </h2>
                <p className="text-muted-foreground mb-4">
                  Chaos often feels urgent but does not require emergency intervention.
                </p>

                <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                  <h3 className="font-semibold mb-3">Common Chaos Situations</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Emotional distress, panic, or intoxicated phone calls</li>
                    <li>• Being kicked out of housing due to substance use</li>
                    <li>• Financial emergencies caused by ongoing use</li>
                    <li>• Missed work, school, or responsibilities</li>
                    <li>• Relationship conflict or emotional manipulation</li>
                    <li>• Threats that appear dramatic but lack immediacy or credibility</li>
                    <li>• Requests for money, rides, or shelter during active use</li>
                  </ul>
                  <p className="mt-4 font-medium text-primary">
                    These situations are painful—but they are not emergencies.
                  </p>
                </div>
              </section>

              {/* Step 4 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Step 4: The Crisis vs. Chaos Decision Chart
                </h2>
                <p className="text-muted-foreground mb-4">Ask yourself:</p>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Is someone's life or immediate safety at risk?</p>
                    <div className="flex gap-6 text-sm">
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Yes → <span className="text-destructive font-semibold">Crisis</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        No → <span className="text-primary font-semibold">Chaos</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Would delaying my response increase the risk of serious harm?</p>
                    <div className="flex gap-6 text-sm">
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Yes → <span className="text-destructive font-semibold">Crisis</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        No → <span className="text-primary font-semibold">Chaos</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Have I intervened in this situation before without lasting change?</p>
                    <div className="flex gap-6 text-sm">
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Yes → <span className="text-primary font-semibold">Likely Chaos</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        No → Continue assessing
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Does responding require professional intervention rather than family rescue?</p>
                    <div className="flex gap-6 text-sm">
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Yes → <span className="text-destructive font-semibold">Crisis</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        No → <span className="text-primary font-semibold">Chaos</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Step 5 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Step 5: How to Respond to CHAOS
                </h2>
                <p className="text-muted-foreground mb-4">When it is chaos:</p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 print:bg-gray-50">
                    <h3 className="font-semibold text-primary mb-3">Do:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Refer back to your Family Recovery Action Plan</li>
                      <li>• Restate boundaries calmly and briefly</li>
                      <li>• Allow natural consequences</li>
                      <li>• End conversations that escalate</li>
                      <li>• Reach out to your own support system</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20 print:bg-gray-50">
                    <h3 className="font-semibold text-destructive mb-3">Do NOT:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Argue, explain, or justify</li>
                      <li>• Rescue to relieve your discomfort</li>
                      <li>• Negotiate under pressure</li>
                      <li>• Make exceptions "just this once"</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Say (Examples):</h3>
                  <ul className="space-y-1 text-sm italic">
                    <li>"I'm not able to help with that."</li>
                    <li>"I care about you, and my boundary hasn't changed."</li>
                    <li>"This sounds upsetting, but it's not something I can fix."</li>
                    <li>"We can talk when you're sober/calm."</li>
                  </ul>
                </div>
              </section>

              {/* Step 6 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Step 6: How to Respond to a CRISIS
                </h2>
                <p className="text-muted-foreground mb-4">When it is a crisis:</p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 print:bg-gray-50">
                    <h3 className="font-semibold text-primary mb-3">Do:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Act quickly and decisively</li>
                      <li>• Contact emergency or professional services</li>
                      <li>• Stay focused on safety</li>
                      <li>• Inform appropriate parties if required</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20 print:bg-gray-50">
                    <h3 className="font-semibold text-destructive mb-3">Do NOT:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Attempt to manage it alone</li>
                      <li>• Use the crisis as leverage</li>
                      <li>• Promise protection from consequences</li>
                      <li>• Abandon boundaries long-term</li>
                    </ul>
                  </div>
                </div>

                <p className="text-center font-medium text-primary">
                  After the crisis resolves, return to the action plan.
                </p>
              </section>

              {/* Step 7 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Step 7: Post-Event Reflection
                </h2>
                <p className="text-muted-foreground mb-4">After any intense situation, ask:</p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-1"></span>
                    <span>Was this truly a crisis or chaos?</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-1"></span>
                    <span>Did my response align with my values and plan?</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-1"></span>
                    <span>What emotions influenced my decision?</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-1"></span>
                    <span>What would I do the same or differently next time?</span>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Write brief notes:</p>
                  <div className="border-b border-dashed border-foreground/30 h-20"></div>
                </div>
              </section>

              {/* Common Traps */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Common Family Traps to Watch For
                </h2>

                <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                  <ul className="space-y-2 text-sm italic">
                    <li>"If I don't step in, something terrible will happen."</li>
                    <li>"I'll help this one time."</li>
                    <li>"They'll hate me if I say no."</li>
                    <li>"This feels different."</li>
                  </ul>
                  <p className="mt-4 text-sm font-medium">
                    These thoughts are understandable—and often misleading.
                  </p>
                </div>
              </section>

              {/* Key Reframe */}
              <section className="mb-8 p-6 border-2 border-primary/20 rounded-lg bg-primary/5 print:bg-gray-50">
                <h2 className="text-lg font-bold text-logo-green mb-3">Key Reframe</h2>
                <p className="text-center text-lg mb-4">
                  You are not responsible for preventing every bad outcome.<br />
                  <strong className="text-primary">You are responsible for responding with clarity and integrity.</strong>
                </p>
                <p className="text-center text-muted-foreground text-sm">
                  Learning to tell the difference between crisis and chaos is one of the most powerful skills families can develop.
                </p>
              </section>

              {/* Suggested Resources */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Suggested Companion Resources
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <Link to="/family-action-plan" className="text-primary hover:underline print:text-foreground print:no-underline">
                      Family Recovery Action Plan
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>Boundary Setting Worksheet</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <Link to="/scenario-exercise" className="text-primary hover:underline print:text-foreground print:no-underline">
                      Scenario-Based Recovery Exercises
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>Emotional Regulation Tools for Families</span>
                  </li>
                </ul>
              </section>

              {/* Footer */}
              <div className="text-center text-sm text-muted-foreground pt-6 border-t print:mt-8">
                <p className="font-medium">Sober Helpline</p>
                <p>(541) 241-5886 | www.soberhelpline.com</p>
              </div>
            </div>
          </div>
        
          <RelatedResources currentPath="/crisis-chaos" />
</main>
      </div>
    </>
  );
}
