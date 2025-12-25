import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Printer, Heart, Brain, Shield, Eye, AlertTriangle, HelpCircle, CheckCircle, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

export default function GrowingUpShadowAddiction() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Growing Up in the Shadow of Addiction | Sober Helpline</title>
        <meta name="description" content="How childhood adaptation shapes adult life—and how to reclaim yourself. A guide for adults who grew up in families affected by addiction." />
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
                Back to Family Education
              </Link>
              <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                Print Guide
              </Button>
            </div>

            <div className="text-center mb-8">
              <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                Growing Up in the Shadow of Addiction
              </h1>
              <p className="text-xl text-muted-foreground">
                How Childhood Adaptation Shapes Adult Life—and How to Reclaim Yourself
              </p>
            </div>

            {/* Why This Guide Matters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Heart className="h-5 w-5" />
                  Why This Guide Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Many adults raised in families affected by addiction say things like:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="italic text-muted-foreground">"It wasn't that bad."</p>
                  <p className="italic text-muted-foreground">"Other people had it worse."</p>
                  <p className="italic text-muted-foreground">"We survived."</p>
                  <p className="italic text-muted-foreground">"I turned out fine."</p>
                </div>
                <p className="text-muted-foreground mt-4">And yet, they struggle with:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Anxiety or numbness</li>
                  <li>Over-responsibility</li>
                  <li>Difficulty trusting</li>
                  <li>Trouble resting</li>
                  <li>Guilt when prioritizing themselves</li>
                  <li>Feeling unseen even in healthy relationships</li>
                </ul>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mt-4">
                  <p className="text-amber-900 dark:text-amber-100 font-medium">
                    These struggles don't mean weakness.<br />
                    They mean <strong>you adapted to survive</strong>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* A Core Truth */}
            <Card className="mb-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Eye className="h-5 w-5" />
                  A Core Truth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-medium text-lg">
                  Growing up around addiction doesn't just affect what you experienced.<br />
                  It shapes <strong>how your nervous system learned to stay safe</strong>.
                </p>
                <p className="text-muted-foreground mt-4 text-center italic">
                  You may not remember chaos—but your body does.
                </p>
              </CardContent>
            </Card>

            {/* How Children Adapt */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Brain className="h-5 w-5" />
                  How Children Adapt in Addicted Homes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Children don't have power.<br />
                  They have <strong>perception and adaptation</strong>.
                </p>
                <p className="text-muted-foreground mt-4">Common adaptations include:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Staying alert to mood shifts</li>
                  <li>Minimizing needs</li>
                  <li>Becoming self-sufficient early</li>
                  <li>Avoiding conflict</li>
                  <li>Managing adults' emotions</li>
                  <li>Staying invisible or overperforming</li>
                </ul>
                <p className="text-muted-foreground font-medium mt-4">
                  These strategies help children survive uncertainty.<br />
                  They are not chosen—they are learned.
                </p>
              </CardContent>
            </Card>

            {/* The Invisible Rules */}
            <Card className="mb-6 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <AlertTriangle className="h-5 w-5" />
                  The Invisible Rules of Addicted Homes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Many people raised around addiction absorbed unspoken rules:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <span className="px-3 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-lg text-center text-sm font-medium">Don't talk about it</span>
                  <span className="px-3 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-lg text-center text-sm font-medium">Don't feel too much</span>
                  <span className="px-3 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-lg text-center text-sm font-medium">Don't need too much</span>
                  <span className="px-3 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-lg text-center text-sm font-medium">Don't make it worse</span>
                  <span className="px-3 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-lg text-center text-sm font-medium">Stay strong</span>
                  <span className="px-3 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 rounded-lg text-center text-sm font-medium">Stay quiet</span>
                </div>
                <p className="text-muted-foreground font-medium mt-4">
                  These rules often follow people into adulthood—long after they're needed.
                </p>
              </CardContent>
            </Card>

            {/* Common Adult Patterns */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Brain className="h-5 w-5" />
                  Common Adult Patterns Linked to Childhood Addiction Exposure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">1. Hyper-Responsibility</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                    <li>Feeling responsible for others' emotions</li>
                    <li>Difficulty letting go of control</li>
                    <li>Guilt when resting</li>
                  </ul>
                </div>

                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">2. Hypervigilance</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                    <li>Always scanning for problems</li>
                    <li>Difficulty relaxing</li>
                    <li>Calm feels unfamiliar or unsafe</li>
                  </ul>
                </div>

                <div className="border-l-4 border-gray-500 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">3. Emotional Minimization</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                    <li>Downplaying your own pain</li>
                    <li>Intellectualizing feelings</li>
                    <li>Avoiding vulnerability</li>
                  </ul>
                </div>

                <div className="border-l-4 border-rose-500 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">4. Relationship Confusion</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                    <li>Attracted to intensity</li>
                    <li>Discomfort with consistency</li>
                    <li>Fear of abandonment or engulfment</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">5. Difficulty Trusting Safety</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                    <li>Expecting things to fall apart</li>
                    <li>Preparing for the worst</li>
                    <li>Struggling to believe stability will last</li>
                  </ul>
                </div>

                <p className="text-muted-foreground font-medium text-center mt-4">
                  These patterns are not flaws.<br />
                  They are <strong>leftover survival skills</strong>.
                </p>
              </CardContent>
            </Card>

            {/* Why Minimization Is Common */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Eye className="h-5 w-5" />
                  Why "It Wasn't That Bad" Is So Common
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground font-medium">Minimization protected you as a child:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>It reduced emotional overwhelm</li>
                  <li>It helped you function</li>
                  <li>It preserved attachment</li>
                </ul>
                <p className="text-muted-foreground font-medium mt-4">As an adult, minimization can:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Delay healing</li>
                  <li>Block self-compassion</li>
                  <li>Make support feel unnecessary or indulgent</li>
                </ul>
                <div className="bg-primary/10 p-4 rounded-lg mt-4">
                  <p className="text-foreground font-medium text-center">
                    You don't need trauma to justify healing.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Grief You May Not Recognize */}
            <Card className="mb-6 border-rose-200 dark:border-rose-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                  <Heart className="h-5 w-5" />
                  Grief You May Not Recognize
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Many adults raised around addiction grieve:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>The childhood they didn't get</li>
                  <li>The safety they never felt</li>
                  <li>The attention that went elsewhere</li>
                  <li>The emotional attunement that was missing</li>
                </ul>
                <p className="text-muted-foreground font-medium mt-4">
                  This grief is often quiet and unacknowledged—but real.
                </p>
              </CardContent>
            </Card>

            {/* Healing Is Not Blaming */}
            <Card className="mb-6 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Shield className="h-5 w-5" />
                  Healing Is Not Blaming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-2">Healing does NOT require:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Villainizing parents</li>
                      <li>• Reliving everything</li>
                      <li>• Assigning fault</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Healing means:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Naming impact</li>
                      <li>• Updating outdated survival strategies</li>
                      <li>• Building safety in the present</li>
                      <li>• Allowing yourself to receive care now</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What Healing Looks Like */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Leaf className="h-5 w-5" />
                  What Healing Looks Like in Adulthood
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Healing often involves:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Learning to rest without guilt</li>
                  <li>Saying no without over-explaining</li>
                  <li>Allowing emotions to exist without fixing them</li>
                  <li>Letting others be responsible for themselves</li>
                  <li>Building relationships that feel calm—not chaotic</li>
                  <li>Redefining strength to include softness</li>
                </ul>
              </CardContent>
            </Card>

            {/* A Grounding Reframe */}
            <Card className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-300 dark:border-emerald-700">
              <CardContent className="pt-6">
                <p className="text-lg text-emerald-900 dark:text-emerald-100 font-medium text-center">
                  You didn't fail to have a "normal" childhood.<br />
                  You had a different one—and adapted brilliantly.
                </p>
                <p className="text-center text-emerald-800 dark:text-emerald-200 mt-4 font-medium">
                  Now you get to choose what you keep.
                </p>
              </CardContent>
            </Card>

            {/* Reflection Questions */}
            <Card className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <HelpCircle className="h-5 w-5" />
                  Reflection Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What did I learn to do to stay safe?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    Which of those strategies no longer serve me?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What does safety feel like in my body today?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What do I need more of now?
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    What would it mean to live without constant readiness?
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-6 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <CheckCircle className="h-5 w-5" />
                  Final Thought
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Growing up in the shadow of addiction shapes people quietly and deeply.
                </p>
                <p className="text-muted-foreground">
                  You may have survived without obvious scars—but survival came at a cost.
                </p>
                <p className="text-muted-foreground">
                  Healing is not about fixing what's broken.<br />
                  It's about <strong>reclaiming parts of yourself you never got to use</strong>.
                </p>
                <div className="bg-primary/10 p-4 rounded-lg mt-4">
                  <p className="text-foreground font-medium text-center">
                    You don't need to earn rest, care, or stability.<br />
                    You are allowed to build a life that feels safe now.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-logo-green">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/sibling-experience">
                    <Button variant="outline" size="sm">The Sibling Experience in Addiction</Button>
                  </Link>
                  <Link to="/strong-one">
                    <Button variant="outline" size="sm">The Hidden Cost of Being the "Strong One"</Button>
                  </Link>
                  <Link to="/living-well-regardless">
                    <Button variant="outline" size="sm">Living Well Regardless of Outcome</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
