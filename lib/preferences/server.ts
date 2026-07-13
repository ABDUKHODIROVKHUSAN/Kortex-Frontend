import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/messages";

const LOCALE_COOKIE = "kortex-locale";

export function getServerLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}
