import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Nampa, Idaho affected by addiction.",
  url: "https://soberhelpline.com/idaho/nampa",
  telephone: "+14582027900",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nampa",
    addressRegion: "ID",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Nampa",
  },
};

const otherCities = [
  { name: "Boise", slug: "boise" },
  { name: "Meridian", slug: "meridian" },
];

export default function IdahoNampaFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Nampa, Idaho | Sober Helpline"
        description="Families in Nampa struggling with a loved one's addiction get expert support, resources, and guidance from Sober Helpline. Free “The Family Squares”. (458) 202-7900."
        jsonLd={localBusinessSchema}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <nav className="container max-w-4xl mx-auto px-4 py-3 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link to="/idaho-family-support" className="hover:text-primary">Idaho Family Support</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground font-medium">Nampa</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Nampa, Idaho — Canyon County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-5 leading-tight">
              Addiction Family Support in Nampa, Idaho
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Nampa sits along one of Idaho's most active meth corridors. Canyon County has some of the state's
              highest rates of methamphetamine use, compounded by rural poverty and limited treatment options.
              Families in Nampa often feel trapped — they can see the problem, but don't know how to help without
              making it worse. Sober Helpline offers real guidance for Nampa families, wherever you are in this journey.
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

        {/* Nampa Context */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-blue mb-4">
              Nampa's Addiction Crisis &amp; What Families Face
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">~105k</div>
                  <div className="text-sm text-muted-foreground">Nampa's population — Canyon County's largest city and Idaho's second largest</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Meth Corridor</div>
                  <div className="text-sm text-muted-foreground">Canyon County lies along one of Idaho's primary meth trafficking routes — supply is constant</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Rural Poverty</div>
                  <div className="text-sm text-muted-foreground">Economic hardship and limited social services create conditions where addiction flourishes</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm">
              Nampa families often have fewer resources than those in Boise but face comparable or worse addiction rates.
              Sober Helpline coaching connects Nampa families with evidence-based strategies and a clear plan — by phone
              or video, no in-person requirement.
            </p>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-blue mb-6">
              Nampa Local Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Al-Anon Nampa / Canyon County
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    In-person and online meetings available to Nampa families. Free, anonymous, no commitment required.
                  </p>
                  <a href="https://al-anon.org/find-a-meeting" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    al-anon.org/find-a-meeting <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Mercy Medical Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Nampa's primary hospital offers behavioral health services and substance use crisis assessment.
                    Can serve as an entry point for families in acute situations.
                  </p>
                  <a href="https://www.mercynampa.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    mercynampa.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Port of Hope
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Canyon County nonprofit providing substance use recovery support, transitional housing, and
                    community-based services for individuals and families affected by addiction.
                  </p>
                  <a href="https://www.portofhopeidaho.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    portofhopeidaho.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    El-Ada Community Action Agency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Serves Ada and Canyon counties with a range of community services including Allumbaugh House
                    crisis stabilization. Connects families with local behavioral health resources.
                  </p>
                  <a href="https://www.elada.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    elada.org <ExternalLink className="h-3 w-3" />
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
                      Nampa families join families from across Idaho every Monday for free, judgment-free support.
                      Led by certified interventionist Matt Brown — no treatment center names, no sales pressure.
                    </p>
                    <ul className="space-y-2 mb-4">
                      {[
                        "100% free — no membership required",
                        "Ask questions, share your situation, get real answers",
                        "Connect with other Canyon County families",
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
                    <div className="mt-4 text-sm text-muted-foreground">Questions? Call us directly:</div>
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
              One-on-One Intervention Coaching for Nampa Families
            </h2>
            <p className="text-muted-foreground mb-6">
              When a support group isn't enough, hourly coaching with a certified interventionist gives Nampa families
              a concrete plan. We help you identify enabling patterns, set real boundaries with consequences, and prepare
              for the conversations that matter most.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <ul className="space-y-3">
                {[
                  "Personalized strategy for your family situation",
                  "CRAFT-based communication coaching",
                  "Boundary planning with real follow-through",
                  "Available by phone or video — anywhere in Nampa",
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
            <h2 className="text-xl font-bold text-logo-blue mb-4">Other Idaho Cities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {otherCities.map((city) => (
                <Link
                  key={city.slug}
                  to={`/idaho/${city.slug}`}
                  className="block text-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  {city.name}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/idaho-family-support" className="text-primary text-sm hover:underline inline-flex items-center gap-1">
                ← Back to Idaho Family Support
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-bold text-logo-blue mb-2">
              Nampa Families: You Don't Have to Do This Alone
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
