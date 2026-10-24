export interface AutoRegistrationRecord {
  id: string;
  name: string;
  email: string;
  created_at: string;
  auto_register?: boolean | null;
}

export const normalizeRegistrationEmail = (email: string) => email.trim().toLowerCase();

export function autoRegistrationSubscribers<T extends AutoRegistrationRecord>(records: T[]): T[] {
  const subscribers = new Map<string, T>();
  for (const record of records) {
    const email = normalizeRegistrationEmail(record.email);
    if (!record.auto_register || !email) continue;
    const existing = subscribers.get(email);
    if (!existing || record.created_at > existing.created_at) subscribers.set(email, record);
  }
  return [...subscribers.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function autoRegistrationIds(records: AutoRegistrationRecord[], email: string): string[] {
  const normalized = normalizeRegistrationEmail(email);
  if (!normalized) return [];
  return records.filter(record => record.auto_register && normalizeRegistrationEmail(record.email) === normalized)
    .map(record => record.id);
}

export async function disableAutoRegistration(
  ids: string[],
  updateBatch: (ids: string[], changes: { auto_register: false }) => Promise<string[]>,
): Promise<void> {
  if (!ids.length) throw new Error("No active auto-registration records found. Refresh and try again.");
  for (let offset = 0; offset < ids.length; offset += 100) {
    const batch = ids.slice(offset, offset + 100);
    const updated = new Set(await updateBatch(batch, { auto_register: false }));
    if (batch.some(id => !updated.has(id))) throw new Error("Not all records were updated. Refresh and try again.");
  }
}