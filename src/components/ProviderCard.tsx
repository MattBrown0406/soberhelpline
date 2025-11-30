import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Globe, Award, ChevronDown, Globe2, Languages, Youtube, Instagram, Facebook, Video, Clock, Baby, Cross, ShieldCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Format phone number to (000) 000-0000
const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format as (000) 000-0000
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Return original if not 10 digits
  return phoneNumber;
};

// TikTok icon component since lucide-react doesn't have one
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

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
  hourly_coaching_sessions?: boolean | null;
  detox_only_services?: boolean | null;
  length_of_services?: string | null;
  category?: string;
  cost?: string | null;
  intervention_modalities?: string[] | null;
  travel_expenses_included?: boolean | null;
  works_nationally?: boolean | null;
  works_internationally?: boolean | null;
  languages_spoken?: string[] | null;
  recovery_fellowships?: string[] | null;
  youtube_url?: string | null;
  tiktok_url?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  gender_specific_treatment?: string[] | null;
  telehealth_available?: boolean | null;
  detox_available?: boolean | null;
  year_started?: number | null;
  sliding_scale_available?: boolean | null;
  adolescent_services?: boolean | null;
  accepts_mat_residents?: boolean | null;
  items_included_in_cost?: string[] | null;
  faith_based_services?: boolean | null;
  military_first_responder_care?: boolean | null;
}

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard = ({ provider }: ProviderCardProps) => {
  const isInterventionistOrCoach = provider.category === "Interventionists" || provider.category === "Sober Coaches/Companions";

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-none">
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
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-xl font-semibold">{provider.provider_name}</h3>
                  {provider.cip_certified && (
                    <Badge variant="default" className="gap-1 bg-primary text-primary-foreground">
                      <Award className="w-3 h-3" />
                      CIP Certified
                    </Badge>
                  )}
                  {provider.category === "Interventionists" && provider.hourly_coaching_sessions && (
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="w-3 h-3" />
                      Hourly Coaching Available
                    </Badge>
                  )}
                  {provider.category === "Medical Detox" && provider.detox_only_services && (
                    <Badge variant="secondary" className="gap-1">
                      Detox Only
                    </Badge>
                  )}
                  {provider.category === "Inpatient Treatment" && provider.length_of_services && (
                    <>
                      {provider.length_of_services.includes("30 days") && (
                        <Badge variant="outline" className="text-xs">30 Day</Badge>
                      )}
                      {provider.length_of_services.includes("60 days") && (
                        <Badge variant="outline" className="text-xs">60 Day</Badge>
                      )}
                      {provider.length_of_services.includes("90 days") && (
                        <Badge variant="outline" className="text-xs">90 Day</Badge>
                      )}
                      {provider.length_of_services.includes("More than 90 days") && (
                        <Badge variant="outline" className="text-xs">&gt;90 Day</Badge>
                      )}
                    </>
                  )}
                  {provider.category === "Inpatient Treatment" && provider.gender_specific_treatment && provider.gender_specific_treatment.length > 0 && (
                    <>
                      {provider.gender_specific_treatment.includes("Men") && (
                        <Badge variant="secondary" className="text-xs">Men Only</Badge>
                      )}
                      {provider.gender_specific_treatment.includes("Women") && (
                        <Badge variant="secondary" className="text-xs">Women Only</Badge>
                      )}
                    </>
                  )}
                  {provider.category === "Sober Living" && provider.gender_specific_treatment && provider.gender_specific_treatment.length > 0 && (
                    <>
                      {provider.gender_specific_treatment.includes("Men") && (
                        <Badge variant="secondary" className="text-xs">Men Only</Badge>
                      )}
                      {provider.gender_specific_treatment.includes("Women") && (
                        <Badge variant="secondary" className="text-xs">Women Only</Badge>
                      )}
                    </>
                  )}
                  {/* MAT and included items badges for Sober Living */}
                  {provider.category === "Sober Living" && provider.accepts_mat_residents && (
                    <Badge variant="default" className="text-xs bg-accent text-accent-foreground">MAT OK</Badge>
                  )}
                  {provider.category === "Sober Living" && provider.items_included_in_cost && provider.items_included_in_cost.length > 0 && (
                    <>
                      {provider.items_included_in_cost.includes("Food") && (
                        <Badge variant="outline" className="text-xs">Food Included</Badge>
                      )}
                      {provider.items_included_in_cost.includes("Transportation") && (
                        <Badge variant="outline" className="text-xs">Transportation Included</Badge>
                      )}
                      {provider.items_included_in_cost.includes("Therapeutic Support") && (
                        <Badge variant="outline" className="text-xs">Therapeutic Support Included</Badge>
                      )}
                    </>
                  )}
                  {/* National/International badges for Interventionists */}
                  {provider.category === "Interventionists" && provider.works_nationally && (
                    <Badge variant="secondary" className="gap-1">
                      <Globe2 className="w-3 h-3" />
                      Works Nationally
                    </Badge>
                  )}
                  {provider.category === "Interventionists" && provider.works_internationally && (
                    <Badge variant="secondary" className="gap-1">
                      <Globe2 className="w-3 h-3" />
                      Works Internationally
                    </Badge>
                  )}
                  {/* Telehealth badge for Outpatient, Sober Coaches, Therapists, Psychiatrists */}
                  {(provider.category === "Outpatient Treatment" || 
                    provider.category === "Sober Coaches/Companions" ||
                    provider.category === "Therapists" || 
                    provider.category === "Psychiatrists") && provider.telehealth_available && (
                    <Badge variant="secondary" className="gap-1">
                      <Video className="w-3 h-3" />
                      Telehealth Provider
                    </Badge>
                  )}
                  {/* Detox badge for Inpatient and Outpatient Treatment */}
                  {(provider.category === "Inpatient Treatment" || provider.category === "Outpatient Treatment") && 
                    provider.detox_available && (
                    <Badge variant="default" className="gap-1 bg-accent text-accent-foreground">
                      Detox Available
                    </Badge>
                  )}
                  {/* Adolescent services badge */}
                  {(provider.category === "Inpatient Treatment" || 
                    provider.category === "Outpatient Treatment" || 
                    provider.category === "Interventionists" || 
                    provider.category === "Sober Living") && provider.adolescent_services && (
                    <Badge variant="secondary" className="gap-1">
                      <Baby className="w-3 h-3" />
                      Works with Teens
                    </Badge>
                  )}
                  {/* Faith based services badge */}
                  {(provider.category === "Inpatient Treatment" || 
                    provider.category === "Outpatient Treatment" || 
                    provider.category === "Therapists" || 
                    provider.category === "Sober Living") && provider.faith_based_services && (
                    <Badge variant="secondary" className="gap-1">
                      <Cross className="w-3 h-3" />
                      Faith Based
                    </Badge>
                  )}
                  {/* Military/First Responder care badge */}
                  {(provider.category === "Inpatient Treatment" || 
                    provider.category === "Outpatient Treatment" || 
                    provider.category === "Therapists" || 
                    provider.category === "Sober Living") && provider.military_first_responder_care && (
                    <Badge variant="secondary" className="gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Military & First Responder
                    </Badge>
                  )}
                </div>

                {/* Language badges for Interventionists and Sober Coaches */}
                {isInterventionistOrCoach && provider.languages_spoken && provider.languages_spoken.length > 0 && (
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    {provider.languages_spoken.map((language, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {provider.city && provider.state && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {provider.city}, {provider.state} {provider.zip_code}
                    </span>
                  </div>
                )}
                
                {provider.year_started && (
                  <div className="text-sm text-muted-foreground mb-3">
                    <span className="font-semibold">Providing Services Since:</span> {provider.year_started}
                  </div>
                )}
                
                {provider.description_of_services && (
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {provider.description_of_services}
                  </p>
                )}
              </div>
              
              {/* Right section: Contact info + Expand trigger */}
              <div className="flex-shrink-0 space-y-2 min-w-[200px]">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href={`tel:${provider.phone_number}`} className="hover:underline">
                    {formatPhoneNumber(provider.phone_number)}
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
                
                {/* Social Media Icons */}
                {(provider.youtube_url || provider.tiktok_url || provider.instagram_url || provider.facebook_url) && (
                  <div className="flex items-center gap-3 mt-2">
                    {provider.youtube_url && (
                      <a
                        href={provider.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-red-600 transition-colors"
                        title="YouTube"
                      >
                        <Youtube className="w-5 h-5" />
                      </a>
                    )}
                    {provider.tiktok_url && (
                      <a
                        href={provider.tiktok_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="TikTok"
                      >
                        <TikTokIcon className="w-5 h-5" />
                      </a>
                    )}
                    {provider.instagram_url && (
                      <a
                        href={provider.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-pink-600 transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {provider.facebook_url && (
                      <a
                        href={provider.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-blue-600 transition-colors"
                        title="Facebook"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                )}
                
                <AccordionTrigger className="mt-4 pt-3 border-t hover:no-underline">
                  <span className="text-sm text-primary">View Full Details</span>
                </AccordionTrigger>
              </div>
            </div>
            
            {/* Expandable section with full details */}
            <AccordionContent className="pt-4 border-t mt-4">
              <div className="space-y-4">
                {provider.description_of_services && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Full Description</h4>
                    <p className="text-muted-foreground text-sm">
                      {provider.description_of_services}
                    </p>
                  </div>
                )}
                
                {/* Interventionist-specific information */}
                    {provider.category === "Interventionists" && (
                  <div className="space-y-3">
                    {provider.cost && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Cost: </span>
                        <span className="text-sm">{provider.cost}</span>
                        {provider.sliding_scale_available && (
                          <Badge variant="secondary" className="text-xs">
                            Sliding Scale
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {provider.intervention_modalities && provider.intervention_modalities.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Intervention Modalities</h4>
                        <div className="flex flex-wrap gap-2">
                          {provider.intervention_modalities.map((modality, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {modality}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {provider.travel_expenses_included && (
                      <Badge variant="outline" className="w-fit text-xs">
                        ✓ Travel Expenses Included
                      </Badge>
                    )}

                    {/* Show languages in expanded section too */}
                    {provider.languages_spoken && provider.languages_spoken.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Languages Spoken</h4>
                        <div className="flex flex-wrap gap-2">
                          {provider.languages_spoken.map((language, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sober Coaches specific - show languages in expanded section */}
                {provider.category === "Sober Coaches/Companions" && provider.languages_spoken && provider.languages_spoken.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Languages Spoken</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.languages_spoken.map((language, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recovery Fellowships - for Inpatient, Outpatient, Sober Living, Sober Coaches */}
                {["Inpatient Treatment", "Outpatient Treatment", "Sober Living", "Sober Coaches/Companions"].includes(provider.category || "") && 
                  provider.recovery_fellowships && provider.recovery_fellowships.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Recovery Fellowships Available</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.recovery_fellowships.map((fellowship, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {fellowship}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ProviderCard;
