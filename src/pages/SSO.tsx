import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAppSsoHandoff } from "@/hooks/useWebSession";
import { SsoSwitchAccountPrompt } from "@/components/AppSubscriberGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_NEXT = "/family-education";

/** Same-site paths only (no protocol-relative URLs, no loops back to /sso). */
function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/sso")) return DEFAULT_NEXT;
  try {
    const url = new URL(next, window.location.origin);
    if (url.origin !== window.location.origin) return DEFAULT_NEXT;
    url.searchParams.delete("sso_token");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_NEXT;
  }
}

/**
 * Legacy entry point: /sso?t=<token>&next=/path (older app builds).
 * Signs in with the app token (app-sso-exchange) — asking first if a different
 * account is already signed in — then continues to `next`. Member pages decide
 * access from website membership.
 */
export default function SSO() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = (params.get("sso_token") ?? params.get("t") ?? "").trim();
  const next = useMemo(() => safeNextPath(params.get("next")), [params]);
  const { state, continueAsAppAccount, keepCurrentAccount } = useAppSsoHandoff(token);

  const notice = state.phase === "done" ? state.notice : null;
  const failed = notice === "expired" || notice === "unavailable" || notice === "password_required";

  useEffect(() => {
    if (!token || (state.phase === "done" && !failed)) {
      navigate(next, { replace: true });
    }
  }, [token, state.phase, failed, next, navigate]);

  if (state.phase === "confirm") {
    return (
      <SsoSwitchAccountPrompt
        currentEmail={state.currentEmail}
        appEmail={state.appEmail}
        onContinue={continueAsAppAccount}
        onStay={keepCurrentAccount}
      />
    );
  }

  if (failed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">
              {notice === "expired"
                ? "Link expired or invalid"
                : notice === "password_required"
                  ? "Please sign in with your password"
                  : "We couldn't sign you in"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center text-muted-foreground">
            <p>
              {notice === "expired"
                ? "This link has expired or was already used. Please return to the Sober Helpline app and try again."
                : notice === "password_required"
                  ? "For your security, this account signs in with its website password."
                  : "Something went wrong on our side. Please try again in a moment, or sign in on the website."}
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link to={`/auth?redirect=${encodeURIComponent(next)}`}>Sign in on the website</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={next}>Continue</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3" role="status">
      <Loader2 className="h-8 w-8 animate-spin text-logo-blue" />
      <p className="text-muted-foreground">Signing you in…</p>
    </div>
  );
}
