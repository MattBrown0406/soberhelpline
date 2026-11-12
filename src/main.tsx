import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { clearBootstrapRetry, retryBootstrap } from "@/lib/bootstrapRecovery";
import "./index.css";

function handleBootstrapFailure(error: unknown) {
  console.error("Page startup failed:", error);
  try {
    if (retryBootstrap(error, window.sessionStorage, window.location.pathname, () => window.location.reload())) return;
  } catch {
    // Accessing sessionStorage itself can fail in restricted browsers.
  }
  const root = document.getElementById("root");
  if (!root) return;
  createRoot(root).render(
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md space-y-4" role="alert">
        <h1 className="text-2xl font-semibold">The page couldn’t load</h1>
        <p className="text-muted-foreground">Please check your connection and try again.</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    </main>,
  );
}

function completeBootstrap() {
  try {
    clearBootstrapRetry(window.sessionStorage);
  } catch {
    // Startup still succeeds when storage is unavailable.
  }
}

// A fresh document boundary is essential: removing an analytics script tag
// cannot undo a replay SDK's already-installed listeners on the normal site.
const isPrivateGuide = /^\/next-step\/*$/i.test(window.location.pathname);
if (isPrivateGuide) {
  void import("./pages/NextStep").then(({ default: NextStep }) => {
    const root = document.getElementById("root");
    if (!root) throw new Error("Page root is missing");
    createRoot(root).render(<HelmetProvider><NextStep /></HelmetProvider>);
    completeBootstrap();
  }).catch(handleBootstrapFailure);
} else {
  void import("./siteBootstrap").then(completeBootstrap).catch(handleBootstrapFailure);
}
