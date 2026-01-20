import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostReactionsProps {
  postId: string;
  userId: string;
}

type ReactionType = 'pray' | 'strong' | 'heart' | 'hug';

const reactionEmojis: Record<ReactionType, string> = {
  pray: '🙏',
  strong: '💪',
  heart: '❤️',
  hug: '🤗'
};

interface ReactionCount {
  reaction_type: ReactionType;
  count: number;
  hasReacted: boolean;
}

export function PostReactions({ postId, userId }: PostReactionsProps) {
  const [reactions, setReactions] = useState<ReactionCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReactions = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_post_reactions')
        .select('reaction_type, user_id')
        .eq('post_id', postId);

      if (error) throw error;

      // Count reactions and check if user has reacted
      const counts: Record<ReactionType, { count: number; hasReacted: boolean }> = {
        pray: { count: 0, hasReacted: false },
        strong: { count: 0, hasReacted: false },
        heart: { count: 0, hasReacted: false },
        hug: { count: 0, hasReacted: false }
      };

      data?.forEach(reaction => {
        const type = reaction.reaction_type as ReactionType;
        if (counts[type]) {
          counts[type].count++;
          if (reaction.user_id === userId) {
            counts[type].hasReacted = true;
          }
        }
      });

      setReactions(
        Object.entries(counts).map(([type, data]) => ({
          reaction_type: type as ReactionType,
          count: data.count,
          hasReacted: data.hasReacted
        }))
      );
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  useEffect(() => {
    fetchReactions();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`reactions-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_post_reactions',
          filter: `post_id=eq.${postId}`
        },
        () => {
          fetchReactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, userId]);

  const toggleReaction = async (reactionType: ReactionType) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const reaction = reactions.find(r => r.reaction_type === reactionType);
      
      if (reaction?.hasReacted) {
        // Remove reaction
        await supabase
          .from('forum_post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)
          .eq('reaction_type', reactionType);
      } else {
        // Add reaction
        await supabase
          .from('forum_post_reactions')
          .insert({
            post_id: postId,
            user_id: userId,
            reaction_type: reactionType
          });
      }

      fetchReactions();
    } catch (error) {
      console.error('Error toggling reaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {reactions.map(reaction => (
        <Button
          key={reaction.reaction_type}
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-2 text-sm gap-1",
            reaction.hasReacted && "bg-primary/10 text-primary"
          )}
          onClick={() => toggleReaction(reaction.reaction_type)}
          disabled={isLoading}
        >
          <span>{reactionEmojis[reaction.reaction_type]}</span>
          {reaction.count > 0 && <span className="text-xs">{reaction.count}</span>}
        </Button>
      ))}
    </div>
  );
}
