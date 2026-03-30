import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Provo, Utah affected by addiction.",
  url: "https://soberhelpline.com/utah/provo",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Provo",
    addressRegion: "UT",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Provo",
  },
};

const otherCities = [
  { name: "Salt Lake City", slug: "salt-lake-city" },
  { name: "Ogden", slug: "ogden" },
];

export default function UtahProvoFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Provo, Utah | Sober Helpline"
        description="Families in Provo struggling with a loved one's addiction get expert support, resources, and guidance from Sober Helpline. Free The Family Squares. (541) 838-6009."
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
            <li className="text-foreground font-medium">Provo</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Provo, Utah — Utah County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in Provo, Utah
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Provo is home to BYU and a deeply LDS community — which creates unique and often hidden dynamics around
              addiction. Prescription opioid misuse is prevalent, and the community's strong emphasis on sobriety can
              paradoxically deepen the shame and secrecy that keeps families stuck. Sober Helpline provides a safe,
              anonymous space for Provo families to get real help — without judgment, without religious pressure,
              without anyone in your community knowing.
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

        {/* Provo Context */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-4">
              Provo's Addiction Landscape &amp; What Families Face
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">~115k</div>
                  <div className="text-sm text-muted-foreground">Provo's population — Utah County's largest city, home to BYU's 36,000+ students</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Rx Opioids</div>
                  <div className="text-sm text-muted-foreground">Prescription opioid misuse is disproportionately high in Utah County communities</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Hidden Shame</div>
                  <div className="text-sm text-muted-foreground">Strong LDS community norms around sobriety can intensify shame and delay help-seeking</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm">
              In Provo, the fear of community judgment can be as destructive as the addiction itself. Families often
              protect their loved one's secret at great personal cost. Sober Helpline's anonymous The Family Squares
              gives Provo families a safe space to break that silence and get real help.
            </p>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-6">
              Provo Local Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Al-Anon Utah County
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    In-person and online meetings available to Provo-area families. Free, anonymous, no religious affiliation required.
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
                    Utah Valley Hospital Behavioral Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Intermountain Healthcare's Utah Valley facility provides psychiatric and behavioral health services,
                    including substance use assessment and referrals in Provo.
                  </p>
                  <a href="https://intermountainhealthcare.org/locations/utah-valley-hospital" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    intermountainhealthcare.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Valley Behavioral Health — Utah County
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Outpatient substance use treatment and mental health services serving Provo and Utah County.
                    Accepts Medicaid and most insurance plans.
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
                    Utah County Crisis Line — 24/7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Utah's statewide crisis line, available around the clock for mental health and substance use emergencies.
                    Free and confidential for all Utah County residents.
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
                      Free The Family Squares Zoom
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      Provo families join families from across Utah every Monday night for free, anonymous, judgment-free support.
                      Led by certified interventionist Matt Brown — no treatment center names, no religious framework imposed.
                    </p>
                    <ul className="space-y-2 mb-4">
                      {["100% free — no membership required", "Completely anonymous — no one in your community will know", "Ask real questions, get real answers without judgment"].map((item) => (
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
              One-on-One Intervention Coaching for Provo Families
            </h2>
            <p className="text-muted-foreground mb-6">
              When a support group isn't enough, hourly coaching with a certified interventionist gives Provo families
              a concrete plan. We help you identify enabling patterns, set real boundaries with consequences, and prepare
              for the conversations that matter most — without judgment, and without a religious framework imposed on your process.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <ul className="space-y-3">
                {["Personalized strategy for your family situation", "CRAFT-based communication coaching", "Boundary planning with real follow-through", "Available by phone or video — completely confidential"].map((item) => (
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
            <h2 className="text-xl md:text-2xl font-bold text-logo-green mb-2">Provo Families: You Don't Have to Do This Alone</h2>
            <p className="text-muted-foreground mb-5 max-w-xl mx-auto text-sm">
              Whether you're in crisis or just starting to recognize the problem, Sober Helpline is here.
              Free Monday Zoom every week — anonymous and judgment-free.
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
