import { Link } from "react-router-dom";
import { ArrowRight, Calendar, ExternalLink, PhoneCall, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackConversionEvent } from "@/lib/conversionTracking";
import { freedomBridgeUrl } from "@/lib/freedomBridge";

type FamilyFunnelDecisionMatrixProps = {
  source: string;
  className?: string;
};

const lanes = [
  {
    icon: Calendar,
    eyebrow: "Start here when it can wait",
    title: "Free Family Squares support",
    description: "Use the free Monday meeting when your family needs education, perspective, and a lower-pressure place to ask questions.",
    cta: "Join the free meeting",
    to: "/family-squares",
    eventName: "monday_zoom_click" as const,
  },
  {
    icon: PhoneCall,
    eyebrow: "Use this when Monday is too far away",
    title: "Private coaching or consult",
    description: "Book a session when you need direct answers about boundaries, treatment options, relapse, money, housing, or what to say next.",
    cta: "Book private help",
    to: "/family-consultation",
    eventName: "coaching_click" as const,
  },
  {
    icon: ShieldAlert,
    eyebrow: "Use this when risk is rising",
    title: "Freedom Interventions path",
    description: "Move to Freedom when treatment is being refused, the family is divided, relapse keeps repeating, or safety concerns are escalating.",
    cta: "Talk to Freedom",
    href: freedomBridgeUrl({ campaign: "sober_helpline_decision_matrix", content: "high_risk_path" }),
    eventName: "freedom_interventions_click" as const,
  },
];

export default function FamilyFunnelDecisionMatrix({ source, className = "" }: FamilyFunnelDecisionMatrixProps) {
  return (
    <section className={`container mx-auto px-4 py-10 md:py-14 ${className}`}>
      <div className="mx-auto max-w-6xl rounded-2xl border border-logo-green/20 bg-card p-5 shadow-sm md:p-7">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-logo-blue">Choose by pressure level</p>
          <h2 className="mt-2 text-2xl font-bold tracking-normal text-foreground md:text-3xl">
            Free support, private answers, or intervention help?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Sober Helpline should keep the free meeting trustworthy while making the next paid or high-risk path obvious. Families can start gently, move faster, or go straight to Freedom Interventions when the situation has crossed the line.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {lanes.map((lane) => {
            const Icon = lane.icon;
            const card = (
              <div className="flex h-full flex-col rounded-xl border bg-background p-5 transition-colors hover:border-logo-green/40">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-logo-blue/10 text-logo-blue">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lane.eyebrow}</p>
                <h3 className="mt-1 text-xl font-semibold text-foreground">{lane.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{lane.description}</p>
                <Button variant="link" className="mt-3 h-auto justify-start p-0 text-logo-blue">
                  {lane.cta}
                  {"href" in lane ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            );

            if ("href" in lane) {
              return (
                <a
                  key={lane.title}
                  href={lane.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackConversionEvent(lane.eventName, { source, targetHref: lane.href })}
                  className="block h-full"
                >
                  {card}
                </a>
              );
            }

            return (
              <Link key={lane.title} to={lane.to} onClick={() => trackConversionEvent(lane.eventName, { source })} className="block h-full">
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
