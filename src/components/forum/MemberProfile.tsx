import { useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserBadges } from "./UserBadges";
import { MessageCircle, Award, User, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { forumPostLink, getForumTopic } from "@/lib/forumTopics";

interface MemberProfileProps {
  userId: string;
  /** The member's username (or "Member"). Never a real name. */
  displayName: string;
  currentUserId?: string;
  /** Offer "Send a private message"; omitted for anonymous authors. */
  onMessage?: (member: { id: string; username: string }) => void;
  children?: ReactNode;
}

interface UserPost {
  id: string;
  topic_id: string;
  parent_post_id: string | null;
  title: string | null;
  content: string;
  created_at: string;
}

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  awarded_at: string;
}

/**
 * A member's forum profile: username, badges and recent posts. Anonymous posts
 * are never listed (filtered on is_anonymous, because staff viewers receive
 * user_id for anonymous posts from forum_posts_secure).
 */
export function MemberProfile({ userId, displayName, currentUserId, onMessage, children }: MemberProfileProps) {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const [postsRes, badgesRes] = await Promise.all([
          supabase
            .from("forum_posts_secure")
            .select("id, topic_id, parent_post_id, title, content, created_at", { count: "exact" })
            .eq("user_id", userId)
            .eq("is_anonymous", false)
            .order("created_at", { ascending: false })
            .limit(10),
          supabase
            .from("user_forum_badges")
            .select("awarded_at, forum_badges ( id, name, description, icon )")
            .eq("user_id", userId),
        ]);
        if (cancelled) return;

        setPosts(((postsRes.data as unknown as UserPost[]) || []).filter((p) => !!p.id));
        setPostCount(postsRes.count ?? 0);

        const rows = (badgesRes.data as unknown as Array<{ awarded_at: string; forum_badges: Omit<BadgeData, "awarded_at"> | null }>) || [];
        setBadges(
          rows
            .filter((b) => !!b.forum_badges)
            .map((b) => ({ ...(b.forum_badges as Omit<BadgeData, "awarded_at">), awarded_at: b.awarded_at })),
        );
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchProfileData();
    return () => {
      cancelled = true;
    };
  }, [userId, isOpen]);

  const excerpt = (content: string, maxLength = 120) => {
    const text = content.replace(/\s+/g, " ").trim();
    return text.length <= maxLength ? text : `${text.substring(0, maxLength)}…`;
  };

  const canMessage = !!onMessage && userId !== currentUserId && displayName !== "Member";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <button type="button" className="text-primary hover:underline font-medium">
            {displayName}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <span className="text-xl break-words">{displayName}</span>
              <UserBadges userId={userId} />
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">Forum profile for {displayName}</DialogDescription>
        </DialogHeader>

        {canMessage && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 w-fit"
            onClick={() => {
              setIsOpen(false);
              onMessage?.({ id: userId, username: displayName });
            }}
          >
            <Mail className="h-4 w-4" />
            Send a private message
          </Button>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageCircle className="h-5 w-5 mx-auto text-primary mb-1" />
                  <div className="text-2xl font-bold">{postCount}</div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="h-5 w-5 mx-auto text-amber-500 mb-1" />
                  <div className="text-2xl font-bold">{badges.length}</div>
                  <div className="text-xs text-muted-foreground">Badges</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="posts">
              <TabsList className="w-full">
                <TabsTrigger value="posts" className="flex-1">Recent posts</TabsTrigger>
                <TabsTrigger value="badges" className="flex-1">Badges</TabsTrigger>
              </TabsList>

              <TabsContent value="posts">
                <ScrollArea className="h-[300px] max-h-[45vh]">
                  {posts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No posts yet</p>
                  ) : (
                    <div className="space-y-2 pr-2">
                      {posts.map((post) => (
                        <Link
                          key={post.id}
                          to={forumPostLink(post.topic_id, post.id)}
                          onClick={() => setIsOpen(false)}
                          className="block"
                        >
                          <Card className="hover:bg-accent/50 transition-colors">
                            <CardContent className="p-3">
                              {post.title && <div className="font-medium text-sm mb-1">{post.title}</div>}
                              <p className="text-sm text-muted-foreground break-words">{excerpt(post.content)}</p>
                              <div className="text-xs text-muted-foreground mt-2">
                                {post.parent_post_id ? "Reply" : "Conversation"} in {getForumTopic(post.topic_id)?.title ?? "the forum"} ·{" "}
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="badges">
                <ScrollArea className="h-[300px] max-h-[45vh]">
                  {badges.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No badges yet</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-2">
                      {badges.map((badge) => (
                        <Card key={badge.id}>
                          <CardContent className="p-3 flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-lg bg-muted shrink-0">
                              {badge.icon}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{badge.name}</div>
                              <div className="text-xs text-muted-foreground">{badge.description}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Earned {formatDistanceToNow(new Date(badge.awarded_at), { addSuffix: true })}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
