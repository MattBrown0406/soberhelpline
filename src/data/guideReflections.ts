// "Reflect and write" questions shown at the end of each library guide.
// Keyed by route. The questions are the guide's own reflection questions,
// moved here so they can be answered and saved (useSavedTool key
// "notes:<path>"). A guide with no entry gets the general questions.
import pillars12 from "./reflections/pillars-1-2.json";
import pillar3 from "./reflections/pillar-3.json";
import pillars456 from "./reflections/pillars-4-5-6.json";
import tools from "./reflections/tools.json";

export const GENERAL_REFLECTION: string[] = [
  "What in this guide sounded most like your family right now?",
  "What is one thing you want to do differently this week because of it?",
];

export const guideReflections: Record<string, string[]> = {
  ...(pillars12 as Record<string, string[]>),
  ...(pillar3 as Record<string, string[]>),
  ...(pillars456 as Record<string, string[]>),
  ...(tools as Record<string, string[]>),
};

export const reflectionKey = (path: string) => `notes:${path}`;

export function reflectionPrompts(path: string): string[] {
  const own = guideReflections[path];
  return own && own.length > 0 ? own : GENERAL_REFLECTION;
}
