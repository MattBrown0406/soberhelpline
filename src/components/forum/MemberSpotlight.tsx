import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IconTile, Panel } from "@/components/member/MemberUI";
import { Star } from "lucide-react";
import { fetchPublicProfiles } from "@/lib/publicProfiles";
import { UserBadges } from "./UserBadges";
import { forumDisplayName } from "@/lib/forumTopics";

interface Spotlight {
  user_id: string;
  reason: string | null;
  username: string;
}

export function MemberSpotlight() {
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);

  useEffect(() => {
    const fetchSpotlight = async () => {
      // Get current month spotlight
      const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
      
      const { data, error } = await supabase
        .from('forum_member_spotlights')
        .select('user_id, reason')
        .eq('month', currentMonth)
        .maybeSingle();

      if (!error && data) {
        const profiles = await fetchPublicProfiles([data.user_id]);
        if (profiles && profiles.length > 0) {
          setSpotlight({
            user_id: data.user_id,
            reason: data.reason,
            username: forumDisplayName(profiles[0].username),
          });
        }
      }
    };

    fetchSpotlight();
  }, []);

  if (!spotlight) return null;

  return (
    <Panel tone="amber">
      <div className="flex items-start gap-3">
        <IconTile icon={Star} tone="amber" />
        <div className="min-w-0">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800 dark:text-amber-300">
            Member Spotlight
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="break-all text-base font-semibold text-foreground">
              {spotlight.username}
            </span>
            <UserBadges userId={spotlight.user_id} />
          </div>
          {spotlight.reason && (
            <p className="mt-1 break-words text-sm leading-relaxed text-muted-foreground">{spotlight.reason}</p>
          )}
        </div>
      </div>
    </Panel>
  );
}
