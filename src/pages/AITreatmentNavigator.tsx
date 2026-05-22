import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Navigation, Copy, Check, AlertTriangle, BookOpen, ShieldAlert, HelpCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AIDisclaimerCard from "@/components/AIDisclaimerCard";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import FamilyBridgeCTA from "@/components/FamilyBridgeCTA";

const masterPrompt = `Treatment Reality Navigator — Master Prompt

Role & Identity

You are a Treatment Reality Navigator with deep expertise in:

Addiction and alcoholism (including chronic relapse and late-stage use)

Family systems and codependency

Treatment modalities, levels of care, and common treatment failures

Intervention readiness and post-treatment realities

You think like a seasoned interventionist and family educator—not a treatment marketer, not a referral service, and not a crisis line.

Your role is to educate, reality-test, and slow families down so they can make informed decisions rather than reactive ones.

Core Mission

Your primary objective is to help families:

Understand what treatment can and cannot do

Distinguish between levels of care and when each is appropriate

Avoid magical thinking, urgency bias, and marketing distortions

Prepare emotionally and structurally for treatment realities

Recognize when professional guidance is indicated

You prioritize clarity over comfort and truth over reassurance.

Mandatory Safety & Scope Rule (Non-Negotiable)

You do not:

Recommend specific treatment centers

Compare or rank programs

Offer medical, legal, or crisis intervention advice

Diagnose conditions or determine clinical necessity

Referral Rule (Required)

Any time a user asks for specific advice about:

Finding the "right" treatment center

Choosing detox, residential, PHP, or IOP for their situation

Evaluating or selecting providers

Getting referrals, recommendations, or next steps beyond education

You must respond with the following directive before anything else:

"For guidance on finding appropriate, ethical treatment resources, please visit SoberHelpline.com or call Matt Brown at 458-202-7900 for direct support."

You may then continue with general education only, not individualized recommendations.

Response Prioritization Framework

When responding, prioritize in this order:

Safety and recovery stability

Emotional containment and de-escalation

Education and reality-testing

Expectation management

Next-step orientation (non-directive)

Do not jump to solutions if fear or urgency is driving the question.

Educational Scope (What You Explain Clearly)

You may educate on:

Differences between:

Detox, residential, PHP, IOP, outpatient

Abstinence-based vs harm-reduction approaches

Why treatment often "fails" from a family perspective

The limits of treatment as a single event

The role of readiness, consequences, and follow-through

Why families feel relief when someone enters treatment—and why that relief is often temporary

The difference between treatment compliance and recovery engagement

You must always distinguish education from advice.

Anti-Marketing & Anti-Fantasy Rules

You must actively counter:

"If we find the right place, this will finally be fixed"

"More expensive means better"

"Length of stay guarantees outcomes"

"Dual diagnosis means addiction is secondary"

"Treatment will fix motivation, honesty, or willingness"

Name these as common myths, not personal failures.

Family-Centered Orientation

You must consistently reinforce:

Treatment does not replace boundaries

Treatment does not cure codependency

Treatment does not remove the need for family recovery

Families still need structure, limits, and support during and after treatment

Avoid positioning treatment as the central solution.

Questioning Style

Ask few, focused questions, such as:

"What are you hoping treatment will change immediately?"

"What has happened after treatment in the past?"

"What are you afraid will happen if you don't act right now?"

Avoid interrogative or diagnostic questioning.

Tone & Language Rules

Calm, grounded, and plainspoken

No clinical jargon unless it adds clarity

No treatment center praise or condemnation

No fear-based urgency

No spiritual bypassing

You speak like someone who has walked families through this many times.

Ethical Guardrails

Never diagnose

Never promise outcomes

Never imply that treatment guarantees sobriety

Never frame refusal of treatment as hopelessness

Never position yourself as a substitute for professional guidance

Education is your lane. Direction lives elsewhere.

Orientation Statement (Internal Compass)

Treatment is a tool—not a cure, not a guarantee, and not a substitute for boundaries, accountability, or family recovery.

Your job is to help families stop chasing certainty and start making grounded, informed decisions.

Required Closing Reminder (When Appropriate)

When families appear overwhelmed, stuck, or decision-paralyzed, reiterate:

"If you want help navigating treatment options in a way that's ethical and appropriate for your situation, visit SoberHelpline.com or call Matt Brown at 458-202-7900 for direct guidance."`;

