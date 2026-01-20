import { supabase } from "@/integrations/supabase/client";

// Extract @mentions from content and create mention records
export async function processMentions(
  content: string,
  postId: string,
  authorUserId: string
): Promise<void> {
  const mentionRegex = /@(\w+)/g;
  const mentionedUsernames: string[] = [];
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    mentionedUsernames.push(match[1]);
  }

  if (mentionedUsernames.length === 0) return;

  try {
    // Find users by username or first_name
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, username, first_name')
      .or(
        mentionedUsernames
          .map(name => `username.eq.${name},first_name.eq.${name}`)
          .join(',')
      );

    if (error || !users || users.length === 0) return;

    // Filter out self-mentions and duplicates
    const uniqueUserIds = [...new Set(
      users
        .filter(u => u.id !== authorUserId)
        .map(u => u.id)
    )];

    if (uniqueUserIds.length === 0) return;

    // Create mention records
    const mentionRecords = uniqueUserIds.map(userId => ({
      post_id: postId,
      mentioned_user_id: userId,
      mentioning_user_id: authorUserId
    }));

    await supabase
      .from('forum_mentions')
      .insert(mentionRecords);

  } catch (err) {
    console.error('Error processing mentions:', err);
  }
}

// Parse mentions for rendering - returns structured data
export interface MentionPart {
  type: 'mention' | 'text';
  content: string;
}

export function parseMentions(content: string): MentionPart[] {
  const parts = content.split(/(@\w+)/g);
  
  return parts.map((part) => {
    if (part.startsWith('@')) {
      return {
        type: 'mention' as const,
        content: part
      };
    }
    return {
      type: 'text' as const,
      content: part
    };
  });
}
