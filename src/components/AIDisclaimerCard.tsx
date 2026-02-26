import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const STORAGE_KEY = "ai-disclaimer-collapsed";

export default function AIDisclaimerCard() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed]);

  return (
    <Card className="mb-8 border-amber-500/40 bg-amber-500/5">
      <CardContent className="py-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full text-left"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <span className="font-semibold text-amber-800 dark:text-amber-400 text-sm flex-1">
            ⚠️ Important Safety Disclaimer
          </span>
          {collapsed ? (
            <ChevronDown className="h-4 w-4 text-amber-600 flex-shrink-0" />
          ) : (
            <ChevronUp className="h-4 w-4 text-amber-600 flex-shrink-0" />
          )}
        </button>
        {!collapsed && (
          <div className="mt-3 ml-8 space-y-2 text-sm text-amber-900/80 dark:text-amber-100/80 leading-relaxed">
            <p>
              This AI tool provides <strong>educational guidance — not clinical advice</strong>. It cannot replace professional help.
            </p>
            <p>
              If you or someone you know is in immediate danger, call <strong>911</strong> or the{" "}
              <strong>988 Suicide &amp; Crisis Lifeline</strong>.
            </p>
            <p>
              For personalized support, explore our{" "}
              <Link to="/family-coaching" className="underline text-amber-700 dark:text-amber-300 hover:text-amber-600">
                coaching services
              </Link>{" "}
              or{" "}
              <Link to="/family-consultation" className="underline text-amber-700 dark:text-amber-300 hover:text-amber-600">
                book a consultation
              </Link>.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
