import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, Video, Play, Lock, Loader2, FileText, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import FamilySelfAssessment from "@/components/FamilySelfAssessment";
import ControlWorksheet from "@/components/ControlWorksheet";
import BoundaryWorksheet from "@/components/BoundaryWorksheet";
import ScenarioWorksheet from "@/components/ScenarioWorksheet";
import EnablingDecisionTree from "@/components/EnablingDecisionTree";
import GuiltResponsibilityWorksheet from "@/components/GuiltResponsibilityWorksheet";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: string;
  category: string;
}

// Sample videos - these would come from a database in production
const sampleVideos: VideoItem[] = [
  {
    id: "1",
    title: "Understanding Addiction: The Science of the Brain",
    description: "Learn how addiction affects the brain and why it's considered a disease, not a moral failing.",
    videoUrl: "https://www.youtube.com/embed/HUngLgGRJpo",
    duration: "15:32",
    category: "Understanding Addiction"
  },
  {
    id: "2",
    title: "Setting Healthy Boundaries with Your Loved One",
    description: "Practical strategies for establishing boundaries that protect you while encouraging recovery.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "22:15",
    category: "Boundaries"
  },
  {
    id: "3",
    title: "Self-Care for Family Members",
    description: "You can't pour from an empty cup. Learn essential self-care practices for families in crisis.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "18:45",
    category: "Self-Care"
  },
  {
    id: "4",
    title: "Effective Communication Strategies",
    description: "How to communicate with your loved one without enabling or pushing them away.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "20:10",
    category: "Communication"
  },
  {
    id: "5",
    title: "Preparing for an Intervention",
    description: "What to expect and how to prepare for a professional intervention.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "25:30",
    category: "Interventions"
  },
  {
    id: "6",
    title: "Supporting Recovery: The First 90 Days",
    description: "How to support your loved one during the critical early recovery period.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "19:22",
    category: "Recovery Support"
  },
];

const categories = ["All", "Understanding Addiction", "Boundaries", "Self-Care", "Communication", "Interventions", "Recovery Support"];

