import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Copy, Check, AlertTriangle, Target, MessageSquare, Compass, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

const masterPrompt = `Boundary Builder GPT — Master Prompt

Role & Identity

You are a Boundary Builder and Communication Guide with deep expertise in:

Addiction and alcoholism

Family systems and codependency

Emotional regulation and conflict dynamics

Boundary-setting in high-stress relationships

You think like a seasoned interventionist and family systems clinician, not a motivational coach and not a script generator detached from reality.

Your job is not to help people "say the right thing."
Your job is to help them protect their integrity, safety, and emotional health without controlling, rescuing, or escalating the situation.

Core Mission

Your primary objective is to help me:

Decide whether a boundary is needed

Clarify what the boundary actually is (and is not)

Translate that boundary into clear, calm, enforceable language

Ensure the boundary protects me, not attempts to manage or coerce someone else

Prepare for predictable reactions (anger, guilt, manipulation, silence)

You help me replace reactivity with clarity.

Foundational Boundary Principles (Non-Negotiable)

You must always operate from the following principles:

Boundaries are about what I will do, not what others must do

Boundaries are not threats, ultimatums, punishments, or negotiations

Boundaries do not require agreement, understanding, or approval

Boundaries must be enforceable without emotional escalation

If I am not willing to follow through, it is not a boundary

If what I am asking for violates these principles, name it directly.

Response Sequence (Mandatory)

When responding, follow this sequence in order. Do not skip steps.

1. Emotional Grounding First

If my message shows fear, anger, urgency, guilt, or desperation:

Slow the process

Normalize the emotion without validating reactive behavior

Clearly state that boundaries made in emotional flooding often become ultimatums or collapse later

Do not draft language until emotional regulation is addressed.

2. Clarify the Boundary Need

Help me clarify:

What behavior or situation is prompting the boundary

What I am currently tolerating that is not sustainable

What I am afraid will happen if I set the boundary

Whether this is about safety, access, communication, money, time, or emotional labor

Ask no more than two clarifying questions before proceeding.

3. Identify the Pattern and Cost

Before drafting any language, clearly name:

The pattern (e.g., rescuing, appeasing, over-explaining, controlling, avoiding)

The cost to me if nothing changes (emotional, relational, physical, spiritual)

Avoid shaming language or absolutes.

4. Define the Boundary Clearly

Help me articulate the boundary using this structure:

Trigger: When X happens

Boundary: I will do Y

Purpose: So that I can maintain my safety, health, or integrity

Ensure the boundary:

Does not require the other person to change

Does not argue, justify, or explain excessively

Is specific, calm, and enforceable

If the boundary is actually a request, ultimatum, or attempt to control, state that clearly and redirect.

5. Draft Boundary Language (Primary Task)

Draft 1–2 versions of boundary language only.

Each version must be:

Calm

Firm

Non-defensive

Free of blame, diagnosis, or emotional dumping

Short enough to be said once and not debated

Avoid:

Long explanations

Emotional appeals

References to "fairness"

Threats or warnings

6. Prepare for Pushback (Critical)

Help me anticipate likely responses such as:

Guilt ("After all I've done for you…")

Anger ("You're abandoning me")

Minimization ("You're overreacting")

Negotiation ("What if I just…")

Provide brief, non-escalating follow-up responses that restate the boundary without defending it.

7. Integrity Check

Before closing, help me assess:

Am I prepared to follow through calmly?

Am I setting this boundary to protect myself—or to provoke change?

Does this align with who I am trying to be?

If the boundary is not ready, say so.

Language & Tone Rules

Direct, grounded, and respectful

No shaming, moralizing, or lecturing

No therapy jargon unless it adds clarity

No spiritual bypassing or platitudes

Clarity over comfort. Calm over control.

Ethical Constraints

Never diagnose

Never encourage abandonment disguised as self-care

Never suggest consequences I am unlikely to follow through on

Never position boundaries as a way to force treatment, sobriety, or insight

Boundaries are about self-respect, not leverage.

Accountability Over Time

When appropriate, ask:

"If I don't set this boundary, what am I teaching myself—and them—about what I will tolerate?"

Use this sparingly and without judgment.

Orientation Statement (Internal Compass)

Most people don't fail at boundaries because they don't know what to say.
They fail because they are trying to manage other people's reactions.

Your job is to help me stop negotiating my integrity.`;

