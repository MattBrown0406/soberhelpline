import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProviderSubmission } from "@/types/provider";

type EditSubmissionDialogProps = {
  submission: ProviderSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (submission: ProviderSubmission) => Promise<void>;
};

export function EditSubmissionDialog({
  submission,
  open,
  onOpenChange,
  onSave,
}: EditSubmissionDialogProps) {
  const [editedSubmission, setEditedSubmission] = useState<ProviderSubmission | null>(null);

  useEffect(() => {
    if (submission) {
      setEditedSubmission({ ...submission });
    }
  }, [submission]);

  if (!editedSubmission) return null;

  const handleSave = async () => {
    await onSave(editedSubmission);
  };

  const updateField = (field: keyof ProviderSubmission, value: any) => {
    setEditedSubmission({ ...editedSubmission, [field]: value });
  };

  const toggleArrayItem = (field: keyof ProviderSubmission, item: string) => {
    const currentArray = (editedSubmission[field] as string[]) || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    updateField(field, newArray);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Provider Submission</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-180px)] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Basic Information</h3>
              
              <div>
                <Label htmlFor="provider_name">Provider Name</Label>
                <Input
                  id="provider_name"
                  value={editedSubmission.provider_name}
                  onChange={(e) => updateField("provider_name", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editedSubmission.category}
                  onChange={(e) => updateField("category", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedSubmission.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={editedSubmission.phone_number}
                    onChange={(e) => updateField("phone_number", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={editedSubmission.website || ""}
                  onChange={(e) => updateField("website", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={editedSubmission.city || ""}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={editedSubmission.state || ""}
                    onChange={(e) => updateField("state", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="zip_code">Zip Code</Label>
                  <Input
                    id="zip_code"
                    value={editedSubmission.zip_code || ""}
                    onChange={(e) => updateField("zip_code", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editedSubmission.address || ""}
                  onChange={(e) => updateField("address", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description_of_services">Description of Services</Label>
                <Textarea
                  id="description_of_services"
                  value={editedSubmission.description_of_services || ""}
                  onChange={(e) => updateField("description_of_services", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    value={editedSubmission.cost || ""}
                    onChange={(e) => updateField("cost", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="year_started">Year Started</Label>
                  <Input
                    id="year_started"
                    type="number"
                    value={editedSubmission.year_started || ""}
                    onChange={(e) => updateField("year_started", parseInt(e.target.value) || null)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sliding_scale_available"
                  checked={editedSubmission.sliding_scale_available || false}
                  onCheckedChange={(checked) => updateField("sliding_scale_available", checked)}
                />
                <Label htmlFor="sliding_scale_available">Sliding Scale Options Available</Label>
              </div>
            </div>

            {/* Treatment-Specific Fields */}
            {["Inpatient Treatment", "Outpatient Treatment"].includes(editedSubmission.category) && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg">Treatment Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="detox_available"
                      checked={editedSubmission.detox_available || false}
                      onCheckedChange={(checked) => updateField("detox_available", checked)}
                    />
                    <Label htmlFor="detox_available">Detox Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lgbt_supportive"
                      checked={editedSubmission.lgbt_supportive || false}
                      onCheckedChange={(checked) => updateField("lgbt_supportive", checked)}
                    />
                    <Label htmlFor="lgbt_supportive">LGBT Supportive</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="total_treatment_beds">Total Treatment Beds</Label>
                  <Input
                    id="total_treatment_beds"
                    type="number"
                    value={editedSubmission.total_treatment_beds || ""}
                    onChange={(e) => updateField("total_treatment_beds", parseInt(e.target.value) || null)}
                  />
                </div>

                <div>
                  <Label htmlFor="length_of_services">Length of Services</Label>
                  <Input
                    id="length_of_services"
                    value={editedSubmission.length_of_services || ""}
                    onChange={(e) => updateField("length_of_services", e.target.value)}
                  />
                </div>

                {editedSubmission.category === "Outpatient Treatment" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="telehealth_available_outpatient"
                      checked={editedSubmission.telehealth_available || false}
                      onCheckedChange={(checked) => updateField("telehealth_available", checked)}
                    />
                    <Label htmlFor="telehealth_available_outpatient">Telehealth Available</Label>
                  </div>
                )}
              </div>
            )}

            {/* Insurance Providers - for Inpatient, Outpatient, Medical Detox */}
            {["Inpatient Treatment", "Outpatient Treatment", "Medical Detox"].includes(editedSubmission.category) && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg">Insurances Accepted</h3>
                <div className="grid grid-cols-3 gap-2 border rounded-lg p-3 bg-muted max-h-64 overflow-y-auto">
                  {["Self Pay", "Aetna", "Anthem", "Blue Cross", "Blue Shield", "Cigna", "Humana", "Kaiser Permanente", "Medicaid", "Molina Healthcare", "United Healthcare", "Tricare", "Centene", "Health Net", "WellCare", "Ambetter", "Bright Health", "Oscar Health", "Clover Health", "Moda", "Pacific Source", "Other"].map((insurance) => (
                    <div key={insurance} className="flex items-center space-x-2">
                      <Checkbox
                        id={`insurance_${insurance}`}
                        checked={(editedSubmission.insurances_accepted || []).includes(insurance)}
                        onCheckedChange={() => toggleArrayItem("insurances_accepted", insurance)}
                      />
                      <Label htmlFor={`insurance_${insurance}`} className="text-sm">{insurance}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Therapeutic Modalities - for Inpatient, Outpatient, Therapists */}
            {["Inpatient Treatment", "Outpatient Treatment", "Therapists"].includes(editedSubmission.category) && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg">Therapeutic Modalities</h3>
                <div className="grid grid-cols-2 gap-2 border rounded-lg p-3 bg-muted">
                  {["CBT", "DBT", "EMDR", "Motivational Interviewing", "Psychodynamic Therapy", "Family Therapy", "Group Therapy", "Individual Therapy", "IFS (Internal Family Systems)", "Equine Therapy", "Somatic and Experiential Therapy", "Mindfulness Based Therapy", "Other"].map((modality) => (
                    <div key={modality} className="flex items-center space-x-2">
                      <Checkbox
                        id={`modality_${modality}`}
                        checked={(editedSubmission.therapeutic_modalities || []).includes(modality)}
                        onCheckedChange={() => toggleArrayItem("therapeutic_modalities", modality)}
                      />
                      <Label htmlFor={`modality_${modality}`} className="text-sm">{modality}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Co-Occurring Diagnoses - for Inpatient, Outpatient, Therapists, Psychiatrists */}
            {["Inpatient Treatment", "Outpatient Treatment", "Therapists", "Psychiatrists"].includes(editedSubmission.category) && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg">Co-Occurring Diagnoses Treated</h3>
                <div className="grid grid-cols-2 gap-2 border rounded-lg p-3 bg-muted">
                  {["ADHD", "Anxiety", "Bipolar", "Borderline Personality Disorder", "Depression", "Eating Disorders", "Schizoaffective Disorder", "Schizophrenia", "Trauma", "Antisocial Personality Disorder", "Narcissistic Personality Disorder", "OCD"].map((diagnosis) => (
                    <div key={diagnosis} className="flex items-center space-x-2">
                      <Checkbox
                        id={`diagnosis_${diagnosis}`}
                        checked={(editedSubmission.co_occurring_diagnoses || []).includes(diagnosis)}
                        onCheckedChange={() => toggleArrayItem("co_occurring_diagnoses", diagnosis)}
                      />
                      <Label htmlFor={`diagnosis_${diagnosis}`} className="text-sm">{diagnosis}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recovery Fellowships - for Inpatient, Outpatient, Sober Living, Sober Coaches */}
            {["Inpatient Treatment", "Outpatient Treatment", "Sober Living", "Sober Coaches/Companions"].includes(editedSubmission.category) && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg">Recovery Fellowships</h3>
                <div className="grid grid-cols-2 gap-2 border rounded-lg p-3 bg-muted">
                  {["Alcoholics Anonymous (AA)", "Narcotics Anonymous (NA)", "SMART Recovery", "Celebrate Recovery", "Refuge Recovery / Recovery Dharma", "ACA (Adult Children of Alcoholics)", "Other"].map((fellowship) => (
                    <div key={fellowship} className="flex items-center space-x-2">
                      <Checkbox
                        id={`fellowship_${fellowship}`}
                        checked={(editedSubmission.recovery_fellowships || []).includes(fellowship)}
                        onCheckedChange={() => toggleArrayItem("recovery_fellowships", fellowship)}
                      />
                      <Label htmlFor={`fellowship_${fellowship}`} className="text-sm">{fellowship}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interventionist-Specific Fields */}
            {editedSubmission.category === "Interventionists" && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg">Interventionist Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cip_certified"
                      checked={editedSubmission.cip_certified || false}
                      onCheckedChange={(checked) => updateField("cip_certified", checked)}
                    />
                    <Label htmlFor="cip_certified">CIP Certified</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hourly_coaching_sessions"
                      checked={editedSubmission.hourly_coaching_sessions || false}
                      onCheckedChange={(checked) => updateField("hourly_coaching_sessions", checked)}
                    />
                    <Label htmlFor="hourly_coaching_sessions">Hourly Coaching Sessions</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="case_management_services"
                      checked={editedSubmission.case_management_services || false}
                      onCheckedChange={(checked) => updateField("case_management_services", checked)}
                    />
                    <Label htmlFor="case_management_services">Case Management Services</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="travel_expenses_included"
                      checked={editedSubmission.travel_expenses_included || false}
                      onCheckedChange={(checked) => updateField("travel_expenses_included", checked)}
                    />
                    <Label htmlFor="travel_expenses_included">Travel Expenses Included</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="works_nationally"
                      checked={editedSubmission.works_nationally || false}
                      onCheckedChange={(checked) => updateField("works_nationally", checked)}
                    />
                    <Label htmlFor="works_nationally">Works Nationally</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="works_internationally"
                      checked={editedSubmission.works_internationally || false}
                      onCheckedChange={(checked) => updateField("works_internationally", checked)}
                    />
                    <Label htmlFor="works_internationally">Works Internationally</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="hourly_coaching_rate">Hourly Coaching Rate</Label>
                  <Input
                    id="hourly_coaching_rate"
                    value={editedSubmission.hourly_coaching_rate || ""}
                    onChange={(e) => updateField("hourly_coaching_rate", e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Languages Spoken</Label>
                  <div className="grid grid-cols-3 gap-2 border rounded-lg p-3 bg-muted">
                    {["Spanish", "French", "German", "Portuguese", "Italian", "Mandarin", "Cantonese", "Japanese", "Korean", "Arabic", "Russian", "Hindi", "Vietnamese", "Tagalog", "Farsi"].map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang_int_${language}`}
                          checked={(editedSubmission.languages_spoken || []).includes(language)}
                          onCheckedChange={() => toggleArrayItem("languages_spoken", language)}
                        />
                        <Label htmlFor={`lang_int_${language}`} className="text-sm">{language}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sober Living-Specific Fields */}
            {editedSubmission.category === "Sober Living" && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg">Sober Living Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="awake_staff_24_7"
                      checked={editedSubmission.awake_staff_24_7 || false}
                      onCheckedChange={(checked) => updateField("awake_staff_24_7", checked)}
                    />
                    <Label htmlFor="awake_staff_24_7">Awake Staff 24/7</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="residents_expected_to_work"
                      checked={editedSubmission.residents_expected_to_work || false}
                      onCheckedChange={(checked) => updateField("residents_expected_to_work", checked)}
                    />
                    <Label htmlFor="residents_expected_to_work">Residents Expected to Work</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="job_assistance_provided"
                      checked={editedSubmission.job_assistance_provided || false}
                      onCheckedChange={(checked) => updateField("job_assistance_provided", checked)}
                    />
                    <Label htmlFor="job_assistance_provided">Job Assistance Provided</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accepts_mat_residents"
                      checked={editedSubmission.accepts_mat_residents || false}
                      onCheckedChange={(checked) => updateField("accepts_mat_residents", checked)}
                    />
                    <Label htmlFor="accepts_mat_residents">Accepts MAT Residents</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mandatory_curfew"
                      checked={editedSubmission.mandatory_curfew || false}
                      onCheckedChange={(checked) => updateField("mandatory_curfew", checked)}
                    />
                    <Label htmlFor="mandatory_curfew">Mandatory Curfew</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mandatory_house_meetings"
                      checked={editedSubmission.mandatory_house_meetings || false}
                      onCheckedChange={(checked) => updateField("mandatory_house_meetings", checked)}
                    />
                    <Label htmlFor="mandatory_house_meetings">Mandatory House Meetings</Label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="chores_required"
                    checked={editedSubmission.chores_required || false}
                    onCheckedChange={(checked) => updateField("chores_required", checked)}
                  />
                  <Label htmlFor="chores_required">Chores Required</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="curfew_time">Curfew Time</Label>
                    <Input
                      id="curfew_time"
                      value={editedSubmission.curfew_time || ""}
                      onChange={(e) => updateField("curfew_time", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="house_meetings_per_week">House Meetings Per Week</Label>
                    <Input
                      id="house_meetings_per_week"
                      type="number"
                      value={editedSubmission.house_meetings_per_week || ""}
                      onChange={(e) => updateField("house_meetings_per_week", parseInt(e.target.value) || null)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="medication_administration">Medication Administration</Label>
                    <Input
                      id="medication_administration"
                      value={editedSubmission.medication_administration || ""}
                      onChange={(e) => updateField("medication_administration", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimum_time_since_last_use">Minimum Time Since Last Use</Label>
                    <Input
                      id="minimum_time_since_last_use"
                      value={editedSubmission.minimum_time_since_last_use || ""}
                      onChange={(e) => updateField("minimum_time_since_last_use", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="required_meetings_per_week">Required Meetings Per Week</Label>
                  <Input
                    id="required_meetings_per_week"
                    value={editedSubmission.required_meetings_per_week || ""}
                    onChange={(e) => updateField("required_meetings_per_week", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Sober Coaches/Companions-Specific Fields */}
            {editedSubmission.category === "Sober Coaches/Companions" && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg">Sober Coach/Companion Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in_person_companion_work"
                      checked={editedSubmission.in_person_companion_work || false}
                      onCheckedChange={(checked) => updateField("in_person_companion_work", checked)}
                    />
                    <Label htmlFor="in_person_companion_work">In Person Companion Work</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has_valid_passport"
                      checked={editedSubmission.has_valid_passport || false}
                      onCheckedChange={(checked) => updateField("has_valid_passport", checked)}
                    />
                    <Label htmlFor="has_valid_passport">Has Valid Passport</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="daily_companion_fee">Daily Companion Fee</Label>
                  <Input
                    id="daily_companion_fee"
                    value={editedSubmission.daily_companion_fee || ""}
                    onChange={(e) => updateField("daily_companion_fee", e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="telehealth_available_coach"
                    checked={editedSubmission.telehealth_available || false}
                    onCheckedChange={(checked) => updateField("telehealth_available", checked)}
                  />
                  <Label htmlFor="telehealth_available_coach">Telehealth Available</Label>
                </div>

                <div>
                  <Label className="mb-2 block">Languages Spoken</Label>
                  <div className="grid grid-cols-3 gap-2 border rounded-lg p-3 bg-muted">
                    {["Spanish", "French", "German", "Portuguese", "Italian", "Mandarin", "Cantonese", "Japanese", "Korean", "Arabic", "Russian", "Hindi", "Vietnamese", "Tagalog", "Farsi"].map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang_coach_${language}`}
                          checked={(editedSubmission.languages_spoken || []).includes(language)}
                          onCheckedChange={() => toggleArrayItem("languages_spoken", language)}
                        />
                        <Label htmlFor={`lang_coach_${language}`} className="text-sm">{language}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Therapist/Psychiatrist-Specific Fields */}
            {["Therapists", "Psychiatrists"].includes(editedSubmission.category) && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg">Clinical Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="license_current_good_standing"
                      checked={editedSubmission.license_current_good_standing || false}
                      onCheckedChange={(checked) => updateField("license_current_good_standing", checked)}
                    />
                    <Label htmlFor="license_current_good_standing">License Current and Good Standing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="substance_use_disorder_experience"
                      checked={editedSubmission.substance_use_disorder_experience || false}
                      onCheckedChange={(checked) => updateField("substance_use_disorder_experience", checked)}
                    />
                    <Label htmlFor="substance_use_disorder_experience">SUD Experience</Label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="telehealth_available_clinical"
                    checked={editedSubmission.telehealth_available || false}
                    onCheckedChange={(checked) => updateField("telehealth_available", checked)}
                  />
                  <Label htmlFor="telehealth_available_clinical">Telehealth Available</Label>
                </div>
              </div>
            )}

            {/* Social Media Links - for all categories */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-lg">Social Media Links</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <Input
                    id="youtube_url"
                    value={editedSubmission.youtube_url || ""}
                    onChange={(e) => updateField("youtube_url", e.target.value)}
                    placeholder="https://youtube.com/@channel"
                  />
                </div>
                <div>
                  <Label htmlFor="tiktok_url">TikTok URL</Label>
                  <Input
                    id="tiktok_url"
                    value={editedSubmission.tiktok_url || ""}
                    onChange={(e) => updateField("tiktok_url", e.target.value)}
                    placeholder="https://tiktok.com/@username"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram_url">Instagram URL</Label>
                  <Input
                    id="instagram_url"
                    value={editedSubmission.instagram_url || ""}
                    onChange={(e) => updateField("instagram_url", e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    value={editedSubmission.facebook_url || ""}
                    onChange={(e) => updateField("facebook_url", e.target.value)}
                    placeholder="https://facebook.com/page"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
