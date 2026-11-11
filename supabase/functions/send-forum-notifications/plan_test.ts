// Run: deno test --no-lock supabase/functions/send-forum-notifications/plan_test.ts
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  buildEmails,
  collectNotices,
  type CollectInput,
  type ForumPost,
  ledgerKey,
  type RecipientInfo,
  renderEmail,
} from "./plan.ts";

const SECRET_BODY = "my son relapsed and I found pills in the car";
const SECRET_REPLY = "we went through the same thing with our daughter";

function post(p: Partial<ForumPost> & { id: string; user_id: string }): ForumPost {
  return {
    topic_id: "ask-community",
    parent_post_id: null,
    is_anonymous: false,
    title: null,
    content: "",
    created_at: "2026-11-10T10:00:00Z",
    ...p,
  };
}

function member(over: Partial<RecipientInfo> = {}): RecipientInfo {
  return {
    email: "someone@example.com",
    isMember: true,
    isAdmin: false,
    replies: true,
    mentions: true,
    followed: true,
    ...over,
  };
}

function input(over: Partial<CollectInput> = {}): CollectInput {
  return { recentPosts: [], relatedPosts: [], mentions: [], follows: [], adminIds: [], logged: new Set(), ...over };
}

const parent = post({ id: "p1", user_id: "alice", title: "Struggling this week", content: SECRET_BODY, created_at: "2026-11-01T00:00:00Z" });

Deno.test("reply notifies the parent author, never the replier", () => {
  const notices = collectNotices(input({
    relatedPosts: [parent],
    recentPosts: [
      post({ id: "r1", user_id: "bob", parent_post_id: "p1", content: SECRET_REPLY }),
      post({ id: "r2", user_id: "alice", parent_post_id: "p1", content: "thank you" }),
    ],
  }));
  assertEquals(notices.map((n) => [n.kind, n.postId, n.recipientId]), [["reply", "r1", "alice"]]);
});

Deno.test("no self-notification: own mention, own follow, own host question", () => {
  const own = post({ id: "q1", user_id: "carol", topic_id: "this-weeks-meeting", title: "Q" });
  const notices = collectNotices(input({
    recentPosts: [own],
    mentions: [{ post_id: "q1", mentioned_user_id: "carol", created_at: own.created_at }],
    follows: [{ topic_id: "this-weeks-meeting", user_id: "carol" }],
    adminIds: ["carol"],
  }));
  assertEquals(notices, []);
});

Deno.test("several replies in one thread become one email", () => {
  const notices = collectNotices(input({
    relatedPosts: [parent],
    recentPosts: [
      post({ id: "r1", user_id: "bob", parent_post_id: "p1", created_at: "2026-11-10T10:00:00Z" }),
      post({ id: "r2", user_id: "dan", parent_post_id: "p1", created_at: "2026-11-10T10:05:00Z" }),
    ],
  }));
  const emails = buildEmails(notices, new Map([["alice", member()]]), 200);
  assertEquals(emails.length, 1);
  assertEquals(emails[0].notices.map((n) => n.postId), ["r1", "r2"]);
  assert(renderEmail(emails[0]).html.includes("2 new replies"));
});

Deno.test("ledger rows prevent duplicates", () => {
  const recentPosts = [post({ id: "r1", user_id: "bob", parent_post_id: "p1" })];
  const logged = new Set([ledgerKey("reply", "r1", "alice")]);
  assertEquals(collectNotices(input({ relatedPosts: [parent], recentPosts, logged })), []);
  // A mention in a reply already emailed as a reply is not sent again.
  const mentions = [{ post_id: "r1", mentioned_user_id: "alice", created_at: "2026-11-10T10:00:00Z" }];
  assertEquals(collectNotices(input({ relatedPosts: [parent], recentPosts, mentions, logged })), []);
  // Duplicate mention rows only produce one notice.
  const twice = collectNotices(input({
    recentPosts: [post({ id: "x", user_id: "bob" })],
    mentions: [
      { post_id: "x", mentioned_user_id: "erin", created_at: "2026-11-10T10:00:00Z" },
      { post_id: "x", mentioned_user_id: "erin", created_at: "2026-11-10T10:00:00Z" },
    ],
  }));
  assertEquals(twice.length, 1);
});

