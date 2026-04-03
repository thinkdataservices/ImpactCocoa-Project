import { useCallback, useState } from "react";

export type Locale = "en" | "fr";

const STORAGE_KEY = "thinkdata-locale";

export const locales: Locale[] = ["en", "fr"];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
};

export function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(STORAGE_KEY) as Locale) || "en";
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem(STORAGE_KEY, newLocale);
    setLocaleState(newLocale);
  }, []);

  return { locale, setLocale };
}
