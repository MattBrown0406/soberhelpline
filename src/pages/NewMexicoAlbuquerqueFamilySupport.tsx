import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Albuquerque, New Mexico affected by addiction.",
  url: "https://soberhelpline.com/new-mexico/albuquerque",
  telephone: "+14582027900",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Albuquerque",
    addressRegion: "NM",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Albuquerque",
  },
};

const otherCities = [
  { name: "Santa Fe", slug: "santa-fe" },
  { name: "Las Cruces", slug: "las-cruces" },
];

export default function NewMexicoAlbuquerqueFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Albuquerque, New Mexico | Sober Helpline"
        description="Families in Albuquerque struggling with a loved one's addiction get expert support, resources, and guidance from Sober Helpline. Free “The Family Squares”. (458) 202-7900."
        jsonLd={localBusinessSchema}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <nav className="container max-w-4xl mx-auto px-4 py-3 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link to="/new-mexico-family-support" className="hover:text-primary">New Mexico Family Support</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground font-medium">Albuquerque</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Albuquerque, New Mexico — Bernalillo County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-5 leading-tight">
              Addiction Family Support in Albuquerque, New Mexico
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Albuquerque and Bernalillo County — home to approximately 565,000 people — has the highest overdose rate
              of any major US city per capita. Fentanyl, methamphetamine, and heroin have devastated communities across
              the city, with large Native American and Latino populations disproportionately impacted. Families in
              Albuquerque are navigating one of the most severe addiction crises in the country — and deserve real support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Join Free Monday Zoom — 7PM PST
                </Button>
              </Link>
              <Link to="/family-coaching">
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Get Coaching
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Albuquerque Context */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-blue mb-4">Albuquerque's Addiction Landscape</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">~565K</div>
                  <div className="text-sm text-muted-foreground">Bernalillo County population, NM's largest city</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">#1</div>
                  <div className="text-sm text-muted-foreground">Highest overdose rate per capita of any major US city</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">3 Drugs</div>
                  <div className="text-sm text-muted-foreground">Fentanyl, meth & heroin all contributing to deaths simultaneously</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Albuquerque's addiction crisis is driven by poverty, geographic isolation, and proximity to drug trafficking routes.
              Native American communities experience addiction at significantly higher rates due to historical trauma and lack of
              culturally appropriate treatment options. Latino families often face cultural barriers to seeking help — including
              stigma and fear around disclosure. Sober Helpline's approach is compassionate, culturally aware, and shame-free.
            </p>
          </div>
        </section>

        {/* Albuquerque Resources */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-blue mb-6">Albuquerque Family Addiction Resources</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Presbyterian Behavioral Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Presbyterian Healthcare Services provides behavioral health and substance use treatment
                    across Albuquerque, including inpatient, outpatient, and crisis services.
                  </p>
                  <a href="https://www.phs.org/behavioral-health" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    phs.org/behavioral-health <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue text-base">
                    <Users className="h-4 w-4 text-primary" />
                    UNM Center on Alcoholism, Substance Abuse & Addictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    CASAA at the University of New Mexico is a nationally recognized research and treatment
                    center providing evidence-based addiction treatment and family support resources.
                  </p>
                  <a href="https://casaa.unm.edu" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    casaa.unm.edu <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue text-base">
                    <Users className="h-4 w-4 text-primary" />
                    First Step Homes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Provides transitional housing and recovery support services for men in Albuquerque
                    dealing with substance use disorders. Useful referral for families seeking aftercare options.
                  </p>
                  <a href="https://www.firststephomes.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    firststephomes.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Bernalillo County Behavioral Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    County-funded behavioral health services providing mental health and substance use treatment
                    for Bernalillo County residents, including Medicaid-covered programs.
                  </p>
                  <a href="https://www.bernco.gov/behavioral-health" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    bernco.gov/behavioral-health <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-blue text-base">
                    <Phone className="h-4 w-4 text-primary" />
                    New Mexico Crisis Line — 24/7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    New Mexico's statewide crisis line is available 24/7 for mental health and substance use emergencies in Albuquerque.
                    SAMHSA National Helpline also available: 1-800-662-4357.
                  </p>
                  <a href="tel:18556627474"
                    className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                    <Phone className="h-4 w-4" />
                    1-855-662-7474
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Sober Helpline CTA */}
        <section className="py-10 bg-primary/5 border-y border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-logo-blue mb-4">
                  Free “The Family Squares” Zoom
                </h2>
                <p className="text-muted-foreground mb-4">
                  Every Monday at 7PM PST, Albuquerque families join a free Zoom call led by Matt Brown —
                  a certified interventionist with 20+ years of experience. Ask real questions, get real answers.
                  No treatment center referrals, no sales pitch.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Free — no cost, no commitment",
                    "Anonymous — share what you're comfortable with",
                    "Culturally aware, shame-free environment",
                    "Led by a certified interventionist",
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
                  <a href="tel:4582027900">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Phone className="h-4 w-4" />
                      (458) 202-7900
                    </Button>
                  </a>
                </div>
              </div>
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <Heart className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-logo-blue mb-2">Need More Than a Group?</h3>
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

        {/* Other NM Cities */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-logo-blue mb-4">Other New Mexico Cities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherCities.map((city) => (
                <Link key={city.slug} to={`/new-mexico/${city.slug}`} className="block group">
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium text-logo-blue group-hover:text-primary transition-colors">{city.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/new-mexico-family-support" className="text-primary text-sm hover:underline">
                ← Back to New Mexico Family Support
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-10 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-logo-blue mb-3">Albuquerque Families: Help Is Here</h2>
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
              <a href="tel:4582027900">
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call (458) 202-7900
                </Button>
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
