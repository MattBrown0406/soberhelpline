import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { untypedSupabase } from "@/integrations/supabase/untyped";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Video, ExternalLink, CheckCircle, X, FileText, ChevronUp, ChevronDown, Upload, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { formatDateOnly, pacificToday } from "@/lib/dateOnly";
import {
  WORKSHEET_BUCKET, WORKSHEET_COLUMNS, WORKSHEET_FALLBACK_FILE_NAME, WORKSHEET_MIME, WORKSHEET_TABLE, WORKSHEET_TITLE_MAX,
  cleanWorksheetTitle, defaultWorksheetTitle, formatFileSize, isWorksheetsNotReadyError, sortWorksheets,
  validateWorksheetFile, worksheetCountLabel, worksheetDownloadName, worksheetObjectPath,
  type RecordingWorksheet,
} from "@/lib/recordingWorksheets";

const AVAILABLE_TAGS = [
  "Boundaries", "Enabling", "Intervention", "Communication",
  "Relapse", "Self-Care", "Treatment", "Mental Health",
  "Denial", "Family Roles", "Grief", "Early Recovery",
];

interface KeyTimestamp {
  time: string;
  label: string;
}

interface Recording {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  zoom_passcode: string | null;
  recording_date: string;
  duration_minutes: number | null;
  thumbnail_url: string | null;
  is_published: boolean;
  tags: string[];
  show_notes: string | null;
  key_timestamps: KeyTimestamp[];
  created_at: string;
  updated_at: string;
}

interface RecordingForm {
  title: string;
  description: string;
  youtube_url: string;
  zoom_passcode: string;
  recording_date: string;
  duration_minutes: string;
  thumbnail_url: string;
  is_published: boolean;
  tags: string[];
  show_notes: string;
  key_timestamps: KeyTimestamp[];
}

const emptyForm: RecordingForm = {
  title: "",
  description: "",
  youtube_url: "",
  zoom_passcode: "",
  // Filled in with today's Pacific date when the "Add Recording" dialog opens.
  recording_date: "",
  duration_minutes: "",
  thumbnail_url: "",
  is_published: true,
  tags: [],
  show_notes: "",
  key_timestamps: [],
};

/** A PDF picked in the dialog that has not been uploaded yet. */
interface PendingWorksheet {
  key: string;
  file: File;
  title: string;
  error?: string;
}

const WORKSHEETS_NOT_READY = "Worksheets will be available here once the site update finishes.";

// The generated database types do not know the worksheets table yet.
const worksheetsTable = () => untypedSupabase.from(WORKSHEET_TABLE);
const worksheetsBucket = () => supabase.storage.from(WORKSHEET_BUCKET);

function newUuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Why an upload did not work, in plain words. */
function worksheetFailureReason(error: unknown, fallback: string): string {
  if (isWorksheetsNotReadyError(error)) return WORKSHEETS_NOT_READY;
  const e = (error || {}) as { message?: unknown; statusCode?: unknown; status?: unknown; code?: unknown };
  const message = typeof e.message === "string" ? e.message : "";
  const status = String(e.statusCode ?? e.status ?? "");
  if (status === "413" || /maximum allowed size|too large/i.test(message)) return "This file is larger than 20 MB.";
  if (status === "415" || /mime type/i.test(message)) return "Only PDF files can be added as worksheets.";
  if (status === "401" || status === "403" || e.code === "42501" || /row-level security|not authorized|unauthorized/i.test(message)) {
    return "Your account is not allowed to change worksheets. Sign in again as an admin.";
  }
  if (/failed to fetch|network|load failed/i.test(message)) return "The connection dropped. Check your internet and try again.";
  return fallback;
}

/** The download name for a title; a title with no plain letters falls back to the file's own name. */
function downloadNameFor(title: string, otherwise: string): string {
  const fromTitle = worksheetDownloadName(title);
  return fromTitle === WORKSHEET_FALLBACK_FILE_NAME ? worksheetDownloadName(otherwise) : fromTitle;
}

