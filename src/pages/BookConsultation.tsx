import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Calendar, Clock, User, CheckCircle, Phone, Monitor, Globe, Crown } from "lucide-react";
import logo from "@/assets/logo.png";
import providerHeadshot from "@/assets/provider-headshot.jpg";
import SEOHead from "@/components/SEOHead";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TIMEZONE_OPTIONS = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
];

const getTimezoneLabel = (tz: string) => TIMEZONE_OPTIONS.find((t) => t.value === tz)?.label || tz;

// Convert a time string (HH:MM) from one timezone to another on a given date
const convertTime = (timeStr: string, dateStr: string, fromTz: string, toTz: string): { time: string; dayOffset: number } => {
  const [h, m] = timeStr.split(":").map(Number);
  // Build a date-time in the source timezone using Intl
  const sourceDateStr = `${dateStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
  
  // Get UTC offset for both timezones
  const getOffset = (tz: string, date: Date) => {
    const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const local = new Date(date.toLocaleString("en-US", { timeZone: tz }));
    return (local.getTime() - utc.getTime()) / 60000;
  };
  
  const refDate = new Date(sourceDateStr);
  const fromOffset = getOffset(fromTz, refDate);
  const toOffset = getOffset(toTz, refDate);
  const diffMinutes = toOffset - fromOffset;
  
  let totalMinutes = h * 60 + m + diffMinutes;
  let dayOffset = 0;
  while (totalMinutes < 0) { totalMinutes += 1440; dayOffset--; }
  while (totalMinutes >= 1440) { totalMinutes -= 1440; dayOffset++; }
  
  const newH = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const newM = String(totalMinutes % 60).padStart(2, "0");
  return { time: `${newH}:${newM}`, dayOffset };
};

const formatTime12h = (time24: string) => {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

// Intake questionnaire sections
const SESSION_REASONS = [
  "Emergency Game Plan",
  "Family Intervention Coaching",
  "Finding a Treatment Program",
  "Following Aftercare Plans",
  "Boundaries and Enabling",
  "Family Communication Strategies",
  "Relapse Response Planning",
  "Understanding Addiction & Mental Health",
  "Supporting a Loved One in Recovery",
  "Other",
];

const intakeSections = [
  {
    title: "Contact Information",
    fields: [
      { id: "client_name", label: "Your Full Name", type: "text", required: true },
      { id: "client_email", label: "Email Address", type: "email", required: true },
      { id: "client_phone", label: "Phone Number", type: "tel", required: false },
      { id: "session_reason", label: "Primary Reason for This Session", type: "select", required: true, options: SESSION_REASONS, singleSessionOnly: true },
      { id: "relationship", label: "Your Relationship to the Individual", type: "select", required: true, options: ["Parent", "Spouse/Partner", "Adult Child", "Sibling", "Close Friend", "Employer", "Other"] },
    ],
  },
  {
    title: "About the Individual",
    fields: [
      { id: "individual_age", label: "Approximate Age of Individual", type: "select", required: true, options: ["Under 18", "18-25", "26-35", "36-45", "46-55", "56-65", "Over 65"] },
      { id: "primary_substance", label: "Primary Substance(s) of Concern", type: "text", required: true, placeholder: "e.g., Alcohol, Opioids, Methamphetamine" },
      { id: "duration_of_use", label: "How Long Has Substance Use Been a Concern?", type: "select", required: true, options: ["Less than 6 months", "6-12 months", "1-2 years", "3-5 years", "5-10 years", "Over 10 years"] },
      { id: "previous_treatment", label: "Has the Individual Been in Treatment Before?", type: "select", required: true, options: ["No", "Yes - once", "Yes - multiple times", "Unsure"] },
    ],
  },
  {
    title: "Current Situation",
    fields: [
      { id: "urgency", label: "How Urgent Is Your Situation?", type: "select", required: true, options: ["I need guidance but it's not urgent", "The situation is escalating", "This is a crisis - I need help now"] },
      { id: "family_dynamic", label: "Briefly Describe Your Family Dynamic", type: "textarea", required: true, placeholder: "What is the current household situation? How are family members affected?" },
      { id: "goals", label: "What Do You Hope to Gain From This Consultation?", type: "textarea", required: true, placeholder: "What questions do you have? What outcomes are you looking for?" },
    ],
  },
];

const BookConsultation = () => {
  const { isMember } = useMembershipStatus();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(0); // 0=providers, 1=select slot(s), 2-4=intake, 5=confirm
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [stabilizationSlots, setStabilizationSlots] = useState<Array<{ date: string; slot: any }>>([]);
  const [intakeData, setIntakeData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientTimezone, setClientTimezone] = useState(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return TIMEZONE_OPTIONS.some((t) => t.value === tz) ? tz : "America/Los_Angeles";
    } catch { return "America/Los_Angeles"; }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const planType = urlParams.get("plan"); // 'emergency', 'stabilization', 'parallel-recovery', or null
  const isStabilization = planType === "stabilization";
  const isParallelRecovery = planType === "parallel-recovery";
  const isMultiSession = isStabilization || isParallelRecovery;
  const requiredSlots = isParallelRecovery ? 12 : isStabilization ? 4 : 1;

  const totalSteps = 6;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please log in to book a consultation", variant: "destructive" });
      navigate("/auth");
      return;
    }
    setUser(user);
    loadProviders();
  };

  const loadProviders = async () => {
    const { data } = await supabase
      .from("consultation_providers")
      .select("*")
      .eq("status", "active");
    setProviders(data || []);
    setLoading(false);
  };

  const selectProvider = async (provider: any) => {
    setSelectedProvider(provider);
    const [availRes, bookingsRes] = await Promise.all([
      supabase
        .from("provider_availability")
        .select("*")
        .eq("provider_id", provider.id)
        .eq("is_active", true)
        .order("day_of_week")
        .order("start_time"),
      // Fetch ALL confirmed/pending bookings across ALL providers for Zoom conflict detection
      supabase
        .from("consultation_bookings")
        .select("booking_date, start_time, end_time, provider_id, timezone")
        .in("status", ["confirmed", "pending"]),
    ]);
    setAvailability(availRes.data || []);
    setBookedSlots(bookingsRes.data || []);
    setStep(1);
  };

  const handleIntakeChange = (fieldId: string, value: string) => {
    setIntakeData({ ...intakeData, [fieldId]: value });
  };

  const validateSection = (sectionIndex: number) => {
    const section = intakeSections[sectionIndex];
    const visibleFields = section.fields.filter((f) => !((f as any).singleSessionOnly && isMultiSession));
    for (const field of visibleFields) {
      if (field.required && !intakeData[field.id]?.trim()) {
        toast({ title: "Required field", description: `Please fill in "${field.label}"`, variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (step >= 2 && step <= 4) {
      if (!validateSection(step - 2)) return;
    }
    setStep(step + 1);
  };

  const getAvailableDates = () => {
    const dates: string[] = [];
    const today = new Date();
    const daysAhead = isParallelRecovery ? 90 : 30;
    for (let i = 1; i <= daysAhead; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dayOfWeek = d.getDay();
      if (availability.some((a) => a.day_of_week === dayOfWeek)) {
        dates.push(d.toISOString().split("T")[0]);
      }
    }
    return dates;
  };

  const getSlotsForDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const dayOfWeek = d.getDay();
    const dayAvailability = availability.filter((a) => a.day_of_week === dayOfWeek);
    const duration = selectedProvider?.session_duration_minutes || 60;
    const providerTz = selectedProvider?.timezone || "America/Los_Angeles";
    const slots: { id: string; start_time: string; end_time: string; provider_start_time: string; provider_end_time: string; display_start: string; display_end: string; timezone: string }[] = [];

    dayAvailability.forEach((a) => {
      const [startH, startM] = a.start_time.split(":").map(Number);
      const [endH, endM] = a.end_time.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      for (let m = startMinutes; m + duration <= endMinutes; m += duration) {
        const slotStartH = String(Math.floor(m / 60)).padStart(2, "0");
        const slotStartM = String(m % 60).padStart(2, "0");
        const slotEndTotal = m + duration;
        const slotEndH = String(Math.floor(slotEndTotal / 60)).padStart(2, "0");
        const slotEndM = String(slotEndTotal % 60).padStart(2, "0");
        const providerStartTime = `${slotStartH}:${slotStartM}:00`;
        const providerEndTime = `${slotEndH}:${slotEndM}:00`;

        // Check if this slot overlaps with ANY existing booking across all providers (shared Zoom account)
        const slotStartMin = parseInt(slotStartH) * 60 + parseInt(slotStartM);
        const slotEndMin = slotStartMin + duration;
        const isBooked = bookedSlots.some((b) => {
          if (b.booking_date !== dateStr) return false;
          // Convert booked slot times to provider timezone for comparison
          const bookedTz = (b as any).timezone || providerTz;
          let bookedStartStr = b.start_time?.slice(0, 5) || "00:00";
          let bookedEndStr = b.end_time?.slice(0, 5) || "01:00";
          if (bookedTz !== providerTz) {
            bookedStartStr = convertTime(bookedStartStr, dateStr, bookedTz, providerTz).time;
            bookedEndStr = convertTime(bookedEndStr, dateStr, bookedTz, providerTz).time;
          }
          const [bsH, bsM] = bookedStartStr.split(":").map(Number);
          const [beH, beM] = bookedEndStr.split(":").map(Number);
          const bookedStartMin = bsH * 60 + bsM;
          const bookedEndMin = beH * 60 + beM;
          // Check for any overlap
          return slotStartMin < bookedEndMin && slotEndMin > bookedStartMin;
        });
        if (!isBooked) {
          // Convert to client timezone for display
          const convertedStart = convertTime(`${slotStartH}:${slotStartM}`, dateStr, providerTz, clientTimezone);
          const convertedEnd = convertTime(`${slotEndH}:${slotEndM}`, dateStr, providerTz, clientTimezone);
          
          slots.push({
            id: `${a.id}-${providerStartTime}`,
            start_time: providerStartTime,
            end_time: providerEndTime,
            provider_start_time: providerStartTime,
            provider_end_time: providerEndTime,
            display_start: formatTime12h(convertedStart.time),
            display_end: formatTime12h(convertedEnd.time),
            timezone: a.timezone || providerTz,
          });
        }
      }
    });

    return slots;
  };

  // Add a slot for stabilization plan
  const addStabilizationSlot = () => {
    if (!selectedDate || !selectedSlot) return;
    // Check for duplicate
    const isDuplicate = stabilizationSlots.some(
      (s) => s.date === selectedDate && s.slot.id === selectedSlot.id
    );
    if (isDuplicate) {
      toast({ title: "Duplicate slot", description: "You've already selected this time slot.", variant: "destructive" });
      return;
    }
    setStabilizationSlots([...stabilizationSlots, { date: selectedDate, slot: selectedSlot }]);
    setSelectedDate("");
    setSelectedSlot(null);
  };

  const removeStabilizationSlot = (index: number) => {
    setStabilizationSlots(stabilizationSlots.filter((_, i) => i !== index));
  };

  const handleBooking = async () => {
    if (!selectedProvider || !user) return;

    const slotsToBook = isMultiSession
      ? stabilizationSlots.map((s) => ({ date: s.date, slot: s.slot }))
      : selectedSlot ? [{ date: selectedDate, slot: selectedSlot }] : [];

    if (slotsToBook.length === 0) return;
    setIsSubmitting(true);

    try {
      // Build intake responses object with readable labels
      const intakeResponses: Record<string, string> = {};
      intakeSections.forEach((section) => {
        section.fields.forEach((field) => {
          if (intakeData[field.id]) {
            intakeResponses[field.label] = intakeData[field.id];
          }
        });
      });

      let coachingPlanId: string | null = null;

      // For stabilization plan, create the coaching plan
      if (isMultiSession) {
        const planConfig = isParallelRecovery
          ? { plan_type: "parallel-recovery", total_sessions: 12, total_amount: 1500, provider_payout_per_session: 100 }
          : { plan_type: "stabilization", total_sessions: 4, total_amount: 500, provider_payout_per_session: 100 };

        const { data: newPlan, error: planError } = await supabase
          .from("coaching_plans")
          .insert({
            client_user_id: user.id,
            provider_id: selectedProvider.id,
            ...planConfig,
          } as any)
          .select()
          .single();

        if (planError) throw planError;
        coachingPlanId = newPlan.id;
      }

      const memberRate = 125;
      const singleSessionRate = isMember ? memberRate : selectedProvider.session_rate;
      const totalAmount = isParallelRecovery ? 1500 : isStabilization ? 500 : singleSessionRate;
      const amountPaid = totalAmount;

      // Create all bookings
      const bookingInserts = slotsToBook.map((s, index) => ({
        provider_id: selectedProvider.id,
        client_user_id: user.id,
        booking_date: s.date,
        start_time: s.slot.start_time,
        end_time: s.slot.end_time,
        timezone: s.slot.timezone || "America/Los_Angeles",
        amount_paid: isMultiSession ? (index === 0 ? totalAmount : 0) : amountPaid,
        intake_responses: intakeResponses,
        client_name: intakeData.client_name,
        client_email: intakeData.client_email,
        client_phone: intakeData.client_phone || null,
        status: "confirmed",
        coaching_plan_id: coachingPlanId,
      }));

      const { data: bookingsData, error } = await supabase
        .from("consultation_bookings")
        .insert(bookingInserts as any)
        .select();

      if (error) throw error;

      // Trigger edge function for each booking (Zoom + emails)
      for (const booking of (bookingsData || [])) {
        const { error: fnError } = await supabase.functions.invoke("process-consultation-booking", {
          body: { bookingId: booking.id },
        });
        if (fnError) console.error("Edge function error for booking:", booking.id, fnError);
      }

      const planName = isParallelRecovery ? "Parallel Recovery Program" : "Stabilization Plan";
      toast({
        title: isMultiSession ? `${planName} Booked!` : "Consultation Booked!",
        description: isMultiSession
          ? `All ${requiredSlots} sessions have been scheduled. Check your email for confirmation details.`
          : "Your session is confirmed. You can join from this site when it's time.",
      });

      const onboardingPlan = planType || "single";
      navigate(`/coaching-onboarding?plan=${onboardingPlan}`);
    } catch (error) {
      console.error("Booking error:", error);
      toast({ title: "Booking failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Book a Consultation | Sober Helpline"
        description="Book a one-on-one video consultation with an addiction and family recovery specialist."
      />
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />Back
            </Button>
          </Link>
          <img src={logo} alt="Sober Helpline" className="w-24 md:w-32 h-auto" />
        </div>

        {step > 0 && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Step {step} of {totalSteps - 1}</span>
              <span>{Math.round(progressPercent)}% Complete</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          {/* Step 0: Browse Providers */}
          {step === 0 && (
            <>
              <h1 className="text-2xl font-bold mb-2 text-center">{isMultiSession ? (isParallelRecovery ? "Book Parallel Recovery Program™" : "Book Family Stabilization Plan") : "Book a Consultation"}</h1>
              <p className="text-muted-foreground text-center mb-6">{isParallelRecovery ? `Choose a provider for your 12-session program ($1,500)` : isStabilization ? "Choose a provider for your 4-session stabilization plan ($500)" : `Choose a provider to schedule your 60-minute video consultation${isMember ? " ($125 — Member Rate)" : " ($150)"}`}</p>
              {providers.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">No providers are currently available. Please check back soon.</CardContent></Card>
              ) : (
                <div className="space-y-4">
                  {providers.map((p) => (
                    <Card key={p.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => selectProvider(p)}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img src={providerHeadshot} alt={p.full_name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{p.full_name}</h3>
                            {p.title && <p className="text-sm text-muted-foreground">{p.title}</p>}
                            <p className="text-sm mt-2 line-clamp-2">{p.bio}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(p.specialties || []).map((s: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                              ))}
                            </div>
                            <p className="text-sm font-medium mt-2 text-primary">
                              {isMember && !isMultiSession ? (
                                <span className="flex items-center gap-1.5">
                                  <Crown className="w-3.5 h-3.5" />
                                  <span className="line-through text-muted-foreground">${p.session_rate}</span>{" "}
                                  $125 / {p.session_duration_minutes} min
                                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-1">Member</span>
                                </span>
                              ) : (
                                <span>${p.session_rate} / {p.session_duration_minutes} min</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Step 1: Select Date & Time */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>{isMultiSession ? `Select ${requiredSlots} Session Times` : "Select Date & Time"}</CardTitle>
                <CardDescription>
                  {isMultiSession 
                    ? `Choose dates and times for all ${requiredSlots} sessions with ${selectedProvider?.full_name}. ${stabilizationSlots.length} of ${requiredSlots} selected.`
                    : `Choose an available date and time slot with ${selectedProvider?.full_name}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Show already selected slots for stabilization */}
                {isMultiSession && stabilizationSlots.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Sessions</Label>
                    {stabilizationSlots.map((s, i) => {
                      const dateObj = new Date(s.date + "T00:00:00");
                      return (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Session {i + 1}</Badge>
                            <span className="text-sm font-medium">
                              {DAYS[dateObj.getDay()]}, {dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {s.slot.display_start} - {s.slot.display_end}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeStabilizationSlot(i)} className="text-destructive hover:text-destructive">
                            ✕
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Show slot picker if more slots are needed */}
                {(!isMultiSession || stabilizationSlots.length < requiredSlots) && (
                  <>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Globe className="h-4 w-4" />Your Timezone</Label>
                      <Select value={clientTimezone} onValueChange={(v) => { setClientTimezone(v); setSelectedSlot(null); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {TIMEZONE_OPTIONS.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{isMultiSession ? `Select Date for Session ${stabilizationSlots.length + 1}` : "Available Dates"}</Label>
                      <Select value={selectedDate} onValueChange={(v) => { setSelectedDate(v); setSelectedSlot(null); }}>
                        <SelectTrigger><SelectValue placeholder="Select a date..." /></SelectTrigger>
                        <SelectContent>
                          {getAvailableDates().map((d) => {
                            const date = new Date(d + "T00:00:00");
                            return <SelectItem key={d} value={d}>{DAYS[date.getDay()]}, {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</SelectItem>;
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedDate && (
                      <div className="space-y-2">
                        <Label>Available Times <span className="text-muted-foreground font-normal">({getTimezoneLabel(clientTimezone)})</span></Label>
                        <RadioGroup value={selectedSlot?.id || ""} onValueChange={(v) => setSelectedSlot(getSlotsForDate(selectedDate).find((s) => s.id === v))}>
                          {getSlotsForDate(selectedDate).filter((slot) => {
                            if (!isMultiSession) return true;
                            return !stabilizationSlots.some((s) => s.date === selectedDate && s.slot.id === slot.id);
                          }).map((slot) => (
                            <div key={slot.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                              <RadioGroupItem value={slot.id} id={slot.id} />
                              <Label htmlFor={slot.id} className="flex items-center gap-2 cursor-pointer">
                                <Clock className="h-4 w-4" />
                                {slot.display_start} - {slot.display_end}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {isMultiSession && selectedSlot && (
                      <Button onClick={addStabilizationSlot} className="w-full">
                        Add Session {stabilizationSlots.length + 1} of {requiredSlots}
                      </Button>
                    )}
                  </>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => { setStep(0); setStabilizationSlots([]); }}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
                  <Button 
                    onClick={goNext} 
                    disabled={isMultiSession ? stabilizationSlots.length < requiredSlots : !selectedSlot}
                  >
                    Next<ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Steps 2-4: Intake Questionnaire */}
          {step >= 2 && step <= 4 && (
            <Card>
              <CardHeader>
                <CardTitle>{intakeSections[step - 2].title}</CardTitle>
                <CardDescription>Section {step - 1} of 3</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {intakeSections[step - 2].fields.filter((f: any) => !(f.singleSessionOnly && isMultiSession)).map((field: any) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label} {field.required && "*"}</Label>
                    {field.type === "select" ? (
                      <Select value={intakeData[field.id] || ""} onValueChange={(v) => handleIntakeChange(field.id, v)}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          {field.options?.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : field.type === "textarea" ? (
                      <Textarea
                        id={field.id}
                        value={intakeData[field.id] || ""}
                        onChange={(e) => handleIntakeChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        value={intakeData[field.id] || ""}
                        onChange={(e) => handleIntakeChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="w-4 h-4 mr-1" />Previous
                  </Button>
                  <Button onClick={goNext}>
                    Next<ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                   {isMultiSession ? `Confirm Your ${isParallelRecovery ? "Parallel Recovery Program" : "Stabilization Plan"}` : "Confirm Your Booking"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Provider</span><span className="font-medium">{selectedProvider?.full_name}</span></div>
                  {isMultiSession ? (
                    <>
                      <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-medium">{isParallelRecovery ? "Parallel Recovery Program™ (12 sessions)" : "Family Stabilization Plan (4 sessions)"}</span></div>
                      <div className="border-t pt-2 mt-2 space-y-2">
                        {stabilizationSlots.map((s, i) => {
                          const dateObj = new Date(s.date + "T00:00:00");
                          return (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Session {i + 1}</span>
                              <span className="font-medium">
                                {DAYS[dateObj.getDay()]}, {dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {s.slot.display_start} - {s.slot.display_end}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2"><span className="font-semibold">Total</span><span className="font-bold text-primary">${isParallelRecovery ? "1,500" : "500"}</span></div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{selectedSlot?.display_start} - {selectedSlot?.display_end} ({getTimezoneLabel(clientTimezone)})</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{selectedProvider?.session_duration_minutes} minutes</span></div>
                      {isMember ? (
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="font-semibold flex items-center gap-1.5"><Crown className="w-4 h-4 text-primary" />Member Rate</span>
                          <span className="font-bold text-primary">
                            <span className="line-through text-muted-foreground text-sm mr-1">${selectedProvider?.session_rate}</span>
                            $125
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-between border-t pt-2 mt-2"><span className="font-semibold">Total</span><span className="font-bold text-primary">${selectedProvider?.session_rate}</span></div>
                      )}
                    </>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {isMultiSession 
                    ? `Zoom meetings will be created for each session. You'll receive confirmation emails with join links for all ${requiredSlots} sessions.`
                    : "A video session will be created automatically. After booking, you'll be able to join the session directly from this site — no downloads required. You'll also receive a confirmation email."}
                </p>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(4)}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
                  <Button onClick={handleBooking} disabled={isSubmitting} size="lg">
                    {isSubmitting ? "Booking..." : isMultiSession ? `Book & Pay $${isParallelRecovery ? "1,500" : "500"}` : `Book & Pay $${isMember ? "125" : selectedProvider?.session_rate}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookConsultation;
