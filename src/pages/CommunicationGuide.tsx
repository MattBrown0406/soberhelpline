import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, MessageSquare, Check, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Loader2, Lock } from "lucide-react";
import { CardDescription } from "@/components/ui/card";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";
import FamilyBridgeCTA from "@/components/FamilyBridgeCTA";

interface CommunicationSection {
  title: string;
  whatToSay: string[];
  whatNotToSay: string[];
  whyItWorks: string;
}

const communicationSections: CommunicationSection[] = [
  {
    title: "1. Active Use",
    whatToSay: [
      "I'm not able to support you while you're using.",
      "I care about you, and I won't participate in this.",
      "I'm willing to talk about treatment options.",
      "We can talk when you're sober.",
      "This isn't something I can fix for you.",
    ],
    whatNotToSay: [
      "Why won't you just stop?",
      "You're ruining everything.",
      "If you loved me, you'd quit.",
      "This is your last chance (if you won't follow through)",
      "I don't know what else to do (said repeatedly)",
    ],
    whyItWorks: "You're naming reality without trying to control behavior.",
  },
  {
    title: "2. Treatment Refusal",
    whatToSay: [
      "I believe treatment is necessary.",
      "I'm not continuing as things are.",
      "You don't have to agree—but these are our boundaries.",
      "When you're ready for help, we'll support that.",
      "We're not debating whether there's a problem.",
    ],
    whatNotToSay: [
      "Just think about it a little longer.",
      "What if you try cutting back first?",
      "Maybe this program isn't right for you.",
      "I don't want to push you.",
      "I hope you'll change your mind.",
    ],
    whyItWorks: "Clarity reduces endless conversations and false hope.",
  },
  {
    title: "3. Early Recovery",
    whatToSay: [
      "I'm glad you're taking steps.",
      "We're encouraged by your actions.",
      "We'll let professionals guide this.",
      "Trust will rebuild with time and consistency.",
      "We're focused on our recovery too.",
    ],
    whatNotToSay: [
      "Are you sure you're really sober?",
      "You better not mess this up.",
      "I need daily updates to feel okay.",
      "I'll trust you again once you prove it.",
      "I'm watching everything closely.",
    ],
    whyItWorks: "Early recovery needs structure—not surveillance.",
  },
  {
    title: "4. Relapse",
    whatToSay: [
      "I'm glad you told the truth.",
      "What support needs to change now?",
      "We're returning to our boundaries.",
      "This means we need to reassess the plan.",
      "Let's focus on next steps, not blame.",
    ],
    whatNotToSay: [
      "I knew this would happen.",
      "You've ruined everything.",
      "Why should we believe you now?",
      "You threw it all away.",
      "I can't handle this again.",
    ],
    whyItWorks: "Relapse requires structure and honesty—not emotional punishment.",
  },
  {
    title: "5. Boundary Pushback",
    whatToSay: [
      "My boundary hasn't changed.",
      "I understand you're upset.",
      "I'm not going to argue about this.",
      "I won't explain myself again.",
      "This conversation is over for now.",
    ],
    whatNotToSay: [
      "Just this once…",
      "I hate doing this to you.",
      "I feel so bad.",
      "You're right, maybe I'm being too hard.",
      "Please don't be mad at me.",
    ],
    whyItWorks: "Boundaries only work when they're not negotiated.",
  },
];

const languageEffects = [
  { style: "Explaining", result: "Invites debate" },
  { style: "Arguing", result: "Increases resistance" },
  { style: "Repeating calmly", result: "Builds clarity" },
  { style: "Ending conversations", result: "Protects boundaries" },
  { style: "Emotional speeches", result: "Increases guilt" },
];

