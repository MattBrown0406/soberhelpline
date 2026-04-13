import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Brain, Phone, ExternalLink, MessageCircle, Video, Clock, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import USMap from "@/components/USMap";
import StateMap from "@/components/StateMap";
import ProviderCard from "@/components/ProviderCard";
import CategoryNav from "@/components/CategoryNav";
import CategoryMobileNav from "@/components/CategoryMobileNav";
import MobileStateSelector from "@/components/MobileStateSelector";
import { useToast } from "@/hooks/use-toast";
import { stateCoordinates, calculateDistance } from "@/utils/stateCoordinates";
import { filterProvidersByDistance, getZipCodeLocation } from "@/utils/zipCodeSearch";
import logo from "@/assets/logo.png";
import betterHelpLogo from "@/assets/betterhelp-logo.png";

const therapeuticModalities = [
  "All",
  "CBT (Cognitive Behavioral Therapy)",
  "DBT (Dialectical Behavior Therapy)",
  "EMDR",
  "Equine Therapy",
  "Family Therapy",
  "Group Therapy",
  "IFS (Internal Family Systems)",
  "Individual Therapy",
  "Mindfulness Based Therapy",
  "Motivational Interviewing",
  "Psychodynamic Therapy",
  "Somatic and Experiential Therapy",
];

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

const Therapists = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showStateMap, setShowStateMap] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [showingNearby, setShowingNearby] = useState(false);
  const [zipCodeSearch, setZipCodeSearch] = useState("");
  const [selectedModality, setSelectedModality] = useState("All");
  const { toast } = useToast();

  const fetchProviders = async (state: string) => {
    setLoading(true);
    setShowingNearby(false);
    try {
      let query = supabase
        .from("provider_submissions_public")
        .select("*")
        .eq("category", "Therapists")
        .eq("status", "approved")
        .eq("state", state);

      // Apply therapeutic modality filter
      if (selectedModality !== "All") {
        query = query.contains("therapeutic_modalities", [selectedModality]);
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
        .eq("category", "Therapists")
        .eq("status", "approved")
        .not("state", "eq", selectedStateName);

      // Apply therapeutic modality filter for nearby providers
      if (selectedModality !== "All") {
        query = query.contains("therapeutic_modalities", [selectedModality]);
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
      let query = supabase
        .from("provider_submissions_public")
        .select("*")
        .eq("category", "Therapists")
        .eq("status", "approved");

      // Apply therapeutic modality filter
      if (selectedModality !== "All") {
        query = query.contains("therapeutic_modalities", [selectedModality]);
      }

      const { data, error } = await query;

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
        const modalityText = selectedModality !== "All" ? ` offering ${selectedModality}` : "";
        toast({
          title: "No providers found",
          description: `No providers found near zip code ${zipCodeSearch}${modalityText}`,
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
        title="Find Addiction Therapists | Sober Helpline"
        description="Find therapists specializing in addiction and family recovery. Browse vetted mental health professionals for lasting support."
        jsonLd={{ "@context": "https://schema.org", "@type": "MedicalWebPage", "name": "Addiction Therapists Directory", "url": "https://soberhelpline.com/therapists", "publisher": { "@type": "Organization", "name": "Sober Helpline" } }}
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
          <a href="tel:5412415668" className="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
            <Phone className="w-4 h-4" />
            <span className="font-medium text-sm">(541) 241-5668</span>
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
            <a href="tel:5412415668" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">(541) 241-5668</span>
            </a>
            <img src={logo} alt="Sober Helpline" className="h-24 w-24 object-contain" />
          </div>
        </div>

        <div className="text-center mb-4 md:mb-6">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
            <Brain className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">Therapists</h1>
          </div>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Connect with licensed therapists specializing in addiction, trauma, and mental health support.
          </p>
        </div>

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
              <USMap onStateClick={handleStateClick} selectedState={selectedState} category="Therapists" />
            )}
          </div>
          
          {!selectedState && providers.length === 0 && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label htmlFor="modalitySearch">Search by Therapeutic Modality</Label>
                <Select
                  value={selectedModality}
                  onValueChange={setSelectedModality}
                >
                  <SelectTrigger id="modalitySearch" className="bg-background">
                    <SelectValue placeholder="Select modality" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50 max-h-60">
                    {therapeuticModalities.map((modality) => (
                      <SelectItem key={modality} value={modality}>
                        {modality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            {/* BetterHelp Promotion */}
            <Card className="mt-6 overflow-hidden border-0 shadow-xl max-w-2xl mx-auto">
              <div className="bg-[#3F5F4F] p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo and headline */}
                  <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                    <div className="bg-white rounded-lg p-4 mb-3">
                      <img 
                        src={betterHelpLogo} 
                        alt="BetterHelp" 
                        className="h-12 md:h-16 w-auto object-contain"
                      />
                    </div>
                    <p className="text-white/90 text-sm font-medium">World's Largest Therapy Service</p>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                      You deserve to be happy.
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      While we're adding therapists to our directory, get matched with a licensed therapist online. 
                      <span className="font-semibold text-[#C4A962]"> Get 10% off your first month!</span>
                    </p>
                    
                    {/* Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                      <div className="flex items-center gap-2 text-white/90 text-xs">
                        <Users className="w-4 h-4 text-[#C4A962]" />
                        <span>32,000+ Therapists</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-xs">
                        <MessageCircle className="w-4 h-4 text-[#C4A962]" />
                        <span>Message Anytime</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-xs">
                        <Video className="w-4 h-4 text-[#C4A962]" />
                        <span>Video Sessions</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-xs">
                        <CheckCircle className="w-4 h-4 text-[#C4A962]" />
                        <span>HSA/FSA Accepted</span>
                      </div>
                    </div>
                    
                    <a
                      href="https://betterhelp.com/partywreckers"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-white text-[#3F5F4F] hover:bg-white/90 font-semibold gap-2">
                        Get Started
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
        </div>

        {(selectedState || (providers.length > 0 && zipCodeSearch)) && (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">
              {zipCodeSearch && !selectedState
                ? (showingNearby 
                    ? `Nearest Therapists to ${zipCodeSearch}`
                    : `Therapists within 100 miles of ${zipCodeSearch}`)
                : showingNearby 
                  ? `Nearest Therapists to ${selectedState}` 
                  : `Therapists in ${selectedState}`}
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
        )}
      </div>
    </div>
    </>
  );
};

export default Therapists;
