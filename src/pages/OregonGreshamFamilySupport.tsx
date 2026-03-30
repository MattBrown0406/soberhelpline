import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Gresham, Oregon affected by addiction.",
  url: "https://soberhelpline.com/oregon/gresham",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Gresham",
    addressRegion: "OR",
    addressCountry: "US",
  },
  areaServed: { "@type": "City", name: "Gresham" },
};

const otherCities = [
  { name: "Portland", slug: "portland" },
  { name: "Salem", slug: "salem" },
  { name: "Eugene", slug: "eugene" },
  { name: "Bend", slug: "bend" },
  { name: "Medford", slug: "medford" },
  { name: "Hillsboro", slug: "hillsboro" },
];

export default function OregonGreshamFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Gresham, Oregon | Sober Helpline"
        description="Families in Gresham struggling with a loved one's addiction get expert support, resources, and guidance from Sober Helpline. Free The Family Squares. (541) 838-6009."
        jsonLd={localBusinessSchema}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <nav className="container max-w-4xl mx-auto px-4 py-3 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link to="/oregon-family-support" className="hover:text-primary">Oregon Family Support</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground font-medium">Gresham</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Gresham, Oregon — East Multnomah County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in Gresham, Oregon
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Gresham is in East Multnomah County — the highest-poverty area in the Portland metro — and 
              has been one of the hardest-hit communities in Oregon's fentanyl crisis. Families here are often 
              dealing with addiction in the context of economic stress, housing instability, and limited access 
              to resources. Sober Helpline meets Gresham families where they are with free, accessible support.
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

        {/* Gresham Context */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-4">
              Gresham's Addiction Landscape
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Fentanyl</div>
                  <div className="text-sm text-muted-foreground">Gresham is among the hardest-hit areas in Oregon's fentanyl crisis</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Poverty</div>
                  <div className="text-sm text-muted-foreground">East Multnomah County's economic stress compounds addiction's impact on families</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Access</div>
                  <div className="text-sm text-muted-foreground">Gresham families need free, accessible support — not expensive programs</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm">
              Gresham families often can't afford expensive private intervention services or out-of-pocket treatment navigation. 
              Sober Helpline exists specifically for families like this: free weekly Zoom, low-cost hourly coaching, 
              and no referral fees — ever. We're here to help, not sell.
            </p>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-6">
              Gresham Local Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Al-Anon East Multnomah County
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Free, anonymous Al-Anon meetings serving the Gresham and East Portland areas. In-person and online options.
                  </p>
                  <a href="https://oregonal-anon.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    oregonal-anon.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Cascadia Behavioral Healthcare
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Serves East Multnomah County including Gresham with substance use treatment, crisis services, 
                    and mental health support. Medicaid accepted.
                  </p>
                  <a href="https://www.cascadiabhc.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    cascadiabhc.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Multnomah County SUD Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    County-funded treatment access for Gresham and East Portland residents, including crisis stabilization and Medicaid programs.
                  </p>
                  <a href="https://www.multco.us/health/alcohol-and-drug-services" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    multco.us/health <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Lines for Life — 24/7 Crisis Line
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Free, confidential crisis line for substance use emergencies serving all of Oregon including Gresham.
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
                      For Gresham families, cost shouldn't be a barrier to support. Monday Zoom is completely free — 
                      no sign-up fees, no membership, just real help from a certified interventionist.
                    </p>
                    <ul className="space-y-2 mb-4">
                      {[
                        "Completely free — always",
                        "No treatment center referrals or sales pressure",
                        "Real guidance from someone who's been in the trenches",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link to="/monday-zoom-registration">
                      <Button className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Reserve Your Spot
                      </Button>
                    </Link>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">FREE</div>
                    <div className="text-muted-foreground text-sm">Every Monday at 7 PM PST</div>
                    <div className="mt-4 text-sm text-muted-foreground">Questions? Call:</div>
                    <a href="tel:5418386009" className="text-primary font-semibold text-lg hover:underline">
                      (541) 838-6009
                    </a>
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
              Intervention Coaching for Gresham Families
            </h2>
            <p className="text-muted-foreground mb-6">
              Gresham families dealing with fentanyl crisis and limited resources need practical, affordable support. 
              Hourly coaching gives you direct access to a certified interventionist — no $10,000 intervention team, 
              no waitlist. Just expert help when you need it most.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                {[
                  "Affordable hourly rates — no large upfront commitment",
                  "Practical strategy for fentanyl and poly-drug situations",
                  "Navigate East Multnomah County treatment options",
                  "By phone or video — accessible from anywhere in Gresham",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3">
                <Link to="/family-coaching">
                  <Button size="lg" className="w-full gap-2">
                    <Phone className="h-4 w-4" />
                    Schedule Coaching
                  </Button>
                </Link>
                <a href="tel:5418386009">
                  <Button size="lg" variant="outline" className="w-full gap-2">
                    <Phone className="h-4 w-4" />
                    Call (541) 838-6009
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Other Cities */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-logo-green mb-4">Other Oregon Cities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {otherCities.map((city) => (
                <Link key={city.slug} to={`/oregon/${city.slug}`}
                  className="block text-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-muted-foreground hover:text-primary">
                  {city.name}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/oregon-family-support" className="text-primary text-sm hover:underline">
                ← Back to Oregon Family Support
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-bold text-logo-green mb-2">
              Gresham Families: Free Help Is Here
            </h2>
            <p className="text-muted-foreground mb-5 max-w-xl mx-auto text-sm">
              Cost shouldn't stop you from getting help. Free Monday Zoom every week. Call anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/monday-zoom-registration">
                <Button className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Join Free Monday Zoom
                </Button>
              </Link>
              <a href="tel:5418386009">
                <Button variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  (541) 838-6009
                </Button>
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
