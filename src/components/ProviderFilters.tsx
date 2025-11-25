import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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
];

interface ProviderFiltersProps {
  filters: {
    insurance: string;
    maxBudget: string;
    zipCode: string;
    genderSpecific: string[];
    lgbtSupportive: boolean;
  };
  onFiltersChange: (filters: any) => void;
  showInsurance?: boolean;
  showGenderSpecific?: boolean;
  showBudget?: boolean;
}

const ProviderFilters = ({ 
  filters, 
  onFiltersChange,
  showInsurance = true,
  showGenderSpecific = true,
  showBudget = true,
}: ProviderFiltersProps) => {
  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Filter Providers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Insurance Provider */}
        {showInsurance && (
          <div className="space-y-2">
            <Label htmlFor="insurance">Insurance Provider</Label>
            <Select
              value={filters.insurance}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, insurance: value })
              }
            >
              <SelectTrigger id="insurance" className="bg-background">
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
          </div>
        )}

        {/* Private Pay Budget */}
        {showBudget && (
          <div className="space-y-2">
            <Label htmlFor="budget">Max Private Pay Budget (Monthly)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="budget"
                type="number"
                placeholder="Enter max budget"
                value={filters.maxBudget}
                onChange={(e) =>
                  onFiltersChange({ ...filters, maxBudget: e.target.value })
                }
                className="pl-7"
              />
            </div>
          </div>
        )}

        {/* Zip Code */}
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="Enter zip code"
            value={filters.zipCode}
            onChange={(e) =>
              onFiltersChange({ ...filters, zipCode: e.target.value })
            }
            maxLength={10}
          />
        </div>
      </div>

      {/* Gender Specific Care */}
      {showGenderSpecific && (
        <div className="mt-4 space-y-3">
          <Label>Gender Specific Care Needed</Label>
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="men"
                checked={filters.genderSpecific.includes("Men")}
                onCheckedChange={(checked) => {
                  const newGenderSpecific = checked
                    ? [...filters.genderSpecific, "Men"]
                    : filters.genderSpecific.filter((g) => g !== "Men");
                  onFiltersChange({ ...filters, genderSpecific: newGenderSpecific });
                }}
              />
              <Label htmlFor="men" className="font-normal cursor-pointer">
                Men
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="women"
                checked={filters.genderSpecific.includes("Women")}
                onCheckedChange={(checked) => {
                  const newGenderSpecific = checked
                    ? [...filters.genderSpecific, "Women"]
                    : filters.genderSpecific.filter((g) => g !== "Women");
                  onFiltersChange({ ...filters, genderSpecific: newGenderSpecific });
                }}
              />
              <Label htmlFor="women" className="font-normal cursor-pointer">
                Women
              </Label>
            </div>
          </div>
        </div>
      )}

      {/* LGBT Supportive Care */}
      <div className="mt-4 flex items-center space-x-2">
        <Checkbox
          id="lgbt"
          checked={filters.lgbtSupportive}
          onCheckedChange={(checked) =>
            onFiltersChange({ ...filters, lgbtSupportive: checked as boolean })
          }
        />
        <Label htmlFor="lgbt" className="font-normal cursor-pointer">
          LGBT Supportive Care Needed
        </Label>
      </div>
    </Card>
  );
};

export default ProviderFilters;
