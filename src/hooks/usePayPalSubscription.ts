import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateSubscriptionParams {
  planType: 'monthly' | 'annual';
  amount: string;
  providerSubmissionId?: string;
  discountCode?: string;
}

interface CreateSubscriptionResult {
  subscriptionId: string;
  approvalUrl: string;
  appliedDiscount: string | null;
  finalAmount: number;
}

export function usePayPalSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const createSubscription = async ({ planType, amount, providerSubmissionId, discountCode }: CreateSubscriptionParams): Promise<CreateSubscriptionResult | null> => {
    setIsLoading(true);
    setPaypalUrl(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to subscribe');
      }

      const returnUrl = `${window.location.origin}/subscription/success`;
      const cancelUrl = `${window.location.origin}/subscription/cancel`;

      const { data, error } = await supabase.functions.invoke('paypal-subscriptions', {
        body: {
          action: 'create-subscription',
          planType,
          amount,
          userId: user.id,
          providerSubmissionId,
          discountCode,
          returnUrl,
          cancelUrl,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to create subscription');
      }

      if (data?.approvalUrl) {
        // Store the URL so we can display it
        setPaypalUrl(data.approvalUrl);
        setIsLoading(false);
        return data;
      } else {
        throw new Error('No approval URL received');
      }
    } catch (error) {
      setIsLoading(false);
      const message = error instanceof Error ? error.message : 'Failed to create subscription';
      toast({
        title: 'Subscription Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const clearPaypalUrl = () => {
    setPaypalUrl(null);
  };

  const activateSubscription = async (subscriptionId: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('paypal-subscriptions', {
        body: {
          action: 'activate-subscription',
          subscriptionId,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to activate subscription');
      }

      if (data?.success) {
        toast({
          title: 'Subscription Activated',
          description: 'Your subscription is now active. Thank you!',
        });
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to activate subscription';
      toast({
        title: 'Activation Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: string, reason?: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('paypal-subscriptions', {
        body: {
          action: 'cancel-subscription',
          subscriptionId,
          reason,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to cancel subscription');
      }

      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been cancelled.',
      });

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel subscription';
      toast({
        title: 'Cancellation Error',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    paypalUrl,
    clearPaypalUrl,
    createSubscription,
    activateSubscription,
    cancelSubscription,
  };
}