import { useId } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Lock, LogIn, Smartphone, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SsoNotice } from "@/hooks/useWebSession";

export type { SsoNotice };

const SOBER_HELPLINE_APP_URL = "https://apps.apple.com/app/id6780034996";

const NOTICE_TEXT: Record<SsoNotice, string> = {
  expired:
    "The sign-in link from the app has expired or was already used. Go back to the Sober Helpline app and tap the link again, or sign in below.",
  unavailable:
    "We couldn't sign you in from the app just now. Please try again in a moment, or sign in below.",
  password_required: "For your security, this account signs in with its website password. Please sign in below.",
  membership_pending:
    "You're signed in, but we couldn't confirm your app membership yet. Go back to the Sober Helpline app and tap the link again.",
};

interface AppSubscriberGateProps {
  /** Email of the signed-in website user who isn't a member (null when signed out). */
  signedInEmail?: string | null;
  /** Page to return to after signing in. */
  returnPath?: string;
  notice?: SsoNotice | null;
  onSignOut?: () => void;
}

export default function AppSubscriberGate({
  signedInEmail = null,
  returnPath = "/family-education",
  notice = null,
  onSignOut,
}: AppSubscriberGateProps) {
  const signInHref = `/auth?redirect=${encodeURIComponent(returnPath)}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-logo-blue/10">
            <Lock className="h-7 w-7 text-logo-blue" />
          </div>
          <CardTitle className="text-2xl">This page is for Sober Helpline members</CardTitle>
          <CardDescription className="text-base">
            Members get the full family education library, the private family forum, past Family Squares
            recordings, and member Q&amp;A.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {notice && (
            <div className="flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{NOTICE_TEXT[notice]}</p>
            </div>
          )}

          {signedInEmail ? (
            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              <p>
                You're signed in as <span className="font-medium text-foreground">{signedInEmail}</span>, which
                doesn't have an active membership.
              </p>
              {onSignOut && (
                <button type="button" onClick={onSignOut} className="mt-1 text-logo-blue hover:underline">
                  Not you? Sign out
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Already a member?</p>
              <Button asChild className="w-full">
                <Link to={signInHref}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Link>
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">New here?</p>
            <Button asChild variant={signedInEmail ? "default" : "outline"} className="w-full">
              <Link to="/family-membership">
                <Sparkles className="mr-2 h-4 w-4" />
                Become a member — $9.99/month
              </Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">Start with a 7-day free trial. Cancel anytime.</p>
          </div>

          <Separator />

          <div className="space-y-2 text-center">
            <p className="text-sm font-medium text-foreground">Use the Sober Helpline app?</p>
            <p className="text-sm text-muted-foreground">
              Essential and Premier members in the app get access here too. Open the app and tap the link to this
              page — you'll be signed in automatically.
            </p>
            <Button asChild variant="ghost" className="w-full text-logo-blue">
              <a href={SOBER_HELPLINE_APP_URL} target="_blank" rel="noopener noreferrer">
                <Smartphone className="mr-2 h-4 w-4" />
                Open the Sober Helpline app
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SsoSwitchAccountPromptProps {
  currentEmail: string;
  appEmail: string;
  onContinue: () => void;
  onStay: () => void;
}

/**
 * Shown when a link from the app carries a sign-in for a DIFFERENT account than
 * the one already signed in on this browser. Nothing changes until the user picks.
 */
export function SsoSwitchAccountPrompt({ currentEmail, appEmail, onContinue, onStay }: SsoSwitchAccountPromptProps) {
  const titleId = useId();
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
          <CardTitle id={titleId} className="text-2xl">Switch accounts?</CardTitle>
          <CardDescription className="text-base">
            You're signed in as <span className="font-medium text-foreground break-all">{currentEmail}</span>. This link
            from the Sober Helpline app is for <span className="font-medium text-foreground break-all">{appEmail}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" onClick={onContinue}>
            Continue as {appEmail}
          </Button>
          <Button variant="outline" className="w-full" onClick={onStay}>
            Stay signed in as {currentEmail}
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

/** Small persistent note shown on member pages after signing in from the app. */
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
