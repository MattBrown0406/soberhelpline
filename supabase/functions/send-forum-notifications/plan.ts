// Pure planning + rendering for send-forum-notifications (no I/O, unit tested
// in plan_test.ts). index.ts loads the rows, calls collectNotices, looks up the
// recipients, calls buildEmails, then claims each email's ledger rows before
// sending.
//
// Privacy: member emails never contain a post body or anyone's name. The reply
// email may quote the recipient's OWN post title; the followed-topics email may
// list thread titles. Only the admin host alert carries a question's title and
// text, and even that never names the author.

export const SITE_URL = "https://soberhelpline.com";
export const HOST_TOPIC_ID = "this-weeks-meeting";
export const SETTINGS_URL = `${SITE_URL}/member-home#email-settings`;

export interface ForumPost {
  id: string;
  topic_id: string;
  parent_post_id: string | null;
  user_id: string;
  is_anonymous: boolean | null;
  title: string | null;
  content: string | null;
  created_at: string;
}

export interface ForumMention {
  post_id: string;
  mentioned_user_id: string;
  created_at: string;
}

export interface TopicFollow {
  topic_id: string;
  user_id: string;
}

export type NoticeKind = "reply" | "mention" | "followed" | "host_alert";

/** One ledger row's worth of work: tell `recipientId` about `postId`. */
export interface Notice {
  kind: NoticeKind;
  postId: string;
  recipientId: string;
  topicId: string;
  /** Top-level post of the thread (the post itself when it is top-level). */
  threadId: string;
  createdAt: string;
  /** reply: the recipient's own post title; followed/host_alert: the thread title. */
  title?: string | null;
  /** host_alert only (admins): the question text. */
  content?: string | null;
}

export interface RecipientInfo {
  /** Verified address from Auth, or null (unverified / banned / missing). */
  email: string | null;
  isMember: boolean;
  isAdmin: boolean;
  replies: boolean;
  mentions: boolean;
  followed: boolean;
}

export interface PlannedEmail {
  kind: NoticeKind;
  recipientId: string;
  email: string;
  notices: Notice[];
}

export function ledgerKey(kind: NoticeKind, postId: string, recipientId: string): string {
  return `${kind}:${postId}:${recipientId}`;
}

export interface CollectInput {
  /** Posts created inside the window. */
  recentPosts: ForumPost[];
  /** Older posts needed for context (reply parents, mentioned posts). */
  relatedPosts: ForumPost[];
  /** Mentions created inside the window. */
  mentions: ForumMention[];
  follows: TopicFollow[];
  adminIds: string[];
  /** ledgerKey(...) of rows already in forum_notification_log. */
  logged: Set<string>;
}

/**
 * Every notification the window's activity calls for, minus the ones already
 * in the ledger. Never notifies someone about their own post.
 */
