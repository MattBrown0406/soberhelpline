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
      // Clear Google Translate cookies to reset to English
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.lovableproject.com";
      // Reload without cache to ensure clean state
      window.location.reload();
    } else {
      // Open Google Translate in new tab for the current page
      const url = `https://translate.google.com/translate?sl=en&tl=${langCode}&u=${encodeURIComponent(window.location.href)}`;
      window.open(url, "_blank");
    }
  };

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
      {/* Hidden element for Google Translate to attach to */}
      <div id="google_translate_element" className="hidden" />
    </div>
  );
}
