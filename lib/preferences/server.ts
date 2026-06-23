import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/messages";
import {
  isTheme,
  normalizeTheme,
  THEME_COOKIE,
  type Theme,
} from "@/lib/theme/types";

const LOCALE_COOKIE = "kortex-locale";

export function getServerLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getServerTheme(): Theme {
  const value = cookies().get(THEME_COOKIE)?.value;
  if (value && isTheme(value)) return value;
  return normalizeTheme(value);
}
