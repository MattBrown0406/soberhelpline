import { useCallback, useEffect, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { findLibraryItem, memberLibrary, LIBRARY_TYPE_TOTALS, type LibraryType } from "@/data/memberLibrary";
import { legacyPageRedirects } from "@/lib/legacyRedirects";

// A member's education progress (table education_progress, one row per
// resource path). The rows live in one shared store, so the member bar, the
// Education Center and the dashboard always agree, and a page that marks
// something complete updates every other place at once.

export interface ProgressEntry {
  id: string;
  resource_name: string;
  resource_path: string;
  resource_type: string;
  status: string;
  progress_percentage: number | null;
  completed_at: string | null;
  time_spent_seconds: number | null;
  updated_at?: string;
}

export interface ProgressStats {
  totalCompleted: number;
  totalStarted: number;
  totalResources: number;
  completionPercentage: number;
  byType: Record<LibraryType, { completed: number; total: number }>;
}

interface StoreState {
  userId: string | null;
  progress: ProgressEntry[];
  loading: boolean;
}

let state: StoreState = { userId: null, progress: [], loading: true };
const listeners = new Set<() => void>();
let loadedFor: string | null | undefined; // undefined = never loaded
let loading: Promise<void> | null = null;
let authSubscribed = false;
const pending = new Set<string>();

function setState(patch: Partial<StoreState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

/**
 * Guides that were merged into another guide keep their credit: progress
 * recorded under a retired address counts for the page that now holds that
 * content, unless she already has progress on that page itself.
 */
function withRetiredCredit(rows: ProgressEntry[]): ProgressEntry[] {
  const have = new Set(rows.map((r) => r.resource_path));
  const carried = new Map<string, ProgressEntry>();
  for (const row of rows) {
    const target = legacyPageRedirects[row.resource_path];
    if (!target || have.has(target) || !findLibraryItem(target)) continue;
    const already = carried.get(target);
    if (!already || (already.status !== "completed" && row.status === "completed")) {
      carried.set(target, { ...row, resource_path: target });
    }
  }
  return carried.size ? [...rows, ...carried.values()] : rows;
}

function sortByUpdated(rows: ProgressEntry[]): ProgressEntry[] {
  return [...rows].sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""));
}

function upsertLocal(row: ProgressEntry) {
  const others = state.progress.filter((p) => p.resource_path !== row.resource_path);
  setState({ progress: sortByUpdated([row, ...others]) });
}

async function load(force = false): Promise<void> {
  if (loading && !force) return loading;
  loading = (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id ?? null;
    if (!force && loadedFor !== undefined && loadedFor === uid) return;
    if (!uid) {
      loadedFor = null;
      setState({ userId: null, progress: [], loading: false });
      return;
    }
    if (uid !== state.userId) setState({ userId: uid, progress: [], loading: true });
    const { data, error } = await supabase
      .from("education_progress")
      .select("*")
      .eq("user_id", uid)
      .order("updated_at", { ascending: false });
    loadedFor = uid;
    setState({
      userId: uid,
      progress: !error && data ? sortByUpdated(withRetiredCredit(data as ProgressEntry[])) : [],
      loading: false,
    });
  })().finally(() => {
    loading = null;
  });
  return loading;
}

