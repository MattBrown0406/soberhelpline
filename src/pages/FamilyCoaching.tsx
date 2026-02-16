import { Link } from "react-router-dom";
import { Phone, ArrowLeft, ClipboardCheck, Calendar, ShieldAlert, FileText, Compass, Users, BookOpen, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import logo from "@/assets/logo.png";
import SEOHead from "@/components/SEOHead";
import EnablingBehaviorAudit from "@/components/EnablingBehaviorAudit";
import BoundaryClarityWorksheet from "@/components/BoundaryClarityWorksheet";
import CoachingIntakeAssessment from "@/components/CoachingIntakeAssessment";
import FamilyReadinessAssessment from "@/components/FamilyReadinessAssessment";

export default function FamilyCoaching() {
  return (
    <>
      <SEOHead
        title="Family Coaching & Readiness Assessment | Sober Helpline"
        description="Take the Family Readiness Assessment to understand where your family is in the parallel recovery journey. Book a coaching session for personalized guidance."
      />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
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
            {/* Navigation */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link to="/family-support" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
              <div className="flex flex-wrap gap-2">
                <Link to="/family-education">
                  <Button variant="outline" size="sm" className="gap-2 border-logo-green/50 text-logo-green hover:bg-logo-green/10">
                    <BookOpen className="h-4 w-4" />
                    Education
                  </Button>
                </Link>
                <Link to="/family-forum">
                  <Button variant="outline" size="sm" className="gap-2 border-emerald-500/50 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30">
                    <Users className="h-4 w-4" />
                    Forum
                  </Button>
                </Link>
                <Link to="/family-webinars">
                  <Button variant="outline" size="sm" className="gap-2 border-purple-500/50 text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30">
                    <Video className="h-4 w-4" />
                    Webinars
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-background to-orange-500/5 border border-amber-500/20 p-8 md:p-12 mb-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative text-center">
                <div className="flex flex-col items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Compass className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-amber-700 dark:text-amber-400">
                      Family Coaching
                    </h1>
                    <p className="text-muted-foreground">Personalized guidance for your parallel recovery journey</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 mt-6 max-w-3xl mx-auto">
                  <h2 className="text-xl md:text-2xl font-bold text-amber-700 dark:text-amber-400">
                    The Emergency Game Plan
                  </h2>
                  <span className="text-xl font-bold text-primary">— $150</span>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-3 italic">
                  You're scared, exhausted, and out of ideas. Your loved one is using again, and every conversation seems to make things worse, not better. The Emergency Game Plan session gives your family immediate, steady guidance so you don't have to figure this out alone.
                </p>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
                  In one focused 60‑minute call, we'll clarify what's really happening, identify the biggest risks right now, and map out a concrete 7–14‑day plan. You'll leave knowing what to say (and what not to say), which options make sense for treatment or next steps, and how to set boundaries you can actually keep.
                </p>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4 font-medium">
                  This is for families who can't wait weeks for help and need clear direction in the next 24 hours.
                </p>
                <div className="mt-4">
                  <Link to="/book-consultation?plan=emergency">
                    <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                      <Calendar className="h-4 w-4" />
                      Book an Emergency Session — $150
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-2 mt-8 max-w-3xl mx-auto">
                  <h2 className="text-xl md:text-2xl font-bold text-amber-700 dark:text-amber-400">
                    Family Stabilization Plan
                  </h2>
                  <span className="text-xl font-bold text-primary">— $500</span>
                </div>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-3">
                  Designed for families who feel stuck in cycles of crisis, enabling, and guilt. Across four sessions you map the family roles, set and practice new boundaries, build a relapse/overdose safety plan, and coordinate treatment or next‑step options, with email check‑ins between sessions.
                </p>
                <div className="mt-4">
                  <Link to="/book-consultation?plan=stabilization">
                    <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                      <Calendar className="h-4 w-4" />
                      Book the Stabilization Plan — $500
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Book a Session CTA */}
            <Card className="mb-8 border-2 border-amber-500/30 overflow-hidden hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
              <CardHeader className="bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-amber-700 dark:text-amber-400">Book a Coaching Session — $150</CardTitle>
                    <CardDescription>
                      Schedule a one-on-one session with one of our family recovery coaches for personalized support.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to="/book-consultation">
                  <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                    <Calendar className="h-4 w-4" />
                    Schedule a Session
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Coaching Phase Guide Table */}
            <Card className="mb-8 border-2 border-orange-500/30 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-950/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Compass className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-orange-700 dark:text-orange-400">Coaching Phase Guide</CardTitle>
                    <CardDescription>Understanding where your family is in the parallel recovery journey.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-orange-200 dark:border-orange-800/50">
                        <th className="text-left py-3 px-4 font-semibold text-orange-700 dark:text-orange-400">Phase</th>
                        <th className="text-left py-3 px-4 font-semibold text-orange-700 dark:text-orange-400">Family Experience</th>
                        <th className="text-left py-3 px-4 font-semibold text-orange-700 dark:text-orange-400">Coaching Focus</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50 bg-red-50/50 dark:bg-red-950/20">
                        <td className="py-3 px-4 font-medium text-red-700 dark:text-red-400">Stabilization</td>
                        <td className="py-3 px-4 text-muted-foreground">Panic, chaos, fear, crisis management</td>
                        <td className="py-3 px-4 text-muted-foreground">Emotional regulation, crisis boundaries</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-amber-50/50 dark:bg-amber-950/20">
                        <td className="py-3 px-4 font-medium text-amber-700 dark:text-amber-400">Transition</td>
                        <td className="py-3 px-4 text-muted-foreground">Letting go of control, guilt, resistance</td>
                        <td className="py-3 px-4 text-muted-foreground">Detachment with love, communication reset</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                        <td className="py-3 px-4 font-medium text-emerald-700 dark:text-emerald-400">Maintenance</td>
                        <td className="py-3 px-4 text-muted-foreground">Rebuilding trust slowly</td>
                        <td className="py-3 px-4 text-muted-foreground">Consistency, values alignment</td>
                      </tr>
                      <tr className="bg-blue-50/50 dark:bg-blue-950/20">
                        <td className="py-3 px-4 font-medium text-blue-700 dark:text-blue-400">Long-Term Support</td>
                        <td className="py-3 px-4 text-muted-foreground">Fear of relapse, hypervigilance</td>
                        <td className="py-3 px-4 text-muted-foreground">Sustainable independence, identity rebuilding</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Accordion type="multiple" className="space-y-4">
              {/* Intake Assessment */}
              <AccordionItem value="intake" className="border-2 border-teal-500/30 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-950/20 [&[data-state=open]>svg]:rotate-180">
                  <span className="flex items-center gap-2 text-lg font-semibold text-teal-700 dark:text-teal-400">
                    <div className="p-1.5 rounded-lg bg-teal-500/10">
                      <FileText className="h-5 w-5" />
                    </div>
                    Family Coaching Intake Assessment™
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground text-sm mb-6">
                    Complete this confidential assessment so your coach can understand where your family is in the recovery journey. Estimated time: 12–15 minutes.
                  </p>
                  <CoachingIntakeAssessment />
                </AccordionContent>
              </AccordionItem>

              {/* Family Readiness Assessment */}
              <AccordionItem value="readiness" className="border-2 border-violet-500/30 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-violet-50 to-transparent dark:from-violet-950/20 [&[data-state=open]>svg]:rotate-180">
                  <span className="flex items-center gap-2 text-lg font-semibold text-violet-700 dark:text-violet-400">
                    <div className="p-1.5 rounded-lg bg-violet-500/10">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    Family Readiness Assessment™
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground text-sm mb-6">
                    Estimated time: 7–10 minutes &bull; Understand where your family is in your parallel recovery journey.
                  </p>
                  <FamilyReadinessAssessment />
                </AccordionContent>
              </AccordionItem>

              {/* Enabling Behavior Audit */}
              <AccordionItem value="audit" className="border-2 border-rose-500/30 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-rose-50 to-transparent dark:from-rose-950/20 [&[data-state=open]>svg]:rotate-180">
                  <span className="flex items-center gap-2 text-lg font-semibold text-rose-700 dark:text-rose-400">
                    <div className="p-1.5 rounded-lg bg-rose-500/10">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    Enabling Behavior Audit™
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <EnablingBehaviorAudit />
                </AccordionContent>
              </AccordionItem>

              {/* Boundary Clarity Worksheet */}
              <AccordionItem value="boundary-worksheet" className="border-2 border-cyan-500/30 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20 [&[data-state=open]>svg]:rotate-180">
                  <span className="flex items-center gap-2 text-lg font-semibold text-cyan-700 dark:text-cyan-400">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    Boundary Clarity Worksheet™
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <BoundaryClarityWorksheet />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </main>
      </div>
    </>
  );
}
