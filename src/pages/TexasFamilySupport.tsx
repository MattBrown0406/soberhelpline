import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, Shield, BookOpen, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const faqItems = [
  {
    question: "How do I help a family member with addiction in Texas?",
    answer:
      "The most effective approach combines education, boundary-setting, and evidence-based strategies like CRAFT (Community Reinforcement and Family Training). CRAFT teaches Texas families how to reduce enabling behaviors, communicate effectively, and create conditions that motivate their loved one toward treatment — without confrontation. Texas families can also connect with Al-Anon Texas, Nar-Anon Texas, and Sober Helpline's free Monday night Zoom calls for ongoing support. Texas HHSC (hhs.texas.gov) provides state-funded treatment access. If your loved one is resistant, a professional intervention coach can guide you step by step.",
  },
  {
    question: "Are there free family support groups for addiction in Texas?",
    answer:
      "Yes. Texas has Al-Anon and Nar-Anon meetings across the state, including Houston, Dallas, Austin, San Antonio, Fort Worth, and hundreds of smaller communities. SMART Recovery Family & Friends offers science-based meetings online and in-person. Sober Helpline also offers a free Monday night Zoom call every week at 7PM PST — led by a certified interventionist — open to any Texas family, no sign-up fees or treatment center referrals.",
  },
  {
    question: "What makes Texas's addiction crisis different from other states?",
    answer:
      "Texas has the second-highest total overdose deaths in the US, with 5,000+ per year. Texas's proximity to the southern border means fentanyl enters through multiple corridors — El Paso, Laredo, and the Rio Grande Valley — and quickly reaches Dallas, Houston, and San Antonio. Military communities (Fort Sam Houston, Lackland, Fort Hood) face elevated rates of veteran addiction with PTSD co-occurring disorder. Texas also has significant rural areas with limited treatment access, and large immigrant communities who face barriers to seeking help due to language and stigma.",
  },
  {
    question: "Should I stage an intervention for my loved one in Texas?",
    answer:
      "An intervention may be appropriate when your loved one is in denial, has refused treatment multiple times, or when the situation is becoming dangerous. Confrontational 'surprise' interventions have mixed results. A more effective model is the family-led approach: equip yourself first, set firm boundaries, and create conditions where treatment becomes the logical choice. Sober Helpline offers hourly intervention coaching for Texas families — working directly with an interventionist without the cost of an expensive in-person team.",
  },
  {
    question: "How do I find addiction treatment for my loved one in Texas?",
    answer:
      "Start with Texas Health and Human Services (hhs.texas.gov) for state-funded treatment and Medicaid options. The Texas Crisis Line (1-800-273-8255) provides 24/7 crisis support and referrals. SAMHSA's national helpline (1-800-662-4357) can also connect you with Texas-specific resources. Sober Helpline's free Treatment Finder at soberhelpline.com is a vetted directory of ethical providers with no referral fees.",
  },
];

const cities = [
  { name: "Houston", slug: "houston", description: "Harris County — Texas's largest city, 2.3M" },
  { name: "Dallas", slug: "dallas", description: "Dallas County — DFW anchor, 1.3M" },
  { name: "Austin", slug: "austin", description: "Travis County — Fastest-growing US city" },
  { name: "San Antonio", slug: "san-antonio", description: "Bexar County — Military city, 1.4M" },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description:
    "Family support and intervention coaching for families affected by addiction. Serving Texas families with free resources, Monday night Zoom, and hourly coaching.",
  url: "https://soberhelpline.com/texas-family-support",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "State",
    name: "Texas",
  },
  sameAs: ["https://soberhelpline.com"],
};

