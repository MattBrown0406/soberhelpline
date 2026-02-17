import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, Calendar, Clock, Video, User, Lock, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface TimeSlot {
  id: string;
  date: string;
  fullDate: Date;
  dayOfWeek: string;
  time: string;
  available: boolean;
}

interface ZoomMeetingDetails {
  joinUrl: string;
  meetingId: string;
  password?: string;
  startTime: string;
}

// Generate sample time slots for the next 7 days
function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayOfWeek = days[date.getDay()];
    
    // Skip weekends
    if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') continue;
    
    times.forEach((time, index) => {
      // Parse time to create full date
      const [hourStr, period] = time.split(' ');
      const [hours, minutes] = hourStr.split(':').map(Number);
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) hour24 += 12;
      if (period === 'AM' && hours === 12) hour24 = 0;
      
      const fullDate = new Date(date);
      fullDate.setHours(hour24, minutes || 0, 0, 0);
      
      slots.push({
        id: `${i}-${index}`,
        date: dateStr,
        fullDate,
        dayOfWeek,
        time,
        available: Math.random() > 0.3 // Randomly mark some as unavailable
      });
    });
  }
  
  return slots;
}

export default function FamilyConsultation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [zoomDetails, setZoomDetails] = useState<ZoomMeetingDetails | null>(null);

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

  const uniqueDates = [...new Set(timeSlots.map(slot => slot.date))];
  const filteredSlots = selectedDate 
    ? timeSlots.filter(slot => slot.date === selectedDate)
    : [];

  const handleBooking = async () => {
    if (!selectedSlot || !user) return;
    
    setIsBooking(true);
    
    try {
      // Create Zoom meeting
      const { data, error } = await supabase.functions.invoke('create-zoom-meeting', {
        body: {
          topic: 'Family Support Consultation - Sober Helpline',
          startTime: selectedSlot.fullDate.toISOString(),
          duration: 30,
          userEmail: user.email,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to create Zoom meeting');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create Zoom meeting');
      }

      setZoomDetails({
        joinUrl: data.joinUrl,
        meetingId: data.meetingId,
        password: data.password,
        startTime: data.startTime,
      });
      
      setBookingConfirmed(true);
      
      toast({
        title: 'Consultation Booked!',
        description: 'Your Zoom meeting has been scheduled.',
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: error instanceof Error ? error.message : 'Failed to book consultation',
        variant: 'destructive',
      });
    } finally {
      setIsBooking(false);
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
          <title>Schedule Consultation | Sober Helpline</title>
        </Helmet>
        <div className="min-h-screen bg-background">
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
                  Join our family support membership for just $10/month to schedule 1-on-1 consultations with interventionists.
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

  if (bookingConfirmed && selectedSlot) {
    return (
      <>
        <Helmet>
          <title>Consultation Booked | Sober Helpline</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <main className="container py-12">
            <Card className="max-w-md mx-auto border-green-500">
              <CardHeader className="text-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-600">Consultation Booked!</CardTitle>
                <CardDescription>
                  Your Zoom meeting has been scheduled.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{selectedSlot.dayOfWeek}, {selectedSlot.date}</p>
                      <p className="text-sm text-muted-foreground">Date</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{selectedSlot.time}</p>
                      <p className="text-sm text-muted-foreground">Time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Zoom Video Call</p>
                      <p className="text-sm text-muted-foreground">30-minute session</p>
                    </div>
                  </div>
                </div>
                
                {zoomDetails && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold text-blue-900">Zoom Meeting Details</h4>
                    <div className="text-sm space-y-2">
                      <p><span className="text-blue-700">Meeting ID:</span> {zoomDetails.meetingId}</p>
                      {zoomDetails.password && (
                        <p><span className="text-blue-700">Password:</span> {zoomDetails.password}</p>
                      )}
                    </div>
                    <a 
                      href={zoomDetails.joinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Video className="h-4 w-4 mr-2" />
                        Join Zoom Meeting
                      </Button>
                    </a>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground text-center">
                  A confirmation email with Zoom details has been sent to your email address.
                </p>
                <Link to="/family-support">
                  <Button variant="outline" className="w-full">Back to Family Support</Button>
                </Link>
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
        <title>Schedule Consultation | Sober Helpline</title>
        <meta name="description" content="Schedule a private 1-on-1 consultation with a certified interventionist via Zoom." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/family-support"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Family Support
            </Link>

            <div className="text-center mb-8">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-logo-green mb-4">
                Schedule a Consultation
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Book a private 30-minute Zoom call with a certified interventionist for personalized guidance.
              </p>
            </div>

            {/* Consultation Info */}
            <Card className="mb-8 bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Zoom Video Call</p>
                      <p className="text-sm text-muted-foreground">Private & confidential</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">30 Minutes</p>
                      <p className="text-sm text-muted-foreground">One-on-one session</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Certified Interventionist</p>
                      <p className="text-sm text-muted-foreground">Expert guidance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Date Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select a Date</CardTitle>
                  <CardDescription>Choose from available dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {uniqueDates.map((date) => {
                      const slot = timeSlots.find(s => s.date === date);
                      return (
                        <Button
                          key={date}
                          variant={selectedDate === date ? "default" : "outline"}
                          className="h-auto py-3 flex flex-col"
                          onClick={() => {
                            setSelectedDate(date);
                            setSelectedSlot(null);
                          }}
                        >
                          <span className="text-xs opacity-80">{slot?.dayOfWeek}</span>
                          <span className="font-semibold">{date}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Time Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select a Time</CardTitle>
                  <CardDescription>
                    {selectedDate ? `Available times for ${selectedDate}` : 'Select a date first'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-3">
                      {filteredSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                          disabled={!slot.available}
                          className="h-auto py-3"
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Please select a date to see available times</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            {selectedSlot && (
              <Card className="mt-8 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Video className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">1-on-1 Consultation</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedSlot.dayOfWeek}, {selectedSlot.date} at {selectedSlot.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">30 min</Badge>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleBooking}
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Zoom Meeting...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    A Zoom meeting will be created and you'll receive the join link immediately.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
