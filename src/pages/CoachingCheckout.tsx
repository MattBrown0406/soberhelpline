import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ResolvedSession {
  session_id: string;
  service_label: string;
  amount_label: string;
  amount_cents: number;
  currency: string;
  status: string;
  expires_at: string;
  paypal_client_id: string | null;
  paypal_env: "live" | "sandbox";
}

declare global {
  interface Window {
    paypal?: any;
  }
}

const PAYPAL_SDK_SRC = (clientId: string) =>
  `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture&disable-funding=credit`;

function loadPayPalSdk(clientId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.paypal) return resolve();
    const existing = document.querySelector<HTMLScriptElement>("script[data-paypal-sdk]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("paypal_sdk_load_failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = PAYPAL_SDK_SRC(clientId);
    s.async = true;
    s.dataset.paypalSdk = "1";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("paypal_sdk_load_failed"));
    document.head.appendChild(s);
  });
}

export default function CoachingCheckout() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  const [state, setState] = useState<"loading" | "ready" | "processing" | "captured" | "error">("loading");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [session, setSession] = useState<ResolvedSession | null>(null);
  const buttonsHost = useRef<HTMLDivElement | null>(null);
  const buttonsMounted = useRef(false);
  const paypalClientId = session?.paypal_client_id ?? "";

  useEffect(() => {
    let cancelled = false;
    async function resolve() {
      if (!token) {
        setErrorCode("missing_token");
        setState("error");
        return;
      }
      try {
        const { data, error } = await supabase.functions.invoke("coaching-checkout-resolve", {
          body: { token },
        });
        if (cancelled) return;
        if (error || !data?.ok) {
          setErrorCode(data?.code ?? "resolve_failed");
          setState("error");
          return;
        }
        setSession(data as ResolvedSession);
        setState((data.status === "captured" ? "captured" : "ready"));
      } catch {
        if (cancelled) return;
        setErrorCode("network_error");
        setState("error");
      }
    }
    resolve();
    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    if (state !== "ready" || !session || !paypalClientId || buttonsMounted.current) return;
    let cancelled = false;
    (async () => {
      try {
        await loadPayPalSdk(paypalClientId);
        if (cancelled || !window.paypal || !buttonsHost.current) return;
        buttonsMounted.current = true;
        window.paypal.Buttons({
          style: { layout: "vertical", color: "gold", shape: "rect", label: "pay" },
          createOrder: async () => {
            const { data, error } = await supabase.functions.invoke("coaching-order-create", {
              body: { session_id: session.session_id },
            });
            if (error || !data?.ok) throw new Error(data?.code ?? "create_failed");
            return data.order_id as string;
          },
          onApprove: async (approve: any) => {
            setState("processing");
            const { data, error } = await supabase.functions.invoke("coaching-order-capture", {
              body: { session_id: session.session_id, order_id: approve.orderID },
            });
            if (error || !data?.ok) {
              setErrorCode(data?.code ?? "capture_failed");
              setState("error");
              return;
            }
            setState("captured");
          },
          onError: () => {
            setErrorCode("paypal_button_error");
            setState("error");
          },
        }).render(buttonsHost.current);
      } catch {
        setErrorCode("paypal_sdk_load_failed");
        setState("error");
      }
    })();
    return () => { cancelled = true; };
  }, [state, session, paypalClientId]);

  const errorMessage = useMemo(() => {
    switch (errorCode) {
      case "missing_token": return "This checkout link is missing its secure token. Please return to the app and try again.";
      case "token_expired": return "This checkout link has expired. Please return to the app to start a new one.";
      case "invalid_signature": return "This checkout link is not valid. Please return to the app and try again.";
      case "already_finalized": return "This coaching session has already been paid for.";
      case "bridge_secret_not_configured": return "Checkout is temporarily unavailable. Please try again shortly.";
      default: return "Something went wrong. Please return to the app and try again.";
    }
  }, [errorCode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> Secure checkout
          </div>
          <CardTitle className="text-xl">Coaching Session</CardTitle>
          <CardDescription>
            {session?.service_label ?? "Sober Helpline — 60-Minute Private Coaching and Plan Review"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total due</span>
            <span className="text-lg font-semibold">{session?.amount_label ?? "$150.00 USD"}</span>
          </div>

          {state === "loading" && (
            <div className="text-center py-6 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Preparing your secure checkout…
            </div>
          )}

          {state === "ready" && !paypalClientId && (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              PayPal checkout is not configured on this deployment. Please contact support.
            </div>
          )}

          {state === "ready" && paypalClientId && (
            <div ref={buttonsHost} />
          )}

          {state === "processing" && (
            <div className="text-center py-6 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Confirming your payment…
            </div>
          )}

          {state === "captured" && (
            <div className="text-center py-4">
              <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-2" />
              <p className="font-medium">Payment received</p>
              <p className="text-sm text-muted-foreground">
                Your coaching session is confirmed. You can now close this window and return to the app.
              </p>
            </div>
          )}

          {state === "error" && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900 flex gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>{errorMessage}</div>
            </div>
          )}

          <p className="text-[11px] text-muted-foreground text-center">
            This payment is for a live, one-to-one 60-minute coaching session with Matt Brown — a person-to-person service (App Store Guideline 3.1.3(d)). It does not unlock in-app digital content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
