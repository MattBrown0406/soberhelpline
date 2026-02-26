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
  "/why-willpower-fails": {
    path: "/why-willpower-fails",
    title: "Why Willpower Fails",
    description: "The neuroscience behind why willpower alone can't overcome addiction.",
    category: "Understanding Addiction",
  },
  "/addiction-progression-timeline": {
    path: "/addiction-progression-timeline",
    title: "Addiction Progression Timeline",
    description: "How addiction progresses through predictable stages over time.",
    category: "Understanding Addiction",
  },
  "/brain-spiritual-recovery": {
    path: "/brain-spiritual-recovery",
    title: "Brain & Spiritual Recovery",
    description: "How the brain heals and why spiritual growth supports lasting recovery.",
    category: "Understanding Addiction",
  },
  "/addiction-as-stress-disorder": {
    path: "/addiction-as-stress-disorder",
    title: "Addiction as a Stress Disorder",
    description: "Understanding addiction through the lens of chronic stress and dysregulation.",
    category: "Understanding Addiction",
  },
  "/addiction-attachment-styles": {
    path: "/addiction-attachment-styles",
    title: "Addiction & Attachment Styles",
    description: "How attachment patterns influence addiction and family relationships.",
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
  "/conversation-starters": {
    path: "/conversation-starters",
    title: "Conversation Starters",
    description: "Practical scripts for starting difficult conversations about addiction.",
    category: "Boundaries & Communication",
  },
  "/communication-guide": {
    path: "/communication-guide",
    title: "Communication Guide",
    description: "Effective communication strategies for families dealing with addiction.",
    category: "Boundaries & Communication",
  },
  "/flexibility-vs-instability": {
    path: "/flexibility-vs-instability",
    title: "Flexibility vs. Instability",
    description: "How to be flexible without creating instability in your family system.",
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
  "/enabling-language-translator": {
    path: "/enabling-language-translator",
    title: "Enabling Language Translator",
    description: "Recognize enabling language patterns and learn healthier alternatives.",
    category: "Family Dynamics",
  },
  "/cost-of-secrecy": {
    path: "/cost-of-secrecy",
    title: "The Cost of Secrecy",
    description: "How family secrets about addiction cause lasting damage to everyone.",
    category: "Family Dynamics",
  },
  "/intergenerational-enabling": {
    path: "/intergenerational-enabling",
    title: "Intergenerational Enabling",
    description: "How enabling patterns pass from one generation to the next.",
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
  "/who-benefits-filter": {
    path: "/who-benefits-filter",
    title: "The Who Benefits Filter",
    description: "A decision-making tool: is this action helping them or helping me feel better?",
    category: "Family Dynamics",
  },
  "/treatment-modalities": {
    path: "/treatment-modalities",
    title: "Treatment Modalities Explained",
    description: "A comprehensive overview of addiction treatment approaches and methods.",
    category: "Treatment & Recovery",
  },
  "/matching-modality": {
    path: "/matching-modality",
    title: "Matching the Modality",
    description: "How to match the right treatment approach to your loved one's needs.",
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
  "/treatment-industry-guide": {
    path: "/treatment-industry-guide",
    title: "Treatment Industry Guide",
    description: "How the treatment industry actually works — and what families should know.",
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
  "/therapy-timing": {
    path: "/therapy-timing",
    title: "Therapy Timing Guide",
    description: "Why some therapies fail when introduced at the wrong time in recovery.",
    category: "Treatment & Recovery",
  },
  "/recovery-requirements": {
    path: "/recovery-requirements",
    title: "What Recovery Requires",
    description: "What recovery actually requires from families — expectations vs. reality.",
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
  "/how-trauma-shapes-addiction": {
    path: "/how-trauma-shapes-addiction",
    title: "How Trauma Shapes Addiction",
    description: "The connection between trauma experiences and addiction development.",
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
  "/values-aligned-decisions": {
    path: "/values-aligned-decisions",
    title: "Values-Aligned Decisions",
    description: "Making decisions that align with your core values, not your fears.",
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
  "/misunderstood-diagnoses": {
    path: "/misunderstood-diagnoses",
    title: "Misunderstood Diagnoses",
    description: "Commonly misunderstood diagnoses in addiction and what they really mean.",
    category: "Mental Health",
  },
  "/mental-health-delays-recovery": {
    path: "/mental-health-delays-recovery",
    title: "Mental Health Delays Recovery",
    description: "Why focusing only on mental health can delay addiction recovery.",
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
  "/scenario-exercise": {
    path: "/scenario-exercise",
    title: "Scenario Exercise",
    description: "Practice responding to common addiction scenarios before they happen.",
    category: "Tools & Exercises",
  },
  "/values-exercise": {
    path: "/values-exercise",
    title: "Values Exercise",
    description: "Identify and clarify your core values to guide your decisions.",
    category: "Tools & Exercises",
  },
  "/fear-inventory-exercise": {
    path: "/fear-inventory-exercise",
    title: "Fear Inventory Exercise",
    description: "Name your fears to reduce their power over your decisions.",
    category: "Tools & Exercises",
  },
  "/insight-behavior-tracker": {
    path: "/insight-behavior-tracker",
    title: "Insight & Behavior Tracker",
    description: "Track patterns of insight and behavior change over time.",
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
  "/sibling-experience": {
    path: "/sibling-experience",
    title: "The Sibling Experience",
    description: "What it's really like to be the sibling of someone with addiction.",
    category: "Sibling & Youth",
  },
  "/growing-up-shadow": {
    path: "/growing-up-shadow",
    title: "Growing Up in the Shadow",
    description: "The unique challenges of growing up alongside a sibling's addiction.",
    category: "Sibling & Youth",
  },
  "/sibling-guilt-anger-loyalty": {
    path: "/sibling-guilt-anger-loyalty",
    title: "Sibling Guilt, Anger & Loyalty",
    description: "Navigating the complex emotions siblings face in addiction families.",
    category: "Sibling & Youth",
  },
  "/rebuilding-sibling-relationships": {
    path: "/rebuilding-sibling-relationships",
    title: "Rebuilding Sibling Relationships",
    description: "How siblings can rebuild trust and connection after addiction.",
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
  "/ai-life-coach": {
    path: "/ai-life-coach",
    title: "AI Life Coach",
    description: "AI-powered life coaching for families navigating addiction.",
    category: "AI Tools",
  },
  "/ai-enabling-decision-coach": {
    path: "/ai-enabling-decision-coach",
    title: "AI Enabling Decision Coach",
    description: "AI tool to help identify and stop enabling behaviors.",
    category: "AI Tools",
  },
  "/ai-boundary-builder-coach": {
    path: "/ai-boundary-builder-coach",
    title: "AI Boundary Builder",
    description: "AI-powered boundary building and practice tool.",
    category: "AI Tools",
  },
  "/ai-treatment-navigator": {
    path: "/ai-treatment-navigator",
    title: "AI Treatment Navigator",
    description: "AI-guided navigation through treatment options and decisions.",
    category: "AI Tools",
  },
  "/ai-relapse-response-guide": {
    path: "/ai-relapse-response-guide",
    title: "AI Relapse Response Guide",
    description: "AI-powered guidance for responding to relapse situations.",
    category: "AI Tools",
  },
  "/ai-addiction-reality-translator": {
    path: "/ai-addiction-reality-translator",
    title: "AI Addiction Reality Translator",
    description: "AI tool that translates common addiction myths into reality.",
    category: "AI Tools",
  },
};

// Related resources mapping: path -> array of related paths (3-4 per guide)
const relatedMap: Record<string, string[]> = {
  // Understanding Addiction cluster
  "/understanding-addiction": ["/disease-choice-reality-map", "/why-willpower-fails", "/addiction-progression-timeline"],
  "/disease-choice-reality-map": ["/understanding-addiction", "/why-willpower-fails", "/brain-spiritual-recovery"],
  "/why-willpower-fails": ["/understanding-addiction", "/disease-choice-reality-map", "/brain-spiritual-recovery", "/addiction-progression-timeline"],
  "/addiction-progression-timeline": ["/understanding-addiction", "/why-willpower-fails", "/relapse-warning-signs"],
  "/brain-spiritual-recovery": ["/why-willpower-fails", "/twelve-steps-explained", "/non-twelve-step-modalities", "/living-well-regardless"],
  "/addiction-as-stress-disorder": ["/how-trauma-shapes-addiction", "/understanding-addiction", "/emotional-regulation", "/addiction-attachment-styles"],
  "/addiction-attachment-styles": ["/addiction-as-stress-disorder", "/family-roles-addiction", "/how-trauma-shapes-addiction"],
  "/why-change-doesnt-happen": ["/what-changes-when-families-change", "/boundary-drift", "/enabling-language-translator", "/who-benefits-filter"],

  // Boundaries & Communication cluster
  "/boundary-drift": ["/anger-and-boundaries", "/no-negotiation", "/boundaries-ultimatums", "/flexibility-vs-instability"],
  "/anger-and-boundaries": ["/boundary-drift", "/emotional-regulation", "/no-negotiation", "/communication-guide"],
  "/no-negotiation": ["/boundary-drift", "/boundaries-ultimatums", "/anger-and-boundaries", "/crisis-chaos"],
  "/boundaries-ultimatums": ["/boundary-drift", "/no-negotiation", "/communication-guide", "/enabling-language-translator"],
  "/conversation-starters": ["/communication-guide", "/talking-about-treatment", "/boundaries-ultimatums"],
  "/communication-guide": ["/conversation-starters", "/talking-about-treatment", "/boundaries-ultimatums", "/anger-and-boundaries"],
  "/flexibility-vs-instability": ["/boundary-drift", "/family-roles-addiction", "/no-negotiation"],
  "/talking-about-treatment": ["/conversation-starters", "/communication-guide", "/treatment-modalities", "/readiness-checklist"],

  // Family Dynamics cluster
  "/family-roles-addiction": ["/addiction-rewrites-family-rules", "/enabling-language-translator", "/cost-of-secrecy", "/family-unity-liability"],
  "/enabling-language-translator": ["/who-benefits-filter", "/intergenerational-enabling", "/family-roles-addiction", "/boundaries-ultimatums"],
  "/cost-of-secrecy": ["/family-roles-addiction", "/family-unity-liability", "/safe-to-open-up"],
  "/intergenerational-enabling": ["/enabling-language-translator", "/family-roles-addiction", "/addiction-rewrites-family-rules"],
  "/addiction-rewrites-family-rules": ["/family-roles-addiction", "/cost-of-secrecy", "/what-changes-when-families-change"],
  "/family-unity-liability": ["/cost-of-secrecy", "/family-roles-addiction", "/who-benefits-filter", "/family-interference"],
  "/family-interference": ["/family-unity-liability", "/family-advocacy-toolkit", "/boundaries-ultimatums"],
  "/what-changes-when-families-change": ["/why-change-doesnt-happen", "/family-roles-addiction", "/living-well-regardless", "/values-aligned-decisions"],
  "/who-benefits-filter": ["/enabling-language-translator", "/family-unity-liability", "/boundaries-ultimatums", "/crisis-chaos"],

  // Treatment & Recovery cluster
  "/treatment-modalities": ["/matching-modality", "/twelve-steps-explained", "/non-twelve-step-modalities", "/treatment-red-flags"],
  "/matching-modality": ["/treatment-modalities", "/therapy-timing", "/treatment-questions"],
  "/treatment-red-flags": ["/treatment-industry-guide", "/treatment-questions", "/treatment-modalities"],
  "/aftercare-checklist": ["/relapse-warning-signs", "/recovery-requirements", "/treatment-modalities"],
  "/treatment-industry-guide": ["/treatment-red-flags", "/treatment-questions", "/matching-modality"],
  "/multiple-treatment-episodes": ["/treatment-modalities", "/aftercare-checklist", "/why-willpower-fails", "/matching-modality"],
  "/treatment-questions": ["/treatment-red-flags", "/treatment-industry-guide", "/matching-modality"],
  "/twelve-steps-explained": ["/non-twelve-step-modalities", "/brain-spiritual-recovery", "/treatment-modalities"],
  "/non-twelve-step-modalities": ["/twelve-steps-explained", "/treatment-modalities", "/matching-modality"],
  "/therapy-timing": ["/matching-modality", "/treatment-modalities", "/mental-health-delays-recovery"],
  "/recovery-requirements": ["/aftercare-checklist", "/what-changes-when-families-change", "/family-action-plan"],
  "/medical-detox": ["/treatment-modalities", "/treatment-questions", "/aftercare-checklist"],

  // Emotional Health cluster
  "/grief-for-family": ["/guilt-relief-resentment", "/living-well-regardless", "/strong-one", "/emotional-regulation"],
  "/guilt-relief-resentment": ["/grief-for-family", "/strong-one", "/emotional-regulation", "/who-benefits-filter"],
  "/how-trauma-shapes-addiction": ["/trauma-vs-excuses", "/addiction-as-stress-disorder", "/mental-health-vs-substance-induced"],
  "/trauma-vs-excuses": ["/how-trauma-shapes-addiction", "/boundaries-ultimatums", "/addiction-as-stress-disorder"],
  "/emotional-regulation": ["/grief-for-family", "/anger-and-boundaries", "/crisis-chaos", "/values-aligned-decisions"],
  "/living-well-regardless": ["/values-aligned-decisions", "/strong-one", "/grief-for-family", "/what-changes-when-families-change"],
  "/values-aligned-decisions": ["/values-exercise", "/living-well-regardless", "/emotional-regulation"],
  "/strong-one": ["/grief-for-family", "/guilt-relief-resentment", "/living-well-regardless", "/safe-to-open-up"],
  "/safe-to-open-up": ["/strong-one", "/cost-of-secrecy", "/grief-for-family", "/emotional-regulation"],

  // Mental Health cluster
  "/drug-induced-psychosis": ["/mental-health-vs-substance-induced", "/misunderstood-diagnoses", "/crisis-chaos"],
  "/mental-health-vs-substance-induced": ["/drug-induced-psychosis", "/misunderstood-diagnoses", "/mental-health-delays-recovery"],
  "/misunderstood-diagnoses": ["/mental-health-vs-substance-induced", "/mental-health-delays-recovery", "/drug-induced-psychosis"],
  "/mental-health-delays-recovery": ["/misunderstood-diagnoses", "/therapy-timing", "/treatment-modalities"],
  "/eating-disorders-guide": ["/mental-health-vs-substance-induced", "/misunderstood-diagnoses", "/how-trauma-shapes-addiction"],

  // Tools & Exercises cluster
  "/addiction-assessment": ["/readiness-checklist", "/family-action-plan", "/treatment-questions"],
  "/family-action-plan": ["/scenario-exercise", "/family-advocacy-toolkit", "/readiness-checklist", "/crisis-chaos"],
  "/scenario-exercise": ["/family-action-plan", "/crisis-chaos", "/conversation-starters"],
  "/values-exercise": ["/values-aligned-decisions", "/fear-inventory-exercise", "/living-well-regardless"],
  "/fear-inventory-exercise": ["/values-exercise", "/emotional-regulation", "/grief-for-family"],
  "/insight-behavior-tracker": ["/relapse-warning-signs", "/readiness-checklist", "/family-action-plan"],
  "/relapse-warning-signs": ["/aftercare-checklist", "/insight-behavior-tracker", "/crisis-chaos"],
  "/readiness-checklist": ["/addiction-assessment", "/talking-about-treatment", "/treatment-questions"],
  "/crisis-chaos": ["/emotional-regulation", "/scenario-exercise", "/family-action-plan", "/no-negotiation"],
  "/family-advocacy-toolkit": ["/treatment-questions", "/treatment-red-flags", "/family-action-plan"],
  "/legal-issues-guide": ["/family-advocacy-toolkit", "/treatment-industry-guide", "/crisis-chaos"],

  // Sibling & Youth cluster
  "/sibling-experience": ["/growing-up-shadow", "/sibling-guilt-anger-loyalty", "/sibling-support"],
  "/growing-up-shadow": ["/sibling-experience", "/sibling-guilt-anger-loyalty", "/family-roles-addiction"],
  "/sibling-guilt-anger-loyalty": ["/sibling-experience", "/rebuilding-sibling-relationships", "/guilt-relief-resentment"],
  "/rebuilding-sibling-relationships": ["/sibling-guilt-anger-loyalty", "/parents-repairing-sibling-system", "/sibling-support"],
  "/parents-repairing-sibling-system": ["/rebuilding-sibling-relationships", "/family-roles-addiction", "/sibling-experience"],
  "/sibling-support": ["/sibling-experience", "/rebuilding-sibling-relationships", "/growing-up-shadow"],

  // AI Tools cluster
  "/ai-life-coach": ["/ai-enabling-decision-coach", "/ai-boundary-builder-coach", "/values-aligned-decisions"],
  "/ai-enabling-decision-coach": ["/enabling-language-translator", "/who-benefits-filter", "/ai-boundary-builder-coach"],
  "/ai-boundary-builder-coach": ["/boundary-drift", "/boundaries-ultimatums", "/ai-enabling-decision-coach"],
  "/ai-treatment-navigator": ["/treatment-modalities", "/matching-modality", "/ai-relapse-response-guide"],
  "/ai-relapse-response-guide": ["/relapse-warning-signs", "/aftercare-checklist", "/ai-treatment-navigator"],
  "/ai-addiction-reality-translator": ["/understanding-addiction", "/disease-choice-reality-map", "/ai-life-coach"],
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
