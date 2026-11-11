import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bookmark, BookmarkCheck, CheckCircle2, Circle, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useEducationProgress } from "@/hooks/useEducationProgress";
import { useLearningPath } from "@/hooks/useLearningPath";
import type { LibraryItem } from "@/data/memberLibrary";

// Slim bar at the bottom of library pages, for signed-in members only.
// Layout mounts it once and decides where it shows (memberBarItem in
// src/data/memberLibrary.ts); Layout also pads the page so it never covers content.

interface GuideMemberBarProps {
  item: LibraryItem;
  onDismiss: () => void;
}

function discussHref(item: LibraryItem): string {
  const title = encodeURIComponent(`About: ${item.title}`);
  const ref = encodeURIComponent(item.path);
  return `/family-forum/ask-community?compose=1&title=${title}&ref=${ref}`;
}

export default function GuideMemberBar({ item, onDismiss }: GuideMemberBarProps) {
  const { toast } = useToast();
  const { userId, loading, isCompleted, markCompleted, markIncomplete, markStarted } = useEducationProgress();
  const { track, nextStepAfter } = useLearningPath();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState<"complete" | "save" | null>(null);

  const completed = isCompleted(item.path);
  const next = track ? nextStepAfter(item.path) : undefined;

  // Opening the page counts as starting it.
  useEffect(() => {
    if (userId && !loading) void markStarted(item.title, item.path, item.type);
  }, [userId, loading, item.path, item.title, item.type, markStarted]);

  // Is it saved?
  useEffect(() => {
    let cancelled = false;
    setSaved(false);
    if (!userId) return;
    supabase
      .from("education_bookmarks")
      .select("id")
      .eq("user_id", userId)
      .eq("resource_path", item.path)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setSaved(!!data);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, item.path]);

  const toggleComplete = async () => {
    setBusy("complete");
    const ok = completed ? await markIncomplete(item.path) : await markCompleted(item.title, item.path, item.type);
    setBusy(null);
    if (!ok) toast({ title: "That didn't save", description: "Please try again in a moment.", variant: "destructive" });
  };

  const toggleSave = async () => {
    if (!userId) return;
    setBusy("save");
    if (saved) {
      const { error } = await supabase
        .from("education_bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("resource_path", item.path);
      if (!error) setSaved(false);
    } else {
      // Already saved (a second tap before the saved state loaded) is not an
      // error, and must not need permission to update the existing row.
      const { error } = await supabase.from("education_bookmarks").upsert(
        { user_id: userId, resource_path: item.path, resource_name: item.title, resource_type: item.type },
        { onConflict: "user_id,resource_path", ignoreDuplicates: true },
      );
      if (!error) setSaved(true);
      else toast({ title: "That didn't save", description: "Please try again in a moment.", variant: "destructive" });
    }
    setBusy(null);
  };

  if (!userId) return null;

  return (
    <div
      role="region"
      aria-label="Your progress on this page"
      className="print:hidden fixed inset-x-0 bottom-0 z-[90] border-t border-border/70 bg-card pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_-10px_rgba(15,23,42,0.25)] dark:shadow-[0_-6px_20px_-10px_rgba(0,0,0,0.7)]"
    >
      <div className="container mx-auto flex items-center gap-1 px-3 py-2 sm:gap-2 sm:px-4">
        <Button
          type="button"
          size="sm"
          variant={completed ? "secondary" : next ? "outline" : "default"}
          onClick={toggleComplete}
          disabled={busy === "complete"}
          aria-pressed={completed}
          className={cn(
            "h-11 shrink-0 gap-1.5 rounded-xl px-3",
            completed
              ? "border border-green-200 bg-green-50 text-green-800 hover:bg-green-100 dark:border-green-400/25 dark:bg-green-400/10 dark:text-green-200 dark:hover:bg-green-400/15"
              : next && "border-primary/30 bg-card text-primary",
          )}
        >
          {completed ? (
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden="true" />
          ) : (
            <Circle className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="hidden min-[412px]:inline">{completed ? "Completed" : "Mark complete"}</span>
          <span className="min-[412px]:hidden">{completed ? "Done" : "Done?"}</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={toggleSave}
          disabled={busy === "save"}
          aria-pressed={saved}
          aria-label={saved ? "Saved — tap to remove" : "Save for later"}
          className="h-11 min-w-11 shrink-0 gap-1.5 rounded-xl px-2 sm:px-3"
        >
          {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
          <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
        </Button>

        <Button asChild size="sm" variant="ghost" className="h-11 min-w-11 shrink-0 gap-1.5 rounded-xl px-2 sm:px-3">
          <Link to={discussHref(item)} aria-label="Discuss this in the forum">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Discuss</span>
          </Link>
        </Button>

        <div className="ml-auto flex min-w-0 items-center gap-1">
          {next && (
            <Button asChild size="sm" className="h-11 min-w-0 gap-1.5 rounded-xl px-3 shadow-sm shadow-[#16294a]/15">
              <Link to={next.path} title={`Next in your path: ${next.title}`}>
                <span className="hidden md:inline text-primary-foreground/80">Next in your path:</span>
                <span className="md:hidden">Next</span>
                <span className="hidden md:inline max-w-[16rem] truncate">{next.title}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </Button>
          )}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onDismiss}
            aria-label="Hide this bar"
            className="h-11 w-11 shrink-0 rounded-xl text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
