import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchUsernames } from "@/lib/publicProfiles";
import { forumDisplayName, forumPostLink } from "@/lib/forumTopics";

interface BookmarkedPost {
  id: string;
  title: string | null;
  content: string;
  topic_id: string;
  created_at: string;
  author_name: string;
}

interface BookmarkedPostsProps {
  userId: string;
}

export function BookmarkedPosts({ userId }: BookmarkedPostsProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
      try {
        const { data: bookmarkData, error } = await supabase
          .from('forum_bookmarks')
          .select('post_id')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (!bookmarkData || bookmarkData.length === 0) {
          setBookmarks([]);
          setIsLoading(false);
          return;
        }

        const postIds = bookmarkData.map(b => b.post_id);
        
        const { data: posts, error: postsError } = await supabase
          .from('forum_posts_secure')
          .select('id, title, content, topic_id, created_at, user_id, is_anonymous')
          .in('id', postIds);

        if (postsError) throw postsError;

        const rows = (posts || []).filter((p) => p.id && p.topic_id);
        const names = await fetchUsernames(rows.filter((p) => !p.is_anonymous).map((p) => p.user_id));
        const order = new Map(postIds.map((id, i) => [id, i]));
        setBookmarks(
          rows
            .map((post) => {
              const text = (post.content || "").replace(/\s+/g, " ").trim();
              return {
                id: post.id as string,
                title: post.title,
                content: text.length > 100 ? `${text.substring(0, 100)}…` : text,
                topic_id: post.topic_id as string,
                created_at: post.created_at as string,
                author_name: forumDisplayName(post.user_id ? names.get(post.user_id) : null, !!post.is_anonymous),
              };
            })
            .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)),
        );
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
  }, [userId]);

  useEffect(() => {
    void fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <Dialog onOpenChange={(open) => { if (open) void fetchBookmarks(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bookmark className="h-4 w-4" />
          Bookmarks
          {bookmarks.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-1.5 rounded-full" aria-label={`${bookmarks.length} saved`}>
              {bookmarks.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Saved Posts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
          ) : bookmarks.length > 0 ? (
            bookmarks.map(post => (
              <Link key={post.id} to={forumPostLink(post.topic_id, post.id)} className="block">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-logo-blue truncate">
                          {post.title || 'Untitled Post'}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{post.author_name}</span>
                          <span>•</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No saved posts yet. Click the bookmark icon on any post to save it here.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
