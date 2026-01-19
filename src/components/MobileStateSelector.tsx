import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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
}

const MobileStateSelector = ({ selectedState, onStateSelect }: MobileStateSelectorProps) => {
  return (
    <Card className="p-4 mb-4">
      <div className="space-y-2">
        <Label htmlFor="mobile-state" className="text-sm font-medium">
          Select a State
        </Label>
        <Select
          value={selectedState || ""}
          onValueChange={onStateSelect}
        >
          <SelectTrigger id="mobile-state" className="w-full bg-background">
            <SelectValue placeholder="Choose a state..." />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50 max-h-60">
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

export default MobileStateSelector;