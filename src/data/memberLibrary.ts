// The member library registry: every resource that counts toward a member's
// progress, with one path, title and type each.
//
// - Guides and tools from the Six Pillars (shown on /family-education).
// - Interactive tools with their own page, and the long worksheets embedded on
//   /family-education (path "/family-education#<card id>").
// - Short guided exercises (/workbook/<id>, from memberExercises.json).
// - Guided meditations (path "/audio/<file>").
// - Track steps that are not in the pillars (the two roadmap pages).
//
// useEducationProgress computes its totals from this list, and GuideMemberBar
// appears on every page whose route is in it.
import { legacyPageRedirects } from "@/lib/legacyRedirects";
import type { ComponentType } from "react";
import { Brain, Heart, Users, GraduationCap, Shield, TreePine } from "lucide-react";
import exercisesData from "../../supabase/functions/_shared/memberExercises.json";

export type LibraryType = "guide" | "worksheet" | "meditation";

export interface LibraryItem {
  path: string;
  title: string;
  type: LibraryType;
}

export interface PillarResource {
  title: string;
  path: string;
  color: string;
  /** Interactive tool rather than a reading guide (counts as a worksheet). */
  tool?: boolean;
  /** In-page anchor on /family-education instead of a route. */
  isAnchor?: boolean;
}

export interface Pillar {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  description: string;
  resources?: PillarResource[];
  subcategories?: { name: string; resources: PillarResource[] }[];
}

export const pillars: Pillar[] = [
  {
    id: "pillar-1",
    number: 1,
    title: "Understanding Addiction",
    subtitle: "Foundational Knowledge",
    icon: Brain,
    color: "emerald",
    description: "Build a solid foundation of knowledge about addiction as a brain-based condition.",
    resources: [
      { title: "Why Multiple Treatment Episodes Don't Mean Failure", path: "/multiple-treatment-episodes", color: "blue" },
      { title: "The Disease vs. Choice Reality Map", path: "/disease-choice-reality-map", color: "teal" },
      { title: "Addiction Progression Timeline", path: "/addiction-progression-timeline", color: "violet" },
      { title: "The 12 Steps Explained for Families", path: "/twelve-steps-explained", color: "cyan" },
      { title: "Addiction as a Stress-Regulation Disorder", path: "/addiction-as-stress-disorder", color: "pink" },
    ],
  },
  {
    id: "pillar-2",
    number: 2,
    title: "Mental Health & Dual Diagnosis",
    subtitle: "Understanding Co-Occurring Conditions",
    icon: Heart,
    color: "rose",
    description: "Learn how mental health conditions interact with and influence substance use disorders.",
    resources: [
      { title: "Understanding Drug-Induced Psychosis", path: "/drug-induced-psychosis", color: "fuchsia" },
      { title: "Mental Health vs. Substance-Induced Symptoms", path: "/mental-health-vs-substance-induced", color: "purple" },
      { title: "Understanding Eating Disorders", path: "/eating-disorders-guide", color: "pink" },
      { title: "Nervous system check-in", path: "/workbook/stress-check", color: "violet", tool: true },
      { title: "Trauma vs. Excuses: A Necessary Distinction", path: "/trauma-vs-excuses", color: "amber" },
    ],
  },
  {
    id: "pillar-3",
    number: 3,
    title: "Family Systems & Enabling",
    subtitle: "Patterns That Keep Families Stuck",
    icon: Users,
    color: "violet",
    description: "Recognize family dynamics and enabling patterns that unintentionally perpetuate addiction.",
    subcategories: [
      {
        name: "Family Systems",
        resources: [
          { title: "Family Roles in Addiction (Beyond the Clichés)", path: "/family-roles-addiction", color: "violet" },
          { title: "How Addiction Rewrites Family Rules", path: "/addiction-rewrites-family-rules", color: "teal" },
          { title: "The Hidden Cost of Being the \"Strong One\"", path: "/strong-one", color: "pink" },
          { title: "The Guilt–Relief–Resentment Cycle", path: "/guilt-relief-resentment", color: "amber" },
          { title: "Sibling Guilt, Anger, and Loyalty Conflicts", path: "/sibling-guilt-anger-loyalty", color: "purple" },
          { title: "Parents: Repairing the Sibling System", path: "/parents-repairing-sibling-system", color: "blue" },
          { title: "When Family Unity Becomes a Liability", path: "/family-unity-liability", color: "orange" },
        ],
      },
      {
        name: "Understanding Enabling",
        resources: [
          { title: "Why Change Doesn't Happen When Families Try Harder", path: "/why-change-doesnt-happen", color: "violet" },
          { title: "Crisis vs. Chaos Decision Guide", path: "/crisis-chaos", color: "red" },
          { title: "What to Say / What Not to Say", path: "/communication-guide", color: "rose" },
          { title: "How Families Accidentally Interfere with Recovery", path: "/family-interference", color: "orange" },
        ],
      },
    ],
  },
  {
    id: "pillar-4",
    number: 4,
    title: "Treatment Literacy",
    subtitle: "Navigating the Treatment System",
    icon: GraduationCap,
    color: "blue",
    description: "Become an informed advocate by understanding treatment options, red flags, and industry practices.",
    resources: [
      { title: "40 Questions to Ask a Treatment Center", path: "/treatment-questions", color: "blue" },
      { title: "Treatment Industry Red Flags Guide", path: "/treatment-red-flags", color: "red", tool: true },
      { title: "How to Talk About Treatment", path: "/talking-about-treatment", color: "indigo" },
      { title: "Aftercare Readiness Checklist", path: "/aftercare-checklist", color: "cyan", tool: true },
      { title: "Family Advocacy Toolkit", path: "/family-advocacy-toolkit", color: "green", tool: true },
      { title: "Legal Issues Families Should Understand", path: "/legal-issues-guide", color: "slate" },
      { title: "Treatment Modalities Explained", path: "/treatment-modalities", color: "violet" },
      { title: "Non–12-Step Recovery Modalities", path: "/non-twelve-step-modalities", color: "teal" },
    ],
  },
  {
    id: "pillar-5",
    number: 5,
    title: "Boundaries & Consequences",
    subtitle: "Creating Conditions for Change",
    icon: Shield,
    color: "amber",
    description: "Learn to set and maintain healthy boundaries while understanding the difference between boundaries and ultimatums.",
    resources: [
      { title: "Requests, Demands, Ultimatums & Boundaries", path: "/boundaries-ultimatums", color: "emerald" },
      { title: "Readiness for Change Checklist", path: "/readiness-checklist", color: "teal", tool: true },
      { title: "We Don't Negotiate with Terrorists", path: "/no-negotiation", color: "red" },
      { title: "Boundary Drift: How Limits Slowly Erode", path: "/boundary-drift", color: "amber" },
      { title: "Anger and Boundaries Are Not the Same Thing", path: "/anger-and-boundaries", color: "pink" },
    ],
  },
  {
    id: "pillar-6",
    number: 6,
    title: "Family Recovery",
    subtitle: "Healing for the Whole Family",
    icon: TreePine,
    color: "teal",
    description: "Focus on your own healing journey regardless of your loved one's choices.",
    resources: [
      { title: "What Changes When Families Change", path: "/what-changes-when-families-change", color: "teal" },
      { title: "Family Recovery Action Plan", path: "/family-action-plan", color: "purple", tool: true },
      { title: "Emotional Regulation Tools", path: "/emotional-regulation", color: "sky", tool: true },
      { title: "Living Well Regardless of Outcome", path: "/living-well-regardless", color: "rose" },
      { title: "Grief for the Family You Thought You'd Have", path: "/grief-for-family", color: "violet" },
      { title: "Is It Safe to Open Up Again?", path: "/safe-to-open-up", color: "rose" },
    ],
  },
];

