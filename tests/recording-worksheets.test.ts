// Run: deno test --no-lock tests/recording-worksheets.test.ts
import { assert, assertEquals, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  cleanWorksheetTitle,
  defaultWorksheetTitle,
  formatFileSize,
  groupWorksheetsByRecording,
  isWorksheetsNotReadyError,
  validateWorksheetFile,
  WORKSHEET_BUCKET,
  WORKSHEET_FILE_NAME_MAX,
  WORKSHEET_MAX_BYTES,
  WORKSHEET_TITLE_MAX,
  worksheetCountLabel,
  worksheetDownloadName,
  worksheetObjectPath,
} from "../src/lib/recordingWorksheets.ts";

const pdf = (over: Partial<{ name: string; type: string; size: number }> = {}) => ({
  name: "boundaries.pdf",
  type: "application/pdf",
  size: 250_000,
  ...over,
});

// What the database accepts for a download name.
const SAFE_NAME = /^[a-z0-9]+(-[a-z0-9]+)*\.pdf$/;

Deno.test("the bucket and the limits match the database contract", () => {
  assertEquals(WORKSHEET_BUCKET, "recording-worksheets");
  assertEquals(WORKSHEET_MAX_BYTES, 20971520);
  assertEquals(WORKSHEET_TITLE_MAX, 120);
  assertEquals(WORKSHEET_FILE_NAME_MAX, 120);
});

Deno.test("a normal PDF is accepted, whatever the case of its ending", () => {
  assertEquals(validateWorksheetFile(pdf()), { ok: true });
  assertEquals(validateWorksheetFile(pdf({ name: "Week 3 Boundaries.PDF" })), { ok: true });
  assertEquals(validateWorksheetFile(pdf({ name: "  spaced name .pdf  " })), { ok: true });
  assertEquals(validateWorksheetFile(pdf({ type: "Application/PDF" })), { ok: true });
});

Deno.test("a file must be a PDF by type and by name", () => {
  const reason = "Only PDF files can be added as worksheets.";
  assertEquals(validateWorksheetFile(pdf({ type: "image/png", name: "photo.png" })), { ok: false, reason });
  // The right name with the wrong type, and the right type with the wrong name.
  assertEquals(validateWorksheetFile(pdf({ type: "application/msword" })), { ok: false, reason });
  assertEquals(validateWorksheetFile(pdf({ name: "boundaries.docx" })), { ok: false, reason });
  assertEquals(validateWorksheetFile(pdf({ name: "boundaries" })), { ok: false, reason });
  assertEquals(validateWorksheetFile(pdf({ name: "boundaries.pdf.exe" })), { ok: false, reason });
  // No type at all is accepted only with a .pdf name (some browsers send none).
  assertEquals(validateWorksheetFile(pdf({ type: "" })), { ok: true });
  assertEquals(validateWorksheetFile(pdf({ type: "", name: "boundaries.docx" })), { ok: false, reason });
  assertEquals(validateWorksheetFile(pdf({ type: "text/html" })), { ok: false, reason });
});

Deno.test("an empty file is refused", () => {
  assertEquals(validateWorksheetFile(pdf({ size: 0 })), { ok: false, reason: "This file is empty." });
  assertEquals(validateWorksheetFile(pdf({ size: Number.NaN })), { ok: false, reason: "This file is empty." });
});

Deno.test("20 MB exactly is accepted and one byte more is refused", () => {
  assertEquals(validateWorksheetFile(pdf({ size: 1 })), { ok: true });
  assertEquals(validateWorksheetFile(pdf({ size: WORKSHEET_MAX_BYTES })), { ok: true });
  assertEquals(validateWorksheetFile(pdf({ size: WORKSHEET_MAX_BYTES + 1 })), {
    ok: false,
    reason: "This file is larger than 20 MB.",
  });
});

Deno.test("a download name is lowercase letters, digits and dashes", () => {
  assertEquals(worksheetDownloadName("Setting Boundaries with an Adult Child"), "setting-boundaries-with-an-adult-child.pdf");
  assertEquals(worksheetDownloadName("Week 3   Boundaries.PDF"), "week-3-boundaries.pdf");
  assertEquals(worksheetDownloadName("  --What do I say?? (part 2)--  "), "what-do-i-say-part-2.pdf");
  assertEquals(worksheetDownloadName("notes_final.v2.pdf"), "notes-final-v2.pdf");
  assertEquals(worksheetDownloadName("no extension"), "no-extension.pdf");
  assertEquals(worksheetDownloadName("../../etc/passwd"), "etc-passwd.pdf");
});

Deno.test("accents are flattened and emoji are dropped from a download name", () => {
  assertEquals(worksheetDownloadName("Café Señor Niño résumé"), "cafe-senor-nino-resume.pdf");
  assertEquals(worksheetDownloadName("Self-care 💙 for parents 🌱.pdf"), "self-care-for-parents.pdf");
});

Deno.test("a download name is never empty", () => {
  for (const odd of ["", "   ", ".pdf", ".PDF", "💙💙", "???", "---", "日本語"]) {
    assertEquals(worksheetDownloadName(odd), "worksheet.pdf");
  }
});

Deno.test("a very long download name is cut to 120 characters and stays tidy", () => {
  const long = worksheetDownloadName("boundaries and consequences ".repeat(30));
  assertEquals(long.length <= WORKSHEET_FILE_NAME_MAX, true);
  assertMatch(long, SAFE_NAME);
  const exact = worksheetDownloadName("a".repeat(500));
  assertEquals(exact.length, 120);
  assertEquals(exact, `${"a".repeat(116)}.pdf`);
  // A cut that lands on a dash must not leave "-.pdf".
  assertMatch(worksheetDownloadName(`${"a".repeat(115)} b c`), SAFE_NAME);
});

