import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import App from "./App.tsx";
import "./index.css";
import AnalyticsScripts from "@/components/AnalyticsScripts";

const reloadAfterStaleAsset = () => {
  if (sessionStorage.getItem("stale-asset-reload-attempted") === "true") return;

  sessionStorage.setItem("stale-asset-reload-attempted", "true");
  window.location.reload();
};

const isStaleAssetError = (message: string) =>
  message.includes("Failed to fetch dynamically imported module") ||
  message.includes("Importing a module script failed") ||
  message.includes("Loading chunk") ||
  message.includes("ChunkLoadError");

window.addEventListener("error", (event) => {
  if (isStaleAssetError(event.message || "")) {
    reloadAfterStaleAsset();
  }
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  const message = reason instanceof Error ? reason.message : String(reason || "");

  if (isStaleAssetError(message)) {
    reloadAfterStaleAsset();
  }
});

// Initialize Capacitor plugins when running as native app
const initializeApp = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Configure status bar for iOS
      await StatusBar.setStyle({ style: Style.Dark });
      
      // Hide splash screen after app is ready
      await SplashScreen.hide();
    } catch (error) {
      console.log('Capacitor plugin initialization:', error);
    }
  }
};

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <AnalyticsScripts />
    <App />
  </HelmetProvider>
);

// Initialize after render
initializeApp();
