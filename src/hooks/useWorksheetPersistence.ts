import { useState, useEffect, useRef, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface WorksheetPersistence<T> {
  savedData: T | null;
  isLoading: boolean;
  save: (data: T) => void;
  saveStatus: SaveStatus;
}

export function useWorksheetPersistence<T extends object>(
  worksheetKey: string,
  user: User | null | undefined
): WorksheetPersistence<T> {
  const [savedData, setSavedData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    hasLoadedRef.current = false;

    supabase
      .from("worksheet_responses")
      .select("responses")
      .eq("user_id", user.id)
      .eq("worksheet_key", worksheetKey)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.responses) setSavedData(data.responses as T);
        setIsLoading(false);
        hasLoadedRef.current = true;
      });
  }, [user?.id, worksheetKey]);

  const save = useCallback(
    (data: T) => {
      if (!user || !hasLoadedRef.current) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        setSaveStatus("saving");
        const { error } = await supabase.from("worksheet_responses").upsert(
          {
            user_id: user.id,
            worksheet_key: worksheetKey,
            responses: data,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,worksheet_key" }
        );
        if (error) {
          setSaveStatus("error");
        } else {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 3000);
        }
      }, 1500);
    },
    [user?.id, worksheetKey]
  );

  return { savedData, isLoading, save, saveStatus };
}
