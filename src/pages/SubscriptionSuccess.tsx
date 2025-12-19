import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePayPalSubscription } from '@/hooks/usePayPalSubscription';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
          
          setIsProviderSubscription(data?.provider_submission_id !== null);
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
              Your membership is now active. You have full access to all family resources.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="font-medium mb-1">Your membership includes:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Educational videos and worksheets</li>
                <li>Access to the family forum</li>
                <li>Guided meditations</li>
                <li>Printable resources</li>
              </ul>
            </div>
            <Button onClick={() => navigate('/family-videos')} className="w-full">
              Access Family Resources
            </Button>
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