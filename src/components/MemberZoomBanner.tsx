import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Video, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getMondayMeeting, formatViewerTime } from "@/data/memberLibrary";
import { IconTile } from "@/components/member/MemberUI";

/** The members' direct join link (site_settings), or null when none is set. */
export async function fetchMemberJoinUrl(): Promise<string | null> {
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["monday_zoom_meeting_id", "monday_zoom_passcode"]);
  const meetingId = data?.find((s) => s.key === "monday_zoom_meeting_id")?.value;
  const passcode = data?.find((s) => s.key === "monday_zoom_passcode")?.value;
  if (!meetingId) return null;
  return `/join-meeting?mn=${encodeURIComponent(meetingId)}&pwd=${encodeURIComponent(passcode || "")}`;
}

export const ASK_MONDAY_QUESTION_HREF = "/family-forum/this-weeks-meeting?compose=1";

const MemberZoomBanner = () => {
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState(() => getMondayMeeting());

  useEffect(() => {
    let cancelled = false;
    fetchMemberJoinUrl()
      .then((url) => {
        if (!cancelled) setJoinUrl(url);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep "tonight" / "live now" right while the page stays open.
  useEffect(() => {
    const id = setInterval(() => setMeeting(getMondayMeeting()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (loading || !joinUrl) return null;

  const highlight = meeting.isToday;
  const headline = meeting.isLive
    ? "Live now: The Family Squares (until 8:00 PM Pacific)"
    : meeting.isToday
      ? "Tonight: The Family Squares, 7:00 PM Pacific"
      : "The Family Squares, every Monday at 7:00 PM Pacific";

  return (
    <div
      className={`mb-6 rounded-2xl border px-4 py-3.5 shadow-sm shadow-slate-900/[0.04] ${
        highlight
          ? "border-green-200 bg-green-50/70 dark:border-green-400/25 dark:bg-green-400/[0.06]"
          : "border-border/70 bg-card"
      }`}
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <IconTile icon={Video} tone={highlight ? "emerald" : "navy"} />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-sm font-semibold leading-snug text-foreground">{headline}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {meeting.viewerInOtherZone && !meeting.isLive
              ? `That's ${formatViewerTime(meeting.start)} your time. Members join directly, no registration needed.`
              : "Members join directly, no registration needed."}
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap justify-center gap-2">
          <Button asChild size="sm" variant="outline" className="min-h-11 gap-2 rounded-xl">
            <Link to={ASK_MONDAY_QUESTION_HREF}>
              <MessageCircle className="w-3.5 h-3.5" />
              Ask a question
            </Link>
          </Button>
          <Button asChild size="sm" variant={highlight ? "default" : "outline"} className="min-h-11 gap-2 rounded-xl">
            <Link to={joinUrl}>
              <ExternalLink className="w-3.5 h-3.5" />
              {meeting.isLive ? "Join now" : "Join meeting"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemberZoomBanner;
