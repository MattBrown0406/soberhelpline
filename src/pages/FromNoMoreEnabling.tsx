import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, CheckCircle2, ExternalLink, Mail, Phone, Shield, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import RevenueLadder from "@/components/RevenueLadder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";
import { mattBrownPersonSchema } from "@/lib/mattBrownSchema";

const supportLanes = [
  {
    value: "family-squares",
    eyebrow: "Start gently",
    title: "Join Family Squares",
    description: "Bring your question to the free Monday meeting and get live support before making a bigger decision.",
    to: "/family-squares?utm_source=nomoreenabling&utm_medium=bridge&utm_campaign=soberhelpline_funnel&utm_content=family_squares",
    cta: "Register for the free meeting",
    icon: Calendar,
  },
  {
    value: "coaching",
    eyebrow: "Private help",
    title: "Book a crisis family consult",
    description: "Use a private session when the family needs a calm plan, better boundaries, or help deciding what to do this week.",
    to: "/family-addiction-consult?utm_source=nomoreenabling&utm_medium=bridge&utm_campaign=soberhelpline_funnel&utm_content=coaching",
    cta: "See private coaching options",
    icon: Phone,
  },
  {
    value: "intervention",
    eyebrow: "Higher-risk situation",
    title: "Check intervention readiness",
    description: "Use this path when refusal, relapse, safety risk, or family division may require a more formal intervention plan.",
    to: "/intervention-readiness-consult?utm_source=nomoreenabling&utm_medium=bridge&utm_campaign=soberhelpline_funnel&utm_content=intervention",
    cta: "Review intervention next steps",
    icon: Shield,
  },
];

const trustPoints = [
  "No referral pressure before the family understands the situation.",
  "Free live support remains separate from paid coaching.",
  "Intervention conversations are routed only when risk and readiness call for it.",
  "Families can move from education to support without losing privacy or momentum.",
];

