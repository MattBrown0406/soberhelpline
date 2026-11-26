import { Link } from "react-router-dom";
import { ArrowRight, Smartphone } from "lucide-react";

import AppTourPhone from "@/components/AppTourPhone";
import SEOHead from "@/components/SEOHead";
import SoberHelplineAppStoreBadge from "@/components/SoberHelplineAppStoreBadge";
import { appTourScreens } from "@/data/appTour";

// A short tour of the Sober Helpline app: a phone that plays real app screens
// one at a time (the list is in data/appTour.ts). It lives under
// /sober-helpline-app because /app and /app/* are universal links that open the
// app itself. Like the main app page, it shows the App Store badge to everyone;
// it has no membership links at all, so nothing here is hidden for visitors
// who opened it from the app (lib/webSession arrivedFromApp).

export default function SoberHelplineAppTour() {
  return (
    <>
      <SEOHead
        title="See the Sober Helpline App in Action | Sober Helpline"
        description="A short tour of real screens from the free Sober Helpline app for iPhone and iPad: getting started, Family Squares, conversation scripts and tools."
      />

      <div className="min-h-screen bg-background">
        <section className="border-b bg-gradient-to-br from-primary/10 via-background to-background" aria-labelledby="app-tour-title">
          <div className="container py-10 md:py-14">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">A quick tour</p>
              <h1 id="app-tour-title" className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                See the Sober Helpline app in action
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Here are a few real screens from the Sober Helpline app, one at a time. It is free to download and keeps
                Family Squares, scripts for hard conversations and tools for your next steps in one place.
              </p>
            </div>
          </div>
        </section>

        <div className="container py-10 md:py-14">
          <div className="mx-auto max-w-4xl">
            <AppTourPhone screens={appTourScreens} />
            <p className="mt-6 text-center text-xs text-muted-foreground md:text-left">Screens from the app, with sample data.</p>
          </div>

          <section
            className="mx-auto mt-12 max-w-3xl rounded-xl border border-logo-blue/20 bg-logo-blue/5 p-6 text-center md:p-8"
            aria-labelledby="app-tour-get"
          >
            <h2 id="app-tour-get" className="text-2xl font-bold tracking-tight text-foreground">Get the Sober Helpline app</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Family Squares meets every Monday at 7:00 PM Pacific on Zoom, hosted by Matt Brown. The app helps you save
              your spot and be there.
            </p>
            <div className="mt-5 flex justify-center">
              <SoberHelplineAppStoreBadge height={52} source="app_tour" />
            </div>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Smartphone className="h-4 w-4" aria-hidden="true" />
              Free for iPhone and iPad
            </p>
            <p className="mt-5">
              <Link
                to="/sober-helpline-app"
                className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-2 hover:underline"
              >
                Everything the app does
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </p>
          </section>

          <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted-foreground">
            The app offers support, education and coaching. It is not an emergency service. If someone is in immediate
            danger, call <a className="font-semibold text-primary underline" href="tel:911">911</a>.
          </p>
        </div>
      </div>
    </>
  );
}
