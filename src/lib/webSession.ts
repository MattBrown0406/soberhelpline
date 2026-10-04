import { supabase } from "@/integrations/supabase/client";

// App -> website sign-in.
//
// The Sober Helpline app adds a one-time `sso_token` to soberhelpline.com links.
// The website's app-sso-exchange function redeems it server-side and returns a
// one-time sign-in (a magic-link token hash) for the app user's website account.
// Member pages are then gated by the website's own membership data.
//
// The website used to unlock member pages with an `app_subscriber` cookie /
// `sh_web_session` localStorage flag that anyone could set by hand. Those flags
// no longer mean anything; clearWebSession() removes leftovers.

const LEGACY_STORAGE_KEY = "sh_web_session";
const LEGACY_COOKIE_KEYS = ["app_subscriber", "app_subscriber_session"];
// Email of the account this tab was signed into from the app (for the
// "Signed in as …" notice). sessionStorage: per tab, survives reloads.
const SSO_EMAIL_KEY = "sh_app_sso_email";
// This tab was opened from the Sober Helpline app (from_app=1, or an app
// sign-in token): no website membership sales, and the "back to the app"
// buttons. Per tab, like the above.
const FROM_APP_KEY = "sh_from_app";
// The app that opened this tab understands sober-helpline://app/... deep links
// (app 4.0 (3)+ adds app_links=1; 4.0 (2) doesn't and shows "Unmatched Route").
const APP_LINKS_KEY = "sh_app_links";

/** Query parameters the app (4.0 (3)+) adds to every soberhelpline.com URL it opens. */
export const FROM_APP_PARAM = "from_app";
export const APP_LINKS_PARAM = "app_links";

/** The query parameter the app adds to soberhelpline.com links. */
export const SSO_TOKEN_PARAM = "sso_token";
/** Legacy token parameter, only on /sso (older app builds). */
const LEGACY_SSO_PATH = "/sso";
const LEGACY_SSO_TOKEN_PARAM = "t";

/**
 * The one-time app token in a URL: `?sso_token=` on any page, or the legacy
 * `/sso?t=` link. Empty string when there is none.
 */
export function readAppSsoToken(pathname: string, search: string): string {
  const params = new URLSearchParams(search);
  const token = params.get(SSO_TOKEN_PARAM)
    ?? (pathname === LEGACY_SSO_PATH ? params.get(LEGACY_SSO_TOKEN_PARAM) : null)
    ?? "";
  return token.trim();
}

/** The same URL (path + query + hash) without the app token. */
export function withoutAppSsoToken(pathname: string, search: string, hash: string): string {
  const params = new URLSearchParams(search);
  params.delete(SSO_TOKEN_PARAM);
  if (pathname === LEGACY_SSO_PATH) params.delete(LEGACY_SSO_TOKEN_PARAM);
  const query = params.toString();
  return `${pathname}${query ? `?${query}` : ""}${hash}`;
}

function urlSays(pathname: string, search: string) {
  const params = new URLSearchParams(search);
  const appLinks = params.get(APP_LINKS_PARAM) === "1";
  const fromApp = appLinks || params.get(FROM_APP_PARAM) === "1" || readAppSsoToken(pathname, search) !== "";
  return { fromApp, appLinks };
}

function storedFlag(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function storeFlag(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    // Storage can be unavailable (private mode); these marks are best-effort.
  }
}

/**
 * Remember what this URL says about the app, for the rest of the tab:
 * opened from the app (from_app=1, app_links=1, or an app sign-in token) and
 * whether that app build understands sober-helpline://app/... links.
 * Called by AppSsoHandoff on every page.
 */
export function rememberAppVisit(pathname: string, search: string) {
  const { fromApp, appLinks } = urlSays(pathname, search);
  if (fromApp) storeFlag(FROM_APP_KEY);
  if (appLinks) storeFlag(APP_LINKS_KEY);
}

const currentUrlSays = () =>
  typeof window === "undefined" ? { fromApp: false, appLinks: false } : urlSays(window.location.pathname, window.location.search);

/** Was this tab opened from the Sober Helpline app? (Also true on the landing URL before it's remembered.) */
export function arrivedFromApp(): boolean {
  return storedFlag(FROM_APP_KEY) || currentUrlSays().fromApp;
}

/** Does the app that opened this tab understand sober-helpline://app/... links? */
export function appLinksSupported(): boolean {
  return storedFlag(APP_LINKS_KEY) || currentUrlSays().appLinks;
}

