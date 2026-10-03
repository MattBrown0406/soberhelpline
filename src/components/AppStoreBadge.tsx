import appStoreBadge from "@/assets/app-store-badge.svg";

// The Sober Helpline app is iOS-only (App Store id6780034996).
export const SOBER_HELPLINE_APP_STORE_URL = "https://apps.apple.com/us/app/sober-helpline/id6780034996";

interface AppStoreBadgeProps {
  appStoreUrl?: string;
  ariaLabel?: string;
  className?: string;
  height?: number;
  onClick?: () => void;
}

const AppStoreBadge = ({
  appStoreUrl = SOBER_HELPLINE_APP_STORE_URL,
  ariaLabel = "Download the Sober Helpline app on the App Store",
  className = "",
  height = 48,
  onClick,
}: AppStoreBadgeProps) => {
  const iosWidth = Math.round(height * 2.9916);

  return (
    <div className={`inline-flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-80 transition-opacity"
        aria-label={ariaLabel}
        onClick={onClick}
      >
        <img
          src={appStoreBadge}
          alt="Download on the App Store"
          width={iosWidth}
          height={height}
          style={{ height: `${height}px`, width: "auto" }}
        />
      </a>
    </div>
  );
};

export default AppStoreBadge;
