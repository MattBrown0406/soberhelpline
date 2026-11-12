import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { trackConversionEvent } from '@/lib/conversionTracking';

// PayPal sends both family members and treatment providers back to this page
// when they leave checkout. The family checkout leaves a note in the browser
// so "try again" leads back to the right place.
const readCheckoutKind = () => {
  try {
    return sessionStorage.getItem('checkoutKind') === 'family' ? 'family' : 'provider';
  } catch {
    return 'provider';
  }
};

export default function SubscriptionCancel() {
  const navigate = useNavigate();
  const [kind] = useState(readCheckoutKind);
  const isFamily = kind === 'family';

  useEffect(() => {
    if (isFamily) trackConversionEvent('membership_checkout_abandoned', { source: 'paypal_cancel_return' });
  }, [isFamily]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="text-2xl">{isFamily ? 'Your membership was not started' : 'Checkout was not completed'}</CardTitle>
          <CardDescription>
            {isFamily
              ? 'You left PayPal before finishing, so nothing was set up and you have not been charged.'
              : 'You left checkout before finishing. No charges have been made.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isFamily && (
            <p className="text-sm text-muted-foreground text-center">
              The free Monday family meeting is still open to you, with or without a membership.
            </p>
          )}
          <p className="text-sm text-muted-foreground text-center">
            If you have any questions or need assistance, please contact us at matt@soberhelpline.com
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(isFamily ? '/family-membership' : '/provider-info')}
              className="flex-1"
            >
              Try Again
            </Button>
            <Button onClick={() => navigate(isFamily ? '/family-squares' : '/')} className="flex-1">
              {isFamily ? 'Free Monday meeting' : 'Return Home'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
