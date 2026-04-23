import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, Compass, Phone, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";

export default function FamilyConsultation() {
  return (
    <>
      <SEOHead
        title="Crisis Coaching Session | Sober Helpline"
        description="Book a private 60-minute Crisis Coaching Session with a professional family interventionist. Get a clear, calm next step for your family today."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Crisis Coaching Session",
          provider: {
            "@type": "Organization",
            name: "Sober Helpline",
            url: "https://soberhelpline.com",
            telephone: "+1-541-241-5668"
          },
          areaServed: "US",
          serviceType: "Family addiction crisis coaching",
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
                Crisis Coaching Session
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A private 60-minute session with a professional family interventionist. For most families, this is the best place to start, one focused conversation to steady the situation and map a clear next step.
              </p>
            </div>

            <Card className="border-primary/20 shadow-sm mb-6">
              <CardHeader>
                <CardTitle className="text-xl">What to expect during your session</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-muted/30 p-4">
                  <Users className="h-5 w-5 text-primary mb-3" />
                  <h2 className="font-semibold mb-2">Tell us what's happening</h2>
                  <p className="text-sm text-muted-foreground">We listen carefully to your family's situation, the substances or behaviors involved, and what's already been tried.</p>
                </div>
                <div className="rounded-xl border bg-muted/30 p-4">
                  <Compass className="h-5 w-5 text-primary mb-3" />
                  <h2 className="font-semibold mb-2">Get an honest read</h2>
                  <p className="text-sm text-muted-foreground">We name the real risks, the patterns keeping you stuck, and where the family has more leverage than it realizes.</p>
                </div>
                <div className="rounded-xl border bg-muted/30 p-4">
                  <Clock className="h-5 w-5 text-primary mb-3" />
                  <h2 className="font-semibold mb-2">Leave with a clear next step</h2>
                  <p className="text-sm text-muted-foreground">You finish with one or two specific moves, what to say, what to stop doing, and whether more support is needed.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5 mb-6">
              <CardContent className="py-5">
                <p className="text-sm md:text-base text-foreground">
                  <span className="font-semibold">Members save $25</span> on every coaching session. Active{" "}
                  <Link to="/family-membership" className="text-primary hover:underline font-medium">family membership</Link>
                  {" "}members are billed at the discounted rate automatically at booking.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link to="/book-consultation" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Calendar className="h-4 w-4" />
                  Book Your Crisis Coaching Session
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Need something more substantial?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The Crisis Coaching Session is the right starting point for most families. If your situation calls for deeper work, these options are available after, or instead of, that first session:
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  <Link to="/family-readiness-intensive" className="rounded-xl border p-4 hover:border-primary hover:bg-muted/30 transition-colors">
                    <h3 className="font-semibold mb-1">Family Readiness Intensive</h3>
                    <p className="text-sm text-muted-foreground">A multi-session deep dive to assess whether you need a professionally led intervention or can run a coached DIY one.</p>
                  </Link>
                  <Link to="/family-coaching" className="rounded-xl border p-4 hover:border-primary hover:bg-muted/30 transition-colors">
                    <h3 className="font-semibold mb-1">Family Stabilization Plan™</h3>
                    <p className="text-sm text-muted-foreground">A 4-session plan to steady the household, align decision makers, and set workable boundaries.</p>
                  </Link>
                  <Link to="/family-coaching" className="rounded-xl border p-4 hover:border-primary hover:bg-muted/30 transition-colors">
                    <h3 className="font-semibold mb-1">Parallel Recovery Program™</h3>
                    <p className="text-sm text-muted-foreground">12 sessions of ongoing coaching for families navigating long-term recovery alongside their loved one.</p>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-center text-muted-foreground">
              Need to talk now instead? Call <a href="tel:5412415668" className="text-primary hover:underline">(541) 241-5668</a>.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
