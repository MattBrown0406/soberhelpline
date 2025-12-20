import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, ClipboardCheck, Printer, AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import logo from "@/assets/logo.png";

const checklistItems = {
  section1: [
    "Acknowledges there is a problem without blaming others",
    "Takes responsibility for specific behaviors (not just general regret)",
    "Accepts feedback without escalating or becoming defensive",
    "Does not minimize or rationalize substance use",
    "Acknowledges consequences without arguing them away",
  ],
  section2: [
    "Takes initiative to seek help or evaluation",
    "Follows through on appointments without reminders",
    "Completes required steps (calls, paperwork, planning) independently",
    "Shows up on time and prepared",
    "Follows rules and expectations without repeated negotiation",
  ],
  section3: [
    "Accepts \"no\" without emotional escalation",
    "Does not demand immediate relief or reassurance",
    "Tolerates boundaries without punishment or withdrawal",
    "Does not use guilt, fear, or anger to change decisions",
    "Accepts consequences without demanding rescue",
  ],
  section4: [
    "Willingly participates in treatment or professional recommendations",
    "Attends meetings, therapy, or recovery activities consistently",
    "Is open to structure and accountability",
    "Engages with recovery supports beyond family",
    "Accepts guidance from professionals without controlling the process",
  ],
  section5: [
    "Willing to change people, places, or routines connected to use",
    "Reduces contact with substance-using peers",
    "Accepts structured living if recommended",
    "Makes daily life changes that support stability",
    "Shows effort toward healthy routines (sleep, work, responsibilities)",
  ],
  section6: [
    "Behaviors have remained consistent for at least 2 weeks",
    "Progress continues without a crisis driving it",
    "Effort remains even when support is not guaranteed",
    "There is follow-through even after conflict or disappointment",
    "Actions match stated intentions",
  ],
};

type CheckedState = Record<string, boolean>;

