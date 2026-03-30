import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Phoenix, Arizona affected by addiction.",
  url: "https://soberhelpline.com/arizona/phoenix",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Phoenix",
    addressRegion: "AZ",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Phoenix",
  },
};

const otherCities = [
  { name: "Tucson", slug: "tucson" },
  { name: "Scottsdale", slug: "scottsdale" },
];

export default function ArizonaPhoenixFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Phoenix, Arizona | Sober Helpline"
        description="Families in Phoenix struggling with a loved one's addiction get expert support from Sober Helpline. Free The Family Squares every Monday 7PM PST. (541) 838-6009."
        jsonLd={localBusinessSchema}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <nav className="container max-w-4xl mx-auto px-4 py-3 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link to="/arizona-family-support" className="hover:text-primary">Arizona Family Support</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground font-medium">Phoenix</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Phoenix, Arizona — Maricopa County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in Phoenix, Arizona
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Phoenix is the largest desert metro in the United States — and one of the top 5 cities in America 
              for methamphetamine use. With fentanyl flooding in from the southern border and Maricopa County 
              recording over 1,200 overdose deaths per year, Phoenix families are in the thick of one of the 
              nation's most severe addiction crises. Sober Helpline helps Phoenix families find clarity, build 
              a plan, and move forward.
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

        {/* Phoenix Context */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-4">
              Phoenix's Addiction Crisis &amp; What Families Face
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Top 5</div>
                  <div className="text-sm text-muted-foreground">Phoenix ranks among the top 5 US cities for methamphetamine use — a persistent crisis for Maricopa County families</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">1,200+</div>
                  <div className="text-sm text-muted-foreground">Overdose deaths in Maricopa County every year — Phoenix is the epicenter of Arizona's addiction crisis</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">~1.6M</div>
                  <div className="text-sm text-muted-foreground">Phoenix residents — the largest desert metro in the US — with addiction resources often overwhelmed by demand</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm">
              Phoenix's geography — proximity to the US-Mexico border and major Interstate corridors — makes it a 
              primary distribution hub for fentanyl and meth. Families here are dealing with one of the most 
              dangerous drug supply environments in the country. Sober Helpline coaching helps Phoenix families 
              navigate this reality and take effective action.
            </p>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-6">
              Phoenix Local Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Banner Behavioral Health Hospital
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Arizona's leading behavioral health hospital system providing inpatient psychiatric care, 
                    dual diagnosis treatment, and detox services across the Phoenix metro area.
                  </p>
                  <a href="https://www.bannerhealth.com/locations/behavioral-health" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    bannerhealth.com <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Terros Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Phoenix-based community behavioral health organization providing substance use treatment, 
                    mental health services, and integrated care for Maricopa County residents on a sliding fee scale.
                  </p>
                  <a href="https://www.terroshealth.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    terroshealth.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    La Frontera Arizona
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Community behavioral health provider in Arizona offering outpatient substance use treatment, 
                    crisis services, and family support programs across the Phoenix and Tucson areas.
                  </p>
                  <a href="https://www.lafrontera.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    lafrontera.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Maricopa County Crisis Line — 24/7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Maricopa County's behavioral health crisis line. If your loved one is in immediate danger 
                    or you need urgent guidance, call this number 24/7.
                  </p>
                  <a href="tel:6022229444" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                    <Phone className="h-4 w-4" />
                    602-222-9444
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
                      Free The Family Squares Zoom
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      Phoenix families join families from across Arizona every Monday night for free, 
                      judgment-free support. Led by certified interventionist Matt Brown — no treatment center 
                      names, no sales pressure.
                    </p>
                    <ul className="space-y-2 mb-4">
                      {[
                        "100% free — no membership required",
                        "Ask questions, share your situation, get real answers",
                        "Connect with other Phoenix and Maricopa County families",
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
                    <div className="mt-4 text-sm text-muted-foreground">
                      Questions? Call us directly:
                    </div>
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
              One-on-One Intervention Coaching for Phoenix Families
            </h2>
            <p className="text-muted-foreground mb-6">
              When a support group isn't enough, hourly coaching with a certified interventionist gives Phoenix families 
              a concrete plan. We help you identify enabling patterns, set real boundaries with consequences, and prepare 
              for the conversations that matter most.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <ul className="space-y-3">
                {[
                  "Personalized strategy for your family situation",
                  "CRAFT-based communication coaching",
                  "Boundary planning with real follow-through",
                  "Available by phone or video — anywhere in Phoenix or Maricopa County",
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
            <h2 className="text-xl font-bold text-logo-green mb-4">Other Arizona Cities</h2>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              {otherCities.map((city) => (
                <Link
                  key={city.slug}
                  to={`/arizona/${city.slug}`}
                  className="block text-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  {city.name}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/arizona-family-support" className="text-primary text-sm hover:underline inline-flex items-center gap-1">
                ← Back to Arizona Family Support
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-bold text-logo-green mb-2">
              Phoenix Families: You Don't Have to Do This Alone
            </h2>
            <p className="text-muted-foreground mb-5 max-w-xl mx-auto text-sm">
              Whether you're in crisis or just starting to recognize the problem, Sober Helpline is here. 
              Free Monday Zoom every week. Coaching available now.
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
