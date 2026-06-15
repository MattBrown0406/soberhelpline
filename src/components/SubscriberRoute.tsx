import { ReactNode } from "react";
import { useWebSession } from "@/hooks/useWebSession";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";
import AppSubscriberGate from "@/components/AppSubscriberGate";
import { Loader2 } from "lucide-react";

export default function SubscriberRoute({ children }: { children: ReactNode }) {
  const { isSubscriber } = useWebSession();
  const { isMember, loading } = useMembershipStatus();

  if (!isSubscriber && loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSubscriber && !isMember) return <AppSubscriberGate />;
  return <>{children}</>;
}
