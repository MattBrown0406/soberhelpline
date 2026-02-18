import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Video, X } from "lucide-react";
import logo from "@/assets/logo.png";

interface ZoomMeetingProps {
  meetingNumber: string;
  password?: string;
  userName: string;
  role?: number; // 0 = participant, 1 = host
  onMeetingEnd?: () => void;
}

const ZoomMeeting = ({ meetingNumber, password = "", userName, role = 0, onMeetingEnd }: ZoomMeetingProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "joined" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const meetingRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<any>(null);

  const joinMeeting = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
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

      // Get signature from edge function
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to join a meeting");
      }

      const response = await supabase.functions.invoke("generate-zoom-signature", {
        body: { meetingNumber, role },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to get meeting signature");
      }

      const { signature, sdkKey } = response.data;

      // Set joined before calling join so the container is visible
      setStatus("joined");

      // Join the meeting
      await client.join({
        signature,
        sdkKey,
        meetingNumber,
        password,
        userName,
      });
    } catch (err: any) {
      console.error("Zoom meeting error:", err);
      setErrorMessage(err.message || "Failed to join meeting");
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
      <img src={logo} alt="Sober Helpline" className="h-20 md:h-24 object-contain" />

      {status === "idle" && (
        <div className="flex flex-col items-center gap-4 p-8 bg-muted/30 rounded-xl border w-full">
          <Video className="h-12 w-12 text-primary" />
          <h3 className="text-lg font-semibold">Ready to Join</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Click below to join the video session directly in your browser. No downloads required.
          </p>
          <Button onClick={joinMeeting} size="lg" className="gap-2">
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
        <div className="flex flex-col items-center gap-4 p-8 bg-destructive/5 rounded-xl border border-destructive/20 w-full">
          <p className="text-destructive font-medium">{errorMessage}</p>
          <div className="flex gap-2">
            <Button onClick={joinMeeting} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => setStatus("idle")} variant="ghost">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {status === "joined" && (
        <div className="relative w-full">
          <Button
            onClick={leaveMeeting}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 z-10 gap-1"
          >
            <X className="h-3 w-3" />
            Leave
          </Button>
        </div>
      )}

      {/* Always mounted so the Zoom SDK can attach to it */}
      <div
        ref={meetingRef}
        className={`w-full min-h-[500px] rounded-xl overflow-hidden border-2 border-primary/30 bg-black ${status !== "joined" ? "hidden" : ""}`}
      />

      <div className="text-center">
        <p className="text-xl md:text-2xl font-bold text-foreground">Leave the Chaos Behind.</p>
        <p className="text-xl md:text-2xl font-bold text-primary">Find Clarity Ahead.</p>
      </div>
    </div>
  );
};

export default ZoomMeeting;
