import { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useWebSession } from "@/hooks/useWebSession";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";
import { writeWebSession, WEB_SESSION_DURATION_MS } from "@/lib/webSession";
import AppSubscriberGate from "@/components/AppSubscriberGate";
import { Loader2 } from "lucide-react";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const FN_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/validate-sso-token`;

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

  useEffect(() => {
    let cancelled = false;

    if (!ssoToken || isSubscriber) {
      setInlineSsoStatus("idle");
      return;
    }

    (async () => {
      setInlineSsoStatus("validating");
      try {
        const res = await fetch(FN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ token_id: ssoToken, next: "/family-education" }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok || !data?.ok) {
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
      } catch {
        if (!cancelled) setInlineSsoStatus("invalid");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ssoToken, isSubscriber]);

  const hasInlineSsoAccess = inlineSsoStatus === "valid";
  const isCheckingAccess = (!isSubscriber && !hasInlineSsoAccess && loading) || inlineSsoStatus === "validating";

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
