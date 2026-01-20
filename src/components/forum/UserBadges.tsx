import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface UserBadgesProps {
  userId: string;
  showAll?: boolean;
}

export function UserBadges({ userId, showAll = false }: UserBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const fetchBadges = async () => {
      const { data, error } = await supabase
        .from('user_forum_badges')
        .select(`
          badge_id,
          forum_badges (
            id,
            name,
            description,
            icon,
            color
          )
        `)
        .eq('user_id', userId);

      if (!error && data) {
        const userBadges = data
          .map(item => item.forum_badges as unknown as Badge)
          .filter(Boolean);
        setBadges(userBadges);
      }
    };

    fetchBadges();
  }, [userId]);

  if (badges.length === 0) return null;

  const displayBadges = showAll ? badges : badges.slice(0, 3);
  const remainingCount = badges.length - displayBadges.length;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-0.5">
        {displayBadges.map(badge => (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <span className="text-sm cursor-default">{badge.icon}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{badge.name}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <span className="text-xs text-muted-foreground ml-1">+{remainingCount}</span>
        )}
      </div>
    </TooltipProvider>
  );
}
