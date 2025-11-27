import { Button } from "@/components/ui/button";
import { ArrowLeft, Pill, Phone } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { stateCoordinates, calculateDistance } from "@/utils/stateCoordinates";
import { filterProvidersByDistance, getZipCodeLocation } from "@/utils/zipCodeSearch";
import logo from "@/assets/logo.png";

const insuranceProviders = [
  "All",
  "Self Pay",
  "UnitedHealthcare",
  "Anthem/Blue Cross Blue Shield",
  "Aetna",
  "Cigna",
  "Humana",
  "Kaiser Permanente",
  "Centene",
  "Molina Healthcare",
  "WellCare",
  "Highmark",
  "Blue Cross",
  "Health Care Service Corporation (HCSC)",
  "CareSource",
  "Tricare",
  "Medicaid",
  "Blue Shield",
  "Magellan Health",
  "Beacon Health Options",
  "Optum",
  "Ambetter",
  "Oscar Health",
  "Bright Health",
  "Friday Health Plans",
  "Moda",
  "Pacific Source",
  "Other",
];

interface Provider {
  id: string;
  provider_name: string;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone_number: string;
  email: string;
  website: string | null;
  description_of_services: string | null;
  logo_url: string | null;
}

const MedicalDetox = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showStateMap, setShowStateMap] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [showingNearby, setShowingNearby] = useState(false);
  const [zipCodeSearch, setZipCodeSearch] = useState("");
  const [insuranceSearch, setInsuranceSearch] = useState("All");
  const [customInsurance, setCustomInsurance] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
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
        .from("provider_submissions")
        .select("*")
        .eq("category", "Medical Detox")
        .eq("status", "approved")
        .eq("state", state);

      // Apply insurance filter from search form
      const searchInsurance = insuranceSearch === "Other" ? customInsurance.trim() : insuranceSearch;
      if (insuranceSearch !== "All" && searchInsurance) {
        query = query.contains("insurances_accepted", [searchInsurance]);
      }

      // Apply budget filter for Self Pay
      if (insuranceSearch === "Self Pay" && maxBudget) {
        query = query.lte("cost", maxBudget);
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
        .from("provider_submissions")
        .select("*")
        .eq("category", "Medical Detox")
        .eq("status", "approved")
        .not("state", "eq", selectedStateName);

      // Apply same filters for nearby providers
      const searchInsurance = insuranceSearch === "Other" ? customInsurance.trim() : insuranceSearch;
      if (insuranceSearch !== "All" && searchInsurance) {
        query = query.contains("insurances_accepted", [searchInsurance]);
      }
      if (insuranceSearch === "Self Pay" && maxBudget) {
        query = query.lte("cost", maxBudget);
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

    if (insuranceSearch === "Other" && !customInsurance.trim()) {
      toast({
        title: "Insurance Provider Required",
        description: "Please enter an insurance provider name",
        variant: "destructive",
      });
      return;
    }

    if (insuranceSearch === "Self Pay" && !maxBudget) {
      toast({
        title: "Budget Required",
        description: "Please enter your maximum monthly budget for Self Pay",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setShowingNearby(false);
    setSelectedState(null);
    
    try {
      let query = supabase
        .from("provider_submissions")
        .select("*")
        .eq("category", "Medical Detox")
        .eq("status", "approved");

      const searchInsurance = insuranceSearch === "Other" ? customInsurance.trim() : insuranceSearch;
      if (insuranceSearch !== "All") {
        query = query.contains("insurances_accepted", [searchInsurance]);
      }

      if (insuranceSearch === "Self Pay" && maxBudget) {
        query = query.lte("cost", maxBudget);
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
        const insuranceText = insuranceSearch === "Other" ? customInsurance : insuranceSearch;
        toast({
          title: "No providers found",
          description: `No providers found near zip code ${zipCodeSearch}${insuranceSearch !== "All" ? ` that accept ${insuranceText}` : ""}`,
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
          <a href="tel:5412415886" className="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
            <Phone className="w-4 h-4" />
            <span className="font-medium text-sm">(541) 241-5886</span>
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
            <a href="tel:5412415886" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">(541) 241-5886</span>
            </a>
            <img src={logo} alt="Sober Helpline" className="h-24 w-24 object-contain" />
          </div>
        </div>

        <div className="text-center mb-4 md:mb-6">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
            <Pill className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">Medical Detox</h1>
          </div>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Find medically supervised detoxification programs offering safe withdrawal management and 24/7 medical care.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-center mb-4">
            {showStateMap && selectedState ? `Providers in ${selectedState}` : "Select a State to View Providers"}
          </h2>
          {showStateMap && selectedState ? (
            <StateMap
              stateName={selectedState}
              providers={providers}
              onBackToUSMap={handleBackToUSMap}
            />
          ) : (
            <USMap onStateClick={handleStateClick} selectedState={selectedState} />
          )}
          
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
                <Label htmlFor="insuranceSearch">Search by Insurance</Label>
                <Select
                  value={insuranceSearch}
                  onValueChange={setInsuranceSearch}
                >
                  <SelectTrigger id="insuranceSearch" className="bg-background">
                    <SelectValue placeholder="Select insurance" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50 max-h-60">
                    {insuranceProviders.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {insuranceSearch === "Other" && (
                  <Input
                    type="text"
                    placeholder="Enter insurance provider name"
                    value={customInsurance}
                    onChange={(e) => setCustomInsurance(e.target.value)}
                    className="mt-2"
                  />
                )}
                {insuranceSearch === "Self Pay" && (
                  <div className="mt-2">
                    <Label htmlFor="budget" className="text-sm">Maximum Monthly Budget</Label>
                    <Input
                      id="budget"
                      type="text"
                      placeholder="Enter amount"
                      value={maxBudget}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setMaxBudget(value);
                      }}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">$ amount per month</p>
                  </div>
                )}
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
        </div>

        {(selectedState || (providers.length > 0 && zipCodeSearch)) && (
          <>
            <ProviderFilters filters={filters} onFiltersChange={handleFiltersChange} />
            
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">
                {zipCodeSearch && !selectedState
                  ? (showingNearby 
                      ? `Nearest Medical Detox Providers to ${zipCodeSearch}`
                      : `Medical Detox Providers within 100 miles of ${zipCodeSearch}`)
                  : showingNearby 
                    ? `Nearest Medical Detox Providers to ${selectedState}` 
                    : `Medical Detox Providers in ${selectedState}`}
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
  );
};

export default MedicalDetox;
