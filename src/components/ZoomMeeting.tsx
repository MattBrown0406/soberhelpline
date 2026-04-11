import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Video, X, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

interface ZoomMeetingProps {
  meetingNumber: string;
  password?: string;
  userName: string;
  role?: number; // 0 = participant, 1 = host
  isAuthenticated?: boolean;
  onMeetingEnd?: () => void;
}

const ZoomMeeting = ({ meetingNumber, password = "", userName, role = 0, isAuthenticated = false, onMeetingEnd }: ZoomMeetingProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "joined" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [participantCount, setParticipantCount] = useState(0);
  const [guestName, setGuestName] = useState("");
  const meetingRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<any>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const joinMeeting = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      // Set up a 45-second timeout
      timeoutRef.current = setTimeout(() => {
        if (clientRef.current) {
          try { clientRef.current.leaveMeeting(); } catch {}
        }
        setErrorMessage("Connection is taking too long. Please check your internet connection and try again.");
        setStatus("error");
      }, 45000);

      // Dynamically import the Zoom SDK
      const ZoomMtgEmbedded = (await import("@zoom/meetingsdk/embedded")).default;
      const client = ZoomMtgEmbedded.createClient();
      clientRef.current = client;

      if (!meetingRef.current) {
        throw new Error("Meeting container not ready. Please try again.");
      }

      // Initialize the SDK
      await client.init({
        zoomAppRoot: meetingRef.current,
        language: "en-US",
        patchJsMedia: true,
        leaveOnPageUnload: true,
      });

      // Get session (optional for role=0 guests)
      const { data: { session } } = await supabase.auth.getSession();

      if (role !== 0 && !session) {
        throw new Error("You must be logged in to start a meeting as host");
      }

      // Get signature from edge function
      const response = await supabase.functions.invoke("generate-zoom-signature", {
        body: { meetingNumber, role },
        ...(session ? { headers: { Authorization: `Bearer ${session.access_token}` } } : {}),
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to get meeting signature");
      }

      const { signature, sdkKey } = response.data;

      // Listen for meeting end (host ends for all, or connection drops)
      client.on("connection-change", (payload: { state: string }) => {
        if (payload.state === "Closed") {
          onMeetingEnd?.();
        }
      });

      client.on('user-added', (payload: any) => {
        setParticipantCount(prev => prev + (Array.isArray(payload) ? payload.length : 1));
      });

      client.on('user-removed', (payload: any) => {
        setParticipantCount(prev => Math.max(0, prev - (Array.isArray(payload) ? payload.length : 1)));
      });

      client.on('recording-change', (payload: any) => {
        console.log('Recording state changed:', payload.state);
      });

      // Determine the name to use
      const finalUserName = (!isAuthenticated && guestName.trim().length >= 2)
        ? guestName.trim()
        : userName;

      // Clear timeout and mark joined
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStatus("joined");

      // Join the meeting
      await client.join({
        signature,
        sdkKey,
        meetingNumber,
        password,
        userName: finalUserName,
        ...(session?.user?.email ? { userEmail: session.user.email } : {}),
      });
    } catch (err: any) {
      console.error("Zoom meeting error:", err);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const msg = (err.message || err.reason || String(err)).toLowerCase();

      const notStarted =
        msg.includes("not start") ||
        msg.includes("not exist") ||
        msg.includes("meeting not") ||
        msg.includes("3001") ||
        msg.includes("invalid meeting");

      const notStartedMessage =
        "The meeting hasn't started yet. Please wait a few minutes and try again — the host will open the room shortly.";

      setErrorMessage(notStarted ? notStartedMessage : (err.message || "Failed to join meeting. Please try refreshing the page."));
      setStatus("error");
    }
  };

  const leaveMeeting = () => {
    if (clientRef.current) {
      try {
        clientRef.current.leaveMeeting();
      } catch (e) {
        console.error("Error leaving meeting:", e);
      }
    }
    setStatus("idle");
    onMeetingEnd?.();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (clientRef.current) {
        try {
          clientRef.current.leaveMeeting();
        } catch (e) {
          // Meeting may already be ended
        }
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">

      {status === "idle" && (
        <div className="flex flex-col items-center gap-4 p-8 bg-muted/30 rounded-xl border w-full">
          <Video className="h-12 w-12 text-primary" />
          <h3 className="text-lg font-semibold">Ready to Join</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Click below to join the video session directly in your browser. No downloads required.
          </p>

          {!isAuthenticated && (
            <div className="w-full max-w-xs space-y-1">
              <Input
                placeholder="Your first name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="text-center"
              />
              <p className="text-xs text-muted-foreground text-center">No account needed</p>
            </div>
          )}

          <Button
            onClick={joinMeeting}
            size="lg"
            className="gap-2"
            disabled={!isAuthenticated && guestName.trim().length < 2}
          >
            <Video className="h-4 w-4" />
            Join Meeting
          </Button>
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 p-8 bg-muted/30 rounded-xl border w-full">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Connecting to meeting...</p>
        </div>
      )}

      {status === "error" && (
        <div className={`flex flex-col items-center gap-4 p-8 rounded-xl border w-full ${
          errorMessage.includes("hasn't started")
            ? "bg-amber-500/5 border-amber-500/20"
            : "bg-destructive/5 border-destructive/20"
        }`}>
          {errorMessage.includes("hasn't started") && (
            <Clock className="h-10 w-10 text-amber-500" />
          )}
          <p className={errorMessage.includes("hasn't started") ? "text-amber-700 font-medium text-center" : "text-destructive font-medium text-center"}>
            {errorMessage}
          </p>
          <div className="flex gap-2">
            <Button onClick={joinMeeting} variant="outline">Try Again</Button>
            <Button onClick={() => setStatus("idle")} variant="ghost">Cancel</Button>
          </div>
        </div>
      )}

      {status === "joined" && (
        <div className="relative w-full flex items-center justify-end gap-2">
          {participantCount > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-foreground/10 text-foreground font-medium">
              {participantCount} in meeting
            </span>
          )}
          <Button
            onClick={leaveMeeting}
            variant="destructive"
            size="sm"
            className="gap-1"
          >
            <X className="h-3 w-3" />
            Leave
          </Button>
        </div>
      )}

      {/* Always mounted so the Zoom SDK can attach to it */}
      <div
        ref={meetingRef}
        className={`w-full min-h-[400px] md:min-h-[600px] lg:min-h-[680px] rounded-xl overflow-hidden border-2 border-primary/30 bg-black ${status !== "joined" ? "hidden" : ""}`}
      />

      <div className="flex flex-col md:flex-row items-center gap-4 mt-2">
        <img src={logo} alt="Sober Helpline" className="h-16 md:h-20 object-contain" />
        <div className="text-center md:text-left">
          <p className="text-xl md:text-2xl font-bold text-foreground">Leave the Chaos Behind.</p>
          <p className="text-xl md:text-2xl font-bold text-primary">Find Clarity Ahead.</p>
        </div>
      </div>
    </div>
  );
};

export default ZoomMeeting;