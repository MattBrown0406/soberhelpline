import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus, Check, Copy, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
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
  /** What the person typed on the registration form, to save them typing it again. */
  email?: string;
  phone?: string;
}

// Must match SMS_CONSENT_TEXT in supabase/functions/_shared/twilioSms.ts: the
// server stores the wording the person agreed to.
const SMS_CONSENT_TEXT =
  "I agree to receive text message reminders from Sober Helpline about The Family Squares at this number. " +
  "About one message per meeting. Message and data rates may apply. Reply STOP to cancel, HELP for help.";

/**
 * Text reminders. Only shown while the owner has texting switched on
 * (site_settings family_squares_sms_enabled = "true"). The consent box starts
 * unticked and nothing is sent without it.
 */
const TextReminderOptIn = ({ email, phone }: { email: string; phone?: string }) => {
  const [available, setAvailable] = useState(false);
  const [number, setNumber] = useState(phone ?? "");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "working" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "family_squares_sms_enabled")
          .maybeSingle();
        if (!cancelled) setAvailable(String(data?.value ?? "").trim() === "true");
      } catch {
        // Texting stays hidden if the setting cannot be read.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!available || !email) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === "working") return;
    if (!consent) {
      setError("Please tick the box to agree to text reminders.");
      return;
    }
    setError(null);
    setState("working");
    try {
      const { data, error: invokeError } = await supabase.functions.invoke("family-squares-sms-optin", {
        body: { phone: number, email, consent: true },
      });
      // A refused request still carries the reason to show the person.
      let reason: string | undefined = data?.error;
      if (invokeError && !reason) {
        try {
          reason = (await (invokeError as { context?: Response }).context?.json())?.error;
        } catch {
          reason = undefined;
        }
      }
      if (invokeError || data?.ok !== true) throw new Error(reason || "Something went wrong. Please try again.");
      trackConversionEvent("monday_zoom_text_reminder_optin", { source: "thank_you_text_reminder" });
      setState("done");
    } catch (submitError) {
      setState("idle");
      const message = submitError instanceof Error ? submitError.message : "";
      setError(message && message !== "not_available" ? message : "Text reminders are not available right now.");
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="flex items-center gap-2 font-semibold text-foreground">
        <Smartphone className="h-5 w-5 shrink-0 text-logo-blue" aria-hidden="true" />
        Get a text an hour before
      </p>
      {state === "done" ? (
        <p className="mt-2 text-sm text-muted-foreground" role="status">
          Done. We just sent a text to confirm. You will get one reminder about an hour before each meeting you are
          registered for.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-3 space-y-3" noValidate>
          <div className="space-y-2">
            <Label htmlFor="text-reminder-phone">Mobile number</Label>
            <Input
              id="text-reminder-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(555) 123-4567"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              maxLength={20}
            />
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="text-reminder-consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
              className="mt-1"
            />
            <Label htmlFor="text-reminder-consent" className="text-xs font-normal leading-relaxed text-muted-foreground">
              {SMS_CONSENT_TEXT} See our{" "}
              <Link to="/sms-terms" className="underline">SMS terms</Link> and{" "}
              <Link to="/privacy" className="underline">privacy policy</Link>. Agreeing is not required to attend.
            </Label>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" variant="outline" disabled={state === "working"} className="w-full sm:w-auto">
            {state === "working" ? "Sending..." : "Text me reminders"}
          </Button>
        </form>
      )}
    </div>
  );
};

/**
 * Shown right after someone registers for the Monday meeting: put it on the
 * calendar every week, and invite a family member with one tap.
 */
const MondayAfterRegistration = ({ nextMeetingDate, email, phone }: Props) => {
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

      {email && <TextReminderOptIn email={email} phone={phone} />}

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
