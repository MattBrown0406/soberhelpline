import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { fetchPublicProfiles } from "@/lib/publicProfiles";
import { UserBadges } from "./UserBadges";

interface Spotlight {
  user_id: string;
  reason: string | null;
  username: string;
  first_name: string;
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
            username: profiles[0].username || '',
            first_name: profiles[0].first_name
          });
        }
      }
    };

    fetchSpotlight();
  }, []);

  if (!spotlight) return null;

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/50">
            <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400 fill-current" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-yellow-800 dark:text-yellow-200 mb-1">
              Member Spotlight
            </h4>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">
                {spotlight.username || spotlight.first_name}
              </span>
              <UserBadges userId={spotlight.user_id} />
            </div>
            {spotlight.reason && (
              <p className="text-sm text-muted-foreground">{spotlight.reason}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
