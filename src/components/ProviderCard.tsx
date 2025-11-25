import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Globe, Award } from "lucide-react";

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
  cip_certified?: boolean | null;
  category?: string;
  cost?: string | null;
  intervention_modalities?: string[] | null;
  travel_expenses_included?: boolean | null;
}

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard = ({ provider }: ProviderCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Left section: Logo */}
          {provider.logo_url && (
            <div className="flex-shrink-0">
              <img
                src={provider.logo_url}
                alt={`${provider.provider_name} logo`}
                className="w-20 h-20 object-contain"
              />
            </div>
          )}
          
          {/* Middle section: Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold">{provider.provider_name}</h3>
              {provider.cip_certified && (
                <Badge variant="default" className="gap-1 bg-primary text-primary-foreground">
                  <Award className="w-3 h-3" />
                  CIP Certified
                </Badge>
              )}
            </div>
            
            {provider.city && provider.state && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                <MapPin className="w-4 h-4" />
                <span>
                  {provider.city}, {provider.state} {provider.zip_code}
                </span>
              </div>
            )}
            
            {provider.description_of_services && (
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {provider.description_of_services}
              </p>
            )}
            
            {/* Interventionist-specific information */}
            {provider.category === "Interventionists" && (
              <div className="mb-3 space-y-2">
                {provider.cost && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Cost:</span>
                    <span className="text-sm">{provider.cost}</span>
                  </div>
                )}
                
                {provider.intervention_modalities && provider.intervention_modalities.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">Modalities:</span>
                    {provider.intervention_modalities.map((modality, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {modality}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {provider.travel_expenses_included && (
                  <Badge variant="outline" className="w-fit text-xs">
                    ✓ Travel Expenses Included
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {/* Right section: Contact info */}
          <div className="flex-shrink-0 space-y-2 min-w-[200px]">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <a href={`tel:${provider.phone_number}`} className="hover:underline">
                {provider.phone_number}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-primary" />
              <a href={`mailto:${provider.email}`} className="hover:underline truncate">
                {provider.email}
              </a>
            </div>
            {provider.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-primary" />
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderCard;
