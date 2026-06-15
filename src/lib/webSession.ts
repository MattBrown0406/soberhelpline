const STORAGE_KEY = "sh_web_session";
const COOKIE_KEY = "app_subscriber";
const SESSION_COOKIE_KEY = "app_subscriber_session";
const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60; // 1 hour rolling session

export const WEB_SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface WebSession {
  accountId: string;
  tier: string | null;
  firstName: string | null;
  expiresAt: number;
}

let memorySession: WebSession | null = null;

function getActiveMemorySession(): WebSession | null {
  if (!memorySession) return null;
  if (memorySession.expiresAt < Date.now()) {
    memorySession = null;
    return null;
  }
  return memorySession;
}

function setCookie(name: string, value: string, expiresAt: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(expiresAt).toUTCString();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

function setSessionCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; path=/; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const match = document.cookie.split("; ").find((c) => c.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

export function hasAppSubscriberCookie(): boolean {
  return getCookie(COOKIE_KEY) === "true";
}

export function hasAppSubscriberSessionCookie(): boolean {
  return getCookie(SESSION_COOKIE_KEY) === "1";
}

export function setAppSubscriberSessionCookie() {
  setSessionCookie(SESSION_COOKIE_KEY, "1", SESSION_COOKIE_MAX_AGE_SECONDS);
}

export function readWebSession(): WebSession | null {
  if (typeof window === "undefined") return null;
  const activeMemorySession = getActiveMemorySession();
  if (activeMemorySession) return activeMemorySession;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Cookie fallback (e.g. session cleared but cookie still valid)
      if (hasAppSubscriberCookie()) {
        return {
          accountId: "",
          tier: null,
          firstName: null,
          expiresAt: Date.now() + WEB_SESSION_DURATION_MS,
        };
      }
      return null;
    }
    const parsed = JSON.parse(raw) as WebSession;
    if (!parsed?.expiresAt || parsed.expiresAt < Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      deleteCookie(COOKIE_KEY);
      return null;
    }
    memorySession = parsed;
    return parsed;
  } catch {
    return getActiveMemorySession();
  }
}

export function writeWebSession(s: WebSession) {
  memorySession = s;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // iOS Safari can restrict storage in some app handoff contexts; inline SSO should still unlock immediately.
  }
  setCookie(COOKIE_KEY, "true", s.expiresAt);
  setSessionCookie(SESSION_COOKIE_KEY, "1", SESSION_COOKIE_MAX_AGE_SECONDS);
}

export function clearWebSession() {
  memorySession = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
  deleteCookie(COOKIE_KEY);
  deleteCookie(SESSION_COOKIE_KEY);
}

export const WEB_SESSION_STORAGE_KEY = STORAGE_KEY;
