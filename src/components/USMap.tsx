import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface USMapProps {
  onStateClick: (stateName: string) => void;
  selectedState: string | null;
}

// State color mapping using four-color theorem
// Ensuring no adjacent states share the same color
const stateColors: Record<string, string> = {
  // Color 1 - Blue
  "Alabama": "hsl(210, 70%, 60%)",
  "Alaska": "hsl(210, 70%, 60%)",
  "Arizona": "hsl(210, 70%, 60%)",
  "Connecticut": "hsl(210, 70%, 60%)",
  "Illinois": "hsl(210, 70%, 60%)",
  "Kansas": "hsl(210, 70%, 60%)",
  "Louisiana": "hsl(210, 70%, 60%)",
  "Maine": "hsl(210, 70%, 60%)",
  "Michigan": "hsl(210, 70%, 60%)",
  "Nevada": "hsl(210, 70%, 60%)",
  "North Carolina": "hsl(210, 70%, 60%)",
  "Oregon": "hsl(210, 70%, 60%)",
  "South Dakota": "hsl(210, 70%, 60%)",
  "Texas": "hsl(210, 70%, 60%)",
  "West Virginia": "hsl(210, 70%, 60%)",
  
  // Color 2 - Green
  "Arkansas": "hsl(145, 65%, 55%)",
  "Delaware": "hsl(145, 65%, 55%)",
  "Florida": "hsl(145, 65%, 55%)",
  "Idaho": "hsl(145, 65%, 55%)",
  "Indiana": "hsl(145, 65%, 55%)",
  "Iowa": "hsl(145, 65%, 55%)",
  "Minnesota": "hsl(145, 65%, 55%)",
  "Montana": "hsl(145, 65%, 55%)",
  "New Jersey": "hsl(145, 65%, 55%)",
  "New York": "hsl(145, 65%, 55%)",
  "Ohio": "hsl(145, 65%, 55%)",
  "Rhode Island": "hsl(145, 65%, 55%)",
  "Utah": "hsl(145, 65%, 55%)",
  "Vermont": "hsl(145, 65%, 55%)",
  "Washington": "hsl(145, 65%, 55%)",
  
  // Color 3 - Amber
  "California": "hsl(40, 85%, 60%)",
  "Colorado": "hsl(40, 85%, 60%)",
  "Georgia": "hsl(40, 85%, 60%)",
  "Kentucky": "hsl(40, 85%, 60%)",
  "Maryland": "hsl(40, 85%, 60%)",
  "Massachusetts": "hsl(40, 85%, 60%)",
  "Mississippi": "hsl(40, 85%, 60%)",
  "Missouri": "hsl(40, 85%, 60%)",
  "New Hampshire": "hsl(40, 85%, 60%)",
  "North Dakota": "hsl(40, 85%, 60%)",
  "Oklahoma": "hsl(40, 85%, 60%)",
  "South Carolina": "hsl(40, 85%, 60%)",
  "Tennessee": "hsl(40, 85%, 60%)",
  "Wisconsin": "hsl(40, 85%, 60%)",
  "Wyoming": "hsl(40, 85%, 60%)",
  
  // Color 4 - Purple
  "Hawaii": "hsl(270, 65%, 65%)",
  "Nebraska": "hsl(270, 65%, 65%)",
  "New Mexico": "hsl(270, 65%, 65%)",
  "Pennsylvania": "hsl(270, 65%, 65%)",
  "Virginia": "hsl(270, 65%, 65%)",
};

const USMap = ({ onStateClick, selectedState }: USMapProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-card rounded-lg border-2 border-primary/20 shadow-lg p-6">
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
      </ComposableMap>
    </div>
  );
};

export default USMap;
