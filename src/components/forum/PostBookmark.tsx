import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PostBookmarkProps {
  postId: string;
  userId: string;
}

export function PostBookmark({ postId, userId }: PostBookmarkProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkBookmark = async () => {
      const { data, error } = await supabase
        .from('forum_bookmarks')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        setIsBookmarked(true);
      }
    };

    checkBookmark();
  }, [postId, userId]);

  const toggleBookmark = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isBookmarked) {
        await supabase
          .from('forum_bookmarks')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);
        setIsBookmarked(false);
        toast.success("Bookmark removed");
      } else {
        await supabase
          .from('forum_bookmarks')
          .insert({
            post_id: postId,
            user_id: userId
          });
        setIsBookmarked(true);
        toast.success("Post bookmarked");
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error("Failed to update bookmark");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "min-h-11 min-w-11 rounded-xl px-2 text-muted-foreground",
        isBookmarked && "text-primary"
      )}
      onClick={toggleBookmark}
      disabled={isLoading}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this post"}
    >
      <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} aria-hidden="true" />
    </Button>
  );
}
