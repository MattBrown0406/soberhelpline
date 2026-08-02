import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { RefreshCw, Smartphone, Check } from "lucide-react";

interface SyncIssue {
  id: string;
  email: string | null;
  app_account_id: string | null;
  tier: string | null;
  expires_at: string | null;
  reason: string;
  status: string;
  created_at: string;
}

const REASON_LABELS: Record<string, string> = {
  no_matching_website_account:
    "App subscriber has no website account yet (invite queued — access is granted automatically when they sign up with this email)",
  no_email_on_app_account: "App account has no email on file — cannot be matched",
};

export function AppMembershipSync() {
  const [issues, setIssues] = useState<SyncIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadIssues = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("app_membership_sync_issues")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Could not load app subscription mismatches");
    } else {
      setIssues((data ?? []) as SyncIssue[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const runSync = async () => {
    setSyncing(true);
    const { data, error } = await supabase.functions.invoke("sync-app-memberships", {
      body: {},
    });
    setSyncing(false);

    if (error) {
      toast.error("Sync failed. Please try again.");
      return;
    }

    const summary = data as { granted?: number; revoked?: number; pending_invites?: number };
    toast.success(
      `Sync complete — ${summary?.granted ?? 0} granted, ${summary?.revoked ?? 0} revoked, ${
        summary?.pending_invites ?? 0
      } awaiting signup`,
    );
    loadIssues();
  };

  const dismiss = async (id: string) => {
    const { error } = await supabase
      .from("app_membership_sync_issues")
      .update({ status: "resolved", resolved_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Could not update this entry");
      return;
    }
    setIssues((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            App Subscription Sync
          </span>
          <Button size="sm" variant="outline" onClick={runSync} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing…" : "Run sync now"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Runs automatically every night at 3:00 AM Pacific. Active app subscribers get
          website membership access; lapsed subscriptions keep access for a 3-day grace
          period before being revoked.
        </p>

        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            Needs review
            <Badge variant={issues.length > 0 ? "destructive" : "secondary"}>
              {issues.length}
            </Badge>
          </h4>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : issues.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Every app subscriber is matched to a website account.
            </p>
          ) : (
            <ul className="space-y-2">
              {issues.map((issue) => (
                <li
                  key={issue.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-md border p-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium break-all">
                      {issue.email ?? `App account ${issue.app_account_id}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {REASON_LABELS[issue.reason] ?? issue.reason}
                    </p>
                    {issue.expires_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Subscription expires {new Date(issue.expires_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => dismiss(issue.id)}>
                    <Check className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
