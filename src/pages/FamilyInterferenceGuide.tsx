import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, Printer, Heart, Shield, AlertTriangle, HelpCircle, Scale, Brain, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";
import SafetyBox from "@/components/SafetyBox";

export default function FamilyInterferenceGuide() {
  useGuideTracking("/family-interference", "How Families Accidentally Interfere with Recovery");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>How Families Accidentally Interfere with Recovery | Sober Helpline</title>
        <meta name="description" content="Understanding how love, fear, and urgency can work against recovery. Learn to recognize interference patterns and what actually helps." />
      </Helmet>

      <div className="min-h-screen bg-background print:bg-white">
        <main className="container py-8 md:py-12 print:py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 print:hidden">
              <Link
                to="/family-education"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Family Education
              </Link>
              <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>

            <ToolBrandHeader
              headingAs="h1"
              title="How Families Accidentally Interfere with Recovery"
              subtitle="When love, fear, and urgency work against change. Understanding interference patterns is the first step to supporting recovery instead of undermining it."
              clinicalNote="Based on family interference patterns identified in clinical addiction treatment and the concept of 'helping that hurts' from Al-Anon literature."
            />


            {/* Why This Guide Matters */}
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-logo-blue">Why This Guide Matters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families affected by addiction often hear:</p>
                <ul className="space-y-2 text-muted-foreground italic">
                  <li>"Stop enabling."</li>
                  <li>"You're doing too much."</li>
                  <li>"You're in the way."</li>
                </ul>
                <p className="text-muted-foreground">
                  These messages are rarely explained well—and often land as blame.
                </p>
                <p className="text-foreground font-medium">The truth is more nuanced.</p>
                <p className="text-lg font-semibold text-foreground bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                  Families don't interfere because they don't care.<br />
                  They interfere because they care deeply, are often scared, and are trying to prevent harm in the only ways they know how.
                </p>
                <p className="text-muted-foreground">
                  This guide explains how interference happens, why it's understandable, and what helps instead.
                </p>
              </CardContent>
            </Card>

            {/* Starting Point */}
            <Card className="mb-8 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-400">A Necessary Starting Point</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground font-medium">
                  Families do not cause addiction.
                </p>
                <p className="text-muted-foreground">
                  But family responses can either support recovery or buffer addiction from consequences.
                </p>
                <p className="text-foreground font-semibold">
                  Understanding the difference restores agency—without shame.
                </p>
              </CardContent>
            </Card>

            {/* Seven Ways Families Interfere */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-logo-blue mb-4">How Interference Happens</h2>
              <div className="space-y-4">
                {/* 1. Over-Functioning */}
                <section className="rounded-lg border bg-card p-5 print:break-inside-avoid">
                  <h3 className="flex items-center gap-3 text-lg">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                    <span className="font-semibold text-left">Over-Functioning: Doing What the Person Should Be Doing</span>
                  </h3>
                  <div className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What It Looks Like</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Making calls on their behalf</li>
                        <li>Managing appointments</li>
                        <li>Handling finances</li>
                        <li>Explaining or covering mistakes</li>
                        <li>Solving problems they created</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Why Families Do This</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Fear of collapse</li>
                        <li>Desire to reduce chaos</li>
                        <li>Belief that "someone has to step in"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> How It Interferes
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Prevents natural consequences</li>
                        <li>Reinforces dependency</li>
                        <li>Sends the message: "You can't—or don't need to—do this."</li>
                      </ul>
                    </div>
                    <p className="font-semibold text-foreground bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                      Recovery requires responsibility.<br />
                      Over-functioning quietly removes it.
                    </p>
                  </div>
                </section>

                {/* 2. Emotional Rescuing */}
                <section className="rounded-lg border bg-card p-5 print:break-inside-avoid">
                  <h3 className="flex items-center gap-3 text-lg">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                    <span className="font-semibold text-left">Emotional Rescuing</span>
                  </h3>
                  <div className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What It Looks Like</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Soothing distress immediately</li>
                        <li>Backing down when guilt appears</li>
                        <li>Reversing boundaries after emotional reactions</li>
                        <li>Reassuring without accountability</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-700 dark:text-pink-400 mb-2">Why Families Do This</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Discomfort with pain</li>
                        <li>Fear of escalation</li>
                        <li>Desire to be supportive</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> How It Interferes
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Teaches that distress equals rescue</li>
                        <li>Undermines emotional tolerance</li>
                        <li>Reinforces avoidance instead of growth</li>
                      </ul>
                    </div>
                    <p className="font-semibold text-foreground bg-pink-50 dark:bg-pink-950/30 p-3 rounded-lg">
                      Discomfort is not harm.<br />
                      Avoiding all discomfort blocks change.
                    </p>
                    <SafetyBox
                      topics={["emergency", "suicide"]}
                      title="Discomfort is not harm. Danger is different."
                      className="mb-0"
                    />
                  </div>
                </section>

                {/* 3. Inconsistent Boundaries */}
                <section className="rounded-lg border bg-card p-5 print:break-inside-avoid">
                  <h3 className="flex items-center gap-3 text-lg">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                    <span className="font-semibold text-left">Inconsistent Boundaries</span>
                  </h3>
                  <div className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What It Looks Like</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Boundaries set in crisis, dropped in calm</li>
                        <li>Consequences enforced once, then forgotten</li>
                        <li>"One more chance" cycles</li>
                        <li>Mixed messages between family members</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Why Families Do This</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Hope after promises</li>
                        <li>Fatigue</li>
                        <li>Desire for peace</li>
                        <li>Fear of being "too harsh"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> How It Interferes
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Creates unpredictability</li>
                        <li>Teaches boundaries are negotiable</li>
                        <li>Reinforces manipulation (even unintentionally)</li>
                      </ul>
                    </div>
                    <p className="font-semibold text-foreground bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
                      Consistency—not intensity—creates change.
                    </p>
                  </div>
                </section>

                {/* 4. Confusing Insight with Readiness */}
                <section className="rounded-lg border bg-card p-5 print:break-inside-avoid">
                  <h3 className="flex items-center gap-3 text-lg">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                    <span className="font-semibold text-left">Confusing Insight with Readiness</span>
                  </h3>
                  <div className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What It Looks Like</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Trusting apologies as proof of change</li>
                        <li>Relaxing structure after emotional conversations</li>
                        <li>Believing awareness equals capacity</li>
                        <li>Expecting consistency too soon</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Why Families Do This</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Relief</li>
                        <li>Hope</li>
                        <li>Desire to believe it's "finally different"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> How It Interferes
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Removes support too early</li>
                        <li>Exposes the person to triggers before stability</li>
                        <li>Sets everyone up for disappointment</li>
                      </ul>
                    </div>
                    <p className="font-semibold text-foreground bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                      Insight is awareness—not ability.
                    </p>
                  </div>
                </section>

                {/* 5. Shielding from Consequences */}
                <section className="rounded-lg border bg-card p-5 print:break-inside-avoid">
                  <h3 className="flex items-center gap-3 text-lg">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">5</span>
                    <span className="font-semibold text-left">Shielding from Consequences</span>
                  </h3>
                  <div className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What It Looks Like</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Paying fines, debts, or legal costs</li>
                        <li>Preventing job or housing loss</li>
                        <li>Intervening with employers, schools, or courts</li>
                        <li>Absorbing financial or social fallout</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Why Families Do This</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Fear of harm</li>
                        <li>Guilt</li>
                        <li>Desire to "protect their future"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> How It Interferes
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Delays motivation</li>
                        <li>Increases entitlement</li>
                        <li>Transfers consequences to the family system</li>
                      </ul>
                    </div>
                    <p className="font-semibold text-foreground bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                      Consequences are information—not punishment.
                    </p>
                  </div>
                </section>

                {/* 6. Focusing on Mental Health to Avoid Addiction */}
                <section className="rounded-lg border bg-card p-5 print:break-inside-avoid">
                  <h3 className="flex items-center gap-3 text-lg">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">6</span>
                    <span className="font-semibold text-left">Focusing on Mental Health to Avoid Addiction</span>
                  </h3>
                  <div className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What It Looks Like</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Emphasizing therapy over treatment</li>
                        <li>Explaining behavior solely through diagnoses</li>
                        <li>Avoiding conversations about substance use</li>
                        <li>Hoping mental health improvement will end addiction</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-700 dark:text-teal-400 mb-2">Why Families Do This</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Less stigma</li>
                        <li>Feels more compassionate</li>
                        <li>Avoids confrontation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> How It Interferes
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Allows addiction to continue unchecked</li>
                        <li>Delays stabilization</li>
                        <li>Confuses treatment priorities</li>
                      </ul>
                    </div>
                    <p className="font-semibold text-foreground bg-teal-50 dark:bg-teal-950/30 p-3 rounded-lg">
                      Addressing addiction first often protects mental health, not harms it.
                    </p>
                  </div>
                </section>

                {/* 7. Carrying the Entire Recovery Process */}
                <section className="rounded-lg border bg-card p-5 print:break-inside-avoid">
                  <h3 className="flex items-center gap-3 text-lg">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">7</span>
                    <span className="font-semibold text-left">Carrying the Entire Recovery Process</span>
                  </h3>
                  <div className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What It Looks Like</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Monitoring constantly</li>
                        <li>Managing treatment logistics alone</li>
                        <li>Being the emotional regulator for everyone</li>
                        <li>Living in permanent crisis-prevention mode</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2">Why Families Do This</h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Hypervigilance from trauma</li>
                        <li>Fear of disaster</li>
                        <li>Belief that letting go equals abandonment</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> How It Interferes
                      </h4>
                      <ul className="list-disc list-inside text-muted-foreground ml-2">
                        <li>Burns out the family</li>
                        <li>Creates dependence</li>
                        <li>Prevents natural accountability</li>
                        <li>Keeps everyone dysregulated</li>
                      </ul>
                    </div>
                    <p className="font-semibold text-foreground bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg">
                      Families are not meant to be treatment centers.
                    </p>
                  </div>
                </section>
              </div>
            </div>

            {/* What Actually Helps */}
            <Card className="mb-8 border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">What Actually Helps Instead</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Recovery is supported—not sabotaged—when families:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Set clear, consistent boundaries</li>
                  <li>Allow appropriate consequences</li>
                  <li>Reduce emotional reactivity</li>
                  <li>Focus on their own regulation</li>
                  <li>Support structure without controlling outcomes</li>
                  <li>Separate compassion from rescue</li>
                </ul>
              </CardContent>
            </Card>

            {/* Critical Reframe */}
            <Card className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-400">A Critical Reframe for Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-semibold text-foreground">
                  Helping too much can feel like love—<br />
                  but it often removes the conditions needed for change.
                </p>
                <p className="text-foreground font-medium">
                  Doing less, more consistently, is often more effective than doing more emotionally.
                </p>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-logo-blue">Final Thought</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Families interfere with recovery not because they're careless—but because they're trying to survive uncertainty and fear.
                </p>
                <p className="text-muted-foreground">Recovery improves when families:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Stop absorbing the consequences</li>
                  <li>Stop managing what they can't control</li>
                  <li>Stop equating rescue with love</li>
                  <li>Start protecting their own stability</li>
                </ul>
                <div className="border-t pt-4 mt-4">
                  <p className="text-foreground font-medium">
                    When families change how they respond, the system changes—even if the addicted person resists at first.
                  </p>
                  <p className="text-lg font-semibold text-logo-blue mt-2">
                    That shift often creates the conditions where recovery becomes possible.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-logo-blue">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/enabling-self-assessment">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Enabling Self-Assessment
                    </Button>
                  </Link>
                  <Link to="/workbook/boundary-script">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Write one boundary you can hold
                    </Button>
                  </Link>
                  <Link to="/workbook/guilt-check">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Guilt or responsibility?
                    </Button>
                  </Link>
                  <Link to="/workbook/stress-check">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-3 w-3" />
                      Nervous system check-in
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        
          <RelatedResources currentPath="/family-interference" />
</main>
      </div>
    </>
  );
}
