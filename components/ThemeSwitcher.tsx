"use client";

import { THEMES } from "@/lib/theme/types";
import { useTheme } from "@/lib/theme/context";
import { useTranslation } from "@/lib/i18n/context";
import HeaderDropdown, { DropdownItem } from "@/components/HeaderDropdown";

export default function ThemeSwitcher({
  compact = false,
  utility = false,
}: {
  compact?: boolean;
  utility?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const current = THEMES.find((item) => item.id === theme) ?? THEMES[0];

  if (!compact) {
    return (
      <div className="flex gap-2">
        {THEMES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTheme(item.id)}
            className={`flex flex-1 items-center justify-center rounded-lg border px-3 py-2.5 text-sm transition ${
              theme === item.id
                ? "border-accent-primary/40 bg-accent-primary/10 text-accent-primary"
                : "border-border bg-bg-primary/40 text-text-secondary hover:border-accent-primary/25"
            }`}
          >
            {t(item.labelKey)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <HeaderDropdown
      ariaLabel={t("profile.theme")}
      label={t(current.labelKey)}
      utility={utility}
    >
      {THEMES.map((item) => (
        <DropdownItem
          key={item.id}
          active={theme === item.id}
          onClick={() => setTheme(item.id)}
        >
          <span>{t(item.labelKey)}</span>
        </DropdownItem>
      ))}
    </HeaderDropdown>
  );
}
