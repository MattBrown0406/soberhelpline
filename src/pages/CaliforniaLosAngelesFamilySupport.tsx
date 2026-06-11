import { Link } from "react-router-dom";
import { Phone, Heart, MapPin, Calendar, ChevronRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families affected by addiction in Los Angeles, California.",
  url: "https://soberhelpline.com/california/los-angeles",
  telephone: "+14582027900",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Los Angeles",
  },
  sameAs: ["https://soberhelpline.com"],
};

const nearbyCities = [
  { name: "Long Beach", slug: "long-beach" },
  { name: "Orange County", slug: "orange-county" },
  { name: "San Francisco", slug: "san-francisco" },
  { name: "Oakland", slug: "oakland" },
  { name: "San Jose", slug: "san-jose" },
  { name: "Sacramento", slug: "sacramento" },
];

export default function CaliforniaLosAngelesFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Los Angeles, California | Sober Helpline"
        description="Families in Los Angeles struggling with a loved one's addiction get expert support from Sober Helpline. Free “The Family Squares” every Monday 7PM PST. (458) 202-7900."
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
            <span className="text-foreground font-medium">Los Angeles</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Los Angeles, California
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-5 leading-tight">
              Addiction Family Support in Los Angeles, California
            </h1>
            <p className="hero-description text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Los Angeles County is the most populous county in the United States — and records over 1,800
              overdose deaths per year. From Skid Row to Bel Air, addiction affects families across every
              zip code. LA families need and deserve real support. Free help is available right now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Calendar className="h-4 w-4" />
                  Free Monday Zoom — 7PM PST
                </Button>
              </Link>
              <a href="tel:4582027900">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Phone className="h-4 w-4" />
                  Call (458) 202-7900
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* City Context */}
        <section className="py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-blue mb-4">
              Los Angeles's Addiction Crisis and Its Impact on Families
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>
                Los Angeles County records more than 1,800 drug overdose deaths per year — more than many
                states record in total. Fentanyl now drives the majority of fatal overdoses, but
                methamphetamine and alcohol addiction also devastate LA families at alarming rates.
                Skid Row in downtown LA is one of the most visible symbols of the addiction and housing
                crisis in the United States, but addiction in Los Angeles crosses every neighborhood,
                industry, and income level.
              </p>
              <p>
                For families, the sheer size of Los Angeles can make finding help feel overwhelming.
                The county's treatment infrastructure is vast but complicated to navigate. Families often
                find themselves passed between call centers, given referrals to programs with long waitlists,
                or pressured into expensive programs by facilities more focused on revenue than outcomes.
              </p>
              <p>
                Sober Helpline provides a direct alternative: real access to an experienced interventionist
                who helps Los Angeles families take clear, practical action — stopping enabling, setting
                boundaries, and creating the conditions where treatment becomes possible.
              </p>
            </div>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-blue text-center mb-8">
              Los Angeles Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-blue text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    LA County Dept. of Health Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    LA County's Department of Health Services oversees county-funded addiction treatment,
                    detox services, and behavioral health across the county's vast network of clinics and
                    hospitals. Medi-Cal accepted at all county facilities.
                  </p>
                  <a href="https://dhs.lacounty.gov" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    dhs.lacounty.gov <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-blue text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Cedars-Sinai Addiction Treatment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Cedars-Sinai Medical Center in Los Angeles provides comprehensive addiction medicine
                    services, dual-diagnosis treatment, and withdrawal management through their
                    behavioral health department.
                  </p>
                  <a href="https://www.cedars-sinai.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    cedars-sinai.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-blue text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Didi Hirsch Mental Health Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    One of LA's largest mental health and substance use disorder service organizations.
                    Offers co-occurring disorder treatment, crisis counseling, and family support
                    services at multiple locations across Los Angeles County.
                  </p>
                  <a href="https://www.didihirsch.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    didihirsch.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-blue text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    CLARE|MATRIX
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    One of Los Angeles's leading addiction treatment organizations, CLARE|MATRIX offers
                    residential, intensive outpatient, and detox services with a strong focus on
                    long-term recovery outcomes.
                  </p>
                  <a href="https://www.clarematrix.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    clarematrix.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-logo-blue text-base flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    LA County Crisis Line &amp; SAMHSA — 24/7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Immediate crisis support for Los Angeles families facing addiction or mental health emergencies.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="tel:8008547771" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                      <Phone className="h-4 w-4" />
                      LA County Crisis: 800-854-7771
                    </a>
                    <a href="tel:18006624357" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                      <Phone className="h-4 w-4" />
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
                <h2 className="text-2xl font-bold text-logo-blue mb-4">
                  Free Family Squares Zoom for LA Families
                </h2>
                <p className="text-muted-foreground mb-4">
                  Every Monday at 7PM PST — join families from Los Angeles and across California for a free
                  support call with Matt Brown, certified interventionist with 20+ years of experience.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "No cost, no sales pitch, no treatment center referrals",
                    "Real answers from an experienced interventionist",
                    "Connect with other LA County families",
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
                <h2 className="text-2xl font-bold text-logo-blue mb-4">
                  Hourly Intervention Coaching
                </h2>
                <p className="text-muted-foreground mb-4">
                  One-on-one coaching for LA families who need a strategy, not just a support group.
                  Learn CRAFT-based skills, boundary-setting, and how to stop enabling your loved one's addiction.
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
            <h2 className="text-2xl font-bold text-logo-blue text-center mb-6">
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
                        <span className="text-sm font-medium text-logo-blue group-hover:text-primary transition-colors">{city.name}</span>
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
            <h2 className="text-2xl font-bold text-logo-blue mb-3">
              Los Angeles Families: You Don't Have to Do This Alone
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Real help from a real interventionist — not a call center, not a treatment referral line.
              Free Monday Zoom or direct coaching, available to LA County families right now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Join Free Monday Zoom
                </Button>
              </Link>
              <a href="tel:4582027900">
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call (458) 202-7900
                </Button>
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
