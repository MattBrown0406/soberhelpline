import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Salt Lake City, Utah affected by addiction.",
  url: "https://soberhelpline.com/utah/salt-lake-city",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Salt Lake City",
    addressRegion: "UT",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Salt Lake City",
  },
};

const otherCities = [
  { name: "Provo", slug: "provo" },
  { name: "Ogden", slug: "ogden" },
];

export default function UtahSaltLakeCityFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Salt Lake City, Utah | Sober Helpline"
        description="Families in Salt Lake City struggling with a loved one's addiction get expert support, resources, and guidance from Sober Helpline. Free The Family Squares. (541) 838-6009."
        jsonLd={localBusinessSchema}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <nav className="container max-w-4xl mx-auto px-4 py-3 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link to="/utah-family-support" className="hover:text-primary">Utah Family Support</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground font-medium">Salt Lake City</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Salt Lake City, Utah — Salt Lake County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in Salt Lake City, Utah
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Salt Lake City is home to Utah's most concentrated resources — but also some of its most complex
              addiction dynamics. Prescription opioids, meth, and alcohol all contribute to Salt Lake County's
              overdose burden. With a metro population of 1.2 million, the city has services available — but navigating
              them is a full-time job. Sober Helpline helps Salt Lake City families cut through the complexity and
              build a strategy that actually works.
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

        {/* SLC Context */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-4">
              Salt Lake City's Addiction Crisis &amp; What Families Face
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">1.2M</div>
                  <div className="text-sm text-muted-foreground">Salt Lake metro population — Utah's largest urban center with complex treatment system</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Multi-Substance</div>
                  <div className="text-sm text-muted-foreground">Prescription opioids, meth, and alcohol all contribute to Salt Lake County's overdose crisis</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Resources Exist</div>
                  <div className="text-sm text-muted-foreground">SLC has more resources than anywhere in Utah — but navigating them without guidance is overwhelming</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm">
              Salt Lake City families often struggle not from a lack of options, but from too many options and no clear
              path. Sober Helpline coaching helps families identify the right level of care, navigate insurance barriers,
              and create a home environment that supports — rather than enables — recovery.
            </p>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-6">
              Salt Lake City Local Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Al-Anon Salt Lake City
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Multiple weekly meetings in Salt Lake City — in-person and online. Free, anonymous, no commitment required.
                  </p>
                  <a href="https://al-anon.org/find-a-meeting" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    al-anon.org/find-a-meeting <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    University of Utah Health Behavioral Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    University of Utah provides comprehensive substance use treatment, psychiatric evaluation,
                    and family support services. Accepts most insurance including Medicaid.
                  </p>
                  <a href="https://healthcare.utah.edu/behavioralhealth" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    healthcare.utah.edu/behavioralhealth <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Valley Behavioral Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    One of Utah's largest behavioral health providers, headquartered in Salt Lake City.
                    Offers outpatient substance use treatment, crisis services, and family programs.
                  </p>
                  <a href="https://www.valleybehavioralhealth.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    valleybehavioralhealth.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Volunteers of America Utah
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Provides residential substance use treatment, transitional housing, and community support services
                    for Salt Lake City residents. Sliding scale fees available.
                  </p>
                  <a href="https://www.voautah.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    voautah.org <ExternalLink className="h-3 w-3" />
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
                      Salt Lake City families join families from across Utah every Monday night for free, judgment-free support.
                      Led by certified interventionist Matt Brown — no treatment center names, no sales pressure.
                    </p>
                    <ul className="space-y-2 mb-4">
                      {["100% free — no membership required", "Ask questions, share your situation, get real answers", "Connect with other Salt Lake families"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link to="/monday-zoom-registration">
                      <Button className="gap-2"><Calendar className="h-4 w-4" />Reserve Your Spot</Button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">FREE</div>
                    <div className="text-muted-foreground text-sm">Every Monday at 7 PM PST</div>
                    <div className="mt-4 text-sm text-muted-foreground">Questions? Call us directly:</div>
                    <a href="tel:5418386009" className="text-primary font-semibold text-lg hover:underline">(541) 838-6009</a>
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
              One-on-One Intervention Coaching for Salt Lake City Families
            </h2>
            <p className="text-muted-foreground mb-6">
              When a support group isn't enough, hourly coaching with a certified interventionist gives Salt Lake City
              families a concrete plan. We help you identify enabling patterns, set real boundaries with consequences,
              and prepare for the conversations that matter most.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <ul className="space-y-3">
                {["Personalized strategy for your family situation", "CRAFT-based communication coaching", "Boundary planning with real follow-through", "Available by phone or video — anywhere in Salt Lake City"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3">
                <Link to="/family-coaching"><Button size="lg" className="w-full gap-2"><Phone className="h-4 w-4" />Schedule Coaching</Button></Link>
                <a href="tel:5418386009"><Button size="lg" variant="outline" className="w-full gap-2"><Phone className="h-4 w-4" />Call (541) 838-6009</Button></a>
              </div>
            </div>
          </div>
        </section>

        {/* Other Cities */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-logo-green mb-4">Other Utah Cities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {otherCities.map((city) => (
                <Link key={city.slug} to={`/utah/${city.slug}`}
                  className="block text-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-muted-foreground hover:text-primary">
                  {city.name}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/utah-family-support" className="text-primary text-sm hover:underline inline-flex items-center gap-1">← Back to Utah Family Support</Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-bold text-logo-green mb-2">Salt Lake City Families: You Don't Have to Do This Alone</h2>
            <p className="text-muted-foreground mb-5 max-w-xl mx-auto text-sm">
              Whether you're in crisis or just starting to recognize the problem, Sober Helpline is here. Free Monday Zoom every week. Coaching available now.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/monday-zoom-registration"><Button className="gap-2"><Calendar className="h-4 w-4" />Join Free Monday Zoom</Button></Link>
              <a href="tel:5418386009"><Button variant="outline" className="gap-2"><Phone className="h-4 w-4" />(541) 838-6009</Button></a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