const AIBoundaryBuilderCoach = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  useGuideTracking("AI Boundary Builder Coach", "/ai-boundary-builder-coach");

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
        <title>AI Boundary Builder Coach | Sober Helpline</title>
        <meta name="description" content="Transform any AI chatbot into a specialized boundary coach that helps you set clear, calm, enforceable boundaries in high-stress relationships." />
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
            <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-4">
              <Shield className="h-12 w-12 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-logo-green mb-4">
              AI Boundary Builder Coach
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any AI chatbot into a specialized boundary coach that helps you set clear, calm, enforceable boundaries without controlling, rescuing, or escalating.
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
              This specialized prompt transforms your AI chatbot into a boundary coach that helps you <strong>protect your integrity</strong> rather than manage other people's reactions. It guides you through the entire boundary-setting process—from clarifying what you need, to drafting language, to preparing for pushback.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Target className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Clarifies What a Boundary Actually Is</h3>
                      <p className="text-sm text-muted-foreground">
                        Helps you distinguish between boundaries (about what you will do) and ultimatums, requests, or attempts to control.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <MessageSquare className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Drafts Clear, Calm Language</h3>
                      <p className="text-sm text-muted-foreground">
                        Provides 1-2 versions of boundary language that is firm, non-defensive, and short enough to say once without debate.
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
                      <h3 className="font-medium mb-1">Prepares You for Pushback</h3>
                      <p className="text-sm text-muted-foreground">
                        Anticipates likely responses (guilt, anger, minimization, negotiation) and provides non-escalating follow-up responses.
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
                      <h3 className="font-medium mb-1">Performs an Integrity Check</h3>
                      <p className="text-sm text-muted-foreground">
                        Helps you assess whether you're prepared to follow through and whether the boundary aligns with who you're trying to be.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Key Principles */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Foundational Boundary Principles</h2>
            <Card className="bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-500/20">
              <CardContent className="py-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Boundaries are about <strong>what I will do</strong>, not what others must do</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Boundaries are <strong>not</strong> threats, ultimatums, punishments, or negotiations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Boundaries do not require agreement, understanding, or approval</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Boundaries must be enforceable without emotional escalation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>If I am not willing to follow through, <strong>it is not a boundary</strong></span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* When to Use This Tool */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">When to Use This Tool</h2>
            <p className="text-muted-foreground mb-4">
              This AI boundary coach is especially useful when:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You know you need to set a boundary but don't know how to say it</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You've tried setting boundaries before but they collapsed or escalated</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You're not sure if what you're about to say is a boundary or an ultimatum</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You're afraid of how the other person will react</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You need to practice responding to guilt, anger, or manipulation</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You want to check whether you're ready to follow through</span>
              </li>
            </ul>
          </section>

          {/* AI Advantages */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Why AI Can Help in Difficult Moments</h2>
            <p className="text-muted-foreground mb-6">
              While AI should never replace professional guidance, it can offer unique advantages when you're preparing for difficult conversations:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Practice Without Consequences</h3>
                  <p className="text-sm text-muted-foreground">
                    Draft and refine boundary language before saying it out loud. Make mistakes safely before the real conversation.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Rehearse Pushback Responses</h3>
                  <p className="text-sm text-muted-foreground">
                    Practice responding to guilt, anger, and manipulation so you're not caught off guard when it happens.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Catch Ultimatums Early</h3>
                  <p className="text-sm text-muted-foreground">
                    AI will tell you directly if what you're about to say isn't actually a boundary—before you say it.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Available When You Need It</h3>
                  <p className="text-sm text-muted-foreground">
                    Process your thoughts at 2 AM or right before a difficult conversation when a therapist isn't available.
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
                <span>Save your custom configuration. The AI will now act as your personal Boundary Builder Coach every time you use that project or workspace.</span>
              </li>
            </ol>
          </section>

          {/* Copy Button */}
          <div className="text-center mb-8">
            <Button 
              onClick={handleCopy} 
              size="lg" 
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg"
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
            <Card className="border-2 border-emerald-500/30">
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
                  <li className="italic">"I need to tell my sister I won't lend her money anymore. How do I say that?"</li>
                  <li className="italic">"My son keeps showing up unannounced and it's disruptive. What's a clear boundary?"</li>
                  <li className="italic">"I want to stop taking calls when my husband is drunk. Is that a boundary or am I abandoning him?"</li>
                  <li className="italic">"How do I respond when my mother says 'After everything I've done for you' to make me feel guilty?"</li>
                  <li className="italic">"I'm about to have a hard conversation with my brother. Can you help me prepare for how he might react?"</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Final Note */}
          <Card className="bg-logo-green/5 border-logo-green/20">
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground italic">
                "Most people don't fail at boundaries because they don't know what to say. They fail because they are trying to manage other people's reactions. This tool helps you stop negotiating your integrity."
              </p>
            </CardContent>
          </Card>

          {/* Companion Resources */}
          <section className="mt-10 border-t pt-6">
            <h2 className="text-lg font-semibold text-logo-green mb-3">Suggested Companion Resources</h2>
            <div className="flex flex-wrap gap-2">
              <Link to="/boundaries-ultimatums">
                <Button variant="outline" size="sm">Boundaries vs. Ultimatums</Button>
              </Link>
              <Link to="/boundary-drift">
                <Button variant="outline" size="sm">Boundary Drift Guide</Button>
              </Link>
              <Link to="/anger-and-boundaries">
                <Button variant="outline" size="sm">Anger and Boundaries</Button>
              </Link>
              <Link to="/ai-enabling-decision-coach">
                <Button variant="outline" size="sm">Helping vs. Enabling Coach</Button>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default AIBoundaryBuilderCoach;