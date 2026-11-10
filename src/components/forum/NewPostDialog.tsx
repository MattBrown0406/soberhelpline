import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ACTIVE_TOPICS, DEFAULT_TOPIC_ID, forumComposeLink, toActiveTopicId } from "@/lib/forumTopics";

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
          <DialogTitle className="text-logo-blue">Start a conversation</DialogTitle>
          <DialogDescription>Where would you like to post? You can post anonymously on the next step.</DialogDescription>
        </DialogHeader>

        <RadioGroup value={topicId} onValueChange={setTopicId} className="grid gap-3 py-2">
          {ACTIVE_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <Label
                key={topic.id}
                htmlFor={`space-${topic.id}`}
                className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
              >
                <RadioGroupItem value={topic.id} id={`space-${topic.id}`} className="mt-1" />
                <span className={`p-2 rounded-md shrink-0 ${topic.tileClass}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <span className="block font-medium">{topic.title}</span>
                  <span className="block text-sm text-muted-foreground font-normal mt-0.5">{topic.description}</span>
                </span>
              </Label>
            );
          })}
        </RadioGroup>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
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
