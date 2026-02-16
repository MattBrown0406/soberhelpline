import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import { ArrowLeft, ArrowRight, Calendar, Clock, User, CheckCircle, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import SEOHead from "@/components/SEOHead";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Intake questionnaire sections
const intakeSections = [
  {
    title: "Contact Information",
    fields: [
      { id: "client_name", label: "Your Full Name", type: "text", required: true },
      { id: "client_email", label: "Email Address", type: "email", required: true },
      { id: "client_phone", label: "Phone Number", type: "tel", required: false },
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(0); // 0=providers, 1-3=intake, 4=select slot, 5=confirm
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [intakeData, setIntakeData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const totalSteps = 6; // 0=browse, 1=slot, 2-4=intake sections, 5=confirm
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
    const { data } = await supabase
      .from("provider_availability")
      .select("*")
      .eq("provider_id", provider.id)
      .eq("is_active", true)
      .order("day_of_week")
      .order("start_time");
    setAvailability(data || []);
    setStep(1); // Go to date/time selection
  };

  const handleIntakeChange = (fieldId: string, value: string) => {
    setIntakeData({ ...intakeData, [fieldId]: value });
  };

  const validateSection = (sectionIndex: number) => {
    const section = intakeSections[sectionIndex];
    for (const field of section.fields) {
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
    for (let i = 1; i <= 30; i++) {
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
    return availability.filter((a) => a.day_of_week === dayOfWeek);
  };

  const handleBooking = async () => {
    if (!selectedProvider || !selectedSlot || !selectedDate || !user) return;
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

      const { data, error } = await supabase.from("consultation_bookings").insert({
        provider_id: selectedProvider.id,
        client_user_id: user.id,
        booking_date: selectedDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        timezone: selectedSlot.timezone || "America/Los_Angeles",
        amount_paid: selectedProvider.session_rate,
        intake_responses: intakeResponses,
        client_name: intakeData.client_name,
        client_email: intakeData.client_email,
        client_phone: intakeData.client_phone || null,
        status: "confirmed",
      }).select().single();

      if (error) throw error;

      // Trigger edge function to create Zoom meeting and send emails
      const { error: fnError } = await supabase.functions.invoke("process-consultation-booking", {
        body: { bookingId: data.id },
      });

      if (fnError) console.error("Edge function error:", fnError);

      toast({
        title: "Consultation Booked!",
        description: "You'll receive a confirmation email with your Zoom meeting link.",
      });
      navigate("/");
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
              <h1 className="text-2xl font-bold mb-2 text-center">Book a Consultation</h1>
              <p className="text-muted-foreground text-center mb-6">Choose a provider to schedule your 60-minute video consultation ($150)</p>
              {providers.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">No providers are currently available. Please check back soon.</CardContent></Card>
              ) : (
                <div className="space-y-4">
                  {providers.map((p) => (
                    <Card key={p.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => selectProvider(p)}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{p.full_name}</h3>
                            {p.title && <p className="text-sm text-muted-foreground">{p.title}</p>}
                            <p className="text-sm mt-2 line-clamp-2">{p.bio}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(p.specialties || []).map((s: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                              ))}
                            </div>
                            <p className="text-sm font-medium mt-2 text-primary">${p.session_rate} / {p.session_duration_minutes} min</p>
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
                <CardTitle>Select Date & Time</CardTitle>
                <CardDescription>Choose an available date and time slot with {selectedProvider?.full_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Available Dates</Label>
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
                    <Label>Available Times</Label>
                    <RadioGroup value={selectedSlot?.id || ""} onValueChange={(v) => setSelectedSlot(getSlotsForDate(selectedDate).find((s) => s.id === v))}>
                      {getSlotsForDate(selectedDate).map((slot) => (
                        <div key={slot.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value={slot.id} id={slot.id} />
                          <Label htmlFor={slot.id} className="flex items-center gap-2 cursor-pointer">
                            <Clock className="h-4 w-4" />
                            {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)} ({slot.timezone})
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(0)}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
                  <Button onClick={goNext} disabled={!selectedSlot}>Next<ArrowRight className="w-4 h-4 ml-1" /></Button>
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
                {intakeSections[step - 2].fields.map((field) => (
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
                <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Confirm Your Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Provider</span><span className="font-medium">{selectedProvider?.full_name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{selectedSlot?.start_time?.slice(0, 5)} - {selectedSlot?.end_time?.slice(0, 5)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{selectedProvider?.session_duration_minutes} minutes</span></div>
                  <div className="flex justify-between border-t pt-2 mt-2"><span className="font-semibold">Total</span><span className="font-bold text-primary">${selectedProvider?.session_rate}</span></div>
                </div>

                <p className="text-sm text-muted-foreground">
                  A Zoom meeting link will be created automatically and sent to both you and the provider via email. Payment will be processed through PayPal.
                </p>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(4)}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
                  <Button onClick={handleBooking} disabled={isSubmitting} size="lg">
                    {isSubmitting ? "Booking..." : `Book & Pay $${selectedProvider?.session_rate}`}
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
