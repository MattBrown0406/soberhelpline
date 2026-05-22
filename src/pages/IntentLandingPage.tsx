import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Calendar, CheckCircle2, Phone, Shield, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FamilyNextStepCTA from "@/components/FamilyNextStepCTA";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";
import { mattBrownPersonSchema } from "@/lib/mattBrownSchema";

type IntentLandingConfig = {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  serviceType: string;
  accent: string;
  fit: string[];
  outcomes: string[];
  routeNotes: string[];
};

const landingPages: IntentLandingConfig[] = [
  {
    path: "/family-addiction-consult",
    title: "Family Addiction Consult | Sober Helpline",
    description: "A private family addiction consult for parents, spouses, and loved ones who need help choosing the next right step.",
    eyebrow: "Private first step",
    h1: "A family addiction consult when one more article is not enough.",
    intro:
      "Use this page when the family needs a real conversation about what is happening, what has already failed, and which next step fits: free support, coaching, treatment direction, or intervention readiness.",
    primaryCta: "Book a crisis family consult",
    primaryHref: "/book-consultation?utm_source=soberhelpline&utm_medium=intent_page&utm_campaign=family_addiction_consult",
    secondaryCta: "Start with Family Squares",
    secondaryHref: "/family-squares",
    serviceType: "Family addiction consultation",
    accent: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40",
    fit: [
      "You are unsure whether the next step is boundaries, treatment, coaching, or intervention.",
      "Your family keeps talking in circles and needs outside perspective.",
      "Money, housing, lying, relapse, or treatment refusal has made the situation hard to read.",
    ],
    outcomes: [
      "A clearer read on the family pattern.",
      "One or two specific next moves instead of a dozen vague ideas.",
      "A route into free support, paid coaching, or intervention planning if needed.",
    ],
    routeNotes: [
      "This is the right landing page for general No More Enabling readers who need a private next step.",
      "It does not change or replace the free Family Squares registration.",
      "It keeps the consultation path separate from the Monday Zoom path.",
    ],
  },
  {
    path: "/intervention-readiness-consult",
    title: "Intervention Readiness Consult | Sober Helpline",
    description: "A private consult for families deciding whether treatment refusal, relapse, or escalating risk may require professional intervention planning.",
    eyebrow: "Intervention readiness",
    h1: "Find out whether your family is intervention-ready before the next confrontation.",
    intro:
      "When refusal, relapse, safety concerns, or family division are escalating, the family needs preparation before pressure. This consult helps decide whether a professionally led intervention path makes sense.",
    primaryCta: "Book readiness consult",
    primaryHref: "/book-consultation?plan=family-readiness-intensive&utm_source=soberhelpline&utm_medium=intent_page&utm_campaign=intervention_readiness",
    secondaryCta: "Review intervention warning signs",
    secondaryHref: "/intervention-help",
    serviceType: "Intervention readiness consultation",
    accent: "bg-violet-50 border-violet-200 dark:bg-violet-950/20 dark:border-violet-900/40",
    fit: [
      "Treatment keeps getting refused, delayed, or promised and abandoned.",
      "Overdose risk, withdrawal, psychosis, violence, or severe consequences are being minimized.",
      "The family is divided and another emotional talk may make things worse.",
    ],
    outcomes: [
      "A clearer sense of whether this is coaching-level or intervention-level.",
      "A family alignment plan before making a direct ask.",
      "A safer bridge toward Freedom Interventions if formal intervention is appropriate.",
    ],
    routeNotes: [
      "This page is for higher-risk traffic from treatment refusal and intervention articles.",
      "It points into existing booking and intervention-help routes.",
      "No Zoom registration logic is involved.",
    ],
  },
  {
    path: "/addiction-family-coaching",
    title: "Family Addiction Coaching for Parents, Spouses, and Siblings",
    description: "Private family addiction coaching for parents, spouses, and siblings who need help with boundaries, relapse, lying, treatment decisions, and family alignment.",
    eyebrow: "Ongoing family support",
    h1: "Family addiction coaching when you need more than another argument.",
    intro:
      "If the same crisis keeps repeating around lying, relapse, money, treatment refusal, or broken boundaries, coaching gives the family structure, language, and follow-through. The goal is not to control the addicted person. The goal is to help the family stop improvising under pressure.",
    primaryCta: "Book family coaching",
    primaryHref: "/family-consultation?utm_source=soberhelpline&utm_medium=intent_page&utm_campaign=family_coaching",
    secondaryCta: "Join free Monday support",
    secondaryHref: "/family-squares",
    serviceType: "Addiction family coaching",
    accent: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40",
    fit: [
      "You know the pattern but cannot hold the boundary when guilt or fear spikes.",
      "Lying, relapse, early recovery, or aftercare is pulling the family back into old roles.",
      "Parents, spouses, partners, or siblings need to get on the same page before the next conversation.",
    ],
    outcomes: [
      "Clearer language for hard conversations.",
      "Better family alignment around money, housing, boundaries, and treatment.",
      "A repeatable plan for responding without rescuing or escalating.",
    ],
    routeNotes: [
      "This page is for coaching-intent traffic that is not necessarily intervention-level.",
      "It keeps free Family Squares visible as the low-pressure option.",
      "It routes paid interest through existing consultation pages.",
    ],
  },
];

