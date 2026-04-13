import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ZoomMeeting from "@/components/ZoomMeeting";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Video } from "lucide-react";

const JoinMeeting = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const meetingNumber = (searchParams.get("mn") || "").replace(/\D/g, "");
  const password = (searchParams.get("pwd") || "").trim();
  const role = Number(searchParams.get("role") || "0");
  const requiresAuth = role === 1;

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!meetingNumber) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No meeting number provided.</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
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
                <span>Every Monday at 7:00 PM PST</span>
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
