// Worksheets (PDFs) attached to a meeting recording: the names, limits and
// small text rules shared by the admin upload and the member download.
//
// Pure on purpose: no imports from the app, so it can be unit-tested with
// `deno test --no-lock tests/recording-worksheets.test.ts`.

/** The private storage bucket the PDFs live in. */
export const WORKSHEET_BUCKET = "recording-worksheets";
/** The table with one row per uploaded PDF. */
export const WORKSHEET_TABLE = "recording_worksheets";
/** The columns the screens read, in one place so both ask for the same thing. */
export const WORKSHEET_COLUMNS = "id, recording_id, title, file_path, file_name, file_size, sort_order, created_at";
export const WORKSHEET_MIME = "application/pdf";
/** 20 MB, the same limit the bucket and the table enforce. */
export const WORKSHEET_MAX_BYTES = 20 * 1024 * 1024;
export const WORKSHEET_TITLE_MAX = 120;
/** The longest download name, including the ".pdf" ending. */
export const WORKSHEET_FILE_NAME_MAX = 120;
export const WORKSHEET_FALLBACK_FILE_NAME = "worksheet.pdf";
export const WORKSHEET_FALLBACK_TITLE = "Worksheet";
/** How long a member's download link works. */
export const WORKSHEET_LINK_SECONDS = 60;

export interface RecordingWorksheet {
  id: string;
  recording_id: string;
  title: string;
  file_path: string;
  file_name: string;
  file_size: number;
  sort_order: number;
  created_at: string;
}

export type WorksheetFileCheck = { ok: true } | { ok: false; reason: string };

const PDF_ENDING = /\.pdf$/i;

/** Shortens text to `max` characters without cutting an emoji in half. */
function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const points = Array.from(text);
  let length = text.length;
  while (points.length > 0 && length > max) {
    length -= points.pop()!.length;
  }
  return points.join("");
}

/** Is this file one we can take? A PDF (by type and by name), not empty, 20 MB at most. */
export function validateWorksheetFile(file: { name: string; type: string; size: number }): WorksheetFileCheck {
  const name = typeof file?.name === "string" ? file.name.trim() : "";
  const type = typeof file?.type === "string" ? file.type.trim().toLowerCase() : "";
  const size = file?.size;

  if (type !== WORKSHEET_MIME || !PDF_ENDING.test(name)) {
    return { ok: false, reason: "Only PDF files can be added as worksheets." };
  }
  if (typeof size !== "number" || !Number.isFinite(size) || size <= 0) {
    return { ok: false, reason: "This file is empty." };
  }
  if (size > WORKSHEET_MAX_BYTES) {
    return { ok: false, reason: "This file is larger than 20 MB." };
  }
  return { ok: true };
}

/**
 * The name a member's download gets, made from the worksheet's title (or a
 * file name): lowercase letters, digits and dashes, ending in ".pdf".
 */
export function worksheetDownloadName(titleOrFileName: string): string {
  const ending = ".pdf";
  const base = String(titleOrFileName ?? "")
    .trim()
    .replace(PDF_ENDING, "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, WORKSHEET_FILE_NAME_MAX - ending.length)
    .replace(/-+$/g, "");
  return base ? `${base}${ending}` : WORKSHEET_FALLBACK_FILE_NAME;
}

/** Where the PDF is kept inside the bucket: `<recording id>/<random uuid>.pdf`. */
export function worksheetObjectPath(recordingId: string, uuid: string): string {
  return `${String(recordingId).trim().toLowerCase()}/${String(uuid).trim().toLowerCase()}.pdf`;
}

/** A title as it is saved: single spaces, trimmed, 120 characters at most. Empty when there is nothing left. */
export function cleanWorksheetTitle(title: string): string {
  const tidy = String(title ?? "").replace(/\s+/g, " ").trim();
  return clamp(tidy, WORKSHEET_TITLE_MAX).trim();
}

/** A readable first title from a file name: "week-3_boundaries.PDF" becomes "week 3 boundaries". */
export function defaultWorksheetTitle(fileName: string): string {
  const withoutEnding = String(fileName ?? "")
    .trim()
    .replace(/\.[A-Za-z0-9]{1,5}$/, "");
  const title = cleanWorksheetTitle(withoutEnding.replace(/[-_]+/g, " "));
  return title || WORKSHEET_FALLBACK_TITLE;
}

/** "640 KB", "1.4 MB". Empty when the size is unknown. */
export function formatFileSize(bytes: number): string {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return bytes === 1 ? "1 byte" : `${Math.round(bytes)} bytes`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb < 10 ? (Math.round(mb * 10) / 10).toFixed(1) : Math.round(mb)} MB`;
  return `${(Math.round((mb / 1024) * 10) / 10).toFixed(1)} GB`;
}

/** "1 worksheet", "2 worksheets". */
export function worksheetCountLabel(count: number): string {
  return count === 1 ? "1 worksheet" : `${count} worksheets`;
}

/** Worksheets in the order members see them: the chosen order, then oldest first. */
export function sortWorksheets<T extends { sort_order: number; created_at: string }>(worksheets: T[]): T[] {
  return [...worksheets].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || String(a.created_at).localeCompare(String(b.created_at)),
  );
}

/** Groups worksheets by the recording they belong to, each group in display order. */
export function groupWorksheetsByRecording<T extends { recording_id: string; sort_order: number; created_at: string }>(
  worksheets: T[],
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const worksheet of worksheets) {
    (groups[worksheet.recording_id] ||= []).push(worksheet);
  }
  for (const id of Object.keys(groups)) groups[id] = sortWorksheets(groups[id]);
  return groups;
}

/**
 * True when the error only says the worksheets table or bucket has not been
 * created yet (the database change lands after the code). The screens treat
 * that as "no worksheets yet", not as a failure.
 */
export function isWorksheetsNotReadyError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: unknown; message?: unknown; statusCode?: unknown };
  const code = typeof e.code === "string" ? e.code : "";
  const message = typeof e.message === "string" ? e.message : "";
  if (code === "PGRST205" || code === "42P01") return true;
  if (/could not find the table/i.test(message)) return true;
  if (/relation .* does not exist/i.test(message)) return true;
  if (/bucket not found/i.test(message)) return true;
  return false;
}