export default function ReadinessChecklist() {
  const [checkedItems, setCheckedItems] = useState<CheckedState>({});

  const handlePrint = () => {
    window.print();
  };

  const handleCheck = (sectionKey: string, index: number) => {
    const key = `${sectionKey}-${index}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isChecked = (sectionKey: string, index: number) => {
    return checkedItems[`${sectionKey}-${index}`] || false;
  };

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const maxItems = 30;
  const progressPercent = (totalChecked / maxItems) * 100;

  const getReadinessLevel = () => {
    if (totalChecked <= 10) {
      return {
        level: "Low Readiness",
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950/30",
        borderColor: "border-red-200 dark:border-red-800",
        icon: AlertCircle,
        message: "Focus on boundaries, consequences, and your own recovery.",
      };
    } else if (totalChecked <= 20) {
      return {
        level: "Emerging Readiness",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        icon: TrendingUp,
        message: "Encourage professional assessment. Maintain boundaries. Avoid rescuing.",
      };
    } else {
      return {
        level: "Strong Readiness",
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950/30",
        borderColor: "border-green-200 dark:border-green-800",
        icon: CheckCircle2,
        message: "Support treatment engagement while maintaining accountability.",
      };
    }
  };

  const readiness = getReadinessLevel();
  const ReadinessIcon = readiness.icon;

  const renderSection = (sectionKey: keyof typeof checklistItems, title: string, items: string[]) => (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-logo-green mb-4">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <label key={index} className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked(sectionKey, index)}
              onChange={() => handleCheck(sectionKey, index)}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-foreground">{item}</span>
          </label>
        ))}
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-muted-foreground mb-2">Notes / examples:</label>
        <textarea className="w-full p-3 border rounded-lg min-h-[80px] bg-background" placeholder="Add your observations here..." />
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>Readiness for Change Checklist | Sober Helpline</title>
        <meta name="description" content="Assess your loved one's readiness for recovery based on actions, not promises. A practical checklist for families." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
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

            {/* Interactive Score Card - Sticky on desktop */}
            <div className={`mb-6 p-4 rounded-lg border-2 ${readiness.bgColor} ${readiness.borderColor} print:hidden sticky top-4 z-10 shadow-lg`}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <ReadinessIcon className={`h-8 w-8 ${readiness.color}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Your Readiness Score</p>
                    <p className={`text-2xl font-bold ${readiness.color}`}>
                      {totalChecked} / {maxItems}
                    </p>
                  </div>
                </div>
                <div className="flex-1 min-w-[200px] max-w-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold ${readiness.color}`}>{readiness.level}</span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-1">{readiness.message}</p>
                </div>
              </div>
            </div>

            {/* Document Content */}
            <div className="bg-white dark:bg-card rounded-lg shadow-lg p-8 md:p-12 print:shadow-none print:p-0">
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b">
                <ClipboardCheck className="h-12 w-12 text-primary mx-auto mb-4 print:hidden" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
                  Readiness for Change Checklist
                </h1>
                <p className="text-lg text-muted-foreground">
                  Assessing Actions, Not Promises
                </p>
              </div>

              {/* Print Score Summary */}
              <div className="hidden print:block mb-6 p-4 border rounded-lg">
                <p className="font-bold">Readiness Score: {totalChecked} / {maxItems} — {readiness.level}</p>
                <p className="text-sm">{readiness.message}</p>
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

              {renderSection("section1", "Section 1: Accountability & Ownership", checklistItems.section1)}
              {renderSection("section2", "Section 2: Behavioral Follow-Through", checklistItems.section2)}
              {renderSection("section3", "Section 3: Tolerance for Discomfort", checklistItems.section3)}
              {renderSection("section4", "Section 4: Engagement With Recovery Supports", checklistItems.section4)}
              {renderSection("section5", "Section 5: Lifestyle & Environment Changes", checklistItems.section5)}
              {renderSection("section6", "Section 6: Consistency Over Time", checklistItems.section6)}

              {/* Scoring Guide */}
              <section className="mb-8 p-6 bg-muted/30 rounded-lg border">
                <h2 className="text-xl font-bold text-logo-green mb-4">Scoring Guide</h2>
                <p className="text-sm text-muted-foreground mb-4">(Use as a Reference, Not a Rule)</p>
                
                <div className="space-y-4">
                  <div className={`flex items-start gap-3 p-3 rounded-lg ${totalChecked <= 10 ? 'bg-red-100 dark:bg-red-950/50 ring-2 ring-red-400' : ''}`}>
                    <AlertCircle className={`h-5 w-5 mt-0.5 ${totalChecked <= 10 ? 'text-red-600' : 'text-muted-foreground'}`} />
                    <div>
                      <span className={`font-semibold ${totalChecked <= 10 ? 'text-red-700 dark:text-red-400' : 'text-foreground'}`}>0–10 boxes checked — Low readiness</span>
                      <p className="text-sm text-muted-foreground">Focus on boundaries, consequences, and your own recovery.</p>
                      <p className="text-sm text-primary font-medium mt-1">Consider consulting with an interventionist to help create willingness.</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 p-3 rounded-lg ${totalChecked > 10 && totalChecked <= 20 ? 'bg-yellow-100 dark:bg-yellow-950/50 ring-2 ring-yellow-400' : ''}`}>
                    <TrendingUp className={`h-5 w-5 mt-0.5 ${totalChecked > 10 && totalChecked <= 20 ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                    <div>
                      <span className={`font-semibold ${totalChecked > 10 && totalChecked <= 20 ? 'text-yellow-700 dark:text-yellow-400' : 'text-foreground'}`}>11–20 boxes checked — Emerging readiness</span>
                      <p className="text-sm text-muted-foreground">Encourage professional assessment. Maintain boundaries. Avoid rescuing.</p>
                      <p className="text-sm text-primary font-medium mt-1">Consider consulting with an interventionist to help create willingness.</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 p-3 rounded-lg ${totalChecked > 20 ? 'bg-green-100 dark:bg-green-950/50 ring-2 ring-green-400' : ''}`}>
                    <CheckCircle2 className={`h-5 w-5 mt-0.5 ${totalChecked > 20 ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <div>
                      <span className={`font-semibold ${totalChecked > 20 ? 'text-green-700 dark:text-green-400' : 'text-foreground'}`}>21–30 boxes checked — Strong readiness indicators</span>
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