Deno.test("a reply that also @mentions the parent author sends only the reply", () => {
  const notices = collectNotices(input({
    relatedPosts: [parent],
    recentPosts: [post({ id: "r1", user_id: "bob", parent_post_id: "p1" })],
    mentions: [{ post_id: "r1", mentioned_user_id: "alice", created_at: "2026-11-10T10:00:00Z" }],
  }));
  const emails = buildEmails(notices, new Map([["alice", member()]]), 10);
  assertEquals(emails.map((e) => e.kind), ["reply"]);
  // Once the reply email is in the ledger, the mention is not sent later either.
  const later = collectNotices(input({
    relatedPosts: [parent],
    recentPosts: [post({ id: "r1", user_id: "bob", parent_post_id: "p1" })],
    mentions: [{ post_id: "r1", mentioned_user_id: "alice", created_at: "2026-11-10T10:00:00Z" }],
    logged: new Set([ledgerKey("reply", "r1", "alice")]),
  }));
  assertEquals(later, []);
});

Deno.test("replies switched off does not silence a mention in that reply", () => {
  const notices = collectNotices(input({
    relatedPosts: [parent],
    recentPosts: [post({ id: "r1", user_id: "bob", parent_post_id: "p1" })],
    mentions: [{ post_id: "r1", mentioned_user_id: "alice", created_at: "2026-11-10T10:00:00Z" }],
  }));
  const emails = buildEmails(notices, new Map([["alice", member({ replies: false })]]), 10);
  assertEquals(emails.map((e) => e.kind), ["mention"]);
});

Deno.test("a new thread that mentions a follower sends one email, not two", () => {
  const thread = post({ id: "t1", user_id: "bob", title: "Hello" });
  const base = {
    recentPosts: [thread],
    mentions: [{ post_id: "t1", mentioned_user_id: "alice", created_at: "2026-11-10T10:00:00Z" }],
    follows: [{ topic_id: "ask-community", user_id: "alice" }],
  };
  const emails = buildEmails(collectNotices(input(base)), new Map([["alice", member()]]), 10);
  assertEquals(emails.map((e) => e.kind), ["mention"]);
  // Mentions off: she still hears about it as a followed topic.
  const viaFollow = buildEmails(collectNotices(input(base)), new Map([["alice", member({ mentions: false })]]), 10);
  assertEquals(viaFollow.map((e) => e.kind), ["followed"]);
  // After the mention email went out, the followed email is not sent on a later run.
  const later = collectNotices(input({ ...base, logged: new Set([ledgerKey("mention", "t1", "alice")]) }));
  assertEquals(later, []);
});

Deno.test("a mention inside an anonymous post never emails", () => {
  const anon = post({ id: "a1", user_id: "bob", is_anonymous: true, title: "Quiet question" });
  const notices = collectNotices(input({
    recentPosts: [anon],
    mentions: [{ post_id: "a1", mentioned_user_id: "alice", created_at: "2026-11-10T10:00:00Z" }],
  }));
  assertEquals(notices, []);
});

Deno.test("a thread posted by an admin (or the after-meeting bot) is not a host alert", () => {
  const botThread = post({ id: "b1", user_id: "matt", topic_id: "this-weeks-meeting", title: "Share your takeaways" });
  const notices = collectNotices(input({ recentPosts: [botThread], adminIds: ["matt", "second-admin"] }));
  assertEquals(notices, []);
});

Deno.test("preferences, membership and verified email are respected", () => {
  const notices = collectNotices(input({
    relatedPosts: [parent],
    recentPosts: [
      post({ id: "r1", user_id: "bob", parent_post_id: "p1" }),
      post({ id: "t1", user_id: "bob", title: "New thread" }),
    ],
    mentions: [{ post_id: "t1", mentioned_user_id: "erin", created_at: "2026-11-10T10:00:00Z" }],
    follows: [{ topic_id: "ask-community", user_id: "frank" }, { topic_id: "ask-community", user_id: "gina" }],
  }));
  assertEquals(notices.length, 4);
  const recipients = new Map<string, RecipientInfo>([
    ["alice", member({ replies: false })],
    ["erin", member({ mentions: false })],
    ["frank", member({ isMember: false })],
    ["gina", member({ email: null })],
  ]);
  assertEquals(buildEmails(notices, recipients, 200), []);
  // Missing recipient info = no email.
  assertEquals(buildEmails(notices, new Map(), 200), []);
  // All on.
  const on = new Map<string, RecipientInfo>([["alice", member()], ["erin", member()], ["frank", member()], ["gina", member()]]);
  assertEquals(buildEmails(notices, on, 200).length, 4);
  assertEquals(buildEmails(notices, on, 2).length, 2);
});

