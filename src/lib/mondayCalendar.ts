// Calendar entries and share links for the free Monday meeting (Family Squares).
//
// The Zoom meeting number changes every week, so a repeating calendar entry
// cannot carry a Zoom link. It points at /join-meeting instead, which always
// opens the current week's meeting.

export const SITE_URL = "https://soberhelpline.com";
export const WEEKLY_JOIN_URL = `${SITE_URL}/join-meeting`;
export const REGISTRATION_URL = `${SITE_URL}/family-squares`;

const EVENT_TITLE = "The Family Squares (free family support meeting)";
const EVENT_DETAILS =
  "Free weekly family support meeting from Sober Helpline, every Monday at 7:00 PM Pacific. " +
  `Join here each week: ${WEEKLY_JOIN_URL}`;

const compact = (isoDate: string) => isoDate.replace(/-/g, "");

/** Google Calendar link for a weekly entry starting on the given Monday (YYYY-MM-DD). */
export function weeklyGoogleCalendarUrl(firstMonday: string): string {
  const day = compact(firstMonday);
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_TITLE,
    dates: `${day}T190000/${day}T200000`,
    ctz: "America/Los_Angeles",
    recur: "RRULE:FREQ=WEEKLY;BYDAY=MO",
    details: EVENT_DETAILS,
    location: WEEKLY_JOIN_URL,
  }).toString()}`;
}

const escapeIcsText = (text: string) =>
  text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

// Calendar files limit lines to 75 bytes; longer lines continue on the next
// line after a single space.
const foldIcsLine = (line: string) => {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let current = "";
  let currentBytes = 0;
  for (const char of line) {
    const size = new TextEncoder().encode(char).length;
    const limit = parts.length === 0 ? 75 : 74;
    if (currentBytes + size > limit) {
      parts.push(current);
      current = "";
      currentBytes = 0;
    }
    current += char;
    currentBytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
};

/** A calendar file (Apple Calendar, Outlook) for a weekly entry starting on the given Monday. */
export function weeklyCalendarFile(firstMonday: string, now: Date = new Date()): string {
  const day = compact(firstMonday);
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sober Helpline//Family Squares Weekly//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:America/Los_Angeles",
    "X-LIC-LOCATION:America/Los_Angeles",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:-0800",
    "TZOFFSETTO:-0700",
    "TZNAME:PDT",
    "DTSTART:19700308T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:-0700",
    "TZOFFSETTO:-0800",
    "TZNAME:PST",
    "DTSTART:19701101T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    "UID:family-squares-weekly@soberhelpline.com",
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=America/Los_Angeles:${day}T190000`,
    `DTEND;TZID=America/Los_Angeles:${day}T200000`,
    "RRULE:FREQ=WEEKLY;BYDAY=MO",
    `SUMMARY:${escapeIcsText(EVENT_TITLE)}`,
    `DESCRIPTION:${escapeIcsText(EVENT_DETAILS)}`,
    `LOCATION:${escapeIcsText(WEEKLY_JOIN_URL)}`,
    `URL:${WEEKLY_JOIN_URL}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:The Family Squares starts in 30 minutes",
    "TRIGGER:-PT30M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].map(foldIcsLine).join("\r\n");
}

/** The message a registrant sends to a family member, with a link that records where the visit came from. */
export function familyInviteMessage(channel: "sms" | "email" | "copy" | "share"): string {
  const link = `${REGISTRATION_URL}?utm_source=family_invite&utm_medium=${channel}`;
  return (
    "I signed up for a free family support meeting on Zoom. It is every Monday at 7 PM Pacific, for families " +
    "dealing with a loved one's addiction. You can just listen with your camera off. Will you come with me? " +
    `Sign up here: ${link}`
  );
}

/** Opens the phone's text message app with the invitation written. Works on iPhone and Android. */
export const familyInviteSmsHref = () => `sms:?&body=${encodeURIComponent(familyInviteMessage("sms"))}`;

export const familyInviteMailHref = () =>
  `mailto:?subject=${encodeURIComponent("Will you come to this with me?")}&body=${encodeURIComponent(familyInviteMessage("email"))}`;
