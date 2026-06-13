import { useGuideTracking } from "@/hooks/useGuideTracking";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import { CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface GuidePageWrapperProps {
  guideName: string;
  guidePath: string;
  guideType?: string;
  children: React.ReactNode;
}

/**
 * Wrapper component that automatically tracks guide page views
 * and provides a "Mark as Complete" button for education progress tracking.
 */
export const GuidePageWrapper = ({ guideName, guidePath, guideType = "guide", children }: GuidePageWrapperProps) => {
  useGuideTracking(guideName, guidePath);
  const { isCompleted, markCompleted, markStarted, userId } = useEducationProgress();

  const completed = isCompleted(guidePath);

  // Auto-mark as started when user visits
  useEffect(() => {
    if (userId) {
      markStarted(guideName, guidePath, guideType);
    }
  }, [userId, guideName, guidePath, guideType, markStarted]);

  const handleComplete = () => {
    markCompleted(guideName, guidePath, guideType);
  };

  return (
    <>
      {children}
      
      {/* Mark Complete Footer */}
      {userId && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="mt-8 p-4 rounded-xl border bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {completed ? (
                  <CheckCircle className="w-6 h-6 text-logo-blue flex-shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {completed ? "You've completed this resource ✓" : "Finished reading?"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {completed 
                      ? "This counts toward your education progress" 
                      : "Mark it complete to track your progress"}
                  </p>
                </div>
              </div>
              {!completed && (
                <Button 
                  onClick={handleComplete}
                  className="bg-logo-blue hover:bg-logo-blue/90 text-white flex-shrink-0"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GuidePageWrapper;
