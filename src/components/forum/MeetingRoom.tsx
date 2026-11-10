import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ExternalLink, MessageCircleQuestion, PlayCircle, Radio } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatMeetingDay, nextMeeting, previousDay, weekdayOf, type NextMeeting } from "./meetingWeek";

interface LastRecording {
  id: string;
  title: string;
  recording_date: string;
  show_notes: string | null;
  key_timestamps: Array<{ time: string; label: string }>;
}

interface QaRow {
  id: string;
  question: string;
  answer: string;
}

/** Next Monday meeting + join button + "Ask a question for Monday". */
function NextMeetingCard({ onAsk }: { onAsk: () => void }) {
  const [meeting, setMeeting] = useState<NextMeeting>(() => nextMeeting());
  const [joinUrl, setJoinUrl] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setMeeting(nextMeeting()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["monday_zoom_meeting_id", "monday_zoom_passcode"]);
      const meetingId = data?.find((s) => s.key === "monday_zoom_meeting_id")?.value;
      const passcode = data?.find((s) => s.key === "monday_zoom_passcode")?.value;
      if (!cancelled && meetingId) {
        setJoinUrl(`/join-meeting?mn=${encodeURIComponent(meetingId)}&pwd=${encodeURIComponent(passcode || "")}`);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const when = meeting.isLive
    ? "Happening now, until 8:00 PM Pacific"
    : meeting.isToday
      ? "Tonight, 7:00 PM Pacific"
      : `${formatMeetingDay(meeting.key)}, 7:00 PM Pacific`;

  return (
    <Card
      className={
        meeting.isLive
          ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/30"
          : "border-primary/20 bg-primary/5"
      }
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-full bg-background/70 shrink-0">
              {meeting.isLive ? (
                <Radio className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <CalendarDays className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                {meeting.isLive ? "The Monday meeting is live now" : "Next Monday meeting"}
              </p>
              <p className="font-semibold text-foreground">{when}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Post your question here before Monday. You can post anonymously.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <Button onClick={onAsk} className="gap-2">
              <MessageCircleQuestion className="h-4 w-4" />
              Ask a question for Monday
            </Button>
            {joinUrl && (
              <Button asChild variant={meeting.isLive ? "default" : "outline"} className="gap-2">
                <Link to={joinUrl}>
                  <ExternalLink className="h-4 w-4" />
                  {meeting.isLive ? "Join now" : "Join link"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** The newest published recording and the published Q&A from that meeting. */
function LastMeetingCard() {
  const [recording, setRecording] = useState<LastRecording | null>(null);
  const [qa, setQa] = useState<QaRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("zoom_call_recordings")
        .select("id, title, recording_date, show_notes, key_timestamps")
        .eq("is_published", true)
        .order("recording_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled || !data) return;
      const rec: LastRecording = {
        id: data.id,
        title: data.title,
        recording_date: data.recording_date,
        show_notes: data.show_notes,
        key_timestamps: Array.isArray(data.key_timestamps)
          ? (data.key_timestamps as unknown as Array<{ time: string; label: string }>).filter(
              (t) => t && typeof t.time === "string" && typeof t.label === "string",
            )
          : [],
      };
      setRecording(rec);

      // Recordings are dated from Zoom's UTC start time, so a Monday-evening
      // meeting can carry Tuesday's date: accept the Monday before as well.
      const dates = [rec.recording_date];
      if (weekdayOf(rec.recording_date) === 2) dates.push(previousDay(rec.recording_date));
      const { data: qaRows } = await supabase
        .from("meeting_qa_archive")
        .select("id, question, answer")
        .eq("is_published", true)
        .in("meeting_date", dates)
        .order("created_at", { ascending: true })
        .limit(10);
      if (!cancelled) setQa((qaRows as QaRow[]) || []);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!recording) return null;
  const hasNotes = !!recording.show_notes?.trim() || recording.key_timestamps.length > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Last meeting</Badge>
          <span className="text-sm text-muted-foreground">{formatMeetingDay(recording.recording_date)}</span>
        </div>
        <CardTitle className="text-lg mt-1">{recording.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link to="/zoom-recordings">
            <PlayCircle className="h-4 w-4" />
            Watch the recording
          </Link>
        </Button>

        {hasNotes && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="link" className="px-0 h-auto">
                Show notes and key moments
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              {recording.show_notes?.trim() && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{recording.show_notes}</p>
              )}
              {recording.key_timestamps.length > 0 && (
                <ul className="space-y-1">
                  {recording.key_timestamps.map((t, i) => (
                    <li key={`${t.time}-${i}`} className="flex gap-3 text-sm">
                      <span className="font-mono text-primary font-semibold shrink-0 w-14">{t.time}</span>
                      <span className="text-foreground">{t.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {qa.length > 0 && (
          <div className="space-y-3 border-t border-border pt-3">
            <p className="text-sm font-medium">Questions answered that night</p>
            {qa.map((row) => (
              <div key={row.id} className="text-sm">
                <p className="font-medium text-foreground break-words">{row.question}</p>
                <p className="text-muted-foreground line-clamp-3 break-words mt-0.5">{row.answer}</p>
              </div>
            ))}
            <Link to="/member-qa" className="text-sm text-primary underline">
              All questions and answers
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Header of "This Week's Meeting": the room before and after Monday. */
export function MeetingRoom({ onAsk }: { onAsk: () => void }) {
  return (
    <div className="space-y-4 mb-8">
      <NextMeetingCard onAsk={onAsk} />
      <LastMeetingCard />
    </div>
  );
}
