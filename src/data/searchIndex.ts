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
  { title: "Why Willpower Fails (and What Actually Works)", path: "/why-willpower-fails", description: "Why willpower alone isn't enough and what evidence-based approaches work.", category: "guide", keywords: ["willpower", "motivation", "brain", "science"] },
  { title: "Addiction Progression Timeline", path: "/addiction-progression-timeline", description: "How addiction develops and progresses over time.", category: "guide", keywords: ["progression", "stages", "timeline", "development"] },
  { title: "Addiction, the Brain & Spiritual Recovery", path: "/brain-spiritual-recovery", description: "The neuroscience of addiction and the role of spiritual recovery.", category: "guide", keywords: ["brain", "neuroscience", "spiritual", "recovery"] },
  { title: "The 12 Steps Explained for Families", path: "/twelve-steps-explained", description: "A family-friendly explanation of each of the 12 steps.", category: "guide", keywords: ["12 steps", "twelve steps", "AA", "program", "family"] },
  { title: "Addiction as a Stress-Regulation Disorder", path: "/addiction-as-stress-disorder", description: "Understanding addiction through the lens of stress regulation.", category: "guide", keywords: ["stress", "regulation", "disorder", "coping"] },

  // ──────────────────────────────────────────────
  // PILLAR 2 — Mental Health & Dual Diagnosis
  // ──────────────────────────────────────────────
  { title: "Understanding Drug-Induced Psychosis", path: "/drug-induced-psychosis", description: "What drug-induced psychosis looks like and how families can respond.", category: "guide", keywords: ["psychosis", "drugs", "mental health", "hallucinations"] },
  { title: "Mental Health vs. Substance-Induced Symptoms", path: "/mental-health-vs-substance-induced", description: "How to distinguish mental health conditions from substance-induced symptoms.", category: "guide", keywords: ["mental health", "substance", "symptoms", "diagnosis", "dual"] },
  { title: "Understanding Eating Disorders", path: "/eating-disorders-guide", description: "Guide to eating disorders and their connection to addiction.", category: "guide", keywords: ["eating disorders", "anorexia", "bulimia", "co-occurring"] },
  { title: "Commonly Misunderstood Diagnoses", path: "/misunderstood-diagnoses", description: "Clearing up confusion around frequently misunderstood mental health diagnoses.", category: "guide", keywords: ["diagnoses", "misunderstood", "mental health", "bipolar", "BPD"] },
  { title: "Why Focusing Only on Mental Health Can Delay Recovery", path: "/mental-health-delays-recovery", description: "The risk of treating mental health without addressing addiction.", category: "guide", keywords: ["mental health", "delay", "recovery", "dual diagnosis"] },
  { title: "Trauma vs. Excuses: A Necessary Distinction", path: "/trauma-vs-excuses", description: "Understanding the difference between trauma responses and avoidance.", category: "guide", keywords: ["trauma", "excuses", "accountability", "responsibility"] },
  { title: "How Trauma Shapes Addiction", path: "/how-trauma-shapes-addiction", description: "The role of trauma in the development and maintenance of addiction.", category: "guide", keywords: ["trauma", "ACE", "childhood", "PTSD", "addiction"] },

  // ──────────────────────────────────────────────
  // PILLAR 3 — Family Systems & Enabling
  // ──────────────────────────────────────────────
  { title: "Family Roles in Addiction (Beyond the Clichés)", path: "/family-roles-addiction", description: "How family members take on specific roles in the addiction dynamic.", category: "guide", keywords: ["family roles", "hero", "scapegoat", "mascot", "lost child"] },
  { title: "How Addiction Rewrites Family Rules", path: "/addiction-rewrites-family-rules", description: "How addiction distorts normal family rules and dynamics.", category: "guide", keywords: ["family rules", "dynamics", "dysfunction"] },
  { title: "The Cost of Secrecy", path: "/cost-of-secrecy", description: "How family secrecy around addiction causes long-term damage.", category: "guide", keywords: ["secrecy", "shame", "hiding", "family"] },
  { title: "How Addiction Shapes Attachment Styles", path: "/addiction-attachment-styles", description: "The impact of addiction on family attachment patterns.", category: "guide", keywords: ["attachment", "styles", "relationships", "bonding"] },
  { title: "The Hidden Cost of Being the \"Strong One\"", path: "/strong-one", description: "What happens when family members suppress their own needs.", category: "guide", keywords: ["strong one", "caretaker", "burnout", "self-care"] },
  { title: "The Guilt–Relief–Resentment Cycle", path: "/guilt-relief-resentment", description: "Understanding the emotional cycle families experience.", category: "guide", keywords: ["guilt", "relief", "resentment", "cycle", "emotions"] },
  { title: "The Sibling Experience in Addiction", path: "/sibling-experience", description: "How siblings are uniquely affected by a family member's addiction.", category: "guide", keywords: ["sibling", "brother", "sister", "forgotten"] },
  { title: "Growing Up in the Shadow of Addiction", path: "/growing-up-shadow", description: "The lasting impact on children who grow up with addiction in the family.", category: "guide", keywords: ["children", "growing up", "childhood", "impact"] },
  { title: "Sibling Guilt, Anger, and Loyalty Conflicts", path: "/sibling-guilt-anger-loyalty", description: "Navigating complex sibling emotions around addiction.", category: "guide", keywords: ["sibling", "guilt", "anger", "loyalty"] },
  { title: "Rebuilding Sibling Relationships in Recovery", path: "/rebuilding-sibling-relationships", description: "Steps to repair sibling bonds damaged by addiction.", category: "guide", keywords: ["sibling", "rebuilding", "relationships", "repair"] },
  { title: "Parents: Repairing the Sibling System", path: "/parents-repairing-sibling-system", description: "How parents can help restore balance among siblings.", category: "guide", keywords: ["parents", "sibling", "repair", "system"] },
  { title: "When Family Unity Becomes a Liability", path: "/family-unity-liability", description: "When sticking together actually enables addiction.", category: "guide", keywords: ["unity", "liability", "enmeshment", "enabling"] },
  { title: "Why Change Doesn't Happen When Families Try Harder", path: "/why-change-doesnt-happen", description: "Why increased effort often backfires and what to do instead.", category: "guide", keywords: ["change", "try harder", "enabling", "effort"] },
  { title: "Crisis vs. Chaos Decision Guide", path: "/crisis-chaos", description: "How to tell the difference between a real crisis and chronic chaos.", category: "guide", keywords: ["crisis", "chaos", "emergency", "decision"] },
  { title: "What to Say / What Not to Say", path: "/communication-guide", description: "Practical communication guidance for talking to someone in addiction.", category: "guide", keywords: ["communication", "what to say", "talking", "language"] },
  { title: "How Families Accidentally Interfere with Recovery", path: "/family-interference", description: "Well-meaning actions that unintentionally undermine recovery.", category: "guide", keywords: ["interference", "helping", "enabling", "recovery"] },
  { title: "Enabling Language Translator", path: "/enabling-language-translator", description: "Interactive tool to translate enabling statements into healthier alternatives.", category: "tool", keywords: ["enabling", "language", "translator", "communication"] },
  { title: "Breaking Intergenerational Enabling", path: "/intergenerational-enabling", description: "How enabling patterns pass through generations and how to break them.", category: "guide", keywords: ["intergenerational", "patterns", "generational", "enabling"] },
  { title: "\"Who Benefits From This?\" Decision Filter", path: "/who-benefits-filter", description: "A decision-making tool to evaluate if your actions help or enable.", category: "tool", keywords: ["decision", "filter", "benefits", "enabling", "helping"] },

  // ──────────────────────────────────────────────
  // PILLAR 4 — Treatment Literacy
  // ──────────────────────────────────────────────
  { title: "40 Questions to Ask a Treatment Center", path: "/treatment-questions", description: "Essential questions to evaluate any treatment center.", category: "guide", keywords: ["treatment", "questions", "rehab", "center", "evaluate"] },
  { title: "How the Treatment Industry Works", path: "/treatment-industry-guide", description: "An insider look at how the treatment industry operates.", category: "guide", keywords: ["treatment", "industry", "business", "insurance"] },
  { title: "Treatment Industry Red Flags Guide", path: "/treatment-red-flags", description: "Warning signs of unethical or low-quality treatment programs.", category: "guide", keywords: ["red flags", "warning", "scam", "treatment", "unethical"] },
  { title: "How to Talk About Treatment", path: "/talking-about-treatment", description: "Approaching the treatment conversation with your loved one.", category: "guide", keywords: ["treatment", "conversation", "talking", "approach"] },
  { title: "Aftercare Readiness Checklist", path: "/aftercare-checklist", description: "Checklist to evaluate readiness for life after treatment.", category: "tool", keywords: ["aftercare", "checklist", "discharge", "readiness"] },
  { title: "Family Advocacy Toolkit", path: "/family-advocacy-toolkit", description: "Tools and scripts for advocating for your loved one in the treatment system.", category: "tool", keywords: ["advocacy", "toolkit", "treatment", "navigate"] },
  { title: "Legal Issues Families Should Understand", path: "/legal-issues-guide", description: "Legal considerations families face during addiction and treatment.", category: "guide", keywords: ["legal", "law", "court", "rights", "HIPAA"] },
  { title: "Treatment Modalities Explained", path: "/treatment-modalities", description: "Overview of different treatment approaches and what they involve.", category: "guide", keywords: ["modalities", "CBT", "DBT", "therapy", "treatment types"] },
  { title: "Matching the Modality to the Problem", path: "/matching-modality", description: "How to match the right treatment approach to specific issues.", category: "guide", keywords: ["matching", "modality", "treatment", "fit"] },
  { title: "Why Some Therapies Fail at the Wrong Time", path: "/therapy-timing", description: "Understanding why timing matters in choosing therapeutic approaches.", category: "guide", keywords: ["therapy", "timing", "fail", "readiness"] },
  { title: "Non–12-Step Recovery Modalities", path: "/non-twelve-step-modalities", description: "Alternative recovery approaches beyond the 12-step model.", category: "guide", keywords: ["non 12 step", "SMART", "alternative", "secular", "recovery"] },

  // ──────────────────────────────────────────────
  // PILLAR 5 — Boundaries & Consequences
  // ──────────────────────────────────────────────
  { title: "Requests, Demands, Ultimatums & Boundaries", path: "/boundaries-ultimatums", description: "Understanding the differences between requests, demands, ultimatums, and boundaries.", category: "guide", keywords: ["boundaries", "ultimatums", "demands", "requests", "limits"] },
  { title: "Insight vs. Behavior Tracker", path: "/insight-behavior-tracker", description: "Interactive tool to track whether insight is translating to behavioral change.", category: "tool", keywords: ["insight", "behavior", "tracker", "progress", "change"] },
  { title: "Scenario Practice Exercise", path: "/scenario-exercise", description: "Practice setting boundaries through realistic scenarios.", category: "tool", keywords: ["scenario", "practice", "exercise", "boundaries", "roleplay"] },
  { title: "Readiness for Change Checklist", path: "/readiness-checklist", description: "Evaluate whether your loved one is showing real signs of readiness.", category: "tool", keywords: ["readiness", "change", "checklist", "stages", "motivation"] },
  { title: "We Don't Negotiate with Terrorists", path: "/no-negotiation", description: "Why negotiating with active addiction undermines recovery.", category: "guide", keywords: ["negotiate", "manipulation", "boundaries", "firm"] },
  { title: "Boundary Drift: How Limits Slowly Erode", path: "/boundary-drift", description: "Recognizing and preventing the gradual erosion of boundaries.", category: "guide", keywords: ["boundary drift", "erosion", "limits", "slipping"] },
  { title: "Anger and Boundaries Are Not the Same Thing", path: "/anger-and-boundaries", description: "Distinguishing between boundaries set from clarity vs. anger.", category: "guide", keywords: ["anger", "boundaries", "emotion", "clarity"] },
  { title: "The Difference Between Flexibility and Instability", path: "/flexibility-vs-instability", description: "When being flexible becomes instability that undermines recovery.", category: "guide", keywords: ["flexibility", "instability", "consistency", "boundaries"] },

  // ──────────────────────────────────────────────
  // PILLAR 6 — Family Recovery
  // ──────────────────────────────────────────────
  { title: "What Changes When Families Change", path: "/what-changes-when-families-change", description: "How family behavioral changes can shift the entire dynamic.", category: "guide", keywords: ["family change", "system", "dynamics", "shift"] },
  { title: "What Recovery Requires From Families", path: "/recovery-requirements", description: "The role families play in supporting sustainable recovery.", category: "guide", keywords: ["recovery", "requirements", "family role", "support"] },
  { title: "Family Recovery Action Plan", path: "/family-action-plan", description: "Step-by-step plan for families beginning their own recovery.", category: "tool", keywords: ["action plan", "family recovery", "steps", "planning"] },
  { title: "Emotional Regulation Tools", path: "/emotional-regulation", description: "Practical tools for managing intense emotions as a family member.", category: "tool", keywords: ["emotional regulation", "coping", "grounding", "calm"] },
  { title: "Values Clarification Exercise", path: "/values-exercise", description: "Interactive exercise to identify your core values.", category: "tool", keywords: ["values", "clarification", "exercise", "identity"] },
  { title: "Values-Aligned Decision Making Exercise", path: "/values-aligned-decisions", description: "Make decisions that align with your identified values.", category: "tool", keywords: ["values", "decisions", "alignment", "exercise"] },
  { title: "Living Well Regardless of Outcome", path: "/living-well-regardless", description: "Finding peace and purpose regardless of your loved one's choices.", category: "guide", keywords: ["living well", "detachment", "peace", "acceptance"] },
  { title: "Grief for the Family You Thought You'd Have", path: "/grief-for-family", description: "Processing grief and loss for the family life you imagined.", category: "guide", keywords: ["grief", "loss", "mourning", "expectations"] },
  { title: "Is It Safe to Open Up Again?", path: "/safe-to-open-up", description: "Evaluating when it's safe to rebuild trust and vulnerability.", category: "guide", keywords: ["trust", "vulnerability", "safety", "opening up"] },

  // ──────────────────────────────────────────────
  // AI TOOLS
  // ──────────────────────────────────────────────
  { title: "AI Life Coach", path: "/ai-life-coach", description: "AI-powered life coaching for families navigating addiction.", category: "ai", keywords: ["AI", "life coach", "coaching", "guidance", "support"] },
  { title: "AI Boundary Builder Coach", path: "/ai-boundary-builder-coach", description: "AI coach to help you build and maintain healthy boundaries.", category: "ai", keywords: ["AI", "boundary", "builder", "coach", "limits"] },
  { title: "AI Enabling Decision Coach", path: "/ai-enabling-decision-coach", description: "AI tool to evaluate whether your actions are helping or enabling.", category: "ai", keywords: ["AI", "enabling", "decision", "helping", "coach"] },
  { title: "AI Treatment Navigator", path: "/ai-treatment-navigator", description: "AI-powered guide to navigating treatment options.", category: "ai", keywords: ["AI", "treatment", "navigator", "options", "rehab"] },
  { title: "AI Relapse Response Guide", path: "/ai-relapse-response-guide", description: "AI guide for how to respond when a loved one relapses.", category: "ai", keywords: ["AI", "relapse", "response", "guide", "crisis"] },
  { title: "AI Addiction Reality Translator", path: "/ai-addiction-reality-translator", description: "AI tool that translates common addiction behaviors into what's really happening.", category: "ai", keywords: ["AI", "reality", "translator", "behavior", "manipulation"] },

  // ──────────────────────────────────────────────
  // COMMUNITY & KEY PAGES
  // ──────────────────────────────────────────────
  { title: "Family Forum", path: "/family-forum", description: "Connect with other families navigating addiction in our supportive community.", category: "community", keywords: ["forum", "community", "support", "families", "discussion"] },
  { title: "The Family Squares", path: "/family-squares", description: "Weekly live Zoom meeting for families dealing with addiction.", category: "community", keywords: ["zoom", "monday", "meeting", "live", "weekly", "group"] },
  { title: "Family Coaching", path: "/family-coaching", description: "One-on-one coaching for families affected by addiction.", category: "community", keywords: ["coaching", "one-on-one", "support", "family"] },
  { title: "Intervention Help", path: "/intervention-help", description: "Warning signs and next steps for families considering a professional intervention.", category: "page", keywords: ["intervention", "freedom interventions", "readiness", "professional interventionist", "treatment refusal"] },
  { title: "Family Webinars", path: "/family-webinars", description: "Educational webinars for families on addiction-related topics.", category: "community", keywords: ["webinars", "education", "live", "learning"] },
  { title: "FAQs", path: "/faqs", description: "Frequently asked questions about addiction, treatment, and family support.", category: "page", keywords: ["FAQ", "questions", "answers", "help"] },
  { title: "Free Guide", path: "/free-guide", description: "Download our free guide for families dealing with addiction.", category: "page", keywords: ["free", "guide", "download", "ebook"] },
  { title: "Recovery Resources", path: "/recovery-resources", description: "Curated collection of recovery resources and support services.", category: "page", keywords: ["resources", "recovery", "support", "services"] },
  { title: "Family Education Center", path: "/family-education", description: "Comprehensive library of educational resources for families.", category: "page", keywords: ["education", "library", "resources", "learning", "pillars"] },
  { title: "Family Support", path: "/family-support", description: "Overview of all family support services and resources.", category: "page", keywords: ["family", "support", "overview", "services"] },
  { title: "Family Membership", path: "/family-membership", description: "Join our family support membership for full access to resources.", category: "page", keywords: ["membership", "join", "subscribe", "access"] },
  { title: "Provider Directory", path: "/providers", description: "Find vetted, ethical treatment providers.", category: "provider", keywords: ["providers", "directory", "treatment", "rehab", "find"] },
  { title: "Intervention Services", path: "/intervention", description: "Professional intervention services for families in crisis.", category: "page", keywords: ["intervention", "crisis", "professional", "help"] },
  { title: "About Matt Brown", path: "/about", description: "Learn about Matt Brown's 20+ years of experience in addiction intervention.", category: "page", keywords: ["about", "Matt Brown", "interventionist", "experience"] },
  { title: "Blog", path: "/blog", description: "Articles on addiction, recovery, family dynamics, and treatment.", category: "blog", keywords: ["blog", "articles", "news", "education"] },
  { title: "Podcast", path: "/podcast", description: "Sober Helpline podcast episodes on addiction and recovery.", category: "page", keywords: ["podcast", "episodes", "listen", "audio"] },
  { title: "Contact Us", path: "/contact", description: "Get in touch with Sober Helpline for help.", category: "page", keywords: ["contact", "phone", "email", "reach out"] },

  // ──────────────────────────────────────────────
  // BLOG HIGHLIGHTS (key articles)
  // ──────────────────────────────────────────────
  { title: "Attachment Styles and Addiction", path: "/blog/attachment-styles-and-addiction", description: "How relationship patterns influence addiction and recovery.", category: "blog", keywords: ["attachment", "styles", "relationships", "bonding", "recovery"] },
  { title: "When Your Loved One Refuses Help", path: "/blog/when-your-loved-one-refuses-help", description: "What to do when someone you love won't accept treatment.", category: "blog", keywords: ["refuses help", "resistant", "denial", "what to do"] },
  { title: "Understanding Fentanyl", path: "/blog/understanding-fentanyl-crisis", description: "What families need to know about the fentanyl crisis.", category: "blog", keywords: ["fentanyl", "opioids", "overdose", "crisis"] },
  { title: "How to Set Boundaries Without Guilt", path: "/blog/setting-boundaries-without-guilt", description: "Practical guide to setting boundaries while managing guilt.", category: "blog", keywords: ["boundaries", "guilt", "setting limits", "self-care"] },
  { title: "Signs Your Loved One May Be Using Again", path: "/blog/signs-of-relapse", description: "Warning signs that may indicate a return to substance use.", category: "blog", keywords: ["relapse", "signs", "warning", "using again"] },
  { title: "The Difference Between Helping and Enabling", path: "/blog/helping-vs-enabling", description: "How to know when your help is actually making things worse.", category: "blog", keywords: ["helping", "enabling", "difference", "support"] },
  { title: "What Is an Intervention?", path: "/blog/what-is-an-intervention", description: "Understanding the intervention process and what to expect.", category: "blog", keywords: ["intervention", "process", "what to expect", "family"] },
  { title: "Navigating Insurance for Addiction Treatment", path: "/blog/navigating-insurance-treatment", description: "How to work with insurance companies for treatment coverage.", category: "blog", keywords: ["insurance", "coverage", "treatment", "paying", "cost"] },
  { title: "Relapse Radar — Early Warning Signs Assessment", path: "/relapse-radar", description: "Assess potential relapse risks for a loved one in recovery before a crisis happens.", category: "tool", keywords: ["relapse", "radar", "warning signs", "risk", "assessment", "recovery"] },
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