/** Query string (without "?") that carries the app marks through a round trip (e.g. PayPal). */
export function appVisitQuery(): string {
  const params = new URLSearchParams();
  if (arrivedFromApp()) params.set(FROM_APP_PARAM, "1");
  if (appLinksSupported()) params.set(APP_LINKS_PARAM, "1");
  return params.toString();
}

/** Remove the legacy client-side "app subscriber" flags if a browser still has them. */
export function clearWebSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
  for (const name of LEGACY_COOKIE_KEYS) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

/** Remember that this tab was signed in from the app as `email`. */
export function rememberSsoSignIn(email: string) {
  try {
    sessionStorage.setItem(SSO_EMAIL_KEY, email.toLowerCase());
  } catch {
    // Storage can be unavailable (private mode); the notice is best-effort.
  }
}

/** The email this tab was signed into from the app, if any. */
export function getSsoSignedInEmail(): string | null {
  try {
    return sessionStorage.getItem(SSO_EMAIL_KEY);
  } catch {
    return null;
  }
}

export function clearSsoSignIn() {
  try {
    sessionStorage.removeItem(SSO_EMAIL_KEY);
  } catch {
    // Ignore.
  }
}

/**
 * - "expired": the token was already used, too old, or unknown.
 * - "unavailable": something failed on our side; the user can retry or sign in.
 * - "password_required": a website staff account; it must sign in with its password.
 */
export type AppSsoFailure = "expired" | "unavailable" | "password_required";

/**
 * Result of redeeming an app `sso_token`. Redeeming does NOT sign the browser in;
 * completeAppSsoSignIn() does, so the caller can first ask before replacing a
 * different signed-in account. appMember / membershipReady are informational
 * (messaging only); access is decided by the website membership.
 */
export interface AppSsoExchange {
  ok: boolean;
  /** Set when ok is false. */
  reason: AppSsoFailure | null;
  /** Login email of the app user's website account (lowercase). */
  email: string | null;
  tokenHash: string | null;
  appMember: boolean;
  membershipReady: boolean;
}

const SSO_TOKEN_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const failed = (reason: AppSsoFailure): AppSsoExchange => ({
  ok: false,
  reason,
  email: null,
  tokenHash: null,
  appMember: false,
  membershipReady: false,
});

// One redemption per token and one sign-in per token hash: both are single-use,
// and React may run effects twice. Only the site-wide AppSsoHandoff calls these.
const exchanges = new Map<string, Promise<AppSsoExchange>>();
const signIns = new Map<string, Promise<boolean>>();

async function readFunctionErrorCode(error: unknown): Promise<string | null> {
  const context = (error as { context?: unknown } | null)?.context;
  if (typeof Response !== "undefined" && context instanceof Response) {
    try {
      const body = await context.clone().json();
      return typeof body?.code === "string" ? body.code : null;
    } catch {
      return null;
    }
  }
  return null;
}

async function runExchange(token: string): Promise<AppSsoExchange> {
  if (!SSO_TOKEN_RE.test(token)) return failed("expired");
  try {
    const { data, error } = await supabase.functions.invoke("app-sso-exchange", {
      body: { sso_token: token },
    });
    if (error || !data?.ok || typeof data.token_hash !== "string" || typeof data.email !== "string") {
      const code = data?.code ?? (await readFunctionErrorCode(error));
      if (code === "password_signin_required") return failed("password_required");
      const expired = code === "invalid_or_expired" || code === "invalid_token";
      return failed(expired ? "expired" : "unavailable");
    }
    return {
      ok: true,
      reason: null,
      email: data.email.toLowerCase(),
      tokenHash: data.token_hash,
      appMember: data.app_member === true,
      membershipReady: data.membership_ready !== false,
    };
  } catch {
    return failed("unavailable");
  }
}

/** Redeem an app token (once per token). Does not change the browser session. */
export function exchangeAppSsoToken(token: string): Promise<AppSsoExchange> {
  const key = token.trim();
  let pending = exchanges.get(key);
  if (!pending) {
    pending = runExchange(key);
    exchanges.set(key, pending);
  }
  return pending;
}

/** Sign the browser in as the redeemed app account. Returns false if it failed. */
export function completeAppSsoSignIn(exchange: AppSsoExchange): Promise<boolean> {
  if (!exchange.ok || !exchange.tokenHash || !exchange.email) return Promise.resolve(false);
  const { tokenHash, email } = exchange;
  let pending = signIns.get(tokenHash);
  if (!pending) {
    pending = (async () => {
      try {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "magiclink" });
        if (error) return false;
        rememberSsoSignIn(email);
        return true;
      } catch {
        return false;
      }
    })();
    signIns.set(tokenHash, pending);
  }
  return pending;
}
