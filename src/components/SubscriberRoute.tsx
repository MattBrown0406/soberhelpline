import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { untypedSupabase } from "@/integrations/supabase/untyped";
import { clearSsoSignIn, clearWebSession, SSO_TOKEN_PARAM } from "@/lib/webSession";
import AppSubscriberGate from "@/components/AppSubscriberGate";

type Access = "checking" | "member" | "not_member" | "signed_out" | "error";

interface AccessState {
  access: Access;
  email: string | null;
  userId: string | null;
  /** True for admins and moderators let in without a membership (their visits aren't member visits). */
  staff?: boolean;
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
  if (!error && data === true) {
    return { access: "member", email: user.email ?? null, userId: user.id };
  }

  // Staff (admins and forum moderators) can open member pages to moderate and
  // answer questions without holding a paid membership.
  const [admin, moderator] = await Promise.all([
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }),
    supabase.rpc("has_role", { _user_id: user.id, _role: "moderator" }),
  ]);
  if (admin.data === true || moderator.data === true) {
    return { access: "member", email: user.email ?? null, userId: user.id, staff: true };
  }

  if (!error) {
    return { access: "not_member", email: user.email ?? null, userId: user.id };
  }

  // The membership check itself failed (weak signal, a blip). Fallback: the
  // same rule read straight from her membership rows: active, or cancelled
  // with paid time left.
  const { data: rows, error: rowsError } = await supabase
    .from("provider_subscriptions")
    .select("id,status,access_ends_at")
    .eq("user_id", user.id)
    .is("provider_submission_id", null)
    .in("status", ["active", "cancelled"]);
  if (rowsError) {
    // We could not find out. Never tell a paying member she has no
    // membership because a request failed: say so and let her try again.
    return { access: "error", email: user.email ?? null, userId: user.id };
  }
  const now = Date.now();
  const hasAccess = (rows ?? []).some(
    (row) =>
      row.status === "active" ||
      (row.status === "cancelled" && !!row.access_ends_at && new Date(row.access_ends_at).getTime() > now),
  );
  return { access: hasAccess ? "member" : "not_member", email: user.email ?? null, userId: user.id };
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
      // A different person (or no one): don't leave the previous person's
      // page up while we check.
      setState({ access: "checking", email: null, userId: null });
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
        if (!cancelled) setState({ access: "error", email: null, userId: null });
      });
    return () => {
      cancelled = true;
    };
  }, [authVersion]);

  // Record one visit per member per (Pacific) day for the admin engagement
  // report. Best effort: a failure here never affects the page.
  useEffect(() => {
    if (state.access !== "member" || state.staff || !state.userId) return;
    const userId = state.userId;
    // One remembered key per person (not one per day), holding the last day recorded.
    const key = `member_visit_${userId}`;
    let today = "";
    try {
      today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date());
      if (localStorage.getItem(key) === today) return;
    } catch {
      // Storage unavailable (private mode): the database ignores repeat visits anyway.
    }
    untypedSupabase
      .from("member_visits")
      .insert({ user_id: userId, first_path: location.pathname })
      .then(
        ({ error }) => {
          // Remember the day only once it is recorded (23505 = already recorded today).
          if (error && error.code !== "23505") return;
          try {
            if (today) localStorage.setItem(key, today);
          } catch {
            // ignore
          }
        },
        () => undefined,
      );
  }, [state.access, state.staff, state.userId, location.pathname]);

  const handleSignOut = async () => {
    clearSsoSignIn();
    await supabase.auth.signOut();
  };

  if (state.access === "checking") return <Spinner />;

  // The "Signed in from the Sober Helpline app as …" note comes from AppSsoHandoff.
  if (state.access === "member") return <>{children}</>;

  if (state.access === "error") {
    return (
      <div className="min-h-[60vh] bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center" role="alert">
          <h1 className="text-xl font-semibold text-foreground">We couldn't check your membership just now</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This is usually a weak connection. Your membership hasn't changed.
          </p>
          <button
            type="button"
            onClick={() => {
              setState({ access: "checking", email: null, userId: null });
              setAuthVersion((v) => v + 1);
            }}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppSubscriberGate
      signedInEmail={state.access === "not_member" ? state.email : null}
      returnPath={returnPath}
      onSignOut={handleSignOut}
    />
  );
}
