import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bookmark, BookmarkCheck, CheckCircle2, Circle, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
      const { error } = await supabase.from("education_bookmarks").upsert(
        { user_id: userId, resource_path: item.path, resource_name: item.title, resource_type: item.type },
        { onConflict: "user_id,resource_path" },
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
      className="print:hidden fixed inset-x-0 bottom-0 z-[90] border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="container mx-auto flex items-center gap-1.5 px-3 py-2 sm:gap-2 sm:px-4">
        <Button
          type="button"
          size="sm"
          variant={completed ? "secondary" : "default"}
          onClick={toggleComplete}
          disabled={busy === "complete"}
          aria-pressed={completed}
          className="gap-1.5 shrink-0"
        >
          {completed ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
          <span className="hidden min-[400px]:inline">{completed ? "Completed" : "Mark complete"}</span>
          <span className="min-[400px]:hidden">{completed ? "Done" : "Done?"}</span>
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={toggleSave}
          disabled={busy === "save"}
          aria-pressed={saved}
          aria-label={saved ? "Saved — tap to remove" : "Save for later"}
          className="gap-1.5 shrink-0 px-2 sm:px-3"
        >
          {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
          <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
        </Button>

        <Button asChild size="sm" variant="ghost" className="gap-1.5 shrink-0 px-2 sm:px-3">
          <Link to={discussHref(item)} aria-label="Discuss this in the forum">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Discuss</span>
          </Link>
        </Button>

        <div className="ml-auto flex min-w-0 items-center gap-1">
          {next && (
            <Button asChild size="sm" variant="outline" className="min-w-0 gap-1.5">
              <Link to={next.path} title={`Next in your path: ${next.title}`}>
                <span className="hidden md:inline text-muted-foreground">Next in your path:</span>
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
            className="h-8 w-8 shrink-0 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
