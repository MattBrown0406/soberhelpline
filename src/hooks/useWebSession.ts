import { useEffect, useState } from "react";
import { readWebSession, WEB_SESSION_STORAGE_KEY } from "@/lib/webSession";

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
    const onStorage = (e: StorageEvent) => {
      if (e.key === WEB_SESSION_STORAGE_KEY) setSession(readWebSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return {
    isSubscriber: !!session,
    tier: session?.tier ?? null,
    firstName: session?.firstName ?? null,
    loading,
  };
}
