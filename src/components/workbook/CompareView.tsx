import { ProgressRing, TONE, type Tone } from "@/components/member/MemberUI";
import { cn } from "@/lib/utils";
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
  /** The exercise's accent (see toneForExercise). Presentation only. */
  tone?: Tone;
}

/**
 * Two results side by side. Scored exercises compare score and band with the
 * difference; text exercises show both outputs.
 */
export default function CompareView({ previous, current, currentLabel, tone = "navy" }: CompareViewProps) {
  const prevLabel = shortDate(previous.completedAt);
  const curLabel = currentLabel ?? shortDate(current.completedAt);
  const prevScore = previous.output?.score;
  const curScore = current.output?.score;
  const scored = typeof previous.score === "number" && typeof current.score === "number";

  if (scored) {
    const max = curScore?.max ?? prevScore?.max;
    const hasMax = typeof max === "number" && max > 0;
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: `Last time · ${prevLabel}`, score: previous.score as number, band: prevScore?.band, newer: false },
            { label: curLabel, score: current.score as number, band: curScore?.band, newer: true },
          ].map((s) => (
            <div
              key={s.label}
              className={cn(
                "flex flex-col items-center rounded-2xl border p-3 text-center sm:p-4",
                s.newer ? cn("bg-card shadow-sm shadow-slate-900/[0.04] print:shadow-none", TONE[tone].border) : "border-border/70 bg-muted/40",
              )}
            >
              <p className={cn("text-xs font-semibold uppercase tracking-wide", s.newer ? TONE[tone].text : "text-foreground/75")}>
                {s.label}
              </p>
              {hasMax ? (
                <div className="mt-3">
                  <ProgressRing value={(s.score / max) * 100} size={84} tone={tone} label={`${s.score} of ${max}`}>
                    <span className="text-2xl font-semibold text-foreground">{s.score}</span>
                    <span className="mt-1 text-xs text-foreground/75">of {max}</span>
                  </ProgressRing>
                </div>
              ) : (
                <p className="mt-1 text-3xl font-semibold text-foreground">{s.score}</p>
              )}
              {s.band && <p className="mt-2 text-sm font-medium leading-snug text-foreground/90">{s.band}</p>}
            </div>
          ))}
        </div>
        <p
          className={cn("rounded-xl px-4 py-3 text-sm leading-relaxed text-foreground print:bg-transparent print:px-0", TONE[tone].soft)}
          aria-live="polite"
        >
          {describeChange(previous.score as number, current.score as number, prevLabel)}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/75">Last time · {prevLabel}</p>
        <OutputView output={previous.output} compact hideTitle />
      </div>
      <div className={cn("rounded-2xl border bg-card p-4 shadow-sm shadow-slate-900/[0.04] print:shadow-none", TONE[tone].border)}>
        <p className={cn("mb-3 text-xs font-semibold uppercase tracking-wide", TONE[tone].text)}>{curLabel}</p>
        <OutputView output={current.output} compact hideTitle />
      </div>
    </div>
  );
}
