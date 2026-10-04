import { createContext, useContext, useEffect, useId, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2, UserRound, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSsoHandoff, type SsoNotice } from "@/hooks/useWebSession";
import {
  clearSsoSignIn,
  getSsoSignedInEmail,
  readAppSsoToken,
  rememberAppVisit,
  withoutAppSsoToken,
} from "@/lib/webSession";

// Sign-in from the Sober Helpline app, on every page.
//
// The app opens soberhelpline.com links with a one-time `?sso_token=` (and older
// builds open /sso?t=…). This component is mounted ONCE around all routes, so
// each token is redeemed exactly once (app-sso-exchange → verifyOtp) no matter
// which page it lands on. While a token is being redeemed the page itself isn't
// rendered, so pages (and SubscriberRoute) only ever see the finished session.
//
// - On every page it also remembers, for the tab, that the visitor came from the
//   app (from_app=1, app_links=1 or a token) — see lib/webSession.
// - The token is taken out of the address bar right away (history, analytics).
// - Nobody is signed in by a link alone: the visitor taps "Continue as …" first
//   ("Not you?" leaves them as they were). Otherwise a stranger's link could sign
//   a visitor into the stranger's account, or replace the visitor's own account.
// - After an app sign-in, a small "Signed in from the Sober Helpline app as …"
//   note with "Not you? Sign out" shows on every page of that tab.
// - If the sign-in didn't work, a short notice explains why on the landing page.

/** Outcome of the latest app sign-in, for the page it landed on (null when none). */
const AppSsoNoticeContext = createContext<SsoNotice | null>(null);

/** Why the app sign-in that brought the visitor to THIS page didn't fully work (null if it did, or there was none). */
export function useAppSsoNotice(): SsoNotice | null {
  return useContext(AppSsoNoticeContext);
}

const NOTICE_TEXT: Record<SsoNotice, string> = {
  expired:
    "The sign-in link from the Sober Helpline app has expired or was already used. Go back to the app and tap the link again, or sign in on the website.",
  unavailable:
    "We couldn't sign you in from the Sober Helpline app just now. Please try again in a moment, or sign in on the website.",
  password_required: "For your security, this account signs in with its website password.",
  membership_pending:
    "You're signed in, but we couldn't confirm your app membership yet. Go back to the Sober Helpline app and tap the link again.",
};

/** Pages that show the sign-in outcome themselves. */
const PAGES_WITH_OWN_NOTICE = new Set(["/sso"]);

interface Outcome {
  notice: SsoNotice;
  /** The history entry the visitor landed on; the notice belongs to that page only. */
  locationKey: string;
}

function useSignedInEmail(): string | null {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setEmail(data.session?.user?.email?.toLowerCase() ?? null);
      })
      .catch(() => undefined);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email?.toLowerCase() ?? null);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);
  return email;
}

