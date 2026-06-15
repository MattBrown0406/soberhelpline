import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { writeWebSession, WEB_SESSION_DURATION_MS } from "@/lib/webSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const FN_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/validate-sso-token`;

export default function SSO() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const t = params.get("t") ?? "";
  const next = params.get("next") || "/family-education";
  const safeNext = next.startsWith("/") ? next : "/family-education";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!t) {
        setError("invalid");
        return;
      }
      try {
        const res = await fetch(FN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ token_id: t, next: safeNext }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data?.ok) {
          setError(data?.error ?? "invalid");
          return;
        }
        writeWebSession({
          accountId: data.account_id,
          tier: data.tier ?? null,
          firstName: data.first_name ?? null,
          expiresAt: Date.now() + WEB_SESSION_DURATION_MS,
        });
        navigate(safeNext, { replace: true });
      } catch (e) {
        if (!cancelled) setError("network");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t, safeNext, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Link expired or invalid</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            This link has expired or is invalid. Please return to the app and try again.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-logo-blue" />
      <p className="text-muted-foreground">Signing you in…</p>
    </div>
  );
}
