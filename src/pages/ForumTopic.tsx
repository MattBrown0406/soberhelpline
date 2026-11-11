import { Helmet } from "react-helmet-async";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Archive, CalendarDays, Loader2, Mail, MessageCircle, Plus, Shield } from "lucide-react";
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
import { IconTile, MemberHero, MemberPage, Panel } from "@/components/member/MemberUI";

// Shared looks, written out in full so Tailwind keeps them.
const TEXT_LINK =
  "inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const FILTER_TAB =
  "min-h-11 rounded-full px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground";

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
      <MemberPage className="flex items-center justify-center px-4">
        <Helmet>
          <title>Conversation space not found | Sober Helpline Forum</title>
        </Helmet>
        <Card className="w-full max-w-md rounded-2xl border-border/70 shadow-sm shadow-slate-900/[0.04]">
          <CardContent className="p-6 text-center space-y-4">
            <IconTile icon={MessageCircle} tone="navy" size="lg" className="mx-auto" />
            <p className="font-semibold text-foreground">We couldn't find that part of the forum.</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The link may be old. Everything is still in the forum, in three spaces: {ACTIVE_TOPICS.map((t) => t.title).join(", ")}.
            </p>
            <Button asChild className="h-12 rounded-xl px-6 text-base">
              <Link to="/family-forum">Go to the forum</Link>
            </Button>
          </CardContent>
        </Card>
      </MemberPage>
    );
  }

  if (isLoading) {
    return (
      <MemberPage className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </MemberPage>
    );
  }

  if (!hasAccess || !user) {
    return (
      <>
        <Helmet>
          <title>{topic.title} | Sober Helpline Forum</title>
        </Helmet>
        <MemberPage>
          <main className="container px-4 py-12">
            <Card className="mx-auto max-w-md rounded-2xl border-border/70 shadow-sm shadow-slate-900/[0.04]">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Members only</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">The family forum is part of the family support membership.</p>
                <div className="flex flex-col gap-2">
                  <Button asChild className="h-12 w-full rounded-xl text-base">
                    <Link to="/family-membership">Become a member</Link>
                  </Button>
                  <Button asChild variant="outline" className="min-h-11 w-full rounded-xl">
                    <Link to="/family-forum">Back to the forum</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </MemberPage>
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

      <MemberPage>
        <main className="container mx-auto max-w-3xl px-4 py-6 sm:py-10">
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <Link to="/family-forum" className={TEXT_LINK}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to the forum
              </Link>
              <div className="flex flex-wrap gap-2">
                <MentionNotifications userId={user.id} />
                <Button variant="outline" size="sm" className="relative min-h-11 gap-2 rounded-xl bg-card" onClick={() => setMessagesOpen(true)}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
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
              </div>
            </div>

            <div className="mb-6 space-y-4">
              <MemberHero
                eyebrow="Family Forum"
                title={
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 print:hidden"
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="min-w-0 break-words">{topic.title}</span>
                  </span>
                }
                subtitle={topic.description}
              />

              {topic.archived ? (
                <Panel className="flex gap-3 text-sm">
                  <IconTile icon={Archive} className="bg-muted text-slate-600 dark:bg-muted dark:text-slate-300" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">This is an earlier discussion space.</p>
                    <p className="mt-1 leading-relaxed text-muted-foreground">
                      You can read and reply to these conversations. New conversations now happen in{" "}
                      {ACTIVE_TOPICS.map((t, i) => (
                        <span key={t.id}>
                          {i > 0 && (i === ACTIVE_TOPICS.length - 1 ? " and " : ", ")}
                          <Link
                            to={`/family-forum/${t.id}`}
                            className="rounded font-medium text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {t.title}
                          </Link>
                        </span>
                      ))}
                      .
                    </p>
                  </div>
                </Panel>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {!isMeetingTopic && (
                    <Button
                      onClick={() => openComposer()}
                      className="h-12 flex-1 gap-2 rounded-xl px-6 text-base shadow-md shadow-[#16294a]/15 sm:flex-none"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Start a conversation
                    </Button>
                  )}
                  <TopicFollow topicId={topic.id} userId={user.id} />
                </div>
              )}
              {canModerate && (
                <p className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <Shield className="h-3.5 w-3.5" aria-hidden="true" />
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
                <TabsList className="h-auto rounded-full border border-border/70 bg-card p-1 shadow-sm shadow-slate-900/[0.03]">
                  <TabsTrigger value="all" className={FILTER_TAB}>All</TabsTrigger>
                  <TabsTrigger value="unanswered" className={FILTER_TAB}>Unanswered{unansweredCount > 0 ? ` (${unansweredCount})` : ""}</TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {!postsLoaded ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : visibleThreads.length === 0 ? (
              <Panel className="text-center">
                <div className="space-y-4 py-4">
                  <IconTile icon={MessageCircle} tone="navy" size="lg" className="mx-auto" />
                  <p className="text-base leading-relaxed text-foreground/80">
                    {filter === "unanswered"
                      ? "Every conversation here has a reply."
                      : isMeetingTopic
                        ? "No questions for Monday yet. Yours could be the first."
                        : topic.archived
                          ? "There are no conversations in this space."
                          : "No conversations yet. You could start one."}
                  </p>
                  {!topic.archived && filter === "all" && (
                    <Button onClick={() => openComposer()} className="h-12 rounded-xl px-6 text-base">
                      <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                      {isMeetingTopic ? "Ask a question" : "Start a conversation"}
                    </Button>
                  )}
                </div>
              </Panel>
            ) : (
              <div className="space-y-8">
                {groups.map((group) => (
                  <section key={group.key} aria-label={group.label ?? undefined} className="space-y-4">
                    {group.label ? (
                      <h2 className="flex items-center gap-2.5 text-lg font-semibold leading-snug text-foreground">
                        <IconTile icon={CalendarDays} tone="navy" size="sm" />
                        {group.label}
                      </h2>
                    ) : (
                      <h2 className="sr-only">Conversations</h2>
                    )}
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
      </MemberPage>
    </>
  );
}
