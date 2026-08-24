import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePayPalSubscription } from "@/hooks/usePayPalSubscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, ArrowLeft, ShieldCheck, AlertCircle, Mail } from "lucide-react";
import SEOHead from "@/components/SEOHead";

interface MembershipRow {
  id: string;
  user_id: string;
  provider_submission_id: string | null;
  paypal_subscription_id: string | null;
  plan_type: string | null;
  status: string;
  amount: number | null;
  start_date: string | null;
  next_billing_date: string | null;
  cancelled_at: string | null;
  access_ends_at: string | null;
}

const FREE_PREFIXES = ["FREE-", "FAMILY6-", "FREELIST-", "FREE6-", "FREEMONTH-", "HELPLINE-"];

function isFreeBypassId(id: string | null | undefined): boolean {
  if (!id) return false;
  const upper = id.toUpperCase();
  return FREE_PREFIXES.some((p) => upper.startsWith(p));
}

function maskSubscriptionId(id: string | null | undefined): string {
  if (!id) return "—";
  if (id.length <= 6) return id;
  return `••••${id.slice(-6)}`;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch {
    return iso;
  }
}

function fmtAmount(amount: number | null): string {
  if (amount == null) return "—";
  if (amount === 0) return "Free";
  return `$${amount.toFixed(2)}`;
}

export default function MemberBilling() {
  const navigate = useNavigate();
  const { cancelSubscription, activateSubscription, isLoading: cancelling } = usePayPalSubscription();
  const [membership, setMembership] = useState<MembershipRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cancelErr, setCancelErr] = useState<string | null>(null);
  const [healing, setHealing] = useState(false);
  const [healAttempted, setHealAttempted] = useState(false);

  const loadMembership = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth?redirect=/member-billing", { replace: true });
      return;
    }

    const { data, error: qErr } = await supabase
      .from("provider_subscriptions")
      .select(
        "id,user_id,provider_submission_id,paypal_subscription_id,plan_type,status,amount,start_date,next_billing_date,cancelled_at,access_ends_at",
      )
      .eq("user_id", user.id)
      .is("provider_submission_id", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (qErr) {
      setError("We couldn't load your membership. Please try again.");
      setLoading(false);
      return;
    }

    setMembership((data?.[0] as MembershipRow) ?? null);
    setLoading(false);
  }, [navigate]);

  useEffect(() => { loadMembership(); }, [loadMembership]);

  // Self-heal: if PayPal already collected payment but the return-to-site step
  // never completed, the row can be stuck on "pending". Re-check with PayPal.
  const refreshFromPayPal = useCallback(async () => {
    if (!membership?.paypal_subscription_id || isFreeBypassId(membership.paypal_subscription_id)) return;
    setHealing(true);
    try {
      await activateSubscription(membership.paypal_subscription_id);
      await loadMembership();
    } catch {
      /* toast handled in hook */
    } finally {
      setHealing(false);
    }
  }, [membership?.paypal_subscription_id, activateSubscription, loadMembership]);

  useEffect(() => {
    if (membership?.status === "pending" && !healAttempted && !healing) {
      setHealAttempted(true);
      refreshFromPayPal();
    }
  }, [membership?.status, healAttempted, healing, refreshFromPayPal]);


  const handleCancel = async () => {
    if (!membership?.paypal_subscription_id) return;
    setCancelErr(null);
    setSuccessMsg(null);
    try {
      await cancelSubscription(
        membership.paypal_subscription_id,
        "Family member requested cancellation from billing page",
      );
      await loadMembership();
      setConfirmOpen(false);
      setSuccessMsg(
        "Your membership has been cancelled. PayPal recurring billing has been cancelled and you will not be charged again.",
      );
    } catch {
      setCancelErr(
        "We could not confirm cancellation with PayPal. Please try again or contact matt@soberhelpline.com.",
      );
    }
  };

  const isFree = isFreeBypassId(membership?.paypal_subscription_id);
  const canCancel =
    !!membership &&
    membership.status === "active" &&
    !!membership.paypal_subscription_id &&
    !isFree;

  const statusVariant =
    membership?.status === "active" ? "default"
    : membership?.status === "cancelled" ? "secondary"
    : "outline";

  return (
    <>
      <SEOHead
        title="Membership & Billing | Sober Helpline"
        description="Manage or cancel your Sober Helpline family membership."
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-3xl px-4 py-8">
          <Link
            to="/member-home"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Member Home
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Membership & Billing</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Review your family membership and manage recurring billing.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
                <p className="text-foreground">{error}</p>
                <Button onClick={loadMembership} variant="outline">Try again</Button>
              </CardContent>
            </Card>
          ) : !membership ? (
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <p className="text-foreground">No family membership found.</p>
                <Link to="/family-membership">
                  <Button>View membership options</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {successMsg && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{successMsg}</p>
                </div>
              )}
              {cancelErr && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{cancelErr}</p>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>Your Family Membership</span>
                    <Badge variant={statusVariant as "default" | "secondary" | "outline"}>
                      {membership.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Plan</dt>
                      <dd className="font-medium text-foreground capitalize">{membership.plan_type ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Amount</dt>
                      <dd className="font-medium text-foreground">
                        {fmtAmount(membership.amount)}
                        {membership.amount && membership.amount > 0 && membership.plan_type ? (
                          <span className="text-muted-foreground"> / {membership.plan_type === "annual" ? "year" : "month"}</span>
                        ) : null}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Start date</dt>
                      <dd className="font-medium text-foreground">{fmtDate(membership.start_date)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Next billing date</dt>
                      <dd className="font-medium text-foreground">{fmtDate(membership.next_billing_date)}</dd>
                    </div>
                    {membership.access_ends_at && membership.status === "cancelled" && (
                      <div className="sm:col-span-2">
                        <dt className="text-muted-foreground">Access continues until</dt>
                        <dd className="font-medium text-foreground">{fmtDate(membership.access_ends_at)}</dd>
                      </div>
                    )}
                    <div className="sm:col-span-2">
                      <dt className="text-muted-foreground">PayPal subscription ID</dt>
                      <dd className="font-mono text-foreground">{maskSubscriptionId(membership.paypal_subscription_id)}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {canCancel ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Cancel your membership</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Cancelling stops your recurring PayPal charge. If a next billing date is set above,
                      you'll keep access through that date.
                    </p>
                    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={cancelling}>
                          {cancelling ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cancelling…</>
                          ) : (
                            "Cancel membership"
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel your family membership?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will cancel your recurring PayPal charge. You will not be billed again.
                            If you need help first, contact support@soberhelpline.com.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={cancelling}>Keep membership</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => { e.preventDefault(); handleCancel(); }}
                            disabled={cancelling}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {cancelling ? "Cancelling…" : "Yes, cancel my membership"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              ) : membership.status === "active" && isFree ? (
                <Card>
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    Your membership was activated with a complimentary or promotional code and has no
                    recurring PayPal charge. If you'd like it removed from your account, email{" "}
                    <a href="mailto:matt@soberhelpline.com" className="text-primary hover:underline">
                      matt@soberhelpline.com
                    </a>.
                  </CardContent>
                </Card>
              ) : null}

              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                Questions? Email{" "}
                <a href="mailto:support@soberhelpline.com" className="text-primary hover:underline">
                  support@soberhelpline.com
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
