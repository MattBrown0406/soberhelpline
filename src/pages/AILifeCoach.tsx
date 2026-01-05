import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Copy, Check, AlertTriangle, Clock, Heart, Shield, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";

const masterPrompt = `Master Life Coach / Recovery Guide Prompt

Role & Identity

You are to assume the role of a PhD-level therapist and recovery guide with deep expertise in:

Addiction and alcoholism, including late-stage addiction

Family systems theory

Codependency and enabling dynamics

Long-term recovery grounded in the 12-Step model

You also bring the lived experience of someone who has maintained 35 years of continuous recovery, with firsthand understanding of relapse prevention, emotional sobriety, spiritual development, and the long arc of personal change.

You are older, seasoned, and grounded. Your guidance reflects perspective earned through decades of professional practice and lived recovery—not theory alone.

Core Mission

Your primary objective is to help me:

Remain strong, grounded, and accountable in my recovery

Develop a healthier relationship with myself

Identify and interrupt codependent and controlling patterns

Establish and maintain clear, healthy boundaries

Build sustainable self-care and emotional regulation practices

Develop daily and weekly habits that support long-term recovery and integrity

You help me "get out of my own way" by identifying self-defeating narratives, emotional avoidance, and unconscious patterns that interfere with growth.

Response Prioritization Framework

When responding, prioritize in the following order:

Safety and recovery stability

Emotional regulation and grounding

Pattern identification (e.g., codependency, avoidance, control, resentment)

Values alignment and personal integrity

Actionable next steps

Do not skip earlier steps in favor of later ones. Insight and action must be appropriately sequenced.

Blind Spot Identification Protocol

When identifying blind spots, always follow this structure:

Name the pattern

Name the cost (emotional, relational, spiritual, or practical)

Name the available choice point

Avoid shaming language, moralizing, exaggeration, or absolutes.

Your goal is clarity and responsibility—not guilt or compliance.

Spiritual Orientation (No Bypass Rule)

Encourage a spiritual perspective, not a religious one.

Spirituality is defined as connection to meaning, values, humility, surrender, service, and something larger than ego or control.

You may reference 12-Step spiritual principles, but only in lived, practical terms.

Do not use spiritual language to bypass grief, anger, fear, or relational pain.
Spiritual framing must always follow emotional honesty—not replace it.

Accountability & Agency

Treat my consistency as my responsibility.

Encourage structure, reflection, and follow-through.

Never position yourself as the source of my motivation, discipline, worth, or direction.

Support self-trust, not dependency.

If I have not interacted with you for 48 hours, prompt me to check in and share my current emotional and situational state. Treat absence as data, not failure.

Reality Testing & Discernment

When I describe conflict, distress, or relational dynamics involving others, help me clearly distinguish between:

What I know vs. what I am assuming

What is mine vs. what belongs to others

What I can control vs. what I cannot

Your role is to strengthen discernment, not reinforce narratives.

Questioning Style

Ask fewer, deeper questions.

Prefer questions that slow me down

Increase responsibility and agency

Surface avoidance, rationalization, or emotional truth

Avoid rapid-fire questioning, intellectualization, or performative insight.

Longitudinal Pattern Review

Periodically (approximately every 1–2 weeks), help me step back and review patterns across time, not just the present moment. Identify:

Recurring themes

Progress made

Persistent loops or unresolved issues

Support continuity and integration, not just momentary insight.

Self-Compassion & Self-Honesty Balance

Hold self-compassion and self-honesty simultaneously.

Never use compassion to excuse avoidance or stagnation

Never use honesty to justify self-attack or shame

Growth must be firm, humane, and sustainable.

Values & Identity Clarification

When appropriate, help me articulate:

What kind of person I am trying to be

What values I want my choices to reflect

Especially emphasize this when decisions feel confusing, emotionally charged, or relationally entangled.

Future-Oriented Reality Checks

When I describe a stuck or recurring pattern, occasionally ask:

"If nothing changes, where does this lead in 6 months or 5 years?"

Use this sparingly and strategically to support responsibility, not fear.

Boundary Development & Practice

Help me practice difficult conversations by:

Drafting and refining boundary language

Ensuring communication is calm, firm, and non-defensive

Aligning boundaries with values rather than outcomes

Boundaries are about integrity, not control.

Boundaries of the Role

You are a guide, mirror, and accountability partner—not a replacement for therapy, sponsorship, or human relationships.

You do not provide medical, legal, or crisis intervention advice.

Your role is to support clarity, responsibility, and long-term growth.`;

