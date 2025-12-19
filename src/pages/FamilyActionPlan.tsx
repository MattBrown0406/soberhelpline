import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function FamilyActionPlan() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Family Recovery Action Plan | Sober Helpline</title>
        <meta name="description" content="A practical roadmap for stability, boundaries, and healing. Create your family's action plan for recovery." />
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
                <ClipboardList className="h-12 w-12 text-primary mx-auto mb-4 print:hidden" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
                  Family Recovery Action Plan
                </h1>
                <p className="text-lg text-muted-foreground">
                  A Practical Roadmap for Stability, Boundaries, and Healing
                </p>
              </div>

              {/* Purpose Section */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-3">Purpose</h2>
                <p className="text-muted-foreground mb-4">
                  Addiction creates chaos, urgency, and emotional reactivity. This action plan helps families move from crisis management to intentional, values-based decisions—regardless of whether their loved one is currently sober, in treatment, or actively using.
                </p>
                <p className="font-semibold text-primary italic">
                  This plan is about your recovery, not controlling theirs.
                </p>
              </section>

              {/* How to Use */}
              <section className="mb-8 p-4 bg-muted/50 rounded-lg print:bg-gray-100">
                <h2 className="text-lg font-bold mb-3">How to Use This Guide</h2>
                <ul className="space-y-2 text-sm">
                  <li>• Complete this plan during a calm moment, not during a crisis.</li>
                  <li>• Revisit and update it regularly.</li>
                  <li>• Share it with supportive people who can help you stay accountable.</li>
                  <li>• <strong>This plan works best when families commit to consistency over comfort.</strong></li>
                </ul>
              </section>

              {/* Part 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 1: Define Your Current Reality
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Answer honestly.</p>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                    <p className="font-medium mb-3">My loved one's current status (check all that apply):</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Actively using
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        In detox or treatment
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Early recovery
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Long-term recovery
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Relapsed or unstable
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">The biggest ongoing challenges for our family are:</p>
                    <div className="border-b border-dashed border-foreground/30 h-16 print:h-20"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What patterns have repeated despite our best efforts?</p>
                    <div className="border-b border-dashed border-foreground/30 h-16 print:h-20"></div>
                  </div>
                </div>
              </section>

              {/* Part 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 2: Clarify Your Values & Non-Negotiables
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Recovery decisions should align with values, not fear.</p>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                    <p className="font-medium mb-3">The values we want to prioritize in our family include:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Safety
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Honesty
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Accountability
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Stability
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Respect
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Health
                      </label>
                    </div>
                    <div className="mt-3">
                      <label className="flex items-center gap-2 text-sm">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Other: <span className="flex-1 border-b border-dashed border-foreground/30"></span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Non-negotiables (behaviors we will not accept in our home or lives):</p>
                    <div className="border-b border-dashed border-foreground/30 h-20 print:h-24"></div>
                  </div>
                </div>
              </section>

              {/* Part 3 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 3: Identify Enabling Patterns to Stop
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Based on education and reflection, identify behaviors you are committed to changing.</p>

                <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
                  <p className="font-medium mb-3">We will stop:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0"></span>
                      Covering for consequences (work, legal, social)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0"></span>
                      Providing money during active use
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0"></span>
                      Making excuses or lying
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0"></span>
                      Rescuing from predictable outcomes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0"></span>
                      Managing emotions or crises we didn't create
                    </li>
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="font-medium mb-2">Additional patterns we will stop:</p>
                  <div className="border-b border-dashed border-foreground/30 h-16 print:h-20"></div>
                </div>
              </section>

              {/* Part 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 4: Boundaries & Consequences Plan
                </h2>
                <p className="text-sm text-muted-foreground mb-4">For each boundary, be specific.</p>

                <div className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-3">Boundary #1</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Behavior triggering the boundary:</p>
                        <div className="border-b border-dashed border-foreground/30 h-8"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Boundary statement:</p>
                        <div className="border-b border-dashed border-foreground/30 h-8"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Consequence we will follow through on:</p>
                        <div className="border-b border-dashed border-foreground/30 h-8"></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-3">Boundary #2</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Behavior triggering the boundary:</p>
                        <div className="border-b border-dashed border-foreground/30 h-8"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Boundary statement:</p>
                        <div className="border-b border-dashed border-foreground/30 h-8"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Consequence we will follow through on:</p>
                        <div className="border-b border-dashed border-foreground/30 h-8"></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground italic">(Add additional boundaries as needed.)</p>
                </div>
              </section>

              {/* Part 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 5: Crisis Response Plan
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Emotions are highest during crises. Decide now.</p>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">What constitutes a true emergency (health, safety, legal)?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What behaviors will not be treated as emergencies?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                    <p className="font-medium mb-3">Our crisis response will include:</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0"></span>
                        Calling emergency services when appropriate
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0"></span>
                        Not negotiating under pressure
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0"></span>
                        Referring to previously set boundaries
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0"></span>
                        Reaching out to a support person
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block flex-shrink-0"></span>
                        Taking a pause before responding
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Part 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 6: Family Self-Care & Support Plan
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Recovery requires sustained support for families.</p>

                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
                    <p className="font-medium mb-3">Individual or family supports we will engage in:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Therapy or counseling
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Support groups
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Coaching
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Educational resources
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Spiritual or community support
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Personal commitments to self-care:</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Warning signs we are burning out or reverting to old patterns:</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>
                </div>
              </section>

              {/* Part 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 7: Communication Guidelines
                </h2>
                <p className="text-sm text-muted-foreground mb-4">To reduce conflict and manipulation:</p>

                <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50 mb-4">
                  <p className="font-medium mb-3">We commit to:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Speaking calmly and briefly</li>
                    <li>• Avoiding lectures and emotional arguments</li>
                    <li>• Repeating boundaries without justification</li>
                    <li>• Ending conversations that become abusive or circular</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium mb-2">Our grounding response phrase:</p>
                  <p className="text-sm text-muted-foreground italic mb-2">
                    Example: "We're not going to argue about this. Our decision remains the same."
                  </p>
                  <div className="border-b border-dashed border-foreground/30 h-8"></div>
                </div>
              </section>

              {/* Part 8 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 8: Review & Accountability
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Who will help hold us accountable to this plan?</p>
                    <div className="border-b border-dashed border-foreground/30 h-8"></div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg print:bg-gray-50">
                    <p className="font-medium mb-3">How often will we review and update this plan?</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Monthly
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        Quarterly
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="w-4 h-4 border border-foreground/50 inline-block"></span>
                        As circumstances change
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">What progress will we look for in ourselves—not our loved one?</p>
                    <div className="border-b border-dashed border-foreground/30 h-12"></div>
                  </div>
                </div>
              </section>

              {/* Part 9 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  Part 9: Commitment Statement
                </h2>
                <p className="text-sm text-muted-foreground mb-4">Read and sign:</p>

                <div className="p-6 border-2 rounded-lg bg-muted/30 print:bg-gray-50">
                  <p className="text-sm italic mb-6">
                    "We commit to focusing on our recovery, setting clear boundaries, and responding thoughtfully rather than reactively. We understand that we cannot control outcomes, but we can control our actions."
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Signature(s):</p>
                      <div className="border-b border-foreground/50 h-8"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Date:</p>
                      <div className="border-b border-foreground/50 h-8 w-48"></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Final Perspective */}
              <section className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5 print:bg-gray-50">
                <h2 className="text-lg font-bold text-logo-green mb-3">Final Perspective</h2>
                <p className="text-muted-foreground mb-4">
                  Families do not heal by waiting for someone else to change.<br />
                  They heal by reclaiming their lives, integrity, and peace.
                </p>
                <p className="text-sm text-muted-foreground">
                  This action plan is not rigid. It is a living document designed to support clarity, consistency, and compassion—especially when things get hard.
                </p>
              </section>

              {/* Footer for print */}
              <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground print:block hidden">
                <p>Sober Helpline | (541) 241-5886 | www.soberhelpline.com</p>
              </div>
            </div>

            {/* Bottom Print Button - Hidden on print */}
            <div className="mt-6 text-center print:hidden">
              <Button onClick={handlePrint} size="lg" className="gap-2">
                <Printer className="h-5 w-5" />
                Print This Document
              </Button>
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
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </>
  );
}