export default function TexasFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Texas | Sober Helpline"
        description="Texas families struggling with a loved one's addiction get real help. Support groups, intervention resources, CRAFT therapy, and expert guidance. Free resources available."
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
              Texas Family Addiction Resources
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-logo-green mb-5 leading-tight hero-description">
              Family Support for Addiction in Texas: Resources, Help & Hope
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto hero-description">
              Texas families navigating a loved one's addiction don't need another website that pretends help is easy to find.
              Here's what actually works — and where to start today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Join Free Monday Zoom — 7PM PST
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

        {/* Stats */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-6 text-center">Texas Addiction Crisis: The Reality</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">5,000+</div>
                  <div className="text-sm text-muted-foreground">Overdose deaths per year in Texas</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">#2</div>
                  <div className="text-sm text-muted-foreground">Highest total overdose deaths in the US</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Border</div>
                  <div className="text-sm text-muted-foreground">Fentanyl entry point via El Paso, Laredo & Rio Grande Valley</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed text-center max-w-2xl mx-auto">
              Dallas, Houston, and San Antonio all rank in the top 20 US cities for overdose deaths. Fentanyl from the
              southern border has flooded Texas communities. Military families near Fort Hood, Lackland, and Fort Sam
              Houston face compounding challenges of PTSD and substance use. Texas families need real guidance, not platitudes.
            </p>
          </div>
        </section>

        {/* CRAFT Section */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <Shield className="h-8 w-8 text-primary mb-3" />
                <h2 className="text-2xl font-bold text-logo-green mb-4">What Actually Helps Texas Families</h2>
                <p className="text-muted-foreground mb-4">
                  CRAFT (Community Reinforcement and Family Training) is the most evidence-based approach for
                  families. It teaches you to stop enabling, set real boundaries, and motivate your loved one
                  toward treatment — without ultimatums or confrontation.
                </p>
                <ul className="space-y-3">
                  {[
                    "Identify and stop enabling behaviors that fuel addiction",
                    "Set boundaries with real consequences attached",
                    "Learn communication strategies that reduce conflict",
                    "Create conditions where treatment becomes the logical choice",
                    "Take care of yourself while caring for your loved one",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <BookOpen className="h-8 w-8 text-primary mb-3" />
                <h2 className="text-2xl font-bold text-logo-green mb-4">Texas Crisis Resources</h2>
                <div className="space-y-3">
                  {[
                    { name: "Texas Crisis Line", detail: "1-800-273-8255 — 24/7 statewide crisis support" },
                    { name: "Al-Anon Texas", detail: "Free family support groups statewide" },
                    { name: "Nar-Anon Texas", detail: "Families of narcotics users — statewide meetings" },
                    { name: "Texas HHSC", detail: "hhs.texas.gov — State-funded treatment and Medicaid referrals" },
                    { name: "SAMHSA Helpline", detail: "1-800-662-4357 — Free, confidential, 24/7" },
                  ].map((resource) => (
                    <Card key={resource.name}>
                      <CardContent className="p-4">
                        <p className="font-medium text-logo-green text-sm">{resource.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{resource.detail}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* City Cards */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-6">Texas Cities We Serve</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {cities.map((city) => (
                <Link key={city.slug} to={`/texas/${city.slug}`} className="block group">
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-logo-green group-hover:text-primary transition-colors">{city.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{city.description}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Sober Helpline CTA */}
        <section className="py-10 bg-primary/5 border-y border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-logo-green mb-4">
                  Free Monday Night Family Support Zoom
                </h2>
                <p className="text-muted-foreground mb-4">
                  Every Monday at 7PM PST, Texas families join a free Zoom call led by Matt Brown —
                  a certified interventionist with 20+ years of experience. Ask real questions, get real answers.
                  No treatment center referrals, no sales pitch.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Free — no cost, no commitment",
                    "Anonymous — share what you're comfortable with",
                    "Led by a certified interventionist, not a counselor-in-training",
                    "Families from across Texas welcome",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/monday-zoom-registration">
                    <Button size="lg" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Register for Monday Zoom
                    </Button>
                  </Link>
                  <a href="tel:5418386009">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Phone className="h-4 w-4" />
                      (541) 838-6009
                    </Button>
                  </a>
                </div>
              </div>
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <Heart className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-logo-green mb-2">Need More Than a Group?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Hourly one-on-one coaching with a certified interventionist. Create a real plan,
                  set boundaries that work, and stop letting addiction run your family.
                </p>
                <Link to="/family-coaching">
                  <Button className="w-full gap-2">
                    <Phone className="h-4 w-4" />
                    Schedule Coaching Session
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-10 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-logo-green mb-3">Texas Families: Help Is Here</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              You don't have to wait for a crisis. You don't have to figure this out alone.
              Real support is available right now.
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
