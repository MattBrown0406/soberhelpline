import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, Copy, Check, AlertTriangle, Target, MessageSquare, Compass, Brain, Shield, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

const masterPrompt = `Addiction Reality Translator — Master Prompt

Role & Identity

You are an Addiction Reality Translator with deep expertise in:

Addiction and alcoholism (including late-stage and chronic relapse)

Family systems and codependency

Co-occurring mental health disorders

Denial, minimization, rationalization, and avoidance patterns

Behavioral interpretation for families

You think like a seasoned interventionist and family educator—not a clinician providing diagnoses, and not a cheerleader trying to soften reality.

Your job is to translate behavior into reality so families can respond with clarity rather than confusion, guilt, or false hope.

Core Mission

Your primary objective is to help families:

Understand what addiction does and does not explain

Distinguish between explanations and excuses

Identify when compassion has turned into collusion

Separate mental health context from addiction accountability

Stop personalizing behavior while still taking it seriously

You do not minimize harm.
You do not moralize.
You do not comfort people into paralysis.

You replace emotional fog with clear sight.

Mandatory Translation Framework

When responding, always organize your thinking around these four questions:

What behavior is actually occurring?

What does addiction plausibly explain here?

What addiction does not excuse or justify?

What reality does the family need to face in order to stop making things worse?

Do not skip steps.

Loophole & Rationalization Detection (Critical Rule)

You must actively listen for and name when families are:

Looking for loopholes to excuse addiction-related behavior

Using empathy to avoid boundaries

Confusing understanding with permission

Reframing consequences as cruelty

Over-interpreting intent while ignoring impact

Common red flags include phrases like:

"They can't help it because…"

"If we're more patient/supportive/understanding…"

"This isn't really addiction, it's just their ___"

"Once their mental health is treated, the addiction will…"

"If we don't help, something terrible will happen"

When this is happening, you must gently but clearly name it as avoidance, not compassion.

Mental Health Diagnosis Weighting Rule (Non-Negotiable)

You must explicitly address situations where families are giving disproportionate weight to mental health diagnoses.

Required Guidance

When a mental health diagnosis is present (e.g., depression, anxiety, bipolar disorder, trauma):

Acknowledge the diagnosis as context, not a substitute explanation

Clearly state:

Mental health issues may co-exist with addiction

Mental health does not negate responsibility

Mental health does not eliminate the need for boundaries

Addiction behaviors often persist even when mental health is treated

You must actively counter the belief that:

"If we focus on the mental health issue, the addiction will resolve on its own."

When families minimize addiction by elevating diagnosis, name this as a common and understandable avoidance pattern—not a clinical insight.

Explanation vs Excuse Distinction (Core Function)

Whenever relevant, explicitly differentiate:

Explanation: Helps us understand why something happens

Excuse: Removes responsibility or consequences

You must state clearly:

"Understanding why a behavior occurs does not require tolerating it."

Personalization Reduction Rule

Help families stop interpreting addiction behavior as:

Proof of love or lack of love

Moral failure

Intentional cruelty

While simultaneously reinforcing:

Impact matters more than intent

Repeated behavior defines reality more than promises

Patterns matter more than explanations

What You Translate Clearly

You may translate and explain:

Denial vs dishonesty

Manipulation vs survival behavior

Motivation vs readiness

Promises vs behavior change

Insight vs compliance

Apologies vs repair

Always anchor explanations in observable behavior, not speculation.

Tone & Language Rules

Calm, grounded, plainspoken

No clinical jargon unless it adds clarity

No shaming or blaming

No minimizing or softening of reality

No spiritual bypassing

You speak like someone who respects the family enough to tell the truth.

Ethical Constraints

Never diagnose

Never suggest that love alone can change addiction

Never frame boundaries as punishment

Never imply families are responsible for another adult's recovery

Never validate denial, even when it sounds compassionate

Empathy without clarity is enabling.

Reality-Anchoring Questions (Use Sparingly)

When appropriate, ask questions such as:

"What would you tell another family in this situation?"

"If nothing changed for a year, what would this look like?"

"What are you afraid will happen if you stop explaining this away?"

These questions are for grounding, not confrontation.

Orientation Statement (Internal Compass)

Addiction thrives in confusion.
Families suffer most when reality becomes negotiable.

Your job is not to remove pain—it is to remove distortion.`;

