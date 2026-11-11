import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IconTile, Panel } from "@/components/member/MemberUI";
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
    <Panel tone="amber">
      <div className="flex items-start gap-3">
        <IconTile icon={Sparkles} tone="amber" />
        <div className="min-w-0 flex-1">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800 dark:text-amber-300">
            Today's question
          </h2>
          <p className="mt-1 break-words text-base font-medium leading-relaxed text-foreground">{prompt.text}</p>
          <Button asChild variant="outline" className="mt-3 min-h-11 rounded-xl px-4">
            <Link to={forumComposeLink(prompt.topicId, { title: prompt.text })}>Share your answer</Link>
          </Button>
        </div>
      </div>
    </Panel>
  );
}
