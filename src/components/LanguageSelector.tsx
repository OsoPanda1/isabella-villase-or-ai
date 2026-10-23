import { useEffect, useState } from "react";

const LANGUAGES = [
  { code: "es", label: "Español", nativeName: "Español" },
  { code: "en", label: "English", nativeName: "English" },
  { code: "pt", label: "Português", nativeName: "Português" },
  { code: "fr", label: "Français", nativeName: "Français" },
  { code: "de", label: "Deutsch", nativeName: "Deutsch" },
  { code: "it", label: "Italiano", nativeName: "Italiano" },
  { code: "zh-CN", label: "中文（简体）", nativeName: "中文" },
  { code: "ja", label: "日本語", nativeName: "日本語" },
  { code: "ko", label: "한국어", nativeName: "한국어" },
  { code: "hi", label: "हिन्दी", nativeName: "हिन्दी" },
  { code: "ar", label: "العربية", nativeName: "العربية" },
  { code: "ru", label: "Русский", nativeName: "Русский" },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]["code"];

type GoogleTranslateInstance = {
  TranslateElement: new (
    options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
    elementId: string,
  ) => unknown;
};

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: GoogleTranslateInstance };
  }
}

const SCRIPT_ID = "isabella-google-translate-script";
const WIDGET_ID = "isabella-google-translate-widget";
const STORAGE_KEY = "isabella-language";

function applyGoogleLanguage(language: LanguageCode): boolean {
  if (language === "es") {
    const reset = document.querySelector<HTMLAnchorElement>(".goog-te-banner-frame");
    reset?.click();
    document.cookie = "googtrans=/es/es; path=/";
    document.cookie = `googtrans=/es/es; path=/; domain=${window.location.hostname}`;
    window.location.reload();
    return true;
  }

  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!select) return false;

  select.value = language;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

export function LanguageSelector() {
  const [language, setLanguage] = useState<LanguageCode>("es");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && LANGUAGES.some((item) => item.code === saved)) {
        setLanguage(saved as LanguageCode);
      }
    } catch {
      // Language selection still works for the current session when storage is unavailable.
    }

    const initialize = () => {
      const TranslateElement = window.google?.translate?.TranslateElement;
      if (!TranslateElement || document.getElementById(WIDGET_ID)?.dataset.initialized) return;
      new TranslateElement(
        {
          pageLanguage: "es",
          includedLanguages: LANGUAGES.filter((item) => item.code !== "es")
            .map((item) => item.code)
            .join(","),
          autoDisplay: false,
        },
        WIDGET_ID,
      );
      const widget = document.getElementById(WIDGET_ID);
      if (widget) widget.dataset.initialized = "true";
      setReady(true);
    };

    window.googleTranslateElementInit = initialize;
    if (window.google?.translate?.TranslateElement) {
      initialize();
    } else if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => setMessage("El servicio de traducción no está disponible. Inténtalo más tarde.");
      document.head.appendChild(script);
    }

    return () => {
      if (window.googleTranslateElementInit === initialize) {
        delete window.googleTranslateElementInit;
      }
    };
  }, []);

  useEffect(() => {
    if (!ready || language === "es") return;
    const apply = () => {
      if (!applyGoogleLanguage(language)) {
        setMessage("El selector de idiomas se está inicializando. Vuelve a intentarlo en unos segundos.");
        return;
      }
      setMessage("");
    };
    apply();
  }, [language, ready]);

  function onLanguageChange(next: string) {
    if (!LANGUAGES.some((item) => item.code === next)) return;
    const selected = next as LanguageCode;
    setLanguage(selected);
    setMessage("");
    try {
      window.localStorage.setItem(STORAGE_KEY, selected);
    } catch {
      // Do not block translation if storage is unavailable.
    }

    if (selected === "es") {
      document.cookie = "googtrans=/es/es; path=/";
      document.cookie = `googtrans=/es/es; path=/; domain=${window.location.hostname}`;
      window.location.reload();
      return;
    }

    if (ready && !applyGoogleLanguage(selected)) {
      setMessage("El servicio está inicializando la traducción. Vuelve a seleccionar el idioma en unos segundos.");
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <label htmlFor="site-language" className="sr-only">Idioma de la plataforma</label>
      <span aria-hidden="true" className="text-primary">文</span>
      <select
        id="site-language"
        value={language}
        onChange={(event) => onLanguageChange(event.target.value)}
        className="min-h-11 max-w-36 border border-primary/30 bg-background px-2 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-primary"
        aria-label="Seleccionar idioma de la plataforma"
        title="Seleccionar idioma"
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code}>{item.nativeName}</option>
        ))}
      </select>
      <div id={WIDGET_ID} className="hidden" aria-hidden="true" />
      {message && <span role="status" className="sr-only">{message}</span>}
    </div>
  );
}
