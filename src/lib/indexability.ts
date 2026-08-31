const NOINDEX_ROUTES = new Set([
  "/auth",
  "/sso",
  "/provider-application",
  "/provider-info",
  "/consultation-provider-dashboard",
  "/join-meeting",
  "/family-squares-kiosk",
  "/coaching-checkout",
  "/coaching-onboarding",
  "/onboarding-quiz",
  "/subscription/success",
  "/subscription/cancel",
  "/member-billing",
  "/membership/billing",
  "/cancel-membership",
  "/cancel",
  "/family-education",
  "/family-education/tracks",
  "/family-forum",
  "/family-webinars",
  "/survey",
  "/zoom-recordings",
  "/member-home",
  "/member-learning-paths",
  "/member-qa",
]);

const NOINDEX_PREFIXES = ["/admin/", "/family-forum/", "/poll/"];

const normalizeRoutePath = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
};

export function isNoIndexRoute(pathname: string): boolean {
  const normalized = normalizeRoutePath(pathname);
  return normalized === "/admin"
    || NOINDEX_ROUTES.has(normalized)
    || NOINDEX_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}
