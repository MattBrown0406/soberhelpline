import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";

export default function RecoveryRequirements() {
  useGuideTracking("/recovery-requirements", "What Recovery Actually Requires From Families");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>What Recovery Actually Requires From Families | Sober Helpline</title>
        <meta name="description" content="A guide to support change without losing yourself. Learn the active, ongoing role families play in recovery." />
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
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4 print:hidden" />
                <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
                  What Recovery Actually Requires From Families
                </h1>
                <p className="text-lg text-muted-foreground">
                  A Guide to Support Change Without Losing Yourself
                </p>
              </div>

              {/* Purpose Section */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-3">Purpose</h2>
                <p className="text-muted-foreground mb-4">
                  Families are often told to "be supportive," without being told what that actually means. This guide clarifies the active, ongoing role families play in recovery—while also naming what families are <em>not</em> responsible for.
                </p>
                <p className="font-semibold text-primary italic">
                  Recovery does not require perfection. It requires consistency, boundaries, and emotional maturity.
                </p>
              </section>

              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  1. A Shift in Expectations
                </h2>
                <p className="text-muted-foreground mb-4">
                  One of the hardest truths for families to accept is this:
                </p>
                <p className="text-lg font-semibold text-center my-4 p-4 bg-muted/50 rounded-lg print:bg-gray-100">
                  Love alone does not create recovery.
                </p>
                <p className="text-muted-foreground mb-4">
                  Recovery requires discomfort, accountability, and time. Families often want immediate relief from chaos, but recovery unfolds slowly and unevenly. Your role is not to rescue, fix, or manage outcomes—it is to stop participating in patterns that protect the addiction.
                </p>
                <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Families must be willing to:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Let go of timelines</li>
                    <li>• Stop negotiating reality</li>
                    <li>• Tolerate discomfort without intervening</li>
                    <li>• Allow natural consequences</li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  2. Consistent Boundaries (Not Emotional Reactions)
                </h2>
                <p className="text-muted-foreground mb-4">
                  Recovery requires boundaries that are:
                </p>
                <ul className="list-disc list-inside mb-4 text-muted-foreground">
                  <li>Clear</li>
                  <li>Specific</li>
                  <li>Enforced consistently</li>
                  <li>Independent of mood, fear, or guilt</li>
                </ul>
                <p className="font-semibold text-primary italic mb-4">
                  Boundaries are not threats or punishments. They are statements of self-respect.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
                    <h3 className="font-semibold mb-2">What this requires from families:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Deciding limits in advance</li>
                      <li>• Following through without arguing or explaining</li>
                      <li>• Allowing consequences to occur</li>
                      <li>• Accepting backlash without retreating</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg print:bg-gray-100">
                    <h3 className="font-semibold mb-2">What it does not require:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Being cold or cruel</li>
                      <li>• Cutting off communication</li>
                      <li>• Constant confrontation</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  3. Emotional Regulation, Not Control
                </h2>
                <p className="text-muted-foreground mb-4">
                  Families often attempt to control recovery because they feel unsafe. Unfortunately, control creates resistance, not change.
                </p>

                <div className="p-4 bg-primary/5 rounded-lg mb-4 print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Recovery requires families to:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Manage their own anxiety</li>
                    <li>• Stop monitoring or tracking behavior</li>
                    <li>• Respond instead of react</li>
                    <li>• Detach emotionally from outcomes</li>
                  </ul>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg print:bg-gray-100">
                  <h3 className="font-semibold mb-2">This means:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• No interrogations</li>
                    <li>• No bargaining</li>
                    <li>• No emotional negotiations</li>
                  </ul>
                </div>

                <p className="mt-4 font-medium text-center text-primary">
                  Stability in the family system increases the likelihood of change—even if it feels counterintuitive.
                </p>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  4. Education and Reality-Based Thinking
                </h2>
                <p className="text-muted-foreground mb-4">
                  Recovery requires families to learn, not just hope.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
                    <h3 className="font-semibold mb-2">Families must understand:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Addiction is a chronic, relapsing condition</li>
                      <li>• Early recovery is fragile and unstable</li>
                      <li>• Motivation fluctuates</li>
                      <li>• Relapse risk exists even with effort</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg print:bg-gray-100">
                    <h3 className="font-semibold mb-2">Recovery does not require:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Blind optimism</li>
                      <li>• Constant positivity</li>
                      <li>• Believing every promise</li>
                    </ul>
                  </div>
                </div>

                <p className="mt-4 font-medium text-center">
                  It requires <span className="text-primary">discernment</span>, not distrust.
                </p>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  5. Allowing Natural Consequences
                </h2>
                <p className="text-muted-foreground mb-4">
                  One of the most important—and hardest—roles families play is getting out of the way of consequences.
                </p>
                <p className="text-lg font-semibold text-center my-4 p-4 bg-muted/50 rounded-lg print:bg-gray-100">
                  Consequences are often the only thing addiction responds to.
                </p>

                <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Families must be willing to:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Stop rescuing</li>
                    <li>• Stop cleaning up messes</li>
                    <li>• Stop absorbing financial, legal, or emotional fallout</li>
                    <li>• Accept that discomfort may increase before it decreases</li>
                  </ul>
                </div>

                <p className="mt-4 font-semibold text-primary italic text-center">
                  This is not abandonment. It is respect for reality.
                </p>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  6. Participation in Their Own Recovery
                </h2>
                <p className="text-lg font-semibold text-center my-4 p-4 bg-primary/10 rounded-lg print:bg-gray-100">
                  Family recovery is not optional—it is essential.
                </p>
                <p className="text-muted-foreground mb-4">
                  Addiction impacts everyone. If families do not change, the system will pull the addicted individual back into old roles.
                </p>

                <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
                  <h3 className="font-semibold mb-2">Recovery requires families to:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Attend support groups or coaching</li>
                    <li>• Examine enabling and codependency patterns</li>
                    <li>• Address their own trauma, anger, or grief</li>
                    <li>• Build lives that are not centered on the addiction</li>
                  </ul>
                </div>

                <p className="mt-4 font-semibold text-primary text-center">
                  Your healing does not depend on their sobriety.
                </p>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  7. Patience Without Passivity
                </h2>
                <p className="text-muted-foreground mb-4">
                  Recovery is slow. Families often oscillate between panic and resignation.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg print:bg-gray-50">
                    <h3 className="font-semibold mb-2">Recovery requires:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Long-term thinking</li>
                      <li>• Measured responses</li>
                      <li>• Acceptance of imperfect progress</li>
                      <li>• Willingness to reassert boundaries repeatedly</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg print:bg-gray-100">
                    <h3 className="font-semibold mb-2">Patience does not mean:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Accepting ongoing chaos</li>
                      <li>• Lowering standards</li>
                      <li>• Ignoring warning signs</li>
                    </ul>
                  </div>
                </div>

                <p className="mt-4 font-medium text-center">
                  It means staying grounded while holding firm.
                </p>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  8. Letting Go of Outcomes
                </h2>
                <p className="text-lg font-semibold text-center my-4 p-4 bg-muted/50 rounded-lg print:bg-gray-100">
                  This is the hardest requirement.
                </p>
                <p className="text-muted-foreground mb-4">
                  Families must release the belief that they can make recovery happen.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded print:bg-gray-50">
                    <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">You can:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Support healthy behavior</li>
                      <li>• Refuse to support destructive behavior</li>
                      <li>• Offer clarity and consistency</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded print:bg-gray-50">
                    <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">You cannot:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Force insight</li>
                      <li>• Control sobriety</li>
                      <li>• Prevent every relapse</li>
                    </ul>
                  </div>
                </div>

                <p className="mt-4 font-semibold text-primary italic text-center">
                  Letting go of outcomes does not mean you stop caring. It means you stop sacrificing yourself.
                </p>
              </section>

              {/* Section 9 */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-logo-green mb-4 pb-2 border-b">
                  9. What Families Are NOT Required to Do
                </h2>
                <p className="text-muted-foreground mb-4">
                  Recovery does not require families to:
                </p>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li>• Accept abuse or manipulation</li>
                  <li>• Endure unsafe environments</li>
                  <li>• Fund ongoing addiction</li>
                  <li>• Ignore their own needs</li>
                  <li>• Put life on hold indefinitely</li>
                </ul>
                <p className="text-lg font-semibold text-primary text-center">
                  Choosing yourself is not betrayal.
                </p>
              </section>

              {/* Section 10 - Final Reframe */}
              <section className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5 print:bg-gray-50">
                <h2 className="text-xl font-bold text-logo-green mb-4">10. A Final Reframe</h2>
                <p className="text-muted-foreground mb-4">
                  Recovery is not about saving someone.<br />
                  It is about creating conditions where change is possible.
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-medium">Families do not cause addiction.</p>
                  <p className="font-medium">They cannot cure it.</p>
                  <p className="font-medium text-primary">But they can stop enabling it—and start healing themselves.</p>
                </div>
                <p className="font-semibold text-center text-lg">
                  That shift often changes everything.
                </p>
              </section>

              {/* Footer for print */}
              <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground print:block hidden">
                <p>Sober Helpline | (541) 241-5668 | www.soberhelpline.com</p>
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
        
          <RelatedResources currentPath="/recovery-requirements" />
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
