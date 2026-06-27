import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Video, Lock, Loader2, Calendar, Clock, Play, ArrowLeft, Sparkles, Users, BookOpen, Shield, MessageCircle, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import GoogleTranslate from "@/components/GoogleTranslate";
import { format } from "date-fns";
import { hasAppSubscriberSessionCookie } from "@/lib/webSession";

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
    <div className="mt-4 rounded-lg border border-border bg-muted/30">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-foreground"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Show Notes &amp; Key Moments
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-3">
          {timestamps.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Key Moments</p>
              <div className="space-y-1.5">
                {timestamps.map((ts, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="font-mono text-primary font-semibold shrink-0 w-14">{ts.time}</span>
                    <span className="text-foreground">{ts.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {notes && notes.trim() && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Notes</p>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{notes}</div>
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
        const { data, error } = await supabase
          .from('provider_subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .is('provider_submission_id', null);
        setHasMembership(!error && data != null && data.length > 0);
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
      if (!hasMembership && !hasAppSubscriberSessionCookie()) return;
      const { data, error } = await supabase
        .from('zoom_call_recordings')
        .select('*')
        .eq('is_published', true)
        .order('recording_date', { ascending: false });
      if (!error && data) setRecordings(data as unknown as Recording[]);
    };
    fetchRecordings();
  }, [hasMembership]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasMembership && !hasAppSubscriberSessionCookie()) {
    return (
      <>
        <SEOHead
          title="Past Meeting Recordings | Sober Helpline"
          description='Watch past "The Family Squares" Zoom recordings. Members-only access to our archive of family support sessions.'
        />
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">Members-Only Content</h1>
              <p className="text-muted-foreground text-lg">
                Past meeting recordings are available exclusively to Family Support members.
              </p>
            </div>
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background mb-6">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">What You Get as a Member</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {[
                    { icon: Video, text: 'Full archive of past "The Family Squares" recordings with show notes & timestamps' },
                    { icon: BookOpen, text: "50+ educational guides across 6 pillars" },
                    { icon: MessageCircle, text: "Private family support forum" },
                    { icon: Shield, text: "AI-powered coaching tools" },
                    { icon: Users, text: "Community of families who understand" },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col gap-2">
              <Link to="/family-membership">
                <Button className="w-full" size="lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Become a Member — Starting at $14.99/mo
                </Button>
              </Link>
              {!user && (
                <Link to="/auth?redirect=/zoom-recordings">
                  <Button variant="outline" className="w-full">Already a member? Sign in</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Collect all unique tags across loaded recordings
  const allTags = Array.from(new Set(recordings.flatMap(r => r.tags || []))).sort();
  const filtered = activeTag ? recordings.filter(r => r.tags?.includes(activeTag)) : recordings;

  return (
    <>
      <SEOHead
        title="Past Meeting Recordings | Sober Helpline"
        description='Watch past "The Family Squares" Zoom recordings.'
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center gap-2 mb-2">
            <GoogleTranslate />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Past Meeting Recordings</h1>
                <p className="text-muted-foreground text-sm">Catch up on "The Family Squares" sessions you missed</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              <Link to="/member-learning-paths">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  Learning Paths
                </Button>
              </Link>
              <Link to="/member-qa">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Q&amp;A Archive
                </Button>
              </Link>
            </div>
          </div>

          {selectedRecording ? (
            <div className="space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedRecording(null)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to all recordings
              </Button>

              {getRecordingType(selectedRecording.youtube_url) === 'youtube' ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedRecording.youtube_url)}
                    title={selectedRecording.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted flex flex-col items-center justify-center gap-3 border-2 border-primary/20">
                  <Video className="w-16 h-16 text-primary/40" />
                  <a
                    href={getZoomRecordingUrl(selectedRecording.youtube_url, selectedRecording.zoom_passcode)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="gap-2"><Play className="w-4 h-4" />Watch Recording</Button>
                  </a>
                  {getRecordingType(selectedRecording.youtube_url) === 'zoom' && selectedRecording.zoom_passcode?.trim() && (
                    <p className="text-xs text-muted-foreground text-center px-4">
                      If Zoom still asks, enter passcode: <span className="font-mono font-semibold text-foreground">{selectedRecording.zoom_passcode.trim()}</span>
                    </p>
                  )}
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedRecording.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(selectedRecording.recording_date), 'MMMM d, yyyy')}
                  </span>
                  {selectedRecording.duration_minutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedRecording.duration_minutes} min
                    </span>
                  )}
                </div>
                {selectedRecording.tags && selectedRecording.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedRecording.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
                {selectedRecording.description && (
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{selectedRecording.description}</p>
                )}
                <ShowNotes
                  notes={selectedRecording.show_notes}
                  timestamps={selectedRecording.key_timestamps || []}
                />
              </div>
            </div>
          ) : recordings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Video className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Recordings Yet</h3>
                <p className="text-muted-foreground">
                  Recordings from our "The Family Squares" sessions will appear here soon.
                  Join us live every Monday at 7 PM PST!
                </p>
                <Link to="/monday-zoom-registration" className="mt-4 inline-block">
                  <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Register for Next Session
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {allTags.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                  <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      activeTag === null
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    All ({recordings.length})
                  </button>
                  {allTags.map(tag => {
                    const count = recordings.filter(r => r.tags?.includes(tag)).length;
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

              {filtered.length === 0 ? (
                <p className="text-muted-foreground text-sm py-8 text-center">No recordings tagged "{activeTag}".</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((recording) => {
                    const thumbnail = recording.thumbnail_url ||
                      (getRecordingType(recording.youtube_url) === 'youtube'
                        ? getYouTubeThumbnail(recording.youtube_url)
                        : null);
                    const hasExtras = (recording.show_notes && recording.show_notes.trim()) || recording.key_timestamps?.length > 0;
                    return (
                      <Card
                        key={recording.id}
                        className="cursor-pointer hover:shadow-md transition-shadow group overflow-hidden"
                        onClick={() => setSelectedRecording(recording)}
                      >
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {thumbnail ? (
                            <img src={thumbnail} alt={recording.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 gap-3">
                              <img src={logo} alt="Sober Helpline" className="w-24 h-auto opacity-50" />
                              <span className="text-xs font-semibold text-primary/60">
                                {format(new Date(recording.recording_date), 'MMM d, yyyy')}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="w-6 h-6 text-primary ml-1" />
                            </div>
                          </div>
                          {hasExtras && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1" title="Show notes available">
                              <BookOpen className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-semibold line-clamp-2">{recording.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(recording.recording_date), 'MMM d, yyyy')}
                            </span>
                            {recording.duration_minutes && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {recording.duration_minutes} min
                              </span>
                            )}
                          </div>
                          {recording.tags && recording.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {recording.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">{tag}</Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
