import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-8VLPQVGME4";

type GtagFn = (...args: unknown[]) => void;

export default function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
    if (typeof gtag !== "function") return;

    gtag("config", GA_MEASUREMENT_ID, {
      page_path: `${location.pathname}${location.search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return null;
}
