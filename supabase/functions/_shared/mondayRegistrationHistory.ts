// Owner-only context. Counts come from the service-only aggregate RPC, not
// mutable registration_source, attendance or future auto-enrolment preference.
export interface ManualHistory {
  verifiedManual: number;
  unclassified: number;
  completeSince: string | null;
}

export function manualHistoryText(history: ManualHistory | null): string {
  if (!history) return "Unavailable — registration history lookup failed. This is not a zero count.";
  return `${history.verifiedManual} verified prior manual registration occurrence(s); ` +
    `${history.unclassified} prior occurrence(s) have unknown manual-action history and are not counted. ` +
    (history.completeSince
      ? `Continuous manual-action capture certified since ${history.completeSince}. Earlier history may be incomplete. `
      : "Continuous capture start has not yet been certified. ") +
    "Only explicit service-recorded manual actions count, including manual signups for an existing automatic/app seat. " +
    "This is a lower bound, not a lifetime total or attendance count. Current and future meetings and duplicate occurrences are excluded.";
}
