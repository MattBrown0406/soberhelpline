import { Link } from "react-router-dom";
import { Phone, Heart, MapPin, Calendar, ChevronRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families affected by addiction in San Jose, California.",
  url: "https://soberhelpline.com/california/san-jose",
  telephone: "+15412415668",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Jose",
    addressRegion: "CA",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "San Jose",
  },
  sameAs: ["https://soberhelpline.com"],
};

const nearbyCities = [
  { name: "San Francisco", slug: "san-francisco" },
  { name: "Oakland", slug: "oakland" },
  { name: "Sacramento", slug: "sacramento" },
  { name: "Los Angeles", slug: "los-angeles" },
  { name: "Long Beach", slug: "long-beach" },
  { name: "Orange County", slug: "orange-county" },
];

export default function CaliforniaSanJoseFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in San Jose, California | Sober Helpline"
        description="Families in San Jose struggling with a loved one's addiction get expert support from Sober Helpline. Free “The Family Squares” every Monday 7PM PST. (541) 241-5668."
        jsonLd={localBusinessSchema}
        speakableSelectors={["h1", "h2", ".hero-description"]}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/california-family-support" className="hover:text-primary transition-colors">California Family Support</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">San Jose</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              San Jose, California
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in San Jose, California
            </h1>
            <p className="hero-description text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Silicon Valley's prosperity masks a serious addiction problem. San Jose and Santa Clara County
              see significant high-functioning addiction in the tech sector alongside fentanyl and
              methamphetamine crises. Families deserve real support — not judgment. Help is available now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Calendar className="h-4 w-4" />
                  Free Monday Zoom — 7PM PST
                </Button>
              </Link>
              <a href="tel:5412415668">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Phone className="h-4 w-4" />
                  Call (541) 241-5668
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* City Context */}
        <section className="py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-green mb-4">
              San Jose's Addiction Crisis and Its Impact on Families
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>
                San Jose is the largest city in Silicon Valley and the seat of Santa Clara County, one of
                the wealthiest counties in the United States. But wealth does not protect families from
                addiction. In fact, it often masks it. High-functioning addiction is particularly common
                in the tech sector — engineers, managers, and executives who maintain outward performance
                while privately struggling with alcohol, stimulants, or opioids. Families in these
                situations often feel uniquely isolated, unsure whether their concern is valid or whether
                they're overreacting.
              </p>
              <p>
                At the same time, San Jose's lower-income communities face fentanyl and methamphetamine at
                the same crisis levels seen across California. Santa Clara County records hundreds of
                overdose deaths per year, with fentanyl dominant in fatal cases. Families across the
                socioeconomic spectrum need guidance that respects their specific situation.
              </p>
              <p>
                Sober Helpline offers San Jose families practical, judgment-free support through our free
                Monday Zoom and hourly coaching — whether your loved one is a tech professional in denial
                or someone lost in active addiction on the street.
              </p>
            </div>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-green text-center mb-8">
              San Jose &amp; Santa Clara County Addiction Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Santa Clara Valley Medical Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    The county's primary safety-net hospital with comprehensive addiction medicine services,
                    detox, and psychiatric care. Serves all Santa Clara County residents regardless
                    of insurance or immigration status.
                  </p>
                  <a href="https://www.scvmc.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    scvmc.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Bill Wilson Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    San Jose-based nonprofit providing substance use disorder treatment, mental health
                    services, and youth and family support programs in Santa Clara County.
                  </p>
                  <a href="https://www.bwcenter.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    bwcenter.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Kaiser Permanente San Jose
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Kaiser's San Jose medical center provides chemical dependency treatment programs,
                    outpatient addiction counseling, and family support services for members across
                    Silicon Valley.
                  </p>
                  <a href="https://healthy.kaiserpermanente.org/northern-california/facilities/san-jose-medical-center-100072" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    kaiserpermanente.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Bay Area Crisis Line &amp; SAMHSA — 24/7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Immediate crisis support for San Jose and Silicon Valley families facing addiction emergencies.
                  </p>
                  <div className="space-y-2">
                    <a href="tel:8003092131" className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                      <Phone className="h-3.5 w-3.5" />
                      Bay Area Crisis: 800-309-2131
                    </a>
                    <a href="tel:18006624357" className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                      <Phone className="h-3.5 w-3.5" />
                      SAMHSA: 1-800-662-4357
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Sober Helpline Services */}
        <section className="py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-logo-green mb-4">
                  Free Family Squares Zoom for San Jose Families
                </h2>
                <p className="text-muted-foreground mb-4">
                  Every Monday at 7PM PST — join families from San Jose and Silicon Valley for a free
                  support call with Matt Brown, certified interventionist with 20+ years of experience.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "No cost, no sales pitch, no treatment center referrals",
                    "Real answers from an experienced interventionist",
                    "Connect with other Silicon Valley families",
                    "Anonymous and confidential",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/monday-zoom-registration">
                  <Button className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Register for Monday Zoom
                  </Button>
                </Link>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-logo-green mb-4">
                  Hourly Intervention Coaching
                </h2>
                <p className="text-muted-foreground mb-4">
                  One-on-one coaching for San Jose families who need a strategy, not just support.
                  Whether your loved one is a high-functioning professional or in active addiction,
                  we help families stop enabling and set real boundaries.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Work directly with Matt Brown via phone or video",
                    "Build a boundary plan with real consequences",
                    "Identify enabling patterns in your family dynamic",
                    "Prepare for the conversation with your loved one",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/family-coaching">
                  <Button variant="outline" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Schedule Coaching Session
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Other CA Cities */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green text-center mb-6">
              Support for Other California Families
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nearbyCities.map((city) => (
                <Link
                  key={city.slug}
                  to={`/california/${city.slug}`}
                  className="block group"
                >
                  <Card className="hover:border-primary/50 hover:shadow-sm transition-all">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-medium text-logo-green group-hover:text-primary transition-colors">{city.name}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/california-family-support" className="text-primary hover:underline text-sm">
                ← Back to California Family Support
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-logo-green mb-3">
              San Jose Families: You Don't Have to Do This Alone
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Real help from a real interventionist — not a call center, not a treatment referral line.
              Free Monday Zoom or direct coaching, available to Silicon Valley families right now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Join Free Monday Zoom
                </Button>
              </Link>
              <a href="tel:5412415668">
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call (541) 241-5668
                </Button>
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
