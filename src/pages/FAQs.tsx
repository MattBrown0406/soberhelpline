import { Link } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { Helmet } from "react-helmet-async";
import logo from "@/assets/logo.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string | React.ReactNode;
}

const faqs: FAQ[] = [
  {
    question: "How do I know if my loved one is really addicted and not \"just partying\" or stressed?",
    answer: (
      <>
        Addiction is characterized by a pattern of compulsive use despite negative consequences. Key warning signs include:
        {"\n\n"}
        • Loss of control over how much or how often they use{"\n"}
        • Continued use despite problems at work, school, or in relationships{"\n"}
        • Withdrawal symptoms when not using{"\n"}
        • Tolerance (needing more to get the same effect){"\n"}
        • Giving up activities they once enjoyed{"\n"}
        • Failed attempts to cut back or stop
        {"\n\n"}
        If substance use is causing problems in their life and they continue anyway, it's likely more than just "partying." The DSM-5 criteria suggest that meeting 2 or more of 11 specific criteria over a 12-month period indicates a substance use disorder. Our <Link to="/addiction-assessment" className="text-primary hover:underline font-medium">Addiction Assessment</Link> tool can help you identify these warning signs.
      </>
    )
  },
  {
    question: "What is the first step I should take if I'm worried about their drinking or drug use?",
    answer: (
      <>
        The first step is to educate yourself about addiction and gather support for yourself. Consider:
        {"\n\n"}
        • Learning about addiction as a disease, not a moral failing{"\n"}
        • Documenting specific incidents and patterns you've observed{"\n"}
        • Reaching out to a professional interventionist or addiction counselor for guidance{"\n"}
        • Connecting with support groups like <a href="https://al-anon.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Al-Anon</a> or <a href="https://www.nar-anon.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Nar-Anon</a> for families{"\n"}
        • Attending a FREE family support zoom meeting offered by the interventionists at <a href="https://interventiononcall.com/live-family-friends-zoom/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Intervention On Call</a>{"\n"}
        • Planning a calm, private conversation when they're sober
        {"\n\n"}
        Avoid confronting them when they're intoxicated or in a public setting. Having professional guidance before your first conversation can make a significant difference in the outcome.
      </>
    )
  },
  {
    question: "How do I talk to my loved one about getting help without pushing them away?",
    answer: `Effective communication requires planning and emotional preparation:

• Choose the right time: When they're sober, calm, and you have privacy
• Use "I" statements: "I feel scared when..." instead of "You always..." or "You need..."
• Express love and concern, not judgment or ultimatums
• Be specific about behaviors you've observed, not character attacks
• Listen more than you speak
• Avoid arguing, lecturing, or bringing up past failures
• Have treatment options ready to present
• Set a clear boundary about what happens if they refuse

Remember, you cannot force someone into recovery, but you can create conditions that make choosing recovery easier than continuing to use.`
  },
  {
    question: "What is an intervention, and how does it actually work?",
    answer: `An intervention is a structured conversation where loved ones come together to motivate someone to accept treatment. Here's how it typically works:

• A professional interventionist guides the family through preparation
• Each participant writes a letter expressing love, specific concerns, and boundaries
• The group rehearses to ensure a calm, unified approach
• Treatment arrangements are made in advance so they can leave immediately
• The intervention is conducted with the goal of creating hope and a willingness to change
• The interventionist is almost always the person who will transport the individual to the designated treatment facility on the day of the intervention
• In many cases the interventionist will continue to work with the family through the end of treatment to make sure the family has the support they need should the client want to leave treatment before completion

Who attends: Close family members, friends, and sometimes employers who are directly affected. The interventionist helps determine who should participate.

Professional interventionists bring experience, objectivity, and proven techniques like ARISE, Johnson Model, or Invitational approaches. They help manage emotions and increase the likelihood of acceptance.`
  },
  {
    question: "What are my options for treatment, and how do I choose the right program?",
    answer: `Treatment options vary based on severity, co-occurring conditions, and individual needs:

**Levels of Care:**
• Medical Detox: Medically supervised withdrawal management
• Inpatient/Residential: 24/7 care in a treatment facility (typically 30-90 days)
• Partial Hospitalization (PHP): Intensive day treatment while living at home or sober living
• Intensive Outpatient (IOP): Several hours of treatment multiple days per week
• Outpatient: Regular therapy and group sessions while maintaining daily life

**Key Considerations:**
• Dual-diagnosis capability for co-occurring mental health conditions
• Evidence-based approaches (CBT, DBT, EMDR, etc.)
• Insurance coverage and payment options
• Location and family involvement opportunities
• Aftercare planning and alumni support
• Staff credentials and accreditation

A professional can help assess the appropriate level of care based on your loved one's specific situation.`
  },
  {
    question: "What's the difference between helping and enabling? Am I making things worse?",
    answer: (
      <>
        This is one of the most common and painful questions families face.
        {"\n\n"}
        **Enabling** protects someone from the consequences of their addiction, making it easier to continue using:{"\n"}
        • Paying their bills or rent{"\n"}
        • Making excuses for missed work or events{"\n"}
        • Lying to cover up their behavior{"\n"}
        • Bailing them out of legal trouble{"\n"}
        • Providing housing without conditions
        {"\n\n"}
        **Helping** supports their recovery without removing natural consequences:{"\n"}
        • Offering to drive them to treatment or meetings{"\n"}
        • Paying directly for treatment (not giving them cash){"\n"}
        • Maintaining your own boundaries and well-being{"\n"}
        • Expressing love while refusing to participate in their addiction
        {"\n\n"}
        Stopping enabling is NOT abandoning them. It's allowing reality to become their teacher. This is incredibly difficult, and working with a therapist or attending family support groups like <a href="https://al-anon.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Al-Anon</a>, <a href="https://www.nar-anon.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Nar-Anon</a>, or <a href="https://interventiononcall.com/live-family-friends-zoom/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Intervention On Call</a> can help you navigate this transition.
      </>
    )
  },
  {
    question: "What boundaries should I set, and how do I follow through on them?",
    answer: `Boundaries protect you and create clarity for everyone involved. Examples include:

**Common Boundaries:**
• "I will not give you money."
• "You cannot live here if you're actively using."
• "I will not lie or make excuses for you."
• "I will leave the conversation if you're intoxicated."
• "I will not bail you out of jail."

**Keys to Following Through:**
• Write down your boundaries so you remember them in emotional moments
• Communicate them clearly when your loved one is sober
• Expect pushback—they will test your limits
• Have a support system to help you stay strong
• Understand that boundaries are an act of love, not punishment
• Seek therapy or support groups to process your own feelings

Remember: A boundary without a consequence is just a suggestion. Be prepared to follow through, even when it's heartbreaking.`
  },
  {
    question: "What do I do if my addicted loved one doesn't have insurance?",
    answer: (
      <>
        Lack of insurance doesn't mean your loved one can't get help. There are several options to explore:
        {"\n\n"}
        **Self-Pay and Sliding Scale Options:**{"\n"}
        • Many treatment centers offer sliding scale fees based on income{"\n"}
        • Some facilities offer payment plans to make treatment more affordable{"\n"}
        • Look for providers on our directory who accept self-pay and offer sliding scale options
        {"\n\n"}
        **State-Funded and Non-Profit Programs:**{"\n"}
        • Most states have publicly funded treatment programs{"\n"}
        • Salvation Army Adult Rehabilitation Centers offer free long-term treatment{"\n"}
        • Faith-based programs like Adult & Teen Challenge offer free or low-cost care{"\n"}
        • Community health centers may offer substance abuse services on a sliding scale
        {"\n\n"}
        **Getting Insurance:**{"\n"}
        • Medicaid may be available based on income (apply at <a href="https://www.healthcare.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">healthcare.gov</a> or your state's Medicaid office){"\n"}
        • The Affordable Care Act marketplace offers subsidized plans during open enrollment{"\n"}
        • Some treatment centers have staff who can help navigate insurance enrollment
        {"\n\n"}
        **Other Resources:**{"\n"}
        • SAMHSA's National Helpline (1-800-662-4357) offers free referrals 24/7{"\n"}
        • 12-step programs like AA and NA are always free{"\n"}
        • Some interventionists and sober coaches offer payment plans
      </>
    )
  },
  {
    question: "What should I expect during treatment and early recovery?",
    answer: (
      <>
        Understanding the process helps you support without smothering:
        {"\n\n"}
        **During Treatment:**{"\n"}
        • Detox may take 3-10 days depending on substances used{"\n"}
        • Limited communication initially (often "blackout" periods){"\n"}
        • Family sessions are typically offered—participate if possible{"\n"}
        • Your loved one may seem worse before they get better as emotions surface{"\n"}
        • Treatment is the beginning, not the end, of recovery{"\n"}
        • Be prepared for requests to leave treatment early. Have a plan for what you will say when this happens. If you don't know what to say, speak with an interventionist, therapist, or sober coach who can help you.
        {"\n\n"}
        **Early Recovery (First Year):**{"\n"}
        • Relapse risk is highest in the first 90 days{"\n"}
        • They need structure: Outpatient, Sober Living, Meetings, Therapy, and Sober Support{"\n"}
        • Mood swings and emotional volatility are normal{"\n"}
        • They're learning to live without their primary coping mechanism{"\n"}
        • Recovery is their responsibility—<span className="underline">you can support but not do it for them</span>
        {"\n\n"}
        **How to Help:**{"\n"}
        • Attend family support groups{"\n"}
        • Learn about addiction and recovery{"\n"}
        • Celebrate milestones without creating pressure{"\n"}
        • Be patient with the process{"\n"}
        • Focus on your own healing too{"\n"}
        • Set clear expectations around sobriety and behaviors that have been harmful in the past. Accountability is important.
      </>
    )
  },
  {
    question: "What can I do for myself while my loved one is using or in treatment?",
    answer: `You deserve support regardless of what your loved one chooses. Prioritizing your own well-being is not selfish—it's essential.

**Self-Care Actions:**
• Attend Al-Anon, Nar-Anon, or other family support groups
• Find a therapist who understands addiction and family dynamics
• Educate yourself about addiction and codependency
• Maintain your own health: sleep, nutrition, exercise
• Stay connected with friends and activities you enjoy
• Set boundaries to protect your mental and financial health

**Important Truths:**
• You did not cause their addiction
• You cannot control their addiction
• You cannot cure their addiction
• You CAN focus on your own recovery and growth

Many families find that their own healing journey transforms their relationships and creates conditions more conducive to their loved one's recovery.`
  },
  {
    question: "What happens if they refuse help or relapse after treatment?",
    answer: `Refusal and relapse are common parts of the addiction journey. Here's how to respond:

**If They Refuse Help:**
• Maintain your boundaries—this is when they matter most
• Let natural consequences occur
• Keep the door open for when they're ready
• Consider whether a professional intervention might help
• Focus on your own recovery and well-being
• Remember: You cannot want recovery more than they do

**If They Relapse:**
• Assess the severity—do they need medical attention or detox?
• Avoid shame and blame; express concern and love
• Review and potentially tighten boundaries
• Reconnect with their treatment team or find new support
• Encourage them to return to meetings, therapy, or treatment
• Consider a higher level of care if the previous approach wasn't sufficient

**When to Re-engage Professional Help:**
• Overdose or medical emergency
• Dangerous behavior to self or others
• Complete disengagement from recovery supports
• Escalating use patterns
• Your own distress reaching crisis levels

Recovery is rarely a straight line. Each attempt at sobriety can build toward lasting change.`
  }
];

export default function FAQs() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>FAQs - Addiction & Recovery Questions | Sober Helpline</title>
        <meta name="description" content="Frequently asked questions about addiction, intervention, treatment options, enabling vs. helping, setting boundaries, and supporting a loved one in recovery." />
      </Helmet>

      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </div>
            <Link to="/">
              <img src={logo} alt="Sober Helpline" className="h-12 md:h-16" />
            </Link>
            <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">(541) 241-5886</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Answers to common questions families have about addiction, intervention, treatment, and supporting a loved one in recovery.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-primary py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 whitespace-pre-line">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Call to Action */}
        <div className="mt-12 bg-primary/10 rounded-lg p-6 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
            Need More Help?
          </h2>
          <p className="text-muted-foreground mb-4">
            Our team is here to guide you through the process of finding the right help for your loved one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:541-241-5886"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-5 w-5" />
              Call (541) 241-5886
            </a>
            <Link
              to="/addiction-assessment"
              className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-lg hover:bg-accent transition-colors"
            >
              Take the Addiction Assessment
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}