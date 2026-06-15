import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, Video, Calendar, Clock, Users, Lock, Loader2, PlayCircle, CheckCircle, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hasAppSubscriberSessionCookie } from "@/lib/webSession";

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

const pastWebinars: Webinar[] = [];

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

        <main className="container py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link
                to="/family-support"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
              <Link to="/family-coaching">
                <Button variant="outline" size="sm" className="gap-2 border-amber-500/50 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30">
                  <Users className="h-4 w-4" />
                  Family Coaching
                </Button>
              </Link>
              <Link to="/family-education">
                <Button variant="outline" size="sm" className="gap-2">
                  Family Education
                </Button>
              </Link>
              <Link to="/family-forum">
                <Button variant="outline" size="sm" className="gap-2">
                  Family Forum
                </Button>
              </Link>
              <Link to="/zoom-recordings">
                <Button variant="outline" size="sm" className="gap-2">
                  Past Recordings
                </Button>
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-logo-blue mb-2">
                Monthly Webinars
              </h1>
              <p className="text-muted-foreground">
                Live sessions with addiction specialists, plus access to our full library of past recordings.
              </p>
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Coming Soon:</strong> Once our membership reaches 100 families, we will begin scheduling our monthly live webinars. Thank you for being an early member!
                </p>
              </div>
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
                    <h2 className="text-2xl font-bold text-logo-blue mb-3">
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
              <h2 className="text-xl font-semibold text-logo-blue mb-2">Past Recordings</h2>
              <p className="text-muted-foreground text-sm">
                Missed a webinar? Watch the recording anytime.
              </p>
            </div>

            <Card className="bg-muted/30">
              <CardContent className="p-6 text-center">
                <PlayCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Past webinar recordings will be available here after our first live session.
                </p>
              </CardContent>
            </Card>

            {/* Coming Up */}
            <Card className="mt-10 bg-muted/30">
              <CardContent className="p-6 text-center">
                <Calendar className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-logo-blue mb-2">Coming Up in 2026</h3>
                <div className="text-sm text-muted-foreground space-y-1 max-w-md mx-auto">
                  <p><strong>February:</strong> TBD</p>
                  <p><strong>March:</strong> TBD</p>
                  <p><strong>April:</strong> TBD</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}