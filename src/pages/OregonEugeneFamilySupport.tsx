import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Eugene, Oregon affected by addiction.",
  url: "https://soberhelpline.com/oregon/eugene",
  telephone: "+14582027900",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Eugene",
    addressRegion: "OR",
    addressCountry: "US",
  },
  areaServed: { "@type": "City", name: "Eugene" },
};

const otherCities = [
  { name: "Portland", slug: "portland" },
  { name: "Salem", slug: "salem" },
  { name: "Bend", slug: "bend" },
  { name: "Medford", slug: "medford" },
  { name: "Gresham", slug: "gresham" },
  { name: "Hillsboro", slug: "hillsboro" },
];

export default function OregonEugeneFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Eugene, Oregon | Sober Helpline"
        description="Families in Eugene struggling with a loved one's addiction get expert support, resources, and guidance from Sober Helpline. Free “The Family Squares”. (458) 202-7900."
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
            <li className="text-foreground font-medium">Eugene</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Eugene, Oregon — Lane County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-5 leading-tight">
              Addiction Family Support in Eugene, Oregon
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Eugene and Lane County have a significant young adult addiction problem, in part driven by the University 
              of Oregon population and a culture that can normalize heavy substance use. Families in Eugene often watch 
              their college-aged or young adult loved ones spiral, unsure whether to intervene or give them space.
              Sober Helpline helps Eugene families navigate that impossible tension with clear, evidence-based guidance.
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

        {/* Eugene Context */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-blue mb-4">
              Eugene's Addiction Landscape
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Young Adults</div>
                  <div className="text-sm text-muted-foreground">University culture creates unique addiction patterns — and unique family challenges</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Opioids</div>
                  <div className="text-sm text-muted-foreground">Lane County has seen sharp increases in fentanyl-related overdoses among young people</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Resources</div>
                  <div className="text-sm text-muted-foreground">Eugene has established treatment providers — with the right guidance, families can access them</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm">
              Eugene families with young adult loved ones often face a specific challenge: their loved one doesn't believe they have 
              a problem, and their peer group reinforces that belief. CRAFT-based coaching helps families shift the dynamic 
              without confrontation or ultimatums that backfire.
            </p>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-blue mb-6">
              Eugene Local Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Al-Anon Eugene
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Eugene-area Al-Anon meetings for family members affected by alcoholism. Free and anonymous.
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
                    Looking Glass Youth &amp; Family Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Eugene-based nonprofit providing substance use treatment and mental health services, 
                    with specialized programs for young adults and adolescents in Lane County.
                  </p>
                  <a href="https://www.lookingglass.us" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    lookingglass.us <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Buckley House
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Residential and outpatient treatment services in Eugene. Offers family programs and 
                    supports people across the spectrum of substance use disorders.
                  </p>
                  <a href="https://www.buckleyhouse.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    buckleyhouse.org <ExternalLink className="h-3 w-3" />
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
                    Free, confidential crisis line for substance use emergencies in Eugene and all of Oregon.
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
                      Eugene families join every Monday for free, judgment-free support with certified interventionist Matt Brown.
                      Great for parents of young adults who aren't sure what to do next.
                    </p>
                    <ul className="space-y-2 mb-4">
                      {[
                        "100% free — no sign-up fees or membership",
                        "Real answers from an experienced interventionist",
                        "Community with families who get it",
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
              Intervention Coaching for Eugene Families
            </h2>
            <p className="text-muted-foreground mb-6">
              Whether your loved one is a young adult at UO or someone further into addiction, hourly coaching 
              gives Eugene families a concrete strategy — not just emotional support. We work with what you have 
              and help you build leverage without breaking trust.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                {[
                  "Strategies tailored to young adult addiction dynamics",
                  "CRAFT-based communication — no confrontation required",
                  "Identify enabling, set boundaries, create change",
                  "Phone or video — anywhere in Eugene or Lane County",
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
            <h2 className="text-xl md:text-2xl font-bold text-logo-blue mb-2">
              Eugene Families: Real Help, Right Now
            </h2>
            <p className="text-muted-foreground mb-5 max-w-xl mx-auto text-sm">
              Join our free “The Family Squares” or call to get started with coaching. No judgment. No agenda. Just help.
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
