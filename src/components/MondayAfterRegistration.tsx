import { useState } from "react";
import { CalendarPlus, Check, Copy, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackConversionEvent } from "@/lib/conversionTracking";
import {
  familyInviteMailHref,
  familyInviteMessage,
  familyInviteSmsHref,
  weeklyCalendarFile,
  weeklyGoogleCalendarUrl,
} from "@/lib/mondayCalendar";

interface Props {
  /** The Monday the person just registered for, YYYY-MM-DD. */
  nextMeetingDate: string;
}

/**
 * Shown right after someone registers for the Monday meeting: put it on the
 * calendar every week, and invite a family member with one tap.
 */
const MondayAfterRegistration = ({ nextMeetingDate }: Props) => {
  const [copied, setCopied] = useState(false);

  const downloadCalendarFile = () => {
    trackConversionEvent("monday_zoom_calendar_add", { source: "thank_you_calendar_file" });
    const blob = new Blob([weeklyCalendarFile(nextMeetingDate)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "family-squares-every-monday.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copyInvite = async () => {
    trackConversionEvent("monday_zoom_family_invite", { source: "thank_you_copy" });
    try {
      await navigator.clipboard.writeText(familyInviteMessage("copy"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked (older browsers, some in-app browsers): the text and
      // email buttons still work.
    }
  };

  return (
    <div className="mt-6 space-y-4 text-left">
      <div className="rounded-lg border border-logo-blue/25 bg-logo-blue/5 p-5">
        <p className="flex items-center gap-2 font-semibold text-foreground">
          <CalendarPlus className="h-5 w-5 shrink-0 text-logo-blue" aria-hidden="true" />
          Put it on your calendar every Monday
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          The calendar entry repeats weekly at 7:00 PM Pacific and carries a link that opens that week's meeting.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <a
              href={weeklyGoogleCalendarUrl(nextMeetingDate)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackConversionEvent("monday_zoom_calendar_add", { source: "thank_you_google_calendar" })}
            >
              Google Calendar
            </a>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={downloadCalendarFile}>
            Apple Calendar or Outlook
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950/30">
        <p className="font-semibold text-blue-900 dark:text-blue-100">Bring someone from your family</p>
        <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
          A spouse, sibling, parent or adult child will get more out of it sitting in the same meeting as you. The
          invitation is already written. Send it as it is or change the words.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild className="w-full gap-2 bg-logo-blue text-white hover:bg-logo-blue/90 sm:w-auto">
            <a
              href={familyInviteSmsHref()}
              onClick={() => trackConversionEvent("monday_zoom_family_invite", { source: "thank_you_text" })}
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Text a family member
            </a>
          </Button>
          <Button asChild variant="outline" className="w-full gap-2 sm:w-auto">
            <a
              href={familyInviteMailHref()}
              onClick={() => trackConversionEvent("monday_zoom_family_invite", { source: "thank_you_email" })}
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email it
            </a>
          </Button>
          <Button variant="outline" className="w-full gap-2 sm:w-auto" onClick={copyInvite}>
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? "Copied" : "Copy the invitation"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MondayAfterRegistration;
