import appStoreBadge from "@/assets/app-store-badge.svg";
import googlePlayBadge from "@/assets/google-play-badge.png";

const APP_STORE_URL = "https://apps.apple.com/app/id6744403069";

interface AppStoreBadgeProps {
  className?: string;
  height?: number;
}

const AppStoreBadge = ({ className = "", height = 48 }: AppStoreBadgeProps) => {
  const iosWidth = Math.round(height * 2.9916);
  const androidHeight = Math.round(height * 1.18);
  const androidWidth = Math.round(androidHeight * 2.584);

  return (
    <div className={`inline-flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-80 transition-opacity"
        aria-label="Download FamilyBridge on the App Store"
      >
        <img
          src={appStoreBadge}
          alt="Download on the App Store"
          width={iosWidth}
          height={height}
          style={{ height: `${height}px`, width: "auto" }}
        />
      </a>
      <div className="inline-flex flex-col items-center gap-0.5">
        <div className="relative opacity-50 grayscale cursor-not-allowed">
          <img
            src={googlePlayBadge}
            alt="Get it on Google Play"
            width={androidWidth}
            height={androidHeight}
            style={{ height: `${androidHeight}px`, width: "auto" }}
          />
        </div>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Coming Soon
        </span>
      </div>
    </div>
  );
};

export default AppStoreBadge;
