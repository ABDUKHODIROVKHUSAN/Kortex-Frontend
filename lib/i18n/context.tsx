"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setClientCookie } from "@/lib/cookies";
import {
  DEFAULT_LOCALE,
  isLocale,
  messages,
  type Locale,
  type Messages,
} from "./messages";

const STORAGE_KEY = "kortex-locale";
const LOCALE_COOKIE = "kortex-locale";

type TranslationValues = Record<string, string | number>;

function getNested(obj: Messages, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

function interpolate(text: string, values?: TranslationValues) {
  if (!values) return text;
  return text.replace(/\{(\w+)\}/g, (_, key) =>
    values[key] !== undefined ? String(values[key]) : `{${key}}`
  );
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: TranslationValues) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    setClientCookie(LOCALE_COOKIE, locale);
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    if (isLocale(next)) setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: string, values?: TranslationValues) => {
      const text = getNested(messages[locale], key);
      return interpolate(text, values);
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within LocaleProvider");
  }
  return ctx;
}
