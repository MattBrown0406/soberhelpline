import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, CheckCircle2, Smartphone } from "lucide-react";

import SEOHead from "@/components/SEOHead";
import SoberHelplineAppStoreBadge from "@/components/SoberHelplineAppStoreBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";
import { trackConversionEvent } from "@/lib/conversionTracking";
import { arrivedFromApp } from "@/lib/webSession";

// The page about the Sober Helpline app. It lives at /sober-helpline-app
// because /app and /app/* are universal links: on an iPhone with the app
// installed, iOS opens the app instead of a page there (pages/AppLinkFallback).

const mondayFeatures = [
  { title: "Save your spot in one tap", text: "Tap \"Save my spot\" for this Monday's meeting." },
  { title: "Your seat, every Monday", text: "Turn on \"Save my seat every Monday\" once and your seat is saved each week." },
  { title: "On your calendar", text: "\"Add to my calendar\" puts the meeting where you will see it." },
  { title: "A reminder before the meeting", text: "When your seat is saved, you get a reminder an hour before and again 15 minutes before." },
  { title: "Join in one tap", text: "Join Zoom from the reminder or from the app." },
  { title: "Send a question ahead", text: "Send your question for the meeting ahead of time." },
  { title: "Can't make it this week", text: "Tap \"Can't make it this week\" and you are done." },
  { title: "Your first time", text: "A short \"What to expect your first time\" note tells you how the meeting works." },
];

const freeFeatures = [
  { title: "Family Squares", text: "The free Monday meeting, with your seat saved and a reminder." },
  { title: "Crisis guide and safety tools", text: "Steps for a hard night, close at hand." },
  { title: "Boundaries", text: "Write the boundaries you will hold, in your own words." },
  { title: "Daily check-in and tracker", text: "A short check-in each day, and a place to note the warning signs and the signs of recovery you see." },
  { title: "Script library", text: "Words for hard conversations, sorted by situation." },
  { title: "Treatment finder and planning tools", text: "A free treatment directory and tools to plan your next steps." },
];

const membershipFeatures = [
  "Message a coach between meetings",
  "Live groups with other families",
  "Conversation rehearsal",
  "The DIY Intervention Planner",
];

const screenshots = [
  {
    image: "save-my-spot",
    alt: "The app's Today screen with this week's Family Squares meeting and a Save my spot button",
    caption: "Save your spot for Monday",
  },
  {
    image: "scripts",
    alt: "The app's Practice screen with today's scripts for money, crisis and conversation, and scripts to browse by situation",
    caption: "Scripts for hard conversations",
  },
  {
    image: "tools",
    alt: "The app's Tools screen with links to practice a conversation, set boundaries, find treatment and talk to someone",
    caption: "Tools to plan next steps",
  },
  {
    image: "getting-started",
    alt: "The app's welcome screen asking what brings you here today, with choices such as I'm worried about someone",
    caption: "Start from where you are",
  },
];

const steps = [
  { title: "Download the app", text: "It is free on the App Store, for iPhone and iPad." },
  { title: "Create your account", text: "Your name, your email address and a password." },
  { title: "Save your spot for Monday", text: "Open Today and tap \"Save my spot\"." },
];

