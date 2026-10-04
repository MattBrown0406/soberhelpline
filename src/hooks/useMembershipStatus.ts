import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Is the signed-in visitor a Sober Helpline member?
 *
 * Uses the site's one membership rule (is_active_family_member — the same check
 * the member pages, the forum and the coaching price use): web memberships,
 * app memberships ('app' rows) until their grace ends, and cancelled members
 * until the end of the period they paid for. Re-checks when someone signs in or
 * out (e.g. after signing in from the Sober Helpline app).
 */
export function useMembershipStatus() {
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authVersion, setAuthVersion] = useState(0);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setAuthVersion((v) => v + 1);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        if (!cancelled) {
          setIsMember(false);
          setLoading(false);
        }
        return;
      }

      const { data: rpcResult, error: rpcError } = await supabase.rpc("is_active_family_member", { _user_id: user.id });
      let hasAccess = rpcResult === true;

      if (rpcError) {
        // Fallback: active memberships OR cancelled memberships whose access hasn't ended yet.
        const { data } = await supabase
          .from("provider_subscriptions")
          .select("id,status,access_ends_at")
          .eq("user_id", user.id)
          .is("provider_submission_id", null)
          .in("status", ["active", "cancelled"]);

        const now = Date.now();
        hasAccess = (data ?? []).some((row) => {
          if (row.status === "active") return true;
          if (row.status === "cancelled" && row.access_ends_at) {
            return new Date(row.access_ends_at).getTime() > now;
          }
          return false;
        });
      }

      if (!cancelled) {
        setIsMember(hasAccess);
        setLoading(false);
      }
    };
    check().catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [authVersion]);

  return { isMember, loading };
}
