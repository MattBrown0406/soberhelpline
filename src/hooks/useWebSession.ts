import { useEffect, useState } from "react";
import { readWebSession, WEB_SESSION_STORAGE_KEY, hasAppSubscriberCookie, hasAppSubscriberSessionCookie } from "@/lib/webSession";

export interface UseWebSessionResult {
  isSubscriber: boolean;
  tier: string | null;
  firstName: string | null;
  loading: boolean;
}

export function useWebSession(): UseWebSessionResult {
  const [session, setSession] = useState(() => readWebSession());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSession(readWebSession());

    const onFocus = () => setSession(readWebSession());
    const onStorage = (e: StorageEvent) => {
      if (e.key === WEB_SESSION_STORAGE_KEY) setSession(readWebSession());
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return {
    isSubscriber: !!session || hasAppSubscriberCookie(),
    tier: session?.tier ?? null,
    firstName: session?.firstName ?? null,
    loading,
  };
}
