import { ExternalLink, Check } from "lucide-react";
import familyBridgeLogo from "@/assets/family-bridge-logo.png";

const FamilyBridgeBanner = () => {
  const features = [
    "Daily check-ins & progress tracking",
    "Secure family communication & financial tools",
    "Recovery milestone celebrations",
    "AI-powered pattern recognition for early relapse prevention"
  ];

  return (
    <a
      href="https://FamilyBridgeApp.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full group"
    >
      <div className="bg-gradient-to-r from-[#1a8a8a] via-[#1f9e9e] to-[#1a8a8a] rounded-xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#2bb3b3]/30">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          {/* Logo and Main Text */}
          <div className="flex items-center gap-4 lg:gap-5">
            <div className="bg-white rounded-lg p-2.5 shadow-md flex-shrink-0">
              <img 
                src={familyBridgeLogo} 
                alt="Family Bridge" 
                className="h-14 w-14 md:h-16 md:w-16 object-contain"
              />
            </div>
            <div className="text-white text-center lg:text-left">
              <h3 className="font-bold text-xl md:text-2xl mb-1">
                Family Bridge App
              </h3>
              <p className="text-white/90 text-sm md:text-base">
                Bridging the gap between families and recovery
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-white/95">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-white/80 flex-shrink-0" />
                <span className="text-xs md:text-sm whitespace-nowrap">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-5 py-2.5 transition-colors group-hover:scale-105 duration-200 flex-shrink-0">
            <span className="text-white font-semibold text-sm md:text-base whitespace-nowrap">
              Learn More
            </span>
            <ExternalLink className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default FamilyBridgeBanner;
