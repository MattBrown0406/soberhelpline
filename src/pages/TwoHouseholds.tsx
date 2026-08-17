import { Link } from "react-router-dom";
import { Calendar, Home, KeyRound, MessageSquareOff, PhoneCall, ShieldAlert, Users, Wallet } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AfterHoursSafetyStrip from "@/components/AfterHoursSafetyStrip";
import WhatsAppLink from "@/components/WhatsAppLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";

const tonightLines = [
  {
    icon: Wallet,
    title: "Money",
    example: "I am not sending cash, paying a bill, or covering a gap tonight.",
  },
  {
    icon: Home,
    title: "Housing",
    example: "This house is not a crash pad tonight. If you need a safe place, we can talk in the morning.",
  },
  {
    icon: KeyRound,
    title: "Contact",
    example: "I am not taking late-night calls or texts about money, housing, or keys. If you are unsafe, call 911.",
  },
];

const doNotDoTonight = [
  "Do not send the kids to the other house with a speech.",
  "Do not match a bailout so you “don’t look mean.”",
  "Do not get in the car to police the other driveway.",
  "Do not have the 2am text war.",
  "If they are in danger where they are: 911, not a family argument.",
];

export default function TwoHouseholds() {
  return (
    <>
      <SEOHead
        title="Two Households | Sober Helpline"
        description="Free tonight guidance for divorced, separated, or never-married parents when the other house is about to pay, house, or hand over the keys. One line you can keep. Not a placement funnel."
        speakableSelectors={["h1", ".two-households-subhead"]}
        faqItems={[
          {
            question: "What if the other parent will not hold the same line?",
            answer: "Hold the three sentences in the house you actually control. Money, housing, and contact still have to be the same line in both kitchens when you can get there. Tonight, one house cannot secretly undo the other — and you do not have to win the argument to keep your line.",
          },
          {
            question: "Should I send the kids with a message for the other parent?",
            answer: "No. Kids are not messengers and not the reason to cave. Do not send them to the other house with a speech.",
          },
          {
            question: "What if my loved one is in danger at the other house?",
            answer: "If they are in danger where they are, call 911. That is not a family argument. Sober Helpline is family support, not emergency medical care. For a suicidal crisis, call or text 988.",
          },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Two Households",
          url: "https://soberhelpline.com/two-households",
          description: "Free tonight guidance for split and two-household families. Not emergency medical care. Not a treatment placement page.",
        }}
      />

      <div className="min-h-screen bg-background">
        <main>
          <section className="border-b bg-gradient-to-b from-primary/10 to-background py-14 md:py-20">
            <div className="container mx-auto max-w-3xl px-4">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                <Home className="h-4 w-4" />
                Free tonight plan for two houses
              </div>
              <h1 className="text-4xl font-bold tracking-normal text-logo-blue md:text-5xl">
                Two homes. Same night. Different rules.
              </h1>
              <p className="two-households-subhead mt-5 text-lg leading-relaxed text-muted-foreground">
                If the other parent is about to pay, house, or hand over the keys, you do not need to win the argument tonight. You need one line the two of you can both say — or a plan for the house you actually control.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg">
                  <Link to="/what-to-do-tonight">What to do tonight</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="tel:+14582988008" onClick={() => trackPhoneClick("two_households_hero")}>
                    <PhoneCall className="h-4 w-4" />
                    Call (458) 298-8008
                  </a>
                </Button>
                <WhatsAppLink source="two_households_hero" variant="button" />
              </div>
              <p className="mt-5">
                <Link
                  to="/family-squares"
                  onClick={() => trackConversionEvent("monday_zoom_click", { source: "two_households_hero" })}
                  className="inline-flex items-center gap-1 font-semibold text-logo-blue hover:underline"
                >
                  <Calendar className="h-4 w-4" />
                  Join free Monday Family Squares
                </Link>
              </p>
            </div>
          </section>

          <AfterHoursSafetyStrip source="two_households_after_hours" showTonightLink />

          <section className="container mx-auto max-w-3xl space-y-6 px-4 py-12">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="space-y-4 p-6 text-sm leading-relaxed text-muted-foreground">
                <p className="text-base font-semibold text-foreground">Two houses. One disease.</p>
                <p>
                  If one parent pays rent and the other hands over the keys, nothing holds. Divorced, separated, or never-married parents are a real case type, not a footnote.
                </p>
                <p>
                  Money, housing, and contact have to be the same line in both kitchens. One house cannot secretly undo the other.
                </p>
                <p>
                  This is not about who is the “good” parent. The disease uses the gap. Kids are not messengers and not the reason to cave.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">The three lines for tonight</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Money. Housing. Contact. Write one sentence for each that you can keep in <span className="font-semibold text-foreground">your</span> house tonight even if the other house will not. These are examples you can say out loud. They are not a worksheet and they do not need an account.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  {tonightLines.map((line) => {
                    const Icon = line.icon;
                    return (
                      <div key={line.title} className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                          <Icon className="h-4 w-4 text-primary" />
                          {line.title}
                        </p>
                        <p>“{line.example}”</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquareOff className="h-5 w-5 text-destructive" />
                  What not to do tonight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {doNotDoTonight.map((item) => (
                    <li key={item} className="flex gap-3">
                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="h-5 w-5 text-primary" />
                  If both of you can talk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>One short script both parents can use:</p>
                <blockquote className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-foreground">
                  “We are not deciding money, housing, or contact tonight. We will talk tomorrow. If you are unsafe, call 911.”
                </blockquote>
                <p>If you cannot get the other parent on the same line, hold your three sentences anyway.</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="h-5 w-5 text-primary" />
                  Next free step
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Family Squares Monday 7pm PT. Or call (458) 298-8008.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild onClick={() => trackConversionEvent("monday_zoom_click", { source: "two_households_next_step" })}>
                    <Link to="/family-squares">Join free Monday Family Squares</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="tel:+14582988008" onClick={() => trackPhoneClick("two_households_next_step")}>
                      <PhoneCall className="h-4 w-4" />
                      Call (458) 298-8008
                    </a>
                  </Button>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  If treatment is being refused and this is now a structured intervention question, Freedom Interventions is separate:{" "}
                  <a
                    href="https://freedominterventions.com/from-sober-helpline"
                    className="underline underline-offset-2 hover:text-foreground"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    freedominterventions.com/from-sober-helpline
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
}
