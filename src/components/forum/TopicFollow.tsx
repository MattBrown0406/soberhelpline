import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

interface TopicFollowProps {
  topicId: string;
  userId: string;
}

export function TopicFollow({ topicId, userId }: TopicFollowProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFollow = async () => {
      const { data, error } = await supabase
        .from('forum_topic_follows')
        .select('id')
        .eq('topic_id', topicId)
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        setIsFollowing(true);
      }
    };

    checkFollow();
  }, [topicId, userId]);

  const toggleFollow = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isFollowing) {
        await supabase
          .from('forum_topic_follows')
          .delete()
          .eq('topic_id', topicId)
          .eq('user_id', userId);
        setIsFollowing(false);
        toast.success("Unfollowed topic");
      } else {
        await supabase
          .from('forum_topic_follows')
          .insert({
            topic_id: topicId,
            user_id: userId
          });
        setIsFollowing(true);
        toast.success("Following topic - you'll be notified of new posts");
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error("Failed to update follow status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? "secondary" : "outline"}
      size="sm"
      className="gap-2"
      onClick={toggleFollow}
      disabled={isLoading}
    >
      {isFollowing ? (
        <>
          <BellOff className="h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <Bell className="h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}
