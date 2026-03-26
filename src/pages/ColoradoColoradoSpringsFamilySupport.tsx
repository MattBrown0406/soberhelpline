import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Colorado Springs, Colorado affected by addiction.",
  url: "https://soberhelpline.com/colorado/colorado-springs",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Colorado Springs",
    addressRegion: "CO",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Colorado Springs",
  },
};

const otherCities = [
  { name: "Denver", slug: "denver" },
  { name: "Fort Collins", slug: "fort-collins" },
];

export default function ColoradoColoradoSpringsFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Colorado Springs, Colorado | Sober Helpline"
        description="Families in Colorado Springs struggling with a loved one's addiction get expert support, resources, and guidance from Sober Helpline. Free Monday night Zoom. (541) 838-6009."
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
            <li className="text-foreground font-medium">Colorado Springs</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Colorado Springs, Colorado — El Paso County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in Colorado Springs, Colorado
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Colorado Springs and El Paso County — home to nearly 480,000 people — face a unique addiction crisis
              shaped by its large military community. Ft. Carson and the US Air Force Academy bring thousands of
              service members and veterans, many dealing with PTSD, alcohol dependency, and opioid use as they cope
              with the aftermath of combat. Families of military personnel need specialized understanding and support.
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

        {/* Colorado Springs Context */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-4">Colorado Springs' Addiction Landscape</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">~480K</div>
                  <div className="text-sm text-muted-foreground">El Paso County population, 2nd largest in Colorado</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Military</div>
                  <div className="text-sm text-muted-foreground">Ft. Carson & USAFA — high rates of PTSD-linked addiction</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">↑ Opioids</div>
                  <div className="text-sm text-muted-foreground">Prescription opioid and fentanyl use elevated in veteran population</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Military families in Colorado Springs often struggle silently — the culture of strength and service can make it
              harder to ask for help. PTSD and addiction frequently co-occur among veterans, making treatment more complex.
              Alcohol is the most common substance, but opioids and fentanyl are increasingly present. Families navigating
              a veteran's addiction deserve compassionate, informed guidance that understands military culture.
            </p>
          </div>
        </section>

        {/* Colorado Springs Resources */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-6">Colorado Springs Family Addiction Resources</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    UCHealth Memorial Hospital
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    UCHealth Memorial provides behavioral health and addiction treatment services in Colorado Springs,
                    including inpatient psychiatric care and substance use treatment referrals.
                  </p>
                  <a href="https://www.uchealth.org/locations/uchealth-memorial-hospital-central/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    uchealth.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Peak View Behavioral Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    A dedicated behavioral health hospital in Colorado Springs providing inpatient and outpatient
                    mental health and substance use disorder treatment for adults and adolescents.
                  </p>
                  <a href="https://www.peakviewbh.com" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    peakviewbh.com <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    AspenPointe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    AspenPointe provides comprehensive mental health and substance use treatment in El Paso County,
                    with programs specifically serving military families and veterans.
                  </p>
                  <a href="https://www.aspenpointe.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    aspenpointe.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-logo-green text-base">
                    <Users className="h-4 w-4 text-primary" />
                    Independence Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Provides support services for individuals with behavioral health challenges in Colorado Springs,
                    including peer support, recovery coaching, and family navigation services.
                  </p>
                  <a href="https://www.independencecenter.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    independencecenter.org <ExternalLink className="h-3 w-3" />
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
                    Colorado Crisis Services has a walk-in crisis center in Colorado Springs available 24/7 for
                    mental health and substance use emergencies.
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
                  Every Monday at 7PM PST, Colorado Springs families join a free Zoom call led by Matt Brown —
                  a certified interventionist with 20+ years of experience. Ask real questions, get real answers.
                  No treatment center referrals, no sales pitch.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Free — no cost, no commitment",
                    "Anonymous — share what you're comfortable with",
                    "Led by a certified interventionist",
                    "Military families especially welcome",
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
            <h2 className="text-2xl font-bold text-logo-green mb-3">Colorado Springs Families: Help Is Here</h2>
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
