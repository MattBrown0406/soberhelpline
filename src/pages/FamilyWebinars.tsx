import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, Video, Calendar, Clock, Users, Lock, Loader2, PlayCircle, CheckCircle, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface Webinar {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  host: string;
  hostTitle: string;
  isLive: boolean;
  isUpcoming: boolean;
  registeredCount?: number;
  recordingUrl?: string;
}

const upcomingWebinar: Webinar = {
  id: "upcoming-1",
  title: "Upcoming Webinar",
  description: "Upcoming webinar date, subject and speaker to be announced soon!",
  date: "To Be Announced",
  time: "To Be Announced",
  duration: "60 minutes",
  host: "To Be Announced",
  hostTitle: "",
  isLive: false,
  isUpcoming: true,
  registeredCount: 0,
};

const pastWebinars: Webinar[] = [
  {
    id: "past-1",
    title: "Setting Boundaries Without Guilt",
    description: "A comprehensive guide to establishing and maintaining healthy boundaries while supporting a loved one through addiction recovery.",
    date: "December 11, 2024",
    time: "7:00 PM EST",
    duration: "55 minutes",
    host: "Michael Torres, LCSW",
    hostTitle: "Family Therapist & Intervention Specialist",
    isLive: false,
    isUpcoming: false,
    recordingUrl: "#",
  },
  {
    id: "past-2",
    title: "Self-Care for Caregivers: Protecting Your Mental Health",
    description: "Essential strategies for maintaining your own wellbeing while supporting someone through addiction and recovery.",
    date: "November 13, 2024",
    time: "7:00 PM EST",
    duration: "50 minutes",
    host: "Jennifer Adams, PhD",
    hostTitle: "Psychologist & Wellness Coach",
    isLive: false,
    isUpcoming: false,
    recordingUrl: "#",
  },
  {
    id: "past-3",
    title: "Communication Strategies That Actually Work",
    description: "Learn proven techniques for having difficult conversations with your loved one about their addiction and recovery.",
    date: "October 9, 2024",
    time: "7:00 PM EST",
    duration: "65 minutes",
    host: "Dr. Robert Chen",
    hostTitle: "Clinical Director, Family Recovery Institute",
    isLive: false,
    isUpcoming: false,
    recordingUrl: "#",
  },
  {
    id: "past-4",
    title: "Navigating the Treatment Landscape",
    description: "Understanding different levels of care, how to choose the right treatment center, and what to expect during the recovery process.",
    date: "September 11, 2024",
    time: "7:00 PM EST",
    duration: "60 minutes",
    host: "Amanda Pierce, CIP",
    hostTitle: "Certified Intervention Professional",
    isLive: false,
    isUpcoming: false,
    recordingUrl: "#",
  },
];

export default function FamilyWebinars() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userProfile, setUserProfile] = useState<{ first_name: string; last_name: string; email: string } | null>(null);
  const userEmail = user?.email ?? "";

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
        // Check membership
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

        // Fetch user profile for registration (names from profiles, email from auth session)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
        }

        if (profileData && userEmail) {
          setUserProfile({
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: userEmail,
          });
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

  const { toast } = useToast();

  const handleWebinarRegistration = async () => {
    if (!userProfile) {
      toast({
        title: "Profile not found",
        description: "Please complete your profile to register.",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);
    try {
      const { error } = await supabase.functions.invoke('add-to-webinar-list', {
        body: {
          email: userProfile.email,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          webinarTitle: upcomingWebinar.title,
        },
      });

      if (error) {
        console.error('Webinar registration error:', error);
        toast({
          title: "Registration failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      } else {
        setIsRegistered(true);
        toast({
          title: "Registration successful!",
          description: "You'll receive a reminder before the webinar.",
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

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
          <title>Monthly Webinars | Sober Helpline</title>
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
                  Monthly webinars are exclusive to family support members.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Join our family support membership for just $14.99/month to access live monthly webinars and our complete library of past recordings.
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
        <title>Monthly Webinars | Sober Helpline</title>
        <meta name="description" content="Join our live monthly webinars with addiction specialists and access our library of past recordings." />
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
          <div className="max-w-5xl mx-auto">
            <Link
              to="/family-support"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Family Support
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-2">
                Monthly Webinars
              </h1>
              <p className="text-muted-foreground">
                Live sessions with addiction specialists, plus access to our full library of past recordings.
              </p>
            </div>

            {/* Upcoming Webinar */}
            <Card className="mb-10 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
              <div className="bg-primary px-4 py-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">Next Live Webinar</span>
              </div>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-logo-green mb-3">
                      {upcomingWebinar.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {upcomingWebinar.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{upcomingWebinar.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{upcomingWebinar.time} ({upcomingWebinar.duration})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{upcomingWebinar.registeredCount} members registered</span>
                      </div>
                    </div>
                    <div className="bg-background/60 rounded-lg p-4 mb-6">
                      <p className="font-medium text-foreground">{upcomingWebinar.host}</p>
                      <p className="text-sm text-muted-foreground">{upcomingWebinar.hostTitle}</p>
                    </div>
                    {isRegistered ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">You're registered! We'll send you a reminder.</span>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleWebinarRegistration} 
                        className="gap-2"
                        disabled={isRegistering}
                      >
                        {isRegistering ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Bell className="h-4 w-4" />
                        )}
                        {isRegistering ? "Registering..." : "Register for This Webinar"}
                      </Button>
                    )}
                  </div>
                  <div className="lg:w-64 flex flex-col justify-center items-center bg-background/40 rounded-lg p-6">
                    <Video className="h-16 w-16 text-primary/60 mb-3" />
                    <p className="text-center text-sm text-muted-foreground">
                      Live on Zoom
                    </p>
                    <p className="text-center text-xs text-muted-foreground mt-1">
                      Link will be emailed to registered attendees
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Past Recordings */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-logo-green mb-2">Past Recordings</h2>
              <p className="text-muted-foreground text-sm">
                Missed a webinar? Watch the recording anytime.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {pastWebinars.map((webinar) => (
                <Card key={webinar.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                        <PlayCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-logo-green mb-1 line-clamp-2">
                          {webinar.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {webinar.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span>{webinar.date}</span>
                          <span>•</span>
                          <span>{webinar.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {webinar.host}
                          </span>
                          <Button variant="outline" size="sm" className="gap-1">
                            <PlayCircle className="h-3 w-3" />
                            Watch
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Coming Up */}
            <Card className="mt-10 bg-muted/30">
              <CardContent className="p-6 text-center">
                <Calendar className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-logo-green mb-2">Coming Up in 2025</h3>
                <div className="text-sm text-muted-foreground space-y-1 max-w-md mx-auto">
                  <p><strong>February:</strong> Addiction & Mental Health: The Connection</p>
                  <p><strong>March:</strong> Supporting Long-Term Recovery</p>
                  <p><strong>April:</strong> When an Intervention is Needed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}