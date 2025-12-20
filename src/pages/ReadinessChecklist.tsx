import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, ClipboardCheck, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function ReadinessChecklist() {
  const handlePrint = () => {
    window.print();
  };
  return (
    <>
      <Helmet>
        <title>Readiness for Change Checklist | Sober Helpline</title>
        <meta name="description" content="Assess your loved one's readiness for recovery based on actions, not promises. A practical checklist for families." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur">
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
            {/* Back Link & Print Button */}
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
                Print Checklist
              </Button>
            </div>

            {/* Document Content */}
            <div className="bg-white dark:bg-card rounded-lg shadow-lg p-8 md:p-12 print:shadow-none print:p-0">
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b">
                <ClipboardCheck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
                  Readiness for Change Checklist
                </h1>
                <p className="text-lg text-muted-foreground">
                  Assessing Actions, Not Promises
                </p>
              </div>

              {/* Instructions */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-3">Instructions</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Complete this checklist based on what you have observed over the past 2–4 weeks, not what was said during emotional moments or crises.</li>
                  <li>Check items that are consistently true, not occasional.</li>
                  <li>If you are unsure, leave it unchecked.</li>
                </ul>
              </section>

              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4">Section 1: Accountability & Ownership</h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Acknowledges there is a problem without blaming others</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Takes responsibility for specific behaviors (not just general regret)</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Accepts feedback without escalating or becoming defensive</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Does not minimize or rationalize substance use</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Acknowledges consequences without arguing them away</span>
                  </label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Notes / examples:</label>
                  <textarea className="w-full p-3 border rounded-lg min-h-[80px] bg-background" placeholder="Add your observations here..." />
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4">Section 2: Behavioral Follow-Through</h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Takes initiative to seek help or evaluation</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Follows through on appointments without reminders</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Completes required steps (calls, paperwork, planning) independently</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Shows up on time and prepared</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Follows rules and expectations without repeated negotiation</span>
                  </label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Notes / examples:</label>
                  <textarea className="w-full p-3 border rounded-lg min-h-[80px] bg-background" placeholder="Add your observations here..." />
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4">Section 3: Tolerance for Discomfort</h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Accepts "no" without emotional escalation</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Does not demand immediate relief or reassurance</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Tolerates boundaries without punishment or withdrawal</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Does not use guilt, fear, or anger to change decisions</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Accepts consequences without demanding rescue</span>
                  </label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Notes / examples:</label>
                  <textarea className="w-full p-3 border rounded-lg min-h-[80px] bg-background" placeholder="Add your observations here..." />
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4">Section 4: Engagement With Recovery Supports</h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Willingly participates in treatment or professional recommendations</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Attends meetings, therapy, or recovery activities consistently</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Is open to structure and accountability</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Engages with recovery supports beyond family</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Accepts guidance from professionals without controlling the process</span>
                  </label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Notes / examples:</label>
                  <textarea className="w-full p-3 border rounded-lg min-h-[80px] bg-background" placeholder="Add your observations here..." />
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4">Section 5: Lifestyle & Environment Changes</h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Willing to change people, places, or routines connected to use</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Reduces contact with substance-using peers</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Accepts structured living if recommended</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Makes daily life changes that support stability</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Shows effort toward healthy routines (sleep, work, responsibilities)</span>
                  </label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Notes / examples:</label>
                  <textarea className="w-full p-3 border rounded-lg min-h-[80px] bg-background" placeholder="Add your observations here..." />
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4">Section 6: Consistency Over Time</h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Behaviors have remained consistent for at least 2 weeks</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Progress continues without a crisis driving it</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Effort remains even when support is not guaranteed</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">There is follow-through even after conflict or disappointment</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Actions match stated intentions</span>
                  </label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Notes / examples:</label>
                  <textarea className="w-full p-3 border rounded-lg min-h-[80px] bg-background" placeholder="Add your observations here..." />
                </div>
              </section>

              {/* Scoring Guide */}
              <section className="mb-8 p-6 bg-muted/30 rounded-lg border">
                <h2 className="text-xl font-bold text-logo-green mb-4">Scoring Guide</h2>
                <p className="text-sm text-muted-foreground mb-4">(Use as a Reference, Not a Rule)</p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <div>
                      <span className="font-semibold text-foreground">0–10 boxes checked — Low readiness</span>
                      <p className="text-sm text-muted-foreground">Focus on boundaries, consequences, and your own recovery.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <div>
                      <span className="font-semibold text-foreground">11–20 boxes checked — Emerging readiness</span>
                      <p className="text-sm text-muted-foreground">Encourage professional assessment. Maintain boundaries. Avoid rescuing.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <div>
                      <span className="font-semibold text-foreground">21–30 boxes checked — Strong readiness indicators</span>
                      <p className="text-sm text-muted-foreground">Support treatment engagement while maintaining accountability.</p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm font-medium text-primary">
                  Important: Readiness is not permanent. Reassess regularly.
                </p>
              </section>

              {/* Family Reality Check */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4">Family Reality Check</h2>
                <p className="text-muted-foreground mb-4">Answer honestly:</p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <p className="font-medium text-foreground mb-2">Am I responding to behavior—or to hope?</p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="behavior-hope" className="h-4 w-4" />
                        <span>Behavior</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="behavior-hope" className="h-4 w-4" />
                        <span>Hope</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <p className="font-medium text-foreground mb-2">Have I relaxed boundaries prematurely?</p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="boundaries" className="h-4 w-4" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="boundaries" className="h-4 w-4" />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <p className="font-medium text-foreground mb-2">Would I make the same decision if I were less afraid?</p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="afraid" className="h-4 w-4" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="afraid" className="h-4 w-4" />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <p className="font-medium text-foreground mb-2">Is my support increasing accountability—or reducing it?</p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="accountability" className="h-4 w-4" />
                        <span>Accountability</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="accountability" className="h-4 w-4" />
                        <span>Comfort</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Action Based on Current Readiness */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4">Action Based on Current Readiness</h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Maintain boundaries</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Do not negotiate timelines</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Encourage professional evaluation</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Support treatment engagement</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Focus on my own recovery</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300" />
                    <span className="text-foreground">Revisit this checklist in</span>
                    <input type="text" className="w-16 p-2 border rounded bg-background text-center" placeholder="___" />
                    <span className="text-foreground">weeks</span>
                  </div>
                </div>
              </section>

              {/* Key Reminder */}
              <section className="mb-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
                <h2 className="text-xl font-bold text-logo-green mb-3">Key Reminder</h2>
                <p className="text-foreground font-medium mb-2">
                  Readiness is proven through effort, not emotion.
                </p>
                <p className="text-foreground font-medium mb-2">
                  Consistency matters more than intensity.
                </p>
                <p className="text-muted-foreground">
                  Families help most when they allow actions—not promises—to guide decisions.
                </p>
              </section>

              {/* Suggested Companion Tools */}
              <section className="mb-4">
                <h2 className="text-xl font-bold text-logo-green mb-4">Suggested Companion Tools</h2>
                <ul className="space-y-2">
                  <li>
                    <Link to="/family-action-plan" className="text-primary hover:underline">
                      Family Recovery Action Plan
                    </Link>
                  </li>
                  <li>
                    <Link to="/crisis-chaos" className="text-primary hover:underline">
                      Crisis vs. Chaos Decision Guide
                    </Link>
                  </li>
                  <li>
                    <Link to="/family-videos" className="text-primary hover:underline">
                      Boundary Setting Worksheet
                    </Link>
                  </li>
                  <li>
                    <Link to="/talking-about-treatment" className="text-primary hover:underline">
                      "How to Talk to Your Loved One About Treatment" Guide
                    </Link>
                  </li>
                  <li>
                    <Link to="/scenario-exercise" className="text-primary hover:underline">
                      Scenario-Based Exercises
                    </Link>
                  </li>
                </ul>
              </section>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
                <p>Sober Helpline | (541) 241-5886 | www.soberhelpline.com</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}