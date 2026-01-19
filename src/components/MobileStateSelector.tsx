import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

interface MobileStateSelectorProps {
  selectedState: string | null;
  onStateSelect: (state: string) => void;
  zipCode: string;
  onZipCodeChange: (value: string) => void;
  onZipCodeSearch: () => void;
}

const MobileStateSelector = ({
  selectedState,
  onStateSelect,
  zipCode,
  onZipCodeChange,
  onZipCodeSearch,
}: MobileStateSelectorProps) => {
  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border shadow-sm">
      <div className="text-center mb-2">
        <h3 className="font-semibold text-foreground flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Find Providers Near You
        </h3>
      </div>
      
      {/* State Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="stateSelect" className="text-sm font-medium">Select a State</Label>
        <Select
          value={selectedState || ""}
          onValueChange={onStateSelect}
        >
          <SelectTrigger id="stateSelect" className="w-full bg-background">
            <SelectValue placeholder="Choose a state..." />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50 max-h-[300px]">
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative flex items-center">
        <div className="flex-1 border-t border-border"></div>
        <span className="px-3 text-xs text-muted-foreground uppercase">or</span>
        <div className="flex-1 border-t border-border"></div>
      </div>

      {/* Zip Code Search */}
      <div className="space-y-2">
        <Label htmlFor="zipCodeMobile" className="text-sm font-medium">Search by Zip Code</Label>
        <div className="flex gap-2">
          <Input
            id="zipCodeMobile"
            type="text"
            placeholder="Enter zip code"
            value={zipCode}
            onChange={(e) => onZipCodeChange(e.target.value)}
            maxLength={10}
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onZipCodeSearch();
              }
            }}
          />
          <Button onClick={onZipCodeSearch} size="icon" className="shrink-0">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileStateSelector;