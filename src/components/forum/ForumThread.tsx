import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BookmarkCheck,
  CheckCircle2,
  Clock,
  Link2,
  MessageCircle,
  Pin,
  Shield,
  ShieldAlert,
  Trash2,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { KindPill } from "@/components/member/MemberUI";
import { forumDisplayName, forumPostLink } from "@/lib/forumTopics";
import type { ForumMemberMatch } from "@/lib/publicProfiles";
import { ForumContent } from "./RichTextEditor";
import { MemberProfile } from "./MemberProfile";
import { PostReactions } from "./PostReactions";
import { PostBookmark } from "./PostBookmark";
import { PollDisplay } from "./PollDisplay";
import { ReplyComposer } from "./ForumComposer";
import { meetingWeekKey } from "./meetingWeek";
import type { ForumPostRow, ForumThreadData } from "./forumTypes";

export interface ForumViewer {
  userId: string;
  canModerate: boolean;
  isAdmin: boolean;
}

interface ForumThreadProps {
  thread: ForumThreadData;
  topicId: string;
  isMeetingTopic: boolean;
  names: Map<string, string | null>;
  viewer: ForumViewer;
  highlighted: boolean;
  forceExpanded: boolean;
  canReply: boolean;
  onRefresh: () => void;
  onDelete: (post: ForumPostRow, replyCount: number) => void;
  onMessage: (member: ForumMemberMatch) => void;
  onModerate: (preset: { member: ForumMemberMatch; postContent?: string }) => void;
}

const COLLAPSED_REPLY_COUNT = 3;

function timeAgo(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "";
  }
}

async function copyLink(topicId: string, postId: string) {
  const url = `${window.location.origin}${forumPostLink(topicId, postId)}`;
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  } catch {
    window.prompt("Copy this link:", url);
  }
}

