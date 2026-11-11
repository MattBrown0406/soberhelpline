import { Helmet } from "react-helmet-async";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Archive, Loader2, Mail, MessageCircle, Plus, Shield } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { supabase } from "@/integrations/supabase/client";
import { untypedSupabase } from "@/integrations/supabase/untyped";
import { fetchUsernames, type ForumMemberMatch } from "@/lib/publicProfiles";
import { ACTIVE_TOPICS, MEETING_TOPIC_ID, getForumTopic, sanitizeRefPath } from "@/lib/forumTopics";
import { TopicFollow } from "@/components/forum/TopicFollow";
import { MentionNotifications } from "@/components/forum/MentionNotifications";
import { PrivateMessagesDialog, useUnreadMessageCount } from "@/components/forum/PrivateMessagesDialog";
import { ModeratorActionsDialog } from "@/components/forum/ModeratorActionsDialog";
import { ForumComposer } from "@/components/forum/ForumComposer";
import { ForumThread, type ForumViewer } from "@/components/forum/ForumThread";
import { MeetingRoom } from "@/components/forum/MeetingRoom";
import { formatMeetingDay, meetingWeekKey } from "@/components/forum/meetingWeek";
import { useVisiblePolling } from "@/components/forum/useVisiblePolling";
import { FORUM_POST_COLUMNS, type ForumPostRow, type ForumThreadData } from "@/components/forum/forumTypes";

type Filter = "all" | "unanswered";

