import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { clearSsoSignIn, clearWebSession, SSO_TOKEN_PARAM } from "@/lib/webSession";
import AppSubscriberGate from "@/components/AppSubscriberGate";

type Access = "checking" | "member" | "not_member" | "signed_out";

interface AccessState {
  access: Access;
  email: string | null;
  userId: string | null;
}

/**
 * Members-only access is decided by the signed-in user's WEBSITE membership
 * (the same is_active_family_member check the database uses for the forum,
 * recordings and Q&A), never by a client-side flag.
 *
 * Sign-in from the app (`?sso_token=`) is handled once for the whole site by
 * AppSsoHandoff, which doesn't render the page until it has finished, so this
 * component only ever sees the resulting session (and never redeems a token).
 */
async function checkAccess(): Promise<AccessState> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return { access: "signed_out", email: null, userId: null };

  const { data, error } = await supabase.rpc("is_active_family_member", { _user_id: user.id });
  if (!error) {
    return { access: data === true ? "member" : "not_member", email: user.email ?? null, userId: user.id };
  }

  // Fallback: the same query the member pages run themselves.
  const { data: rows } = await supabase
    .from("provider_subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .is("provider_submission_id", null)
    .limit(1);
  return {
    access: (rows?.length ?? 0) > 0 ? "member" : "not_member",
    email: user.email ?? null,
    userId: user.id,
  };
}

const Spinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-label="Loading">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default function SubscriberRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [state, setState] = useState<AccessState>({ access: "checking", email: null, userId: null });
  const [authVersion, setAuthVersion] = useState(0);
  const checkedUserId = useRef<string | null | undefined>(undefined);

  // Where to come back to after signing in (never includes an app token).
  const returnPath = useMemo(() => {
    const search = new URLSearchParams(location.search);
    search.delete(SSO_TOKEN_PARAM);
    const query = search.toString();
    return `${location.pathname}${query ? `?${query}` : ""}${location.hash}`;
  }, [location.pathname, location.search, location.hash]);

  // Old builds stored a client-side "app subscriber" flag; it no longer grants
  // access, so remove any leftovers.
  useEffect(() => {
    clearWebSession();
  }, []);

  // Re-check when someone signs in or out (e.g. in another tab).
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT") return;
      const userId = session?.user?.id ?? null;
      if (userId === checkedUserId.current) return;
      setAuthVersion((v) => v + 1);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Membership check.
  useEffect(() => {
    let cancelled = false;
    checkAccess()
      .then((result) => {
        if (cancelled) return;
        checkedUserId.current = result.userId;
        setState(result);
      })
      .catch(() => {
        if (!cancelled) setState({ access: "signed_out", email: null, userId: null });
      });
    return () => {
      cancelled = true;
    };
  }, [authVersion]);

  const handleSignOut = async () => {
    clearSsoSignIn();
    await supabase.auth.signOut();
  };

  if (state.access === "checking") return <Spinner />;

  // The "Signed in from the Sober Helpline app as …" note comes from AppSsoHandoff.
  if (state.access === "member") return <>{children}</>;

  return (
    <AppSubscriberGate
      signedInEmail={state.access === "not_member" ? state.email : null}
      returnPath={returnPath}
      onSignOut={handleSignOut}
    />
  );
}
