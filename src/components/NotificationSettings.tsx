import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { untypedSupabase } from "@/integrations/supabase/untyped";
import { Panel } from "@/components/member/MemberUI";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

// Members' email preferences (user_notification_preferences). A missing row
// means everything is on; the row is created on the first change. The new
// columns are not in types.ts yet, so this uses the untyped client.

type PrefKey =
  | "reply_notifications"
  | "mention_notifications"
  | "followed_topic_notifications"
  | "weekly_member_note";

type Prefs = Record<PrefKey, boolean>;

const DEFAULTS: Prefs = {
  reply_notifications: true,
  mention_notifications: true,
  followed_topic_notifications: true,
  weekly_member_note: true,
};

const OPTIONS: { key: PrefKey; label: string; help: string }[] = [
  {
    key: "reply_notifications",
    label: "Replies to my posts",
    help: "An email when someone replies to something you posted in the forum.",
  },
  {
    key: "mention_notifications",
    label: "@mentions",
    help: "An email when someone mentions you by name in the forum.",
  },
  {
    key: "followed_topic_notifications",
    label: "New conversations in topics I follow",
    help: "One email listing the new conversations in forum topics you follow.",
  },
  {
    key: "weekly_member_note",
    label: "The weekly “this week” note",
    help: "Tuesday afternoons: Monday's recording, your next step, and the next meeting.",
  },
];

export default function NotificationSettings() {
  const [userId, setUserId] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [saving, setSaving] = useState<PrefKey | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id ?? null;
      if (cancelled) return;
      setUserId(uid);
      if (!uid) {
        setLoading(false);
        return;
      }
      const { data, error } = await untypedSupabase
        .from("user_notification_preferences")
        .select("*")
        .eq("user_id", uid)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setUnavailable(true);
      } else if (data) {
        const row = data as unknown as Partial<Record<PrefKey, boolean | null>>;
        setPrefs({
          reply_notifications: row.reply_notifications !== false,
          mention_notifications: row.mention_notifications !== false,
          followed_topic_notifications: row.followed_topic_notifications !== false,
          weekly_member_note: row.weekly_member_note !== false,
        });
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = async (key: PrefKey, value: boolean) => {
    if (!userId) return;
    const previous = prefs[key];
    setPrefs((p) => ({ ...p, [key]: value }));
    setSaving(key);
    // Partial upsert: on first save the other columns take their defaults (on).
    const { error } = await untypedSupabase
      .from("user_notification_preferences")
      .upsert({ user_id: userId, [key]: value }, { onConflict: "user_id" });
    setSaving(null);
    if (error) {
      setPrefs((p) => ({ ...p, [key]: previous }));
      toast.error("We couldn't save that change. Please try again.");
    } else {
      toast.success("Saved");
    }
  };

  return (
    <Panel>
      <h3 className="text-lg font-semibold leading-snug text-foreground">Email settings</h3>
      <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
        Choose which emails you get from us. Emails never show what anyone wrote in a post or who wrote it,
        just a link to the site (and, for topics you follow, the conversation's title).
      </p>
      <div className="mt-4 border-t border-border/70">
        {loading ? (
          <div className="space-y-3 pt-4">
            {OPTIONS.map((o) => (
              <Skeleton key={o.key} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : !userId ? (
          <p className="pt-4 text-sm text-muted-foreground">Sign in to change your email settings.</p>
        ) : unavailable ? (
          <p className="pt-4 text-sm text-muted-foreground">
            Email settings aren't available right now. Please try again later.
          </p>
        ) : (
          <ul className="divide-y divide-border/70">
            {OPTIONS.map((o) => {
              const id = `email-pref-${o.key}`;
              return (
                <li key={o.key} className="flex min-h-11 items-start justify-between gap-4 py-3.5 last:pb-0">
                  <div className="min-w-0">
                    <Label htmlFor={id} className="block cursor-pointer text-base font-medium leading-snug text-foreground">
                      {o.label}
                    </Label>
                    <p id={`${id}-help`} className="mt-1 text-sm leading-snug text-muted-foreground">
                      {o.help}
                    </p>
                  </div>
                  <Switch
                    id={id}
                    aria-describedby={`${id}-help`}
                    checked={prefs[o.key]}
                    disabled={saving === o.key}
                    onCheckedChange={(v) => update(o.key, v)}
                    className="mt-1 shrink-0"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Panel>
  );
}
