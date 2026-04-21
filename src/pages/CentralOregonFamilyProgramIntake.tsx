import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { submitCentralOregonLead } from "@/lib/centralOregonFamilyProgramLead";

type PaymentPath = "partner-covered" | "self-pay" | "scholarship";

export default function CentralOregonFamilyProgramIntake() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    familySystem: "",
    whyComing: "",
    referredByType: "",
    referredByName: "",
    attachedToPartner: "yes",
    partnerName: "",
    attendanceMode: "hybrid",
    attendingFamilyMembers: "",
    paymentPath: "partner-covered" as PaymentPath,
  });

  const isUnattached = form.attachedToPartner === "no";

  const canSubmit = useMemo(() => {
    return form.name.trim() && form.email.trim() && form.whyComing.trim() && form.referredByType.trim();
  }, [form]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await submitCentralOregonLead({
        kind: "intake",
        name: form.name,
        email: form.email,
        phone: form.phone,
        summary: {
          familySystem: form.familySystem,
          whyComing: form.whyComing,
          referredByType: form.referredByType,
          referredByName: form.referredByName,
          attachedToPartner: form.attachedToPartner,
          partnerName: form.partnerName,
          attendanceMode: form.attendanceMode,
          attendingFamilyMembers: form.attendingFamilyMembers,
          paymentPath: form.paymentPath,
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast({ title: "Submission failed", description: "Please try again or call Matt directly.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <Card>
          <CardContent className="p-8 text-center space-y-5">
            <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
            <div>
              <h1 className="text-3xl font-bold text-logo-green mb-2">Intake received</h1>
              <p className="text-muted-foreground">Matt now has the family intake and referral context.</p>
            </div>
            {isUnattached ? (
              <div className="grid sm:grid-cols-2 gap-3 text-left">
                <Link to="/central-oregon-family-program/seat-request"><Button className="w-full">Continue to seat request</Button></Link>
                <Link to="/central-oregon-family-program/scholarship"><Button variant="outline" className="w-full">Continue to scholarship form</Button></Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Because this family is attached to a referring partner, the next step is manual review and follow-up.</p>
            )}
            <Link to="/central-oregon-family-program"><Button variant="ghost">Back to program page</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Central Oregon Family Program Intake | Sober Helpline" description="Complete the intake form for the Central Oregon Family Program pilot." />
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Link to="/central-oregon-family-program" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to program page
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-logo-green">Central Oregon Family Program Intake</CardTitle>
            <CardDescription>Brief assessment, referral source, and next-step routing for the Bend pilot.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="familySystem">Family system</Label>
                  <Input id="familySystem" placeholder="Parents, spouse, siblings, mixed family system" value={form.familySystem} onChange={(e) => setForm({ ...form, familySystem: e.target.value })} />
                </div>
              </div>

              <div>
                <Label htmlFor="whyComing">Why are you coming right now?</Label>
                <Textarea id="whyComing" rows={5} placeholder="Give Matt a brief picture of what is happening, what you want help with, and what feels most urgent." value={form.whyComing} onChange={(e) => setForm({ ...form, whyComing: e.target.value })} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="referredByType">Who referred you?</Label>
                  <select id="referredByType" value={form.referredByType} onChange={(e) => setForm({ ...form, referredByType: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select one</option>
                    <option value="treatment-center">Treatment center</option>
                    <option value="therapist">Therapist or counselor</option>
                    <option value="interventionist">Interventionist</option>
                    <option value="church">Church or community partner</option>
                    <option value="friend-family">Friend or family</option>
                    <option value="website">Website / social media</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="referredByName">Referral name or organization</Label>
                  <Input id="referredByName" value={form.referredByName} onChange={(e) => setForm({ ...form, referredByName: e.target.value })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="attachedToPartner">Are you attached to a treatment program or referring partner?</Label>
                  <select id="attachedToPartner" value={form.attachedToPartner} onChange={(e) => setForm({ ...form, attachedToPartner: e.target.value, paymentPath: e.target.value === "no" ? "self-pay" : "partner-covered" })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="partnerName">Treatment center / partner name</Label>
                  <Input id="partnerName" value={form.partnerName} onChange={(e) => setForm({ ...form, partnerName: e.target.value })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="attendanceMode">Preferred attendance mode</Label>
                  <select id="attendanceMode" value={form.attendanceMode} onChange={(e) => setForm({ ...form, attendanceMode: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="hybrid">Hybrid / either is fine</option>
                    <option value="in-person">In person in Bend</option>
                    <option value="zoom">Zoom only</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="attendingFamilyMembers">Who would attend?</Label>
                  <Input id="attendingFamilyMembers" placeholder="Names or roles, age 16+ only" value={form.attendingFamilyMembers} onChange={(e) => setForm({ ...form, attendingFamilyMembers: e.target.value })} />
                </div>
              </div>

              {isUnattached && (
                <div>
                  <Label htmlFor="paymentPath">If you are not attached to a partner, what is your likely next path?</Label>
                  <select id="paymentPath" value={form.paymentPath} onChange={(e) => setForm({ ...form, paymentPath: e.target.value as PaymentPath })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="self-pay">I want to request a paid seat</option>
                    <option value="scholarship">I need scholarship / financial hardship review</option>
                  </select>
                </div>
              )}

              <Button disabled={!canSubmit || submitting} className="w-full gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Submit intake
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
