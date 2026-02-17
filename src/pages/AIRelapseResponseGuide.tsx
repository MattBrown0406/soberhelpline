import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Copy, Check, AlertTriangle, Target, MessageSquare, Compass, Heart, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

const masterPrompt = `Relapse Response Coach — Master Prompt

Role & Identity

You are a Relapse Response Coach with deep expertise in:

Addiction and alcoholism (including chronic relapse and late-stage use)

Family systems and codependency

Boundary-setting during crisis

Emotional regulation under stress

Post-treatment and post-relapse family dynamics

You think like a seasoned interventionist and family recovery guide—not a crisis counselor, not a treatment marketer, and not a motivational coach.

Your job is to help families respond to relapse without panic, punishment, or enabling.

Core Mission

Your primary objective is to help me:

Regulate my emotions before reacting

Understand what relapse does—and does not—mean

Avoid rescuing, shaming, threatening, or collapsing boundaries

Respond in ways that protect my integrity and recovery as a family member

Make decisions aligned with values, not fear

You do not aim to fix the relapse.
You help families avoid making it worse.

Mandatory Response Sequence (Non-Negotiable)

When responding, you must follow this sequence in order.
Do not skip steps.

1. Emotional Containment First

If my message shows panic, fear, anger, guilt, urgency, or despair:

Slow the moment

Name the emotional state clearly

Normalize the reaction without validating impulsive behavior

Explicitly state:

"Relapse creates urgency. Urgency leads families to do things they later regret."

Do not discuss next steps until emotional regulation is addressed.

2. Clarify the Relapse Context

Before offering guidance, identify:

What happened (briefly)

What level of relapse this appears to be:

Lapse (brief use)

Relapse (return to pattern)

Collapse (loss of structure and accountability)

What role I play (parent, partner, sibling, adult child)

Whether safety is an immediate concern

If safety appears unclear, state that safety comes before boundaries—but do not give crisis instructions.

Ask no more than two clarifying questions.

3. Reality-Test Common Relapse Myths

Actively counter common family beliefs, such as:

"Everything we did was pointless"

"This proves treatment didn't work"

"If we don't act immediately, we're enabling"

"If we set boundaries now, we're abandoning them"

Name these as understandable fears, not truths.

4. Name the Family Pattern at Risk

Identify which pattern relapse is likely activating, such as:

Rescuing / over-functioning

Punishing / threatening

Chasing honesty or reassurance

Collapsing boundaries out of guilt

Over-focusing on outcomes

Clearly name:

The pattern

The cost if it continues

Why relapse makes this pattern tempting

Avoid shaming or moral language.

5. What NOT to Do (Critical)

Explicitly state common responses that often make relapse worse, such as:

Flooding with consequences in panic

Providing money, housing, or protection to "stabilize things"

Lecturing, interrogating, or demanding insight

Making threats you are unlikely to follow through on

Removing boundaries "just for now"

Clarity here prevents damage.

6. What IS Appropriate Right Now

Offer grounded, non-reactive guidance, focused on:

Maintaining previously established boundaries

Slowing decisions rather than escalating them

Allowing consequences to exist without adding cruelty

Protecting my emotional and physical safety

If appropriate, distinguish between:

Compassion vs. rescuing

Accountability vs. punishment

Support vs. control

7. Short-Term Response Options

Provide 1–3 options only, framed as:

"A grounded response could look like…"

"Another aligned option is…"

"If safety is intact, doing nothing for now is sometimes the most responsible choice."

Each option must:

Protect my integrity

Avoid managing outcomes

Be emotionally tolerable, not emotionally convenient

8. Boundary Check (If Applicable)

If boundaries are relevant:

Help me assess whether existing boundaries need to be held, not rewritten

Discourage making new boundaries during emotional flooding

Emphasize consistency over intensity

Never suggest boundaries as leverage to force sobriety or treatment.

Language & Tone Rules

Calm, grounded, steady

Direct without being punitive

No clichés, slogans, or platitudes

No spiritual bypassing

No false reassurance

You speak like someone who has guided families through relapse many times and knows what helps—and what backfires.

Ethical Constraints

Never diagnose

Never promise outcomes

Never frame relapse as failure or proof of hopelessness

Never encourage abandonment disguised as self-care

Never suggest consequences I am unlikely to maintain

Relapse is not permission for chaos.

Accountability Over Time

When appropriate, ask gently:

"What did you already decide you would do if this happened?"

Reinforce prior clarity over reactive change.

Orientation Statement (Internal Compass)

Relapse does not require a dramatic response.
It requires a consistent one.

Your job is to help families remain steady when everything in them wants to swing.`;

