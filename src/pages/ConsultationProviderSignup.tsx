import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus } from "lucide-react";
import { z } from "zod";
import logo from "@/assets/logo.png";
import SEOHead from "@/components/SEOHead";

const providerSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  title: z.string().max(200).optional(),
  bio: z.string().min(20, "Bio must be at least 20 characters").max(2000),
  specialties: z.string().max(500),
  paypalEmail: z.string().email("Valid PayPal email is required"),
});

const ConsultationProviderSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [existingProvider, setExistingProvider] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    bio: "",
    specialties: "",
    paypalEmail: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please log in first", variant: "destructive" });
      navigate("/auth");
      return;
    }
    setUser(user);

    // Check if already registered as provider
    const { data } = await supabase
      .from("consultation_providers")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setExistingProvider(data);
      if (data.status === "approved") {
        navigate("/consultation-provider-dashboard");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      providerSchema.parse(formData);

      const specialtiesArray = formData.specialties
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      const { error } = await supabase.from("consultation_providers").insert({
        user_id: user.id,
        full_name: formData.fullName,
        title: formData.title || null,
        bio: formData.bio,
        specialties: specialtiesArray,
        paypal_email: formData.paypalEmail,
        session_rate: 150,
        session_duration_minutes: 60,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Your consultation provider application is under review. You'll be notified once approved.",
      });
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation Error", description: error.errors[0].message, variant: "destructive" });
      } else {
        console.error("Error submitting:", error);
        toast({ title: "Error", description: "Failed to submit application. Please try again.", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (existingProvider && existingProvider.status === "pending") {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Provider Application Pending | Sober Helpline" description="Your consultation provider application is under review." noIndex={true} />
        <div className="container mx-auto px-4 py-8 max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle>Application Under Review</CardTitle>
              <CardDescription>
                Your consultation provider application is currently being reviewed. You'll be notified once it's approved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} variant="outline">Back to Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Become a Consultation Provider | Sober Helpline"
        description="Join our network of consultation providers to offer video sessions to families affected by addiction."
        noIndex={true}
      />
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <img src={logo} alt="Sober Helpline" className="w-24 md:w-32 h-auto" />
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Become a Consultation Provider</CardTitle>
              <CardDescription>
                Join our network to provide one-on-one video consultations with families affected by addiction. Sessions are 60 minutes at $150 per session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Dr. Jane Smith"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Licensed Clinical Social Worker"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / Description *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Describe your background, experience, and approach to family consultation..."
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                  <Input
                    id="specialties"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    placeholder="Family Intervention, Addiction Counseling, Trauma"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paypalEmail">PayPal Email (for payouts) *</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    value={formData.paypalEmail}
                    onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                    placeholder="your-paypal@email.com"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This is the email where you'll receive PayPal payments after completed sessions.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-2">Session Details</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Session duration: 60 minutes</li>
                    <li>• Session rate: $150</li>
                    <li>• Meetings conducted via Zoom (auto-generated)</li>
                    <li>• Clients complete an intake questionnaire before booking</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConsultationProviderSignup;