export function collectNotices(input: CollectInput): Notice[] {
  const byId = new Map<string, ForumPost>();
  for (const p of input.relatedPosts) byId.set(p.id, p);
  for (const p of input.recentPosts) byId.set(p.id, p);

  const out: Notice[] = [];
  const seen = new Set<string>();
  const push = (n: Notice) => {
    const key = ledgerKey(n.kind, n.postId, n.recipientId);
    if (seen.has(key) || input.logged.has(key)) return;
    seen.add(key);
    out.push(n);
  };

  // Replies: to the author of the parent post, unless they wrote the reply.
  for (const p of input.recentPosts) {
    if (!p.parent_post_id) continue;
    const parent = byId.get(p.parent_post_id);
    if (!parent || !parent.user_id || parent.user_id === p.user_id) continue;
    push({
      kind: "reply",
      postId: p.id,
      recipientId: parent.user_id,
      topicId: p.topic_id,
      threadId: parent.parent_post_id ?? parent.id,
      createdAt: p.created_at,
      title: parent.title,
    });
  }

  // Mentions: skip self-mentions, mentions from an anonymous post (the email
  // would point at its author), and posts that already brought that person a
  // reply email. (A reply and a mention for the same post in the same run are
  // reduced to one email in buildEmails, after her preferences are applied.)
  for (const m of input.mentions) {
    const post = byId.get(m.post_id);
    if (!post || !m.mentioned_user_id || m.mentioned_user_id === post.user_id) continue;
    if (post.is_anonymous) continue;
    if (input.logged.has(ledgerKey("reply", post.id, m.mentioned_user_id))) continue;
    push({
      kind: "mention",
      postId: post.id,
      recipientId: m.mentioned_user_id,
      topicId: post.topic_id,
      threadId: post.parent_post_id ?? post.id,
      createdAt: m.created_at,
    });
  }

  // Followed topics: new top-level posts, to followers other than the author.
  const followersByTopic = new Map<string, string[]>();
  for (const f of input.follows) {
    const list = followersByTopic.get(f.topic_id) ?? [];
    list.push(f.user_id);
    followersByTopic.set(f.topic_id, list);
  }
  for (const p of input.recentPosts) {
    if (p.parent_post_id) continue;
    for (const uid of followersByTopic.get(p.topic_id) ?? []) {
      if (!uid || uid === p.user_id) continue;
      // This post already brought her a mention email.
      if (input.logged.has(ledgerKey("mention", p.id, uid))) continue;
      push({
        kind: "followed",
        postId: p.id,
        recipientId: uid,
        topicId: p.topic_id,
        threadId: p.id,
        createdAt: p.created_at,
        title: p.title,
      });
    }
  }

  // Host alert: new top-level posts in This Week's Meeting, to admins. Not
  // for threads an admin posted (including the automatic after-meeting
  // thread, which is posted from an admin account): those aren't a member's
  // question.
  const adminSet = new Set(input.adminIds);
  for (const p of input.recentPosts) {
    if (p.parent_post_id || p.topic_id !== HOST_TOPIC_ID) continue;
    if (adminSet.has(p.user_id)) continue;
    for (const adminId of input.adminIds) {
      if (!adminId || adminId === p.user_id) continue;
      push({
        kind: "host_alert",
        postId: p.id,
        recipientId: adminId,
        topicId: p.topic_id,
        threadId: p.id,
        createdAt: p.created_at,
        title: p.title,
        content: p.content,
      });
    }
  }

  return out;
}

/** Whether this recipient may get this kind of email. */
export function allowed(kind: NoticeKind, info: RecipientInfo | undefined): boolean {
  if (!info || !info.email) return false;
  switch (kind) {
    case "host_alert":
      return info.isAdmin;
    case "reply":
      return info.isMember && info.replies;
    case "mention":
      return info.isMember && info.mentions;
    case "followed":
      return info.isMember && info.followed;
  }
}

/**
 * Groups allowed notices into emails: one per thread for replies and mentions,
 * one per recipient for followed topics, one per question for host alerts.
 * Oldest first; at most `cap` emails.
 */
export function buildEmails(
  notices: Notice[],
  recipients: Map<string, RecipientInfo>,
  cap: number,
): PlannedEmail[] {
  const groups = new Map<string, PlannedEmail>();
  const permitted = notices.filter((n) => allowed(n.kind, recipients.get(n.recipientId)));
  // One email per person per post: a reply beats a mention, and a mention
  // beats "new conversation in a topic you follow". Decided after her
  // preferences, so switching replies off doesn't also silence mentions.
  const has = new Set(permitted.map((n) => ledgerKey(n.kind, n.postId, n.recipientId)));
  const deduped = permitted.filter((n) => {
    if (n.kind === "mention") return !has.has(ledgerKey("reply", n.postId, n.recipientId));
    if (n.kind === "followed") return !has.has(ledgerKey("mention", n.postId, n.recipientId));
    return true;
  });
  const sorted = deduped.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  for (const n of sorted) {
    const info = recipients.get(n.recipientId);
    const groupKey = n.kind === "followed"
      ? `followed:${n.recipientId}`
      : n.kind === "host_alert"
      ? `host_alert:${n.recipientId}:${n.postId}`
      : `${n.kind}:${n.recipientId}:${n.threadId}`;
    const g = groups.get(groupKey);
    if (g) {
      g.notices.push(n);
    } else {
      groups.set(groupKey, { kind: n.kind, recipientId: n.recipientId, email: info!.email!, notices: [n] });
    }
  }
  return [...groups.values()].slice(0, Math.max(0, cap));
}

// ---------------------------------------------------------------- rendering