Deno.test("followed topics batch into one email per recipient", () => {
  const notices = collectNotices(input({
    recentPosts: [
      post({ id: "t1", user_id: "bob", title: "First thread" }),
      post({ id: "t2", user_id: "dan", topic_id: "introductions", title: "Hello from Ohio" }),
    ],
    follows: [{ topic_id: "ask-community", user_id: "frank" }, { topic_id: "introductions", user_id: "frank" }],
  }));
  const emails = buildEmails(notices, new Map([["frank", member()]]), 200);
  assertEquals(emails.length, 1);
  const { html } = renderEmail(emails[0]);
  assert(html.includes("First thread") && html.includes("Hello from Ohio"));
  assert(html.includes("/family-forum/introductions?post=t2"));
});

Deno.test("member emails never contain post bodies or author identity", () => {
  const anon = post({ id: "r1", user_id: "bob", parent_post_id: "p1", is_anonymous: true, content: SECRET_REPLY });
  // (Not anonymous: a mention inside an anonymous post never emails at all.)
  const thread = post({ id: "t1", user_id: "bob", title: "Need advice", content: SECRET_BODY });
  const notices = collectNotices(input({
    relatedPosts: [parent],
    recentPosts: [anon, thread],
    mentions: [{ post_id: "t1", mentioned_user_id: "erin", created_at: "2026-11-10T10:00:00Z" }],
    follows: [{ topic_id: "ask-community", user_id: "frank" }],
  }));
  const recipients = new Map([["alice", member()], ["erin", member()], ["frank", member()]]);
  const emails = buildEmails(notices, recipients, 200);
  assertEquals(emails.map((e) => e.kind).sort(), ["followed", "mention", "reply"]);
  for (const e of emails) {
    const { subject, html } = renderEmail(e);
    for (const text of [subject, html]) {
      assert(!text.includes(SECRET_BODY) && !text.includes(SECRET_REPLY), `${e.kind} leaked a body`);
      assert(!text.includes("bob"), `${e.kind} named the author`);
    }
  }
  const reply = renderEmail(emails.find((e) => e.kind === "reply")!);
  assert(reply.html.includes("Struggling this week"), "reply email shows the recipient's own title");
  assert(reply.html.includes("/family-forum/ask-community?post=r1"));
  const mention = renderEmail(emails.find((e) => e.kind === "mention")!);
  assert(!mention.html.includes("Need advice"), "mention email has no thread title");
});

Deno.test("host alert goes to admins only, with the question but no author", () => {
  const q = post({ id: "q1", user_id: "bob", topic_id: "this-weeks-meeting", is_anonymous: true, title: "Should we", content: "<b>text</b>" });
  const notices = collectNotices(input({ recentPosts: [q], adminIds: ["matt"] }));
  assertEquals(notices.map((n) => [n.kind, n.recipientId]), [["host_alert", "matt"]]);
  // A non-admin with the same notice would not get it.
  assertEquals(buildEmails(notices, new Map([["matt", member({ isAdmin: false })]]), 10), []);
  const emails = buildEmails(notices, new Map([["matt", member({ isAdmin: true, isMember: false })]]), 10);
  assertEquals(emails.length, 1);
  const { html } = renderEmail(emails[0]);
  assert(html.includes("&lt;b&gt;text&lt;/b&gt;"), "content is escaped");
  assert(!html.includes("bob"));
  // Replies in that topic are not host alerts.
  const replyOnly = collectNotices(input({
    relatedPosts: [q],
    recentPosts: [post({ id: "r9", user_id: "dan", topic_id: "this-weeks-meeting", parent_post_id: "q1" })],
    adminIds: ["matt"],
  }));
  assertEquals(replyOnly.map((n) => n.kind), ["reply"]);
});

Deno.test("titles are escaped", () => {
  const notices = collectNotices(input({
    recentPosts: [post({ id: "t1", user_id: "bob", title: `<img src=x onerror="a">` })],
    follows: [{ topic_id: "ask-community", user_id: "frank" }],
  }));
  const { html } = renderEmail(buildEmails(notices, new Map([["frank", member()]]), 10)[0]);
  assert(!html.includes("<img"));
});
