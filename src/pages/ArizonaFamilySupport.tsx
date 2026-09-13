import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, Shield, BookOpen, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppLink from "@/components/WhatsAppLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import RegionalFamilySupportOptions from "@/components/RegionalFamilySupportOptions";

const faqItems = [
  {
    "question": "Is Sober Helpline based in a local Arizona office?",
    "answer": "This page describes remote support available to families in Arizona, not a staffed local office. Family Squares meets online, and private coaching is available by phone or video."
  },
  {
    "question": "Which Sober Helpline support is free for Arizona families?",
    "answer": "Monday Family Squares is a free online family-support meeting at 7 PM Pacific. Family education membership is paid, and private coaching is booked separately. Review current membership terms and coaching rates before purchasing."
  },
  {
    "question": "Where can I look for local resources in Arizona?",
    "answer": "The Arizona resource section below links to outside organizations and existing city guides. Check with each organization for current meeting times, eligibility, costs, and availability; these are not Sober Helpline offices."
  }
];

const cities = [
  { name: "Phoenix", slug: "phoenix", description: "Maricopa County" },
  { name: "Tucson", slug: "tucson", description: "Pima County" },
  { name: "Scottsdale", slug: "scottsdale", description: "Maricopa County" },
];

const familySupportSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Remote family support for Arizona",
  "serviceType": "Family education and coaching",
  "description": "Remote family education and coaching available to families in Arizona.",
  "url": "https://soberhelpline.com/arizona-family-support",
  "provider": {
    "@type": "Organization",
    "name": "Sober Helpline",
    "url": "https://soberhelpline.com"
  },
  "areaServed": {
    "@type": "State",
    "name": "Arizona"
  }
};

