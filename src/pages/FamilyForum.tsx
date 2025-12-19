import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, MessagesSquare, MessageCircle, Users, Heart, Lock, Loader2, Plus, ChevronRight, Flag, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { CodeOfConductDialog } from "@/components/forum/CodeOfConductDialog";
import { ReportContentDialog } from "@/components/forum/ReportContentDialog";
import { ModeratorActionsDialog } from "@/components/forum/ModeratorActionsDialog";
import { PrivateMessagesDialog } from "@/components/forum/PrivateMessagesDialog";
import { toast } from "sonner";

interface ForumTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const forumTopics: ForumTopic[] = [
  {
    id: "introductions",
    title: "Introductions & Welcome",
    description: "New to the community? Introduce yourself and meet other families.",
    icon: <Users className="h-6 w-6" />,
    color: "bg-blue-500"
  },
  {
    id: "share-story",
    title: "Share Your Story",
    description: "A safe space to share your experiences and journey.",
    icon: <Heart className="h-6 w-6" />,
    color: "bg-pink-500"
  },
  {
    id: "treatment-discussions",
    title: "Treatment Center, IOP & Sober Living Discussions",
    description: "Discuss experiences with treatment centers, intensive outpatient programs, and sober living homes.",
    icon: <MessagesSquare className="h-6 w-6" />,
    color: "bg-cyan-500"
  },
  {
    id: "ask-community",
    title: "Ask the Community",
    description: "Have questions? Get advice from families who've been there.",
    icon: <MessageCircle className="h-6 w-6" />,
    color: "bg-green-500"
  },
  {
    id: "boundaries",
    title: "Setting Boundaries",
    description: "Discuss strategies for establishing healthy boundaries.",
    icon: <MessagesSquare className="h-6 w-6" />,
    color: "bg-orange-500"
  },
  {
    id: "self-care",
    title: "Self-Care & Wellness",
    description: "Tips and support for taking care of yourself.",
    icon: <Heart className="h-6 w-6" />,
    color: "bg-purple-500"
  },
  {
    id: "recovery-wins",
    title: "Recovery Wins & Celebrations",
    description: "Share milestones, good news, and celebrate progress.",
    icon: <Heart className="h-6 w-6" />,
    color: "bg-yellow-500"
  },
  {
    id: "resources",
    title: "Resources & Recommendations",
    description: "Share helpful books, articles, podcasts, and more.",
    icon: <MessagesSquare className="h-6 w-6" />,
    color: "bg-teal-500"
  },
  {
    id: "intervention",
    title: "Intervention Discussions",
    description: "Considering an intervention? Get advice and share experiences.",
    icon: <Users className="h-6 w-6" />,
    color: "bg-red-500"
  },
];


