import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePayPalSubscription } from '@/hooks/usePayPalSubscription';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { trackConversionEvent } from '@/lib/conversionTracking';
import SoberHelplineAppStoreBadge from '@/components/SoberHelplineAppStoreBadge';

// Set by the family membership checkout before it hands off to PayPal.
const cameFromFamilyCheckout = () => {
  try {
    return sessionStorage.getItem('checkoutKind') === 'family';
  } catch {
    return false;
  }
};

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activateSubscription, isLoading } = usePayPalSubscription();
  const [activated, setActivated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProviderSubscription, setIsProviderSubscription] = useState<boolean | null>(null);

  const subscriptionId = searchParams.get('subscription_id');

  useEffect(() => {
    if (subscriptionId && !activated) {
      activateSubscription(subscriptionId)
        .then(async () => {
          setActivated(true);
          // Check if this is a provider or family subscription
          const { data } = await supabase
            .from('provider_subscriptions')
            .select('provider_submission_id')
            .eq('paypal_subscription_id', subscriptionId)
            .maybeSingle();
          
          // No readable row is not proof of a provider listing: fall back to
          // which checkout this browser started.
          const isProvider = data ? data.provider_submission_id !== null : !cameFromFamilyCheckout();
          setIsProviderSubscription(isProvider);
          if (!isProvider) {
            try {
              // Count each new membership once, even if this page is reloaded.
              const key = `membershipSuccessTracked:${subscriptionId}`;
              if (!sessionStorage.getItem(key)) {
                sessionStorage.setItem(key, '1');
                trackConversionEvent('membership_signup_success', { source: 'paypal_return' });
              }
              sessionStorage.removeItem('checkoutKind');
            } catch {
              trackConversionEvent('membership_signup_success', { source: 'paypal_return' });
            }
          }
        })
        .catch((err) => setError(err.message));
    }
  }, [subscriptionId]);

  if (!subscriptionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Invalid Request</CardTitle>
            <CardDescription>No subscription ID found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Activating your subscription...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Activation Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Family membership success content
  if (isProviderSubscription === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Welcome to Family Support!</CardTitle>
            <CardDescription>
              Your membership is now active. Everything in the family library is open to you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="font-medium mb-1">Your membership includes:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>60+ guides, tools and guided meditations</li>
                <li>The private family forum</li>
                <li>Recordings of past Monday meetings</li>
                <li>$25 off private coaching sessions</li>
                <li>Essential features in the Sober Helpline app</li>
              </ul>
            </div>
            <Button onClick={() => navigate('/member-home')} className="w-full">
              Go to My Family Hub
            </Button>
            <div className="rounded-lg border p-4 text-center">
              <p className="mb-2 text-sm text-muted-foreground">
                Your membership also works in the Sober Helpline app. Use this same email address there.
              </p>
              <div className="flex justify-center">
                <SoberHelplineAppStoreBadge height={40} source="membership_success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Provider subscription success content
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-600">Subscription Activated!</CardTitle>
          <CardDescription>
            Thank you for subscribing to Sober Helpline. Your provider listing will be active once approved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="font-medium mb-1">What's next?</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Your listing is being reviewed</li>
              <li>You'll receive an email once approved</li>
              <li>Your services will then be searchable</li>
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