export interface Meditation {
  title: string;
  file: string;
  color: string;
}

export const meditations: Meditation[] = [
  { title: "Staying Grounded When They Won't Accept Help", file: "staying-grounded-when-they-wont-accept-help-meditation.mp3", color: "slate" },
  { title: "Loving Enough to Let Go, Trusting Enough to Hope", file: "loving-enough-to-let-go-meditation.mp3", color: "rose" },
  { title: "Regaining Calm When Addiction Triggers Fear and Urgency", file: "regaining-calm-meditation.mp3", color: "sky" },
  { title: "Releasing Sadness and Guilt with Compassion", file: "releasing-sadness-guilt-meditation.mp3", color: "purple" },
  { title: "Allowing Hope and Happiness to Return", file: "allowing-hope-happiness-meditation.mp3", color: "amber" },
  { title: "Letting Go of What Was Never About You", file: "letting-go-not-about-you-meditation.mp3", color: "emerald" },
  { title: "What I Can Control Today", file: "what-i-can-control-today-meditation.mp3", color: "indigo" },
  { title: "You Are Allowed to Say No", file: "you-are-allowed-to-say-no-meditation.mp3", color: "teal" },
  { title: "Guided Inner Dialogue: Talking to the Part of You That's Hurting", file: "guided-inner-dialogue-meditation.mp3", color: "pink" },
  { title: "Talking to the Part That Wants to Rescue", file: "talking-to-the-part-that-wants-to-rescue-meditation.mp3", color: "cyan" },
  { title: "Connecting With Your Inner Child", file: "connecting-with-your-inner-child-meditation.mp3", color: "fuchsia" },
  { title: "Finding Steadiness Through the Holidays", file: "finding-steadiness-holiday-meditation.mp3", color: "blue" },
];

