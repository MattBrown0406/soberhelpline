import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePayPalSubscription } from '@/hooks/usePayPalSubscription';
import { Check, Loader2 } from 'lucide-react';

interface SubscriptionPlan {
  id: 'monthly' | 'annual';
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '49.99',
    period: '/month',
    features: [
      'Listed in provider directory',
      'Searchable by location',
      'Display your services',
      'Contact information visible',
      'Cancel anytime',
    ],
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '499.99',
    period: '/year',
    features: [
      'All monthly features',
      'Listed in provider directory',
      'Searchable by location',
      'Display your services',
      'Priority support',
    ],
    popular: true,
    savings: 'Save $100',
  },
];

interface SubscriptionCheckoutProps {
  providerSubmissionId?: string;
  onSuccess?: () => void;
}

export function SubscriptionCheckout({ providerSubmissionId, onSuccess }: SubscriptionCheckoutProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const { createSubscription, isLoading } = usePayPalSubscription();

  const handleSubscribe = async () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    try {
      await createSubscription({
        planType: selectedPlan,
        amount: plan.price,
        providerSubmissionId,
      });
      onSuccess?.();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Provider Listing Plans</h2>
        <p className="text-muted-foreground">
          Choose a plan to have your services listed in our directory
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedPlan === plan.id 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Most Popular
              </Badge>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.savings && (
                  <Badge variant="secondary" className="text-green-600">
                    {plan.savings}
                  </Badge>
                )}
              </CardTitle>
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

            <CardFooter>
              <div 
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedPlan === plan.id 
                    ? 'border-primary bg-primary' 
                    : 'border-muted-foreground'
                }`}
              >
                {selectedPlan === plan.id && (
                  <Check className="h-3 w-3 text-primary-foreground" />
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button 
          size="lg" 
          onClick={handleSubscribe}
          disabled={isLoading}
          className="min-w-[200px]"
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
        <p className="mt-4 text-sm text-muted-foreground">
          Secure payment powered by PayPal. Cancel anytime.
        </p>
      </div>
    </div>
  );
}