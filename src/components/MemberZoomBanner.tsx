import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Video, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getMondayMeeting, formatViewerTime } from "@/data/memberLibrary";

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
    <div className={`border rounded-xl px-4 py-3 mb-6 ${highlight ? "bg-emerald-500/10 border-emerald-500/30" : "bg-primary/5 border-primary/20"}`}>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${highlight ? "bg-emerald-500/20" : "bg-primary/15"}`}>
          <Video className={`w-4 h-4 ${highlight ? "text-emerald-700 dark:text-emerald-400" : "text-primary"}`} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-semibold text-foreground">{headline}</p>
          <p className="text-xs text-muted-foreground">
            {meeting.viewerInOtherZone && !meeting.isLive
              ? `That's ${formatViewerTime(meeting.start)} your time. Members join directly, no registration needed.`
              : "Members join directly, no registration needed."}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button asChild size="sm" variant="outline" className="gap-2">
            <Link to={ASK_MONDAY_QUESTION_HREF}>
              <MessageCircle className="w-3.5 h-3.5" />
              Ask a question
            </Link>
          </Button>
          <Button asChild size="sm" variant={highlight ? "default" : "outline"} className="gap-2">
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
