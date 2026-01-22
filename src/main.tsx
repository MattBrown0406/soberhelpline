import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import App from "./App.tsx";
import "./index.css";

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
    <App />
  </HelmetProvider>
);

// Initialize after render
initializeApp();
