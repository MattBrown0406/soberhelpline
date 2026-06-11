import { Helmet } from "react-helmet-async";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, Loader2, Plus, MessageCircle, Clock, User, Trash2, Send, Pin, EyeOff, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";
import { fetchPublicProfiles } from "@/lib/publicProfiles";
import { moderateContent } from "@/lib/contentModeration";
import { PostReactions } from "@/components/forum/PostReactions";
import { PostBookmark } from "@/components/forum/PostBookmark";
import { TopicFollow } from "@/components/forum/TopicFollow";
import { UserBadges } from "@/components/forum/UserBadges";
import { PollDisplay } from "@/components/forum/PollDisplay";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ForumTopicConfig {
  id: string;
  title: string;
  description: string;
  color: string;
}

const topicConfigs: Record<string, ForumTopicConfig> = {
  "introductions": {
    id: "introductions",
    title: "Introductions & Welcome",
    description: "New to the community? Introduce yourself and meet other families.",
    color: "bg-blue-500"
  },
  "share-story": {
    id: "share-story",
    title: "Share Your Story",
    description: "A safe space to share your experiences and journey.",
    color: "bg-pink-500"
  },
  "treatment-discussions": {
    id: "treatment-discussions",
    title: "Treatment Center, IOP & Sober Living Discussions",
    description: "Discuss experiences with treatment centers, intensive outpatient programs, and sober living homes.",
    color: "bg-cyan-500"
  },
  "ask-community": {
    id: "ask-community",
    title: "Ask the Community",
    description: "Have questions? Get advice from families who've been there.",
    color: "bg-green-500"
  },
  "boundaries": {
    id: "boundaries",
    title: "Setting Boundaries",
    description: "Discuss strategies for establishing healthy boundaries.",
    color: "bg-orange-500"
  },
  "self-care": {
    id: "self-care",
    title: "Self-Care & Wellness",
    description: "Tips and support for taking care of yourself.",
    color: "bg-purple-500"
  },
  "recovery-wins": {
    id: "recovery-wins",
    title: "Recovery Wins & Celebrations",
    description: "Share milestones, good news, and celebrate progress.",
    color: "bg-yellow-500"
  },
  "resources": {
    id: "resources",
    title: "Resources & Recommendations",
    description: "Share helpful books, articles, podcasts, and more.",
    color: "bg-teal-500"
  },
  "intervention": {
    id: "intervention",
    title: "Intervention Discussions",
    description: "Considering an intervention? Get advice and share experiences.",
    color: "bg-red-500"
  },
};

interface ForumPost {
  id: string;
  topic_id: string;
  user_id: string;
  title: string | null;
  content: string;
  parent_post_id: string | null;
  created_at: string;
  updated_at: string;
  author?: {
    username: string | null;
    first_name: string;
    last_name: string;
  };
  replies?: ForumPost[];
}

