export interface BreadcrumbItem {
  label: string;
  path: string;
}

const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  // Family Education guides
  "/family-education": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
  ],
  "/family-education/tracks": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Guided Tracks", path: "/family-education/tracks" },
  ],
  "/understanding-addiction": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Understanding Addiction", path: "/understanding-addiction" },
  ],
  "/why-change-doesnt-happen": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Why Change Doesn't Happen", path: "/why-change-doesnt-happen" },
  ],
  "/treatment-industry-guide": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Treatment Industry Guide", path: "/treatment-industry-guide" },
  ],
  "/drug-induced-psychosis": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Drug-Induced Psychosis", path: "/drug-induced-psychosis" },
  ],
  "/multiple-treatment-episodes": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Multiple Treatment Episodes", path: "/multiple-treatment-episodes" },
  ],
  "/legal-issues-guide": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Legal Issues Guide", path: "/legal-issues-guide" },
  ],
  "/disease-choice-reality-map": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Disease vs. Choice", path: "/disease-choice-reality-map" },
  ],
  "/why-willpower-fails": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Why Willpower Fails", path: "/why-willpower-fails" },
  ],
  "/addiction-progression-timeline": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Addiction Progression Timeline", path: "/addiction-progression-timeline" },
  ],
  "/mental-health-vs-substance-induced": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Mental Health vs. Substance-Induced", path: "/mental-health-vs-substance-induced" },
  ],
  "/misunderstood-diagnoses": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Misunderstood Diagnoses", path: "/misunderstood-diagnoses" },
  ],
  "/mental-health-delays-recovery": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Mental Health Delays Recovery", path: "/mental-health-delays-recovery" },
  ],
  "/trauma-vs-excuses": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Trauma vs. Excuses", path: "/trauma-vs-excuses" },
  ],
  "/how-trauma-shapes-addiction": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "How Trauma Shapes Addiction", path: "/how-trauma-shapes-addiction" },
  ],
  "/treatment-modalities": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Treatment Modalities", path: "/treatment-modalities" },
  ],
  "/matching-modality": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Matching Modality", path: "/matching-modality" },
  ],
  "/therapy-timing": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Therapy Timing", path: "/therapy-timing" },
  ],
  "/family-interference": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Family Interference", path: "/family-interference" },
  ],
  "/boundaries-ultimatums": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Boundaries & Ultimatums", path: "/boundaries-ultimatums" },
  ],
  "/what-changes-when-families-change": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "What Changes When Families Change", path: "/what-changes-when-families-change" },
  ],
  "/brain-spiritual-recovery": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Brain & Spiritual Recovery", path: "/brain-spiritual-recovery" },
  ],
  "/twelve-steps-explained": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "12 Steps Explained", path: "/twelve-steps-explained" },
  ],
  "/non-twelve-step-modalities": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Non-12-Step Modalities", path: "/non-twelve-step-modalities" },
  ],
  "/no-negotiation": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "No Negotiation", path: "/no-negotiation" },
  ],
  "/strong-one": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "The Strong One", path: "/strong-one" },
  ],
  "/guilt-relief-resentment": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Guilt-Relief-Resentment Cycle", path: "/guilt-relief-resentment" },
  ],
  "/family-roles-addiction": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Family Roles in Addiction", path: "/family-roles-addiction" },
  ],
  "/addiction-rewrites-family-rules": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Addiction Rewrites Family Rules", path: "/addiction-rewrites-family-rules" },
  ],
  "/cost-of-secrecy": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Cost of Secrecy", path: "/cost-of-secrecy" },
  ],
  "/boundary-drift": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Boundary Drift", path: "/boundary-drift" },
  ],
  "/anger-and-boundaries": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Anger & Boundaries", path: "/anger-and-boundaries" },
  ],
  "/flexibility-vs-instability": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Flexibility vs. Instability", path: "/flexibility-vs-instability" },
  ],
  "/addiction-attachment-styles": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Addiction & Attachment Styles", path: "/addiction-attachment-styles" },
  ],
  "/grief-for-family": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Grief for Family", path: "/grief-for-family" },
  ],
  "/enabling-language-translator": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Enabling Language Translator", path: "/enabling-language-translator" },
  ],
  "/intergenerational-enabling": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Intergenerational Enabling", path: "/intergenerational-enabling" },
  ],
  "/who-benefits-filter": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Who Benefits Filter", path: "/who-benefits-filter" },
  ],
  "/family-unity-liability": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Family Unity vs. Liability", path: "/family-unity-liability" },
  ],
  "/safe-to-open-up": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Safe to Open Up", path: "/safe-to-open-up" },
  ],
  "/addiction-as-stress-disorder": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Addiction as Stress Disorder", path: "/addiction-as-stress-disorder" },
  ],
  "/eating-disorders-guide": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Eating Disorders Guide", path: "/eating-disorders-guide" },
  ],
  "/conversation-starters": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Conversation Starters", path: "/conversation-starters" },
  ],
  "/living-well-regardless": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Living Well Regardless", path: "/living-well-regardless" },
  ],

  // Sibling guides (under Family Education)
  "/sibling-experience": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "The Sibling Experience", path: "/sibling-experience" },
  ],
  "/growing-up-shadow": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Growing Up in the Shadow", path: "/growing-up-shadow" },
  ],
  "/sibling-guilt-anger-loyalty": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Sibling Guilt, Anger & Loyalty", path: "/sibling-guilt-anger-loyalty" },
  ],
  "/rebuilding-sibling-relationships": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Rebuilding Sibling Relationships", path: "/rebuilding-sibling-relationships" },
  ],
  "/parents-repairing-sibling-system": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Parents Repairing the Sibling System", path: "/parents-repairing-sibling-system" },
  ],
  "/sibling-support": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Sibling Support", path: "/sibling-support" },
  ],

  // Provider Directory
  "/provider-info": [
    { label: "Home", path: "/" },
    { label: "Provider Directory", path: "/provider-info" },
  ],
  "/inpatient-treatment": [
    { label: "Home", path: "/" },
    { label: "Provider Directory", path: "/provider-info" },
    { label: "Inpatient Treatment", path: "/inpatient-treatment" },
  ],
  "/outpatient-treatment": [
    { label: "Home", path: "/" },
    { label: "Provider Directory", path: "/provider-info" },
    { label: "Outpatient Treatment", path: "/outpatient-treatment" },
  ],
  "/medical-detox": [
    { label: "Home", path: "/" },
    { label: "Provider Directory", path: "/provider-info" },
    { label: "Medical Detox", path: "/medical-detox" },
  ],
  "/interventionists": [
    { label: "Home", path: "/" },
    { label: "Provider Directory", path: "/provider-info" },
    { label: "Interventionists", path: "/interventionists" },
  ],
  "/sober-coaches-companions": [
    { label: "Home", path: "/" },
    { label: "Provider Directory", path: "/provider-info" },
    { label: "Sober Coaches & Companions", path: "/sober-coaches-companions" },
  ],
  "/sober-living": [
    { label: "Home", path: "/" },
    { label: "Provider Directory", path: "/provider-info" },
    { label: "Sober Living", path: "/sober-living" },
  ],
  "/therapists": [
    { label: "Home", path: "/" },
    { label: "Provider Directory", path: "/provider-info" },
    { label: "Therapists", path: "/therapists" },
  ],
  "/psychiatrists": [
    { label: "Home", path: "/" },
    { label: "Provider Directory", path: "/provider-info" },
    { label: "Psychiatrists", path: "/psychiatrists" },
  ],

  // AI Coaching Tools
  "/ai-life-coach": [
    { label: "Home", path: "/" },
    { label: "AI Coaching Tools", path: "/family-education" },
    { label: "AI Life Coach", path: "/ai-life-coach" },
  ],
  "/ai-enabling-decision-coach": [
    { label: "Home", path: "/" },
    { label: "AI Coaching Tools", path: "/family-education" },
    { label: "Enabling Decision Coach", path: "/ai-enabling-decision-coach" },
  ],
  "/ai-boundary-builder-coach": [
    { label: "Home", path: "/" },
    { label: "AI Coaching Tools", path: "/family-education" },
    { label: "Boundary Builder Coach", path: "/ai-boundary-builder-coach" },
  ],
  "/ai-treatment-navigator": [
    { label: "Home", path: "/" },
    { label: "AI Coaching Tools", path: "/family-education" },
    { label: "Treatment Navigator", path: "/ai-treatment-navigator" },
  ],
  "/ai-relapse-response-guide": [
    { label: "Home", path: "/" },
    { label: "AI Coaching Tools", path: "/family-education" },
    { label: "Relapse Response Guide", path: "/ai-relapse-response-guide" },
  ],
  "/ai-addiction-reality-translator": [
    { label: "Home", path: "/" },
    { label: "AI Coaching Tools", path: "/family-education" },
    { label: "Addiction Reality Translator", path: "/ai-addiction-reality-translator" },
  ],

  // Interactive Tools & Exercises
  "/addiction-assessment": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Addiction Assessment", path: "/addiction-assessment" },
  ],
  "/family-action-plan": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Family Action Plan", path: "/family-action-plan" },
  ],
  "/scenario-exercise": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Scenario Exercise", path: "/scenario-exercise" },
  ],
  "/crisis-chaos": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Crisis & Chaos", path: "/crisis-chaos" },
  ],
  "/emotional-regulation": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Emotional Regulation", path: "/emotional-regulation" },
  ],
  "/values-exercise": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Values Exercise", path: "/values-exercise" },
  ],
  "/talking-about-treatment": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Talking About Treatment", path: "/talking-about-treatment" },
  ],
  "/readiness-checklist": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Readiness Checklist", path: "/readiness-checklist" },
  ],
  "/relapse-warning-signs": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Relapse Warning Signs", path: "/relapse-warning-signs" },
  ],
  "/communication-guide": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Communication Guide", path: "/communication-guide" },
  ],
  "/aftercare-checklist": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Aftercare Checklist", path: "/aftercare-checklist" },
  ],
  "/treatment-red-flags": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Treatment Red Flags", path: "/treatment-red-flags" },
  ],
  "/family-advocacy-toolkit": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Family Advocacy Toolkit", path: "/family-advocacy-toolkit" },
  ],
  "/treatment-questions": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Treatment Questions", path: "/treatment-questions" },
  ],
  "/recovery-requirements": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Recovery Requirements", path: "/recovery-requirements" },
  ],
  "/insight-behavior-tracker": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Insight & Behavior Tracker", path: "/insight-behavior-tracker" },
  ],
  "/values-aligned-decisions": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Values-Aligned Decisions", path: "/values-aligned-decisions" },
  ],
  "/fear-inventory-exercise": [
    { label: "Home", path: "/" },
    { label: "Family Education", path: "/family-education" },
    { label: "Fear Inventory Exercise", path: "/fear-inventory-exercise" },
  ],

  // Community
  "/family-support": [
    { label: "Home", path: "/" },
    { label: "Community", path: "/family-support" },
  ],
  "/family-forum": [
    { label: "Home", path: "/" },
    { label: "Community", path: "/family-support" },
    { label: "Family Forum", path: "/family-forum" },
  ],
  "/family-consultation": [
    { label: "Home", path: "/" },
    { label: "Community", path: "/family-support" },
    { label: "Family Consultation", path: "/family-consultation" },
  ],
  "/monday-zoom-registration": [
    { label: "Home", path: "/" },
    { label: "Community", path: "/family-support" },
    { label: "Monday Zoom Registration", path: "/monday-zoom-registration" },
  ],
  "/zoom-recordings": [
    { label: "Home", path: "/" },
    { label: "Community", path: "/family-support" },
    { label: "Past Meeting Recordings", path: "/zoom-recordings" },
  ],
  "/family-webinars": [
    { label: "Home", path: "/" },
    { label: "Community", path: "/family-support" },
    { label: "Family Webinars", path: "/family-webinars" },
  ],
  "/family-membership": [
    { label: "Home", path: "/" },
    { label: "Community", path: "/family-support" },
    { label: "Family Membership", path: "/family-membership" },
  ],
  "/family-coaching": [
    { label: "Home", path: "/" },
    { label: "Community", path: "/family-support" },
    { label: "Family Coaching", path: "/family-coaching" },
  ],
  "/testimonials": [
    { label: "Home", path: "/" },
    { label: "Community", path: "/family-support" },
    { label: "Testimonials", path: "/testimonials" },
  ],

  // Blog
  "/blog": [
    { label: "Home", path: "/" },
    { label: "Blog", path: "/blog" },
  ],

  // Resources & other pages
  "/recovery-resources": [
    { label: "Home", path: "/" },
    { label: "Recovery Resources", path: "/recovery-resources" },
  ],
  "/recovery-podcasts": [
    { label: "Home", path: "/" },
    { label: "Recovery Podcasts", path: "/recovery-podcasts" },
  ],
  "/faqs": [
    { label: "Home", path: "/" },
    { label: "FAQs", path: "/faqs" },
  ],
  "/for-providers": [
    { label: "Home", path: "/" },
    { label: "For Providers", path: "/for-providers" },
  ],
  "/book-consultation": [
    { label: "Home", path: "/" },
    { label: "Book Consultation", path: "/book-consultation" },
  ],
  "/free-guide": [
    { label: "Home", path: "/" },
    { label: "Free Guide", path: "/free-guide" },
  ],
  "/onboarding-quiz": [
    { label: "Home", path: "/" },
    { label: "Onboarding Quiz", path: "/onboarding-quiz" },
  ],
};

