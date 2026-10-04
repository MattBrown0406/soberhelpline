import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  completeAppSsoSignIn,
  exchangeAppSsoToken,
  rememberSsoSignIn,
  type AppSsoExchange,
  type AppSsoFailure,
} from "@/lib/webSession";

/** Why an app sign-in did not (fully) work. */
export type SsoNotice = AppSsoFailure | "membership_pending";

/** Every phase except "idle" names the token it belongs to. */
export type AppSsoHandoffState =
  | { phase: "idle" }
  /** Redeeming the token (signingIn false), or signing in after the visitor confirmed (true). */
  | { phase: "working"; token: string; signingIn: boolean }
  /**
   * The link's account is known but nothing has changed yet: ask first.
   * currentEmail is the DIFFERENT account already signed in on this browser,
   * or null when nobody is signed in.
   */
  | { phase: "confirm"; token: string; currentEmail: string | null; appEmail: string }
  | { phase: "done"; token: string; notice: SsoNotice | null };

function successNotice(exchange: AppSsoExchange): SsoNotice | null {
  return exchange.appMember && !exchange.membershipReady ? "membership_pending" : null;
}

/**
 * Handles the one-time `sso_token` from the Sober Helpline app.
 *
 * Redeems the token (which tells us the app account's email) and then stops at
 * phase "confirm" until the visitor taps continueAsAppAccount() or
 * declineAppAccount(). Only the tap signs the browser in. Without it, anyone
 * could send a link carrying THEIR token and silently sign a visitor into their
 * account (then see what the visitor books or writes), or switch a signed-in
 * visitor to it. The only case that skips the question is a browser already
 * signed in as that same account (nothing changes).
 *
 * Mounted once for the whole site (components/AppSsoHandoff), so each token is
 * redeemed exactly once; pages never call this themselves.
 */
export function useAppSsoHandoff(token: string) {
  const [state, setState] = useState<AppSsoHandoffState>(() =>
    token ? { phase: "working", token, signingIn: false } : { phase: "idle" }
  );
  const pending = useRef<{ token: string; exchange: AppSsoExchange } | null>(null);

  useEffect(() => {
    if (!token) {
      pending.current = null;
      setState({ phase: "idle" });
      return;
    }
    let cancelled = false;
    setState({ phase: "working", token, signingIn: false });

    (async () => {
      const exchange = await exchangeAppSsoToken(token);
      if (cancelled) return;
      if (!exchange.ok || !exchange.email) {
        setState({ phase: "done", token, notice: exchange.reason ?? "unavailable" });
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
        setState({ phase: "done", token, notice: successNotice(exchange) });
        return;
      }

      // Signed out, or signed in as someone else: ask before signing in.
      pending.current = { token, exchange };
      setState({
        phase: "confirm",
        token,
        currentEmail: session?.user ? session.user.email ?? "another account" : null,
        appEmail: exchange.email,
      });
    })().catch(() => {
      if (!cancelled) setState({ phase: "done", token, notice: "unavailable" });
    });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const continueAsAppAccount = useCallback(async () => {
    const held = pending.current;
    pending.current = null;
    if (!held) return;
    setState({ phase: "working", token: held.token, signingIn: true });
    const signedIn = await completeAppSsoSignIn(held.exchange);
    setState({
      phase: "done",
      token: held.token,
      notice: signedIn ? successNotice(held.exchange) : "unavailable",
    });
  }, []);

  /** "Not you?" / "Stay signed in as …": drop the link's sign-in; nothing changes. */
  const declineAppAccount = useCallback(() => {
    const held = pending.current;
    pending.current = null;
    if (!held) return;
    setState({ phase: "done", token: held.token, notice: null });
  }, []);

  return { state, continueAsAppAccount, declineAppAccount };
}
