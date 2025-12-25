import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft, Heart, Shield, CheckCircle2, AlertTriangle, Eye, Clock, HelpCircle, Users, Activity, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

export default function SafeToOpenUp() {
  return (
    <>
      <Helmet>
        <title>Is It Safe to Open Up Again? Guide for Injured Spouses | Sober Helpline</title>
        <meta name="description" content="A practical guide for injured spouses considering trust after addiction. Learn how to assess safety before reopening emotionally." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur">
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
            <Link
              to="/family-education"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Family Education
            </Link>

            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 mb-4">
                <Heart className="h-8 w-8 text-rose-600 dark:text-rose-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                Is It Safe to Open Up Again?
              </h1>
              <p className="text-xl text-muted-foreground">
                A Practical Guide for Injured Spouses Considering Trust After Addiction
              </p>
            </div>

            {/* Why This Guide Matters */}
            <Card className="mb-8 border-rose-200 dark:border-rose-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                  <HelpCircle className="h-5 w-5" />
                  Why This Guide Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Many spouses ask:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span className="italic text-foreground">"How do I know if it's safe to trust again?"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span className="italic text-foreground">"What if I open up and get hurt all over again?"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span className="italic text-foreground">"They seem different—but I've thought that before."</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 mt-1">•</span>
                    <span className="italic text-foreground">"Am I being guarded, or am I being smart?"</span>
                  </li>
                </ul>
                <p className="text-muted-foreground">These questions are not signs of bitterness or failure.</p>
                <p className="font-medium text-foreground">They are signs of earned caution.</p>
                <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-lg border border-rose-200 dark:border-rose-800 mt-4">
                  <p className="font-medium text-rose-800 dark:text-rose-300">
                    Trust after addiction is not restored by hope, time, or words.<br />
                    It is rebuilt—slowly—through consistent, observable safety.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Critical Starting Truth */}
            <Card className="mb-8 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                  A Critical Starting Truth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-foreground mb-4">
                  You are not obligated to reopen emotionally because your spouse is sober, remorseful, or doing better.
                </p>
                <p className="text-muted-foreground">
                  Sobriety creates <span className="font-medium">possibility</span>.<br />
                  It does not create <span className="font-medium">entitlement to trust</span>.
                </p>
              </CardContent>
            </Card>

            {/* What Trust Actually Is */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-logo-green">
                  <Eye className="h-5 w-5" />
                  What Trust Actually Is (And What It Is Not)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3">Trust is NOT:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span className="text-muted-foreground">Believing promises</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span className="text-muted-foreground">Feeling hopeful</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span className="text-muted-foreground">Wanting things to work</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span className="text-muted-foreground">Letting your guard down because you're tired</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span className="text-muted-foreground">Forgiving to relieve discomfort</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-3">Trust IS:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span className="text-muted-foreground">A nervous system assessment of safety</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span className="text-muted-foreground">A response to consistent behavior over time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span className="text-muted-foreground">Gradual vulnerability paired with protection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span className="text-muted-foreground">Choice—not obligation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Three Levels of Safety */}
            <Card className="mb-8 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Shield className="h-5 w-5" />
                  The Three Levels of Safety That Must Exist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">Before opening up emotionally, all three levels should be present.</p>

                {/* Behavioral Safety */}
                <div className="bg-blue-50 dark:bg-blue-950/30 p-5 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">1</span>
                    Behavioral Safety (Non-Negotiable)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">Ask yourself:</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Is substance use verifiably absent?</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Are recovery behaviors consistent (not sporadic)?</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Is accountability external (meetings, therapy, sponsors)?</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Are boundaries respected without argument?</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Are patterns changing—not just moments?</span>
                    </li>
                  </ul>
                  <div className="flex items-start gap-2 text-sm bg-red-100 dark:bg-red-950/30 p-3 rounded border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-red-700 dark:text-red-400">Red Flag:</strong> Insight without follow-through.</span>
                  </div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mt-3">
                    Words create hope. Behavior creates safety.
                  </p>
                </div>

                {/* Emotional Safety */}
                <div className="bg-purple-50 dark:bg-purple-950/30 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-sm flex items-center justify-center">2</span>
                    Emotional Safety (Often Overlooked)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">Ask yourself:</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Can they tolerate my feelings without defensiveness?</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Do they listen without correcting or minimizing?</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Can they hear impact without justifying intent?</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Do they take responsibility without shifting blame?</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Do I feel calmer or more tense after talking to them?</span>
                    </li>
                  </ul>
                  <div className="flex items-start gap-2 text-sm bg-red-100 dark:bg-red-950/30 p-3 rounded border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-red-700 dark:text-red-400">Red Flag:</strong> You leave conversations feeling confused, guilty, or doubting yourself.</span>
                  </div>
                </div>

                {/* Relational Safety */}
                <div className="bg-teal-50 dark:bg-teal-950/30 p-5 rounded-lg border border-teal-200 dark:border-teal-800">
                  <h4 className="font-semibold text-teal-700 dark:text-teal-400 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-sm flex items-center justify-center">3</span>
                    Relational Safety (The Long Game)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">Ask yourself:</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Do they accept distance without pressure?</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Do they respect my pace—even when it's slow?</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Are they patient without resentment?</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Do they understand that repair may take years?</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Are they focused on growth—not reassurance?</span>
                    </li>
                  </ul>
                  <div className="flex items-start gap-2 text-sm bg-red-100 dark:bg-red-950/30 p-3 rounded border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-red-700 dark:text-red-400">Red Flag:</strong> Urgency for closeness, forgiveness, or "moving on."</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Reframe */}
            <Card className="mb-8 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Target className="h-5 w-5" />
                  A Key Reframe for Injured Spouses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-foreground mb-2">
                  Trust is not rebuilt by opening up.
                </p>
                <p className="text-lg font-medium text-foreground">
                  Trust is rebuilt by observing consistency.
                </p>
                <p className="text-muted-foreground mt-4">
                  Opening up is a <span className="font-medium">result</span> of safety—not a requirement for it.
                </p>
              </CardContent>
            </Card>

            {/* Trust Readiness Self-Check */}
            <Card className="mb-8 border-violet-200 dark:border-violet-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-400">
                  <Activity className="h-5 w-5" />
                  The Trust Readiness Self-Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Answer honestly—no explanations required.</p>
                <p className="font-medium">When I imagine opening up emotionally:</p>
                <div className="bg-violet-50 dark:bg-violet-950/30 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-violet-400 rounded"></div>
                      <span>My body feels mostly calm</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-violet-400 rounded"></div>
                      <span>I don't feel pressure to reassure them</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-violet-400 rounded"></div>
                      <span>I don't feel rushed</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-violet-400 rounded"></div>
                      <span>I don't feel responsible for their emotions</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-violet-400 rounded"></div>
                      <span>I don't feel like I'm "risking everything"</span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  If you checked fewer than 3, more time and consistency are needed.
                </p>
                <p className="text-sm font-medium text-violet-800 dark:text-violet-300">
                  Your body often knows before your mind does.
                </p>
              </CardContent>
            </Card>

            {/* Guarded vs Unsafe */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-logo-green">
                  The Difference Between Guarded and Unsafe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3">Being guarded means:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span>You choose what to share</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span>You pace vulnerability</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span>You protect yourself intentionally</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3">Feeling unsafe means:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>You brace emotionally</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>You rehearse conversations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>You monitor reactions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>You regret opening up afterward</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-center font-medium mt-4">
                  <span className="text-emerald-700 dark:text-emerald-400">Guardedness is wisdom.</span>
                  <span className="mx-2">|</span>
                  <span className="text-red-700 dark:text-red-400">Unsafe vulnerability is self-betrayal.</span>
                </p>
              </CardContent>
            </Card>

            {/* Common Pressure */}
            <Card className="mb-8 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <Users className="h-5 w-5" />
                  Common Pressure Injured Spouses Face (And Why to Resist It)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200 dark:border-orange-800">
                    <span className="text-orange-500">•</span>
                    <span className="italic">"You have to let go of the past."</span>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200 dark:border-orange-800">
                    <span className="text-orange-500">•</span>
                    <span className="italic">"They're doing everything right."</span>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200 dark:border-orange-800">
                    <span className="text-orange-500">•</span>
                    <span className="italic">"At some point you have to trust."</span>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200 dark:border-orange-800">
                    <span className="text-orange-500">•</span>
                    <span className="italic">"You're keeping the relationship stuck."</span>
                  </div>
                </div>
                <p className="font-medium text-foreground">None of these statements measure your safety.</p>
                <p className="text-muted-foreground">Healing is not proven by how fast you soften.</p>
              </CardContent>
            </Card>

            {/* How to Test Safety */}
            <Card className="mb-8 border-sky-200 dark:border-sky-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                  <Clock className="h-5 w-5" />
                  How to Test Safety Without Over-Exposing Yourself
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Instead of full emotional disclosure, try graded trust experiments:</p>
                <div className="bg-sky-50 dark:bg-sky-950/30 p-4 rounded-lg border border-sky-200 dark:border-sky-800">
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-sm flex items-center justify-center flex-shrink-0">1</span>
                      <span>Share something mildly vulnerable</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-sm flex items-center justify-center flex-shrink-0">2</span>
                      <span>Observe response—not apology, but regulation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-sm flex items-center justify-center flex-shrink-0">3</span>
                      <span>Notice follow-through days later</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-sm flex items-center justify-center flex-shrink-0">4</span>
                      <span>See if respect remains when no reassurance is given</span>
                    </li>
                  </ol>
                </div>
                <p className="font-medium text-sky-800 dark:text-sky-300">Trust grows in increments, not leaps.</p>
              </CardContent>
            </Card>

            {/* Signs It May Be Safe vs Not Safe */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="text-emerald-700 dark:text-emerald-400 text-lg">
                    Signs It May Be Safe to Slowly Open Up
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Consistency over months, not weeks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Calm responses to discomfort</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>No pressure for reassurance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>No punishment for boundaries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Accountability without prompting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>Repair without defensiveness</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4 italic">Even then—slow is still wise.</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400 text-lg">
                    Signs It Is Not Yet Safe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Relapse minimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Emotional volatility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Guilt-based apologies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Blame disguised as vulnerability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Impatience with your healing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>"I've changed—why can't you?"</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4 italic">These are indicators to pause—not push through.</p>
                </CardContent>
              </Card>
            </div>

            {/* Grounding Truth */}
            <Card className="mb-8 border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                  <Heart className="h-5 w-5" />
                  A Grounding Truth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground">You can love someone and still protect yourself.</p>
                <p className="text-foreground">You can hope for recovery and still require proof.</p>
                <p className="text-foreground">You can forgive internally and still withhold access.</p>
                <p className="font-medium text-rose-800 dark:text-rose-300 mt-4">
                  Trust is earned in the present, not owed for the past.
                </p>
              </CardContent>
            </Card>

            {/* Reflection Questions */}
            <Card className="mb-8 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                  <HelpCircle className="h-5 w-5" />
                  Reflection Questions for Injured Spouses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded">
                    <span className="font-semibold text-indigo-600">1.</span>
                    <span>What behaviors make me feel safer—not more hopeful?</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded">
                    <span className="font-semibold text-indigo-600">2.</span>
                    <span>What happens in my body when I imagine opening up?</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded">
                    <span className="font-semibold text-indigo-600">3.</span>
                    <span>Where have I overridden my instincts before?</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded">
                    <span className="font-semibold text-indigo-600">4.</span>
                    <span>What pace protects me right now?</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded">
                    <span className="font-semibold text-indigo-600">5.</span>
                    <span>What would self-respect look like in this season?</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Final Thought */}
            <Card className="mb-8 bg-gradient-to-br from-rose-50 to-transparent dark:from-rose-950/30 dark:to-transparent border-rose-300 dark:border-rose-700">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-rose-700 dark:text-rose-400 mb-4">Final Thought</h3>
                <p className="text-foreground mb-4">
                  Rebuilding trust after addiction is not about courage.<br />
                  It is about discernment.
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-muted-foreground">You are not cold.</p>
                  <p className="text-muted-foreground">You are not closed.</p>
                  <p className="text-muted-foreground">You are not punishing.</p>
                </div>
                <p className="font-medium text-foreground mb-4">
                  You are listening to what safety requires.
                </p>
                <p className="text-lg font-semibold text-rose-700 dark:text-rose-400">
                  And that—more than anything—is how real healing begins.
                </p>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="text-logo-green">Suggested Companion Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to="/boundaries-ultimatums" className="text-primary hover:underline text-sm">
                    Requests, Demands, Ultimatums & Boundaries
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/guilt-relief-resentment" className="text-primary hover:underline text-sm">
                    The Guilt–Relief–Resentment Cycle
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/living-well-regardless" className="text-primary hover:underline text-sm">
                    Living Well Regardless of Outcome
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/insight-behavior-tracker" className="text-primary hover:underline text-sm">
                    Insight vs. Behavior Tracker
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link to="/emotional-regulation" className="text-primary hover:underline text-sm">
                    Emotional Regulation Tools
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