export default function CommunicationGuide() {
  useGuideTracking("What to Say / What Not to Say", "/communication-guide");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkMembership = async () => {
      if (!user) {
        setHasMembership(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('provider_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .is('provider_submission_id', null)
          .limit(1);

        if (error) {
          console.error('Error checking membership:', error);
          setHasMembership(false);
        } else {
          setHasMembership(data && data.length > 0);
        }
      } catch (err) {
        console.error('Membership check failed:', err);
        setHasMembership(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMembership();
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasMembership) {
    return (
      <>
        <Helmet>
          <title>Communication Guide | Sober Helpline</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <main className="container py-12">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-2xl">Members Only Content</CardTitle>
                <CardDescription>
                  This content is exclusive to family support members.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Join our family support membership for just $10/month to access this communication guide.
                </p>
                <div className="flex flex-col gap-2">
                  <Link to="/family-membership">
                    <Button className="w-full">Become a Member</Button>
                  </Link>
                  <Link to="/family-support">
                    <Button variant="outline" className="w-full">Back to Family Support</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>What to Say / What Not to Say | Sober Helpline</title>
        <meta name="description" content="A practical communication library for families affected by addiction. Ready-to-use language that lowers defensiveness and supports accountability." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 print:hidden">
              <Link
                to="/family-education"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Resources
              </Link>
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Print Guide
              </Button>
            </div>

            <ToolBrandHeader
              title="What to Say / What Not to Say"
              subtitle="A practical communication library for families affected by addiction. Ready-to-use language that lowers defensiveness and supports accountability."
              clinicalNote="Based on Motivational Interviewing (Miller & Rollnick), CRAFT communication strategies, and Al-Anon's principles of loving detachment."
            />


            {/* Purpose */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-logo-blue">Purpose</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  When emotions run high, families often say things they later regret—not because they don't care, but because they're overwhelmed. This guide gives you ready-to-use language that:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Lowers defensiveness</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Reduces power struggles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Supports accountability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Protects your emotional health</span>
                  </li>
                </ul>
                <p className="font-semibold text-foreground italic">
                  You don't need the perfect words. You need consistent ones.
                </p>
              </CardContent>
            </Card>

            {/* General Communication Principles */}
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-logo-blue">General Communication Principles (Read First)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Before we break this down by scenario, remember:</p>
                <ul className="space-y-2 text-foreground">
                  <li>• <strong>Short</strong> is better than long</li>
                  <li>• <strong>Calm</strong> is better than convincing</li>
                  <li>• <strong>Repetition</strong> is better than explanation</li>
                  <li>• <strong>Boundaries</strong> are not debates</li>
                </ul>
                <p className="text-muted-foreground italic">
                  If a conversation becomes circular, emotional, or abusive—it's okay to end it.
                </p>
              </CardContent>
            </Card>

            {/* Communication Sections */}
            {communicationSections.map((section, index) => (
              <Card key={index} className="mb-6 break-inside-avoid">
                <CardHeader>
                  <CardTitle className="text-logo-blue">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* What to Say */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-700 flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        What to SAY
                      </h4>
                      <p className="text-sm text-muted-foreground">Use calm, factual language focused on your limits.</p>
                      <ul className="space-y-2">
                        {section.whatToSay.map((phrase, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span className="italic">"{phrase}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What Not to Say */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-red-700 flex items-center gap-2">
                        <X className="h-5 w-5" />
                        What NOT to Say
                      </h4>
                      <p className="text-sm text-muted-foreground">These increase defensiveness, secrecy, or guilt.</p>
                      <ul className="space-y-2">
                        {section.whatNotToSay.map((phrase, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-red-600 mt-0.5">•</span>
                            <span className="italic">"{phrase}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm">
                      <strong className="text-logo-blue">Why This Works:</strong>{" "}
                      <span className="text-muted-foreground">{section.whyItWorks}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quick Reference Table */}
            <Card className="mb-8 break-inside-avoid">
              <CardHeader>
                <CardTitle className="text-logo-blue">Quick Reference: What Language Does</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold">Language Style</th>
                        <th className="text-left py-2 font-semibold">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {languageEffects.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2">{item.style}</td>
                          <td className="py-2 text-muted-foreground">{item.result}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* When to Stop Talking */}
            <Card className="mb-8 border-orange-300 bg-orange-50 dark:bg-orange-950/20 break-inside-avoid">
              <CardHeader>
                <CardTitle className="text-orange-700 dark:text-orange-400">When to Stop Talking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">End the conversation if:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Voices escalate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Manipulation starts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    <span>You feel pressured to abandon boundaries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    <span>You're repeating yourself</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    <span>They're intoxicated or abusive</span>
                  </li>
                </ul>
                <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg mt-4">
                  <p className="font-medium mb-2">You can say:</p>
                  <p className="italic text-muted-foreground">"I'm ending this conversation."</p>
                  <p className="italic text-muted-foreground">"We'll talk another time."</p>
                  <p className="text-sm mt-2 text-foreground font-medium">Then disengage.</p>
                </div>
              </CardContent>
            </Card>

            {/* Final Reframe */}
            <Card className="mb-8 bg-logo-green/10 border-logo-green/30 break-inside-avoid">
              <CardHeader>
                <CardTitle className="text-logo-blue">Final Reframe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-semibold text-foreground">
                  You don't need better words. You need fewer words, used consistently.
                </p>
                <p className="text-muted-foreground">Clear language protects:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-logo-blue flex-shrink-0" />
                    <span>Your emotional health</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-logo-blue flex-shrink-0" />
                    <span>Your boundaries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-logo-blue flex-shrink-0" />
                    <span>The possibility of real change</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="break-inside-avoid">
              <CardHeader>
                <CardTitle className="text-logo-blue">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Link to="/family-education">
                    <Button variant="outline" size="sm">Boundary Setting Worksheet</Button>
                  </Link>
                  <Link to="/emotional-regulation">
                    <Button variant="outline" size="sm">Emotional Regulation Tools</Button>
                  </Link>
                  <Link to="/crisis-chaos">
                    <Button variant="outline" size="sm">Crisis vs. Chaos Decision Guide</Button>
                  </Link>
                  <Link to="/family-action-plan">
                    <Button variant="outline" size="sm">Family Recovery Action Plan</Button>
                  </Link>
                  <Link to="/family-education">
                    <Button variant="outline" size="sm">"Is This Help or Enabling?" Decision Tree</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        
          <RelatedResources currentPath="/communication-guide" />
</main>
      </div>
    </>
  );
}
