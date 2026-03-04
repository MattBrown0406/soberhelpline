import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useMembershipStatus() {
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("provider_subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .is("provider_submission_id", null)
        .limit(1);

      setIsMember((data?.length ?? 0) > 0);
      setLoading(false);
    };
    check();
  }, []);

  return { isMember, loading };
}
