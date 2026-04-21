import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { submitCentralOregonLead } from "@/lib/centralOregonFamilyProgramLead";

export default function CentralOregonFamilyProgramSeatRequest() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pricingModel: "monthly",
    householdCount: "",
    note: "",
  });

  const canSubmit = useMemo(() => form.name.trim() && form.email.trim(), [form]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await submitCentralOregonLead({
        kind: "seat-request",
        name: form.name,
        email: form.email,
        phone: form.phone,
        summary: {
          pricingModel: form.pricingModel,
          householdCount: form.householdCount,
          note: form.note,
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast({ title: "Seat request failed", description: "Please try again or call Matt directly.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SEOHead title="Request a Seat | Central Oregon Family Program" description="Request a seat in the Central Oregon Family Program pilot." />
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Link to="/central-oregon-family-program" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to program page
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-logo-green">Request a seat</CardTitle>
            <CardDescription>For families not attached to a referring treatment partner.</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center space-y-4 py-6">
                <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
                <p className="text-muted-foreground">Seat request received. Matt can now follow up on fit, pricing, and next steps.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="pricingModel">Requested pricing path</Label>
                  <select id="pricingModel" value={form.pricingModel} onChange={(e) => setForm({ ...form, pricingModel: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="monthly">Monthly membership</option>
                    <option value="drop-in">Single drop-in rate</option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="householdCount">How many family members may attend?</Label>
                  <Input id="householdCount" value={form.householdCount} onChange={(e) => setForm({ ...form, householdCount: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="note">Anything else Matt should know?</Label>
                  <Textarea id="note" rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                </div>
                <Button disabled={!canSubmit || submitting} className="w-full">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit seat request"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
