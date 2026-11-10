import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { forumComposeLink, toActiveTopicId } from "@/lib/forumTopics";
import { pacificParts } from "./meetingWeek";

/** Days since 1970-01-01 for today's Pacific calendar date. */
function pacificDayNumber(now = new Date()): number {
  const p = pacificParts(now);
  return Math.floor(Date.UTC(p.year, p.month - 1, p.day) / 86_400_000);
}

/**
 * Today's discussion prompt. Rotates through every active prompt (one per
 * Pacific calendar day, in a stable order) and opens the new-conversation form
 * with the prompt as its title. Prompts filed under an old topic go to
 * "Ask the Community".
 */
export function DailyPrompt() {
  const [prompt, setPrompt] = useState<{ text: string; topicId: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("forum_daily_prompts")
        .select("id, prompt_text, topic_id, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true });

      if (cancelled || error || !data || data.length === 0) return;
      const row = data[pacificDayNumber() % data.length];
      setPrompt({ text: row.prompt_text, topicId: toActiveTopicId(row.topic_id) });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!prompt) return null;

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/10 shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-sm text-primary mb-1">Today's question</h2>
            <p className="text-foreground mb-3">{prompt.text}</p>
            <Button asChild size="sm" variant="outline">
              <Link to={forumComposeLink(prompt.topicId, { title: prompt.text })}>Share your answer</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
