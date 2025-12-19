import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { stateCoordinates } from "@/utils/stateCoordinates";
import zipcodes from "zipcodes";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface USMapProps {
  onStateClick: (stateName: string) => void;
  selectedState: string | null;
  category?: string;
}

// State abbreviation mapping
const stateAbbreviations: Record<string, string> = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
  "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
  "Wisconsin": "WI", "Wyoming": "WY"
};

// Reverse mapping: abbreviation to full name
const abbreviationToState: Record<string, string> = Object.entries(stateAbbreviations).reduce(
  (acc, [name, abbr]) => ({ ...acc, [abbr]: name }),
  {}
);

// State color mapping using 16 muted colors
// Ensuring no adjacent states share the same color
const stateColors: Record<string, string> = {
  // Color 1 - Muted Blue
  "Connecticut": "hsl(210, 35%, 55%)",
  "Nevada": "hsl(210, 35%, 55%)",
  "South Dakota": "hsl(210, 35%, 55%)",
  
  // Color 2 - Muted Sage Green
  "Arkansas": "hsl(145, 30%, 50%)",
  "Minnesota": "hsl(145, 30%, 50%)",
  "Ohio": "hsl(145, 30%, 50%)",
  
  // Color 3 - Muted Amber
  "Colorado": "hsl(40, 40%, 55%)",
  "Mississippi": "hsl(40, 40%, 55%)",
  "Wisconsin": "hsl(40, 40%, 55%)",
  
  // Color 4 - Muted Lavender
  "Nebraska": "hsl(270, 30%, 60%)",
  "Virginia": "hsl(270, 30%, 60%)",
  
  // Color 5 - Muted Rose
  "Arizona": "hsl(350, 35%, 58%)",
  "Kentucky": "hsl(350, 35%, 58%)",
  "Rhode Island": "hsl(350, 35%, 58%)",
  
  // Color 6 - Muted Teal
  "Florida": "hsl(180, 30%, 50%)",
  "Michigan": "hsl(180, 30%, 50%)",
  "Oregon": "hsl(180, 30%, 50%)",
  
  // Color 7 - Muted Indigo
  "California": "hsl(240, 30%, 58%)",
  "Louisiana": "hsl(240, 30%, 58%)",
  "Vermont": "hsl(240, 30%, 58%)",
  
  // Color 8 - Muted Coral
  "Hawaii": "hsl(25, 40%, 55%)",
  "Missouri": "hsl(25, 40%, 55%)",
  "New Mexico": "hsl(25, 40%, 55%)",
  
  // Color 9 - Muted Slate Blue
  "Alabama": "hsl(220, 30%, 52%)",
  "Maine": "hsl(220, 30%, 52%)",
  "Wyoming": "hsl(220, 30%, 52%)",
  
  // Color 10 - Muted Olive
  "Idaho": "hsl(80, 25%, 48%)",
  "New Jersey": "hsl(80, 25%, 48%)",
  "Washington": "hsl(80, 25%, 48%)",
  
  // Color 11 - Muted Mauve
  "Georgia": "hsl(320, 25%, 55%)",
  "North Dakota": "hsl(320, 25%, 55%)",
  "Utah": "hsl(320, 25%, 55%)",
  
  // Color 12 - Muted Steel
  "Pennsylvania": "hsl(200, 25%, 55%)",
  "Alaska": "hsl(200, 25%, 55%)",
  "Tennessee": "hsl(200, 25%, 55%)",
  
  // Color 13 - Muted Bronze
  "Delaware": "hsl(35, 35%, 50%)",
  "Montana": "hsl(35, 35%, 50%)",
  "Texas": "hsl(35, 35%, 50%)",
  
  // Color 14 - Muted Seafoam
  "Iowa": "hsl(160, 28%, 52%)",
  "New York": "hsl(160, 28%, 52%)",
  "West Virginia": "hsl(160, 28%, 52%)",
  
  // Color 15 - Muted Plum
  "Kansas": "hsl(280, 25%, 55%)",
  "Massachusetts": "hsl(280, 25%, 55%)",
  "Oklahoma": "hsl(280, 25%, 55%)",
  
  // Color 16 - Muted Terracotta
  "Illinois": "hsl(15, 35%, 52%)",
  "Indiana": "hsl(15, 35%, 52%)",
  "New Hampshire": "hsl(15, 35%, 52%)",
  "North Carolina": "hsl(15, 35%, 52%)",
  "South Carolina": "hsl(15, 35%, 52%)",
  "Maryland": "hsl(15, 35%, 52%)",
};