export const meditationPath = (file: string) => `/audio/${file}`;

/** Interactive tools that have their own page. */
export const interactiveTools: LibraryItem[] = [
  { title: "Relapse Warning Signs Tracker", path: "/relapse-warning-signs", type: "worksheet" },
  { title: "Fear Inventory Exercise", path: "/fear-inventory-exercise", type: "worksheet" },
];

/**
 * The long worksheets that used to be embedded on /family-education. They
 * were retired on 2026-11-11 in favour of the short guided exercises; what a
 * member wrote in them stays viewable at /workbook/earlier. `worksheetKey` is
 * the worksheet_responses key for the ones that auto-saved there (the others
 * saved to their own tables). They no longer count toward library progress.
 */
export interface EmbeddedWorksheet {
  id: string;
  title: string;
  worksheetKey?: string;
}

export const retiredWorksheets: EmbeddedWorksheet[] = [
  { id: "trauma-assessment", title: "Trauma & Hypervigilance Self-Assessment", worksheetKey: "trauma_hypervigilance_assessment" },
  { id: "worksheet-family-self-assessment", title: "Family Self-Assessment" },
  { id: "worksheet-control", title: "Control Worksheet" },
  { id: "worksheet-boundary", title: "Boundary Worksheet" },
  { id: "worksheet-scenario", title: "Scenario Practice", worksheetKey: "scenario_worksheet" },
  { id: "worksheet-guilt-responsibility", title: "Guilt vs. Responsibility", worksheetKey: "guilt_responsibility_worksheet" },
  { id: "worksheet-self-care", title: "Self-Care Worksheet", worksheetKey: "self_care_worksheet" },
];

export const EARLIER_WORKSHEETS_PATH = "/workbook/earlier";

export interface GuidedExercise {
  id: string;
  title: string;
  minutes: number;
}

export const guidedExercises: GuidedExercise[] = (exercisesData.exercises ?? []).map((e) => ({
  id: e.id,
  title: e.title,
  minutes: e.minutes,
}));

export const exercisePath = (id: string) => `/workbook/${id}`;

/** Track steps that are not part of the pillars. */
const extraGuides: LibraryItem[] = [
  { title: "Roadmap: Crisis", path: "/roadmap/crisis", type: "guide" },
  { title: "Roadmap: Relapse", path: "/roadmap/relapse", type: "guide" },
];

function pillarItems(): LibraryItem[] {
  const items: LibraryItem[] = [];
  for (const pillar of pillars) {
    const resources = pillar.resources ?? pillar.subcategories?.flatMap((s) => s.resources) ?? [];
    for (const r of resources) {
      if (r.isAnchor) continue; // embedded worksheet, listed below
      items.push({ title: r.title, path: r.path, type: r.tool ? "worksheet" : "guide" });
    }
  }
  return items;
}

function buildLibrary(): LibraryItem[] {
  const all: LibraryItem[] = [
    ...pillarItems(),
    ...extraGuides,
    ...interactiveTools,
    ...guidedExercises.map((e) => ({ title: e.title, path: exercisePath(e.id), type: "worksheet" as const })),
    ...meditations.map((m) => ({ title: m.title, path: meditationPath(m.file), type: "meditation" as const })),
  ];
  const byPath = new Map<string, LibraryItem>();
  for (const item of all) {
    if (!byPath.has(item.path)) byPath.set(item.path, item);
  }
  return Array.from(byPath.values());
}

/** Every resource that counts toward progress (unique paths). */
export const memberLibrary: LibraryItem[] = buildLibrary();

const libraryByPath = new Map(memberLibrary.map((item) => [item.path, item]));

/** The library item for a site path (trailing slash ignored), if any. */
export function findLibraryItem(path: string): LibraryItem | undefined {
  const clean = path.length > 1 ? path.replace(/\/+$/, "") : path;
  // A guide that was merged into another one resolves to the surviving page.
  return libraryByPath.get(clean) ?? libraryByPath.get(legacyPageRedirects[clean] ?? "");
}

export const LIBRARY_TYPE_TOTALS: Record<LibraryType, number> = {
  guide: memberLibrary.filter((i) => i.type === "guide").length,
  worksheet: memberLibrary.filter((i) => i.type === "worksheet").length,
  meditation: memberLibrary.filter((i) => i.type === "meditation").length,
};

/** Pages where the member bar never shows, even if listed above. */
const BAR_EXCLUDED_PREFIXES = ["/member-home", "/family-education", "/workbook", "/family-forum", "/admin"];

