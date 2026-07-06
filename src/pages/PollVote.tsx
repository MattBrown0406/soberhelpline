import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, AlertCircle, Vote } from "lucide-react";
import SEOHead from "@/components/SEOHead";

interface PollData {
  poll_id: string;
  title: string;
  question: string;
  option_1_label: string;
  option_2_label: string;
  meeting_date: string | null;
  closed_at: string | null;
  recipient_name: string | null;
  current_choice: number | null;
  voted_at: string | null;
  option_1_count: number;
  option_2_count: number;
  total_votes: number;
}

export default function PollVote() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const { data, error } = await supabase.rpc("get_poll_by_token", { _token: token });
    if (error) {
      setError("We couldn't load this poll. The link may be invalid.");
      setPoll(null);
    } else if (!data || (Array.isArray(data) && data.length === 0)) {
      setError("This poll link is invalid or has expired.");
      setPoll(null);
    } else {
      const row = Array.isArray(data) ? data[0] : data;
      setPoll(row as PollData);
      setError(null);
    }
    setLoading(false);
  };

  const castVote = async (choice: number) => {
    if (!token || voting !== null) return;
    setVoting(choice);
    const { error } = await supabase.rpc("cast_poll_vote", {
      _token: token,
      _choice: choice,
    });
    if (error) {
      setError(error.message || "Could not record your vote. Please try again.");
    } else {
      await load();
    }
    setVoting(null);
  };

  useEffect(() => {
    void load();
    // If arriving from the email link with ?choice=1|2, auto-cast once.
    const autoChoice = Number(searchParams.get("choice"));
    if (autoChoice === 1 || autoChoice === 2) {
      void (async () => {
        setVoting(autoChoice);
        await supabase.rpc("cast_poll_vote", { _token: token!, _choice: autoChoice });
        await load();
        setVoting(null);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const totalVotes = poll?.total_votes ?? 0;
  const pct = useMemo(() => {
    if (!poll || totalVotes === 0) return { one: 0, two: 0 };
    return {
      one: Math.round((poll.option_1_count / totalVotes) * 100),
      two: Math.round((poll.option_2_count / totalVotes) * 100),
    };
  }, [poll, totalVotes]);

  return (
    <>
      <SEOHead
        title="Cast Your Vote | Sober Helpline"
        description="Vote on the reschedule for this week's Monday meeting."
      />
      <div className="min-h-[70vh] flex items-start justify-center px-4 py-10 bg-muted/30">
        <div className="w-full max-w-xl">
          <Card>
            <CardContent className="p-6 md:p-8">
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading poll...
                </div>
              ) : error ? (
                <div className="text-center py-6">
                  <AlertCircle className="w-10 h-10 mx-auto text-destructive mb-3" />
                  <p className="text-foreground font-medium">{error}</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    If you believe this is a mistake, please reply to the email you received.
                  </p>
                </div>
              ) : poll ? (
                <>
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <Vote className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {poll.recipient_name ? `Hi ${poll.recipient_name.split(" ")[0]}` : "Quick vote"}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                    {poll.title}
                  </h1>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {poll.question}
                  </p>

                  {poll.current_choice ? (
                    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-green-900 dark:text-green-200">
                          Vote recorded — thank you!
                        </p>
                        <p className="text-green-800/80 dark:text-green-200/80 mt-1">
                          You can change your vote below at any time before the poll closes.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-3">
                    {[1, 2].map((n) => {
                      const label = n === 1 ? poll.option_1_label : poll.option_2_label;
                      const count = n === 1 ? poll.option_1_count : poll.option_2_count;
                      const pctVal = n === 1 ? pct.one : pct.two;
                      const isSelected = poll.current_choice === n;
                      return (
                        <button
                          key={n}
                          disabled={voting !== null}
                          onClick={() => castVote(n)}
                          className={`w-full text-left rounded-lg border-2 p-4 transition ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold text-foreground">{label}</span>
                            {voting === n ? (
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            ) : isSelected ? (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            ) : null}
                          </div>
                          <div className="mt-3">
                            <div className="h-2 w-full bg-muted rounded overflow-hidden">
                              <div
                                className={`h-full ${
                                  n === 1 ? "bg-sky-500" : "bg-teal-600"
                                }`}
                                style={{ width: `${pctVal}%` }}
                              />
                            </div>
                            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                              <span>{count} vote{count === 1 ? "" : "s"}</span>
                              <span>{pctVal}%</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-6 text-xs text-muted-foreground text-center">
                    {totalVotes} total vote{totalVotes === 1 ? "" : "s"} so far.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
                    <Button asChild variant="outline">
                      <Link to="/">Return to home</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link to="/monday-zoom-registration">Monday meeting info</Link>
                    </Button>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
