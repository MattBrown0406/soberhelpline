import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { useState } from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import zipcodes from "zipcodes";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// State FIPS codes for filtering
const stateFips: Record<string, string> = {
  "Alabama": "01", "Alaska": "02", "Arizona": "04", "Arkansas": "05",
  "California": "06", "Colorado": "08", "Connecticut": "09", "Delaware": "10",
  "Florida": "12", "Georgia": "13", "Hawaii": "15", "Idaho": "16",
  "Illinois": "17", "Indiana": "18", "Iowa": "19", "Kansas": "20",
  "Kentucky": "21", "Louisiana": "22", "Maine": "23", "Maryland": "24",
  "Massachusetts": "25", "Michigan": "26", "Minnesota": "27", "Mississippi": "28",
  "Missouri": "29", "Montana": "30", "Nebraska": "31", "Nevada": "32",
  "New Hampshire": "33", "New Jersey": "34", "New Mexico": "35", "New York": "36",
  "North Carolina": "37", "North Dakota": "38", "Ohio": "39", "Oklahoma": "40",
  "Oregon": "41", "Pennsylvania": "42", "Rhode Island": "44", "South Carolina": "45",
  "South Dakota": "46", "Tennessee": "47", "Texas": "48", "Utah": "49",
  "Vermont": "50", "Virginia": "51", "Washington": "53", "West Virginia": "54",
  "Wisconsin": "55", "Wyoming": "56", "District of Columbia": "11"
};

// State center coordinates and zoom levels for projection
const stateProjectionConfig: Record<string, { center: [number, number]; scale: number }> = {
  "Alabama": { center: [-86.9, 32.8], scale: 4000 },
  "Alaska": { center: [-154, 64], scale: 800 },
  "Arizona": { center: [-111.9, 34.2], scale: 3000 },
  "Arkansas": { center: [-92.4, 34.8], scale: 4500 },
  "California": { center: [-119.5, 37.5], scale: 2000 },
  "Colorado": { center: [-105.5, 39], scale: 3500 },
  "Connecticut": { center: [-72.7, 41.6], scale: 12000 },
  "Delaware": { center: [-75.5, 39], scale: 14000 },
  "Florida": { center: [-82, 28], scale: 3000 },
  "Georgia": { center: [-83.5, 32.7], scale: 4000 },
  "Hawaii": { center: [-157, 20], scale: 4000 },
  "Idaho": { center: [-114.5, 44.5], scale: 2500 },
  "Illinois": { center: [-89.5, 40], scale: 3000 },
  "Indiana": { center: [-86.3, 39.8], scale: 4500 },
  "Iowa": { center: [-93.5, 42], scale: 4000 },
  "Kansas": { center: [-98.5, 38.5], scale: 3500 },
  "Kentucky": { center: [-85.5, 37.8], scale: 4500 },
  "Louisiana": { center: [-92, 31], scale: 4500 },
  "Maine": { center: [-69, 45.3], scale: 4000 },
  "Maryland": { center: [-77, 39], scale: 7000 },
  "Massachusetts": { center: [-71.8, 42.2], scale: 9000 },
  "Michigan": { center: [-85, 44.5], scale: 2800 },
  "Minnesota": { center: [-94.5, 46], scale: 2800 },
  "Mississippi": { center: [-89.7, 32.7], scale: 4000 },
  "Missouri": { center: [-92.5, 38.4], scale: 3500 },
  "Montana": { center: [-110, 47], scale: 2500 },
  "Nebraska": { center: [-99.8, 41.5], scale: 3200 },
  "Nevada": { center: [-117, 39], scale: 2800 },
  "New Hampshire": { center: [-71.5, 43.8], scale: 6500 },
  "New Jersey": { center: [-74.5, 40.2], scale: 7500 },
  "New Mexico": { center: [-106, 34.5], scale: 3000 },
  "New York": { center: [-75.5, 43], scale: 3200 },
  "North Carolina": { center: [-79.5, 35.5], scale: 4500 },
  "North Dakota": { center: [-100.5, 47.5], scale: 4000 },
  "Ohio": { center: [-82.8, 40.2], scale: 5000 },
  "Oklahoma": { center: [-97.5, 35.5], scale: 4000 },
  "Oregon": { center: [-120.5, 44], scale: 3200 },
  "Pennsylvania": { center: [-77.5, 41], scale: 4500 },
  "Rhode Island": { center: [-71.5, 41.6], scale: 20000 },
  "South Carolina": { center: [-80.9, 33.8], scale: 5500 },
  "South Dakota": { center: [-100, 44.5], scale: 3500 },
  "Tennessee": { center: [-86, 35.8], scale: 4500 },
  "Texas": { center: [-99.5, 31.5], scale: 1800 },
  "Utah": { center: [-111.5, 39.3], scale: 3200 },
  "Vermont": { center: [-72.7, 44], scale: 7000 },
  "Virginia": { center: [-79, 37.5], scale: 4500 },
  "Washington": { center: [-120.5, 47.3], scale: 3500 },
  "West Virginia": { center: [-80.6, 38.9], scale: 5500 },
  "Wisconsin": { center: [-89.8, 44.5], scale: 3500 },
  "Wyoming": { center: [-107.5, 43], scale: 3500 },
  "District of Columbia": { center: [-77, 38.9], scale: 100000 }
};

