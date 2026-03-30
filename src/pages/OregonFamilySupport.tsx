import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, Shield, BookOpen, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const faqItems = [
  {
    question: "How do I help a family member with addiction in Oregon?",
    answer:
      "The most effective approach combines education, boundary-setting, and evidence-based strategies like CRAFT (Community Reinforcement and Family Training). CRAFT teaches families how to reduce enabling behaviors, communicate effectively, and create conditions that motivate their loved one toward treatment — without confrontation. Oregon families can also connect with Al-Anon, Nar-Anon, and Sober Helpline's free Monday night Zoom calls for ongoing support. If your loved one is resistant to treatment, a professional intervention coach can guide you through the process step by step.",
  },
  {
    question: "Are there free family support groups for addiction in Oregon?",
    answer:
      "Yes. Oregon has Al-Anon meetings across the state (oregonal-anon.org), Nar-Anon groups for families of narcotics users (nar-anon.org), and SMART Recovery Family & Friends meetings. Sober Helpline also offers a free Monday night Zoom call every week at 7PM PST — led by a certified interventionist — open to any Oregon family, no sign-up fees or treatment center referrals.",
  },
  {
    question: "What is enabling and how do I stop it?",
    answer:
      "Enabling means taking actions that protect your loved one from the natural consequences of their addiction — paying their bills, making excuses, covering up their behavior, or bailing them out of crises. While it comes from love, enabling removes the motivation to change. To stop enabling, you set clear boundaries with real consequences attached: 'I will not pay rent if you are actively using.' This is not punishment — it's removing the safety net that lets addiction continue. Sober Helpline coaching helps families identify enabling patterns and replace them with boundary-based responses.",
  },
  {
    question: "Should I stage an intervention for my loved one in Oregon?",
    answer:
      "An intervention may be appropriate when your loved one is in denial, has refused treatment multiple times, or when the situation is becoming dangerous. Confrontational 'surprise' interventions have mixed results. A more effective model is the family-led approach: equip yourself first, set firm boundaries, and create the conditions where treatment becomes the logical choice. Sober Helpline offers hourly intervention coaching for Oregon families — you work directly with an interventionist who helps you prepare without requiring an expensive in-person team.",
  },
  {
    question: "How do I find addiction treatment for my loved one in Oregon?",
    answer:
      "Start with Sober Helpline's free Treatment Finder at soberhelpline.com/treatment-finder — a vetted directory of ethical providers with no referral fees. You can also contact the Oregon Health Authority (oregon.gov/oha) for state-funded treatment options, or call Lines for Life at 1-800-273-8255 for crisis support and referrals. Our Monday night Zoom is a great place to ask questions about Oregon treatment options in a judgment-free environment.",
  },
];

const cities = [
  { name: "Portland", slug: "portland", description: "Multnomah County — Oregon's largest city" },
  { name: "Salem", slug: "salem", description: "Marion County — Oregon's state capital" },
  { name: "Eugene", slug: "eugene", description: "Lane County — University of Oregon area" },
  { name: "Bend", slug: "bend", description: "Deschutes County — Central Oregon" },
  { name: "Medford", slug: "medford", description: "Jackson County — Southern Oregon" },
  { name: "Gresham", slug: "gresham", description: "East Multnomah County" },
  { name: "Hillsboro", slug: "hillsboro", description: "Washington County — Tech corridor" },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description:
    "Family support and intervention coaching for families affected by addiction. Serving Oregon families with free resources, Monday night Zoom, and hourly coaching.",
  url: "https://soberhelpline.com",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressRegion: "OR",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "State",
    name: "Oregon",
  },
  sameAs: ["https://soberhelpline.com"],
};

