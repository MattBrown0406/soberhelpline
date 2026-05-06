import { Link } from "react-router-dom";
import { ArrowRight, Compass, PhoneCall, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";

type FamilyNextStepCTAProps = {
  className?: string;
  heading?: string;
  subheading?: string;
};

const paths = [
  {
    icon: PhoneCall,
    eyebrow: "Private guidance",
    title: "Book family coaching",
    description: "For families who need a calm, specific plan around boundaries, treatment options, money, relapse, or what to say next.",
    cta: "Book a coaching session",
    to: "/book-consultation?plan=emergency",
    eventName: "coaching_click" as const,
    tone: "border-amber-500/30 bg-amber-50/70 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300",
  },
  {
    icon: Users,
    eyebrow: "Free weekly support",
    title: "Join Monday Family Squares",
    description: "A free Monday night Zoom for families who want support, education, and a steadier way to respond this week.",
    cta: "Register for Monday Zoom",
    to: "/family-squares",
    eventName: "monday_zoom_click" as const,
    tone: "border-blue-500/30 bg-blue-50/70 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300",
  },
  {
    icon: Compass,
    eyebrow: "Intervention readiness",
    title: "Talk through intervention options",
    description: "For higher-risk situations where your family may need a professionally guided intervention through Freedom Interventions.",
    cta: "Start intervention planning",
    to: "/intervention-help",
    eventName: "intervention_readiness_click" as const,
    tone: "border-violet-500/30 bg-violet-50/70 text-violet-700 dark:bg-violet-950/20 dark:text-violet-300",
  },
];

export default function FamilyNextStepCTA({
  className,
  heading = "Choose the next right step for your family",
  subheading = "Families usually need one of three paths: private coaching, free Monday support, or intervention planning. Start with the option that fits the pressure you are under today.",
}: FamilyNextStepCTAProps) {
  return (
    <section className={cn("rounded-xl border bg-card p-5 md:p-6", className)} aria-labelledby="family-next-step-heading">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Not sure where to start?</p>
          <h2 id="family-next-step-heading" className="mt-1 text-2xl font-bold tracking-normal text-foreground">
            {heading}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subheading}</p>
        </div>
        <a href="tel:5412415668" onClick={() => trackPhoneClick("family_next_step_cta")} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline shrink-0">
          <PhoneCall className="h-4 w-4" />
          Call (541) 241-5668
        </a>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {paths.map((path) => {
          const Icon = path.icon;
          return (
            <Link
              key={path.title}
              to={path.to}
              onClick={() => trackConversionEvent(path.eventName, { source: "family_next_step_cta", label: path.title })}
              className={cn("group rounded-lg border p-4 transition-colors hover:border-primary hover:bg-muted/30 overflow-hidden", path.tone)}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background/80">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{path.eyebrow}</p>
                  <h3 className="mt-1 font-semibold text-foreground">{path.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{path.description}</p>
                  <Button variant="link" className="mt-2 h-auto p-0 text-current">
                    {path.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
