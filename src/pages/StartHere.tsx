import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Compass, HeartPulse, PhoneCall, ShieldAlert, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import FamilyProofStrip from "@/components/FamilyProofStrip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";
import { mattBrownPersonSchema } from "@/lib/mattBrownSchema";

const paths = [
  {
    icon: Users,
    label: "I need support, but I am not ready to book",
    description: "Start with the free Monday Family Squares Zoom. Bring your questions, listen, and get steadier without making a paid decision today.",
    cta: "Join Monday Zoom",
    to: "/monday-zoom-registration",
    event: "monday_zoom_click" as const,
    source: "start_here_monday",
  },
  {
    icon: PhoneCall,
    label: "I need a private plan for my family",
    description: "Book a crisis coaching session when the situation is personal, urgent, complicated, or too private for a group setting.",
    cta: "Book coaching",
    to: "/book-consultation",
    event: "coaching_click" as const,
    source: "start_here_coaching",
  },
  {
    icon: ShieldAlert,
    label: "This may be intervention-level",
    description: "Use the intervention path when safety risk, treatment refusal, overdose risk, family division, or repeated relapse is escalating.",
    cta: "Review intervention help",
    to: "/intervention-help",
    event: "intervention_readiness_click" as const,
    source: "start_here_intervention",
  },
];

const signals = [
  "You are no longer sure whether helping is actually helping.",
  "The family keeps arguing about money, housing, treatment, or consequences.",
  "Your loved one agrees to change and then backs out or disappears.",
  "You are afraid the situation is becoming unsafe.",
  "You need someone calm to help you decide the next move.",
];

export default function StartHere() {
  return (
    <>
      <SEOHead
        title="Start Here for Family Addiction Help | Sober Helpline"
        description="Not sure where to begin? Use this family addiction triage page to choose between free Monday support, private coaching, or intervention readiness help."
        faqItems={[
          {
            question: "Where should a family start when addiction is causing crisis?",
            answer: "Start with the level of support that matches the pressure you are under today: free Monday support for education and community, private coaching for a specific family plan, or intervention readiness help when risk is escalating.",
          },
          {
            question: "Do we need coaching or an intervention?",
            answer: "Coaching is usually the right first step when the family needs clarity, boundaries, and treatment guidance. Intervention readiness help is better when refusal, safety risk, overdose risk, or repeated failed treatment attempts are escalating.",
          },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Start Here for Family Addiction Help",
          url: "https://soberhelpline.com/start-here",
          description: "A family addiction triage page that routes families to free support, private coaching, or intervention readiness help.",
        }}
        personJsonLd={mattBrownPersonSchema}
      />

      <div className="min-h-screen bg-background">
        <main>
          <section className="bg-gradient-to-b from-primary/10 to-background py-14 md:py-20">
            <div className="container max-w-5xl mx-auto px-4">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  <HeartPulse className="h-4 w-4" />
                  Family addiction triage
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-normal text-logo-green">
                  Start here if your family is scared and not sure what to do next.
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  Addiction makes families feel like every option is wrong. This page helps you choose the next right level of support without having to understand the whole treatment world first.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link to="/book-consultation" onClick={() => trackConversionEvent("coaching_click", { source: "start_here_hero" })}>
                      Book private coaching
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="tel:5412415668" onClick={() => trackPhoneClick("start_here_hero")}>
                      <PhoneCall className="h-4 w-4" />
                      Call (541) 241-5668
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container max-w-5xl mx-auto px-4">
              <div className="mb-6 max-w-3xl">
                <p className="text-sm font-semibold text-primary">Choose by pressure level</p>
                <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-normal text-logo-green">
                  Which path fits today?
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {paths.map((path) => {
                  const Icon = path.icon;
                  return (
                    <Card key={path.label} className="border-primary/15">
                      <CardContent className="flex h-full flex-col p-5">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{path.label}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{path.description}</p>
                        <Button asChild className="mt-5" variant="outline">
                          <Link to={path.to} onClick={() => trackConversionEvent(path.event, { source: path.source })}>
                            {path.cta}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="bg-muted/40 py-12">
            <div className="container max-w-5xl mx-auto px-4">
              <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-logo-green">You do not have to diagnose the whole situation today.</h2>
                  <p className="mt-3 text-muted-foreground">
                    Families often wait because they are trying to pick the perfect answer. A better first move is to get enough support to stop reacting from panic.
                  </p>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground">This page is for you if:</h3>
                    <ul className="mt-4 space-y-3">
                      {signals.map((signal) => (
                        <li key={signal} className="flex gap-3 text-sm text-muted-foreground">
                          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {signal}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <FamilyProofStrip />
        </main>
      </div>
    </>
  );
}
