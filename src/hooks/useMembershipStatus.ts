import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useMembershipStatus() {
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Active memberships OR cancelled memberships whose access hasn't ended yet.
      const { data } = await supabase
        .from("provider_subscriptions")
        .select("id,status,access_ends_at")
        .eq("user_id", user.id)
        .is("provider_submission_id", null)
        .in("status", ["active", "cancelled"]);

      const now = Date.now();
      const hasAccess = (data ?? []).some((row) => {
        if (row.status === "active") return true;
        if (row.status === "cancelled" && row.access_ends_at) {
          return new Date(row.access_ends_at).getTime() > now;
        }
        return false;
      });

      setIsMember(hasAccess);
      setLoading(false);
    };
    check();
  }, []);

  return { isMember, loading };
}