export default function FamilyForum() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  const [hasAgreedToCodeOfConduct, setHasAgreedToCodeOfConduct] = useState(false);
  const [showCodeOfConduct, setShowCodeOfConduct] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [showModeratorActions, setShowModeratorActions] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [forumMembers, setForumMembers] = useState<Array<{
    id: string;
    username: string | null;
    first_name: string;
    last_name: string;
  }>>([]);
  const [recentPosts, setRecentPosts] = useState<Array<{
    id: string;
    title: string | null;
    topic_id: string;
    created_at: string;
    user_id: string;
    username?: string;
  }>>([]);

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
    const checkMembershipAndCodeOfConduct = async () => {
      if (!user) {
        setHasMembership(false);
        setHasAgreedToCodeOfConduct(false);
        setIsModerator(false);
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

        // Check code of conduct agreement
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('agreed_to_code_of_conduct')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error checking code of conduct:', profileError);
        } else {
          const agreed = profileData?.agreed_to_code_of_conduct === true;
          setHasAgreedToCodeOfConduct(agreed);
          if (!agreed && subData && subData.length > 0) {
            setShowCodeOfConduct(true);
          }
        }

        // Check if user is a moderator
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['moderator', 'admin'])
          .limit(1);

        if (!roleError && roleData && roleData.length > 0) {
          setIsModerator(true);
          // Fetch forum members for moderator actions
          fetchForumMembers(user.id);
        } else {
          setIsModerator(false);
        }
      } catch (err) {
        console.error('Check failed:', err);
        setHasMembership(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMembershipAndCodeOfConduct();
  }, [user]);

  const fetchForumMembers = async (currentUserId: string) => {
    try {
      // Get all active family members
      const { data: subscriptions, error: subError } = await supabase
        .from('provider_subscriptions')
        .select('user_id')
        .is('provider_submission_id', null)
        .eq('status', 'active');

      if (subError) throw subError;

      if (!subscriptions || subscriptions.length === 0) {
        setForumMembers([]);
        return;
      }

      const userIds = [...new Set(subscriptions.map(s => s.user_id))].filter(id => id !== currentUserId);

      if (userIds.length === 0) {
        setForumMembers([]);
        return;
      }

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, first_name, last_name')
        .in('id', userIds);

      if (profileError) throw profileError;

      setForumMembers(profiles || []);
    } catch (error) {
      console.error("Error fetching forum members:", error);
    }
  };

  // Fetch recent posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      if (!hasMembership) return;
      
      try {
        const { data: posts, error } = await supabase
          .from('forum_posts')
          .select('id, title, topic_id, created_at, user_id')
          .is('parent_post_id', null)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        if (posts && posts.length > 0) {
          // Get usernames for the posts
          const userIds = [...new Set(posts.map(p => p.user_id))];
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username, first_name')
            .in('id', userIds);

          const postsWithUsernames = posts.map(post => ({
            ...post,
            username: profiles?.find(p => p.id === post.user_id)?.username || 
                      profiles?.find(p => p.id === post.user_id)?.first_name || 
                      'Anonymous'
          }));

          setRecentPosts(postsWithUsernames);
        }
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    fetchRecentPosts();
  }, [hasMembership]);

  const handleAgreeToCodeOfConduct = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          agreed_to_code_of_conduct: true,
          code_of_conduct_agreed_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setHasAgreedToCodeOfConduct(true);
      setShowCodeOfConduct(false);
      toast.success("Welcome to the forum!");
    } catch (err) {
      console.error('Error updating code of conduct agreement:', err);
      toast.error("Failed to save agreement. Please try again.");
    }
  };

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
          <title>Family Discussion Forum | Sober Helpline</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <header className="border-b border-border/40 bg-background/95 backdrop-blur">
            <div className="container flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
              </Link>
              <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
                <Phone className="h-4 w-4" />
                (541) 241-5886
              </a>
            </div>
          </header>
          <main className="container py-12">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-2xl">Members Only Content</CardTitle>
                <CardDescription>
                  This content is exclusive to family support members.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Join our family support membership for just $10/month to connect with other families in our discussion forum.
                </p>
                <div className="flex flex-col gap-2">
                  <Link to="/family-membership">
                    <Button className="w-full">Become a Member</Button>
                  </Link>
                  <Link to="/family-support">
                    <Button variant="outline" className="w-full">Back to Family Support</Button>
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
        <title>Family Discussion Forum | Sober Helpline</title>
        <meta name="description" content="Connect with other families supporting loved ones through addiction. Share experiences, ask questions, and find community." />
      </Helmet>

      <CodeOfConductDialog 
        open={showCodeOfConduct} 
        onAgree={handleAgreeToCodeOfConduct} 
      />

      <ReportContentDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
      />

      <ModeratorActionsDialog
        open={showModeratorActions}
        onOpenChange={setShowModeratorActions}
        members={forumMembers}
      />

      {user && (
        <PrivateMessagesDialog
          open={showMessages}
          onOpenChange={setShowMessages}
          currentUserId={user.id}
        />
      )}

      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
            </Link>
            <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
              <Phone className="h-4 w-4" />
              (541) 241-5886
            </a>
          </div>
        </header>

        <main className="container py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <Link
              to="/family-support"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Family Support
            </Link>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
                    Family Discussion Forum
                  </h1>
                  <p className="text-muted-foreground">
                    Connect with other families who understand what you're going through.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2" onClick={() => setShowMessages(true)}>
                    <Mail className="h-4 w-4" />
                    Messages
                  </Button>
                  {isModerator && (
                    <Button variant="outline" className="gap-2" onClick={() => setShowModeratorActions(true)}>
                      <Shield className="h-4 w-4" />
                      Moderator Actions
                    </Button>
                  )}
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Post
                  </Button>
                </div>
              </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Forum Topics */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold text-logo-green mb-4">Forum Topics</h2>
                <div className="grid gap-4">
                  {forumTopics.map((topic) => (
                    <Link key={topic.id} to={`/family-forum/${topic.id}`}>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${topic.color} text-white`}>
                              {topic.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="font-semibold text-logo-green">{topic.title}</h3>
                                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Posts */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recent Posts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentPosts.length > 0 ? (
                      recentPosts.map((post) => (
                        <Link 
                          key={post.id} 
                          to={`/family-forum/${post.topic_id}`}
                          className="block border-b border-border last:border-0 pb-3 last:pb-0"
                        >
                          <h4 className="text-sm font-medium text-logo-green line-clamp-2 hover:underline">
                            {post.title || "Untitled Post"}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{post.username}</span>
                            <span>•</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No posts yet. Be the first to start a discussion!</p>
                    )}
                  </CardContent>
                </Card>

                {/* Forum Guidelines */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Community Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Be respectful and supportive</p>
                    <p>• Maintain confidentiality</p>
                    <p>• No medical advice - consult professionals</p>
                    <button 
                      onClick={() => setShowReportDialog(true)}
                      className="text-left text-destructive hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Flag className="h-3 w-3" />
                      Report concerning content
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
