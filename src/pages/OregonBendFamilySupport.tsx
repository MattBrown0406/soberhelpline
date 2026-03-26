import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Bend, Oregon affected by addiction.",
  url: "https://soberhelpline.com/oregon/bend",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bend",
    addressRegion: "OR",
    addressCountry: "US",
  },
  areaServed: { "@type": "City", name: "Bend" },
};

const otherCities = [
  { name: "Portland", slug: "portland" },
  { name: "Salem", slug: "salem" },
  { name: "Eugene", slug: "eugene" },
  { name: "Medford", slug: "medford" },
  { name: "Gresham", slug: "gresham" },
  { name: "Hillsboro", slug: "hillsboro" },
];

export default function OregonBendFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Bend, Oregon | Sober Helpline"
        description="Families in Bend struggling with a loved one's addiction get expert support, resources, and guidance from Sober Helpline. Free Monday night Zoom. (541) 838-6009."
        jsonLd={localBusinessSchema}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <nav className="container max-w-4xl mx-auto px-4 py-3 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link to="/oregon-family-support" className="hover:text-primary">Oregon Family Support</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground font-medium">Bend</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Bend, Oregon — Deschutes County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in Bend, Oregon
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Bend's outdoor recreation culture and fast-growing population have come with a hidden cost: 
              alcohol and opioid use disorders are rising in Deschutes County. The "work hard, play hard" lifestyle 
              can mask addiction for years, and families often don't recognize the problem until it's severe. 
              Sober Helpline gives Bend families the tools to act — before crisis hits.
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

        {/* Bend Context */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-4">
              Bend's Addiction Landscape
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Alcohol</div>
                  <div className="text-sm text-muted-foreground">Alcohol use disorder is underreported in outdoor recreation communities — Bend included</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Opioids</div>
                  <div className="text-sm text-muted-foreground">Prescription opioid and fentanyl use rising in Deschutes County, often hidden by outdoor culture</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Growing</div>
                  <div className="text-sm text-muted-foreground">Bend's rapid population growth has strained local behavioral health capacity</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm">
              Bend's "outdoorsy and healthy" identity can create a blind spot: people don't expect addiction here,
              and families often minimize warning signs because "he's just a big drinker" or "she's stressed from work."
              That normalization delays help. Coaching helps Bend families cut through the rationalization and see clearly.
            </p>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-6">
              Bend Local Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Al-Anon Bend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Al-Anon meetings in the Bend area for family members of people struggling with alcoholism. Free and anonymous.
                  </p>
                  <a href="https://oregonal-anon.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    oregonal-anon.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    BestCare Treatment Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Bend-based treatment provider offering inpatient, outpatient, and detox services. 
                    Serves Deschutes County and Central Oregon communities.
                  </p>
                  <a href="https://www.bestcaretreatment.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    bestcaretreatment.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Deschutes County Behavioral Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    County-funded mental health and substance use services for Bend and Deschutes County residents.
                  </p>
                  <a href="https://www.deschutes.org/health/page/behavioral-health" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    deschutes.org/health <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Lines for Life — 24/7 Crisis Line
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Free, confidential statewide crisis line available around the clock for Bend families.
                  </p>
                  <a href="tel:18002738255" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                    <Phone className="h-4 w-4" />
                    1-800-273-8255
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Monday Zoom */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                      <Calendar className="h-3.5 w-3.5" />
                      Every Monday — 7:00 PM PST
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-logo-green mb-3">
                      Free Monday Night Family Support Zoom
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      Bend families join every Monday for free support with certified interventionist Matt Brown. 
                      No agenda. No treatment center referrals. Just real help.
                    </p>
                    <ul className="space-y-2 mb-4">
                      {[
                        "Free — no membership or payment required",
                        "Ask questions in a safe, anonymous setting",
                        "Connect with families across Central Oregon",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link to="/monday-zoom-registration">
                      <Button className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Reserve Your Spot
                      </Button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">FREE</div>
                    <div className="text-muted-foreground text-sm">Every Monday at 7 PM PST</div>
                    <div className="mt-4 text-sm text-muted-foreground">Questions? Call:</div>
                    <a href="tel:5418386009" className="text-primary font-semibold text-lg hover:underline">
                      (541) 838-6009
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Coaching */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-4">
              Intervention Coaching for Bend Families
            </h2>
            <p className="text-muted-foreground mb-6">
              Hourly coaching gives Bend families practical tools — how to stop enabling, how to set real consequences, 
              how to have the conversation that actually lands. Available anywhere in Central Oregon.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                {[
                  "Address Bend's outdoor culture normalization of alcohol/drug use",
                  "CRAFT-based approach — no confrontation, real results",
                  "Build leverage without damaging the relationship",
                  "Available by phone or video — anywhere in Deschutes County",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3">
                <Link to="/family-coaching">
                  <Button size="lg" className="w-full gap-2">
                    <Phone className="h-4 w-4" />
                    Schedule Coaching
                  </Button>
                </Link>
                <a href="tel:5418386009">
                  <Button size="lg" variant="outline" className="w-full gap-2">
                    <Phone className="h-4 w-4" />
                    Call (541) 838-6009
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Other Cities */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-logo-green mb-4">Other Oregon Cities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {otherCities.map((city) => (
                <Link key={city.slug} to={`/oregon/${city.slug}`}
                  className="block text-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-muted-foreground hover:text-primary">
                  {city.name}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/oregon-family-support" className="text-primary text-sm hover:underline">
                ← Back to Oregon Family Support
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-bold text-logo-green mb-2">
              Bend Families: Take the Next Step
            </h2>
            <p className="text-muted-foreground mb-5 max-w-xl mx-auto text-sm">
              Free Monday night Zoom every week. Coaching available now. You don't have to figure this out alone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/monday-zoom-registration">
                <Button className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Join Free Monday Zoom
                </Button>
              </Link>
              <a href="tel:5418386009">
                <Button variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  (541) 838-6009
                </Button>
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
