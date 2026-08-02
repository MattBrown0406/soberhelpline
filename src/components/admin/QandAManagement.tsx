import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, MessageCircle, EyeOff, DownloadCloud } from "lucide-react";
import { format } from "date-fns";

const AVAILABLE_TAGS = [
  "Boundaries", "Enabling", "Intervention", "Communication",
  "Relapse", "Self-Care", "Treatment", "Mental Health",
  "Denial", "Family Roles", "Grief", "Early Recovery",
];

interface QAEntry {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  meeting_date: string | null;
  is_published: boolean;
  created_at: string;
  source_registration_id: string | null;
}

interface QAForm {
  question: string;
  answer: string;
  tags: string[];
  meeting_date: string;
  is_published: boolean;
}

const emptyForm: QAForm = {
  question: "",
  answer: "",
  tags: [],
  meeting_date: "",
  is_published: true,
};

export function QandAManagement() {
  const [entries, setEntries] = useState<QAEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<QAForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [importing, setImporting] = useState(false);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("meeting_qa_archive")
      .select("id, question, answer, tags, meeting_date, is_published, created_at, source_registration_id")
      .order("created_at", { ascending: false });

    if (error) toast.error("Failed to load Q&As");
    else setEntries((data as QAEntry[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, []);

  const importFromRegistrations = async () => {
    setImporting(true);
    try {
      const [regRes, existingRes] = await Promise.all([
        supabase
          .from("zoom_meeting_registrations")
          .select("id, question, meeting_date")
          .order("meeting_date", { ascending: false }),
        supabase
          .from("meeting_qa_archive")
          .select("source_registration_id")
          .not("source_registration_id", "is", null),
      ]);

      if (regRes.error || existingRes.error) throw regRes.error || existingRes.error;

      const seen = new Set(
        ((existingRes.data as { source_registration_id: string | null }[]) || [])
          .map(r => r.source_registration_id)
          .filter(Boolean) as string[]
      );

      const skip = new Set(["no question", "no question at the moment", "none", "n/a", "na", "support", "no questions"]);

      const rows = (regRes.data || [])
        .filter(r => {
          const q = (r.question || "").trim();
          return q.length > 12 && !skip.has(q.toLowerCase()) && !seen.has(r.id);
        })
        .map(r => ({
          question: (r.question || "").trim(),
          answer: "",
          tags: [],
          meeting_date: r.meeting_date,
          is_published: false,
          source_registration_id: r.id,
        }));

      if (rows.length === 0) {
        toast.info("No new questions to import");
        return;
      }

      const { error } = await supabase.from("meeting_qa_archive").insert(rows);
      if (error) throw error;
      toast.success(`Imported ${rows.length} question${rows.length === 1 ? "" : "s"} as unpublished drafts`);
      fetchEntries();
    } catch {
      toast.error("Failed to import questions");
    } finally {
      setImporting(false);
    }
  };


  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (e: QAEntry) => {
    setEditingId(e.id);
    setForm({
      question: e.question,
      answer: e.answer,
      tags: e.tags || [],
      meeting_date: e.meeting_date || "",
      is_published: e.is_published,
    });
    setDialogOpen(true);
  };

  const toggleTag = (tag: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  };

  const handleSave = async () => {
    if (!form.question.trim()) {
      toast.error("Question is required");
      return;
    }
    if (form.is_published && !form.answer.trim()) {
      toast.error("An answer is required before publishing");
      return;
    }
    setSaving(true);

    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      tags: form.tags,
      meeting_date: form.meeting_date || null,
      is_published: form.is_published,
    };

    const { error } = editingId
      ? await supabase.from("meeting_qa_archive").update(payload).eq("id", editingId)
      : await supabase.from("meeting_qa_archive").insert(payload);

    if (error) toast.error(editingId ? "Failed to update Q&A" : "Failed to add Q&A");
    else toast.success(editingId ? "Q&A updated" : "Q&A added");

    setSaving(false);
    setDialogOpen(false);
    fetchEntries();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this Q&A?")) return;
    const { error } = await supabase.from("meeting_qa_archive").delete().eq("id", id);
    if (error) toast.error("Failed to delete Q&A");
    else { toast.success("Q&A deleted"); fetchEntries(); }
  };

  const togglePublished = async (entry: QAEntry) => {
    if (!entry.is_published && !entry.answer.trim()) {
      toast.error("Add an answer before publishing this question");
      return;
    }
    const { error } = await supabase
      .from("meeting_qa_archive")
      .update({ is_published: !entry.is_published })
      .eq("id", entry.id);
    if (error) toast.error("Failed to update");
    else { toast.success(entry.is_published ? "Hidden from members" : "Now visible to members"); fetchEntries(); }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading Q&amp;As...</div>;

  const needsAnswer = entries.filter(e => !e.answer.trim()).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">
          {entries.length} Q&amp;A(s)
          {needsAnswer > 0 && <span className="text-amber-600"> · {needsAnswer} awaiting an answer</span>}
        </p>
        <div className="flex gap-2">
          <Button onClick={importFromRegistrations} size="sm" variant="outline" className="gap-2" disabled={importing}>
            <DownloadCloud className="h-4 w-4" />
            {importing ? "Importing…" : "Import from registrations"}
          </Button>
          <Button onClick={openNew} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Q&amp;A
          </Button>
        </div>
      </div>


      {entries.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p>No Q&amp;As yet. Add questions captured from Monday meetings.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(entry => (
            <div key={entry.id} className={`rounded-lg border p-4 ${!entry.is_published ? "border-dashed opacity-60" : "border-border"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{entry.question}</p>
                  {entry.answer.trim() ? (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.answer}</p>
                  ) : (
                    <p className="text-xs text-amber-600 mt-1 font-medium">Needs an answer</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {entry.source_registration_id && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">From registration</Badge>
                    )}
                    {entry.tags.map(t => (
                      <Badge key={t} variant="secondary" className="text-xs px-1.5 py-0">{t}</Badge>
                    ))}
                    {entry.meeting_date && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(entry.meeting_date), "MMM d, yyyy")}
                      </span>
                    )}
                    {!entry.is_published && (
                      <span className="text-xs text-amber-600 flex items-center gap-1">
                        <EyeOff className="h-3 w-3" />
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => togglePublished(entry)} title={entry.is_published ? "Hide from members" : "Show to members"}>
                    <EyeOff className={`h-3.5 w-3.5 ${entry.is_published ? "text-muted-foreground" : "text-primary"}`} />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(entry)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(entry.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Q&A" : "Add Q&A"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Question *</Label>
              <Textarea
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="What they asked, in their own words…"
                rows={2}
              />
            </div>
            <div>
              <Label>Answer *</Label>
              <Textarea
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                placeholder="Matt's answer from the meeting…"
                rows={6}
              />
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
              <Label>Meeting Date (optional)</Label>
              <Input
                type="date"
                value={form.meeting_date}
                onChange={(e) => setForm({ ...form, meeting_date: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">The Monday this question was asked</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_published}
                onCheckedChange={(checked) => setForm({ ...form, is_published: checked })}
              />
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
