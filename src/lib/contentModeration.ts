import { supabase } from "@/integrations/supabase/client";

interface ModerationResult {
  allowed: boolean;
  reason?: string;
}

export async function moderateContent(content: string, title?: string): Promise<ModerationResult> {
  try {
    const { data, error } = await supabase.functions.invoke('moderate-content', {
      body: { content, title }
    });

    if (error) {
      console.error('Moderation error:', error);
      // Fail open - allow posting if moderation fails
      return { allowed: true };
    }

    return {
      allowed: data?.allowed !== false,
      reason: data?.reason
    };
  } catch (err) {
    console.error('Moderation request failed:', err);
    // Fail open
    return { allowed: true };
  }
}
