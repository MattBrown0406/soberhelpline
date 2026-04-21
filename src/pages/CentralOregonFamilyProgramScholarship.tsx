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

export default function CentralOregonFamilyProgramScholarship() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    hardshipReason: "",
    supportRequested: "partial",
    referredBy: "",
  });

  const canSubmit = useMemo(() => form.name.trim() && form.email.trim() && form.hardshipReason.trim(), [form]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await submitCentralOregonLead({
        kind: "scholarship",
        name: form.name,
        email: form.email,
        phone: form.phone,
        summary: {
          supportRequested: form.supportRequested,
          hardshipReason: form.hardshipReason,
          referredBy: form.referredBy,
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast({ title: "Scholarship form failed", description: "Please try again or call Matt directly.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SEOHead title="Scholarship Form | Central Oregon Family Program" description="Apply for scholarship or hardship support for the Central Oregon Family Program pilot." />
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Link to="/central-oregon-family-program" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to program page
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-logo-green">Scholarship / hardship form</CardTitle>
            <CardDescription>Use this if your family needs financial support to participate in the pilot.</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center space-y-4 py-6">
                <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
                <p className="text-muted-foreground">Scholarship request received. Matt can now review hardship need and follow up.</p>
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
                  <Label htmlFor="supportRequested">Support requested</Label>
                  <select id="supportRequested" value={form.supportRequested} onChange={(e) => setForm({ ...form, supportRequested: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="partial">Partial scholarship</option>
                    <option value="full">Full scholarship</option>
                    <option value="unsure">Not sure</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="referredBy">Referral source</Label>
                  <Input id="referredBy" value={form.referredBy} onChange={(e) => setForm({ ...form, referredBy: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="hardshipReason">Tell us briefly why your family needs scholarship support</Label>
                  <Textarea id="hardshipReason" rows={5} value={form.hardshipReason} onChange={(e) => setForm({ ...form, hardshipReason: e.target.value })} />
                </div>
                <Button disabled={!canSubmit || submitting} className="w-full">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit scholarship form"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
