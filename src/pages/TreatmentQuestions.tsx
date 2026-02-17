import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

export default function TreatmentQuestions() {
  useGuideTracking("/treatment-questions", "Questions to Ask a Treatment Center");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Questions to Ask a Treatment Center | Sober Helpline</title>
        <meta name="description" content="A practical guide with 40 essential questions families should ask when evaluating treatment centers for their loved ones." />
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
              <div className="flex gap-2">
                <Button onClick={handlePrint} className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print Document
                </Button>
              </div>
            </div>

            {/* Printable Document Content */}
            <div className="bg-white dark:bg-card rounded-lg shadow-lg p-8 md:p-12 print:shadow-none print:p-0">
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4 print:hidden" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
                  Questions to Ask a Treatment Center
                </h1>
                <p className="text-lg text-muted-foreground">
                  A Practical Guide for Families Seeking Ethical, Effective Care
                </p>
              </div>

              {/* Purpose Section */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-3">Purpose</h2>
                <p className="text-muted-foreground mb-4">
                  Choosing a treatment center can feel overwhelming, especially when families are in crisis and desperate for help. This guide is designed to help you slow the process down, ask the right questions, and identify whether a program is focused on clinical integrity and long-term recovery, not just admissions and occupancy.
                </p>
                <p className="font-semibold text-primary italic">
                  You are not being difficult by asking these questions. You are being responsible.
                </p>
              </section>

              {/* How to Use */}
              <section className="mb-8 p-4 bg-muted/50 rounded-lg print:bg-gray-100">
                <h2 className="text-lg font-bold mb-3">How to Use This Guide</h2>
                <ul className="space-y-2 text-sm">
                  <li>• Ask these questions before admitting your loved one whenever possible.</li>
                  <li>• Take notes. Compare answers across multiple programs.</li>
                  <li>• Be cautious of centers that avoid specifics, rush decisions, or discourage questions.</li>
                  <li>• <strong>Trust patterns, not promises.</strong></li>
                </ul>
              </section>

              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  1. Clinical Assessment & Individualized Care
                </h2>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Ask:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm ml-2">
                    <li>How is each client clinically assessed upon admission?</li>
                    <li>Who conducts the assessment (credentials and licensure)?</li>
                    <li>How do you determine the appropriate level of care?</li>
                    <li>How do you individualize treatment beyond a standard schedule?</li>
                    <li>How often are treatment plans reviewed and updated?</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What to listen for:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Clear mention of licensed clinicians</li>
                      <li>• Structured assessments (not just intake interviews)</li>
                      <li>• Ongoing treatment plan reviews, not one-time evaluations</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Red flags:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• "Everyone starts in the same program"</li>
                      <li>• Vague descriptions of assessment</li>
                      <li>• No mention of licensed clinical oversight</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  2. Mental Health & Dual Diagnosis Treatment
                </h2>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Ask:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm ml-2" start={6}>
                    <li>How do you assess for co-occurring mental health disorders?</li>
                    <li>What mental health services are provided onsite?</li>
                    <li>How is psychiatric care integrated into treatment?</li>
                    <li>How do you differentiate between substance-induced symptoms and primary mental health conditions?</li>
                    <li>What happens if mental health symptoms escalate?</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What to listen for:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Integrated care, not "referrals out"</li>
                      <li>• Access to psychiatric support when needed</li>
                      <li>• Experience treating dual diagnosis populations</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Red flags:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• "We don't really do mental health"</li>
                      <li>• Over-reliance on labels without treatment plans</li>
                      <li>• Minimizing mental health concerns or addiction severity</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  3. Staff Credentials & Program Structure
                </h2>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Ask:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm ml-2" start={11}>
                    <li>What licenses and certifications do your clinical staff hold?</li>
                    <li>What is the staff-to-client ratio?</li>
                    <li>How much direct clinician contact does each client receive weekly?</li>
                    <li>Who leads groups and individual sessions?</li>
                    <li>What is the role of non-licensed staff?</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What to listen for:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Licensed professionals leading treatment</li>
                      <li>• Clear roles for support staff vs. clinicians</li>
                      <li>• Reasonable caseloads</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Red flags:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Groups primarily run by unlicensed staff</li>
                      <li>• Difficulty explaining staff roles</li>
                      <li>• High turnover or reliance on temporary staff</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  4. Treatment Philosophy & Approach
                </h2>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Ask:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm ml-2" start={16}>
                    <li>How do you define successful treatment?</li>
                    <li>What therapeutic models do you use and why?</li>
                    <li>How do you address denial and resistance?</li>
                    <li>How do you involve families in the process?</li>
                    <li>How do you prepare clients for long-term recovery?</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What to listen for:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Emphasis on behavior change and accountability</li>
                      <li>• Family involvement beyond "family weekend"</li>
                      <li>• Clear philosophy, not buzzwords</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Red flags:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Guarantees of success</li>
                      <li>• One-size-fits-all language</li>
                      <li>• Avoiding discussion of relapse prevention</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  5. Length of Stay & Continuum of Care
                </h2>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Ask:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm ml-2" start={21}>
                    <li>How long do clients typically stay in treatment?</li>
                    <li>What determines readiness to step down or discharge?</li>
                    <li>How do you coordinate transitions to lower levels of care?</li>
                    <li>What happens if a client wants to leave early?</li>
                    <li>How do you measure progress?</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What to listen for:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Clinical decision-making, not insurance-only timelines</li>
                      <li>• Thoughtful step-down planning</li>
                      <li>• Willingness to recommend longer care when appropriate</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Red flags:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Fixed lengths regardless of progress</li>
                      <li>• Discharge based primarily on insurance limits</li>
                      <li>• Poor transition planning</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  6. Family Involvement & Education
                </h2>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Ask:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm ml-2" start={26}>
                    <li>How are families involved in treatment?</li>
                    <li>What education or coaching is provided to families?</li>
                    <li>How do you address enabling and family dynamics?</li>
                    <li>How often do families receive updates?</li>
                    <li>Who is the primary family contact?</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What to listen for:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Ongoing family education and support</li>
                      <li>• Clear communication channels</li>
                      <li>• Family systems awareness</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Red flags:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Minimal family contact</li>
                      <li>• "We focus on the client only"</li>
                      <li>• Lack of family education resources</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  7. Aftercare & Long-Term Planning
                </h2>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Ask:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm ml-2" start={31}>
                    <li>What does aftercare planning include?</li>
                    <li>How do you support relapse prevention after discharge?</li>
                    <li>What follow-up contact do you provide?</li>
                    <li>How do you coordinate with outpatient providers or sober living?</li>
                    <li>What happens if relapse occurs?</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What to listen for:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Structured aftercare planning</li>
                      <li>• Ongoing accountability</li>
                      <li>• Realistic discussion of relapse risk</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Red flags:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Aftercare as an afterthought</li>
                      <li>• No follow-up once discharged</li>
                      <li>• Shame-based response to relapse</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  8. Ethics, Transparency & Financial Practices
                </h2>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Ask:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm ml-2" start={36}>
                    <li>Do you accept referral fees or offer incentives for admissions?</li>
                    <li>How do you handle insurance verification and billing transparency?</li>
                    <li>What costs are not covered by insurance?</li>
                    <li>How do you handle grievances or complaints?</li>
                    <li>Are outcomes tracked and reviewed internally?</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">What to listen for:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Transparency and openness</li>
                      <li>• Clear financial explanations</li>
                      <li>• Ethical boundaries</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded print:bg-gray-50">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">Red flags:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Pressure to admit immediately</li>
                      <li>• Avoiding financial clarity</li>
                      <li>• Defensive responses to ethical questions</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Final Reflection */}
              <section className="mb-8 p-6 bg-muted/50 rounded-lg print:bg-gray-100">
                <h2 className="text-xl font-bold text-logo-green mb-4">Final Reflection for Families</h2>
                <p className="mb-3 font-medium">After speaking with the center, ask yourself:</p>
                <ul className="space-y-2 text-sm">
                  <li>• Did I feel informed or pressured?</li>
                  <li>• Were answers clear or evasive?</li>
                  <li>• Did they welcome my questions?</li>
                  <li>• Do their values align with ours?</li>
                  <li>• Would I trust them with someone I love?</li>
                </ul>
              </section>

              {/* Important Reminder */}
              <section className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5 print:bg-gray-50">
                <h2 className="text-lg font-bold text-logo-green mb-3">Important Reminder</h2>
                <p className="text-muted-foreground mb-3">
                  A quality treatment center will not rush you, pressure you, or promise miracles.
                </p>
                <p className="font-semibold text-primary">
                  It will educate you, respect your role, and focus on long-term recovery.
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
            margin: 0.75in;
          }
        }
      `}</style>
    </>
  );
}
