import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { familyAddictionAnswerPath, getFamilyAddictionAnswer } from "@/data/familyAddictionAnswers";
import { trackConversionEvent } from "@/lib/conversionTracking";

const featuredQuestionSlugs = [
  "where-should-family-start-addiction-chaos",
  "what-is-family-squares-meeting",
  "what-if-we-cannot-wait-until-monday",
  "when-is-addiction-intervention-level",
  "should-we-stop-giving-money-addiction",
  "what-should-family-do-after-relapse",
];

interface CommonFamilyQuestionsProps {
  source: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export default function CommonFamilyQuestions({
  source,
  eyebrow = "Common family questions",
  title = "Get a direct answer, then choose the right next step.",
  description = "These short answers help families move toward free Family Squares support, private coaching, or intervention readiness without getting lost in another search spiral.",
}: CommonFamilyQuestionsProps) {
  const questions = featuredQuestionSlugs
    .map((slug) => getFamilyAddictionAnswer(slug))
    .filter(Boolean);

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
              <HelpCircle className="h-4 w-4" />
              {eyebrow}
            </div>
            <h2 className="text-2xl font-bold tracking-normal text-logo-green md:text-3xl">{title}</h2>
            <p className="mt-3 text-muted-foreground">{description}</p>
          </div>
          <Button asChild variant="outline">
            <Link
              to="/family-addiction-answers"
              onClick={() => trackConversionEvent("family_answer_hub_click", {
                source,
                answer_slug: "answer_hub",
                targetHref: "/family-addiction-answers",
              })}
            >
              View all answers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {questions.map((answer) => {
            if (!answer) return null;
            const path = familyAddictionAnswerPath(answer);

            return (
              <Link
                key={answer.slug}
                to={path}
                onClick={() => trackConversionEvent("family_answer_hub_click", {
                  source,
                  answer_slug: answer.slug,
                  answer_category: answer.category,
                  targetHref: path,
                })}
                className="group h-full"
              >
                <Card className="h-full border-primary/15 transition-all group-hover:border-primary/40 group-hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-5">
                    <p className="text-sm font-semibold text-primary">{answer.category}</p>
                    <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground">{answer.question}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{answer.shortAnswer}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-logo-green">
                      Read answer
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
