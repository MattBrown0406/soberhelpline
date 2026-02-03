import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Globe, Award, ChevronDown, Globe2, Languages, Youtube, Instagram, Facebook, Video, Clock, Baby, Cross, ShieldCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useClickTracking } from "@/hooks/useClickTracking";
import { useEffect, useRef } from "react";

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

// Horse head icon for equine therapy
const HorseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 3c-1.5 0-2.5 1-3 2l-1 3-3 1c-2 0-4 1-5 3l-1 2-3-1c-1 0-2 1-2 2v4c0 1 1 2 2 2h2l1-2 2-1 3 1c2 0 3-1 4-2l2-4 2-1V3zm-5 5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
  </svg>
);

interface Provider {
  id: string;
  provider_name: string;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone_number?: string | null;
  email?: string | null;
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
  therapeutic_modalities?: string[] | null;
  insurances_accepted?: string[] | null;
}

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard = ({ provider }: ProviderCardProps) => {
  const isInterventionistOrCoach = provider.category === "Interventionists" || provider.category === "Sober Coaches/Companions";
  const { trackClick } = useClickTracking();
  const hasTrackedView = useRef(false);

  // Track card view when component mounts
  useEffect(() => {
    if (!hasTrackedView.current && provider.id) {
      trackClick({ providerId: provider.id, clickType: 'card_view' });
      hasTrackedView.current = true;
    }
  }, [provider.id, trackClick]);

  const handlePhoneClick = () => {
    trackClick({ providerId: provider.id, clickType: 'phone_click' });
  };

  const handleEmailClick = () => {
    trackClick({ providerId: provider.id, clickType: 'email_click' });
  };

  const handleWebsiteClick = () => {
    trackClick({ providerId: provider.id, clickType: 'website_click' });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-none">
            {/* Mobile: Stack layout / Desktop: Flex layout */}
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
              {/* Logo - centered on mobile, left on desktop */}
              {provider.logo_url && (
                <div className="flex-shrink-0 flex justify-center md:justify-start">
                  <img
                    src={provider.logo_url}
                    alt={`${provider.provider_name} logo`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                </div>
              )}
              
              {/* Main info section */}
              <div className="flex-1 min-w-0">
                {/* Provider name and badges */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h3 className="text-lg sm:text-xl font-semibold">{provider.provider_name}</h3>
                    {provider.therapeutic_modalities?.includes("Equine Therapy") && (
                      <Badge variant="outline" className="text-xs border-primary text-primary">
                        Equine
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Badges - scrollable on mobile */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 justify-center sm:justify-start">
                  {provider.cip_certified && (
                    <Badge variant="default" className="gap-1 bg-primary text-primary-foreground text-xs">
                      <Award className="w-3 h-3" />
                      CIP Certified
                    </Badge>
                  )}
                  {provider.category === "Interventionists" && provider.hourly_coaching_sessions && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Clock className="w-3 h-3" />
                      Hourly Coaching
                    </Badge>
                  )}
                  {provider.category === "Medical Detox" && provider.detox_only_services && (
                    <Badge variant="secondary" className="gap-1 text-xs">
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
                  {provider.category === "Sober Living" && provider.accepts_mat_residents && (
                    <Badge variant="default" className="text-xs bg-accent text-accent-foreground">MAT OK</Badge>
                  )}
                  {provider.category === "Sober Living" && provider.items_included_in_cost && provider.items_included_in_cost.length > 0 && (
                    <>
                      {provider.items_included_in_cost.includes("Food") && (
                        <Badge variant="outline" className="text-xs">Food</Badge>
                      )}
                      {provider.items_included_in_cost.includes("Transportation") && (
                        <Badge variant="outline" className="text-xs">Transport</Badge>
                      )}
                      {provider.items_included_in_cost.includes("Therapeutic Support") && (
                        <Badge variant="outline" className="text-xs">Therapy</Badge>
                      )}
                    </>
                  )}
                  {provider.category === "Interventionists" && provider.works_nationally && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Globe2 className="w-3 h-3" />
                      National
                    </Badge>
                  )}
                  {provider.category === "Interventionists" && provider.works_internationally && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Globe2 className="w-3 h-3" />
                      International
                    </Badge>
                  )}
                  {(provider.category === "Outpatient Treatment" || 
                    provider.category === "Sober Coaches/Companions" ||
                    provider.category === "Therapists" || 
                    provider.category === "Psychiatrists") && provider.telehealth_available && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Video className="w-3 h-3" />
                      Telehealth
                    </Badge>
                  )}
                  {(provider.category === "Inpatient Treatment" || provider.category === "Outpatient Treatment") && 
                    provider.detox_available && (
                    <Badge variant="default" className="gap-1 text-xs bg-accent text-accent-foreground">
                      Detox
                    </Badge>
                  )}
                  {(provider.category === "Inpatient Treatment" || 
                    provider.category === "Outpatient Treatment" || 
                    provider.category === "Interventionists" || 
                    provider.category === "Sober Living") && provider.adolescent_services && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Baby className="w-3 h-3" />
                      Teens
                    </Badge>
                  )}
                  {(provider.category === "Inpatient Treatment" || 
                    provider.category === "Outpatient Treatment" || 
                    provider.category === "Therapists" || 
                    provider.category === "Sober Living") && provider.faith_based_services && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Cross className="w-3 h-3" />
                      Faith Based
                    </Badge>
                  )}
                  {(provider.category === "Inpatient Treatment" || 
                    provider.category === "Outpatient Treatment" || 
                    provider.category === "Therapists" || 
                    provider.category === "Sober Living") && provider.military_first_responder_care && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <ShieldCheck className="w-3 h-3" />
                      Military/First Responder
                    </Badge>
                  )}
                </div>

                {/* Language badges for Interventionists and Sober Coaches */}
                {isInterventionistOrCoach && provider.languages_spoken && provider.languages_spoken.length > 0 && (
                  <div className="flex items-center gap-1 sm:gap-2 mb-2 flex-wrap justify-center sm:justify-start">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    {provider.languages_spoken.map((language, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Location */}
                {provider.city && provider.state && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground text-sm mb-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {provider.city}, {provider.state} {provider.zip_code}
                    </span>
                  </div>
                )}
                
                {/* Year started - hidden on mobile to save space */}
                {provider.year_started && (
                  <div className="hidden sm:block text-sm text-muted-foreground mb-2">
                    <span className="font-semibold">Since:</span> {provider.year_started}
                  </div>
                )}
                
                {/* Description - hidden on mobile, shown in expanded view */}
                {provider.description_of_services && (
                  <p className="hidden sm:block text-muted-foreground text-sm mb-3 line-clamp-2">
                    {provider.description_of_services}
                  </p>
                )}
              </div>
              
              {/* Contact info section - full width on mobile, right column on desktop */}
              <div className="w-full md:w-auto md:flex-shrink-0 space-y-2 md:min-w-[180px]">
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 items-center md:items-start">
                  {provider.phone_number && (
                    <a 
                      href={`tel:${provider.phone_number}`} 
                      className="flex items-center gap-2 text-sm hover:underline"
                      onClick={handlePhoneClick}
                    >
                      <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{formatPhoneNumber(provider.phone_number)}</span>
                    </a>
                  )}

                  {provider.email && (
                    <a 
                      href={`mailto:${provider.email}`} 
                      className="flex items-center gap-2 text-sm hover:underline max-w-full"
                      onClick={handleEmailClick}
                    >
                      <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="truncate">{provider.email}</span>
                    </a>
                  )}

                  {provider.website && (
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:underline"
                      onClick={handleWebsiteClick}
                    >
                      <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>
                
                {/* Social Media Icons */}
                {(provider.youtube_url || provider.tiktok_url || provider.instagram_url || provider.facebook_url) && (
                  <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
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
                
                <AccordionTrigger className="w-full mt-2 pt-2 border-t hover:no-underline justify-center md:justify-start">
                  <span className="text-sm text-primary">View Full Details</span>
                </AccordionTrigger>
              </div>
            </div>
            
            {/* Expandable section with full details */}
            <AccordionContent className="pt-4 border-t mt-4">
              <div className="space-y-4">
                {/* Pricing section - show for Inpatient, Outpatient, and Sober Living */}
                {provider.cost && ["Inpatient Treatment", "Outpatient Treatment", "Sober Living"].includes(provider.category || "") && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <span className="font-semibold text-sm">Cost per Month:</span>
                    <span className="text-sm">{provider.cost}</span>
                    {provider.sliding_scale_available && (
                      <Badge variant="secondary" className="text-xs">
                        Sliding Scale Available
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Cost section for other categories (except Interventionists which has its own section) */}
                {provider.cost && !["Inpatient Treatment", "Outpatient Treatment", "Sober Living", "Interventionists"].includes(provider.category || "") && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <span className="font-semibold text-sm">Cost:</span>
                    <span className="text-sm">{provider.cost}</span>
                    {provider.sliding_scale_available && (
                      <Badge variant="secondary" className="text-xs">
                        Sliding Scale Available
                      </Badge>
                    )}
                  </div>
                )}
                
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

                {/* Insurance Accepted - for Inpatient, Outpatient, and Medical Detox */}
                {["Inpatient Treatment", "Outpatient Treatment", "Medical Detox"].includes(provider.category || "") && 
                  provider.insurances_accepted && provider.insurances_accepted.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Insurance Accepted</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.insurances_accepted.map((insurance, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {insurance}
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
