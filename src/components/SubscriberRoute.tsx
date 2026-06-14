import { ReactNode } from "react";
import { useWebSession } from "@/hooks/useWebSession";
import AppSubscriberGate from "@/components/AppSubscriberGate";

export default function SubscriberRoute({ children }: { children: ReactNode }) {
  const { isSubscriber } = useWebSession();
  if (!isSubscriber) return <AppSubscriberGate />;
  return <>{children}</>;
}
