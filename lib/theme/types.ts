export type Theme = "dark" | "light";

export const THEMES: { id: Theme; labelKey: string }[] = [
  { id: "dark", labelKey: "theme.dark" },
  { id: "light", labelKey: "theme.light" },
];

export const DEFAULT_THEME: Theme = "dark";
export const THEME_COOKIE = "kortex-theme";

export function isTheme(value: string): value is Theme {
  return value === "dark" || value === "light";
}

/** Maps legacy "night" and unknown values to a valid theme. */
export function normalizeTheme(value: string | undefined): Theme {
  if (value === "light") return "light";
  return "dark";
}
