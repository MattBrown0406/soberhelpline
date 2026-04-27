import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trackConversionEvent } from "@/lib/conversionTracking";

const outcomes = [
  {
    icon: ShieldCheck,
    title: "A calmer read on the situation",
    description: "Families leave with a clearer sense of what is urgent, what is enabling, and what can wait until the next right step is chosen.",
  },
  {
    icon: Users,
    title: "More alignment before hard conversations",
    description: "Coaching helps parents, spouses, siblings, and extended family stop sending mixed messages and start working from the same page.",
  },
  {
    icon: HeartHandshake,
    title: "A path that fits the level of risk",
    description: "Some families need Monday support. Some need private coaching. Others need intervention readiness planning with Freedom Interventions.",
  },
];

export default function FamilyProofStrip() {
  return (
    <section className="py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-semibold text-primary">What families are looking for</p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-normal text-logo-green">
            Support that turns panic into a next step
          </h2>
          <p className="mt-3 text-muted-foreground">
            Families usually arrive tired, scared, and unsure whether they are helping or enabling. The goal is not to pressure anyone. The goal is to help the family get steady enough to make one clear move.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {outcomes.map((outcome) => {
            const Icon = outcome.icon;
            return (
              <Card key={outcome.title} className="border-primary/15">
                <CardContent className="p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground">{outcome.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{outcome.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border bg-muted/30 p-5 md:flex md:items-center md:justify-between md:gap-6">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              If your family is unsure whether this is a coaching issue, a Monday support issue, or an intervention issue, start with the path that matches the pressure you are under today.
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row md:mt-0">
            <Button asChild variant="secondary">
              <Link to="/start-here">
                Start here
              </Link>
            </Button>
            <Button asChild>
              <Link to="/book-consultation" onClick={() => trackConversionEvent("coaching_click", { source: "family_proof_strip" })}>
                Book coaching
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/intervention-help" onClick={() => trackConversionEvent("intervention_readiness_click", { source: "family_proof_strip" })}>
                Intervention help
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
