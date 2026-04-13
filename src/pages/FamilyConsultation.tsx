import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Phone, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

export default function FamilyConsultation() {
  return (
    <>
      <SEOHead
        title="Family Consultation | Sober Helpline"
        description="Book a private family addiction consultation, choose the level of support that fits, and get a clear next step without the usual runaround."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Family Addiction Consultation",
          provider: {
            "@type": "Organization",
            name: "Sober Helpline",
            url: "https://soberhelpline.com",
            telephone: "+1-541-241-5668"
          },
          areaServed: "US",
          serviceType: "Family addiction consultation",
          url: "https://soberhelpline.com/family-consultation"
        }}
      />

      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <Link to="/family-support" className="inline-flex items-center text-primary hover:text-primary/80 mb-6 group">
              <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
              Back to Family Support
            </Link>

            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Shield className="h-4 w-4" />
                Practical support, not more chaos
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Private Family Consultation
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                This is the private option. For most families, the best order is simple: start with the free Monday Zoom, use membership for ongoing support, and come here when you need one-on-one guidance.
              </p>
            </div>

            <Card className="border-primary/20 shadow-sm mb-8">
              <CardHeader>
                <CardTitle className="text-xl">What happens next</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-muted/30 p-4">
                  <Calendar className="h-5 w-5 text-primary mb-3" />
                  <h2 className="font-semibold mb-2">Choose the right consult</h2>
                  <p className="text-sm text-muted-foreground">Emergency support, stabilization, and longer coaching paths are all in one place.</p>
                </div>
                <div className="rounded-xl border bg-muted/30 p-4">
                  <Users className="h-5 w-5 text-primary mb-3" />
                  <h2 className="font-semibold mb-2">Share your situation once</h2>
                  <p className="text-sm text-muted-foreground">The updated intake asks better questions so your next conversation starts with context.</p>
                </div>
                <div className="rounded-xl border bg-muted/30 p-4">
                  <Shield className="h-5 w-5 text-primary mb-3" />
                  <h2 className="font-semibold mb-2">Get a steadier plan</h2>
                  <p className="text-sm text-muted-foreground">The goal is simple, fewer reactive moves and a clearer next step for your family.</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Link to="/monday-zoom-registration">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Calendar className="h-4 w-4" />
                  Start with the Free Monday Zoom
                </Button>
              </Link>
              <Link to="/family-membership">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Users className="h-4 w-4" />
                  Explore Membership
                </Button>
              </Link>
              <Link to="/book-consultation">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  Book Private Consultation
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <p className="text-sm text-center text-muted-foreground">
              Need to talk now instead? Call <a href="tel:5412415668" className="text-primary hover:underline">(541) 241-5668</a>.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
