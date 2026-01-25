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

const therapeuticModalities = [
  "All",
  "CBT",
  "DBT",
  "EMDR",
  "Motivational Interviewing",
  "Psychodynamic Therapy",
  "Family Therapy",
  "Group Therapy",
  "Individual Therapy",
  "IFS (Internal Family Systems)",
  "Equine Therapy",
  "Somatic and Experiential Therapy",
  "Mindfulness Based Therapy",
];

const mentalHealthDiagnoses = [
  "All",
  "Depression",
  "Anxiety",
  "Bipolar Disorder",
  "PTSD",
  "Trauma",
  "ADHD",
  "OCD",
  "Personality Disorders",
  "Eating Disorders",
  "Schizophrenia",
  "Dual Diagnosis",
];

const recoveryFellowships = [
  "All",
  "Alcoholics Anonymous (AA)",
  "Narcotics Anonymous (NA)",
  "SMART Recovery",
  "Celebrate Recovery",
  "Refuge Recovery / Recovery Dharma",
  "LifeRing Secular Recovery",
  "Secular Organizations for Sobriety (SOS)",
  "Women for Sobriety",
  "Moderation Management",
];

const languagesSpoken = [
  "All",
  "Spanish",
  "Mandarin",
  "Cantonese",
  "Vietnamese",
  "Korean",
  "Tagalog",
  "Russian",
  "Arabic",
  "French",
  "Portuguese",
  "Hindi",
  "Urdu",
  "Polish",
  "German",
  "Italian",
  "Japanese",
  "ASL (American Sign Language)",
];

interface ProviderFiltersProps {
  filters: {
    insurance: string;
    maxBudget: string;
    zipCode: string;
    genderSpecific: string[];
    lgbtSupportive: boolean;
    therapeuticModality?: string;
    mentalHealthDiagnosis?: string;
    adolescentServices?: boolean;
    faithBased?: boolean;
    languageSpoken?: string;
    recoveryFellowship?: string;
  };
  onFiltersChange: (filters: any) => void;
  showInsurance?: boolean;
  showGenderSpecific?: boolean;
  showBudget?: boolean;
  showTherapeuticModality?: boolean;
  showMentalHealthDiagnosis?: boolean;
  showAdolescentServices?: boolean;
  showFaithBased?: boolean;
  showLanguageSpoken?: boolean;
  showRecoveryFellowship?: boolean;
}

const ProviderFilters = ({ 
  filters, 
  onFiltersChange,
  showInsurance = true,
  showGenderSpecific = true,
  showBudget = true,
  showTherapeuticModality = false,
  showMentalHealthDiagnosis = true,
  showAdolescentServices = false,
  showFaithBased = false,
  showLanguageSpoken = false,
  showRecoveryFellowship = false,
}: ProviderFiltersProps) => {
  return (
    <Card className="p-4 sm:p-6 mb-6 md:mb-8">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Filter Providers</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
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

        {/* Therapeutic Modality */}
        {showTherapeuticModality && (
          <div className="space-y-2">
            <Label htmlFor="modality">Therapeutic Modality</Label>
            <Select
              value={filters.therapeuticModality || "All"}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, therapeuticModality: value })
              }
            >
              <SelectTrigger id="modality" className="bg-background">
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
        )}

        {/* Mental Health Diagnosis */}
        {showMentalHealthDiagnosis && (
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Mental Health Diagnosis</Label>
            <Select
              value={filters.mentalHealthDiagnosis || "All"}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, mentalHealthDiagnosis: value })
              }
            >
              <SelectTrigger id="diagnosis" className="bg-background">
                <SelectValue placeholder="Select diagnosis" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50 max-h-60">
                {mentalHealthDiagnoses.map((diagnosis) => (
                  <SelectItem key={diagnosis} value={diagnosis}>
                    {diagnosis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Recovery Fellowship */}
        {showRecoveryFellowship && (
          <div className="space-y-2">
            <Label htmlFor="fellowship">Recovery Fellowship</Label>
            <Select
              value={filters.recoveryFellowship || "All"}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, recoveryFellowship: value })
              }
            >
              <SelectTrigger id="fellowship" className="bg-background">
                <SelectValue placeholder="Select fellowship" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50 max-h-60">
                {recoveryFellowships.map((fellowship) => (
                  <SelectItem key={fellowship} value={fellowship}>
                    {fellowship}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Language Spoken */}
        {showLanguageSpoken && (
          <div className="space-y-2">
            <Label htmlFor="language">Language Spoken</Label>
            <Select
              value={filters.languageSpoken || "All"}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, languageSpoken: value })
              }
            >
              <SelectTrigger id="language" className="bg-background">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50 max-h-60">
                {languagesSpoken.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Gender Specific Care */}
      {showGenderSpecific && (
        <div className="mt-4 space-y-3">
          <Label className="text-sm sm:text-base">Gender Specific Care Needed</Label>
          <div className="flex flex-wrap gap-4 sm:gap-6">
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

      {/* Checkbox Filters Row */}
      <div className="mt-4 flex flex-wrap gap-4 sm:gap-6">
        {/* LGBT Supportive Care */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="lgbt"
            checked={filters.lgbtSupportive}
            onCheckedChange={(checked) =>
              onFiltersChange({ ...filters, lgbtSupportive: checked as boolean })
            }
          />
          <Label htmlFor="lgbt" className="font-normal cursor-pointer text-sm sm:text-base">
            LGBT Supportive Care
          </Label>
        </div>

        {/* Adolescent Services */}
        {showAdolescentServices && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="adolescent"
              checked={filters.adolescentServices || false}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, adolescentServices: checked as boolean })
              }
            />
            <Label htmlFor="adolescent" className="font-normal cursor-pointer text-sm sm:text-base">
              Adolescent Services (Under 18)
            </Label>
          </div>
        )}

        {/* Faith Based Services */}
        {showFaithBased && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="faithBased"
              checked={filters.faithBased || false}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, faithBased: checked as boolean })
              }
            />
            <Label htmlFor="faithBased" className="font-normal cursor-pointer text-sm sm:text-base">
              Faith-Based Program
            </Label>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProviderFilters;
