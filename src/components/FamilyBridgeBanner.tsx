import { ExternalLink } from "lucide-react";
import familyBridgeLogo from "@/assets/family-bridge-logo.png";

const FamilyBridgeBanner = () => {
  return (
    <a
      href="https://FamilyBridgeApp.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full group"
    >
      <div className="bg-gradient-to-r from-[#1a8a8a] via-[#1f9e9e] to-[#1a8a8a] rounded-xl p-4 md:p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#2bb3b3]/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Text */}
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg p-2 shadow-md flex-shrink-0">
              <img 
                src={familyBridgeLogo} 
                alt="Family Bridge" 
                className="h-10 w-10 md:h-12 md:w-12 object-contain"
              />
            </div>
            <div className="text-white text-center md:text-left">
              <h3 className="font-bold text-lg md:text-xl">
                Family Bridge App
              </h3>
              <p className="text-white/90 text-sm md:text-base">
                Bridging the gap between families and recovery
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 transition-colors group-hover:scale-105 duration-200">
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
