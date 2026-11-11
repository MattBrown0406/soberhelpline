import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Send, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { moderateContent } from "@/lib/contentModeration";
import { processMentions } from "@/lib/mentionUtils";
import { sanitizeRefPath } from "@/lib/forumTopics";
import { RichTextEditor } from "./RichTextEditor";
import { DraftStatus, useAutoSaveDraft } from "./AutoSaveDraft";
import { PollCreator, type PollData } from "./PollCreator";

const SITE_ORIGIN = "https://soberhelpline.com";
const MAX_CONTENT = 5000;

function AnonymousToggle({
  id,
  checked,
  onCheckedChange,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3">
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} className="mt-0.5" />
      <Label htmlFor={id} className="cursor-pointer font-normal leading-snug">
        <span className="flex items-center gap-1.5 font-medium">
          <EyeOff className="h-3.5 w-3.5" />
          Post anonymously
        </span>
        <span className="block text-xs text-muted-foreground mt-0.5">
          Other members will see "Anonymous member" instead of your username. Only the site's administrators can see who
          wrote it, to keep the forum safe.
        </span>
      </Label>
    </div>
  );
}

interface ForumComposerProps {
  userId: string;
  topicId: string;
  heading?: string;
  initialTitle?: string;
  /** Same-site path this post is about (compose deep link `ref`). */
  refPath?: string | null;
  titlePlaceholder?: string;
  bodyPlaceholder?: string;
  onPosted: (postId: string) => void;
  onCancel: () => void;
}

