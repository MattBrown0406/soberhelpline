import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { AtSign, Check, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { fetchPublicProfiles } from "@/lib/publicProfiles";

interface Mention {
  id: string;
  post_id: string;
  mentioning_user_id: string;
  is_read: boolean;
  created_at: string;
  mentioner_name?: string;
  post_content?: string;
  topic_id?: string;
}

interface MentionNotificationsProps {
  userId: string;
}

export function MentionNotifications({ userId }: MentionNotificationsProps) {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchMentions();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('mention-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_mentions',
          filter: `mentioned_user_id=eq.${userId}`
        },
        () => {
          fetchMentions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchMentions = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_mentions')
        .select('*')
        .eq('mentioned_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data && data.length > 0) {
        // Get post details and mentioner info
        const postIds = [...new Set(data.map(m => m.post_id))];
        const mentionerIds = [...new Set(data.map(m => m.mentioning_user_id))];

        const [postsResult, profilesResult] = await Promise.all([
          supabase
            .from('forum_posts')
            .select('id, content, topic_id')
            .in('id', postIds),
          fetchPublicProfiles(mentionerIds)
        ]);

        const postsMap = new Map(
          (postsResult.data || []).map(p => [p.id, p])
        );
        const profilesMap = new Map(
          (profilesResult || []).map(p => [p.id, p])
        );

        const enrichedMentions = data.map(mention => {
          const post = postsMap.get(mention.post_id);
          const profile = profilesMap.get(mention.mentioning_user_id);
          return {
            ...mention,
            post_content: post?.content?.substring(0, 100) + (post?.content?.length > 100 ? '...' : ''),
            topic_id: post?.topic_id,
            mentioner_name: profile?.username || profile?.first_name || 'Someone'
          };
        });

        setMentions(enrichedMentions);
        setUnreadCount(enrichedMentions.filter(m => !m.is_read).length);
      }
    } catch (err) {
      console.error('Error fetching mentions:', err);
    }
  };

  const markAsRead = async (mentionId: string) => {
    try {
      await supabase
        .from('forum_mentions')
        .update({ is_read: true })
        .eq('id', mentionId);
      
      setMentions(prev => 
        prev.map(m => m.id === mentionId ? { ...m, is_read: true } : m)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('forum_mentions')
        .update({ is_read: true })
        .eq('mentioned_user_id', userId)
        .eq('is_read', false);
      
      setMentions(prev => prev.map(m => ({ ...m, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 relative">
          <AtSign className="h-4 w-4" />
          Mentions
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AtSign className="h-5 w-5" />
              Mentions
            </span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px]">
          {mentions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No mentions yet</p>
              <p className="text-sm">When someone @mentions you, it will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {mentions.map(mention => (
                <Link
                  key={mention.id}
                  to={`/family-forum/${mention.topic_id}`}
                  onClick={() => {
                    if (!mention.is_read) markAsRead(mention.id);
                    setIsOpen(false);
                  }}
                >
                  <Card className={`hover:bg-accent/50 transition-colors cursor-pointer ${
                    !mention.is_read ? 'border-primary/50 bg-primary/5' : ''
                  }`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            <span className="text-primary">{mention.mentioner_name}</span>
                            {' '}mentioned you
                          </p>
                          {mention.post_content && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {mention.post_content}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(mention.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        {!mention.is_read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
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
