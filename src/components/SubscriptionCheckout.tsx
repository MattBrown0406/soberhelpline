import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

interface PlanOptions {
  monthly?: SubscriptionPlan;
  annual?: SubscriptionPlan;
}

// Get subscription plans based on provider category
function getSubscriptionPlans(category: string): PlanOptions {
  switch (category) {
    case 'Inpatient Treatment':
    case 'Outpatient Treatment':
    case 'Medical Detox':
      return {
        monthly: {
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
        },
        annual: {
          id: 'treatment-annual',
          name: 'Treatment Provider (Annual)',
          price: '5000.00',
          period: '/year',
          billingCycle: 'annual',
          features: [
            'Listed in provider directory',
            'Searchable by location',
            'Display your services',
            'Contact information visible',
            '2 FREE MONTHS included!',
            'Best value - Save $1,000',
          ],
        },
      };
    case 'Sober Living':
      return {
        monthly: {
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
        },
      };
    case 'Interventionists':
    case 'Sober Coaches/Companions':
    case 'Therapists':
    case 'Psychiatrists':
    default:
      return {
        annual: {
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
        },
      };
  }
}

interface SubscriptionCheckoutProps {
  providerSubmissionId: string;
  category: string;
  onSuccess?: () => void;
}

export function SubscriptionCheckout({ providerSubmissionId, category, onSuccess }: SubscriptionCheckoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createSubscription, isLoading, paypalUrl } = usePayPalSubscription();
  const [discountCode, setDiscountCode] = useState('');
  const [freeListingActivated, setFreeListingActivated] = useState(false);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  const planOptions = getSubscriptionPlans(category);
  const hasAnnualOption = planOptions.monthly && planOptions.annual;
  const plan = hasAnnualOption 
    ? (selectedBillingCycle === 'annual' ? planOptions.annual! : planOptions.monthly!)
    : (planOptions.monthly || planOptions.annual!);

  const handleSubscribe = async () => {
    try {
      const result = await createSubscription({
        planType: plan.billingCycle,
        amount: plan.price,
        providerSubmissionId,
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
      // Error is handled in the hook
    }
  };

  // Show success state for free listing
  if (freeListingActivated) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-green-500">
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
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Complete Your Listing</h2>
        <p className="text-muted-foreground">
          Subscribe to have your services listed in our directory
        </p>
      </div>

      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{plan.name}</CardTitle>
            <Badge className="bg-primary">{category}</Badge>
          </div>
          
          {/* Billing cycle toggle for treatment providers */}
          {hasAnnualOption && (
            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                variant={selectedBillingCycle === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedBillingCycle('monthly')}
                className="flex-1"
              >
                Monthly
              </Button>
              <Button
                type="button"
                variant={selectedBillingCycle === 'annual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedBillingCycle('annual')}
                className="flex-1 relative"
              >
                Annual
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-xs px-1.5">
                  Save $1K
                </Badge>
              </Button>
            </div>
          )}
          
          <CardDescription className="pt-3">
            <span className="text-4xl font-bold text-foreground">${plan.price}</span>
            <span className="text-muted-foreground">{plan.period}</span>
            {selectedBillingCycle === 'annual' && hasAnnualOption && (
              <div className="mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                  🎉 2 FREE MONTHS included!
                </Badge>
              </div>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className={`h-4 w-4 flex-shrink-0 ${feature.includes('FREE') || feature.includes('Save') ? 'text-green-600' : 'text-green-500'}`} />
                <span className={`text-sm ${feature.includes('FREE') || feature.includes('Save') ? 'text-green-600 font-semibold' : 'text-muted-foreground'}`}>{feature}</span>
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
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {paypalUrl ? (
            <>
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
            </>
          ) : (
            <Button 
              size="lg" 
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Subscribe with PayPal</>
              )}
            </Button>
          )}
          <p className="text-sm text-muted-foreground text-center">
            Secure payment powered by PayPal. Cancel anytime.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}