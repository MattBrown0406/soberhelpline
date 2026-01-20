import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

interface AutoSaveDraftProps {
  userId: string;
  topicId: string;
  parentPostId?: string | null;
  title: string;
  content: string;
  isAnonymous: boolean;
  onDraftLoaded: (title: string, content: string, isAnonymous: boolean) => void;
}

export function useAutoSaveDraft({
  userId,
  topicId,
  parentPostId = null,
  title,
  content,
  isAnonymous,
  onDraftLoaded
}: AutoSaveDraftProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  // Load existing draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const { data, error } = await supabase
          .from('forum_post_drafts')
          .select('*')
          .eq('user_id', userId)
          .eq('topic_id', topicId)
        .is('parent_post_id', parentPostId === null ? null : parentPostId as unknown as boolean)
          .maybeSingle();

        if (!error && data) {
          setHasDraft(true);
          onDraftLoaded(data.title || '', data.content, data.is_anonymous);
          setLastSaved(new Date(data.updated_at));
        }
      } catch (err) {
        console.error('Error loading draft:', err);
      }
    };

    if (userId && topicId) {
      loadDraft();
    }
  }, [userId, topicId, parentPostId]);

  // Auto-save draft with debounce
  const saveDraft = useCallback(async () => {
    if (!content.trim() && !title.trim()) {
      // Delete draft if empty
      if (hasDraft) {
        await supabase
          .from('forum_post_drafts')
          .delete()
          .eq('user_id', userId)
          .eq('topic_id', topicId)
          .is('parent_post_id', parentPostId === null ? null : parentPostId as unknown as boolean);
        setHasDraft(false);
      }
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('forum_post_drafts')
        .upsert({
          user_id: userId,
          topic_id: topicId,
          parent_post_id: parentPostId,
          title: title || null,
          content,
          is_anonymous: isAnonymous,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,topic_id,parent_post_id'
        });

      if (!error) {
        setLastSaved(new Date());
        setHasDraft(true);
      }
    } catch (err) {
      console.error('Error saving draft:', err);
    } finally {
      setIsSaving(false);
    }
  }, [userId, topicId, parentPostId, title, content, isAnonymous, hasDraft]);

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.trim() || title.trim()) {
        saveDraft();
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [title, content, isAnonymous, saveDraft]);

  // Clear draft after successful post
  const clearDraft = async () => {
    try {
      await supabase
        .from('forum_post_drafts')
        .delete()
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .is('parent_post_id', parentPostId === null ? null : parentPostId as unknown as boolean);
      setHasDraft(false);
      setLastSaved(null);
    } catch (err) {
      console.error('Error clearing draft:', err);
    }
  };

  return {
    isSaving,
    lastSaved,
    hasDraft,
    clearDraft
  };
}

// Status indicator component
export function DraftStatus({ isSaving, lastSaved }: { isSaving: boolean; lastSaved: Date | null }) {
  if (isSaving) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving...
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Save className="h-3 w-3" />
        Draft saved
      </div>
    );
  }

  return null;
}
