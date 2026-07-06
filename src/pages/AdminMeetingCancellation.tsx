import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { useNavigate } from "react-router-dom";

const TARGET_MEETING_DATE = "2026-07-06";
const POLL_SLUG = `meeting-cancel-${TARGET_MEETING_DATE}`;

interface VoteRow {
  id: string;
  recipient_email: string;
  recipient_name: string | null;
  choice: number | null;
  voted_at: string | null;
  email_sent_at: string | null;
}

interface Poll {
  id: string;
  title: string;
  question: string;
  option_1_label: string;
  option_2_label: string;
  meeting_date: string;
}

export default function AdminMeetingCancellation() {
  const [checkingRole, setCheckingRole] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [registrantCount, setRegistrantCount] = useState<number | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [votes, setVotes] = useState<VoteRow[]>([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; recipients: number } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadAll = async () => {
    const { count } = await supabase
      .from("zoom_meeting_registrations")
      .select("*", { count: "exact", head: true })
      .eq("meeting_date", TARGET_MEETING_DATE);
    setRegistrantCount(count ?? 0);

    const { data: pollData } = await supabase
      .from("email_polls")
      .select("id, title, question, option_1_label, option_2_label, meeting_date")
      .eq("slug", POLL_SLUG)
      .maybeSingle();
    if (pollData) {
      setPoll(pollData as Poll);
      const { data: voteData } = await supabase
        .from("email_poll_votes")
        .select("id, recipient_email, recipient_name, choice, voted_at, email_sent_at")
        .eq("poll_id", pollData.id)
        .order("voted_at", { ascending: false, nullsFirst: false });
      setVotes((voteData ?? []) as VoteRow[]);
    } else {
      setPoll(null);
      setVotes([]);
    }
  };

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth?redirect=/admin/meeting-cancellation");
        return;
      }
      const { data: isAdminData } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (!isAdminData) {
        setCheckingRole(false);
        return;
      }
      setIsAdmin(true);
      await loadAll();
      setCheckingRole(false);
    })();
  }, [navigate]);

  const handleSend = async (dryRun = false) => {
    setSending(true);
    setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("send-meeting-cancellation-poll", {
        body: {
          meeting_date: TARGET_MEETING_DATE,
          dry_run: dryRun,
        },
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : undefined,
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult({
        sent: data?.sent ?? 0,
        failed: data?.failed ?? 0,
        recipients: data?.recipients ?? 0,
      });
      toast({
        title: dryRun ? "Dry run complete" : "Emails sent",
        description: dryRun
          ? `Would send to ${data?.recipients ?? 0} recipients.`
          : `Sent ${data?.sent ?? 0} of ${data?.recipients ?? 0}. Failed: ${data?.failed ?? 0}.`,
      });
      await loadAll();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast({ title: "Send failed", description: msg, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const votedCount = votes.filter((v) => v.choice !== null).length;
  const option1Count = votes.filter((v) => v.choice === 1).length;
  const option2Count = votes.filter((v) => v.choice === 2).length;
  const emailedCount = votes.filter((v) => v.email_sent_at).length;

  if (checkingRole) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-16 max-w-md mx-auto text-center">
        <AlertTriangle className="w-10 h-10 mx-auto text-destructive mb-3" />
        <h1 className="text-xl font-bold mb-2">Admin only</h1>
        <p className="text-muted-foreground">You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Meeting Cancellation Poll | Admin" description="" />
      <div className="container py-8 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meeting Cancellation Poll</h1>
          <p className="text-muted-foreground mt-1">
            Target meeting: <strong>{TARGET_MEETING_DATE}</strong> — registration for this date is
            already blocked automatically.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send the cancellation email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatBox label="Registrants" value={registrantCount ?? "…"} />
              <StatBox label="Emails sent" value={emailedCount} />
              <StatBox label="Votes cast" value={votedCount} />
              <StatBox label="Not yet voted" value={votes.length - votedCount} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleSend(true)} variant="outline" disabled={sending}>
                {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Dry run (count only)
              </Button>
              <Button onClick={() => handleSend(false)} disabled={sending}>
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send cancellation poll email
              </Button>
              <Button variant="ghost" onClick={loadAll}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {result ? (
              <div className="text-sm text-muted-foreground">
                Last run — recipients: {result.recipients}, sent: {result.sent}, failed: {result.failed}
              </div>
            ) : null}

            <p className="text-xs text-muted-foreground">
              Emails are only sent once per recipient — running "Send" again will safely skip anyone
              already emailed and email any new registrants that appear.
            </p>
          </CardContent>
        </Card>

        {poll ? (
          <Card>
            <CardHeader>
              <CardTitle>Live results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ResultBar label={poll.option_1_label} count={option1Count} total={votedCount} color="bg-sky-500" />
                <ResultBar label={poll.option_2_label} count={option2Count} total={votedCount} color="bg-teal-600" />
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <div className="col-span-5">Recipient</div>
                  <div className="col-span-4">Vote</div>
                  <div className="col-span-3">Voted at</div>
                </div>
                <div className="max-h-[420px] overflow-auto">
                  {votes.map((v) => (
                    <div key={v.id} className="grid grid-cols-12 px-3 py-2 text-sm border-t">
                      <div className="col-span-5">
                        <div className="font-medium">{v.recipient_name || "—"}</div>
                        <div className="text-xs text-muted-foreground">{v.recipient_email}</div>
                      </div>
                      <div className="col-span-4">
                        {v.choice === 1 ? (
                          <span className="inline-flex items-center gap-1 text-sky-700">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Next Monday
                          </span>
                        ) : v.choice === 2 ? (
                          <span className="inline-flex items-center gap-1 text-teal-700">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Thursday 7/9
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                      <div className="col-span-3 text-xs text-muted-foreground">
                        {v.voted_at ? new Date(v.voted_at).toLocaleString() : "—"}
                      </div>
                    </div>
                  ))}
                  {votes.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                      No vote rows yet. Click "Send cancellation poll email" to create them.
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </>
  );
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}

function ResultBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="rounded-lg border p-3">
      <div className="text-sm font-semibold">{label}</div>
      <div className="mt-2 h-2 w-full bg-muted rounded overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{count} vote{count === 1 ? "" : "s"}</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}
