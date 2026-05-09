import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, HelpCircle, PhoneCall, ShieldAlert } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import FamilyProofStrip from "@/components/FamilyProofStrip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";
import { mattBrownPersonSchema } from "@/lib/mattBrownSchema";
import {
  familyAddictionAnswerPath,
  getFamilyAddictionAnswer,
  getRelatedFamilyAddictionAnswers,
} from "@/data/familyAddictionAnswers";

const nextStepLabels = {
  family_squares: {
    eyebrow: "Best first step",
    title: "Join the free Family Squares meeting",
    description: "Use free support first when the family needs grounding, education, and a room that understands.",
  },
  private_coaching: {
    eyebrow: "Can't wait until Monday?",
    title: "Book a private session",
    description: "Use private coaching when the question is urgent, personal, or needs a direct plan now.",
  },
  intervention_readiness: {
    eyebrow: "Risk is rising",
    title: "Check intervention readiness",
    description: "Use this when treatment refusal, relapse, safety, or family division may require professional intervention planning.",
  },
};

export default function FamilyAddictionAnswerDetail() {
  const { answerSlug } = useParams<{ answerSlug: string }>();
  const answer = getFamilyAddictionAnswer(answerSlug);

  useEffect(() => {
    if (!answer) return;
    trackConversionEvent("family_answer_view", {
      source: "family_answer_detail",
      answer_slug: answer.slug,
      answer_category: answer.category,
      path: familyAddictionAnswerPath(answer),
    });
  }, [answer]);

  if (!answer) {
    return (
      <main className="min-h-screen bg-background py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-3xl font-bold text-logo-green">Answer not found</h1>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/family-addiction-answers">
              <ArrowLeft className="h-4 w-4" />
              Back to family addiction answers
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const canonicalPath = familyAddictionAnswerPath(answer);
  const canonicalUrl = `https://soberhelpline.com${canonicalPath}`;
  const relatedAnswers = getRelatedFamilyAddictionAnswers(answer);
  const nextStep = nextStepLabels[answer.bestNextStep];

  const trackClick = (clickType: string, targetHref: string) => {
    trackConversionEvent("family_answer_click", {
      source: "family_answer_detail",
      answer_slug: answer.slug,
      answer_category: answer.category,
      click_type: clickType,
      targetHref,
      path: canonicalPath,
    });
  };

  return (
    <>
      <SEOHead
        title={`${answer.question} | Sober Helpline`}
        description={answer.shortAnswer}
        faqItems={[{ question: answer.question, answer: answer.shortAnswer }]}
        speakableSelectors={[".aeo-short-answer", ".aeo-next-step"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "QAPage",
          mainEntity: {
            "@type": "Question",
            name: answer.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: answer.shortAnswer,
            },
          },
          url: canonicalUrl,
        }}
        personJsonLd={mattBrownPersonSchema}
      />

      <main className="min-h-screen bg-background">
        <section className="border-b border-border bg-gradient-to-b from-primary/10 to-background py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <Link to="/family-addiction-answers" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to family addiction answers
            </Link>
            <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  <HelpCircle className="h-4 w-4" />
                  {answer.category}
                </div>
                <h1 className="text-4xl font-bold tracking-normal text-logo-green md:text-5xl">{answer.question}</h1>
                <div className="aeo-short-answer mt-6 rounded-xl border border-primary/20 bg-card p-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">Direct answer</p>
                  <p className="mt-3 text-xl leading-relaxed text-foreground">{answer.shortAnswer}</p>
                </div>
              </div>

              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <p className="aeo-next-step text-sm font-semibold uppercase tracking-wide text-primary">{nextStep.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-bold text-logo-green">{nextStep.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{nextStep.description}</p>
                  <Button asChild className="mt-5 w-full" size="lg">
                    <Link to={answer.nextStepHref} onClick={() => trackClick(answer.bestNextStep, answer.nextStepHref)}>
                      {answer.nextStepLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="mt-3 w-full" size="lg" variant="outline">
                    <a href="tel:5412415668" onClick={() => {
                      trackPhoneClick(`family_answer_${answer.slug}`);
                      trackClick("phone", "tel:5412415668");
                    }}>
                      <PhoneCall className="h-4 w-4" />
                      Call Sober Helpline
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">What this means</p>
                  <div className="mt-4 space-y-5 text-lg leading-relaxed text-muted-foreground">
                    {answer.deeperAnswer.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-2 text-primary">
                    <ShieldAlert className="h-5 w-5" />
                    <p className="text-sm font-semibold uppercase tracking-wide">Use the Sober Helpline hierarchy</p>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {[
                      { label: "1. Free support", href: "/family-squares", cta: "Join Family Squares", icon: Calendar },
                      { label: "2. Private answers now", href: "/book-consultation", cta: "Book a session", icon: PhoneCall },
                      { label: "3. Intervention readiness", href: "/intervention-help", cta: "Check readiness", icon: CheckCircle2 },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => trackClick(item.label, item.href)}
                          className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
                        >
                          <Icon className="h-5 w-5 text-primary" />
                          <p className="mt-3 text-sm font-semibold text-foreground">{item.label}</p>
                          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                            {item.cta}
                            <ArrowRight className="h-4 w-4" />
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-5">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-logo-green">Related answers</h2>
                  <div className="mt-4 space-y-3">
                    {relatedAnswers.map((related) => (
                      <Link
                        key={related.slug}
                        to={familyAddictionAnswerPath(related)}
                        onClick={() => trackClick("related_answer", familyAddictionAnswerPath(related))}
                        className="block rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
                      >
                        <p className="text-sm font-semibold text-primary">{related.category}</p>
                        <p className="mt-1 font-medium text-foreground">{related.question}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{related.shortAnswer}</p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>

        <FamilyProofStrip />
      </main>
    </>
  );
}