interface ProviderLocation {
  id: string;
  state: string;
  city: string | null;
  providerName: string;
  coordinates: [number, number]; // [lng, lat] for react-simple-maps
}

const USMap = ({ onStateClick, selectedState, category }: USMapProps) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [providerLocations, setProviderLocations] = useState<ProviderLocation[]>([]);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch provider locations when category changes
  useEffect(() => {
    const fetchProviderLocations = async () => {
      if (!category) return;

      const { data, error } = await supabase
        .from('provider_submissions_public')
        .select('id, state, zip_code, city, provider_name')
        .eq('category', category)
        .eq('status', 'approved')
        .not('state', 'is', null);

      if (error) {
        console.error('Error fetching provider locations:', error);
        return;
      }

      // Group by state first
      const providersByState: Record<string, typeof data> = {};
      data?.forEach(provider => {
        if (provider.state) {
          const fullStateName = abbreviationToState[provider.state] || provider.state;
          if (!providersByState[fullStateName]) {
            providersByState[fullStateName] = [];
          }
          providersByState[fullStateName].push(provider);
        }
      });

      // Limit to 6 per state and get coordinates
      const locations: ProviderLocation[] = [];
      
      Object.entries(providersByState).forEach(([stateName, providers]) => {
        // Take up to 6 providers per state
        const limitedProviders = providers.slice(0, 6);
        
        limitedProviders.forEach((provider, index) => {
          let coords: [number, number] | null = null;
          
          // Try to get coordinates from zip code
          if (provider.zip_code) {
            const zipInfo = zipcodes.lookup(provider.zip_code);
            if (zipInfo && zipInfo.latitude && zipInfo.longitude) {
              coords = [zipInfo.longitude, zipInfo.latitude];
            }
          }
          
          // Fall back to state centroid with slight offset for multiple providers
          if (!coords) {
            const stateCoords = stateCoordinates[stateName];
            if (stateCoords) {
              // Add slight random offset to avoid overlapping dots
              const offset = index * 0.5;
              const angle = (index * 60) * (Math.PI / 180);
              coords = [
                stateCoords.lng + Math.cos(angle) * offset,
                stateCoords.lat + Math.sin(angle) * offset
              ];
            }
          }
          
          if (coords) {
            locations.push({
              id: provider.id,
              state: stateName,
              city: provider.city,
              providerName: provider.provider_name,
              coordinates: coords
            });
          }
        });
      });

      setProviderLocations(locations);
    };

    fetchProviderLocations();
  }, [category]);

  const handleMouseEnter = (stateName: string, event: React.MouseEvent) => {
    setHoveredState(stateName);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set timeout to show tooltip after 2 seconds
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);
  };

  const handleMouseLeave = () => {
    setHoveredState(null);
    setShowTooltip(false);
    
    // Clear timeout if user leaves before 2 seconds
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (showTooltip) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  return (
    <div className="w-full max-w-[672px] mx-auto bg-card rounded-lg border-2 border-primary/20 shadow-lg p-5 relative">
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isSelected = selectedState === geo.properties.name;
              const stateName = geo.properties.name;
              const stateColor = stateColors[stateName] || "hsl(200, 20%, 70%)";
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onStateClick(geo.properties.name)}
                  onMouseEnter={(e) => handleMouseEnter(stateName, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                  style={{
                    default: {
                      fill: isSelected ? "hsl(var(--primary))" : stateColor,
                      stroke: "hsl(var(--border))",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "hsl(var(--primary) / 0.8)",
                      stroke: "hsl(var(--border))",
                      strokeWidth: 0.75,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "hsl(var(--primary))",
                      stroke: "hsl(var(--border))",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
        
        {/* Provider location dots */}
        {providerLocations.map((location) => (
          <Marker key={location.id} coordinates={location.coordinates}>
            <circle
              r={5}
              fill="hsl(var(--logo-green))"
              stroke="hsl(var(--background))"
              strokeWidth={1.5}
              style={{ 
                cursor: 'pointer',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onStateClick(location.state);
              }}
            />
          </Marker>
        ))}
      </ComposableMap>
      
      {/* Tooltip */}
      {showTooltip && hoveredState && (
        <div
          className="fixed z-50 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-semibold shadow-lg pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 30}px`,
          }}
        >
          {stateAbbreviations[hoveredState]}
        </div>
      )}
    </div>
  );
};

export default USMap;
