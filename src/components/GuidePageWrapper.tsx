import { useGuideTracking } from "@/hooks/useGuideTracking";
import { BookOpen, ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { searchIndex } from "@/data/searchIndex";

// Marking a page started/complete is done by the guide member bar (mounted in
// Layout for members on every library page), so this wrapper only tracks the
// view and suggests related reading.

interface GuidePageWrapperProps {
  guideName: string;
  guidePath: string;
  /** Kept for existing callers; progress type now comes from src/data/memberLibrary.ts. */
  guideType?: string;
  children: React.ReactNode;
}

export const GuidePageWrapper = ({ guideName, guidePath, children }: GuidePageWrapperProps) => {
  useGuideTracking(guidePath, guideName);

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

  return (
    <>
      <div>{children}</div>

      {relatedGuides.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pb-8 print:hidden">
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
        </div>
      )}
    </>
  );
};

export default GuidePageWrapper;
