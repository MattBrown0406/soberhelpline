import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// One saved answer sheet per member per tool. Everything a member types into a
// tool, worksheet or guide reflection lives in ONE object that is saved
// automatically:
//
// - signed in: to her account (worksheet_responses, one row per tool key), a
//   moment after she stops typing, and again when she leaves the page;
// - signed out: in this browser only, so a visitor doesn't lose her work on a
//   reload. It moves to her account the first time she opens the tool signed
//   in, if nothing is saved there yet.
//
// Rules that protect what is already saved:
// - Her saved copy is never replaced by a draft that was typed without seeing
//   it (signed out, or while the saved copy couldn't be loaded). Such a draft
//   only fills in answers that are still blank.
// - A copy left on this device by one account is never shown to, or saved
//   into, another account.
// - If who is signed in changes while the page is open, the sheet is cleared
//   and loaded again for the new person.

export type SavedToolStatus = "loading" | "idle" | "saving" | "saved" | "error" | "local";

export interface SavedTool<T> {
  /** Her answers. Starts as `initial` until the saved copy has loaded. */
  data: T;
  /** Replace the answers (value or updater). Ignored until `loaded`. */
  setData: (next: T | ((prev: T) => T)) => void;
  /** Merge a few fields into the answers. Ignored until `loaded`. */
  patch: (partial: Partial<T>) => void;
  /** Clear everything back to a blank sheet (also clears the saved copy). */
  reset: () => void;
  status: SavedToolStatus;
  /** False until the saved copy (if any) has been loaded. Keep fields disabled until then. */
  loaded: boolean;
  signedIn: boolean;
  lastSavedAt: Date | null;
  /** True once she has changed anything since the sheet was blank. */
  hasContent: boolean;
}

const SAVE_DELAY_MS = 1200;
const RETRY_MIN_MS = 8000;
const RETRY_MAX_MS = 60000;
const localKey = (key: string) => `saved_tool:${key}`;

interface LocalCopy<T> {
  data: T;
  updatedAt: string;
  /** Whose copy this is: an account id, or null for a signed-out visitor. */
  owner: string | null;
  /** Typed while her saved copy couldn't be loaded, so it may be missing most of her answers. */
  blind?: boolean;
}

