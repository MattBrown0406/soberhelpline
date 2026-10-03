// Questions asked in the Sober Helpline app are merged into a website Monday
// registration as "• … (from the app)" lines (app-family-squares-sync). They
// belong in the Monday questions view, not in lead tools.
export function withoutAppQuestions(text: string | null | undefined): string | null {
  if (!text) return null;
  const kept = text
    .split("\n")
    .filter((line) => !line.trim().endsWith("(from the app)"))
    .join("\n")
    .trim();
  return kept || null;
}
