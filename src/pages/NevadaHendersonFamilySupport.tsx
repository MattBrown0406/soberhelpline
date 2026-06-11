import { Link } from "react-router-dom";
import { Phone, Heart, Users, MapPin, Calendar, ChevronRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families in Henderson, Nevada affected by addiction.",
  url: "https://soberhelpline.com/nevada/henderson",
  telephone: "+14582027900",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Henderson",
    addressRegion: "NV",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Henderson",
  },
};

const otherCities = [
  { name: "Las Vegas", slug: "las-vegas" },
  { name: "Reno", slug: "reno" },
];

export default function NevadaHendersonFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Henderson, Nevada | Sober Helpline"
        description="Families in Henderson struggling with a loved one's addiction get expert support from Sober Helpline. Free “The Family Squares” every Monday 7PM PST. (458) 202-7900."
        jsonLd={localBusinessSchema}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <nav className="container max-w-4xl mx-auto px-4 py-3 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li><Link to="/nevada-family-support" className="hover:text-primary">Nevada Family Support</Link></li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground font-medium">Henderson</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Henderson, Nevada — Clark County
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-5 leading-tight">
              Addiction Family Support in Henderson, Nevada
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Henderson is one of Nevada's fastest-growing suburban cities — and its proximity to the Las Vegas Strip 
              creates a unique addiction landscape. With ~325,000 residents in Clark County's second-largest city, 
              alcohol and gambling addiction are pervasive, and the easy access to the Strip makes it difficult 
              for families to draw the line between recreation and crisis. Sober Helpline helps Henderson families 
              find that line — and act on it.
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

        {/* Henderson Context */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-blue mb-4">
              Henderson's Addiction Challenge &amp; What Families Face
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">~325k</div>
                  <div className="text-sm text-muted-foreground">Residents in Clark County's second city — fast growth means addiction resources haven't kept pace</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Alcohol</div>
                  <div className="text-sm text-muted-foreground">High alcohol use disorder rates tied to gambling culture and Strip proximity — hiding in suburbia</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-primary mb-1">Suburban</div>
                  <div className="text-sm text-muted-foreground">Addiction in Henderson often goes unnoticed longer — the suburban setting creates a false sense of normalcy</div>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground text-sm">
              Henderson families often face what many call "high-functioning addiction" — a loved one who holds down 
              a job, maintains appearances, but is quietly destroying themselves and the family system. 
              Sober Helpline coaching helps families recognize the patterns and take action before the crisis escalates.
            </p>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-10 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-blue mb-6">
              Henderson Local Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    St. Rose Dominican Hospital
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Major hospital system serving Henderson and the Las Vegas Valley with behavioral health 
                    services, detox referrals, and emergency psychiatric care for Clark County residents.
                  </p>
                  <a href="https://www.dignityhealth.org/nevada" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    dignityhealth.org/nevada <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Montevista Hospital
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Las Vegas-area psychiatric hospital providing inpatient mental health and dual diagnosis 
                    treatment for adults and adolescents — serving Henderson and Clark County.
                  </p>
                  <a href="https://www.montevistahospital.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    montevistahospital.com <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    WestCare Nevada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    One of Nevada's leading substance use treatment providers with programs serving Henderson 
                    and the broader Las Vegas Valley, including family support services.
                  </p>
                  <a href="https://www.westcare.com/nevada" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    westcare.com <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-logo-blue flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Henderson Mental Health Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Community-based mental health and substance use services for Henderson residents, 
                    including outpatient counseling and crisis intervention on a sliding fee scale.
                  </p>
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
                    <h2 className="text-xl md:text-2xl font-bold text-logo-blue mb-3">
                      Free “The Family Squares” Zoom
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      Henderson families join families from across Nevada every Monday for free, 
                      judgment-free support. Led by certified interventionist Matt Brown — no treatment center 
                      names, no sales pressure, no agenda except helping your family.
                    </p>
                    <ul className="space-y-2 mb-4">
                      {[
                        "100% free — no membership required",
                        "Ask questions, share your situation, get real answers",
                        "Connect with other Clark County families",
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
                    <div className="mt-4 text-sm text-muted-foreground">
                      Questions? Call us directly:
                    </div>
                    <a href="tel:4582027900" className="text-primary font-semibold text-lg hover:underline">
                      (458) 202-7900
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
            <h2 className="text-2xl font-bold text-logo-blue mb-4">
              One-on-One Intervention Coaching for Henderson Families
            </h2>
            <p className="text-muted-foreground mb-6">
              When a support group isn't enough, hourly coaching with a certified interventionist gives Henderson 
              families a concrete plan. We help you identify enabling patterns, set real boundaries with consequences, 
              and prepare for the conversations that matter most.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <ul className="space-y-3">
                {[
                  "Personalized strategy for your family situation",
                  "CRAFT-based communication coaching",
                  "Boundary planning with real follow-through",
                  "Available by phone or video — anywhere in Henderson or Clark County",
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
                <a href="tel:4582027900">
                  <Button size="lg" variant="outline" className="w-full gap-2">
                    <Phone className="h-4 w-4" />
                    Call (458) 202-7900
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Other Cities */}
        <section className="py-10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-logo-blue mb-4">Other Nevada Cities</h2>
            <div className="grid grid-cols-2 gap-3 max-w-xs">
              {otherCities.map((city) => (
                <Link
                  key={city.slug}
                  to={`/nevada/${city.slug}`}
                  className="block text-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  {city.name}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/nevada-family-support" className="text-primary text-sm hover:underline inline-flex items-center gap-1">
                ← Back to Nevada Family Support
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-bold text-logo-blue mb-2">
              Henderson Families: You Don't Have to Do This Alone
            </h2>
            <p className="text-muted-foreground mb-5 max-w-xl mx-auto text-sm">
              Whether you're in crisis or just starting to recognize the problem, Sober Helpline is here. 
              Free Monday Zoom every week. Coaching available now.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/monday-zoom-registration">
                <Button className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Join Free Monday Zoom
                </Button>
              </Link>
              <a href="tel:4582027900">
                <Button variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  (458) 202-7900
                </Button>
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
