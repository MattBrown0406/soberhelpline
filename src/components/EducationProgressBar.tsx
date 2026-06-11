import { BookOpen, CheckCircle, TrendingUp } from "lucide-react";
import { useEducationProgress } from "@/hooks/useEducationProgress";

const EducationProgressBar = () => {
  const { loading, getStats, userId } = useEducationProgress();

  if (!userId || loading) return null;

  const stats = getStats();

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Progress Bar */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-logo-blue" />
              <span className="text-sm font-semibold text-gray-900">Your Progress</span>
            </div>
            <span className="text-sm font-bold text-logo-blue">
              {stats.totalCompleted}/{stats.totalResources} completed
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-logo-green to-emerald-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.max(stats.completionPercentage, 2)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            {stats.completionPercentage}% complete
            {stats.totalStarted > 0 && ` • ${stats.totalStarted} in progress`}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 md:gap-6 flex-shrink-0">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 mx-auto mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-gray-500">Guides</p>
            <p className="text-sm font-bold text-gray-900">
              {stats.byType.guide?.completed || 0}/{stats.byType.guide?.total || 0}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 mx-auto mb-1">
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500">Worksheets</p>
            <p className="text-sm font-bold text-gray-900">
              {stats.byType.worksheet?.completed || 0}/{stats.byType.worksheet?.total || 0}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mx-auto mb-1">
              <span className="text-blue-600 text-sm">🧘</span>
            </div>
            <p className="text-xs text-gray-500">Meditations</p>
            <p className="text-sm font-bold text-gray-900">
              {stats.byType.meditation?.completed || 0}/{stats.byType.meditation?.total || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationProgressBar;
