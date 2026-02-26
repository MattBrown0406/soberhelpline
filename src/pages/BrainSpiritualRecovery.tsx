import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Brain, Heart, CheckCircle, AlertTriangle, Lightbulb, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";

export default function BrainSpiritualRecovery() {
  useGuideTracking("Addiction, the Brain, and Spiritual Recovery", "/brain-spiritual-recovery");
  return (
    <>
      <Helmet>
        <title>Addiction, the Brain, and Spiritual Recovery | Sober Helpline</title>
        <meta name="description" content="Understanding how addiction affects the brain and why spiritual recovery through the 12 Steps supports neurobiological healing." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/family-education"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Family Education
            </Link>

            <div className="text-center mb-10">
              <div className="flex justify-center gap-3 mb-4">
                <Brain className="h-12 w-12 text-primary" />
                <Heart className="h-12 w-12 text-rose-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                Addiction, the Brain, and the Role of Spiritual Recovery
              </h1>
              <p className="text-xl text-muted-foreground">
                How a Medical Condition Heals Through Neurobiology, Behavior, and the 12 Steps
              </p>
            </div>

            {/* Why This Guide Matters */}
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">Why This Guide Matters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Families often hear two explanations that sound incompatible:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">1.</span>
                    <span>"Addiction is a brain disease."</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-medium">2.</span>
                    <span>"Recovery requires spiritual change."</span>
                  </li>
                </ul>
                <p className="text-muted-foreground">This creates confusion:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground list-disc">
                  <li>How can a medical condition be helped by spirituality?</li>
                  <li>Why would prayer or surrender affect brain chemistry?</li>
                  <li>Is the 12-Step approach outdated—or misunderstood?</li>
                </ul>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                  <p className="font-medium text-foreground">The truth is more integrated than most people realize.</p>
                  <p className="text-muted-foreground mt-2">
                    <strong>Addiction is a medical condition of the brain.</strong><br />
                    Recovery requires biological, psychological, social—<em>and spiritual</em> healing.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Addiction Through a Neuroscience Lens */}
            <Card className="mb-8 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Addiction Through a Neuroscience Lens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-foreground mb-2">Addiction Is Not a Moral Failure</h4>
                  <p className="text-muted-foreground">
                    Addiction is a chronic condition involving measurable changes in brain structure and function, 
                    particularly in areas responsible for:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                    {["Motivation", "Reward", "Decision-making", "Stress regulation", "Self-control"].map((area) => (
                      <span key={area} className="text-sm bg-white dark:bg-background px-3 py-1 rounded border">
                        {area}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mt-3 italic">
                    These changes explain why people continue using despite consequences.
                  </p>
                </div>

                <h4 className="font-semibold text-foreground text-lg">The Three Core Brain Systems Affected by Addiction</h4>
                
                {/* Reward System */}
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <h5 className="font-semibold text-foreground">1. The Reward System (Dopamine)</h5>
                  <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <p><strong>In a healthy brain:</strong> Dopamine reinforces survival behaviors (eating, connection, purpose).</p>
                    <p><strong>In addiction:</strong></p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>Substances hijack dopamine signaling</li>
                      <li>The brain learns that the substance equals survival-level importance</li>
                      <li>Natural rewards lose their impact</li>
                    </ul>
                    <p className="bg-yellow-50 dark:bg-yellow-950/30 p-2 rounded mt-2">
                      <strong>Result:</strong> The brain is no longer choosing pleasure—it is avoiding distress.
                    </p>
                  </div>
                </div>

                {/* Stress System */}
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <h5 className="font-semibold text-foreground">2. The Stress System (Amygdala)</h5>
                  <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <p><strong>Chronic substance use:</strong></p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>Sensitizes the stress response</li>
                      <li>Increases anxiety, irritability, and emotional pain</li>
                      <li>Makes discomfort feel intolerable</li>
                    </ul>
                    <p className="bg-red-50 dark:bg-red-950/30 p-2 rounded mt-2">
                      <strong>Result:</strong> Substances become relief from a dysregulated nervous system—not indulgence.
                    </p>
                  </div>
                </div>

                {/* Decision-Making System */}
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h5 className="font-semibold text-foreground">3. The Decision-Making System (Prefrontal Cortex)</h5>
                  <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <p><strong>Addiction impairs:</strong></p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>Impulse control</li>
                      <li>Long-term planning</li>
                      <li>Insight-to-action translation</li>
                    </ul>
                    <p className="bg-purple-50 dark:bg-purple-950/30 p-2 rounded mt-2">
                      <strong>Result:</strong> People may know what's right—and still be unable to do it consistently.
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground italic text-center">
                  This explains why insight alone doesn't equal change.
                </p>
              </CardContent>
            </Card>

            {/* Why Willpower Alone Fails */}
            <Card className="mb-8 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-orange-700 dark:text-orange-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Why Willpower Alone Fails (Scientifically)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Willpower depends on:</p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>A regulated nervous system</li>
                  <li>Functional executive control</li>
                  <li>Emotional tolerance</li>
                </ul>
                <p className="font-medium text-foreground">Addiction disrupts all three.</p>
                <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-muted-foreground italic">
                    Expecting willpower to fix addiction is like expecting a broken leg to heal through motivation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Where Does Spirituality Fit */}
            <Card className="mb-8 border-rose-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  So Where Does Spirituality Fit Into a Medical Condition?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-lg border border-rose-200 dark:border-rose-800">
                  <p className="font-medium text-foreground">Here's the critical reframe:</p>
                  <p className="text-muted-foreground mt-2">
                    Spiritual practices in recovery are <strong>not</strong> religious solutions to addiction.<br />
                    They are <strong>neurological, psychological, and behavioral interventions.</strong>
                  </p>
                </div>
                <p className="text-muted-foreground">The 12 Steps work because they:</p>
                <ul className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "Restore regulation",
                    "Reduce isolation",
                    "Interrupt compulsive loops",
                    "Rebuild meaning and identity",
                    "Support sustained behavior change"
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* How the 12 Steps Support Brain Healing */}
            <Card className="mb-8 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  How the 12 Steps Support Brain Healing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground">Step 1: Admitting Powerlessness</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">Neuroscience Impact:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Reduces cognitive dissonance</li>
                    <li>Lowers stress from constant self-control attempts</li>
                    <li>Interrupts denial-based stress loops</li>
                  </ul>
                  <p className="text-sm italic mt-2 text-emerald-700 dark:text-emerald-400">
                    Letting go of false control calms the nervous system.
                  </p>
                </div>

                {/* Steps 2-3 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground">Steps 2–3: Surrender and Trust in Something Larger</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">Neuroscience Impact:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Shifts the brain from hyper-control to safety</li>
                    <li>Reduces chronic stress activation</li>
                    <li>Increases emotional regulation</li>
                  </ul>
                  <p className="text-sm italic mt-2 text-emerald-700 dark:text-emerald-400">
                    This is not about religion—it's about relieving the brain from carrying everything alone.
                  </p>
                </div>

                {/* Steps 4-5 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground">Steps 4–5: Inventory and Disclosure</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">Neuroscience Impact:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Reduces shame (a major relapse trigger)</li>
                    <li>Integrates memory and emotion</li>
                    <li>Decreases limbic system reactivity</li>
                  </ul>
                  <p className="text-sm italic mt-2 text-emerald-700 dark:text-emerald-400">
                    Secrecy keeps the brain in survival mode. Disclosure restores regulation.
                  </p>
                </div>

                {/* Steps 6-7 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground">Steps 6–7: Willingness to Change</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">Neuroscience Impact:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Increases cognitive flexibility</li>
                    <li>Reduces rigid defense patterns</li>
                    <li>Opens new behavioral pathways</li>
                  </ul>
                  <p className="text-sm italic mt-2 text-emerald-700 dark:text-emerald-400">
                    Willingness precedes behavior change.
                  </p>
                </div>

                {/* Steps 8-9 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground">Steps 8–9: Repairing Relationships</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">Neuroscience Impact:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Restores social bonding systems</li>
                    <li>Reduces isolation-driven stress</li>
                    <li>Rebuilds trust pathways</li>
                  </ul>
                  <p className="text-sm italic mt-2 text-emerald-700 dark:text-emerald-400">
                    Connection is a biological regulator—not a luxury.
                  </p>
                </div>

                {/* Steps 10-12 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground">Steps 10–12: Maintenance and Meaning</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">Neuroscience Impact:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>Reinforces new neural pathways</li>
                    <li>Supports long-term regulation</li>
                    <li>Provides purpose and identity beyond addiction</li>
                  </ul>
                  <p className="text-sm italic mt-2 text-emerald-700 dark:text-emerald-400">
                    Meaning stabilizes recovery more effectively than fear.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Why Spirituality Matters in Brain Healing */}
            <Card className="mb-8 border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-violet-700 dark:text-violet-400">
                  Why Spirituality Matters in Brain Healing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Spiritual practices support:</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { practice: "Humility", effect: "reduces ego-driven stress" },
                    { practice: "Gratitude", effect: "activates reward systems naturally" },
                    { practice: "Service", effect: "strengthens social bonding" },
                    { practice: "Acceptance", effect: "lowers stress hormones" }
                  ].map((item) => (
                    <div key={item.practice} className="bg-violet-50 dark:bg-violet-950/30 p-3 rounded-lg">
                      <span className="font-medium">{item.practice}</span>
                      <span className="text-muted-foreground"> — {item.effect}</span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mt-4 font-medium">
                  These practices directly counteract the neurobiology of addiction.
                </p>
              </CardContent>
            </Card>

            {/* Addressing Common Family Concerns */}
            <Card className="mb-8 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Addressing Common Family Concerns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-amber-500 pl-4 py-2">
                  <p className="font-medium text-foreground">"Isn't the 12 Steps outdated?"</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    No. The language may feel old, but the mechanisms align with modern neuroscience.
                  </p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4 py-2">
                  <p className="font-medium text-foreground">"What if my loved one isn't religious?"</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Spirituality in recovery is not about belief—it's about relationship, meaning, and surrender of control.
                  </p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4 py-2">
                  <p className="font-medium text-foreground">"Isn't addiction medical—why not just use medication?"</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Medication can stabilize the brain. It does not rebuild identity, meaning, or community.<br />
                    <strong>Recovery requires both.</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* The Integration Model */}
            <Card className="mb-8 border-teal-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-teal-700 dark:text-teal-400">
                  The Integration Model (What Actually Works Best)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Most sustained recoveries involve:</p>
                <ul className="space-y-2">
                  {[
                    "Medical stabilization (detox, MAT if appropriate)",
                    "Psychological treatment",
                    "Behavioral structure",
                    "Social accountability",
                    "Spiritual growth or meaning-based practice"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-teal-50 dark:bg-teal-950/30 p-4 rounded-lg border border-teal-200 dark:border-teal-800 mt-4">
                  <p className="font-medium text-center">
                    The brain heals through <strong>repetition</strong>, <strong>regulation</strong>, and <strong>relationship</strong>.
                  </p>
                  <p className="text-center text-muted-foreground mt-1">
                    The 12 Steps provide all three.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Critical Reframe for Families */}
            <Card className="mb-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/30">
              <CardHeader>
                <CardTitle className="text-xl text-primary">A Critical Reframe for Families</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-center">
                  Addiction is a disease of <strong>disconnection</strong>—<br />
                  from self, others, and meaning.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white dark:bg-background p-4 rounded-lg border text-center">
                    <p className="font-medium">Medical treatment</p>
                    <p className="text-muted-foreground text-sm">stabilizes the brain</p>
                  </div>
                  <div className="bg-white dark:bg-background p-4 rounded-lg border text-center">
                    <p className="font-medium">Spiritual recovery</p>
                    <p className="text-muted-foreground text-sm">restores connection</p>
                  </div>
                </div>
                <p className="text-center font-semibold mt-4 text-primary">Both are necessary.</p>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 bg-logo-green/5 border-logo-green/30">
              <CardHeader>
                <CardTitle className="text-xl text-logo-green">Final Thought</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The 12 Steps are not a replacement for medical care.<br />
                  They are a framework that helps the brain heal by changing how a person relates to themselves, others, and life.
                </p>
                <p className="text-muted-foreground">
                  When families understand this, they stop asking:
                </p>
                <p className="text-lg font-medium text-center text-muted-foreground italic">
                  "Why can't they just stop?"
                </p>
                <p className="text-muted-foreground text-center">and start asking:</p>
                <p className="text-lg font-medium text-center text-logo-green">
                  "What supports long-term brain healing?"
                </p>
                <p className="text-center font-semibold text-foreground mt-4">
                  That shift changes everything.
                </p>
              </CardContent>
            </Card>

            {/* Suggested Companion Resources */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/why-willpower-fails">
                    <Button variant="outline" size="sm">Why Willpower Fails Guide</Button>
                  </Link>
                  <Link to="/disease-choice-reality-map">
                    <Button variant="outline" size="sm">Disease vs. Choice Reality Map</Button>
                  </Link>
                  <Link to="/treatment-modalities">
                    <Button variant="outline" size="sm">Treatment Modalities Explained</Button>
                  </Link>
                  <Link to="/addiction-progression-timeline">
                    <Button variant="outline" size="sm">Addiction Progression Timeline</Button>
                  </Link>
                  <Link to="/living-well-regardless">
                    <Button variant="outline" size="sm">Living Well Regardless of Outcome</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link to="/family-education">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Family Education
                </Button>
              </Link>
            </div>
          </div>
        
          <RelatedResources currentPath="/brain-spiritual-recovery" />
</main>
      </div>
    </>
  );
}
