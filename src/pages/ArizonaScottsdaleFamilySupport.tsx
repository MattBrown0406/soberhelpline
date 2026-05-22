import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Scottsdale, Arizona affected by addiction.",
  url: "https://soberhelpline.com/arizona/scottsdale",
  telephone: "+14582027900",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Scottsdale",
    addressRegion: "AZ",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Scottsdale",
  },
};

const otherCities = [
  { name: "Phoenix", slug: "phoenix" },
  { name: "Tucson", slug: "tucson" },
];

export default function ArizonaScottsdaleFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Scottsdale, Arizona | Sober Helpline"
        description="Families in Scottsdale struggling with a loved one's addiction get expert support from Sober Helpline. Free “The Family Squares” every Monday 7PM PST. (458) 202-7900."
        jsonLd={localBusinessSchema}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <nav className="container max-w-4xl mx-auto px-4 py-3 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link to="/arizona-family-support" className="hover:text-primary">Arizona Family Support</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground font-medium">Scottsdale</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <MapPin className="h-4 w-4" />
              Scottsdale, Arizona
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Addiction Family Support in Scottsdale, Arizona
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Scottsdale's affluent communities face a hidden addiction crisis. High-functioning addiction — fueled by prescription opioids, alcohol, and stimulants — thrives behind closed doors. Families here often suffer in silence. You don't have to.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/coaching">
                  <Calendar className="mr-2 h-5 w-5" />
                  Get Intervention Coaching
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="tel:+14582027900">
                  <Phone className="mr-2 h-5 w-5" />
                  Call (458) 202-7900
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Scottsdale Context */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-start gap-4 mb-6">
              <Heart className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Scottsdale's Hidden Addiction Crisis
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Scottsdale, Maricopa County's most affluent city, faces an addiction crisis that rarely makes headlines. High-functioning addiction — executives, professionals, and parents maintaining careers while secretly dependent on alcohol, prescription opioids, or stimulants — is epidemic here. The luxury rehab industry has grown in Scottsdale precisely because families have the means to seek help privately, but many wait too long.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Scottsdale also sits within the broader Phoenix metro fentanyl crisis. Maricopa County recorded over 1,200 overdose deaths in 2023, and the illusion of safety in affluent zip codes is just that — an illusion. Prescription drug misuse transitions to street drugs faster than families expect.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Families in Scottsdale often struggle with denial amplified by success — "They have so much to lose, they'll stop on their own." They rarely do without help. If you're watching someone you love struggle, you are not overreacting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex items-start gap-4 mb-8">
              <Users className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div className="w-full">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Local Resources in Scottsdale & Maricopa County
                </h2>
                <p className="text-muted-foreground mb-6">Professional support available in your area:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: "HonorHealth Scottsdale", desc: "Behavioral health and detox services in Scottsdale", url: "https://www.honorhealth.com" },
                    { name: "Barrett Behavioral Health", desc: "Outpatient and intensive outpatient programs", url: "https://www.barrettbehavioral.com" },
                    { name: "Scottsdale Recovery Center", desc: "Inpatient and outpatient addiction treatment", url: "https://www.scottsdalerecoverycenter.com" },
                    { name: "Rosecrance (outpatient)", desc: "Evidence-based outpatient addiction services", url: "https://www.rosecrance.org" },
                    { name: "Arizona Crisis Line", desc: "24/7 crisis support: 1-844-534-4673", url: "tel:18445344673" },
                    { name: "Al-Anon Arizona", desc: "Family support groups for addiction", url: "https://www.al-anon.org/find-a-meeting" },
                  ].map((r) => (
                    <Card key={r.name} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 group">
                          <ExternalLink className="h-4 w-4 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                          <div>
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{r.name}</div>
                            <div className="text-sm text-muted-foreground">{r.desc}</div>
                          </div>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Monday Zoom */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Calendar className="h-7 w-7 text-primary" />
                  “The Family Squares” — Free
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Every Monday at <strong>7:00 PM PST</strong>, Sober Helpline hosts a live Zoom call for families navigating a loved one's addiction — free to attend, no registration required.
                </p>
                <div className="bg-white rounded-lg p-4 border border-primary/20">
                  <p className="text-sm font-medium text-foreground">
                    <strong>Important:</strong> No treatment center names are mentioned on these calls. We maintain a strict policy to keep the focus entirely on your family's needs — education, not referrals.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Scottsdale families often find that connecting with others in similar situations — regardless of zip code or income — is one of the most powerful steps they can take.
                </p>
                <Button asChild>
                  <Link to="/monday-zoom-registration">Join the Monday Zoom →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Coaching */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-4xl mx-auto px-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                  Hourly Intervention Coaching
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Our hourly coaching gives your family everything needed to conduct an effective intervention — the strategy, the scripts, the preparation, and the confidence.
                </p>
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm text-foreground leading-relaxed">
                    <strong>Our philosophy:</strong> We equip families to lead their own intervention first. A professionally led intervention is expensive — and many families don't need one. After coaching, your family decides. If a professional is needed, we help you get there.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild>
                    <Link to="/coaching">Start Coaching →</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="tel:+14582027900">
                      <Phone className="mr-2 h-4 w-4" />
                      Call (458) 202-7900
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Other AZ Cities */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Other Arizona Cities We Serve</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {otherCities.map((city) => (
                <Link key={city.slug} to={`/arizona/${city.slug}`} className="group">
                  <Card className="hover:shadow-md transition-shadow group-hover:border-primary/30">
                    <CardContent className="p-4 flex items-center justify-between">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">{city.name}, Arizona</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
              <Link to="/arizona-family-support" className="group">
                <Card className="hover:shadow-md transition-shadow group-hover:border-primary/30">
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">All Arizona Resources</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
