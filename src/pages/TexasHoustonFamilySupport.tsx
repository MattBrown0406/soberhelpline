import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Houston, Texas affected by addiction.",
  url: "https://soberhelpline.com/texas/houston",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Houston",
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Houston",
  },
};

const otherCities = [
  { name: "Dallas", slug: "dallas" },
  { name: "Austin", slug: "austin" },
  { name: "San Antonio", slug: "san-antonio" },
];

export default function TexasHoustonFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Houston, Texas | Sober Helpline"
        description="Families in Houston struggling with a loved one's addiction get expert support, resources, and guidance from Sober Helpline. Free “The Family Squares”. (541) 838-6009."
        jsonLd={localBusinessSchema}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <nav className="container max-w-4xl mx-auto px-4 py-3 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link to="/texas-family-support" className="hover:text-primary">Texas Family Support</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground font-medium">Houston</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Houston, Texas — Harris County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in Houston, Texas
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Houston and Harris County — home to 2.3 million people and a 7-million-person metro — are at the center of Texas's addiction crisis.
              Fentanyl and methamphetamine are driving overdose deaths. Houston's massive, diverse immigrant community faces language and
              cultural barriers to getting help. Families watching a loved one spiral deserve real guidance — not a sales pitch.
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

        {/* Houston Context */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-4">Houston's Addiction Landscape</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">2.3M</div>
                  <div className="text-sm text-muted-foreground">Houston city population, Harris County</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Top 20</div>
                  <div className="text-sm text-muted-foreground">US cities for overdose deaths</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">↑ Rising</div>
                  <div className="text-sm text-muted-foreground">Fentanyl & meth deaths year over year</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Houston is the largest US city without zoning laws, which has created a fragmented social safety net and uneven
              distribution of treatment resources. Fentanyl from the southern border has saturated Houston's drug supply.
              Large immigrant communities — particularly from Central America, Mexico, and Southeast Asia — often face
              stigma and language barriers that delay help-seeking. Families in Houston need culturally aware, practical guidance.
            </p>
          </div>
        </section>

        {/* Houston Resources */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-6">Houston Family Addiction Resources</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Harris County Psychiatric Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Harris County's public psychiatric and behavioral health hospital, offering inpatient and outpatient
                    substance use disorder treatment. Serves uninsured and Medicaid patients.
                  </p>
                  <a href="https://hcpc.hctx.net" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    hcpc.hctx.net <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    The Menninger Clinic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    One of the nation's leading psychiatric hospitals, offering comprehensive addiction and co-occurring
                    disorder treatment for adults in Houston.
                  </p>
                  <a href="https://www.menningerclinic.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    menningerclinic.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Memorial Hermann Behavioral Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Provides inpatient and outpatient behavioral health services including substance use treatment
                    across the Houston metro area.
                  </p>
                  <a href="https://www.memorialhermann.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    memorialhermann.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Houston Council on Recovery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    A community-based recovery support organization providing education, advocacy, and direct support
                    services for individuals and families affected by addiction in Houston.
                  </p>
                  <a href="https://www.houstoncouncilonrecovery.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    houstoncouncilonrecovery.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Phone className="h-4 w-4 text-primary" />
                    Texas Crisis Line — 24/7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Call anytime for crisis support, mental health referrals, and substance use resources available in Houston.
                  </p>
                  <a href="tel:18002738255"
                    className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                    <Phone className="h-4 w-4" />
                    1-800-273-8255
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Sober Helpline CTA */}
        <section className="py-10 bg-primary/5 border-y border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-logo-green mb-4">
                  Free “The Family Squares” Zoom
                </h2>
                <p className="text-muted-foreground mb-4">
                  Every Monday at 7PM PST, Houston families join a free Zoom call led by Matt Brown —
                  a certified interventionist with 20+ years of experience. Ask real questions, get real answers.
                  No treatment center referrals, no sales pitch.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Free — no cost, no commitment",
                    "Anonymous — share what you're comfortable with",
                    "Led by a certified interventionist, not a counselor-in-training",
                    "Families from Houston and across Texas welcome",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/monday-zoom-registration">
                    <Button size="lg" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Register for Monday Zoom
                    </Button>
                  </Link>
                  <a href="tel:5418386009">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Phone className="h-4 w-4" />
                      (541) 838-6009
                    </Button>
                  </a>
                </div>
              </div>
              <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <Heart className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-logo-green mb-2">Need More Than a Group?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Hourly one-on-one coaching with a certified interventionist. Create a real plan,
                  set boundaries that work, and stop letting addiction run your family.
                </p>
                <Link to="/family-coaching">
                  <Button className="w-full gap-2">
                    <Phone className="h-4 w-4" />
                    Schedule Coaching Session
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Other Texas Cities */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-logo-green mb-4">Other Texas Cities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherCities.map((city) => (
                <Link key={city.slug} to={`/texas/${city.slug}`} className="block group">
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium text-logo-green group-hover:text-primary transition-colors">{city.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/texas-family-support" className="text-primary text-sm hover:underline">
                ← Back to Texas Family Support
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-10 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-logo-green mb-3">Houston Families: Help Is Here</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              You don't have to wait for a crisis. You don't have to figure this out alone.
              Real support is available right now.
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
