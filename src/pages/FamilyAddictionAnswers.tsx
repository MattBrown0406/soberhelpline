import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, ClipboardCheck, HeartPulse, PhoneCall, Search, ShieldAlert, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import FamilyProofStrip from "@/components/FamilyProofStrip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";
import { mattBrownPersonSchema } from "@/lib/mattBrownSchema";
import { familyAddictionAnswers, familyAddictionAnswerPath } from "@/data/familyAddictionAnswers";

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

const faqItems = familyAddictionAnswers.slice(0, 8).map(({ question, shortAnswer }) => ({ question, answer: shortAnswer }));

export default function FamilyAddictionAnswers() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const featuredAnswers = familyAddictionAnswers.slice(0, 4);
  const categories = useMemo(() => ["All", ...Array.from(new Set(familyAddictionAnswers.map((answer) => answer.category)))], []);
  const filteredAnswers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return familyAddictionAnswers.filter((answer) => {
      const matchesCategory = activeCategory === "All" || answer.category === activeCategory;
      const searchableText = [
        answer.question,
        answer.shortAnswer,
        answer.category,
        answer.bestNextStep,
        ...answer.keywords,
      ].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);
  const groupedAnswers = filteredAnswers.reduce<Record<string, typeof familyAddictionAnswers>>((acc, answer) => {
    acc[answer.category] = [...(acc[answer.category] || []), answer];
    return acc;
  }, {});

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
              <h1 className="text-4xl font-bold tracking-normal text-logo-blue md:text-5xl">
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
              <h2 className="mt-1 text-2xl font-bold tracking-normal text-logo-blue md:text-3xl">
                What families ask before they register, book, or check readiness
              </h2>
            </div>
            <div className="grid gap-4">
              {featuredAnswers.map((item) => (
                <Card key={item.slug}>
                  <CardContent className="p-6">
                    <h3 className="aeo-direct-answer text-xl font-semibold text-foreground">{item.question}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{item.shortAnswer}</p>
                    <Button asChild className="mt-5" variant="outline">
                      <Link
                        to={familyAddictionAnswerPath(item)}
                        onClick={() => trackConversionEvent("family_answer_hub_click", {
                          source: "family_addiction_answers_featured",
                          answer_slug: item.slug,
                          targetHref: familyAddictionAnswerPath(item),
                        })}
                      >
                        Read the full answer
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
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-7 max-w-3xl">
              <p className="text-sm font-semibold text-primary">Answer library</p>
              <h2 className="mt-1 text-2xl font-bold tracking-normal text-logo-blue md:text-3xl">
                Short answers that route families to the right next step
              </h2>
              <p className="mt-3 text-muted-foreground">
                These pages are built for answer engines and real families: free support first, private help when needed, intervention readiness when risk is rising.
              </p>
            </div>
            <div className="mb-6 rounded-xl border border-primary/15 bg-card p-4">
              <label htmlFor="family-answer-search" className="text-sm font-semibold text-foreground">
                Ask the family question
              </label>
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  id="family-answer-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search relapse, spouse, intervention, money, treatment, adult child..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeCategory === category
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {filteredAnswers.length === 0 ? (
                <Card className="md:col-span-2">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground">No exact match yet</h3>
                    <p className="mt-2 text-muted-foreground">
                      Try a simpler phrase like relapse, money, spouse, treatment, intervention, or adult child.
                    </p>
                  </CardContent>
                </Card>
              ) : Object.entries(groupedAnswers).map(([category, answers]) => (
                <Card key={category} className="border-primary/15">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground">{category}</h3>
                    <div className="mt-4 space-y-3">
                      {answers.map((answer) => (
                        <Link
                          key={answer.slug}
                          to={familyAddictionAnswerPath(answer)}
                          onClick={() => trackConversionEvent("family_answer_hub_click", {
                            source: "family_addiction_answers_library",
                            answer_slug: answer.slug,
                            targetHref: familyAddictionAnswerPath(answer),
                          })}
                          className="block rounded-lg border border-border bg-background p-4 transition-colors hover:border-primary/40"
                        >
                          <p className="font-medium text-foreground">{answer.question}</p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer.shortAnswer}</p>
                        </Link>
                      ))}
                    </div>
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
                  <h2 className="text-2xl font-bold text-logo-blue md:text-3xl">Free support first, private answers when needed, intervention readiness when risk is rising.</h2>
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
                    <a href="tel:4582027900" onClick={() => trackPhoneClick("family_addiction_answers_bottom")}>
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
