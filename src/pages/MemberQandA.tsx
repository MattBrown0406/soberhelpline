import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Search, BookOpen, Video, Loader2, ArrowLeft, ChevronDown, ChevronUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { format } from "date-fns";

interface QAEntry {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  meeting_date: string | null;
  created_at: string;
}

function QACard({ entry }: { entry: QAEntry }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 p-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">{entry.question}</p>
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0 mt-0.5 text-muted-foreground">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border pt-3">
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{entry.answer}</div>
          {entry.meeting_date && (
            <p className="text-xs text-muted-foreground mt-3">
              From the {format(new Date(entry.meeting_date), "MMMM d, yyyy")} meeting
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function MemberQandA() {
  const [entries, setEntries] = useState<QAEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchQA = async () => {
      const { data, error } = await supabase
        .from("meeting_qa_archive")
        .select("id, question, answer, tags, meeting_date, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!error && data) setEntries(data);
      setIsLoading(false);
    };
    fetchQA();
  }, []);

  const allTags = Array.from(new Set(entries.flatMap(e => e.tags || []))).sort();

  const filtered = entries.filter(e => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      e.question.toLowerCase().includes(q) ||
      e.answer.toLowerCase().includes(q);
    const matchesTag = !activeTag || e.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <>
      <SEOHead
        title="Q&A Archive | Sober Helpline Members"
        description="Browse questions asked during Family Squares meetings, with Matt's answers. Search by topic or keyword."
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Q&amp;A Archive</h1>
              <p className="text-muted-foreground text-sm">Real questions from Monday meetings, answered</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 pb-5 border-b border-border">
            <Link to="/zoom-recordings">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Video className="h-3.5 w-3.5" />
                Recordings
              </Button>
            </Link>
            <Link to="/member-learning-paths">
              <Button variant="outline" size="sm" className="gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Learning Paths
              </Button>
            </Link>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions and answers…"
              className="pl-9 pr-9"
            />
            {search && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => { setSearch(""); searchRef.current?.focus(); }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  activeTag === null
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                All ({entries.length})
              </button>
              {allTags.map(tag => {
                const count = entries.filter(e => e.tags.includes(tag)).length;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      activeTag === tag
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {tag} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No Q&amp;As have been added yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Check back after Monday's meeting.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results for "{search || activeTag}".</p>
              <button
                type="button"
                className="text-sm text-primary mt-2 hover:underline"
                onClick={() => { setSearch(""); setActiveTag(null); }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3">
                {filtered.length} {filtered.length === 1 ? "question" : "questions"}
                {(search || activeTag) ? " matching your filter" : ""}
              </p>
              {filtered.map(entry => <QACard key={entry.id} entry={entry} />)}
            </div>
          )}

          <div className="mt-10">
            <Link to="/family-education" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Education Center
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
