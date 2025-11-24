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

const insuranceProviders = [
  "Self Pay",
  "UnitedHealthcare",
  "Anthem/Blue Cross Blue Shield",
  "Aetna",
  "Cigna",
  "Humana",
  "Kaiser Permanente",
  "Centene",
  "Molina Healthcare",
  "WellCare",
  "Highmark",
  "Blue Cross",
  "Health Care Service Corporation (HCSC)",
  "CareSource",
  "Tricare",
  "Medicaid",
  "Blue Shield",
  "Magellan Health",
  "Beacon Health Options",
  "Optum",
  "Ambetter",
  "Oscar Health",
  "Bright Health",
  "Friday Health Plans",
  "Moda",
  "Pacific Source",
  "Other"
];

const providerFormSchema = z.object({
  category: z.string().min(1, "Please select a provider category"),
  providerName: z.string().min(2, "Provider name must be at least 2 characters").max(100),
  address: z.string().min(5, "Address is required").max(200),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Valid zip code is required (e.g., 12345 or 12345-6789)"),
  phoneNumber: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Valid phone number is required"),
  email: z.string().email("Valid email is required").max(255),
  website: z.string().url("Valid website URL is required").min(1, "Website is required"),
  lengthOfServices: z.string().min(1, "Length of services is required").max(100),
  detoxAvailable: z.boolean().default(false),
  descriptionOfServices: z.string().min(1, "Description of services is required").max(500, "Description must be less than 500 characters"),
  cost: z.string().min(1, "Cost information is required").max(100),
  insurancesAccepted: z.array(z.string()).min(1, "Please select at least one insurance provider"),
  otherInsurances: z.string().optional(),
  logo: z.instanceof(FileList).optional(),
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
      zipCode: "",
      phoneNumber: "",
      email: "",
      website: "",
      lengthOfServices: "",
      detoxAvailable: false,
      descriptionOfServices: "",
      cost: "",
      insurancesAccepted: [],
      otherInsurances: "",
    },
  });

  const onSubmit = async (data: ProviderFormValues) => {
    setIsSubmitting(true);
    try {
      // Combine selected insurances with custom "Other" insurances
      let finalInsurances = [...data.insurancesAccepted];
      
      // If "Other" is selected and there are custom insurances, add them
      if (data.insurancesAccepted.includes("Other") && data.otherInsurances) {
        const customInsurances = data.otherInsurances
          .split(',')
          .map(i => i.trim())
          .filter(i => i.length > 0);
        
        // Remove "Other" and add the custom insurances
        finalInsurances = finalInsurances.filter(i => i !== "Other");
        finalInsurances = [...finalInsurances, ...customInsurances];
      }

      let logoUrl = null;

      // Upload logo if provided
      if (data.logo && data.logo.length > 0) {
        const logoFile = data.logo[0];
        
        // Validate file type
        if (!['image/jpeg', 'image/png'].includes(logoFile.type)) {
          toast({
            title: "Invalid file type",
            description: "Logo must be a .jpg or .png file",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        // Generate unique filename
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('provider-logos')
          .upload(fileName, logoFile);

        if (uploadError) {
          throw new Error(`Logo upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('provider-logos')
          .getPublicUrl(fileName);
        
        logoUrl = publicUrl;
      }

      // Insert into database
      const { error } = await supabase
        .from('provider_submissions')
        .insert({
          category: data.category,
          provider_name: data.providerName,
          address: data.address,
          zip_code: data.zipCode,
          phone_number: data.phoneNumber,
          email: data.email,
          website: data.website,
          length_of_services: data.lengthOfServices,
          detox_available: data.detoxAvailable,
          description_of_services: data.descriptionOfServices,
          cost: data.cost,
          insurances_accepted: finalInsurances,
          logo_url: logoUrl,
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
                      <Textarea placeholder="Enter street address, city, and state" {...field} />
                    </FormControl>
                    <FormDescription>Enter address without zip code</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="12345 or 12345-6789" {...field} />
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
                    <FormLabel>Website *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
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
                      <Input placeholder="30, 60, 90 days, etc" {...field} />
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
                name="descriptionOfServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description of Services *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the services you provide..."
                        {...field}
                        rows={4}
                        maxLength={500}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500 characters
                    </FormDescription>
                    <FormMessage />
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
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Insurances Accepted *</FormLabel>
                      <FormDescription>
                        Select all insurance providers you accept
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded-lg p-4 bg-muted max-h-96 overflow-y-auto">
                      {insuranceProviders.map((insurance) => (
                        <FormField
                          key={insurance}
                          control={form.control}
                          name="insurancesAccepted"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={insurance}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(insurance)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, insurance])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== insurance
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {insurance}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("insurancesAccepted")?.includes("Other") && (
                <FormField
                  control={form.control}
                  name="otherInsurances"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Insurance Providers</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter insurance providers separated by commas (e.g., Provider A, Provider B, Provider C)"
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        List any insurance providers not shown above, separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="logo"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Provider Logo</FormLabel>
                    <FormControl>
                      <Input 
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload your logo (.jpg or .png files only)
                    </FormDescription>
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
