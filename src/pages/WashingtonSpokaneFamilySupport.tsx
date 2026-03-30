import { Link } from "react-router-dom";
import { Phone, Heart, MapPin, Calendar, ChevronRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Sober Helpline",
  description: "Family support and intervention coaching for families affected by addiction in Spokane, Washington.",
  url: "https://soberhelpline.com/washington/spokane",
  telephone: "+15418386009",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Spokane",
    addressRegion: "WA",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Spokane",
  },
  sameAs: ["https://soberhelpline.com"],
};

const nearbyCities = [
  { name: "Seattle", slug: "seattle" },
  { name: "Tacoma", slug: "tacoma" },
  { name: "Bellevue", slug: "bellevue" },
  { name: "Everett", slug: "everett" },
  { name: "Olympia", slug: "olympia" },
  { name: "Vancouver WA", slug: "vancouver" },
];

export default function WashingtonSpokaneFamilySupport() {
  return (
    <>
      <SEOHead
        title="Family Support for Addiction in Spokane, Washington | Sober Helpline"
        description="Families in Spokane struggling with a loved one's addiction get expert support and resources from Sober Helpline. Free “The Family Squares”. (541) 838-6009."
        jsonLd={localBusinessSchema}
        speakableSelectors={["h1", "h2", ".hero-description"]}
      />

      <div className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/washington-family-support" className="hover:text-primary transition-colors">Washington Family Support</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Spokane</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-3.5 w-3.5" />
              Spokane, Washington
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-5 leading-tight">
              Addiction Family Support in Spokane, Washington
            </h1>
            <p className="hero-description text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Eastern Washington and the Spokane region sit along a major methamphetamine corridor, compounded
              by rural poverty and limited access to addiction treatment. Families here face unique challenges —
              and Sober Helpline provides free, accessible support wherever you are.
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
              Spokane's Addiction Crisis and Its Impact on Families
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>
                Spokane and Eastern Washington are situated along what law enforcement and public health officials
                describe as a methamphetamine corridor connecting the Pacific Northwest to larger supply routes.
                Meth use in the region is compounded by high rates of rural poverty, limited healthcare access,
                and communities where addiction carries significant stigma — making it harder for families to
                seek help openly.
              </p>
              <p>
                Spokane Regional Health District tracks addiction trends across the region and coordinates
                behavioral health referrals. Frontier Behavioral Health is one of the area's primary providers
                for mental health and substance use treatment in Spokane County — serving families who often
                have limited alternatives due to geography and resources.
              </p>
              <p>
                For Spokane families, the distance from major urban resources shouldn't mean isolation. Sober
                Helpline's virtual coaching and free Monday Zoom bring expert intervention guidance directly
                to you — no travel required, no expensive in-person teams.
              </p>
            </div>
          </div>
        </section>

        {/* Local Resources */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-logo-green text-center mb-8">
              Spokane Addiction Family Resources
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Washington Recovery Help Line
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Free, confidential statewide resource and referral line. Connects Spokane families
                    with local treatment providers and support services 24/7.
                  </p>
                  <a href="tel:18667891511" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
                    <Phone className="h-4 w-4" />
                    1-866-789-1511
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Frontier Behavioral Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spokane County's primary community behavioral health organization offering
                    mental health and substance use treatment services.
                  </p>
                  <a href="https://www.fbhwa.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    fbhwa.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Spokane Regional Health District
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tracks addiction trends and coordinates behavioral health referrals across
                    Spokane County. Can connect families with local treatment resources.
                  </p>
                  <a href="https://srhd.org" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    srhd.org <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-logo-green text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Al-Anon Spokane Meetings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Al-Anon meetings in Spokane and Eastern Washington for families of people
                    with alcohol use disorder. Free, anonymous, in-person and online.
                  </p>
                  <a href="https://al-anon.org/find-a-meeting" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm hover:underline">
                    Find a meeting <ExternalLink className="h-3 w-3" />
                  </a>
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
                  Free Family Squares Zoom for Spokane Families
                </h2>
                <p className="text-muted-foreground mb-4">
                  Every Monday at 7PM PST — join families from Spokane and across Washington for a free
                  support call with Matt Brown, certified interventionist. Geography is no barrier.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "No cost, no sales pitch, no treatment center referrals",
                    "Real answers from an experienced interventionist",
                    "Connect with other Eastern WA families",
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
                  One-on-one coaching for Spokane families who need a strategy. Available by phone or
                  video — no expensive in-person teams, no travel required.
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

        {/* Other WA Cities */}
        <section className="py-12 bg-muted/40">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-logo-green text-center mb-6">
              Support for Other Washington Families
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nearbyCities.map((city) => (
                <Link key={city.slug} to={`/washington/${city.slug}`} className="block group">
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
              <Link to="/washington-family-support" className="text-primary hover:underline text-sm">
                ← Back to Washington Family Support
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-primary/5 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-logo-green mb-3">
              Spokane Families: Help Is Here
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Distance shouldn't mean you're on your own. Free Monday Zoom or direct coaching —
              expert intervention guidance available to Eastern Washington families right now.
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
