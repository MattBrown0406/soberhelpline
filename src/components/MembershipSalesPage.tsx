import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  DollarSign,
  HeartHandshake,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { trackConversionEvent } from "@/lib/conversionTracking";
import appOverview from "@/assets/membership-app-overview.png";
import crisisCopilot from "@/assets/membership-crisis-copilot.png";

const benefits = [
  {
    icon: BookOpen,
    title: "60+ family education guides",
    description: "Practical help with boundaries, treatment decisions, relapse, family roles, communication, and recovery.",
  },
  {
    icon: MessageCircle,
    title: "Private family forum",
    description: "Use a username instead of your real name. Read, ask questions, and connect with families who understand.",
  },
  {
    icon: Sparkles,
    title: "Guided decision tools",
    description: "Use the Boundary Builder, Enabling Decision Coach, Treatment Navigator, Relapse Guide, and Crisis Copilot.",
  },
  {
    icon: Video,
    title: "Recordings and member sessions",
    description: "Watch past educational sessions on your schedule and keep learning between live meetings.",
  },
  {
    icon: DollarSign,
    title: "$25 off private coaching",
    description: "Members pay $125 instead of $150 for each private session with Matt Brown.",
  },
  {
    icon: CalendarDays,
    title: "A clear place to return",
    description: "Keep your education, tools, community, and next steps together instead of starting over whenever things change.",
  },
];

const trialSteps = [
  {
    label: "Today",
    title: "Create your private account",
    description: "Choose a username, approve the subscription through PayPal, and get member access. You are not charged during the first seven days.",
  },
  {
    label: "Days 1–7",
    title: "Use the membership",
    description: "Explore the education library, forum, recordings, and guided tools. Book private coaching only if you want it.",
  },
  {
    label: "After day 7",
    title: "$10 per month",
    description: "Your monthly membership begins unless you cancel before the trial ends. You can also choose the $149 annual plan at checkout.",
  },
];

