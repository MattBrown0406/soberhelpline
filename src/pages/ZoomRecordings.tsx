import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Video, Lock, Loader2, Calendar, Clock, Play, ArrowLeft, Sparkles, Users, BookOpen, Shield, MessageCircle, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import GoogleTranslate from "@/components/GoogleTranslate";
import { IconTile, KindPill, MemberHero, MemberPage, Panel } from "@/components/member/MemberUI";
import { format } from "date-fns";

// Shared looks, written out in full so Tailwind keeps them.
const NAV_PILL =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm shadow-slate-900/[0.03] transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const CHIP =
  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const CHIP_ON = "border-primary bg-primary text-primary-foreground";
const CHIP_OFF = "border-border bg-card text-foreground/80 hover:border-primary/50";
const TAG_PILL =
  "inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300";

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
}

function getRecordingType(url: string): 'youtube' | 'zoom' | 'other' {
  if (/youtu\.be\/|youtube\.com\//.test(url)) return 'youtube';
  if (/zoom\.us\/rec\/|zoomgov\.com\/rec\//.test(url)) return 'zoom';
  return 'other';
}

function getZoomRecordingUrl(url: string, passcode?: string | null): string {
  const trimmedPasscode = passcode?.trim();
  if (!trimmedPasscode || /[?&](pwd|passcode)=/.test(url)) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('pwd', trimmedPasscode);
    return parsed.toString();
  } catch {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}pwd=${encodeURIComponent(trimmedPasscode)}`;
  }
}

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function ShowNotes({ notes, timestamps }: { notes: string | null; timestamps: KeyTimestamp[] }) {
  const [open, setOpen] = useState(false);
  const hasContent = (notes && notes.trim()) || timestamps.length > 0;
  if (!hasContent) return null;

  return (
    <div className="mt-4 rounded-xl border border-border/70 bg-muted/40">
      <button
        type="button"
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          Show Notes &amp; Key Moments
        </span>
        {open ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
      </button>
      {open && (
        <div className="space-y-4 border-t border-border/70 px-4 pb-4 pt-3">
          {timestamps.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Key Moments</p>
              <div className="space-y-1.5">
                {timestamps.map((ts, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-14 shrink-0 font-mono font-semibold text-primary">{ts.time}</span>
                    <span className="min-w-0 break-words text-foreground">{ts.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {notes && notes.trim() && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Notes</p>
              <div className="max-w-prose whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/80">{notes}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ZoomRecordings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkMembership = async () => {
      if (!user) { setHasMembership(false); setIsLoading(false); return; }
      try {
        const { data: isMember, error } = await supabase.rpc('is_active_family_member', { _user_id: user.id });
        setHasMembership(!error && isMember === true);
      } catch {
        setHasMembership(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkMembership();
  }, [user]);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!hasMembership) return;
      const { data, error } = await supabase
        .from('zoom_call_recordings')
        .select('*')
        .eq('is_published', true)
        .order('recording_date', { ascending: false });
      if (!error && data) setRecordings(data as unknown as Recording[]);
    };
    fetchRecordings();
  }, [hasMembership]);

  // No membership wall here: this page only renders inside SubscriberRoute,
  // which has already let the visitor in (a member, or staff). A second check
  // here used to flash a "Members Only" card at members while it loaded, and
  // lock out admins and moderators.


  // Collect all unique tags across loaded recordings
  const allTags = Array.from(new Set(recordings.flatMap(r => r.tags || []))).sort();
  const filtered = activeTag ? recordings.filter(r => r.tags?.includes(activeTag)) : recordings;

  return (
    <>
      <SEOHead
        title="Past Meeting Recordings | Sober Helpline"
        description='Watch past Family Squares Zoom recordings.'
      />
      <MemberPage>
        <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-10">
          <div className="flex items-center gap-2">
            <GoogleTranslate />
          </div>

          <MemberHero
            eyebrow="Monday meetings"
            title="Past Meeting Recordings"
            subtitle={'Catch up on Family Squares sessions you missed'}
          />

          <nav aria-label="Related member pages" className="flex flex-wrap gap-2">
            <Link to="/member-home" className={NAV_PILL}>
              <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
              Learning Paths
            </Link>
            <Link to="/member-qa" className={NAV_PILL}>
              <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
              Q&amp;A Archive
            </Link>
          </nav>

          {selectedRecording ? (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedRecording(null)}
                className="min-h-11 gap-2 rounded-xl px-3 text-primary hover:bg-card hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to all recordings
              </Button>

              {getRecordingType(selectedRecording.youtube_url) === 'youtube' ? (
                <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-sm shadow-slate-900/[0.04]">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedRecording.youtube_url)}
                    title={selectedRecording.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-[#16294a]/20 bg-card p-4 shadow-sm shadow-slate-900/[0.04] dark:border-sky-400/25">
                  <IconTile icon={Video} tone="navy" size="lg" />
                  <Button asChild className="h-12 gap-2 rounded-xl px-6 text-base">
                    <a
                      href={getZoomRecordingUrl(selectedRecording.youtube_url, selectedRecording.zoom_passcode)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play className="w-4 h-4" aria-hidden="true" />Watch Recording
                    </a>
                  </Button>
                  {getRecordingType(selectedRecording.youtube_url) === 'zoom' && selectedRecording.zoom_passcode?.trim() && (
                    <p className="px-4 text-center text-sm text-muted-foreground">
                      If Zoom still asks, enter passcode: <span className="font-mono font-semibold text-foreground">{selectedRecording.zoom_passcode.trim()}</span>
                    </p>
                  )}
                </div>
              )}

              <Panel>
                <div className="flex items-start gap-3">
                  <IconTile icon={Video} tone="navy" />
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words text-xl font-bold leading-snug text-foreground">{selectedRecording.title}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
                      <KindPill tone="navy" className="gap-1">
                        <Calendar className="w-3 h-3" aria-hidden="true" />
                        {format(new Date(selectedRecording.recording_date), 'MMMM d, yyyy')}
                      </KindPill>
                      {selectedRecording.duration_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          {selectedRecording.duration_minutes} min
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {selectedRecording.tags && selectedRecording.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedRecording.tags.map(tag => (
                      <span key={tag} className={TAG_PILL}>{tag}</span>
                    ))}
                  </div>
                )}
                {selectedRecording.description && (
                  <p className="mt-3 max-w-prose break-words text-base leading-relaxed text-foreground/80">{selectedRecording.description}</p>
                )}
                <ShowNotes
                  notes={selectedRecording.show_notes}
                  timestamps={selectedRecording.key_timestamps || []}
                />
              </Panel>
            </div>
          ) : recordings.length === 0 ? (
            <Panel className="py-10 text-center sm:py-12">
              <IconTile icon={Video} tone="navy" size="lg" className="mx-auto mb-4" />
              <h2 className="mb-2 text-lg font-semibold text-foreground">No Recordings Yet</h2>
              <p className="mx-auto max-w-prose text-muted-foreground">
                Recordings from our Family Squares sessions will appear here soon.
                Join us live every Monday at 7:00 PM Pacific!
              </p>
              <Button asChild variant="outline" className="mt-4 min-h-11 gap-2 rounded-xl px-5">
                <Link to="/monday-zoom-registration">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  Register for Next Session
                </Link>
              </Button>
            </Panel>
          ) : (
            <>
              {allTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 shrink-0 text-slate-600 dark:text-slate-300" aria-hidden="true" />
                  <button
                    type="button"
                    aria-pressed={activeTag === null}
                    onClick={() => setActiveTag(null)}
                    className={`${CHIP} ${activeTag === null ? CHIP_ON : CHIP_OFF}`}
                  >
                    All ({recordings.length})
                  </button>
                  {allTags.map(tag => {
                    const count = recordings.filter(r => r.tags?.includes(tag)).length;
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

              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-600 dark:text-slate-300">No recordings tagged "{activeTag}".</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((recording) => {
                    const thumbnail = recording.thumbnail_url ||
                      (getRecordingType(recording.youtube_url) === 'youtube'
                        ? getYouTubeThumbnail(recording.youtube_url)
                        : null);
                    const hasExtras = (recording.show_notes && recording.show_notes.trim()) || recording.key_timestamps?.length > 0;
                    return (
                      <div
                        key={recording.id}
                        className="group cursor-pointer transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
                        onClick={() => setSelectedRecording(recording)}
                      >
                        <Panel className="flex h-full flex-col overflow-hidden p-0 transition-shadow group-hover:border-primary/30 group-hover:shadow-md sm:p-0">
                          <div className="relative aspect-video overflow-hidden bg-muted">
                            {thumbnail ? (
                              <img src={thumbnail} alt={recording.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#16294a]/[0.05] dark:bg-sky-400/[0.06]">
                                <img src={logo} alt="Sober Helpline" className="w-24 h-auto opacity-60" />
                                <span className="text-xs font-semibold text-[#16294a] dark:text-sky-200">
                                  {format(new Date(recording.recording_date), 'MMM d, yyyy')}
                                </span>
                              </div>
                            )}
                            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
                                <Play className="ml-1 h-6 w-6 text-[#16294a]" />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-1 flex-col p-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <IconTile icon={Video} tone="navy" size="sm" />
                              <KindPill tone="navy" className="gap-1">
                                <Calendar className="w-3 h-3" aria-hidden="true" />
                                {format(new Date(recording.recording_date), 'MMM d, yyyy')}
                              </KindPill>
                              {recording.duration_minutes && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" aria-hidden="true" />
                                  {recording.duration_minutes} min
                                </span>
                              )}
                            </div>
                            <h2 className="mt-3 break-words text-base font-semibold leading-snug text-foreground">{recording.title}</h2>
                            {((recording.tags && recording.tags.length > 0) || hasExtras) && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {hasExtras && (
                                  <span className={`${TAG_PILL} gap-1`}>
                                    <BookOpen className="w-3 h-3" aria-hidden="true" />
                                    Show notes
                                  </span>
                                )}
                                {recording.tags && recording.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className={TAG_PILL}>{tag}</span>
                                ))}
                              </div>
                            )}
                            <div className="mt-auto pt-4">
                              <Button
                                type="button"
                                className="h-11 w-full gap-2 rounded-xl"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRecording(recording);
                                }}
                              >
                                <Play className="w-4 h-4" aria-hidden="true" />
                                Watch recording
                                <span className="sr-only">: {recording.title}</span>
                              </Button>
                            </div>
                          </div>
                        </Panel>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </MemberPage>
    </>
  );
}
