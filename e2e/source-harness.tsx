// Dev-only fixture: not imported by the production application/router.
import React from "react";
import { createRoot } from "react-dom/client";
import { ZoomLinkSettings } from "../src/components/admin/ZoomLinkSettings";
import "../src/index.css";
import FamilySquaresKiosk from "../src/pages/FamilySquaresKiosk";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
createRoot(document.getElementById("root")!).render(
  new URLSearchParams(location.search).has("kiosk")
    ? <HelmetProvider><BrowserRouter><FamilySquaresKiosk /></BrowserRouter></HelmetProvider>
    : <ZoomLinkSettings />
);
