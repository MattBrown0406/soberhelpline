import { Link } from "react-router-dom";
import { ArrowRight, BadgeDollarSign, BarChart3, CheckCircle2, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackConversionEvent } from "@/lib/conversionTracking";

const partnerSignals = [
  "Families arrive with active questions about treatment, boundaries, relapse, support groups, and intervention readiness.",
  "Traffic is routed from education-first properties like No More Enabling before it reaches paid decisions.",
  "Free Family Squares support remains separate from sponsor or provider promotion.",
  "Partner fit should be based on family usefulness, ethical standards, and clean measurement.",
];

const sponsorFit = [
  "Treatment-adjacent services with transparent standards",
  "Family support tools, apps, courses, and education",
  "Recovery, prevention, and aftercare resources",
  "Professional services that help families make clearer decisions",
];

export default function PartnerWithSoberHelpline() {
  return (
    <>
      <SEOHead
        title="Partner With Sober Helpline | Audience & Family Support"
        description="A quiet partner overview for ethical providers, sponsors, and recovery-aligned brands interested in Sober Helpline's family addiction support audience."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Partner With Sober Helpline",
          description: "Partner overview for ethical providers and sponsors serving families affected by addiction.",
          url: "https://soberhelpline.com/partner-with-sober-helpline",
        }}
      />

      <div className="min-h-screen bg-background">
        <main>
          <section className="border-b bg-muted/30">
            <div className="container px-4 py-10 md:py-14">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  <HeartHandshake className="h-4 w-4" />
                  Ethical partner layer
                </div>
                <h1 className="text-4xl font-bold tracking-normal text-foreground md:text-5xl">
                  Reach families at the moment they are looking for a clearer next step.
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Sober Helpline is being shaped as the live support and routing layer for families affected by addiction. The partner opportunity is not just traffic. It is high-intent family context.
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button asChild size="lg" onClick={() => trackConversionEvent("partner_page_click", { source: "partner_hero", target: "providers" })}>
                    <Link to="/for-providers">
                      Provider information
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" onClick={() => trackConversionEvent("partner_page_click", { source: "partner_hero", target: "consult" })}>
                    <Link to="/family-consultation">See family consult flow</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="container px-4 py-10 md:py-14">
            <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-5">
                  <Users className="h-6 w-6 text-primary" />
                  <h2 className="mt-4 text-xl font-semibold text-foreground">Audience intent</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Families are not casually browsing. They are trying to understand addiction, choose a support lane, and decide whether coaching, treatment, or intervention fits.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <h2 className="mt-4 text-xl font-semibold text-foreground">Family-first rules</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Partner visibility should never blur the free support meeting, crisis guidance, or family education. Trust is the asset.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <h2 className="mt-4 text-xl font-semibold text-foreground">Measurable handoffs</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    UTM links and conversion events make it possible to separate education traffic, support traffic, provider clicks, and sponsor conversations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="border-y bg-primary/5">
            <div className="container grid gap-8 px-4 py-10 md:grid-cols-[0.8fr_1.2fr] md:items-center md:py-12">
              <div>
                <BadgeDollarSign className="h-8 w-8 text-primary" />
                <h2 className="mt-4 text-3xl font-bold text-foreground">Who fits here</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  This is a credibility page for future partners, not a hard-sell ad page. The standard should stay narrow.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {sponsorFit.map((item) => (
                  <div key={item} className="rounded-lg border bg-background p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="container px-4 py-10 md:py-14">
            <div className="mx-auto max-w-5xl rounded-xl border bg-card p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Operating principles</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {partnerSignals.map((signal) => (
                  <div key={signal} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{signal}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
