import { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useWebSession } from "@/hooks/useWebSession";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";
import { writeWebSession, WEB_SESSION_DURATION_MS } from "@/lib/webSession";
import AppSubscriberGate from "@/components/AppSubscriberGate";
import { Loader2 } from "lucide-react";

// The app's Supabase project (different from the website's). The validate-sso-token
// edge function lives here and is deployed with --no-verify-jwt, so no auth header is needed.
const VALIDATE_SSO_TOKEN_URL =
  "https://rjlkbxqxshohgjmomyro.supabase.co/functions/v1/validate-sso-token";

type InlineSsoStatus = "idle" | "validating" | "valid" | "invalid";

function removeSsoTokenFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("sso_token");
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

export default function SubscriberRoute({ children }: { children: ReactNode }) {
  const [params] = useSearchParams();
  const { isSubscriber } = useWebSession();
  const { isMember, loading } = useMembershipStatus();
  const [inlineSsoStatus, setInlineSsoStatus] = useState<InlineSsoStatus>("idle");
  const ssoToken = params.get("sso_token") ?? "";

  // eslint-disable-next-line no-console
  console.log("[SubscriberRoute] render", {
    url: typeof window !== "undefined" ? window.location.href : "",
    ssoToken,
    isSubscriber,
    isMember,
    inlineSsoStatus,
  });

  useEffect(() => {
    let cancelled = false;
    if (!ssoToken) return;

    (async () => {
      // eslint-disable-next-line no-console
      console.log("[SubscriberRoute] calling validate-sso-token", {
        url: VALIDATE_SSO_TOKEN_URL,
        ssoToken,
      });
      setInlineSsoStatus("validating");
      try {
        const res = await fetch(VALIDATE_SSO_TOKEN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: ssoToken }),
        });
        const data = await res.json().catch(() => ({}));
        // eslint-disable-next-line no-console
        console.log("[SubscriberRoute] validate-sso-token response", { status: res.status, data });

        if (cancelled) return;

        if (!res.ok || !data?.valid) {
          setInlineSsoStatus("invalid");
          return;
        }

        writeWebSession({
          accountId: data.account_id ?? "",
          tier: data.tier ?? null,
          firstName: data.first_name ?? null,
          expiresAt: Date.now() + WEB_SESSION_DURATION_MS,
        });
        removeSsoTokenFromUrl();
        setInlineSsoStatus("valid");
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[SubscriberRoute] validate-sso-token threw", err);
        if (!cancelled) setInlineSsoStatus("invalid");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ssoToken]);

  const hasInlineSsoAccess = inlineSsoStatus === "valid";
  const isCheckingAccess =
    inlineSsoStatus === "validating" ||
    (!!ssoToken && inlineSsoStatus === "idle") ||
    (!isSubscriber && !hasInlineSsoAccess && loading);

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSubscriber && !hasInlineSsoAccess && !isMember) return <AppSubscriberGate />;
  return <>{children}</>;
}
