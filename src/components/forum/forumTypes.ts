/** A row of public.forum_posts_secure (the only way members read posts). */
export interface ForumPostRow {
  id: string;
  topic_id: string;
  parent_post_id: string | null;
  title: string | null;
  content: string;
  is_anonymous: boolean;
  is_pinned: boolean;
  needs_support: boolean;
  created_at: string;
  updated_at: string;
  /** Null for anonymous posts unless the viewer wrote it or is staff. */
  user_id: string | null;
  is_mine: boolean;
  author_is_staff: boolean;
}

export interface ForumThreadData extends ForumPostRow {
  replies: ForumPostRow[];
}

export const FORUM_POST_COLUMNS =
  "id, topic_id, parent_post_id, title, content, is_anonymous, is_pinned, needs_support, created_at, updated_at, user_id, is_mine, author_is_staff";
