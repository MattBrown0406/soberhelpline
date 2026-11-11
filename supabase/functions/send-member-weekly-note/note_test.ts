// Run: deno test --no-lock supabase/functions/send-member-weekly-note/note_test.ts
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import tracksFile from "../_shared/memberTracks.json" with { type: "json" };
import exercisesFile from "../_shared/memberExercises.json" with { type: "json" };
import {
  type Exercise,
  exerciseIdFromPath,
  isSendWindow,
  nextStep,
  periodTuesday,
  pickExercise,
  renderWeeklyNote,
  topThreads,
  type Track,
} from "./note.ts";

const TRACKS = (tracksFile as { tracks: Track[] }).tracks;
const EXERCISES = (exercisesFile as { exercises: Exercise[] }).exercises;

const track: Track = {
  id: "t",
  title: "Boundary-Setting",
  steps: [
    { title: "Read A", path: "/a" },
    { title: "Read B", path: "/b" },
    { title: "Write a boundary", path: "/workbook/boundary-script" },
  ],
};

Deno.test("send window: Tuesday 4 to 7 PM Pacific, both DST seasons", () => {
  assert(isSendWindow(new Date("2026-06-09T23:10:00Z")), "PDT: Tue 16:10");
  assert(isSendWindow(new Date("2026-06-10T00:10:00Z")), "PDT: Tue 17:10");
  assert(isSendWindow(new Date("2026-06-10T01:50:00Z")), "PDT: Tue 18:50");
  assert(!isSendWindow(new Date("2026-06-10T02:00:00Z")), "PDT: Tue 19:00");
  assert(!isSendWindow(new Date("2026-06-09T22:50:00Z")), "PDT: Tue 15:50");
  assert(isSendWindow(new Date("2026-11-11T00:20:00Z")), "PST: Tue 16:20");
  assert(isSendWindow(new Date("2026-11-11T02:50:00Z")), "PST: Tue 18:50");
  assert(!isSendWindow(new Date("2026-11-11T03:00:00Z")), "PST: Tue 19:00");
  assert(!isSendWindow(new Date("2026-11-10T23:20:00Z")), "PST: Tue 15:20");
  assert(!isSendWindow(new Date("2026-11-11T16:00:00Z")), "Wednesday morning");
});

Deno.test("period key is that Tuesday (Pacific)", () => {
  assertEquals(periodTuesday(new Date("2026-11-11T00:20:00Z")), "2026-11-10"); // Tue 4:20 PM PST
  assertEquals(periodTuesday(new Date("2026-11-12T18:00:00Z")), "2026-11-10"); // Thursday
  assertEquals(periodTuesday(new Date("2026-11-09T18:00:00Z")), "2026-11-03"); // Monday
});

Deno.test("next step is the first step of her track not completed", () => {
  assertEquals(nextStep([track], "t", new Set()), { kind: "step", trackTitle: "Boundary-Setting", title: "Read A", path: "/a" });
  assertEquals(nextStep([track], "t", new Set(["/a"])), { kind: "step", trackTitle: "Boundary-Setting", title: "Read B", path: "/b" });
  assertEquals(
    nextStep([track], "t", new Set(["/a", "/b"])),
    { kind: "step", trackTitle: "Boundary-Setting", title: "Write a boundary", path: "/workbook/boundary-script" },
  );
  assertEquals(nextStep([track], "t", new Set(["/a", "/b", "/workbook/boundary-script"])).kind, "done");
  assertEquals(nextStep([track], null, new Set()).kind, "choose");
  assertEquals(nextStep([track], "unknown-track", new Set()).kind, "choose");
});

Deno.test("real tracks file: every track resolves a first step", () => {
  assert(TRACKS.length >= 1);
  for (const t of TRACKS) {
    const n = nextStep(TRACKS, t.id, new Set());
    assertEquals(n.kind, "step");
  }
});

Deno.test("exercise rotates by week and skips ones done in the last 30 days", () => {
  const a = pickExercise(EXERCISES, new Set(), "2026-11-10")!;
  const b = pickExercise(EXERCISES, new Set(), "2026-11-17")!;
  assert(a.id !== b.id, "next week suggests a different exercise");
  const skipped = pickExercise(EXERCISES, new Set([a.id]), "2026-11-10")!;
  assert(skipped.id !== a.id);
  assertEquals(pickExercise(EXERCISES, new Set(EXERCISES.map((e) => e.id)), "2026-11-10"), null);
  // Doesn't repeat the exercise already shown as her next step.
  const excl = pickExercise(EXERCISES, new Set(), "2026-11-10", a.id)!;
  assert(excl.id !== a.id);
  assertEquals(exerciseIdFromPath("/workbook/boundary-script"), "boundary-script");
  assertEquals(exerciseIdFromPath("/boundary-drift"), null);
});

Deno.test("top threads: most replies first, titled only, at most three", () => {
  const posts = [
    { id: "1", topic_id: "ask-community", title: "One", created_at: "2026-11-05T00:00:00Z" },
    { id: "2", topic_id: "ask-community", title: "Two", created_at: "2026-11-06T00:00:00Z" },
    { id: "3", topic_id: "introductions", title: "  ", created_at: "2026-11-07T00:00:00Z" },
    { id: "4", topic_id: "this-weeks-meeting", title: "Four", created_at: "2026-11-08T00:00:00Z" },
    { id: "5", topic_id: "ask-community", title: "Five", created_at: "2026-11-09T00:00:00Z" },
  ];
  const counts = new Map([["1", 5], ["2", 1], ["3", 9], ["4", 1]]);
  assertEquals(topThreads(posts, counts).map((t) => t.id), ["1", "4", "2"]);
});

Deno.test("rendering: blocks appear only when real, values escaped", () => {
  const base = {
    firstName: "<Ann>",
    periodKey: "2026-11-10",
    recordingPublished: false,
    answeredCount: 0,
    next: { kind: "choose" as const },
    exercise: null,
    threads: [],
  };
  const plain = renderWeeklyNote(base).html;
  assert(plain.includes("will be posted soon"));
  assert(!plain.includes("/member-qa"));
  assert(!plain.includes("Try this week"));
  assert(plain.includes("Choose your path"));
  assert(plain.includes("&lt;Ann&gt;") && !plain.includes("<Ann>"));
  assert(plain.includes("Monday, November 16"));
  assert(plain.includes("/member-home#email-settings"));
  assert(plain.includes("/family-forum/this-weeks-meeting"));

  const full = renderWeeklyNote({
    ...base,
    recordingPublished: true,
    answeredCount: 3,
    next: { kind: "step", trackTitle: "Boundary-Setting", title: "Read B", path: "/b" },
    exercise: { id: "guilt-check", title: "Guilt or responsibility?", minutes: 5 },
    threads: [{ id: "p9", topicId: "ask-community", title: "How do you say no?", replies: 4 }],
  }).html;
  assert(full.includes("/zoom-recordings"));
  assert(full.includes("3 member questions") && full.includes("/member-qa"));
  assert(full.includes("https://soberhelpline.com/b"));
  assert(full.includes("/workbook/guilt-check") && full.includes("about 5 minutes"));
  // The forum block links to the forum, without any member's thread title.
  assert(full.includes("https://soberhelpline.com/family-forum\""));
  assert(!full.includes("How do you say no?") && !full.includes("post=p9"));
});