/**
 * Get breadcrumb items for a given pathname.
 * Falls back to blog breadcrumbs for known blog slug routes,
 * or a simple Home > Page for unmapped paths.
 */
export function getBreadcrumbs(pathname: string): BreadcrumbItem[] | null {
  if (pathname === "/") return null;

  // Direct match
  if (breadcrumbMap[pathname]) return breadcrumbMap[pathname];

  // Blog article routes (blog/:id or known slug routes)
  if (pathname.startsWith("/blog/")) {
    return [
      { label: "Home", path: "/" },
      { label: "Blog", path: "/blog" },
      { label: "Article", path: pathname },
    ];
  }

  // Forum topic routes
  if (pathname.startsWith("/family-forum/")) {
    return [
      { label: "Home", path: "/" },
      { label: "Community", path: "/family-support" },
      { label: "Family Forum", path: "/family-forum" },
      { label: "Topic", path: pathname },
    ];
  }

  if (pathname === "/relapse-radar") {
    return [
      { label: "Home", path: "/" },
      { label: "Family Education", path: "/family-education" },
      { label: "Relapse Radar", path: "/relapse-radar" },
    ];
  }

  // Known blog slug routes (top-level slugs that render BlogArticle)
  const blogSlugs = [
    "/fentanyl-overdose-signs-safety-plan",
    "/parents-addicted-adult-children",
    "/addiction-grandchildren-boundaries",
    "/how-addiction-affects-the-brain",
    "/addiction-and-mental-health",
    "/relapse-process-addiction",
    "/relapse-warning-signs-family-education",
    "/early-recovery-symptoms-family-education",
    "/treatment-to-home-transition-family-education",
    "/motivation-vs-capacity-addiction-family-education",
    "/stability-vs-recovery-families-healing",
    "/readiness-for-addiction-treatment-families",
    "/emotional-whiplash-addiction-families",
    "/sobriety-vs-recovery-families",
    "/understanding-relapse-process-not-event",
    "/personality-changes-in-addiction",
    "/triggers-explained-addiction",
    "/sleep-and-addiction-recovery",
    "/attachment-styles-and-addiction",
  ];

  if (blogSlugs.includes(pathname)) {
    const label = pathname
      .slice(1)
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return [
      { label: "Home", path: "/" },
      { label: "Blog", path: "/blog" },
      { label, path: pathname },
    ];
  }

  return null;
}
