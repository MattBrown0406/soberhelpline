import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, ShieldAlert, AlertTriangle, CheckCircle, XCircle, Target, Shield, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

export default function NoNegotiationGuide() {
  useGuideTracking("/no-negotiation-guide", "We Don't Negotiate with Terrorists");
  return (
    <>
      <Helmet>
        <title>We Don't Negotiate with Terrorists | Sober Helpline</title>
        <meta name="description" content="Why negotiating with active addiction makes things worse and what families can do instead to protect themselves while supporting recovery." />
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

            <ToolBrandHeader
              title="We Don't Negotiate with Terrorists"
              subtitle="Why negotiating with active addiction makes things worse — and what families can do instead to protect themselves while supporting recovery."
              clinicalNote="Grounded in CRAFT research and addiction medicine principles. Addiction hijacks the brain's reward system, making negotiation with the disease ineffective."
            />

            {/* Why This Guide Exists */}
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-logo-blue">Why This Guide Exists</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families often believe they are being reasonable when they negotiate:</p>
                <ul className="space-y-1 ml-6 text-muted-foreground italic list-disc">
                  <li>"If you stop using for a week, we'll help you."</li>
                  <li>"Just don't use in the house."</li>
                  <li>"Can we compromise?"</li>
                  <li>"What if we give you one more chance?"</li>
                </ul>
                <p className="text-muted-foreground">
                  These conversations feel logical, compassionate, and fair.
                </p>
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800 mt-4">
                  <p className="font-medium text-red-700 dark:text-red-400">
                    They are also one of the fastest ways to strengthen addiction.
                  </p>
                </div>
                <p className="text-muted-foreground mt-4">
                  This guide explains why negotiation fails in active addiction—and how families can protect themselves without becoming cruel, rigid, or hopeless.
                </p>
              </CardContent>
            </Card>

            {/* Clarifying the Title */}
            <Card className="mb-8 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Clarifying the Title (Important)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-medium text-foreground">
                  This guide does <span className="text-red-600">not</span> compare your loved one to a terrorist.
                </p>
                <p className="text-muted-foreground">
                  It compares <strong>active addiction</strong> to one.
                </p>
                <p className="text-muted-foreground font-medium">Why?</p>
                <p className="text-muted-foreground">Because active addiction:</p>
                <ul className="space-y-2 mt-2">
                  {[
                    "Uses fear, urgency, and leverage",
                    "Makes threats (explicit or implied)",
                    "Exploits emotional attachment",
                    "Escalates when demands are met",
                    "Cannot be reasoned with in good faith"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                  <p className="text-center font-medium text-foreground">
                    You are not dealing with a rational partner.<br />
                    You are dealing with a <span className="text-primary">hijacked survival system</span>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* The Core Problem with Negotiation */}
            <Card className="mb-8 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-red-700 dark:text-red-400">The Core Problem with Negotiation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Negotiation assumes:</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {["Shared goals", "Rational decision-making", "Good-faith compromise", "Capacity to honor agreements"].map((item) => (
                    <div key={item} className="bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded text-sm">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="font-medium text-red-700 dark:text-red-400">
                  Active addiction has none of these reliably available.
                </p>
                <p className="text-muted-foreground mt-4">When families negotiate, they are negotiating with:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {["Craving", "Fear", "Withdrawal", "Avoidance", "Survival-driven thinking"].map((item) => (
                    <div key={item} className="bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded text-sm text-center">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-center font-medium text-foreground mt-4">
                  Addiction will always outmaneuver logic.
                </p>
              </CardContent>
            </Card>

            {/* Why Negotiation Feels Right */}
            <Card className="mb-8 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700 dark:text-blue-400">Why Negotiation Feels Right to Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families negotiate because:</p>
                <ul className="space-y-2">
                  {[
                    "They want to reduce conflict",
                    "They fear escalation",
                    "They want partial improvement",
                    "They hope compromise buys time",
                    "They believe love should be flexible"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mt-4">
                  <p className="text-muted-foreground">
                    These instincts are human—and understandable.<br />
                    <strong>They are also predictable vulnerabilities addiction exploits.</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How Addiction Uses Negotiation */}
            <Card className="mb-8 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-purple-700 dark:text-purple-400">How Addiction Uses Negotiation Against Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 1 */}
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-foreground">1. Negotiation Rewards the Behavior</h4>
                  <p className="text-sm text-muted-foreground mt-2">Every negotiation teaches:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground mt-1 space-y-1">
                    <li>"If I push hard enough, terms will change."</li>
                    <li>"Boundaries are flexible under pressure."</li>
                    <li>"Distress creates concessions."</li>
                  </ul>
                  <p className="text-sm italic text-purple-700 dark:text-purple-400 mt-2">Addiction learns quickly.</p>
                </div>

                {/* 2 */}
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-foreground">2. Negotiation Trains Manipulation</h4>
                  <p className="text-sm text-muted-foreground mt-2">Common tactics include:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Partial compliance", "Emotional appeals", "Victim narratives", "Promises without follow-through", "Crisis creation to reset terms"].map((item) => (
                      <span key={item} className="px-2 py-1 bg-muted rounded text-xs">{item}</span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is not moral failure. It is <strong>survival behavior reinforced by success</strong>.
                  </p>
                </div>

                {/* 3 */}
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-foreground">3. Negotiation Erodes Family Credibility</h4>
                  <p className="text-sm text-muted-foreground mt-2">When families negotiate:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground mt-1 space-y-1">
                    <li>Boundaries become suggestions</li>
                    <li>Consequences become optional</li>
                    <li>Authority dissolves</li>
                    <li>Exhaustion increases</li>
                  </ul>
                  <p className="text-sm italic text-purple-700 dark:text-purple-400 mt-2">
                    Eventually, nothing families say carries weight.
                  </p>
                </div>

                {/* 4 */}
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-foreground">4. Negotiation Delays the Only Thing That Works</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Addiction does not change through persuasion.<br />
                    It changes through <strong>loss of protection from consequences</strong>.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Negotiation delays:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["Treatment", "Accountability", "Structure", "Reality"].map((item) => (
                      <span key={item} className="px-2 py-1 bg-red-100 dark:bg-red-950/30 rounded text-xs text-red-700 dark:text-red-400">{item}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* The Illusion of Meeting Them Halfway */}
            <Card className="mb-8 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-orange-700 dark:text-orange-400">The Illusion of "Meeting Them Halfway"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Families often believe:</p>
                <p className="italic text-foreground">"If we can just get them to reduce, that's progress."</p>
                <p className="text-muted-foreground mt-4">In active addiction, reduction agreements usually:</p>
                <ul className="space-y-2 mt-2">
                  {[
                    "Collapse under stress",
                    "Become new baselines",
                    "Require constant enforcement",
                    "Increase family monitoring",
                    "Shift responsibility onto the family"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800 mt-4">
                  <p className="font-medium text-center">
                    You don't end chaos by managing it better.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Why This Is So Dangerous */}
            <Card className="mb-8 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Why This Is So Dangerous
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Negotiation:</p>
                <ul className="space-y-2">
                  {[
                    "Keeps families emotionally hostage",
                    "Keeps addiction insulated",
                    "Increases resentment and burnout",
                    "Teaches addiction it works",
                    "Delays real change"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-center font-medium text-red-700 dark:text-red-400 mt-4">
                  Every negotiation buys time—for addiction.
                </p>
              </CardContent>
            </Card>

            {/* What Actually Works Instead */}
            <Card className="mb-8 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  What Actually Works Instead
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 1 */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">1. Non-Negotiable Boundaries</h4>
                  <p className="text-sm text-muted-foreground mb-2">Boundaries are not debates. They sound like:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>"We don't provide money when substances are involved."</li>
                    <li>"You can't live here if you're using."</li>
                    <li>"We will support treatment—not use."</li>
                  </ul>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mt-2">
                    No bargaining. No adjustments under pressure.
                  </p>
                </div>

                {/* 2 */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">2. Consistency Without Emotion</h4>
                  <p className="text-sm text-muted-foreground mb-2">Addiction feeds on emotional engagement. Effective boundaries are:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Calm", "Predictable", "Repeated without explanation", "Enforced without escalation"].map((item) => (
                      <span key={item} className="px-3 py-1 bg-white dark:bg-background rounded border text-sm">{item}</span>
                    ))}
                  </div>
                </div>

                {/* 3 */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">3. Pre-Decided Consequences</h4>
                  <p className="text-sm text-muted-foreground mb-2">Families must decide <strong>before crisis</strong>:</p>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                    <li>What they will and won't do</li>
                    <li>What happens if boundaries are violated</li>
                    <li>What support looks like—and what it doesn't</li>
                  </ul>
                  <p className="text-sm italic text-amber-700 dark:text-amber-400 mt-2">
                    Decisions made in crisis are almost always reversed.
                  </p>
                </div>

                {/* 4 */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">4. External Structure</h4>
                  <p className="text-sm text-muted-foreground mb-2">Families cannot out-regulate addiction. Effective responses often include:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Treatment", "Monitoring", "Legal leverage", "Sober living", "Professional guidance"].map((item) => (
                      <span key={item} className="px-3 py-1 bg-white dark:bg-background rounded border text-sm">{item}</span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mt-2">
                    Families should not be the enforcement arm.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What This Does Not Mean */}
            <Card className="mb-8 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Ban className="h-5 w-5" />
                  What This Does Not Mean
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-2">This does NOT mean:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Being cruel</li>
                      <li>• Cutting off love</li>
                      <li>• Giving ultimatums you can't hold</li>
                      <li>• Escalating conflict</li>
                      <li>• Abandoning someone</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">It DOES mean:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Ending bargaining</li>
                      <li>• Ending emotional hostage situations</li>
                      <li>• Ending false compromise</li>
                      <li>• Ending self-erasure</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A Necessary Reframe */}
            <Card className="mb-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/30">
              <CardHeader>
                <CardTitle className="text-xl text-primary">A Necessary Reframe for Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-center">
                  You are not refusing to negotiate because you don't care.<br />
                  <strong>You are refusing to negotiate because negotiation keeps everyone trapped.</strong>
                </p>
                <p className="text-center text-muted-foreground mt-4">
                  Boundaries are not punishment.<br />
                  They are <span className="text-primary font-medium">exit routes from chaos</span>.
                </p>
              </CardContent>
            </Card>

            {/* Common Family Fear */}
            <Card className="mb-8 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-amber-700 dark:text-amber-400">Common Family Fear</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg italic text-foreground text-center">
                  "If we stop negotiating, everything will blow up."
                </p>
                <p className="text-muted-foreground text-center">Sometimes it does—briefly.</p>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 mt-4">
                  <p className="text-muted-foreground">
                    That blow-up is not failure.<br />
                    It is <strong>the moment the system realizes the rules have changed</strong>.
                  </p>
                  <p className="text-muted-foreground mt-2">What follows is often:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Clarity", "Direction", "Treatment", "Or a clearer understanding of next steps"].map((item) => (
                      <span key={item} className="px-2 py-1 bg-white dark:bg-background rounded border text-sm">{item}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 bg-logo-blue/5 border-logo-green/30">
              <CardHeader>
                <CardTitle className="text-xl text-logo-blue flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Final Thought
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Negotiation works when both parties want peace.
                </p>
                <p className="text-muted-foreground">
                  <strong>Active addiction wants relief and control.</strong>
                </p>
                <div className="bg-white dark:bg-background p-4 rounded-lg border mt-4">
                  <p className="text-center text-lg">
                    You don't negotiate with something that thrives on fear, urgency, and concession.
                  </p>
                  <p className="text-center text-lg font-medium mt-2">
                    You don't negotiate with terrorists.
                  </p>
                  <p className="text-center text-muted-foreground mt-2">
                    You contain them, remove leverage, and protect the system.
                  </p>
                </div>
                <p className="text-center font-semibold text-logo-blue mt-4">
                  That is not heartless.<br />
                  That is how recovery becomes possible.
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
                  <Link to="/boundaries-ultimatums">
                    <Button variant="outline" size="sm">Requests, Demands, Ultimatums & Boundaries</Button>
                  </Link>
                  <Link to="/crisis-chaos">
                    <Button variant="outline" size="sm">Crisis vs. Chaos Decision Guide</Button>
                  </Link>
                  <Link to="/insight-behavior-tracker">
                    <Button variant="outline" size="sm">Insight vs. Behavior Tracker</Button>
                  </Link>
                  <Link to="/what-changes-when-families-change">
                    <Button variant="outline" size="sm">What Changes When Families Change</Button>
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
        
          <RelatedResources currentPath="/no-negotiation" />
</main>
      </div>
    </>
  );
}
