import { Link } from "react-router-dom";
import { Phone, Heart, MapPin, Calendar, ChevronRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families affected by addiction in Long Beach, California.",
  url: "https://soberhelpline.com/california/long-beach",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Long Beach",
    addressRegion: "CA",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Long Beach",
  },
  sameAs: ["https://soberhelpline.com"],
};

const nearbyCities = [
  { name: "Los Angeles", slug: "los-angeles" },
  { name: "Orange County", slug: "orange-county" },
  { name: "San Francisco", slug: "san-francisco" },
  { name: "Oakland", slug: "oakland" },
  { name: "San Jose", slug: "san-jose" },
  { name: "Sacramento", slug: "sacramento" },
];

export default function CaliforniaLongBeachFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Long Beach, California | Sober Helpline"
        description="Families in Long Beach struggling with a loved one's addiction get expert support from Sober Helpline. Free The Family Squares every Monday 7PM PST. (541) 838-6009."
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
            <span className="text-foreground font-medium">Long Beach</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Long Beach, California
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in Long Beach, California
            </h1>
            <p className="hero-description text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Long Beach sits at a major fentanyl trafficking corridor through the Port of Los Angeles.
              As LA County's second largest city, Long Beach families face high overdose rates and
              limited visibility into available resources. Expert intervention support is available now.
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
              Long Beach's Addiction Crisis and Its Impact on Families
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>
                Long Beach is home to roughly 460,000 residents and is part of Los Angeles County. Its
                location adjacent to the Port of Los Angeles and the Port of Long Beach — together the
                largest port complex in the Western Hemisphere — makes it a significant entry point for
                fentanyl and other synthetic drugs entering California and the broader US supply chain.
                The result is a local drug supply heavily saturated with fentanyl, and overdose rates
                that consistently rank among the highest in Southern California.
              </p>
              <p>
                Long Beach's diverse communities — from the working-class neighborhoods of North Long Beach
                to the beach communities further south — all face addiction at significant rates.
                Methamphetamine remains widespread, particularly in areas with higher rates of housing
                instability. Families often struggle to find treatment options that aren't attached to
                high costs or predatory referral practices.
              </p>
              <p>
                Sober Helpline offers Long Beach families direct access to an experienced interventionist
                through our free The Family Squares and hourly coaching — practical tools to stop
                enabling, set real boundaries, and guide your loved one toward treatment.
              </p>
            </div>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-green text-center mb-8">
              Long Beach Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Long Beach Memorial Medical Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Long Beach Memorial provides emergency and inpatient care for overdose and withdrawal
                    management, along with referrals to behavioral health services for Long Beach residents.
                  </p>
                  <a href="https://www.memorialcare.org/locations/long-beach-medical-center" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    memorialcare.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Pacific Clinics — Long Beach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Pacific Clinics is one of the largest nonprofit behavioral health providers in
                    California, offering substance use disorder treatment, mental health services,
                    and family support programs in Long Beach and across LA County.
                  </p>
                  <a href="https://www.pacificclinics.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    pacificclinics.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Behavioral Health Associates — Long Beach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Outpatient addiction treatment and counseling services in Long Beach, providing
                    individual and group therapy for substance use disorders and co-occurring conditions.
                  </p>
                  <a href="https://www.dhcs.ca.gov/Find-Drug-and-Alcohol-Treatment" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    Find local treatment → dhcs.ca.gov <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    LA County Crisis Line &amp; SAMHSA — 24/7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Immediate crisis support for Long Beach and LA County families facing addiction emergencies.
                  </p>
                  <div className="space-y-2">
                    <a href="tel:8008547771" className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                      <Phone className="h-3.5 w-3.5" />
                      LA County: 800-854-7771
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
                  Free Family Squares Zoom for Long Beach Families
                </h2>
                <p className="text-muted-foreground mb-4">
                  Every Monday at 7PM PST — join families from Long Beach and across Southern California
                  for a free support call with Matt Brown, certified interventionist.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "No cost, no sales pitch, no treatment center referrals",
                    "Real answers from an experienced interventionist",
                    "Connect with other Southern California families",
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
                  One-on-one coaching for Long Beach families who need a strategy, not just support.
                  Learn CRAFT-based skills, boundary-setting, and how to stop enabling addiction.
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
              Long Beach Families: You Don't Have to Do This Alone
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Real help from a real interventionist — not a call center, not a treatment referral line.
              Free Monday Zoom or direct coaching, available to Long Beach families right now.
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