export default function ArizonaFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Arizona | Sober Helpline"
        description="Remote family support for Arizona: free Monday Family Squares, paid education membership, private coaching, and state resource links. No local office."
        canonicalPath="/arizona-family-support"
        faqItems={faqItems}
        jsonLd={familySupportSchema}
        speakableSelectors={["h1", "h2", ".hero-description"]}
      />

      <div className="min-h-screen bg-background">

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-14 md:py-20">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Arizona Family Addiction Resources
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-logo-blue mb-5 leading-tight">
              Family Support for Addiction in Arizona: Resources, Help &amp; Hope
            </h1>
            <p className="hero-description text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Families in Arizona can connect with Sober Helpline by phone or online for education and coaching. Start with the free Monday Family Squares meeting, compare paid support options, or use the state resource links below. This page describes remote support, not a local office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Calendar className="h-4 w-4" />
                  Join Free Monday Zoom — 7PM Pacific
                </Button>
              </Link>
              <Link to="/family-coaching">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Phone className="h-4 w-4" />
                  Explore Family Coaching
                </Button>
              </Link>
            </div>
          </div>
        </section>


        {/* You Are Not Alone */}
        <section className="py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-logo-blue mb-4">
                  You Are Not Alone
                </h2>
                <p className="text-muted-foreground mb-4">
                  Living with a loved one's addiction is exhausting in ways that are hard to explain to anyone who hasn't been through it.
                  The sleepless nights. The broken promises. The impossible choice between helping and enabling.
                  The shame that keeps families silent.
                </p>
                <p className="text-muted-foreground mb-6">
                  Support is available to your family in Arizona, even if you are not sure what to do next. You can ask questions about your own needs without committing to a paid service.
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
                  <a href="tel:4582988008" className="flex items-center gap-2 text-primary font-semibold hover:underline">
                    <Phone className="h-4 w-4" />
                    (458) 298-8008
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Arizona Resources */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-blue text-center mb-3">
              Arizona Family Addiction Resources
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Free, established resources available to Arizona families right now.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue text-base">
                    <Phone className="h-4 w-4 text-primary" />
                    Arizona Crisis Line — 24/7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Arizona's statewide crisis line for mental health and substance use emergencies.
                    Free, confidential, available 24 hours a day. If your loved one or you need immediate help, call now.
                  </p>
                  <a
                    href="tel:18445344673"
                    className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    1-844-534-4673
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Al-Anon Arizona
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Weekly in-person and online meetings for family members of people with alcohol use disorder.
                    Free, anonymous, and available across Arizona — Phoenix, Tucson, Scottsdale, and beyond.
                  </p>
                  <a
                    href="https://al-anon.org/find-a-meeting"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                  >
                    al-anon.org/find-a-meeting <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Nar-Anon Arizona
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Support groups for families and friends of people struggling with narcotics or drug addiction.
                    Regular meetings statewide, including virtual options.
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
                  <CardTitle className="flex items-center gap-2 text-logo-blue text-base">
                    <Shield className="h-4 w-4 text-primary" />
                    AHCCCS Behavioral Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Arizona's Medicaid program covering behavioral health and substance use treatment.
                    If your loved one is uninsured or low-income, AHCCCS may cover residential and outpatient treatment.
                  </p>
                  <a
                    href="https://www.azahcccs.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                  >
                    azahcccs.gov <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue text-base">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Crisis Text Line
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Free, confidential crisis support available 24/7 via text. Available to anyone in
                    Arizona — whether it's your loved one in crisis or you needing immediate support.
                  </p>
                  <p className="text-primary font-semibold text-sm">
                    Text HOME to 741741
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <RegionalFamilySupportOptions state="Arizona" />

        {/* “The Family Squares” */}
        <section className="py-12 bg-primary/5 border-y border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Calendar className="h-3.5 w-3.5" />
                  Every Monday — 7:00 PM Pacific
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-logo-blue mb-4">
                  Free “The Family Squares” Zoom
                </h2>
                <p className="text-muted-foreground mb-4">
                  Every Monday at 7PM Pacific, families across Arizona (and nationwide) join a free Zoom call
                  led by Matt Brown — a certified interventionist with 20+ years of experience.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "No cost. No sign-up fees. No sales pitch.",
                    "No treatment center names or referral pressure",
                    "Ask real questions, get real answers",
                    "Connect with families joining from different places",
                    "Share only what you're comfortable with",
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
                  <div className="text-lg font-semibold text-logo-blue mb-1">“The Family Squares”</div>
                  <div className="text-muted-foreground text-sm mb-4">Every Monday at 7:00 PM Pacific</div>
                  <div className="border-t border-border pt-4 space-y-2 text-sm text-muted-foreground text-left">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Open to all Arizona families
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
                <h2 className="text-2xl md:text-3xl font-bold text-logo-blue mb-4">
                  Private Family Coaching
                </h2>
                <p className="text-muted-foreground mb-4">
                  Private coaching is a paid, one-on-one service for family members who want to discuss their situation by phone or video. Review the session details and availability before booking.
                </p>
                <p className="text-muted-foreground mb-6">
                  Coaching focuses on your questions about communication, boundaries, and next steps. It is not therapy or medical treatment, and it does not guarantee that a loved one will enter treatment.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "One-on-one coaching with Matt Brown, certified interventionist",
                    "Identify enabling patterns specific to your family situation",
                    "Discuss boundaries in your family situation",
                    "Talk through communication questions",
                    "Prepare for the conversation — and what comes after",
                    "Available by phone or video — anywhere in Arizona",
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
                  <a href="tel:4582988008">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Phone className="h-4 w-4" />
                      Call (458) 298-8008
                    </Button>
                  </a>
            <WhatsAppLink source="arizona_cta_1" variant="button" />
                </div>
              </div>
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-logo-blue mb-3">Who This Is For</h3>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* City Cards */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-blue text-center mb-3">
              Arizona City-Specific Resources
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Find addiction family support resources specific to your city in Arizona.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  to={`/arizona/${city.slug}`}
                  className="block group"
                >
                  <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-logo-blue group-hover:text-primary transition-colors">
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
            <h2 className="text-2xl md:text-3xl font-bold text-logo-blue text-center mb-8">
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
            <h2 className="text-2xl md:text-3xl font-bold text-logo-blue mb-3">
              Arizona Families: Help Is Here
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              You don't have to wait for a crisis. You don't have to figure this out alone.
              Explore the free group meeting and paid support options at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Join Free Monday Zoom
                </Button>
              </Link>
              <a href="tel:4582988008">
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call (458) 298-8008
                </Button>
              </a>
            <WhatsAppLink source="arizona_cta_2" variant="button" />
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
