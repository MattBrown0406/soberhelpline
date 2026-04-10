import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  id: string;
  first_name: string;
  last_initial: string;
  city: string;
  state: string;
  experience: string;
  rating: number;
}

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id, first_name, last_initial, city, state, experience, rating")
        .eq("is_approved", true)
        .gte("rating", 4)
        .order("created_at", { ascending: false })
        .limit(10);
      setTestimonials(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (loading || testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 border border-primary/20 p-6 md:p-8 mb-8">
      <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Quote className="w-5 h-5 text-primary/60" />
          <span className="text-sm font-bold text-primary uppercase tracking-wide">
            What Families Are Saying
          </span>
        </div>

        <div className="min-h-[120px] flex flex-col justify-center">
          <p className="text-foreground/90 text-base md:text-lg leading-relaxed italic mb-4 line-clamp-4">
            "{t.experience}"
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t.first_name} {t.last_initial}.
              </p>
              <p className="text-xs text-muted-foreground">
                {t.city}, {t.state}
              </p>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${s <= t.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {testimonials.length > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-5" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
