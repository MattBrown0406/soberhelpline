import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Smartphone } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SoberHelplineAppStoreBadge from "@/components/SoberHelplineAppStoreBadge";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

// https://soberhelpline.com/app and /app/* are universal links: on an iPhone with
// the Sober Helpline app installed, iOS opens the app instead of this page (see
// public/.well-known/apple-app-site-association). This page is the fallback —
// the app isn't installed, the link was opened on a computer, or it was tapped
// from a soberhelpline.com page (iOS keeps same-site taps in Safari).
// noindex (lib/indexability), never in the sitemap and never prerendered.
// The Smart App Banner's "Open" opens the app without a page argument for now
// (app 4.0 (2) can't route one); see index.html.
//
// Someone with the app can still land here on an iPhone or iPad: a link in an
// email app's own browser, or one pasted into Safari, stays in the browser. For
// Apple mobile visitors the page therefore offers "Open the Sober Helpline
// app", which uses the app's own link scheme (as ReturnToAppButton does). A
// plain link, so nothing here navigates by script: without the app the tap
// leaves this page as it is (Safari shows a small "address is invalid" notice,
// never an error page), and the App Store badge sits right below the button.

interface AppDestination {
  /** What the link opens in the app, after "This link opens …". */
  label: string;
  /** The same thing on the website, where there is one. */
  web?: { to: string; label: string };
}

const DESTINATIONS: Record<string, AppDestination> = {
  "/app/family-squares": {
    label: "the Family Squares Monday call",
    web: { to: "/family-squares", label: "Join the Monday call on the website" },
  },
  "/app/coaching": {
    label: "coaching",
    web: { to: "/book-consultation", label: "Book coaching on the website" },
  },
  "/app/coaching/booked": {
    label: "your coaching booking",
    web: { to: "/book-consultation", label: "Coaching on the website" },
  },
  "/app/plan-review": { label: "your plan-review coaching call" },
  "/app/chat": { label: "the Text Line chat" },
  "/app/learn": {
    label: "Learn",
    web: { to: "/family-education", label: "Family education on the website" },
  },
  "/app/settings": { label: "your app settings" },
};

// /app itself, and any /app/* path the app doesn't know (the app opens its home screen).
const APP_HOME: AppDestination = { label: "the Sober Helpline app" };

const normalizedPath = (pathname: string) => pathname.replace(/\/+$/, "").toLowerCase();

function destinationFor(pathname: string): AppDestination {
  return DESTINATIONS[normalizedPath(pathname)] ?? APP_HOME;
}

// The same destination on the app's own scheme. The app (4.1+) accepts
// sober-helpline://app/<path> for exactly the paths it accepts on
// https://soberhelpline.com/app/<path>; anything else just opens the app.
function appSchemeLinkFor(pathname: string): string {
  const path = normalizedPath(pathname);
  // "/app/family-squares" -> "sober-helpline://app/family-squares"
  return Object.prototype.hasOwnProperty.call(DESTINATIONS, path) ? `sober-helpline://${path.slice(1)}` : "sober-helpline://";
}

function isAppleMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  // iPadOS reports itself as a Mac with a touch screen.
  return /iPhone|iPad|iPod/.test(navigator.userAgent)
    || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
}

const AppLinkFallback = () => {
  const { pathname } = useLocation();
  const destination = destinationFor(pathname);
  const onAppleMobile = useMemo(isAppleMobile, []);
  const appSchemeLink = appSchemeLinkFor(pathname);

  return (
    <>
      <SEOHead
        title="Open in the Sober Helpline App | Sober Helpline"
        description="This link opens in the Sober Helpline app for iPhone and iPad. Get the app on the App Store, or continue on the website."
        noIndex
      />
      <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-background to-muted/50 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <img src={logo} alt="" className="mx-auto mb-6 h-20 w-20 object-contain" />
          <h1 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">Open this in the Sober Helpline app</h1>
          <p className="mb-6 text-muted-foreground">
            {destination === APP_HOME
              ? "This link opens the Sober Helpline app for iPhone and iPad."
              : `This link opens ${destination.label} in the Sober Helpline app for iPhone and iPad.`}
          </p>

          {onAppleMobile && (
            <div className="mb-6 flex flex-col items-center gap-2">
              <Button asChild size="lg" className="w-full gap-2 bg-logo-blue text-white hover:bg-logo-blue/90 sm:w-auto">
                <a href={appSchemeLink}>
                  <Smartphone className="h-5 w-5" aria-hidden="true" />
                  Open the Sober Helpline app
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">Don't have the app yet? It is free on the App Store:</p>
            </div>
          )}

          <div className="flex justify-center">
            <SoberHelplineAppStoreBadge height={48} source="app_link_fallback" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {onAppleMobile
              ? "You can also tap Open in the banner at the top of this page."
              : "The Sober Helpline app is free to download on the App Store for iPhone and iPad."}
          </p>
          <p className="mt-3 text-sm">
            <Link to="/sober-helpline-app" className="font-medium text-logo-blue underline-offset-2 hover:underline">
              See what the app does
            </Link>
          </p>

          {destination.web && (
            <div className="mt-8 border-t pt-6">
              <p className="mb-3 text-sm text-muted-foreground">Or continue here on the website:</p>
              <Button asChild variant="outline" className="gap-2">
                <Link to={destination.web.to}>
                  {destination.web.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppLinkFallback;
