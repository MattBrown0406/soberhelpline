import { useState, useEffect } from "react";
import { Save, Loader2, Printer, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const relationshipOptions = ["Parent", "Spouse/Partner", "Sibling", "Adult Child"];
const substanceOptions = ["Alcohol", "Opioids", "Methamphetamine", "Cocaine", "Benzodiazepines", "Marijuana", "Prescription misuse", "Gambling"];
const currentStatusOptions = ["Actively using", "Early recovery (0–90 days)", "3–12 months sober", "1+ year sober", "In treatment", "Refusing treatment"];
const enablingOptions = ["Provided financial support", "Covered up behavior", "Rescued from consequences", "Failed to enforce a consequence", "Allowed rule violations to avoid conflict"];
const financialRiskOptions = ["Loved one lives at home", "You financially support them", "Legal expenses ongoing", "Debt related to addiction", "Risk of eviction/homelessness", "Risk of job loss"];
const coachingGoalOptions = ["Clear boundaries", "Reduced conflict", "Emotional stability", "Financial clarity", "Relapse response plan", "Preparing for intervention", "Strengthening marriage", "Letting go of control"];
const riskOptions = ["Overdose", "Physical violence", "Suicidal statements", "Domestic violence", "Severe mental health breakdown", "Access to firearms during intoxication"];

const stressLabels = ["0 – Calm", "1 – Mild", "2 – Elevated", "3 – Severe", "4 – Crisis"];
const conflictLabels = ["0 – Rare", "1 – Monthly", "2 – Weekly", "3 – Several times weekly", "4 – Daily"];

interface CoachingIntakeAssessmentProps {
  readOnly?: boolean;
  assessmentData?: any;
}

function calculatePhase(data: any): string {
  let crisisScore = 0;
  let distressScore = 0;
  let enablingScore = 0;
  let divisionScore = 0;
  let financialScore = 0;

  if ((data.risk_indicators || []).length > 0) crisisScore += 3;
  if (data.history_overdose === "Yes") crisisScore += 2;
  if (data.history_violence === "Yes") crisisScore += 2;
  if (data.history_suicidal === "Yes") crisisScore += 2;
  if ((data.household_stress_level || 0) >= 3) crisisScore += 1;

  if (data.anxiety_level === "High" || data.anxiety_level === "Constant") distressScore += 2;
  if (data.emotionally_exhausted === "Frequently" || data.emotionally_exhausted === "Constantly") distressScore += 2;
  if (data.sleep_quality === "Poor") distressScore += 1;
  if (data.outside_support === "No support") distressScore += 1;

  enablingScore = (data.enabling_behaviors || []).length;

  if (data.decision_makers_aligned === "Deep division") divisionScore += 2;
  if (data.unified_approach === "Completely divided") divisionScore += 2;

  financialScore = (data.financial_risks || []).length;

  const total = crisisScore + distressScore + enablingScore + divisionScore + financialScore;

  if (crisisScore >= 5 || total >= 12) return "Stabilization";
  if (total >= 7) return "Transition";
  if (total >= 3) return "Maintenance";
  return "Long-Term Support";
}

export default function CoachingIntakeAssessment({ readOnly = false, assessmentData }: CoachingIntakeAssessmentProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Section 1
  const [contactName, setContactName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [relationshipOther, setRelationshipOther] = useState("");
  const [multipleMembers, setMultipleMembers] = useState(false);
  const [membersList, setMembersList] = useState("");

  // Section 2
  const [lovedOneAge, setLovedOneAge] = useState("");
  const [substances, setSubstances] = useState<string[]>([]);
  const [substanceOther, setSubstanceOther] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [historyOverdose, setHistoryOverdose] = useState("");
  const [overdoseDate, setOverdoseDate] = useState("");
  const [historyViolence, setHistoryViolence] = useState("");
  const [historySuicidal, setHistorySuicidal] = useState("");
  const [historyDetails, setHistoryDetails] = useState("");

  // Section 3
  const [stressLevel, setStressLevel] = useState<number>(0);
  const [conflictFrequency, setConflictFrequency] = useState<number>(0);
  const [feelSafe, setFeelSafe] = useState("");

  // Section 4
  const [enablingBehaviors, setEnablingBehaviors] = useState<string[]>([]);
  const [writtenBoundaries, setWrittenBoundaries] = useState("");
  const [decisionMakersAligned, setDecisionMakersAligned] = useState("");

  // Section 5
  const [sleepQuality, setSleepQuality] = useState("");
  const [anxietyLevel, setAnxietyLevel] = useState("");
  const [emotionallyExhausted, setEmotionallyExhausted] = useState("");
  const [outsideSupport, setOutsideSupport] = useState("");

  // Section 6
  const [financialRisks, setFinancialRisks] = useState<string[]>([]);

  // Section 7
  const [unifiedApproach, setUnifiedApproach] = useState("");
  const [argumentsStrain, setArgumentsStrain] = useState("");

  // Section 8
  const [coachingGoals, setCoachingGoals] = useState<string[]>([]);
  const [goalOther, setGoalOther] = useState("");
  const [mostUrgent, setMostUrgent] = useState("");

  // Section 9
  const [readinessEnforce, setReadinessEnforce] = useState<number>(5);
  const [readinessRescue, setReadinessRescue] = useState<number>(5);
  const [confidenceChange, setConfidenceChange] = useState<number>(5);

  // Section 10
  const [riskIndicators, setRiskIndicators] = useState<string[]>([]);

  const toggleItem = (list: string[], item: string, setter: (v: string[]) => void) => {
    if (readOnly) return;
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const populateFromData = (d: any) => {
    setContactName(d.primary_contact_name || "");
    setRelationship(d.relationship_to_loved_one || "");
    setRelationshipOther(d.relationship_other || "");
    setMultipleMembers(d.multiple_family_members || false);
    setMembersList(d.family_members_list || "");
    setLovedOneAge(d.loved_one_age || "");
    setSubstances(d.substances || []);
    setSubstanceOther(d.substance_other || "");
    setCurrentStatus(d.current_status || "");
    setHistoryOverdose(d.history_overdose || "");
    setOverdoseDate(d.overdose_date || "");
    setHistoryViolence(d.history_violence || "");
    setHistorySuicidal(d.history_suicidal || "");
    setHistoryDetails(d.history_details || "");
    setStressLevel(d.household_stress_level ?? 0);
    setConflictFrequency(d.conflict_frequency ?? 0);
    setFeelSafe(d.feel_safe || "");
    setEnablingBehaviors(d.enabling_behaviors || []);
    setWrittenBoundaries(d.written_boundaries || "");
    setDecisionMakersAligned(d.decision_makers_aligned || "");
    setSleepQuality(d.sleep_quality || "");
    setAnxietyLevel(d.anxiety_level || "");
    setEmotionallyExhausted(d.emotionally_exhausted || "");
    setOutsideSupport(d.outside_support || "");
    setFinancialRisks(d.financial_risks || []);
    setUnifiedApproach(d.unified_approach || "");
    setArgumentsStrain(d.arguments_strain || "");
    setCoachingGoals(d.coaching_goals || []);
    setGoalOther(d.coaching_goal_other || "");
    setMostUrgent(d.most_urgent || "");
    setReadinessEnforce(d.readiness_enforce_boundaries ?? 5);
    setReadinessRescue(d.readiness_stop_rescuing ?? 5);
    setConfidenceChange(d.confidence_change ?? 5);
    setRiskIndicators(d.risk_indicators || []);
    if (d.id) setSubmitted(true);
  };

  useEffect(() => {
    if (assessmentData) {
      populateFromData(assessmentData);
      setLoading(false);
      return;
    }
    loadExisting();
  }, [assessmentData]);

  const loadExisting = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);

    const { data } = await supabase
      .from("coaching_intake_assessments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setExistingId(data.id);
      populateFromData(data);
    }
    setLoading(false);
  };

  const buildPayload = () => {
    const payload = {
      primary_contact_name: contactName,
      relationship_to_loved_one: relationship,
      relationship_other: relationshipOther,
      multiple_family_members: multipleMembers,
      family_members_list: membersList,
      loved_one_age: lovedOneAge,
      substances,
      substance_other: substanceOther,
      current_status: currentStatus,
      history_overdose: historyOverdose,
      overdose_date: overdoseDate,
      history_violence: historyViolence,
      history_suicidal: historySuicidal,
      history_details: historyDetails,
      household_stress_level: stressLevel,
      conflict_frequency: conflictFrequency,
      feel_safe: feelSafe,
      enabling_behaviors: enablingBehaviors,
      written_boundaries: writtenBoundaries,
      decision_makers_aligned: decisionMakersAligned,
      sleep_quality: sleepQuality,
      anxiety_level: anxietyLevel,
      emotionally_exhausted: emotionallyExhausted,
      outside_support: outsideSupport,
      financial_risks: financialRisks,
      unified_approach: unifiedApproach,
      arguments_strain: argumentsStrain,
      coaching_goals: coachingGoals,
      coaching_goal_other: goalOther,
      most_urgent: mostUrgent,
      readiness_enforce_boundaries: readinessEnforce,
      readiness_stop_rescuing: readinessRescue,
      confidence_change: confidenceChange,
      risk_indicators: riskIndicators,
      assigned_phase: "",
    };
    payload.assigned_phase = calculatePhase(payload);
    return payload;
  };

  const handleSave = async () => {
    if (!userId) {
      toast({ title: "Please sign in", description: "You must be logged in to save your assessment.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (existingId) {
        const { error } = await supabase.from("coaching_intake_assessments").update(payload).eq("id", existingId);
        if (error) throw error;
        toast({ title: "Assessment updated" });
      } else {
        const { data, error } = await supabase.from("coaching_intake_assessments").insert({ ...payload, user_id: userId }).select("id").single();
        if (error) throw error;
        setExistingId(data.id);
        toast({ title: "Assessment saved", description: "Your intake assessment has been saved to your profile." });
      }
      setSubmitted(true);
    } catch (err: any) {
      toast({ title: "Error saving", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setContactName(""); setRelationship(""); setRelationshipOther(""); setMultipleMembers(false); setMembersList("");
    setLovedOneAge(""); setSubstances([]); setSubstanceOther(""); setCurrentStatus(""); setHistoryOverdose("");
    setOverdoseDate(""); setHistoryViolence(""); setHistorySuicidal(""); setHistoryDetails("");
    setStressLevel(0); setConflictFrequency(0); setFeelSafe("");
    setEnablingBehaviors([]); setWrittenBoundaries(""); setDecisionMakersAligned("");
    setSleepQuality(""); setAnxietyLevel(""); setEmotionallyExhausted(""); setOutsideSupport("");
    setFinancialRisks([]); setUnifiedApproach(""); setArgumentsStrain("");
    setCoachingGoals([]); setGoalOther(""); setMostUrgent("");
    setReadinessEnforce(5); setReadinessRescue(5); setConfidenceChange(5);
    setRiskIndicators([]); setExistingId(null); setSubmitted(false);
  };

  if (loading) return <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const assignedPhase = buildPayload().assigned_phase;
  const hasRiskFlags = riskIndicators.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-1 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Family Coaching Intake Assessment™
        </h2>
        <p className="text-muted-foreground text-sm">Confidential – For Coaching Purposes Only · Estimated Time: 12–15 Minutes</p>
        {existingId && !readOnly && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">✓ Previously saved assessment loaded</p>
        )}
      </div>

      {/* SECTION 1 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Section 1: Family Identification</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-medium">Primary Contact Name</Label>
            <Input value={contactName} onChange={e => setContactName(e.target.value)} readOnly={readOnly} placeholder="Your full name" />
          </div>
          <div>
            <Label className="font-medium mb-2 block">Relationship to Loved One</Label>
            <RadioGroup value={relationship} onValueChange={readOnly ? undefined : setRelationship} disabled={readOnly} className="space-y-2">
              {relationshipOptions.map(opt => (
                <div key={opt} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`rel-${opt}`} disabled={readOnly} />
                  <Label htmlFor={`rel-${opt}`} className="cursor-pointer">{opt}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Other" id="rel-other" disabled={readOnly} />
                <Label htmlFor="rel-other" className="cursor-pointer">Other:</Label>
                <Input value={relationshipOther} onChange={e => setRelationshipOther(e.target.value)} className="flex-1 h-8" readOnly={readOnly} placeholder="Specify..." />
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label className="font-medium mb-2 block">Are multiple family members participating in coaching?</Label>
            <RadioGroup value={multipleMembers ? "Yes" : "No"} onValueChange={readOnly ? undefined : v => setMultipleMembers(v === "Yes")} disabled={readOnly} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="multi-yes" disabled={readOnly} /><Label htmlFor="multi-yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="multi-no" disabled={readOnly} /><Label htmlFor="multi-no">No</Label></div>
            </RadioGroup>
            {multipleMembers && (
              <Textarea value={membersList} onChange={e => setMembersList(e.target.value)} placeholder="List names & relationships..." rows={2} className="mt-2" readOnly={readOnly} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Section 2: Loved One Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-medium">Age</Label>
            <Input value={lovedOneAge} onChange={e => setLovedOneAge(e.target.value)} readOnly={readOnly} placeholder="Age" className="w-24" />
          </div>
          <div>
            <Label className="font-medium mb-2 block">Primary Substance(s) of Concern</Label>
            <div className="grid grid-cols-2 gap-2">
              {substanceOptions.map(s => (
                <div key={s} className="flex items-center space-x-2">
                  <Checkbox id={`sub-${s}`} checked={substances.includes(s)} onCheckedChange={() => toggleItem(substances, s, setSubstances)} disabled={readOnly} />
                  <Label htmlFor={`sub-${s}`} className="cursor-pointer text-sm">{s}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2 col-span-2">
                <Checkbox id="sub-other" checked={substances.includes("Other")} onCheckedChange={() => toggleItem(substances, "Other", setSubstances)} disabled={readOnly} />
                <Label htmlFor="sub-other" className="cursor-pointer text-sm">Other:</Label>
                <Input value={substanceOther} onChange={e => setSubstanceOther(e.target.value)} className="flex-1 h-8" readOnly={readOnly} />
              </div>
            </div>
          </div>
          <div>
            <Label className="font-medium mb-2 block">Current Status</Label>
            <RadioGroup value={currentStatus} onValueChange={readOnly ? undefined : setCurrentStatus} disabled={readOnly} className="space-y-2">
              {currentStatusOptions.map(opt => (
                <div key={opt} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`status-${opt}`} disabled={readOnly} />
                  <Label htmlFor={`status-${opt}`} className="cursor-pointer text-sm">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="font-medium mb-2 block">History of overdose?</Label>
              <RadioGroup value={historyOverdose} onValueChange={readOnly ? undefined : setHistoryOverdose} disabled={readOnly} className="space-y-1">
                <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="od-no" disabled={readOnly} /><Label htmlFor="od-no">No</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="od-yes" disabled={readOnly} /><Label htmlFor="od-yes">Yes</Label></div>
              </RadioGroup>
              {historyOverdose === "Yes" && <Input value={overdoseDate} onChange={e => setOverdoseDate(e.target.value)} placeholder="Date..." className="mt-1 h-8" readOnly={readOnly} />}
            </div>
            <div>
              <Label className="font-medium mb-2 block">History of violence/threats?</Label>
              <RadioGroup value={historyViolence} onValueChange={readOnly ? undefined : setHistoryViolence} disabled={readOnly} className="space-y-1">
                <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="vio-no" disabled={readOnly} /><Label htmlFor="vio-no">No</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="vio-yes" disabled={readOnly} /><Label htmlFor="vio-yes">Yes</Label></div>
              </RadioGroup>
            </div>
            <div>
              <Label className="font-medium mb-2 block">History of suicidal ideation?</Label>
              <RadioGroup value={historySuicidal} onValueChange={readOnly ? undefined : setHistorySuicidal} disabled={readOnly} className="space-y-1">
                <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="sui-no" disabled={readOnly} /><Label htmlFor="sui-no">No</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="Yes" id="sui-yes" disabled={readOnly} /><Label htmlFor="sui-yes">Yes</Label></div>
              </RadioGroup>
            </div>
          </div>
          {(historyOverdose === "Yes" || historyViolence === "Yes" || historySuicidal === "Yes") && (
            <div>
              <Label className="font-medium">If yes to any above, briefly explain:</Label>
              <Textarea value={historyDetails} onChange={e => setHistoryDetails(e.target.value)} rows={2} readOnly={readOnly} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 3 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Section 3: Current Stability Level</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">In the last 30 days:</p>
          <div>
            <Label className="font-medium mb-3 block">Household stress level: <span className="text-primary font-bold">{stressLabels[stressLevel]}</span></Label>
            <Slider value={[stressLevel]} onValueChange={readOnly ? undefined : v => setStressLevel(v[0])} min={0} max={4} step={1} disabled={readOnly} />
          </div>
          <div>
            <Label className="font-medium mb-3 block">Frequency of conflict: <span className="text-primary font-bold">{conflictLabels[conflictFrequency]}</span></Label>
            <Slider value={[conflictFrequency]} onValueChange={readOnly ? undefined : v => setConflictFrequency(v[0])} min={0} max={4} step={1} disabled={readOnly} />
          </div>
          <div>
            <Label className="font-medium mb-2 block">Do you feel safe in your home?</Label>
            <RadioGroup value={feelSafe} onValueChange={readOnly ? undefined : setFeelSafe} disabled={readOnly} className="flex gap-4 flex-wrap">
              {["Yes", "Sometimes", "No"].map(opt => (
                <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`safe-${opt}`} disabled={readOnly} /><Label htmlFor={`safe-${opt}`}>{opt}</Label></div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Section 4: Enabling & Boundaries</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">In the past 60 days:</p>
          <div className="space-y-2">
            {enablingOptions.map(opt => (
              <div key={opt} className="flex items-center space-x-2">
                <Checkbox id={`en-${opt}`} checked={enablingBehaviors.includes(opt)} onCheckedChange={() => toggleItem(enablingBehaviors, opt, setEnablingBehaviors)} disabled={readOnly} />
                <Label htmlFor={`en-${opt}`} className="cursor-pointer text-sm">{opt}</Label>
              </div>
            ))}
          </div>
          <div>
            <Label className="font-medium mb-2 block">Do you currently have written boundaries in place?</Label>
            <RadioGroup value={writtenBoundaries} onValueChange={readOnly ? undefined : setWrittenBoundaries} disabled={readOnly} className="flex gap-4">
              {["Yes", "No"].map(opt => (
                <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`wb-${opt}`} disabled={readOnly} /><Label htmlFor={`wb-${opt}`}>{opt}</Label></div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label className="font-medium mb-2 block">Are all decision-makers aligned?</Label>
            <RadioGroup value={decisionMakersAligned} onValueChange={readOnly ? undefined : setDecisionMakersAligned} disabled={readOnly} className="space-y-2">
              {["Fully aligned", "Some disagreement", "Deep division"].map(opt => (
                <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`dm-${opt}`} disabled={readOnly} /><Label htmlFor={`dm-${opt}`}>{opt}</Label></div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Section 5: Family Emotional Health</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Over the past month:</p>
          <div>
            <Label className="font-medium mb-2 block">Sleep quality</Label>
            <RadioGroup value={sleepQuality} onValueChange={readOnly ? undefined : setSleepQuality} disabled={readOnly} className="flex gap-4 flex-wrap">
              {["Good", "Disrupted", "Poor"].map(opt => (
                <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`sleep-${opt}`} disabled={readOnly} /><Label htmlFor={`sleep-${opt}`}>{opt}</Label></div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label className="font-medium mb-2 block">Anxiety level</Label>
            <RadioGroup value={anxietyLevel} onValueChange={readOnly ? undefined : setAnxietyLevel} disabled={readOnly} className="flex gap-4 flex-wrap">
              {["Low", "Moderate", "High", "Constant"].map(opt => (
                <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`anx-${opt}`} disabled={readOnly} /><Label htmlFor={`anx-${opt}`}>{opt}</Label></div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label className="font-medium mb-2 block">Do you feel emotionally exhausted?</Label>
            <RadioGroup value={emotionallyExhausted} onValueChange={readOnly ? undefined : setEmotionallyExhausted} disabled={readOnly} className="flex gap-4 flex-wrap">
              {["No", "Sometimes", "Frequently", "Constantly"].map(opt => (
                <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`exh-${opt}`} disabled={readOnly} /><Label htmlFor={`exh-${opt}`}>{opt}</Label></div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label className="font-medium mb-2 block">Do you have outside support?</Label>
            <RadioGroup value={outsideSupport} onValueChange={readOnly ? undefined : setOutsideSupport} disabled={readOnly} className="space-y-2">
              {["Strong support", "Limited support", "No support"].map(opt => (
                <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`sup-${opt}`} disabled={readOnly} /><Label htmlFor={`sup-${opt}`}>{opt}</Label></div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 6 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Section 6: Financial Risk Factors</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {financialRiskOptions.map(opt => (
              <div key={opt} className="flex items-center space-x-2">
                <Checkbox id={`fin-${opt}`} checked={financialRisks.includes(opt)} onCheckedChange={() => toggleItem(financialRisks, opt, setFinancialRisks)} disabled={readOnly} />
                <Label htmlFor={`fin-${opt}`} className="cursor-pointer text-sm">{opt}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 7 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Section 7: Couple / Family Alignment</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground italic">(If applicable)</p>
          <div>
            <Label className="font-medium mb-2 block">Are you unified in your approach?</Label>
            <RadioGroup value={unifiedApproach} onValueChange={readOnly ? undefined : setUnifiedApproach} disabled={readOnly} className="space-y-2">
              {["Yes", "Mostly", "Frequently conflicted", "Completely divided"].map(opt => (
                <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`uni-${opt}`} disabled={readOnly} /><Label htmlFor={`uni-${opt}`}>{opt}</Label></div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label className="font-medium mb-2 block">Do arguments about addiction strain your relationship?</Label>
            <RadioGroup value={argumentsStrain} onValueChange={readOnly ? undefined : setArgumentsStrain} disabled={readOnly} className="space-y-2">
              {["Rarely", "Sometimes", "Frequently", "Severely"].map(opt => (
                <div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`arg-${opt}`} disabled={readOnly} /><Label htmlFor={`arg-${opt}`}>{opt}</Label></div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 8 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Section 8: Goals for Coaching</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-medium mb-2 block">What would make coaching successful for you?</Label>
            <div className="grid grid-cols-2 gap-2">
              {coachingGoalOptions.map(opt => (
                <div key={opt} className="flex items-center space-x-2">
                  <Checkbox id={`goal-${opt}`} checked={coachingGoals.includes(opt)} onCheckedChange={() => toggleItem(coachingGoals, opt, setCoachingGoals)} disabled={readOnly} />
                  <Label htmlFor={`goal-${opt}`} className="cursor-pointer text-sm">{opt}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2 col-span-2">
                <Checkbox id="goal-other" checked={coachingGoals.includes("Other")} onCheckedChange={() => toggleItem(coachingGoals, "Other", setCoachingGoals)} disabled={readOnly} />
                <Label htmlFor="goal-other" className="cursor-pointer text-sm">Other:</Label>
                <Input value={goalOther} onChange={e => setGoalOther(e.target.value)} className="flex-1 h-8" readOnly={readOnly} />
              </div>
            </div>
          </div>
          <div>
            <Label className="font-medium">In one sentence, what feels most urgent?</Label>
            <Textarea value={mostUrgent} onChange={e => setMostUrgent(e.target.value)} rows={2} readOnly={readOnly} placeholder="What feels most urgent right now..." />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 9 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Section 9: Readiness for Change</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">On a scale of 1–10:</p>
          <div>
            <Label className="font-medium mb-3 block">How ready are you to enforce boundaries? <span className="text-primary font-bold">{readinessEnforce}</span></Label>
            <Slider value={[readinessEnforce]} onValueChange={readOnly ? undefined : v => setReadinessEnforce(v[0])} min={1} max={10} step={1} disabled={readOnly} />
          </div>
          <div>
            <Label className="font-medium mb-3 block">How ready are you to stop rescuing? <span className="text-primary font-bold">{readinessRescue}</span></Label>
            <Slider value={[readinessRescue]} onValueChange={readOnly ? undefined : v => setReadinessRescue(v[0])} min={1} max={10} step={1} disabled={readOnly} />
          </div>
          <div>
            <Label className="font-medium mb-3 block">How confident are you that change is possible? <span className="text-primary font-bold">{confidenceChange}</span></Label>
            <Slider value={[confidenceChange]} onValueChange={readOnly ? undefined : v => setConfidenceChange(v[0])} min={1} max={10} step={1} disabled={readOnly} />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 10 */}
      <Card className={hasRiskFlags ? "border-destructive/50" : ""}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {hasRiskFlags && <AlertTriangle className="h-5 w-5 text-destructive" />}
            Section 10: Risk Screen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">In the past 30 days has there been:</p>
          <div className="space-y-2">
            {riskOptions.map(opt => (
              <div key={opt} className="flex items-center space-x-2">
                <Checkbox id={`risk-${opt}`} checked={riskIndicators.includes(opt)} onCheckedChange={() => toggleItem(riskIndicators, opt, setRiskIndicators)} disabled={readOnly} />
                <Label htmlFor={`risk-${opt}`} className="cursor-pointer text-sm">{opt}</Label>
              </div>
            ))}
          </div>
          {hasRiskFlags && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              <strong>⚠ Crisis indicators detected.</strong> Automatic crisis review will be triggered upon submission.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phase Result (shown after save) */}
      {submitted && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Assessment Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Assigned Phase:</span>
              <Badge variant="secondary" className="text-sm">{assignedPhase}</Badge>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "Thank you. Your responses help us understand where your family is in the recovery journey. A coach will review your assessment and recommend the most appropriate level of support."
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {!readOnly && (
        <div className="flex gap-3 print:hidden">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {existingId ? "Update Assessment" : "Save Assessment"}
          </Button>
          <Button variant="outline" onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleReset}>Start New</Button>
        </div>
      )}
    </div>
  );
}
