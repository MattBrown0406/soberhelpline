import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Archive,
  ChevronDown,
  ChevronRight,
  EyeOff,
  Flag,
  Heart,
  HeartHandshake,
  HelpCircle,
  Loader2,
  Lock,
  Mail,
  MessagesSquare,
  Plus,
  Search,
  Settings,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  IconTile,
  KindPill,
  MemberHero,
  MemberPage,
  Panel,
  SectionHeading,
  TONE,
  type Tone,
} from "@/components/member/MemberUI";

// One colour per active space, so each room is recognisable at a glance.
// Earlier (archived) spaces stay neutral.
const SPACE_TONES: Record<string, Tone> = {
  "this-weeks-meeting": "navy",
  "ask-community": "amber",
  introductions: "rose",
};

// Shared looks, written out in full so Tailwind keeps them.
const TEXT_LINK =
  "inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const TOOL_BUTTON = "relative min-h-11 gap-2 rounded-xl bg-card";
const NAV_PILL =
  "inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm shadow-slate-900/[0.03] transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

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
  const tone = SPACE_TONES[topic.id];
  return (
    <Link
      to={`/family-forum/${topic.id}`}
      className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm shadow-slate-900/[0.04] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none"
    >
      {tone && <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 print:hidden ${TONE[tone].bar}`} />}
      {tone ? (
        <IconTile icon={Icon} tone={tone} size="lg" />
      ) : (
        <IconTile icon={Icon} className="bg-muted text-slate-600 dark:bg-muted dark:text-slate-300" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="break-words text-lg font-semibold leading-snug text-foreground">{topic.title}</h3>
          <ChevronRight
            className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{topic.description}</p>
        <div className="mt-3 flex min-h-[1.5rem] flex-wrap items-center gap-x-2 gap-y-1">
          {loading ? (
            <span className="text-xs text-muted-foreground">…</span>
          ) : stat && stat.threads > 0 ? (
            <>
              <KindPill tone={tone ?? "navy"}>
                {stat.threads} {stat.threads === 1 ? "conversation" : "conversations"}
              </KindPill>
              {stat.lastActive && (
                <span className="text-xs text-muted-foreground">Last activity {relativeTime(stat.lastActive)}</span>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground">No conversations yet</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function PostSummaryList({ items, empty }: { items: PostSummary[]; empty: string }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="-mx-2 divide-y divide-border/70">
      {items.map((post) => (
        <li key={post.id}>
          <Link
            to={forumPostLink(post.topic_id, post.id)}
            className="group flex min-h-11 items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="min-w-0 flex-1">
              <h3 className="line-clamp-2 break-words text-sm font-semibold leading-snug text-foreground group-hover:underline">
                {post.title || post.excerpt || "Untitled post"}
              </h3>
              <span className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                <span>{post.author}</span>
                <span aria-hidden="true">•</span>
                <span>{getForumTopic(post.topic_id)?.title ?? "Forum"}</span>
                <span aria-hidden="true">•</span>
                <span>{relativeTime(post.created_at)}</span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
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
      <MemberPage className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </MemberPage>
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
        <MemberPage>
          <main className="container px-4 py-12">
            <Card className="mx-auto max-w-md rounded-2xl border-border/70 shadow-sm shadow-slate-900/[0.04]">
              <CardHeader className="text-center">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                <CardTitle className="text-2xl">Members only</CardTitle>
                <CardDescription>The family forum is part of the family support membership.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Join the family support membership for $9.99/month to talk with other families in the forum.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild className="h-12 w-full rounded-xl text-base">
                    <Link to="/family-membership">Become a member</Link>
                  </Button>
                  <Button asChild variant="outline" className="min-h-11 w-full rounded-xl">
                    <Link to="/family-support">Back to Family Support</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </MemberPage>
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

      <MemberPage>
        <main className="container mx-auto max-w-5xl space-y-8 px-4 py-6 sm:py-10">
          <div className="space-y-3">
            <Link to="/family-support" className={TEXT_LINK}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Family Support
            </Link>

            <MemberHero
              eyebrow="Family Forum"
              title="Family Discussion Forum"
              subtitle="Talk with other families who understand what you're going through."
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              className="h-12 gap-2 rounded-xl px-6 text-base shadow-md shadow-[#16294a]/15"
              onClick={() => setShowNewPostDialog(true)}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Start a conversation
            </Button>
            <div className="flex flex-wrap gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
              <BookmarkedPosts userId={user.id} />
              <MentionNotifications userId={user.id} />
              <Button variant="outline" size="sm" className={TOOL_BUTTON} onClick={() => setShowMessages(true)}>
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
              {isModerator && (
                <Button variant="outline" size="sm" className={TOOL_BUTTON} onClick={() => setShowModeratorActions(true)}>
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  Moderator actions
                </Button>
              )}
            </div>
            <Link to="/member-home#email-settings" className={`${TEXT_LINK} sm:ml-auto`}>
              <Settings className="h-4 w-4" aria-hidden="true" />
              Email settings
            </Link>
          </div>

          {/* The banner brings its own bottom margin; the wrapper cancels it and vanishes when there is no banner. */}
          <div className="empty:hidden [&>div]:mb-0">
            <MemberZoomBanner />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DailyPrompt />
            <Panel>
              <h2 className="flex items-center gap-2.5 text-lg font-semibold leading-snug text-foreground">
                <IconTile icon={Search} tone="navy" size="sm" />
                Search the forum
              </h2>
              <div className="mt-4">
                <ForumSearch />
              </div>
            </Panel>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <section aria-labelledby="forum-spaces-heading" className="space-y-4">
                <SectionHeading id="forum-spaces-heading" title="Where to post" />

                {statsLoaded && totalThreads === 0 && (
                  <div className="rounded-2xl border-2 border-dashed border-[#16294a]/25 bg-card p-6 text-center dark:border-sky-400/25">
                    <IconTile icon={Users} tone="navy" size="lg" className="mx-auto mb-3" />
                    <p className="mb-1 font-semibold text-foreground">Be the first to post</p>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      Introduce yourself or share where you are right now. You can post anonymously.
                    </p>
                    <Button className="min-h-11 rounded-xl px-5" onClick={() => setShowNewPostDialog(true)}>
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

              <Panel>
                <SectionHeading
                  icon={HelpCircle}
                  tone="navy"
                  title="Waiting for a reply"
                  description="Questions nobody has answered yet. A few words from you could help."
                />
                <div className="mt-3">
                  <PostSummaryList
                    items={unanswered}
                    empty={statsLoaded ? "Every recent question has a reply." : "Loading…"}
                  />
                </div>
              </Panel>

              {archivedWithPosts.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="group min-h-11 w-full justify-between rounded-xl px-3 hover:bg-card">
                      <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Archive className="h-4 w-4" aria-hidden="true" />
                        Earlier discussions ({archivedWithPosts.length})
                      </span>
                      <ChevronDown
                        className="h-4 w-4 text-slate-600 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none dark:text-slate-300"
                        aria-hidden="true"
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 pt-3">
                    <p className="px-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
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

              <Panel>
                <SectionHeading icon={MessagesSquare} tone="navy" title="Recent conversations" />
                <div className="mt-3">
                  <PostSummaryList items={recentPosts} empty={statsLoaded ? "No conversations yet." : "Loading…"} />
                </div>
              </Panel>

              <Panel tone="navy" className="overflow-hidden p-0 sm:p-0">
                <section
                  aria-labelledby="forum-guidelines-heading"
                  className="bg-[#16294a]/[0.05] p-5 dark:bg-sky-400/[0.07] sm:p-6 print:bg-transparent print:p-0"
                >
                  <div className="flex items-center gap-3">
                    <IconTile icon={HeartHandshake} tone="navy" />
                    <h2 id="forum-guidelines-heading" className="text-lg font-semibold leading-snug text-foreground">
                      Community guidelines
                    </h2>
                  </div>
                  <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-foreground/80">
                    <li className="flex gap-2.5">
                      <Heart className="mt-0.5 h-4 w-4 shrink-0 text-[#16294a] dark:text-sky-200" aria-hidden="true" />
                      <span>Be kind. Everyone here is carrying something.</span>
                    </li>
                    <li className="flex gap-2.5">
                      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#16294a] dark:text-sky-200" aria-hidden="true" />
                      <span>What's shared here stays here.</span>
                    </li>
                    <li className="flex gap-2.5">
                      <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-[#16294a] dark:text-sky-200" aria-hidden="true" />
                      <span>No medical advice. Talk to a professional for that.</span>
                    </li>
                  </ul>
                  <p className="mt-4 flex gap-2.5 rounded-xl border border-border/70 bg-card p-3 text-sm leading-relaxed text-foreground/80">
                    <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-[#16294a] dark:text-sky-200" aria-hidden="true" />
                    <span>
                      Other members only ever see your username, or "Anonymous member" if you post anonymously.
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowReportDialog(true)}
                    className="mt-2 inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg text-left text-sm font-medium text-red-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-red-300"
                  >
                    <Flag className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Report something concerning
                  </button>
                </section>
              </Panel>
            </div>
          </div>

          <nav aria-label="More family support" className="flex flex-wrap gap-2 border-t border-border/70 pt-6">
            {[
              { to: "/family-education", label: "Education" },
              { to: "/family-webinars", label: "Webinars" },
              { to: "/family-coaching", label: "Coaching" },
              { to: "/monday-zoom-registration", label: "Family Squares" },
              { to: "/zoom-recordings", label: "Past Recordings" },
              { to: "/sibling-support", label: "Sibling Support" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className={NAV_PILL}>
                {link.label}
              </Link>
            ))}
          </nav>
        </main>
      </MemberPage>
    </>
  );
}
