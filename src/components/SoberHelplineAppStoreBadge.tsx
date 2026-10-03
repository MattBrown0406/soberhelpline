import AppStoreBadge, { SOBER_HELPLINE_APP_STORE_URL } from "@/components/AppStoreBadge";
import { trackConversionEvent } from "@/lib/conversionTracking";

interface SoberHelplineAppStoreBadgeProps {
  className?: string;
  height?: number;
  source: string;
}

const SoberHelplineAppStoreBadge = ({ className = "", height = 44, source }: SoberHelplineAppStoreBadgeProps) => (
  <AppStoreBadge
    appStoreUrl={SOBER_HELPLINE_APP_STORE_URL}
    ariaLabel="Download the Sober Helpline app on the App Store"
    className={className}
    height={height}
    onClick={() => trackConversionEvent("sober_helpline_app_store_click", { source })}
  />
);

export default SoberHelplineAppStoreBadge;
