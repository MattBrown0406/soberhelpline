import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Video, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const MemberZoomBanner = () => {
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLink = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["monday_zoom_meeting_id", "monday_zoom_passcode"]);

      const meetingId = data?.find((s) => s.key === "monday_zoom_meeting_id")?.value;
      const passcode = data?.find((s) => s.key === "monday_zoom_passcode")?.value;

      if (meetingId) {
        setJoinUrl(`/join-meeting?mn=${encodeURIComponent(meetingId)}&pwd=${encodeURIComponent(passcode || "")}`);
      }
      setLoading(false);
    };
    fetchLink();
  }, []);

  if (loading || !joinUrl) return null;

  // Check if today is Monday
  const isMonday = new Date().getDay() === 1;

  return (
    <div className={`border rounded-xl px-5 py-4 mb-6 ${isMonday ? "bg-gradient-to-r from-emerald-500/10 via-primary/5 to-emerald-500/10 border-emerald-500/30" : "bg-gradient-to-r from-primary/5 via-background to-primary/5 border-primary/20"}`}>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isMonday ? "bg-emerald-500/20" : "bg-primary/15"}`}>
          <Video className={`w-5 h-5 ${isMonday ? "text-emerald-600" : "text-primary"}`} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-semibold text-foreground">
            {isMonday ? "🔴 Tonight: “The Family Squares” — 7:00 PM PST" : "The Family Squares — Every Monday at 7:00 PM PST"}
          </p>
          <p className="text-xs text-muted-foreground">
            As a member, you can join directly — no registration needed.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link to="/monday-zoom-registration?member=true">
            <Button size="sm" variant="outline" className="gap-2">
              <MessageCircle className="w-3.5 h-3.5" />
              Submit Question
            </Button>
          </Link>
          <Link to={joinUrl}>
            <Button size="sm" variant={isMonday ? "default" : "outline"} className="gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              {isMonday ? "Join Now" : "Join Meeting"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemberZoomBanner;
