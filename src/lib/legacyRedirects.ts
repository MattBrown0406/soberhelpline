// Preserve useful old links from search results, bookmarks, and older site
// navigation while keeping one canonical destination for each topic.
export const legacyPageRedirects: Record<string, string> = {
  "/providers": "/inpatient-treatment",
  "/intervention": "/intervention-help",
  "/podcast": "/recovery-podcasts",

  "/boundaries-ultimatums-guide": "/boundaries-ultimatums",
  "/guilt-relief-resentment-cycle": "/guilt-relief-resentment",
  "/no-negotiation-guide": "/no-negotiation",
  "/relapse-warning-signs-tracker": "/relapse-warning-signs",
  "/strong-one-guide": "/strong-one",

  "/blog/helping-vs-enabling": "/blog/how-to-stop-enabling-addiction",
  "/blog/navigating-insurance-treatment": "/blog/using-insurance-for-addiction-treatment",
  "/blog/setting-boundaries-without-guilt": "/blog/how-to-set-healthy-boundaries-with-an-addicted-family-member",
  "/blog/signs-of-relapse": "/blog/relapse-warning-signs-family-education",
  "/blog/understanding-fentanyl-crisis": "/blog/fentanyl-overdose-signs-safety-plan",
  "/blog/when-your-loved-one-refuses-help": "/blog/why-families-need-support-even-when-loved-one-refuses-help",
  "/blog/what-is-an-intervention": "/blog/what-to-expect-during-an-intervention",

  "/blog/addiction-and-anxiety-what-families-need-to-know": "/blog/addiction-anxiety-family-burnout",
  "/blog/addiction-education-why-families-need-it-before-crisis": "/blog/what-families-need-understand-addiction-before-crisis",
  "/blog/convincing-addicted-child": "/blog/parents-addicted-adult-children",
  "/blog/families-sense-trouble-long-before-certainty": "/blog/families-sense-trouble-before-addiction-obvious",
  "/blog/reiner-family-tragedy-importance-of-family-support": "/blog/reiner-family-tragedy-addiction-intervention",
  "/blog/tms-depression-treatment-what-families-should-know": "/blog/tms-depression-addiction-recovery",

  // This program-specific funnel was deliberately retired. Keep old links
  // useful without implying that its former intake or scholarship forms exist.
  "/central-oregon-family-program": "/oregon/bend",
  "/central-oregon-family-program/intake": "/oregon/bend",
  "/central-oregon-family-program/seat-request": "/oregon/bend",
  "/central-oregon-family-program/scholarship": "/oregon/bend",

  // Library clean-up, 2026-11-11: guides and tools that were merged into a
  // fuller page (or retired). Each old address goes to the page that now
  // holds its content.
  "/why-willpower-fails": "/disease-choice-reality-map",
  "/brain-spiritual-recovery": "/twelve-steps-explained",
  "/misunderstood-diagnoses": "/mental-health-vs-substance-induced",
  "/mental-health-delays-recovery": "/mental-health-vs-substance-induced",
  "/how-trauma-shapes-addiction": "/trauma-vs-excuses",
  "/cost-of-secrecy": "/addiction-rewrites-family-rules",
  "/sibling-experience": "/parents-repairing-sibling-system",
  "/growing-up-shadow": "/strong-one",
  "/rebuilding-sibling-relationships": "/sibling-guilt-anger-loyalty",
  "/intergenerational-enabling": "/family-unity-liability",
  "/treatment-industry-guide": "/treatment-red-flags",
  "/matching-modality": "/treatment-modalities",
  "/therapy-timing": "/treatment-modalities",
  "/flexibility-vs-instability": "/boundary-drift",
  "/recovery-requirements": "/what-changes-when-families-change",
  "/addiction-attachment-styles": "/blog/attachment-styles-and-addiction",
  "/insight-behavior-tracker": "/readiness-checklist",
  "/scenario-exercise": "/workbook/hard-moment-practice",
  "/boundary-setting-worksheet": "/workbook/boundary-script",
  "/who-benefits-filter": "/workbook/helping-or-enabling",
  "/values-exercise": "/family-action-plan",
  "/values-aligned-decisions": "/family-action-plan",
  "/enabling-language-translator": "/communication-guide",
  "/conversation-starters": "/communication-guide",
  "/relapse-radar": "/relapse-warning-signs",
  "/ai-addiction-reality-translator": "/ai-prompts",
  "/ai-boundary-builder-coach": "/ai-prompts",
  "/ai-enabling-decision-coach": "/ai-prompts",
  "/ai-life-coach": "/ai-prompts",
  "/ai-relapse-response-guide": "/ai-prompts",
  "/ai-treatment-navigator": "/ai-prompts",
};