export function RecordingManagement() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RecordingForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [newTimestamp, setNewTimestamp] = useState<KeyTimestamp>({ time: "", label: "" });

  // Worksheets (PDFs) attached to recordings.
  const [worksheetCounts, setWorksheetCounts] = useState<Record<string, number>>({});
  // True while the worksheets table has not been created yet.
  const [worksheetsNotReady, setWorksheetsNotReady] = useState(false);
  const [worksheets, setWorksheets] = useState<RecordingWorksheet[]>([]);
  const [worksheetsLoading, setWorksheetsLoading] = useState(false);
  const [worksheetsLoadFailed, setWorksheetsLoadFailed] = useState(false);
  const [titleDrafts, setTitleDrafts] = useState<Record<string, string>>({});
  const [pendingWorksheets, setPendingWorksheets] = useState<PendingWorksheet[]>([]);
  const [worksheetBusy, setWorksheetBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; name: string } | null>(null);
  const [savedWithoutWorksheets, setSavedWithoutWorksheets] = useState(false);
  const worksheetFileInput = useRef<HTMLInputElement>(null);
  // The list as it is right now. An upload or a move can finish after a title
  // was saved meanwhile, and must not put the older title back on screen.
  const latestWorksheets = useRef<RecordingWorksheet[]>(worksheets);
  latestWorksheets.current = worksheets;
  const worksheetsSection = useRef<HTMLDivElement>(null);
  // The recording whose worksheets the dialog is showing, so a slow answer for another one is ignored.
  const worksheetsFor = useRef<string | null>(null);

  const fetchRecordings = async () => {
    // How many worksheets each recording has, for the list. Never throws: a
    // missing table just means "none yet".
    const fetchWorksheetCounts = async () => {
      try {
        const { data, error } = await worksheetsTable().select("recording_id");
        if (error) throw error;
        const counts: Record<string, number> = {};
        for (const row of (data || []) as { recording_id: string }[]) {
          counts[row.recording_id] = (counts[row.recording_id] || 0) + 1;
        }
        setWorksheetCounts(counts);
        setWorksheetsNotReady(false);
      } catch (error) {
        setWorksheetCounts({});
        if (isWorksheetsNotReadyError(error)) setWorksheetsNotReady(true);
        else console.warn("Worksheet counts could not be loaded", error);
      }
    };

    const [{ data, error }] = await Promise.all([
      supabase
        .from("zoom_call_recordings")
        .select("*")
        .order("recording_date", { ascending: false }),
      fetchWorksheetCounts(),
    ]);

    if (error) {
      toast.error("Failed to load recordings");
    } else {
      setRecordings((data || []) as unknown as Recording[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRecordings(); }, []);

  const pendingRecordings = recordings.filter(r => !r.is_published);
  const publishedRecordings = recordings.filter(r => r.is_published);

  const resetWorksheetState = () => {
    setWorksheets([]);
    setTitleDrafts({});
    setPendingWorksheets([]);
    setWorksheetsLoading(false);
    setWorksheetsLoadFailed(false);
    setUploadProgress(null);
    setSavedWithoutWorksheets(false);
  };

  // Shows these worksheets in the dialog and keeps the list's count in step.
  const showWorksheets = (recordingId: string, rows: RecordingWorksheet[]) => {
    if (worksheetsFor.current === recordingId) setWorksheets(rows);
    setWorksheetCounts((counts) => ({ ...counts, [recordingId]: rows.length }));
  };

  const loadWorksheets = async (recordingId: string) => {
    setWorksheetsLoading(true);
    setWorksheetsLoadFailed(false);
    try {
      const { data, error } = await worksheetsTable()
        .select(WORKSHEET_COLUMNS)
        .eq("recording_id", recordingId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      if (worksheetsFor.current !== recordingId) return;
      setWorksheetsNotReady(false);
      setTitleDrafts({});
      showWorksheets(recordingId, sortWorksheets((data || []) as RecordingWorksheet[]));
    } catch (error) {
      if (worksheetsFor.current !== recordingId) return;
      setWorksheets([]);
      if (isWorksheetsNotReadyError(error)) {
        setWorksheetsNotReady(true);
      } else {
        console.warn("Worksheets could not be loaded", error);
        setWorksheetsLoadFailed(true);
      }
    } finally {
      if (worksheetsFor.current === recordingId) setWorksheetsLoading(false);
    }
  };

  const openNew = () => {
    setEditingId(null);
    // Today in Pacific time, worked out now (not the UTC date from when the page loaded).
    setForm({ ...emptyForm, recording_date: pacificToday() });
    setNewTimestamp({ time: "", label: "" });
    worksheetsFor.current = null;
    resetWorksheetState();
    setDialogOpen(true);
  };

  const formFromRecording = (r: Recording): RecordingForm => ({
    title: r.title,
    description: r.description || "",
    youtube_url: r.youtube_url,
    zoom_passcode: r.zoom_passcode || "",
    recording_date: r.recording_date,
    duration_minutes: r.duration_minutes?.toString() || "",
    thumbnail_url: r.thumbnail_url || "",
    is_published: r.is_published,
    tags: r.tags || [],
    show_notes: r.show_notes || "",
    key_timestamps: r.key_timestamps || [],
  });

  const openEdit = (r: Recording) => {
    setEditingId(r.id);
    setForm(formFromRecording(r));
    setNewTimestamp({ time: "", label: "" });
    worksheetsFor.current = r.id;
    resetWorksheetState();
    setDialogOpen(true);
    loadWorksheets(r.id);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    worksheetsFor.current = null;
    resetWorksheetState();
  };

  // Closing by Cancel, Escape or a click outside.
  const handleDialogOpenChange = (open: boolean) => {
    if (open) { setDialogOpen(true); return; }
    // Never close in the middle of an upload.
    if (worksheetBusy || (saving && pendingWorksheets.length > 0)) return;
    if (pendingWorksheets.length > 0 && !confirm("Some PDFs have not been uploaded yet. Close without uploading them?")) return;
    closeDialog();
  };

  const addPendingFiles = (files: FileList | null) => {
    const picked = Array.from(files || []);
    if (worksheetFileInput.current) worksheetFileInput.current.value = "";
    if (picked.length === 0) return;
    const accepted: PendingWorksheet[] = [];
    for (const file of picked) {
      const check = validateWorksheetFile(file);
      if (check.ok === false) {
        toast.error(`"${file.name}" was not added. ${check.reason}`);
        continue;
      }
      accepted.push({ key: newUuid(), file, title: defaultWorksheetTitle(file.name) });
    }
    if (accepted.length > 0) setPendingWorksheets((pending) => [...pending, ...accepted]);
  };

  // Upload one PDF, then register it. Either both happen or neither is left behind.
  const uploadWorksheet = async (
    recordingId: string,
    pending: PendingWorksheet,
    sortOrder: number,
  ): Promise<{ ok: true; row: RecordingWorksheet } | { ok: false; reason: string }> => {
    const check = validateWorksheetFile(pending.file);
    if (check.ok === false) return { ok: false, reason: check.reason };

    const title = cleanWorksheetTitle(pending.title) || defaultWorksheetTitle(pending.file.name);
    const path = worksheetObjectPath(recordingId, newUuid());
    try {
      // The storage client sends a File with the File's own type and ignores
      // `contentType` for it. A PDF handed over with no type (one picked from
      // iCloud Drive, for one) would go up as a generic file and the PDF-only
      // bucket would refuse it, so give it its type first.
      const body = pending.file.type === WORKSHEET_MIME
        ? pending.file
        : new File([pending.file], pending.file.name, { type: WORKSHEET_MIME });
      const { error: uploadError } = await worksheetsBucket().upload(path, body, {
        contentType: WORKSHEET_MIME,
        upsert: false,
      });
      if (uploadError) {
        console.error("Worksheet upload failed", uploadError);
        return { ok: false, reason: worksheetFailureReason(uploadError, "The file could not be uploaded. Please try again.") };
      }

      let insertError: unknown = null;
      let row: RecordingWorksheet | null = null;
      try {
        const result = await worksheetsTable()
          .insert({
            recording_id: recordingId,
            title,
            file_path: path,
            file_name: downloadNameFor(title, pending.file.name),
            file_size: pending.file.size,
            sort_order: sortOrder,
          })
          .select(WORKSHEET_COLUMNS)
          .single();
        insertError = result.error;
        row = (result.data as RecordingWorksheet | null) ?? null;
      } catch (error) {
        insertError = error;
      }
      if (!insertError && row) return { ok: true, row };

      console.error("Worksheet could not be registered", insertError);
      // Take the upload back. First make sure no row is left for this file (a
      // dropped connection can hide a row that was in fact saved); only then
      // delete the file, so a row never points at nothing.
      try {
        const { error: rowCleanupError } = await worksheetsTable().delete().eq("file_path", path);
        if (!rowCleanupError) {
          const { data: removed, error: removeError } = await worksheetsBucket().remove([path]);
          if (removeError || !removed?.length) console.warn("An unregistered worksheet file was left in storage", removeError);
        }
      } catch (cleanupError) {
        console.warn("Worksheet cleanup failed", cleanupError);
      }
      return {
        ok: false,
        reason: worksheetFailureReason(insertError, "The file could not be added to the recording. Please try again."),
      };
    } catch (error) {
      console.error("Worksheet upload failed", error);
      return { ok: false, reason: worksheetFailureReason(error, "The file could not be uploaded. Please try again.") };
    }
  };

  // Uploads the picked PDFs one at a time, after the worksheets already there.
  const uploadPendingWorksheets = async (recordingId: string, items: PendingWorksheet[], existing: RecordingWorksheet[]) => {
    let nextOrder = existing.reduce((max, w) => Math.max(max, w.sort_order ?? 0), -1) + 1;
    const added: RecordingWorksheet[] = [];
    const failed: PendingWorksheet[] = [];
    for (let i = 0; i < items.length; i++) {
      setUploadProgress({ current: i + 1, total: items.length, name: items[i].file.name });
      const result = await uploadWorksheet(recordingId, items[i], nextOrder);
      if (result.ok === true) {
        added.push(result.row);
        nextOrder += 1;
      } else {
        failed.push({ ...items[i], error: result.reason });
      }
    }
    setUploadProgress(null);
    return { added, failed };
  };

  // "Upload" in the dialog, for a recording that already exists.
  const handleUploadNow = async () => {
    if (!editingId || pendingWorksheets.length === 0 || worksheetBusy) return;
    const recordingId = editingId;
    setWorksheetBusy(true);
    try {
      const { added, failed } = await uploadPendingWorksheets(recordingId, pendingWorksheets, worksheets);
      setPendingWorksheets(failed);
      const addedIds = new Set(added.map((w) => w.id));
      showWorksheets(recordingId, sortWorksheets([...latestWorksheets.current.filter((w) => !addedIds.has(w.id)), ...added]));
      if (added.length > 0) toast.success(added.length === 1 ? "Worksheet uploaded" : `${added.length} worksheets uploaded`);
      failed.forEach((f) => toast.error(`"${f.file.name}" was not uploaded. ${f.error}`));
      if (failed.length > 0) await loadWorksheets(recordingId);
      else setSavedWithoutWorksheets(false);
    } finally {
      setWorksheetBusy(false);
    }
  };

  const saveWorksheetTitle = async (worksheet: RecordingWorksheet) => {
    const draft = titleDrafts[worksheet.id];
    if (draft === undefined) return;
    const clearDraft = () => setTitleDrafts(({ [worksheet.id]: _done, ...rest }) => rest);
    const title = cleanWorksheetTitle(draft);
    if (!title) {
      toast.error("A worksheet needs a title.");
      clearDraft();
      return;
    }
    if (title === worksheet.title) { clearDraft(); return; }
    const fileName = downloadNameFor(title, worksheet.file_name);
    try {
      const { data, error } = await worksheetsTable()
        .update({ title, file_name: fileName })
        .eq("id", worksheet.id)
        .select("id");
      if (error || !data?.length) throw error || new Error("No worksheet was updated");
      setWorksheets((rows) => rows.map((w) => (w.id === worksheet.id ? { ...w, title, file_name: fileName } : w)));
      clearDraft();
      toast.success("Worksheet title saved");
    } catch (error) {
      console.error("Worksheet title could not be saved", error);
      toast.error("The worksheet title could not be saved. Please try again.");
    }
  };

  const moveWorksheet = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (!editingId || worksheetBusy || target < 0 || target >= worksheets.length) return;
    const recordingId = editingId;
    const reordered = [...worksheets];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setWorksheetBusy(true);
    try {
      for (let i = 0; i < reordered.length; i++) {
        if (reordered[i].sort_order === i) continue;
        const { data, error } = await worksheetsTable().update({ sort_order: i }).eq("id", reordered[i].id).select("id");
        if (error || !data?.length) throw error || new Error("No worksheet was updated");
      }
      const latest = new Map(latestWorksheets.current.map((w) => [w.id, w]));
      showWorksheets(recordingId, reordered.map((w, i) => ({ ...(latest.get(w.id) ?? w), sort_order: i })));
    } catch (error) {
      console.error("Worksheet order could not be saved", error);
      toast.error("The new order could not be saved. Please try again.");
      await loadWorksheets(recordingId);
    } finally {
      setWorksheetBusy(false);
    }
  };

  // Remove = delete the row first (members stop seeing it), then the file.
  const removeWorksheet = async (worksheet: RecordingWorksheet) => {
    if (!editingId || worksheetBusy) return;
    if (!confirm(`Remove the worksheet "${worksheet.title}"? Members will no longer be able to download it.`)) return;
    const recordingId = editingId;
    setWorksheetBusy(true);
    try {
      const { data: deleted, error } = await worksheetsTable().delete().eq("id", worksheet.id).select("id");
      if (error || !deleted?.length) {
        console.error("Worksheet could not be removed", error);
        toast.error("The worksheet could not be removed. Please try again.");
        await loadWorksheets(recordingId);
        return;
      }
      showWorksheets(recordingId, worksheets.filter((w) => w.id !== worksheet.id));
      setTitleDrafts(({ [worksheet.id]: _gone, ...rest }) => rest);

      let fileRemoved = false;
      try {
        const { data: removed, error: removeError } = await worksheetsBucket().remove([worksheet.file_path]);
        fileRemoved = !removeError && (removed?.length ?? 0) > 0;
        if (!fileRemoved) console.warn("Worksheet file could not be deleted from storage", removeError);
      } catch (removeError) {
        console.warn("Worksheet file could not be deleted from storage", removeError);
      }
      if (fileRemoved) toast.success("Worksheet removed");
      else toast.warning("Worksheet removed. Members can no longer see it, but its file could not be deleted from storage.");
    } catch (error) {
      console.error("Worksheet could not be removed", error);
      toast.error("The worksheet could not be removed. Please try again.");
      await loadWorksheets(recordingId);
    } finally {
      setWorksheetBusy(false);
    }
  };

  // Before a recording is deleted: delete its worksheet files (best effort).
  // The rows go with the recording.
  const removeWorksheetFilesFor = async (recordingId: string): Promise<{ removedAny: boolean; leftBehind: boolean }> => {
    const expected = worksheetCounts[recordingId] || 0;
    try {
      const { data, error } = await worksheetsTable().select("file_path").eq("recording_id", recordingId);
      if (error) throw error;
      const paths = ((data || []) as { file_path: string }[]).map((row) => row.file_path).filter(Boolean);
      if (paths.length === 0) return { removedAny: false, leftBehind: false };
      const { data: removed, error: removeError } = await worksheetsBucket().remove(paths);
      if (removeError) throw removeError;
      const removedCount = removed?.length ?? 0;
      if (removedCount < paths.length) console.warn("Some worksheet files could not be deleted from storage");
      return { removedAny: removedCount > 0, leftBehind: removedCount < paths.length };
    } catch (error) {
      if (isWorksheetsNotReadyError(error)) return { removedAny: false, leftBehind: false };
      console.warn("Worksheet files could not be deleted from storage", error);
      return { removedAny: false, leftBehind: expected > 0 };
    }
  };

  const toggleTag = (tag: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  };

  const addTimestamp = () => {
    if (!newTimestamp.time || !newTimestamp.label) return;
    setForm(f => ({ ...f, key_timestamps: [...f.key_timestamps, { ...newTimestamp }] }));
    setNewTimestamp({ time: "", label: "" });
  };

  const removeTimestamp = (idx: number) => {
    setForm(f => ({ ...f, key_timestamps: f.key_timestamps.filter((_, i) => i !== idx) }));
  };

  const syncZoomPasscode = async (recordingId: string, publish = false) => {
    const { data, error } = await supabase.functions.invoke("sync-zoom-recording-passcode", {
      body: { recordingId, publish },
    });

    if (error) throw error;
    return data as { synced?: boolean; reason?: string; published?: boolean } | null;
  };

  const handleSave = async () => {
    if (!form.title || !form.youtube_url || !form.recording_date) {
      toast.error("Title, Recording URL, and date are required");
      return;
    }
    setSaving(true);

    const trimmedPasscode = form.zoom_passcode.trim();
    const payload = {
      title: form.title,
      description: form.description || null,
      youtube_url: form.youtube_url,
      zoom_passcode: trimmedPasscode ? trimmedPasscode : null,
      recording_date: form.recording_date,
      duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
      thumbnail_url: form.thumbnail_url || null,
      is_published: form.is_published,
      tags: form.tags,
      show_notes: form.show_notes || null,
      key_timestamps: form.key_timestamps,
    };

    const mutation = editingId
      ? await supabase.from("zoom_call_recordings").update(payload as any).eq("id", editingId).select("id").single()
      : await supabase.from("zoom_call_recordings").insert(payload as any).select("id").single();

    const { data: savedRecording, error } = mutation;

    // Stays false, and the dialog closes, unless the save failed or PDFs are waiting.
    let keepDialogOpen = false;

    if (error) {
      toast.error(editingId ? "Failed to update recording" : "Failed to add recording");
      // Do not throw away what he typed or the PDFs he picked.
      keepDialogOpen = true;
    } else {
      if (payload.is_published && savedRecording?.id) {
        try {
          const syncResult = await syncZoomPasscode(savedRecording.id, false);
          toast.success(syncResult?.synced ? "Recording saved and Zoom passcode synced" : editingId ? "Recording updated" : "Recording added");
        } catch (syncError) {
          console.error("Zoom passcode sync failed", syncError);
          toast.warning("Recording saved, but Zoom passcode auto-sync failed. Add it manually if Zoom prompts for one.");
        }
      } else {
        toast.success(editingId ? "Recording updated" : "Recording added");
      }

      // The recording is saved. Now the PDFs picked in this dialog.
      if (pendingWorksheets.length > 0 && savedRecording?.id) {
        const recordingId = savedRecording.id as string;
        const existing = editingId === recordingId ? worksheets : [];
        const { added, failed } = await uploadPendingWorksheets(recordingId, pendingWorksheets, existing);
        if (added.length > 0) toast.success(added.length === 1 ? "Worksheet uploaded" : `${added.length} worksheets uploaded`);
        if (failed.length > 0) {
          // Stay here, now editing the saved recording, with only the files that did not make it.
          keepDialogOpen = true;
          worksheetsFor.current = recordingId;
          setEditingId(recordingId);
          setPendingWorksheets(failed);
          setSavedWithoutWorksheets(true);
          showWorksheets(recordingId, sortWorksheets([...existing, ...added]));
          failed.forEach((f) => toast.error(`The recording is saved, but "${f.file.name}" was not uploaded. ${f.error}`));
          await loadWorksheets(recordingId);
          // Show the recording as it was saved (the passcode sync above may have
          // filled in a passcode), so a second save does not undo it.
          try {
            const { data: fresh } = await supabase.from("zoom_call_recordings").select("*").eq("id", recordingId).maybeSingle();
            if (fresh) setForm(formFromRecording(fresh as unknown as Recording));
          } catch (refreshError) {
            console.warn("Saved recording could not be re-read", refreshError);
          }
          // Bring the files that need attention into view.
          window.setTimeout(() => worksheetsSection.current?.scrollIntoView({ block: "center" }), 0);
        }
      }
    }

    setSaving(false);
    if (keepDialogOpen) setDialogOpen(true);
    else closeDialog();
    fetchRecordings();
  };

  const handleDelete = async (id: string) => {
    const worksheetCount = worksheetCounts[id] || 0;
    if (!confirm(worksheetCount > 0 ? `Delete this recording and its ${worksheetCountLabel(worksheetCount)}?` : "Delete this recording?")) return;
    const files = await removeWorksheetFilesFor(id);
    const { data: deletedRows, error } = await supabase.from("zoom_call_recordings").delete().eq("id", id).select("id");
    // No error and no row back means nothing was deleted (a lost session, or the row is hidden).
    const notDeleted = !error && (deletedRows?.length ?? 0) === 0;
    if (error || notDeleted) {
      const failure = notDeleted
        ? "The recording was not deleted. Your session may have expired: reload the page, log in, and try again."
        : "Failed to delete recording.";
      if (files.removedAny) {
        // The files are gone but the recording is not: take its worksheets off too,
        // so no worksheet is listed without a file behind it.
        let rowsRemoved = false;
        try {
          const { error: rowsError } = await worksheetsTable().delete().eq("recording_id", id);
          rowsRemoved = !rowsError;
        } catch {
          rowsRemoved = false;
        }
        toast.error(rowsRemoved
          ? `${failure} Its worksheets were already removed.`
          : `${failure} Its worksheet files were already deleted, so open the recording and remove its worksheets.`);
        fetchRecordings();
      } else {
        toast.error(notDeleted ? failure : "Failed to delete recording");
        if (notDeleted) fetchRecordings();
      }
    } else {
      if (files.leftBehind) toast.warning("Recording deleted. Members can no longer see its worksheets, but their files could not be deleted from storage.");
      else toast.success("Recording deleted");
      fetchRecordings();
    }
  };

  const publishRecording = async (id: string) => {
    setPublishingId(id);
    try {
      const syncResult = await syncZoomPasscode(id, true);
      if (syncResult?.synced) {
        toast.success("Recording published — Zoom passcode synced automatically");
      } else if (syncResult?.reason === "not_zoom") {
        toast.success("Recording published — now visible to members");
      } else if (syncResult?.reason === "already_has_passcode") {
        toast.success("Recording published — existing Zoom passcode preserved");
      } else {
        toast.warning("Recording published, but no matching Zoom passcode was found. Add it manually if Zoom prompts members.");
      }
      fetchRecordings();
    } catch (error) {
      console.error("Zoom passcode sync failed while publishing", error);
      const { error: publishError } = await supabase
        .from("zoom_call_recordings")
        .update({ is_published: true, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (publishError) {
        toast.error("Failed to publish recording");
      } else {
        toast.warning("Recording published, but Zoom passcode auto-sync failed. Add it manually if Zoom prompts members.");
        fetchRecordings();
      }
    } finally {
      setPublishingId(null);
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading recordings...</div>;

  const renderRow = (r: Recording, showPublish: boolean) => (
    <TableRow key={r.id}>
      <TableCell className="font-medium max-w-[200px]">
        <div className="truncate">{r.title}</div>
        {r.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {r.tags.slice(0, 3).map(t => (
              <Badge key={t} variant="secondary" className="text-xs px-1 py-0">{t}</Badge>
            ))}
          </div>
        )}
        {(worksheetCounts[r.id] || 0) > 0 && (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <FileText className="h-3 w-3 shrink-0" aria-hidden="true" />
            {worksheetCountLabel(worksheetCounts[r.id])}
          </div>
        )}
      </TableCell>
      <TableCell>{formatDateOnly(r.recording_date, "MMM d, yyyy")}</TableCell>
      <TableCell>{r.duration_minutes ? `${r.duration_minutes} min` : "—"}</TableCell>
      <TableCell>{r.key_timestamps?.length || 0}</TableCell>
      <TableCell>{r.is_published ? "✅" : "❌"}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          {showPublish && (
            <Button variant="default" size="sm" className="gap-1 h-8 min-h-0 py-0 text-xs" onClick={() => publishRecording(r.id)} disabled={publishingId === r.id}>
              <CheckCircle className="h-3.5 w-3.5" />
              {publishingId === r.id ? "Publishing..." : "Publish"}
            </Button>
          )}
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(r)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <a href={r.youtube_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
          <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(r.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  const tableHeader = (
    <TableHeader>
      <TableRow>
        <TableHead>Title / Tags</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Duration</TableHead>
        <TableHead>Timestamps</TableHead>
        <TableHead>Published</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{recordings.length} recording(s)</p>
        <Button onClick={openNew} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Recording
        </Button>
      </div>

      {pendingRecordings.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Pending Review</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-medium">
              {pendingRecordings.length} pending
            </span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              {tableHeader}
              <TableBody>{pendingRecordings.map(r => renderRow(r, true))}</TableBody>
            </Table>
          </div>
        </div>
      )}

      {pendingRecordings.length === 0 && publishedRecordings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Video className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>No recordings yet. Click "Add Recording" to get started.</p>
        </div>
      ) : publishedRecordings.length > 0 && (
        <div className="space-y-2">
          {pendingRecordings.length > 0 && <h3 className="text-sm font-semibold text-foreground">Published</h3>}
          <div className="overflow-x-auto">
            <Table>
              {tableHeader}
              <TableBody>{publishedRecordings.map(r => renderRow(r, false))}</TableBody>
            </Table>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Recording" : "Add Recording"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={'Family Squares — March 9, 2026'} />
            </div>
            <div>
              <Label>Recording URL *</Label>
              <Input value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://youtube.com/watch?v=... or https://zoom.us/rec/..." />
              <p className="text-xs text-muted-foreground mt-1">YouTube URLs embed in the page. Zoom cloud recording URLs open in a new tab.</p>
            </div>
            <div>
              <Label>Zoom Recording Passcode</Label>
              <Input
                value={form.zoom_passcode}
                onChange={(e) => setForm({ ...form, zoom_passcode: e.target.value })}
                placeholder="Optional — only for Zoom recordings that require a password"
              />
              <p className="text-xs text-muted-foreground mt-1">If provided, it will be appended to the Zoom URL so members aren't prompted for a password.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Recording Date *</Label>
                <Input type="date" value={form.recording_date} onChange={(e) => setForm({ ...form, recording_date: e.target.value })} />
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} placeholder="60" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief summary of topics discussed..." rows={2} />
            </div>

            <div>
              <Label className="mb-2 block">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      form.tags.includes(tag)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Show Notes (shown below the video)</Label>
              <Textarea
                value={form.show_notes}
                onChange={(e) => setForm({ ...form, show_notes: e.target.value })}
                placeholder={"Key takeaways from this session:\n• ...\n• ...\n\nResources mentioned: ..."}
                rows={5}
              />
            </div>

            <div>
              <Label className="mb-2 block">Key Timestamps</Label>
              <div className="space-y-2 mb-3">
                {form.key_timestamps.map((ts, i) => (
                  <div key={i} className="flex items-center gap-2 bg-muted/50 rounded px-3 py-1.5 text-sm">
                    <span className="font-mono text-primary font-semibold w-16 shrink-0">{ts.time}</span>
                    <span className="flex-1 text-foreground">{ts.label}</span>
                    <button type="button" onClick={() => removeTimestamp(i)} className="text-muted-foreground hover:text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  className="w-24"
                  value={newTimestamp.time}
                  onChange={(e) => setNewTimestamp(t => ({ ...t, time: e.target.value }))}
                  placeholder="12:34"
                />
                <Input
                  className="flex-1"
                  value={newTimestamp.label}
                  onChange={(e) => setNewTimestamp(t => ({ ...t, label: e.target.value }))}
                  placeholder="How to respond when they say they'll stop on their own"
                />
                <Button type="button" size="sm" variant="outline" onClick={addTimestamp}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div ref={worksheetsSection} role="group" aria-labelledby="recording-worksheets-label">
              <Label id="recording-worksheets-label" className="mb-2 block">Worksheets (PDF)</Label>
              {worksheetsNotReady ? (
                <p className="text-sm text-muted-foreground">{WORKSHEETS_NOT_READY}</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    The PDFs made to answer the questions sent in before this meeting. Members can download them from the recording once it is published.
                  </p>

                  {savedWithoutWorksheets && pendingWorksheets.length > 0 && (
                    <p role="alert" className="rounded border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                      The recording is saved. The PDFs marked below were not uploaded. Try again, or remove them.
                    </p>
                  )}

                  {editingId && worksheetsLoading && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      Loading worksheets...
                    </p>
                  )}

                  {editingId && worksheetsLoadFailed && (
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" role="alert">
                      <span>The worksheets for this recording could not be loaded.</span>
                      <Button type="button" size="sm" variant="outline" className="h-8 min-h-0 py-0 text-xs" onClick={() => loadWorksheets(editingId)}>
                        Try again
                      </Button>
                    </div>
                  )}

                  {worksheets.length > 0 && (
                    <ul className="space-y-2" aria-label="Uploaded worksheets">
                      {worksheets.map((w, i) => (
                        <li key={w.id} className="rounded bg-muted/50 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                            <Input
                              className="h-8 flex-1"
                              aria-label={`Title of worksheet ${i + 1}`}
                              value={titleDrafts[w.id] ?? w.title}
                              maxLength={WORKSHEET_TITLE_MAX}
                              disabled={worksheetBusy || saving}
                              onChange={(e) => setTitleDrafts((drafts) => ({ ...drafts, [w.id]: e.target.value }))}
                              onBlur={() => saveWorksheetTitle(w)}
                              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); } }}
                            />
                            {worksheets.length > 1 && (
                              <>
                                <Button type="button" variant="outline" size="icon" className="h-8 w-8 shrink-0" aria-label={`Move "${w.title}" up`} disabled={i === 0 || worksheetBusy || saving} onClick={() => moveWorksheet(i, -1)}>
                                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                                </Button>
                                <Button type="button" variant="outline" size="icon" className="h-8 w-8 shrink-0" aria-label={`Move "${w.title}" down`} disabled={i === worksheets.length - 1 || worksheetBusy || saving} onClick={() => moveWorksheet(i, 1)}>
                                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                                </Button>
                              </>
                            )}
                            <Button type="button" variant="outline" size="sm" className="h-8 min-h-0 shrink-0 py-0 text-xs text-destructive hover:text-destructive" aria-label={`Remove the worksheet "${w.title}"`} disabled={worksheetBusy || saving} onClick={() => removeWorksheet(w)}>
                              Remove
                            </Button>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            PDF · {formatFileSize(w.file_size)} · Added {format(new Date(w.created_at), "MMM d, yyyy")}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                  {worksheets.length > 0 && (
                    <p className="text-xs text-muted-foreground">A title is saved when you click out of it.</p>
                  )}

                  {pendingWorksheets.length > 0 && (
                    <ul className="space-y-2" aria-label="PDFs waiting to be uploaded">
                      {pendingWorksheets.map((p) => (
                        <li key={p.key} className="rounded border border-dashed border-border px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <Input
                              className="h-8 flex-1"
                              aria-label={`Title for ${p.file.name}`}
                              value={p.title}
                              maxLength={WORKSHEET_TITLE_MAX}
                              disabled={worksheetBusy || saving}
                              onChange={(e) => setPendingWorksheets((pending) => pending.map((x) => (x.key === p.key ? { ...x, title: e.target.value } : x)))}
                            />
                            <Button type="button" variant="outline" size="icon" className="h-8 w-8 shrink-0" aria-label={`Do not upload ${p.file.name}`} disabled={worksheetBusy || saving} onClick={() => setPendingWorksheets((pending) => pending.filter((x) => x.key !== p.key))}>
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </Button>
                          </div>
                          <p className="mt-1 break-all text-xs text-muted-foreground">
                            {p.file.name} · {formatFileSize(p.file.size)} · Not uploaded yet
                          </p>
                          {p.error && (
                            <p className="mt-1 text-xs text-destructive" role="alert">Not uploaded. {p.error}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {uploadProgress && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
                      <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden="true" />
                      <span className="break-all">Uploading {uploadProgress.current} of {uploadProgress.total}: {uploadProgress.name}</span>
                    </p>
                  )}

                  {!(editingId && (worksheetsLoading || worksheetsLoadFailed)) && (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={worksheetFileInput}
                        id="recording-worksheet-files"
                        type="file"
                        accept="application/pdf,.pdf"
                        multiple
                        className="hidden"
                        aria-label="Add PDF worksheets"
                        disabled={worksheetBusy || saving}
                        onChange={(e) => addPendingFiles(e.target.files)}
                      />
                      <Button type="button" size="sm" variant="outline" className="gap-2" disabled={worksheetBusy || saving} onClick={() => worksheetFileInput.current?.click()}>
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add PDF
                      </Button>
                      {editingId && pendingWorksheets.length > 0 && (
                        <Button type="button" size="sm" className="gap-2" disabled={worksheetBusy || saving} onClick={handleUploadNow}>
                          {worksheetBusy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
                          {worksheetBusy ? "Uploading..." : pendingWorksheets.length === 1 ? "Upload 1 PDF" : `Upload ${pendingWorksheets.length} PDFs`}
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {!editingId && pendingWorksheets.length > 0
                          ? "These upload when you add the recording."
                          : "PDF only, up to 20 MB each."}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label>Custom Thumbnail URL (optional)</Label>
              <Input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="Leave blank to auto-generate from YouTube" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_published} onCheckedChange={(checked) => setForm({ ...form, is_published: checked })} />
              <Label>Published (visible to members)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleDialogOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || worksheetBusy}>
              {saving ? (uploadProgress ? "Uploading..." : "Saving...") : editingId ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
