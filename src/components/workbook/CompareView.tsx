import { describeChange, shortDate, type ExerciseOutput } from "@/data/exercises";
import OutputView from "./OutputView";

interface Side {
  output: ExerciseOutput;
  score: number | null;
  completedAt: string;
}

interface CompareViewProps {
  previous: Side;
  current: Side;
  /** Label for the newer side ("Today" right after finishing). */
  currentLabel?: string;
}

/**
 * Two results side by side. Scored exercises compare score and band with the
 * difference; text exercises show both outputs.
 */
export default function CompareView({ previous, current, currentLabel }: CompareViewProps) {
  const prevLabel = shortDate(previous.completedAt);
  const curLabel = currentLabel ?? shortDate(current.completedAt);
  const prevScore = previous.output?.score;
  const curScore = current.output?.score;
  const scored = typeof previous.score === "number" && typeof current.score === "number";

  if (scored) {
    const max = curScore?.max ?? prevScore?.max;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: `Last time · ${prevLabel}`, score: previous.score, band: prevScore?.band },
            { label: curLabel, score: current.score, band: curScore?.band },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-3xl font-semibold text-foreground">
                {s.score}
                {max ? <span className="text-base font-normal text-muted-foreground"> / {max}</span> : null}
              </p>
              {s.band && <p className="mt-1 text-sm text-foreground/90">{s.band}</p>}
            </div>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-foreground" aria-live="polite">
          {describeChange(previous.score as number, current.score as number, prevLabel)}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Last time · {prevLabel}</p>
        <OutputView output={previous.output} compact hideTitle />
      </div>
      <div className="rounded-lg border border-primary/30 bg-card p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-primary">{curLabel}</p>
        <OutputView output={current.output} compact hideTitle />
      </div>
    </div>
  );
}
