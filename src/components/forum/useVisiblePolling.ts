import { useEffect, useRef } from "react";

/**
 * Calls `callback` every `intervalMs` while the browser tab is visible, and
 * once more when the tab becomes visible again. Pass `enabled = false` to pause.
 */
export function useVisiblePolling(callback: () => void | Promise<void>, intervalMs: number, enabled = true) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;
    const tick = () => {
      if (typeof document === "undefined" || document.visibilityState === "visible") {
        void callbackRef.current();
      }
    };
    const timer = window.setInterval(tick, intervalMs);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void callbackRef.current();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, enabled]);
}
