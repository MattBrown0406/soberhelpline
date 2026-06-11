import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Portland, Oregon affected by addiction.",
  url: "https://soberhelpline.com/oregon/portland",
  telephone: "+14582027900",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Portland",
    addressRegion: "OR",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Portland",
  },
};

const otherCities = [
  { name: "Salem", slug: "salem" },
  { name: "Eugene", slug: "eugene" },
  { name: "Bend", slug: "bend" },
  { name: "Medford", slug: "medford" },
  { name: "Gresham", slug: "gresham" },
  { name: "Hillsboro", slug: "hillsboro" },
];

export default function OregonPortlandFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Portland, Oregon | Sober Helpline"
        description="Families in Portland struggling with a loved one's addiction get expert support, resources, and guidance from Sober Helpline. Free “The Family Squares”. (458) 202-7900."
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
            <li className="text-foreground font-medium">Portland</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Portland, Oregon — Multnomah County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-5 leading-tight">
              Addiction Family Support in Portland, Oregon
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Portland and Multnomah County have the highest overdose rates in Oregon. The fentanyl crisis has devastated
              neighborhoods across the city, and families are often left scrambling for answers while watching their loved one spiral. 
              Resources exist — but navigating them without guidance is overwhelming. Sober Helpline is here to help Portland families 
              find clarity and a path forward.
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

        {/* Portland Context */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-blue mb-4">
              Portland's Addiction Crisis &amp; What Families Face
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">#1</div>
                  <div className="text-sm text-muted-foreground">Multnomah County leads Oregon in overdose deaths — year after year</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Fentanyl</div>
                  <div className="text-sm text-muted-foreground">Now present in most street drugs in Portland — a hidden danger for families</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Overwhelmed</div>
                  <div className="text-sm text-muted-foreground">Portland has resources — but demand far outstrips capacity</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm">
              Portland's urban environment means resources are more plentiful here than in rural Oregon — but "more resources" doesn't mean 
              "easy access." Families often call multiple programs only to hit waitlists, insurance barriers, or the wrong level of care. 
              Sober Helpline coaching helps Portland families navigate this system without wasting precious time.
            </p>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-blue mb-6">
              Portland Local Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Al-Anon Portland
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Multiple weekly meetings across Portland — in-person and online. Free and anonymous.
                  </p>
                  <a href="https://oregonal-anon.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    oregonal-anon.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Cascadia Behavioral Healthcare
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Portland-based provider offering outpatient substance use treatment, crisis services, and mental health support. 
                    Serves Multnomah County residents.
                  </p>
                  <a href="https://www.cascadiabhc.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    cascadiabhc.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Multnomah County SUD Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    County-funded treatment access for Portland residents, including Medicaid-covered programs and crisis stabilization.
                  </p>
                  <a href="https://www.multco.us/health/alcohol-and-drug-services" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    multco.us/health <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Lines for Life — 24/7 Crisis Line
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Statewide crisis and substance use helpline available around the clock. Free, confidential.
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
                    <h2 className="text-xl md:text-2xl font-bold text-logo-blue mb-3">
                      Free “The Family Squares” Zoom
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      Portland families join families from across Oregon every Monday for free, judgment-free support.
                      Led by certified interventionist Matt Brown — no treatment center names, no sales pressure.
                    </p>
                    <ul className="space-y-2 mb-4">
                      {[
                        "100% free — no membership required",
                        "Ask questions, share your situation, get real answers",
                        "Connect with other Portland-area families",
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
                    <a href="tel:4582027900" className="text-primary font-semibold text-lg hover:underline">
                      (458) 202-7900
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
            <h2 className="text-2xl font-bold text-logo-blue mb-4">
              One-on-One Intervention Coaching for Portland Families
            </h2>
            <p className="text-muted-foreground mb-6">
              When a support group isn't enough, hourly coaching with a certified interventionist gives Portland families 
              a concrete plan. We help you identify enabling patterns, set real boundaries with consequences, and prepare 
              for the conversations that matter most.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <ul className="space-y-3">
                {[
                  "Personalized strategy for your family situation",
                  "CRAFT-based communication coaching",
                  "Boundary planning with real follow-through",
                  "Available by phone or video — anywhere in Portland",
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
                <a href="tel:4582027900">
                  <Button size="lg" variant="outline" className="w-full gap-2">
                    <Phone className="h-4 w-4" />
                    Call (458) 202-7900
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Other Cities */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-logo-blue mb-4">Other Oregon Cities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {otherCities.map((city) => (
                <Link
                  key={city.slug}
                  to={`/oregon/${city.slug}`}
                  className="block text-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  {city.name}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/oregon-family-support" className="text-primary text-sm hover:underline inline-flex items-center gap-1">
                ← Back to Oregon Family Support
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-bold text-logo-blue mb-2">
              Portland Families: You Don't Have to Do This Alone
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
              <a href="tel:4582027900">
                <Button variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  (458) 202-7900
                </Button>
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
