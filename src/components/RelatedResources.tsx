import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, HelpCircle } from "lucide-react";
import { getRelatedResources, categoryColors } from "@/data/relatedResources";
import GuideReflection from "@/components/GuideReflection";

interface RelatedResourcesProps {
  currentPath: string;
}

export default function RelatedResources({ currentPath }: RelatedResourcesProps) {
  const resources = getRelatedResources(currentPath);

  if (resources.length === 0) return <GuideReflection path={currentPath} />;

  return (
    <>
    <GuideReflection path={currentPath} />
    <section className="mt-12 mb-8 print:hidden">
      <div className="border-t border-border pt-10">
        <div className="flex items-center gap-2 mb-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16294a]/10 text-[#16294a] dark:bg-sky-400/15 dark:text-sky-200" aria-hidden="true">
            <BookOpen className="h-5 w-5" />
          </span>
          <h2 className="text-2xl font-bold text-foreground">Continue Your Learning</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.path}
              to={resource.path}
              className="group block rounded-2xl border border-border/70 bg-card p-5 shadow-sm shadow-slate-900/[0.04] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none"
            >
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border mb-3 ${
                  categoryColors[resource.category]
                }`}
              >
                {resource.category}
              </span>
              <h3 className="mb-2 font-semibold leading-snug text-foreground">
                {resource.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {resource.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Read guide <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}

          {/* CTA Card */}
          <Link
            to="/onboarding-quiz"
            className="group block rounded-2xl border border-dashed border-[#e8a73a]/60 bg-[#e8a73a]/[0.08] p-5 transition-all hover:-translate-y-0.5 hover:bg-[#e8a73a]/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none"
          >
            <HelpCircle className="mb-3 h-8 w-8 text-amber-700 dark:text-amber-300" />
            <h3 className="mb-2 font-semibold leading-snug text-foreground">
              Not sure where to go?
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Take our 2-minute quiz and get personalized recommendations for your situation.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Take the quiz <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </section>
    </>
  );
}
