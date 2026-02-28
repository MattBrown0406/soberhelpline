import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Printer, Building2, AlertTriangle, Users, DollarSign, Shield, CheckCircle2, XCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import RelatedResources from "@/components/RelatedResources";
import FamilyBridgeCTA from "@/components/FamilyBridgeCTA";
import ToolBrandHeader from "@/components/ToolBrandHeader";

export default function TreatmentIndustryGuide() {
  useGuideTracking("/treatment-industry-guide", "How the Treatment Industry Actually Works");
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>How the Treatment Industry Actually Works | Sober Helpline</title>
        <meta name="description" content="What families need to know before making critical treatment decisions. Understanding how the addiction treatment industry operates." />
      </Helmet>

      <div className="min-h-screen bg-background">

        <main className="container py-8 md:py-12 print:py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 print:hidden">
              <Link
                to="/family-education"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
            {/* FamilyBridge CTA */}
            <div className="my-8">
              <FamilyBridgeCTA variant="post-completion" />
            </div>

                Back to Family Education
              </Link>
              <Button onClick={handlePrint} variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Print Guide
              </Button>
            </div>

            <ToolBrandHeader
              title="How the Treatment Industry Actually Works"
              subtitle="What families need to know before making critical decisions. Understanding the business of treatment so you can advocate effectively."
              clinicalNote="Based on SAMHSA industry reports, NAATP ethical guidelines, and investigative journalism on treatment industry practices."
            />

            {/* Who This Is For */}
            <Card className="mb-6 print:mb-4 print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary" />
                  Who This Is For
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">This guide is for families who are:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Overwhelmed and under time pressure</li>
                  <li>• Trying to find ethical, effective treatment</li>
                  <li>• Unsure who to trust</li>
                  <li>• Afraid of making the "wrong" decision</li>
                </ul>
                <Alert className="mt-4 border-primary/30 bg-primary/5">
                  <AlertDescription>
                    <strong>This guide is not meant to scare you.</strong> It is meant to give you clarity and leverage.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Why Families Feel Confused */}
            <Card className="mb-6 print:mb-4 print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Why Families Feel So Confused</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">Most families enter the treatment world during crisis. They are:</p>
                <ul className="space-y-1 text-muted-foreground mb-4">
                  <li>• Emotionally exhausted</li>
                  <li>• Afraid of losing their loved one</li>
                  <li>• Under pressure to act quickly</li>
                  <li>• Unfamiliar with addiction care</li>
                </ul>
                <p className="mb-3">At the same time, they are stepping into an industry that is:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Largely unregulated in marketing</li>
                  <li>• Highly competitive</li>
                  <li>• Financially complex</li>
                  <li>• Not always transparent</li>
                </ul>
                <p className="mt-4 font-medium text-foreground">
                  This combination makes families vulnerable—not because they're naïve, but because they're human.
                </p>
              </CardContent>
            </Card>

            {/* A Hard but Important Truth */}
            <Alert className="mb-6 print:mb-4 border-amber-500/50 bg-amber-50 dark:bg-amber-950/30">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong className="block mb-2">A Hard but Important Truth</strong>
                <p className="mb-2">There are many ethical, effective treatment providers doing excellent work.</p>
                <p className="mb-3">There are also parts of the industry that operate more like sales-driven businesses than healthcare systems.</p>
                <p className="font-medium">Understanding how the industry actually functions helps families:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Slow down panic-driven decisions</li>
                  <li>• Ask better questions</li>
                  <li>• Avoid inappropriate placement</li>
                  <li>• Advocate effectively</li>
                  <li>• Protect both their loved one and themselves</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* How Treatment Centers Are Funded */}
            <Card className="mb-6 print:mb-4 print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  How Treatment Centers Are Funded
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">1. Insurance-Based Programs</h4>
                  <p className="text-sm text-muted-foreground mb-2">These programs rely heavily on:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-3">
                    <li>• Insurance authorizations</li>
                    <li>• Utilization reviews</li>
                    <li>• Approved lengths of stay</li>
                  </ul>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">What families should know:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Length of stay is often influenced by insurance—not just clinical need</li>
                      <li>• Programs may discharge when coverage ends</li>
                      <li>• "Medical necessity" language matters</li>
                    </ul>
                    <p className="text-sm mt-2 italic">This does not mean care is bad—but it does mean financial forces are involved.</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">2. Private-Pay Programs</h4>
                  <p className="text-sm text-muted-foreground mb-2">These programs are funded directly by families or individuals.</p>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">What families should know:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Quality varies widely</li>
                      <li>• Higher cost does not guarantee better care</li>
                      <li>• "Luxury" does not equal "clinical depth"</li>
                    </ul>
                    <p className="text-sm mt-2">Private-pay programs should still provide clear clinical rationale, offer structured aftercare planning, and be transparent about costs and expectations.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* The Role of Admissions and Marketing */}
            <Card className="mb-6 print:mb-4 print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">The Role of Admissions and Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">This is one of the least understood—and most important—areas.</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground mb-2">Admissions Is Often a Sales Role</h4>
                  <p className="text-sm text-muted-foreground mb-2">In many organizations:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Admissions staff are not clinicians</li>
                    <li>• Their role is to fill beds</li>
                    <li>• They are trained to reduce hesitation</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    This doesn't automatically mean deception—but it does mean families must separate marketing language from clinical reality.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Red Flags in Admissions Conversations
                  </h4>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-2">Be cautious if:</p>
                  <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
                    <li>• You are pressured to decide immediately</li>
                    <li>• Your fear is emphasized ("last chance," "window closing")</li>
                    <li>• Questions are deflected</li>
                    <li>• Alternatives are discouraged</li>
                    <li>• Everything sounds "perfect"</li>
                  </ul>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-3 font-medium">
                    Ethical providers allow time, questions, and second opinions.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How Referrals Actually Work */}
            <Card className="mb-6 print:mb-4 print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">How Referrals Actually Work</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Families often assume recommendations are purely clinical. Sometimes they are. Sometimes they are not.
                </p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-foreground mb-2">Referral Relationships Can Include:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Financial incentives</li>
                    <li>• Marketing agreements</li>
                    <li>• Ownership overlap</li>
                    <li>• Informal "preferred partner" arrangements</li>
                  </ul>
                </div>

                <p className="text-sm mb-3">Ethical providers are transparent about this.</p>

                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Families should always ask:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      "Are there any financial relationships tied to this referral?"
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      "What alternatives did you consider?"
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      "Why is this level of care appropriate?"
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3 italic">
                    If a provider becomes defensive, that is information.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Placement Pressure vs. Clinical Fit */}
            <Card className="mb-6 print:mb-4 print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Placement Pressure vs. Clinical Fit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  One of the most damaging patterns in treatment is misaligned placement. This happens when:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>• Inpatient is recommended without assessment</li>
                  <li>• Mental health complexity is minimized</li>
                  <li>• Structure is removed too quickly</li>
                  <li>• Discharge happens before stability</li>
                </ul>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Clinical Fit Should Be Based On:
                    </h4>
                    <ul className="text-sm text-emerald-600 dark:text-emerald-300 space-y-1">
                      <li>• Severity and duration of use</li>
                      <li>• Co-occurring mental health conditions</li>
                      <li>• History of relapse</li>
                      <li>• Environment and support system</li>
                      <li>• Willingness to engage in structure</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Placement Should Never Be Driven Solely By:
                    </h4>
                    <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
                      <li>• Bed availability</li>
                      <li>• Insurance benefits</li>
                      <li>• Family urgency</li>
                      <li>• Convenience</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Families Are Often Told "Everything Is Going Great" */}
            <Card className="mb-6 print:mb-4 print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Why Families Are Often Told "Everything Is Going Great"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">Families frequently hear:</p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4 italic">
                  <li>"They're doing amazing."</li>
                  <li>"They're very motivated."</li>
                  <li>"No major concerns."</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  <strong>Early stabilization can look like recovery—but it is not the same thing.</strong>
                </p>

                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Families should ask:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      What behaviors have changed?
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      How are they handling discomfort?
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      What happens when structure is reduced?
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      What does accountability look like after discharge?
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3 font-medium">
                    Honest providers discuss risk, not just progress.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Discharge and Aftercare */}
            <Card className="mb-6 print:mb-4 print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Discharge and Aftercare: The Most Vulnerable Moment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>The transition out of treatment is when relapse risk increases the most.</strong>
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Common Industry Gaps:</h4>
                    <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
                      <li>• Aftercare planning is rushed</li>
                      <li>• Families are expected to "take over"</li>
                      <li>• Structure drops too quickly</li>
                      <li>• Boundaries soften out of relief</li>
                    </ul>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Ethical Programs:</h4>
                    <ul className="text-sm text-emerald-600 dark:text-emerald-300 space-y-1">
                      <li>• Plan discharge early</li>
                      <li>• Involve families</li>
                      <li>• Emphasize structure</li>
                      <li>• Coordinate outpatient care</li>
                      <li>• Prepare for relapse without normalizing it</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Families Feel Pressured to "Trust the Process" */}
            <Card className="mb-6 print:mb-4 print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Why Families Feel Pressured to "Trust the Process"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">Families are often told:</p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4 italic">
                  <li>"Just trust us."</li>
                  <li>"This is how it works."</li>
                  <li>"You're overthinking it."</li>
                </ul>
                <p className="text-foreground font-medium mb-4">
                  Trust matters—but informed trust matters more.
                </p>

                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Families are allowed to:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ask questions</li>
                    <li>• Request clarity</li>
                    <li>• Slow decisions</li>
                    <li>• Advocate for structure</li>
                    <li>• Protect boundaries</li>
                  </ul>
                  <p className="text-sm text-foreground mt-3 font-semibold">
                    You are not being difficult. You are being responsible.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What Ethical Treatment Looks Like */}
            <Card className="mb-6 print:mb-4 print:shadow-none print:border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-700 dark:text-emerald-400">
                  <Shield className="h-5 w-5" />
                  What Ethical Treatment Looks Like
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">Ethical providers:</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    Welcome informed families
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    Explain limitations honestly
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    Discuss risks openly
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    Encourage second opinions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    Separate marketing from care
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    Align treatment with aftercare
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    Respect family boundaries
                  </li>
                </ul>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-4 font-medium">
                  They do not rely on fear, urgency, or guilt.
                </p>
              </CardContent>
            </Card>

            {/* A Critical Reframe */}
            <Alert className="mb-6 print:mb-4 border-primary/30 bg-primary/5">
              <AlertDescription className="text-foreground">
                <strong className="block text-lg mb-2">A Critical Reframe for Families</strong>
                <p className="mb-2">Treatment is not a rescue mission. It is a clinical process within a business environment.</p>
                <p>That doesn't make it bad—but it does mean families must stay grounded, curious, and engaged.</p>
              </AlertDescription>
            </Alert>

            {/* What Families Can Do Differently */}
            <Card className="mb-6 print:mb-4 print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">What Families Can Do Differently</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">Families who navigate treatment well tend to:</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Slow down initial placement decisions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Ask uncomfortable questions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Document conversations
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Maintain boundaries
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Prepare for discharge early
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    Focus on long-term structure, not short-term relief
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Final Thoughts */}
            <Card className="mb-6 print:mb-4 print:shadow-none print:border bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Final Thoughts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The treatment industry can be confusing—but it doesn't have to be disempowering.
                </p>
                <p className="text-muted-foreground mb-4">Knowledge gives families:</p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li>• Confidence</li>
                  <li>• Calm</li>
                  <li>• Discernment</li>
                  <li>• Better outcomes</li>
                </ul>
                <p className="text-foreground font-medium">
                  You don't need to become an expert. You just need to understand how the system actually works—so fear doesn't make decisions for you.
                </p>
              </CardContent>
            </Card>

            {/* Companion Resources */}
            <div className="p-6 bg-muted/30 rounded-lg border print:bg-white">
              <h3 className="font-semibold text-lg text-logo-green mb-4">Suggested Companion Resources</h3>
              <div className="flex flex-wrap gap-3 print:hidden">
                <Link to="/treatment-red-flags">
                  <Button variant="outline" size="sm" className="gap-2">
                    Treatment Industry Red Flags Guide
                  </Button>
                </Link>
                <Link to="/treatment-questions">
                  <Button variant="outline" size="sm" className="gap-2">
                    Questions to Ask a Treatment Center
                  </Button>
                </Link>
                <Link to="/aftercare-checklist">
                  <Button variant="outline" size="sm" className="gap-2">
                    Aftercare Readiness Checklist
                  </Button>
                </Link>
                <Link to="/family-advocacy-toolkit">
                  <Button variant="outline" size="sm" className="gap-2">
                    Family Advocacy Toolkit
                  </Button>
                </Link>
                <Link to="/crisis-chaos">
                  <Button variant="outline" size="sm" className="gap-2">
                    Crisis vs. Chaos Decision Guide
                  </Button>
                </Link>
              </div>
              <ul className="hidden print:block text-sm text-muted-foreground space-y-1">
                <li>• Treatment Industry Red Flags Guide</li>
                <li>• Questions to Ask a Treatment Center</li>
                <li>• Aftercare Readiness Checklist</li>
                <li>• Family Advocacy Toolkit</li>
                <li>• Crisis vs. Chaos Decision Guide</li>
              </ul>
            </div>
          </div>
        
          <RelatedResources currentPath="/treatment-industry-guide" />
</main>
      </div>
    </>
  );
}
