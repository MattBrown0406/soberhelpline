import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, LogIn, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { arrivedFromApp } from "@/lib/webSession";
import MemberPagePreview from "@/components/MemberPagePreview";

const SOBER_HELPLINE_APP_URL = "https://apps.apple.com/app/id6780034996";

// Why an app sign-in didn't work is shown above the page by AppSsoHandoff.
interface AppSubscriberGateProps {
  /** Email of the signed-in website user who isn't a member (null when signed out). */
  signedInEmail?: string | null;
  /** Page to return to after signing in. */
  returnPath?: string;
  onSignOut?: () => void;
}

export default function AppSubscriberGate({
  signedInEmail = null,
  returnPath = "/family-education",
  onSignOut,
}: AppSubscriberGateProps) {
  const signInHref = `/auth?redirect=${encodeURIComponent(returnPath)}`;
  // The app opens member pages in Safari. Visitors who came from the app get no
  // website purchase buttons here (App Store guideline 3.1.1): membership for
  // them comes with their app plan.
  const [fromApp] = useState(arrivedFromApp);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-10 px-4 py-12 lg:flex-row lg:items-start lg:gap-12">
      <Card className="max-w-md w-full lg:order-2">
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
          {signedInEmail ? (
            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              <p>
                You're signed in as <span className="font-medium text-foreground">{signedInEmail}</span>, which
                doesn't have an active membership.
              </p>
              <p className="mt-2">
                A membership follows the email address it was bought with, on the website and in the app. If yours
                is under a different email, sign out and sign in with that one.
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

          {fromApp ? (
            <div className="rounded-md bg-muted p-3 text-center text-sm text-muted-foreground">
              <p>
                Membership is included in Essential and Premier plans in the Sober Helpline app. If you have one, go
                back to the app and open this page from there again. The website will ask you to confirm your account
                before it opens.
              </p>
              <p className="mt-2">
                Bought your membership on the website instead? It is tied to the email address you used there. Sign
                in to the app with that same email and both will open. If you need the two joined, write to
                matt@soberhelpline.com.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">New here?</p>
                <Button asChild variant={signedInEmail ? "default" : "outline"} className="w-full">
                  <Link to="/family-membership">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Become a member — $9.99/month
                  </Link>
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Includes a 7-day free trial. Cancel anytime from your billing page.
                </p>
              </div>

              <Separator />

              <div className="space-y-2 text-center">
                <p className="text-sm font-medium text-foreground">Use the Sober Helpline app?</p>
                <p className="text-sm text-muted-foreground">
                  Essential and Premier plans in the app include website membership. Open the website from inside the
                  app, confirm it's your account when asked, and the member pages will open.
                </p>
                <Button asChild variant="ghost" className="w-full text-logo-blue">
                  <a href={SOBER_HELPLINE_APP_URL} target="_blank" rel="noopener noreferrer">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Open the Sober Helpline app
                  </a>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {/* The card comes first on a phone so a member can sign in without scrolling. */}
      <div className="w-full max-w-md lg:order-1">
        <MemberPagePreview path={returnPath} />
      </div>
    </div>
  );
}
