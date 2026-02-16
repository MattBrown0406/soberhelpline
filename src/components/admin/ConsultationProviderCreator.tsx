import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UserPlus, Upload, X } from "lucide-react";
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
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [headshotPreview, setHeadshotPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    title: "",
    bio: "",
    specialties: "",
    paypalEmail: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setHeadshotFile(file);
    setHeadshotPreview(URL.createObjectURL(file));
  };

  const removeHeadshot = () => {
    setHeadshotFile(null);
    setHeadshotPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadHeadshot = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `consultation-providers/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("provider-logos")
      .upload(fileName, file, { contentType: file.type });
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    const { data } = supabase.storage.from("provider-logos").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      providerSchema.parse(formData);

      let photoUrl: string | null = null;
      if (headshotFile) {
        photoUrl = await uploadHeadshot(headshotFile);
        if (!photoUrl) {
          toast.error("Failed to upload headshot. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      const specialtiesArray = formData.specialties
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      // Admin creates the provider directly as active
      const { error } = await supabase.from("consultation_providers").insert({
        user_id: "00000000-0000-0000-0000-000000000000",
        full_name: formData.fullName,
        title: formData.title || null,
        bio: formData.bio,
        specialties: specialtiesArray,
        paypal_email: formData.paypalEmail,
        photo_url: photoUrl,
        session_rate: 150,
        session_duration_minutes: 60,
        status: "active",
      });

      if (error) throw error;

      toast.success("Consultation provider created and activated!");
      setFormData({
        fullName: "",
        email: "",
        title: "",
        bio: "",
        specialties: "",
        paypalEmail: "",
      });
      removeHeadshot();
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
        <div className="space-y-2">
          <Label>Provider Headshot</Label>
          <div className="flex items-center gap-4">
            {headshotPreview ? (
              <div className="relative">
                <img
                  src={headshotPreview}
                  alt="Headshot preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                />
                <button
                  type="button"
                  onClick={removeHeadshot}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground mt-1">Upload</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {!headshotPreview && (
              <p className="text-xs text-muted-foreground">
                JPG, PNG up to 5MB. Will be displayed as a circle.
              </p>
            )}
          </div>
        </div>

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