export default function ForumTopic() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<ForumPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [canModerate, setCanModerate] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);

  const topicConfig = topicId ? topicConfigs[topicId] : null;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasMembership(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check membership
        const { data: subData, error: subError } = await supabase
          .from('provider_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .is('provider_submission_id', null)
          .limit(1);

        if (subError) {
          console.error('Error checking membership:', subError);
          setHasMembership(false);
        } else {
          setHasMembership(subData && subData.length > 0);
        }

        // Check if user can moderate
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['moderator', 'admin'])
          .limit(1);

        setCanModerate(roleData && roleData.length > 0);
      } catch (err) {
        console.error('Check failed:', err);
        setHasMembership(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [user]);

  useEffect(() => {
    if (hasMembership && topicId) {
      fetchPosts();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('forum-posts-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'forum_posts',
            filter: `topic_id=eq.${topicId}`
          },
          () => {
            fetchPosts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [hasMembership, topicId]);

  const fetchPosts = async () => {
    if (!topicId) return;

    try {
      // Fetch all posts for this topic
      const { data: postsData, error: postsError } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(postsData.map(p => p.user_id))];

      // Fetch safe public display fields (no email/phone)
      const profiles = await fetchPublicProfiles(userIds);

      // Combine data and organize into threads
      const enrichedPosts: ForumPost[] = postsData.map(post => {
        const profile = profiles?.find(p => p.id === post.user_id);
        return {
          ...post,
          author: profile
            ? {
                username: profile.username,
                first_name: profile.first_name,
                last_name: profile.last_name,
              }
            : undefined,
        };
      });

      // Organize into threads (main posts with replies)
      const mainPosts = enrichedPosts.filter(p => !p.parent_post_id);
      const replies = enrichedPosts.filter(p => p.parent_post_id);

      const threaded = mainPosts.map(post => ({
        ...post,
        replies: replies
          .filter(r => r.parent_post_id === post.id)
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      }));

      setPosts(threaded);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    }
  };

  const handleCreatePost = async () => {
    if (!user || !topicId || !newPostContent.trim()) {
      toast.error("Please enter your post content");
      return;
    }

    setIsSubmitting(true);
    setModerationError(null);
    
    try {
      // Check content moderation
      const moderation = await moderateContent(newPostContent.trim(), newPostTitle.trim());
      
      if (!moderation.allowed) {
        setModerationError(moderation.reason || "Please revise your message to be more respectful and try again.");
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('forum_posts')
        .insert({
          topic_id: topicId,
          user_id: user.id,
          title: newPostTitle.trim() || null,
          content: newPostContent.trim()
        });

      if (error) throw error;

      toast.success("Post created successfully!");
      setNewPostTitle("");
      setNewPostContent("");
      setShowNewPost(false);
      setModerationError(null);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentPostId: string) => {
    if (!user || !topicId || !replyContent.trim()) {
      toast.error("Please enter your reply");
      return;
    }

    setIsSubmitting(true);
    setModerationError(null);
    
    try {
      // Check content moderation
      const moderation = await moderateContent(replyContent.trim());
      
      if (!moderation.allowed) {
        setModerationError(moderation.reason || "Please revise your reply to be more respectful and try again.");
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('forum_posts')
        .insert({
          topic_id: topicId,
          user_id: user.id,
          content: replyContent.trim(),
          parent_post_id: parentPostId
        });

      if (error) throw error;

      toast.success("Reply posted!");
      setReplyContent("");
      setReplyingTo(null);
      fetchPosts();
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (post: ForumPost) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      toast.success("Post deleted");
      setDeleteConfirm(null);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getAuthorDisplay = (author?: { username: string | null; first_name: string; last_name: string }) => {
    if (!author) return "Anonymous";
    return author.username || `${author.first_name} ${author.last_name.charAt(0)}.`;
  };

  if (!topicConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Topic not found</p>
            <Link to="/family-forum">
              <Button>Back to Forum</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasMembership) {
    return (
      <>
        <Helmet>
          <title>{topicConfig.title} | Sober Helpline Forum</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <main className="container py-12">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Members Only Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Join our family support membership to access the forum.
                </p>
                <div className="flex flex-col gap-2">
                  <Link to="/family-membership">
                    <Button className="w-full">Become a Member</Button>
                  </Link>
                  <Link to="/family-forum">
                    <Button variant="outline" className="w-full">Back to Forum</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{topicConfig.title} | Sober Helpline Forum</title>
        <meta name="description" content={topicConfig.description} />
      </Helmet>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
              {deleteConfirm?.replies && deleteConfirm.replies.length > 0 && (
                <span className="block mt-2 text-destructive">
                  This will also delete {deleteConfirm.replies.length} replies.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeletePost(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/family-forum"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Forum
            </Link>

            {/* Topic Header */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${topicConfig.color} text-white`}>
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-logo-blue mb-2">
                    {topicConfig.title}
                  </h1>
                  <p className="text-muted-foreground">{topicConfig.description}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {user && topicId && <TopicFollow topicId={topicId} userId={user.id} />}
                <Button onClick={() => setShowNewPost(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Post
                </Button>
              </div>
            </div>

            {/* New Post Form */}
            {showNewPost && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Create New Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {moderationError && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{moderationError}</AlertDescription>
                    </Alert>
                  )}
                  <Input
                    placeholder="Post title (optional)"
                    value={newPostTitle}
                    onChange={(e) => {
                      setNewPostTitle(e.target.value);
                      setModerationError(null);
                    }}
                  />
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newPostContent}
                    onChange={(e) => {
                      setNewPostContent(e.target.value);
                      setModerationError(null);
                    }}
                    rows={4}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      setShowNewPost(false);
                      setNewPostTitle("");
                      setNewPostContent("");
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreatePost} 
                      disabled={isSubmitting || !newPostContent.trim()}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No posts yet. Be the first to start a discussion!
                    </p>
                    <Button onClick={() => setShowNewPost(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-4 md:p-6">
                      {/* Main Post */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            {post.title && (
                              <h3 className="font-semibold text-lg text-logo-blue mb-1">
                                {post.title}
                              </h3>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{getAuthorDisplay(post.author)}</span>
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(post.created_at)}</span>
                            </div>
                          </div>
                          {(post.user_id === user?.id || canModerate) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirm(post)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
                        
                        {/* Poll Display */}
                        {user && <PollDisplay postId={post.id} userId={user.id} />}

                        <div className="flex items-center gap-2 pt-2 flex-wrap">
                          {user && <PostReactions postId={post.id} userId={user.id} />}
                          <div className="flex items-center gap-1 ml-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                              className="text-muted-foreground"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Reply
                              {post.replies && post.replies.length > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  {post.replies.length}
                                </Badge>
                              )}
                            </Button>
                            {user && <PostBookmark postId={post.id} userId={user.id} />}
                          </div>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === post.id && (
                          <div className="mt-4 pl-4 border-l-2 border-border">
                            <Textarea
                              placeholder="Write your reply..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              rows={2}
                              className="mb-2"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleReply(post.id)}
                                disabled={isSubmitting || !replyContent.trim()}
                              >
                                {isSubmitting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Reply"
                                )}
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {post.replies && post.replies.length > 0 && (
                          <div className="mt-4 space-y-3 pl-4 border-l-2 border-border">
                            {post.replies.map((reply) => (
                              <div key={reply.id} className="bg-muted/50 rounded-lg p-3">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    <span>{getAuthorDisplay(reply.author)}</span>
                                    <span>•</span>
                                    <span>{formatTimeAgo(reply.created_at)}</span>
                                  </div>
                                  {(reply.user_id === user?.id || canModerate) && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setDeleteConfirm(reply)}
                                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                                <p className="text-foreground text-sm whitespace-pre-wrap">
                                  {reply.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
