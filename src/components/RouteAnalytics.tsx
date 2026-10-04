import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { withoutAppSsoToken } from "@/lib/webSession";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-YFGSJD0F35";

type GtagFn = (...args: unknown[]) => void;

export default function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
    if (typeof gtag !== "function") return;

    // Never send the app's one-time sign-in token (?sso_token=) to analytics.
    const pagePath = withoutAppSsoToken(location.pathname, location.search, "");
    gtag("config", GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_location: `${window.location.origin}${pagePath}`,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return null;
}
