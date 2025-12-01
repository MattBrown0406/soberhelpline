import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePayPalSubscription } from '@/hooks/usePayPalSubscription';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2, Tag, CheckCircle2 } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  billingCycle: 'monthly' | 'annual';
  features: string[];
}

// Get subscription plan based on provider category
function getSubscriptionPlan(category: string): SubscriptionPlan {
  switch (category) {
    case 'Inpatient Treatment':
    case 'Outpatient Treatment':
    case 'Medical Detox':
      return {
        id: 'treatment-monthly',
        name: 'Treatment Provider',
        price: '500.00',
        period: '/month',
        billingCycle: 'monthly',
        features: [
          'Listed in provider directory',
          'Searchable by location',
          'Display your services',
          'Contact information visible',
          'Cancel anytime',
        ],
      };
    case 'Sober Living':
      return {
        id: 'sober-living-monthly',
        name: 'Sober Living Provider',
        price: '250.00',
        period: '/month',
        billingCycle: 'monthly',
        features: [
          'Listed in provider directory',
          'Searchable by location',
          'Display your services',
          'Contact information visible',
          'Cancel anytime',
        ],
      };
    case 'Interventionists':
    case 'Sober Coaches/Companions':
    case 'Therapists':
    case 'Psychiatrists':
    default:
      return {
        id: 'professional-annual',
        name: 'Professional Provider',
        price: '250.00',
        period: '/year',
        billingCycle: 'annual',
        features: [
          'Listed in provider directory',
          'Searchable by location',
          'Display your services',
          'Contact information visible',
          'Full year of visibility',
        ],
      };
  }
}

interface InlinePayPalCheckoutProps {
  category: string;
  onSubmitAndPay: (discountCode: string) => Promise<string | null>;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export function InlinePayPalCheckout({ 
  category, 
  onSubmitAndPay,
  isSubmitting,
  isEditMode
}: InlinePayPalCheckoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createSubscription, isLoading, paypalUrl, clearPaypalUrl } = usePayPalSubscription();
  const [discountCode, setDiscountCode] = useState('');
  const [freeListingActivated, setFreeListingActivated] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const plan = getSubscriptionPlan(category);

  const handleSubscribe = async () => {
    setProcessingPayment(true);
    clearPaypalUrl();
    
    try {
      // First submit the form and get the submission ID
      const submissionId = await onSubmitAndPay(discountCode.trim());
      
      if (!submissionId) {
        setProcessingPayment(false);
        return; // Form validation failed or submission error
      }

      // Now create the subscription
      const result = await createSubscription({
        planType: plan.billingCycle,
        amount: plan.price,
        providerSubmissionId: submissionId,
        discountCode: discountCode.trim() || undefined,
      });
      
      // Check if FREELIST code was used
      if (result?.bypassed) {
        setFreeListingActivated(true);
        toast({
          title: 'Free Listing Activated!',
          description: 'Your provider listing has been published.',
        });
      }
    } catch (error) {
      // Error is handled in the hook or onSubmitAndPay
    } finally {
      setProcessingPayment(false);
    }
  };

  // Show success state for free listing
  if (freeListingActivated) {
    return (
      <Card className="border-green-500 mt-6">
        <CardHeader className="text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-600">Listing Activated!</CardTitle>
          <CardDescription>
            Your provider listing has been published and is now searchable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="font-medium mb-1">What's next?</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Your listing is now live</li>
              <li>Users can find you in the provider directory</li>
              <li>You'll appear in search results</li>
            </ul>
          </div>
          <Button onClick={() => navigate('/')} className="w-full">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  // For edit mode, just show the update button
  if (isEditMode) {
    return (
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update Information"}
      </Button>
    );
  }

  // Don't show checkout if no category selected
  if (!category) {
    return (
      <Button type="button" size="lg" className="w-full" disabled>
        Select a category to continue
      </Button>
    );
  }

  return (
    <Card className="border-primary mt-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Complete Your Listing</CardTitle>
          <Badge className="bg-primary">{category}</Badge>
        </div>
        <CardDescription>
          <span className="text-3xl font-bold text-foreground">${plan.price}</span>
          <span className="text-muted-foreground">{plan.period}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          <Label htmlFor="discountCode" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Discount Code (optional)
          </Label>
          <Input
            id="discountCode"
            placeholder="Enter discount code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            maxLength={50}
          />
        </div>

        {paypalUrl ? (
          <div className="w-full p-4 bg-muted rounded-lg text-center space-y-3">
            <p className="text-sm font-medium text-foreground">
              Click the button below to complete your payment with PayPal
            </p>
            <a 
              href={paypalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block w-full"
            >
              <Button size="lg" className="w-full">
                Continue to PayPal →
              </Button>
            </a>
            <p className="text-xs text-muted-foreground">
              Opens in a new tab. Return here after completing payment.
            </p>
          </div>
        ) : (
          <Button 
            type="button"
            size="lg" 
            onClick={handleSubscribe}
            disabled={isLoading || processingPayment || isSubmitting}
            className="w-full"
          >
            {isLoading || processingPayment || isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Submit & Subscribe with PayPal</>
            )}
          </Button>
        )}
        <p className="text-sm text-muted-foreground text-center">
          Secure payment powered by PayPal. Cancel anytime.
        </p>
      </CardContent>
    </Card>
  );
}