export default function OregonFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Oregon | Sober Helpline"
        description="Oregon families struggling with a loved one's addiction get real help. Support groups, intervention resources, CRAFT therapy, and expert guidance. Free resources available."
        faqItems={faqItems}
        jsonLd={localBusinessSchema}
        speakableSelectors={["h1", "h2", ".hero-description"]}
      />

      <div className="min-h-screen bg-background">

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-14 md:py-20">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Oregon Family Addiction Resources
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-logo-green mb-5 leading-tight">
              Family Support for Addiction in Oregon: Resources, Help &amp; Hope
            </h1>
            <p className="hero-description text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Oregon is in the middle of an addiction crisis — and families are bearing the weight.
              If someone you love is struggling, you don't have to figure this out alone. Free guidance,
              evidence-based strategies, and real support are available right now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Calendar className="h-4 w-4" />
                  Join Free Monday Zoom — 7PM PST
                </Button>
              </Link>
              <Link to="/family-coaching">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Phone className="h-4 w-4" />
                  Get Intervention Coaching
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Oregon Stats */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-green text-center mb-3">
              Oregon's Addiction Crisis Is a Family Crisis
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              The numbers are sobering — but behind every statistic is a family that needs support.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">1,833</div>
                  <div className="font-semibold text-logo-green mb-1">Overdose Deaths</div>
                  <div className="text-sm text-muted-foreground">in Oregon in 2023 — among the highest per-capita rates in the nation</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">330,000</div>
                  <div className="font-semibold text-logo-green mb-1">Oregonians Affected</div>
                  <div className="text-sm text-muted-foreground">currently living with a substance use disorder, spanning every county</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">3 in 10</div>
                  <div className="font-semibold text-logo-green mb-1">Families Impacted</div>
                  <div className="text-sm text-muted-foreground">nearly one-third of Oregon families have been directly affected by a loved one's addiction</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* You Are Not Alone */}
        <section className="py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-logo-green mb-4">
                  You Are Not Alone
                </h2>
                <p className="text-muted-foreground mb-4">
                  Living with a loved one's addiction is exhausting in ways that are hard to explain to anyone who hasn't been through it.
                  The sleepless nights. The broken promises. The impossible choice between helping and enabling.
                  The shame that keeps families silent.
                </p>
                <p className="text-muted-foreground mb-6">
                  Oregon families face this every day. And too many suffer in isolation, convinced they're the only ones, convinced nothing will change.
                  That's not the truth. Change is possible — and it often starts with the family, not the person using.
                </p>
                <ul className="space-y-3">
                  {[
                    "Feeling trapped between love and self-protection",
                    "Wondering if your help is actually enabling",
                    "Exhausted from covering for your loved one",
                    "Isolated — afraid to tell friends or family",
                    "Financial strain from the cost of addiction",
                    "Despair after multiple treatment attempts",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <Heart className="h-10 w-10 text-primary mb-4" />
                <blockquote className="text-lg italic text-foreground mb-4">
                  "We don't teach families to control their loved ones. We teach them to stop letting addiction control them."
                </blockquote>
                <p className="text-sm text-muted-foreground">— Matt Brown, Certified Interventionist &amp; Founder, Sober Helpline</p>
                <div className="mt-6">
                  <a href="tel:5418386009" className="flex items-center gap-2 text-primary font-semibold hover:underline">
                    <Phone className="h-4 w-4" />
                    (541) 838-6009
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Oregon Family Resources */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-green text-center mb-3">
              Oregon Family Addiction Resources
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Free, established resources available to Oregon families right now.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Al-Anon Oregon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Weekly in-person and online meetings for family members of people with alcohol use disorder.
                    Free, anonymous, and available across Oregon.
                  </p>
                  <a
                    href="https://oregonal-anon.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                  >
                    oregonal-anon.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Nar-Anon Oregon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Support groups for families and friends of people struggling with narcotics or drug addiction.
                    Regular meetings statewide.
                  </p>
                  <a
                    href="https://www.nar-anon.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                  >
                    nar-anon.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <BookOpen className="h-4 w-4 text-primary" />
                    SMART Recovery Family &amp; Friends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Science-based alternative to Al-Anon. Teaches practical tools for families using CRAFT
                    and cognitive-behavioral strategies.
                  </p>
                  <a
                    href="https://www.smartrecovery.org/family/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                  >
                    smartrecovery.org/family <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Shield className="h-4 w-4 text-primary" />
                    Oregon Health Authority
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    State-funded addiction treatment resources, Medicaid-covered programs, and county behavioral
                    health services across Oregon.
                  </p>
                  <a
                    href="https://www.oregon.gov/oha/hsd/amh/pages/index.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                  >
                    oregon.gov/oha <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Phone className="h-4 w-4 text-primary" />
                    Lines for Life Crisis Line — 24/7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Oregon's statewide crisis line for mental health and substance use emergencies. 
                    Free, confidential, available 24 hours a day. Also has an alcohol and drug helpline.
                  </p>
                  <a
                    href="tel:18002738255"
                    className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    1-800-273-8255
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CRAFT vs Traditional */}
        <section className="py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-green text-center mb-3">
              What Works: CRAFT vs. Traditional Approaches
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Not all family approaches are equal. Research shows CRAFT outperforms confrontational interventions.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-destructive text-base">Traditional Confrontational Approaches</CardTitle>
                  <CardDescription>What most people think of as "an intervention"</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      Surprise ambush format increases shame and defensiveness
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      Ultimatums without preparation often aren't followed through
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      High-pressure tactics can damage family relationships
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✗</span>
                      Engagement rates under 30% in some studies
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-logo-green text-base">CRAFT (Community Reinforcement &amp; Family Training)</CardTitle>
                  <CardDescription>Evidence-based family intervention model</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      Teaches families to reinforce sober behavior, not the addiction
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      Reduces enabling patterns and communication triggers
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      64–74% treatment engagement rate in clinical trials
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      Improves family wellbeing even if loved one doesn't immediately enter treatment
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-muted-foreground mt-6 text-sm">
              Sober Helpline's coaching is grounded in CRAFT principles and 20+ years of intervention experience.
            </p>
          </div>
        </section>

        {/* Monday Night Zoom */}
        <section className="py-12 bg-primary/5 border-y border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Calendar className="h-3.5 w-3.5" />
                  Every Monday — 7:00 PM PST
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-logo-green mb-4">
                  Free The Family Squares Zoom
                </h2>
                <p className="text-muted-foreground mb-4">
                  Every Monday at 7PM PST, families across Oregon (and nationwide) join a free Zoom call 
                  led by Matt Brown — a certified interventionist with 20+ years of experience.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "No cost. No sign-up fees. No sales pitch.",
                    "No treatment center names or referral pressure",
                    "Ask real questions, get real answers",
                    "Connect with other Oregon families going through the same thing",
                    "Anonymous — share only what you're comfortable with",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/monday-zoom-registration">
                  <Button size="lg" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Register for This Monday's Zoom
                  </Button>
                </Link>
              </div>
              <div className="bg-white rounded-xl border border-primary/20 p-6 shadow-sm">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-1">FREE</div>
                  <div className="text-lg font-semibold text-logo-green mb-1">Monday Night Zoom</div>
                  <div className="text-muted-foreground text-sm mb-4">Every Monday at 7:00 PM PST</div>
                  <div className="border-t border-border pt-4 space-y-2 text-sm text-muted-foreground text-left">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Open to all Oregon families
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Led by certified interventionist
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      No judgment. No shame. No agenda.
                    </div>
                  </div>
                  <Link to="/monday-zoom-registration" className="block mt-6">
                    <Button className="w-full">Reserve Your Spot</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coaching */}
        <section className="py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-logo-green mb-4">
                  Hourly Intervention Coaching
                </h2>
                <p className="text-muted-foreground mb-4">
                  Sometimes families need more than a support group. They need a strategy.
                  Sober Helpline offers hourly one-on-one coaching with a certified interventionist — 
                  a practical alternative to expensive in-person intervention teams.
                </p>
                <p className="text-muted-foreground mb-6">
                  Our philosophy: <strong>equip the family first.</strong> In most cases, when families 
                  learn the right tools and set real boundaries, their loved one's motivation to seek 
                  treatment increases — no dramatic confrontation required.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "One-on-one coaching with Matt Brown, certified interventionist",
                    "Identify enabling patterns specific to your family situation",
                    "Create a boundary plan with real consequences",
                    "Learn evidence-based communication strategies (CRAFT)",
                    "Prepare for the conversation — and what comes after",
                    "Available by phone or video — anywhere in Oregon",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/family-coaching">
                    <Button size="lg" className="gap-2">
                      <Phone className="h-4 w-4" />
                      Schedule Coaching
                    </Button>
                  </Link>
                  <a href="tel:5418386009">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Phone className="h-4 w-4" />
                      Call (541) 838-6009
                    </Button>
                  </a>
                </div>
              </div>
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-logo-green mb-3">Who This Is For</h3>
                  <ul className="space-y-3">
                    {[
                      "You've tried talking to them and nothing works",
                      "You're not sure if you're helping or enabling",
                      "They've been to treatment before and relapsed",
                      "You're exhausted and need a clear plan",
                      "You want professional guidance without a huge financial commitment",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Treatment Finder:</strong> Looking for Oregon treatment options? 
                      Search our free, vetted provider directory.
                    </p>
                    <Link to="/inpatient-treatment" className="text-primary text-sm hover:underline inline-block mt-2">
                      Browse Oregon Treatment Providers →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* City Cards */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-green text-center mb-3">
              Oregon City-Specific Resources
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Find addiction family support resources specific to your city in Oregon.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  to={`/oregon/${city.slug}`}
                  className="block group"
                >
                  <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-logo-green group-hover:text-primary transition-colors">
                              {city.name}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{city.description}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-green text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqItems.map((item, i) => (
                <div key={i} className="border-b border-border pb-6 last:border-0">
                  <h3 className="font-semibold text-foreground mb-2">{item.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-logo-green mb-3">
              Oregon Families: Help Is Here
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              You don't have to wait for a crisis. You don't have to figure this out alone.
              Join thousands of families who've found clarity, direction, and hope through Sober Helpline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Join Free Monday Zoom
                </Button>
              </Link>
              <a href="tel:5418386009">
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call (541) 838-6009
                </Button>
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
