import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProgressEntry {
  id: string;
  resource_name: string;
  resource_path: string;
  resource_type: string;
  status: string;
  progress_percentage: number | null;
  completed_at: string | null;
  time_spent_seconds: number | null;
}

interface ProgressStats {
  totalCompleted: number;
  totalStarted: number;
  totalResources: number;
  completionPercentage: number;
  byType: Record<string, { completed: number; total: number }>;
}

const TOTAL_RESOURCES = 62;
const RESOURCE_TYPES = {
  guide: 42,
  worksheet: 8,
  meditation: 12,
  // ai_tool count excluded from required completion
};

export function useEducationProgress() {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      const { data, error } = await supabase
        .from("education_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (!error && data) {
        setProgress(data as ProgressEntry[]);
      }
      setLoading(false);
    };

    fetchProgress();
  }, []);

  const markCompleted = useCallback(async (resourceName: string, resourcePath: string, resourceType: string) => {
    if (!userId) return;

    const existing = progress.find(p => p.resource_path === resourcePath);

    if (existing) {
      const { error } = await supabase
        .from("education_progress")
        .update({
          status: "completed",
          progress_percentage: 100,
          completed_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (!error) {
        setProgress(prev => prev.map(p =>
          p.id === existing.id
            ? { ...p, status: "completed", progress_percentage: 100, completed_at: new Date().toISOString() }
            : p
        ));
      }
    } else {
      const { data, error } = await supabase
        .from("education_progress")
        .insert({
          user_id: userId,
          resource_name: resourceName,
          resource_path: resourcePath,
          resource_type: resourceType,
          status: "completed",
          progress_percentage: 100,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!error && data) {
        setProgress(prev => [data as ProgressEntry, ...prev]);
      }
    }
  }, [userId, progress]);

  const markStarted = useCallback(async (resourceName: string, resourcePath: string, resourceType: string) => {
    if (!userId) return;

    const existing = progress.find(p => p.resource_path === resourcePath);
    if (existing) return; // Already tracked

    const { data, error } = await supabase
      .from("education_progress")
      .insert({
        user_id: userId,
        resource_name: resourceName,
        resource_path: resourcePath,
        resource_type: resourceType,
        status: "in_progress",
        progress_percentage: 0,
      })
      .select()
      .single();

    if (!error && data) {
      setProgress(prev => [data as ProgressEntry, ...prev]);
    }
  }, [userId, progress]);

  const isCompleted = useCallback((resourcePath: string) => {
    return progress.some(p => p.resource_path === resourcePath && p.status === "completed");
  }, [progress]);

  const isStarted = useCallback((resourcePath: string) => {
    return progress.some(p => p.resource_path === resourcePath);
  }, [progress]);

  const getStats = useCallback((): ProgressStats => {
    const completed = progress.filter(p => p.status === "completed").length;
    const started = progress.filter(p => p.status === "in_progress").length;

    const byType: Record<string, { completed: number; total: number }> = {};
    for (const [type, total] of Object.entries(RESOURCE_TYPES)) {
      byType[type] = {
        completed: progress.filter(p => p.resource_type === type && p.status === "completed").length,
        total,
      };
    }

    return {
      totalCompleted: completed,
      totalStarted: started,
      totalResources: TOTAL_RESOURCES,
      completionPercentage: Math.round((completed / TOTAL_RESOURCES) * 100),
      byType,
    };
  }, [progress]);

  return {
    progress,
    loading,
    markCompleted,
    markStarted,
    isCompleted,
    isStarted,
    getStats,
    userId,
  };
}
