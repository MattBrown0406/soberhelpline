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
  {
    slug: "should-we-stage-an-intervention",
    question: "Should we stage an addiction intervention?",
    shortAnswer:
      "Consider intervention planning when treatment is refused, risk is escalating, ordinary conversations no longer work, and the family needs a unified plan instead of another emotional confrontation.",
    category: "Intervention readiness",
    deeperAnswer: [
      "A formal intervention is not the first move for every family. Some families need education, support, or private coaching before a structured intervention makes sense.",
      "Intervention becomes more appropriate when the family has lost the ability to create a real decision point on its own. If the situation involves overdose risk, dangerous withdrawal, severe consequences, or repeated refusal, check intervention readiness before waiting.",
    ],
    bestNextStep: "intervention_readiness",
    nextStepLabel: "Check intervention readiness",
    nextStepHref: "/intervention-help",
    related: ["when-is-addiction-intervention-level", "what-if-loved-one-refuses-treatment", "does-our-family-need-freedom-interventions"],
    keywords: ["should we stage an intervention", "addiction intervention help", "family intervention planning"],
  },
  {
    slug: "how-do-i-get-my-spouse-into-treatment",
    question: "How do I get my spouse into addiction treatment?",
    shortAnswer:
      "You usually cannot force treatment with one conversation. Focus on safety, money, children, boundaries, treatment options, and whether private coaching or intervention readiness is needed.",
    category: "Spouse addiction",
    deeperAnswer: [
      "Spouses often get trapped trying to make the perfect argument. Addiction usually turns that into a debate about labels, blame, timing, money, or whether the drinking or drug use is really that bad.",
      "A stronger plan names the impact, protects the household, stops covering consequences, and creates a clear treatment path. If the spouse keeps refusing, the family may need coaching or intervention-level planning.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Book spouse guidance",
    nextStepHref: "/book-consultation",
    related: ["what-if-loved-one-refuses-treatment", "should-we-stage-an-intervention", "what-if-we-cannot-wait-until-monday"],
    keywords: ["get spouse into treatment", "spouse refuses rehab", "husband wife addiction help"],
  },
  {
    slug: "what-do-i-say-when-they-relapse",
    question: "What do I say when my loved one relapses?",
    shortAnswer:
      "Say less than panic wants you to say. Start with safety, acknowledge the truth, avoid shaming, and move quickly into the plan: treatment support, boundaries, and next steps.",
    category: "Relapse",
    deeperAnswer: [
      "Relapse conversations often go badly because everyone is scared, angry, or ashamed. The family may lecture, threaten, rescue, or pretend the relapse was smaller than it was.",
      "A better response is calm and concrete: name what happened, ask about immediate safety, clarify what support is available for recovery, and avoid removing every consequence of the relapse.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Plan the relapse response",
    nextStepHref: "/book-consultation",
    related: ["what-should-family-do-after-relapse", "when-book-private-family-coaching", "what-if-we-cannot-wait-until-monday"],
    keywords: ["what to say when loved one relapses", "family response to relapse", "relapse conversation addiction"],
  },
  {
    slug: "should-i-let-loved-one-come-home-after-rehab",
    question: "Should I let my loved one come home after rehab?",
    shortAnswer:
      "Only if the home plan supports recovery and protects the household. Decide expectations for treatment follow-up, money, transportation, relapse response, and safety before discharge.",
    category: "After treatment",
    deeperAnswer: [
      "Coming home after treatment can be supportive or destabilizing depending on the structure. Families often focus on love and relief while avoiding the practical questions that determine whether the home environment helps.",
      "Before saying yes, clarify what treatment continues, what happens if relapse occurs, how money and transportation work, and what the rest of the household needs to feel safe.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Build the home plan",
    nextStepHref: "/book-consultation",
    related: ["what-should-family-do-after-relapse", "how-do-we-set-boundaries-with-adult-child", "when-book-private-family-coaching"],
    keywords: ["loved one coming home after rehab", "after rehab home plan", "family boundaries after treatment"],
  },
  {
    slug: "what-if-my-adult-child-is-using-in-my-home",
    question: "What if my addicted adult child is using in my home?",
    shortAnswer:
      "Treat active use in the home as a safety and boundary issue. The family needs clear house conditions, a recovery-supportive option, and a plan for what changes if use continues.",
    category: "Adult child addiction",
    deeperAnswer: [
      "Parents often allow active use at home because they are afraid of homelessness, overdose, anger, or losing contact. Those fears are real, but the home can become part of the addiction system if nothing changes.",
      "The boundary should be specific and planned. It may include no active use in the home, treatment evaluation, recovery meetings, drug testing, or a housing change if the conditions are not met.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Plan the home boundary",
    nextStepHref: "/book-consultation",
    related: ["how-do-we-set-boundaries-with-adult-child", "should-we-stop-giving-money-addiction", "what-if-we-cannot-wait-until-monday"],
    keywords: ["adult child using in my home", "addicted adult child home boundaries", "drug use in house family boundary"],
  },
  {
    slug: "is-this-bad-enough-for-treatment",
    question: "Is my loved one's addiction bad enough for treatment?",
    shortAnswer:
      "If use is causing safety risk, relationship damage, work problems, legal issues, health problems, secrecy, relapse, or repeated broken promises, it is serious enough to get guidance.",
    category: "Treatment decisions",
    deeperAnswer: [
      "Families often wait for a clear line where treatment becomes obviously necessary. Addiction rarely offers that kind of clarity. The line keeps moving as the family adapts.",
      "Instead of asking whether it is bad enough, ask what the pattern is costing and whether the person can stop without outside help. If the answer is unclear, get support before the next crisis decides for you.",
    ],
    bestNextStep: "family_squares",
    nextStepLabel: "Ask in Family Squares",
    nextStepHref: "/family-squares",
    related: ["where-should-family-start-addiction-chaos", "when-book-private-family-coaching", "when-is-addiction-intervention-level"],
    keywords: ["is addiction bad enough for treatment", "does my loved one need rehab", "when does addiction need treatment"],
  },
  {
    slug: "what-if-they-keep-promising-to-change",
    question: "What if my loved one keeps promising to change?",
    shortAnswer:
      "Promises matter less than pattern. If the same promise keeps ending in the same crisis, the family needs boundaries, treatment clarity, and possibly coaching or intervention readiness.",
    category: "Treatment refusal",
    deeperAnswer: [
      "Repeated promises can keep families stuck because they offer enough hope to delay action without creating real change.",
      "The family does not need to punish the promise. It needs to stop building the entire plan around words that have not been backed by structure, treatment, accountability, or recovery behavior.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Sort promise from plan",
    nextStepHref: "/book-consultation",
    related: ["what-if-loved-one-refuses-treatment", "when-is-addiction-intervention-level", "should-we-stage-an-intervention"],
    keywords: ["addict keeps promising to change", "broken promises addiction", "family addiction promises"],
  },
  {
    slug: "should-we-pay-for-rehab",
    question: "Should our family pay for rehab?",
    shortAnswer:
      "Paying for rehab can be recovery-supportive when there is a real treatment plan, clear expectations, and family boundaries. It becomes enabling when money replaces accountability.",
    category: "Treatment decisions",
    deeperAnswer: [
      "Families often feel pressure to solve the whole problem by paying for treatment. Money may open a door, but money does not create willingness, aftercare, boundaries, or family alignment by itself.",
      "Before paying, ask what program is appropriate, what happens after discharge, what the loved one is responsible for, and what the family will stop funding if treatment is refused or abandoned.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Review treatment payment",
    nextStepHref: "/book-consultation",
    related: ["should-we-stop-giving-money-addiction", "is-this-bad-enough-for-treatment", "what-if-loved-one-refuses-treatment"],
    keywords: ["should family pay for rehab", "paying for addiction treatment", "rehab money family boundaries"],
  },
  {
    slug: "how-do-we-talk-without-starting-a-fight",
    question: "How do we talk about addiction without starting a fight?",
    shortAnswer:
      "Choose timing, stay concrete, name impact instead of labels, avoid debating whether they are an addict, and decide the next step before the conversation starts.",
    category: "Family conversations",
    deeperAnswer: [
      "Many families enter addiction conversations with too much emotion and too little structure. The result is a fight about tone, blame, or definitions instead of a real next step.",
      "A steadier conversation focuses on observable impact: safety, money, trust, work, parenting, health, and repeated patterns. If the conversation is too loaded, private coaching can help the family prepare.",
    ],
    bestNextStep: "family_squares",
    nextStepLabel: "Bring the question Monday",
    nextStepHref: "/family-squares",
    related: ["what-question-should-i-ask-family-squares", "when-book-private-family-coaching", "what-if-we-cannot-wait-until-monday"],
    keywords: ["talk about addiction without fighting", "how to talk to loved one about addiction", "family addiction conversation"],
  },
  {
    slug: "what-if-family-members-disagree",
    question: "What if our family disagrees about what to do?",
    shortAnswer:
      "Family disagreement is common and often becomes part of the addiction pattern. Start by aligning on safety, money, housing, treatment support, and what the family will stop doing.",
    category: "Family alignment",
    deeperAnswer: [
      "One person may want immediate action while another wants to wait. Someone may keep rescuing quietly while someone else tries to hold a boundary. Addiction often survives in that split.",
      "The family does not need identical feelings. It needs enough shared structure that the addicted person cannot move from one family member to another to avoid change.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Get the family aligned",
    nextStepHref: "/book-consultation",
    related: ["where-should-family-start-addiction-chaos", "when-book-private-family-coaching", "should-we-stage-an-intervention"],
    keywords: ["family disagrees about addiction", "family alignment addiction", "parents disagree addiction treatment"],
  },
  {
    slug: "what-if-im-afraid-they-will-overdose",
    question: "What if I am afraid my loved one will overdose?",
    shortAnswer:
      "Treat overdose fear as a safety signal. Use emergency services for immediate danger, keep naloxone available when opioids are involved, and get professional guidance instead of waiting.",
    category: "Safety",
    deeperAnswer: [
      "Overdose fear changes the level of urgency. The family still needs boundaries and treatment planning, but immediate safety comes first.",
      "If overdose risk is present, waiting for a perfect conversation is not a plan. Use crisis resources when needed and get help deciding whether this is intervention-level.",
    ],
    bestNextStep: "intervention_readiness",
    nextStepLabel: "Review intervention readiness",
    nextStepHref: "/intervention-help",
    related: ["when-is-addiction-intervention-level", "should-we-stage-an-intervention", "when-should-family-call-sober-helpline"],
    keywords: ["afraid loved one will overdose", "overdose risk family help", "fentanyl family intervention"],
  },
  {
    slug: "what-if-they-are-functioning",
    question: "What if my loved one is still functioning?",
    shortAnswer:
      "Functioning does not mean addiction is harmless. Look at secrecy, health, money, parenting, driving, work performance, emotional volatility, and whether the pattern is getting worse.",
    category: "Treatment decisions",
    deeperAnswer: [
      "Families often minimize addiction because the person still works, pays bills, or looks normal in public. Functioning can hide risk for a long time.",
      "The better question is whether substance use is shrinking honesty, safety, trust, health, or family stability. If so, get support before the outside life collapses.",
    ],
    bestNextStep: "family_squares",
    nextStepLabel: "Ask in Family Squares",
    nextStepHref: "/family-squares",
    related: ["is-this-bad-enough-for-treatment", "how-do-we-talk-without-starting-a-fight", "when-book-private-family-coaching"],
    keywords: ["high functioning addiction family", "functioning alcoholic family help", "loved one still functioning addiction"],
  },
  {
    slug: "should-we-call-treatment-center-first",
    question: "Should we call a treatment center first?",
    shortAnswer:
      "Call a treatment center when you need program details, but call Sober Helpline or book coaching when the family needs help deciding what level of care, timing, or approach fits.",
    category: "Treatment decisions",
    deeperAnswer: [
      "Treatment centers can explain their own program, but families often need help before that: what level of care is appropriate, how to respond to refusal, and whether the family is accidentally negotiating against itself.",
      "If your loved one is willing and needs placement, treatment-center calls make sense. If the family is confused, divided, or dealing with refusal, get family guidance first.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Get treatment guidance",
    nextStepHref: "/book-consultation",
    related: ["is-this-bad-enough-for-treatment", "should-we-pay-for-rehab", "when-should-family-call-sober-helpline"],
    keywords: ["should we call treatment center first", "family treatment guidance", "addiction treatment navigation"],
  },
  {
    slug: "does-our-family-need-freedom-interventions",
    question: "Does our family need Freedom Interventions?",
    shortAnswer:
      "Freedom Interventions may be the right path when treatment is refused, risk is rising, the family is divided, and a structured intervention plan is safer than another improvised conversation.",
    category: "Intervention readiness",
    deeperAnswer: [
      "Sober Helpline is often the best first step for education, live support, and private coaching. Freedom Interventions becomes the better fit when the family needs formal intervention planning and direct professional structure.",
      "The point is not to push every family into intervention. The point is to route the family honestly: free support when that is enough, coaching when a plan is needed, and intervention when risk and refusal require more structure.",
    ],
    bestNextStep: "intervention_readiness",
    nextStepLabel: "Check the intervention path",
    nextStepHref: "/intervention-help",
    related: ["should-we-stage-an-intervention", "when-is-addiction-intervention-level", "what-if-im-afraid-they-will-overdose"],
    keywords: ["Freedom Interventions referral", "do we need interventionist", "formal addiction intervention family"],
  },
  {
    slug: "what-if-they-leave-treatment-early",
    question: "What if my loved one leaves treatment early?",
    shortAnswer:
      "Do not rush to erase every consequence. Focus on safety, what changed, whether they will re-engage with care, and what family support remains recovery-supportive.",
    category: "After treatment",
    deeperAnswer: [
      "Leaving treatment early can send the family into panic. The impulse is often to rescue, argue, or immediately create a softer landing without asking what pattern is being repeated.",
      "The family should assess safety, contact the program if releases allow, clarify the next treatment option, and avoid returning to the exact conditions that made leaving treatment easy.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Plan the next response",
    nextStepHref: "/book-consultation",
    related: ["what-should-family-do-after-relapse", "what-if-loved-one-refuses-treatment", "what-if-we-cannot-wait-until-monday"],
    keywords: ["left rehab early family response", "loved one left treatment", "what if they leave rehab early"],
  },
  {
    slug: "what-if-they-are-lying-about-using",
    question: "What if my loved one is lying about using?",
    shortAnswer:
      "Do not make the whole conversation about proving the lie. Focus on the pattern, the impact, the safety concern, and what the family will do if honesty does not return.",
    category: "Family conversations",
    deeperAnswer: [
      "Families often spend enormous energy trying to catch the person in the lie. That can create more denial, more surveillance, and more exhaustion.",
      "The family can say: we do not need you to admit every detail before we respond to what we are seeing. Then the boundary should focus on safety, money, treatment, and trust.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Get help with the conversation",
    nextStepHref: "/book-consultation",
    related: ["how-do-we-talk-without-starting-a-fight", "what-if-loved-one-refuses-treatment", "when-book-private-family-coaching"],
    keywords: ["loved one lying about using", "addiction lying family", "denial addiction family"],
  },
  {
    slug: "should-i-give-an-ultimatum",
    question: "Should I give my loved one an ultimatum?",
    shortAnswer:
      "Do not use an ultimatum you cannot follow through on. A healthier boundary says what you will do if the pattern continues, and it keeps recovery support available.",
    category: "Boundaries",
    deeperAnswer: [
      "Ultimatums often come from fear and exhaustion. Sometimes families need a clear limit, but a threat without follow-through makes the family less credible and the addiction more protected.",
      "A boundary should be specific, calm, and connected to what the family controls. If the consequence is serious, get coaching before making the announcement.",
    ],
    bestNextStep: "private_coaching",
    nextStepLabel: "Build a boundary you can hold",
    nextStepHref: "/book-consultation",
    related: ["should-we-stop-giving-money-addiction", "how-do-we-set-boundaries-with-adult-child", "what-if-family-members-disagree"],
    keywords: ["addiction ultimatum", "should I give ultimatum addiction", "boundaries vs ultimatums addiction"],
  },
];

export const familyAddictionAnswerPath = (answer: FamilyAddictionAnswer) => `/family-addiction-answers/${answer.slug}`;

export const getFamilyAddictionAnswer = (slug: string | undefined) =>
  familyAddictionAnswers.find((answer) => answer.slug === slug);

export const getRelatedFamilyAddictionAnswers = (answer: FamilyAddictionAnswer) =>
  answer.related
    .map((slug) => familyAddictionAnswers.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is FamilyAddictionAnswer => Boolean(candidate));
