export interface FamilyAddictionAnswer {
  slug: string;
  question: string;
  shortAnswer: string;
  category: string;
  deeperAnswer: string[];
  bestNextStep: "family_squares" | "private_coaching" | "intervention_readiness";
  nextStepLabel: string;
  nextStepHref: string;
  related: string[];
  keywords: string[];
}

export const familyAddictionAnswers: FamilyAddictionAnswer[] = [
  {
    slug: "where-should-family-start-addiction-chaos",
    question: "Where should a family start when addiction is causing chaos?",
    shortAnswer:
      "Start with the least intense support that is still honest about the risk: free Family Squares for support and education, private coaching for a specific family plan, or intervention readiness if safety and refusal are escalating.",
    category: "Start here",
    deeperAnswer: [
      "Families often try to solve everything at once: treatment, boundaries, money, safety, relapse, and the next conversation. That usually creates more panic. A better first step is to match the support level to the pressure level.",
      "If the family needs grounding and education, Family Squares is the best first step. If the situation cannot wait until Monday or needs privacy, book a coaching session. If risk, treatment refusal, or family division is escalating, check intervention readiness.",
    ],
    bestNextStep: "family_squares",
    nextStepLabel: "Join Family Squares",
    nextStepHref: "/family-squares",
    related: ["what-is-family-squares-meeting", "when-book-private-family-coaching", "when-is-addiction-intervention-level"],
    keywords: ["family addiction help where to start", "addiction chaos family support", "what should family do addiction"],
  },
  {
    slug: "what-is-family-squares-meeting",
    question: "What is the free Monday Family Squares meeting for?",
    shortAnswer:
      "Family Squares is a free Monday Zoom support meeting for parents, spouses, siblings, adult children, and loved ones who need support, education, and steadier thinking before making the next decision.",
    category: "Family Squares",
    deeperAnswer: [
      "The meeting is not a sales presentation and it is not a therapy group. It is a place for families affected by addiction to get grounded, hear practical guidance, ask questions, and realize they are not the only ones dealing with this.",
      "Some families attend because they are early in confusion. Others attend because the same crisis has repeated for years. The meeting helps people slow down enough to choose the next right step.",
    ],
    bestNextStep: "family_squares",
    nextStepLabel: "Register for the free meeting",
    nextStepHref: "/family-squares",
    related: ["can-i-attend-family-squares-if-loved-one-not-sober", "what-question-should-i-ask-family-squares", "where-should-family-start-addiction-chaos"],
    keywords: ["Family Squares meeting", "free family addiction support meeting", "Monday addiction support Zoom"],
  },
  {
    slug: "when-book-private-family-coaching",
    question: "When should we book a private family coaching session?",
    shortAnswer:
      "Book private coaching when Monday feels too far away, the question is too personal for a group, or the family needs a direct plan for boundaries, treatment decisions, relapse, or family alignment.",
    category: "Private coaching",
    deeperAnswer: [
      "Free support is often enough when the family needs education and connection. Private coaching fits when the family needs direct guidance around a specific decision or conversation.",
      "A coaching session can help sort what to say, what not to say, what boundary to hold, whether treatment is realistic, and whether the situation may need intervention-level planning.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Book a private session",
    nextStepHref: "/book-consultation",
    related: ["what-if-we-cannot-wait-until-monday", "what-should-family-do-after-relapse", "when-is-addiction-intervention-level"],
    keywords: ["family addiction coaching", "private coaching addiction family", "addiction family consult"],
  },
  {
    slug: "when-is-addiction-intervention-level",
    question: "When is addiction intervention-level?",
    shortAnswer:
      "Addiction may be intervention-level when treatment is refused, overdose risk is present, the family is divided, consequences are escalating, or repeated promises keep turning into the same crisis.",
    category: "Intervention readiness",
    deeperAnswer: [
      "Intervention-level does not mean the family has failed. It means ordinary conversations, rescue attempts, threats, and waiting have stopped creating meaningful change.",
      "When the pattern is dangerous or stuck, the family may need a structured plan, unified message, treatment option, and professional intervention guidance through Freedom Interventions.",
    ],
    bestNextStep: "intervention_readiness",
    nextStepLabel: "Check intervention readiness",
    nextStepHref: "/intervention-help",
    related: ["what-if-loved-one-refuses-treatment", "should-we-stop-giving-money-addiction", "where-should-family-start-addiction-chaos"],
    keywords: ["when is addiction intervention level", "family intervention readiness", "does my loved one need intervention"],
  },
  {
    slug: "what-if-loved-one-refuses-treatment",
    question: "What if my loved one refuses treatment?",
    shortAnswer:
      "Treatment refusal does not end the family's work. The family still needs to stop mixed messages, hold boundaries, keep treatment support available, and decide whether coaching or intervention readiness is needed.",
    category: "Treatment refusal",
    deeperAnswer: [
      "Families often treat refusal like a dead end. In reality, refusal is information. It shows whether the family has enough alignment, leverage, and treatment clarity to create a real decision point.",
      "If every refusal causes the family to rescue, argue, or reset the consequences, the pattern teaches the addiction that nothing has to change. This is where private coaching or intervention readiness can be appropriate.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Get private guidance",
    nextStepHref: "/book-consultation",
    related: ["when-is-addiction-intervention-level", "should-we-stop-giving-money-addiction", "what-if-we-cannot-wait-until-monday"],
    keywords: ["loved one refuses treatment", "family addiction treatment refusal", "what if they refuse rehab"],
  },
  {
    slug: "what-if-we-cannot-wait-until-monday",
    question: "What if our family cannot wait until Monday?",
    shortAnswer:
      "If the situation cannot wait until Family Squares, book a private coaching session or call for guidance. Use free support for grounding, but use private help when timing, safety, or a specific decision is pressing.",
    category: "Private coaching",
    deeperAnswer: [
      "The free Monday meeting is a strong first step for many families, but it is not meant to replace urgent case-specific guidance. Some situations need privacy, speed, and a direct plan.",
      "If you are about to confront someone, change a boundary, respond to relapse, decide on treatment, or manage family conflict, a private session can help you avoid making the next move from panic.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Book a session now",
    nextStepHref: "/book-consultation",
    related: ["when-book-private-family-coaching", "what-should-family-do-after-relapse", "when-is-addiction-intervention-level"],
    keywords: ["cannot wait until support meeting", "urgent family addiction help", "book addiction family coaching"],
  },
  {
    slug: "should-we-stop-giving-money-addiction",
    question: "Should we stop giving money to someone with addiction?",
    shortAnswer:
      "Often the family needs to stop giving cash, but the boundary should be planned. Support can stay available for verified treatment, safety, and recovery while money that protects active addiction stops.",
    category: "Boundaries",
    deeperAnswer: [
      "Money boundaries are difficult because requests often sound urgent and emotional. The family has to ask whether the money is reducing harm or keeping the addiction insulated from consequences.",
      "A good boundary is specific, calm, and enforceable. If family members are split or secretly rescuing, coaching can help the family get aligned before announcing changes.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Plan the boundary",
    nextStepHref: "/book-consultation",
    related: ["what-if-loved-one-refuses-treatment", "how-do-we-set-boundaries-with-adult-child", "where-should-family-start-addiction-chaos"],
    keywords: ["stop giving money to addict", "family addiction money boundary", "am I enabling addiction money"],
  },
  {
    slug: "how-do-we-set-boundaries-with-adult-child",
    question: "How do we set boundaries with an addicted adult child?",
    shortAnswer:
      "Set boundaries around what the family controls: money, housing, transportation, communication, secrecy, and recovery support. The boundary should be loving, specific, and enforceable.",
    category: "Boundaries",
    deeperAnswer: [
      "Parents often carry guilt, fear, and exhaustion at the same time. The boundary is not about cutting off love. It is about ending the rescue pattern that keeps everyone trapped.",
      "The hardest part is family alignment. If one parent holds a boundary while another quietly rescues, the addicted adult child learns to work around the limit. This is why coaching or Family Squares support can help.",
    ],
    bestNextStep: "family_squares",
    nextStepLabel: "Join Family Squares",
    nextStepHref: "/family-squares",
    related: ["should-we-stop-giving-money-addiction", "what-if-loved-one-refuses-treatment", "when-book-private-family-coaching"],
    keywords: ["boundaries with addicted adult child", "adult child addiction family boundaries", "parent enabling addiction"],
  },
  {
    slug: "what-should-family-do-after-relapse",
    question: "What should a family do after relapse?",
    shortAnswer:
      "Respond to relapse with safety first, then clarity. Avoid panic, punishment, or pretending nothing happened. The family needs a plan for treatment, boundaries, accountability, and next steps.",
    category: "Relapse",
    deeperAnswer: [
      "Relapse is not solved by one emotional conversation. The family should assess safety, understand what changed, avoid rescuing the relapse from consequences, and decide what support is actually recovery-supportive.",
      "If relapse keeps repeating, the family may need private coaching or intervention readiness support rather than another improvised response.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Book relapse guidance",
    nextStepHref: "/book-consultation",
    related: ["when-book-private-family-coaching", "what-if-loved-one-refuses-treatment", "when-is-addiction-intervention-level"],
    keywords: ["what should family do after relapse", "loved one relapsed family response", "addiction relapse family support"],
  },
  {
    slug: "can-i-attend-family-squares-if-loved-one-not-sober",
    question: "Can I attend Family Squares if my loved one is not sober?",
    shortAnswer:
      "Yes. Family Squares is for families affected by addiction whether the loved one is sober, using, in treatment, relapsing, refusing help, or somewhere in between.",
    category: "Family Squares",
    deeperAnswer: [
      "Families do not need to wait until their loved one is ready before getting support. In many cases, the family getting steadier is the first meaningful change in the system.",
      "The meeting can help you think more clearly about what is yours to control, what support is available, and whether private coaching or intervention readiness is needed.",
    ],
    bestNextStep: "family_squares",
    nextStepLabel: "Register for Monday",
    nextStepHref: "/family-squares",
    related: ["what-is-family-squares-meeting", "what-question-should-i-ask-family-squares", "where-should-family-start-addiction-chaos"],
    keywords: ["family support when loved one still using", "can family attend addiction support", "Family Squares loved one not sober"],
  },
  {
    slug: "what-question-should-i-ask-family-squares",
    question: "What question should I ask at Family Squares?",
    shortAnswer:
      "Ask the question that keeps repeating at home: what to do next, what boundary to hold, whether treatment is realistic, how to respond to relapse, or whether the situation is intervention-level.",
    category: "Family Squares",
    deeperAnswer: [
      "You do not need a polished question. The most useful questions are usually concrete: should we let them come home, should we pay this bill, should we call treatment, should we confront, should we wait?",
      "If the question is too private or urgent for the meeting, use the meeting to get grounded and then book a private session for the details.",
    ],
    bestNextStep: "family_squares",
    nextStepLabel: "Bring your question",
    nextStepHref: "/family-squares",
    related: ["what-is-family-squares-meeting", "what-if-we-cannot-wait-until-monday", "when-book-private-family-coaching"],
    keywords: ["what to ask family addiction support group", "Family Squares questions", "addiction family support questions"],
  },
  {
    slug: "when-should-family-call-sober-helpline",
    question: "When should a family call Sober Helpline?",
    shortAnswer:
      "Call when you need help deciding the next step: free support, private coaching, treatment questions, intervention readiness, or a referral to Freedom Interventions for formal intervention work.",
    category: "Start here",
    deeperAnswer: [
      "A family does not have to be ready to buy anything before calling. The point is to get oriented and stop making decisions in isolation.",
      "If the problem is urgent or private, a call or coaching session may fit better than waiting for Family Squares. If the family needs support and education first, the free Monday meeting is the best soft landing.",
    ],
    bestNextStep: "family_squares",
    nextStepLabel: "Choose the next step",
    nextStepHref: "/start-here",
    related: ["where-should-family-start-addiction-chaos", "what-if-we-cannot-wait-until-monday", "when-is-addiction-intervention-level"],
    keywords: ["when to call sober helpline", "family addiction helpline", "addiction help for families"],
  },
];

export const familyAddictionAnswerPath = (answer: FamilyAddictionAnswer) => `/family-addiction-answers/${answer.slug}`;

export const getFamilyAddictionAnswer = (slug: string | undefined) =>
  familyAddictionAnswers.find((answer) => answer.slug === slug);

export const getRelatedFamilyAddictionAnswers = (answer: FamilyAddictionAnswer) =>
  answer.related
    .map((slug) => familyAddictionAnswers.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is FamilyAddictionAnswer => Boolean(candidate));