export function escapeHtml(text: string | null | undefined): string {
  const map: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  };
  return String(text ?? "").replace(/[&<>"']/g, (m) => map[m]);
}

export function permalink(topicId: string, postId: string): string {
  return `${SITE_URL}/family-forum/${encodeURIComponent(topicId)}?post=${encodeURIComponent(postId)}`;
}

function cleanTitle(title: string | null | undefined, max = 120): string {
  const t = String(title ?? "").replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

function button(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block; padding:12px 24px; background-color:#166534; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:bold; font-size:15px;">${escapeHtml(label)}</a>`;
}

function layout(inner: string, footerNote: string): string {
  return `
    <div style="max-width:600px; margin:0 auto; font-family:Arial, sans-serif; color:#1f2937; line-height:1.6;">
      ${inner}
      <p style="color:#6b7280; font-size:13px; margin-top:30px; border-top:1px solid #e5e7eb; padding-top:15px;">
        ${footerNote}
        <a href="${SETTINGS_URL}" style="color:#6b7280;">Change your email settings</a>.
      </p>
      <p style="color:#6b7280; font-size:12px;">Sober Helpline — Supporting Families Through Recovery</p>
    </div>`;
}

const MEMBER_FOOTER =
  "You're getting this because you're a Sober Helpline member. These emails never include the text of anyone's post or who wrote it.";

export function renderEmail(e: PlannedEmail): { subject: string; html: string } {
  const first = e.notices[0];
  switch (e.kind) {
    case "reply": {
      const own = cleanTitle(first.title);
      const many = e.notices.length > 1;
      const what = own ? `your post “${escapeHtml(own)}”` : "your post";
      const line = many
        ? `There are ${e.notices.length} new replies to ${what} in the family forum.`
        : `Someone replied to ${what} in the family forum.`;
      return {
        subject: "Someone replied to your post",
        html: layout(
          `<h1 style="color:#166534; font-size:22px;">A new reply for you</h1>
           <p>${line}</p>
           <p style="margin:24px 0;">${button(permalink(first.topicId, first.postId), "Read the reply")}</p>`,
          MEMBER_FOOTER,
        ),
      };
    }
    case "mention": {
      return {
        subject: "Someone mentioned you in the family forum",
        html: layout(
          `<h1 style="color:#166534; font-size:22px;">You were mentioned</h1>
           <p>Someone mentioned you in a conversation in the family forum.</p>
           <p style="margin:24px 0;">${button(permalink(first.topicId, first.postId), "See the conversation")}</p>`,
          MEMBER_FOOTER,
        ),
      };
    }
    case "followed": {
      const items = e.notices.map((n) => {
        const t = cleanTitle(n.title) || "A new conversation";
        return `<li style="margin-bottom:10px;"><a href="${escapeHtml(permalink(n.topicId, n.postId))}" style="color:#166534; font-weight:bold;">${escapeHtml(t)}</a></li>`;
      }).join("");
      const one = e.notices.length === 1;
      return {
        subject: one ? "A new conversation in a topic you follow" : "New conversations in topics you follow",
        html: layout(
          `<h1 style="color:#166534; font-size:22px;">${one ? "A new conversation" : "New conversations"} in the family forum</h1>
           <p>${one ? "There is a new conversation" : `There are ${e.notices.length} new conversations`} in a topic you follow:</p>
           <ul style="padding-left:20px;">${items}</ul>`,
          MEMBER_FOOTER + " You follow these topics in the forum; you can unfollow them there.",
        ),
      };
    }
    case "host_alert": {
      const t = cleanTitle(first.title, 200) || "(no title)";
      let body = String(first.content ?? "").trim();
      if (body.length > 4000) body = `${body.slice(0, 3999)}…`;
      return {
        subject: "New question for Monday's meeting",
        html: layout(
          `<h1 style="color:#166534; font-size:22px;">A member asked a question for Monday</h1>
           <p style="margin-bottom:4px;"><strong>${escapeHtml(t)}</strong></p>
           <div style="white-space:pre-wrap; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:16px;">${escapeHtml(body)}</div>
           <p style="margin:24px 0;">${button(permalink(first.topicId, first.postId), "Open it in the forum")}</p>`,
          "You're getting this because you're a Sober Helpline admin.",
        ),
      };
    }
  }
}
