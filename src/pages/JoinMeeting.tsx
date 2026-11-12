import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ZoomMeeting from "@/components/ZoomMeeting";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Loader2, Video } from "lucide-react";
import { formatMeetingDay, formatViewerTime, getMondayMeeting } from "@/data/memberLibrary";

// The room opens 30 minutes before the Monday meeting. Once the hour is over
// the site switches to next week's meeting number, so the weekly link shows
// the next date instead of sending a latecomer into an empty room.
const DOORS_OPEN_MS = 30 * 60_000;

const JoinMeeting = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const linkMeetingNumber = (searchParams.get("mn") || "").replace(/\D/g, "");
  const linkPassword = (searchParams.get("pwd") || "").trim();
  const role = Number(searchParams.get("role") || "0");
  const requiresAuth = role === 1;

  // Opened without a meeting number (the link in a weekly calendar entry):
  // look up this week's Monday meeting, the same way the registration page does.
  const isWeeklyLink = !linkMeetingNumber;
  const [weekly, setWeekly] = useState<{ meetingId: string; passcode: string } | null>(null);
  const [weeklyLoaded, setWeeklyLoaded] = useState(!isWeeklyLink);
  const [enterEarly, setEnterEarly] = useState(false);

  useEffect(() => {
    if (!isWeeklyLink) return;
    let cancelled = false;
    void (async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["monday_zoom_meeting_id", "monday_zoom_passcode"]);
      if (cancelled) return;
      if (error) console.error("Failed to fetch Monday meeting info:", error);
      const meetingId = (data?.find((s) => s.key === "monday_zoom_meeting_id")?.value || "").replace(/\D/g, "");
      const passcode = data?.find((s) => s.key === "monday_zoom_passcode")?.value || "";
      if (meetingId) setWeekly({ meetingId, passcode });
      setWeeklyLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [isWeeklyLink]);

  const meetingNumber = isWeeklyLink ? weekly?.meetingId ?? "" : linkMeetingNumber;
  const password = isWeeklyLink ? weekly?.passcode ?? "" : linkPassword;

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (requiresAuth) {
          navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
          return;
        }

        setLoading(false);
        return;
      }

      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      setLoading(false);
    };

    void loadSession();
  }, [navigate, requiresAuth]);

  const userName = useMemo(() => {
    const profileName = profile
      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
      : "";

    return profileName || user?.email || "Guest";
  }, [profile, user?.email]);

  if (loading || !weeklyLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!meetingNumber) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">
          {isWeeklyLink
            ? "We could not load this week's meeting just now. The Family Squares page has the join button."
            : "No meeting number provided."}
        </p>
        {isWeeklyLink ? (
          <Button asChild>
            <Link to="/family-squares">Go to The Family Squares</Link>
          </Button>
        ) : (
          <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        )}
      </div>
    );
  }

  // The weekly link can be opened on any day. Outside meeting time, say when
  // the next meeting is instead of dropping the visitor into an empty room.
  if (isWeeklyLink && !enterEarly) {
    const meeting = getMondayMeeting();
    const doorsOpen = meeting.isLive || meeting.msUntilStart <= DOORS_OPEN_MS;
    if (!doorsOpen) {
      return (
        <>
          <SEOHead
            title="Join The Family Squares | Sober Helpline"
            description="The free Monday family support meeting from Sober Helpline. Every Monday at 7:00 PM Pacific."
          />
          <div className="container mx-auto max-w-xl px-4 py-16 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-7 w-7 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">The next meeting is {formatMeetingDay(meeting.start)}</h1>
            <p className="mt-3 text-muted-foreground">
              The Family Squares starts at 7:00 PM Pacific
              {meeting.viewerInOtherZone ? ` (${formatViewerTime(meeting.start)} your time)` : ""}. The room opens 30
              minutes before. Come back to this page then and you will go straight in.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <Button asChild>
                <Link to="/family-squares">Register for Monday (free)</Link>
              </Button>
              <button
                type="button"
                onClick={() => setEnterEarly(true)}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Open the meeting room anyway
              </button>
            </div>
          </div>
        </>
      );
    }
  }

  return (
    <>
      <SEOHead
        title="Join Video Session | Sober Helpline"
        description="Join your video session directly in your browser."
      />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="mb-6 rounded-xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">The Family Squares</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span>Every Monday at 7:00 PM Pacific</span>
                <span>·</span>
                <span>Free and open to all</span>
              </p>
            </div>
          </div>
        </div>

        <ZoomMeeting
          meetingNumber={meetingNumber}
          password={password}
          userName={userName}
          role={role}
          isAuthenticated={!!user}
          requireAuth={requiresAuth}
          onMeetingEnd={() => navigate("/testimonials?from=zoom")}
        />
      </div>
    </>
  );
};

export default JoinMeeting;
