import { supabase } from "@/integrations/supabase/client";
import { untypedSupabase } from "@/integrations/supabase/untyped";

/**
 * Forum-safe profile fields. Other members only ever see `username`;
 * `first_name` / `last_name` come back from the RPC for administrators only
 * (null for everyone else) and must never be shown in member-facing UI.
 */
export type PublicProfile = {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
};

export type ForumMemberMatch = {
  id: string;
  username: string;
};

export async function fetchPublicProfiles(userIds: Array<string | null | undefined>): Promise<PublicProfile[]> {
  const unique = Array.from(new Set(userIds)).filter((id): id is string => !!id);
  if (unique.length === 0) return [];

  const { data, error } = await supabase.rpc("get_public_profiles", {
    _user_ids: unique,
  });

  if (error) throw error;
  return ((data as unknown as PublicProfile[]) || []);
}

/** Map of user id -> username (null when the member has not set one). */
export async function fetchUsernames(userIds: Array<string | null | undefined>): Promise<Map<string, string | null>> {
  const profiles = await fetchPublicProfiles(userIds);
  return new Map(profiles.map((p) => [p.id, p.username?.trim() || null]));
}

/** Members (with a username) whose username contains `query`. Excludes the caller. */
export async function searchForumMembers(query: string): Promise<ForumMemberMatch[]> {
  const q = query.trim();
  if (!q) return [];
  const { data, error } = await untypedSupabase.rpc("search_forum_members", { _query: q.slice(0, 50) });
  if (error) {
    console.error("Member search failed:", error);
    return [];
  }
  return ((data as ForumMemberMatch[]) || []).filter((m) => !!m.username);
}

/** Exact (case-insensitive) username lookup, used to resolve @mentions. */
export async function findForumMembersByUsername(usernames: string[]): Promise<ForumMemberMatch[]> {
  const unique = Array.from(new Set(usernames.map((u) => u.trim()).filter(Boolean))).slice(0, 20);
  if (unique.length === 0) return [];
  const { data, error } = await untypedSupabase.rpc("find_forum_members_by_username", { _usernames: unique });
  if (error) {
    console.error("Mention lookup failed:", error);
    return [];
  }
  return (data as ForumMemberMatch[]) || [];
}