function readLocal<T>(key: string): LocalCopy<T> | null {
  try {
    const raw = localStorage.getItem(localKey(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LocalCopy<T>> | null;
    if (!parsed || typeof parsed !== "object" || !parsed.data || typeof parsed.updatedAt !== "string") return null;
    return {
      data: parsed.data,
      updatedAt: parsed.updatedAt,
      owner: typeof parsed.owner === "string" ? parsed.owner : null,
      blind: parsed.blind === true,
    };
  } catch {
    return null;
  }
}

function writeLocal<T>(key: string, data: T, owner: string | null, blind: boolean) {
  try {
    const copy: LocalCopy<T> = { data, updatedAt: new Date().toISOString(), owner, blind };
    localStorage.setItem(localKey(key), JSON.stringify(copy));
  } catch {
    // Storage full or unavailable (private mode): nothing else to do.
  }
}

function clearLocal(key: string) {
  try {
    localStorage.removeItem(localKey(key));
  } catch {
    // ignore
  }
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

/** Saved answers on top of the blank sheet, so new fields get their defaults. */
function withDefaults<T extends object>(initial: T, saved: unknown): T {
  return isPlainObject(saved) ? ({ ...initial, ...saved } as T) : initial;
}

const isBlank = (value: unknown): boolean =>
  value == null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0) ||
  (isPlainObject(value) && Object.keys(value).length === 0);

/** The saved copy, with the draft used only where the saved copy has nothing. */
function fillBlanks<T extends object>(saved: T, draft: T): T {
  const out = { ...saved } as Record<string, unknown>;
  for (const [field, value] of Object.entries(draft as Record<string, unknown>)) {
    if (isBlank(out[field]) && !isBlank(value)) out[field] = value;
  }
  return out as T;
}

export function useSavedTool<T extends object>(key: string, initial: T): SavedTool<T> {
  const initialRef = useRef(initial);
  const [data, setDataState] = useState<T>(initial);
  const [status, setStatus] = useState<SavedToolStatus>("loading");
  const [loaded, setLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasContent, setHasContent] = useState(false);
  // Bumped to load again: after a failed load, or when who is signed in changes.
  const [reloadNonce, setReloadNonce] = useState(0);

  const dataRef = useRef<T>(initial);
  const userIdRef = useRef<string | null>(null);
  const loadedRef = useRef(false);
  // Only write to the account once we know what is (or isn't) saved there.
  const remoteReadyRef = useRef(false);
  const loadFailedRef = useRef(false);
  // When the saved row we last loaded or wrote was written (ms), to notice a newer one.
  const remoteAtRef = useRef(0);
  const dirtyRef = useRef(false);
  const deletePendingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryDelayRef = useRef(RETRY_MIN_MS);
  const mountedRef = useRef(true);
  // Saves, deletes and refreshes run one at a time, in order.
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const saveRemoteRef = useRef<() => void>(() => {});

  const scheduleRetry = useCallback(() => {
    if (!mountedRef.current || retryTimerRef.current) return;
    const delay = retryDelayRef.current;
    retryDelayRef.current = Math.min(delay * 2, RETRY_MAX_MS);
    retryTimerRef.current = setTimeout(() => {
      retryTimerRef.current = null;
      if (!mountedRef.current) return;
      if (loadFailedRef.current) setReloadNonce((n) => n + 1);
      else saveRemoteRef.current();
    }, delay);
  }, []);

  const runSave = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid || !remoteReadyRef.current) return;

    if (deletePendingRef.current) {
      if (mountedRef.current) setStatus("saving");
      const { error } = await supabase.from("worksheet_responses").delete().eq("user_id", uid).eq("worksheet_key", key);
      if (userIdRef.current !== uid) return;
      if (error) {
        if (mountedRef.current) setStatus("error");
        scheduleRetry();
        return;
      }
      deletePendingRef.current = false;
      remoteAtRef.current = 0;
      if (mountedRef.current) setLastSavedAt(null);
      if (!dirtyRef.current) {
        if (mountedRef.current) setStatus("idle");
        return;
      }
      // She started typing again after clearing: carry on and save that.
    }

    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    const at = new Date();
    if (mountedRef.current) setStatus("saving");
    const { error } = await supabase.from("worksheet_responses").upsert(
      {
        user_id: uid,
        worksheet_key: key,
        responses: dataRef.current as any,
        updated_at: at.toISOString(),
      },
      { onConflict: "user_id,worksheet_key" },
    );
    // Signed out or switched account while this was in flight: not ours to finish.
    if (userIdRef.current !== uid) return;
    if (error) {
      dirtyRef.current = true;
      // Keep her own copy in this browser so nothing is lost while saving is failing.
      writeLocal(key, dataRef.current, uid, false);
      if (mountedRef.current) setStatus("error");
      scheduleRetry();
      return;
    }
    retryDelayRef.current = RETRY_MIN_MS;
    remoteAtRef.current = at.getTime();
    // Saved to her account: don't leave a copy behind on a shared computer.
    if (!dirtyRef.current) clearLocal(key);
    if (mountedRef.current) {
      setLastSavedAt(at);
      setStatus("saved");
    }
  }, [key, scheduleRetry]);

  const saveRemote = useCallback(() => {
    queueRef.current = queueRef.current.then(runSave).catch(() => {});
  }, [runSave]);
  saveRemoteRef.current = saveRemote;

  // Load: who is signed in, and what is already saved.
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const adopt = (next: T, savedAt: number | null) => {
      dataRef.current = next;
      setDataState(next);
      setHasContent(true);
      if (savedAt) setLastSavedAt(new Date(savedAt));
    };
    const finish = () => {
      loadedRef.current = true;
      setLoaded(true);
    };

    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      const uid = session?.user?.id ?? null;
      userIdRef.current = uid;
      setUserId(uid);

      let local = readLocal<T>(key);
      // A copy left on this device by a different account is never shown or adopted.
      if (local && local.owner && local.owner !== uid) {
        if (uid) clearLocal(key);
        local = null;
      }

      if (!uid) {
        remoteReadyRef.current = false;
        loadFailedRef.current = false;
        if (local) adopt(withDefaults(initialRef.current, local.data), null);
        setStatus(local ? "local" : "idle");
        finish();
        return;
      }

      const { data: row, error } = await supabase
        .from("worksheet_responses")
        .select("responses, updated_at")
        .eq("user_id", uid)
        .eq("worksheet_key", key)
        .maybeSingle();
      if (cancelled || userIdRef.current !== uid) return;

      if (error) {
        // We don't know what is saved, so we must not write over it. What she
        // types now is kept on this device and merged in once loading works.
        remoteReadyRef.current = false;
        loadFailedRef.current = true;
        if (local) adopt(withDefaults(initialRef.current, local.data), null);
        setStatus("error");
        finish();
        scheduleRetry();
        return;
      }

      loadFailedRef.current = false;
      remoteReadyRef.current = true;
      retryDelayRef.current = RETRY_MIN_MS;
      const remoteAt = row?.updated_at ? Date.parse(row.updated_at) : 0;
      remoteAtRef.current = remoteAt;
      const rowData = row?.responses ? withDefaults(initialRef.current, row.responses) : null;

      let next: T | null = rowData;
      let upload = false;
      if (local) {
        const draft = withDefaults(initialRef.current, local.data);
        const mine = local.owner === uid;
        if (!rowData) {
          // Nothing saved yet: keep the draft (hers, or typed before signing in).
          next = draft;
          upload = true;
        } else if (mine && local.blind) {
          // Typed while her saved copy couldn't be loaded: fill blanks only.
          next = fillBlanks(rowData, draft);
          upload = true;
        } else if (mine && Date.parse(local.updatedAt) > remoteAt) {
          // Her own latest answers that didn't reach the account.
          next = draft;
          upload = true;
        }
        // Otherwise (a signed-out draft, and she already has a saved copy):
        // the saved copy stands.
        if (!upload) clearLocal(key);
      }

      if (next) adopt(next, rowData ? remoteAt : null);
      finish();
      if (upload) {
        dirtyRef.current = true;
        saveRemoteRef.current();
      } else {
        setStatus("idle");
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [key, reloadNonce, scheduleRetry]);

  // If who is signed in changes while the page is open (sign out, or a
  // different account), never leave the previous person's answers on screen or
  // save them to the wrong account: clear the sheet and load again.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      if (!loadedRef.current || uid === userIdRef.current) return;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const previous = userIdRef.current;
      // A signed-out draft stays on the device for the load to pick up; an
      // account's unsaved answers are kept under that account only.
      if (previous && dirtyRef.current) writeLocal(key, dataRef.current, previous, !remoteReadyRef.current);
      dirtyRef.current = false;
      deletePendingRef.current = false;
      remoteReadyRef.current = false;
      loadFailedRef.current = false;
      loadedRef.current = false;
      userIdRef.current = uid;
      dataRef.current = initialRef.current;
      setDataState(initialRef.current);
      setHasContent(false);
      setLastSavedAt(null);
      setLoaded(false);
      setStatus("loading");
      setReloadNonce((n) => n + 1);
    });
    return () => subscription.unsubscribe();
  }, [key]);

  // Leaving or hiding the page: save what's pending. Coming back to it: pick up
  // a newer copy saved from another tab or device, so a stale tab can't
  // overwrite it. Back online: retry straight away.
  useEffect(() => {
    const flush = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const uid = userIdRef.current;
      // In case the request doesn't finish before the tab closes.
      if (uid && remoteReadyRef.current && dirtyRef.current) writeLocal(key, dataRef.current, uid, false);
      saveRemoteRef.current();
    };

    const refreshIfNewer = async () => {
      const uid = userIdRef.current;
      if (!uid || !remoteReadyRef.current || dirtyRef.current || deletePendingRef.current || timerRef.current) return;
      const { data: row, error } = await supabase
        .from("worksheet_responses")
        .select("responses, updated_at")
        .eq("user_id", uid)
        .eq("worksheet_key", key)
        .maybeSingle();
      if (error || !row?.responses || !mountedRef.current) return;
      if (userIdRef.current !== uid || dirtyRef.current || timerRef.current) return;
      const at = Date.parse(row.updated_at);
      if (!(at > remoteAtRef.current)) return;
      remoteAtRef.current = at;
      dataRef.current = withDefaults(initialRef.current, row.responses);
      setDataState(dataRef.current);
      setHasContent(true);
      setLastSavedAt(new Date(at));
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
      else queueRef.current = queueRef.current.then(refreshIfNewer).catch(() => {});
    };
    const onOnline = () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      retryDelayRef.current = RETRY_MIN_MS;
      if (loadFailedRef.current) setReloadNonce((n) => n + 1);
      else saveRemoteRef.current();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    window.addEventListener("online", onOnline);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("online", onOnline);
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      mountedRef.current = false;
      flush();
    };
  }, [key]);

  const commit = useCallback(
    (next: T) => {
      // Fields are disabled until her saved copy has loaded; this is the backstop.
      if (!loadedRef.current) return;
      dataRef.current = next;
      setDataState(next);
      setHasContent(true);
      dirtyRef.current = true;
      const uid = userIdRef.current;
      if (!uid) {
        writeLocal(key, next, null, false);
        setStatus("local");
        return;
      }
      if (!remoteReadyRef.current) {
        // Her saved copy couldn't be loaded: keep this on the device, marked so
        // it can only fill blanks when the saved copy does load.
        writeLocal(key, next, uid, true);
        return;
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        saveRemoteRef.current();
      }, SAVE_DELAY_MS);
    },
    [key],
  );

  const setData = useCallback(
    (next: T | ((prev: T) => T)) => {
      commit(typeof next === "function" ? (next as (prev: T) => T)(dataRef.current) : next);
    },
    [commit],
  );

  const patch = useCallback(
    (partial: Partial<T>) => {
      commit({ ...dataRef.current, ...partial });
    },
    [commit],
  );

  const reset = useCallback(() => {
    if (!loadedRef.current) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    dataRef.current = initialRef.current;
    setDataState(initialRef.current);
    setHasContent(false);
    dirtyRef.current = false;
    clearLocal(key);
    if (userIdRef.current && remoteReadyRef.current) {
      // Goes through the same queue as saves, so a save already on its way
      // can't land after the delete and bring the answers back.
      deletePendingRef.current = true;
      saveRemoteRef.current();
    } else {
      setStatus("idle");
    }
  }, [key]);

  return { data, setData, patch, reset, status, loaded, signedIn: !!userId, lastSavedAt, hasContent };
}
