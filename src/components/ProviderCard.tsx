import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

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

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard = ({ provider }: ProviderCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{provider.provider_name}</CardTitle>
            {provider.city && provider.state && (
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {provider.city}, {provider.state} {provider.zip_code}
                </span>
              </div>
            )}
          </div>
          {provider.logo_url && (
            <img
              src={provider.logo_url}
              alt={`${provider.provider_name} logo`}
              className="w-16 h-16 object-contain"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {provider.description_of_services && (
          <p className="text-muted-foreground mb-4">{provider.description_of_services}</p>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-primary" />
            <a href={`tel:${provider.phone_number}`} className="hover:underline">
              {provider.phone_number}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-primary" />
            <a href={`mailto:${provider.email}`} className="hover:underline">
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
      </CardContent>
    </Card>
  );
};

export default ProviderCard;
