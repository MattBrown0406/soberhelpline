import { Link } from "react-router-dom";
import { Phone, Heart, MapPin, Calendar, ChevronRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families affected by addiction in Vancouver, Washington.",
  url: "https://soberhelpline.com/washington/vancouver",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vancouver",
    addressRegion: "WA",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Vancouver",
  },
  sameAs: ["https://soberhelpline.com"],
};

const nearbyCities = [
  { name: "Seattle", slug: "seattle" },
  { name: "Tacoma", slug: "tacoma" },
  { name: "Bellevue", slug: "bellevue" },
  { name: "Everett", slug: "everett" },
  { name: "Spokane", slug: "spokane" },
  { name: "Olympia", slug: "olympia" },
];

export default function WashingtonVancouverFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Vancouver, Washington | Sober Helpline"
        description="Families in Vancouver WA struggling with a loved one's addiction get expert support and resources from Sober Helpline. Free Monday night Zoom. (541) 838-6009."
        jsonLd={localBusinessSchema}
        speakableSelectors={["h1", "h2", ".hero-description"]}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/washington-family-support" className="hover:text-primary transition-colors">Washington Family Support</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Vancouver WA</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Vancouver, Washington
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in Vancouver, Washington
            </h1>
            <p className="hero-description text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Vancouver, WA sits directly across the Columbia River from Portland — and Clark County families
              are experiencing the direct spillover of Portland's fentanyl crisis. The drug supply here is
              dangerous, and families need real support. Expert help is available right now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Calendar className="h-4 w-4" />
                  Free Monday Zoom — 7PM PST
                </Button>
              </Link>
              <a href="tel:5418386009">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Phone className="h-4 w-4" />
                  Call (541) 838-6009
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* City Context */}
        <section className="py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-green mb-4">
              Vancouver WA's Addiction Crisis and Its Impact on Families
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>
                Vancouver, Washington is part of the Portland metro area — which means Clark County families
                are directly exposed to one of the most severe fentanyl drug markets in the Pacific Northwest.
                The easy movement of people and drugs across the I-5 bridge between Portland and Vancouver
                has made Clark County one of the most drug-impacted counties in Washington State.
              </p>
              <p>
                LifeLine Connections is Clark County's primary addiction treatment provider, offering
                residential, outpatient, and family services in Vancouver. PeaceHealth Southwest Medical
                Center handles acute medical care and psychiatric emergencies for the region. Both providers
                see high demand from families dealing with fentanyl, meth, and polysubstance addiction.
              </p>
              <p>
                Vancouver families often find themselves caught between two states' resources — neither fully
                served by Oregon's systems nor fully connected to Washington's. Sober Helpline serves families
                wherever they are, with no referral fees and no state boundaries.
              </p>
            </div>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-green text-center mb-8">
              Vancouver WA Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Washington Recovery Help Line
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Free, confidential statewide resource and referral line. Connects Vancouver WA
                    families with local treatment providers 24/7.
                  </p>
                  <a href="tel:18667891511" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                    <Phone className="h-4 w-4" />
                    1-866-789-1511
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    LifeLine Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Clark County's primary addiction treatment organization, offering residential,
                    outpatient, and family services in Vancouver, WA.
                  </p>
                  <a href="https://www.lifelineconnections.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    lifelineconnections.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Al-Anon Clark County
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Al-Anon meetings in Vancouver and Clark County for families of people with
                    alcohol use disorder. Free, anonymous, multiple formats.
                  </p>
                  <a href="https://al-anon.org/find-a-meeting" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    Find a meeting <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    PeaceHealth Southwest Medical Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Vancouver's major medical center providing emergency care and behavioral health
                    services for Clark County addiction crises.
                  </p>
                  <a href="https://www.peacehealth.org/southwest-washington" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    peacehealth.org <ExternalLink className="h-3 w-3" />
                  </a>
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
                  Free Monday Night Zoom for Vancouver WA Families
                </h2>
                <p className="text-muted-foreground mb-4">
                  Every Monday at 7PM PST — join families from Vancouver and across Washington for a free
                  support call with Matt Brown, certified interventionist.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "No cost, no sales pitch, no treatment center referrals",
                    "Real answers from an experienced interventionist",
                    "Connect with other Clark County and SW Washington families",
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
                  One-on-one coaching for Vancouver WA families who need a strategy. Available by phone
                  or video — no state lines, no waiting lists.
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

        {/* Other WA Cities */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green text-center mb-6">
              Support for Other Washington Families
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nearbyCities.map((city) => (
                <Link key={city.slug} to={`/washington/${city.slug}`} className="block group">
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
              <Link to="/washington-family-support" className="text-primary hover:underline text-sm">
                ← Back to Washington Family Support
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-logo-green mb-3">
              Vancouver WA Families: Help Is Here
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              The Portland fentanyl crisis doesn't stop at the state line — but neither does expert help.
              Free Monday Zoom or direct coaching, available to Clark County families right now.
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
