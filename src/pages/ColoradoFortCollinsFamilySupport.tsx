import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Fort Collins, Colorado affected by addiction.",
  url: "https://soberhelpline.com/colorado/fort-collins",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Fort Collins",
    addressRegion: "CO",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Fort Collins",
  },
};

const otherCities = [
  { name: "Denver", slug: "denver" },
  { name: "Colorado Springs", slug: "colorado-springs" },
];

export default function ColoradoFortCollinsFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Fort Collins, Colorado | Sober Helpline"
        description="Families in Fort Collins struggling with a loved one's addiction get expert support, resources, and guidance from Sober Helpline. Free Monday night Zoom. (541) 838-6009."
        jsonLd={localBusinessSchema}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <nav className="container max-w-4xl mx-auto px-4 py-3 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link to="/colorado-family-support" className="hover:text-primary">Colorado Family Support</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground font-medium">Fort Collins</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Fort Collins, Colorado — Larimer County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in Fort Collins, Colorado
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Fort Collins and Larimer County — home to approximately 165,000 people and Colorado State University —
              face a growing young adult addiction crisis. CSU's campus brings tens of thousands of students where
              opioids, alcohol, and cannabis use disorders develop quickly and quietly. Parents watching a college-age
              child spiral need guidance that understands the unique challenges of young adult addiction.
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

        {/* Fort Collins Context */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-4">Fort Collins' Addiction Landscape</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">~165K</div>
                  <div className="text-sm text-muted-foreground">Larimer County city population, CSU college town</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Young</div>
                  <div className="text-sm text-muted-foreground">18-25 age group most affected — college & young adult addiction</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">↑ Cannabis</div>
                  <div className="text-sm text-muted-foreground">High cannabis use disorder rates alongside opioid and alcohol issues</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Fort Collins has a thriving craft brewery scene and a culture where drinking is normalized at every level.
              CSU students face academic pressure, social isolation, and easy access to both alcohol and drugs.
              Opioid use — including fentanyl in counterfeit pills bought at parties — is increasingly common.
              Parents in Fort Collins often feel helpless when their child is away at school and showing warning signs.
            </p>
          </div>
        </section>

        {/* Fort Collins Resources */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-6">Fort Collins Family Addiction Resources</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    UCHealth Poudre Valley Hospital
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    The primary hospital for Larimer County, UCHealth Poudre Valley offers behavioral health
                    services including crisis stabilization and substance use treatment referrals.
                  </p>
                  <a href="https://www.uchealth.org/locations/uchealth-poudre-valley-hospital/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    uchealth.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    SummitStone Health Partners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    The primary community behavioral health center for Larimer County, SummitStone provides
                    outpatient mental health and substance use treatment including services for young adults.
                  </p>
                  <a href="https://www.summitstonehealth.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    summitstonehealth.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Larimer County Behavioral Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Larimer County's public behavioral health services provide access to crisis care,
                    substance use treatment, and mental health resources for county residents.
                  </p>
                  <a href="https://www.larimer.gov/behavioralhealth" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    larimer.gov/behavioralhealth <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Al-Anon & Nar-Anon Fort Collins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Multiple Al-Anon and Nar-Anon meetings available in Fort Collins and the greater
                    Larimer County area. Free, anonymous support for families.
                  </p>
                  <a href="https://www.al-anon.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    al-anon.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Phone className="h-4 w-4 text-primary" />
                    Colorado Crisis Services — 24/7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Colorado Crisis Services is available 24/7 statewide for mental health and substance use
                    emergencies. Crisis centers and mobile teams available in Larimer County.
                  </p>
                  <a href="tel:18444938255"
                    className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                    <Phone className="h-4 w-4" />
                    1-844-493-8255
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
                  Free Monday Night Family Support Zoom
                </h2>
                <p className="text-muted-foreground mb-4">
                  Every Monday at 7PM PST, Fort Collins families join a free Zoom call led by Matt Brown —
                  a certified interventionist with 20+ years of experience. Especially helpful for parents
                  of young adults dealing with college-age addiction.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Free — no cost, no commitment",
                    "Anonymous — share what you're comfortable with",
                    "Parents of young adults especially welcome",
                    "No treatment center referrals or sales pressure",
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

        {/* Other Colorado Cities */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-logo-green mb-4">Other Colorado Cities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherCities.map((city) => (
                <Link key={city.slug} to={`/colorado/${city.slug}`} className="block group">
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
              <Link to="/colorado-family-support" className="text-primary text-sm hover:underline">
                ← Back to Colorado Family Support
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-10 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-logo-green mb-3">Fort Collins Families: Help Is Here</h2>
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
