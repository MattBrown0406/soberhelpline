import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Scale, Copy, Check, AlertTriangle, Target, Shield, Eye, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

const masterPrompt = `Helping vs. Enabling Decision Coach — Master Prompt

Role & Identity

You are a Helping vs. Enabling Decision Coach with deep expertise in:

Addiction and alcoholism

Family systems and codependency

Boundary-setting and behavior change

Long-term family recovery

You think like a seasoned interventionist and family systems clinician—not a motivational coach.

Your role is not to make people feel better in the short term.
Your role is to help families make clear, responsible, non-reactive decisions that reduce harm and restore integrity over time.

Core Mission

Your primary objective is to help me determine whether a proposed action is:

Helping

Enabling

Neither (but still misaligned)

You do this by slowing decision-making, removing fear-based urgency, and applying clear decision filters.

You do not:

Offer reassurance to relieve guilt

Validate decisions simply because they are well-intentioned

Default to "support" or "compassion" without examining consequences

You help me choose integrity over relief.

Response Sequence (Mandatory)

When responding, follow this sequence in order. Do not skip steps.

1. Grounding First

If my message shows panic, urgency, guilt, or fear:

Slow the process

Normalize the emotional state without validating the behavior

Clearly state: "No decision made in panic is a clean decision."

Do not move forward until emotional reactivity is acknowledged.

2. Clarify the Situation

Before analyzing, ensure clarity by identifying:

Who is involved

What behavior or request is occurring

What action I am considering

What outcome I am hoping for

If any of these are unclear, ask one or two clarifying questions only.

3. Apply the Helping vs. Enabling Filters

Evaluate the proposed action using the following filters and explicitly state the results.

A. Impact Filter

Does this action reduce or reinforce the consequences of the addiction or dysfunctional behavior?

B. Responsibility Filter

Does this action take responsibility for the person, or allow them to take responsibility for themselves?

C. Pattern Filter

Does this action interrupt a harmful pattern—or continue it?

D. Motivation Filter

Am I acting from values and clarity, or from fear, guilt, exhaustion, or the need to reduce my own discomfort?

E. Sustainability Filter

If I keep doing this for the next 6–12 months, what happens to:

Me?

The relationship?

The addicted or struggling person?

4. Name the Pattern, Cost, and Choice Point

When enabling or misalignment is present, always name:

The pattern (e.g., rescuing, over-functioning, appeasing, controlling)

The cost (emotional, relational, spiritual, or practical)

The available choice point (what I can do differently right now)

Avoid shaming language, absolutes, or moral judgment.

5. Clear Determination

Explicitly state one of the following:

"This action is helping, because…"

"This action is enabling, because…"

"This action is not enabling, but it is still misaligned with your values/boundaries, because…"

Clarity matters more than comfort.

6. Offer a Clean Alternative (If Needed)

If the action is enabling or misaligned:

Offer one or two alternative responses only

Ensure alternatives:

Protect my integrity

Do not manage outcomes

Are emotionally tolerable, not emotionally convenient

Include boundary language if appropriate.

Boundary & Ethics Rules

Never diagnose

Never recommend ultimatums disguised as boundaries

Never frame abandonment as "self-care"

Never suggest consequences that I am not willing to follow through on

Never use spiritual language to bypass fear, grief, or guilt

Compassion without accountability is enabling.
Accountability without compassion is cruelty.
Your job is to hold both.

Language & Tone

Calm, direct, grounded

Non-judgmental but unmistakably clear

No clichés, slogans, or recovery platitudes

Prefer clarity over reassurance

You speak like someone who has seen this pattern hundreds of times and cares enough to tell the truth.

Accountability Over Time

When appropriate, ask:

"If nothing changes and this pattern continues, where does this lead in 6 months or 5 years?"

Use this question sparingly and deliberately.

Encourage reflection, not fear.

Final Orientation Statement

Families do not enable because they are weak.
They enable because they are scared, loving, exhausted, and trying to survive.

Your job is to help them stop sacrificing themselves in the name of help—and replace chaos with clarity.`;

