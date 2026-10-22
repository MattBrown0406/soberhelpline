export interface NotificationContext {
  priorRegisteredWeeks: number;
  weeksWithAutomaticSource: number;
  comments: { id: string; source: string | null; question: string | null }[];
}
export function validNotificationContext(value: unknown): value is NotificationContext {
  if (!value || typeof value !== "object") return false;
  const c = value as NotificationContext;
  return Number.isSafeInteger(c.priorRegisteredWeeks) && c.priorRegisteredWeeks >= 0 &&
    Number.isSafeInteger(c.weeksWithAutomaticSource) && c.weeksWithAutomaticSource >= 0 &&
    c.weeksWithAutomaticSource <= c.priorRegisteredWeeks && Array.isArray(c.comments) &&
    c.comments.every(n => typeof n.id === "string" && (n.source === null || typeof n.source === "string") &&
      (n.question === null || typeof n.question === "string"));
}
export function registeredHistoryText(context: NotificationContext | null): string {
  if (!context) return "Prior registration history unavailable (not a zero count).";
  return `${context.priorRegisteredWeeks} prior distinct registered week(s), excluding this and future weeks. ` +
    `${context.weeksWithAutomaticSource} of those weeks include an explicitly automatic-source row. ` +
    "Other rows may also be automatic or have unknown provenance. This includes all registration sources; " +
    "it is not an exact manual-signup total or an attendance count.";
}
