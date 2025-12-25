import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Generate or retrieve a session ID for anonymous tracking
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("guide_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("guide_session_id", sessionId);
  }
  return sessionId;
};

export const useGuideTracking = (guidePath: string, guideName: string) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per page load
    if (hasTracked.current) return;
    hasTracked.current = true;

    const trackView = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const sessionId = getSessionId();

        await supabase.from("guide_views").insert({
          guide_path: guidePath,
          guide_name: guideName,
          user_id: user?.id || null,
          session_id: sessionId,
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience for analytics
        console.error("Failed to track guide view:", error);
      }
    };

    trackView();
  }, [guidePath, guideName]);
};
