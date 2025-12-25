import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, MessageCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

export default function TalkingAboutTreatment() {
  useGuideTracking("/talking-about-treatment", "How to Talk to Your Loved One About Treatment");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>How to Talk to Your Loved One About Treatment | Sober Helpline</title>
        <meta name="description" content="A calm, clear, and effective approach to discussing treatment with your loved one struggling with addiction." />
      </Helmet>

      <div className="min-h-screen bg-background">
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

            <div className="text-center mb-8">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4 print:hidden" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
                How to Talk to Your Loved One About Treatment
              </h1>
              <p className="text-xl text-muted-foreground">A Calm, Clear, and Effective Approach</p>
            </div>

            {/* Purpose */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">Purpose</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  Talking to a loved one about treatment is one of the most emotionally charged conversations a family can have. Many families approach it from fear or desperation, which often leads to arguments, broken promises, or avoidance.
                </p>
                <p className="text-foreground leading-relaxed mt-4">
                  This guide helps you communicate <strong>without enabling, negotiating, or threatening</strong>, while keeping the focus on reality and boundaries.
                </p>
              </CardContent>
            </Card>

            {/* Section 1 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">1. Prepare Yourself Before the Conversation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-destructive mb-2">Do not start this conversation when:</p>
                  <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                    <li>You are emotionally flooded</li>
                    <li>You are angry or panicked</li>
                    <li>You are reacting to a recent crisis</li>
                    <li>You are hoping to "say it just right" to force change</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Before you speak, ask yourself:</p>
                  <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                    <li>What is my goal? (Clarity, not persuasion)</li>
                    <li>What boundaries am I prepared to enforce?</li>
                    <li>What outcome am I willing to accept?</li>
                  </ul>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                  <p className="font-semibold text-foreground">Important:</p>
                  <p className="text-foreground">This is not a debate. It is an invitation paired with limits.</p>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">2. Choose the Right Timing and Setting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Best conditions:
                  </p>
                  <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                    <li>Your loved one is sober or relatively stable</li>
                    <li>The environment is private and calm</li>
                    <li>You are not rushed</li>
                    <li>You are emotionally regulated</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-destructive mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Avoid:
                  </p>
                  <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                    <li>Late-night conversations</li>
                    <li>Arguments</li>
                    <li>Text-heavy discussions</li>
                    <li>Conversations during intoxication</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">3. Lead with Observations, Not Accusations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">Use observable facts, not judgments.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-destructive/10 p-4 rounded-lg">
                    <p className="font-semibold text-destructive mb-2">Avoid:</p>
                    <ul className="text-foreground space-y-1 text-sm">
                      <li>"You're ruining your life."</li>
                      <li>"You don't care about anyone."</li>
                      <li>"You're an addict."</li>
                    </ul>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="font-semibold text-green-700 dark:text-green-400 mb-2">Use:</p>
                    <ul className="text-foreground space-y-1 text-sm">
                      <li>"I've noticed you've missed work several times this month."</li>
                      <li>"I've seen your health and mood decline."</li>
                      <li>"I've watched this get worse, not better."</li>
                    </ul>
                  </div>
                </div>
                <p className="text-muted-foreground italic">This reduces defensiveness and keeps the conversation grounded in reality.</p>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">4. Express Impact Without Blame</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">Share how the situation affects you and the family.</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold text-foreground mb-2">Example:</p>
                  <ul className="text-foreground space-y-1">
                    <li>"This has been exhausting and frightening for me."</li>
                    <li>"I feel anxious and unsafe when this continues."</li>
                    <li>"Our family can't keep living this way."</li>
                  </ul>
                </div>
                <p className="text-muted-foreground italic">Avoid emotional dumping or rehearsing past hurts. Stay present-focused.</p>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">5. State the Need for Treatment Clearly</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground font-semibold">Clarity is kindness.</p>
                <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                  <p className="font-semibold text-foreground mb-2">Example Script:</p>
                  <p className="text-foreground italic">
                    "I care about you, and I'm concerned.<br />
                    From what I see, this isn't something you can manage on your own.<br />
                    I believe treatment is necessary."
                  </p>
                </div>
                <div className="bg-destructive/10 p-4 rounded-lg">
                  <p className="font-semibold text-destructive mb-2">Avoid:</p>
                  <ul className="text-foreground space-y-1">
                    <li>"Maybe you could think about…"</li>
                    <li>"What if you just tried…"</li>
                    <li>"Do you think you might need help?"</li>
                  </ul>
                </div>
                <p className="text-muted-foreground italic">Ambiguity invites delay.</p>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">6. Present Options, Not Endless Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">Offer clear, limited options that align with recovery.</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold text-foreground mb-2">Example:</p>
                  <ul className="text-foreground space-y-1">
                    <li>"We've identified two treatment programs."</li>
                    <li>"We're willing to support treatment, not continued use."</li>
                    <li>"You can choose whether you accept help, but we're not continuing as before."</li>
                  </ul>
                </div>
                <p className="text-muted-foreground italic">This respects autonomy without enabling.</p>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">7. Communicate Boundaries Calmly and Briefly</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground font-semibold">Boundaries are not threats. They are decisions.</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold text-foreground mb-2">Example:</p>
                  <p className="text-foreground">"If you choose not to pursue treatment, this is what will change…"</p>
                  <p className="text-foreground mt-2">Then state:</p>
                  <ul className="list-disc list-inside text-foreground ml-2">
                    <li>Housing changes</li>
                    <li>Financial limits</li>
                    <li>Reduced contact</li>
                    <li>Safety-related boundaries</li>
                  </ul>
                </div>
                <p className="text-muted-foreground italic">Do not argue or justify.</p>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">8. Expect Resistance—and Don't Take the Bait</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground mb-2">Common responses include:</p>
                  <ul className="list-disc list-inside text-foreground space-y-1 ml-2">
                    <li>Denial ("I don't have a problem")</li>
                    <li>Minimizing ("It's not that bad")</li>
                    <li>Blame ("You're the problem")</li>
                    <li>Promises ("I'll stop tomorrow")</li>
                  </ul>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary">
                  <p className="font-semibold text-foreground mb-2">Your response:</p>
                  <ul className="text-foreground space-y-1">
                    <li>"I hear that you don't agree."</li>
                    <li>"This is still our decision."</li>
                    <li>"We're not arguing about whether this is a problem."</li>
                  </ul>
                </div>
                <p className="text-foreground font-semibold">Stay calm. Repeat your message.</p>
              </CardContent>
            </Card>

            {/* Section 9 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">9. End the Conversation with Clarity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">Do not linger or negotiate.</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold text-foreground mb-2">Close with:</p>
                  <ul className="text-foreground space-y-1">
                    <li>"You don't have to decide this second."</li>
                    <li>"Our boundaries will remain in place."</li>
                    <li>"We're here if you choose help."</li>
                  </ul>
                </div>
                <p className="text-foreground font-semibold">Then stop talking.</p>
              </CardContent>
            </Card>

            {/* Section 10 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">10. After the Conversation: What Families Must Do</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
                  <li>Follow through consistently</li>
                  <li>Do not soften boundaries due to guilt</li>
                  <li>Avoid rehashing the conversation</li>
                  <li>Focus on your own recovery and support</li>
                </ul>
                <p className="text-muted-foreground italic mt-4">Change often happens after families stop over-functioning.</p>
              </CardContent>
            </Card>

            {/* Common Mistakes */}
            <Card className="mb-6 border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-2">
                  <li>Arguing facts or memories</li>
                  <li>Chasing insight</li>
                  <li>Making emotional ultimatums</li>
                  <li>Rescuing after refusal</li>
                  <li>Taking rejection personally</li>
                </ul>
              </CardContent>
            </Card>

            {/* Final Reframe */}
            <Card className="mb-6 bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-logo-green">Final Reframe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground text-lg">
                  Treatment conversations are not about convincing someone.<br />
                  They are about <strong>communicating reality and standing in it</strong>.
                </p>
                <p className="text-foreground text-lg">
                  You can offer help without sacrificing yourself.<br />
                  You can love someone without protecting their addiction.
                </p>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Link to="/treatment-questions">
                    <Button variant="outline" size="sm">Questions to Ask a Treatment Center</Button>
                  </Link>
                  <Link to="/family-action-plan">
                    <Button variant="outline" size="sm">Family Recovery Action Plan</Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm">Boundary Setting Worksheet</Button>
                  </Link>
                  <Link to="/crisis-chaos">
                    <Button variant="outline" size="sm">Crisis vs. Chaos Decision Guide</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="text-center print:hidden">
              <Button onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Print This Guide
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
