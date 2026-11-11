import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ChevronDown, ExternalLink, MessageCircleQuestion, PlayCircle, Radio } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconTile, KindPill } from "@/components/member/MemberUI";
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
      className={`rounded-2xl shadow-sm shadow-slate-900/[0.04] ${
        meeting.isLive
          ? "border-green-200 bg-green-50 dark:border-green-400/25 dark:bg-green-950/40"
          : "border-[#16294a]/20 bg-card dark:border-sky-400/25"
      }`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {meeting.isLive ? (
              <IconTile icon={Radio} tone="emerald" size="lg" />
            ) : (
              <IconTile icon={CalendarDays} tone="navy" size="lg" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground/80">
                {meeting.isLive ? "The Monday meeting is live now" : "Next Monday meeting"}
              </p>
              <p className="text-lg font-semibold leading-snug text-foreground">{when}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                Post your question here before Monday. You can post anonymously.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button onClick={onAsk} className="h-12 gap-2 rounded-xl px-5 text-base shadow-md shadow-[#16294a]/15">
              <MessageCircleQuestion className="h-4 w-4" aria-hidden="true" />
              Ask a question for Monday
            </Button>
            {joinUrl && (
              <Button
                asChild
                variant={meeting.isLive ? "default" : "outline"}
                className={`h-12 gap-2 rounded-xl px-5 ${meeting.isLive ? "" : "bg-card"}`}
              >
                <Link to={joinUrl}>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
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
    <Card className="rounded-2xl border-border/70 shadow-sm shadow-slate-900/[0.04]">
      <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-3">
        <div className="flex items-start gap-3">
          <IconTile icon={PlayCircle} tone="navy" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <KindPill tone="navy">Last meeting</KindPill>
              <span className="text-sm text-muted-foreground">{formatMeetingDay(recording.recording_date)}</span>
            </div>
            <h2 className="mt-1 break-words text-lg font-semibold leading-snug text-foreground">{recording.title}</h2>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:p-5 sm:pt-0">
        <Button asChild variant="outline" className="min-h-11 w-full gap-2 rounded-xl px-4 sm:w-auto">
          <Link to="/zoom-recordings">
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            Watch the recording
          </Link>
        </Button>

        {hasNotes && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="link" className="group h-auto min-h-11 gap-1 px-0 font-semibold">
                Show notes and key moments
                <ChevronDown
                  className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              {recording.show_notes?.trim() && (
                <p className="max-w-prose whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">{recording.show_notes}</p>
              )}
              {recording.key_timestamps.length > 0 && (
                <ul className="space-y-1">
                  {recording.key_timestamps.map((t, i) => (
                    <li key={`${t.time}-${i}`} className="flex gap-3 text-sm">
                      <span className="font-mono text-primary font-semibold shrink-0 w-14">{t.time}</span>
                      <span className="min-w-0 break-words text-foreground">{t.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {qa.length > 0 && (
          <div className="space-y-3 border-t border-border/70 pt-3">
            <p className="text-sm font-semibold text-foreground">Questions answered that night</p>
            {qa.map((row) => (
              <div key={row.id} className="text-sm">
                <p className="font-medium text-foreground break-words">{row.question}</p>
                <p className="text-muted-foreground line-clamp-3 break-words mt-0.5">{row.answer}</p>
              </div>
            ))}
            <Link
              to="/member-qa"
              className="inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
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