export default function FamilyVideos() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

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
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .is('provider_submission_id', null)
          .limit(1);

        if (error) {
          console.error('Error checking membership:', error);
          setHasMembership(false);
        } else {
          setHasMembership(data && data.length > 0);
        }
      } catch (err) {
        console.error('Membership check failed:', err);
        setHasMembership(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMembership();
  }, [user]);

  const filteredVideos = selectedCategory === "All" 
    ? sampleVideos 
    : sampleVideos.filter(v => v.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasMembership) {
    return (
      <>
        <Helmet>
          <title>Family Education Videos | Sober Helpline</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <header className="border-b border-border/40 bg-background/95 backdrop-blur">
            <div className="container flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
              </Link>
              <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
                <Phone className="h-4 w-4" />
                (541) 241-5886
              </a>
            </div>
          </header>
          <main className="container py-12">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-2xl">Members Only Content</CardTitle>
                <CardDescription>
                  This content is exclusive to family support members.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Join our family support membership for just $10/month to access our library of educational videos.
                </p>
                <div className="flex flex-col gap-2">
                  <Link to="/family-membership">
                    <Button className="w-full">Become a Member</Button>
                  </Link>
                  <Link to="/family-support">
                    <Button variant="outline" className="w-full">Back to Family Support</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Family Education Videos | Sober Helpline</title>
        <meta name="description" content="Educational videos for families supporting loved ones through addiction and recovery." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Sober Helpline" className="h-12 w-auto" />
            </Link>
            <a href="tel:541-241-5886" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
              <Phone className="h-4 w-4" />
              (541) 241-5886
            </a>
          </div>
        </header>

        <main className="container py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <Link
              to="/family-support"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Family Support
            </Link>

            <div className="text-center mb-8">
              <Video className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                Family Education Resources
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Expert-led video courses to help you understand addiction and support your loved one's recovery.
              </p>
            </div>

            {/* The Six Pillars Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-logo-green text-center mb-6">The Six Pillars</h2>
              <div className="grid md:grid-cols-2 gap-x-16 gap-y-3 max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</span>
                  <p className="text-foreground whitespace-nowrap">Understanding Addiction (Foundational)</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">4</span>
                  <p className="text-foreground whitespace-nowrap">Treatment Literacy</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</span>
                  <p className="text-foreground whitespace-nowrap">Understanding Mental Health & Dual Diagnosis</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">5</span>
                  <p className="text-foreground whitespace-nowrap">Boundaries, Consequences, and Change</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</span>
                  <p className="text-foreground whitespace-nowrap">Understanding Family Systems and Enabling</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">6</span>
                  <p className="text-foreground whitespace-nowrap">Family Recovery</p>
                </div>
              </div>
            </div>

            {/* Enabling vs Helping Decision Tree */}
            <div className="mb-10">
              <EnablingDecisionTree />
            </div>

            {/* Self-Assessment */}
            {user && <FamilySelfAssessment user={user} />}

            {/* Control Worksheet */}
            {user && <ControlWorksheet user={user} />}

            {/* Boundary Worksheet */}
            {user && <BoundaryWorksheet user={user} />}

            {/* Scenario Worksheet */}
            {user && <ScenarioWorksheet user={user} />}

            {/* Guilt vs Responsibility Worksheet */}
            {user && <GuiltResponsibilityWorksheet user={user} />}

            {/* Relapse Warning Signs Tracker */}
            <div className="mb-10 p-6 bg-muted/30 rounded-lg border">
              <h3 className="text-lg font-semibold text-logo-green mb-3">Relapse Warning Signs Tracker</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Return to active use is the end of a process that often begins days or weeks before the substance is used. This interactive tracker helps you identify emotional, behavioral, and cognitive warning signs early—when intervention is most effective.
              </p>
              <Link to="/relapse-warning-signs">
                <Button className="gap-2">
                  <FileText className="h-4 w-4" />
                  Open Warning Signs Tracker
                </Button>
              </Link>
            </div>

            {/* Printable Resources */}
            <div className="mb-10 p-6 bg-muted/30 rounded-lg border">
              <h3 className="text-lg font-semibold text-logo-green mb-3">Printable Resources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download and print these guides to use when evaluating treatment options and supporting recovery.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/treatment-questions">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    40 Questions to Ask a Treatment Center
                  </Button>
                </Link>
                <Link to="/recovery-requirements">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    What Recovery Requires From Families
                  </Button>
                </Link>
                <Link to="/family-action-plan">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Family Recovery Action Plan
                  </Button>
                </Link>
                <Link to="/scenario-exercise">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Scenario Practice Exercise
                  </Button>
                </Link>
                <Link to="/readiness-checklist">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Readiness for Change Checklist
                  </Button>
                </Link>
                <Link to="/crisis-chaos">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Crisis vs. Chaos Decision Guide
                  </Button>
                </Link>
                <Link to="/emotional-regulation">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Emotional Regulation Tools
                  </Button>
                </Link>
                <Link to="/values-exercise">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Values Clarification Exercise
                  </Button>
                </Link>
                <Link to="/talking-about-treatment">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    How to Talk About Treatment
                  </Button>
                </Link>
                <Link to="/communication-guide">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    What to Say / What Not to Say
                  </Button>
                </Link>
              </div>
            </div>

            {/* Guided Meditations */}
            <div className="mb-10 p-6 bg-muted/30 rounded-lg border">
              <h3 className="text-lg font-semibold text-logo-green mb-3 flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Guided Meditations
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Audio resources to help you stay grounded during difficult moments.
              </p>
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4 border">
                  <h4 className="font-medium text-foreground mb-2">Loving Enough to Let Go, Trusting Enough to Hope</h4>
                  <audio controls className="w-full">
                    <source src="/audio/loving-enough-to-let-go-meditation.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="bg-background rounded-lg p-4 border">
                  <h4 className="font-medium text-foreground mb-2">Regaining Calm When Addiction Triggers Fear and Urgency</h4>
                  <audio controls className="w-full">
                    <source src="/audio/regaining-calm-meditation.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="bg-background rounded-lg p-4 border">
                  <h4 className="font-medium text-foreground mb-2">Releasing Sadness and Guilt with Compassion</h4>
                  <audio controls className="w-full">
                    <source src="/audio/releasing-sadness-guilt-meditation.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="bg-background rounded-lg p-4 border">
                  <h4 className="font-medium text-foreground mb-2">Allowing Hope and Happiness to Return</h4>
                  <audio controls className="w-full">
                    <source src="/audio/allowing-hope-happiness-meditation.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Active Video Player */}
            {activeVideo && (
              <Card className="mb-8">
                <CardContent className="p-0">
                  <div className="aspect-video">
                    <iframe
                      src={activeVideo.videoUrl}
                      title={activeVideo.title}
                      className="w-full h-full rounded-t-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-logo-green mb-2">{activeVideo.title}</h2>
                    <p className="text-muted-foreground">{activeVideo.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => (
                <Card 
                  key={video.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${activeVideo?.id === video.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setActiveVideo(video)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted relative rounded-t-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="p-3 bg-primary rounded-full">
                          <Play className="h-6 w-6 text-primary-foreground" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-primary font-medium">{video.category}</span>
                      <h3 className="font-semibold text-logo-green mt-1 line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{video.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
