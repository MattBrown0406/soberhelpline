import type { ComponentType } from "react";
import { BookOpen, Headphones, NotebookPen, TrendingUp } from "lucide-react";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import { IconTile, Panel, ProgressRing, type Tone } from "@/components/member/MemberUI";

// The member's library progress. The same numbers appear on /member-home and
// /family-education (both read useEducationProgress().getStats(), which counts
// against the registry in src/data/memberLibrary.ts).

interface EducationProgressBarProps {
  /** Drop the outer card (for use inside another card). */
  bare?: boolean;
}

const types: { key: "guide" | "worksheet" | "meditation"; label: string; icon: ComponentType<{ className?: string }>; tone: Tone }[] = [
  { key: "guide", label: "Guides", icon: BookOpen, tone: "sky" },
  { key: "worksheet", label: "Worksheets & exercises", icon: NotebookPen, tone: "emerald" },
  { key: "meditation", label: "Meditations", icon: Headphones, tone: "violet" },
];

const EducationProgressBar = ({ bare = false }: EducationProgressBarProps) => {
  const { loading, getStats, userId } = useEducationProgress();

  if (!userId || loading) return null;

  const stats = getStats();

  const body = (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex items-center gap-4">
        <ProgressRing value={stats.completionPercentage} label={`${stats.completionPercentage}% complete`}>
          <span className="text-lg font-bold tabular-nums text-foreground">{stats.completionPercentage}%</span>
        </ProgressRing>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <TrendingUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            Your library progress
          </p>
          <p className="mt-0.5 text-sm tabular-nums text-muted-foreground">
            {stats.totalCompleted} of {stats.totalResources} done
          </p>
          {stats.totalStarted > 0 && <p className="text-xs text-muted-foreground">{stats.totalStarted} in progress</p>}
        </div>
      </div>

      <ul className="grid flex-1 grid-cols-3 gap-2">
        {types.map(({ key, label, icon, tone }) => (
          <li key={key} className="flex flex-col gap-1.5 rounded-xl bg-muted/50 p-2.5 print:bg-transparent print:p-0">
            <IconTile icon={icon} tone={tone} size="sm" className="print:hidden" />
            <span className="text-sm font-semibold tabular-nums leading-none text-foreground">
              {stats.byType[key].completed}/{stats.byType[key].total}
            </span>
            <span className="text-xs leading-snug text-foreground/75">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return bare ? <div>{body}</div> : <Panel>{body}</Panel>;
};

export default EducationProgressBar;
