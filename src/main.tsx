import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

// A fresh document boundary is essential: removing an analytics script tag
// cannot undo a replay SDK's already-installed listeners on the normal site.
const isPrivateGuide = /^\/next-step\/*$/i.test(window.location.pathname);
if (isPrivateGuide) {
  void import("./pages/NextStep").then(({ default: NextStep }) => {
    createRoot(document.getElementById("root")!).render(<HelmetProvider><NextStep /></HelmetProvider>);
  });
} else {
  void import("./siteBootstrap");
}
