import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Phone } from "lucide-react";
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
  phone_number: string;
  email: string;
  website: string | null;
  description_of_services: string | null;
  logo_url: string | null;
}

const InpatientTreatment = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showStateMap, setShowStateMap] = useState(false);
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
  const [selectedModality, setSelectedModality] = useState("All");
  const [militaryFirstResponder, setMilitaryFirstResponder] = useState("All");
  const [filters, setFilters] = useState({
    insurance: "All",
    maxBudget: "",
    zipCode: "",
    genderSpecific: [] as string[],
    lgbtSupportive: false,
    therapeuticModality: "All",
  });
  const { toast } = useToast();

  const fetchProviders = async (state: string, currentFilters = filters) => {
    setLoading(true);
    setShowingNearby(false);
    try {
      let query = supabase
        .from("provider_submissions")
        .select("*")
        .eq("category", "Inpatient Treatment")
        .eq("status", "approved")
        .eq("state", state);

      // Apply insurance filter from search form OR ProviderFilters
      const searchInsurance = insuranceSearch === "Other" ? customInsurance.trim() : insuranceSearch;
      const filterInsurance = currentFilters.insurance !== "All" ? currentFilters.insurance : null;
      const activeInsurance = searchInsurance !== "All" ? searchInsurance : filterInsurance;
      
      console.log("Insurance Filter Debug:", { 
        insuranceSearch, 
        searchInsurance, 
        filterInsurance: currentFilters.insurance,
        activeInsurance 
      });
      
      if (activeInsurance && activeInsurance !== "All") {
        console.log("Applying insurance filter:", activeInsurance);
        query = query.contains("insurances_accepted", [activeInsurance]);
      }

      // Apply budget filter for Self Pay
      if (insuranceSearch === "Self Pay" && maxBudget) {
        query = query.lte("cost", maxBudget);
      }

      // Apply gender specific filter from search form
      if (genderSpecificCare === "Yes" && genderType) {
        query = query.contains("gender_specific_treatment", [genderType]);
      }

      // Apply gender specific filter from ProviderFilters
      if (currentFilters.genderSpecific.length > 0) {
        query = query.overlaps("gender_specific_treatment", currentFilters.genderSpecific);
      }

      // Apply length of stay filter
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

      // Apply therapeutic modality filter from search form
      if (selectedModality !== "All") {
        query = query.contains("therapeutic_modalities", [selectedModality]);
      }

      // Apply therapeutic modality filter from ProviderFilters
      if (currentFilters.therapeuticModality && currentFilters.therapeuticModality !== "All") {
        query = query.contains("therapeutic_modalities", [currentFilters.therapeuticModality]);
      }

      // Apply military/first responder filter
      if (militaryFirstResponder === "Yes") {
        query = query.eq("military_first_responder_care", true);
      } else if (militaryFirstResponder === "No") {
        query = query.eq("military_first_responder_care", false);
      }

      const { data, error } = await query;

      console.log("Query results:", { 
        resultCount: data?.length || 0,
        activeInsurance,
        state 
      });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        await fetchNearbyProviders(state, currentFilters);
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

  const fetchNearbyProviders = async (selectedStateName: string, currentFilters = filters) => {
    try {
      let query = supabase
        .from("provider_submissions")
        .select("*")
        .eq("category", "Inpatient Treatment")
        .eq("status", "approved")
        .not("state", "eq", selectedStateName);

      // Apply same filters for nearby providers
      const searchInsurance = insuranceSearch === "Other" ? customInsurance.trim() : insuranceSearch;
      const filterInsurance = currentFilters.insurance !== "All" ? currentFilters.insurance : null;
      const activeInsurance = searchInsurance !== "All" ? searchInsurance : filterInsurance;
      
      if (activeInsurance && activeInsurance !== "All") {
        query = query.contains("insurances_accepted", [activeInsurance]);
      }
      if (insuranceSearch === "Self Pay" && maxBudget) {
        query = query.lte("cost", maxBudget);
      }
      if (genderSpecificCare === "Yes" && genderType) {
        query = query.contains("gender_specific_treatment", [genderType]);
      }
      // Apply gender specific filter from ProviderFilters
      if (currentFilters.genderSpecific.length > 0) {
        query = query.overlaps("gender_specific_treatment", currentFilters.genderSpecific);
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
      // Apply therapeutic modality filter from search form
      if (selectedModality !== "All") {
        query = query.contains("therapeutic_modalities", [selectedModality]);
      }
      // Apply therapeutic modality filter from ProviderFilters
      if (currentFilters.therapeuticModality && currentFilters.therapeuticModality !== "All") {
        query = query.contains("therapeutic_modalities", [currentFilters.therapeuticModality]);
      }

      // Apply military/first responder filter
      if (militaryFirstResponder === "Yes") {
        query = query.eq("military_first_responder_care", true);
      } else if (militaryFirstResponder === "No") {
        query = query.eq("military_first_responder_care", false);
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
    console.log("Filter changed!", { 
      newFilters, 
      selectedState,
      oldFilters: filters 
    });
    setFilters(newFilters);
    if (selectedState) {
      console.log("Fetching providers with new filters for state:", selectedState);
      fetchProviders(selectedState, newFilters);
    } else {
      console.log("No state selected, filters saved but not applied yet");
      toast({
        title: "Select a location first",
        description: "Please select a state on the map or enter a zip code to apply filters",
      });
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

    // Validate zip code exists
    const searchLocation = getZipCodeLocation(zipCodeSearch);
    if (!searchLocation) {
      toast({
        title: "Invalid Zip Code",
        description: "Could not find location for this zip code",
        variant: "destructive",
      });
      return;
    }

    // Validate custom insurance if "Other" is selected
    if (insuranceSearch === "Other" && !customInsurance.trim()) {
      toast({
        title: "Insurance Provider Required",
        description: "Please enter an insurance provider name",
        variant: "destructive",
      });
      return;
    }

    // Validate gender type if gender-specific care is selected
    if (genderSpecificCare === "Yes" && !genderType) {
      toast({
        title: "Gender Selection Required",
        description: "Please select either Men or Women for gender-specific care",
        variant: "destructive",
      });
      return;
    }

    // Validate budget if Self Pay is selected
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
      // Fetch all providers in category (without zip filter) to enable distance search
      let query = supabase
        .from("provider_submissions")
        .select("*")
        .eq("category", "Inpatient Treatment")
        .eq("status", "approved");

      // Apply insurance filter
      const searchInsurance = insuranceSearch === "Other" ? customInsurance.trim() : insuranceSearch;
      const filterInsurance = filters.insurance !== "All" ? filters.insurance : null;
      const activeInsurance = searchInsurance !== "All" ? searchInsurance : filterInsurance;
      
      if (activeInsurance && activeInsurance !== "All") {
        query = query.contains("insurances_accepted", [activeInsurance]);
      }

      // Apply gender-specific filter from search form
      if (genderSpecificCare === "Yes" && genderType) {
        query = query.contains("gender_specific_treatment", [genderType]);
      }

      // Apply gender specific filter from ProviderFilters
      if (filters.genderSpecific.length > 0) {
        query = query.overlaps("gender_specific_treatment", filters.genderSpecific);
      }

      // Apply budget filter for Self Pay
      if (insuranceSearch === "Self Pay" && maxBudget) {
        query = query.lte("cost", maxBudget);
      }

      // Apply length of stay filter
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

      // Apply therapeutic modality filter from search form
      if (selectedModality !== "All") {
        query = query.contains("therapeutic_modalities", [selectedModality]);
      }

      // Apply therapeutic modality filter from ProviderFilters
      if (filters.therapeuticModality && filters.therapeuticModality !== "All") {
        query = query.contains("therapeutic_modalities", [filters.therapeuticModality]);
      }

      // Apply military/first responder filter
      if (militaryFirstResponder === "Yes") {
        query = query.eq("military_first_responder_care", true);
      } else if (militaryFirstResponder === "No") {
        query = query.eq("military_first_responder_care", false);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Filter by distance (100 mile radius, fallback to 3 closest)
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
        const genderText = genderSpecificCare === "Yes" ? ` with ${genderType} specific care` : "";
        const lengthText = lengthOfStay !== "All" ? ` with ${lengthOfStay} length of stay` : "";
        toast({
          title: "No providers found",
          description: `No providers found near zip code ${zipCodeSearch}${insuranceSearch !== "All" ? ` that accept ${insuranceText}` : ""}${genderText}${lengthText}`,
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
            <Building2 className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">Inpatient Treatment</h1>
          </div>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Find comprehensive residential treatment programs offering 24/7 care and support for addiction recovery.
          </p>
        </div>

        <div className="mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-semibold text-center mb-3 md:mb-4">
            {showStateMap && selectedState ? `Providers in ${selectedState}` : "Select a State to View Providers"}
          </h2>
          <div className="overflow-x-auto">
            {showStateMap && selectedState ? (
              <StateMap
                stateName={selectedState}
                providers={providers}
                onBackToUSMap={handleBackToUSMap}
              />
            ) : (
              <USMap onStateClick={handleStateClick} selectedState={selectedState} category="Inpatient Treatment" />
            )}
          </div>
          
          <div className="max-w-6xl mx-auto mt-4 md:mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipSearch">Search by Zip Code</Label>
                <div className="flex gap-2">
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

              <div className="space-y-2">
                <Label htmlFor="modalitySearch">Therapeutic Modality</Label>
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

              <div className="space-y-2">
                <Label htmlFor="militaryFirstResponder">Military/First Responder Services?</Label>
                <Select
                  value={militaryFirstResponder}
                  onValueChange={setMilitaryFirstResponder}
                >
                  <SelectTrigger id="militaryFirstResponder" className="bg-background">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
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
            <ProviderFilters filters={filters} onFiltersChange={handleFiltersChange} showTherapeuticModality={true} />
            
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">
                {zipCodeSearch && !selectedState
                  ? (showingNearby 
                      ? `Nearest Inpatient Treatment Providers to ${zipCodeSearch}`
                      : `Inpatient Treatment Providers within 100 miles of ${zipCodeSearch}`)
                  : showingNearby 
                    ? `Nearest Inpatient Treatment Providers to ${selectedState}` 
                    : `Inpatient Treatment Providers in ${selectedState}`}
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

export default InpatientTreatment;
