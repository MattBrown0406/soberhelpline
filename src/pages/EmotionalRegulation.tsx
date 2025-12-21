import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function EmotionalRegulation() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Emotional Regulation Tools for Families | Sober Helpline</title>
        <meta name="description" content="Practical tools to stay grounded when addiction triggers chaos. Learn skills for responding with intention instead of impulse." />
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
                <Heart className="h-12 w-12 text-primary mx-auto mb-4 print:hidden" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
                  Emotional Regulation Tools for Families
                </h1>
                <p className="text-lg text-muted-foreground">
                  Staying Grounded When Addiction Triggers Chaos
                </p>
              </div>

              {/* Purpose Section */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-3">Purpose</h2>
                <p className="text-muted-foreground mb-4">
                  Addiction dysregulates everyone it touches. Families often respond from fear, anger, guilt, or urgency—then regret their reactions later. Emotional regulation is not about suppressing feelings; it is about responding with intention instead of impulse.
                </p>
                <p className="font-semibold text-primary italic">
                  Regulation is a skill. Skills can be practiced and strengthened.
                </p>
              </section>

              {/* Core Principle */}
              <section className="mb-8 p-6 bg-primary/10 rounded-lg border-2 border-primary/30 print:bg-gray-100">
                <h2 className="text-lg font-bold text-center mb-3">Core Principle</h2>
                <p className="text-center text-lg mb-2">
                  You cannot control someone else's addiction,<br />
                  <strong className="text-primary">but you can control how much it controls you.</strong>
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Emotional regulation creates space between what you feel and what you do.
                </p>
              </section>

              {/* Tool 1 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Tool 1: The Pause (Interrupting Reactivity)
                </h2>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">When to use:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• During heated conversations</li>
                    <li>• When you feel pressure to respond immediately</li>
                    <li>• When guilt or panic spikes</li>
                  </ul>
                </div>

                <div className="mb-4 p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                  <h3 className="font-semibold mb-2">How to do it:</h3>
                  <ol className="text-sm space-y-2">
                    <li>1. Stop talking.</li>
                    <li>2. Take 3 slow breaths (in through the nose, out through the mouth).</li>
                    <li>3. Say one of the following:
                      <ul className="ml-4 mt-2 italic text-muted-foreground">
                        <li>"I need a moment before responding."</li>
                        <li>"I'm not making this decision right now."</li>
                        <li>"Let's pause this conversation."</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <p className="text-sm"><strong>Why it works:</strong> Pausing interrupts emotional hijacking and prevents boundary violations.</p>
              </section>

              {/* Tool 2 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Tool 2: Name It to Tame It (Labeling Emotions)
                </h2>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">When to use:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• When emotions feel overwhelming or confusing</li>
                    <li>• When you're about to react emotionally</li>
                  </ul>
                </div>

                <div className="mb-4 p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                  <h3 className="font-semibold mb-2">How to do it:</h3>
                  <p className="text-sm mb-2">Silently or out loud, name what you're feeling:</p>
                  <ul className="text-sm italic text-muted-foreground space-y-1">
                    <li>"I'm feeling afraid."</li>
                    <li>"I'm feeling guilty."</li>
                    <li>"I'm feeling angry and helpless."</li>
                  </ul>
                </div>

                <p className="text-sm"><strong>Why it works:</strong> Labeling emotions reduces their intensity and restores cognitive clarity.</p>
              </section>

              {/* Tool 3 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Tool 3: Grounding in the Present (5–4–3–2–1)
                </h2>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">When to use:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• During panic or anxiety</li>
                    <li>• After a triggering call or interaction</li>
                  </ul>
                </div>

                <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20 print:bg-gray-50">
                  <h3 className="font-semibold mb-3">How to do it:</h3>
                  <p className="text-sm mb-3">Identify:</p>
                  <div className="grid grid-cols-5 gap-2 text-center text-sm">
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="text-2xl font-bold text-primary">5</div>
                      <div className="text-xs text-muted-foreground">things you can SEE</div>
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="text-2xl font-bold text-primary">4</div>
                      <div className="text-xs text-muted-foreground">things you can TOUCH</div>
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="text-2xl font-bold text-primary">3</div>
                      <div className="text-xs text-muted-foreground">things you can HEAR</div>
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="text-2xl font-bold text-primary">2</div>
                      <div className="text-xs text-muted-foreground">things you can SMELL</div>
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="text-2xl font-bold text-primary">1</div>
                      <div className="text-xs text-muted-foreground">thing you can TASTE</div>
                    </div>
                  </div>
                </div>

                <p className="text-sm"><strong>Why it works:</strong> Grounding shifts your nervous system out of fight-or-flight.</p>
              </section>

              {/* Tool 4 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Tool 4: The Boundary Script (Reducing Emotional Escalation)
                </h2>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">When to use:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• When boundaries are challenged</li>
                    <li>• When conversations become circular or manipulative</li>
                  </ul>
                </div>

                <div className="mb-4 p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                  <h3 className="font-semibold mb-2">How to do it:</h3>
                  <p className="text-sm mb-2">Choose one short phrase and repeat it calmly:</p>
                  <ul className="text-sm italic space-y-1">
                    <li>"I'm not able to help with that."</li>
                    <li>"My boundary hasn't changed."</li>
                    <li>"We can talk when things are calmer."</li>
                  </ul>
                </div>

                <p className="text-sm"><strong>Why it works:</strong> Repetition without explanation reduces escalation and manipulation.</p>
              </section>

              {/* Tool 5 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Tool 5: Reality Check (Thought Reframing)
                </h2>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">When to use:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• When catastrophic thinking appears</li>
                    <li>• When fear drives decision-making</li>
                  </ul>
                </div>

                <div className="mb-4 p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Ask yourself:</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-0.5"></span>
                      What do I know vs. what am I assuming?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-0.5"></span>
                      Have I survived this before?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-0.5"></span>
                      What is actually within my control right now?
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Replace the thought:</h3>
                  <p className="text-sm text-muted-foreground line-through">"If I don't fix this, everything will fall apart."</p>
                  <p className="text-sm text-primary font-medium">→ "I can respond without rescuing."</p>
                </div>
              </section>

              {/* Tool 6 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Tool 6: Emotional Containment (Not Absorbing the Chaos)
                </h2>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">When to use:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• When your loved one is emotional, intoxicated, or dysregulated</li>
                  </ul>
                </div>

                <div className="mb-4 p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                  <h3 className="font-semibold mb-2">How to do it:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Lower your voice</li>
                    <li>• Shorten responses</li>
                    <li>• Avoid emotional mirroring</li>
                    <li>• End conversations that escalate</li>
                  </ul>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg text-center print:bg-gray-100">
                  <p className="font-semibold text-primary italic">"Their emotions are not mine to manage."</p>
                </div>
              </section>

              {/* Tool 7 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Tool 7: Post-Interaction Reset
                </h2>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">When to use:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• After intense conversations or crises</li>
                  </ul>
                </div>

                <div className="mb-4 p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Options:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Walk outside</li>
                    <li>• Stretch or move your body</li>
                    <li>• Write down what you're feeling</li>
                    <li>• Talk to a safe support person</li>
                    <li>• Re-read your Family Recovery Action Plan</li>
                  </ul>
                </div>

                <p className="text-sm"><strong>Why it matters:</strong> Without a reset, stress accumulates and erodes boundaries.</p>
              </section>

              {/* Tool 8 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Tool 8: Values-Based Decision Check
                </h2>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">When to use:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• When torn between fear and boundaries</li>
                  </ul>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Ask:</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-0.5"></span>
                      Does this decision align with my values?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-0.5"></span>
                      Will I respect myself tomorrow if I do this?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-0.5"></span>
                      Is this helping recovery—or avoiding discomfort?
                    </li>
                  </ul>
                </div>

                <p className="text-sm mt-4 text-center font-medium text-primary">Values create stability when emotions fluctuate.</p>
              </section>

              {/* Tool 9 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Tool 9: Guilt vs. Responsibility Test
                </h2>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">When to use:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• When guilt pushes you to rescue</li>
                  </ul>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg mb-4 print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Ask:</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-0.5"></span>
                      Is this truly my responsibility?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-0.5"></span>
                      Am I preventing a consequence that could support change?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0 mt-0.5"></span>
                      Am I acting out of love or fear?
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-center">
                  <strong>Guilt is a feeling.</strong><br />
                  <span className="text-primary font-medium">Responsibility is a choice.</span>
                </p>
              </section>

              {/* Tool 10 */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Tool 10: Build a Regulation Routine
                </h2>

                <div className="p-4 bg-muted/30 rounded-lg mb-4 print:bg-gray-50">
                  <h3 className="font-semibold mb-3">Daily practices (choose 1–2):</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <label className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                      Deep breathing
                    </label>
                    <label className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                      Journaling
                    </label>
                    <label className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                      Physical movement
                    </label>
                    <label className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                      Meditation or prayer
                    </label>
                    <label className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                      Limiting crisis-focused conversations
                    </label>
                    <label className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                      Education and reflection
                    </label>
                  </div>
                </div>

                <p className="text-sm text-center font-medium text-primary">Consistency matters more than intensity.</p>
              </section>

              {/* Quick Reference */}
              <section className="mb-8 page-break-inside-avoid">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Quick Reference: What Regulation Is and Isn't
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 print:bg-gray-50">
                    <h3 className="font-semibold text-primary mb-3">Regulation IS:</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Calm</li>
                      <li>• Clear</li>
                      <li>• Consistent</li>
                      <li>• Self-directed</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20 print:bg-gray-50">
                    <h3 className="font-semibold text-destructive mb-3">Regulation is NOT:</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Numbing</li>
                      <li>• Avoiding</li>
                      <li>• Suppressing feelings</li>
                      <li>• Ignoring reality</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Final Reframe */}
              <section className="mb-8 p-6 border-2 border-primary/20 rounded-lg bg-primary/5 print:bg-gray-50">
                <h2 className="text-lg font-bold text-logo-green mb-3">Final Reframe</h2>
                <p className="text-center text-lg mb-4">
                  You do not need to be perfectly calm to be effective.<br />
                  <strong className="text-primary">You need to be regulated enough to choose your response.</strong>
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Emotional regulation is the foundation that allows boundaries, consistency, and recovery-oriented decisions to hold.
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
                    <Link to="/crisis-chaos" className="text-primary hover:underline print:text-foreground print:no-underline">
                      Crisis vs. Chaos Decision Guide
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>Boundary Setting Worksheet</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <Link to="/family-action-plan" className="text-primary hover:underline print:text-foreground print:no-underline">
                      Family Recovery Action Plan
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <Link to="/scenario-exercise" className="text-primary hover:underline print:text-foreground print:no-underline">
                      Scenario-Based Exercises
                    </Link>
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
        </main>
      </div>
    </>
  );
}
