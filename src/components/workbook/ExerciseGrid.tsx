import { useMemo } from "react";
import { EXERCISES, hasDraft, orderExercises } from "@/data/exercises";
import { useWorkbook } from "@/hooks/useWorkbook";
import ExerciseCard from "./ExerciseCard";

interface ExerciseGridProps {
  /** Show at most this many cards (after ordering). */
  limit?: number;
}

/**
 * The guided exercises as cards linking to /workbook/<id>: in progress first,
 * then never done, then due for a retake, then done recently. Used on
 * /family-education and /member-home.
 */
export default function ExerciseGrid({ limit }: ExerciseGridProps) {
  const { latestByExercise, loading, userId } = useWorkbook();

  const drafts = useMemo(
    () => (loading ? new Set<string>() : new Set(EXERCISES.filter((e) => hasDraft(userId, e.id)).map((e) => e.id))),
    [loading, userId],
  );
  const ordered = useMemo(
    () => (loading ? EXERCISES : orderExercises(EXERCISES, latestByExercise, drafts)),
    [loading, latestByExercise, drafts],
  );
  const shown = typeof limit === "number" && limit > 0 ? ordered.slice(0, limit) : ordered;

  return (
    <div
      className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(15rem,1fr))]"
      aria-busy={loading || undefined}
    >
      {shown.map((e) => (
        <ExerciseCard
          key={e.id}
          exercise={e}
          latest={loading ? undefined : latestByExercise[e.id]}
          inProgress={drafts.has(e.id)}
        />
      ))}
    </div>
  );
}
