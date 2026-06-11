import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gift, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Free6PromoBanner = () => {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRemaining = async () => {
      try {
        const { data, error } = await supabase.rpc('get_promo_remaining', {
          promo_code: 'FAMILY6'
        });
        
        if (!error && data !== null) {
          setRemaining(data);
        }
      } catch (err) {
        console.error('Error fetching promo remaining:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRemaining();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchRemaining, 30000);
    return () => clearInterval(interval);
  }, []);

  // Don't show banner if all codes are used
  if (!loading && remaining === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-amber-500/20 via-logo-green/20 to-amber-500/20 border-y border-amber-500/40">
      <div className="container mx-auto px-4 py-4 md:py-5">
        <Link to="/family-membership" className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 md:gap-8 group">
          {/* Gift Icon with glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-xl animate-pulse" />
            <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Gift className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
          </div>
          
          {/* Content */}
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              <div className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] md:text-xs font-bold uppercase tracking-wide animate-pulse">
                Limited Offer
              </div>
            </div>
            <p className="font-bold text-foreground text-base md:text-xl leading-tight">
              Get <span className="text-amber-600 dark:text-amber-400">6 Months FREE</span> Family Membership!
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Use code <span className="font-bold text-logo-blue bg-logo-green/10 px-2 py-0.5 rounded">FAMILY6</span> at checkout — Access forum, education & live webinars
            </p>
          </div>
          
          {/* Counter */}
          <div className="flex flex-col items-center gap-1 bg-background/80 backdrop-blur rounded-lg px-4 py-2 border border-amber-500/30 shadow-sm">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wide">Remaining</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                remaining
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">of 25</span>
          </div>
          
          <Button variant="default" size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600 text-white group-hover:gap-3 transition-all text-xs md:text-sm shadow-lg shadow-amber-500/25">
            Claim Now
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Free6PromoBanner;
