import { Link } from "react-router-dom";
import { Phone, Heart, MapPin, Calendar, ChevronRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families affected by addiction in Orange County, California.",
  url: "https://soberhelpline.com/california/orange-county",
  telephone: "+14582027900",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Orange County",
    addressRegion: "CA",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Orange County, California",
  },
  sameAs: ["https://soberhelpline.com"],
};

const nearbyCities = [
  { name: "Los Angeles", slug: "los-angeles" },
  { name: "Long Beach", slug: "long-beach" },
  { name: "San Francisco", slug: "san-francisco" },
  { name: "Oakland", slug: "oakland" },
  { name: "San Jose", slug: "san-jose" },
  { name: "Sacramento", slug: "sacramento" },
];

export default function CaliforniaOrangeCountyFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Orange County, California | Sober Helpline"
        description="Families in Orange County struggling with a loved one's addiction get expert support from Sober Helpline. Free “The Family Squares” every Monday 7PM PST. (458) 202-7900."
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
            <span className="text-foreground font-medium">Orange County</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Orange County, California
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-5 leading-tight">
              Addiction Family Support in Orange County, California
            </h1>
            <p className="hero-description text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Orange County's affluence doesn't shield families from addiction. With a population of 3.2
              million across Anaheim, Irvine, Santa Ana, Huntington Beach, and dozens of communities,
              OC families face prescription opioids, fentanyl, and high-functioning addiction at alarming
              rates. Real support is available right now.
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
              Orange County's Addiction Crisis and Its Impact on Families
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>
                Orange County is one of the most densely populated and affluent counties in the United
                States, with approximately 3.2 million residents across cities including Anaheim, Irvine,
                Santa Ana, Huntington Beach, Orange, Fullerton, and Newport Beach. But wealth and
                suburban comfort have never been a protection against addiction — and OC families
                know this firsthand.
              </p>
              <p>
                Orange County experienced a devastating prescription opioid epidemic starting in the 2000s,
                and that foundation has accelerated into fentanyl deaths today. High-functioning addiction
                is particularly prevalent in OC's professional communities — executives, healthcare workers,
                attorneys, and parents who maintain the appearance of normalcy while struggling privately.
                At the same time, cities like Santa Ana and Anaheim have significant working-class
                communities facing methamphetamine and fentanyl at street level.
              </p>
              <p>
                For Orange County families, the treatment industry landscape is particularly complicated.
                OC was once the epicenter of exploitative "patient brokering" and insurance fraud in
                the treatment industry. Sober Helpline does not accept referral fees, does not push
                treatment centers, and does not have financial relationships with facilities — we work
                exclusively for families.
              </p>
            </div>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-blue text-center mb-8">
              Orange County Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-blue text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Hoag Hospital — Newport Beach &amp; Irvine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Hoag Hospital is one of Orange County's leading medical centers with comprehensive
                    behavioral health services, including inpatient psychiatric care, detox, and
                    substance use disorder treatment at their Newport Beach and Irvine campuses.
                  </p>
                  <a href="https://www.hoag.org/programs-services/behavioral-health" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    hoag.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-blue text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    CHOC — Children's Hospital of Orange County
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    For OC families with adolescents or young adults struggling with substance use,
                    CHOC provides specialized behavioral health and addiction services for young people
                    through their mental health programs.
                  </p>
                  <a href="https://www.choc.org/mental-health" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    choc.org/mental-health <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-blue text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    MFI Recovery Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Orange County-based treatment organization offering residential, outpatient, and
                    detox services for adults with substance use disorders. Works with various insurance
                    plans and offers financing options.
                  </p>
                  <a href="https://www.mfirecovery.com" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    mfirecovery.com <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-blue text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Western Pacific Med Corp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Provides medication-assisted treatment (MAT) and outpatient addiction services in
                    Orange County. Multiple locations serving Anaheim, Santa Ana, and surrounding areas.
                  </p>
                  <a href="https://www.westernapac.com" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    westernapac.com <ExternalLink className="h-3 w-3" />
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
                    Immediate crisis support for Orange County families. OC falls within the LA County
                    crisis region for many services; SAMHSA provides national referrals 24/7.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="tel:8008547771" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                      <Phone className="h-4 w-4" />
                      Crisis Line: 800-854-7771
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

        {/* OC Communities */}
        <section className="py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-blue mb-4">
              Serving Families Across Orange County
            </h2>
            <p className="text-muted-foreground mb-6">
              Sober Helpline serves families in every Orange County community, including:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Anaheim", "Irvine", "Santa Ana", "Huntington Beach", "Orange", "Fullerton", "Newport Beach", "Costa Mesa"].map((city) => (
                <div key={city} className="bg-muted/60 rounded-lg p-3 text-center">
                  <span className="text-sm font-medium text-logo-blue">{city}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sober Helpline Services */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-logo-blue mb-4">
                  Free Family Squares Zoom for OC Families
                </h2>
                <p className="text-muted-foreground mb-4">
                  Every Monday at 7PM PST — join families from Orange County and across California for a
                  free support call with Matt Brown, certified interventionist with 20+ years of experience.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "No cost, no sales pitch, no treatment center referrals",
                    "Real answers from an experienced interventionist",
                    "Connect with other Orange County families",
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
                  One-on-one coaching for OC families navigating addiction. Whether your loved one is
                  high-functioning or in crisis, we help you stop enabling and take clear action.
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
              Orange County Families: You Don't Have to Do This Alone
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Real help from a real interventionist — no referral fees, no treatment center pressure.
              Free Monday Zoom or direct coaching, available to OC families right now.
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
