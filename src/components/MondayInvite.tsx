import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackConversionEvent } from "@/lib/conversionTracking";
import { formatMeetingDay, formatViewerTime, getMondayMeeting } from "@/data/memberLibrary";

interface MondayInviteProps {
  /** Where the invitation is shown, for click tracking (e.g. "blog_article_end"). */
  source: string;
  heading?: string;
  body?: string;
  className?: string;
}

/**
 * An invitation to the free Monday family meeting, with the next date.
 * Used at the end of articles, guides and assessment results.
 */
const MondayInvite = ({
  source,
  heading = "Talk it through with other families this Monday",
  body = "Family Squares is a free family support meeting on Zoom, every Monday night. Listen with your camera off or ask your question. No membership is needed.",
  className = "",
}: MondayInviteProps) => {
  const meeting = getMondayMeeting();
  const when = meeting.isLive
    ? "Happening now"
    : `${meeting.isToday ? "Tonight" : formatMeetingDay(meeting.start)}, 7:00 PM Pacific${
        meeting.viewerInOtherZone ? ` (${formatViewerTime(meeting.start)} your time)` : ""
      }`;

  return (
    <aside
      className={`rounded-2xl border border-logo-blue/25 bg-logo-blue/5 p-6 sm:p-8 print:hidden ${className}`}
      aria-label="Free Monday family meeting"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-logo-blue">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Free · {when}
          </p>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">{heading}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{body}</p>
        </div>
        <Link
          to="/family-squares"
          onClick={() => trackConversionEvent("monday_zoom_click", { source })}
          className="shrink-0"
        >
          <Button size="lg" className="w-full gap-2 bg-logo-blue text-white hover:bg-logo-blue/90 sm:w-auto">
            Save my free spot
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default MondayInvite;
