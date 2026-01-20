import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PollDisplayProps {
  postId: string;
  userId: string;
}

interface PollOption {
  id: string;
  option_text: string;
  votes: number;
  hasVoted: boolean;
}

interface Poll {
  id: string;
  question: string;
  allows_multiple: boolean;
  ends_at: string | null;
  options: PollOption[];
  totalVotes: number;
}

export function PollDisplay({ postId, userId }: PollDisplayProps) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPoll = async () => {
    try {
      // Fetch poll
      const { data: pollData, error: pollError } = await supabase
        .from('forum_polls')
        .select('*')
        .eq('post_id', postId)
        .maybeSingle();

      if (pollError || !pollData) {
        setPoll(null);
        setIsLoading(false);
        return;
      }

      // Fetch options
      const { data: optionsData, error: optionsError } = await supabase
        .from('forum_poll_options')
        .select('*')
        .eq('poll_id', pollData.id)
        .order('display_order');

      if (optionsError || !optionsData) {
        setPoll(null);
        setIsLoading(false);
        return;
      }

      // Fetch votes
      const { data: votesData, error: votesError } = await supabase
        .from('forum_poll_votes')
        .select('option_id, user_id')
        .eq('poll_id', pollData.id);

      if (votesError) {
        console.error('Error fetching votes:', votesError);
      }

      // Calculate vote counts
      const voteCounts: Record<string, number> = {};
      const userVotes = new Set<string>();
      let userHasVoted = false;

      votesData?.forEach(vote => {
        voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1;
        if (vote.user_id === userId) {
          userVotes.add(vote.option_id);
          userHasVoted = true;
        }
      });

      const totalVotes = votesData?.length || 0;

      const options: PollOption[] = optionsData.map(opt => ({
        id: opt.id,
        option_text: opt.option_text,
        votes: voteCounts[opt.id] || 0,
        hasVoted: userVotes.has(opt.id)
      }));

      setPoll({
        id: pollData.id,
        question: pollData.question,
        allows_multiple: pollData.allows_multiple,
        ends_at: pollData.ends_at,
        options,
        totalVotes
      });

      setHasVoted(userHasVoted);
    } catch (error) {
      console.error('Error fetching poll:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`poll-votes-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_poll_votes'
        },
        () => {
          fetchPoll();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, userId]);

  const handleVote = async (optionId: string) => {
    if (!poll) return;

    try {
      const option = poll.options.find(o => o.id === optionId);
      
      if (option?.hasVoted) {
        // Remove vote
        await supabase
          .from('forum_poll_votes')
          .delete()
          .eq('poll_id', poll.id)
          .eq('option_id', optionId)
          .eq('user_id', userId);
      } else {
        // If not allowing multiple, remove existing votes first
        if (!poll.allows_multiple) {
          await supabase
            .from('forum_poll_votes')
            .delete()
            .eq('poll_id', poll.id)
            .eq('user_id', userId);
        }

        // Add vote
        await supabase
          .from('forum_poll_votes')
          .insert({
            poll_id: poll.id,
            option_id: optionId,
            user_id: userId
          });
      }

      fetchPoll();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (isLoading || !poll) return null;

  const isExpired = poll.ends_at && new Date(poll.ends_at) < new Date();

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          {poll.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {poll.options.map(option => {
          const percentage = poll.totalVotes > 0 
            ? Math.round((option.votes / poll.totalVotes) * 100) 
            : 0;

          return (
            <div key={option.id}>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start h-auto py-2 relative overflow-hidden",
                  option.hasVoted && "border-primary bg-primary/5"
                )}
                onClick={() => !isExpired && handleVote(option.id)}
                disabled={isExpired}
              >
                <div 
                  className="absolute inset-0 bg-primary/10" 
                  style={{ width: `${percentage}%` }}
                />
                <span className="relative flex items-center gap-2 flex-1">
                  {option.hasVoted && <Check className="h-4 w-4 text-primary" />}
                  <span>{option.option_text}</span>
                </span>
                <span className="relative text-sm text-muted-foreground">
                  {percentage}%
                </span>
              </Button>
            </div>
          );
        })}
        <p className="text-xs text-muted-foreground text-center">
          {poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''}
          {poll.allows_multiple && " • Multiple selections allowed"}
          {isExpired && " • Poll ended"}
        </p>
      </CardContent>
    </Card>
  );
}