interface ProviderBase {
  id: string;
  provider_name: string;
  zip_code?: string | null;
  city?: string | null;
  state?: string | null;
}

interface StateMapProps {
  stateName: string;
  providers: ProviderBase[];
  onBackToUSMap: () => void;
  onProviderClick?: (provider: ProviderBase) => void;
}

const StateMap = ({ stateName, providers, onBackToUSMap, onProviderClick }: StateMapProps) => {
  const [hoveredProvider, setHoveredProvider] = useState<ProviderBase | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const config = stateProjectionConfig[stateName] || { center: [-98, 39], scale: 1000 };
  const fipsCode = stateFips[stateName];

  // Get provider coordinates from zip codes
  const providerMarkers = providers
    .filter(p => p.zip_code)
    .map(provider => {
      const zipInfo = zipcodes.lookup(provider.zip_code!);
      if (zipInfo) {
        return {
          provider,
          coordinates: [zipInfo.longitude, zipInfo.latitude] as [number, number]
        };
      }
      return null;
    })
    .filter((item): item is { provider: ProviderBase; coordinates: [number, number] } => item !== null);

  const handleMouseEnter = (provider: ProviderBase, event: React.MouseEvent) => {
    setHoveredProvider(provider);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredProvider(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (hoveredProvider) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  return (
    <div className="w-full max-w-[672px] mx-auto bg-card rounded-lg border-2 border-foreground shadow-xl p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBackToUSMap}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to US Map
        </Button>
        <h3 className="text-lg font-semibold text-foreground">{stateName}</h3>
        <div className="text-sm text-muted-foreground">
          {providerMarkers.length} provider{providerMarkers.length !== 1 ? 's' : ''}
        </div>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: config.center,
          scale: config.scale
        }}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies
              .filter(geo => geo.id === fipsCode)
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: "hsl(var(--muted))",
                      stroke: "hsl(var(--border))",
                      strokeWidth: 1,
                      outline: "none",
                    },
                    hover: {
                      fill: "hsl(var(--muted))",
                      stroke: "hsl(var(--border))",
                      strokeWidth: 1,
                      outline: "none",
                    },
                    pressed: {
                      fill: "hsl(var(--muted))",
                      stroke: "hsl(var(--border))",
                      strokeWidth: 1,
                      outline: "none",
                    },
                  }}
                />
              ))
          }
        </Geographies>

        {/* Provider markers */}
        {providerMarkers.map(({ provider, coordinates }) => (
          <Marker
            key={provider.id}
            coordinates={coordinates}
            onMouseEnter={(e) => handleMouseEnter(provider, e as unknown as React.MouseEvent)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={(e) => handleMouseMove(e as unknown as React.MouseEvent)}
            onClick={() => onProviderClick?.(provider)}
            style={{ cursor: "pointer" }}
          >
            <g transform="translate(-12, -24)">
              <path
                d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="1"
              />
            </g>
          </Marker>
        ))}
      </ComposableMap>

      {/* Tooltip */}
      {hoveredProvider && (
        <div
          className="fixed z-50 bg-popover text-popover-foreground px-3 py-2 rounded-md text-sm shadow-lg pointer-events-none border max-w-xs"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 40}px`,
          }}
        >
          <p className="font-semibold">{hoveredProvider.provider_name}</p>
          {hoveredProvider.city && hoveredProvider.state && (
            <p className="text-muted-foreground text-xs">
              {hoveredProvider.city}, {hoveredProvider.state}
            </p>
          )}
        </div>
      )}

      {providerMarkers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
          <p className="text-muted-foreground text-center p-4">
            No providers with valid locations in {stateName}
          </p>
        </div>
      )}
    </div>
  );
};

export default StateMap;