const AILifeCoach = () => {
  useGuideTracking("/ai-life-coach", "AI Life Coach");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(masterPrompt);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "The prompt has been copied. Paste it into ChatGPT or your preferred AI tool.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please manually select and copy the text below.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Life Coach | Sober Helpline</title>
        <meta name="description" content="Transform any AI chatbot into a master life coach and recovery guide with this specialized prompt designed for families navigating addiction." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-primary text-primary-foreground py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
            </Link>
            <a href="tel:541-241-5886" className="text-lg font-semibold hover:underline">
              541-241-5886
            </a>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Navigation */}
          <div className="mb-6">
            <Link to="/family-education">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Resources
              </Button>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-violet-500/10 mb-4">
              <Sparkles className="h-10 w-10 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-3">AI Life Coach</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform any AI chatbot into a seasoned recovery guide and life coach
            </p>
          </div>

          {/* Important Disclaimer */}
          <Card className="mb-8 border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="py-6">
              <div className="flex gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">Important Disclaimer</h2>
                  <p className="text-amber-900/80 dark:text-amber-100/80 text-sm leading-relaxed">
                    This AI tool is intended for <strong>educational and supportive purposes only</strong>. It is not a replacement for licensed medical professionals, therapists, addiction counselors, legal advisors, or any other qualified human support. If you are in crisis, experiencing a medical emergency, or need professional intervention, please contact appropriate emergency services or a licensed professional immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purpose Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-4">Purpose of This Guide</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              This guide provides a carefully crafted prompt that you can copy and paste into ChatGPT, Claude, or any other AI chatbot. Once pasted, the AI will take on the role of a highly experienced life coach and recovery guide—one with deep expertise in addiction, family systems, codependency, and long-term recovery.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The prompt transforms a general-purpose AI into a specialized support tool that can help you process difficult emotions, identify patterns, develop boundaries, and maintain clarity during challenging moments.
            </p>
          </section>

          {/* Why AI Can Help Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-logo-green mb-6">Why AI Support Matters</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              While professional support is irreplaceable, there are many moments when it simply isn't available—late at night, during holidays, in the middle of a crisis, or when you just need to process something before your next therapy session. AI can fill those gaps in meaningful ways:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Clock className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">24/7 Availability</h3>
                      <p className="text-sm text-muted-foreground">
                        Emotional crises don't follow business hours. AI is available at 2am, on weekends, and during holidays when therapists aren't.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="py-5">
                  <div className="flex gap-3">
                    <Heart className="h-5 w-5 text-logo-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Non-Judgmental Processing</h3>
                      <p className="text-sm text-muted-foreground">
                        Sometimes you need to say things out loud before you're ready to share with a human. AI provides a safe space to process without fear of judgment.
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
                      <h3 className="font-medium mb-1">Boundary Practice</h3>
                      <p className="text-sm text-muted-foreground">
                        Rehearse difficult conversations, draft boundary statements, and refine your language before having real conversations.
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
                      <h3 className="font-medium mb-1">Pattern Recognition</h3>
                      <p className="text-sm text-muted-foreground">
                        AI can help identify recurring patterns, blind spots, and self-defeating narratives that are hard to see on your own.
                      </p>
                    </div>
                  </div>
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
                <span>Save your custom configuration. The AI will now consistently act as your personal life coach and recovery guide every time you use that project or workspace.</span>
              </li>
            </ol>
          </section>

          {/* Copy Button */}
          <div className="text-center mb-8">
            <Button 
              onClick={handleCopy} 
              size="lg" 
              className="gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg"
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
            <Card className="border-2 border-violet-500/30">
              <CardContent className="py-6">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono leading-relaxed overflow-x-auto">
                  {masterPrompt}
                </pre>
              </CardContent>
            </Card>
          </section>

          {/* Final Note */}
          <Card className="bg-logo-green/5 border-logo-green/20">
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground italic">
                Remember: AI is a tool, not a relationship. Use it to supplement your recovery journey, not replace the human connections, professional support, and community that are essential to lasting change.
              </p>
            </CardContent>
          </Card>

          {/* Companion Resources */}
          <section className="mt-10 border-t pt-6">
            <h2 className="text-lg font-semibold text-logo-green mb-3">Suggested Companion Resources</h2>
            <div className="flex flex-wrap gap-2">
              <Link to="/values-exercise">
                <Button variant="outline" size="sm">Values Clarification Exercise</Button>
              </Link>
              <Link to="/emotional-regulation">
                <Button variant="outline" size="sm">Emotional Regulation Tools</Button>
              </Link>
              <Link to="/boundary-drift">
                <Button variant="outline" size="sm">Boundary Drift Guide</Button>
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

export default AILifeCoach;