export default function FromNoMoreEnabling() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [selectedLane, setSelectedLane] = useState("family-squares");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const arrivalTracked = useRef(false);

  useEffect(() => {
    if (arrivalTracked.current) return;
    arrivalTracked.current = true;

    trackConversionEvent("nme_bridge_arrival", {
      source: "from_no_more_enabling",
      label: "NME bridge page arrival",
    });
  }, []);

  const trackBridgeLaneClick = (lane: (typeof supportLanes)[number], source: string) => {
    const eventName =
      lane.value === "family-squares"
        ? "nme_bridge_family_squares_click"
        : lane.value === "intervention"
          ? "nme_bridge_intervention_click"
          : "nme_bridge_coaching_click";

    trackConversionEvent(eventName, {
      source,
      lane: lane.value,
      label: lane.title,
      targetHref: lane.to,
    });

    trackConversionEvent("nme_bridge_lane_click", {
      source,
      lane: lane.value,
      label: lane.title,
      targetHref: lane.to,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstName.trim() || !email.trim()) {
      toast({ title: "Name and email are required", variant: "destructive" });
      return;
    }

    if (smsOptIn && phoneNumber.trim().length < 10) {
      toast({ title: "Please add a valid phone number for text updates", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("lead-magnet-signup", {
        body: {
          firstName: firstName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim() || undefined,
          smsOptIn,
          source: `no-more-enabling-bridge-${selectedLane}`,
        },
      });

      if (error) throw error;

      trackConversionEvent("lead_magnet_signup", {
        source: "from_no_more_enabling",
        lane: selectedLane,
      });
      setSubmitted(true);
      toast({
        title: "You're on the list",
        description: "We saved your next-step preference. The support options below are ready when you are.",
      });
    } catch (error) {
      console.error("No More Enabling bridge signup error:", error);
      toast({
        title: "Signup did not go through",
        description: "You can still use the support options on this page or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Coming From No More Enabling? | Sober Helpline"
        description="A guided next step for No More Enabling readers: free Family Squares support, private family coaching, intervention readiness, and ethical treatment guidance."
        faqItems={[
          {
            question: "What should I do after reading No More Enabling?",
            answer: "Choose the lowest-pressure next step that matches your situation: join the free Family Squares meeting, book a private family consult, or review intervention readiness if risk is escalating.",
          },
          {
            question: "Is Family Squares different from paid coaching?",
            answer: "Yes. Family Squares is the free Monday support meeting. Paid coaching is separate and only makes sense when a family wants private strategy, planning, or more structure.",
          },
          {
            question: "When should I consider intervention planning?",
            answer: "Intervention planning may fit when treatment refusal, repeated relapse, overdose risk, violence, severe family division, or escalating consequences are present.",
          },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Coming From No More Enabling?",
          description: "A bridge from No More Enabling education into Sober Helpline support, coaching, and intervention readiness.",
          url: "https://soberhelpline.com/from-no-more-enabling",
          isPartOf: {
            "@type": "WebSite",
            name: "Sober Helpline",
            url: "https://soberhelpline.com",
          },
        }}
        personJsonLd={mattBrownPersonSchema}
      />

      <div className="min-h-screen bg-background">
        <main>
          <section className="border-b bg-gradient-to-br from-logo-blue/10 via-background to-amber-50/80 dark:to-amber-950/20">
            <div className="container grid gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-14">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-logo-blue/10 px-3 py-1.5 text-sm font-semibold text-logo-blue">
                  <BookOpen className="h-4 w-4" />
                  No More Enabling reader path
                </div>
                <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-foreground md:text-5xl">
                  You named the pattern. Now choose the right next step.
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  No More Enabling helps families see what keeps the cycle alive. Sober Helpline is where that insight turns into live support, private coaching, treatment direction, or intervention readiness.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" onClick={() => {
                    trackBridgeLaneClick(supportLanes[0], "nme_bridge_hero");
                    trackConversionEvent("monday_zoom_click", { source: "nme_bridge_hero" });
                  }}>
                    <Link to="/family-squares?utm_source=nomoreenabling&utm_medium=bridge&utm_campaign=soberhelpline_funnel&utm_content=hero">
                      Join Family Squares
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" onClick={() => {
                    trackBridgeLaneClick(supportLanes[1], "nme_bridge_hero");
                    trackConversionEvent("coaching_click", { source: "nme_bridge_hero" });
                  }}>
                    <Link to="/family-addiction-consult?utm_source=nomoreenabling&utm_medium=bridge&utm_campaign=soberhelpline_funnel&utm_content=hero">
                      Private family consult
                    </Link>
                  </Button>
                </div>
                <a
                  href="tel:4582027900"
                  onClick={() => trackPhoneClick("nme_bridge_hero")}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-logo-blue hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  Call 458-202-7900
                </a>
              </div>

              <Card className="border-logo-green/20 bg-background/95 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Mail className="h-5 w-5 text-logo-blue" />
                    Keep the next step clear
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="rounded-lg border border-logo-green/25 bg-logo-blue/10 p-4">
                      <div className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-logo-blue" />
                        <div>
                          <p className="font-semibold text-foreground">Saved.</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Use the support lanes below whenever you are ready. Nothing here changes your Zoom registration unless you choose to register for Family Squares.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="nme-first-name">First name</Label>
                          <Input
                            id="nme-first-name"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            maxLength={80}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nme-email">Email</Label>
                          <Input
                            id="nme-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            maxLength={255}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nme-lane">What kind of help fits right now?</Label>
                        <select
                          id="nme-lane"
                          value={selectedLane}
                          onChange={(event) => setSelectedLane(event.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="family-squares">Free Family Squares meeting</option>
                          <option value="coaching">Private coaching or consult</option>
                          <option value="intervention">Intervention readiness</option>
                          <option value="treatment">Treatment direction</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nme-phone">Phone for text updates, optional</Label>
                        <Input
                          id="nme-phone"
                          type="tel"
                          value={phoneNumber}
                          onChange={(event) => setPhoneNumber(event.target.value)}
                          maxLength={24}
                        />
                      </div>
                      <label className="flex items-start gap-3 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={smsOptIn}
                          onChange={(event) => setSmsOptIn(event.target.checked)}
                          className="mt-1"
                        />
                        <span>Send occasional text reminders or next-step support. Message and data rates may apply.</span>
                      </label>
                      <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save my next-step preference"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="container px-4 py-10 md:py-14">
            <div className="mx-auto max-w-6xl">
              <div className="mb-6 max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-logo-blue">Choose the lane</p>
                <h2 className="mt-2 text-3xl font-bold text-foreground">Three ways to move from reading to action</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {supportLanes.map((lane) => (
                  <Card key={lane.value} className="border-border transition-all hover:border-logo-green/40 hover:shadow-md">
                    <CardContent className="flex h-full flex-col p-5">
                      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-logo-blue/10 text-logo-blue">
                        <lane.icon className="h-5 w-5" />
                      </span>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lane.eyebrow}</p>
                      <h3 className="mt-1 text-xl font-semibold text-foreground">{lane.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{lane.description}</p>
                      <Button asChild variant="outline" className="mt-5 justify-between" onClick={() => {
                        trackBridgeLaneClick(lane, "nme_bridge_lane");
                        trackConversionEvent(lane.value === "family-squares" ? "monday_zoom_click" : lane.value === "intervention" ? "intervention_readiness_click" : "coaching_click", { source: "nme_bridge_lane", lane: lane.value });
                      }}>
                        <Link to={lane.to}>
                          {lane.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="container px-4 pb-10 md:pb-14">
            <RevenueLadder compact source="nme_bridge_revenue_ladder" />
          </section>

          <section className="border-y bg-muted/30">
            <div className="container grid gap-6 px-4 py-10 md:grid-cols-[0.8fr_1.2fr] md:items-center md:py-12">
              <div>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Built for families first, useful for ethical partners.</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  This bridge also gives treatment providers, intervention partners, and future sponsors a clear signal: the Sober Helpline audience is actively seeking education, support, and next-step guidance.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {trustPoints.map((point) => (
                  <div key={point} className="rounded-lg border bg-background p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-logo-blue" />
                      <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="md:col-span-2">
                <Button asChild variant="outline" onClick={() => trackConversionEvent("partner_page_click", { source: "nme_bridge_partner_section" })}>
                  <Link to="/partner-with-sober-helpline">
                    Professional partner information
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
