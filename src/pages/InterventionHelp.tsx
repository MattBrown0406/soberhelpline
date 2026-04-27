import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Calendar, CheckCircle2, ExternalLink, PhoneCall, ShieldCheck, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import FamilyNextStepCTA from "@/components/FamilyNextStepCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";

const warningSigns = [
  "Your loved one refuses treatment or keeps agreeing and backing out.",
  "There is opioid, fentanyl, meth, alcohol withdrawal, psychosis, violence, or overdose risk.",
  "The family is divided, exhausted, or sending mixed messages.",
  "Previous treatment episodes ended in relapse and the pattern is escalating.",
  "You need treatment options, transport, and family preparation coordinated at the same time.",
];

const nextSteps = [
  {
    title: "Start with a readiness intensive",
    description: "A private strategy session to assess risk, align decision makers, and decide whether a formal intervention is the right path.",
    cta: "Book readiness intensive",
    to: "/book-consultation?plan=family-readiness-intensive",
  },
  {
    title: "Talk to Freedom Interventions",
    description: "For families who already know they need a professional intervention team and want to move directly into that conversation.",
    cta: "Visit Freedom Interventions",
    href: "https://freedominterventions.com",
  },
  {
    title: "Use free support while you decide",
    description: "If the situation is not immediate, join the Monday Family Squares Zoom and bring your intervention questions.",
    cta: "Register for Monday Zoom",
    to: "/monday-zoom-registration",
  },
];

export default function InterventionHelp() {
  return (
    <>
      <SEOHead
        title="Intervention Help for Families | Sober Helpline"
        description="Not sure if your family needs a professional intervention? Learn the warning signs, next steps, and how Sober Helpline connects families with Freedom Interventions."
        faqItems={[
          {
            question: "How do I know if my family needs a professional intervention?",
            answer: "A professional intervention may be appropriate when your loved one refuses treatment, risk is escalating, prior treatment attempts have failed, or the family cannot stay aligned without outside structure.",
          },
          {
            question: "Should we book coaching or contact Freedom Interventions?",
            answer: "If you are unsure, start with the Family Readiness Intensive. If your family already knows a formal intervention is needed, contact Freedom Interventions directly.",
          },
          {
            question: "Can a family intervention be done without a professional?",
            answer: "Sometimes, but it is riskier when denial, safety concerns, family conflict, or repeated relapse are present. Professional guidance helps the family prepare and stay focused.",
          },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Intervention Help for Families",
          provider: {
            "@type": "Organization",
            name: "Sober Helpline",
            url: "https://soberhelpline.com",
            sameAs: "https://freedominterventions.com",
          },
          areaServed: "US",
          serviceType: "Addiction intervention planning",
          url: "https://soberhelpline.com/intervention-help",
        }}
      />

      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12">
          <div className="mx-auto max-w-5xl">
            <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1.5 text-sm font-semibold text-violet-700 dark:text-violet-300">
                  <ShieldCheck className="h-4 w-4" />
                  Freedom Interventions bridge
                </div>
                <h1 className="text-4xl font-bold tracking-normal text-foreground md:text-5xl">
                  When family coaching is not enough, intervention planning may be the next step.
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  Some families need education and coaching. Others need a professionally led intervention process with preparation, treatment planning, and a clear ask. This page helps you sort out which path fits your situation.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" onClick={() => trackConversionEvent("intervention_readiness_click", { source: "intervention_help_hero" })}>
                    <Link to="/book-consultation?plan=family-readiness-intensive">
                      Book Readiness Intensive
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" onClick={() => trackConversionEvent("freedom_interventions_click", { source: "intervention_help_hero" })}>
                    <a href="https://freedominterventions.com" target="_blank" rel="noopener noreferrer">
                      Freedom Interventions
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <a
                  href="tel:5412415668"
                  onClick={() => trackPhoneClick("intervention_help_hero")}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call (541) 241-5668
                </a>
              </div>

              <Card className="border-violet-500/20 bg-violet-50/60 dark:bg-violet-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-1 h-5 w-5 text-violet-700 dark:text-violet-300" />
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Intervention-level warning signs</h2>
                      <ul className="mt-4 space-y-3">
                        {warningSigns.map((sign) => (
                          <li key={sign} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-700 dark:text-violet-300" />
                            {sign}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mt-10 grid gap-4 md:grid-cols-3">
              {nextSteps.map((step) => (
                <Card key={step.title} className="border-border">
                  <CardContent className="flex h-full flex-col p-5">
                    <h2 className="text-lg font-semibold text-foreground">{step.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    {"href" in step ? (
                      <Button asChild variant="outline" className="mt-4" onClick={() => trackConversionEvent("freedom_interventions_click", { source: "intervention_help_card" })}>
                        <a href={step.href} target="_blank" rel="noopener noreferrer">
                          {step.cta}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" className="mt-4" onClick={() => trackConversionEvent(step.to.includes("monday") ? "monday_zoom_click" : "intervention_readiness_click", { source: "intervention_help_card" })}>
                        <Link to={step.to}>
                          {step.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="mt-10 rounded-xl border bg-card p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-foreground">The goal is not pressure. The goal is preparation.</h2>
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    A good intervention process starts before the actual conversation. The family needs alignment, treatment options, boundaries, logistics, and a calm plan for resistance.
                  </p>
                  <p>
                    Sober Helpline is the sorting and readiness layer. Freedom Interventions is the professional intervention path when the situation calls for it.
                  </p>
                </div>
              </div>
            </section>

            <FamilyNextStepCTA className="mt-10" />
          </div>
        </main>
      </div>
    </>
  );
}
