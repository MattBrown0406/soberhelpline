import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const providerFormSchema = z.object({
  providerName: z.string().min(2, "Provider name must be at least 2 characters"),
  address: z.string().min(5, "Address is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  website: z.string().url("Valid website URL is required").or(z.literal("")),
  lengthOfServices: z.string().min(1, "Length of services is required"),
  totalTreatmentBeds: z.string().min(1, "Total treatment beds is required"),
  detoxAvailable: z.boolean().default(false),
  cost: z.string().min(1, "Cost information is required"),
  insurancesAccepted: z.string().min(1, "Insurance information is required"),
});

type ProviderFormValues = z.infer<typeof providerFormSchema>;

const ProviderInfo = () => {
  const { toast } = useToast();
  
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      providerName: "",
      address: "",
      phoneNumber: "",
      email: "",
      website: "",
      lengthOfServices: "",
      totalTreatmentBeds: "",
      detoxAvailable: false,
      cost: "",
      insurancesAccepted: "",
    },
  });

  const onSubmit = (data: ProviderFormValues) => {
    console.log(data);
    toast({
      title: "Form submitted!",
      description: "Your provider information has been received.",
    });
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Provider Information</h1>
          <p className="text-muted-foreground">
            Fill out this form to be listed on Sober Helpline
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="providerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Name</FormLabel>
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter full address" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
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
                    <FormLabel>Email</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="lengthOfServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length of Services</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 30 days, 90 days" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalTreatmentBeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Treatment Beds</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="detoxAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Detox Available?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $5,000 - $10,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insurancesAccepted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurances Accepted</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List all insurance providers accepted (e.g., Aetna, BlueCross BlueShield, UnitedHealthcare)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Submit Provider Information</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProviderInfo;
