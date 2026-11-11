export type ResourceCategory =
  | "Understanding Addiction"
  | "Boundaries & Communication"
  | "Family Dynamics"
  | "Treatment & Recovery"
  | "Emotional Health"
  | "Mental Health"
  | "Tools & Exercises"
  | "Sibling & Youth"
  | "AI Tools";

export interface RelatedResource {
  path: string;
  title: string;
  description: string;
  category: ResourceCategory;
}

// Master catalog of all guide pages
const catalog: Record<string, RelatedResource> = {
  "/understanding-addiction": {
    path: "/understanding-addiction",
    title: "Understanding Addiction",
    description: "The chronic disease model and what families need to know about addiction science.",
    category: "Understanding Addiction",
  },
  "/disease-choice-reality-map": {
    path: "/disease-choice-reality-map",
    title: "Disease vs. Choice Reality Map",
    description: "Why the disease-or-choice debate misses the point — and what actually matters.",
    category: "Understanding Addiction",
  },
  "/addiction-progression-timeline": {
    path: "/addiction-progression-timeline",
    title: "Addiction Progression Timeline",
    description: "How addiction progresses through predictable stages over time.",
    category: "Understanding Addiction",
  },
  "/addiction-as-stress-disorder": {
    path: "/addiction-as-stress-disorder",
    title: "Addiction as a Stress Disorder",
    description: "Understanding addiction through the lens of chronic stress and dysregulation.",
    category: "Understanding Addiction",
  },
  "/why-change-doesnt-happen": {
    path: "/why-change-doesnt-happen",
    title: "Why Change Doesn't Happen",
    description: "Why trying harder as a family often backfires — and what to do instead.",
    category: "Understanding Addiction",
  },
  "/boundary-drift": {
    path: "/boundary-drift",
    title: "Boundary Drift",
    description: "How limits slowly erode over time and how to recognize the pattern.",
    category: "Boundaries & Communication",
  },
  "/anger-and-boundaries": {
    path: "/anger-and-boundaries",
    title: "Anger & Boundaries",
    description: "Understanding the relationship between anger and boundary enforcement.",
    category: "Boundaries & Communication",
  },
  "/no-negotiation": {
    path: "/no-negotiation",
    title: "No Negotiation",
    description: "Why some boundaries must be non-negotiable and how to hold them.",
    category: "Boundaries & Communication",
  },
  "/boundaries-ultimatums": {
    path: "/boundaries-ultimatums",
    title: "Boundaries vs. Ultimatums",
    description: "The critical difference between healthy boundaries and empty ultimatums.",
    category: "Boundaries & Communication",
  },
  "/communication-guide": {
    path: "/communication-guide",
    title: "Communication Guide",
    description: "Effective communication strategies for families dealing with addiction.",
    category: "Boundaries & Communication",
  },
  "/talking-about-treatment": {
    path: "/talking-about-treatment",
    title: "Talking About Treatment",
    description: "How to bring up the topic of treatment with your loved one.",
    category: "Boundaries & Communication",
  },
  "/family-roles-addiction": {
    path: "/family-roles-addiction",
    title: "Family Roles in Addiction",
    description: "The roles family members unconsciously adopt when addiction is present.",
    category: "Family Dynamics",
  },
  "/addiction-rewrites-family-rules": {
    path: "/addiction-rewrites-family-rules",
    title: "Addiction Rewrites Family Rules",
    description: "How addiction gradually changes the unspoken rules in your family.",
    category: "Family Dynamics",
  },
  "/family-unity-liability": {
    path: "/family-unity-liability",
    title: "Family Unity as Liability",
    description: "When sticking together at all costs actually enables the addiction.",
    category: "Family Dynamics",
  },
  "/family-interference": {
    path: "/family-interference",
    title: "Family Interference Guide",
    description: "Understanding when family involvement helps vs. when it hinders recovery.",
    category: "Family Dynamics",
  },
  "/what-changes-when-families-change": {
    path: "/what-changes-when-families-change",
    title: "What Changes When Families Change",
    description: "The ripple effects when family members start their own recovery.",
    category: "Family Dynamics",
  },
  "/treatment-modalities": {
    path: "/treatment-modalities",
    title: "Treatment Modalities Explained",
    description: "A comprehensive overview of addiction treatment approaches and methods.",
    category: "Treatment & Recovery",
  },
  "/treatment-red-flags": {
    path: "/treatment-red-flags",
    title: "Treatment Red Flags",
    description: "Warning signs of unethical or ineffective treatment programs.",
    category: "Treatment & Recovery",
  },
  "/aftercare-checklist": {
    path: "/aftercare-checklist",
    title: "Aftercare Checklist",
    description: "Essential elements for a strong aftercare plan after treatment.",
    category: "Treatment & Recovery",
  },
  "/multiple-treatment-episodes": {
    path: "/multiple-treatment-episodes",
    title: "Multiple Treatment Episodes",
    description: "Why multiple treatment attempts don't mean failure.",
    category: "Treatment & Recovery",
  },
  "/treatment-questions": {
    path: "/treatment-questions",
    title: "Questions to Ask Treatment Centers",
    description: "The most important questions to ask when evaluating treatment programs.",
    category: "Treatment & Recovery",
  },
  "/twelve-steps-explained": {
    path: "/twelve-steps-explained",
    title: "The 12 Steps Explained",
    description: "A family-friendly guide to understanding the 12-step recovery model.",
    category: "Treatment & Recovery",
  },
  "/non-twelve-step-modalities": {
    path: "/non-twelve-step-modalities",
    title: "Non-12-Step Modalities",
    description: "Alternative recovery approaches beyond the traditional 12-step model.",
    category: "Treatment & Recovery",
  },
  "/medical-detox": {
    path: "/medical-detox",
    title: "Medical Detox",
    description: "Understanding the medical detox process and why it matters.",
    category: "Treatment & Recovery",
  },
  "/grief-for-family": {
    path: "/grief-for-family",
    title: "Grief for Families",
    description: "Understanding the unique grief families experience with a loved one's addiction.",
    category: "Emotional Health",
  },
  "/guilt-relief-resentment": {
    path: "/guilt-relief-resentment",
    title: "Guilt, Relief & Resentment Cycle",
    description: "The emotional cycle families get trapped in and how to break free.",
    category: "Emotional Health",
  },
  "/trauma-vs-excuses": {
    path: "/trauma-vs-excuses",
    title: "Trauma vs. Excuses",
    description: "A necessary distinction: acknowledging trauma without enabling avoidance.",
    category: "Emotional Health",
  },
  "/emotional-regulation": {
    path: "/emotional-regulation",
    title: "Emotional Regulation",
    description: "Tools and techniques for managing intense emotions as a family member.",
    category: "Emotional Health",
  },
  "/living-well-regardless": {
    path: "/living-well-regardless",
    title: "Living Well Regardless",
    description: "How to build a meaningful life regardless of your loved one's choices.",
    category: "Emotional Health",
  },
  "/strong-one": {
    path: "/strong-one",
    title: "The Strong One",
    description: "The hidden cost of always being the strong one in your family.",
    category: "Emotional Health",
  },
  "/safe-to-open-up": {
    path: "/safe-to-open-up",
    title: "Is It Safe to Open Up?",
    description: "A guide for injured spouses navigating trust and vulnerability.",
    category: "Emotional Health",
  },
  "/drug-induced-psychosis": {
    path: "/drug-induced-psychosis",
    title: "Drug-Induced Psychosis",
    description: "What families need to know about substance-induced psychotic episodes.",
    category: "Mental Health",
  },
  "/mental-health-vs-substance-induced": {
    path: "/mental-health-vs-substance-induced",
    title: "Mental Health vs. Substance-Induced",
    description: "How to tell the difference between mental illness and substance-induced symptoms.",
    category: "Mental Health",
  },
  "/eating-disorders-guide": {
    path: "/eating-disorders-guide",
    title: "Eating Disorders & Addiction",
    description: "Understanding the overlap between eating disorders and substance use.",
    category: "Mental Health",
  },
  "/addiction-assessment": {
    path: "/addiction-assessment",
    title: "Addiction Assessment",
    description: "A self-guided assessment tool to evaluate your loved one's situation.",
    category: "Tools & Exercises",
  },
  "/family-action-plan": {
    path: "/family-action-plan",
    title: "Family Action Plan",
    description: "Build a concrete, step-by-step action plan for your family.",
    category: "Tools & Exercises",
  },
  "/fear-inventory-exercise": {
    path: "/fear-inventory-exercise",
    title: "Fear Inventory Exercise",
    description: "Name your fears to reduce their power over your decisions.",
    category: "Tools & Exercises",
  },
  "/relapse-warning-signs": {
    path: "/relapse-warning-signs",
    title: "Relapse Warning Signs Tracker",
    description: "Identify and monitor early warning signs of potential relapse.",
    category: "Tools & Exercises",
  },
  "/readiness-checklist": {
    path: "/readiness-checklist",
    title: "Readiness for Change Checklist",
    description: "Assess your loved one's readiness for treatment and change.",
    category: "Tools & Exercises",
  },
  "/crisis-chaos": {
    path: "/crisis-chaos",
    title: "Crisis vs. Chaos",
    description: "Learn to distinguish true crisis from manufactured chaos.",
    category: "Tools & Exercises",
  },
  "/family-advocacy-toolkit": {
    path: "/family-advocacy-toolkit",
    title: "Family Advocacy Toolkit",
    description: "Tools and resources for advocating effectively within the treatment system.",
    category: "Tools & Exercises",
  },
  "/legal-issues-guide": {
    path: "/legal-issues-guide",
    title: "Legal Issues Guide",
    description: "Legal considerations families should understand when addiction is involved.",
    category: "Tools & Exercises",
  },
  "/sibling-guilt-anger-loyalty": {
    path: "/sibling-guilt-anger-loyalty",
    title: "Sibling Guilt, Anger & Loyalty",
    description: "Navigating the complex emotions siblings face in addiction families.",
    category: "Sibling & Youth",
  },
  "/parents-repairing-sibling-system": {
    path: "/parents-repairing-sibling-system",
    title: "Parents: Repairing the Sibling System",
    description: "A guide for parents on healing the sibling dynamic damaged by addiction.",
    category: "Sibling & Youth",
  },
  "/sibling-support": {
    path: "/sibling-support",
    title: "Sibling Support",
    description: "Resources and support specifically for siblings affected by addiction.",
    category: "Sibling & Youth",
  },
};

