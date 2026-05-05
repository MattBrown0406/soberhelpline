import { Link } from "react-router-dom";
import { ArrowRight, Calendar, CheckCircle2, ExternalLink, PhoneCall, ShieldCheck } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import RevenueLadder from "@/components/RevenueLadder";
import FamilyNextStepCTA from "@/components/FamilyNextStepCTA";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";
import { freedomBridgeUrl } from "@/lib/freedomBridge";
import { mattBrownPersonSchema } from "@/lib/mattBrownSchema";

const decisionFilters = [
  "If the situation is mostly loneliness, confusion, or needing a place to ask questions, come back to Family Squares and consider membership.",
  "If you need a plan for one urgent family decision this week, book a private coaching session.",
  "If treatment refusal, relapse, safety risk, or family division is escalating, review the Family Readiness Intensive.",
];

export default function FamilySquaresNextStep() {
  const freedomNextStepUrl = freedomBridgeUrl({ campaign: "family_squares_next_step", content: "hero" });

  return (
    <>
      <SEOHead
        title="After Family Squares: Choose the Right Next Step | Sober Helpline"
        description="A next-step page for Family Squares attendees who need membership, private coaching, intervention readiness, or continued free support."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "After Family Squares: Choose the Right Next Step",
          url: "https://soberhelpline.com/family-squares-next-step",
          description: "A support and conversion page for families after registering for or attending Family Squares.",
        }}
        personJsonLd={mattBrownPersonSchema}
      />

      <div className="min-h-screen bg-background">
        <main>
          <section className="border-b bg-gradient-to-br from-primary/10 via-background to-logo-green/10">
            <div className="container grid gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-14">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  <Calendar className="h-4 w-4" />
                  After Family Squares
                </div>
                <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-foreground md:text-5xl">
                  If the free meeting helped, choose the support level that matches the pressure.
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Family Squares is the front door. The next step should depend on urgency, privacy, risk, and whether your family needs ongoing support or a paid plan.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" onClick={() => trackConversionEvent("coaching_click", { source: "family_squares_next_step_hero" })}>
                    <Link to="/book-consultation?plan=emergency">
                      Book private coaching
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" onClick={() => trackConversionEvent("intervention_readiness_click", { source: "family_squares_next_step_hero" })}>
                    <Link to="/family-readiness-intensive">Review readiness intensive</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" onClick={() => trackConversionEvent("freedom_interventions_click", { source: "family_squares_next_step_hero", targetHref: freedomNextStepUrl })}>
                    <a href={freedomNextStepUrl} target="_blank" rel="noopener noreferrer">
                      Talk to Freedom
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <a
                  href="tel:5412415668"
                  onClick={() => trackPhoneClick("family_squares_next_step_hero")}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call 541-241-5668
                </a>
              </div>

              <Card className="border-primary/20 bg-background/95 shadow-lg">
                <CardContent className="p-5 md:p-6">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                  <h2 className="mt-4 text-2xl font-bold text-foreground">Use this filter before spending money.</h2>
                  <div className="mt-5 space-y-4">
                    {decisionFilters.map((filter) => (
                      <div key={filter} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <p className="text-sm leading-relaxed text-muted-foreground">{filter}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="container px-4 py-10 md:py-14">
            <RevenueLadder source="family_squares_next_step" />
          </section>

          <section className="container px-4 pb-10 md:pb-14">
            <FamilyNextStepCTA
              heading="Still unsure which offer fits?"
              subheading="Start with the lowest-pressure path that still matches the risk. The goal is not to buy more help. The goal is to choose the right level of help."
            />
          </section>

          <section className="container px-4 pb-12">
            <TestimonialCarousel />
          </section>
        </main>
      </div>
    </>
  );
}
