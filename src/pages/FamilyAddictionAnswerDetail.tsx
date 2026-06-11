import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, HelpCircle, PhoneCall, ShieldAlert } from "lucide-react";
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

const intentNotes = {
  family_squares: "This question can usually start with free live support before the family pays for private help.",
  private_coaching: "This question has enough timing or privacy pressure that a paid session may save the family from another improvised conversation.",
  intervention_readiness: "This question is close to the high-risk path. Use readiness guidance before the family waits through another dangerous cycle.",
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
          <h1 className="text-3xl font-bold text-logo-blue">Answer not found</h1>
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
  const nextQuestion = relatedAnswers[0];
  const escalationQuestion = relatedAnswers.find((related) => related.bestNextStep === "intervention_readiness") || relatedAnswers[1];
  const ctaLadder = [
    {
      rank: "1",
      label: "Join the Free Family Squares Support Meeting",
      description: "Best when the family needs a trustworthy room, live support, and a no-pressure first step.",
      href: "/family-squares",
      clickType: "family_squares",
      icon: Calendar,
    },
    {
      rank: "2",
      label: "Can't wait until Monday? Book a session and get answers now.",
      description: "Best when the next conversation, boundary, relapse response, or treatment decision needs private guidance.",
      href: "/book-consultation",
      clickType: "private_coaching",
      icon: PhoneCall,
    },
    {
      rank: "3",
      label: "Check intervention readiness",
      description: "Best when treatment is refused, risk is rising, or the family may need Freedom Interventions-level structure.",
      href: "/intervention-help",
      clickType: "intervention_readiness",
      icon: ShieldAlert,
    },
  ];

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
                <h1 className="text-4xl font-bold tracking-normal text-logo-blue md:text-5xl">{answer.question}</h1>
                <div className="aeo-short-answer mt-6 rounded-xl border border-primary/20 bg-card p-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">Direct answer</p>
                  <p className="mt-3 text-xl leading-relaxed text-foreground">{answer.shortAnswer}</p>
                </div>
              </div>

              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <p className="aeo-next-step text-sm font-semibold uppercase tracking-wide text-primary">{nextStep.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-bold text-logo-blue">{nextStep.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{nextStep.description}</p>
                  <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm leading-relaxed text-foreground">
                    {intentNotes[answer.bestNextStep]}
                  </div>
                  <Button asChild className="mt-5 w-full" size="lg">
                    <Link to={answer.nextStepHref} onClick={() => trackClick(answer.bestNextStep, answer.nextStepHref)}>
                      {answer.nextStepLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="mt-3 w-full" size="lg" variant="outline">
                    <a href="tel:4582027900" onClick={() => {
                      trackPhoneClick(`family_answer_${answer.slug}`);
                      trackClick("phone", "tel:4582027900");
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
                  <h2 className="mt-3 text-2xl font-bold text-logo-blue">The next step should match the pressure level.</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    Keep the free meeting as the soft landing, but move faster when the question is private, urgent, or intervention-level.
                  </p>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {ctaLadder.map((item) => {
                      const Icon = item.icon;
                      const isRecommended = item.clickType === answer.bestNextStep;
                      return (
                        <Link
                          key={item.rank}
                          to={item.href}
                          onClick={() => trackClick(`cta_ladder_${item.clickType}`, item.href)}
                          className={`rounded-xl border bg-background p-4 transition-colors hover:border-primary/40 ${
                            isRecommended ? "border-primary/50 shadow-sm ring-1 ring-primary/20" : "border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <Icon className="h-5 w-5 text-primary" />
                            {isRecommended && (
                              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="mt-3 text-sm font-semibold text-foreground">{item.rank}. {item.label}</p>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                          <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                            Open path
                            <ArrowRight className="h-4 w-4" />
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {(nextQuestion || escalationQuestion) && (
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">Keep the visit moving</p>
                    <h2 className="mt-2 text-2xl font-bold text-logo-blue">Answer the next likely question.</h2>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {nextQuestion && (
                        <Link
                          to={familyAddictionAnswerPath(nextQuestion)}
                          onClick={() => trackClick("next_question", familyAddictionAnswerPath(nextQuestion))}
                          className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
                        >
                          <p className="text-sm font-semibold text-primary">Next question</p>
                          <p className="mt-2 font-medium text-foreground">{nextQuestion.question}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{nextQuestion.shortAnswer}</p>
                        </Link>
                      )}
                      {escalationQuestion && escalationQuestion.slug !== nextQuestion?.slug && (
                        <Link
                          to={familyAddictionAnswerPath(escalationQuestion)}
                          onClick={() => trackClick("escalation_question", familyAddictionAnswerPath(escalationQuestion))}
                          className="rounded-xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:border-primary/40"
                        >
                          <p className="text-sm font-semibold text-primary">If risk is rising</p>
                          <p className="mt-2 font-medium text-foreground">{escalationQuestion.question}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{escalationQuestion.shortAnswer}</p>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <aside className="space-y-5">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-logo-blue">Related answers</h2>
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
