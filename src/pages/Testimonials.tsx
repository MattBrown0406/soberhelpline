import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Star, Send, Quote, Video } from "lucide-react";
import testimonialsHero from "@/assets/testimonials-hero.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import MembershipPromoBanner from "@/components/MembershipPromoBanner";
import { useMembershipStatus } from "@/hooks/useMembershipStatus";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

interface Testimonial {
  id: string;
  first_name: string;
  last_initial: string;
  city: string;
  state: string;
  experience: string;
  rating: number;
  created_at: string;
}

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        onClick={() => interactive && onRate?.(star)}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const { isMember } = useMembershipStatus();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const fromZoom = searchParams.get("from") === "zoom";
  const [showForm, setShowForm] = useState(fromZoom);
  const [form, setForm] = useState({ first_name: "", last_initial: "", city: "", state: "", experience: "", rating: 0 });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data } = await supabase
        .from('testimonials')
        .select('id, first_name, last_initial, city, state, experience, rating, created_at')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      setTestimonials(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    if (form.rating === 0) { toast({ title: "Please select a rating", variant: "destructive" }); return; }
    if (!form.first_name.trim() || !form.last_initial.trim() || !form.city.trim() || !form.state || !form.experience.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" }); return;
    }
    if (form.first_name.length > 50 || form.last_initial.length > 1 || form.city.length > 100 || form.experience.length > 2000) {
      toast({ title: "Please check field lengths", variant: "destructive" }); return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('testimonials').insert({
      user_id: user.id,
      first_name: form.first_name.trim(),
      last_initial: form.last_initial.trim().toUpperCase(),
      city: form.city.trim(),
      state: form.state,
      experience: form.experience.trim(),
      rating: form.rating,
    });

    setSubmitting(false);
    if (error) {
      toast({ title: "Error submitting testimonial", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Thank you!", description: "Your testimonial has been submitted and will appear after review." });
      setForm({ first_name: "", last_initial: "", city: "", state: "", experience: "", rating: 0 });
      setShowForm(false);
    }
  };

  const avgRating = testimonials.length > 0 ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1) : "0";

  return (
    <>
      <SEOHead
        title="Family Testimonials | Sober Helpline"
        description="Read real stories from families who have found hope and healing through Sober Helpline's coaching and support programs."
      />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <img src={testimonialsHero} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">Real Families. Real Stories.</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-6 drop-shadow">
              Hear from families who took the first step toward stability, clarity, and hope.
            </p>
            {testimonials.length > 0 && (
              <div className="flex items-center justify-center gap-3 text-white">
                <StarRating rating={Math.round(Number(avgRating))} />
                <span className="text-xl font-semibold">{avgRating}</span>
                <span className="opacity-75">({testimonials.length} review{testimonials.length !== 1 ? 's' : ''})</span>
              </div>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Post-Zoom Banner with Membership CTA */}
          {fromZoom && (
            <div className="bg-gradient-to-r from-primary/10 via-logo-green/10 to-primary/10 border border-primary/20 rounded-xl p-6 mb-8 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Video className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Thank You for Joining Tonight's Meeting!</h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-4">
                Your presence matters. Would you take a moment to share how these "The Family Squares" meetings are helping you? Your words encourage other families to take that first step.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/family-membership')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Star className="w-4 h-4" />
                Become a Member
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Join our community for exclusive resources, coaching discounts, and ongoing support
              </p>
            </div>
          )}

          {/* CTA to write */}
          <div className="text-center mb-12">
            <Button
              size="lg"
              onClick={() => user ? setShowForm(!showForm) : navigate('/auth')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4 mr-2" />
              Share Your Experience
            </Button>
          </div>

          {/* Submission Form */}
          {showForm && (
            <Card className="mb-12 border-primary/20">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {fromZoom ? "How Are the "The Family Squares"s Helping You?" : "Share Your Coaching Experience"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input id="first_name" maxLength={50} value={form.first_name} onChange={(e) => setForm(p => ({ ...p, first_name: e.target.value }))} placeholder="Jane" required />
                    </div>
                    <div>
                      <Label htmlFor="last_initial">Last Initial</Label>
                      <Input id="last_initial" maxLength={1} value={form.last_initial} onChange={(e) => setForm(p => ({ ...p, last_initial: e.target.value.slice(0, 1) }))} placeholder="D" required />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <select id="state" value={form.state} onChange={(e) => setForm(p => ({ ...p, state: e.target.value }))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                        <option value="">Select state</option>
                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" maxLength={100} value={form.city} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Portland" required />
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <StarRating rating={form.rating} onRate={(r) => setForm(p => ({ ...p, rating: r }))} interactive />
                  </div>
                  <div>
                    <Label htmlFor="experience">Your Experience</Label>
                    <Textarea id="experience" maxLength={2000} rows={5} value={form.experience} onChange={(e) => setForm(p => ({ ...p, experience: e.target.value }))} placeholder={fromZoom ? "How have the "The Family Squares" meetings been helping you and your family?" : "Tell us about your coaching experience..."} required />
                    <p className="text-xs text-muted-foreground mt-1">{form.experience.length}/2000</p>
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Submitting..." : "Submit Testimonial"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">Your testimonial will be reviewed before being published.</p>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Testimonial List */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <Quote className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No testimonials yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {testimonials.map((t) => (
                <Card key={t.id} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{t.first_name} {t.last_initial}.</p>
                        <p className="text-sm text-muted-foreground">{t.city}, {t.state}</p>
                      </div>
                      <StarRating rating={t.rating} />
                    </div>
                    <div className="relative pl-4 border-l-2 border-primary/20">
                      <Quote className="absolute -left-3 -top-1 w-5 h-5 text-primary/30 bg-card" />
                      <p className="text-foreground/90 leading-relaxed">{t.experience}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(t.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Membership Promotion Banner - only show to non-members */}
          {!isMember && <MembershipPromoBanner />}
        </div>
      </div>
    </>
  );
};

export default Testimonials;