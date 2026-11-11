import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// One saved answer sheet per member per tool. Everything a member types into a
// tool, worksheet or guide reflection lives in ONE object that is saved
// automatically:
//
// - signed in: to her account (worksheet_responses, one row per tool key), a
//   moment after she stops typing, and again when she leaves the page;
// - signed out: in this browser only, so a visitor doesn't lose her work on a
//   reload. It moves to her account the first time she opens the tool signed in.
//
// A failed load never overwrites what is already saved: if we couldn't read
// her saved copy, we don't write over it.

export type SavedToolStatus = "loading" | "idle" | "saving" | "saved" | "error" | "local";

export interface SavedTool<T> {
  /** Her answers. Starts as `initial` until the saved copy has loaded. */
  data: T;
  /** Replace the answers (value or updater). */
  setData: (next: T | ((prev: T) => T)) => void;
  /** Merge a few fields into the answers. */
  patch: (partial: Partial<T>) => void;
  /** Clear everything back to a blank sheet (also clears the saved copy). */
  reset: () => void;
  status: SavedToolStatus;
  /** False until the saved copy (if any) has been loaded. */
  loaded: boolean;
  signedIn: boolean;
  lastSavedAt: Date | null;
  /** True once she has changed anything since the sheet was blank. */
  hasContent: boolean;
}

const SAVE_DELAY_MS = 1200;
const localKey = (key: string) => `saved_tool:${key}`;

interface LocalCopy<T> {
  data: T;
  updatedAt: string;
}

function readLocal<T>(key: string): LocalCopy<T> | null {
  try {
    const raw = localStorage.getItem(localKey(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocalCopy<T>;
    return parsed && typeof parsed === "object" && parsed.data && typeof parsed.updatedAt === "string" ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocal<T>(key: string, data: T) {
  try {
    localStorage.setItem(localKey(key), JSON.stringify({ data, updatedAt: new Date().toISOString() }));
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

export function useSavedTool<T extends object>(key: string, initial: T): SavedTool<T> {
  const initialRef = useRef(initial);
  const [data, setDataState] = useState<T>(initial);
  const [status, setStatus] = useState<SavedToolStatus>("loading");
  const [loaded, setLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasContent, setHasContent] = useState(false);

  const dataRef = useRef<T>(initial);
  const userIdRef = useRef<string | null>(null);
  // Only write to the account once we know what is (or isn't) saved there.
  const remoteReadyRef = useRef(false);
  const dirtyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const saveRemote = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid || !remoteReadyRef.current || !dirtyRef.current) return;
    dirtyRef.current = false;
    if (mountedRef.current) setStatus("saving");
    const { error } = await supabase.from("worksheet_responses").upsert(
      {
        user_id: uid,
        worksheet_key: key,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responses: dataRef.current as any,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,worksheet_key" },
    );
    if (error) {
      dirtyRef.current = true;
      // Keep a copy in this browser so nothing is lost while saving is failing.
      writeLocal(key, dataRef.current);
      if (mountedRef.current) setStatus("error");
      return;
    }
    // Saved to her account: don't leave a copy behind on a shared computer.
    if (!dirtyRef.current) clearLocal(key);
    if (mountedRef.current) {
      setLastSavedAt(new Date());
      setStatus("saved");
    }
  }, [key]);

  // Load: who is signed in, and what is already saved.
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      const uid = session?.user?.id ?? null;
      userIdRef.current = uid;
      setUserId(uid);

      const local = readLocal<T>(key);

      if (!uid) {
        if (local) {
          dataRef.current = withDefaults(initialRef.current, local.data);
          setDataState(dataRef.current);
          setHasContent(true);
        }
        setStatus(local ? "local" : "idle");
        setLoaded(true);
        return;
      }

      const { data: row, error } = await supabase
        .from("worksheet_responses")
        .select("responses, updated_at")
        .eq("user_id", uid)
        .eq("worksheet_key", key)
        .maybeSingle();
      if (cancelled) return;

      if (error) {
        // We don't know what is saved, so we must not write over it.
        remoteReadyRef.current = false;
        if (local) {
          dataRef.current = withDefaults(initialRef.current, local.data);
          setDataState(dataRef.current);
          setHasContent(true);
        }
        setStatus("error");
        setLoaded(true);
        return;
      }

      remoteReadyRef.current = true;
      const remoteAt = row?.updated_at ? Date.parse(row.updated_at) : 0;
      const localAt = local ? Date.parse(local.updatedAt) : 0;

      if (local && localAt > remoteAt) {
        // Typed while signed out, or a save that didn't reach the account.
        dataRef.current = withDefaults(initialRef.current, local.data);
        setDataState(dataRef.current);
        setHasContent(true);
        dirtyRef.current = true;
        setLoaded(true);
        void saveRemote();
        return;
      }

      if (row?.responses) {
        dataRef.current = withDefaults(initialRef.current, row.responses);
        setDataState(dataRef.current);
        setHasContent(true);
        setLastSavedAt(new Date(remoteAt));
      }
      if (local) clearLocal(key);
      setStatus("idle");
      setLoaded(true);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [key, saveRemote]);

  // Save what's pending when she leaves the page or switches away.
  useEffect(() => {
    const flush = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      void saveRemote();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      mountedRef.current = false;
      flush();
    };
  }, [saveRemote]);

  const commit = useCallback(
    (next: T) => {
      dataRef.current = next;
      setDataState(next);
      setHasContent(true);
      dirtyRef.current = true;
      if (!userIdRef.current || !remoteReadyRef.current) {
        writeLocal(key, next);
        if (!userIdRef.current) setStatus("local");
        return;
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        void saveRemote();
      }, SAVE_DELAY_MS);
    },
    [key, saveRemote],
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
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    dataRef.current = initialRef.current;
    setDataState(initialRef.current);
    setHasContent(false);
    dirtyRef.current = false;
    clearLocal(key);
    const uid = userIdRef.current;
    if (uid && remoteReadyRef.current) {
      setStatus("saving");
      supabase
        .from("worksheet_responses")
        .delete()
        .eq("user_id", uid)
        .eq("worksheet_key", key)
        .then(({ error }) => {
          if (!mountedRef.current) return;
          setLastSavedAt(null);
          setStatus(error ? "error" : "idle");
        });
    } else {
      setStatus("idle");
    }
  }, [key]);

  return { data, setData, patch, reset, status, loaded, signedIn: !!userId, lastSavedAt, hasContent };
}
