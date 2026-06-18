import { useGuideTracking } from "@/hooks/useGuideTracking";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import { CheckCircle, Circle, Clock, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { searchIndex } from "@/data/searchIndex";

interface GuidePageWrapperProps {
  guideName: string;
  guidePath: string;
  guideType?: string;
  children: React.ReactNode;
}

export const GuidePageWrapper = ({ guideName, guidePath, guideType = "guide", children }: GuidePageWrapperProps) => {
  useGuideTracking(guideName, guidePath);
  const { isCompleted, markCompleted, markStarted, userId } = useEducationProgress();

  const completed = isCompleted(guidePath);
  const contentRef = useRef<HTMLDivElement>(null);
  const [readMinutes, setReadMinutes] = useState<number | null>(null);

  // Auto-mark as started when user visits
  useEffect(() => {
    if (userId) {
      markStarted(guideName, guidePath, guideType);
    }
  }, [userId, guideName, guidePath, guideType, markStarted]);

  // Compute reading time from rendered text after mount
  useEffect(() => {
    if (!contentRef.current) return;
    const words = (contentRef.current.innerText ?? "").trim().split(/\s+/).filter(Boolean).length;
    if (words > 0) setReadMinutes(Math.max(1, Math.ceil(words / 200)));
  }, []);

  // Pick 3 related guides from same category, deterministically based on path
  const relatedGuides = useMemo(() => {
    const entry = searchIndex.find((e) => e.path === guidePath);
    if (!entry) return [];
    const pool = searchIndex.filter(
      (e) => e.category === entry.category && e.path !== guidePath
    );
    // Deterministic rotation: start from a hash of the path
    const hash = guidePath.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) & 0xffff, 0);
    const start = hash % Math.max(pool.length, 1);
    const result: typeof pool = [];
    for (let i = 0; i < 3 && i < pool.length; i++) {
      result.push(pool[(start + i) % pool.length]);
    }
    return result;
  }, [guidePath]);

  const handleComplete = () => {
    markCompleted(guideName, guidePath, guideType);
  };

  return (
    <>
      <div ref={contentRef}>
        {children}
      </div>

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
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-xs text-gray-500">
                      {completed
                        ? "This counts toward your education progress"
                        : "Mark it complete to track your progress"}
                    </p>
                    {readMinutes && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {readMinutes} min read
                      </span>
                    )}
                  </div>
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

          {/* Related reading */}
          {relatedGuides.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Related reading</span>
              </div>
              <div className="space-y-2">
                {relatedGuides.map((g) => (
                  <Link
                    key={g.path}
                    to={g.path}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/40 transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {g.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{g.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default GuidePageWrapper;
