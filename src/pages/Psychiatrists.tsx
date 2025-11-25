import { Button } from "@/components/ui/button";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import USMap from "@/components/USMap";
import ProviderCard from "@/components/ProviderCard";
import { useToast } from "@/hooks/use-toast";
import { stateCoordinates, calculateDistance } from "@/utils/stateCoordinates";

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

const Psychiatrists = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [showingNearby, setShowingNearby] = useState(false);
  const { toast } = useToast();

  const fetchProviders = async (state: string) => {
    setLoading(true);
    setShowingNearby(false);
    try {
      const { data, error } = await supabase
        .from("provider_submissions")
        .select("*")
        .eq("category", "Psychiatrists")
        .eq("status", "approved")
        .eq("state", state);

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
      const { data, error } = await supabase
        .from("provider_submissions")
        .select("*")
        .eq("category", "Psychiatrists")
        .eq("status", "approved")
        .not("state", "eq", selectedStateName);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Stethoscope className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Psychiatrists</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find psychiatrists who specialize in addiction medicine and dual diagnosis treatment.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Select a State to View Providers
          </h2>
          <USMap onStateClick={handleStateClick} selectedState={selectedState} />
        </div>

        {selectedState && (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">
              {showingNearby 
                ? `Nearest Psychiatrists to ${selectedState}` 
                : `Psychiatrists in ${selectedState}`}
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
        )}
      </div>
    </div>
  );
};

export default Psychiatrists;
