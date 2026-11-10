import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { untypedSupabase } from "@/integrations/supabase/untyped";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import tracksData from "../../supabase/functions/_shared/memberTracks.json";

// The member's one learning path (table member_learning_paths, one row per
// member). Tracks come from supabase/functions/_shared/memberTracks.json; step
// completion comes from education_progress. Shared store, like
// useEducationProgress, so the dashboard and the guide member bar agree.

export interface TrackStep {
  title: string;
  path: string;
}

export interface MemberTrack {
  id: string;
  title: string;
  summary: string;
  goal: string;
  audience: string;
  steps: TrackStep[];
  forumTopic: { topicId: string; topicTitle: string; prompt: string };
}

export interface PathStep extends TrackStep {
  /** 0-based position in the track. */
  index: number;
  completed: boolean;
  started: boolean;
}

export const MEMBER_TRACKS: MemberTrack[] = (tracksData as { tracks: MemberTrack[] }).tracks;

export function getTrack(trackId: string | null | undefined): MemberTrack | undefined {
  if (!trackId) return undefined;
  return MEMBER_TRACKS.find((t) => t.id === trackId);
}

// A path chosen while signed out (onboarding quiz): saved here and applied the
// first time the member's path is loaded after signing in.
const PENDING_KEY = "sh_pending_learning_path";

export function savePendingTrack(trackId: string) {
  try {
    localStorage.setItem(PENDING_KEY, trackId);
  } catch {
    // storage unavailable (private mode): the choice is simply not remembered
  }
}

function takePendingTrack(): string | null {
  try {
    const id = localStorage.getItem(PENDING_KEY);
    if (id) localStorage.removeItem(PENDING_KEY);
    return id && getTrack(id) ? id : null;
  } catch {
    return null;
  }
}

interface PathState {
  userId: string | null;
  trackId: string | null;
  startedAt: string | null;
  loading: boolean;
}

let state: PathState = { userId: null, trackId: null, startedAt: null, loading: true };
const listeners = new Set<() => void>();
let loadedFor: string | null | undefined;
let inflight: Promise<void> | null = null;
let authSubscribed = false;

function setState(patch: Partial<PathState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

async function writePath(uid: string, trackId: string): Promise<boolean> {
  const now = new Date().toISOString();
  const { error } = await untypedSupabase
    .from("member_learning_paths")
    .upsert({ user_id: uid, track_id: trackId, started_at: now, updated_at: now }, { onConflict: "user_id" });
  if (error) return false;
  setState({ trackId, startedAt: now });
  return true;
}

async function load(force = false): Promise<void> {
  if (inflight && !force) return inflight;
  inflight = (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id ?? null;
    if (!force && loadedFor !== undefined && loadedFor === uid) return;
    if (!uid) {
      loadedFor = null;
      setState({ userId: null, trackId: null, startedAt: null, loading: false });
      return;
    }
    setState({ userId: uid, loading: true });
    const { data, error } = await untypedSupabase
      .from("member_learning_paths")
      .select("track_id, started_at")
      .eq("user_id", uid)
      .maybeSingle();
    loadedFor = uid;
    const row = !error && data ? (data as { track_id: string; started_at: string }) : null;
    if (row && getTrack(row.track_id)) {
      setState({ trackId: row.track_id, startedAt: row.started_at, loading: false });
      return;
    }
    // No path yet: apply one chosen before signing in, if any.
    const pendingTrack = !error ? takePendingTrack() : null;
    if (pendingTrack) {
      await writePath(uid, pendingTrack);
    } else {
      setState({ trackId: null, startedAt: null });
    }
    setState({ loading: false });
  })().finally(() => {
    inflight = null;
  });
  return inflight;
}

function subscribeAuth() {
  if (authSubscribed) return;
  authSubscribed = true;
  supabase.auth.onAuthStateChange((_event, session) => {
    const uid = session?.user?.id ?? null;
    if (loadedFor !== undefined && uid === loadedFor) return;
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

export function useLearningPath() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const { progress, loading: progressLoading } = useEducationProgress();

  useEffect(() => {
    subscribeAuth();
    void load();
  }, []);

  const track = getTrack(snapshot.trackId);

  const steps: PathStep[] = useMemo(() => {
    if (!track) return [];
    const byPath = new Map(progress.map((p) => [p.resource_path, p]));
    return track.steps.map((step, index) => {
      const row = byPath.get(step.path);
      return { ...step, index, completed: row?.status === "completed", started: !!row };
    });
  }, [track, progress]);

  const completedCount = steps.filter((s) => s.completed).length;
  const nextStep = steps.find((s) => !s.completed);
  const totalSteps = steps.length;
  /** "Step X of N": the position of the next unfinished step (N when all are done). */
  const currentStepNumber = nextStep ? nextStep.index + 1 : totalSteps;
  const isFinished = totalSteps > 0 && completedCount === totalSteps;

  /** The step to suggest after the page at `path`: the next unfinished step after it in the track, else the first unfinished one. */
  const nextStepAfter = useCallback(
    (path: string): PathStep | undefined => {
      const here = steps.findIndex((s) => s.path === path);
      if (here >= 0) {
        const after = steps.slice(here + 1).find((s) => !s.completed);
        if (after) return after;
      }
      return steps.find((s) => !s.completed && s.path !== path);
    },
    [steps],
  );

  const setPath = useCallback(async (trackId: string) => {
    if (!getTrack(trackId)) return false;
    if (state.loading || !state.userId) await load();
    const uid = state.userId;
    if (!uid) return false;
    if (state.trackId === trackId) return true;
    return writePath(uid, trackId);
  }, []);

  const clearPath = useCallback(async () => {
    const uid = state.userId;
    if (!uid) return false;
    const { error } = await untypedSupabase.from("member_learning_paths").delete().eq("user_id", uid);
    if (error) return false;
    setState({ trackId: null, startedAt: null });
    return true;
  }, []);

  return {
    loading: snapshot.loading || progressLoading,
    userId: snapshot.userId,
    trackId: snapshot.trackId,
    startedAt: snapshot.startedAt,
    track,
    steps,
    completedCount,
    totalSteps,
    currentStepNumber,
    nextStep,
    isFinished,
    nextStepAfter,
    setPath,
    clearPath,
  };
}
