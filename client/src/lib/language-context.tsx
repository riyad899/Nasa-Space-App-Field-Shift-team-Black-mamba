"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  DICTIONARY,
  Language,
  LOCATION_NAMES,
  CROP_NAMES,
  PRIORITY_NAMES,
  TERM_MAP,
  MONTH_NAMES,
} from "./translations/dictionaries";
import { translateToBengali, translateToBengaliSync } from "./translations/translator";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof DICTIONARY.EN, fallback?: string) => string;
  locName: (location: string) => string;
  cropName: (crop: string) => string;
  priorityName: (priority: string) => string;
  termName: (term: string) => string;
  monthName: (month: string) => string;
  translateDynamic: (text: string) => Promise<string>;
  translateDynamicSync: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "fieldshift_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default language is English ("EN") as requested
  const [lang, setLangState] = useState<Language>("EN");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored === "EN" || stored === "BN") {
        setLangState(stored);
      }
    } catch {
      // LocalStorage access might fail in private browsing
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: keyof typeof DICTIONARY.EN, fallback?: string): string => {
      const currentDict = DICTIONARY[lang] || DICTIONARY.EN;
      const val = (currentDict as any)[key];
      if (val) return val;
      return fallback || (DICTIONARY.EN as any)[key] || (key as string);
    },
    [lang]
  );

  const locName = useCallback(
    (location: string): string => {
      if (!location) return "";
      const mapped = LOCATION_NAMES[location];
      if (mapped) {
        return lang === "BN" ? mapped.bn : mapped.en;
      }
      return location;
    },
    [lang]
  );

  const cropName = useCallback(
    (crop: string): string => {
      if (!crop) return "";
      const mapped = CROP_NAMES[crop] || CROP_NAMES[crop.toLowerCase()];
      if (mapped) {
        return lang === "BN" ? mapped.bn : mapped.en;
      }
      return crop;
    },
    [lang]
  );

  const priorityName = useCallback(
    (priority: string): string => {
      if (!priority) return "";
      const mapped = PRIORITY_NAMES[priority];
      if (mapped) {
        return lang === "BN" ? mapped.bn : mapped.en;
      }
      return priority;
    },
    [lang]
  );

  const termName = useCallback(
    (term: string): string => {
      if (!term) return "";
      const mapped = TERM_MAP[term] || TERM_MAP[term.toLowerCase()];
      if (mapped) {
        return lang === "BN" ? mapped.bn : mapped.en;
      }
      return term;
    },
    [lang]
  );

  const monthName = useCallback(
    (m: string): string => {
      if (!m) return "";
      const mapped = MONTH_NAMES[m];
      if (mapped) {
        return lang === "BN" ? mapped.bn : mapped.en;
      }
      return m;
    },
    [lang]
  );

  const translateDynamic = useCallback(
    async (text: string): Promise<string> => {
      if (lang === "EN" || !text) return text;
      return translateToBengali(text);
    },
    [lang]
  );

  const translateDynamicSync = useCallback(
    (text: string): string => {
      if (lang === "EN" || !text) return text;
      return translateToBengaliSync(text);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
        locName,
        cropName,
        priorityName,
        termName,
        monthName,
        translateDynamic,
        translateDynamicSync,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
