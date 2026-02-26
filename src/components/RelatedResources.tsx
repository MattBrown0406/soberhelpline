import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, HelpCircle } from "lucide-react";
import { getRelatedResources, categoryColors } from "@/data/relatedResources";

interface RelatedResourcesProps {
  currentPath: string;
}

export default function RelatedResources({ currentPath }: RelatedResourcesProps) {
  const resources = getRelatedResources(currentPath);

  if (resources.length === 0) return null;

  return (
    <section className="mt-12 mb-8 print:hidden">
      <div className="border-t border-border pt-10">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          <h2 className="text-2xl font-bold text-foreground">Continue Your Learning</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.path}
              to={resource.path}
              className="group block rounded-lg border border-border bg-card p-5 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border mb-3 ${
                  categoryColors[resource.category]
                }`}
              >
                {resource.category}
              </span>
              <h3 className="font-semibold text-foreground group-hover:text-emerald-400 transition-colors mb-2">
                {resource.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {resource.description}
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                Read guide <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}

          {/* CTA Card */}
          <Link
            to="/onboarding-quiz"
            className="group block rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/5 p-5 transition-all hover:border-emerald-500/60 hover:bg-emerald-500/10"
          >
            <HelpCircle className="h-8 w-8 text-emerald-400 mb-3" />
            <h3 className="font-semibold text-foreground group-hover:text-emerald-400 transition-colors mb-2">
              Not sure where to go?
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Take our 2-minute quiz and get personalized recommendations for your situation.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
              Take the quiz <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
