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
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import logo from "@/assets/logo.png";
import { SubscriptionCheckout } from "@/components/SubscriptionCheckout";

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
  "Medical Detox",
  "Interventionists",
  "Sober Coaches/Companions",
  "Sober Living",
  "Therapists",
  "Psychiatrists",
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
  cipCertified: z.boolean().optional(),
  hourlyCoachingSessions: z.boolean().optional(),
  hourlyCoachingRate: z.string().optional(),
  caseManagementServices: z.boolean().optional(),
  lengthOfServices: z.array(z.string()).optional(),
  detoxAvailable: z.boolean().default(false),
  detoxOnlyServices: z.boolean().optional(),
  coOccurringDiagnoses: z.array(z.string()).optional(),
  therapeuticModalities: z.array(z.string()).optional(),
  otherTherapeuticModalities: z.string().optional(),
  inPersonCompanionWork: z.boolean().optional(),
  hasValidPassport: z.boolean().optional(),
  dailyCompanionFee: z.string().optional(),
  worksNationally: z.boolean().optional(),
  worksInternationally: z.boolean().optional(),
  languagesSpoken: z.array(z.string()).optional(),
  otherLanguages: z.string().optional(),
  awakeStaff247: z.boolean().optional(),
  residentsExpectedToWork: z.boolean().optional(),
  jobAssistanceProvided: z.boolean().optional(),
  medicationAdministration: z.string().optional(),
  acceptsMatResidents: z.boolean().optional(),
  minimumTimeSinceLastUse: z.string().optional(),
  requiredMeetingsPerWeek: z.string().optional(),
  mandatoryCurfew: z.boolean().optional(),
  curfewTime: z.string().optional(),
  choresRequired: z.boolean().optional(),
  mandatoryHouseMeetings: z.boolean().optional(),
  houseMeetingsPerWeek: z.string().optional(),
  genderSpecificTreatment: z.array(z.string()).optional(),
  lgbtSupportive: z.boolean().default(false),
  substanceUseDisorderExperience: z.boolean().optional(),
  telehealthAvailable: z.boolean().optional(),
  licenseCurrentGoodStanding: z.boolean().optional(),
  legalAssistanceTypes: z.array(z.string()).optional(),
  recoveryFellowships: z.array(z.string()).optional(),
  descriptionOfServices: z.string().min(1, "Description of services is required").max(750, "Description must be less than 750 characters"),
  cost: z.string().min(1, "Cost information is required").max(100),
  travelExpensesIncluded: z.boolean().optional(),
  itemsIncludedInCost: z.array(z.string()).optional(),
  insurancesAccepted: z.array(z.string()),
  otherInsurances: z.string().optional(),
  logo: z.instanceof(FileList).optional(),
  youtubeUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
}).refine((data) => {
  // Length of services is required for categories that show this field
  const excludedCategories = ["Interventionists", "Attorneys", "Sober Coaches/Companions", "Psychiatrists", "Medical Detox"];
  if (!excludedCategories.includes(data.category)) {
    return data.lengthOfServices && data.lengthOfServices.length > 0;
  }
  return true;
}, {
  message: "Please select at least one length of service",
  path: ["lengthOfServices"],
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
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submittedCategory, setSubmittedCategory] = useState<string>('');

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a provider application.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, isLoading, navigate, toast]);
  
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
      cipCertified: false,
      hourlyCoachingSessions: false,
      hourlyCoachingRate: "",
      caseManagementServices: false,
      lengthOfServices: [],
      detoxAvailable: false,
      detoxOnlyServices: false,
      coOccurringDiagnoses: [],
      therapeuticModalities: [],
      otherTherapeuticModalities: "",
      inPersonCompanionWork: false,
      hasValidPassport: false,
      dailyCompanionFee: "",
      worksNationally: false,
      worksInternationally: false,
      languagesSpoken: [],
      otherLanguages: "",
      awakeStaff247: false,
      residentsExpectedToWork: false,
      jobAssistanceProvided: false,
      medicationAdministration: "",
      acceptsMatResidents: false,
      minimumTimeSinceLastUse: "",
      requiredMeetingsPerWeek: "",
      mandatoryCurfew: false,
      curfewTime: "",
      choresRequired: false,
      mandatoryHouseMeetings: false,
      houseMeetingsPerWeek: "",
      genderSpecificTreatment: [],
      lgbtSupportive: false,
      substanceUseDisorderExperience: false,
      telehealthAvailable: false,
      licenseCurrentGoodStanding: false,
      legalAssistanceTypes: [],
      recoveryFellowships: [],
      descriptionOfServices: "",
      cost: "",
      travelExpensesIncluded: false,
      itemsIncludedInCost: [],
      insurancesAccepted: [],
      otherInsurances: "",
      youtubeUrl: "",
      tiktokUrl: "",
      instagramUrl: "",
      facebookUrl: "",
    },
  });

  const onSubmit = async (data: ProviderFormValues) => {
    // Get the current session first
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    let authenticatedUserId: string | null = null;
    
    if (sessionData?.session?.user) {
      authenticatedUserId = sessionData.session.user.id;
    } else {
      // Try to refresh the session if getSession didn't return one
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshData?.session?.user) {
        authenticatedUserId = refreshData.session.user.id;
      }
    }
    
    if (!authenticatedUserId) {
      toast({
        title: "Authentication required",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Double-check with getUser to ensure token is valid
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !currentUser || currentUser.id !== authenticatedUserId) {
      toast({
        title: "Authentication required",
        description: "Unable to verify your identity. Please log in again.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

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
      const { data: insertedData, error } = await supabase
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
          cip_certified: data.cipCertified || null,
          hourly_coaching_sessions: data.hourlyCoachingSessions || null,
          hourly_coaching_rate: data.hourlyCoachingRate || null,
          case_management_services: data.caseManagementServices || null,
          length_of_services: data.lengthOfServices && data.lengthOfServices.length > 0 ? data.lengthOfServices.join(", ") : null,
          detox_available: data.detoxAvailable,
          detox_only_services: data.detoxOnlyServices || null,
          co_occurring_diagnoses: data.coOccurringDiagnoses || null,
          therapeutic_modalities: finalModalities.length > 0 ? finalModalities : null,
          in_person_companion_work: data.inPersonCompanionWork || null,
          has_valid_passport: data.hasValidPassport || null,
          daily_companion_fee: data.dailyCompanionFee || null,
          works_nationally: data.worksNationally || null,
          works_internationally: data.worksInternationally || null,
          languages_spoken: (() => {
            let languages = data.languagesSpoken ? [...data.languagesSpoken] : [];
            if (data.languagesSpoken?.includes("Other") && data.otherLanguages) {
              const customLanguages = data.otherLanguages.split(',').map(l => l.trim()).filter(l => l.length > 0);
              languages = languages.filter(l => l !== "Other");
              languages = [...languages, ...customLanguages];
            }
            return languages.length > 0 ? languages : null;
          })(),
          awake_staff_24_7: data.awakeStaff247 || null,
          residents_expected_to_work: data.residentsExpectedToWork || null,
          job_assistance_provided: data.jobAssistanceProvided || null,
          medication_administration: data.medicationAdministration || null,
          accepts_mat_residents: data.acceptsMatResidents || null,
          minimum_time_since_last_use: data.minimumTimeSinceLastUse || null,
          required_meetings_per_week: data.requiredMeetingsPerWeek || null,
          mandatory_curfew: data.mandatoryCurfew || null,
          curfew_time: data.curfewTime || null,
          chores_required: data.choresRequired || null,
          mandatory_house_meetings: data.mandatoryHouseMeetings || null,
          house_meetings_per_week: data.houseMeetingsPerWeek ? parseInt(data.houseMeetingsPerWeek) : null,
          gender_specific_treatment: data.genderSpecificTreatment || null,
          lgbt_supportive: data.lgbtSupportive,
          substance_use_disorder_experience: data.substanceUseDisorderExperience || null,
          telehealth_available: data.telehealthAvailable || null,
          license_current_good_standing: data.licenseCurrentGoodStanding || null,
          legal_assistance_types: data.legalAssistanceTypes || null,
          recovery_fellowships: data.recoveryFellowships && data.recoveryFellowships.length > 0 ? data.recoveryFellowships : null,
          description_of_services: data.descriptionOfServices,
          cost: data.cost,
          travel_expenses_included: data.travelExpensesIncluded || null,
          items_included_in_cost: data.itemsIncludedInCost || null,
          insurances_accepted: finalInsurances,
          logo_url: logoUrl,
          address: null,
          status: 'pending',
          submitted_by: authenticatedUserId,
          youtube_url: data.youtubeUrl || null,
          tiktok_url: data.tiktokUrl || null,
          instagram_url: data.instagramUrl || null,
          facebook_url: data.facebookUrl || null
        })
        .select('id')
        .single();

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

      // Store submission details and show checkout
      if (insertedData?.id) {
        setSubmissionId(insertedData.id);
        setSubmittedCategory(data.category);
        setShowCheckout(true);
        toast({
          title: "Application submitted!",
          description: "Please complete payment to finalize your listing.",
        });
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      const errorMessage = error?.message || error?.error_description || "There was an error submitting your application. Please try again.";
      toast({
        title: "Submission failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      ) : !user ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-muted-foreground">Redirecting to login...</p>
        </div>
      ) : (
        <>
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

        {showCheckout && submissionId ? (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <img src={logo} alt="Sober Helpline" className="mx-auto mb-6 w-48 h-48 object-contain" />
            </div>
            <SubscriptionCheckout 
              providerSubmissionId={submissionId} 
              category={submittedCategory}
              onSuccess={() => navigate('/')}
            />
          </div>
        ) : (
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

              {form.watch("category") === "Medical Detox" && (
                <FormField
                  control={form.control}
                  name="detoxOnlyServices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you provide detox only services without a commitment for ongoing treatment?</FormLabel>
                        <FormDescription>Check yes if you only provide detox services</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}

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

              {form.watch("category") === "Interventionists" && (
                <FormField
                  control={form.control}
                  name="cipCertified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Are you a CIP?</FormLabel>
                        <FormDescription>Check if you are a Certified Intervention Professional</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}

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

              {/* Social Media Links */}
              <div className="space-y-4 border rounded-lg p-4 bg-muted">
                <FormLabel className="text-base">Social Media Links (Optional)</FormLabel>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your social media profiles to help clients connect with you
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          YouTube
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/@yourchannel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tiktokUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                          TikTok
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://tiktok.com/@yourusername" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagramUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          Instagram
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/yourusername" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="facebookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Facebook
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/yourpage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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

              {form.watch("category") === "Interventionists" && (
                <>
                  <FormField
                    control={form.control}
                    name="worksNationally"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Do you work nationally?</FormLabel>
                          <FormDescription>Check if you provide intervention services throughout the United States</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="worksInternationally"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Do you work internationally?</FormLabel>
                          <FormDescription>Check if you provide intervention services outside the United States</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="languagesSpoken"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">What languages do you speak other than English?</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 bg-muted">
                          {["Spanish", "French", "German", "Portuguese", "Italian", "Mandarin", "Cantonese", "Japanese", "Korean", "Arabic", "Russian", "Hindi", "Vietnamese", "Tagalog", "Farsi", "Other"].map((language) => (
                            <FormField
                              key={language}
                              control={form.control}
                              name="languagesSpoken"
                              render={({ field }) => {
                                const value = field.value || [];
                                return (
                                  <FormItem
                                    key={language}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={value.includes(language)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...value, language])
                                            : field.onChange(
                                                value.filter(
                                                  (val) => val !== language
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {language}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        {form.watch("languagesSpoken")?.includes("Other") && (
                          <FormField
                            control={form.control}
                            name="otherLanguages"
                            render={({ field }) => (
                              <FormItem className="mt-3">
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Enter other languages, separated by commas"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  List any additional languages you speak, separated by commas
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {!["Interventionists", "Attorneys", "Sober Coaches/Companions", "Psychiatrists", "Therapists", "Medical Detox"].includes(form.watch("category")) && (
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

              {!["Interventionists", "Attorneys", "Sober Coaches/Companions", "Psychiatrists", "Therapists", "Medical Detox"].includes(form.watch("category")) && (
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

                  <FormField
                    control={form.control}
                    name="languagesSpoken"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">What languages do you speak other than English?</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 bg-muted">
                          {["Spanish", "French", "German", "Portuguese", "Italian", "Mandarin", "Cantonese", "Japanese", "Korean", "Arabic", "Russian", "Hindi", "Vietnamese", "Tagalog", "Farsi", "Other"].map((language) => (
                            <FormField
                              key={language}
                              control={form.control}
                              name="languagesSpoken"
                              render={({ field }) => {
                                const value = field.value || [];
                                return (
                                  <FormItem
                                    key={language}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={value.includes(language)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...value, language])
                                            : field.onChange(
                                                value.filter(
                                                  (val) => val !== language
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {language}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        {form.watch("languagesSpoken")?.includes("Other") && (
                          <FormField
                            control={form.control}
                            name="otherLanguages"
                            render={({ field }) => (
                              <FormItem className="mt-3">
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Enter other languages, separated by commas"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  List any additional languages you speak, separated by commas
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {!["Interventionists", "Attorneys", "Sober Coaches/Companions", "Psychiatrists", "Therapists", "Outpatient Treatment", "Medical Detox"].includes(form.watch("category")) && (
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

              {form.watch("category") === "Sober Living" && (
                <FormField
                  control={form.control}
                  name="awakeStaff247"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is there awake staff at the house 24/7?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Living" && (
                <FormField
                  control={form.control}
                  name="residentsExpectedToWork"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Are your residents expected to work while in the sober living?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Living" && form.watch("residentsExpectedToWork") && (
                <FormField
                  control={form.control}
                  name="jobAssistanceProvided"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you provide assistance with getting a job?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Living" && (
                <FormField
                  control={form.control}
                  name="medicationAdministration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do your residents administer their own medication or is it supervised?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select medication administration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Self-administered">Self-administered</SelectItem>
                          <SelectItem value="Supervised">Supervised</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Living" && (
                <FormField
                  control={form.control}
                  name="acceptsMatResidents"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you accept residents that are currently on MAT?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Living" && (
                <FormField
                  control={form.control}
                  name="minimumTimeSinceLastUse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do you have a minimum requirement for time since last use?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select minimum time requirement" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="One week">One week</SelectItem>
                          <SelectItem value="One month">One month</SelectItem>
                          <SelectItem value="More than one month">More than one month</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Living" && (
                <FormField
                  control={form.control}
                  name="requiredMeetingsPerWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How many meetings a week are your residents required to attend?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select required meetings per week" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="7">7</SelectItem>
                          <SelectItem value="More than 7">More than 7</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Living" && (
                <FormField
                  control={form.control}
                  name="mandatoryCurfew"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you have a mandatory curfew?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Living" && form.watch("mandatoryCurfew") && (
                <FormField
                  control={form.control}
                  name="curfewTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Curfew Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          placeholder="00:00"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Select curfew time</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Living" && (
                <FormField
                  control={form.control}
                  name="choresRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you require that residents participate in chores?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Living" && (
                <FormField
                  control={form.control}
                  name="mandatoryHouseMeetings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you have mandatory house meetings or groups?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Living" && form.watch("mandatoryHouseMeetings") && (
                <FormField
                  control={form.control}
                  name="houseMeetingsPerWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How many per week?</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter number of meetings per week"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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

              {(form.watch("category") === "Therapists" ||
                form.watch("category") === "Psychiatrists") && (
                <FormField
                  control={form.control}
                  name="substanceUseDisorderExperience"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you have experience working with individuals with substance use disorder?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {(form.watch("category") === "Outpatient Treatment" ||
                form.watch("category") === "Therapists" ||
                form.watch("category") === "Psychiatrists") && (
                <FormField
                  control={form.control}
                  name="telehealthAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you offer telehealth sessions?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Attorneys" && form.watch("state") === "Florida" && (
                <FormField
                  control={form.control}
                  name="legalAssistanceTypes"
                  render={() => (
                    <FormItem className="rounded-md border p-4 bg-muted">
                      <div className="mb-4">
                        <FormLabel>Are you able to assist families with the following:</FormLabel>
                      </div>
                      {["Marchman Act", "Baker Act"].map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="legalAssistanceTypes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
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

              {["Inpatient Treatment", "Outpatient Treatment", "Sober Living", "Sober Coaches/Companions"].includes(form.watch("category")) && (
                <FormField
                  control={form.control}
                  name="recoveryFellowships"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Which of the following recovery fellowships do you make available to your clients?</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 bg-muted">
                        {["Alcoholics Anonymous (AA)", "Narcotics Anonymous (NA)", "SMART Recovery", "Celebrate Recovery", "Refuge Recovery / Recovery Dharma", "ACA (Adult Children of Alcoholics)", "Other"].map((fellowship) => (
                          <FormField
                            key={fellowship}
                            control={form.control}
                            name="recoveryFellowships"
                            render={({ field }) => {
                              const value = field.value || [];
                              return (
                                <FormItem
                                  key={fellowship}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={value.includes(fellowship)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...value, fellowship])
                                          : field.onChange(
                                              value.filter(
                                                (val) => val !== fellowship
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {fellowship}
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
                        maxLength={750}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/750 characters
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
                          placeholder={
                            form.watch("category") === "Interventionists" 
                              ? "cost per intervention" 
                              : ["Sober Coaches/Companions", "Therapists", "Psychiatrists", "Attorneys"].includes(form.watch("category"))
                              ? "cost per session/meeting"
                              : "cost per month"
                          }
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

              {form.watch("category") === "Interventionists" && (
                <FormField
                  control={form.control}
                  name="travelExpensesIncluded"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Are travel expenses included with the intervention fee?</FormLabel>
                        <FormDescription>Check if travel costs are included in the intervention fee</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {form.watch("category") === "Sober Living" && (
                <FormField
                  control={form.control}
                  name="itemsIncludedInCost"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Are the following items included in the cost?</FormLabel>
                      </div>
                      <div className="flex flex-col space-y-3 border rounded-lg p-4 bg-muted">
                        {["Food", "Transportation", "Therapeutic Support"].map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="itemsIncludedInCost"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item}
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


              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Continue to Payment"}
              </Button>
            </form>
          </Form>
        </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};

export default ProviderInfo;
