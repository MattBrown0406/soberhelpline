import { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useWebSession } from "@/hooks/useWebSession";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";
import { writeWebSession, WEB_SESSION_DURATION_MS } from "@/lib/webSession";
import { supabase } from "@/integrations/supabase/client";
import AppSubscriberGate from "@/components/AppSubscriberGate";
import { Loader2 } from "lucide-react";

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

  // DEBUG: confirm what the route guard sees on every render
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
      console.log("[SubscriberRoute] calling validate-sso-token", { ssoToken });
      setInlineSsoStatus("validating");
      try {
        const { data, error } = await supabase.functions.invoke("validate-sso-token", {
          body: { token_id: ssoToken, next: "/family-education" },
        });
        // eslint-disable-next-line no-console
        console.log("[SubscriberRoute] validate-sso-token response", { data, error });
        if (cancelled) return;

        if (error || !data?.ok) {
          setInlineSsoStatus("invalid");
          return;
        }

        writeWebSession({
          accountId: data.account_id,
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
