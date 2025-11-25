import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import USMap from "@/components/USMap";
import ProviderCard from "@/components/ProviderCard";
import ProviderFilters from "@/components/ProviderFilters";
import { useToast } from "@/hooks/use-toast";
import { stateCoordinates, calculateDistance } from "@/utils/stateCoordinates";
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

const OutpatientTreatment = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [showingNearby, setShowingNearby] = useState(false);
  const [zipCodeSearch, setZipCodeSearch] = useState("");
  const [insuranceSearch, setInsuranceSearch] = useState("All");
  const [customInsurance, setCustomInsurance] = useState("");
  const [genderSpecificCare, setGenderSpecificCare] = useState("No");
  const [genderType, setGenderType] = useState("");
  const [lengthOfStay, setLengthOfStay] = useState("All");
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
        .eq("category", "Outpatient Treatment")
        .eq("status", "approved")
        .eq("state", state);

      if (filters.insurance !== "All") {
        query = query.contains("insurances_accepted", [filters.insurance]);
      }
      if (filters.maxBudget) {
        query = query.lte("cost", filters.maxBudget);
      }
      if (filters.zipCode) {
        query = query.eq("zip_code", filters.zipCode);
      }
      if (filters.genderSpecific.length > 0) {
        query = query.overlaps("gender_specific_treatment", filters.genderSpecific);
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
        .from("provider_submissions")
        .select("*")
        .eq("category", "Outpatient Treatment")
        .eq("status", "approved")
        .not("state", "eq", selectedStateName);

      if (filters.insurance !== "All") {
        query = query.contains("insurances_accepted", [filters.insurance]);
      }
      if (filters.maxBudget) {
        query = query.lte("cost", filters.maxBudget);
      }
      if (filters.genderSpecific.length > 0) {
        query = query.overlaps("gender_specific_treatment", filters.genderSpecific);
      }
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
    fetchProviders(stateName);
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

    if (insuranceSearch === "Other" && !customInsurance.trim()) {
      toast({
        title: "Insurance Provider Required",
        description: "Please enter an insurance provider name",
        variant: "destructive",
      });
      return;
    }

    if (genderSpecificCare === "Yes" && !genderType) {
      toast({
        title: "Gender Selection Required",
        description: "Please select either Men or Women for gender-specific care",
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
        .eq("category", "Outpatient Treatment")
        .eq("status", "approved")
        .eq("zip_code", zipCodeSearch);

      const searchInsurance = insuranceSearch === "Other" ? customInsurance.trim() : insuranceSearch;
      if (insuranceSearch !== "All") {
        query = query.contains("insurances_accepted", [searchInsurance]);
      }

      if (genderSpecificCare === "Yes" && genderType) {
        query = query.contains("gender_specific_treatment", [genderType]);
      }

      if (insuranceSearch === "Self Pay" && maxBudget) {
        query = query.lte("cost", maxBudget);
      }

      if (lengthOfStay !== "All") {
        if (lengthOfStay === "30 days") {
          query = query.ilike("length_of_services", "%30%");
        } else if (lengthOfStay === "60 days") {
          query = query.ilike("length_of_services", "%60%");
        } else if (lengthOfStay === "90 days") {
          query = query.ilike("length_of_services", "%90%");
        } else if (lengthOfStay === "longer than 90 days") {
          query = query.or("length_of_services.ilike.%120%,length_of_services.ilike.%6 month%,length_of_services.ilike.%180%,length_of_services.ilike.%long term%,length_of_services.ilike.%extended%");
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setProviders(data || []);
      
      if (!data || data.length === 0) {
        const insuranceText = insuranceSearch === "Other" ? customInsurance : insuranceSearch;
        const genderText = genderSpecificCare === "Yes" ? ` with ${genderType} specific care` : "";
        const lengthText = lengthOfStay !== "All" ? ` with ${lengthOfStay} length of stay` : "";
        toast({
          title: "No providers found",
          description: `No providers found in zip code ${zipCodeSearch}${insuranceSearch !== "All" ? ` that accept ${insuranceText}` : ""}${genderText}${lengthText}`,
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <img src={logo} alt="Sober Helpline" className="h-24 w-24 object-contain" />
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Home className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Outpatient Treatment</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover flexible outpatient programs that allow you to maintain daily responsibilities while receiving treatment.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Select a State to View Providers
          </h2>
          <USMap onStateClick={handleStateClick} selectedState={selectedState} />
          
          <div className="max-w-4xl mx-auto mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="genderCare">Gender Specific Care Needed?</Label>
                <Select
                  value={genderSpecificCare}
                  onValueChange={setGenderSpecificCare}
                >
                  <SelectTrigger id="genderCare" className="bg-background">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
                {genderSpecificCare === "Yes" && (
                  <Select
                    value={genderType}
                    onValueChange={setGenderType}
                  >
                    <SelectTrigger className="bg-background mt-2">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="Men">Men</SelectItem>
                      <SelectItem value="Women">Women</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lengthOfStay">Length of Stay</Label>
                <Select
                  value={lengthOfStay}
                  onValueChange={setLengthOfStay}
                >
                  <SelectTrigger id="lengthOfStay" className="bg-background">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="30 days">30 days</SelectItem>
                    <SelectItem value="60 days">60 days</SelectItem>
                    <SelectItem value="90 days">90 days</SelectItem>
                    <SelectItem value="longer than 90 days">Longer than 90 days</SelectItem>
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
        </div>

        {(selectedState || (providers.length > 0 && zipCodeSearch)) && (
          <>
            <ProviderFilters filters={filters} onFiltersChange={handleFiltersChange} />
            
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">
                {zipCodeSearch && !selectedState
                  ? `Providers in Zip Code ${zipCodeSearch}`
                  : showingNearby 
                    ? `Nearest Outpatient Treatment Providers to ${selectedState}` 
                    : `Outpatient Treatment Providers in ${selectedState}`}
              </h3>
              {showingNearby && (
                <p className="text-muted-foreground mb-4">
                  No providers found in {selectedState}. Showing the 3 geographically closest providers.
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

export default OutpatientTreatment;
