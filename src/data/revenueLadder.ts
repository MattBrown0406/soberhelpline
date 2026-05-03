import type { LucideIcon } from "lucide-react";
import { BadgeDollarSign, Calendar, Compass, Crown, Handshake, PhoneCall } from "lucide-react";

export interface RevenueLadderStep {
  key: string;
  icon: LucideIcon;
  stage: string;
  offer: string;
  price: string;
  role: string;
  bestWhen: string;
  href: string;
  eventName:
    | "monday_zoom_click"
    | "coaching_click"
    | "intervention_readiness_click"
    | "partner_page_click";
}

export const revenueLadder: RevenueLadderStep[] = [
  {
    key: "family-squares",
    icon: Calendar,
    stage: "Trust entry",
    offer: "Family Squares",
    price: "Free",
    role: "Turns SEO traffic into a relationship and a support habit.",
    bestWhen: "A family is overwhelmed but not ready to pay or talk privately.",
    href: "/family-squares",
    eventName: "monday_zoom_click",
  },
  {
    key: "membership",
    icon: Crown,
    stage: "Retention",
    offer: "Family Membership",
    price: "$14.99/mo",
    role: "Creates recurring revenue and keeps families close between meetings.",
    bestWhen: "They want recordings, education, forum access, and ongoing tools.",
    href: "/family-membership",
    eventName: "coaching_click",
  },
  {
    key: "coaching",
    icon: PhoneCall,
    stage: "Paid first step",
    offer: "Crisis Coaching Session",
    price: "$150",
    role: "Converts urgent support into a private plan.",
    bestWhen: "They need a calm conversation about boundaries, treatment, relapse, money, or what to say next.",
    href: "/book-consultation?plan=emergency",
    eventName: "coaching_click",
  },
  {
    key: "stabilization",
    icon: Compass,
    stage: "Structured coaching",
    offer: "Family Stabilization Plan",
    price: "$500",
    role: "Expands one session into a short coaching package.",
    bestWhen: "The family needs alignment, household rules, and a practical plan over several weeks.",
    href: "/book-consultation?plan=stabilization",
    eventName: "coaching_click",
  },
  {
    key: "readiness",
    icon: BadgeDollarSign,
    stage: "High-ticket qualifier",
    offer: "Family Readiness Intensive",
    price: "$2,500",
    role: "Qualifies serious intervention situations before Freedom Interventions.",
    bestWhen: "Treatment refusal, relapse, safety, or family division may require a formal intervention.",
    href: "/family-readiness-intensive",
    eventName: "intervention_readiness_click",
  },
  {
    key: "sponsors",
    icon: Handshake,
    stage: "Audience monetization",
    offer: "Ethical sponsor/partner inventory",
    price: "Custom",
    role: "Monetizes measured, high-intent family traffic without diluting trust.",
    bestWhen: "Traffic proof and family audience quality justify sponsor conversations.",
    href: "/partner-with-sober-helpline",
    eventName: "partner_page_click",
  },
];
