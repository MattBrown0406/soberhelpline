import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";
import SafetyBox, { type SafetyTopic } from "@/components/SafetyBox";

interface CommunicationSection {
  title: string;
  whatToSay: string[];
  whatNotToSay: string[];
  whyItWorks: string;
  /** Safety note shown at the end of this section. */
  safety?: { topics: SafetyTopic[]; title: string };
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
    safety: { topics: ["overdose"], title: "After a relapse" },
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

// Carried over from the Enabling Language Translator (the owner's words).
const languageTranslations: { enabling: string; communicates: string; boundary: string }[] = [
  {
    enabling: "Just this once.",
    communicates: "Exceptions are negotiable.",
    boundary: "We aren't making exceptions to this boundary.",
  },
  {
    enabling: "I don't want to make things worse.",
    communicates: "Your emotional reaction controls my decisions.",
    boundary: "I'm choosing what's healthiest, even if it's uncomfortable.",
  },
  {
    enabling: "I know you're trying.",
    communicates: "Effort replaces behavior.",
    boundary: "I care about effort, and I'm looking for consistent follow-through.",
  },
  {
    enabling: "I'll help you this time—but it can't happen again.",
    communicates: "This pattern has worked before.",
    boundary: "I'm not able to help in this way.",
  },
  {
    enabling: "I trust you—please don't mess this up.",
    communicates: "Pressure replaces structure.",
    boundary: "Trust grows through consistent behavior over time.",
  },
  {
    enabling: "You don't have anywhere else to go.",
    communicates: "I'm responsible for preventing consequences.",
    boundary: "I'm not able to provide housing while substances are involved.",
  },
  {
    enabling: "I can't sleep knowing you're out there.",
    communicates: "My anxiety overrides boundaries.",
    boundary: "I'm working on managing my fear without changing this boundary.",
  },
  {
    enabling: "I just want you to be okay.",
    communicates: "Comfort matters more than change.",
    boundary: "I want you to be safe, and that means treatment/support.",
  },
  {
    enabling: "Please don't do this to me.",
    communicates: "Responsibility for your emotions is being transferred.",
    boundary: "I'm responsible for my feelings, and you're responsible for your choices.",
  },
  {
    enabling: "If you really loved me, you would…",
    communicates: "Love is conditional and emotionally negotiated.",
    boundary: "I'm setting this boundary because I love you—not to control you.",
  },
];

const translationFormula = ["Acknowledge emotion (without fixing it)", "State boundary clearly", "Avoid explanation or debate"];

const reactionsToExpect = ["Pushback", "Emotional escalation", "Accusations", "Silence", "Guilt"];

// Carried over from Conversation Starters for Families (the owner's words).
const beforeYouStart = [
  "Check your internal state first; if fear, panic, or urgency are driving the conversation, it will likely escalate",
  "Regulate yourself before engaging—pause, breathe, take a walk, or write your thoughts down first",
  "Choose a time when no one is already emotionally activated",
  "Avoid conversations during or immediately after substance use",
  "Focus on understanding, not persuading or controlling the outcome",
  "End or pause the conversation if it becomes unsafe or emotionally charged",
];

const conversationStarterSets: { title: string; intro: string; questions: string[] }[] = [
  {
    title: "Understanding What's Really Happening",
    intro: "These questions help families move beyond surface-level arguments and defensiveness.",
    questions: [
      "What feels hardest about this for you right now?",
      "What do you think we're all reacting to?",
      "What worries you the most that you don't usually say out loud?",
      "What do you feel like we're missing or not talking about?",
    ],
  },
  {
    title: "Exploring Impact Without Blame",
    intro: "Use these to acknowledge consequences without turning the conversation into an attack.",
    questions: [
      "How has this been affecting the family?",
      "What has changed in ways we haven't really talked about?",
      "What feels different now compared to before?",
      "What are we all doing now that we weren't doing before?",
    ],
  },
  {
    title: "Helping vs. Enabling",
    intro: "These questions are useful when families feel stuck between rescuing and resentment.",
    questions: [
      "What are we doing that helps in the short term but hurts in the long term?",
      "What would support look like if it didn't involve fixing or rescuing?",
      "What are we afraid would happen if we stopped stepping in?",
    ],
  },
  {
    title: "Boundaries and Safety",
    intro: "These questions clarify limits without threats, ultimatums, or control.",
    questions: [
      "What do we need in order to feel safe and stable?",
      "What are we willing to participate in—and what are we not?",
      "What boundary would protect us, even if it doesn't change them?",
    ],
  },
  {
    title: "Looking Forward",
    intro: "Use these when the family is ready to think beyond the immediate crisis.",
    questions: [
      "What would a healthier version of this look like for us?",
      "What do we need help with that we can't do alone?",
      "What's one small change we could make that we could actually hold?",
    ],
  },
];

export default function CommunicationGuide() {
  useGuideTracking("/communication-guide", "What to Say / What Not to Say");
  const handlePrint = () => {
    window.print();
  };

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
                Back to Family Education
              </Link>
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>

            <ToolBrandHeader
              headingAs="h1"
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

                  {section.safety && (
                    <SafetyBox topics={section.safety.topics} title={section.safety.title} className="mb-0" />
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Enabling language -> boundary language (from the Enabling Language Translator) */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-logo-blue">Common Enabling Phrases—and Translations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  The words families use in moments of pressure often determine whether a boundary holds—or collapses.
                  Below are real phrases families use, followed by what addiction hears—and how to translate them.
                </p>
                <div className="grid md:grid-cols-2 gap-4 break-inside-avoid">
                  <div className="p-4 rounded-lg bg-red-100/50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50">
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-2">Enabling language</p>
                    <p className="text-muted-foreground text-sm">
                      focuses on <strong className="text-foreground">relieving discomfort</strong>
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-100/50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/50">
                    <p className="font-semibold text-green-700 dark:text-green-400 mb-2">Boundary language</p>
                    <p className="text-muted-foreground text-sm">
                      focuses on <strong className="text-foreground">reducing harm</strong>
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">Both may sound compassionate—but only one supports change.</p>

                <div className="space-y-4">
                  {languageTranslations.map((item, index) => (
                    <div key={index} className="border border-border rounded-lg overflow-hidden break-inside-avoid">
                      <div className="bg-red-50/50 dark:bg-red-950/20 p-4 border-b border-border">
                        <p className="text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wide mb-1">
                          Enabling Phrase
                        </p>
                        <p className="font-medium text-foreground italic">"{item.enabling}"</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>What It Communicates:</strong> {item.communicates}
                        </p>
                      </div>
                      <div className="bg-green-50/50 dark:bg-green-950/20 p-4">
                        <p className="flex items-center gap-2 text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          Boundary Translation
                        </p>
                        <p className="font-medium text-foreground italic">"{item.boundary}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 break-inside-avoid">
              <CardHeader>
                <CardTitle className="text-logo-blue">A Simple Translation Formula</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-muted-foreground">When unsure what to say, use this structure:</p>
                  <ol className="list-decimal pl-5 space-y-2 text-foreground">
                    {translationFormula.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Example:</p>
                    <p className="italic font-medium text-foreground">"I hear that you're upset. This boundary hasn't changed."</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">What to Expect After Using Boundary Language</h4>
                  <p className="text-muted-foreground">Expect:</p>
                  <ul className="space-y-2">
                    {reactionsToExpect.map((reaction) => (
                      <li key={reaction} className="flex items-start gap-2 text-sm">
                        <span className="text-logo-blue mt-0.5">•</span>
                        <span>{reaction}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-medium text-foreground">These reactions do not mean the boundary is wrong.</p>
                  <p className="text-muted-foreground">They mean the old language stopped working.</p>
                  <p className="font-semibold text-foreground italic">Clarity is not cruelty. It is kindness with structure.</p>
                </div>
              </CardContent>
            </Card>

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

            {/* Conversation starters (from Conversation Starters for Families) */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-logo-blue">Conversation Starters for Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    The sections above give you words for hard moments. These questions are for a calmer one.
                  </p>
                  <p className="text-muted-foreground">
                    These conversation starters are not designed to convince, confront, or control anyone. They are meant to
                    help families slow things down, reduce defensiveness, and speak from a calmer, steadier place.
                  </p>
                  <p className="font-medium text-foreground">
                    You do not need to ask every question. Choose the ones that fit where your family is right now, and
                    return to others later as clarity grows.
                  </p>
                </div>

                <div className="rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-4 space-y-3 break-inside-avoid">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-300">Before You Start</h4>
                  <ul className="space-y-2">
                    {beforeYouStart.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-medium text-amber-900 dark:text-amber-200">
                    The calmer and clearer you are, the less power the problem has in the room.
                  </p>
                </div>

                {conversationStarterSets.map((set) => (
                  <div key={set.title} className="space-y-3 break-inside-avoid">
                    <Separator />
                    <h4 className="font-semibold text-logo-blue">{set.title}</h4>
                    <p className="text-sm text-muted-foreground">{set.intro}</p>
                    <ul className="space-y-2">
                      {set.questions.map((question) => (
                        <li key={question} className="flex items-start gap-2 text-sm">
                          <span className="text-logo-blue mt-0.5">•</span>
                          <span className="italic">"{question}"</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg space-y-2 break-inside-avoid">
                  <p className="text-sm text-muted-foreground">
                    These conversations are about changing patterns, not forcing outcomes. You may not see immediate
                    agreement or relief—and that's okay. Calm, honest conversations held consistently often matter more than
                    one dramatic discussion.
                  </p>
                  <p className="font-semibold text-foreground">
                    Progress is measured in clarity and consistency, not instant results.
                  </p>
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
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Threats appear</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    <span>The conversation becomes emotionally or physically unsafe</span>
                  </li>
                </ul>
                <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg mt-4">
                  <p className="font-medium mb-2">You can say:</p>
                  <p className="italic text-muted-foreground">"I'm ending this conversation."</p>
                  <p className="italic text-muted-foreground">"We'll talk another time."</p>
                  <p className="text-sm mt-2 text-foreground font-medium">Then disengage.</p>
                </div>
                <p className="font-medium text-foreground">
                  Pausing a conversation is not quitting. It's choosing stability over damage.
                </p>
                <SafetyBox topics={["emergency", "violence"]} title="If the conversation becomes unsafe" className="mb-0" />
              </CardContent>
            </Card>

            {/* Final Reframe */}
            <Card className="mb-8 bg-logo-blue/10 border-logo-green/30 break-inside-avoid">
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
                  <Link to="/workbook/boundary-script">
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
                  <Link to="/family-education#worksheet-enabling-decision-tree">
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