const faqs = [
  {
    question: "What is included in the seven-day trial?",
    answer: "The trial gives you member access to the family education library, private forum, recordings, and guided tools. You also receive the member rate for any private coaching session you choose to book during your access period.",
  },
  {
    question: "Will I be charged today?",
    answer: "No. PayPal asks you to approve the subscription when you start, but the first charge is scheduled after the seven-day trial. The monthly price is $10.",
  },
  {
    question: "How do I cancel?",
    answer: "Open Membership & Billing in your member account and select Cancel Membership. Cancelling stops the recurring PayPal charge. You can also contact matt@soberhelpline.com if you need help.",
  },
  {
    question: "Is private coaching included?",
    answer: "Private coaching is booked separately. Members save $25 on every session, paying $125 instead of $150.",
  },
  {
    question: "Do I need a membership to attend The Family Squares on Monday?",
    answer: "No. The live Monday Family Squares meeting remains free. Membership adds the private forum, education library, recordings, guided tools, and coaching discount.",
  },
  {
    question: "Will other members see my real name?",
    answer: "No. You choose a forum username. Your real name, email address, and phone number are not displayed to other members.",
  },
  {
    question: "Who provides the professional guidance?",
    answer: "Sober Helpline is founder-led by Matt Brown, an interventionist with more than 20 years in recovery work. Matt leads The Family Squares and provides the private family coaching sessions, so families are not passed between unfamiliar providers.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const authHref = "/auth?redirect=/family-membership";

function TrialButton({ source, className = "" }: { source: string; className?: string }) {
  return (
    <Button asChild size="lg" className={`w-full gap-2 bg-logo-blue px-7 text-white hover:bg-logo-blue/90 sm:w-auto ${className}`}>
      <Link
        to={authHref}
        onClick={() => trackConversionEvent("membership_trial_click", { source })}
      >
        Start my 7-day free trial
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}

export default function MembershipSalesPage() {
  return (
    <>
      <SEOHead
        title="Family Support Membership | 7 Days Free | Sober Helpline"
        description="Get 60+ family addiction guides, a private forum, guided tools, recordings, and $25 off private coaching. Start with seven days free, then $10 per month."
        jsonLd={faqSchema as any}
      />

      <div className="min-h-screen bg-background">
        <main>
          <section className="relative overflow-hidden border-b bg-gradient-to-br from-logo-blue/10 via-background to-logo-green/10">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-logo-blue/10 blur-3xl" />
            <div className="container relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-logo-green/30 bg-background/80 px-3 py-1.5 text-sm font-semibold text-logo-blue">
                  <HeartHandshake className="h-4 w-4" />
                  Support for the family, even when your loved one is not ready
                </div>
                <h1 className="max-w-3xl text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                  Steady support between the hard moments
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  Membership gives your family practical education, a private community, guided tools, and a consistent place to work out what to do next.
                </p>
                <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <TrialButton source="membership_sales_hero" />
                  <Link to="/auth?redirect=/family-membership" className="text-sm font-medium text-logo-blue hover:underline">
                    Already have an account? Log in
                  </Link>
                </div>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-logo-green" />No charge for seven days</span>
                  <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-logo-green" />Then $10/month</span>
                  <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-logo-green" />Cancel online</span>
                </div>
              </div>

              <Card className="overflow-hidden border-logo-blue/20 shadow-xl">
                <img
                  src={appOverview}
                  alt="Sober Helpline member app dashboard with Family Squares, family tools, and a daily check-in"
                  className="aspect-video w-full object-cover"
                />
                <CardContent className="p-5">
                  <p className="font-semibold text-foreground">One place for the next decision</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Join Monday support, use practical family tools, check in privately, and return to your plan without searching through scattered advice.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-logo-blue">What membership includes</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">Useful support for what families actually face</h2>
              <p className="mt-4 text-muted-foreground">
                Learn at your own pace, ask questions privately, and use the tools when the pressure is high.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <Card key={benefit.title} className="border-logo-green/15">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-logo-blue/10 text-logo-blue">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="border-y bg-muted/35">
            <div className="container mx-auto grid max-w-6xl gap-10 px-4 py-16 md:py-20 lg:grid-cols-2 lg:items-center">
              <Card className="overflow-hidden border-logo-blue/20 shadow-lg">
                <img
                  src={crisisCopilot}
                  alt="Sober Helpline Crisis Copilot showing safety checks and practical next-step guidance"
                  className="aspect-video w-full object-cover"
                />
              </Card>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-logo-blue">See the tools before you join</p>
                <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">Calm guidance when everything feels urgent</h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  Crisis Copilot helps you slow down, check immediate safety, and choose a practical next step. Other tools help you prepare a boundary, respond to requests for money, discuss treatment, and plan for relapse concerns.
                </p>
                <div className="mt-6 rounded-xl border border-logo-green/25 bg-background p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-logo-green" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      These tools support decision-making. They do not replace emergency services, medical care, or professional advice. Call 911 or 988 when someone is in immediate danger.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-logo-blue/10 text-logo-blue">
                  <UserRoundCheck className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-wide text-logo-blue">Founder-led support</p>
                <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">You are not handed off to a stranger</h2>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  Matt Brown leads The Family Squares and provides Sober Helpline's private family coaching. If you move from education to a private session, you work with the same person and do not have to start your story over with a rotating provider.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Matt has more than 20 years in recovery work and 22 years of personal sobriety. The service is personal by design: one consistent approach, direct accountability, and clear boundaries about what Sober Helpline can and cannot provide.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { title: "Direct access", text: "Private sessions are with Matt, not an unknown associate." },
                  { title: "Continuity", text: "The same family philosophy carries across meetings, education, and coaching." },
                  { title: "Accountability", text: "You know who is responsible for the guidance you receive." },
                ].map((item) => (
                  <Card key={item.title} className="h-full border-logo-green/20">
                    <CardContent className="p-5">
                      <Check className="mb-3 h-5 w-5 text-logo-green" />
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="pricing" className="border-y bg-logo-blue/[0.04]">
            <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-logo-blue">Your first seven days</p>
                <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">Try the support before you pay for it</h2>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {trialSteps.map((step) => (
                  <Card key={step.label} className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-logo-blue/10 px-3 py-1 text-sm font-semibold text-logo-blue">
                        <Clock3 className="h-4 w-4" />
                        {step.label}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mx-auto mt-10 max-w-3xl border-2 border-logo-blue/30 shadow-xl">
                <CardContent className="p-7 md:p-9">
                  <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-logo-blue">Family Support Membership</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-foreground">$10</span>
                        <span className="text-muted-foreground">per month after trial</span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">Annual option: $149 per year. Save $30.88 compared with monthly billing.</p>
                      <p className="mt-2 text-sm text-muted-foreground">Secure checkout through PayPal. Manage or cancel recurring billing from your account.</p>
                    </div>
                    <div className="md:text-right">
                      <TrialButton source="membership_sales_pricing" />
                      <p className="mt-2 text-xs text-muted-foreground">No charge during the first seven days.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="container mx-auto max-w-4xl px-4 py-16 md:py-20">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-logo-blue">Family experiences</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">What families are saying</h2>
            </div>
            <TestimonialCarousel />
            <div className="text-center">
              <Link to="/testimonials" className="text-sm font-semibold text-logo-blue hover:underline">Read more family stories</Link>
            </div>
          </section>

          <section className="border-y bg-muted/30">
            <div className="container mx-auto max-w-4xl px-4 py-16 md:py-20">
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-logo-blue">Questions before joining</p>
                <h2 className="mt-2 text-3xl font-bold text-foreground">Membership FAQ</h2>
              </div>
              <Accordion type="single" collapsible className="mt-8 rounded-2xl border bg-background px-5 md:px-7">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          <section className="container mx-auto max-w-5xl px-4 py-16 text-center md:py-20">
            <Lock className="mx-auto h-9 w-9 text-logo-blue" />
            <h2 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">Give your family a steady place to work from</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Start with seven days of access. Use the education, community, and tools. Keep it only if it helps.
            </p>
            <div className="mt-7 flex justify-center">
              <TrialButton source="membership_sales_final" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Prefer to begin without membership? <Link to="/family-squares" className="font-medium text-logo-blue hover:underline">Join the free Monday Family Squares meeting.</Link>
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
