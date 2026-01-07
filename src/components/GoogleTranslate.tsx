import { useEffect } from "react";
import { Globe } from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: number;
            autoDisplay?: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // Only initialize once
    if (document.getElementById("google-translate-script")) {
      return;
    }

    // Define the callback function
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            // Most common languages for family support resources
            includedLanguages: "es,zh-CN,zh-TW,vi,ko,tl,ru,ar,pt,fr,de,ja,hi,ur,fa,pl,it",
            layout: 0, // SIMPLE layout
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Load the Google Translate script
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup is tricky with Google Translate - it modifies the DOM significantly
      // We leave the script in place to avoid issues with re-initialization
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div id="google_translate_element" className="google-translate-container" />
      <style>{`
        .google-translate-container .goog-te-gadget {
          font-family: inherit !important;
          font-size: 0 !important;
        }
        .google-translate-container .goog-te-gadget-simple {
          background-color: transparent !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.375rem !important;
          padding: 0.25rem 0.5rem !important;
          font-size: 0.875rem !important;
          cursor: pointer !important;
        }
        .google-translate-container .goog-te-gadget-simple:hover {
          background-color: hsl(var(--accent)) !important;
        }
        .google-translate-container .goog-te-gadget-simple .goog-te-menu-value {
          color: hsl(var(--foreground)) !important;
        }
        .google-translate-container .goog-te-gadget-simple .goog-te-menu-value span {
          color: hsl(var(--foreground)) !important;
          font-size: 0.875rem !important;
        }
        .google-translate-container .goog-te-gadget-icon {
          display: none !important;
        }
        .google-translate-container .goog-te-gadget-simple img {
          display: none !important;
        }
        /* Hide the "Powered by Google" text */
        .google-translate-container .goog-te-gadget span {
          display: none !important;
        }
        .google-translate-container .goog-te-gadget-simple .goog-te-menu-value span:first-child {
          display: inline !important;
        }
        /* Hide the Google Translate top bar that appears after translation */
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate {
          display: none !important;
        }
        .skiptranslate iframe {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