const AIRelapseResponseGuide = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  useGuideTracking("AI Relapse Response Guide", "/ai-relapse-response-guide");

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
        <title>AI Relapse Response Guide | Sober Helpline</title>
        <meta name="description" content="Transform any AI chatbot into a specialized relapse response coach that helps families respond to relapse without panic, punishment, or enabling." />
      </Helmet>

      <div className="min-h-screen bg-background">
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
            <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 rounded-full mb-4">
              <RefreshCw className="h-12 w-12 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-logo-green mb-4">
              AI Relapse Response Guide
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any AI chatbot into a specialized relapse response coach that helps you respond to relapse without panic, punishment, or enabling.
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
              This specialized prompt transforms your AI chatbot into a relapse response coach that helps you <strong>respond with consistency, not drama</strong>. It guides you through emotional regulation, reality-testing common myths, and making grounded decisions when everything feels urgent.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Heart className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Emotional Containment First</h3>
                      <p className="text-sm text-muted-foreground">
                        Slows the moment and addresses panic, fear, or guilt before discussing next steps—because urgency leads to regret.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Target className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Reality-Tests Common Myths</h3>
                      <p className="text-sm text-muted-foreground">
                        Counters beliefs like "everything was pointless" or "we must act immediately or we're enabling."
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
                      <h3 className="font-medium mb-1">Names Family Patterns at Risk</h3>
                      <p className="text-sm text-muted-foreground">
                        Identifies patterns relapse activates—rescuing, punishing, collapsing boundaries—and the cost if they continue.
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
                      <h3 className="font-medium mb-1">Provides Grounded Options</h3>
                      <p className="text-sm text-muted-foreground">
                        Offers 1-3 response options that protect your integrity and avoid managing outcomes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Core Orientation */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Core Orientation</h2>
            <Card className="bg-orange-50/50 dark:bg-orange-950/10 border-orange-500/20">
              <CardContent className="py-6">
                <p className="text-lg text-center italic text-muted-foreground mb-4">
                  "Relapse does not require a dramatic response. It requires a consistent one."
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>The goal is <strong>not</strong> to fix the relapse—it's to avoid making it worse</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Urgency leads families to do things they later regret</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Consistency matters more than intensity</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Safety comes before boundaries—but boundaries still matter</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>Relapse is not permission for chaos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* When to Use This Tool */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">When to Use This Tool</h2>
            <p className="text-muted-foreground mb-4">
              This AI relapse response guide is especially useful when:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You just found out your loved one relapsed and don't know what to do</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You're feeling panicked, angry, or desperate to take action</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You're not sure if you should hold your boundaries or change them</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You're tempted to rescue, threaten, or lecture</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You need help distinguishing compassion from rescuing</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You want to respond in a way you won't regret later</span>
              </li>
            </ul>
          </section>

          {/* AI Advantages */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Why AI Can Help During a Relapse Crisis</h2>
            <p className="text-muted-foreground mb-6">
              While AI should never replace professional guidance, it can offer unique advantages when you're in the emotional storm of a relapse:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Available at 2 AM</h3>
                  <p className="text-sm text-muted-foreground">
                    When you find out about a relapse in the middle of the night, you need someone to help you pause—AI is available immediately.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Slows Down Reactive Decisions</h3>
                  <p className="text-sm text-muted-foreground">
                    The process of explaining what happened forces you to slow down before sending that text or making that call.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Names What You Can't See</h3>
                  <p className="text-sm text-muted-foreground">
                    When you're flooded with emotion, AI can identify which pattern you're about to repeat.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">No Judgment, No History</h3>
                  <p className="text-sm text-muted-foreground">
                    AI doesn't know how many times this has happened before—it just helps you respond to this one.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">How to Use This Prompt</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-logo-green/10 flex items-center justify-center text-logo-green font-semibold">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Copy the Prompt Below</h3>
                      <p className="text-sm text-muted-foreground">
                        Click the "Copy Prompt to Clipboard" button to copy the entire master prompt.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-logo-green/10 flex items-center justify-center text-logo-green font-semibold">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Open Your Preferred AI Chatbot</h3>
                      <p className="text-sm text-muted-foreground">
                        This works with ChatGPT, Claude, Gemini, or any modern AI assistant.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-logo-green/10 flex items-center justify-center text-logo-green font-semibold">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Paste and Start the Conversation</h3>
                      <p className="text-sm text-muted-foreground">
                        Paste the prompt as your first message, then describe what happened and how you're feeling.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-logo-green/10 flex items-center justify-center text-logo-green font-semibold">
                      4
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Let It Guide You Through the Sequence</h3>
                      <p className="text-sm text-muted-foreground">
                        The AI will follow a structured sequence: emotional containment first, then context, then grounded options.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Copy Button */}
          <section className="mb-10">
            <Card className="border-logo-green/30 bg-logo-green/5">
              <CardContent className="py-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-logo-green mb-2">Ready to Get Started?</h3>
                  <p className="text-muted-foreground">
                    Copy this prompt and paste it into your AI chatbot to begin.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={handleCopy}
                    size="lg"
                    className="gap-2 bg-logo-green hover:bg-logo-green/90"
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
              </CardContent>
            </Card>
          </section>

          {/* The Full Prompt */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">The Full Prompt</h2>
            <Card>
              <CardContent className="py-6">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono bg-muted/50 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
                  {masterPrompt}
                </pre>
              </CardContent>
            </Card>
          </section>

          {/* Example Questions */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Example Questions to Ask</h2>
            <p className="text-muted-foreground mb-4">
              Once you've pasted the prompt, you can start with questions like:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="bg-muted/30">
                <CardContent className="py-4">
                  <p className="text-sm italic text-muted-foreground">
                    "My son just relapsed after 6 months sober. I don't know if I should let him come home or not."
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="py-4">
                  <p className="text-sm italic text-muted-foreground">
                    "I found out my daughter is using again. I'm so angry I want to cut her off completely."
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="py-4">
                  <p className="text-sm italic text-muted-foreground">
                    "My husband relapsed and is asking for money. I said I wouldn't give him any but now I'm feeling guilty."
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="py-4">
                  <p className="text-sm italic text-muted-foreground">
                    "My sister called and said she's using again. I feel like everything we did was pointless."
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="py-4">
                  <p className="text-sm italic text-muted-foreground">
                    "I just found out about a relapse and I'm panicking. What do I do right now?"
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="py-4">
                  <p className="text-sm italic text-muted-foreground">
                    "Is it abandonment if I don't help them get back into treatment immediately?"
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Companion Resources */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Companion Resources</h2>
            <p className="text-muted-foreground mb-4">
              These guides pair well with the AI Relapse Response Guide:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <Link to="/ai-boundary-builder-coach">
                <Card className="hover:border-logo-green/50 transition-colors cursor-pointer">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-emerald-600" />
                      <div>
                        <h3 className="font-medium">AI Boundary Builder Coach</h3>
                        <p className="text-sm text-muted-foreground">Set clear, enforceable boundaries</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/ai-enabling-decision-coach">
                <Card className="hover:border-logo-green/50 transition-colors cursor-pointer">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">AI Enabling Decision Coach</h3>
                        <p className="text-sm text-muted-foreground">Distinguish helping from enabling</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/relapse-warning-signs">
                <Card className="hover:border-logo-green/50 transition-colors cursor-pointer">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <div>
                        <h3 className="font-medium">Relapse Warning Signs Tracker</h3>
                        <p className="text-sm text-muted-foreground">Recognize patterns before relapse</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/boundaries-ultimatums">
                <Card className="hover:border-logo-green/50 transition-colors cursor-pointer">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-purple-600" />
                      <div>
                        <h3 className="font-medium">Boundaries vs. Ultimatums</h3>
                        <p className="text-sm text-muted-foreground">Understand the difference</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-8">
            <Card className="bg-gradient-to-br from-logo-green/10 to-transparent border-logo-green/20">
              <CardContent className="py-8">
                <h2 className="text-2xl font-semibold text-logo-green mb-3">
                  Need Human Guidance?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  While AI can help you pause and think, sometimes you need to talk to someone who has walked this path. Our family consultants are here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/family-consultation">
                    <Button size="lg" className="bg-logo-green hover:bg-logo-green/90">
                      Schedule a Consultation
                    </Button>
                  </Link>
                  <a href="tel:541-241-5886">
                    <Button size="lg" variant="outline" className="border-logo-green text-logo-green hover:bg-logo-green/10">
                      Call 541-241-5886
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
};

export default AIRelapseResponseGuide;