/** The new-conversation form used on every active space. */
export function ForumComposer({
  userId,
  topicId,
  heading = "Start a conversation",
  initialTitle = "",
  refPath,
  titlePlaceholder = "A short title (optional)",
  bodyPlaceholder = "Share what's on your mind…",
  onPosted,
  onCancel,
}: ForumComposerProps) {
  const [title, setTitle] = useState(initialTitle.slice(0, 200));
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [poll, setPoll] = useState<PollData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const safeRef = sanitizeRefPath(refPath);

  const onDraftLoaded = useCallback((draftTitle: string, draftContent: string, draftAnonymous: boolean) => {
    setTitle((current) => (current.trim() ? current : draftTitle));
    setContent((current) => (current.trim() ? current : draftContent));
    // Never switch "post anonymously" OFF behind her back: if she has already
    // turned it on, it stays on whatever the saved draft says.
    setIsAnonymous((current) => current || draftAnonymous);
  }, []);

  const draft = useAutoSaveDraft({
    userId,
    topicId,
    parentPostId: null,
    title,
    content,
    isAnonymous,
    enabled: !isSubmitting,
    onDraftLoaded,
  });

  const handleSubmit = async () => {
    const body = content.trim();
    if (!body) {
      toast.error("Please write something before posting.");
      return;
    }
    setIsSubmitting(true);
    setModerationError(null);
    try {
      const moderation = await moderateContent(body, title.trim());
      if (!moderation.allowed) {
        setModerationError(moderation.reason || "Please revise your message to be more respectful and try again.");
        return;
      }

      const finalContent = safeRef ? `${body}\n\nAbout: [${safeRef}](${SITE_ORIGIN}${safeRef})` : body;
      const postId = crypto.randomUUID();
      // Write without .select(): members cannot read forum_posts.user_id.
      const { error } = await supabase.from("forum_posts").insert({
        id: postId,
        topic_id: topicId,
        user_id: userId,
        title: title.trim() || null,
        content: finalContent.slice(0, MAX_CONTENT + 400),
        is_anonymous: isAnonymous,
      });
      if (error) throw error;

      if (poll) {
        const pollId = crypto.randomUUID();
        const { error: pollError } = await supabase.from("forum_polls").insert({
          id: pollId,
          post_id: postId,
          question: poll.question.trim().slice(0, 300),
          allows_multiple: poll.allowsMultiple,
        });
        if (!pollError) {
          const { error: optionsError } = await supabase.from("forum_poll_options").insert(
            poll.options.map((option, index) => ({
              poll_id: pollId,
              option_text: option.trim().slice(0, 200),
              display_order: index,
            })),
          );
          if (optionsError) console.error("Error saving poll options:", optionsError);
        } else {
          console.error("Error saving poll:", pollError);
          toast.error("Your post is up, but the poll couldn't be added.");
        }
      }

      await processMentions(finalContent, postId, userId, isAnonymous);
      await draft.clearDraft();
      setTitle("");
      setContent("");
      setPoll(null);
      toast.success("Posted. Thank you for sharing.");
      onPosted(postId);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Your post didn't go through. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6 border-primary/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{heading}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {moderationError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{moderationError}</AlertDescription>
          </Alert>
        )}
        {safeRef && (
          <p className="text-sm text-muted-foreground">
            About:{" "}
            <Link to={safeRef} className="text-primary underline break-all">
              {safeRef}
            </Link>
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="compose-title">Title</Label>
          <Input
            id="compose-title"
            placeholder={titlePlaceholder}
            value={title}
            maxLength={200}
            onChange={(e) => {
              setTitle(e.target.value);
              setModerationError(null);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="compose-body">Your post</Label>
          <RichTextEditor
            id="compose-body"
            value={content}
            onChange={(v) => {
              setContent(v);
              setModerationError(null);
            }}
            placeholder={bodyPlaceholder}
            minHeight="150px"
            maxLength={MAX_CONTENT}
            mentionsDisabled={isAnonymous}
          />
        </div>
        <AnonymousToggle id="compose-anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
        <PollCreator onPollChange={setPoll} />
        <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:justify-between">
          <DraftStatus isSaving={draft.isSaving} lastSaved={draft.lastSaved} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Close
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Post
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Closing keeps your draft. It will be here when you come back.</p>
      </CardContent>
    </Card>
  );
}

interface ReplyComposerProps {
  userId: string;
  topicId: string;
  parentPostId: string;
  onPosted: () => void;
  onCancel: () => void;
}

/** Reply form under a thread. */
export function ReplyComposer({ userId, topicId, parentPostId, onPosted, onCancel }: ReplyComposerProps) {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);

  const onDraftLoaded = useCallback((_t: string, draftContent: string, draftAnonymous: boolean) => {
    setContent((current) => (current.trim() ? current : draftContent));
    // Never switch "post anonymously" OFF behind her back: if she has already
    // turned it on, it stays on whatever the saved draft says.
    setIsAnonymous((current) => current || draftAnonymous);
  }, []);

  const draft = useAutoSaveDraft({
    userId,
    topicId,
    parentPostId,
    title: "",
    content,
    isAnonymous,
    enabled: !isSubmitting,
    onDraftLoaded,
  });

  const handleReply = async () => {
    const body = content.trim();
    if (!body) return;
    setIsSubmitting(true);
    setModerationError(null);
    try {
      const moderation = await moderateContent(body);
      if (!moderation.allowed) {
        setModerationError(moderation.reason || "Please revise your reply to be more respectful and try again.");
        return;
      }
      const replyId = crypto.randomUUID();
      const { error } = await supabase.from("forum_posts").insert({
        id: replyId,
        topic_id: topicId,
        user_id: userId,
        content: body.slice(0, MAX_CONTENT),
        parent_post_id: parentPostId,
        is_anonymous: isAnonymous,
      });
      if (error) throw error;
      await processMentions(body, replyId, userId, isAnonymous);
      await draft.clearDraft();
      setContent("");
      toast.success("Reply posted.");
      onPosted();
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Your reply didn't go through. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pl-3 sm:pl-4 border-l-2 border-border space-y-3">
      {moderationError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{moderationError}</AlertDescription>
        </Alert>
      )}
      <RichTextEditor
        value={content}
        onChange={(v) => {
          setContent(v);
          setModerationError(null);
        }}
        placeholder="Write your reply…"
        minHeight="90px"
        maxLength={MAX_CONTENT}
        mentionsDisabled={isAnonymous}
        aria-label="Your reply"
      />
      <AnonymousToggle id={`reply-anonymous-${parentPostId}`} checked={isAnonymous} onCheckedChange={setIsAnonymous} />
      <div className="flex items-center justify-between gap-2">
        <DraftStatus isSaving={draft.isSaving} lastSaved={draft.lastSaved} />
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleReply} disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reply"}
          </Button>
        </div>
      </div>
    </div>
  );
}
