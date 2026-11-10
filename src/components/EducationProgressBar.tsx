import { BookOpen, CheckCircle, Headphones, TrendingUp } from "lucide-react";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import { Progress } from "@/components/ui/progress";

// The member's library progress. The same numbers appear on /member-home and
// /family-education (both read useEducationProgress().getStats(), which counts
// against the registry in src/data/memberLibrary.ts).

interface EducationProgressBarProps {
  /** Drop the outer card (for use inside another card). */
  bare?: boolean;
}

const EducationProgressBar = ({ bare = false }: EducationProgressBarProps) => {
  const { loading, getStats, userId } = useEducationProgress();

  if (!userId || loading) return null;

  const stats = getStats();
  const types = [
    { key: "guide" as const, label: "Guides", icon: CheckCircle, iconClass: "text-emerald-600 dark:text-emerald-400" },
    { key: "worksheet" as const, label: "Worksheets & exercises", icon: BookOpen, iconClass: "text-purple-600 dark:text-purple-400" },
    { key: "meditation" as const, label: "Meditations", icon: Headphones, iconClass: "text-blue-600 dark:text-blue-400" },
  ];

  return (
    <div className={bare ? "" : "rounded-xl border border-border bg-card p-4 mb-6"}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Your library progress</span>
        </div>
        <span className="text-sm text-muted-foreground tabular-nums">
          {stats.totalCompleted} of {stats.totalResources} done
        </span>
      </div>
      <Progress value={stats.completionPercentage} className="h-2" aria-label={`${stats.completionPercentage}% complete`} />
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
        {types.map(({ key, label, icon: Icon, iconClass }) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <Icon className={`h-3.5 w-3.5 ${iconClass}`} />
            {label}: <span className="font-medium text-foreground tabular-nums">{stats.byType[key].completed}/{stats.byType[key].total}</span>
          </span>
        ))}
        {stats.totalStarted > 0 && <span>{stats.totalStarted} in progress</span>}
      </div>
    </div>
  );
};

export default EducationProgressBar;
