import { supabase } from "@/integrations/supabase/client";

export type PublicProfile = {
  id: string;
  username: string | null;
  first_name: string;
  last_name: string;
};

export async function fetchPublicProfiles(userIds: string[]): Promise<PublicProfile[]> {
  const unique = Array.from(new Set(userIds)).filter(Boolean);
  if (unique.length === 0) return [];

  const { data, error } = await supabase.rpc("get_public_profiles", {
    _user_ids: unique,
  });

  if (error) throw error;
  return (data as PublicProfile[]) || [];
}
