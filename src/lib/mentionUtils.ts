import { supabase } from "@/integrations/supabase/client";
import { findForumMembersByUsername } from "@/lib/publicProfiles";

const MENTION_REGEX = /@(\w+)/g;

export function extractMentionUsernames(content: string): string[] {
  const names: string[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(MENTION_REGEX.source, "g");
  while ((match = re.exec(content)) !== null) {
    names.push(match[1]);
  }
  return Array.from(new Set(names));
}

/**
 * Create @mention rows for a post. Never call this for an anonymous post: a
 * mention row tells the mentioned member who wrote it. The database refuses
 * mention rows for anonymous posts and for posts the caller did not write.
 */
export async function processMentions(
  content: string,
  postId: string,
  authorUserId: string,
  isAnonymous: boolean,
): Promise<void> {
  if (isAnonymous) return;
  const usernames = extractMentionUsernames(content);
  if (usernames.length === 0) return;

  try {
    const members = await findForumMembersByUsername(usernames);
    const ids = Array.from(new Set(members.map((m) => m.id).filter((id) => id !== authorUserId)));
    if (ids.length === 0) return;

    const { error } = await supabase.from("forum_mentions").insert(
      ids.map((id) => ({
        post_id: postId,
        mentioned_user_id: id,
        mentioning_user_id: authorUserId,
      })),
    );
    if (error) console.error("Error saving mentions:", error);
  } catch (err) {
    console.error("Error processing mentions:", err);
  }
}

// Parse mentions for rendering - returns structured data
export interface MentionPart {
  type: "mention" | "text";
  content: string;
}

export function parseMentions(content: string): MentionPart[] {
  return content.split(/(@\w+)/g).map((part) =>
    part.startsWith("@") ? { type: "mention" as const, content: part } : { type: "text" as const, content: part },
  );
}
