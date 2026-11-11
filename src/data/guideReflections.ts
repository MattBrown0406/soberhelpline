// "Reflect and write" questions shown at the end of each library guide.
// Keyed by route. A guide with no entry gets the general questions.
// Answers are saved per guide (useSavedTool key "notes:<path>").

export const GENERAL_REFLECTION: string[] = [
  "What in this guide sounded most like your family right now?",
  "What is one thing you want to do differently this week because of it?",
];

export const guideReflections: Record<string, string[]> = {};

export const reflectionKey = (path: string) => `notes:${path}`;

export function reflectionPrompts(path: string): string[] {
  return guideReflections[path] ?? GENERAL_REFLECTION;
}
