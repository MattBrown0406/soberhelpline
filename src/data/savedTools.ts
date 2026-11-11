// Everything a member can fill in and save outside the guided exercises:
// plans, trackers and checklists (useSavedTool keys "tool:…"), guide exercises
// ("guide:…") and her notes on a guide ("notes:<path>"). Used by the dashboard
// and My Workbook to show what she has saved and link back to it.
import { findLibraryItem } from "./memberLibrary";

export interface SavedToolInfo {
  key: string;
  title: string;
  path: string;
  kind: "Living plan" | "Check-in" | "Checklist" | "Worksheet" | "Reference" | "Notes";
  summary: string;
}

/** The fillable plans, check-ins and checklists, in the order shown in My Workbook. */
export const savedTools: SavedToolInfo[] = [
  {
    key: "tool:family-action-plan",
    title: "Family Recovery Action Plan",
    path: "/family-action-plan",
    kind: "Living plan",
    summary: "Your family's plan: values, boundaries, crisis response and support.",
  },
  {
    key: "tool:readiness-checklist",
    title: "Readiness for Change Checklist",
    path: "/readiness-checklist",
    kind: "Check-in",
    summary: "What their behavior (not their words) says about readiness right now.",
  },
  {
    key: "tool:relapse-warning-signs",
    title: "Relapse Warning Signs Tracker",
    path: "/relapse-warning-signs",
    kind: "Check-in",
    summary: "Spot the early signs and see the pattern over time.",
  },
  {
    key: "tool:aftercare-checklist",
    title: "Aftercare Readiness Checklist",
    path: "/aftercare-checklist",
    kind: "Living plan",
    summary: "Is everything in place before they come home from treatment?",
  },
  {
    key: "tool:treatment-red-flags",
    title: "Treatment Red Flags: Program Check",
    path: "/treatment-red-flags",
    kind: "Checklist",
    summary: "Vet each treatment program you call, and keep your notes.",
  },
  {
    key: "tool:family-advocacy-toolkit",
    title: "Family Advocacy Toolkit",
    path: "/family-advocacy-toolkit",
    kind: "Checklist",
    summary: "Working with the treatment team, with a log of calls and meetings.",
  },
  {
    key: "tool:fear-inventory",
    title: "Fear Inventory Exercise",
    path: "/fear-inventory-exercise",
    kind: "Worksheet",
    summary: "Name the fears driving your decisions and examine each one.",
  },
  {
    key: "tool:emotional-regulation",
    title: "Emotional Regulation Tools",
    path: "/emotional-regulation",
    kind: "Reference",
    summary: "Ten ways to steady yourself, and your own pause plan.",
  },
];

const GUIDE_EXERCISES: Record<string, { title: string; path: string }> = {
  "guide:addiction-progression-timeline": { title: "Addiction Progression Timeline: your family's map", path: "/addiction-progression-timeline" },
  "guide:safe-to-open-up": { title: "Is It Safe to Open Up Again? Trust self-check", path: "/safe-to-open-up" },
};

/** What a worksheet_responses key refers to, or null for keys this registry doesn't own. */
export function describeSavedKey(key: string): Pick<SavedToolInfo, "title" | "path" | "kind"> | null {
  const tool = savedTools.find((t) => t.key === key);
  if (tool) return { title: tool.title, path: tool.path, kind: tool.kind };
  const exercise = GUIDE_EXERCISES[key];
  if (exercise) return { ...exercise, kind: "Worksheet" };
  if (key.startsWith("notes:")) {
    const path = key.slice("notes:".length);
    const item = findLibraryItem(path);
    return item ? { title: `Your notes: ${item.title}`, path: item.path, kind: "Notes" } : null;
  }
  return null;
}
