import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, FileCheck, Printer, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const valueExamples = [
  "Safety", "Honesty", "Stability", "Respect", "Responsibility", "Financial integrity", "Emotional health",
];

const fearOptions = [
  "They will relapse",
  "They will hate me",
  "They will cut me off",
  "They will become homeless",
  "I will feel unbearable guilt",
];

const enforcementChecks = [
  "Stay calm",
  "Avoid arguing",
  "Repeat the boundary once",
  "Follow through without debate",
  "Seek support after enforcement",
];

const boundaryChecks = ["Clear", "Specific", "About my behavior", "Enforceable"];

interface BoundaryClarityWorksheetProps {
  readOnly?: boolean;
  worksheetData?: any;
}

export default function BoundaryClarityWorksheet({ readOnly = false, worksheetData }: BoundaryClarityWorksheetProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [values, setValues] = useState("");
  const [mostViolated, setMostViolated] = useState("");
  const [problemBehavior, setProblemBehavior] = useState("");
  const [boundaryStatement, setBoundaryStatement] = useState("");
  const [boundaryChecklist, setBoundaryChecklist] = useState<string[]>([]);
  const [violation1, setViolation1] = useState("");
  const [violation2, setViolation2] = useState("");
  const [finalConsequence, setFinalConsequence] = useState("");
  const [willingFollowThrough, setWillingFollowThrough] = useState("");
  const [selectedFears, setSelectedFears] = useState<string[]>([]);
  const [fearOther, setFearOther] = useState("");
  const [fearSentence, setFearSentence] = useState("");
  const [fearOrFactual, setFearOrFactual] = useState("");
  const [unityCheck, setUnityCheck] = useState("");
  const [unityResolve, setUnityResolve] = useState("");
  const [communicationScript, setCommunicationScript] = useState("");
  const [enforcementPlan, setEnforcementPlan] = useState<string[]>([]);
  const [selfReflection, setSelfReflection] = useState("");

  const toggleItem = (list: string[], item: string, setter: (v: string[]) => void) => {
    if (readOnly) return;
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const populateFromData = (data: any) => {
    setValues((data.values_list || []).join(", "));
    setMostViolated(data.most_violated_value || "");
    setProblemBehavior(data.problem_behavior || "");
    setBoundaryStatement(data.boundary_statement || "");
    const checks: string[] = [];
    if (data.boundary_clear) checks.push("Clear");
    if (data.boundary_specific) checks.push("Specific");
    if (data.boundary_about_me) checks.push("About my behavior");
    if (data.boundary_enforceable) checks.push("Enforceable");
    setBoundaryChecklist(checks);
    setViolation1(data.first_violation_response || "");
    setViolation2(data.second_violation_response || "");
    setFinalConsequence(data.final_consequence || "");
    setWillingFollowThrough(data.willing_to_follow_through || "");
    setSelectedFears(data.fears || []);
    setFearOther(data.fear_other || "");
    setFearSentence(data.fear_sentence || "");
    setFearOrFactual(data.fear_emotional_or_factual || "");
    setUnityCheck(data.unity_status || "");
    setUnityResolve(data.unity_resolution || "");
    setCommunicationScript(data.communication_script || "");
    const ePlan: string[] = [];
    if (data.enforcement_stay_calm) ePlan.push("Stay calm");
    if (data.enforcement_avoid_arguing) ePlan.push("Avoid arguing");
    if (data.enforcement_repeat_once) ePlan.push("Repeat the boundary once");
    if (data.enforcement_follow_through) ePlan.push("Follow through without debate");
    if (data.enforcement_seek_support) ePlan.push("Seek support after enforcement");
    setEnforcementPlan(ePlan);
    setSelfReflection(data.self_reflection || "");
  };

  useEffect(() => {
    if (worksheetData) {
      populateFromData(worksheetData);
      setLoading(false);
      return;
    }
    loadExisting();
  }, [worksheetData]);

  const loadExisting = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);

    const { data } = await supabase
      .from("boundary_clarity_worksheets")
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

  const buildPayload = () => ({
    values_list: values.split(",").map(v => v.trim()).filter(Boolean),
    most_violated_value: mostViolated,
    problem_behavior: problemBehavior,
    boundary_statement: boundaryStatement,
    boundary_clear: boundaryChecklist.includes("Clear"),
    boundary_specific: boundaryChecklist.includes("Specific"),
    boundary_about_me: boundaryChecklist.includes("About my behavior"),
    boundary_enforceable: boundaryChecklist.includes("Enforceable"),
    first_violation_response: violation1,
    second_violation_response: violation2,
    final_consequence: finalConsequence,
    willing_to_follow_through: willingFollowThrough,
    fears: selectedFears,
    fear_other: fearOther,
    fear_sentence: fearSentence,
    fear_emotional_or_factual: fearOrFactual,
    unity_status: unityCheck,
    unity_resolution: unityResolve,
    communication_script: communicationScript,
    enforcement_stay_calm: enforcementPlan.includes("Stay calm"),
    enforcement_avoid_arguing: enforcementPlan.includes("Avoid arguing"),
    enforcement_repeat_once: enforcementPlan.includes("Repeat the boundary once"),
    enforcement_follow_through: enforcementPlan.includes("Follow through without debate"),
    enforcement_seek_support: enforcementPlan.includes("Seek support after enforcement"),
    self_reflection: selfReflection,
  });

  const handleSave = async () => {
    if (!userId) {
      toast({ title: "Please sign in", description: "You must be logged in to save your worksheet.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (existingId) {
        const { error } = await supabase
          .from("boundary_clarity_worksheets")
          .update(buildPayload())
          .eq("id", existingId);
        if (error) throw error;
        toast({ title: "Worksheet updated", description: "Your Boundary Clarity Worksheet has been saved." });
      } else {
        const { data, error } = await supabase
          .from("boundary_clarity_worksheets")
          .insert({ ...buildPayload(), user_id: userId })
          .select("id")
          .single();
        if (error) throw error;
        setExistingId(data.id);
        toast({ title: "Worksheet saved", description: "Your Boundary Clarity Worksheet has been saved to your profile." });
      }
    } catch (err: any) {
      toast({ title: "Error saving", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setValues(""); setMostViolated(""); setProblemBehavior(""); setBoundaryStatement("");
    setBoundaryChecklist([]); setViolation1(""); setViolation2(""); setFinalConsequence("");
    setWillingFollowThrough(""); setSelectedFears([]); setFearOther(""); setFearSentence("");
    setFearOrFactual(""); setUnityCheck(""); setUnityResolve(""); setCommunicationScript("");
    setEnforcementPlan([]); setSelfReflection(""); setExistingId(null);
  };

  if (loading) return <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-1 flex items-center gap-2">
          <FileCheck className="h-6 w-6" />
          Boundary Clarity Worksheet™
        </h2>
        <p className="text-muted-foreground text-sm">
          Define boundaries that are clear, enforceable, and aligned with your values — not reactive, emotional, or punitive.
        </p>
        {existingId && !readOnly && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">✓ Previously saved worksheet loaded</p>
        )}
      </div>

      {/* PART 1 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Part 1: Values First (Before Limits)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground italic">
            Boundaries without values feel harsh. Boundaries rooted in values feel grounded.
          </p>
          <div>
            <Label className="font-medium">1. What are the top 5 values you want your household to operate from?</Label>
            <p className="text-xs text-muted-foreground mb-2">Examples: {valueExamples.join(", ")}</p>
            <Textarea value={values} onChange={(e) => setValues(e.target.value)} placeholder="Write your top 5 values..." rows={3} readOnly={readOnly} />
          </div>
          <div>
            <Label className="font-medium">2. Which value feels most violated right now?</Label>
            <Textarea value={mostViolated} onChange={(e) => setMostViolated(e.target.value)} placeholder="Describe which value..." rows={2} readOnly={readOnly} />
          </div>
        </CardContent>
      </Card>

      {/* PART 2 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Part 2: Define the Problem Clearly</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Choose one recurring issue. Examples: Asking for money, staying out all night, verbal aggression, not attending recovery meetings, living at home without contributing, drug use in the home.</p>
          <div>
            <Label className="font-medium">The specific behavior causing distress is:</Label>
            <Textarea value={problemBehavior} onChange={(e) => setProblemBehavior(e.target.value)} placeholder="Describe the specific behavior..." rows={2} readOnly={readOnly} />
          </div>
        </CardContent>
      </Card>

      {/* PART 3 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Part 3: The Boundary Statement</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Complete this formula: <strong>"If _________ happens, I will _________."</strong></p>
            <p>Not: "You need to…" / "You better…" / "If you don't…"</p>
            <p>But: "If drugs are brought into the house, I will require you to leave."</p>
          </div>
          <div>
            <Label className="font-medium">Write your boundary:</Label>
            <Textarea value={boundaryStatement} onChange={(e) => setBoundaryStatement(e.target.value)} placeholder="If _________ happens, I will _________." rows={2} readOnly={readOnly} />
          </div>
          <div>
            <Label className="font-medium mb-2 block">Is it:</Label>
            <div className="grid grid-cols-2 gap-2">
              {boundaryChecks.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`bc-${item}`}
                    checked={boundaryChecklist.includes(item)}
                    onCheckedChange={() => toggleItem(boundaryChecklist, item, setBoundaryChecklist)}
                    disabled={readOnly}
                  />
                  <Label htmlFor={`bc-${item}`} className="cursor-pointer text-sm">{item}</Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">If not all checked, revise your boundary above.</p>
          </div>
        </CardContent>
      </Card>

      {/* PART 4 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Part 4: Consequence Clarity</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground italic">A boundary without consequence is a suggestion.</p>
          <div>
            <Label className="font-medium">1st violation response:</Label>
            <Textarea value={violation1} onChange={(e) => setViolation1(e.target.value)} rows={2} readOnly={readOnly} />
          </div>
          <div>
            <Label className="font-medium">2nd violation response:</Label>
            <Textarea value={violation2} onChange={(e) => setViolation2(e.target.value)} rows={2} readOnly={readOnly} />
          </div>
          <div>
            <Label className="font-medium">Final consequence:</Label>
            <Textarea value={finalConsequence} onChange={(e) => setFinalConsequence(e.target.value)} rows={2} readOnly={readOnly} />
          </div>
          <div>
            <Label className="font-medium mb-2 block">Am I actually willing to follow through?</Label>
            <RadioGroup value={willingFollowThrough} onValueChange={readOnly ? undefined : setWillingFollowThrough} className="space-y-2" disabled={readOnly}>
              {["Yes", "No", "Unsure"].map((opt) => (
                <div key={opt} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`willing-${opt}`} disabled={readOnly} />
                  <Label htmlFor={`willing-${opt}`} className="cursor-pointer">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
            {willingFollowThrough === "Unsure" && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 italic">If unsure — the boundary needs adjustment.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PART 5 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Part 5: Guilt & Fear Check</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-medium mb-2 block">What fear arises when you imagine enforcing this?</Label>
            <div className="space-y-2">
              {fearOptions.map((fear) => (
                <div key={fear} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fear-${fear}`}
                    checked={selectedFears.includes(fear)}
                    onCheckedChange={() => toggleItem(selectedFears, fear, setSelectedFears)}
                    disabled={readOnly}
                  />
                  <Label htmlFor={`fear-${fear}`} className="cursor-pointer text-sm">{fear}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fear-other"
                  checked={selectedFears.includes("Other")}
                  onCheckedChange={() => toggleItem(selectedFears, "Other", setSelectedFears)}
                  disabled={readOnly}
                />
                <Label htmlFor="fear-other" className="cursor-pointer text-sm">Other:</Label>
                <input
                  type="text"
                  value={fearOther}
                  onChange={(e) => setFearOther(e.target.value)}
                  className="flex-1 border-b border-border bg-transparent text-sm py-1 focus:outline-none focus:border-primary"
                  placeholder="Describe..."
                  readOnly={readOnly}
                />
              </div>
            </div>
          </div>
          <div>
            <Label className="font-medium">Write the fear in a sentence:</Label>
            <Textarea value={fearSentence} onChange={(e) => setFearSentence(e.target.value)} rows={2} readOnly={readOnly} />
          </div>
          <div>
            <Label className="font-medium">Is this fear emotional… or factual?</Label>
            <Textarea value={fearOrFactual} onChange={(e) => setFearOrFactual(e.target.value)} placeholder="Reflect on whether this fear is based on emotion or evidence..." rows={2} readOnly={readOnly} />
          </div>
        </CardContent>
      </Card>

      {/* PART 6 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Part 6: Financial Boundary Decision Matrix</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">For any financial request, ask:</p>
          <ul className="space-y-2 text-sm list-disc list-inside text-muted-foreground">
            <li>Does this align with our values?</li>
            <li>Does this remove a natural consequence?</li>
            <li>Would I give this money if addiction were not involved?</li>
            <li>Am I acting from fear or clarity?</li>
          </ul>
          <p className="text-sm font-medium mt-4 text-amber-700 dark:text-amber-400">
            If 2+ answers indicate fear or consequence removal → Pause 24 hours.
          </p>
        </CardContent>
      </Card>

      {/* PART 7 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Part 7: Unity Check (For Couples / Families)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-medium mb-2 block">Are all decision-makers aligned?</Label>
            <RadioGroup value={unityCheck} onValueChange={readOnly ? undefined : setUnityCheck} className="space-y-2" disabled={readOnly}>
              {["Fully aligned", "Some disagreement", "Deep division"].map((opt) => (
                <div key={opt} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`unity-${opt}`} disabled={readOnly} />
                  <Label htmlFor={`unity-${opt}`} className="cursor-pointer">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          {(unityCheck === "Some disagreement" || unityCheck === "Deep division") && (
            <div>
              <Label className="font-medium">What needs to be resolved privately before speaking to your loved one?</Label>
              <Textarea value={unityResolve} onChange={(e) => setUnityResolve(e.target.value)} rows={2} readOnly={readOnly} />
              <p className="text-xs text-muted-foreground mt-1 italic">Never set a boundary you are not united on.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PART 8 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Part 8: Communication Script</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-medium">Write how you will calmly communicate this boundary:</Label>
            <Textarea value={communicationScript} onChange={(e) => setCommunicationScript(e.target.value)} placeholder="Write your script..." rows={4} readOnly={readOnly} />
          </div>
          <div className="text-sm text-muted-foreground italic space-y-1">
            <p>Remember: No lectures. No justifications. No emotional escalation.</p>
            <p className="font-medium">Simple. Calm. Clear.</p>
          </div>
        </CardContent>
      </Card>

      {/* PART 9 */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Part 9: Enforcement Plan</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Label className="font-medium mb-2 block">When the moment comes, I will:</Label>
          <div className="space-y-2">
            {enforcementChecks.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={`enforce-${item}`}
                  checked={enforcementPlan.includes(item)}
                  onCheckedChange={() => toggleItem(enforcementPlan, item, setEnforcementPlan)}
                  disabled={readOnly}
                />
                <Label htmlFor={`enforce-${item}`} className="cursor-pointer text-sm">{item}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Final Reflection */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader><CardTitle className="text-lg">Final Self-Reflection</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium italic">Am I setting this boundary to control them… or to protect the health of the household?</p>
          <Textarea value={selfReflection} onChange={(e) => setSelfReflection(e.target.value)} placeholder="Reflect honestly..." rows={3} readOnly={readOnly} />
        </CardContent>
      </Card>

      {/* Coaching Phase Guide */}
      <Card className="bg-muted/30">
        <CardHeader><CardTitle className="text-lg">Coaching Phase Guide</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">If you struggled to:</p>
          <ul className="space-y-2 text-sm">
            <li><strong>Define a consequence</strong> → You are likely in <span className="text-orange-600 dark:text-orange-400">Stabilization</span>.</li>
            <li><strong>Follow through emotionally</strong> → You are in <span className="text-amber-600 dark:text-amber-400">Transition</span>.</li>
            <li><strong>Align as a couple</strong> → You need structured <span className="text-primary">Parallel Coaching</span>.</li>
            <li><strong>Maintain calm enforcement</strong> → <span className="text-emerald-600 dark:text-emerald-400">Maintenance training</span> recommended.</li>
          </ul>
          {!readOnly && (
            <Link to="/book-consultation">
              <Button className="gap-2 mt-4">
                <Calendar className="h-4 w-4" />
                Book a Coaching Session
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {!readOnly && (
        <div className="flex gap-3 print:hidden">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {existingId ? "Update Worksheet" : "Save Worksheet"}
          </Button>
          <Button variant="outline" onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" />
            Print Worksheet
          </Button>
          <Button variant="outline" onClick={handleReset}>Start New</Button>
        </div>
      )}
    </div>
  );
}
