const retryKey = "site-bootstrap-retry";

// A document reload gives the browser a fresh module graph after a failed
// dynamic import. Limit it to one attempt, even when the server stays offline.
export function retryBootstrap(
  error: unknown,
  storage: Pick<Storage, "getItem" | "setItem">,
  path: string,
  reload: () => void,
): boolean {
  if (!(error instanceof Error) || !/Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(error.message)) {
    return false;
  }
  try {
    if (storage.getItem(retryKey) === path) return false;
    storage.setItem(retryKey, path);
  } catch {
    // Without storage we cannot safely prevent a reload loop.
    return false;
  }
  reload();
  return true;
}

export function clearBootstrapRetry(storage: Pick<Storage, "removeItem">): void {
  try {
    storage.removeItem(retryKey);
  } catch {
    // Storage may be disabled by the browser.
  }
}