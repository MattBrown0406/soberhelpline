import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { fetchUsernames } from "@/lib/publicProfiles";
import { forumDisplayName, forumPostLink } from "@/lib/forumTopics";
import { useVisiblePolling } from "./useVisiblePolling";

interface Mention {
  id: string;
  post_id: string;
  mentioning_user_id: string;
  is_read: boolean;
  created_at: string;
  mentioner_name: string;
  post_excerpt: string;
  topic_id: string | null;
}

interface MentionNotificationsProps {
  userId: string;
}

/**
 * Bell on the forum pages listing @mentions of the member. forum_mentions is
 * not in the realtime publication, so this polls (every 60 seconds while the
 * tab is visible) instead of subscribing.
 */
export function MentionNotifications({ userId }: MentionNotificationsProps) {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchMentions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("forum_mentions")
        .select("id, post_id, mentioning_user_id, is_read, created_at")
        .eq("mentioned_user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      if (!data || data.length === 0) {
        setMentions([]);
        return;
      }

      const postIds = [...new Set(data.map((m) => m.post_id))];
      const [postsResult, names] = await Promise.all([
        supabase.from("forum_posts_secure").select("id, content, topic_id, parent_post_id").in("id", postIds),
        fetchUsernames(data.map((m) => m.mentioning_user_id)),
      ]);
      const posts = new Map((postsResult.data || []).map((p) => [p.id as string, p]));

      setMentions(
        data
          .filter((m) => posts.has(m.post_id))
          .map((m) => {
            const post = posts.get(m.post_id);
            const text = (post?.content || "").replace(/\s+/g, " ").trim();
            return {
              ...m,
              topic_id: post?.topic_id ?? null,
              post_excerpt: text.length > 100 ? `${text.slice(0, 100)}…` : text,
              mentioner_name: forumDisplayName(names.get(m.mentioning_user_id)),
            };
          }),
      );
    } catch (err) {
      console.error("Error fetching mentions:", err);
    }
  }, [userId]);

  useEffect(() => {
    void fetchMentions();
  }, [fetchMentions]);
  useVisiblePolling(fetchMentions, 60_000);

  const unreadCount = mentions.filter((m) => !m.is_read).length;

  const markAsRead = async (mentionId: string) => {
    setMentions((prev) => prev.map((m) => (m.id === mentionId ? { ...m, is_read: true } : m)));
    const { error } = await supabase.from("forum_mentions").update({ is_read: true }).eq("id", mentionId);
    if (error) console.error("Error marking mention as read:", error);
  };

  const markAllAsRead = async () => {
    setMentions((prev) => prev.map((m) => ({ ...m, is_read: true })));
    const { error } = await supabase
      .from("forum_mentions")
      .update({ is_read: true })
      .eq("mentioned_user_id", userId)
      .eq("is_read", false);
    if (error) console.error("Error marking mentions as read:", error);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (open) void fetchMentions(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative min-h-11 gap-2 rounded-xl bg-card" aria-label={unreadCount > 0 ? `Mentions, ${unreadCount} new` : "Mentions"}>
          <Bell className="h-4 w-4" aria-hidden="true" />
          Mentions
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2 pr-6">
            <span className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Mentions
            </span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>When someone writes @ and your username, it shows up here.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] max-h-[60vh]">
          {mentions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No mentions yet</p>
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              {mentions.map((mention) => (
                <Link
                  key={mention.id}
                  to={mention.topic_id ? forumPostLink(mention.topic_id, mention.post_id) : "/family-forum"}
                  className="block"
                  onClick={() => {
                    if (!mention.is_read) void markAsRead(mention.id);
                    setIsOpen(false);
                  }}
                >
                  <Card className={`hover:bg-accent/50 transition-colors ${!mention.is_read ? "border-primary/50 bg-primary/5" : ""}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            <span className="text-primary">{mention.mentioner_name}</span> mentioned you
                          </p>
                          {mention.post_excerpt && (
                            <p className="text-sm text-muted-foreground mt-1 break-words">{mention.post_excerpt}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(mention.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        {!mention.is_read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
