import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Video, Lock, Loader2, Calendar, Clock, Play, ArrowLeft, Sparkles, Users, BookOpen, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import GoogleTranslate from "@/components/GoogleTranslate";
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
}

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export default function ZoomRecordings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

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
      if (!user) {
        setHasMembership(false);
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('provider_subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .is('provider_submission_id', null);

        if (error) {
          setHasMembership(false);
        } else {
          setHasMembership(data && data.length > 0);
        }
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

      if (!error && data) {
        setRecordings(data);
      }
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

  if (!hasMembership) {
    return (
      <>
        <SEOHead
          title="Past Meeting Recordings | Sober Helpline"
          description="Watch past The Family Squares Zoom recordings. Members-only access to our archive of family support sessions."
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
                    { icon: Video, text: "Full archive of past The Family Squares recordings" },
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

  return (
    <>
      <SEOHead
        title="Past Meeting Recordings | Sober Helpline"
        description="Watch past The Family Squares Zoom recordings."
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center gap-2 mb-2">
            <GoogleTranslate />
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Past Meeting Recordings</h1>
                <p className="text-muted-foreground text-sm">Catch up on The Family Squares sessions you missed</p>
              </div>
            </div>
          </div>

          {selectedRecording ? (
            <div className="space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedRecording(null)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to all recordings
              </Button>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(selectedRecording.youtube_url)}
                  title={selectedRecording.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedRecording.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
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
                {selectedRecording.description && (
                  <p className="text-muted-foreground mt-3">{selectedRecording.description}</p>
                )}
              </div>
            </div>
          ) : recordings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Video className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Recordings Yet</h3>
                <p className="text-muted-foreground">
                  Recordings from our The Family Squares sessions will appear here soon.
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recordings.map((recording) => {
                const thumbnail = recording.thumbnail_url || getYouTubeThumbnail(recording.youtube_url);
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
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <Video className="w-12 h-12 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-6 h-6 text-primary ml-1" />
                        </div>
                      </div>
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
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
