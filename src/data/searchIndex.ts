export interface SearchEntry {
  title: string;
  path: string;
  description: string;
  category: "guide" | "tool" | "ai" | "community" | "blog" | "provider" | "page";
  keywords: string[];
}

export const searchIndex: SearchEntry[] = [
  // ──────────────────────────────────────────────
  // PILLAR 1 — Understanding Addiction
  // ──────────────────────────────────────────────
  { title: "Why Multiple Treatment Episodes Don't Mean Failure", path: "/multiple-treatment-episodes", description: "Understanding why repeated treatment attempts are part of the recovery process.", category: "guide", keywords: ["treatment", "relapse", "failure", "episodes", "recovery"] },
  { title: "The Disease vs. Choice Reality Map", path: "/disease-choice-reality-map", description: "Visual guide exploring addiction as a disease versus a choice.", category: "guide", keywords: ["disease", "choice", "brain", "science", "model"] },
  { title: "Addiction Progression Timeline", path: "/addiction-progression-timeline", description: "How addiction develops and progresses over time.", category: "guide", keywords: ["progression", "stages", "timeline", "development"] },
  { title: "The 12 Steps Explained for Families", path: "/twelve-steps-explained", description: "A family-friendly explanation of each of the 12 steps.", category: "guide", keywords: ["12 steps", "twelve steps", "AA", "program", "family"] },
  { title: "Addiction as a Stress-Regulation Disorder", path: "/addiction-as-stress-disorder", description: "Understanding addiction through the lens of stress regulation.", category: "guide", keywords: ["stress", "regulation", "disorder", "coping"] },

  // ──────────────────────────────────────────────
  // PILLAR 2 — Mental Health & Dual Diagnosis
  // ──────────────────────────────────────────────
  { title: "Understanding Drug-Induced Psychosis", path: "/drug-induced-psychosis", description: "What drug-induced psychosis looks like and how families can respond.", category: "guide", keywords: ["psychosis", "drugs", "mental health", "hallucinations"] },
  { title: "Mental Health vs. Substance-Induced Symptoms", path: "/mental-health-vs-substance-induced", description: "How to distinguish mental health conditions from substance-induced symptoms.", category: "guide", keywords: ["mental health", "substance", "symptoms", "diagnosis", "dual"] },
  { title: "Understanding Eating Disorders", path: "/eating-disorders-guide", description: "Guide to eating disorders and their connection to addiction.", category: "guide", keywords: ["eating disorders", "anorexia", "bulimia", "co-occurring"] },
  { title: "Trauma vs. Excuses: A Necessary Distinction", path: "/trauma-vs-excuses", description: "Understanding the difference between trauma responses and avoidance.", category: "guide", keywords: ["trauma", "excuses", "accountability", "responsibility"] },

  // ──────────────────────────────────────────────
  // PILLAR 3 — Family Systems & Enabling
  // ──────────────────────────────────────────────
  { title: "Family Roles in Addiction (Beyond the Clichés)", path: "/family-roles-addiction", description: "How family members take on specific roles in the addiction dynamic.", category: "guide", keywords: ["family roles", "hero", "scapegoat", "mascot", "lost child"] },
  { title: "How Addiction Rewrites Family Rules", path: "/addiction-rewrites-family-rules", description: "How addiction distorts normal family rules and dynamics.", category: "guide", keywords: ["family rules", "dynamics", "dysfunction"] },
  { title: "The Hidden Cost of Being the \"Strong One\"", path: "/strong-one", description: "What happens when family members suppress their own needs.", category: "guide", keywords: ["strong one", "caretaker", "burnout", "self-care"] },
  { title: "The Guilt–Relief–Resentment Cycle", path: "/guilt-relief-resentment", description: "Understanding the emotional cycle families experience.", category: "guide", keywords: ["guilt", "relief", "resentment", "cycle", "emotions"] },
  { title: "Sibling Guilt, Anger, and Loyalty Conflicts", path: "/sibling-guilt-anger-loyalty", description: "Navigating complex sibling emotions around addiction.", category: "guide", keywords: ["sibling", "guilt", "anger", "loyalty"] },
  { title: "Parents: Repairing the Sibling System", path: "/parents-repairing-sibling-system", description: "How parents can help restore balance among siblings.", category: "guide", keywords: ["parents", "sibling", "repair", "system"] },
  { title: "When Family Unity Becomes a Liability", path: "/family-unity-liability", description: "When sticking together actually enables addiction.", category: "guide", keywords: ["unity", "liability", "enmeshment", "enabling"] },
  { title: "Why Change Doesn't Happen When Families Try Harder", path: "/why-change-doesnt-happen", description: "Why increased effort often backfires and what to do instead.", category: "guide", keywords: ["change", "try harder", "enabling", "effort"] },
  { title: "Crisis vs. Chaos Decision Guide", path: "/crisis-chaos", description: "How to tell the difference between a real crisis and chronic chaos.", category: "guide", keywords: ["crisis", "chaos", "emergency", "decision"] },
  { title: "What to Say / What Not to Say", path: "/communication-guide", description: "Practical communication guidance for talking to someone in addiction.", category: "guide", keywords: ["communication", "what to say", "talking", "language"] },
  { title: "How Families Accidentally Interfere with Recovery", path: "/family-interference", description: "Well-meaning actions that unintentionally undermine recovery.", category: "guide", keywords: ["interference", "helping", "enabling", "recovery"] },

  // ──────────────────────────────────────────────
  // PILLAR 4 — Treatment Literacy
  // ──────────────────────────────────────────────
  { title: "40 Questions to Ask a Treatment Center", path: "/treatment-questions", description: "Essential questions to evaluate any treatment center.", category: "guide", keywords: ["treatment", "questions", "rehab", "center", "evaluate"] },
  { title: "Treatment Industry Red Flags Guide", path: "/treatment-red-flags", description: "Warning signs of unethical or low-quality treatment programs.", category: "guide", keywords: ["red flags", "warning", "scam", "treatment", "unethical"] },
  { title: "How to Talk About Treatment", path: "/talking-about-treatment", description: "Approaching the treatment conversation with your loved one.", category: "guide", keywords: ["treatment", "conversation", "talking", "approach"] },
  { title: "Aftercare Readiness Checklist", path: "/aftercare-checklist", description: "Checklist to evaluate readiness for life after treatment.", category: "tool", keywords: ["aftercare", "checklist", "discharge", "readiness"] },
  { title: "Family Advocacy Toolkit", path: "/family-advocacy-toolkit", description: "Tools and scripts for advocating for your loved one in the treatment system.", category: "tool", keywords: ["advocacy", "toolkit", "treatment", "navigate"] },
  { title: "Legal Issues Families Should Understand", path: "/legal-issues-guide", description: "Legal considerations families face during addiction and treatment.", category: "guide", keywords: ["legal", "law", "court", "rights", "HIPAA"] },
  { title: "Treatment Modalities Explained", path: "/treatment-modalities", description: "Overview of different treatment approaches and what they involve.", category: "guide", keywords: ["modalities", "CBT", "DBT", "therapy", "treatment types"] },
  { title: "Non–12-Step Recovery Modalities", path: "/non-twelve-step-modalities", description: "Alternative recovery approaches beyond the 12-step model.", category: "guide", keywords: ["non 12 step", "SMART", "alternative", "secular", "recovery"] },

  // ──────────────────────────────────────────────
  // PILLAR 5 — Boundaries & Consequences
  // ──────────────────────────────────────────────
  { title: "Requests, Demands, Ultimatums & Boundaries", path: "/boundaries-ultimatums", description: "Understanding the differences between requests, demands, ultimatums, and boundaries.", category: "guide", keywords: ["boundaries", "ultimatums", "demands", "requests", "limits"] },
  { title: "Readiness for Change Checklist", path: "/readiness-checklist", description: "Evaluate whether your loved one is showing real signs of readiness.", category: "tool", keywords: ["readiness", "change", "checklist", "stages", "motivation"] },
  { title: "We Don't Negotiate with Terrorists", path: "/no-negotiation", description: "Why negotiating with active addiction undermines recovery.", category: "guide", keywords: ["negotiate", "manipulation", "boundaries", "firm"] },
  { title: "Boundary Drift: How Limits Slowly Erode", path: "/boundary-drift", description: "Recognizing and preventing the gradual erosion of boundaries.", category: "guide", keywords: ["boundary drift", "erosion", "limits", "slipping"] },
  { title: "Anger and Boundaries Are Not the Same Thing", path: "/anger-and-boundaries", description: "Distinguishing between boundaries set from clarity vs. anger.", category: "guide", keywords: ["anger", "boundaries", "emotion", "clarity"] },

  // ──────────────────────────────────────────────
  // PILLAR 6 — Family Recovery
  // ──────────────────────────────────────────────
  { title: "What Changes When Families Change", path: "/what-changes-when-families-change", description: "How family behavioral changes can shift the entire dynamic.", category: "guide", keywords: ["family change", "system", "dynamics", "shift"] },
  { title: "Family Recovery Action Plan", path: "/family-action-plan", description: "Step-by-step plan for families beginning their own recovery.", category: "tool", keywords: ["action plan", "family recovery", "steps", "planning"] },
  { title: "Emotional Regulation Tools", path: "/emotional-regulation", description: "Practical tools for managing intense emotions as a family member.", category: "tool", keywords: ["emotional regulation", "coping", "grounding", "calm"] },
  { title: "Living Well Regardless of Outcome", path: "/living-well-regardless", description: "Finding peace and purpose regardless of your loved one's choices.", category: "guide", keywords: ["living well", "detachment", "peace", "acceptance"] },
  { title: "Grief for the Family You Thought You'd Have", path: "/grief-for-family", description: "Processing grief and loss for the family life you imagined.", category: "guide", keywords: ["grief", "loss", "mourning", "expectations"] },
  { title: "Is It Safe to Open Up Again?", path: "/safe-to-open-up", description: "Evaluating when it's safe to rebuild trust and vulnerability.", category: "guide", keywords: ["trust", "vulnerability", "safety", "opening up"] },

  // ──────────────────────────────────────────────
  // AI TOOLS
  // ──────────────────────────────────────────────

  // ──────────────────────────────────────────────
  // COMMUNITY & KEY PAGES
  // ──────────────────────────────────────────────
  { title: "Family Forum", path: "/family-forum", description: "Connect with other families navigating addiction in our supportive community.", category: "community", keywords: ["forum", "community", "support", "families", "discussion"] },
  { title: "No More Enabling Reader Path", path: "/from-no-more-enabling", description: "A guided bridge from No More Enabling into Family Squares, coaching, and intervention readiness.", category: "page", keywords: ["no more enabling", "family squares", "coaching", "intervention", "next step"] },
  { title: "After Family Squares", path: "/family-squares-next-step", description: "Choose the right next step after Family Squares: membership, private coaching, readiness intensive, or continued free support.", category: "page", keywords: ["family squares", "next step", "coaching", "family membership", "intervention readiness"] },
  { title: "Family Addiction Consult", path: "/family-addiction-consult", description: "Private family addiction consult for choosing the next right support path.", category: "page", keywords: ["family addiction consult", "private consultation", "family help", "coaching"] },
  { title: "Intervention Readiness Consult", path: "/intervention-readiness-consult", description: "Private consult for families considering intervention readiness and treatment refusal planning.", category: "page", keywords: ["intervention readiness", "treatment refusal", "professional intervention", "consult"] },
  { title: "Partner With Sober Helpline", path: "/partner-with-sober-helpline", description: "Audience and credibility overview for ethical providers, sponsors, and recovery-aligned partners.", category: "provider", keywords: ["partner", "sponsor", "provider", "advertising", "family addiction audience"] },
  { title: "The Family Squares", path: "/family-squares", description: "Weekly live Zoom meeting for families dealing with addiction.", category: "community", keywords: ["zoom", "monday", "meeting", "live", "weekly", "group"] },
  { title: "Family Addiction Coaching", path: "/family-coaching", description: "Private coaching for boundaries, enabling, relapse, treatment refusal, and family alignment.", category: "community", keywords: ["family addiction coaching", "addiction coaching", "boundaries", "enabling", "family alignment"] },
  { title: "Intervention Help", path: "/intervention-help", description: "Warning signs and next steps for families considering a professional intervention.", category: "page", keywords: ["intervention", "freedom interventions", "readiness", "professional interventionist", "treatment refusal"] },
  { title: "Family Webinars", path: "/family-webinars", description: "Educational webinars for families on addiction-related topics.", category: "community", keywords: ["webinars", "education", "live", "learning"] },
  { title: "FAQs", path: "/faqs", description: "Frequently asked questions about addiction, treatment, and family support.", category: "page", keywords: ["FAQ", "questions", "answers", "help"] },
  { title: "Free Guide", path: "/free-guide", description: "Download our free guide for families dealing with addiction.", category: "page", keywords: ["free", "guide", "download", "ebook"] },
  { title: "Recovery Resources", path: "/recovery-resources", description: "Curated collection of recovery resources and support services.", category: "page", keywords: ["resources", "recovery", "support", "services"] },
  { title: "Family Education Center", path: "/family-education", description: "Comprehensive library of educational resources for families.", category: "page", keywords: ["education", "library", "resources", "learning", "pillars"] },
  { title: "Family Support", path: "/family-support", description: "Overview of all family support services and resources.", category: "page", keywords: ["family", "support", "overview", "services"] },
  { title: "Family Membership", path: "/family-membership", description: "Join our family support membership for full access to resources.", category: "page", keywords: ["membership", "join", "subscribe", "access"] },
  { title: "Provider Directory", path: "/inpatient-treatment", description: "Find vetted, ethical treatment providers.", category: "provider", keywords: ["providers", "directory", "treatment", "rehab", "find"] },
  { title: "Intervention Services", path: "/intervention-help", description: "Professional intervention services for families in crisis.", category: "page", keywords: ["intervention", "crisis", "professional", "help"] },
  { title: "About Sober Helpline", path: "/about", description: "Free family support, education, and live Monday Family Squares. Matt Brown is the certified interventionist behind Sober Helpline.", category: "page", keywords: ["about", "Matt Brown", "interventionist", "family support"] },
  { title: "Blog", path: "/blog", description: "Articles on addiction, recovery, family dynamics, and treatment.", category: "blog", keywords: ["blog", "articles", "news", "education"] },
  { title: "Podcast", path: "/recovery-podcasts", description: "Sober Helpline podcast episodes on addiction and recovery.", category: "page", keywords: ["podcast", "episodes", "listen", "audio"] },
  { title: "Contact Us", path: "/contact", description: "Call (458) 298-8008, WhatsApp +1 503-836-2136, or join Family Squares Monday at 7:00 PM Pacific.", category: "page", keywords: ["contact", "phone", "whatsapp", "reach out"] },
  { title: "What to Do Tonight", path: "/what-to-do-tonight", description: "A free tonight plan for families: safety first, what to say, money, keys, kids, then Family Squares or a call.", category: "page", keywords: ["tonight", "2am", "what to do", "safety", "911", "988"] },
  { title: "Two Households", path: "/two-households", description: "Free tonight guidance when two houses have different rules: money, housing, and contact in both kitchens.", category: "page", keywords: ["two households", "split house", "divorced parents", "separated", "never-married", "other parent", "custody"] },
  { title: "Enabling Self-Assessment", path: "/enabling-self-assessment", description: "Free enabling self-assessment with an immediate result and no email gate.", category: "tool", keywords: ["enabling", "self-assessment", "helping", "making it worse"] },
  { title: "Family Situation Assessment", path: "/family-situation-assessment", description: "A short free assessment that names the pattern and points to tonight, Family Squares, or a call.", category: "tool", keywords: ["family situation", "assessment", "enabling", "next step"] },

  // ──────────────────────────────────────────────
  // BLOG HIGHLIGHTS (key articles)
  // ──────────────────────────────────────────────
  { title: "Attachment Styles and Addiction", path: "/blog/attachment-styles-and-addiction", description: "How relationship patterns influence addiction and recovery.", category: "blog", keywords: ["attachment", "styles", "relationships", "bonding", "recovery"] },
  { title: "When Your Loved One Refuses Help", path: "/blog/why-families-need-support-even-when-loved-one-refuses-help", description: "What to do when someone you love won't accept treatment.", category: "blog", keywords: ["refuses help", "resistant", "denial", "what to do"] },
  { title: "Understanding Fentanyl", path: "/blog/fentanyl-overdose-signs-safety-plan", description: "What families need to know about the fentanyl crisis.", category: "blog", keywords: ["fentanyl", "opioids", "overdose", "crisis"] },
  { title: "How to Set Boundaries Without Guilt", path: "/blog/how-to-set-healthy-boundaries-with-an-addicted-family-member", description: "Practical guide to setting boundaries while managing guilt.", category: "blog", keywords: ["boundaries", "guilt", "setting limits", "self-care"] },
  { title: "Signs Your Loved One May Be Using Again", path: "/blog/relapse-warning-signs-family-education", description: "Warning signs that may indicate a return to substance use.", category: "blog", keywords: ["relapse", "signs", "warning", "using again"] },
  { title: "The Difference Between Helping and Enabling", path: "/blog/how-to-stop-enabling-addiction", description: "How to know when your help is actually making things worse.", category: "blog", keywords: ["helping", "enabling", "difference", "support"] },
  { title: "What Is an Intervention?", path: "/blog/what-to-expect-during-an-intervention", description: "Understanding the intervention process and what to expect.", category: "blog", keywords: ["intervention", "process", "what to expect", "family"] },
  { title: "Navigating Insurance for Addiction Treatment", path: "/blog/using-insurance-for-addiction-treatment", description: "How to work with insurance companies for treatment coverage.", category: "blog", keywords: ["insurance", "coverage", "treatment", "paying", "cost"] },

  // ──────────────────────────────────────────────
  // MEMBER AREA
  // ──────────────────────────────────────────────
  { title: "Member Home", path: "/member-home", description: "Your member home — this week's meeting, your learning path, and where you left off.", category: "community", keywords: ["dashboard", "home", "progress", "member", "overview", "email settings"] },
  { title: "Learning Paths", path: "/family-education/tracks", description: "Eight short, ordered paths — crisis, boundaries, treatment, relapse, family patterns, partners, parents, siblings. Choose one.", category: "community", keywords: ["learning path", "track", "start here", "where to start", "crisis", "boundaries", "relapse", "parent", "spouse", "sibling"] },
  { title: "Find Your Starting Path", path: "/onboarding-quiz", description: "Five short questions that suggest one learning path for your situation.", category: "tool", keywords: ["quiz", "where to start", "learning path", "recommendation"] },
  { title: "Workbook", path: "/workbook", description: "Short guided exercises (about 5 minutes) and your saved answers.", category: "community", keywords: ["workbook", "exercises", "worksheet", "guided", "self-care", "boundary"] },
  { title: "Q&A Archive", path: "/member-qa", description: "Questions and answers from Monday night meetings — searchable by topic.", category: "community", keywords: ["Q&A", "questions", "answers", "Monday meeting", "archive"] },
  { title: "Past Meeting Recordings", path: "/zoom-recordings", description: "Recordings from past Monday night family support meetings.", category: "community", keywords: ["recordings", "video", "Monday meeting", "zoom", "past sessions", "replay"] },
  { title: "Family Discussion Forum", path: "/family-forum", description: "Connect with other families navigating addiction — share, ask, and find support.", category: "community", keywords: ["forum", "community", "discuss", "families", "support group", "connect"] },
  { title: "Monthly Webinars", path: "/family-webinars", description: "Live sessions with addiction specialists and past webinar recordings.", category: "community", keywords: ["webinar", "live", "specialist", "event", "register"] },
  { title: "Education Center", path: "/family-education", description: "Guides, worksheets, guided exercises, meditations and interactive tools for families.", category: "community", keywords: ["education", "guides", "worksheets", "pillars", "library", "family", "learn"] },
];

export const categoryLabels: Record<string, string> = {
  guide: "Guides",
  tool: "Tools & Worksheets",
  ai: "AI Coaches",
  community: "Community",
  blog: "Blog",
  provider: "Providers",
  page: "Pages",
};

export const categoryOrder = ["ai", "guide", "tool", "community", "blog", "provider", "page"];
