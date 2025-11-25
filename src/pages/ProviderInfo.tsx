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
import logo from "@/assets/logo.png";

// Resize image to fit within maxSize while maintaining aspect ratio
const resizeImage = (file: File, maxSize: number = 400): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.9
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const providerCategories = [
  "Inpatient Treatment",
  "Outpatient Treatment",
  "Interventionists",
  "Sober Coaches/Companions",
  "Sober Living",
  "Therapists",
  "Psychiatrists",
  "Attorneys",
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

const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

const providerFormSchema = z.object({
  category: z.string().min(1, "Please select a provider category"),
  providerName: z.string().min(2, "Provider name must be at least 2 characters").max(100),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(50),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Valid zip code is required (e.g., 12345 or 12345-6789)"),
  phoneNumber: z.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Valid phone number is required"),
  email: z.string().email("Valid email is required").max(255),
  website: z.string().optional(),
  yearStarted: z.string().regex(/^\d{4}$/, "Please enter a valid 4-digit year").refine((val) => {
    const year = parseInt(val);
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear;
  }, "Year must be between 1900 and current year"),
  interventionModalities: z.array(z.string()).optional(),
  otherInterventionModalities: z.string().optional(),
  hourlyCoachingSessions: z.boolean().optional(),
  hourlyCoachingRate: z.string().optional(),
  caseManagementServices: z.boolean().optional(),
  lengthOfServices: z.array(z.string()).min(1, "Please select at least one length of service"),
  detoxAvailable: z.boolean().default(false),
  coOccurringDiagnoses: z.array(z.string()).optional(),
  therapeuticModalities: z.array(z.string()).optional(),
  otherTherapeuticModalities: z.string().optional(),
  inPersonCompanionWork: z.boolean().optional(),
  hasValidPassport: z.boolean().optional(),
  dailyCompanionFee: z.string().optional(),
  genderSpecificTreatment: z.array(z.string()).optional(),
  lgbtSupportive: z.boolean().default(false),
  licenseCurrentGoodStanding: z.boolean().optional(),
  descriptionOfServices: z.string().min(1, "Description of services is required").max(500, "Description must be less than 500 characters"),
  cost: z.string().min(1, "Cost information is required").max(100),
  insurancesAccepted: z.array(z.string()),
  otherInsurances: z.string().optional(),
  logo: z.instanceof(FileList).optional(),
}).refine((data) => {
  // Insurance is optional for these categories
  const optionalInsuranceCategories = ["Interventionists", "Sober Coaches/Companions", "Sober Living", "Attorneys"];
  if (optionalInsuranceCategories.includes(data.category)) {
    return true;
  }
  // For other categories, require at least one insurance
  return data.insurancesAccepted.length > 0;
}, {
  message: "Please select at least one insurance provider",
  path: ["insurancesAccepted"],
}).refine((data) => {
  // Website is optional for these categories
  const optionalWebsiteCategories = ["Sober Coaches/Companions", "Therapists"];
  if (optionalWebsiteCategories.includes(data.category)) {
    return true;
  }
  // For other categories, require website
  return data.website && data.website.length > 0;
}, {
  message: "Website is required for this category",
  path: ["website"],
}).refine((data) => {
  // If website is provided, it must be a valid URL
  if (data.website && data.website.length > 0) {
    try {
      new URL(data.website);
      return true;
    } catch {
      return false;
    }
  }
  return true;
}, {
  message: "Please enter a valid website URL",
  path: ["website"],
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
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      email: "",
      website: "",
      yearStarted: "",
      interventionModalities: [],
      otherInterventionModalities: "",
      hourlyCoachingSessions: false,
      hourlyCoachingRate: "",
      caseManagementServices: false,
      lengthOfServices: [],
      detoxAvailable: false,
      coOccurringDiagnoses: [],
      therapeuticModalities: [],
      otherTherapeuticModalities: "",
      inPersonCompanionWork: false,
      hasValidPassport: false,
      dailyCompanionFee: "",
      genderSpecificTreatment: [],
      lgbtSupportive: false,
      licenseCurrentGoodStanding: false,
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

      // Combine selected therapeutic modalities with custom "Other" modalities
      let finalModalities = data.therapeuticModalities ? [...data.therapeuticModalities] : [];
      
      // If "Other" is selected and there are custom modalities, add them
      if (data.therapeuticModalities?.includes("Other") && data.otherTherapeuticModalities) {
        const customModalities = data.otherTherapeuticModalities
          .split(',')
          .map(m => m.trim())
          .filter(m => m.length > 0);
        
        // Remove "Other" and add the custom modalities
        finalModalities = finalModalities.filter(m => m !== "Other");
        finalModalities = [...finalModalities, ...customModalities];
      }

      // Combine selected intervention modalities with custom "Other" modalities
      let finalInterventionModalities = data.interventionModalities ? [...data.interventionModalities] : [];
      
      // If "Other" is selected and there are custom intervention modalities, add them
      if (data.interventionModalities?.includes("Other") && data.otherInterventionModalities) {
        const customInterventionModalities = data.otherInterventionModalities
          .split(',')
          .map(m => m.trim())
          .filter(m => m.length > 0);
        
        // Remove "Other" and add the custom intervention modalities
        finalInterventionModalities = finalInterventionModalities.filter(m => m !== "Other");
        finalInterventionModalities = [...finalInterventionModalities, ...customInterventionModalities];
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

        // Resize image to 400x400 max (suitable for 2" at 2x DPI)
        const resizedBlob = await resizeImage(logoFile, 400);

        // Generate unique filename
        const fileExt = 'jpg'; // Always save as jpg after resize
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('provider-logos')
          .upload(fileName, resizedBlob);

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
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          phone_number: data.phoneNumber,
          email: data.email,
          website: data.website,
          year_started: data.yearStarted ? parseInt(data.yearStarted) : null,
          intervention_modalities: finalInterventionModalities.length > 0 ? finalInterventionModalities : null,
          hourly_coaching_sessions: data.hourlyCoachingSessions || null,
          hourly_coaching_rate: data.hourlyCoachingRate || null,
          case_management_services: data.caseManagementServices || null,
          length_of_services: data.lengthOfServices && data.lengthOfServices.length > 0 ? data.lengthOfServices.join(", ") : null,
          detox_available: data.detoxAvailable,
          co_occurring_diagnoses: data.coOccurringDiagnoses || null,
          therapeutic_modalities: finalModalities.length > 0 ? finalModalities : null,
          in_person_companion_work: data.inPersonCompanionWork || null,
          has_valid_passport: data.hasValidPassport || null,
          daily_companion_fee: data.dailyCompanionFee || null,
          gender_specific_treatment: data.genderSpecificTreatment || null,
          lgbt_supportive: data.lgbtSupportive,
          license_current_good_standing: data.licenseCurrentGoodStanding || null,
          description_of_services: data.descriptionOfServices,
          cost: data.cost,
          insurances_accepted: finalInsurances,
          logo_url: logoUrl,
          address: null,
          status: 'pending'
        });

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('send-provider-notification', {
          body: {
            providerName: data.providerName,
            category: data.category,
            email: data.email,
            phoneNumber: data.phoneNumber,
          }
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the submission if email fails
      }

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
          <div className="mb-8 text-center">
            <img src={logo} alt="Sober Helpline" className="mx-auto mb-6 w-48 h-48 object-contain" />
            <h1 className="text-4xl font-bold text-foreground mb-2">Provider Application</h1>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover z-50 max-h-60">
                          {usStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                    <FormLabel>
                      Website
                      {!["Sober Coaches/Companions", "Therapists"].includes(form.watch("category")) && " *"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearStarted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What year did you begin providing services? *</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="YYYY" 
                        maxLength={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("category") === "Interventionists" && (
                <FormField
                  control={form.control}
                  name="interventionModalities"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Are you trained in any of the following intervention modalities?</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 bg-muted">
                        {["ARISE", "Family Systems", "Johnson Model", "Motivational Interviewing", "Invitational Intervention", "Other"].map((modality) => (
                          <FormField
                            key={modality}
                            control={form.control}
                            name="interventionModalities"
                            render={({ field }) => {
                              const value = field.value || [];
                              return (
                                <FormItem
                                  key={modality}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={value.includes(modality)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...value, modality])
                                          : field.onChange(
                                              value.filter(
                                                (val) => val !== modality
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {modality}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      {form.watch("interventionModalities")?.includes("Other") && (
                        <FormField
                          control={form.control}
                          name="otherInterventionModalities"
                          render={({ field }) => (
                            <FormItem className="mt-3">
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter other intervention modalities, separated by commas"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                List any additional intervention modalities you have been trained in, separated by commas
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!["Interventionists", "Attorneys", "Sober Coaches/Companions", "Psychiatrists"].includes(form.watch("category")) && (
                <FormField
                  control={form.control}
                  name="lengthOfServices"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Length of Services *</FormLabel>
                      </div>
                      <div className="flex flex-col space-y-3 border rounded-lg p-4 bg-muted">
                        {["30 days", "60 days", "90 days", "More than 90 days"].map((length) => (
                          <FormField
                            key={length}
                            control={form.control}
                            name="lengthOfServices"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={length}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(length)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), length])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== length
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {length}
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
              )}

              {!["Interventionists", "Attorneys", "Sober Coaches/Companions", "Psychiatrists"].includes(form.watch("category")) && (
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
              )}

              {(form.watch("category") === "Inpatient Treatment" ||
                form.watch("category") === "Outpatient Treatment" || 
                form.watch("category") === "Therapists" ||
                form.watch("category") === "Psychiatrists") && (
                <FormField
                  control={form.control}
                  name="coOccurringDiagnoses"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Coocurring Diagnoses: Are you able to treat any of the following diagnoses?</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 bg-muted">
                        {["ADHD", "Antisocial Personality Disorder", "Anxiety Disorders", "Bipolar Disorder", "Borderline Personality Disorder", "Depression", "Eating Disorders", "Narcissistic Personality Disorder", "OCD", "Schizoaffective Disorder", "Schizophrenia", "Trauma"].map((diagnosis) => (
                          <FormField
                            key={diagnosis}
                            control={form.control}
                            name="coOccurringDiagnoses"
                            render={({ field }) => {
                              const value = field.value || [];
                              return (
                                <FormItem
                                  key={diagnosis}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={value.includes(diagnosis)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...value, diagnosis])
                                          : field.onChange(
                                              value.filter(
                                                (val) => val !== diagnosis
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {diagnosis}
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
              )}

              {(form.watch("category") === "Inpatient Treatment" ||
                form.watch("category") === "Outpatient Treatment" || 
                form.watch("category") === "Therapists") && (
                <FormField
                  control={form.control}
                  name="therapeuticModalities"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Do you offer any of the following therapeutic modalities?</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 bg-muted">
                        {["CBT (Cognitive Behavioral Therapy)", "DBT (Dialectical Behavior Therapy)", "EMDR", "Equine Therapy", "Family Therapy", "Group Therapy", "IFS (Internal Family Systems)", "Individual Therapy", "Mindfulness Based Therapy", "Motivational Interviewing", "Psychodynamic Therapy", "Somatic and Experiential Therapy", "Other"].map((modality) => (
                          <FormField
                            key={modality}
                            control={form.control}
                            name="therapeuticModalities"
                            render={({ field }) => {
                              const value = field.value || [];
                              return (
                                <FormItem
                                  key={modality}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={value.includes(modality)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...value, modality])
                                          : field.onChange(
                                              value.filter(
                                                (val) => val !== modality
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {modality}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      {form.watch("therapeuticModalities")?.includes("Other") && (
                        <FormField
                          control={form.control}
                          name="otherTherapeuticModalities"
                          render={({ field }) => (
                            <FormItem className="mt-3">
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Enter other modalities, separated by commas"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                List any additional therapeutic modalities you offer, separated by commas
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Coaches/Companions" && (
                <>
                  <FormField
                    control={form.control}
                    name="inPersonCompanionWork"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Do you do in person sober companion work?</FormLabel>
                          <FormDescription>Check if you provide in-person sober companion services</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("inPersonCompanionWork") && (
                    <>
                      <FormField
                        control={form.control}
                        name="hasValidPassport"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Do you have a valid passport?</FormLabel>
                              <FormDescription>Confirm you have a valid passport for international companion work</FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dailyCompanionFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What is your daily fee for in person companion work?</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input 
                                  type="text" 
                                  placeholder="Enter daily fee" 
                                  className="pl-7"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    field.onChange(value);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>Enter your daily rate for in-person companion services</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </>
              )}

              {!["Interventionists", "Attorneys", "Sober Coaches/Companions", "Psychiatrists"].includes(form.watch("category")) && (
                <FormField
                  control={form.control}
                  name="genderSpecificTreatment"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Do you offer gender specific treatment or care?</FormLabel>
                      </div>
                      <div className="flex flex-col space-y-3 border rounded-lg p-4 bg-muted">
                        {["Men", "Women"].map((gender) => (
                          <FormField
                            key={gender}
                            control={form.control}
                            name="genderSpecificTreatment"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={gender}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(gender)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, gender])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== gender
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {gender}
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
              )}

              {!["Interventionists", "Attorneys", "Sober Coaches/Companions"].includes(form.watch("category")) && (
                <FormField
                  control={form.control}
                  name="lgbtSupportive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>LGBT supportive treatment or care?</FormLabel>
                        <FormDescription>Check if your facility offers LGBT supportive treatment or care</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {(form.watch("category") === "Therapists" ||
                form.watch("category") === "Psychiatrists" || 
                form.watch("category") === "Attorneys") && (
                <FormField
                  control={form.control}
                  name="licenseCurrentGoodStanding"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is your license current and in good standing? *</FormLabel>
                        <FormDescription>Confirm that your professional license is active and in good standing</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Interventionists" && (
                <FormField
                  control={form.control}
                  name="hourlyCoachingSessions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you provide hourly family coaching sessions separate from intervention services?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Interventionists" && form.watch("hourlyCoachingSessions") && (
                <FormField
                  control={form.control}
                  name="hourlyCoachingRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input 
                            type="number" 
                            placeholder="Enter hourly rate" 
                            className="pl-7"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Interventionists" && (
                <FormField
                  control={form.control}
                  name="caseManagementServices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you provide case management services?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}

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
                    <FormLabel>
                      {form.watch("category") === "Interventionists"
                        ? "Cost of Services *"
                        : ["Sober Coaches/Companions", "Therapists", "Psychiatrists", "Attorneys"].includes(form.watch("category"))
                        ? "Cost per session/meeting *"
                        : "Private Pay Rate (without insurance) *"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          placeholder={form.watch("category") === "Interventionists" ? "cost per intervention" : "cost per month"}
                          className="pl-7"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Provide cost range or pricing structure</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!["Interventionists", "Attorneys", "Sober Coaches/Companions", "Sober Living"].includes(form.watch("category")) && (
                <FormField
                  control={form.control}
                  name="insurancesAccepted"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">
                          Insurances Accepted
                          {!["Interventionists", "Sober Coaches/Companions", "Sober Living", "Attorneys"].includes(form.watch("category")) && " *"}
                        </FormLabel>
                        <FormDescription>
                          Select all insurance providers you accept
                          {["Interventionists", "Sober Coaches/Companions", "Sober Living", "Attorneys"].includes(form.watch("category")) && " (optional)"}
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
              )}

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
                    <FormLabel>
                      {["Interventionists", "Sober Coaches/Companions", "Therapists", "Psychiatrists", "Attorneys"].includes(form.watch("category"))
                        ? "Provider Logo or Photo"
                        : "Provider Logo"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload your logo (.jpg or .png files only). Images will be automatically resized to fit within 2" square.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted p-4 rounded-md border border-border">
                <p className="text-sm text-muted-foreground">
                  Upon approval you will be sent an invoice to the email provided in the application for the recurring monthly or annual fee. If you wish to use a different email please contact{" "}
                  <a href="mailto:matt@soberhelpline.com" className="text-primary hover:underline">
                    matt@soberhelpline.com
                  </a>{" "}
                  or call{" "}
                  <a href="tel:5038362136" className="text-primary hover:underline">
                    503-836-2136
                  </a>.
                </p>
              </div>

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
