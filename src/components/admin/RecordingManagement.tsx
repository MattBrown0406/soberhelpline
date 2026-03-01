import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Video, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface Recording {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  recording_date: string;
  duration_minutes: number | null;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface RecordingForm {
  title: string;
  description: string;
  youtube_url: string;
  recording_date: string;
  duration_minutes: string;
  thumbnail_url: string;
  is_published: boolean;
}

const emptyForm: RecordingForm = {
  title: "",
  description: "",
  youtube_url: "",
  recording_date: new Date().toISOString().split("T")[0],
  duration_minutes: "",
  thumbnail_url: "",
  is_published: true,
};

export function RecordingManagement() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RecordingForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchRecordings = async () => {
    const { data, error } = await supabase
      .from("zoom_call_recordings")
      .select("*")
      .order("recording_date", { ascending: false });

    if (error) {
      toast.error("Failed to load recordings");
    } else {
      setRecordings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (r: Recording) => {
    setEditingId(r.id);
    setForm({
      title: r.title,
      description: r.description || "",
      youtube_url: r.youtube_url,
      recording_date: r.recording_date,
      duration_minutes: r.duration_minutes?.toString() || "",
      thumbnail_url: r.thumbnail_url || "",
      is_published: r.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.youtube_url || !form.recording_date) {
      toast.error("Title, YouTube URL, and date are required");
      return;
    }
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description || null,
      youtube_url: form.youtube_url,
      recording_date: form.recording_date,
      duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
      thumbnail_url: form.thumbnail_url || null,
      is_published: form.is_published,
    };

    if (editingId) {
      const { error } = await supabase
        .from("zoom_call_recordings")
        .update(payload)
        .eq("id", editingId);
      if (error) {
        toast.error("Failed to update recording");
      } else {
        toast.success("Recording updated");
      }
    } else {
      const { error } = await supabase
        .from("zoom_call_recordings")
        .insert(payload);
      if (error) {
        toast.error("Failed to add recording");
      } else {
        toast.success("Recording added");
      }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchRecordings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this recording?")) return;
    const { error } = await supabase
      .from("zoom_call_recordings")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Failed to delete recording");
    } else {
      toast.success("Recording deleted");
      fetchRecordings();
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading recordings...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{recordings.length} recording(s)</p>
        <Button onClick={openNew} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Recording
        </Button>
      </div>

      {recordings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Video className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>No recordings yet. Click "Add Recording" to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recordings.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{r.title}</TableCell>
                  <TableCell>{format(new Date(r.recording_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{r.duration_minutes ? `${r.duration_minutes} min` : "—"}</TableCell>
                  <TableCell>{r.is_published ? "✅" : "❌"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Recording" : "Add Recording"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Monday Night Zoom — March 9, 2026" />
            </div>
            <div>
              <Label>YouTube URL *</Label>
              <Input value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
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
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief summary of topics discussed..." rows={3} />
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
