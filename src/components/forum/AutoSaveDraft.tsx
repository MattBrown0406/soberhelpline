import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Loader2 } from "lucide-react";

interface AutoSaveDraftProps {
  userId: string;
  topicId: string;
  parentPostId?: string | null;
  title: string;
  content: string;
  isAnonymous: boolean;
  /** Only save while the compose form is open. */
  enabled?: boolean;
  onDraftLoaded: (title: string, content: string, isAnonymous: boolean) => void;
}

/**
 * Saves the compose form to forum_post_drafts two seconds after typing stops.
 *
 * The table's unique key is (user_id, topic_id, parent_post_id), and Postgres
 * treats NULL parent ids as distinct, so an upsert would create a new row on
 * every save for a new conversation. Instead we remember the draft row id and
 * update it, inserting only when there is none yet.
 */
export function useAutoSaveDraft({
  userId,
  topicId,
  parentPostId = null,
  title,
  content,
  isAnonymous,
  enabled = true,
  onDraftLoaded,
}: AutoSaveDraftProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const draftIdRef = useRef<string | null>(null);
  const loadedRef = useRef(false);
  // Which conversation the draft has already been loaded for.
  const loadedScopeRef = useRef<string | null>(null);
  const lastSavedSnapshot = useRef<string>("");
  const onDraftLoadedRef = useRef(onDraftLoaded);
  onDraftLoadedRef.current = onDraftLoaded;

  const scopeQuery = useCallback(() => {
    const q = supabase
      .from("forum_post_drafts")
      .select("id, title, content, is_anonymous, updated_at")
      .eq("user_id", userId)
      .eq("topic_id", topicId);
    return parentPostId ? q.eq("parent_post_id", parentPostId) : q.is("parent_post_id", null);
  }, [userId, topicId, parentPostId]);

  // Load an existing draft ONCE when the form opens. Not again after a failed
  // or rejected submit: reloading then would put back an older saved state
  // (including "post anonymously" switched off) over what she has on screen.
  useEffect(() => {
    if (!enabled || !userId || !topicId) return;
    const scope = `${userId}|${topicId}|${parentPostId ?? ""}`;
    if (loadedScopeRef.current === scope) return;
    loadedRef.current = false;
    draftIdRef.current = null;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await scopeQuery().order("updated_at", { ascending: false }).limit(1);
        if (cancelled) return;
        const row = !error && data && data.length > 0 ? data[0] : null;
        if (row) {
          draftIdRef.current = row.id;
          lastSavedSnapshot.current = JSON.stringify([row.title || "", row.content, row.is_anonymous]);
          if ((row.content || "").trim() || (row.title || "").trim()) {
            onDraftLoadedRef.current(row.title || "", row.content || "", row.is_anonymous);
            setLastSaved(new Date(row.updated_at));
          }
        }
      } catch (err) {
        console.error("Error loading draft:", err);
      } finally {
        if (!cancelled) {
          loadedRef.current = true;
          loadedScopeRef.current = scope;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, userId, topicId, parentPostId, scopeQuery]);

  const saveDraft = useCallback(async () => {
    if (!loadedRef.current) return;
    const snapshot = JSON.stringify([title, content, isAnonymous]);
    if (snapshot === lastSavedSnapshot.current) return;
    if (!content.trim() && !title.trim()) return;

    setIsSaving(true);
    try {
      const fields = {
        title: title || null,
        content,
        is_anonymous: isAnonymous,
        updated_at: new Date().toISOString(),
      };
      if (draftIdRef.current) {
        const { error } = await supabase.from("forum_post_drafts").update(fields).eq("id", draftIdRef.current);
        if (error) throw error;
      } else {
        const id = crypto.randomUUID();
        const { error } = await supabase.from("forum_post_drafts").insert({
          id,
          user_id: userId,
          topic_id: topicId,
          parent_post_id: parentPostId,
          ...fields,
        });
        if (error) throw error;
        draftIdRef.current = id;
      }
      lastSavedSnapshot.current = snapshot;
      setLastSaved(new Date());
    } catch (err) {
      console.error("Error saving draft:", err);
    } finally {
      setIsSaving(false);
    }
  }, [userId, topicId, parentPostId, title, content, isAnonymous]);

  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => {
      void saveDraft();
    }, 2000);
    return () => clearTimeout(timer);
  }, [enabled, saveDraft]);

  /** Delete the draft (after posting, or when the member discards it). */
  const clearDraft = useCallback(async () => {
    try {
      const del = supabase.from("forum_post_drafts").delete().eq("user_id", userId).eq("topic_id", topicId);
      await (parentPostId ? del.eq("parent_post_id", parentPostId) : del.is("parent_post_id", null));
    } catch (err) {
      console.error("Error clearing draft:", err);
    } finally {
      draftIdRef.current = null;
      lastSavedSnapshot.current = "";
      setLastSaved(null);
    }
  }, [userId, topicId, parentPostId]);

  return { isSaving, lastSaved, hasDraft: !!lastSaved, clearDraft };
}

// Status indicator component
export function DraftStatus({ isSaving, lastSaved }: { isSaving: boolean; lastSaved: Date | null }) {
  if (isSaving) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground" aria-live="polite">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving draft…
      </div>
    );
  }
  if (lastSaved) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground" aria-live="polite">
        <Save className="h-3 w-3" />
        Draft saved
      </div>
    );
  }
  return null;
}
