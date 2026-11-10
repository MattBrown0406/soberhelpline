import {
  BookOpen,
  CalendarDays,
  Heart,
  HeartHandshake,
  MessageCircle,
  MessagesSquare,
  Shield,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * The single source of forum topic ("space") definitions.
 *
 * Active spaces accept new conversations. Archived spaces stay readable and
 * their existing conversations still accept replies, but nobody can start a
 * new conversation there (the database enforces the same rule in the
 * forum_posts write trigger; keep ACTIVE_TOPIC_IDS in sync with
 * docs/_parts/forum.sql if this list ever changes).
 */
export interface ForumTopicDef {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Complete static Tailwind classes for the icon tile. */
  tileClass: string;
  archived: boolean;
}

export const MEETING_TOPIC_ID = "this-weeks-meeting";
export const DEFAULT_TOPIC_ID = "ask-community";

export const ACTIVE_TOPICS: ForumTopicDef[] = [
  {
    id: MEETING_TOPIC_ID,
    title: "This Week's Meeting",
    description:
      "The room before and after Monday's meeting. Ask a question for Monday, or keep talking about what came up.",
    icon: CalendarDays,
    tileClass: "bg-emerald-600 text-white dark:bg-emerald-500",
    archived: false,
  },
  {
    id: "ask-community",
    title: "Ask the Community",
    description:
      "Anything on your mind: boundaries, treatment, a hard conversation, a bad night. Families who've been there will answer.",
    icon: MessageCircle,
    tileClass: "bg-sky-600 text-white dark:bg-sky-500",
    archived: false,
  },
  {
    id: "introductions",
    title: "Introductions & Welcome",
    description: "New here? Say hello and share as much or as little as you like.",
    icon: Users,
    tileClass: "bg-indigo-600 text-white dark:bg-indigo-500",
    archived: false,
  },
];

export const ARCHIVED_TOPICS: ForumTopicDef[] = [
  {
    id: "share-story",
    title: "Share Your Story",
    description: "Stories and experiences members shared.",
    icon: Heart,
    tileClass: "bg-slate-500 text-white dark:bg-slate-600",
    archived: true,
  },
  {
    id: "treatment-discussions",
    title: "Treatment Center, IOP & Sober Living",
    description: "Earlier conversations about treatment centers, IOPs and sober living.",
    icon: MessagesSquare,
    tileClass: "bg-slate-500 text-white dark:bg-slate-600",
    archived: true,
  },
  {
    id: "boundaries",
    title: "Setting Boundaries",
    description: "Earlier conversations about boundaries.",
    icon: Shield,
    tileClass: "bg-slate-500 text-white dark:bg-slate-600",
    archived: true,
  },
  {
    id: "self-care",
    title: "Self-Care & Wellness",
    description: "Earlier conversations about looking after yourself.",
    icon: Sparkles,
    tileClass: "bg-slate-500 text-white dark:bg-slate-600",
    archived: true,
  },
  {
    id: "recovery-wins",
    title: "Recovery Wins & Celebrations",
    description: "Milestones and good news members shared.",
    icon: Trophy,
    tileClass: "bg-slate-500 text-white dark:bg-slate-600",
    archived: true,
  },
  {
    id: "resources",
    title: "Resources & Recommendations",
    description: "Books, podcasts and articles members recommended.",
    icon: BookOpen,
    tileClass: "bg-slate-500 text-white dark:bg-slate-600",
    archived: true,
  },
  {
    id: "intervention",
    title: "Intervention Discussions",
    description: "Earlier conversations about interventions.",
    icon: HeartHandshake,
    tileClass: "bg-slate-500 text-white dark:bg-slate-600",
    archived: true,
  },
];

export const ALL_TOPICS: ForumTopicDef[] = [...ACTIVE_TOPICS, ...ARCHIVED_TOPICS];
export const ACTIVE_TOPIC_IDS: string[] = ACTIVE_TOPICS.map((t) => t.id);

export function getForumTopic(id: string | null | undefined): ForumTopicDef | null {
  if (!id) return null;
  return ALL_TOPICS.find((t) => t.id === id) ?? null;
}

export function isActiveTopic(id: string | null | undefined): boolean {
  return !!id && ACTIVE_TOPIC_IDS.includes(id);
}

/** Maps any topic id (old or unknown) to an active space for new conversations. */
export function toActiveTopicId(id: string | null | undefined): string {
  return isActiveTopic(id) ? (id as string) : DEFAULT_TOPIC_ID;
}

/** Permalink to a thread (or a reply: the topic page highlights its thread). */
export function forumPostLink(topicId: string, postId: string): string {
  return `/family-forum/${encodeURIComponent(topicId)}?post=${encodeURIComponent(postId)}`;
}

/**
 * A same-site path that is safe to link to: starts with a single "/", has no
 * scheme, backslashes, whitespace or characters that would break a link.
 * Returns null when the value is not acceptable.
 */
export function sanitizeRefPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (value.length < 1 || value.length > 300) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  if (!/^\/[A-Za-z0-9/_\-.~?=&%#+]*$/.test(value)) return null;
  return value;
}

/** Deep link that opens the new-conversation form, optionally prefilled. */
export function forumComposeLink(
  topicId: string,
  options: { title?: string; ref?: string } = {},
): string {
  const params = new URLSearchParams({ compose: "1" });
  if (options.title) params.set("title", options.title);
  const ref = sanitizeRefPath(options.ref);
  if (ref) params.set("ref", ref);
  return `/family-forum/${encodeURIComponent(toActiveTopicId(topicId))}?${params.toString()}`;
}

/** Display name for a forum author: username only, never a real name. */
export function forumDisplayName(
  username: string | null | undefined,
  isAnonymous = false,
): string {
  if (isAnonymous) return "Anonymous member";
  const name = (username ?? "").trim();
  return name || "Member";
}