export default function SoberHelplineApp() {
  // Opened from the Sober Helpline app: no membership sales and no link to
  // website membership (App Store guideline 3.1.1).
  const [fromApp] = useState(arrivedFromApp);
  const { isMember } = useMembershipStatus();

  return (
    <>
      <SEOHead
        title="Sober Helpline App for iPhone and iPad | Sober Helpline"
        description="The free Sober Helpline app saves your seat at Family Squares every Monday, reminds you before the meeting, and gives families scripts and safety tools."
      />

      <div className="min-h-screen bg-background">
        <section className="border-b bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container py-12 md:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Free for iPhone and iPad</p>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">The Sober Helpline app</h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Save your seat at Family Squares once and it is held every Monday. You get a reminder, you join in one
                tap, and practical help for your family stays in your pocket.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3">
                <SoberHelplineAppStoreBadge height={52} source="app_page_hero" />
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4" aria-hidden="true" />
                  Free for iPhone and iPad
                </p>
                <Link
                  to="/sober-helpline-app/tour"
                  className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-2 hover:underline"
                >
                  See it in action
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-10 md:py-14">
          <section className="mx-auto max-w-5xl" aria-labelledby="app-family-squares">
            <div className="mb-6 max-w-2xl">
              <h2 id="app-family-squares" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                <CalendarCheck className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                Never miss Family Squares
              </h2>
              <p className="mt-3 text-muted-foreground">
                Family Squares is the free family meeting on Zoom, every Monday at 7:00 PM Pacific. The app makes it
                easy to be there.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {mondayFeatures.map(({ title, text }) => (
                <div key={title} className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto mt-12 max-w-5xl" aria-labelledby="app-free">
            <h2 id="app-free" className="mb-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Free in the app</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {freeFeatures.map(({ title, text }) => (
                <div key={title} className="flex gap-3 rounded-lg border bg-card p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              The app offers support, education and coaching. It is not an emergency service. If someone is in
              immediate danger, call <a className="font-semibold text-primary underline" href="tel:911">911</a>.
            </p>
          </section>

          {!fromApp && (
            <section className="mx-auto mt-12 max-w-5xl" aria-labelledby="app-membership">
              <Card>
                <CardHeader>
                  <h2 id="app-membership" className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">With a membership</h2>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>Membership in the app is monthly, with two plans: Essential and Premier. It adds:</p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {membershipFeatures.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p>Premier adds private video with a coach and a plan review.</p>
                  {!isMember && (
                    <p>
                      <Link
                        to="/family-membership"
                        className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-2 hover:underline"
                        onClick={() => trackConversionEvent("membership_click", { source: "app_page" })}
                      >
                        See the family membership on the website
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          <section className="mx-auto mt-12 max-w-5xl" aria-labelledby="app-screens">
            <h2 id="app-screens" className="mb-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">A look inside</h2>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
              {screenshots.map(({ image, alt, caption }) => (
                <figure key={image} className="mx-auto w-full max-w-[260px]">
                  <img
                    src={`/sober-helpline-app/${image}.webp`}
                    alt={alt}
                    width={600}
                    height={1304}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full rounded-[1.75rem] border-4 border-gray-900 bg-gray-900 shadow-lg"
                  />
                  <figcaption className="mt-3 text-center text-sm font-medium text-foreground">{caption}</figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">Screens from the app, with sample data.</p>
          </section>

          <section className="mx-auto mt-12 max-w-5xl" aria-labelledby="app-start">
            <h2 id="app-start" className="mb-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">How to get started</h2>
            <ol className="grid gap-3 md:grid-cols-3">
              {steps.map(({ title, text }, index) => (
                <li key={title} className="flex gap-3 rounded-lg border bg-card p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-logo-blue text-sm font-bold text-white" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {!fromApp && (
              <p className="mt-4 text-sm text-muted-foreground">
                Already a member on the website? Sign in to the app with the same email address and your membership
                is active there too.
              </p>
            )}
          </section>

          <section className="mx-auto mt-12 max-w-3xl rounded-xl border border-logo-blue/20 bg-logo-blue/5 p-6 text-center md:p-8" aria-labelledby="app-get">
            <h2 id="app-get" className="text-2xl font-bold tracking-tight text-foreground">Get the Sober Helpline app</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Free for iPhone and iPad. Save your seat for Monday in one tap.
            </p>
            <div className="mt-5 flex justify-center">
              <SoberHelplineAppStoreBadge height={52} source="app_page_bottom" />
            </div>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="outline" className="gap-2">
                <Link to="/family-squares" onClick={() => trackConversionEvent("monday_zoom_click", { source: "app_page" })}>
                  Save your spot on the website
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/support">App support</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