function AuthorLine({
  post,
  names,
  viewer,
  isMeetingTopic,
  onMessage,
}: {
  post: ForumPostRow;
  names: Map<string, string | null>;
  viewer: ForumViewer;
  isMeetingTopic: boolean;
  onMessage: (member: ForumMemberMatch) => void;
}) {
  const anonymous = post.is_anonymous;
  const username = !anonymous && post.user_id ? names.get(post.user_id) ?? null : null;
  const display = forumDisplayName(username, anonymous);

  // The avatar is decoration only: the first letter of the username already
  // shown beside it, or a neutral icon when there is no username to show
  // ("Anonymous member" / "Member"). Nothing else about the author is used.
  const initial = username ? Array.from(username.trim())[0]?.toUpperCase() : undefined;
  const avatar = (
    <span
      aria-hidden="true"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
        initial
          ? "bg-[#16294a]/10 text-[#16294a] dark:bg-sky-400/15 dark:text-sky-200"
          : "bg-muted text-slate-600 dark:text-slate-300"
      }`}
    >
      {initial ?? <User className="h-4 w-4" />}
    </span>
  );

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-slate-600 dark:text-slate-400">
      {anonymous || !post.user_id ? (
        <span className="inline-flex min-h-11 items-center gap-2.5">
          {avatar}
          <span className="font-medium text-foreground">{display}</span>
        </span>
      ) : (
        <MemberProfile
          userId={post.user_id}
          displayName={display}
          currentUserId={viewer.userId}
          onMessage={(m) => onMessage(m)}
        >
          <button
            type="button"
            className="group inline-flex min-h-11 items-center gap-2.5 rounded-lg text-left font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {avatar}
            <span className="break-all group-hover:underline">{display}</span>
          </button>
        </MemberProfile>
      )}
      {anonymous && post.is_mine && <span className="text-xs">(you)</span>}
      {post.author_is_staff && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#16294a] px-2.5 py-0.5 text-xs font-semibold text-white dark:bg-sky-300 dark:text-slate-900">
          <Shield className="h-3 w-3" aria-hidden="true" />
          {isMeetingTopic ? "Host" : "Team"}
        </span>
      )}
      <span aria-hidden="true">•</span>
      <span className="inline-flex items-center gap-1 text-xs">
        <Clock className="h-3 w-3" aria-hidden="true" />
        <span>{timeAgo(post.created_at)}</span>
      </span>
    </div>
  );
}

function SaveToQaButton({ thread, reply }: { thread: ForumThreadData; reply: ForumPostRow }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const question = [thread.title?.trim(), thread.content.trim()].filter(Boolean).join("\n\n");
      const { error } = await supabase.from("meeting_qa_archive").insert({
        question,
        answer: reply.content.trim(),
        meeting_date: meetingWeekKey(thread.created_at),
        is_published: false,
        tags: [],
      });
      if (error) throw error;
      setSaved(true);
      toast.success("Saved as a draft. Publish it in Admin → Q&A Archive.");
    } catch (error) {
      console.error("Error saving to Q&A archive:", error);
      toast.error("Couldn't save to the Q&A archive.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button variant="ghost" size="sm" className="min-h-11 rounded-xl px-3 text-xs text-slate-600 dark:text-slate-400" onClick={save} disabled={saving || saved}>
      <BookmarkCheck className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
      {saved ? "Saved to Q&A" : "Save to Q&A archive"}
    </Button>
  );
}

export function ForumThread({
  thread,
  topicId,
  isMeetingTopic,
  names,
  viewer,
  highlighted,
  forceExpanded,
  canReply,
  onRefresh,
  onDelete,
  onMessage,
  onModerate,
}: ForumThreadProps) {
  const [replying, setReplying] = useState(false);
  const [expanded, setExpanded] = useState(forceExpanded);

  useEffect(() => {
    if (forceExpanded) setExpanded(true);
  }, [forceExpanded]);

  const replies = thread.replies;
  const hiddenCount = expanded ? 0 : Math.max(0, replies.length - COLLAPSED_REPLY_COUNT);
  const visibleReplies = hiddenCount > 0 ? replies.slice(-COLLAPSED_REPLY_COUNT) : replies;
  const answered = isMeetingTopic && replies.some((r) => r.author_is_staff);

  const moderate = (post: ForumPostRow) => {
    if (!post.user_id) return;
    const username = !post.is_anonymous ? names.get(post.user_id) : null;
    onModerate({
      member: { id: post.user_id, username: username || (post.is_anonymous ? "Anonymous author of this post" : "Member") },
      postContent: post.content,
    });
  };

  const canDelete = (post: ForumPostRow) => post.is_mine || viewer.canModerate;

  return (
    <Card
      id={`post-${thread.id}`}
      className={`scroll-mt-24 rounded-2xl border-border/70 shadow-sm shadow-slate-900/[0.04] transition-shadow motion-reduce:transition-none ${
        highlighted ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg" : ""
      }`}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              {(thread.is_pinned || answered) && (
                <div className="flex flex-wrap items-center gap-2">
                  {thread.is_pinned && (
                    <KindPill tone="amber" className="gap-1">
                      <Pin className="h-3 w-3" aria-hidden="true" />
                      Pinned
                    </KindPill>
                  )}
                  {answered && (
                    <KindPill tone="emerald" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      Answered
                    </KindPill>
                  )}
                </div>
              )}
              {thread.title && <h3 className="break-words text-lg font-semibold leading-snug text-foreground">{thread.title}</h3>}
              <AuthorLine post={thread} names={names} viewer={viewer} isMeetingTopic={isMeetingTopic} onMessage={onMessage} />
            </div>
            <div className="flex items-center shrink-0">
              {viewer.canModerate && thread.user_id && !thread.is_mine && (
                <Button variant="ghost" size="sm" className="h-11 w-11 rounded-xl p-0 text-muted-foreground" onClick={() => moderate(thread)} title="Moderator action" aria-label="Moderator action">
                  <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
              {canDelete(thread) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(thread, replies.length)}
                  className="h-11 w-11 rounded-xl p-0 text-muted-foreground hover:text-destructive"
                  aria-label="Delete post"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>

          <ForumContent content={thread.content} className="max-w-prose text-base leading-relaxed text-foreground" />

          <PollDisplay postId={thread.id} userId={viewer.userId} />

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/60 pt-2">
            <PostReactions postId={thread.id} userId={viewer.userId} />
            <div className="ml-auto flex items-center gap-1">
              {canReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplying((v) => !v)}
                  aria-expanded={replying}
                  className="min-h-11 rounded-xl px-3 text-muted-foreground"
                >
                  <MessageCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                  Reply
                  {replies.length > 0 && (
                    <span className="ml-1 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {replies.length}
                    </span>
                  )}
                </Button>
              )}
              <Button variant="ghost" size="sm" className="min-h-11 min-w-11 rounded-xl px-3 text-muted-foreground" onClick={() => copyLink(topicId, thread.id)} aria-label="Copy link to this conversation">
                <Link2 className="h-4 w-4 sm:mr-1" aria-hidden="true" />
                <span className="hidden sm:inline">Copy link</span>
              </Button>
              <PostBookmark postId={thread.id} userId={viewer.userId} />
            </div>
          </div>

          {replying && (
            <ReplyComposer
              userId={viewer.userId}
              topicId={topicId}
              parentPostId={thread.id}
              onPosted={() => {
                setReplying(false);
                setExpanded(true);
                onRefresh();
              }}
              onCancel={() => setReplying(false)}
            />
          )}

          {replies.length > 0 && (
            <div className="mt-4 space-y-3 border-l-2 border-[#16294a]/15 pl-3 dark:border-sky-400/20 sm:pl-4">
              {hiddenCount > 0 && (
                <Button variant="link" size="sm" className="h-auto min-h-11 px-0 font-semibold" onClick={() => setExpanded(true)}>
                  Show {hiddenCount} earlier {hiddenCount === 1 ? "reply" : "replies"}
                </Button>
              )}
              {visibleReplies.map((reply) => (
                <div
                  key={reply.id}
                  id={`post-${reply.id}`}
                  className={`scroll-mt-24 rounded-xl border px-3 pb-1 pt-1.5 sm:px-4 ${
                    reply.author_is_staff
                      ? "border-[#16294a]/15 bg-[#16294a]/[0.05] dark:border-sky-400/20 dark:bg-sky-400/[0.08]"
                      : "border-transparent bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <AuthorLine post={reply} names={names} viewer={viewer} isMeetingTopic={isMeetingTopic} onMessage={onMessage} />
                    <div className="flex items-center shrink-0">
                      {viewer.canModerate && reply.user_id && !reply.is_mine && (
                        <Button variant="ghost" size="sm" className="h-11 w-11 rounded-xl p-0 text-muted-foreground" onClick={() => moderate(reply)} aria-label="Moderator action">
                          <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      )}
                      {canDelete(reply) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(reply, 0)}
                          className="h-11 w-11 rounded-xl p-0 text-muted-foreground hover:text-destructive"
                          aria-label="Delete reply"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <ForumContent content={reply.content} className="max-w-prose text-[0.9375rem] leading-relaxed text-foreground" />
                  <div className="-ml-2 mt-1 flex flex-wrap items-center gap-1">
                    <Button variant="ghost" size="sm" className="min-h-11 rounded-xl px-2 text-xs text-slate-600 dark:text-slate-400" onClick={() => copyLink(topicId, reply.id)}>
                      <Link2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                      Copy link
                    </Button>
                    {isMeetingTopic && viewer.isAdmin && <SaveToQaButton thread={thread} reply={reply} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
