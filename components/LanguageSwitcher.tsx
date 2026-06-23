"use client";

import { LOCALES } from "@/lib/i18n/messages";
import { useTranslation } from "@/lib/i18n/context";
import HeaderDropdown, { DropdownItem, FlagCircle } from "@/components/HeaderDropdown";

const LOCALE_CODES: Record<string, string> = {
  en: "EN",
  ko: "KO",
  uz: "UZ",
  ru: "RU",
};

export default function LanguageSwitcher({
  fullWidth = false,
  utility = false,
}: {
  fullWidth?: boolean;
  utility?: boolean;
}) {
  const { locale, setLocale, t } = useTranslation();
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  if (fullWidth) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {LOCALES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${
              locale === l.code
                ? "border-accent-primary/40 bg-accent-primary/10 text-accent-primary"
                : "border-border bg-bg-primary/40 text-text-secondary hover:border-accent-primary/25"
            }`}
          >
            <FlagCircle flag={l.flag} />
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <HeaderDropdown
      ariaLabel={t("profile.language")}
      label={LOCALE_CODES[locale] ?? locale.toUpperCase()}
      utility={utility}
    >
      {LOCALES.map((l) => (
        <DropdownItem
          key={l.code}
          active={locale === l.code}
          onClick={() => setLocale(l.code)}
        >
          <FlagCircle flag={l.flag} />
          <span>{l.label}</span>
        </DropdownItem>
      ))}
    </HeaderDropdown>
  );
}
