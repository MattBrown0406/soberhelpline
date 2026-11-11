import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, MessageCircleQuestion, Search, BookOpen, Video, Loader2, ArrowLeft, CalendarDays, ChevronDown, ChevronUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/SEOHead";
import { IconTile, KindPill, MemberHero, MemberPage, Panel } from "@/components/member/MemberUI";
import { format } from "date-fns";

// Shared looks, written out in full so Tailwind keeps them.
const NAV_PILL =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm shadow-slate-900/[0.03] transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const CHIP =
  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const CHIP_ON = "border-primary bg-primary text-primary-foreground";
const CHIP_OFF = "border-border bg-card text-foreground/80 hover:border-primary/50";

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
    <Panel className="p-0 sm:p-0">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full items-start gap-3 rounded-2xl p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5"
        onClick={() => setOpen(!open)}
      >
        <IconTile icon={MessageCircleQuestion} tone="teal" />
        <span className="min-w-0 flex-1">
          {entry.meeting_date && (
            <KindPill tone="navy" className="mb-1.5 gap-1">
              <CalendarDays className="h-3 w-3" aria-hidden="true" />
              {format(new Date(entry.meeting_date), "MMM d, yyyy")}
            </KindPill>
          )}
          <span className="block break-words text-base font-semibold leading-snug text-foreground">{entry.question}</span>
          {entry.tags.length > 0 && (
            <span className="mt-2 flex flex-wrap gap-1.5">
              {entry.tags.map(tag => (
                <span key={tag} className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300">{tag}</span>
              ))}
            </span>
          )}
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            {open ? "Hide the answer" : "Read the answer"}
            {open ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
          </span>
        </span>
      </button>
      {open && (
        <div className="border-t border-border/70 px-4 pb-5 pt-4 sm:px-5">
          <div className="max-w-prose whitespace-pre-wrap break-words text-base leading-relaxed text-foreground">{entry.answer}</div>
          {entry.meeting_date && (
            <p className="mt-3 text-sm text-muted-foreground">
              From the {format(new Date(entry.meeting_date), "MMMM d, yyyy")} meeting
            </p>
          )}
        </div>
      )}
    </Panel>
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
      <MemberPage>
        <div className="container mx-auto max-w-3xl space-y-6 px-4 py-6 sm:py-10">
          <MemberHero
            eyebrow="Monday meetings"
            title="Q&A Archive"
            subtitle="Real questions from Monday meetings, answered"
          />

          <nav aria-label="Related member pages" className="flex flex-wrap gap-2">
            <Link to="/zoom-recordings" className={NAV_PILL}>
              <Video className="h-4 w-4 text-primary" aria-hidden="true" />
              Recordings
            </Link>
            <Link to="/member-home" className={NAV_PILL}>
              <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
              Learning Paths
            </Link>
          </nav>

          <div className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions and answers…"
                aria-label="Search questions and answers"
                className="h-12 rounded-xl border-border bg-card pl-10 pr-12 text-base shadow-sm shadow-slate-900/[0.03] md:text-base"
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-pressed={activeTag === null}
                  onClick={() => setActiveTag(null)}
                  className={`${CHIP} ${activeTag === null ? CHIP_ON : CHIP_OFF}`}
                >
                  All ({entries.length})
                </button>
                {allTags.map(tag => {
                  const count = entries.filter(e => e.tags.includes(tag)).length;
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={activeTag === tag}
                      onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                      className={`${CHIP} ${activeTag === tag ? CHIP_ON : CHIP_OFF}`}
                    >
                      {tag} ({count})
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary motion-reduce:animate-none" aria-label="Loading" />
            </div>
          ) : entries.length === 0 ? (
            <Panel className="py-10 text-center sm:py-12">
              <IconTile icon={MessageCircle} tone="teal" size="lg" className="mx-auto mb-3" />
              <p className="font-semibold text-foreground">No Q&amp;As have been added yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">Check back after Monday's meeting.</p>
            </Panel>
          ) : filtered.length === 0 ? (
            <Panel className="py-8 text-center">
              <p className="break-words text-foreground">No results for "{search || activeTag}".</p>
              <button
                type="button"
                className="mt-2 inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => { setSearch(""); setActiveTag(null); }}
              >
                Clear filters
              </button>
            </Panel>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {filtered.length} {filtered.length === 1 ? "question" : "questions"}
                {(search || activeTag) ? " matching your filter" : ""}
              </p>
              {filtered.map(entry => <QACard key={entry.id} entry={entry} />)}
            </div>
          )}

          <div className="pt-2">
            <Link
              to="/family-education"
              className="inline-flex min-h-11 items-center gap-1 rounded-lg text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Education Center
            </Link>
          </div>
        </div>
      </MemberPage>
    </>
  );
}
