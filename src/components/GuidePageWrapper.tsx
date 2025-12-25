import { useGuideTracking } from "@/hooks/useGuideTracking";

interface GuidePageWrapperProps {
  guideName: string;
  guidePath: string;
  children: React.ReactNode;
}

/**
 * Wrapper component that automatically tracks guide page views.
 * Wrap your guide page content with this component to enable analytics.
 * 
 * Usage:
 * <GuidePageWrapper guideName="My Guide Title" guidePath="/my-guide">
 *   <YourGuideContent />
 * </GuidePageWrapper>
 */
export const GuidePageWrapper = ({ guideName, guidePath, children }: GuidePageWrapperProps) => {
  useGuideTracking(guideName, guidePath);
  
  return <>{children}</>;
};

export default GuidePageWrapper;
