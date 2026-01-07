import { useEffect, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "zh-CN", name: "中文 (简体)" },
  { code: "zh-TW", name: "中文 (繁體)" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "ko", name: "한국어" },
  { code: "tl", name: "Tagalog" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
  { code: "pt", name: "Português" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
  { code: "hi", name: "हिन्दी" },
];

export default function GoogleTranslate() {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Check if already loaded
    if (document.getElementById("google-translate-script")) {
      // Check if Google Translate initialized
      const checkLoaded = setInterval(() => {
        const element = document.querySelector("#google_translate_element .goog-te-gadget");
        if (element) {
          setGoogleLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 500);

      // Fallback after 3 seconds
      setTimeout(() => {
        clearInterval(checkLoaded);
        if (!googleLoaded) {
          setShowFallback(true);
        }
      }, 3000);

      return () => clearInterval(checkLoaded);
    }

    // Define the callback function
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "es,zh-CN,zh-TW,vi,ko,tl,ru,ar,pt,fr,de,ja,hi",
            layout: 0,
            autoDisplay: false,
          },
          "google_translate_element"
        );
        setGoogleLoaded(true);
      }
    };

    // Load the Google Translate script
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => setShowFallback(true);
    document.body.appendChild(script);

    // Fallback timeout
    const timeout = setTimeout(() => {
      if (!googleLoaded) {
        setShowFallback(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [googleLoaded]);

  const handleLanguageChange = (langCode: string) => {
    if (langCode === "en") {
      // Reset to English - remove translation
      const frame = document.querySelector(".goog-te-banner-frame") as HTMLIFrameElement;
      if (frame) {
        const button = frame.contentDocument?.querySelector(".goog-te-button button") as HTMLButtonElement;
        button?.click();
      }
      // Fallback: reload page without translation
      window.location.href = window.location.pathname;
    } else {
      // Open Google Translate in new tab for the current page
      const url = `https://translate.google.com/translate?sl=en&tl=${langCode}&u=${encodeURIComponent(window.location.href)}`;
      window.open(url, "_blank");
    }
  };

  // Show fallback selector if Google Translate didn't load
  if (showFallback && !googleLoaded) {
    return (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <Select onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[140px] h-8 text-sm">
            <SelectValue placeholder="Translate" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div id="google_translate_element" className="google-translate-container">
        {!googleLoaded && (
          <span className="text-sm text-muted-foreground">Loading...</span>
        )}
      </div>
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
        .google-translate-container .goog-te-gadget > span {
          display: none !important;
        }
        .google-translate-container .goog-te-gadget-simple .goog-te-menu-value span:first-child {
          display: inline !important;
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate:not(.goog-te-gadget) {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