export default function ForumTopic() {
  const { topicId = "" } = useParams<{ topicId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const topic = getForumTopic(topicId);
  const isMeetingTopic = topicId === MEETING_TOPIC_ID;

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [canModerate, setCanModerate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [posts, setPosts] = useState<ForumPostRow[]>([]);
  const [names, setNames] = useState<Map<string, string | null>>(new Map());
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  const [composer, setComposer] = useState<{ open: boolean; title: string; ref: string | null; key: number }>({
    open: false,
    title: "",
    ref: null,
    key: 0,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ post: ForumPostRow; replyCount: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
  const handledPermalink = useRef<string | null>(null);

  const [messagesOpen, setMessagesOpen] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<ForumMemberMatch | null>(null);
  const [moderatePreset, setModeratePreset] = useState<{ member: ForumMemberMatch; postContent?: string } | null>(null);
  const [moderateOpen, setModerateOpen] = useState(false);
  const unread = useUnreadMessageCount(user?.id);

  // --- auth & access -------------------------------------------------------
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
        setIsLoading(false);
        return;
      }
      try {
        const [memberRes, rolesRes] = await Promise.all([
          supabase.rpc("is_active_family_member", { _user_id: user.id }),
          supabase.from("user_roles").select("role").eq("user_id", user.id).in("role", ["moderator", "admin"]),
        ]);
        if (cancelled) return;
        const roles = (rolesRes.data || []).map((r) => r.role as string);
        const staff = roles.length > 0;
        setCanModerate(staff);
        setIsAdmin(roles.includes("admin"));
        setHasAccess(memberRes.data === true || staff);
      } catch (err) {
        console.error("Access check failed:", err);
        setHasAccess(false);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authChecked]);

  // --- posts ---------------------------------------------------------------
  const fetchPosts = useCallback(async () => {
    if (!topic) return;
    try {
      const { data, error } = await untypedSupabase
        .from("forum_posts_secure")
        .select(FORUM_POST_COLUMNS)
        .eq("topic_id", topic.id)
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      const rows = ((data as ForumPostRow[]) || []).filter((p) => !!p.id);
      const ids = rows.filter((p) => !p.is_anonymous && p.user_id).map((p) => p.user_id as string);
      const usernameMap = await fetchUsernames(ids).catch(() => new Map<string, string | null>());
      setPosts(rows);
      setNames(usernameMap);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Couldn't load posts. Please refresh the page.");
    } finally {
      setPostsLoaded(true);
    }
  }, [topic]);

  useEffect(() => {
    setPostsLoaded(false);
    setPosts([]);
    if (hasAccess && topic) void fetchPosts();
  }, [hasAccess, topic, fetchPosts]);

  // No realtime (it could carry author ids): poll every 30 seconds while visible.
  useVisiblePolling(fetchPosts, 30_000, hasAccess && !!topic);

  const threads: ForumThreadData[] = useMemo(() => {
    const replies = new Map<string, ForumPostRow[]>();
    for (const p of posts) {
      if (p.parent_post_id) {
        const list = replies.get(p.parent_post_id) ?? [];
        list.push(p);
        replies.set(p.parent_post_id, list);
      }
    }
    return posts
      .filter((p) => !p.parent_post_id)
      .map((p) => ({
        ...p,
        replies: (replies.get(p.id) ?? []).sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        ),
      }))
      .sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [posts]);

  const visibleThreads = useMemo(
    () => (filter === "unanswered" ? threads.filter((t) => t.replies.length === 0) : threads),
    [threads, filter],
  );
  const unansweredCount = useMemo(() => threads.filter((t) => t.replies.length === 0).length, [threads]);

  const groups = useMemo(() => {
    if (!isMeetingTopic) return [{ key: "all", label: null as string | null, threads: visibleThreads }];
    const map = new Map<string, ForumThreadData[]>();
    for (const t of visibleThreads) {
      const key = meetingWeekKey(t.created_at);
      const list = map.get(key) ?? [];
      list.push(t);
      map.set(key, list);
    }
    return [...map.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([key, list]) => ({
        key,
        label: `For ${formatMeetingDay(key)}`,
        threads: list.sort((a, b) => {
          if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }),
      }));
  }, [visibleThreads, isMeetingTopic]);

  // --- deep links: ?compose=1&title=&ref=  and  ?post=<id> ------------------
  useEffect(() => {
    if (!hasAccess || !topic || searchParams.get("compose") !== "1") return;
    if (!topic.archived) {
      setComposer((c) => ({
        open: true,
        title: (searchParams.get("title") || "").slice(0, 200),
        ref: sanitizeRefPath(searchParams.get("ref")),
        key: c.key + 1,
      }));
      window.setTimeout(() => document.getElementById("forum-composer")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
    const next = new URLSearchParams(searchParams);
    next.delete("compose");
    next.delete("title");
    next.delete("ref");
    setSearchParams(next, { replace: true });
  }, [hasAccess, topic, searchParams, setSearchParams]);

  const permalinkId = searchParams.get("post");
  useEffect(() => {
    if (!permalinkId || !postsLoaded || handledPermalink.current === permalinkId) return;
    handledPermalink.current = permalinkId;
    const target = posts.find((p) => p.id === permalinkId);
    if (!target) {
      toast.info("That post isn't here any more. It may have been removed.");
      return;
    }
    const threadId = target.parent_post_id ?? target.id;
    setFilter("all");
    setExpandedThreadId(threadId);
    setHighlightId(threadId);
    window.setTimeout(() => {
      const el = document.getElementById(`post-${target.id}`) ?? document.getElementById(`post-${threadId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
    window.setTimeout(() => setHighlightId((h) => (h === threadId ? null : h)), 3500);
  }, [permalinkId, postsLoaded, posts]);

  const openComposer = (title = "") => {
    setComposer((c) => ({ open: true, title, ref: null, key: c.key + 1 }));
    window.setTimeout(() => document.getElementById("forum-composer")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      const { data: removed, error } = await supabase
        .from("forum_posts")
        .delete()
        .eq("id", deleteConfirm.post.id)
        .select("id");
      if (error) throw error;
      // Nothing removed (not hers, or membership lapsed) is not a success.
      if (!removed || removed.length === 0) throw new Error("Nothing was deleted");
      toast.success("Deleted");
      setDeleteConfirm(null);
      void fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Couldn't delete that. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- render --------------------------------------------------------------
  if (!topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Helmet>
          <title>Conversation space not found | Sober Helpline Forum</title>
        </Helmet>
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="font-medium">We couldn't find that part of the forum.</p>
            <p className="text-sm text-muted-foreground">
              The link may be old. Everything is still in the forum, in three spaces: {ACTIVE_TOPICS.map((t) => t.title).join(", ")}.
            </p>
            <Button asChild>
              <Link to="/family-forum">Go to the forum</Link>
            </Button>
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

  if (!hasAccess || !user) {
    return (
      <>
        <Helmet>
          <title>{topic.title} | Sober Helpline Forum</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <main className="container py-12">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Members only</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">The family forum is part of the family support membership.</p>
                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link to="/family-membership">Become a member</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/family-forum">Back to the forum</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  const viewer: ForumViewer = { userId: user.id, canModerate, isAdmin };
  const Icon = topic.icon;

  return (
    <>
      <Helmet>
        <title>{topic.title} | Sober Helpline Forum</title>
        <meta name="description" content={topic.description} />
        <meta name="robots" content="noindex" />
      </Helmet>

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {deleteConfirm?.post.parent_post_id ? "reply" : "post"}?</AlertDialogTitle>
            <AlertDialogDescription>
              This can't be undone.
              {deleteConfirm && deleteConfirm.replyCount > 0 && (
                <span className="block mt-2 text-destructive">
                  The {deleteConfirm.replyCount} {deleteConfirm.replyCount === 1 ? "reply" : "replies"} under it will be deleted too.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PrivateMessagesDialog
        open={messagesOpen}
        onOpenChange={(open) => {
          setMessagesOpen(open);
          if (!open) {
            setMessageRecipient(null);
            void unread.refresh();
          }
        }}
        currentUserId={user.id}
        initialRecipient={messageRecipient}
        onMessagesChanged={() => void unread.refresh()}
      />

      {canModerate && (
        <ModeratorActionsDialog
          open={moderateOpen}
          onOpenChange={(open) => {
            setModerateOpen(open);
            if (!open) setModeratePreset(null);
          }}
          preset={moderatePreset}
        />
      )}

      <div className="min-h-screen bg-background">
        <main className="container px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <Link to="/family-forum" className="inline-flex items-center text-primary hover:text-primary/80">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to the forum
              </Link>
              <div className="flex flex-wrap gap-2">
                <MentionNotifications userId={user.id} />
                <Button variant="outline" size="sm" className="gap-2 relative" onClick={() => setMessagesOpen(true)}>
                  <Mail className="h-4 w-4" />
                  Messages
                  {unread.count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                      {unread.count > 9 ? "9+" : unread.count}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg shrink-0 ${topic.tileClass}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-logo-blue mb-2">{topic.title}</h1>
                  <p className="text-muted-foreground">{topic.description}</p>
                </div>
              </div>

              {topic.archived ? (
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm flex gap-3">
                  <Archive className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">This is an earlier discussion space.</p>
                    <p className="text-muted-foreground mt-1">
                      You can read and reply to these conversations. New conversations now happen in{" "}
                      {ACTIVE_TOPICS.map((t, i) => (
                        <span key={t.id}>
                          {i > 0 && (i === ACTIVE_TOPICS.length - 1 ? " and " : ", ")}
                          <Link to={`/family-forum/${t.id}`} className="text-primary underline">
                            {t.title}
                          </Link>
                        </span>
                      ))}
                      .
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <TopicFollow topicId={topic.id} userId={user.id} />
                  {!isMeetingTopic && (
                    <Button onClick={() => openComposer()} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Start a conversation
                    </Button>
                  )}
                </div>
              )}
              {canModerate && (
                <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  You're seeing moderator tools.
                </p>
              )}
            </div>

            {isMeetingTopic && <MeetingRoom onAsk={() => openComposer()} />}

            {composer.open && !topic.archived && (
              <div id="forum-composer" className="scroll-mt-24">
                <ForumComposer
                  key={composer.key}
                  userId={user.id}
                  topicId={topic.id}
                  heading={isMeetingTopic ? "Ask a question for Monday" : "Start a conversation"}
                  titlePlaceholder={isMeetingTopic ? "Your question in a few words" : "A short title (optional)"}
                  bodyPlaceholder={
                    isMeetingTopic
                      ? "Tell us what's going on, as much or as little as you like."
                      : "Share what's on your mind…"
                  }
                  initialTitle={composer.title}
                  refPath={composer.ref}
                  onPosted={(postId) => {
                    setComposer((c) => ({ ...c, open: false }));
                    void fetchPosts().then(() => {
                      setHighlightId(postId);
                      window.setTimeout(() => document.getElementById(`post-${postId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
                      window.setTimeout(() => setHighlightId((h) => (h === postId ? null : h)), 3500);
                    });
                  }}
                  onCancel={() => setComposer((c) => ({ ...c, open: false }))}
                />
              </div>
            )}

            {threads.length > 0 && (
              <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)} className="mb-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered{unansweredCount > 0 ? ` (${unansweredCount})` : ""}</TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {!postsLoaded ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : visibleThreads.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center space-y-4">
                  <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    {filter === "unanswered"
                      ? "Every conversation here has a reply."
                      : isMeetingTopic
                        ? "No questions for Monday yet. Yours could be the first."
                        : topic.archived
                          ? "There are no conversations in this space."
                          : "No conversations yet. You could start one."}
                  </p>
                  {!topic.archived && filter === "all" && (
                    <Button onClick={() => openComposer()}>
                      <Plus className="h-4 w-4 mr-2" />
                      {isMeetingTopic ? "Ask a question" : "Start a conversation"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {groups.map((group) => (
                  <section key={group.key} aria-label={group.label ?? undefined} className="space-y-4">
                    {group.label && <h2 className="text-lg font-semibold text-logo-blue">{group.label}</h2>}
                    {group.threads.map((thread) => (
                      <ForumThread
                        key={thread.id}
                        thread={thread}
                        topicId={topic.id}
                        isMeetingTopic={isMeetingTopic}
                        names={names}
                        viewer={viewer}
                        highlighted={highlightId === thread.id}
                        forceExpanded={expandedThreadId === thread.id}
                        canReply
                        onRefresh={() => void fetchPosts()}
                        onDelete={(post, replyCount) => setDeleteConfirm({ post, replyCount })}
                        onMessage={(member) => {
                          setMessageRecipient(member);
                          setMessagesOpen(true);
                        }}
                        onModerate={(preset) => {
                          setModeratePreset(preset);
                          setModerateOpen(true);
                        }}
                      />
                    ))}
                  </section>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
