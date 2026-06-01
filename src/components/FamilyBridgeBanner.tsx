import { Check, Sparkles } from "lucide-react";
import familyBridgeLogo from "@/assets/family-bridge-logo.png";
import AppStoreBadge from "@/components/AppStoreBadge";

const FamilyBridgeBanner = () => {
  const features = [
    "FIIS AI-powered recovery intelligence (Patent Pending)",
    "Smart medication compliance with family alerts",
    "GPS-verified meeting check-ins",
    "Secure family voting on financial requests",
    "365-day recovery trajectory tracking",
    "Real-time AI-moderated communication"
  ];

  return (
    <div className="block w-full">
      <div className="bg-gradient-to-r from-[#1a8a8a] via-[#1f9e9e] to-[#1a8a8a] rounded-xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#2bb3b3]/30 overflow-hidden">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
          {/* Logo and Main Text */}
          <div className="flex items-center gap-4 lg:gap-5 flex-shrink-0">
            <div className="bg-white rounded-lg p-2.5 shadow-md flex-shrink-0">
              <img 
                src={familyBridgeLogo} 
                alt="Family Bridge" 
                className="h-14 w-14 md:h-16 md:w-16 object-contain"
              />
            </div>
            <div className="text-white text-center xl:text-left">
              <div className="flex items-center gap-2 justify-center xl:justify-start mb-1">
                <h3 className="font-bold text-xl md:text-2xl">
                  FamilyBridge
                </h3>
                <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  FIIS Tech
                </span>
              </div>
              <p className="text-white/90 text-sm md:text-base">
                Healing starts with connection • HIPAA compliant
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-white/95 min-w-0 flex-grow max-w-2xl">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2 min-w-0">
                <Check className="h-4 w-4 text-white/80 flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm leading-tight break-words">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <AppStoreBadge height={44} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyBridgeBanner;
