import { Link } from "react-router-dom";
import { Calendar, Mail, PhoneCall, ShieldAlert } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import WhatsAppLink from "@/components/WhatsAppLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";

export default function Contact() {
  return (
    <>
      <SEOHead
        title="Contact Sober Helpline | Call, WhatsApp, Family Squares"
        description="Reach Sober Helpline by phone at (458) 298-8008 or WhatsApp +1 503-836-2136. Join Family Squares Monday at 7 PM Pacific. Family support, not emergency medical care."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Sober Helpline",
          url: "https://soberhelpline.com/contact",
          telephone: "+1-458-298-8008",
        }}
      />

      <div className="min-h-screen bg-background">
        <main>
          <section className="border-b bg-gradient-to-b from-primary/10 to-background py-14 md:py-20">
            <div className="container mx-auto max-w-3xl px-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Contact</p>
              <h1 className="text-4xl font-bold tracking-normal text-logo-blue md:text-5xl">
                Call, WhatsApp, or come to Family Squares.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                The fastest way to reach a person is the phone or WhatsApp. If it can wait until Monday, bring the question to the free Family Squares meeting.
              </p>
            </div>
          </section>

          <section className="container mx-auto max-w-3xl px-4 py-12">
            <div className="space-y-6">
              <Card>
                <CardContent className="space-y-4 p-6">
                  <h2 className="text-2xl font-bold text-foreground">Talk with us</h2>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button asChild size="lg">
                      <a href="tel:+14582988008" onClick={() => trackPhoneClick("contact_page")}>
                        <PhoneCall className="h-4 w-4" />
                        (458) 298-8008
                      </a>
                    </Button>
                    <WhatsAppLink source="contact_page" variant="button" label="WhatsApp +1 503-836-2136" />
                    <Button asChild size="lg" variant="outline" onClick={() => trackConversionEvent("monday_zoom_click", { source: "contact_page" })}>
                      <Link to="/family-squares">
                        <Calendar className="h-4 w-4" />
                        Family Squares · Monday 7 PM PT
                      </Link>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    WhatsApp works from outside the United States at{" "}
                    <a href="https://wa.me/5038362136" className="font-semibold text-logo-blue hover:underline">https://wa.me/5038362136</a>.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-3 p-6">
                  <h2 className="text-xl font-semibold text-foreground">App or account questions</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    For the Sober Helpline app, billing, or account access, email{" "}
                    <a href="mailto:support@soberhelpline.com" className="font-semibold text-logo-blue hover:underline">
                      support@soberhelpline.com
                    </a>{" "}
                    or use the{" "}
                    <Link to="/support" className="font-semibold text-logo-blue hover:underline">app support page</Link>.
                  </p>
                  <Button asChild variant="outline">
                    <a href="mailto:support@soberhelpline.com">
                      <Mail className="h-4 w-4" />
                      Email support
                    </a>
                  </Button>
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
