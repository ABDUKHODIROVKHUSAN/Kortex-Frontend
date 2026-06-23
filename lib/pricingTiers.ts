import type { Session } from "next-auth";

export type PricingTierId = "free" | "pro" | "business";

export interface PricingTier {
  id: PricingTierId;
  name: string;
  price: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
  disabled: boolean;
}

export function getPricingTiers(
  t: (key: string) => string,
  session: Session | null
): PricingTier[] {
  const signedIn = !!session;

  return [
    {
      id: "free",
      name: t("pricing.freeName"),
      price: t("pricing.freePrice"),
      desc: t("pricing.freeDesc"),
      features: [t("pricing.freeF1"), t("pricing.freeF2"), t("pricing.freeF3")],
      cta: signedIn ? t("pricing.ctaOpenWorkspace") : t("nav.signUp"),
      href: signedIn ? "/dashboard" : "/register",
      highlight: false,
      disabled: false,
    },
    {
      id: "pro",
      name: t("pricing.proName"),
      price: t("pricing.proPrice"),
      desc: t("pricing.proDesc"),
      features: [t("pricing.proF1"), t("pricing.proF2"), t("pricing.proF3")],
      cta: signedIn ? t("pricing.ctaUpgrade") : t("pricing.comingSoon"),
      href: "#",
      highlight: true,
      disabled: true,
    },
    {
      id: "business",
      name: t("pricing.businessName"),
      price: t("pricing.businessPrice"),
      desc: t("pricing.businessDesc"),
      features: [
        t("pricing.businessF1"),
        t("pricing.businessF2"),
        t("pricing.businessF3"),
        t("pricing.businessF4"),
      ],
      cta: signedIn ? t("pricing.ctaUpgrade") : t("pricing.comingSoon"),
      href: "#",
      highlight: false,
      disabled: true,
    },
  ];
}