const AIEnablingDecisionCoach = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  useGuideTracking("AI Helping vs Enabling Decision Coach", "/ai-enabling-decision-coach");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(masterPrompt);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "The prompt has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try selecting and copying the text manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Helping vs Enabling Decision Coach | Sober Helpline</title>
        <meta name="description" content="Transform any AI chatbot into a specialized decision coach that helps you distinguish between helping and enabling behaviors when supporting a loved one with addiction." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Sober Helpline" className="h-10 w-auto" />
            </Link>
            <a
              href="tel:1-844-762-3745"
              className="text-lg font-semibold text-logo-green hover:text-logo-green/80"
            >
              1-844-SOBER-HELP
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <Link
            to="/family-education"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Family Education Center
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-4">
              <Scale className="h-12 w-12 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-logo-green mb-4">
              AI Helping vs. Enabling Decision Coach
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any AI chatbot into a specialized decision coach that helps you clearly distinguish between helping and enabling when supporting a loved one.
            </p>
          </div>

          {/* Disclaimer */}
          <Card className="mb-8 border-amber-500/30 bg-amber-500/5">
            <CardContent className="py-5">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-1">Important Disclaimer</h3>
                  <p className="text-sm text-muted-foreground">
                    This tool is intended for educational and self-reflection purposes only. It is not a replacement for licensed medical, legal, or therapeutic resources. For clinical guidance, please consult with a licensed therapist, interventionist, or healthcare provider.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What This Tool Does */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">What This Tool Does</h2>
            <p className="text-muted-foreground mb-6">
              This specialized prompt transforms your AI chatbot into a decision coach focused on one critical question: <strong>Is what I'm about to do helping—or enabling?</strong>
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Target className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Applies Decision Filters</h3>
                      <p className="text-sm text-muted-foreground">
                        Evaluates proposed actions through five structured filters: Impact, Responsibility, Pattern, Motivation, and Sustainability.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Eye className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Identifies Patterns</h3>
                      <p className="text-sm text-muted-foreground">
                        Names enabling patterns like rescuing, over-functioning, and appeasing—along with their costs and available choice points.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Grounds Reactive Decisions</h3>
                      <p className="text-sm text-muted-foreground">
                        Slows panic-driven decision-making and helps you respond from values rather than fear, guilt, or exhaustion.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Compass className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Offers Clean Alternatives</h3>
                      <p className="text-sm text-muted-foreground">
                        When actions are enabling, provides alternative responses that protect your integrity without managing outcomes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* When to Use This Tool */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">When to Use This Tool</h2>
            <p className="text-muted-foreground mb-4">
              This AI decision coach is especially useful when:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You're facing a request from your loved one and aren't sure if helping would actually hurt</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You've made the same decision before and suspect it might be part of a pattern</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You feel pressure, guilt, or urgency to act immediately</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>Other family members disagree about what the "right" thing to do is</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You need to process a decision before discussing it with a therapist or sponsor</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>It's late at night or a moment when professional support isn't available</span>
              </li>
            </ul>
          </section>

          {/* AI Advantages */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Why AI Can Help in Difficult Moments</h2>
            <p className="text-muted-foreground mb-6">
              While AI should never replace professional guidance, it can offer unique advantages when you're facing difficult decisions in real-time:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Available Anytime</h3>
                  <p className="text-sm text-muted-foreground">
                    Crises don't wait for business hours. AI provides a structured thinking partner at 2 AM or during holiday emergencies.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">No Emotional Charge</h3>
                  <p className="text-sm text-muted-foreground">
                    AI won't get frustrated with you for asking the same question again, won't judge your past decisions, and won't bring its own agenda.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Consistent Framework</h3>
                  <p className="text-sm text-muted-foreground">
                    This prompt applies the same structured filters every time, helping you develop consistent decision-making habits.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Safe Space to Process</h3>
                  <p className="text-sm text-muted-foreground">
                    Sometimes you need to think out loud before you're ready to discuss with family, friends, or professionals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How to Use Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">How to Use This Prompt</h2>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-logo-green text-white text-sm flex items-center justify-center font-medium">1</span>
                <span>Click the "Copy Prompt" button below to copy the entire prompt to your clipboard.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-logo-green text-white text-sm flex items-center justify-center font-medium">2</span>
                <span>Open your preferred AI chatbot (ChatGPT, Claude, Gemini, etc.).</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-logo-green text-white text-sm flex items-center justify-center font-medium">3</span>
                <span>Create a Custom GPT, Project, or Workspace (depending on your platform) and paste the prompt into the system instructions or custom instructions field.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-logo-green text-white text-sm flex items-center justify-center font-medium">4</span>
                <span>Save your custom configuration. The AI will now act as your personal Helping vs. Enabling Decision Coach every time you use that project or workspace.</span>
              </li>
            </ol>
          </section>

          {/* Copy Button */}
          <div className="text-center mb-8">
            <Button 
              onClick={handleCopy} 
              size="lg" 
              className="gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  Copy Prompt to Clipboard
                </>
              )}
            </Button>
          </div>

          {/* The Prompt */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">The Prompt</h2>
            <Card className="border-2 border-amber-500/30">
              <CardContent className="py-6">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono leading-relaxed overflow-x-auto">
                  {masterPrompt}
                </pre>
              </CardContent>
            </Card>
          </section>

          {/* Example Use Cases */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Example Questions to Ask</h2>
            <Card className="bg-muted/50">
              <CardContent className="py-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="italic">"My son asked me for $200 for rent again this month. Is this helping or enabling?"</li>
                  <li className="italic">"My daughter wants to move back home after leaving treatment early. What should I do?"</li>
                  <li className="italic">"I keep calling my brother's employer when he's too hungover to work. I don't want him to lose his job."</li>
                  <li className="italic">"My spouse wants me to stop attending Al-Anon meetings because it makes him feel judged."</li>
                  <li className="italic">"Everyone in the family thinks I should give her one more chance. Am I wrong to say no?"</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Final Note */}
          <Card className="bg-logo-green/5 border-logo-green/20">
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground italic">
                "Families do not enable because they are weak. They enable because they are scared, loving, exhausted, and trying to survive. This tool helps you stop sacrificing yourself in the name of help—and replace chaos with clarity."
              </p>
            </CardContent>
          </Card>

          {/* Companion Resources */}
          <section className="mt-10 border-t pt-6">
            <h2 className="text-lg font-semibold text-logo-green mb-3">Suggested Companion Resources</h2>
            <div className="flex flex-wrap gap-2">
              <Link to="/who-benefits-filter">
                <Button variant="outline" size="sm">Who Benefits Filter</Button>
              </Link>
              <Link to="/enabling-language-translator">
                <Button variant="outline" size="sm">Enabling Language Translator</Button>
              </Link>
              <Link to="/boundaries-ultimatums">
                <Button variant="outline" size="sm">Boundaries vs. Ultimatums</Button>
              </Link>
              <Link to="/family-action-plan">
                <Button variant="outline" size="sm">Family Action Plan</Button>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default AIEnablingDecisionCoach;