function subscribeAuth() {
  if (authSubscribed) return;
  authSubscribed = true;
  supabase.auth.onAuthStateChange((_event, session) => {
    const uid = session?.user?.id ?? null;
    if (loadedFor !== undefined && uid === loadedFor) return;
    // Deferred: Supabase calls inside this callback can deadlock the client.
    setTimeout(() => {
      void load(true);
    }, 0);
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;

/** Marks a resource as started (or refreshes when it was last opened). Never downgrades a completed one. */
async function markStartedImpl(resourceName: string, resourcePath: string, resourceType: string) {
  const uid = state.userId;
  if (!uid || pending.has(resourcePath)) return;
  const existing = state.progress.find((p) => p.resource_path === resourcePath);
  if (existing?.status === "completed") return;
  pending.add(resourcePath);
  const now = new Date().toISOString();
  try {
    if (existing) {
      const { error } = await supabase.from("education_progress").update({ updated_at: now }).eq("id", existing.id);
      if (!error) upsertLocal({ ...existing, updated_at: now });
      return;
    }
    const { data, error } = await supabase
      .from("education_progress")
      .upsert(
        {
          user_id: uid,
          resource_name: resourceName,
          resource_path: resourcePath,
          resource_type: resourceType,
          status: "in_progress",
          progress_percentage: 0,
          updated_at: now,
        },
        { onConflict: "user_id,resource_path", ignoreDuplicates: true },
      )
      .select();
    if (!error && data && data.length > 0) {
      upsertLocal(data[0] as ProgressEntry);
    } else if (!error) {
      // A row already existed (another tab): reload to pick it up.
      await load(true);
    }
  } finally {
    pending.delete(resourcePath);
  }
}

async function markCompletedImpl(resourceName: string, resourcePath: string, resourceType: string) {
  const uid = state.userId;
  if (!uid) return false;
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("education_progress")
    .upsert(
      {
        user_id: uid,
        resource_name: resourceName,
        resource_path: resourcePath,
        resource_type: resourceType,
        status: "completed",
        progress_percentage: 100,
        completed_at: now,
        updated_at: now,
      },
      { onConflict: "user_id,resource_path" },
    )
    .select()
    .single();
  if (error || !data) return false;
  upsertLocal(data as ProgressEntry);
  return true;
}

async function markIncompleteImpl(resourcePath: string) {
  const existing = state.progress.find((p) => p.resource_path === resourcePath);
  if (!existing) return true;
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("education_progress")
    .update({ status: "in_progress", progress_percentage: 0, completed_at: null, updated_at: now })
    .eq("id", existing.id);
  if (error) return false;
  upsertLocal({ ...existing, status: "in_progress", progress_percentage: 0, completed_at: null, updated_at: now });
  return true;
}

/** Progress stats over the member library registry (src/data/memberLibrary.ts). */
export function computeStats(progress: ProgressEntry[]): ProgressStats {
  const byPath = new Map(progress.map((p) => [p.resource_path, p]));
  const byType: ProgressStats["byType"] = {
    guide: { completed: 0, total: LIBRARY_TYPE_TOTALS.guide },
    worksheet: { completed: 0, total: LIBRARY_TYPE_TOTALS.worksheet },
    meditation: { completed: 0, total: LIBRARY_TYPE_TOTALS.meditation },
  };
  let completed = 0;
  let started = 0;
  for (const item of memberLibrary) {
    const row = byPath.get(item.path);
    if (!row) continue;
    if (row.status === "completed") {
      completed += 1;
      byType[item.type].completed += 1;
    } else {
      started += 1;
    }
  }
  const total = memberLibrary.length;
  return {
    totalCompleted: completed,
    totalStarted: started,
    totalResources: total,
    completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    byType,
  };
}

export function useEducationProgress() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    subscribeAuth();
    void load();
  }, []);

  const { progress, loading: isLoading, userId } = snapshot;

  const markCompleted = useCallback(
    (resourceName: string, resourcePath: string, resourceType: string) =>
      markCompletedImpl(resourceName, resourcePath, resourceType),
    [],
  );

  const markStarted = useCallback(
    (resourceName: string, resourcePath: string, resourceType: string) =>
      markStartedImpl(resourceName, resourcePath, resourceType),
    [],
  );

  const markIncomplete = useCallback((resourcePath: string) => markIncompleteImpl(resourcePath), []);

  const isCompleted = useCallback(
    (resourcePath: string) => progress.some((p) => p.resource_path === resourcePath && p.status === "completed"),
    [progress],
  );

  const isStarted = useCallback(
    (resourcePath: string) => progress.some((p) => p.resource_path === resourcePath),
    [progress],
  );

  const getStats = useCallback((): ProgressStats => computeStats(progress), [progress]);

  /** The most recently opened library resource that isn't finished. */
  const getLastInProgress = useCallback((): ProgressEntry | undefined => {
    return progress.find((p) => p.status !== "completed" && !!findLibraryItem(p.resource_path));
  }, [progress]);

  const refresh = useCallback(() => load(true), []);

  return {
    progress,
    loading: isLoading,
    markCompleted,
    markStarted,
    markIncomplete,
    isCompleted,
    isStarted,
    getStats,
    getLastInProgress,
    refresh,
    userId,
  };
}
