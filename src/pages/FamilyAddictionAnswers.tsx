import { Link } from "react-router-dom";
import { ArrowRight, Calendar, ClipboardCheck, HeartPulse, PhoneCall, ShieldAlert, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import FamilyProofStrip from "@/components/FamilyProofStrip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";
import { mattBrownPersonSchema } from "@/lib/mattBrownSchema";

const answerCards = [
  {
    question: "Where should a family start when addiction is causing chaos?",
    answer:
      "Start with the least intense support that is still honest about the risk: free Family Squares for support and education, private coaching for a specific family plan, or intervention readiness if safety and refusal are escalating.",
    to: "/start-here",
    cta: "Use Start Here",
  },
  {
    question: "What is the free Monday Family Squares meeting for?",
    answer:
      "Family Squares is for parents, spouses, siblings, and loved ones who need support, education, and steadier thinking before making the next decision.",
    to: "/family-squares",
    cta: "Join Family Squares",
  },
  {
    question: "When should we book a private coaching session?",
    answer:
      "Book coaching when the situation is too personal, urgent, or complicated for a group meeting and you need a direct plan for boundaries, treatment questions, relapse, or family alignment.",
    to: "/book-consultation",
    cta: "Book a session",
  },
  {
    question: "When is this intervention-level?",
    answer:
      "It may be intervention-level when treatment is refused, overdose risk is present, the family is divided, consequences are escalating, or repeated promises keep turning into the same crisis.",
    to: "/intervention-help",
    cta: "Check readiness",
  },
];

const howToSteps = [
  {
    name: "Start with safety",
    text: "If someone is in immediate danger, call emergency services or a local crisis resource before using an educational website.",
  },
  {
    name: "Choose the pressure level",
    text: "Use free support for education, private coaching for a specific family plan, and intervention readiness when risk or refusal is escalating.",
  },
  {
    name: "Take one next step",
    text: "Register for Family Squares, book coaching, or review intervention readiness instead of trying to solve the entire addiction system in one night.",
  },
];

const faqItems = answerCards.map(({ question, answer }) => ({ question, answer }));

export default function FamilyAddictionAnswers() {
  return (
    <>
      <SEOHead
        title="Family Addiction Answers | Sober Helpline"
        description="Clear family addiction answers that route loved ones to free Family Squares support, private coaching, or intervention readiness help."
        faqItems={faqItems}
        howToSteps={howToSteps}
        howToName="How to choose the right family addiction support step"
        howToDescription="A simple decision path for families choosing between free support, private coaching, and intervention readiness."
        speakableSelectors={[".aeo-answer-summary", ".aeo-direct-answer"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Family Addiction Answers",
          url: "https://soberhelpline.com/family-addiction-answers",
          description: "A direct answer center for families dealing with addiction, boundaries, coaching decisions, and intervention readiness.",
          isPartOf: {
            "@type": "WebSite",
            name: "Sober Helpline",
            url: "https://soberhelpline.com",
          },
        }}
        personJsonLd={mattBrownPersonSchema}
      />

      <main className="min-h-screen bg-background">
        <section className="bg-gradient-to-b from-primary/10 to-background py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                <HeartPulse className="h-4 w-4" />
                Family addiction answer center
              </div>
              <h1 className="text-4xl font-bold tracking-normal text-logo-green md:text-5xl">
                Answers for families who need a next step, not more confusion.
              </h1>
              <p className="aeo-answer-summary mt-5 text-lg leading-relaxed text-muted-foreground">
                Sober Helpline routes families to three practical options: join the free Family Squares support meeting, book a private coaching session when you cannot wait, or check intervention readiness when risk is escalating.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link
                    to="/family-squares"
                    onClick={() => trackConversionEvent("monday_zoom_click", { source: "family_addiction_answers_hero" })}
                  >
                    <Calendar className="h-4 w-4" />
                    Join Family Squares
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link
                    to="/book-consultation"
                    onClick={() => trackConversionEvent("coaching_click", { source: "family_addiction_answers_hero" })}
                  >
                    Can't wait? Book now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Calendar,
                  title: "Free support",
                  body: "Start with Family Squares when you need education, support, and a place to get grounded.",
                  to: "/family-squares",
                },
                {
                  icon: PhoneCall,
                  title: "Private answers",
                  body: "Book coaching when Monday feels too far away or your family needs a direct plan.",
                  to: "/book-consultation",
                },
                {
                  icon: ShieldAlert,
                  title: "Intervention readiness",
                  body: "Review readiness when refusal, relapse, overdose risk, or family division is escalating.",
                  to: "/intervention-help",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="border-primary/15">
                    <CardContent className="flex h-full flex-col p-5">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                      <Button asChild className="mt-5" variant="outline">
                        <Link to={item.to}>
                          Open path
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
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-7 max-w-3xl">
              <p className="text-sm font-semibold text-primary">Direct answers</p>
              <h2 className="mt-1 text-2xl font-bold tracking-normal text-logo-green md:text-3xl">
                What families ask before they register, book, or check readiness
              </h2>
            </div>
            <div className="grid gap-4">
              {answerCards.map((item) => (
                <Card key={item.question}>
                  <CardContent className="p-6">
                    <h3 className="aeo-direct-answer text-xl font-semibold text-foreground">{item.question}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p>
                    <Button asChild className="mt-5" variant="outline">
                      <Link to={item.to}>
                        {item.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-sm md:p-8">
              <div className="grid gap-6 md:grid-cols-[1fr_300px] md:items-center">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-primary">
                    <ClipboardCheck className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Use the hierarchy</span>
                  </div>
                  <h2 className="text-2xl font-bold text-logo-green md:text-3xl">Free support first, private answers when needed, intervention readiness when risk is rising.</h2>
                  <p className="mt-3 text-muted-foreground">
                    That keeps the funnel honest. Families can receive help without pressure, but the site still gives urgent situations a clear path to coaching or professional intervention.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button asChild size="lg">
                    <Link to="/family-squares">
                      <Users className="h-4 w-4" />
                      Join the meeting
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="tel:5412415668" onClick={() => trackPhoneClick("family_addiction_answers_bottom")}>
                      <PhoneCall className="h-4 w-4" />
                      Call Sober Helpline
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FamilyProofStrip />
      </main>
    </>
  );
}
