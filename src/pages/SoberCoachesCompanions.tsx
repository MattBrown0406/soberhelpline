import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCheck, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import USMap from "@/components/USMap";
import StateMap from "@/components/StateMap";
import ProviderCard from "@/components/ProviderCard";
import ProviderFilters from "@/components/ProviderFilters";
import CategoryNav from "@/components/CategoryNav";
import CategoryMobileNav from "@/components/CategoryMobileNav";
import MobileStateSelector from "@/components/MobileStateSelector";
import { useToast } from "@/hooks/use-toast";
import { stateCoordinates, calculateDistance } from "@/utils/stateCoordinates";
import { filterProvidersByDistance, getZipCodeLocation } from "@/utils/zipCodeSearch";
import logo from "@/assets/logo.png";

interface Provider {
  id: string;
  provider_name: string;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone_number?: string | null;
  email?: string | null;
  website: string | null;
  description_of_services: string | null;
  logo_url: string | null;
}

const SoberCoachesCompanions = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showStateMap, setShowStateMap] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [showingNearby, setShowingNearby] = useState(false);
  const [zipCodeSearch, setZipCodeSearch] = useState("");
  const [filters, setFilters] = useState({
    insurance: "All",
    maxBudget: "",
    zipCode: "",
    genderSpecific: [] as string[],
    lgbtSupportive: false,
  });
  const { toast } = useToast();

  const fetchProviders = async (state: string) => {
    setLoading(true);
    setShowingNearby(false);
    try {
      let query = supabase
        .from("provider_submissions_public")
        .select("*")
        .eq("category", "Sober Coaches/Companions")
        .eq("status", "approved")
        .eq("state", state);

      if (filters.zipCode) {
        query = query.eq("zip_code", filters.zipCode);
      }
      if (filters.lgbtSupportive) {
        query = query.eq("lgbt_supportive", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      if (!data || data.length === 0) {
        await fetchNearbyProviders(state);
      } else {
        setProviders(data);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch providers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyProviders = async (selectedStateName: string) => {
    try {
      let query = supabase
        .from("provider_submissions_public")
        .select("*")
        .eq("category", "Sober Coaches/Companions")
        .eq("status", "approved")
        .not("state", "eq", selectedStateName);

      if (filters.lgbtSupportive) {
        query = query.eq("lgbt_supportive", true);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        const selectedStateCoords = stateCoordinates[selectedStateName];
        if (!selectedStateCoords) {
          setProviders([]);
          return;
        }

        const providersWithDistance = data
          .filter(provider => provider.state && stateCoordinates[provider.state])
          .map(provider => {
            const providerStateCoords = stateCoordinates[provider.state!];
            const distance = calculateDistance(
              selectedStateCoords.lat,
              selectedStateCoords.lng,
              providerStateCoords.lat,
              providerStateCoords.lng
            );
            return { ...provider, distance };
          })
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);

        setProviders(providersWithDistance);
        setShowingNearby(true);
      } else {
        setProviders([]);
      }
    } catch (error) {
      console.error("Error fetching nearby providers:", error);
      setProviders([]);
    }
  };

  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    setShowStateMap(true);
    fetchProviders(stateName);
  };

  const handleBackToUSMap = () => {
    setShowStateMap(false);
    setSelectedState(null);
    setProviders([]);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    if (selectedState) {
      fetchProviders(selectedState);
    }
  };

  const handleZipCodeSearch = async () => {
    if (!zipCodeSearch || zipCodeSearch.length < 5) {
      toast({
        title: "Invalid Zip Code",
        description: "Please enter a valid 5-digit zip code",
        variant: "destructive",
      });
      return;
    }

    const searchLocation = getZipCodeLocation(zipCodeSearch);
    if (!searchLocation) {
      toast({
        title: "Invalid Zip Code",
        description: "Could not find location for this zip code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setShowingNearby(false);
    setSelectedState(null);
    
    try {
      const { data, error } = await supabase
        .from("provider_submissions_public")
        .select("*")
        .eq("category", "Sober Coaches/Companions")
        .eq("status", "approved");

      if (error) throw error;
      
      const { providers: filteredProviders, isNearby } = filterProvidersByDistance(
        data || [],
        zipCodeSearch,
        100,
        3
      );
      
      setProviders(filteredProviders);
      setShowingNearby(isNearby);
      
      if (filteredProviders.length === 0) {
        toast({
          title: "No providers found",
          description: `No providers found near zip code ${zipCodeSearch}`,
        });
      }
    } catch (error) {
      console.error("Error searching by zip code:", error);
      toast({
        title: "Error",
        description: "Failed to search providers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Find a Sober Coach or Sober Companion | Sober Helpline"
        description="Find a sober coach, sober companion, or sober living coach for recovery support. Search by state or ZIP code, or call Sober Helpline for help choosing the next step."
        faqItems={[
          {
            question: "How do I find a sober coach?",
            answer: "Start by searching sober coaches and sober companions by state or ZIP code. If you are unsure whether coaching, sober living, treatment, or family support is the right next step, call Sober Helpline or book a family consultation before you hire someone.",
          },
          {
            question: "When should a family consider a sober coach or sober companion?",
            answer: "A sober coach or companion may help after treatment, during a high-risk transition, after relapse, or when daily accountability is needed. If the person is still refusing help or the family is in crisis, family consultation or intervention guidance may be a better first step.",
          },
        ]}
        jsonLd={{ "@context": "https://schema.org", "@type": "MedicalWebPage", "name": "Sober Coaches and Companions Directory", "url": "https://soberhelpline.com/sober-coaches-companions", "publisher": { "@type": "Organization", "name": "Sober Helpline" } }}
      />
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Header */}
        <div className="flex md:hidden justify-between items-center mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1 px-2">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Button>
          </Link>
          <a href="tel:4582027900" className="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
            <Phone className="w-4 h-4" />
            <span className="font-medium text-sm">(458) 202-7900</span>
          </a>
          <CategoryMobileNav />
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-start mb-4">
          <div className="flex flex-col gap-2">
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <CategoryNav />
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:4582027900" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">(458) 202-7900</span>
            </a>
            <img src={logo} alt="Sober Helpline" className="h-24 w-24 object-contain" />
          </div>
        </div>

        <div className="text-center mb-4 md:mb-6">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
            <UserCheck className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            <h1 className="text-xl md:text-4xl font-bold text-foreground">Find a Sober Coach or Sober Companion</h1>
          </div>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Search sober coach services by state or ZIP code, then choose the support that matches your loved one's actual recovery stage.
          </p>
        </div>

        <section className="max-w-4xl mx-auto mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Direct answer</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">What does a sober coach do?</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            A sober coach provides practical recovery support outside of treatment: accountability, relapse-prevention planning, help returning home after rehab, sober transportation, and day-to-day structure when early recovery is fragile. A sober companion may provide more intensive in-person support during travel, transitions, or high-risk periods.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            If you are trying to find a sober coach, start by choosing your state or searching by ZIP code below. If no local provider appears, nearby or remote options may still help.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:4582027900">
              <Button className="gap-2 w-full sm:w-auto">
                <Phone className="h-4 w-4" />
                Call Sober Helpline
              </Button>
            </a>
            <Link to="/family-consultation">
              <Button variant="outline" className="w-full sm:w-auto">
                Not sure? Book a family consultation
              </Button>
            </Link>
          </div>
        </section>

        <section className="max-w-4xl mx-auto mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 md:p-6">
          <h2 className="text-xl font-bold text-foreground">What should the family do next?</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            If your loved one is already willing to stay sober, use the directory below to compare sober coaches, companions, and sober living support. If they are refusing help, relapsing repeatedly, or the family is divided, start with a private consultation first so you do not hire the wrong level of support.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Link to="/intervention-help">
              <Button variant="outline" className="w-full sm:w-auto">Intervention help</Button>
            </Link>
            <Link to="/monday-zoom-registration">
              <Button variant="outline" className="w-full sm:w-auto">Join the free Monday Family Squares Zoom</Button>
            </Link>
          </div>
        </section>

        <div className="mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-semibold text-center mb-3 md:mb-4">
            {showStateMap && selectedState ? `Providers in ${selectedState}` : "Select a State to View Providers"}
          </h2>
          
          {/* Mobile: State dropdown and zip search */}
          <div className="md:hidden">
            <MobileStateSelector
              selectedState={selectedState}
              onStateSelect={handleStateClick}
            />
          </div>
          
          {/* Desktop: Interactive map */}
          <div className="hidden md:block">
            {showStateMap && selectedState ? (
              <StateMap
                stateName={selectedState}
                providers={providers}
                onBackToUSMap={handleBackToUSMap}
              />
            ) : (
              <USMap onStateClick={handleStateClick} selectedState={selectedState} category="Sober Coaches/Companions" />
            )}
          </div>
          
          {!selectedState && providers.length === 0 && (
          <div className="max-w-4xl mx-auto mt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-md space-y-2">
                <Label htmlFor="zipSearch">Search by Zip Code</Label>
                <Input
                  id="zipSearch"
                  type="text"
                  placeholder="Enter zip code"
                  value={zipCodeSearch}
                  onChange={(e) => setZipCodeSearch(e.target.value)}
                  maxLength={10}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleZipCodeSearch();
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button onClick={handleZipCodeSearch} size="lg">
                Search Providers
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground text-center mt-2">
              Or click a state on the map above
            </p>
          </div>
          )}
        </div>

        {(selectedState || (providers.length > 0 && zipCodeSearch)) && (
          <>
            <ProviderFilters 
              filters={filters} 
              onFiltersChange={handleFiltersChange}
              showInsurance={false}
              showGenderSpecific={false}
            />
            
            <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">
              {zipCodeSearch && !selectedState
                ? (showingNearby 
                    ? `Nearest Sober Coaches/Companions to ${zipCodeSearch}`
                    : `Sober Coaches/Companions within 100 miles of ${zipCodeSearch}`)
                : showingNearby 
                  ? `Nearest Sober Coaches/Companions to ${selectedState}` 
                  : `Sober Coaches/Companions in ${selectedState}`}
            </h3>
            {showingNearby && (
              <p className="text-muted-foreground mb-4">
                {zipCodeSearch && !selectedState
                  ? `No providers found within 100 miles of ${zipCodeSearch}. Showing the 3 geographically closest providers.`
                  : `No providers found in ${selectedState}. Showing the 3 geographically closest providers.`}
              </p>
            )}
            {loading ? (
              <p className="text-muted-foreground text-center">Loading providers...</p>
            ) : providers.length > 0 ? (
              <div className="space-y-4">
                {providers.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center">
                No approved providers found.
              </p>
            )}
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default SoberCoachesCompanions;
