import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function SubscriptionCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="text-2xl">Subscription Cancelled</CardTitle>
          <CardDescription>
            Your subscription process was cancelled. No charges have been made.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            If you have any questions or need assistance, please contact us at matt@soberhelpline.com
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/provider-info')} className="flex-1">
              Try Again
            </Button>
            <Button onClick={() => navigate('/')} className="flex-1">
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}