export default function AppSsoHandoff({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const urlToken = readAppSsoToken(location.pathname, location.search);
  // The token being redeemed. Kept here once it's out of the address bar.
  const [heldToken, setHeldToken] = useState(urlToken);
  const token = urlToken || heldToken;

  const { state, continueAsAppAccount, declineAppAccount } = useAppSsoHandoff(token);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const signedInEmail = useSignedInEmail();

  // The app's marks (from_app=1, app_links=1, a token) on ANY page: remember them for this tab.
  useEffect(() => {
    rememberAppVisit(location.pathname, location.search);
  }, [location.pathname, location.search]);

  // A token in the URL: hold it and take it out of the address bar (same page,
  // no new history entry).
  useEffect(() => {
    if (!urlToken) return;
    setHeldToken(urlToken);
    setOutcome(null);
    navigate(withoutAppSsoToken(location.pathname, location.search, location.hash), {
      replace: true,
      state: location.state,
    });
  }, [urlToken, location.pathname, location.search, location.hash, location.state, navigate]);

  // Finished (signed in, failed, or the visitor said "Not you?").
  const finished = state.phase === "done" && state.token === token && !urlToken;
  const finishedNotice = state.phase === "done" ? state.notice : null;
  useEffect(() => {
    if (!finished) return;
    setOutcome(finishedNotice ? { notice: finishedNotice, locationKey: location.key } : null);
    setHeldToken("");
  }, [finished, finishedNotice, location.key]);

  if (token) {
    if (state.phase === "confirm" && state.token === token) {
      return (
        <SsoConfirmAccountPrompt
          currentEmail={state.currentEmail}
          appEmail={state.appEmail}
          onContinue={continueAsAppAccount}
          onDecline={declineAppAccount}
        />
      );
    }
    const signingIn = state.phase === "working" && state.signingIn;
    return (
      <div className="min-h-[60vh] bg-background flex flex-col items-center justify-center gap-3 px-4" role="status">
        <Loader2 className="h-8 w-8 animate-spin text-logo-blue" aria-hidden="true" />
        <p className="text-muted-foreground">
          {signingIn ? "Signing you in from the Sober Helpline app…" : "Opening your link from the Sober Helpline app…"}
        </p>
      </div>
    );
  }

  const notice = outcome && outcome.locationKey === location.key ? outcome.notice : null;
  const showNotice = !!notice && !PAGES_WITH_OWN_NOTICE.has(location.pathname);
  const ssoEmail = getSsoSignedInEmail();
  const showSignedIn = !!ssoEmail && ssoEmail === signedInEmail;
  const returnPath = `${location.pathname}${location.search}${location.hash}`;

  const signOut = async () => {
    clearSsoSignIn();
    setOutcome(null);
    await supabase.auth.signOut();
  };

  return (
    <AppSsoNoticeContext.Provider value={notice}>
      {showSignedIn && <SsoSignedInNotice email={ssoEmail} onSignOut={signOut} />}
      {showNotice && (
        <SsoOutcomeNotice notice={notice} returnPath={returnPath} onDismiss={() => setOutcome(null)} />
      )}
      {children}
    </AppSsoNoticeContext.Provider>
  );
}

interface SsoOutcomeNoticeProps {
  notice: SsoNotice;
  returnPath: string;
  onDismiss: () => void;
}

/** Why the app sign-in didn't (fully) work, above the page it landed on. */
function SsoOutcomeNotice({ notice, returnPath, onDismiss }: SsoOutcomeNoticeProps) {
  const offerSignIn = notice !== "membership_pending";
  return (
    <div role="status" className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <div className="container mx-auto flex max-w-3xl items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p className="flex-1">
          {NOTICE_TEXT[notice]}
          {offerSignIn && (
            <>
              {" "}
              <Link
                to={`/auth?redirect=${encodeURIComponent(returnPath)}`}
                className="font-medium underline underline-offset-2"
              >
                Sign in
              </Link>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded p-0.5 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

interface SsoConfirmAccountPromptProps {
  /** The DIFFERENT account signed in on this browser, or null when nobody is signed in. */
  currentEmail: string | null;
  appEmail: string;
  onContinue: () => void;
  onDecline: () => void;
}

/**
 * Shown when a link from the app carries a sign-in: nothing changes until the
 * visitor picks. Signed out: "Continue as …" or "Not you?". Signed in as a
 * DIFFERENT account: switch, or stay signed in as that account.
 */
export function SsoConfirmAccountPrompt({ currentEmail, appEmail, onContinue, onDecline }: SsoConfirmAccountPromptProps) {
  const titleId = useId();
  const switching = currentEmail !== null;
  return (
    <section
      aria-labelledby={titleId}
      className="min-h-screen bg-background flex items-center justify-center px-4 py-12"
    >
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-logo-blue/10">
            <UserRound className="h-7 w-7 text-logo-blue" />
          </div>
          <CardTitle id={titleId} className="text-2xl">
            {switching ? "Switch accounts?" : "Sign in from the Sober Helpline app?"}
          </CardTitle>
          <CardDescription className="text-base">
            {switching ? (
              <>
                You're signed in as <span className="font-medium text-foreground break-all">{currentEmail}</span>. This
                link from the Sober Helpline app is for{" "}
                <span className="font-medium text-foreground break-all">{appEmail}</span>.
              </>
            ) : (
              <>
                This link from the Sober Helpline app signs you in as{" "}
                <span className="font-medium text-foreground break-all">{appEmail}</span>.
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full h-auto whitespace-normal break-words" onClick={onContinue}>
            Continue as {appEmail}
          </Button>
          <Button variant="outline" className="w-full h-auto whitespace-normal break-words" onClick={onDecline}>
            {switching ? `Stay signed in as ${currentEmail}` : "Not you? Continue without signing in"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Only continue if you opened this link from your own Sober Helpline app.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

interface SsoSignedInNoticeProps {
  email: string;
  onSignOut: () => void;
}

/** Small persistent note shown after signing in from the app (every page of that tab). */
export function SsoSignedInNotice({ email, onSignOut }: SsoSignedInNoticeProps) {
  return (
    <div role="status" className="border-b bg-muted/60 px-4 py-2 text-center text-sm text-muted-foreground">
      Signed in from the Sober Helpline app as{" "}
      <span className="font-medium text-foreground break-all">{email}</span>.{" "}
      <button type="button" onClick={onSignOut} className="font-medium text-logo-blue underline-offset-2 hover:underline">
        Not you? Sign out
      </button>
    </div>
  );
}
