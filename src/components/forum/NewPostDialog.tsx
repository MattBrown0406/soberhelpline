import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ACTIVE_TOPICS, DEFAULT_TOPIC_ID, forumComposeLink, toActiveTopicId } from "@/lib/forumTopics";
import { IconTile, type Tone } from "@/components/member/MemberUI";

// The same colour per space as the cards on the forum home page.
const SPACE_TONES: Record<string, Tone> = {
  "this-weeks-meeting": "navy",
  "ask-community": "amber",
  introductions: "rose",
};

interface NewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTopicId?: string;
}

/**
 * Step one of starting a conversation: choose one of the active spaces. The
 * writing itself happens on the space's page (compose deep link), which has
 * the full form: anonymous option, draft saving, @mentions and polls.
 * (The old "request a new topic" flow is gone on purpose: fewer, busier rooms.)
 */
export function NewPostDialog({ open, onOpenChange, defaultTopicId }: NewPostDialogProps) {
  const navigate = useNavigate();
  const [topicId, setTopicId] = useState(toActiveTopicId(defaultTopicId ?? DEFAULT_TOPIC_ID));

  useEffect(() => {
    if (open) setTopicId(toActiveTopicId(defaultTopicId ?? DEFAULT_TOPIC_ID));
  }, [open, defaultTopicId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Start a conversation</DialogTitle>
          <DialogDescription>Where would you like to post? You can post anonymously on the next step.</DialogDescription>
        </DialogHeader>

        <RadioGroup value={topicId} onValueChange={setTopicId} className="grid gap-3 py-2">
          {ACTIVE_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <Label
                key={topic.id}
                htmlFor={`space-${topic.id}`}
                className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-border p-3.5 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
              >
                <RadioGroupItem value={topic.id} id={`space-${topic.id}`} className="mt-2.5" />
                <IconTile icon={Icon} tone={SPACE_TONES[topic.id] ?? "navy"} />
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold leading-snug text-foreground">{topic.title}</span>
                  <span className="mt-0.5 block text-sm font-normal leading-relaxed text-muted-foreground">{topic.description}</span>
                </span>
              </Label>
            );
          })}
        </RadioGroup>

        <div className="flex justify-end gap-3 border-t border-border/70 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-12 rounded-xl px-5">
            Cancel
          </Button>
          <Button
            className="h-12 flex-1 rounded-xl px-8 text-base sm:flex-none"
            onClick={() => {
              onOpenChange(false);
              navigate(forumComposeLink(topicId));
            }}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
