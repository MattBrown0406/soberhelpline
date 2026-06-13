import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ArrowRight, Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "leadMagnetDismissed";
const SHOW_DELAY = 15000; // 15 seconds minimum before showing
const SCROLL_THRESHOLD = 0.3; // Show after scrolling 30% of page

const LeadMagnetPopup = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    let timeReady = false;
    let scrollReady = false;
    let shown = false;

    const tryShow = () => {
      if (timeReady && scrollReady && !shown) {
        shown = true;
        setIsVisible(true);
      }
    };

    const timer = setTimeout(() => {
      timeReady = true;
      tryShow();
    }, SHOW_DELAY);

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPercent >= SCROLL_THRESHOLD) {
        scrollReady = true;
        tryShow();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handleStart = () => {
    handleDismiss();
    navigate("/family-squares");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-primary/20 via-blue-400/20 to-primary/10 px-6 pt-8 pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-center text-foreground">
            Join the Free Monday Night Zoom
          </h2>
          <p className="text-center text-muted-foreground mt-2 text-sm">
            Get live guidance from Matt Brown and connect with families who understand what you are carrying right now.
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <ul className="space-y-3 mb-6 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>Ask urgent questions in real time and leave with clearer next steps</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>Join a live Monday night conversation built for families affected by addiction</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>Free to attend, no membership required</span>
            </li>
          </ul>

          <Button
            onClick={handleStart}
            className="w-full h-11 gap-2 bg-logo-green hover:bg-logo-green/90 text-white"
          >
            <Video className="w-4 h-4" />
            Reserve Your Free Monday Spot
          </Button>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            Every Monday night, led by Matt Brown
          </p>

          <button
            onClick={handleDismiss}
            className="w-full text-xs text-muted-foreground hover:text-foreground mt-3 text-center transition-colors"
          >
            Not right now
          </button>
        </div>

      </div>
    </div>
  );
};

export default LeadMagnetPopup;
