import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, AlertTriangle, Heart, Target, Shield, RefreshCw, CheckCircle, XCircle, Lightbulb, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolBrandHeader from "@/components/ToolBrandHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";

export default function MultipleTreatmentEpisodes() {
  useGuideTracking("/multiple-treatment-episodes", "Why Multiple Treatment Episodes Don't Mean Failure");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Why Multiple Treatment Episodes Don't Mean Failure | Sober Helpline</title>
        <meta name="description" content="A reality-based guide for families navigating repeated attempts at recovery. Understanding why multiple treatment episodes are part of the process, not a sign of failure." />
      </Helmet>

      <div className="min-h-screen bg-background">

        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 print:hidden">
              <Link
                to="/family-education"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Family Resources
              </Link>
              <Button onClick={handlePrint} variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Print Guide
              </Button>
            </div>

            {/* Printable Header */}
            <div className="hidden print:block mb-6">
              <p className="text-lg font-bold">Sober Helpline</p>
              <p className="text-sm text-muted-foreground">(541) 241-5886</p>
            </div>

            <ToolBrandHeader
              title="Why Multiple Treatment Episodes Don't Mean Failure"
              subtitle="A reality-based guide for families navigating repeated attempts at recovery. Multiple treatment episodes are not a sign of failure — they are a recognized part of the chronic disease process."
              clinicalNote="Based on NIDA's Principles of Drug Addiction Treatment and the chronic disease management model endorsed by ASAM (American Society of Addiction Medicine)."
            />

            <div className="space-y-8">

              {/* Why This Guide Matters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <Heart className="h-5 w-5" />
                    Why This Guide Matters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground italic">
                    Families often arrive at this question quietly and painfully:
                  </p>
                  <p className="text-lg font-medium text-center py-4 border-l-4 border-primary pl-4 bg-muted/30 rounded-r">
                    "If treatment works, why are we here again?"
                  </p>
                  <p className="text-muted-foreground">Repeated treatment episodes can leave families feeling:</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {["Hopeless", "Angry", "Embarrassed", "Skeptical", "Blamed—by others or themselves"].map((feeling) => (
                      <span key={feeling} className="px-3 py-1 bg-destructive/10 text-destructive rounded text-sm text-center">
                        {feeling}
                      </span>
                    ))}
                  </div>
                  <Alert className="border-primary/50 bg-primary/5">
                    <AlertDescription className="text-foreground font-medium">
                      This guide exists to separate myth from reality, and to help families respond with clarity instead of despair.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* A Necessary Truth */}
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <Lightbulb className="h-5 w-5" />
                    First, a Necessary Truth
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xl font-semibold text-center">
                    Multiple treatment episodes do not automatically mean failure.
                  </p>
                  <p className="text-muted-foreground text-center">They mean:</p>
                  <ul className="space-y-2">
                    {[
                      "The illness is complex",
                      "The strategy may need adjustment",
                      "The level of care may not match the need",
                      "External supports may be insufficient",
                      "Readiness may fluctuate"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-center font-medium text-primary pt-4 border-t">
                    Addiction is a chronic, relapsing condition—not a one-time event.
                  </p>
                </CardContent>
              </Card>

              {/* The Myth of One-and-Done */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <XCircle className="h-5 w-5 text-destructive" />
                    The Myth of "One-and-Done" Treatment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Many families are told—explicitly or implicitly—that:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    {[
                      "One good program should \"fix it\"",
                      "Motivation should carry over indefinitely",
                      "Insight equals readiness",
                      "Relapse equals refusal"
                    ].map((myth) => (
                      <li key={myth} className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                        <span>{myth}</span>
                      </li>
                    ))}
                  </ul>
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This framing sets families up for disappointment.
                    </AlertDescription>
                  </Alert>
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">The Reality:</h4>
                    <p className="text-muted-foreground mb-3">Recovery often requires:</p>
                    <ul className="space-y-2">
                      {[
                        "Multiple exposures to structure",
                        "Repeated skill-building",
                        "Time for internal readiness to develop",
                        "Increasing accountability over time"
                      ].map((reality) => (
                        <li key={reality} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{reality}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-center font-medium text-primary mt-4">
                      Change is rarely linear.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Why Treatment Sometimes Doesn't Stick */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <AlertTriangle className="h-5 w-5" />
                    Why Treatment Sometimes Doesn't "Stick"
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Reason 1 */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">1. The Level of Care Was Too Low</h4>
                    <p className="text-muted-foreground mb-2">Outpatient care may be insufficient for:</p>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      {["Long-term use", "Co-occurring mental health issues", "Poor executive functioning", "Unsafe environments"].map((item) => (
                        <li key={item} className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-amber-600 dark:text-amber-400 font-medium mt-3">
                      When treatment fails, it often means the container was too small.
                    </p>
                  </div>

                  {/* Reason 2 */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-sky-600 dark:text-sky-400 mb-2">2. Aftercare Was Inadequate</h4>
                    <p className="text-muted-foreground mb-2">Discharge is one of the most dangerous points in recovery.</p>
                    <p className="text-sm text-muted-foreground mb-2">Common issues:</p>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      {["Too much freedom too quickly", "Poor outpatient follow-through", "Family boundaries collapsing out of relief", "Structure dropping before stability"].map((item) => (
                        <li key={item} className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sky-600 dark:text-sky-400 font-medium mt-3">
                      Relapse here reflects system failure, not personal failure.
                    </p>
                  </div>

                  {/* Reason 3 */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">3. Motivation Was External</h4>
                    <p className="text-muted-foreground mb-2">Early treatment compliance may be driven by:</p>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      {["Legal pressure", "Family ultimatums", "Financial leverage", "Fear of consequences"].map((item) => (
                        <li key={item} className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-purple-600 dark:text-purple-400 font-medium mt-3">
                      External motivation can start the process—but internal motivation takes time.
                    </p>
                  </div>

                  {/* Reason 4 */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-rose-600 dark:text-rose-400 mb-2">4. Insight Was Mistaken for Change</h4>
                    <p className="text-muted-foreground mb-2">Someone may:</p>
                    <ul className="space-y-1 text-sm">
                      {["Speak eloquently about recovery", "Agree with recommendations", "Express remorse"].map((item) => (
                        <li key={item} className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-rose-600 dark:text-rose-400 font-medium mt-3">
                      Without behavioral change, insight alone does not sustain sobriety.
                    </p>
                  </div>

                  {/* Reason 5 */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">5. Underlying Issues Weren't Addressed</h4>
                    <p className="text-muted-foreground mb-2">Relapse is likely when:</p>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      {["Trauma is untreated", "Psychiatric conditions are unmanaged", "Brain injury or cognitive impairment exists", "Environment remains unsafe"].map((item) => (
                        <li key={item} className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-teal-600 dark:text-teal-400 font-medium mt-3">
                      Addiction rarely exists in isolation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* What Repeated Episodes Tell Us */}
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <RefreshCw className="h-5 w-5" />
                    What Repeated Episodes Actually Tell Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Multiple treatment attempts often indicate:</p>
                  <ul className="space-y-2">
                    {[
                      "Increasing awareness (even if denied)",
                      "A nervous system struggling to regulate",
                      "A need for more structure, not less",
                      "A need for longer durations of care",
                      "A need for different modalities"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-center font-semibold text-primary pt-4 border-t text-lg">
                    Repetition often signals persistence, not futility.
                  </p>
                </CardContent>
              </Card>

              {/* Danger of Shame-Based Narratives */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    The Danger of Shame-Based Narratives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Families often hear:</p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      "\"They're just not ready\"",
                      "\"They don't want it badly enough\"",
                      "\"You're enabling\"",
                      "\"Stop trying\""
                    ].map((phrase) => (
                      <div key={phrase} className="px-3 py-2 bg-destructive/10 text-destructive rounded text-sm italic">
                        {phrase}
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground">While boundaries are essential, shame-driven conclusions:</p>
                  <ul className="space-y-1">
                    {["Reduce engagement", "Increase secrecy", "Push families toward extremes"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-destructive">
                        <XCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-center font-semibold text-primary pt-4 border-t">
                    Hope and accountability must coexist.
                  </p>
                </CardContent>
              </Card>

              {/* What Families Can Do Differently */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <Target className="h-5 w-5" />
                    What Families Can Do Differently After Multiple Attempts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1 */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-3">1. Shift the Question</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 bg-destructive/10 rounded border border-destructive/30">
                        <p className="text-sm text-muted-foreground mb-1">Instead of:</p>
                        <p className="text-destructive font-medium">"Why didn't it work?"</p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded border border-primary/30">
                        <p className="text-sm text-muted-foreground mb-1">Ask:</p>
                        <p className="text-primary font-medium">"What was missing?"</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-3">2. Evaluate the Treatment Continuum</h4>
                    <p className="text-muted-foreground mb-2">Consider:</p>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      {["Length of stay", "Step-down pacing", "Monitoring and accountability", "Family involvement", "Aftercare coordination"].map((item) => (
                        <li key={item} className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-3">3. Adjust the Strategy, Not the Support</h4>
                    <p className="text-muted-foreground mb-2">Support does not mean repeating the same approach. It may mean:</p>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      {["Higher levels of care", "Longer durations", "Legal leverage", "Stronger boundaries", "Reduced access to resources"].map((item) => (
                        <li key={item} className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-3">4. Protect Family Stability</h4>
                    <p className="text-muted-foreground mb-2">Family health cannot be contingent on outcomes. Families must:</p>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      {["Maintain boundaries", "Avoid financial collapse", "Reduce emotional reactivity", "Reclaim their lives"].map((item) => (
                        <li key={item} className="flex items-center gap-1">
                          <Shield className="h-3 w-3 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-primary font-medium mt-3 text-center">
                      This protects everyone.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* When Multiple Attempts Signal Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <RefreshCw className="h-5 w-5" />
                    When Multiple Attempts Do Signal a Need for Change
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Repeated treatment may signal the need to:</p>
                  <ul className="space-y-2">
                    {[
                      "Escalate care",
                      "Introduce accountability (legal, residential, monitored)",
                      "Address co-occurring disorders seriously",
                      "Slow down discharge",
                      "Shift from persuasion to boundaries"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-center font-semibold text-primary pt-4 border-t">
                    This is not giving up—it is changing tactics.
                  </p>
                </CardContent>
              </Card>

              {/* Critical Reframe */}
              <Card className="border-primary bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <Lightbulb className="h-5 w-5" />
                    A Critical Reframe for Families
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xl font-semibold text-center">
                    Treatment attempts are data—not verdicts.
                  </p>
                  <p className="text-muted-foreground text-center">Each attempt reveals:</p>
                  <ul className="space-y-2 max-w-md mx-auto">
                    {[
                      "What works",
                      "What doesn't",
                      "What level of structure is required",
                      "Where families must change their role"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Holding Hope */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <Heart className="h-5 w-5" />
                    Holding Hope Without Illusion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                      <h4 className="font-semibold text-destructive mb-2">Hope does not mean:</h4>
                      <ul className="space-y-1 text-sm">
                        {["Ignoring risk", "Trusting too quickly", "Repeating the same plan"].map((item) => (
                          <li key={item} className="flex items-center gap-1">
                            <XCircle className="h-3 w-3 text-destructive" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                      <h4 className="font-semibold text-primary mb-2">Hope means:</h4>
                      <ul className="space-y-1 text-sm">
                        {["Staying flexible", "Staying grounded", "Staying engaged without losing yourself"].map((item) => (
                          <li key={item} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Final Thought */}
              <Card className="bg-logo-green/10 border-logo-green/30">
                <CardHeader>
                  <CardTitle className="text-center text-logo-green">Final Thought</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <p className="text-lg font-semibold">
                    Multiple treatment episodes do not mean your loved one cannot recover.
                  </p>
                  <p className="text-muted-foreground">They mean:</p>
                  <ul className="space-y-2 max-w-md mx-auto text-left">
                    {[
                      "Recovery may require time",
                      "The illness is persistent",
                      "The system must adapt",
                      "Families must protect themselves"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-logo-green flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-primary font-semibold pt-4 border-t text-lg">
                    Progress is often measured in learning—not outcomes alone.
                  </p>
                </CardContent>
              </Card>

              {/* Companion Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green">
                    <BookOpen className="h-5 w-5" />
                    Suggested Companion Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Link to="/aftercare-checklist" className="flex items-center gap-2 text-primary hover:underline">
                      <CheckCircle className="h-4 w-4" />
                      Aftercare Readiness Checklist
                    </Link>
                    <Link to="/relapse-warning-signs" className="flex items-center gap-2 text-primary hover:underline">
                      <CheckCircle className="h-4 w-4" />
                      Relapse Warning Signs Tracker
                    </Link>
                    <Link to="/family-action-plan" className="flex items-center gap-2 text-primary hover:underline">
                      <CheckCircle className="h-4 w-4" />
                      Family Recovery Action Plan
                    </Link>
                    <Link to="/family-education" className="flex items-center gap-2 text-primary hover:underline">
                      <CheckCircle className="h-4 w-4" />
                      Guilt vs. Responsibility Module
                    </Link>
                    <Link to="/crisis-chaos" className="flex items-center gap-2 text-primary hover:underline">
                      <CheckCircle className="h-4 w-4" />
                      Crisis vs. Chaos Decision Guide
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
              <p>Sober Helpline | (541) 241-5886 | www.soberhelpline.com</p>
            </div>
          </div>
        
          <RelatedResources currentPath="/multiple-treatment-episodes" />
</main>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 0.75in;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}
