import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/conversionTracking";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "5038362136";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const getWhatsAppUrl = () => WHATSAPP_URL;

interface WhatsAppLinkProps {
  source: string;
  variant?: "button" | "icon" | "inline";
  className?: string;
  children?: React.ReactNode;
  showLabel?: boolean;
  label?: string;
}

const WhatsAppLink = ({
  source,
  variant = "button",
  className,
  children,
  showLabel = true,
  label = "WhatsApp",
}: WhatsAppLinkProps) => {
  const handleClick = () => {
    trackWhatsAppClick(source);
  };

  if (variant === "icon") {
    return (
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-[hsl(var(--whatsapp))] text-white shadow-sm transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          "h-9 w-9",
          className
        )}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-5 w-5 fill-current" />
      </a>
    );
  }

  if (variant === "inline") {
    return (
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--whatsapp))] hover:underline transition-colors",
          className
        )}
      >
        <MessageCircle className="h-4 w-4 fill-current" />
        {children || label}
      </a>
    );
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-[hsl(var(--whatsapp))] text-white font-medium transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        showLabel ? "px-4 py-2 text-sm" : "h-10 w-10",
        className
      )}
    >
      <MessageCircle className={cn("fill-current", showLabel ? "h-4 w-4" : "h-5 w-5")} />
      {showLabel && (children || label)}
    </a>
  );
};

export default WhatsAppLink;
