import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/conversionTracking";

const WHATSAPP_NUMBER = "5038362136";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    trackWhatsAppClick("floating_whatsapp_button");
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed bottom-4 left-4 z-[100] flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className={`rounded-full bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-md border border-border transition-all duration-300 ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
        }`}
      >
        Chat on WhatsApp
      </span>
      <button
        onClick={handleClick}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--whatsapp))] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 fill-current" />
      </button>
    </div>
  );
};

export default WhatsAppButton;