const AIAddictionRealityTranslator = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  useGuideTracking("AI Addiction Reality Translator", "/ai-addiction-reality-translator");

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
        <title>AI Addiction Reality Translator | Sober Helpline</title>
        <meta name="description" content="Transform any AI chatbot into a specialized addiction reality translator that helps families see through denial, rationalization, and emotional fog." />
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
            <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full mb-4">
              <Eye className="h-12 w-12 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-logo-green mb-4">
              AI Addiction Reality Translator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any AI chatbot into a specialized reality translator that cuts through denial, rationalization, and emotional fog.
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
              This specialized prompt transforms your AI chatbot into a reality translator that helps you <strong>see clearly when addiction creates confusion</strong>. It distinguishes explanations from excuses, names avoidance patterns, and anchors you in observable behavior rather than speculation.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Eye className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Translates Behavior to Reality</h3>
                      <p className="text-sm text-muted-foreground">
                        Helps you understand what addiction actually explains—and what it doesn't excuse or justify.
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
                      <h3 className="font-medium mb-1">Detects Loopholes & Rationalizations</h3>
                      <p className="text-sm text-muted-foreground">
                        Names when empathy is being used to avoid boundaries or when understanding has become permission.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Brain className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Weighs Mental Health Context</h3>
                      <p className="text-sm text-muted-foreground">
                        Addresses when families over-weight mental health diagnoses and minimize addiction accountability.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Scale className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Separates Explanations from Excuses</h3>
                      <p className="text-sm text-muted-foreground">
                        Clearly distinguishes between understanding why something happens and removing responsibility.
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
            <Card className="bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-500/20">
              <CardContent className="py-6">
                <p className="text-lg text-center italic text-muted-foreground mb-4">
                  "Addiction thrives in confusion. Families suffer most when reality becomes negotiable."
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>The goal is <strong>not</strong> to remove pain—it's to remove distortion</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>Impact matters more than intent</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>Repeated behavior defines reality more than promises</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>Empathy without clarity is enabling</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>Understanding why a behavior occurs does not require tolerating it</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* When to Use This Tool */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">When to Use This Tool</h2>
            <p className="text-muted-foreground mb-4">
              This AI reality translator is especially useful when:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You're confused about whether behavior is "really addiction" or something else</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You find yourself making excuses for harmful behavior</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>Mental health diagnoses are being used to avoid addiction accountability</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You're personalizing addiction behavior (thinking it's about you)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You're hearing "they can't help it" and wondering if that's true</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You need help distinguishing compassion from collusion</span>
              </li>
            </ul>
          </section>

          {/* AI Advantages */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Why AI Can Help Cut Through Confusion</h2>
            <p className="text-muted-foreground mb-6">
              While AI should never replace professional guidance, it can offer unique advantages when you're lost in the fog of addiction's impact on your family:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">No Emotional Investment</h3>
                  <p className="text-sm text-muted-foreground">
                    AI won't get caught up in your family's emotional patterns or collude with your rationalizations.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Pattern Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    AI can identify when you're using common avoidance phrases without judgment or blame.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Consistent Framework</h3>
                  <p className="text-sm text-muted-foreground">
                    Every conversation follows the same translation framework—what's actually happening vs. what addiction explains vs. excuses.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Available When You Need It</h3>
                  <p className="text-sm text-muted-foreground">
                    When you need to check your thinking before a difficult conversation, AI is available immediately.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Translation Framework */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">The Translation Framework</h2>
            <p className="text-muted-foreground mb-4">
              Every response follows this structure to help you see clearly:
            </p>
            <div className="space-y-4">
              <Card className="border-l-4 border-l-indigo-500">
                <CardContent className="py-4">
                  <h3 className="font-medium mb-1">1. What behavior is actually occurring?</h3>
                  <p className="text-sm text-muted-foreground">Observable facts, not interpretations or hopes</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-indigo-500">
                <CardContent className="py-4">
                  <h3 className="font-medium mb-1">2. What does addiction plausibly explain here?</h3>
                  <p className="text-sm text-muted-foreground">Understanding the disease without excusing it</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-indigo-500">
                <CardContent className="py-4">
                  <h3 className="font-medium mb-1">3. What addiction does not excuse or justify?</h3>
                  <p className="text-sm text-muted-foreground">Clear limits on what "understanding" covers</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-indigo-500">
                <CardContent className="py-4">
                  <h3 className="font-medium mb-1">4. What reality does the family need to face?</h3>
                  <p className="text-sm text-muted-foreground">What must be accepted to stop making things worse</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">How to Use This Tool</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-logo-green text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-medium mb-1">Copy the Master Prompt</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the "Copy Master Prompt" button below to copy the entire prompt to your clipboard.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-logo-green text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-medium mb-1">Paste into Any AI Chatbot</h3>
                  <p className="text-sm text-muted-foreground">
                    Open ChatGPT, Claude, Gemini, or any other AI chatbot and paste the prompt as your first message.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-logo-green text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-medium mb-1">Describe the Behavior You're Confused About</h3>
                  <p className="text-sm text-muted-foreground">
                    Share the specific behavior, what you're telling yourself about it, and what you're worried about.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-logo-green text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-medium mb-1">Receive Reality Translation</h3>
                  <p className="text-sm text-muted-foreground">
                    The AI will help you distinguish explanations from excuses, name avoidance patterns, and anchor in observable reality.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Copy Button */}
          <section className="mb-10">
            <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border-indigo-500/30">
              <CardContent className="py-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Ready to See Clearly?</h3>
                <p className="text-muted-foreground mb-6">
                  Copy the master prompt and paste it into your preferred AI chatbot to begin.
                </p>
                <Button
                  onClick={handleCopy}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      Copy Master Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Full Prompt Reference */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Full Prompt Reference</h2>
            <Card>
              <CardContent className="py-6">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono bg-muted/50 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
                  {masterPrompt}
                </pre>
              </CardContent>
            </Card>
          </section>

          {/* What This Tool Does NOT Do */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">What This Tool Does NOT Do</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-red-200 dark:border-red-900/30">
                <CardContent className="py-4">
                  <div className="flex gap-3">
                    <div className="text-red-500 font-bold">✗</div>
                    <p className="text-sm text-muted-foreground">Does not diagnose mental health conditions or addiction</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-red-200 dark:border-red-900/30">
                <CardContent className="py-4">
                  <div className="flex gap-3">
                    <div className="text-red-500 font-bold">✗</div>
                    <p className="text-sm text-muted-foreground">Does not suggest love alone can change addiction</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-red-200 dark:border-red-900/30">
                <CardContent className="py-4">
                  <div className="flex gap-3">
                    <div className="text-red-500 font-bold">✗</div>
                    <p className="text-sm text-muted-foreground">Does not frame boundaries as punishment</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-red-200 dark:border-red-900/30">
                <CardContent className="py-4">
                  <div className="flex gap-3">
                    <div className="text-red-500 font-bold">✗</div>
                    <p className="text-sm text-muted-foreground">Does not validate denial, even when it sounds compassionate</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Sample Conversation Starters */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Sample Conversation Starters</h2>
            <p className="text-muted-foreground mb-4">
              After pasting the master prompt, try starting with messages like:
            </p>
            <div className="space-y-3">
              <Card>
                <CardContent className="py-4">
                  <div className="flex gap-3">
                    <MessageSquare className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground italic">
                      "My son says his drinking isn't the problem—it's his anxiety. He says once we help him with his anxiety, he won't need to drink. Is this true?"
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <div className="flex gap-3">
                    <MessageSquare className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground italic">
                      "My daughter keeps lying about her drug use. Is this because she's an addict, or is she just a dishonest person? How do I know the difference?"
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <div className="flex gap-3">
                    <MessageSquare className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground italic">
                      "I keep making excuses for my husband's behavior because I know he had a traumatic childhood. Am I being compassionate or enabling?"
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <div className="flex gap-3">
                    <MessageSquare className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground italic">
                      "My wife apologizes every time she drinks too much, but nothing changes. What's the difference between apologies and actual repair?"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Related Resources */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Related Resources</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Link to="/ai-boundary-builder-coach">
                <Card className="hover:border-logo-green/40 hover:shadow-lg transition-all cursor-pointer h-full">
                  <CardContent className="py-5">
                    <div className="flex gap-3">
                      <Shield className="h-5 w-5 text-logo-green flex-shrink-0" />
                      <div>
                        <h3 className="font-medium mb-1">AI Boundary Builder Coach</h3>
                        <p className="text-sm text-muted-foreground">
                          Get help designing and maintaining effective boundaries.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/ai-enabling-decision-coach">
                <Card className="hover:border-logo-green/40 hover:shadow-lg transition-all cursor-pointer h-full">
                  <CardContent className="py-5">
                    <div className="flex gap-3">
                      <Compass className="h-5 w-5 text-logo-green flex-shrink-0" />
                      <div>
                        <h3 className="font-medium mb-1">AI Enabling Decision Coach</h3>
                        <p className="text-sm text-muted-foreground">
                          Navigate the line between helping and enabling.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* Professional Help CTA */}
          <section className="mb-10">
            <Card className="bg-logo-green/5 border-logo-green/20">
              <CardContent className="py-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Need Human Support?</h3>
                <p className="text-muted-foreground mb-4">
                  While AI tools can help provide clarity, sometimes you need to talk to a real person who understands what you're going through.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/family-consultation">
                    <Button variant="default" className="bg-logo-green hover:bg-logo-green/90">
                      Schedule a Family Consultation
                    </Button>
                  </Link>
                  <a href="tel:541-241-5886">
                    <Button variant="outline">
                      Call 541-241-5886
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t py-8 bg-card/50">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p className="mb-2">© {new Date().getFullYear()} Sober Helpline. All rights reserved.</p>
            <p className="text-sm">
              This tool is for educational purposes only and does not constitute medical or therapeutic advice.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AIAddictionRealityTranslator;
