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
  requireAuth?: boolean;
  onMeetingEnd?: () => void;
}

const ZoomMeeting = ({
  meetingNumber,
  password = "",
  userName,
  role = 0,
  isAuthenticated = false,
  requireAuth = false,
  onMeetingEnd,
}: ZoomMeetingProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "joined" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [participantCount, setParticipantCount] = useState(0);
  const [guestFirstName, setGuestFirstName] = useState("");
  const [guestLastName, setGuestLastName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const meetingRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<any>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sanitizedPassword = password.trim();
  const fallbackJoinUrl = `https://zoom.us/wc/join/${encodeURIComponent(meetingNumber)}${sanitizedPassword ? `?pwd=${encodeURIComponent(sanitizedPassword)}` : ""}`;

  const joinMeeting = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      timeoutRef.current = setTimeout(() => {
        if (clientRef.current) {
          try {
            clientRef.current.leaveMeeting();
          } catch {}
        }
        setErrorMessage("Connection is taking too long. Please check your internet connection and try again.");
        setStatus("error");
      }, 45000);

      const ZoomMtgEmbedded = (await import("@zoom/meetingsdk/embedded")).default;
      const client = ZoomMtgEmbedded.createClient();
      clientRef.current = client;

      if (!meetingRef.current) {
        throw new Error("Meeting container not ready. Please try again.");
      }

      await client.init({
        zoomAppRoot: meetingRef.current,
        language: "en-US",
        patchJsMedia: true,
        leaveOnPageUnload: true,
        customize: {
          video: {
            defaultViewType: "gallery" as any,
          },
        },
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (requireAuth && !session) {
        throw new Error("You must be logged in to join this meeting");
      }

      const guestFullName = `${guestFirstName.trim()} ${guestLastName.trim()}`.trim();
      const cleanGuestEmail = guestEmail.trim().toLowerCase();

      const response = await supabase.functions.invoke("generate-zoom-signature", {
        body: {
          meetingNumber,
          role,
          ...(!isAuthenticated ? { guestEmail: cleanGuestEmail, guestName: guestFullName } : {}),
        },
        ...(session ? { headers: { Authorization: `Bearer ${session.access_token}` } } : {}),
      });

      if (response.error) {
        // Surface 403/blocklist errors as a clear message
        const msg = (response.error as any).message || "Failed to get meeting signature";
        if (/not able to join/i.test(msg)) {
          throw new Error("You are not able to join this meeting. Please contact matt@soberhelpline.com.");
        }
        throw new Error(msg);
      }

      const { signature, sdkKey } = response.data;

      client.on("connection-change", (payload: { state: string }) => {
        if (payload.state === "Closed") {
          onMeetingEnd?.();
        }
      });

      client.on("user-added", (payload: any) => {
        setParticipantCount((prev) => prev + (Array.isArray(payload) ? payload.length : 1));
      });

      client.on("user-removed", (payload: any) => {
        setParticipantCount((prev) => Math.max(0, prev - (Array.isArray(payload) ? payload.length : 1)));
      });

      client.on("recording-change", (payload: any) => {
        console.log("Recording state changed:", payload.state);
      });

      const finalUserName = !isAuthenticated && guestFullName.length >= 2
        ? guestFullName
        : (userName.trim() || "Guest");
      const finalUserEmail = session?.user?.email || (!isAuthenticated ? cleanGuestEmail : "");

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStatus("joined");

      await client.join({
        signature,
        sdkKey,
        meetingNumber,
        password: sanitizedPassword,
        userName: finalUserName,
        ...(finalUserEmail ? { userEmail: finalUserEmail } : {}),
      });
    } catch (err: any) {
      console.error("Zoom meeting error:", err);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const rawMessage = err?.message || err?.reason || String(err);
      const lower = rawMessage.toLowerCase();
      const notStarted =
        lower.includes("not start") ||
        lower.includes("not exist") ||
        lower.includes("meeting not") ||
        lower.includes("3001") ||
        lower.includes("invalid meeting");
      const needsPasscodeHelp = /passcode|password/i.test(rawMessage);

      setErrorMessage(
        notStarted
          ? "The meeting hasn't started yet. Please wait a few minutes and try again, the host will open the room shortly."
          : needsPasscodeHelp
            ? "We couldn't launch the embedded meeting cleanly. Use the fallback join button below if Zoom asks for a passcode."
            : rawMessage || "Failed to join meeting. Please try refreshing the page."
      );
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

  const showGuestPrompt = !isAuthenticated && role === 0;
  const isNotStartedState = errorMessage.includes("hasn't started yet");

  return (
    <div className="flex flex-col items-center gap-4">
      {status === "idle" && (
        <div className="flex flex-col items-center gap-4 p-8 bg-muted/30 rounded-xl border w-full">
          <Video className="h-12 w-12 text-primary" />
          <h3 className="text-lg font-semibold">Ready to Join</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Click below to join the video session directly in your browser. No downloads required.
          </p>

          {showGuestPrompt && (
            <div className="w-full max-w-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="First name"
                  value={guestFirstName}
                  onChange={(e) => setGuestFirstName(e.target.value)}
                  maxLength={50}
                />
                <Input
                  placeholder="Last name"
                  value={guestLastName}
                  onChange={(e) => setGuestLastName(e.target.value)}
                  maxLength={50}
                />
              </div>
              <Input
                type="email"
                placeholder="Email address"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                maxLength={255}
              />
              <p className="text-xs text-muted-foreground text-center">No account needed — required to join</p>
            </div>
          )}

          <Button
            onClick={joinMeeting}
            size="lg"
            className="gap-2"
            disabled={
              showGuestPrompt &&
              (guestFirstName.trim().length < 1 ||
                guestLastName.trim().length < 1 ||
                !/^\S+@\S+\.\S+$/.test(guestEmail.trim()))
            }
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
          isNotStartedState
            ? "bg-amber-500/5 border-amber-500/20"
            : "bg-destructive/5 border-destructive/20"
        }`}>
          {isNotStartedState && <Clock className="h-10 w-10 text-amber-500" />}
          <p className={`${isNotStartedState ? "text-amber-700" : "text-destructive"} font-medium text-center`}>
            {errorMessage}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={joinMeeting} variant="outline">Try Again</Button>
            <Button asChild>
              <a href={fallbackJoinUrl} target="_blank" rel="noreferrer">Open Zoom Fallback</a>
            </Button>
            <Button onClick={() => setStatus("idle")} variant="ghost">Cancel</Button>
          </div>
          {sanitizedPassword && !isNotStartedState && (
            <p className="text-xs text-muted-foreground text-center max-w-md">
              If Zoom still prompts for a passcode, the fallback link above includes it automatically.
            </p>
          )}
        </div>
      )}

      {status === "joined" && (
        <div className="relative w-full flex items-center justify-end gap-2">
          {participantCount > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-foreground/10 text-foreground font-medium">
              {participantCount} in meeting
            </span>
          )}
          <Button onClick={leaveMeeting} variant="destructive" size="sm" className="gap-1">
            <X className="h-3 w-3" />
            Leave
          </Button>
        </div>
      )}

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
