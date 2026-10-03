import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  completeAppSsoSignIn,
  exchangeAppSsoToken,
  rememberSsoSignIn,
  type AppSsoExchange,
  type AppSsoFailure,
} from "@/lib/webSession";

/** Why an app sign-in did not (fully) work, for the member-options page. */
export type SsoNotice = AppSsoFailure | "membership_pending";

export type AppSsoHandoffState =
  | { phase: "idle" }
  | { phase: "working" }
  /** A different website account is signed in: ask before switching. */
  | { phase: "confirm"; currentEmail: string; appEmail: string }
  | { phase: "done"; notice: SsoNotice | null };

function successNotice(exchange: AppSsoExchange): SsoNotice | null {
  return exchange.appMember && !exchange.membershipReady ? "membership_pending" : null;
}

/**
 * Handles `?sso_token=` from the Sober Helpline app.
 *
 * Signs the browser in as the app user's website account, except when a
 * DIFFERENT website account is already signed in: then it stops at
 * phase "confirm" and waits for continueAsAppAccount() or keepCurrentAccount(),
 * so a link carrying someone else's token can't silently switch accounts.
 */
export function useAppSsoHandoff(token: string) {
  const [state, setState] = useState<AppSsoHandoffState>(() =>
    token ? { phase: "working" } : { phase: "idle" }
  );
  const pending = useRef<AppSsoExchange | null>(null);

  useEffect(() => {
    if (!token) {
      pending.current = null;
      setState({ phase: "idle" });
      return;
    }
    let cancelled = false;
    setState({ phase: "working" });

    (async () => {
      const exchange = await exchangeAppSsoToken(token);
      if (cancelled) return;
      if (!exchange.ok || !exchange.email) {
        setState({ phase: "done", notice: exchange.reason ?? "unavailable" });
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      const currentEmail = session?.user?.email?.toLowerCase() ?? null;

      if (session?.user && currentEmail === exchange.email) {
        // Already signed in as this account.
        rememberSsoSignIn(exchange.email);
        setState({ phase: "done", notice: successNotice(exchange) });
        return;
      }
      if (session?.user) {
        pending.current = exchange;
        setState({
          phase: "confirm",
          currentEmail: session.user.email ?? "another account",
          appEmail: exchange.email,
        });
        return;
      }

      const signedIn = await completeAppSsoSignIn(exchange);
      if (cancelled) return;
      setState({ phase: "done", notice: signedIn ? successNotice(exchange) : "unavailable" });
    })().catch(() => {
      if (!cancelled) setState({ phase: "done", notice: "unavailable" });
    });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const continueAsAppAccount = useCallback(async () => {
    const exchange = pending.current;
    pending.current = null;
    if (!exchange) return;
    setState({ phase: "working" });
    const signedIn = await completeAppSsoSignIn(exchange);
    setState({ phase: "done", notice: signedIn ? successNotice(exchange) : "unavailable" });
  }, []);

  const keepCurrentAccount = useCallback(() => {
    pending.current = null;
    setState({ phase: "done", notice: null });
  }, []);

  return { state, continueAsAppAccount, keepCurrentAccount };
}
