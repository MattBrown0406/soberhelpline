import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { familyAddictionAnswerPath, getFamilyAddictionAnswer } from "@/data/familyAddictionAnswers";
import { trackConversionEvent } from "@/lib/conversionTracking";

type BlogLikePost = {
  slug?: string;
  title?: string;
  category?: string;
  excerpt?: string;
};

const rules = [
  {
    terms: ["intervention", "readiness", "refused", "refuses", "denial"],
    slugs: ["when-is-addiction-intervention-level", "what-if-loved-one-refuses-treatment", "where-should-family-start-addiction-chaos"],
  },
  {
    terms: ["relapse", "aftercare", "early recovery", "warning"],
    slugs: ["what-should-family-do-after-relapse", "when-book-private-family-coaching", "what-if-we-cannot-wait-until-monday"],
  },
  {
    terms: ["enabling", "boundary", "boundaries", "money", "detach"],
    slugs: ["should-we-stop-giving-money-addiction", "how-do-we-set-boundaries-with-adult-child", "what-if-loved-one-refuses-treatment"],
  },
  {
    terms: ["treatment", "rehab", "detox", "insurance", "level of care"],
    slugs: ["where-should-family-start-addiction-chaos", "when-book-private-family-coaching", "when-is-addiction-intervention-level"],
  },
  {
    terms: ["family", "support", "confusion", "chaos", "help"],
    slugs: ["what-is-family-squares-meeting", "what-question-should-i-ask-family-squares", "when-should-family-call-sober-helpline"],
  },
];

const fallbackSlugs = [
  "where-should-family-start-addiction-chaos",
  "what-is-family-squares-meeting",
  "what-if-we-cannot-wait-until-monday",
];

const unique = (values: string[]) => [...new Set(values)];

export default function RelatedFamilyAnswerLinks({ post }: { post: BlogLikePost }) {
  const answers = useMemo(() => {
    const haystack = `${post.slug || ""} ${post.title || ""} ${post.category || ""} ${post.excerpt || ""}`.toLowerCase();
    const matchedSlugs = rules
      .filter((rule) => rule.terms.some((term) => haystack.includes(term)))
      .flatMap((rule) => rule.slugs);

    return unique([...matchedSlugs, ...fallbackSlugs])
      .slice(0, 3)
      .map((slug) => getFamilyAddictionAnswer(slug))
      .filter(Boolean);
  }, [post]);

  if (answers.length === 0) return null;

  return (
    <aside className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-primary">
        <HelpCircle className="h-5 w-5" />
        <h2 className="text-lg font-bold text-foreground">Related family questions</h2>
      </div>
      <div className="grid gap-3">
        {answers.map((answer) => {
          if (!answer) return null;
          const path = familyAddictionAnswerPath(answer);

          return (
            <Link
              key={answer.slug}
              to={path}
              onClick={() => trackConversionEvent("family_answer_hub_click", {
                source: "blog_related_family_answers",
                answer_slug: answer.slug,
                answer_category: answer.category,
                blog_slug: post.slug,
                targetHref: path,
              })}
              className="group block"
            >
              <Card className="border-border bg-background/90 transition-colors group-hover:border-primary/40">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">{answer.category}</p>
                  <p className="mt-1 font-semibold leading-snug text-foreground">{answer.question}</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-logo-green">
                    Read the direct answer
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
