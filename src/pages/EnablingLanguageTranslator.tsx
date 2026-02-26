import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, FileText, MessageSquare, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";

export default function EnablingLanguageTranslator() {
  useGuideTracking("Enabling Language Translator", "/enabling-language-translator");
  const translations = [
    {
      enabling: '"Just this once."',
      communicates: "Exceptions are negotiable.",
      boundary: '"We aren\'t making exceptions to this boundary."'
    },
    {
      enabling: '"I don\'t want to make things worse."',
      communicates: "Your emotional reaction controls my decisions.",
      boundary: '"I\'m choosing what\'s healthiest, even if it\'s uncomfortable."'
    },
    {
      enabling: '"I know you\'re trying."',
      communicates: "Effort replaces behavior.",
      boundary: '"I care about effort, and I\'m looking for consistent follow-through."'
    },
    {
      enabling: '"I\'ll help you this time—but it can\'t happen again."',
      communicates: "This pattern has worked before.",
      boundary: '"I\'m not able to help in this way."'
    },
    {
      enabling: '"I trust you—please don\'t mess this up."',
      communicates: "Pressure replaces structure.",
      boundary: '"Trust grows through consistent behavior over time."'
    },
    {
      enabling: '"You don\'t have anywhere else to go."',
      communicates: "I\'m responsible for preventing consequences.",
      boundary: '"I\'m not able to provide housing while substances are involved."'
    },
    {
      enabling: '"I can\'t sleep knowing you\'re out there."',
      communicates: "My anxiety overrides boundaries.",
      boundary: '"I\'m working on managing my fear without changing this boundary."'
    },
    {
      enabling: '"I just want you to be okay."',
      communicates: "Comfort matters more than change.",
      boundary: '"I want you to be safe, and that means treatment/support."'
    },
    {
      enabling: '"Please don\'t do this to me."',
      communicates: "Responsibility for your emotions is being transferred.",
      boundary: '"I\'m responsible for my feelings, and you\'re responsible for your choices."'
    },
    {
      enabling: '"If you really loved me, you would…"',
      communicates: "Love is conditional and emotionally negotiated.",
      boundary: '"I\'m setting this boundary because I love you—not to control you."'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Enabling Language Translator | Sober Helpline</title>
        <meta name="description" content="Learn how to shift from emotional rescue to clear boundaries without being cold. Translate enabling phrases into recovery-supportive language." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12 max-w-4xl">
          <Link to="/family-education">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Family Education
            </Button>
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Enabling Language Translator</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              How to Shift from Emotional Rescue to Clear Boundaries—Without Being Cold
            </p>
          </div>

          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Why This Tool Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Families often ask:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground italic">
                <li>"What should I say?"</li>
                <li>"How do I say no without sounding cruel?"</li>
                <li>"I know I'm enabling—but I freeze in the moment."</li>
              </ul>
              <p className="text-muted-foreground">
                The problem is rarely lack of love or clarity. <strong className="text-foreground">It's language.</strong>
              </p>
              <p className="text-muted-foreground">
                The words families use in moments of pressure often determine whether a boundary holds—or collapses.
              </p>
              <p className="text-foreground font-medium">
                This guide helps families translate enabling language into responses that protect everyone involved.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                A Key Principle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-100/50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50">
                  <p className="font-semibold text-red-700 dark:text-red-400 mb-2">Enabling language</p>
                  <p className="text-muted-foreground text-sm">focuses on <strong className="text-foreground">relieving discomfort</strong></p>
                </div>
                <div className="p-4 rounded-lg bg-green-100/50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/50">
                  <p className="font-semibold text-green-700 dark:text-green-400 mb-2">Boundary language</p>
                  <p className="text-muted-foreground text-sm">focuses on <strong className="text-foreground">reducing harm</strong></p>
                </div>
              </div>
              <p className="text-center mt-4 text-muted-foreground">
                Both may sound compassionate—but only one supports change.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Common Enabling Phrases—and Translations</CardTitle>
              <p className="text-muted-foreground mt-2">
                Below are real phrases families use, followed by what addiction hears—and how to translate them.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {translations.map((item, index) => (
                  <div key={index} className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-red-50/50 dark:bg-red-950/20 p-4 border-b border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">Enabling Phrase</span>
                      </div>
                      <p className="text-lg font-medium text-foreground">{item.enabling}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>What It Communicates:</strong> {item.communicates}
                      </p>
                    </div>
                    <div className="bg-green-50/50 dark:bg-green-950/20 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Boundary Translation</span>
                      </div>
                      <p className="text-lg font-medium text-foreground">{item.boundary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                What Boundary Language Has in Common
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Boundary-aligned language:</p>
              <ul className="grid md:grid-cols-2 gap-2">
                {[
                  "Is calm",
                  "Is brief",
                  "Avoids justification",
                  "Avoids emotional bargaining",
                  "Focuses on your behavior",
                  "Stays the same over time"
                ].map((trait, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-muted-foreground">{trait}</span>
                  </li>
                ))}
              </ul>
              <p className="text-foreground font-medium mt-4 text-center">
                Boundaries don't persuade. They inform.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">What Makes Boundary Language So Hard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Families struggle because:</p>
              <ul className="space-y-2">
                {[
                  "Guilt shows up immediately",
                  "Silence feels cruel",
                  "Emotional pushback escalates",
                  "They fear permanent damage",
                  "They want relief"
                ].map((reason, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-muted-foreground">{reason}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <p className="text-muted-foreground">This is normal.</p>
                <p className="text-foreground font-medium mt-2">
                  The goal is not perfect language. It is consistent language.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-lg">A Simple Translation Formula</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">When unsure what to say, use this structure:</p>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                  <span className="text-foreground">Acknowledge emotion (without fixing it)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                  <span className="text-foreground">State boundary clearly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                  <span className="text-foreground">Avoid explanation or debate</span>
                </li>
              </ol>
              <div className="mt-6 p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-border">
                <p className="text-sm text-muted-foreground mb-2">Example:</p>
                <p className="text-foreground font-medium italic">
                  "I hear that you're upset. This boundary hasn't changed."
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">What to Expect After Using Boundary Language</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Expect:</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {["Pushback", "Emotional escalation", "Accusations", "Silence", "Guilt"].map((reaction, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50 text-center">
                    <span className="text-sm text-muted-foreground">{reaction}</span>
                  </div>
                ))}
              </div>
              <p className="text-foreground font-medium">
                These reactions do not mean the boundary is wrong.
              </p>
              <p className="text-muted-foreground">
                They mean the old language stopped working.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-violet-500/30 bg-violet-50/50 dark:bg-violet-950/20">
            <CardHeader>
              <CardTitle className="text-lg">Reflection Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Consider the following:</p>
              <ol className="space-y-3">
                {[
                  "Which enabling phrases do I use most often?",
                  "What emotion am I trying to relieve when I use them?",
                  "What boundary is being avoided?",
                  "Which translation feels hardest to say?",
                  "What support do I need to hold this language consistently?"
                ].map((question, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">{index + 1}</span>
                    <span className="text-foreground">{question}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">A Grounding Reframe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-foreground">
                Changing language feels cruel only because the old language protected addiction.
              </p>
              <p className="text-xl font-semibold text-primary mt-4 text-center">
                Clarity is not cruelty. It is kindness with structure.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Final Thought</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Families don't need better arguments. They need different words—used calmly and repeatedly.
              </p>
              <p className="text-muted-foreground">When language changes:</p>
              <ul className="space-y-2 ml-4">
                {[
                  "Power struggles decrease",
                  "Boundaries strengthen",
                  "Guilt loses influence",
                  "Families regain clarity"
                ].map((outcome, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-foreground">{outcome}</span>
                  </li>
                ))}
              </ul>
              <p className="text-foreground font-semibold text-center mt-4">
                What you say matters—but how consistently you say it matters more.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-slate-500/30 bg-slate-50/50 dark:bg-slate-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-600" />
                Suggested Companion Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Link to="/family-education">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Is This Help or Enabling? Decision Tree
                  </Button>
                </Link>
                <Link to="/boundary-drift">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Boundary Drift: How Limits Slowly Erode
                  </Button>
                </Link>
                <Link to="/boundaries-ultimatums">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Requests, Demands, Ultimatums & Boundaries
                  </Button>
                </Link>
                <Link to="/guilt-relief-resentment">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    The Guilt–Relief–Resentment Cycle
                  </Button>
                </Link>
                <Link to="/anger-and-boundaries">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    Anger and Boundaries Are Not the Same Thing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/family-education">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Family Education
              </Button>
            </Link>
          </div>
        
          <RelatedResources currentPath="/enabling-language-translator" />
</main>
      </div>
    </>
  );
}
