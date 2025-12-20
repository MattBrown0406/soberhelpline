import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Target, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function ScenarioExercise() {
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
                to="/family-videos"
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

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Is this a true emergency according to your action plan?</p>
                    <div className="flex gap-4 text-sm">
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Yes
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Which boundary or non-negotiable applies here?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">What emotions does this scenario trigger for you?</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Fear
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Guilt
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Panic
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Anger
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Sadness
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What is your planned response (not your impulse)?</p>
                    <div className="border-b border-dashed border-foreground/30 h-16"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What consequence are you willing to allow to occur?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Who can you contact afterward for support?</p>
                    <div className="border-b border-dashed border-foreground/30 h-8"></div>
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

                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">What past patterns does this resemble?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Does your action plan allow support without accountability?</p>
                    <div className="flex gap-4 text-sm">
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Yes
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What boundary applies here?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Write your calm, repeatable response:</p>
                    <div className="border-b border-dashed border-foreground/30 h-16"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What supportive alternative (if any) aligns with recovery?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
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

                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">What part of this is within your control?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What part is not?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What enabling behavior are you tempted to continue?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What does your action plan say you will do instead?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">How will you manage the anxiety that comes with holding your boundary?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
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

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Is this behavior aligned with your values and non-negotiables?</p>
                    <div className="flex gap-4 text-sm">
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Yes
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What boundary or conversation is needed now—not later?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">How can you address this without monitoring or controlling?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What would consistency look like in this moment?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
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

                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">How does this impact your family recovery plan?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What boundary is needed with other family members?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What values are guiding your decision—not their opinions?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Write a statement that reinforces unity and clarity:</p>
                    <div className="border-b border-dashed border-foreground/30 h-16"></div>
                  </div>
                </div>
              </section>

              {/* Reflection */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Reflection: Patterns & Growth
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Answer honestly:</p>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Which scenario was hardest for you? Why?</p>
                    <div className="border-b border-dashed border-foreground/30 h-16"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Where are you most likely to abandon the plan?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What support do you need to strengthen consistency?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
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
        }
      `}</style>
    </>
  );
}
