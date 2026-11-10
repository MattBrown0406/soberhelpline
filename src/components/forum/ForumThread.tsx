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
import { Badge } from "@/components/ui/badge";
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

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
      <User className="h-3 w-3" aria-hidden="true" />
      {anonymous || !post.user_id ? (
        <span>{display}</span>
      ) : (
        <MemberProfile
          userId={post.user_id}
          displayName={display}
          currentUserId={viewer.userId}
          onMessage={(m) => onMessage(m)}
        >
          <button type="button" className="font-medium text-foreground hover:underline">
            {display}
          </button>
        </MemberProfile>
      )}
      {anonymous && post.is_mine && <span className="text-xs">(you)</span>}
      {post.author_is_staff && (
        <Badge variant="outline" className="gap-1 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 px-1.5 py-0 text-xs">
          <Shield className="h-3 w-3" />
          {isMeetingTopic ? "Host" : "Team"}
        </Badge>
      )}
      <span aria-hidden="true">•</span>
      <Clock className="h-3 w-3" aria-hidden="true" />
      <span>{timeAgo(post.created_at)}</span>
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
    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground" onClick={save} disabled={saving || saved}>
      <BookmarkCheck className="h-3.5 w-3.5 mr-1" />
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
      className={`scroll-mt-24 transition-shadow ${
        highlighted ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg" : ""
      }`}
    >
      <CardContent className="p-4 md:p-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                {thread.is_pinned && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Pin className="h-3 w-3" />
                    Pinned
                  </Badge>
                )}
                {answered && (
                  <Badge className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-600 text-white dark:bg-emerald-500">
                    <CheckCircle2 className="h-3 w-3" />
                    Answered
                  </Badge>
                )}
              </div>
              {thread.title && <h3 className="font-semibold text-lg text-logo-blue break-words">{thread.title}</h3>}
              <AuthorLine post={thread} names={names} viewer={viewer} isMeetingTopic={isMeetingTopic} onMessage={onMessage} />
            </div>
            <div className="flex items-center shrink-0">
              {viewer.canModerate && thread.user_id && !thread.is_mine && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground" onClick={() => moderate(thread)} title="Moderator action" aria-label="Moderator action">
                  <ShieldAlert className="h-4 w-4" />
                </Button>
              )}
              {canDelete(thread) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(thread, replies.length)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  aria-label="Delete post"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <ForumContent content={thread.content} className="text-foreground" />

          <PollDisplay postId={thread.id} userId={viewer.userId} />

          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <PostReactions postId={thread.id} userId={viewer.userId} />
            <div className="flex items-center gap-1 ml-auto">
              {canReply && (
                <Button variant="ghost" size="sm" onClick={() => setReplying((v) => !v)} className="text-muted-foreground">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Reply
                  {replies.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {replies.length}
                    </Badge>
                  )}
                </Button>
              )}
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => copyLink(topicId, thread.id)} aria-label="Copy link to this conversation">
                <Link2 className="h-4 w-4 sm:mr-1" />
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
            <div className="mt-4 space-y-3 pl-3 sm:pl-4 border-l-2 border-border">
              {hiddenCount > 0 && (
                <Button variant="link" size="sm" className="px-0 h-auto" onClick={() => setExpanded(true)}>
                  Show {hiddenCount} earlier {hiddenCount === 1 ? "reply" : "replies"}
                </Button>
              )}
              {visibleReplies.map((reply) => (
                <div
                  key={reply.id}
                  id={`post-${reply.id}`}
                  className={`rounded-lg p-3 ${
                    reply.author_is_staff ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <AuthorLine post={reply} names={names} viewer={viewer} isMeetingTopic={isMeetingTopic} onMessage={onMessage} />
                    <div className="flex items-center shrink-0">
                      {viewer.canModerate && reply.user_id && !reply.is_mine && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground" onClick={() => moderate(reply)} aria-label="Moderator action">
                          <ShieldAlert className="h-3 w-3" />
                        </Button>
                      )}
                      {canDelete(reply) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(reply, 0)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          aria-label="Delete reply"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <ForumContent content={reply.content} className="text-foreground text-sm" />
                  <div className="flex flex-wrap items-center gap-1 mt-2">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground" onClick={() => copyLink(topicId, reply.id)}>
                      <Link2 className="h-3.5 w-3.5 mr-1" />
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
