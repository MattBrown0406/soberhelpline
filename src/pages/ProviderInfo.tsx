import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const providerCategories = [
  "Inpatient Treatment",
  "Outpatient Treatment",
  "Interventionists",
  "Sober Living",
  "Therapists",
  "Psychiatrists",
  "Attorneys",
  "Recovery Fellowships",
];

const providerFormSchema = z.object({
  category: z.string().min(1, "Please select a provider category"),
  providerName: z.string().min(2, "Provider name must be at least 2 characters").max(100),
  address: z.string().min(5, "Address is required").max(200),
  phoneNumber: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Valid phone number is required"),
  email: z.string().email("Valid email is required").max(255),
  website: z.string().url("Valid website URL is required").or(z.literal("")),
  lengthOfServices: z.string().min(1, "Length of services is required").max(100),
  detoxAvailable: z.boolean().default(false),
  cost: z.string().min(1, "Cost information is required").max(100),
  insurancesAccepted: z.string().min(1, "Insurance information is required").max(500),
});

type ProviderFormValues = z.infer<typeof providerFormSchema>;

const ProviderInfo = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      category: "",
      providerName: "",
      address: "",
      phoneNumber: "",
      email: "",
      website: "",
      lengthOfServices: "",
      detoxAvailable: false,
      cost: "",
      insurancesAccepted: "",
    },
  });

  const onSubmit = async (data: ProviderFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert insurances from string to array
      const insurancesArray = data.insurancesAccepted
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      // Insert into database
      const { error } = await supabase
        .from('provider_submissions')
        .insert({
          category: data.category,
          provider_name: data.providerName,
          address: data.address,
          phone_number: data.phoneNumber,
          email: data.email,
          website: data.website || null,
          length_of_services: data.lengthOfServices,
          detox_available: data.detoxAvailable,
          cost: data.cost,
          insurances_accepted: insurancesArray,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Your provider information has been received and is pending review.",
      });
      form.reset();
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <a href="tel:5412415886" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Phone className="w-5 h-5" />
            <span className="font-medium">(541) 241-5886</span>
          </a>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Provider Information</h1>
            <p className="text-lg text-muted-foreground">
              Submit your information to be listed on Sober Helpline. All providers are carefully vetted to ensure they meet our rigorous ethical standards.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg shadow-lg">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a provider category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover z-50">
                        {providerCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the category that best describes your services
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="providerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter provider name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter full address including city, state, and zip code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 555-5555" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="provider@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>Optional - Your organization's website URL</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lengthOfServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length of Services *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 30 days, 90 days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detoxAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Detox Available?</FormLabel>
                      <FormDescription>Check if your facility offers detox services</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $5,000 - $10,000 per month" {...field} />
                    </FormControl>
                    <FormDescription>Provide cost range or pricing structure</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="insurancesAccepted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurances Accepted *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List all insurance providers accepted (e.g., Aetna, BlueCross BlueShield, UnitedHealthcare, or 'Self-pay only')"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Provider Information"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProviderInfo;
