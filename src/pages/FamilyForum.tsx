import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Archive,
  ChevronDown,
  ChevronRight,
  Flag,
  HelpCircle,
  Loader2,
  Lock,
  Mail,
  Plus,
  Search,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { CodeOfConductDialog } from "@/components/forum/CodeOfConductDialog";
import { ReportContentDialog } from "@/components/forum/ReportContentDialog";
import { ModeratorActionsDialog } from "@/components/forum/ModeratorActionsDialog";
import { PrivateMessagesDialog, useUnreadMessageCount } from "@/components/forum/PrivateMessagesDialog";
import { NewPostDialog } from "@/components/forum/NewPostDialog";
import { ForumSearch } from "@/components/forum/ForumSearch";
import { DailyPrompt } from "@/components/forum/DailyPrompt";
import { BookmarkedPosts } from "@/components/forum/BookmarkedPosts";
import { MemberSpotlight } from "@/components/forum/MemberSpotlight";
import { MentionNotifications } from "@/components/forum/MentionNotifications";
import { fetchUsernames } from "@/lib/publicProfiles";
import {
  ACTIVE_TOPICS,
  ACTIVE_TOPIC_IDS,
  ALL_TOPICS,
  ARCHIVED_TOPICS,
  forumDisplayName,
  forumPostLink,
  getForumTopic,
  type ForumTopicDef,
} from "@/lib/forumTopics";
import MemberZoomBanner from "@/components/MemberZoomBanner";

function relativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "a month ago" : `${months} months ago`;
}

interface TopicStat {
  threads: number;
  lastActive: string | null;
}

interface PostSummary {
  id: string;
  title: string | null;
  excerpt: string;
  topic_id: string;
  created_at: string;
  author: string;
}

interface SummaryRow {
  id: string | null;
  title: string | null;
  content: string | null;
  topic_id: string | null;
  created_at: string | null;
  user_id: string | null;
  is_anonymous: boolean | null;
}

async function toSummaries(rows: SummaryRow[]): Promise<PostSummary[]> {
  const valid = rows.filter((r) => r.id && r.topic_id && r.created_at);
  const names = await fetchUsernames(valid.filter((r) => !r.is_anonymous).map((r) => r.user_id)).catch(
    () => new Map<string, string | null>(),
  );
  return valid.map((r) => {
    const text = (r.content || "").replace(/\s+/g, " ").trim();
    return {
      id: r.id as string,
      title: r.title,
      excerpt: text.length > 90 ? `${text.slice(0, 90)}…` : text,
      topic_id: r.topic_id as string,
      created_at: r.created_at as string,
      author: forumDisplayName(r.user_id ? names.get(r.user_id) : null, !!r.is_anonymous),
    };
  });
}

