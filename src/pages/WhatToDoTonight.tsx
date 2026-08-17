import { Link } from "react-router-dom";
import { AlertTriangle, Calendar, Car, KeyRound, Moon, PhoneCall, Shield, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import WhatsAppLink from "@/components/WhatsAppLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";

export default function WhatToDoTonight() {
  return (
    <>
      <SEOHead
        title="What to Do Tonight | Sober Helpline"
        description="A free tonight plan for families: safety first, what to say and not say, practical steps for money, keys, and kids, then Family Squares or a phone call."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "What to Do Tonight",
          url: "https://soberhelpline.com/what-to-do-tonight",
          description: "Free family guidance for tonight when addiction has the household in chaos. Not emergency medical care.",
        }}
      />

      <div className="min-h-screen bg-background">
        <main>
          <section className="border-b bg-gradient-to-b from-primary/10 to-background py-14 md:py-20">
            <div className="container mx-auto max-w-3xl px-4">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                <Moon className="h-4 w-4" />
                Free tonight plan
              </div>
              <h1 className="text-4xl font-bold tracking-normal text-logo-blue md:text-5xl">
                You do not have to solve the whole problem before morning.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                This page is for the 2 a.m. stretch: keep people safe, stop the argument, and hold one or two practical lines until you can get support. Sober Helpline is family support, not emergency medical care.
              </p>
            </div>
          </section>

          <section className="container mx-auto max-w-3xl space-y-6 px-4 py-12">
            <Card className="border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                  Safety first
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  If someone is in immediate danger, call{" "}
                  <a href="tel:911" className="font-semibold text-foreground underline">911</a>. Sober Helpline does not handle medical emergencies.
                </p>
                <p>
                  If you are in a mental-health crisis, call or text{" "}
                  <a href="tel:988" className="font-semibold text-foreground underline">988</a>.
                </p>
                <p>
                  If you have naloxone and know how to use it, use it and call emergency services. Do not wait on this page for medical instructions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What to say — and not say — tonight</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Families do not interfere because they do not care. They interfere because they are scared and trying to keep the night from getting worse. Tonight is not the night to convince, diagnose, or win the argument.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="mb-2 font-semibold text-foreground">Say something short</p>
                    <ul className="space-y-2">
                      <li>“I care about you, and I am not going to argue this tonight.”</li>
                      <li>“I am not able to help with that.”</li>
                      <li>“We can talk when you are sober or calm.”</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                    <p className="mb-2 font-semibold text-foreground">Do not</p>
                    <ul className="space-y-2">
                      <li>Lecture, justify, or negotiate “just this once.”</li>
                      <li>Rescue to relieve your own panic.</li>
                      <li>Make a huge ultimatum in the heat of the moment that you cannot hold in the morning.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <KeyRound className="h-5 w-5 text-primary" />
                  Practical tonight
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>This is not legal or clinical advice. It is a high-level list families already use to get through one night:</p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="font-semibold text-foreground">Money.</span>
                    <span>Do not hand over cash or cards if you believe it will go to use. You can say you are not able to help that way tonight.</span>
                  </li>
                  <li className="flex gap-3">
                    <Car className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      <span className="font-semibold text-foreground">Car keys. </span>
                      If driving under the influence is a risk, keep keys out of reach and do not get in the car. Call 911 if someone is about to drive impaired.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      <span className="font-semibold text-foreground">Kids. </span>
                      Get children into a quieter room or another safe adult’s care. You do not have to explain the whole story tonight.
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">A place to sleep. </span>
                    You can offer a couch or a locked door. You do not have to reopen every household rule at 2 a.m. A boundary that can wait until morning can wait.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="h-5 w-5 text-primary" />
                  Come to Family Squares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  If it can wait, join Family Squares Monday at 7:00 PM Pacific. It is the free live room for families who need a place to ask the question without making a paid decision tonight.
                </p>
                <Button asChild onClick={() => trackConversionEvent("monday_zoom_click", { source: "what_to_do_tonight" })}>
                  <Link to="/family-squares">Register for Family Squares</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <PhoneCall className="h-5 w-5 text-primary" />
                  If you need a human
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Call (458) 298-8008 or WhatsApp +1 503-836-2136, including from outside the US.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <a href="tel:+14582988008" onClick={() => trackPhoneClick("what_to_do_tonight")}>
                      <PhoneCall className="h-4 w-4" />
                      Call (458) 298-8008
                    </a>
                  </Button>
                  <WhatsAppLink source="what_to_do_tonight" variant="button" label="WhatsApp +1 503-836-2136" />
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground">
              <Link to="/two-households" className="font-semibold text-logo-blue hover:underline">
                Two households / the other parent is running a different plan.
              </Link>
            </p>

            <p className="text-sm text-muted-foreground">
              If the situation is higher-risk — treatment refusal, safety concerns, or the family is split — you can{" "}
              <Link
                to="/family-consultation"
                onClick={() => trackConversionEvent("coaching_click", { source: "what_to_do_tonight_secondary" })}
                className="font-semibold text-logo-blue hover:underline"
              >
                book a private consult
              </Link>
              {" "}or{" "}
              <Link
                to="/intervention-help"
                onClick={() => trackConversionEvent("intervention_readiness_click", { source: "what_to_do_tonight_secondary" })}
                className="inline-flex items-center gap-1 font-semibold text-logo-blue hover:underline"
              >
                review intervention help
                <Shield className="h-3.5 w-3.5" />
              </Link>
              . That is a second door, not the first one.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
