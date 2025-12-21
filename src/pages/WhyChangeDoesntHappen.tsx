import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Heart, 
  AlertTriangle, 
  Scale, 
  Brain, 
  HandHeart, 
  Footprints,
  Target,
  RefreshCw,
  FileText,
  GitBranch,
  ClipboardList,
  AlertCircle,
  CheckSquare
} from "lucide-react";

const WhyChangeDoesntHappen = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Why Change Doesn't Happen When Families Try Harder | Family Recovery Guide</title>
        <meta name="description" content="Understanding what actually drives recovery. Learn why effort alone doesn't create change in addiction, and how stepping back can be one of the most loving actions." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/family-education" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Family Resources
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Change Doesn't Happen When Families Try Harder
          </h1>
          <p className="text-xl text-muted-foreground">
            Understanding What Actually Drives Recovery
          </p>
        </div>

        {/* Purpose Section */}
        <Card className="mb-8 border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Purpose
            </h2>
            <p className="text-muted-foreground mb-4">
              Most families believe that if they just explain better, care more, or try harder, change will finally happen. When it doesn't, families often blame themselves—or escalate their efforts.
            </p>
            <p className="text-muted-foreground mb-6">
              This guide explains why effort alone doesn't create change in addiction, and how stepping back—when done intentionally—can be one of the most loving and effective actions a family takes.
            </p>
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-foreground font-medium italic text-center">
                "Effort feels productive.<br />
                Effectiveness requires alignment with reality."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* The Common Family Belief */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              The Common Family Belief
            </h2>
            <p className="text-muted-foreground mb-4">Families often think:</p>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground italic">"If they really understood how much this hurts us, they would stop."</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground italic">"If I don't stay on top of this, everything will fall apart."</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground italic">"If I back off, I'm giving up."</span>
              </li>
            </ul>
            <p className="text-muted-foreground">
              These beliefs come from love—but they often produce the opposite of the intended result.
            </p>
          </CardContent>
        </Card>

        {/* Section 1: Why Pressure Delays Change */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              1. Why Pressure Delays Change
            </h2>
            
            <p className="text-muted-foreground mb-3 font-medium">Pressure can look like:</p>
            <ul className="space-y-2 mb-6 ml-4">
              <li className="text-muted-foreground">• Repeated conversations</li>
              <li className="text-muted-foreground">• Emotional appeals</li>
              <li className="text-muted-foreground">• Lectures or ultimatums</li>
              <li className="text-muted-foreground">• Monitoring and reminders</li>
              <li className="text-muted-foreground">• Constant problem-solving</li>
            </ul>

            <p className="text-muted-foreground mb-3 font-medium">Why pressure backfires:</p>
            <p className="text-muted-foreground mb-2">Addiction already involves:</p>
            <ul className="space-y-1 mb-4 ml-4">
              <li className="text-muted-foreground">• Shame</li>
              <li className="text-muted-foreground">• Defensiveness</li>
              <li className="text-muted-foreground">• Fear of loss of control</li>
            </ul>

            <p className="text-muted-foreground mb-2">Pressure increases these emotions, which leads to:</p>
            <ul className="space-y-1 mb-6 ml-4">
              <li className="text-muted-foreground">• Denial</li>
              <li className="text-muted-foreground">• Resistance</li>
              <li className="text-muted-foreground">• Secrecy</li>
              <li className="text-muted-foreground">• Compliance without commitment</li>
            </ul>

            <p className="text-muted-foreground mb-4">
              Instead of motivating change, pressure often teaches the addicted person:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <p className="text-foreground italic text-center">
                "I just need to say the right thing to get through this moment."
              </p>
            </div>
            <p className="text-muted-foreground font-medium">
              Short-term relief replaces long-term growth.
            </p>
          </CardContent>
        </Card>

        {/* Section 2: Consequences vs Punishment */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              2. How Consequences Drive Motivation (Not Punishment)
            </h2>
            
            <p className="text-muted-foreground mb-4">
              Many families confuse consequences with punishment.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-destructive/10 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Punishment:</h3>
                <ul className="space-y-1">
                  <li className="text-muted-foreground">• Is emotional</li>
                  <li className="text-muted-foreground">• Seeks to cause pain</li>
                  <li className="text-muted-foreground">• Is inconsistent</li>
                  <li className="text-muted-foreground">• Is fueled by anger</li>
                </ul>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Consequences:</h3>
                <ul className="space-y-1">
                  <li className="text-muted-foreground">• Are predictable</li>
                  <li className="text-muted-foreground">• Are tied to behavior</li>
                  <li className="text-muted-foreground">• Are calmly enforced</li>
                  <li className="text-muted-foreground">• Allow reality to teach</li>
                </ul>
              </div>
            </div>

            <p className="text-muted-foreground mb-2">Addiction often continues when families unintentionally:</p>
            <ul className="space-y-1 mb-4 ml-4">
              <li className="text-muted-foreground">• Absorb financial consequences</li>
              <li className="text-muted-foreground">• Protect from relationship fallout</li>
              <li className="text-muted-foreground">• Buffer work or legal impact</li>
              <li className="text-muted-foreground">• Rescue after every crisis</li>
            </ul>

            <p className="text-muted-foreground mb-4">
              When consequences are removed, the cost of using stays low.
            </p>

            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-foreground font-medium text-center">
                Change tends to happen when the cost of staying the same becomes greater than the cost of changing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Why Insight Is Unreliable */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              3. Why Insight Is Unreliable in Addiction
            </h2>
            
            <p className="text-muted-foreground mb-2">Families often wait for:</p>
            <ul className="space-y-1 mb-4 ml-4">
              <li className="text-muted-foreground">• Apologies</li>
              <li className="text-muted-foreground">• Insight</li>
              <li className="text-muted-foreground">• Emotional breakthroughs</li>
              <li className="text-muted-foreground">• "Rock bottom" moments</li>
            </ul>

            <p className="text-muted-foreground mb-2 font-medium">The problem:</p>
            <p className="text-muted-foreground mb-2">Addiction impairs:</p>
            <ul className="space-y-1 mb-4 ml-4">
              <li className="text-muted-foreground">• Judgment</li>
              <li className="text-muted-foreground">• Foresight</li>
              <li className="text-muted-foreground">• Emotional regulation</li>
              <li className="text-muted-foreground">• Consistent decision-making</li>
            </ul>

            <p className="text-muted-foreground mb-4">
              Insight may come and go—especially during crises—but it does not predict sustained change.
            </p>

            <p className="text-muted-foreground mb-2 font-medium">What matters more than insight:</p>
            <ul className="space-y-1 mb-6 ml-4">
              <li className="text-muted-foreground">• Behavior</li>
              <li className="text-muted-foreground">• Follow-through</li>
              <li className="text-muted-foreground">• Willingness to tolerate discomfort</li>
              <li className="text-muted-foreground">• Acceptance of structure</li>
            </ul>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-foreground font-medium italic text-center">
                "Words change first.<br />
                Behavior tells the truth."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: The Myth of Love */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-destructive" />
              4. The Myth of "If They Loved Me Enough"
            </h2>
            
            <p className="text-muted-foreground mb-2">Families often internalize blame:</p>
            <ul className="space-y-2 mb-4 ml-4">
              <li className="text-muted-foreground italic">"If they loved me enough, they would stop."</li>
              <li className="text-muted-foreground italic">"Maybe I haven't been strong enough."</li>
              <li className="text-muted-foreground italic">"Maybe I've failed them."</li>
            </ul>

            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg mb-4">
              <p className="text-foreground font-medium">
                This belief is not only false—it's harmful.
              </p>
            </div>

            <p className="text-muted-foreground mb-4">
              <strong>Addiction is not a referendum on love, values, or character.</strong><br />
              It is a condition that disrupts motivation and priorities.
            </p>

            <p className="text-muted-foreground mb-2">When families personalize addiction, they:</p>
            <ul className="space-y-1 ml-4">
              <li className="text-muted-foreground">• Overfunction</li>
              <li className="text-muted-foreground">• Lose boundaries</li>
              <li className="text-muted-foreground">• Feel constant guilt</li>
              <li className="text-muted-foreground">• Become emotionally depleted</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 5: Stepping Back as Love */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Footprints className="h-5 w-5 text-primary" />
              5. Why Stepping Back Can Be an Act of Love
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Stepping back does NOT mean:</h3>
                <ul className="space-y-1">
                  <li className="text-muted-foreground">• Giving up</li>
                  <li className="text-muted-foreground">• Withdrawing care</li>
                  <li className="text-muted-foreground">• Becoming cold</li>
                  <li className="text-muted-foreground">• Hoping for harm</li>
                </ul>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Stepping back DOES mean:</h3>
                <ul className="space-y-1">
                  <li className="text-muted-foreground">• Stopping behaviors that enable addiction</li>
                  <li className="text-muted-foreground">• Allowing natural consequences to occur</li>
                  <li className="text-muted-foreground">• Refocusing on your own health</li>
                  <li className="text-muted-foreground">• Holding boundaries consistently</li>
                </ul>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">
              This shift often feels terrifying at first—because families are used to being the safety net.
            </p>

            <p className="text-muted-foreground mb-2">But stepping back:</p>
            <ul className="space-y-1 mb-6 ml-4">
              <li className="text-muted-foreground">• Returns responsibility to where it belongs</li>
              <li className="text-muted-foreground">• Reduces power struggles</li>
              <li className="text-muted-foreground">• Increases clarity</li>
              <li className="text-muted-foreground">• Preserves self-respect</li>
            </ul>

            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-foreground font-medium italic text-center">
                "Love that rescues prevents growth.<br />
                Love that allows reality creates possibility."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: What Actually Helps */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <HandHeart className="h-5 w-5 text-primary" />
              6. What Actually Helps Instead of Trying Harder
            </h2>
            
            <p className="text-muted-foreground mb-4">Families are most effective when they:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span className="text-muted-foreground">Hold clear, consistent boundaries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span className="text-muted-foreground">Stop repeated emotional conversations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span className="text-muted-foreground">Respond calmly instead of urgently</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span className="text-muted-foreground">Support treatment—not comfort</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span className="text-muted-foreground">Focus on their own recovery</span>
              </li>
            </ul>

            <p className="text-muted-foreground">
              This approach does not guarantee sobriety—but it creates the conditions where change becomes possible.
            </p>
          </CardContent>
        </Card>

        {/* Section 7: A Critical Reframe */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              7. A Critical Reframe for Families
            </h2>
            
            <p className="text-muted-foreground mb-4">Instead of asking:</p>
            <div className="bg-muted/50 p-3 rounded-lg mb-4">
              <p className="text-muted-foreground italic">"What else can I do to make them change?"</p>
            </div>

            <p className="text-muted-foreground mb-4">Ask:</p>
            <div className="space-y-2 mb-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-foreground">"What am I doing that might be delaying change?"</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-foreground">"What would it look like to stop interfering with reality?"</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-foreground">"How can I live with integrity regardless of outcome?"</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Reframe */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Final Reframe</h2>
            
            <div className="space-y-4 text-center">
              <p className="text-foreground">
                <strong>Trying harder often feels loving.</strong><br />
                <span className="text-primary font-medium">Trying differently is what actually helps.</span>
              </p>
              
              <p className="text-foreground">
                <strong>You don't need to stop caring.</strong><br />
                <span className="text-primary font-medium">You need to stop carrying what isn't yours.</span>
              </p>
              
              <p className="text-foreground">
                <strong>Change doesn't happen when families exhaust themselves.</strong><br />
                <span className="text-primary font-medium">It happens when responsibility, consequences, and choice are allowed to align.</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Companion Resources */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Suggested Companion Resources</h2>
            
            <div className="grid sm:grid-cols-2 gap-3">
              <Link to="/family-education" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-foreground">Guilt vs. Responsibility Deep-Dive Module</span>
              </Link>
              <Link to="/family-education" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <GitBranch className="h-5 w-5 text-primary" />
                <span className="text-foreground">Helping vs. Enabling Decision Tree</span>
              </Link>
              <Link to="/family-education" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <ClipboardList className="h-5 w-5 text-primary" />
                <span className="text-foreground">Boundary Setting Worksheet</span>
              </Link>
              <Link to="/crisis-chaos" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <AlertCircle className="h-5 w-5 text-primary" />
                <span className="text-foreground">Crisis vs. Chaos Decision Guide</span>
              </Link>
              <Link to="/readiness-checklist" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <CheckSquare className="h-5 w-5 text-primary" />
                <span className="text-foreground">Readiness for Change Checklist</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button asChild>
            <Link to="/family-education">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Family Resources
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhyChangeDoesntHappen;
