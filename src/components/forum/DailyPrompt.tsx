import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface DailyPromptProps {
  onStartDiscussion?: (prompt: string, topicId: string) => void;
}

export function DailyPrompt({ onStartDiscussion }: DailyPromptProps) {
  const [prompt, setPrompt] = useState<{ text: string; topic_id: string } | null>(null);

  useEffect(() => {
    const fetchDailyPrompt = async () => {
      // Get a random active prompt
      const { data, error } = await supabase
        .from('forum_daily_prompts')
        .select('prompt_text, topic_id')
        .eq('is_active', true)
        .limit(10);

      if (!error && data && data.length > 0) {
        // Select based on day of year for consistency
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const index = dayOfYear % data.length;
        setPrompt({
          text: data[index].prompt_text,
          topic_id: data[index].topic_id
        });
      }
    };

    fetchDailyPrompt();
  }, []);

  if (!prompt) return null;

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm text-primary mb-1">Daily Discussion Prompt</h4>
            <p className="text-foreground mb-3">{prompt.text}</p>
            <Link to={`/family-forum/${prompt.topic_id}`}>
              <Button size="sm" variant="outline" className="gap-2">
                Join the Discussion
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