// Related resources mapping: path -> array of related paths (3-4 per guide)
const relatedMap: Record<string, string[]> = {
  // Understanding Addiction cluster
  "/understanding-addiction": ["/disease-choice-reality-map", "/addiction-progression-timeline"],
  "/disease-choice-reality-map": ["/understanding-addiction", "/twelve-steps-explained"],
  "/addiction-progression-timeline": ["/understanding-addiction", "/disease-choice-reality-map", "/relapse-warning-signs"],
  "/addiction-as-stress-disorder": ["/trauma-vs-excuses", "/understanding-addiction", "/emotional-regulation"],
  "/why-change-doesnt-happen": ["/what-changes-when-families-change", "/boundary-drift", "/communication-guide"],

  // Boundaries & Communication cluster
  "/boundary-drift": ["/anger-and-boundaries", "/no-negotiation", "/boundaries-ultimatums"],
  "/anger-and-boundaries": ["/boundary-drift", "/emotional-regulation", "/no-negotiation", "/communication-guide"],
  "/no-negotiation": ["/boundary-drift", "/boundaries-ultimatums", "/anger-and-boundaries", "/crisis-chaos"],
  "/boundaries-ultimatums": ["/boundary-drift", "/no-negotiation", "/communication-guide"],
  "/communication-guide": ["/talking-about-treatment", "/boundaries-ultimatums", "/anger-and-boundaries"],
  "/talking-about-treatment": ["/communication-guide", "/treatment-modalities", "/readiness-checklist"],

  // Family Dynamics cluster
  "/family-roles-addiction": ["/addiction-rewrites-family-rules", "/communication-guide", "/family-unity-liability"],
  "/addiction-rewrites-family-rules": ["/family-roles-addiction", "/what-changes-when-families-change"],
  "/family-unity-liability": ["/addiction-rewrites-family-rules", "/family-roles-addiction", "/family-interference"],
  "/family-interference": ["/family-unity-liability", "/family-advocacy-toolkit", "/boundaries-ultimatums"],
  "/what-changes-when-families-change": ["/why-change-doesnt-happen", "/family-roles-addiction", "/living-well-regardless", "/family-action-plan"],

  // Treatment & Recovery cluster
  "/treatment-modalities": ["/twelve-steps-explained", "/non-twelve-step-modalities", "/treatment-red-flags"],
  "/treatment-red-flags": ["/treatment-questions", "/treatment-modalities"],
  "/aftercare-checklist": ["/relapse-warning-signs", "/what-changes-when-families-change", "/treatment-modalities"],
  "/multiple-treatment-episodes": ["/treatment-modalities", "/aftercare-checklist", "/disease-choice-reality-map"],
  "/treatment-questions": ["/treatment-red-flags", "/treatment-modalities"],
  "/twelve-steps-explained": ["/non-twelve-step-modalities", "/treatment-modalities"],
  "/non-twelve-step-modalities": ["/twelve-steps-explained", "/treatment-modalities"],
  "/medical-detox": ["/treatment-modalities", "/treatment-questions", "/aftercare-checklist"],

  // Emotional Health cluster
  "/grief-for-family": ["/guilt-relief-resentment", "/living-well-regardless", "/strong-one", "/emotional-regulation"],
  "/guilt-relief-resentment": ["/grief-for-family", "/strong-one", "/emotional-regulation"],
  "/trauma-vs-excuses": ["/boundaries-ultimatums", "/addiction-as-stress-disorder"],
  "/emotional-regulation": ["/grief-for-family", "/anger-and-boundaries", "/crisis-chaos", "/family-action-plan"],
  "/living-well-regardless": ["/family-action-plan", "/strong-one", "/grief-for-family", "/what-changes-when-families-change"],
  "/strong-one": ["/grief-for-family", "/guilt-relief-resentment", "/living-well-regardless", "/safe-to-open-up"],
  "/safe-to-open-up": ["/strong-one", "/addiction-rewrites-family-rules", "/grief-for-family", "/emotional-regulation"],

  // Mental Health cluster
  "/drug-induced-psychosis": ["/mental-health-vs-substance-induced", "/crisis-chaos"],
  "/mental-health-vs-substance-induced": ["/drug-induced-psychosis"],
  "/eating-disorders-guide": ["/mental-health-vs-substance-induced", "/trauma-vs-excuses"],

  // Tools & Exercises cluster
  "/addiction-assessment": ["/readiness-checklist", "/family-action-plan", "/treatment-questions"],
  "/family-action-plan": ["/family-advocacy-toolkit", "/readiness-checklist", "/crisis-chaos"],
  "/fear-inventory-exercise": ["/family-action-plan", "/emotional-regulation", "/grief-for-family"],
  "/relapse-warning-signs": ["/aftercare-checklist", "/readiness-checklist", "/crisis-chaos"],
  "/readiness-checklist": ["/addiction-assessment", "/talking-about-treatment", "/treatment-questions"],
  "/crisis-chaos": ["/emotional-regulation", "/family-action-plan", "/no-negotiation"],
  "/family-advocacy-toolkit": ["/treatment-questions", "/treatment-red-flags", "/family-action-plan"],
  "/legal-issues-guide": ["/family-advocacy-toolkit", "/treatment-red-flags", "/crisis-chaos"],

  // Sibling & Youth cluster
  "/sibling-guilt-anger-loyalty": ["/parents-repairing-sibling-system", "/guilt-relief-resentment"],
  "/parents-repairing-sibling-system": ["/sibling-guilt-anger-loyalty", "/family-roles-addiction"],
  "/sibling-support": ["/parents-repairing-sibling-system", "/sibling-guilt-anger-loyalty", "/strong-one"],

  // AI Tools cluster
};

export function getRelatedResources(currentPath: string): RelatedResource[] {
  const paths = relatedMap[currentPath] || [];
  return paths
    .map((p) => catalog[p])
    .filter((r): r is RelatedResource => r !== undefined);
}

export const categoryColors: Record<ResourceCategory, string> = {
  "Understanding Addiction": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Boundaries & Communication": "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "Family Dynamics": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Treatment & Recovery": "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "Emotional Health": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "Mental Health": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Tools & Exercises": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Sibling & Youth": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "AI Tools": "bg-blue-500/20 text-blue-300 border-blue-500/30",
};
