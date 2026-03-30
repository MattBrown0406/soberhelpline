import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Salem, Oregon affected by addiction.",
  url: "https://soberhelpline.com/oregon/salem",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Salem",
    addressRegion: "OR",
    addressCountry: "US",
  },
  areaServed: { "@type": "City", name: "Salem" },
};

const otherCities = [
  { name: "Portland", slug: "portland" },
  { name: "Eugene", slug: "eugene" },
  { name: "Bend", slug: "bend" },
  { name: "Medford", slug: "medford" },
  { name: "Gresham", slug: "gresham" },
  { name: "Hillsboro", slug: "hillsboro" },
];

export default function OregonSalemFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Salem, Oregon | Sober Helpline"
        description="Families in Salem struggling with a loved one's addiction get expert support, resources, and guidance from Sober Helpline. Free The Family Squares. (541) 838-6009."
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
            <li className="text-foreground font-medium">Salem</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Salem, Oregon — Marion County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in Salem, Oregon
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Salem and Marion County have been heavily impacted by methamphetamine and opioid addiction.
              As Oregon's state capital, Salem has public health infrastructure — but families still struggle
              to find the right support, navigate treatment options, and break enabling patterns that keep their
              loved ones stuck. Sober Helpline provides direct, compassionate guidance to Salem families.
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

        {/* Salem Context */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-4">
              Salem's Addiction Landscape
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Meth</div>
                  <div className="text-sm text-muted-foreground">Marion County has among the highest methamphetamine rates in Oregon</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Opioids</div>
                  <div className="text-sm text-muted-foreground">Fentanyl has mixed into the local drug supply, increasing overdose risk dramatically</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Capital</div>
                  <div className="text-sm text-muted-foreground">Salem's state resources can help — with the right navigation support</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm">
              Salem families often feel the tension between hope ("there must be resources here — it's the state capital") and 
              frustration (long waitlists, insurance gaps, programs that don't match their loved one's needs). 
              Coaching helps families cut through that confusion and move toward action.
            </p>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green mb-6">
              Salem Local Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Al-Anon Salem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Weekly meetings for family members of people with alcohol use disorder. Free, anonymous, no pressure.
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
                    Bridgeway Recovery Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Salem-based outpatient treatment provider offering substance use counseling, DUI programs, 
                    and mental health support for Marion County residents.
                  </p>
                  <a href="https://www.bridgewayrecovery.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    bridgewayrecovery.com <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-green flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Marion County Health &amp; Human Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    County behavioral health services, including substance use treatment referrals and crisis support for Salem-area families.
                  </p>
                  <a href="https://www.co.marion.or.us/HLT/Pages/default.aspx" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    co.marion.or.us/HLT <ExternalLink className="h-3 w-3" />
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
                    Free, confidential statewide crisis line for substance use and mental health emergencies.
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
                      Salem families join every Monday night for free support led by certified interventionist Matt Brown. 
                      No treatment center names. No sales pitch. Just real guidance.
                    </p>
                    <ul className="space-y-2 mb-4">
                      {[
                        "100% free — no membership required",
                        "Ask questions, share your situation",
                        "Connect with families across Oregon",
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
              One-on-One Intervention Coaching for Salem Families
            </h2>
            <p className="text-muted-foreground mb-6">
              Hourly coaching with a certified interventionist helps Salem families build a real plan — 
              not just survive the next crisis. We work one-on-one to identify enabling, set boundaries, and 
              create the conditions where treatment becomes the logical next step.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3">
                {[
                  "Identify enabling patterns specific to your situation",
                  "Build a boundary plan your loved one will take seriously",
                  "Prepare for treatment conversations",
                  "Available by phone or video — anywhere in Salem",
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
                <Link
                  key={city.slug}
                  to={`/oregon/${city.slug}`}
                  className="block text-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-muted-foreground hover:text-primary"
                >
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
              Salem Families: Help Is Here
            </h2>
            <p className="text-muted-foreground mb-5 max-w-xl mx-auto text-sm">
              Free support every Monday night. Coaching available now. You don't have to figure this out alone.
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
