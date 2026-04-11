import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ZoomMeeting from "@/components/ZoomMeeting";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

const JoinMeeting = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const meetingNumber = searchParams.get("mn") || "";
  const password = searchParams.get("pwd") || "";
  const role = Number(searchParams.get("role") || "0");

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (role !== 0) {
          navigate("/auth");
          return;
        }
        // No session but role=0 — allow them through as a guest
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

    checkAccess();
  }, [navigate, role]);

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

  const userName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : user?.email || "Guest";

  return (
    <>
      <SEOHead
        title="Join Video Session | Sober Helpline"
        description="Join your video session directly in your browser."
      />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          className="gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <ZoomMeeting
          meetingNumber={meetingNumber}
          password={password}
          userName={userName}
          role={role}
          onMeetingEnd={() => navigate("/testimonials?from=zoom")}
        />
      </div>
    </>
  );
};

export default JoinMeeting;
