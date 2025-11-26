export type ProviderSubmission = {
  id: string;
  provider_name: string;
  category: string;
  email: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  address: string | null;
  website: string | null;
  description_of_services: string | null;
  logo_url: string | null;
  cost: string | null;
  length_of_services: string | null;
  year_started: number | null;
  submitted_by: string | null;
  
  // Treatment-specific fields
  total_treatment_beds: number | null;
  detox_available: boolean | null;
  gender_specific_treatment: string[] | null;
  lgbt_supportive: boolean | null;
  insurances_accepted: string[] | null;
  co_occurring_diagnoses: string[] | null;
  therapeutic_modalities: string[] | null;
  
  // Interventionist-specific fields
  cip_certified: boolean | null;
  intervention_modalities: string[] | null;
  hourly_coaching_sessions: boolean | null;
  hourly_coaching_rate: string | null;
  case_management_services: boolean | null;
  travel_expenses_included: boolean | null;
  works_nationally: boolean | null;
  works_internationally: boolean | null;
  languages_spoken: string[] | null;
  
  // Sober Coaches/Companions-specific fields
  in_person_companion_work: boolean | null;
  has_valid_passport: boolean | null;
  daily_companion_fee: string | null;
  
  // Sober Living-specific fields
  awake_staff_24_7: boolean | null;
  residents_expected_to_work: boolean | null;
  job_assistance_provided: boolean | null;
  medication_administration: string | null;
  accepts_mat_residents: boolean | null;
  minimum_time_since_last_use: string | null;
  required_meetings_per_week: string | null;
  mandatory_curfew: boolean | null;
  curfew_time: string | null;
  mandatory_house_meetings: boolean | null;
  house_meetings_per_week: number | null;
  chores_required: boolean | null;
  items_included_in_cost: string[] | null;
  
  // Therapist/Psychiatrist-specific fields
  license_current_good_standing: boolean | null;
  substance_use_disorder_experience: boolean | null;
  
  // Attorney-specific fields
  legal_assistance_types: string[] | null;
  
  // Recovery fellowships (shared across multiple categories)
  recovery_fellowships: string[] | null;
};