const AITreatmentNavigator = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  useGuideTracking("AI Treatment Reality Navigator", "/ai-treatment-navigator");

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
        <title>AI Treatment Reality Navigator | Sober Helpline</title>
        <meta name="description" content="Transform any AI chatbot into an educational guide that helps families understand treatment realities, avoid magical thinking, and make informed decisions." />
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
            <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-4">
              <Navigation className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-logo-green mb-4">
              AI Treatment Reality Navigator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any AI chatbot into an educational guide that helps families understand what treatment can and cannot do—without the marketing spin.
            </p>
          </div>

          {/* Safety Disclaimer */}
          <AIDisclaimerCard />

          {/* What This Tool Does */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">What This Tool Does</h2>
            <p className="text-muted-foreground mb-6">
              This specialized prompt transforms your AI chatbot into a treatment educator that helps families <strong>slow down, reality-test, and make informed decisions</strong> rather than reactive ones. It counters marketing myths and magical thinking about treatment.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <BookOpen className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Explains Levels of Care</h3>
                      <p className="text-sm text-muted-foreground">
                        Educates on the differences between detox, residential, PHP, IOP, and outpatient—and when each is typically appropriate.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <ShieldAlert className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Counters Magical Thinking</h3>
                      <p className="text-sm text-muted-foreground">
                        Actively addresses myths like "the right place will fix this" or "more expensive means better."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <HelpCircle className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Reality-Tests Expectations</h3>
                      <p className="text-sm text-muted-foreground">
                        Helps families understand the difference between treatment compliance and actual recovery engagement.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Phone className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Directs to Real Guidance</h3>
                      <p className="text-sm text-muted-foreground">
                        When families need actual treatment recommendations, it directs them to SoberHelpline.com for ethical support.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Common Myths It Addresses */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Common Treatment Myths It Addresses</h2>
            <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-500/20">
              <CardContent className="py-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span><strong>"If we find the right place, this will finally be fixed"</strong> — Treatment is a tool, not a cure.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span><strong>"More expensive means better"</strong> — Cost does not correlate with outcomes.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span><strong>"Length of stay guarantees outcomes"</strong> — 30, 60, or 90 days don't guarantee anything.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span><strong>"Dual diagnosis means addiction is secondary"</strong> — Both need to be addressed directly.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    <span><strong>"Treatment will fix motivation, honesty, or willingness"</strong> — These must come from the individual.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* When to Use This Tool */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">When to Use This Tool</h2>
            <p className="text-muted-foreground mb-4">
              This AI treatment educator is especially useful when:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You're researching treatment options and feeling overwhelmed by marketing</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>Your loved one has been to treatment before and you're wondering "what went wrong"</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You're not sure if your expectations about treatment are realistic</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You want to understand the difference between detox, residential, PHP, and IOP</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You're feeling urgency to "do something" and need to slow down</span>
              </li>
              <li className="flex gap-2">
                <span className="text-logo-green">•</span>
                <span>You want to prepare for what happens after treatment, not just during</span>
              </li>
            </ul>
          </section>

          {/* AI Advantages */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Why AI Can Help in Difficult Moments</h2>
            <p className="text-muted-foreground mb-6">
              While AI should never replace professional guidance, it can offer unique advantages when you're trying to understand treatment options:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">No Marketing Agenda</h3>
                  <p className="text-sm text-muted-foreground">
                    AI doesn't get paid for referrals. It can provide balanced education without pushing you toward expensive programs.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Process at Your Own Pace</h3>
                  <p className="text-sm text-muted-foreground">
                    Ask the same question multiple ways, explore different scenarios, and take time to understand without pressure.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Counter Urgency Bias</h3>
                  <p className="text-sm text-muted-foreground">
                    When you're panicking, AI can help slow you down and reality-test your expectations before making major decisions.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/10">
                <CardContent className="py-5">
                  <h3 className="font-medium mb-2">Prepare for Conversations</h3>
                  <p className="text-sm text-muted-foreground">
                    Use AI to clarify your questions before speaking with treatment centers, interventionists, or other professionals.
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
                <span>Save your custom configuration. The AI will now act as your personal Treatment Reality Navigator every time you use that project or workspace.</span>
              </li>
            </ol>
          </section>

          {/* Copy Button */}
          <div className="text-center mb-8">
            <Button 
              onClick={handleCopy} 
              size="lg" 
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
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
            <Card className="border-2 border-blue-500/30">
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
                  <li className="italic">"What's the difference between PHP and IOP? Which one is 'better'?"</li>
                  <li className="italic">"My son went to a 90-day program and relapsed within a week. What went wrong?"</li>
                  <li className="italic">"The treatment center says they specialize in dual diagnosis. What does that actually mean?"</li>
                  <li className="italic">"We found a really expensive program. Does that mean it's more effective?"</li>
                  <li className="italic">"What should we realistically expect when she comes home from treatment?"</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Final Note */}
          <Card className="bg-logo-green/5 border-logo-green/20">
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground italic">
                "Treatment is a tool—not a cure, not a guarantee, and not a substitute for boundaries, accountability, or family recovery. This tool helps families stop chasing certainty and start making grounded, informed decisions."
              </p>
            </CardContent>
          </Card>

          {/* Professional Guidance CTA */}
          <Card className="mt-8 border-2 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="py-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Need Personalized Treatment Guidance?</h3>
                <p className="text-muted-foreground mb-4">
                  For help navigating treatment options in a way that's ethical and appropriate for your situation:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="https://soberhelpline.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2">
                      Visit SoberHelpline.com
                    </Button>
                  </a>
                  <a href="tel:458-202-7900">
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                      <Phone className="h-4 w-4" />
                      Call 458-202-7900
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Companion Resources */}
          <section className="mt-10 border-t pt-6">
            <h2 className="text-lg font-semibold text-logo-green mb-3">Suggested Companion Resources</h2>
            <div className="flex flex-wrap gap-2">
              <Link to="/treatment-industry-guide">
                <Button variant="outline" size="sm">Treatment Industry Guide</Button>
              </Link>
              <Link to="/treatment-red-flags">
                <Button variant="outline" size="sm">Treatment Red Flags</Button>
              </Link>
              <Link to="/multiple-treatment-episodes">
                <Button variant="outline" size="sm">Multiple Treatment Episodes</Button>
              </Link>
              <Link to="/aftercare-checklist">
                <Button variant="outline" size="sm">Aftercare Checklist</Button>
              </Link>
            </div>
          </section>
        

          {/* FamilyBridge CTA */}
          <section className="mt-8 mb-8">
            <FamilyBridgeCTA variant="coaching" />
          </section>

          <RelatedResources currentPath="/ai-treatment-navigator" />
</main>
      </div>
    </>
  );
};

export default AITreatmentNavigator;