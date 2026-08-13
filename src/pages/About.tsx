import { Link } from "react-router-dom";
import { Calendar, PhoneCall, ShieldAlert } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import WhatsAppLink from "@/components/WhatsAppLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";
import { mattBrownPersonSchema } from "@/lib/mattBrownSchema";

export default function About() {
  return (
    <>
      <SEOHead
        title="About Sober Helpline | Free Family Support"
        description="Sober Helpline is free family support, education, and a live Monday Family Squares meeting. Matt Brown, a certified interventionist, is the person behind it."
        personJsonLd={mattBrownPersonSchema}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Sober Helpline",
          url: "https://soberhelpline.com/about",
          description: "Free family support, education, and live Monday Family Squares. Not a treatment center and not a placement funnel.",
        }}
      />

      <div className="min-h-screen bg-background">
        <main>
          <section className="border-b bg-gradient-to-b from-primary/10 to-background py-14 md:py-20">
            <div className="container mx-auto max-w-3xl px-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">About</p>
              <h1 className="text-4xl font-bold tracking-normal text-logo-blue md:text-5xl">
                Free family support when addiction has thrown the household off balance.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Sober Helpline is education and support for families. It is a place to get clearer on enabling, boundaries, and next steps — including a live Family Squares meeting every Monday at 7:00 PM Pacific.
              </p>
            </div>
          </section>

          <section className="container mx-auto max-w-3xl px-4 py-12">
            <div className="space-y-8">
              <Card>
                <CardContent className="space-y-4 p-6">
                  <h2 className="text-2xl font-bold text-foreground">Who is behind it</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    Matt Brown is a certified interventionist and the founder of Sober Helpline. He leads the free Monday Family Squares meeting and works with families who need a calmer read on what to do next.
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    Sober Helpline is not a treatment center and does not sell placements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-4 p-6">
                  <h2 className="text-2xl font-bold text-foreground">How to reach us</h2>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button asChild>
                      <a href="tel:+14582988008" onClick={() => trackPhoneClick("about_page")}>
                        <PhoneCall className="h-4 w-4" />
                        Call (458) 298-8008
                      </a>
                    </Button>
                    <WhatsAppLink source="about_page" variant="button" label="WhatsApp +1 503-836-2136" />
                    <Button asChild variant="outline" onClick={() => trackConversionEvent("monday_zoom_click", { source: "about_page" })}>
                      <Link to="/family-squares">
                        <Calendar className="h-4 w-4" />
                        Family Squares · Monday 7 PM PT
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/20">
                <CardContent className="flex gap-3 p-6 text-sm leading-relaxed text-muted-foreground">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
                  <p>
                    Sober Helpline is family support, not emergency medical care. If someone is in immediate danger, call{" "}
                    <a href="tel:911" className="font-semibold text-foreground underline">911</a>. If you are in a mental-health crisis, call or text{" "}
                    <a href="tel:988" className="font-semibold text-foreground underline">988</a>.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
