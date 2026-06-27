import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Plus, Pencil, Trash2, Video, ExternalLink, CheckCircle, X } from "lucide-react";
import { format } from "date-fns";

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
  recording_date: new Date().toISOString().split("T")[0],
  duration_minutes: "",
  thumbnail_url: "",
  is_published: true,
  tags: [],
  show_notes: "",
  key_timestamps: [],
};

export function RecordingManagement() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RecordingForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [newTimestamp, setNewTimestamp] = useState<KeyTimestamp>({ time: "", label: "" });

  const fetchRecordings = async () => {
    const { data, error } = await supabase
      .from("zoom_call_recordings")
      .select("*")
      .order("recording_date", { ascending: false });

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

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setNewTimestamp({ time: "", label: "" });
    setDialogOpen(true);
  };

  const openEdit = (r: Recording) => {
    setEditingId(r.id);
    setForm({
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
    setNewTimestamp({ time: "", label: "" });
    setDialogOpen(true);
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

    const { error } = editingId
      ? await supabase.from("zoom_call_recordings").update(payload as any).eq("id", editingId)
      : await supabase.from("zoom_call_recordings").insert(payload as any);

    if (error) {
      toast.error(editingId ? "Failed to update recording" : "Failed to add recording");
    } else {
      toast.success(editingId ? "Recording updated" : "Recording added");
    }

    setSaving(false);
    setDialogOpen(false);
    fetchRecordings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this recording?")) return;
    const { error } = await supabase.from("zoom_call_recordings").delete().eq("id", id);
    if (error) toast.error("Failed to delete recording");
    else { toast.success("Recording deleted"); fetchRecordings(); }
  };

  const publishRecording = async (id: string) => {
    const { error } = await supabase
      .from("zoom_call_recordings")
      .update({ is_published: true, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) toast.error("Failed to publish recording");
    else { toast.success("Recording published — now visible to members"); fetchRecordings(); }
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
      </TableCell>
      <TableCell>{format(new Date(r.recording_date), "MMM d, yyyy")}</TableCell>
      <TableCell>{r.duration_minutes ? `${r.duration_minutes} min` : "—"}</TableCell>
      <TableCell>{r.key_timestamps?.length || 0}</TableCell>
      <TableCell>{r.is_published ? "✅" : "❌"}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          {showPublish && (
            <Button variant="default" size="sm" className="gap-1 h-8 text-xs" onClick={() => publishRecording(r.id)}>
              <CheckCircle className="h-3.5 w-3.5" />
              Publish
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Recording" : "Add Recording"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={'"The Family Squares" — March 9, 2026'} />
            </div>
            <div>
              <Label>YouTube URL *</Label>
              <Input value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
              <p className="text-xs text-muted-foreground mt-1">Replace a Zoom share URL with a YouTube URL once uploaded, then toggle Published.</p>
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
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
