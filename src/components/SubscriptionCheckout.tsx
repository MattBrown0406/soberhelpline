import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePayPalSubscription } from '@/hooks/usePayPalSubscription';
import { Check, Loader2 } from 'lucide-react';

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
    case 'Attorneys':
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

interface SubscriptionCheckoutProps {
  providerSubmissionId: string;
  category: string;
  onSuccess?: () => void;
}

export function SubscriptionCheckout({ providerSubmissionId, category, onSuccess }: SubscriptionCheckoutProps) {
  const { createSubscription, isLoading } = usePayPalSubscription();
  const plan = getSubscriptionPlan(category);

  const handleSubscribe = async () => {
    try {
      await createSubscription({
        planType: plan.billingCycle,
        amount: plan.price,
        providerSubmissionId,
      });
      onSuccess?.();
    } catch (error) {
      // Error is handled in the hook
    }
  };

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
          <CardDescription>
            <span className="text-4xl font-bold text-foreground">${plan.price}</span>
            <span className="text-muted-foreground">{plan.period}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
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
          <p className="text-sm text-muted-foreground text-center">
            Secure payment powered by PayPal. Cancel anytime.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