function TopicCard({ topic, stat, loading }: { topic: ForumTopicDef; stat?: TopicStat; loading: boolean }) {
  const Icon = topic.icon;
  return (
    <Link to={`/family-forum/${topic.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg shrink-0 ${topic.tileClass}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-logo-blue">{topic.title}</h3>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2 min-h-[1.5rem]">
                {loading ? (
                  <span className="text-xs text-muted-foreground">…</span>
                ) : stat && stat.threads > 0 ? (
                  <>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {stat.threads} {stat.threads === 1 ? "conversation" : "conversations"}
                    </Badge>
                    {stat.lastActive && (
                      <span className="text-xs text-muted-foreground">Last activity {relativeTime(stat.lastActive)}</span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">No conversations yet</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function PostSummaryList({ items, empty }: { items: PostSummary[]; empty: string }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="space-y-3">
      {items.map((post) => (
        <Link
          key={post.id}
          to={forumPostLink(post.topic_id, post.id)}
          className="block border-b border-border last:border-0 pb-3 last:pb-0 group"
        >
          <h4 className="text-sm font-medium text-logo-blue line-clamp-2 group-hover:underline break-words">
            {post.title || post.excerpt || "Untitled post"}
          </h4>
          <div className="flex flex-wrap items-center gap-x-2 mt-1 text-xs text-muted-foreground">
            <span>{post.author}</span>
            <span aria-hidden="true">•</span>
            <span>{getForumTopic(post.topic_id)?.title ?? "Forum"}</span>
            <span aria-hidden="true">•</span>
            <span>{relativeTime(post.created_at)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function FamilyForum() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [showCodeOfConduct, setShowCodeOfConduct] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [showModeratorActions, setShowModeratorActions] = useState(false);
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [recentPosts, setRecentPosts] = useState<PostSummary[]>([]);
  const [unanswered, setUnanswered] = useState<PostSummary[]>([]);
  const [topicStats, setTopicStats] = useState<Record<string, TopicStat>>({});
  const [statsLoaded, setStatsLoaded] = useState(false);
  const unread = useUnreadMessageCount(hasAccess ? user?.id : null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    let cancelled = false;
    (async () => {
      if (!user) {
        setHasAccess(false);
        setIsModerator(false);
        setIsLoading(false);
        return;
      }
      try {
        const [memberRes, profileRes, rolesRes] = await Promise.all([
          supabase.rpc("is_active_family_member", { _user_id: user.id }),
          supabase.from("profiles").select("agreed_to_code_of_conduct").eq("id", user.id).maybeSingle(),
          supabase.from("user_roles").select("role").eq("user_id", user.id).in("role", ["moderator", "admin"]).limit(1),
        ]);
        if (cancelled) return;
        if (memberRes.error) console.error("Error checking membership:", memberRes.error);
        const staff = !rolesRes.error && (rolesRes.data?.length ?? 0) > 0;
        const access = memberRes.data === true || staff;
        setIsModerator(staff);
        setHasAccess(access);
        if (!profileRes.error && access && profileRes.data?.agreed_to_code_of_conduct !== true) {
          setShowCodeOfConduct(true);
        }
      } catch (err) {
        console.error("Check failed:", err);
        setHasAccess(false);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authChecked]);

  const loadOverview = useCallback(async () => {
    // Thread counts (top-level posts only) and last activity per space, using
    // head/count queries instead of downloading every post.
    const statEntries = await Promise.all(
      ALL_TOPICS.map(async (topic) => {
        const [countRes, lastRes] = await Promise.all([
          supabase
            .from("forum_posts_secure")
            .select("id", { count: "exact", head: true })
            .eq("topic_id", topic.id)
            .is("parent_post_id", null),
          supabase
            .from("forum_posts_secure")
            .select("created_at")
            .eq("topic_id", topic.id)
            .order("created_at", { ascending: false })
            .limit(1),
        ]);
        return [
          topic.id,
          { threads: countRes.count ?? 0, lastActive: lastRes.data?.[0]?.created_at ?? null },
        ] as const;
      }),
    );
    setTopicStats(Object.fromEntries(statEntries));
    setStatsLoaded(true);

    const columns = "id, title, content, topic_id, created_at, user_id, is_anonymous";
    const [recentRes, candidatesRes] = await Promise.all([
      supabase
        .from("forum_posts_secure")
        .select(columns)
        .is("parent_post_id", null)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("forum_posts_secure")
        .select(columns)
        .is("parent_post_id", null)
        .in("topic_id", ACTIVE_TOPIC_IDS)
        .order("created_at", { ascending: false })
        .limit(40),
    ]);
    setRecentPosts(await toSummaries((recentRes.data as SummaryRow[]) || []));

    const candidates = ((candidatesRes.data as SummaryRow[]) || []).filter((r) => r.id);
    if (candidates.length > 0) {
      const { data: replyRows } = await supabase
        .from("forum_posts_secure")
        .select("parent_post_id")
        .in("parent_post_id", candidates.map((c) => c.id as string));
      const answered = new Set((replyRows || []).map((r) => r.parent_post_id));
      setUnanswered(await toSummaries(candidates.filter((c) => !answered.has(c.id)).slice(0, 5)));
    } else {
      setUnanswered([]);
    }
  }, []);

  useEffect(() => {
    if (!hasAccess) return;
    loadOverview().catch((error) => console.error("Error loading forum overview:", error));
  }, [hasAccess, loadOverview]);

  const handleAgreeToCodeOfConduct = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ agreed_to_code_of_conduct: true, code_of_conduct_agreed_at: new Date().toISOString() })
        .eq("id", user.id)
        .select("agreed_to_code_of_conduct")
        .single();
      if (error) throw error;
      if (!data?.agreed_to_code_of_conduct) throw new Error("Update did not apply");
      setShowCodeOfConduct(false);
      toast.success("Welcome to the forum.");
    } catch (err) {
      console.error("Error updating code of conduct agreement:", err);
      toast.error("We couldn't save that. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess || !user) {
    return (
      <>
        <SEOHead
          title="Family Discussion Forum | Sober Helpline"
          description="Connect with other families supporting loved ones through addiction. Share experiences, ask questions, and find community in our members-only forum."
          noIndex={true}
        />
        <div className="min-h-screen bg-background">
          <main className="container py-12">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-2xl">Members only</CardTitle>
                <CardDescription>The family forum is part of the family support membership.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Join the family support membership for $9.99/month to talk with other families in the forum.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link to="/family-membership">Become a member</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/family-support">Back to Family Support</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  const totalThreads = Object.values(topicStats).reduce((sum, s) => sum + s.threads, 0);
  const archivedWithPosts = ARCHIVED_TOPICS.filter((t) => (topicStats[t.id]?.threads ?? 0) > 0);

  return (
    <>
      <SEOHead
        title="Family Discussion Forum | Sober Helpline"
        description="Connect with other families supporting loved ones through addiction. Share experiences, ask questions, and find community in our members-only forum."
        noIndex={true}
      />

      <CodeOfConductDialog open={showCodeOfConduct} onAgree={handleAgreeToCodeOfConduct} />
      <ReportContentDialog open={showReportDialog} onOpenChange={setShowReportDialog} />
      {isModerator && <ModeratorActionsDialog open={showModeratorActions} onOpenChange={setShowModeratorActions} />}
      <PrivateMessagesDialog
        open={showMessages}
        onOpenChange={(open) => {
          setShowMessages(open);
          if (!open) void unread.refresh();
        }}
        currentUserId={user.id}
        onMessagesChanged={() => void unread.refresh()}
      />
      <NewPostDialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog} />

      <div className="min-h-screen bg-background">
        <main className="container px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-3 mb-6">
              <Link to="/family-support" className="inline-flex items-center text-primary hover:text-primary/80 w-fit">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Family Support
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { to: "/family-education", label: "Education" },
                  { to: "/family-webinars", label: "Webinars" },
                  { to: "/family-coaching", label: "Coaching" },
                  { to: "/monday-zoom-registration", label: "Monday Zoom" },
                  { to: "/zoom-recordings", label: "Past Recordings" },
                  { to: "/sibling-support", label: "Sibling Support" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <MemberZoomBanner />

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-2">Family Discussion Forum</h1>
                <p className="text-muted-foreground">Talk with other families who understand what you're going through.</p>
                <Link
                  to="/member-home#email-settings"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground underline mt-2"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Email settings
                </Link>
              </div>
              <div className="flex gap-2 flex-wrap">
                <BookmarkedPosts userId={user.id} />
                <MentionNotifications userId={user.id} />
                <Button variant="outline" size="sm" className="gap-2 relative" onClick={() => setShowMessages(true)}>
                  <Mail className="h-4 w-4" />
                  Messages
                  {unread.count > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 rounded-full bg-red-600 text-white text-xs flex items-center justify-center"
                      aria-label={`${unread.count} unread`}
                    >
                      {unread.count > 9 ? "9+" : unread.count}
                    </span>
                  )}
                </Button>
                {isModerator && (
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowModeratorActions(true)}>
                    <Shield className="h-4 w-4" />
                    Moderator actions
                  </Button>
                )}
                <Button size="sm" className="gap-2" onClick={() => setShowNewPostDialog(true)}>
                  <Plus className="h-4 w-4" />
                  Start a conversation
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <DailyPrompt />
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search the forum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ForumSearch />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-logo-blue">Where to post</h2>

                  {statsLoaded && totalThreads === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
                      <Users className="h-10 w-10 text-primary/50 mx-auto mb-3" />
                      <p className="font-semibold text-foreground mb-1">Be the first to post</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Introduce yourself or share where you are right now. You can post anonymously.
                      </p>
                      <Button size="sm" onClick={() => setShowNewPostDialog(true)}>
                        Start a conversation
                      </Button>
                    </div>
                  )}

                  <div className="grid gap-4">
                    {ACTIVE_TOPICS.map((topic) => (
                      <TopicCard key={topic.id} topic={topic} stat={topicStats[topic.id]} loading={!statsLoaded} />
                    ))}
                  </div>
                </section>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Waiting for a reply
                    </CardTitle>
                    <CardDescription>Questions nobody has answered yet. A few words from you could help.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PostSummaryList
                      items={unanswered}
                      empty={statsLoaded ? "Every recent question has a reply." : "Loading…"}
                    />
                  </CardContent>
                </Card>

                {archivedWithPosts.length > 0 && (
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between px-3 group">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Archive className="h-4 w-4" />
                          Earlier discussions ({archivedWithPosts.length})
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-3 space-y-3">
                      <p className="text-sm text-muted-foreground px-1">
                        These older spaces are kept so you can read past conversations and reply to them. New conversations go in
                        the spaces above.
                      </p>
                      {archivedWithPosts.map((topic) => (
                        <TopicCard key={topic.id} topic={topic} stat={topicStats[topic.id]} loading={false} />
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>

              <div className="space-y-6">
                <MemberSpotlight />

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recent conversations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PostSummaryList items={recentPosts} empty={statsLoaded ? "No conversations yet." : "Loading…"} />
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Community guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>• Be kind. Everyone here is carrying something.</p>
                    <p>• What's shared here stays here.</p>
                    <p>• No medical advice. Talk to a professional for that.</p>
                    <p>• Other members only ever see your username, or "Anonymous member" if you post anonymously.</p>
                    <button
                      type="button"
                      onClick={() => setShowReportDialog(true)}
                      className="text-left text-destructive hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Flag className="h-3 w-3" />
                      Report something concerning
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
