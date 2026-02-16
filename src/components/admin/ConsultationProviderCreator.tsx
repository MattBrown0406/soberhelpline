import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { z } from "zod";

const providerSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  email: z.string().email("Valid email for the provider account is required"),
  title: z.string().max(200).optional(),
  bio: z.string().min(20, "Bio must be at least 20 characters").max(2000),
  specialties: z.string().max(500),
  paypalEmail: z.string().email("Valid PayPal email is required"),
});

const ConsultationProviderCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    title: "",
    bio: "",
    specialties: "",
    paypalEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      providerSchema.parse(formData);

      const specialtiesArray = formData.specialties
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      // Admin creates the provider directly as approved
      // We'll look up the user by email, or create without user_id for now
      // The provider will be linked when they log in
      const { error } = await supabase.from("consultation_providers").insert({
        user_id: "00000000-0000-0000-0000-000000000000", // placeholder, admin will update
        full_name: formData.fullName,
        title: formData.title || null,
        bio: formData.bio,
        specialties: specialtiesArray,
        paypal_email: formData.paypalEmail,
        session_rate: 150,
        session_duration_minutes: 60,
        status: "approved",
      });

      if (error) throw error;

      toast.success("Consultation provider created and approved!");
      setFormData({
        fullName: "",
        email: "",
        title: "",
        bio: "",
        specialties: "",
        paypalEmail: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error("Error creating provider:", error);
        toast.error("Failed to create provider. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Add New Consultation Provider</h3>
          <p className="text-sm text-muted-foreground">
            Create a provider profile. Sessions are 60 minutes at $150.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cp-fullName">Full Name *</Label>
            <Input
              id="cp-fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Dr. Jane Smith"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-title">Professional Title</Label>
            <Input
              id="cp-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Licensed Clinical Social Worker"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cp-email">Provider Account Email *</Label>
          <Input
            id="cp-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="provider@email.com"
            required
          />
          <p className="text-xs text-muted-foreground">
            The email the provider uses to log in. Used to link their account.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cp-bio">Bio / Description *</Label>
          <Textarea
            id="cp-bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Describe their background, experience, and approach..."
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cp-specialties">Specialties (comma-separated)</Label>
          <Input
            id="cp-specialties"
            value={formData.specialties}
            onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
            placeholder="Family Intervention, Addiction Counseling, Trauma"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cp-paypalEmail">PayPal Email (for payouts) *</Label>
          <Input
            id="cp-paypalEmail"
            type="email"
            value={formData.paypalEmail}
            onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
            placeholder="provider-paypal@email.com"
            required
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Provider"}
        </Button>
      </form>
    </div>
  );
};

export default ConsultationProviderCreator;