const getConfigForPath = (pathname: string) =>
  landingPages.find((page) => page.path === pathname) ?? landingPages[0];

export default function IntentLandingPage() {
  const location = useLocation();
  const config = getConfigForPath(location.pathname);

  return (
    <>
      <SEOHead
        title={config.title}
        description={config.description}
        faqItems={[
          {
            question: `Who is ${config.serviceType.toLowerCase()} for?`,
            answer: config.fit.join(" "),
          },
          {
            question: "Does this replace the free Family Squares meeting?",
            answer: "No. Family Squares remains the free Monday support meeting. These pages are for families who need private guidance or a more structured next step.",
          },
          {
            question: "What happens after I choose this path?",
            answer: config.outcomes.join(" "),
          },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: config.serviceType,
          provider: {
            "@type": "Organization",
            name: "Sober Helpline",
            url: "https://soberhelpline.com",
            telephone: "+1-458-202-7900",
          },
          areaServed: "US",
          serviceType: config.serviceType,
          url: `https://soberhelpline.com${config.path}`,
        }}
        personJsonLd={mattBrownPersonSchema}
      />

      <div className="min-h-screen bg-background">
        <main>
          <section className={`border-b ${config.accent}`}>
            <div className="container grid gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-14">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-sm font-semibold text-primary">
                  <Shield className="h-4 w-4" />
                  {config.eyebrow}
                </div>
                <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-foreground md:text-5xl">
                  {config.h1}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{config.intro}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" onClick={() => trackConversionEvent("coaching_click", { source: config.path })}>
                    <Link to={config.primaryHref}>
                      {config.primaryCta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" onClick={() => trackConversionEvent("monday_zoom_click", { source: config.path })}>
                    <Link to={config.secondaryHref}>
                      {config.secondaryCta}
                    </Link>
                  </Button>
                </div>
                <a
                  href="tel:4582027900"
                  onClick={() => trackPhoneClick(config.path)}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  Call 458-202-7900
                </a>
              </div>

              <Card className="border-primary/20 bg-background/95 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">Best fit when</p>
                  <div className="mt-4 space-y-4">
                    {config.fit.map((item) => (
                      <div key={item} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="container px-4 py-10 md:py-14">
            <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-5">
                  <Users className="h-6 w-6 text-primary" />
                  <h2 className="mt-4 text-xl font-semibold text-foreground">What you leave with</h2>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {config.outcomes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <Calendar className="h-6 w-6 text-primary" />
                  <h2 className="mt-4 text-xl font-semibold text-foreground">Keep the free lane open</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    If you are not ready for a private consult, Family Squares remains the free Monday support room. It is a lower-pressure way to ask questions and hear how other families are thinking through similar patterns.
                  </p>
                  <Button asChild variant="outline" className="mt-5" onClick={() => trackConversionEvent("monday_zoom_click", { source: `${config.path}_free_lane` })}>
                    <Link to="/family-squares">Register for Family Squares</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="mt-4 text-xl font-semibold text-foreground">Routing notes</h2>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {config.routeNotes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="container px-4 pb-12">
            <FamilyNextStepCTA
              heading="Not sure which lane fits?"
              subheading="Use the free meeting, private consult, or intervention readiness page based on risk and urgency. The goal is to choose the right amount of support, not to overreact or underreact."
            />
          </section>
        </main>
      </div>
    </>
  );
}
