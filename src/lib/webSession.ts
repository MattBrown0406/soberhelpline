const STORAGE_KEY = "sh_web_session";

export interface WebSession {
  accountId: string;
  tier: string | null;
  firstName: string | null;
  expiresAt: number;
}

export function readWebSession(): WebSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WebSession;
    if (!parsed?.expiresAt || parsed.expiresAt < Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeWebSession(s: WebSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function clearWebSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export const WEB_SESSION_STORAGE_KEY = STORAGE_KEY;
