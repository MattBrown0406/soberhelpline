import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { untypedSupabase } from "@/integrations/supabase/untyped";
import type { Answers, ExerciseOutput } from "@/data/exercises";

export interface WorkbookEntry {
  id: string;
  user_id: string;
  exercise_id: string;
  answers: Answers;
  output: ExerciseOutput;
  score: number | null;
  completed_at: string;
}

// `workbook_entries` is new (docs/_parts/workbook.sql) and not in the generated
// types yet, so query it through the untyped client and cast to WorkbookEntry.
const entriesTable = () => untypedSupabase.from("workbook_entries");

const COLUMNS = "id, user_id, exercise_id, answers, output, score, completed_at";

function normalize(row: Partial<WorkbookEntry> | null | undefined): WorkbookEntry | null {
  if (!row || !row.id || !row.exercise_id || !row.completed_at) return null;
  return {
    id: row.id,
    user_id: row.user_id ?? "",
    exercise_id: row.exercise_id,
    answers: (row.answers as Answers) ?? {},
    output: (row.output as ExerciseOutput) ?? { title: "", sections: [] },
    score: typeof row.score === "number" ? row.score : null,
    completed_at: row.completed_at,
  };
}

/**
 * The signed-in member's workbook: every saved entry (newest first), the
 * latest per exercise, and save/delete. Works signed out (empty, no errors).
 */
export function useWorkbook() {
  const [entries, setEntries] = useState<WorkbookEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        setEntries([]);
        return;
      }
      const { data, error: err } = await entriesTable()
        .select(COLUMNS)
        .eq("user_id", uid)
        .order("completed_at", { ascending: false })
        .limit(500);
      if (err) {
        console.error("workbook load failed", err);
        setError("We couldn't load your saved results right now.");
        setEntries([]);
        return;
      }
      setEntries(((data as Partial<WorkbookEntry>[]) ?? []).map(normalize).filter((e): e is WorkbookEntry => !!e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /** Latest entry per exercise id. */
  const latestByExercise = useMemo(() => {
    const map: Record<string, WorkbookEntry> = {};
    for (const e of entries) if (!map[e.exercise_id]) map[e.exercise_id] = e;
    return map;
  }, [entries]);

  /** All entries for one exercise, newest first. */
  const historyFor = useCallback(
    (exerciseId: string) => entries.filter((e) => e.exercise_id === exerciseId),
    [entries],
  );

  /** Insert a completed entry. Returns the saved row, or null on failure. */
  const save = useCallback(
    async (exerciseId: string, answers: Answers, output: ExerciseOutput, score: number | null) => {
      let uid = userId;
      if (!uid) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        uid = session?.user?.id ?? null;
        if (uid) setUserId(uid);
      }
      if (!uid) return null;
      const { data, error: err } = await entriesTable()
        .insert({ user_id: uid, exercise_id: exerciseId, answers, output, score })
        .select(COLUMNS)
        .single();
      if (err) {
        console.error("workbook save failed", err);
        return null;
      }
      const saved = normalize(data as Partial<WorkbookEntry>);
      if (saved) setEntries((prev) => [saved, ...prev.filter((e) => e.id !== saved.id)]);
      return saved;
    },
    [userId],
  );

  /** Delete one entry. Returns true when it is gone. */
  const remove = useCallback(async (entryId: string) => {
    const { error: err } = await entriesTable().delete().eq("id", entryId);
    if (err) {
      console.error("workbook delete failed", err);
      return false;
    }
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
    return true;
  }, []);

  return { entries, latestByExercise, historyFor, loading, error, userId, save, remove, reload: load };
}

export default useWorkbook;
