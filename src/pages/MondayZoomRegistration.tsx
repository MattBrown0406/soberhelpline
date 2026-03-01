import { Link, useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, Video, Users, Clock, Calendar, Loader2, CheckCircle2, Monitor, BookOpen, MessagesSquare, Star, Shield, GraduationCap, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/logo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { z } from "zod";

const registrationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z.string().trim().max(20).optional().default(""),
  question: z.string().trim().max(1000).optional().default(""),
});

function MembershipPromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-logo-green/10 via-primary/5 to-amber-500/10 border-2 border-logo-green/30 p-6 md:p-8 mb-8">
      <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-logo-green/10 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Premium Membership</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          Get Even More Support for Your Family
        </h3>
        <p className="text-muted-foreground mb-5 max-w-xl">
          The Monday Zoom is just the beginning. Members get access to our full suite of family recovery tools:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { icon: GraduationCap, label: "60+ Education Guides & Worksheets", desc: "Evidence-based family recovery curriculum" },
            { icon: MessageCircle, label: "Private Family Forum", desc: "Connect with families who understand" },
            { icon: Video, label: "Recorded Webinars & Workshops", desc: "Learn at your own pace" },
            { icon: Shield, label: "AI-Powered Recovery Tools", desc: "Boundary builder, enabling coach & more" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3 bg-background/60 rounded-lg p-3 border border-border/50">
              <div className="w-8 h-8 rounded-full bg-logo-green/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-logo-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Link to="/family-membership">
          <Button size="lg" className="gap-2 bg-logo-green hover:bg-logo-green/90 text-white shadow-lg shadow-logo-green/25">
            Explore Membership — Starting at $14.99/mo
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function MondayZoomRegistration() {
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [meetingInfo, setMeetingInfo] = useState<{ meetingId: string; passcode: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    question: "",
    requestFollowUp: false,
    consentEmailList: false,
    preferredContactDate: "",
    preferredContactTime: "",
    preferredTimezone: "America/Los_Angeles",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Pre-fill email from user profile
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email || "" }));
    }
  }, [user]);

  // Fetch Monday meeting info when submitted
  useEffect(() => {
    if (!submitted) return;
    const fetchMeetingInfo = async () => {
      const { data: meetingIdSetting } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "monday_zoom_meeting_id")
        .maybeSingle();
      const { data: passcodeSetting } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "monday_zoom_passcode")
        .maybeSingle();
      if (meetingIdSetting?.value) {
        setMeetingInfo({
          meetingId: meetingIdSetting.value,
          passcode: passcodeSetting?.value || "",
        });
      }
    };
    fetchMeetingInfo();
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registrationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Calculate next Monday date
    const now = new Date();
    const day = now.getDay();
    const daysUntilMonday = day <= 1 ? 1 - day : 8 - day;
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    const meetingDate = nextMonday.toISOString().split("T")[0];

    try {
      // Save registration (user_id is optional now)
      const { error } = await supabase.from("zoom_meeting_registrations").insert({
        user_id: user?.id || null,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        question: formData.question.trim(),
        request_follow_up: formData.requestFollowUp,
        consent_email_list: formData.consentEmailList,
        meeting_date: meetingDate,
        preferred_contact_date: formData.requestFollowUp ? formData.preferredContactDate || null : null,
        preferred_contact_time: formData.requestFollowUp ? formData.preferredContactTime || null : null,
        preferred_timezone: formData.requestFollowUp ? formData.preferredTimezone : null,
      });

      if (error) throw error;

      // Send confirmation email
      try {
        await supabase.functions.invoke("send-zoom-registration-email", {
          body: {
            name: formData.name.trim(),
            email: formData.email.trim(),
          },
        });
      } catch (emailErr) {
        console.error("Email sending failed (registration still saved):", emailErr);
      }

      // Add to Mailchimp if consent given
      if (formData.consentEmailList) {
        try {
          const nameParts = formData.name.trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          await supabase.functions.invoke("add-to-mailchimp", {
            body: { email: formData.email.trim(), firstName, lastName },
          });
        } catch (mcErr) {
          console.error("Mailchimp add failed (registration still saved):", mcErr);
        }
      }

      setSubmitted(true);
      toast({
        title: "Registration Submitted!",
        description: "You're registered! Check your email for the Zoom meeting link.",
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container py-16 max-w-2xl mx-auto text-center">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">You're Registered!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Thank you for registering for the Monday night family support Zoom meeting. 
          When it's time, join directly from this page — no need to leave the site.
        </p>

        {meetingInfo ? (
          <div className="space-y-4">
            <Link to={`/join-meeting?mn=${meetingInfo.meetingId}&pwd=${encodeURIComponent(meetingInfo.passcode)}`}>
              <Button size="lg" className="gap-2">
                <Monitor className="h-5 w-5" />
                Join Monday Night Meeting
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              The meeting is every Monday at 7:00 PM PST. You can join up to 30 minutes early.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You'll receive the meeting details via email before the meeting.
          </p>
        )}

        <div className="mt-10">
          <MembershipPromoBanner />
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Monday Night Family Support Zoom Meeting | Sober Helpline"
        description="Register for our free Monday night family support Zoom meeting. Connect with other families, ask questions, and get guidance from experienced professionals."
      />

      <div className="min-h-screen bg-background">
        <main className="container py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 group">
                <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
                Back
              </Link>
            </div>

            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary p-8 md:p-12 mb-8 text-foreground shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.4),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--accent)/0.3),transparent_50%)]" />
              <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute -top-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/25 backdrop-blur-sm mb-5 ring-2 ring-white/40 shadow-lg shadow-black/10">
                  <Video className="h-8 w-8 drop-shadow" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight drop-shadow-md">
                  FREE Monday Night<br />Family Support Zoom Meeting
                </h1>
                <p className="text-foreground/80 text-lg max-w-xl mx-auto mb-6 leading-relaxed">
                  Join other families navigating addiction for a supportive, guided group session every Monday night. No membership required.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { icon: Calendar, label: "Every Monday" },
                    { icon: Clock, label: "7:00 PM PST" },
                    { icon: Users, label: "Open to Everyone" },
                    { icon: Video, label: "Via Zoom" },
                  ].map(({ icon: Icon, label }) => (
                    <span key={label} className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">
                      <Icon className="h-4 w-4" /> {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Membership Promo Banner */}
            <MembershipPromoBanner />

            {/* Registration Form */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-muted/30 rounded-t-lg border-b border-border/50">
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Register for the Meeting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question">Your Question for the Group (Optional)</Label>
                    <p className="text-sm text-muted-foreground">
                      Please write out a complete question you'd like discussed during the meeting—not just a topic or keyword. 
                      For example, instead of "boundaries," write something like: "How do I set a boundary with my son about 
                      not lending him money without damaging our relationship?"
                    </p>
                    <Textarea
                      id="question"
                      placeholder="Write your full question here..."
                      rows={4}
                      value={formData.question}
                      onChange={(e) => setFormData((p) => ({ ...p, question: e.target.value }))}
                      className={errors.question ? "border-destructive" : ""}
                    />
                    {errors.question && <p className="text-sm text-destructive">{errors.question}</p>}
                  </div>

                   <div className="space-y-4 pt-2">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="followUp"
                        checked={formData.requestFollowUp}
                        onCheckedChange={(checked) =>
                          setFormData((p) => ({ ...p, requestFollowUp: checked === true }))
                        }
                      />
                      <Label htmlFor="followUp" className="text-sm leading-snug cursor-pointer">
                        I'd like to request a follow-up contact from an interventionist to discuss my situation privately.
                      </Label>
                    </div>

                    {formData.requestFollowUp && (
                      <div className="ml-6 space-y-4 p-4 rounded-lg border border-border bg-muted/30">
                        <p className="text-sm text-muted-foreground font-medium">When is the best time to reach you?</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contactDate">Preferred Date</Label>
                            <Input
                              id="contactDate"
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              value={formData.preferredContactDate}
                              onChange={(e) => setFormData((p) => ({ ...p, preferredContactDate: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactTime">Preferred Time</Label>
                            <Input
                              id="contactTime"
                              type="time"
                              value={formData.preferredContactTime}
                              onChange={(e) => setFormData((p) => ({ ...p, preferredContactTime: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Your Timezone</Label>
                          <select
                            id="timezone"
                            value={formData.preferredTimezone}
                            onChange={(e) => setFormData((p) => ({ ...p, preferredTimezone: e.target.value }))}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="America/New_York">Eastern (ET)</option>
                            <option value="America/Chicago">Central (CT)</option>
                            <option value="America/Denver">Mountain (MT)</option>
                            <option value="America/Los_Angeles">Pacific (PT)</option>
                            <option value="America/Anchorage">Alaska (AKT)</option>
                            <option value="Pacific/Honolulu">Hawaii (HT)</option>
                            <option value="America/Phoenix">Arizona (MST - no DST)</option>
                            <option value="America/Halifax">Atlantic (AT)</option>
                            <option value="America/St_Johns">Newfoundland (NT)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="emailConsent"
                        checked={formData.consentEmailList}
                        onCheckedChange={(checked) =>
                          setFormData((p) => ({ ...p, consentEmailList: checked === true }))
                        }
                      />
                      <Label htmlFor="emailConsent" className="text-sm leading-snug cursor-pointer">
                        I consent to being added to the email list for updates on special events, resources, or services.
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Register for Monday Night Meeting"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