Deno.test("every odd name still gives a safe download name", () => {
  const odd = ["Week 3.PDF", "ÀÉÎÕÜ ç ñ", "a/b\\c:d*e?f\"g<h>i|j", "tab\tand\nnewline", "100% ready & able", "x".repeat(4000) + ".pdf"];
  for (const name of odd) {
    const safe = worksheetDownloadName(name);
    assertMatch(safe, SAFE_NAME);
    assert(safe.length <= WORKSHEET_FILE_NAME_MAX);
  }
});

Deno.test("the object path is the recording's folder and a random name", () => {
  assertEquals(
    worksheetObjectPath("0b9d7c0e-1f8a-4a55-9a43-2f5d5b9f0001", "7C1E2B8A-3D4F-4E21-8B7A-9D0C1E2F3A4B"),
    "0b9d7c0e-1f8a-4a55-9a43-2f5d5b9f0001/7c1e2b8a-3d4f-4e21-8b7a-9d0c1e2f3a4b.pdf",
  );
});

Deno.test("a first title is read from the file name", () => {
  assertEquals(defaultWorksheetTitle("setting-boundaries_with-an-adult-child.pdf"), "setting boundaries with an adult child");
  assertEquals(defaultWorksheetTitle("Week 3 Boundaries.PDF"), "Week 3 Boundaries");
  assertEquals(defaultWorksheetTitle("  spaced   out__name .pdf "), "spaced out name");
  assertEquals(defaultWorksheetTitle("no extension"), "no extension");
  assertEquals(defaultWorksheetTitle("Café Señor 💙.pdf"), "Café Señor 💙");
});

Deno.test("a first title is never empty and never longer than 120 characters", () => {
  assertEquals(defaultWorksheetTitle(""), "Worksheet");
  assertEquals(defaultWorksheetTitle(".pdf"), "Worksheet");
  assertEquals(defaultWorksheetTitle("___.pdf"), "Worksheet");
  const long = defaultWorksheetTitle(`${"very long name ".repeat(40)}.pdf`);
  assert(long.length <= WORKSHEET_TITLE_MAX);
  assertEquals(long, long.trim());
  // An emoji that straddles the limit is dropped whole, not cut in half.
  const emoji = defaultWorksheetTitle(`${"a".repeat(119)}💙.pdf`);
  assertEquals(emoji, "a".repeat(119));
});

Deno.test("a typed title is tidied before it is saved", () => {
  assertEquals(cleanWorksheetTitle("  What to say   when they ask for money \n"), "What to say when they ask for money");
  assertEquals(cleanWorksheetTitle("   "), "");
  assertEquals(cleanWorksheetTitle("b".repeat(300)).length, 120);
});

Deno.test("file sizes read plainly", () => {
  assertEquals(formatFileSize(0), "0 bytes");
  assertEquals(formatFileSize(1), "1 byte");
  assertEquals(formatFileSize(900), "900 bytes");
  assertEquals(formatFileSize(1024), "1 KB");
  assertEquals(formatFileSize(655_360), "640 KB");
  assertEquals(formatFileSize(1_048_576), "1.0 MB");
  assertEquals(formatFileSize(1_500_000), "1.4 MB");
  assertEquals(formatFileSize(WORKSHEET_MAX_BYTES), "20 MB");
  assertEquals(formatFileSize(-5), "");
  assertEquals(formatFileSize(Number.NaN), "");
});

Deno.test("the count label is singular for one", () => {
  assertEquals(worksheetCountLabel(1), "1 worksheet");
  assertEquals(worksheetCountLabel(2), "2 worksheets");
});

Deno.test("worksheets are grouped by recording, in the chosen order then oldest first", () => {
  const rows = [
    { id: "c", recording_id: "r1", sort_order: 1, created_at: "2026-11-10T10:00:00Z" },
    { id: "a", recording_id: "r1", sort_order: 0, created_at: "2026-11-10T12:00:00Z" },
    { id: "b", recording_id: "r1", sort_order: 0, created_at: "2026-11-10T11:00:00Z" },
    { id: "d", recording_id: "r2", sort_order: 0, created_at: "2026-11-03T10:00:00Z" },
  ];
  const groups = groupWorksheetsByRecording(rows);
  assertEquals(groups.r1.map((w) => w.id), ["b", "a", "c"]);
  assertEquals(groups.r2.map((w) => w.id), ["d"]);
  assertEquals(groups.r3, undefined);
});

Deno.test("a missing table or bucket reads as 'not ready yet', other errors do not", () => {
  assert(isWorksheetsNotReadyError({ code: "PGRST205", message: "Could not find the table 'public.recording_worksheets' in the schema cache" }));
  assert(isWorksheetsNotReadyError({ code: "42P01", message: 'relation "public.recording_worksheets" does not exist' }));
  assert(isWorksheetsNotReadyError({ message: "Bucket not found", statusCode: "404" }));
  assertEquals(isWorksheetsNotReadyError({ code: "42501", message: "new row violates row-level security policy" }), false);
  assertEquals(isWorksheetsNotReadyError({ code: "42703", message: "column recording_worksheets.file_size does not exist" }), false);
  assertEquals(isWorksheetsNotReadyError({ message: "Failed to fetch" }), false);
  assertEquals(isWorksheetsNotReadyError(null), false);
  assertEquals(isWorksheetsNotReadyError("Bucket not found"), false);
});