/** The library item the guide member bar should show for this route, if any. */
export function memberBarItem(pathname: string): LibraryItem | undefined {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (BAR_EXCLUDED_PREFIXES.some((p) => clean === p || clean.startsWith(`${p}/`))) return undefined;
  return findLibraryItem(clean);
}

// ─────────────────────────────────────────────────────────────
// Monday meeting time (always Pacific, never the viewer's zone)
// ─────────────────────────────────────────────────────────────

export const MEETING_TIME_ZONE = "America/Los_Angeles";
const MEETING_START_HOUR = 19; // 7:00 PM Pacific
const MEETING_END_HOUR = 20; // 8:00 PM Pacific

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number; // 0 = Sunday … 6 = Saturday
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let pacificFormatter: Intl.DateTimeFormat | null = null;
function pacificParts(instant: number): ZonedParts {
  if (!pacificFormatter) {
    pacificFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: MEETING_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      weekday: "short",
    });
  }
  const parts: Record<string, string> = {};
  for (const p of pacificFormatter.formatToParts(new Date(instant))) parts[p.type] = p.value;
  const hour = Number(parts.hour) % 24; // some engines print midnight as "24"
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour,
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: Math.max(0, WEEKDAYS.indexOf(parts.weekday)),
  };
}

/** Pacific UTC offset in ms at an instant (e.g. -7h during daylight time). */
function pacificOffsetMs(instant: number): number {
  const p = pacificParts(instant);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - (instant - (((instant % 1000) + 1000) % 1000));
}

/** The instant of a Pacific wall-clock time. */
function pacificWallTime(year: number, month: number, day: number, hour: number, minute = 0): number {
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  let instant = wall - pacificOffsetMs(wall);
  instant = wall - pacificOffsetMs(instant);
  return instant;
}

export interface MondayMeeting {
  /** Start of the next (or current) meeting. */
  start: Date;
  end: Date;
  /** Between 7:00 and 8:00 PM Pacific on a Monday. */
  isLive: boolean;
  /** It is Monday in Pacific time and the meeting hasn't ended yet. */
  isToday: boolean;
  /** Milliseconds until the start (0 while live). */
  msUntilStart: number;
  /** The viewer's time zone differs from Pacific at the meeting time. */
  viewerInOtherZone: boolean;
}

/** The next Monday meeting (or the one in progress), computed in Pacific time. */
export function getMondayMeeting(now: Date = new Date()): MondayMeeting {
  const nowMs = now.getTime();
  const p = pacificParts(nowMs);
  const daysUntilMonday = (1 - p.weekday + 7) % 7;
  // Pacific calendar date of the coming Monday (UTC arithmetic on the date only).
  const monday = new Date(Date.UTC(p.year, p.month - 1, p.day + daysUntilMonday));
  let start = pacificWallTime(monday.getUTCFullYear(), monday.getUTCMonth() + 1, monday.getUTCDate(), MEETING_START_HOUR);
  let end = pacificWallTime(monday.getUTCFullYear(), monday.getUTCMonth() + 1, monday.getUTCDate(), MEETING_END_HOUR);
  // Still Monday in Pacific time and this week's meeting hasn't ended yet.
  const isToday = p.weekday === 1 && nowMs < end;
  if (nowMs >= end) {
    const next = new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate() + 7));
    start = pacificWallTime(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate(), MEETING_START_HOUR);
    end = pacificWallTime(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate(), MEETING_END_HOUR);
  }
  const isLive = nowMs >= start && nowMs < end;
  const startDate = new Date(start);
  const viewerOffsetMs = -startDate.getTimezoneOffset() * 60_000;
  return {
    start: startDate,
    end: new Date(end),
    isLive,
    isToday,
    msUntilStart: Math.max(0, start - nowMs),
    viewerInOtherZone: viewerOffsetMs !== pacificOffsetMs(start),
  };
}

/** "Monday, November 17" for the meeting date, in Pacific time. */
export function formatMeetingDay(start: Date): string {
  return start.toLocaleDateString("en-US", { timeZone: MEETING_TIME_ZONE, weekday: "long", month: "long", day: "numeric" });
}

/** "4:00 PM" in the viewer's own time zone. */
export function formatViewerTime(start: Date): string {
  return start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** "in 2 days, 4 hours" / "in 35 minutes" / "in less than a minute". */
export function formatTimeUntil(ms: number): string {
  const totalMinutes = Math.ceil(ms / 60_000);
  if (totalMinutes <= 1) return "in less than a minute";
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  if (days > 0) return hours > 0 ? `in ${plural(days, "day")}, ${plural(hours, "hour")}` : `in ${plural(days, "day")}`;
  if (hours > 0) return minutes > 0 ? `in ${plural(hours, "hour")}, ${plural(minutes, "minute")}` : `in ${plural(hours, "hour")}`;
  return `in ${plural(minutes, "minute")}`;
}
