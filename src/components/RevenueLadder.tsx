import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { revenueLadder } from "@/data/revenueLadder";
import { cn } from "@/lib/utils";
import { trackConversionEvent } from "@/lib/conversionTracking";

interface RevenueLadderProps {
  className?: string;
  compact?: boolean;
  source?: string;
}

export default function RevenueLadder({ className, compact = false, source = "revenue_ladder" }: RevenueLadderProps) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5 md:p-6", className)}>
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Revenue ladder</p>
        <h2 className="mt-2 text-2xl font-bold tracking-normal text-foreground md:text-3xl">
          The funnel is designed to move families from trust into the right paid next step.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Family Squares stays free and trustworthy. The business growth comes from clear routing into membership,
          coaching, readiness work, intervention, and carefully selected partner revenue.
        </p>
      </div>

      <div className={cn("mt-6 grid gap-3", compact ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-3")}>
        {revenueLadder.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.key} className="border-border/80 bg-background">
              <CardContent className="flex h-full flex-col p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {step.price}
                  </span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{step.stage}</p>
                <h3 className="mt-1 font-semibold text-foreground">{step.offer}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.role}</p>
                {!compact && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.bestWhen}</p>}
                <Button asChild variant="link" className="mt-auto h-auto justify-start p-0 pt-4">
                  <Link
                    to={step.href}
                    onClick={() => trackConversionEvent(step.eventName, { source, label: step.offer, revenueStage: step.stage })}
                  >
                    Open this path
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
